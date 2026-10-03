/**
 * Meldingen HubSpot sender når et møte er booket i den innebygde kalenderen.
 *
 * LIGGER I EN `.ts`-FIL OG IKKE I KOMPONENTEN, og det er ikke tilfeldig:
 * Nodes typefjerning kan ikke importere `.tsx` i en test
 * (`ERR_UNKNOWN_FILE_EXTENSION`). Logikken som MÅ testes ligger derfor her,
 * og Motekalender.tsx importerer den.
 *
 * DET SOM MÅ TESTES ER AVSENDEREN. `window.addEventListener("message", …)`
 * tar imot fra enhver ramme på siden og fra ethvert vindu som har en
 * referanse til vårt. Uten en opphavssjekk kunne hvem som helst utløst en
 * konverteringshendelse i GA4 ved å poste ett objekt — og en konvertering
 * som ikke skjedde er verre enn ingen måling, fordi den ser ekte ut.
 *
 * HubSpot sender én boolsk verdi og ingenting mer: hverken møtelenke,
 * tidspunkt eller hvem som booket. Det er dokumentert, og det er også grunnen
 * til at hendelsen vi sender videre ikke kan inneholde personopplysninger.
 */

/** Bare HubSpot får snakke til siden. */
function fraHubspot(opphav: string): boolean {
  try {
    const vert = new URL(opphav).hostname;
    /*
     * «endsWith('.hubspot.com')» OG IKKE «includes('hubspot.com')».
     * `hubspot.com.angriper.no` inneholder strengen; den slutter ikke på
     * den. Det er den vanligste måten en slik sjekk gjøres ubrukelig på.
     */
    return vert === "hubspot.com" || vert.endsWith(".hubspot.com");
  } catch {
    return false;
  }
}

/** Sant bare hvis meldingen faktisk sier at et møte ble booket. */
export function erBooket(opphav: string, data: unknown): boolean {
  if (!fraHubspot(opphav)) return false;
  if (typeof data !== "object" || data === null) return false;
  return (
    (data as { meetingBookSucceeded?: unknown }).meetingBookSucceeded === true
  );
}
