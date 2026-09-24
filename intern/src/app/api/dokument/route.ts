import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { arkSkjema, deleneI, lesArk } from "@/content/arktype";
import { briefTilTekst, type Brief } from "@/content/brieftype";
import { byggInstruks, byggRettelse, malFraSlug } from "@/content/maler";
import {
  lesResearch,
  researchTilTekst,
  type Research,
} from "@/content/researchtype";
import {
  ferskNok,
  hentKunde,
  husKunde,
  husRettelse,
} from "@/lib/hukommelse";
import { kjorBrief } from "@/lib/brief";
import { sokEpost } from "@/lib/gmail";
import { kjorResearch } from "@/lib/research";
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
 *   {"fase": "research"}   — undersøker kunden
 *   {"sok": "..."}         — dette søkes det på nå
 *   {"research": {...}}    — det som ble funnet, med kilder
 *   {"fase": "epost"}      — leser e-post med kunden
 *   {"brief": {...}}       — det som sto i e-posten, med hvilke meldinger
 *   {"fase": "skriver"}    — dokumentet skrives
 *   {"fremdrift": 3}       — så mange deler er ferdig utfylt
 *   {"ark": {...}}         — det ferdige dokumentet
 *   {"feil": "..."}        — noe gikk galt, på norsk
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

/*
 * ── HVORFOR TAKET ER SÅ LAVT ──────────────────────────────────────────────
 *
 * API-et tar imot 32 MB. Vercel gjør det ikke: en serverless-funksjon
 * avviser forespørsler over 4,5 MB, og base64 gjør en fil en tredjedel
 * større. 2,5 MB rå PDF blir omtrent 3,4 MB på tråden, og det er innenfor
 * med margin.
 *
 * Til sammenligning er produksjonsplanen for Jordbærpikene 113 kB. Taket
 * treffer i praksis bare filer som er skannet i stedet for eksportert.
 */
const FILGRENSE = 2_500_000;

/*
 * ── BILDER I EN RETTELSE ──────────────────────────────────────────────────
 *
 * «Sånn skal tabellen se ut» med et skjermbilde ved siden av er raskere, og
 * presist på en måte ord sjelden er. Taket er lavere enn for PDF-en, og det
 * er fire av dem: et skjermbilde fra en Mac er 300–800 kB, og fire av dem
 * pluss instruksen ligger godt innenfor Vercels 4,5 MB.
 */
const MAKS_BILDER = 4;
const BILDEGRENSE = 1_500_000;
const BILDETYPER = ["image/png", "image/jpeg", "image/webp", "image/gif"];

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
    fil,
    research: tidligereResearch,
    friskResearch,
    bilder,
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

  /*
   * VEDLEGGET SLIPPES BARE INN DER MALEN BER OM DET.
   *
   * `opplasting` på malen er tillatelsen. Uten den kan ingen bruke ruta til
   * å sende vilkårlige PDF-er gjennom Reflektors API-nøkkel.
   */
  let vedlegg: string | null = null;
  if (mal.opplasting && fil && typeof fil === "object") {
    const f = fil as Record<string, unknown>;
    if (typeof f.data !== "string" || f.type !== "application/pdf") {
      return NextResponse.json({ feil: "ugyldig-fil" }, { status: 400 });
    }
    /* Base64 er 4 tegn per 3 byte. Vi måler på råstørrelsen. */
    if ((f.data.length * 3) / 4 > FILGRENSE) {
      return NextResponse.json({ feil: "fil-for-stor" }, { status: 413 });
    }
    vedlegg = f.data;
  }

  /*
   * Bilder følger bare med en rettelse. Et bilde uten en setning om hva det
   * viser, er en gåte — og en førstegangs generering har skjemaet til å si
   * det samme tydeligere.
   */
  const rensedeBilder: { type: string; data: string }[] = [];
  if (Array.isArray(bilder) && tekstRettelse) {
    for (const b of bilder.slice(0, MAKS_BILDER)) {
      if (!b || typeof b !== "object") continue;
      const o = b as Record<string, unknown>;
      if (typeof o.type !== "string" || !BILDETYPER.includes(o.type)) continue;
      if (typeof o.data !== "string") continue;
      if ((o.data.length * 3) / 4 > BILDEGRENSE) {
        return NextResponse.json({ feil: "bilde-for-stort" }, { status: 413 });
      }
      rensedeBilder.push({ type: o.type, data: o.data });
    }
  }

  const klient = new Anthropic({ apiKey: nokkel });
  const antallDeler = deleneI(mal).length;

  /*
   * RESEARCHEN GJENBRUKES NÅR KLIENTEN HAR DEN.
   *
   * En rettelse skal ikke slå opp bedriften på nytt. Klienten sender
   * derfor tilbake researchen fra forrige runde, og den valideres på vei
   * inn — den har vært utenfor huset, akkurat som arket.
   */
  const gjenbrukt = tidligereResearch ? lesResearch(tidligereResearch) : null;
  const research: Research | null = gjenbrukt
    ? { ...gjenbrukt, hentet: new Date().toISOString() }
    : null;

  const koder = new TextEncoder();
  /* Brukeren lukket fanen: begge fasene skal stoppe. */
  const stopp = new AbortController();

  const ut = new ReadableStream<Uint8Array>({
    async start(kontroller) {
      const send = (o: unknown) =>
        kontroller.enqueue(koder.encode(`${JSON.stringify(o)}\n`));

      try {
        /*
         * ── FASE 1: FINN UT HVEM KUNDEN ER ────────────────────────────────
         *
         * Hoppes over når klienten allerede har researchen, og når vi ikke
         * vet hvem kunden er. Uten et navn er det ingenting å slå opp, og
         * et søk på ingenting koster penger og gir støy.
         */
        let brukt = research;
        const kunde = (rene.kunde ?? "").trim();
        const ferskBestilt = friskResearch === true;

        /*
         * HUKOMMELSEN FØRST.
         *
         * Researchen koster søk og tjue sekunder. Det Jordbærpikene driver
         * med, endrer seg ikke mellom en produksjonsplan i oktober og en
         * opptaksliste i november. Er den lagret og fersk, brukes den —
         * med mindre produsenten uttrykkelig har bedt om en ny.
         */
        if (!brukt && kunde && !ferskBestilt) {
          const minne = await hentKunde(kunde);
          if (minne?.research && ferskNok(minne.research)) {
            brukt = minne.research;
            send({ research: brukt, fra: "hukommelse" });
          }
        }

        if (!brukt && kunde) {
          send({ fase: "research" });
          brukt = await kjorResearch({
            klient,
            mal,
            kunde,
            lokasjon: (rene.lokasjon ?? "").trim(),
            påSøk: (q) => send({ sok: q }),
            signal: stopp.signal,
          });
          /*
           * En research som feiler skal ikke stoppe dokumentet. Den er et
           * bedre grunnlag, ikke en forutsetning — og en produsent som
           * står og venter, er bedre tjent med et dokument uten research
           * enn med en feilmelding.
           */
          if (brukt) {
            send({ research: brukt });
            /* Lagringen skal aldri stoppe dokumentet. */
            void husKunde(kunde, { research: brukt });
          }
        }

        /*
         * ── FASE 2: LES E-POSTEN MED KUNDEN ───────────────────────────────
         *
         * Kjøres hver gang, også ved rettelser: en brief som kom i går skal
         * ikke bli borte bak en research fra forrige måned. Har brukeren
         * ikke gitt Gmail-tilgang, gir `sokEpost` tom liste og steget
         * hoppes over uten at noe sies om det.
         */
        let brief: Brief | null = null;
        if (kunde) {
          const poster = await sokEpost(bruker.epost, kunde, stopp.signal);
          if (poster.length) {
            send({ fase: "epost" });
            brief = await kjorBrief({
              klient,
              mal,
              kunde,
              poster,
              signal: stopp.signal,
            });
            if (brief) send({ brief });
          }
        }

        // ── FASE 3: SKRIV DOKUMENTET ─────────────────────────────────────
        const instruks =
          forrigeArk && tekstRettelse
            ? byggRettelse(
                mal,
                rene,
                forrigeArk,
                tekstRettelse,
                vedlegg !== null,
                [
                  brukt ? researchTilTekst(brukt) : "",
                  brief ? briefTilTekst(brief) : "",
                ]
                  .filter(Boolean)
                  .join("\n\n"),
              )
            : byggInstruks(
                mal,
                rene,
                vedlegg !== null,
                [
                  brukt ? researchTilTekst(brukt) : "",
                  brief ? briefTilTekst(brief) : "",
                ]
                  .filter(Boolean)
                  .join("\n\n"),
              );

        if (instruks.length > INSTRUKSGRENSE) {
          send({ feil: "Skjemaet er for langt. Kort ned de lange feltene." });
          return kontroller.close();
        }

        send({ fase: "skriver" });

        const strom = klient.messages.stream(
          {
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
            messages: [
              {
                role: "user",
                /*
                 * Vedlegg og bilder FØR teksten. Rekkefølgen er dokumentert
                 * i API-et: et vedlegg som kommer etter instruksen, leses
                 * som et tillegg til den i stedet for som grunnlaget den
                 * viser til.
                 */
                content:
                  vedlegg || rensedeBilder.length
                    ? [
                        ...(vedlegg
                          ? [
                              {
                                type: "document" as const,
                                source: {
                                  type: "base64" as const,
                                  media_type: "application/pdf" as const,
                                  data: vedlegg,
                                },
                              },
                            ]
                          : []),
                        ...rensedeBilder.map((b) => ({
                          type: "image" as const,
                          source: {
                            type: "base64" as const,
                            media_type:
                              b.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
                            data: b.data,
                          },
                        })),
                        { type: "text" as const, text: instruks },
                      ]
                    : instruks,
              },
            ],
          },
          { signal: stopp.signal },
        );

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
             * er en billig og ærlig måling av hvor langt Claude har
             * kommet, uten å måtte tolke halvferdig JSON.
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

        /*
         * Etter at dokumentet er sendt, ikke før. Hukommelsen er et
         * biprodukt, og produsenten skal ikke vente på den.
         */
        if (kunde) void husKunde(kunde, { dokument: mal.slug });
        if (tekstRettelse) void husRettelse(mal.slug, tekstRettelse);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
          return kontroller.close();
        }
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
      stopp.abort();
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
