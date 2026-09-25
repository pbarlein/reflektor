import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { arkSkjema, deleneI, lesArk, lesSvar } from "@/content/arktype";
import { briefTilTekst, type Brief } from "@/content/brieftype";
import { byggInstruks, byggRettelse, malFraSlug } from "@/content/maler";
import {
  lesResearch,
  researchTilTekst,
  type Research,
} from "@/content/researchtype";
import { ferskNok, hentKunde, husKunde, husRettelse } from "@/lib/hukommelse";
import { kjorBrief } from "@/lib/brief";
import { sokEpost } from "@/lib/gmail";
import { kjorResearch } from "@/lib/research";
import {
  hentPublisering,
  publiseringTilTekst,
  rensBrukernavn,
  type Publisering,
} from "@/lib/supermetrics";
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
 *   {"fase": "epost"}      — leser e-post med kunden, henter tall
 *   {"brief": {...}}       — det som sto i e-posten, med hvilke meldinger
 *   {"publisering": {...}} — hva kunden og konkurrentene faktisk publiserer
 *   {"fase": "research"}   — undersøker kunden
 *   {"sok": "..."}         — dette søkes det på nå
 *   {"research": {...}}    — det som ble funnet, med kilder
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
/*
 * Så mange tidligere rettelser følger med som stående instrukser. Ti runder
 * er allerede et dokument som burde vært startet på nytt, og taket holder
 * instruksen innenfor INSTRUKSGRENSE uansett hvor lenge noen holder på.
 */
const MAKS_TIDLIGERE = 10;
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

/**
 * Tom saldo hos Anthropic.
 *
 * Kommer som 400 invalid_request_error, altså i samme kategori som «du
 * sendte noe ugyldig» — og SDK-en har ingen egen feilklasse for den. Uten
 * dette oppslaget ser en tom konto ut som en programfeil, og produsenten
 * prøver igjen til hen gir opp.
 */
function erTomSaldo(e: unknown): boolean {
  return (
    e instanceof Anthropic.APIError &&
    e.status === 400 &&
    /credit balance is too low/i.test(String(e.message))
  );
}

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
    rettelser: forrigeRettelser,
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
    typeof rettelse === "string"
      ? rettelse.trim().slice(0, RETTELSEGRENSE)
      : "";

  /*
   * De tidligere rettelsene, fra klienten og derfor uten tillit. Samme
   * behandling som den nye: samme lengdetak per rettelse, og et tak på
   * antallet, slik at en klient ikke kan blåse opp instruksen med hundre
   * runder som aldri fant sted.
   */
  const tidligereRettelser = Array.isArray(forrigeRettelser)
    ? forrigeRettelser
        .filter((r): r is string => typeof r === "string")
        .map((r) => r.trim().slice(0, RETTELSEGRENSE))
        .filter(Boolean)
        .slice(-MAKS_TIDLIGERE)
    : [];

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
         * ── REKKEFØLGEN BLE SNUDD 24.09.2026 ──────────────────────────────
         *
         * Før: research på nettet, så e-post, så skriv. Det ga en research
         * som ikke visste hva kunden selv hadde sagt, og som ikke hadde
         * sett et eneste innlegg de faktisk hadde publisert.
         *
         * Nå ligger e-posten og publiseringstallene først, og begge går
         * inn i researchen. Da søker den på det den ikke allerede vet, og
         * den kan bygge på målte tall i stedet for på «om oss»-siden.
         */
        const kunde = (rene.kunde ?? "").trim();
        const ferskBestilt = friskResearch === true;
        let brukt = research;

        /*
         * ── FASE 1: E-POST OG TALL, SAMTIDIG ──────────────────────────────
         *
         * De to har ingenting med hverandre å gjøre, og begge tar tid.
         * Etter hverandre er de tjue sekunder; samtidig er de tolv.
         */
        let brief: Brief | null = null;
        let publisering: Publisering | null = null;

        if (kunde) {
          send({ fase: "epost" });

          /*
           * Kontoene produsenten har oppgitt. Er feltene tomme, gir
           * `hentPublisering` null og researchen kjører uten tall — det er
           * en tynnere research, ikke en feil.
           */
          const konkurrenter = (rene.konkurrenter ?? "")
            .split(/[,;\n]/)
            .map(rensBrukernavn)
            .filter(Boolean);

          const [poster, tall] = await Promise.all([
            sokEpost(bruker.epost, kunde, stopp.signal),
            hentPublisering({
              kunde: rene.instagram ?? "",
              konkurrenter,
              signal: stopp.signal,
            }),
          ]);

          publisering = tall;
          if (publisering) send({ publisering });

          if (poster.length) {
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

        /*
         * STRATEGIEN: FELTET FØRST, E-POSTEN ETTER.
         *
         * Har produsenten limt inn lenken, er det den som gjelder — hen har
         * sett begge deler og valgt. Er feltet tomt, brukes den Claude fant
         * i e-posten, som er hele grunnen til at den letes etter.
         */
        const strategi =
          (rene.somestrategi ?? "").trim() || (brief?.strategi ?? "");

        /*
         * ── FASE 2: FINN UT HVEM KUNDEN ER ────────────────────────────────
         *
         * Hoppes over når klienten allerede har researchen, og når vi ikke
         * vet hvem kunden er. Uten et navn er det ingenting å slå opp, og
         * et søk på ingenting koster penger og gir støy.
         *
         * HUKOMMELSEN FØRST. Researchen koster søk og tjue sekunder. Det
         * Jordbærpikene driver med, endrer seg ikke mellom en
         * produksjonsplan i oktober og en opptaksliste i november. Er den
         * lagret og fersk, brukes den — med mindre produsenten uttrykkelig
         * har bedt om en ny.
         */
        if (!brukt && kunde && !ferskBestilt) {
          const minne = await hentKunde(kunde);
          /*
           * Lagret research har vært utenfor huset, akkurat som arket og
           * researchen klienten sender tilbake. Den valideres på vei inn —
           * et minne lagret før `virkemidler` fantes, mangler feltet.
           */
          const lest = minne?.research ? lesResearch(minne.research) : null;
          if (lest && minne?.research && ferskNok(minne.research)) {
            brukt = { ...lest, hentet: minne.research.hentet };
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
            publisering: publisering ? publiseringTilTekst(publisering) : "",
            strategi,
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
         * Grunnlaget, i den rekkefølgen det skal veie.
         *
         * Publiseringstallene er målte og står først. Researchen er
         * slutninger fra dem pluss noen søk. E-posten er kundens egne ord,
         * og den står sist fordi det som står sist, blir lest sist — og
         * `briefTilTekst` sier selv at den veier tyngst av alt.
         */
        const grunnlaget = () =>
          [
            publisering ? publiseringTilTekst(publisering, true) : "",
            brukt ? researchTilTekst(brukt) : "",
            brief ? briefTilTekst(brief) : "",
          ]
            .filter(Boolean)
            .join("\n\n");

        // ── FASE 3: SKRIV DOKUMENTET ─────────────────────────────────────
        const instruks =
          forrigeArk && tekstRettelse
            ? byggRettelse(
                mal,
                rene,
                forrigeArk,
                tekstRettelse,
                vedlegg !== null,
                grunnlaget(),
                tidligereRettelser,
              )
            : byggInstruks(mal, rene, vedlegg !== null, grunnlaget());

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
                            media_type: b.type as
                              | "image/png"
                              | "image/jpeg"
                              | "image/webp"
                              | "image/gif",
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

        /*
         * Svaret går som sin egen hendelse, og FØR arket. Klienten setter
         * arket sist fordi det er det som utløser rullingen ned til
         * resultatet — da står beskjeden allerede der når produsenten
         * kommer fram.
         */
        send({ svar: lesSvar(bruk?.input) });
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
                : /*
                   * ── «PRØV IGJEN» ER FEIL SVAR PÅ TOM SALDO ──────────────
                   *
                   * 25.09.2026 fikk en produsent «Feil fra API-et (400).
                   * Prøv igjen.» seks ganger på rad. Det var tom saldo hos
                   * Anthropic, og ingen mengde forsøk kunne løst det.
                   * Meldingen sendte hen i en løkke i stedet for til
                   * riktig sted.
                   */
                  erTomSaldo(e)
                  ? "Kontoen hos Anthropic er tom for kreditt. Fyll på under Plans & Billing — det hjelper ikke å prøve igjen."
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
