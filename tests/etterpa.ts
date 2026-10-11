/**
 * Å VENTE PÅ ARBEIDET SOM LIGGER I `after()`.
 *
 * `after()` finnes ikke utenfor en forespørselskontekst. Ruta fanger det og
 * kaller funksjonen uten å vente — så når POST er ferdig, er arbeidet bak
 * svaret så vidt begynt. Testene som teller `fetch`-kall må vente på at
 * det er gjort.
 *
 * HER STO FASTE PAUSER PÅ 50 OG 100 MS. De holdt så lenge arbeidet var
 * raskt. 11.10.2026 kom spam-sperra til, og med den en liste på 121 570
 * domener som tar 86 ms å laste første gang. Da ble pausene for korte, og
 * kallene fra én test ble talt i den neste: tre tester feilet om hverandre
 * fra kjøring til kjøring. Derfor to ting i stedet: last lista FØR
 * målingen begynner, og vent på et resultat i stedet for på klokka.
 */
import { erEngangsadresse } from "@/lib/spamoppslag.ts";

/**
 * Laster engangslista én gang, slik at de 86 millisekundene ikke havner
 * inne i en måling. Kall den øverst i en testfil som POSTer mot ruta.
 */
export async function varmOppOppslag(): Promise<void> {
  await erEngangsadresse("eksempel.invalid");
}

/** Taket på ventingen. Arbeidet tar millisekunder når lista er lastet. */
const TAK_MS = 2000;

/**
 * Venter til `ferdig()` svarer sant, og litt til, så et kall nummer to får
 * tid til å lande. Svarer `ferdig()` aldri, gir vi opp etter taket — og
 * testen feiler på sin egen påstand, ikke på en pause.
 *
 * ETTERPAUSEN GJELDER OGSÅ NÅR INGENTING SKJEDDE. En test som krever null
 * kall må vente lenge nok til at et kall ville kommet.
 */
export async function ventPaEtterpa(ferdig: () => boolean): Promise<void> {
  const slutt = Date.now() + TAK_MS;
  while (!ferdig() && Date.now() < slutt) {
    await new Promise((f) => setTimeout(f, 25));
  }
  await new Promise((f) => setTimeout(f, 250));
}
