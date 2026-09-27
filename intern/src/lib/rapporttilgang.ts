import type { Bruker } from "@/lib/sesjon";
import { devInnloggingTillatt } from "@/lib/utvikling";

/**
 * Hvem som ser rapportsenteret.
 *
 * ── SAMME MØNSTER SOM GJENNOMGANGEN, EGEN LISTE ───────────────────────────
 *
 * Bestilt: «Gjør det på samme måte som gjennomgang av nye artikler.» Det er
 * `erRedaktor` i redaktor.ts — en liste med e-postadresser, sjekket på
 * serveren i hver beskyttet side.
 *
 * Listen er likevel sin egen, og ikke `REDAKTORER`. De to rollene er
 * forskjellige ting som i dag tilfeldigvis er samme person: redaktøren
 * godkjenner fagtekster, rapportleseren ser hva Reflektor bruker på
 * annonser og hvilke kunder de ga. Den dagen en produsent skal godkjenne
 * rubrikker, skal ikke annonsebudsjettet følge med på kjøpet.
 *
 * ── DETTE ER IKKE EN SIKKERHETSGRENSE UTOVER INNLOGGINGEN ─────────────────
 *
 * Bestilt slik: «Ingen ekstra sikkerhet utover innloggingen.» Å være
 * innlogget som Pål er nok. Listen holder rapportene ute av menyen og
 * rutene for alle andre, og sidene svarer 404 — ikke en omdirigering, som
 * ville røpet at siden finnes.
 */
const LESERE = ["pal@reflektor.no"];

/**
 * Dev-innloggingens adresse, sluppet inn kun der den kan brukes.
 *
 * Uten dette kan rapportsenteret ikke åpnes på en utviklermaskin i det hele
 * tatt — dev-innloggingen gir «utvikling@reflektor.no», og den står ikke i
 * listen. Adressen kan bare oppstå gjennom dev-innloggingen, og den finnes
 * ikke i noe som er deployet: `devInnloggingTillatt` krever både at
 * NODE_ENV ikke er production og at INTERN_DEV_INNLOGGING er satt.
 *
 * Den ligger her og ikke i LESERE, slik at listen over hvem som faktisk har
 * tilgang, forblir én linje man kan lese.
 */
const UTVIKLER = "utvikling@reflektor.no";

export function erRapportleser(bruker: Bruker | null): boolean {
  if (!bruker) return false;
  const epost = bruker.epost.toLowerCase().trim();
  if (epost === UTVIKLER && devInnloggingTillatt()) return true;
  return LESERE.includes(epost);
}
