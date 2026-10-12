/**
 * Spam-sjekken rett før en lead-e-post sendes. Bestilt av Pål 12.10.2026.
 *
 * HENDELSEN: jobben sendte e-post 1 og 2 til alle nye leads, også de
 * falske. Verifisert i «Sendt» 12.10.2026:
 *
 * - `golnaz.tandorost@gmail.com` fikk e-post 2 kl. 09:00. Avtalen ble satt
 *   til Tapt og «SPAM – » ca. kl. 09:20 — tjue minutter for sent.
 * - `kari@mailinator.com` og `marisol@example.no` fikk e-post 2 kl. 09:00.
 * - `noelperez9224@smaqt.com` fikk e-post 1 11.10 kl. 07:00.
 *
 * KOSTNADEN ER IKKE BARE PINLIG. Påls eget domene sender til søppel- og
 * engangsadresser, og det er sånn man mister leveringen av de e-postene
 * som betyr noe.
 *
 * TO VEIER INN, OG DE FANGER FORSKJELLIGE TING:
 *
 * 1. **Adressen.** `mailinator.com` og `example.no` er aldri en kunde.
 *    Gratis å sjekke, og den eneste som virker før noen har vurdert
 *    leadet.
 * 2. **Salgsassistentens vurdering i HubSpot.** Spam merkes ved at avtalen
 *    settes til Tapt og får «SPAM – » foran navnet, eller ved at kontakt
 *    og avtale slettes helt. `golnaz.tandorost@gmail.com` er en vanlig
 *    gmail-adresse — bare denne veien fanger den.
 *
 * DENNE FILA ER REN OG TESTES UTEN NETT. Oppslagene ligger i
 * lib/leadutsending.ts, som gjør dem live i samme kjøring som sendingen.
 */
import { epostdomene } from "./spam";

/**
 * Engangs- og eksempeldomener. Én konstant, så den er lett å utvide.
 *
 * ET NAVN SOM SLUTTER PÅ `.*` TREFFER ALLE TOPPDOMENER: `tempmail.*`
 * dekker `tempmail.com`, `tempmail.net` og de tjue andre den tjenesten
 * bytter mellom. Alt annet må stemme helt.
 *
 * LISTEN ER IKKE DEN STORE ENGANGSLISTEN. Skjemaet på nettsiden sjekker
 * mot pakken `disposable-email-domains` og dens 121 570 domener — se
 * lib/spamoppslag.ts. Den hører til der, foran døra. Dette er den korte
 * listen over det vi faktisk har sett i innboksen, og `example.no` og
 * `smaqt.com` står ikke på den store.
 */
export const ENGANGSDOMENER = [
  "example.com",
  "example.no",
  "example.org",
  "mailinator.com",
  "smaqt.com",
  "guerrillamail.*",
  "10minutemail.*",
  "yopmail.com",
  "tempmail.*",
  "trashmail.*",
  "sharklasers.com",
];

/** Treffer domenet et mønster i listen? `navn.*` treffer alle toppdomener. */
function treffer(domene: string, monster: string): boolean {
  if (!monster.endsWith(".*")) return domene === monster;
  const stamme = monster.slice(0, -1); // «tempmail.»
  return domene.startsWith(stamme) && domene.length > stamme.length;
}

export function erEngangsdomene(epost: string): boolean {
  const domene = epostdomene(epost);
  if (!domene) return false;
  return ENGANGSDOMENER.some((m) => treffer(domene, m));
}

/** Stadiet salgsassistenten setter på spam. «Tapt» i pipelinen. */
export const TAPT_STADIUM = "closedlost";

/**
 * Er dette navnet salgsassistentens spam-merking?
 *
 * PREFIKSET ER «SPAM – » MED TANKESTREK, kontrollert i HubSpot 12.10.2026
 * på avtalene 525998356680 og 526037736636. Vi ser bare på de fire første
 * bokstavene, så en merking med bindestrek, kolon eller ingenting treffer
 * like godt.
 */
export function erSpamnavn(navn: string): boolean {
  return navn.trim().toLowerCase().startsWith("spam");
}

export type Spamgrunn =
  | "slettet"
  | "spam-avtale"
  | "tapt-avtale"
  | "engangsdomene";

/** Grunnen skrevet ut, til logglinja og til oversikten. */
export function spamtekst(grunn: Spamgrunn): string {
  switch (grunn) {
    case "slettet":
      return "kontakten er slettet i HubSpot";
    case "spam-avtale":
      return "avtalen er merket SPAM";
    case "tapt-avtale":
      return "avtalen står i Tapt";
    case "engangsdomene":
      return "engangs- eller eksempeladresse";
  }
}

/** Det sjekken trenger å vite. Alt hentet live, i samme kjøring. */
export type Spamspor = {
  epost: string;
  /**
   * Finnes kontakten fortsatt i HubSpot?
   *
   * `null` BETYR AT VI IKKE FIKK SJEKKET, og det er ikke det samme som
   * slettet. En nettverksfeil skal ikke se ut som en dom. Se
   * `spamgrunn` for hva som skjer da.
   */
  finnes: boolean | null;
  /** Navn og stadium på avtalene som henger på kontakten. */
  avtaler: { navn: string; stadium: string }[];
};

/**
 * Skal e-posten stoppes, og hvorfor?
 *
 * ADRESSEN FØRST, OG DET ER MED VILJE. Den koster ingenting å sjekke, den
 * krever ingenting fra HubSpot, og `mailinator.com` er ikke en kunde
 * uansett hva CRM-et måtte mene. Står HubSpot nede, er dette den eneste
 * sjekken som fortsatt virker — og den som kaller bruker samme rekkefølge,
 * så den slipper å spørre om avtaler for en adresse som er dømt uansett.
 *
 * DERETTER DET NOEN HAR BESTEMT: slettet kontakt, så merket avtale, så
 * Tapt. Står flere, er det den øverste som havner i loggen.
 *
 * `finnes === null` GIR INGEN GRUNN HERFRA. Da vet vi ikke om kontakten er
 * slettet, og avtalene fikk vi heller ikke lest. Den som kaller stopper
 * sendingen likevel — men UTEN å merke kontakten, slik at neste kjøring
 * prøver på nytt. Ellers ville ett sekund med nettverksfeil drept
 * oppfølgingen av et ekte lead for godt.
 *
 * TO STEDER SKAL IKKE SVARE FORSKJELLIG PÅ DET SAMME. Derfor bor hele
 * rekkefølgen her, og ikke spredt utover jobben — den feilen er gjort før,
 * se `paaminnelseStoppet` i lib/leadepost.ts.
 */
export function spamgrunn(spor: Spamspor): Spamgrunn | null {
  if (erEngangsdomene(spor.epost)) return "engangsdomene";

  if (spor.finnes === false) return "slettet";
  if (spor.finnes === null) return null;

  if (spor.avtaler.some((a) => erSpamnavn(a.navn))) return "spam-avtale";
  if (spor.avtaler.some((a) => a.stadium === TAPT_STADIUM)) return "tapt-avtale";

  return null;
}
