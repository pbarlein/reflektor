import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { norskTidspunkt } from "@/lib/rapportformat";
import {
  hentIndeks,
  hentRapport,
  leggTilNotat,
  settSteg,
  svarPaaBeslutning,
} from "@/lib/rapportlager";
import { byggMarkdown } from "@/lib/rapportmarkdown";
import {
  hentSamtale,
  lagreSamtale,
  type Melding,
  slettSamtale,
} from "@/lib/samtalelager";
import {
  type Verktoykontekst,
  VERKTOY,
  kjorVerktoy,
} from "@/lib/samtaleverktoy";
import { erRapportleser } from "@/lib/rapporttilgang";
import { hentBruker } from "@/lib/tilgang";

/**
 * Samtalen om én rapport.
 *
 * ── HVORFOR DEN LIGGER I RAPPORTEN OG IKKE I EN EGEN FANE ─────────────────
 *
 * Bestilt 08.10.2026: en samtaleboks under stegene, der man kan gi
 * kommandoer og få svar. Poenget er nærheten: spørsmålet «hvorfor er
 * prisen per lead oppe igjen» stilles mens man ser tallet, og svaret
 * havner samme sted som stegene det handler om.
 *
 * ── MODELLEN HAR RAPPORTEN, IKKE EN LENKE TIL DEN ─────────────────────────
 *
 * Systeminstruksen bærer hele rapporten som Markdown — nøyaktig den samme
 * teksten nedlastingsknappen lager. Det er ikke tilfeldig: den filen ble
 * skrevet for å gi en språkmodell kontekst, og da skal samtalen bruke den
 * i stedet for en egen variant som kan komme i utakt.
 *
 * ── HVA «KOBLING TIL CLAUDE-PROSJEKTET» FAKTISK KAN BETY ──────────────────
 *
 * Et prosjekt på claude.ai er en funksjon i den nettsiden. Det finnes
 * ingen API for å lese kunnskapsbasen i et prosjekt, og derfor kan ikke
 * intranettet koble seg til «reflektor-marketing» i bokstavelig forstand.
 *
 * Det samtalen HAR, er det samme grunnlaget: denne ukens rapport i sin
 * helhet, og tidligere uker på forespørsel gjennom et verktøy. For å
 * resonnere om markedsføringen er det dette som trengs.
 *
 * ── HUBSPOT: SI FRA, IKKE LAT SOM ─────────────────────────────────────────
 *
 * Intranettet har ingen HubSpot-kobling. Systeminstruksen sier det rett
 * ut til modellen, og ber den levere en presis handlingsliste i stedet.
 * Alternativet — et verktøy som later som det merker kontakter — ville
 * gitt en bekreftelse på noe som ikke skjedde, og det er den dyreste
 * feilen et slikt grensesnitt kan gjøre.
 */

export const runtime = "nodejs";
/*
 * Ingen `maxDuration` her, som i dokumentruta: den arver planens
 * standard. Et tall vi ikke vet om planen tillater, feiler først ved
 * deploy, og en samtalerunde er kortere enn å skrive et helt dokument.
 */
export const dynamic = "force-dynamic";

/*
 * Opus 5.5, ikke opus-5 som dokumentgeneratoren.
 *
 * De to er bevisst ulike: dokumentinstruksene er innarbeidet mot opus-5 og
 * skal ikke endre oppførsel av en samtalefunksjon. Her er det nytt, og da
 * brukes den nyeste Opus — den er også billigere. Effort settes eksplisitt
 * fordi standarden på denne modellen er «medium»; samtalen resonnerer om
 * penger, og da er det verdt ett hakk opp.
 */
const MODELL = "claude-opus-5-5";
const MAKS_TOKENS = 8_000;
/** Verktøyrunder før vi stopper. En samtale som looper, skal stoppe selv. */
const MAKS_RUNDER = 8;
const MAKS_SPORSMAL = 4_000;

function instruks(rapportMd: string, naa: Date): string {
  return [
    "Du er med i Reflektors interne rapportsenter, i en samtale om ÉN ukesrapport om betalt markedsføring. Du snakker med Pål Barlein, som eier selskapet. Alt på norsk.",
    "",
    "DU KAN HANDLE, IKKE BARE SVARE. Verktøyene krysser av steg, registrerer svaret på ukens beslutning, skriver notater og henter tidligere uker. Ber han deg gjøre noe som et verktøy dekker, gjør du det — og sier hva du gjorde.",
    "",
    "DU HAR IKKE TILGANG TIL HUBSPOT, GOOGLE ADS ELLER META. Intranettet har ingen kobling til dem; HubSpot-tallene i rapporten er skrevet inn av den planlagte oppgaven som lager den. Ber han deg merke kontakter, rydde duplikater eller endre en kampanje, skal du ALDRI svare som om det er utført. Lag i stedet den presise listen han kan utføre selv: hvilke poster, hvilket felt, hvilken verdi, i hvilken rekkefølge. Tilby å lagre listen som notat.",
    "",
    "HVORDAN DU SKRIVER",
    "- Kort. Han har tretti sekunder, ikke ti minutter.",
    "- Tall fra rapporten siteres som de står. Du regner ikke om, og du finner ikke på et tall som ikke er der. Mangler noe, sier du at det mangler.",
    "- Ingen floskler og ingen oppsummering av det han nettopp skrev. Svar på spørsmålet.",
    "- Er du uenig i noe han foreslår, sier du det i én setning, med grunnen. Så gjør du det han ber om hvis han gjentar det.",
    "",
    "BESLUTNINGEN ER HANS. Du kan anbefale, men du registrerer bare et svar han selv har sagt.",
    "",
    `Klokka er nå ${norskTidspunkt(naa.toISOString())}.`,
    "",
    "── RAPPORTEN DENNE SAMTALEN HANDLER OM ──",
    "",
    rapportMd,
  ].join("\n");
}

export async function POST(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  if (!erRapportleser(bruker)) {
    /* 404 og ikke 403, som resten av rapportsenteret. */
    return NextResponse.json({ feil: "Ikke funnet." }, { status: 404 });
  }

  const nokkel = (process.env.ANTHROPIC_API_KEY ?? "").trim();
  if (!nokkel) {
    return NextResponse.json(
      {
        feil: "ANTHROPIC_API_KEY er ikke satt. Samtalen er ikke tilgjengelig.",
      },
      { status: 503 },
    );
  }

  let kropp: unknown;
  try {
    kropp = await foresporsel.json();
  } catch {
    return NextResponse.json({ feil: "Ugyldig JSON." }, { status: 400 });
  }
  const { type, id, melding, nullstill } = (kropp ?? {}) as Record<
    string,
    unknown
  >;
  if (typeof type !== "string" || typeof id !== "string") {
    return NextResponse.json(
      { feil: "Mangler type eller id." },
      { status: 400 },
    );
  }

  const epost = bruker!.epost;

  if (nullstill === true) {
    await slettSamtale(type, id, epost);
    return NextResponse.json({ ok: true });
  }

  const sporsmal = typeof melding === "string" ? melding.trim() : "";
  if (!sporsmal) {
    return NextResponse.json({ feil: "Tom melding." }, { status: 400 });
  }
  if (sporsmal.length > MAKS_SPORSMAL) {
    return NextResponse.json(
      { feil: "Meldingen er for lang." },
      { status: 400 },
    );
  }

  const lagret = await hentRapport(type, id);
  if (!lagret) {
    return NextResponse.json({ feil: "Fant ikke rapporten." }, { status: 404 });
  }

  const rapportMd = byggMarkdown(
    [{ rapport: lagret.rapport, svar: lagret }],
    new Date(),
  );

  /*
   * Verktøyene får funksjonene sine herfra. Se `samtaleverktoy.ts` for
   * hvorfor de injiseres i stedet for å importeres der.
   */
  const kontekst: Verktoykontekst = {
    type,
    id,
    steg: lagret.rapport.steps,
    sporsmal: lagret.rapport.decision?.question ?? null,
    settSteg: async (i, gjort) => Boolean(await settSteg(type, id, i, gjort)),
    svarPaaBeslutning: async (svar, kommentar) =>
      Boolean(await svarPaaBeslutning(type, id, svar, kommentar)),
    skrivNotat: async (tekst) => Boolean(await leggTilNotat(type, id, tekst)),
    tidligereUker: async (antall) => {
      const indeks = (await hentIndeks())
        .filter((r) => r.type === type && r.id !== id && !r.test)
        .slice(0, antall);
      const uker = [];
      for (const rad of indeks) {
        const l = await hentRapport(rad.type, rad.id);
        if (l) uker.push({ rapport: l.rapport, svar: l });
      }
      return uker.length ? byggMarkdown(uker, new Date()) : "";
    },
  };

  const historikk = await hentSamtale(type, id, epost);
  const meldinger: Melding[] = [
    ...historikk,
    { role: "user", content: sporsmal },
  ];

  const klient = new Anthropic({ apiKey: nokkel });
  const koder = new TextEncoder();
  const stopp = new AbortController();
  foresporsel.signal.addEventListener("abort", () => stopp.abort());

  const strom = new ReadableStream({
    async start(kontroller) {
      const send = (o: unknown) =>
        kontroller.enqueue(koder.encode(JSON.stringify(o) + "\n"));

      try {
        for (let runde = 0; runde < MAKS_RUNDER; runde++) {
          const s = klient.messages.stream(
            {
              model: MODELL,
              max_tokens: MAKS_TOKENS,
              /*
               * `display: "summarized"` og ikke standarden. Uten den er
               * tenkeblokkene tomme, og skjermen står stille i flere
               * sekunder før første ord kommer. Et dempet «tenker»-felt
               * er billigere enn en bruker som tror det har hengt seg.
               */
              thinking: { type: "adaptive", display: "summarized" },
              output_config: { effort: "high" },
              system: instruks(rapportMd, new Date()),
              tools: [...VERKTOY],
              messages: meldinger,
            },
            { signal: stopp.signal },
          );

          s.on("text", (bit) => send({ tekst: bit }));
          s.on("thinking", (bit) => send({ tenker: bit }));

          const svar = await s.finalMessage();

          /* Append-only: hele innholdet tilbake, med tenkeblokkene. */
          meldinger.push({ role: "assistant", content: svar.content });

          if (svar.stop_reason === "refusal") {
            send({ feil: "Claude avslo å svare på dette." });
            break;
          }
          if (svar.stop_reason !== "tool_use") break;

          const kall = svar.content.filter((b) => b.type === "tool_use");
          const resultater: Anthropic.ToolResultBlockParam[] = [];
          for (const b of kall) {
            const r = await kjorVerktoy(b.name, b.input, kontekst);
            if (r.gjort) send({ gjort: r.gjort });
            resultater.push({
              type: "tool_result",
              tool_use_id: b.id,
              content: r.tekst,
              is_error: r.feil === true,
            });
          }
          /*
           * ALLE resultatene i ÉN brukermelding. Deles de opp, slutter
           * modellen å kalle verktøy parallelt.
           */
          meldinger.push({ role: "user", content: resultater });

          if (runde === MAKS_RUNDER - 1) {
            send({
              feil: "Stoppet etter åtte verktøyrunder. Still spørsmålet på nytt.",
            });
          }
        }

        await lagreSamtale(type, id, epost, meldinger);
        send({ ferdig: true });
      } catch (e) {
        if (!stopp.signal.aborted) {
          console.error("samtale:", e);
          send({
            feil:
              e instanceof Anthropic.APIError
                ? `Claude svarte ${e.status}.`
                : "Noe gikk galt. Prøv igjen.",
          });
        }
      } finally {
        kontroller.close();
      }
    },
  });

  return new NextResponse(strom, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

/** Historikken, til å tegne samtalen når siden lastes. */
export async function GET(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  if (!erRapportleser(bruker)) {
    return NextResponse.json({ feil: "Ikke funnet." }, { status: 404 });
  }
  const sok = foresporsel.nextUrl.searchParams;
  const type = sok.get("type");
  const id = sok.get("id");
  if (!type || !id) {
    return NextResponse.json(
      { feil: "Mangler type eller id." },
      { status: 400 },
    );
  }
  return NextResponse.json({
    meldinger: await hentSamtale(type, id, bruker!.epost),
  });
}
