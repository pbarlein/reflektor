/**
 * Hva som følger med når samme uke leveres på nytt.
 *
 * ── HVORFOR DETTE ER EN EGEN FIL ──────────────────────────────────────────
 *
 * Samme grunn som `rapportformat.ts`: `rapportlager.ts` åpner Blob-butikken
 * ved import, og en test som bare vil vite om en hake havner riktig sted
 * skal ikke trenge en sky-token for å kjøre. Her inne er det ingenting annet
 * enn tekstsammenligning, og typene er strukturelle med vilje — modulen vet
 * ikke hva en rapport er, bare at den har steg med titler.
 *
 * ── FEILEN SOM UTLØSTE DEN ────────────────────────────────────────────────
 *
 * Oppdaget 27.09.2026, første gang rapportoppgaven ble kjørt to ganger på
 * samme uke. Avkryssingene lå lagret som indekser — «steg 0 og steg 1 er
 * gjort». Den nye utgaven hadde andre steg i de samme posisjonene, og hakene
 * ble stående. De pekte da på tekst Pål aldri hadde sett, langt mindre gjort.
 * Beslutningen var verre: svaret «ja» ble hengende under et nytt spørsmål.
 *
 * Det er den farligste formen for feil dette systemet kan ha. Rapporten er
 * beslutningsgrunnlag, og en hake som lyver er verre enn ingen hake.
 */

export type Avkryssing = { indeks: number; tidspunkt: string };

/** Det en ny utgave av samme uke ikke kunne ta med seg. */
export type Mistet = {
  tidspunkt: string;
  steg: string[];
  beslutning: { sporsmal: string; svar: string } | null;
};

/** Så lite som trengs for å vite hva en utgave inneholder. */
export type Utgave = {
  steg: readonly { title: string }[];
  sporsmal: string | null;
};

/**
 * Samme steg, uavhengig av tegnsetting og store bokstaver.
 *
 * Avsenderen skriver rapporten fra bunnen av hver gang. «Sjekk at Google
 * faktisk står stille.» og «Sjekk at Google står stille» er det samme steget
 * med en ordlyd som har flyttet seg litt, og å kreve tegn-for-tegn likhet
 * ville kastet nesten hver eneste avkryssing bort.
 */
export function stegnokkel(tittel: string): string {
  return tittel
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Flytter avkryssinger og beslutning over i en ny utgave av samme uke.
 *
 * Et steg som ikke finnes igjen, og et svar på et spørsmål som er endret,
 * blir IKKE med — de havner i `mistet`, så siden kan si fra.
 */
export function flyttMedOver<S extends { svar: string }>(
  fra:
    | (Utgave & {
        gjorteSteg: readonly Avkryssing[];
        beslutning: S | null;
      })
    | null,
  til: Utgave,
  naa: string,
): { gjorteSteg: Avkryssing[]; beslutning: S | null; mistet: Mistet | null } {
  if (!fra) return { gjorteSteg: [], beslutning: null, mistet: null };

  const nyeNokler = til.steg.map((s) => stegnokkel(s.title));
  const brukt = new Set<number>();
  const gjorteSteg: Avkryssing[] = [];
  const mistedeSteg: string[] = [];

  for (const a of fra.gjorteSteg) {
    const tittel = fra.steg[a.indeks]?.title;
    /* Peker den ingen steder allerede, er det ingenting å redde. */
    if (tittel === undefined) continue;

    const nokkel = stegnokkel(tittel);
    /*
     * `brukt` hindrer at to haker lander på det samme nye steget. To steg
     * kan hete nesten det samme, og da skal den andre haken telles som
     * mistet i stedet for å dublere den første.
     */
    const i = nyeNokler.findIndex((n, j) => n === nokkel && !brukt.has(j));
    if (i < 0) {
      mistedeSteg.push(tittel);
      continue;
    }
    brukt.add(i);
    gjorteSteg.push({ indeks: i, tidspunkt: a.tidspunkt });
  }

  /*
   * Spørsmålet må stå uendret, tegn for tegn. Her brukes IKKE `stegnokkel`:
   * et svar på «Skal vi bestille ny video nå?» er ikke et svar på «Skal vi
   * bestille ny video i oktober?», og de to ligner altfor mye til at en løs
   * sammenligning kan skille dem. På et steg er en løs sammenligning en
   * hjelp; på et ja/nei-spørsmål er den en felle.
   */
  const sporsmalStaar = fra.sporsmal === til.sporsmal;
  const beslutning = sporsmalStaar ? fra.beslutning : null;
  const mistetBeslutning =
    !sporsmalStaar && fra.beslutning && fra.sporsmal
      ? { sporsmal: fra.sporsmal, svar: fra.beslutning.svar }
      : null;

  const mistet =
    mistedeSteg.length || mistetBeslutning
      ? { tidspunkt: naa, steg: mistedeSteg, beslutning: mistetBeslutning }
      : null;

  return { gjorteSteg, beslutning, mistet };
}
