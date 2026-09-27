import { NextResponse, type NextRequest } from "next/server";

import {
  leggTilNotat,
  slettTestrapporter,
  settSteg,
  svarPaaBeslutning,
  type Svar,
} from "@/lib/rapportlager";
import { erRapportleser } from "@/lib/rapporttilgang";
import { hentBruker } from "@/lib/tilgang";

/**
 * Det Pål gjør med en rapport: svarer, krysser av, skriver et notat.
 *
 * ── HVORFOR DENNE IKKE HAR NOEN NØKKEL ────────────────────────────────────
 *
 * Nøkkelen i /api/rapport er til den planlagte oppgaven, som ikke kan logge
 * inn. Her sitter det et menneske i en innlogget nettleser, og da er
 * innloggingen tilgangen — bestilt slik, og riktig: en ekstra kode ville
 * bare vært en kode til i en passordbehandler.
 *
 * Sjekken er `erRapportleser`, ikke bare «er innlogget». En produsent som
 * gjettet adressen skulle ellers kunne svare ja på Påls beslutninger.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SVAR: Svar[] = ["ja", "nei", "senere"];

export async function POST(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  if (!erRapportleser(bruker)) {
    /* 404 og ikke 403: en 403 bekrefter at ruta finnes. */
    return NextResponse.json({ feil: "Ikke funnet." }, { status: 404 });
  }

  let kropp: unknown;
  try {
    kropp = await foresporsel.json();
  } catch {
    return NextResponse.json({ feil: "Ugyldig JSON." }, { status: 400 });
  }

  const { type, id, handling, svar, kommentar, indeks, gjort, tekst } =
    (kropp ?? {}) as Record<string, unknown>;

  /*
   * Sletting av testdata gjelder alle på én gang og trenger derfor hverken
   * type eller id. Den står før sjekken under av samme grunn.
   */
  if (handling === "slett-testdata") {
    const antall = await slettTestrapporter();
    return NextResponse.json({ ok: true, slettet: antall });
  }

  if (typeof type !== "string" || typeof id !== "string") {
    return NextResponse.json(
      { feil: "Mangler type eller id." },
      { status: 400 },
    );
  }

  if (handling === "beslutning") {
    if (!SVAR.includes(svar as Svar)) {
      return NextResponse.json({ feil: "Ugyldig svar." }, { status: 400 });
    }
    const l = await svarPaaBeslutning(
      type,
      id,
      svar as Svar,
      typeof kommentar === "string" ? kommentar : "",
    );
    return l
      ? NextResponse.json({ ok: true, beslutning: l.beslutning })
      : NextResponse.json({ feil: "Fant ikke rapporten." }, { status: 404 });
  }

  if (handling === "steg") {
    if (typeof indeks !== "number" || !Number.isInteger(indeks) || indeks < 0) {
      return NextResponse.json({ feil: "Ugyldig steg." }, { status: 400 });
    }
    const l = await settSteg(type, id, indeks, gjort === true);
    return l
      ? NextResponse.json({ ok: true, gjorteSteg: l.gjorteSteg })
      : NextResponse.json({ feil: "Fant ikke rapporten." }, { status: 404 });
  }

  if (handling === "notat") {
    if (typeof tekst !== "string" || !tekst.trim()) {
      return NextResponse.json({ feil: "Tomt notat." }, { status: 400 });
    }
    const l = await leggTilNotat(type, id, tekst);
    return l
      ? NextResponse.json({ ok: true, notater: l.notater })
      : NextResponse.json({ feil: "Fant ikke rapporten." }, { status: 404 });
  }

  return NextResponse.json({ feil: "Ukjent handling." }, { status: 400 });
}
