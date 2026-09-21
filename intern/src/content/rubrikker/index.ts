import type { KategoriId } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";

import { INTERNT } from "./internt";
import { MARKED } from "./marked";
import { OPPTAK } from "./opptak";
import { PLANLEGGING } from "./planlegging";
import { PUBLISERING } from "./publisering";
import { REDIGERING } from "./redigering";
import { RESEARCH } from "./research";

/**
 * Alt innhold, satt sammen.
 *
 * DELT I FILER ETTER FASE, ikke samlet i én. Det er ikke ryddesans: den som
 * skal kvalitetssikre opptaksrutinene, skal åpne opptak.ts og se alle fire
 * rubrikkene sine ved siden av hverandre — ikke lete i et tusen linjers
 * register. Filstrukturen speiler hvem som eier hva.
 */
export const RUBRIKKER: readonly Rubrikk[] = [
  ...INTERNT,
  ...RESEARCH,
  ...PLANLEGGING,
  ...OPPTAK,
  ...REDIGERING,
  ...PUBLISERING,
  ...MARKED,
];

/**
 * Slug-kollisjoner tas ved modullasting, ikke i en test.
 *
 * To rubrikker med samme slug gir en side som viser den ene og en lenke som
 * peker på den andre — en feil som ser ut som «innholdet er feil», ikke som
 * «koden er feil», og som derfor kan leve lenge. Her feiler byggen i stedet,
 * med begge titlene i meldingen.
 */
{
  const sett = new Map<string, string>();
  for (const r of RUBRIKKER) {
    const fra_for = sett.get(r.slug);
    if (fra_for) {
      throw new Error(
        `To rubrikker har slug «${r.slug}»: «${fra_for}» og «${r.tittel}».`,
      );
    }
    sett.set(r.slug, r.tittel);
  }
}

export function finnRubrikk(slug: string): Rubrikk | undefined {
  return RUBRIKKER.find((r) => r.slug === slug);
}

export function rubrikkerIKategori(id: KategoriId): readonly Rubrikk[] {
  return RUBRIKKER.filter((r) => r.kategori === id);
}

/** Antall per kategori. Vises som tall på skinna og på nyhetsbrikkene. */
export function antallPerKategori(): Record<KategoriId, number> {
  const tall = {} as Record<KategoriId, number>;
  for (const r of RUBRIKKER) tall[r.kategori] = (tall[r.kategori] ?? 0) + 1;
  return tall;
}

export type { Rubrikk, Blokk, Medie } from "@/content/rubrikktype";
