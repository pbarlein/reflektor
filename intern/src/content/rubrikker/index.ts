import type { KategoriId } from "../kategorier.ts";
import { KATEGORIER } from "../kategorier.ts";
import type { Rubrikk } from "../rubrikktype.ts";

import { FOLK } from "./folk.ts";
import { FORRETNING } from "./forretning.ts";
import { INTERNT } from "./internt.ts";
import { KUNDE } from "./kunde.ts";
import { MARKED } from "./marked.ts";
import { OPPTAK } from "./opptak.ts";
import { PLANLEGGING } from "./planlegging.ts";
import { PUBLISERING } from "./publisering.ts";
import { REDIGERING } from "./redigering.ts";
import { RESEARCH } from "./research.ts";

/**
 * Alt innhold, satt sammen.
 *
 * DELT I FILER ETTER KATEGORI, ikke samlet i én. Den som skal kvalitetssikre
 * opptaksrutinene, skal åpne opptak.ts og se alle sine rubrikker ved siden
 * av hverandre — ikke lete i et register på flere tusen linjer.
 * Filstrukturen speiler hvem som eier hva.
 */
export const RUBRIKKER: readonly Rubrikk[] = [
  ...RESEARCH,
  ...PLANLEGGING,
  ...OPPTAK,
  ...REDIGERING,
  ...PUBLISERING,
  ...KUNDE,
  ...FOLK,
  ...FORRETNING,
  ...INTERNT,
  ...MARKED,
];

/**
 * To feil tas ved modullasting, ikke i en test som kanskje kjøres.
 *
 * 1. DUPLIKATE SLUGGER gir en side som viser den ene og en lenke som peker
 *    på den andre — en feil som ser ut som «innholdet er feil», ikke som
 *    «koden er feil», og som derfor kan leve lenge.
 *
 * 2. ANKER SOM IKKE FINNES gir et oppsummeringspunkt som ser klikkbart ut
 *    og ikke hopper noe sted. Det er verre enn ingen lenke: brukeren tror
 *    hen klikket feil.
 *
 * Begge feiler byggen med navnet på rubrikken i meldingen.
 */
{
  const sett = new Map<string, string>();
  for (const r of RUBRIKKER) {
    const fraFor = sett.get(r.slug);
    if (fraFor) {
      throw new Error(
        `To rubrikker har slug «${r.slug}»: «${fraFor}» og «${r.tittel}».`,
      );
    }
    sett.set(r.slug, r.tittel);

    const ankre = new Set(
      r.innhold.filter((b) => b.type === "seksjon").map((b) => b.id),
    );
    for (const punkt of r.oppsummering) {
      if (!ankre.has(punkt.anker)) {
        throw new Error(
          `«${r.slug}»: oppsummeringspunktet «${punkt.tekst}» peker på ankeret ` +
            `«${punkt.anker}», som ikke finnes. Seksjoner i teksten: ` +
            `${[...ankre].join(", ") || "(ingen)"}.`,
        );
      }
    }
  }
}

/**
 * Rubrikkene en ansatt faktisk ser.
 *
 * HUBEN LANSERER MED TO PER KATEGORI. Resten er skrevet og lagret, men
 * ligger til gjennomgang. Begrunnelsen er enkel: en fasit kan ikke være
 * halvt vedtatt. Femti tekster der førtisju bærer et rødt utkastmerke, er
 * ikke en kilde til sannhet — det er et forslag med mye tekst.
 *
 * Alt som IKKE er i drift, finnes fortsatt: i søket for den som leter, og
 * samlet på /gjennomgang for den som skal godkjenne.
 */
export const I_DRIFT: readonly Rubrikk[] = RUBRIKKER.filter(
  (r) => r.status === "lansert",
);

export const TIL_GJENNOMGANG: readonly Rubrikk[] = RUBRIKKER.filter(
  (r) => r.status === "gjennomgang",
);

/**
 * EN TREDJE FEIL SOM TAS VED MODULLASTING: en kategori uten innhold i drift.
 *
 * Forsiden viser én rad per kategori. En kategori der alt ligger til
 * gjennomgang, ville gitt en overskrift med tomrom under — og det ser ut
 * som om siden er ødelagt, ikke som om innholdet er på vei.
 */
{
  const antall = new Map<string, number>();
  for (const r of RUBRIKKER.filter((r) => r.status === "lansert")) {
    antall.set(r.kategori, (antall.get(r.kategori) ?? 0) + 1);
  }
  for (const k of KATEGORIER) {
    if (!antall.get(k.id)) {
      throw new Error(
        `Kategorien «${k.navn}» har ingen rubrikker i drift. ` +
          `Enten skal den ha minst én, eller så skal den fjernes fra KATEGORIER.`,
      );
    }
  }
}

export function finnRubrikk(slug: string): Rubrikk | undefined {
  return RUBRIKKER.find((r) => r.slug === slug);
}

/**
 * Rubrikkene i én kategori, sortert slik raden skal vises.
 *
 * Høyest prioritet først. De fem første er de som er synlige uten å bla, og
 * det er en redaksjonell beslutning — se `prioritet` i rubrikktype.ts.
 */
export function rubrikkerIKategori(id: KategoriId): readonly Rubrikk[] {
  return I_DRIFT.filter((r) => r.kategori === id).sort(
    (a, b) => b.prioritet - a.prioritet,
  );
}

/** Kategoriene som faktisk har innhold, i rekkefølgen de skal vises. */
export function kategorierMedInnhold() {
  return KATEGORIER.map((k) => ({
    kategori: k,
    rubrikker: rubrikkerIKategori(k.id),
  })).filter((r) => r.rubrikker.length > 0);
}

export function antallUgodkjente(): number {
  return I_DRIFT.filter((r) => !r.godkjent).length;
}

/** Til gjennomgangssiden: det som venter, gruppert etter hvem som eier det. */
export function gjennomgangPerRolle() {
  const roller = new Map<string, Rubrikk[]>();
  for (const r of TIL_GJENNOMGANG) {
    const liste = roller.get(r.ansvarlig) ?? [];
    liste.push(r);
    roller.set(r.ansvarlig, liste);
  }
  return [...roller.entries()]
    .map(([rolle, rubrikker]) => ({
      rolle,
      rubrikker: rubrikker.sort((a, b) => b.prioritet - a.prioritet),
    }))
    .sort((a, b) => b.rubrikker.length - a.rubrikker.length);
}

export type { Rubrikk, Blokk, Medie, Kilde, Punkt } from "../rubrikktype.ts";
