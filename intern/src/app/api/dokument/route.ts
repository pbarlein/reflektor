import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { arkSkjema, deleneI, lesArk } from "@/content/arktype";
import { byggInstruks, byggRettelse, malFraSlug } from "@/content/maler";
import { hentBruker } from "@/lib/tilgang";

/**
 * Dokumentgeneratoren.
 *
 * ── SERVEREN BYGGER INSTRUKSEN, IKKE KLIENTEN ─────────────────────────────
 *
 * Ruta tar imot en mal-slug, de utfylte feltene, og — ved en rettelse —
 * dokumentet slik det står pluss én setning om hva som skal endres. ALDRI
 * en ferdig prompt. Tok den imot fri tekst som instruks, ville enhver
 * innlogget ansatt hatt en åpen kanal til Reflektors API-nøkkel.
 *
 * Rettelsen er fri tekst, og det er den eneste. Den havner i en avgrenset
 * bolk nederst i en instruks serveren har bygget, med et tak på lengden.
 * Dokumentet som sendes med, valideres mot skjemaet før det får komme inn
 * igjen — se `lesArk`.
 *
 * ── SVARET ER STRUKTUR, IKKE TEKST ────────────────────────────────────────
 *
 * Claude svarer gjennom et verktøy med `input_schema`, ikke med markdown.
 * Grunnen står i arktype.ts: markdown ble fire sider. Oppsettet er vårt, og
 * Claude fyller ut delene.
 *
 * ── HVA SOM STRØMMES ──────────────────────────────────────────────────────
 *
 * Ikke teksten. Én NDJSON-linje per hendelse:
 *
 *   {"fremdrift": 3}   — så mange deler er ferdig utfylt
 *   {"ark": {...}}     — det ferdige dokumentet
 *   {"feil": "..."}    — noe gikk galt, på norsk
 *
 * Fremdriften telles ut av det halvferdige JSON-et som kommer inn. Den er
 * målt, ikke simulert: en falsk framdriftslinje som står stille på 80 %
 * mens noe henger, er verre enn ingen.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELL = "claude-opus-5";
const MAKS_TOKENS = 12_000;
const FELTGRENSE = 4_000;
const RETTELSEGRENSE = 1_500;
const INSTRUKSGRENSE = 32_000;

const VERKTOY = "lever_dokument";

export async function POST(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  if (!bruker) {
    return NextResponse.json({ feil: "ikke-innlogget" }, { status: 401 });
  }

  const nokkel = process.env.ANTHROPIC_API_KEY;
  if (!nokkel) {
    return NextResponse.json({ feil: "mangler-nokkel" }, { status: 503 });
  }

  let kropp: unknown;
  try {
    kropp = await foresporsel.json();
  } catch {
    return NextResponse.json({ feil: "ugyldig-kropp" }, { status: 400 });
  }

  const {
    mal: slug,
    verdier,
    forrige,
    rettelse,
  } = (kropp ?? {}) as Record<string, unknown>;

  const mal = typeof slug === "string" ? malFraSlug(slug) : undefined;
  if (!mal) {
    return NextResponse.json({ feil: "ukjent-mal" }, { status: 400 });
  }

  /* Bare feltene malen kjenner, bare strenger, bare så lange som grensen. */
  const rene: Record<string, string> = {};
  if (verdier && typeof verdier === "object") {
    for (const felt of mal.felt) {
      const v = (verdier as Record<string, unknown>)[felt.id];
      if (typeof v === "string" && v.trim()) {
        rene[felt.id] = v.trim().slice(0, FELTGRENSE);
      }
    }
  }

  /*
   * En rettelse krever BEGGE deler. Kommer det en rettelse uten et gyldig
   * dokument å rette, er det en ny generering — ikke en halv en.
   */
  const forrigeArk = forrige ? lesArk(forrige, mal) : null;
  const tekstRettelse =
    typeof rettelse === "string" ? rettelse.trim().slice(0, RETTELSEGRENSE) : "";

  const instruks =
    forrigeArk && tekstRettelse
      ? byggRettelse(mal, rene, forrigeArk, tekstRettelse)
      : byggInstruks(mal, rene);

  if (instruks.length > INSTRUKSGRENSE) {
    return NextResponse.json({ feil: "for-lang" }, { status: 413 });
  }

  const klient = new Anthropic({ apiKey: nokkel });
  const antallDeler = deleneI(mal).length;

  const strom = klient.messages.stream({
    model: MODELL,
    max_tokens: MAKS_TOKENS,
    thinking: { type: "adaptive" },
    system:
      "Du fyller ut produksjonsdokumenter på norsk for Reflektor AS. Du svarer alltid ved å kalle verktøyet, aldri med vanlig tekst.",
    tools: [
      {
        name: VERKTOY,
        description:
          "Leverer det ferdige dokumentet som struktur. Kalles nøyaktig én gang.",
        input_schema: arkSkjema(mal) as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: VERKTOY },
    messages: [{ role: "user", content: instruks }],
  });

  const koder = new TextEncoder();
  const ut = new ReadableStream<Uint8Array>({
    async start(kontroller) {
      const send = (o: unknown) =>
        kontroller.enqueue(koder.encode(`${JSON.stringify(o)}\n`));

      try {
        let rå = "";
        let sist = -1;

        for await (const h of strom) {
          if (
            h.type === "content_block_delta" &&
            h.delta.type === "input_json_delta"
          ) {
            rå += h.delta.partial_json;
            /*
             * Hver ferdig del har skrevet sin egen `"type":`. Å telle dem
             * er en billig og ærlig måling av hvor langt Claude har kommet,
             * uten å måtte tolke halvferdig JSON.
             */
            const ferdige = Math.min(
              (rå.match(/"type"\s*:/g) ?? []).length,
              antallDeler,
            );
            if (ferdige !== sist) {
              sist = ferdige;
              send({ fremdrift: ferdige, av: antallDeler });
            }
          }
        }

        const ferdig = await strom.finalMessage();

        if (ferdig.stop_reason === "refusal") {
          send({ feil: "Claude avslo å skrive dette. Se over feltene." });
          return kontroller.close();
        }

        const bruk = ferdig.content.find((b) => b.type === "tool_use");
        const ark = bruk ? lesArk(bruk.input, mal) : null;

        if (!ark) {
          send({
            feil:
              ferdig.stop_reason === "max_tokens"
                ? "Svaret ble for langt og stoppet midtveis. Kort ned de lange feltene og prøv igjen."
                : "Claude svarte i et format vi ikke kunne lese. Prøv igjen.",
          });
          return kontroller.close();
        }

        send({ ark });
        kontroller.close();
      } catch (e) {
        /*
         * Feilen kommer i en strøm som allerede er begynt, så den kan ikke
         * bli en 500. Den sendes som en linje klienten kan vise.
         */
        send({
          feil:
            e instanceof Anthropic.AuthenticationError
              ? "API-nøkkelen ble ikke godtatt. Sjekk ANTHROPIC_API_KEY i Vercel."
              : e instanceof Anthropic.RateLimitError
                ? "For mange forespørsler akkurat nå. Vent et minutt og prøv igjen."
                : e instanceof Anthropic.APIError
                  ? `Feil fra API-et (${e.status}). Prøv igjen.`
                  : "Noe gikk galt underveis. Prøv igjen.",
        });
        kontroller.close();
      }
    },
    cancel() {
      strom.abort();
    },
  });

  return new NextResponse(ut, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
