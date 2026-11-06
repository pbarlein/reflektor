/**
 * «Hvor hørte du om oss?» — alternativene, ett sted.
 *
 * HVORFOR EN EGEN FIL. Listen er to ting på én gang: etikettene i skjemaet
 * og verdiene i HubSpot-egenskapen `hort_om_oss`. Står de to i hver sin fil,
 * glir de fra hverandre — og da får Pål en kontakt med en verdi som ikke
 * finnes i nedtrekket, uten at noe sier fra. Her er de ett par.
 *
 * `verdi` ER HUBSPOTS INTERNE NAVN og må aldri endres uten at egenskapen
 * endres samtidig. Etiketten kan omformuleres fritt; den interne verdien er
 * en kontrakt. Egenskapen ble opprettet 06.11.2026 (portal 148641188).
 *
 * DETTE ER IKKE `nettside_kilde`. Den bærer UTM, gclid, referrer og
 * landingsside — den tekniske kilden, målt av oss. Denne er det leadet selv
 * sier. De to er ofte uenige, og det er nettopp poenget: 7 av 9
 * nettsideleads i oktober landet på forsiden, og den tekniske kilden kunne
 * ikke skille den som googlet fra den som allerede kjente navnet.
 *
 * DETTE ER HELLER IKKE `kilde_kontakt`. Den er salgsmotorens eget felt.
 */

export type Hortvalg = {
  /** HubSpots interne verdi. Kontrakt — endres ikke alene. */
  verdi: string;
  /** Det leseren ser i nedtrekket. */
  etikett: string;
};

/**
 * Rekkefølgen er bestilt av Pål 06.11.2026 og er ikke alfabetisk: den går
 * fra det vi kan påvirke med arbeid på nettstedet, til det vi ikke kan.
 */
export const HORTVALG: readonly Hortvalg[] = [
  { verdi: "google", etikett: "Google" },
  { verdi: "ai", etikett: "ChatGPT eller annen AI" },
  { verdi: "meta", etikett: "Instagram eller Facebook" },
  { verdi: "linkedin", etikett: "LinkedIn" },
  { verdi: "anbefaling", etikett: "Anbefaling fra noen" },
  { verdi: "kjente_fra_for", etikett: "Kjente Reflektor fra før" },
  { verdi: "annet", etikett: "Annet" },
] as const;

/** Feltnavnet i skjemaet, og egenskapsnavnet i HubSpot. Samme streng. */
export const HORT_FELT = "hort_om_oss";

/**
 * Verdien slik den skal sendes videre, eller tom streng.
 *
 * ALT SOM IKKE STÅR I LISTA BLIR TOMT. En POST kan komme fra hva som helst,
 * og en verdi HubSpot ikke kjenner igjen får hele innsendingen avvist — da
 * koster et pyntefelt oss et lead. Feltet er valgfritt; tomt er et gyldig
 * svar og skal aldri stoppe noe.
 */
export function lesHortvalg(ra: unknown): string {
  const t = typeof ra === "string" ? ra.trim() : "";
  return HORTVALG.some((v) => v.verdi === t) ? t : "";
}

/** Etiketten som hører til en verdi. Tom verdi gir «ikke svart». */
export function hortEtikett(verdi: string): string {
  return HORTVALG.find((v) => v.verdi === verdi)?.etikett ?? "ikke svart";
}
