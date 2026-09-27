import { NextResponse, type NextRequest } from "next/server";

import { hentIndeks, hentRapport } from "@/lib/rapportlager";
import {
  iSendevindu,
  purrBeslutning,
  purrSteg,
  varsleManglendeRapport,
} from "@/lib/rapportvarsel";

/**
 * Den planlagte purringen.
 *
 * ── HVORFOR DEN VÅKNER OFTE OG GJØR LITE ──────────────────────────────────
 *
 * Reglene er tidsbestemte — 24 timer, 72 timer, morgenen etter en frist,
 * mandag klokka ti — og ingen av dem kan avgjøres uten å se på klokka. Å
 * kjøre hver time og som regel finne ingenting, er billigere enn å regne ut
 * fire forskjellige utløsningstidspunkter og bomme på sommertid.
 *
 * Alt som faktisk sendes, skrives ned først. Se `erSendt` i rapportlager:
 * uten den er «send aldri to ganger» avhengig av at planleggeren aldri
 * kjører to ganger.
 *
 * ── HVEM FÅR LOV Å KALLE DEN ──────────────────────────────────────────────
 *
 * Vercels egen planlegger sender `Authorization: Bearer $CRON_SECRET` når
 * den variabelen finnes. Vi godtar den, eller rapportnøkkelen, slik at den
 * kan kjøres manuelt ved feilsøking. Uten en av dem: 401. Ruta sender
 * e-post, og en åpen rute som sender e-post er en åpen kran.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Hvor mange rapporter bakover vi ser etter forfalte steg. */
const SE_BAKOVER = 6;

function tillatt(foresporsel: NextRequest): boolean {
  const gitt =
    foresporsel.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const gyldige = [process.env.CRON_SECRET, process.env.RAPPORT_NOKKEL].filter(
    (x): x is string => Boolean(x),
  );
  return gyldige.some((g) => g === gitt);
}

/** Dato i Oslo som `2026-09-27`, uavhengig av serverens tidssone. */
function osloDato(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function osloUkedag(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Oslo",
    weekday: "short",
  }).format(d);
}

function osloTime(d: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Oslo",
      hour: "2-digit",
      hour12: false,
    }).format(d),
  );
}

export async function POST(foresporsel: NextRequest) {
  return kjor(foresporsel);
}

/* Vercels planlegger bruker GET. */
export async function GET(foresporsel: NextRequest) {
  return kjor(foresporsel);
}

async function kjor(foresporsel: NextRequest) {
  if (!tillatt(foresporsel)) {
    return NextResponse.json({ feil: "Ikke tillatt." }, { status: 401 });
  }

  const naa = new Date();
  const gjort: string[] = [];

  if (!iSendevindu(naa)) {
    return NextResponse.json({
      ok: true,
      utenfor_sendevindu: true,
      gjort,
    });
  }

  const indeks = (await hentIndeks())
    .filter((r) => !r.test)
    .sort((a, b) => b.mottatt.localeCompare(a.mottatt));

  /*
   * ── 1. UBESVART BESLUTNING ────────────────────────────────────────────
   * Bare den nyeste rapporten per type purres. En beslutning fra uke 34 som
   * aldri ble besvart, er ikke lenger en beslutning — den er historie.
   */
  const settType = new Set<string>();
  for (const rad of indeks) {
    if (settType.has(rad.type)) continue;
    settType.add(rad.type);
    if (!rad.harUbesvartBeslutning) continue;

    const l = await hentRapport(rad.type, rad.id);
    if (!l || l.beslutning) continue;

    const timer = (naa.getTime() - new Date(l.mottatt).getTime()) / 3_600_000;
    if (timer >= 72) {
      if (await purrBeslutning(l.rapport, 72)) gjort.push(`${rad.id}:72t`);
    } else if (timer >= 24) {
      if (await purrBeslutning(l.rapport, 24)) gjort.push(`${rad.id}:24t`);
    }
  }

  /*
   * ── 2. STEG SOM HAR PASSERT FRISTEN ───────────────────────────────────
   * «Morgenen etter» — vi purrer fra og med dagen etter fristen, og bare
   * én gang per steg. Nøkkelen i `merkSendt` gjør resten.
   */
  const iDag = osloDato(naa);
  for (const rad of indeks.slice(0, SE_BAKOVER)) {
    const l = await hentRapport(rad.type, rad.id);
    if (!l) continue;
    for (const [i, steg] of l.rapport.steps.entries()) {
      if (!steg.due) continue;
      if (l.gjorteSteg.some((g) => g.indeks === i)) continue;
      if (steg.due >= iDag) continue;
      if (await purrSteg(l.rapport, i, steg.title))
        gjort.push(`${rad.id}:steg${i}`);
    }
  }

  /*
   * ── 3. INGEN RAPPORT INNEN MANDAG KLOKKA TI ───────────────────────────
   * Merkelappen er mandagens dato, så varselet kan sendes én gang per uke
   * uten å måtte regne ut ISO-ukenummer her.
   */
  if (osloUkedag(naa) === "Mon" && osloTime(naa) >= 10) {
    const type = "betalt-markedsforing";
    const nyeste = indeks.find((r) => r.type === type);
    const kom = nyeste ? osloDato(new Date(nyeste.mottatt)) : "";
    if (kom !== iDag) {
      if (await varsleManglendeRapport(type, iDag))
        gjort.push(`mangler:${iDag}`);
    }
  }

  return NextResponse.json({ ok: true, gjort });
}
