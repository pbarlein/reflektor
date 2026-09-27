import { NextResponse, type NextRequest } from "next/server";

import { lesRapport } from "@/content/rapporttype";
import { hentIndeks, hentRapport, lagreRapport } from "@/lib/rapportlager";
import { varsleNyRapport } from "@/lib/rapportvarsel";

/**
 * Inntaket for rapporter, og uthentingen den planlagte oppgaven trenger.
 *
 * ── HVORFOR DENNE ÉNE RUTA HAR EN NØKKEL ──────────────────────────────────
 *
 * Alt annet i rapportsenteret er beskyttet av innloggingen, slik det er
 * bestilt. Men den planlagte oppgaven er ikke innlogget — den kjører hos
 * Anthropic mandag morgen og har ingen Google-konto. Den trenger én vei
 * inn, og nøkkelen er bare for den veien.
 *
 * Nøkkelen gir IKKE lesetilgang til rapportene på skjermen. Den gir rett
 * til å levere en rapport, og til å hente stegene og svaret fra forrige
 * uke — akkurat det oppgaven trenger for å skrive «forrige ukes steg», og
 * ikke noe mer.
 *
 *   POST /api/rapport          — lever en rapport
 *   GET  /api/rapport?type=…   — hent forrige rapports steg og svar
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 1 MB. En rapport med tolv uker og et titalls annonser er rundt 15 kB. */
const MAKS_BYTES = 1_000_000;

function nokkelOk(foresporsel: NextRequest): boolean {
  const ventet = (process.env.RAPPORT_NOKKEL ?? "").trim();
  if (!ventet) return false;

  /*
   * ── KLIPPES I BEGGE ENDER ─────────────────────────────────────────────
   *
   * En nøkkel som limes inn i et tekstfelt får ofte et linjeskift eller et
   * mellomrom med på kjøpet, i den ene enden eller den andre. Det er ikke
   * en annen nøkkel — det er den samme nøkkelen med usynlig søppel rundt,
   * og å avvise den lærer ingen noe.
   */
  const gitt = (
    foresporsel.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    foresporsel.headers.get("x-rapport-nokkel") ??
    ""
  ).trim();

  /*
   * Lengdesjekken først: en tegn-for-tegn-sammenligning over ulike lengder
   * ville lest utenfor strengen.
   */
  const like = gitt.length === ventet.length;
  let ulikt = like ? 0 : 1;
  if (like) {
    for (let i = 0; i < gitt.length; i++) {
      ulikt |= gitt.charCodeAt(i) ^ ventet.charCodeAt(i);
    }
  }
  if (ulikt === 0) return true;

  /*
   * ── DIAGNOSE I LOGGEN, ALDRI I SVARET ─────────────────────────────────
   *
   * En avvist levering uten spor er umulig å feilsøke: den som satte opp
   * oppgaven ser bare «401», og vet ikke om nøkkelen er avkortet, har feil
   * tegn, eller aldri kom fram.
   *
   * Lengdene og formen skrives derfor til Vercel-loggen, som er
   * tilgangsstyrt. Selve nøkkelen skrives ALDRI noe sted — hverken hele
   * eller delvis. Lengde og antall like tegn fra start sier nok til å
   * skille «limte inn feil» fra «limte inn halvparten», uten å røpe noe
   * som kan brukes.
   */
  let felles = 0;
  while (
    felles < gitt.length &&
    felles < ventet.length &&
    gitt[felles] === ventet[felles]
  ) {
    felles += 1;
  }
  console.warn(
    `[rapport] nøkkel avvist · mottatt ${gitt.length} tegn, ventet ${ventet.length} · ` +
      `like fra start: ${felles} · ` +
      `header: ${foresporsel.headers.get("authorization") ? "authorization" : foresporsel.headers.get("x-rapport-nokkel") ? "x-rapport-nokkel" : "ingen"}`,
  );
  return false;
}

function avvist(): NextResponse {
  return NextResponse.json(
    { feil: "Ugyldig eller manglende nøkkel." },
    { status: 401 },
  );
}

/**
 * Er inntaket i det hele tatt satt opp?
 *
 * ── HVORFOR DETTE ER EN EGEN SJEKK, OG HVORFOR BEGGE RUTENE GJØR DEN ──────
 *
 * Bare POST gjorde den først. Åpnet man adressen i en nettleser — altså en
 * GET — svarte den «Ugyldig eller manglende nøkkel», som ser ut som at
 * inntaket står klart og bare venter på riktig nøkkel. Det gjorde det ikke:
 * variabelen var ikke satt i det hele tatt.
 *
 * To ruter som svarer forskjellig på samme tilstand, sender den som setter
 * opp systemet i feil retning. Nå sier begge det samme.
 */
function ikkeSattOpp(): NextResponse | null {
  if (process.env.RAPPORT_NOKKEL) return null;
  return NextResponse.json(
    { feil: "RAPPORT_NOKKEL er ikke satt i miljøet. Leveringen er stengt." },
    { status: 503 },
  );
}

export async function POST(foresporsel: NextRequest) {
  const stengt = ikkeSattOpp();
  if (stengt) return stengt;
  if (!nokkelOk(foresporsel)) return avvist();

  const lengde = Number(foresporsel.headers.get("content-length") ?? 0);
  if (lengde > MAKS_BYTES) {
    return NextResponse.json(
      { feil: "Payloaden er for stor." },
      { status: 413 },
    );
  }

  let kropp: unknown;
  try {
    kropp = await foresporsel.json();
  } catch {
    return NextResponse.json({ feil: "Ugyldig JSON." }, { status: 400 });
  }

  const lesning = lesRapport(kropp);
  if (!lesning.ok) {
    /*
     * Feilene samlet, ikke én om gangen. Den som retter dem leser en logg
     * en gang i uka — se `lesRapport`.
     */
    return NextResponse.json(
      { feil: "Rapporten mangler påkrevde felt.", detaljer: lesning.feil },
      { status: 422 },
    );
  }

  const { rapport, rå } = lesning;
  const { lagret, ny } = await lagreRapport(rapport, rå);
  if (!lagret) {
    return NextResponse.json(
      { feil: "Kunne ikke lagre rapporten. Er BLOB_READ_WRITE_TOKEN satt?" },
      { status: 503 },
    );
  }

  /*
   * PÅMINNELSE BARE PÅ NY ID. En oppdatering av samme uke skal rette
   * rapporten uten å vekke noen på nytt — bestilt slik, og riktig: den
   * vanligste grunnen til å levere på nytt er at avsenderen selv fant en
   * feil.
   */
  let varslet = false;
  if (ny) varslet = await varsleNyRapport(rapport);

  return NextResponse.json({
    ok: true,
    id: rapport.id,
    type: rapport.type,
    ny,
    varslet,
    test: rapport.test,
    url: `/rapport/${encodeURIComponent(rapport.type)}/${encodeURIComponent(rapport.id)}`,
  });
}

/**
 * Det oppgaven trenger for å skrive neste ukes rapport: hva Pål krysset av,
 * og hva han svarte. Uten dette må den gjette på «forrige ukes steg».
 */
export async function GET(foresporsel: NextRequest) {
  const stengt = ikkeSattOpp();
  if (stengt) return stengt;
  if (!nokkelOk(foresporsel)) return avvist();

  const type =
    foresporsel.nextUrl.searchParams.get("type") ?? "betalt-markedsforing";
  const medTest = foresporsel.nextUrl.searchParams.get("test") === "ja";

  const indeks = (await hentIndeks())
    .filter((r) => r.type === type && (medTest || !r.test))
    .sort((a, b) => b.mottatt.localeCompare(a.mottatt));

  const siste = indeks[0];
  if (!siste) return NextResponse.json({ rapport: null });

  const l = await hentRapport(type, siste.id);
  if (!l) return NextResponse.json({ rapport: null });

  return NextResponse.json({
    rapport: {
      id: l.id,
      type: l.type,
      year: l.rapport.year,
      week: l.rapport.week,
      period: l.rapport.period,
      mottatt: l.mottatt,
      test: l.rapport.test,
    },
    /* Stegene med Påls avkryssinger, i samme rekkefølge som i rapporten. */
    steps: l.rapport.steps.map((s, i) => ({
      ...s,
      done: l.gjorteSteg.some((g) => g.indeks === i),
      done_at: l.gjorteSteg.find((g) => g.indeks === i)?.tidspunkt ?? null,
    })),
    decision: l.rapport.decision
      ? {
          question: l.rapport.decision.question,
          answer: l.beslutning?.svar ?? null,
          comment: l.beslutning?.kommentar ?? null,
          answered_at: l.beslutning?.tidspunkt ?? null,
        }
      : null,
    notes: l.notater,
  });
}
