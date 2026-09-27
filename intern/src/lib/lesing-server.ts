import { cookies } from "next/headers";

import { LEST_KAPSEL, lesMaske } from "@/lib/lesing";
import { lestAvPerson } from "@/lib/leselager";
import { hentBruker } from "@/lib/tilgang";

/**
 * Serversiden av lesestatusen, skilt ut i egen fil.
 *
 * `next/headers` finnes bare i server-komponenter. Lå det i lesing.ts — som
 * lesesporingen i nettleseren også importerer fra — ville byggen dra et
 * server-API inn i klientpakken og stoppe. Skillet er derfor ikke
 * ryddighet, det er en forutsetning for at det bygger.
 *
 * ── TO KILDER, OG UNIONEN VINNER ──────────────────────────────────────────
 *
 * Kapselen er rask og ligger allerede i forespørselen: den gjør at første
 * bilde er riktig uten å vente på noe nettverk. Butikken er fasit og følger
 * personen mellom maskiner. Se leselager.ts.
 *
 * Union og ikke «den ene overstyrer den andre». Grunnen er at begge kan
 * mangle noe den andre har: en ny maskin har tom kapsel, og en butikk som
 * ikke er satt opp lokalt vet ingenting. Å la den tommeste vinne ville
 * betydd at framdrift forsvant, og en teller som går bakover av seg selv
 * er verre enn ingen teller.
 */
export async function lestAvBrukeren(): Promise<Set<number>> {
  const bok = await cookies();
  const fraKapsel = lesMaske(bok.get(LEST_KAPSEL)?.value);

  const bruker = await hentBruker();
  if (!bruker) return fraKapsel;

  const fraLager = await lestAvPerson(bruker.epost);
  for (const n of fraLager) fraKapsel.add(n);
  return fraKapsel;
}
