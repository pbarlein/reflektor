import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { byggInstruks, malFraSlug } from "@/content/maler";
import { hentBruker } from "@/lib/tilgang";

/**
 * Dokumentgeneratoren.
 *
 * ── SERVEREN BYGGER INSTRUKSEN, IKKE KLIENTEN ─────────────────────────────
 *
 * Ruta tar imot en mal-slug og de utfylte feltene — ALDRI en ferdig prompt.
 * Tok den imot fri tekst, ville enhver innlogget ansatt hatt en åpen kanal
 * til Reflektors API-nøkkel, til hva som helst. Nå er det bare de åtte
 * malene som kan kjøres, med feltene malen selv definerer.
 *
 * Ukjente feltnøkler kastes. Det koster ingenting å være streng her.
 *
 * ── KOSTNADEN ER BUNDET I BEGGE ENDER ─────────────────────────────────────
 *
 * Inn: hvert felt kappes på FELTGRENSE tegn, og instruksen samlet på
 * INSTRUKSGRENSE. Ut: `max_tokens`. En ansatt som limer inn en hel e-posttråd
 * i et tekstfelt, skal ikke kunne gjøre én knapp til en stor regning.
 *
 * ── STREAMING, IKKE ETT SVAR ──────────────────────────────────────────────
 *
 * Et dokument tar titalls sekunder å skrive. Uten streaming ville brukeren
 * sett en spinner uten framdrift, og serverless-plattformen kunne kuttet
 * forbindelsen før svaret var ferdig. Vi sender teksten videre fortløpende.
 */

export const runtime = "nodejs";
/** Dokumentene er alltid ferske. Ingenting her skal mellomlagres. */
export const dynamic = "force-dynamic";

const MODELL = "claude-opus-5";
const MAKS_TOKENS = 20_000;
const FELTGRENSE = 4_000;
const INSTRUKSGRENSE = 24_000;

export async function POST(foresporsel: NextRequest) {
  /*
   * INNLOGGING FØRST, FØR NOE ANNET. Proxy-laget slipper /api/* forbi for
   * innloggingsflyten sin del, så denne ruta må sjekke selv. Se
   * src/proxy.ts og src/lib/tilgang.ts.
   */
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

  const { mal: slug, verdier } = (kropp ?? {}) as {
    mal?: unknown;
    verdier?: unknown;
  };

  const mal = typeof slug === "string" ? malFraSlug(slug) : undefined;
  if (!mal) {
    return NextResponse.json({ feil: "ukjent-mal" }, { status: 400 });
  }

  /*
   * Bare feltene malen kjenner, bare strenger, og bare så lange som
   * FELTGRENSE. Alt annet fra klienten er uinteressant.
   */
  const rene: Record<string, string> = {};
  if (verdier && typeof verdier === "object") {
    for (const felt of mal.felt) {
      const v = (verdier as Record<string, unknown>)[felt.id];
      if (typeof v === "string" && v.trim()) {
        rene[felt.id] = v.trim().slice(0, FELTGRENSE);
      }
    }
  }

  const instruks = byggInstruks(mal, rene);
  if (instruks.length > INSTRUKSGRENSE) {
    return NextResponse.json({ feil: "for-lang" }, { status: 413 });
  }

  const klient = new Anthropic({ apiKey: nokkel });

  const strom = klient.messages.stream({
    model: MODELL,
    max_tokens: MAKS_TOKENS,
    /*
     * Adaptiv tenkning, men uten å sende resonnementet til klienten.
     * Dokumentet er det leseren skal se; tankerekken ville bare vært støy
     * i en tekstboks som fylles ut mens man ser på.
     */
    thinking: { type: "adaptive" },
    system:
      "Du skriver ferdige dokumenter på norsk for Reflektor AS. Svar med selve dokumentet i Markdown — ingen innledning, ingen forklaring etterpå, ingen kodeblokk rundt.",
    messages: [{ role: "user", content: instruks }],
  });

  const koder = new TextEncoder();
  const kropp2 = new ReadableStream<Uint8Array>({
    async start(kontroller) {
      try {
        for await (const hendelse of strom) {
          if (
            hendelse.type === "content_block_delta" &&
            hendelse.delta.type === "text_delta"
          ) {
            kontroller.enqueue(koder.encode(hendelse.delta.text));
          }
        }

        /*
         * `stop_reason` sjekkes ETTER strømmen. En avvisning eller et
         * kuttet svar kommer ikke som en kastet feil — den kommer som et
         * dokument som bare slutter midt i en setning, og det er verre enn
         * en tydelig beskjed.
         */
        const ferdig = await strom.finalMessage();
        if (ferdig.stop_reason === "max_tokens") {
          kontroller.enqueue(
            koder.encode(
              "\n\n---\n\n**Dokumentet ble kuttet fordi det ble for langt.** Kort ned de lange feltene i skjemaet og prøv igjen.",
            ),
          );
        } else if (ferdig.stop_reason === "refusal") {
          kontroller.enqueue(
            koder.encode(
              "\n\n---\n\n**Claude avslo å skrive dette.** Se over hva som står i feltene.",
            ),
          );
        }
        kontroller.close();
      } catch (e) {
        /*
         * Feilen kommer midt i en strøm som allerede er begynt, så den kan
         * ikke bli en 500. Den skrives inn i teksten, der brukeren faktisk
         * ser den.
         */
        const melding =
          e instanceof Anthropic.AuthenticationError
            ? "API-nøkkelen ble ikke godtatt. Sjekk ANTHROPIC_API_KEY i Vercel."
            : e instanceof Anthropic.RateLimitError
              ? "For mange forespørsler akkurat nå. Vent et minutt og prøv igjen."
              : e instanceof Anthropic.APIError
                ? `Feil fra API-et (${e.status}). Prøv igjen.`
                : "Noe gikk galt underveis. Prøv igjen.";
        kontroller.enqueue(koder.encode(`\n\n---\n\n**${melding}**`));
        kontroller.close();
      }
    },
    cancel() {
      // Brukeren lukket fanen eller trykket avbryt. Da skal vi slutte å betale.
      strom.abort();
    },
  });

  return new NextResponse(kropp2, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      // Slår av mellomlagring i proxyer som ellers ville holdt igjen strømmen.
      "X-Accel-Buffering": "no",
    },
  });
}
