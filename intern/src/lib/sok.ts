import { finnKategori } from "@/content/kategorier";
import type { Blokk, Rubrikk } from "@/content/rubrikktype";

/**
 * Flater ut en rubrikk til én søkbar streng.
 *
 * SØKET GÅR I BRØDTEKSTEN, ikke bare i titlene. Det er forskjellen på en
 * hub man finner fram i og en man må huske strukturen til. Den som søker
 * «hvitbalanse» eller «oppsigelse», leter etter setningen ordet står i.
 *
 * OPPSUMMERINGEN ER MED, og det er verdt å nevne: den er skrevet som korte,
 * presise formuleringer av hva teksten handler om, og treffer derfor ofte
 * bedre enn brødteksten.
 */
function blokktekst(blokk: Blokk): string {
  switch (blokk.type) {
    case "seksjon":
      return blokk.tittel;
    case "avsnitt":
    case "merknad":
    case "figur":
      return blokk.tekst;
    case "sitat":
      return `${blokk.tekst} ${blokk.kilde}`;
    case "punkter":
      return blokk.punkter.join(" ");
    case "sjekkliste":
      return `${blokk.tittel ?? ""} ${blokk.punkter.join(" ")}`;
    case "steg":
      return blokk.steg.map((s) => `${s.tittel} ${s.tekst}`).join(" ");
    case "tabell":
      return [...blokk.kolonner, ...blokk.rader.flat()].join(" ");
    case "eksempel":
      return `${blokk.data.seEtter} ${blokk.data.konto} ${blokk.data.hvem}`;
  }
}

export function sokeTekst(rubrikk: Rubrikk): string {
  const kategori = finnKategori(rubrikk.kategori);
  return [
    rubrikk.tittel,
    rubrikk.sammendrag,
    kategori.navn,
    kategori.kort,
    rubrikk.ansvarlig,
    ...rubrikk.oppsummering.map((p) => p.tekst),
    ...rubrikk.innhold.map(blokktekst),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Alle ordene i søket må finnes, i hvilken som helst rekkefølge.
 *
 * «lyd lokasjon» skal treffe en rubrikk som nevner begge deler, selv om
 * ordene står tre avsnitt fra hverandre. En ren delstrengsjekk på hele
 * søkestrengen ville krevd at brukeren gjettet ordstillingen.
 */
export function treffer(tekst: string, sok: string): boolean {
  const ord = sok.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (ord.length === 0) return true;
  return ord.every((o) => tekst.includes(o));
}
