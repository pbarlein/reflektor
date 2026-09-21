import { finnKategori } from "@/content/kategorier";
import type { Blokk, Rubrikk } from "@/content/rubrikktype";

/**
 * Flater ut en rubrikk til én søkbar streng.
 *
 * SØKET GÅR I BRØDTEKSTEN, ikke bare i titlene. Det er hele forskjellen på
 * en hub man finner fram i og en man må huske strukturen til. Den som søker
 * «romtone» eller «hvitbalanse», leter ikke etter en rubrikktittel — hen
 * leter etter setningen den står i.
 *
 * INGEN INDEKS, INGEN BIBLIOTEK. Det er tjuefire rubrikker. En `includes`
 * over tjuefire strenger er raskere enn å laste et søkebibliotek, og den
 * kan ikke bli utdatert i forhold til innholdet. Skulle dette vokse forbi
 * et par hundre, er det her man bytter.
 */
function blokktekst(blokk: Blokk): string {
  switch (blokk.type) {
    case "avsnitt":
    case "merknad":
      return blokk.tekst;
    case "sitat":
      return `${blokk.tekst} ${blokk.kilde}`;
    case "punkter":
      return blokk.punkter.join(" ");
    case "sjekkliste":
      return `${blokk.tittel ?? ""} ${blokk.punkter.join(" ")}`;
    case "steg":
      return blokk.steg.map((s) => `${s.tittel} ${s.tekst}`).join(" ");
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
