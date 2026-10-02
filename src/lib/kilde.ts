/**
 * Hvor kom leadet fra? Lagt til 02.10.2026.
 *
 * BAKGRUNN: Squarespace-siden hadde et skjult «Kilde»-felt i skjemaet som ble
 * fylt fra localStorage (`rfl_kilde`) med UTM-parametere, gclid/fbclid,
 * referrer og landingsside fra besøkendes FØRSTE sidevisning. Det fulgte hver
 * henvendelse, og var det eneste som sa hvilken annonse et lead kom fra.
 * Den nye siden manglet det ved cutover. Dette gjenoppretter det, med samme
 * nøkkel og samme oppbygning, så gamle og nye leads kan leses likt.
 *
 * TO AVVIK FRA DET GAMLE, begge med vilje:
 *
 * 1. gclid og fbclid tas med som VERDI, ikke bare som et flagg. Verdien er det
 *    som gjør det mulig å koble et lead til et bestemt annonseklikk i ettertid.
 * 2. Et nytt annonseklikk (UTM, gclid eller fbclid) overskriver en tidligere
 *    lagret kilde. Den gamle løsningen beholdt alltid første besøk, også når
 *    personen senere kom tilbake via en betalt annonse. Det er annonseklikket
 *    som forklarer henvendelsen. Et vanlig, umerket besøk overskriver ikke.
 *
 * Funksjonen er ren — ingen DOM, ingen lagring — så den kan testes uten
 * nettleser. Lagringen skjer i components/Kildefanger.tsx.
 */

export const KILDE_NOKKEL = "rfl_kilde";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const KLIKK_ID = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"];

/** Maks lengde per enkeltverdi. En gclid er rundt 100 tegn. */
const MAKS_VERDI = 200;

function kort(verdi: string): string {
  return verdi.length > MAKS_VERDI ? `${verdi.slice(0, MAKS_VERDI)}…` : verdi;
}

/** Har adressen et merke fra en kampanje eller et annonseklikk? */
export function erMerket(sok: string): boolean {
  const p = new URLSearchParams(sok);
  return [...UTM, ...KLIKK_ID].some((k) => p.get(k));
}

/**
 * Bygger kildestrengen. Format, likt den gamle siden:
 *
 *   source=google | medium=cpc | gclid=Cj0K… || ref: https://www.google.com/ || landet paa: /reklamefilm
 *
 * `vertsnavn` brukes for å skille ekstern referrer fra intern navigasjon.
 */
export function byggKilde(
  sok: string,
  referrer: string,
  vertsnavn: string,
  sti: string,
): string {
  const p = new URLSearchParams(sok);
  const deler: string[] = [];

  for (const k of UTM) {
    const v = p.get(k);
    if (v) deler.push(`${k.replace("utm_", "")}=${kort(v)}`);
  }
  for (const k of KLIKK_ID) {
    const v = p.get(k);
    if (v) deler.push(`${k}=${kort(v)}`);
  }

  const ekstern = referrer && !referrer.includes(vertsnavn);
  const ref = ekstern ? kort(referrer) : "direkte";

  return `${deler.length ? deler.join(" | ") : "ingen utm"} || ref: ${ref} || landet paa: ${kort(sti)}`;
}

/**
 * Skal den nye kilden lagres? Ja hvis ingenting er lagret fra før, eller hvis
 * dette besøket kommer fra en kampanje eller et annonseklikk.
 */
export function skalLagres(lagret: string | null, sok: string): boolean {
  return !lagret || erMerket(sok);
}
