import type { KategoriId } from "./kategorier.ts";

/**
 * Rubrikkene — alt innhold i huben.
 *
 * ── GODKJENT / UGODKJENT ──────────────────────────────────────────────────
 *
 * `godkjent: false` betyr at teksten er et fagutkast: den bygger på kilder
 * som er oppgitt, men den er ikke vedtatt av Reflektor. Den vises med rød
 * merkelapp og et felt som sier hvilken rolle som må kvalitetssikre.
 *
 * Grunnen er ikke formell. Innholdet her er instrukser folk FØLGER — på en
 * produksjonsdag, hos en kunde, med kameraet i hånda. Feil rutine er dyrere
 * enn feil salgstekst.
 *
 * `godkjent: true` er reservert for tekst som er HENTET og ikke skrevet:
 * Påls egne ord, eller tall fra `src/content/site.ts` i hovedprosjektet.
 *
 * ── KILDER ────────────────────────────────────────────────────────────────
 *
 * `kilder` er ikke pynt. Forskjellen på en fagtekst og en mening er at
 * fagteksten kan etterprøves. Alt som er en PÅSTAND OM VERDEN — en
 * plattformspesifikasjon, et tall, et forskningsfunn — skal kunne følges
 * tilbake til noe som ikke er oss.
 *
 * Plattformtall er ferskvare. Derfor står `sjekket` på hver kilde: ser
 * leseren at spesifikasjonen ble sjekket for ni måneder siden, vet hen at
 * den skal verifiseres før den brukes til noe som betyr noe.
 *
 * ── OPPSUMMERING ──────────────────────────────────────────────────────────
 *
 * Hver tekst åpner med tre til seks punkter. Hvert punkt peker på en
 * seksjon lenger nede via `anker`, som MÅ matche `id` på en seksjonsblokk.
 * Det er ikke en innholdsfortegnelse for pynt: den som allerede kan det
 * meste, skal kunne hoppe rett til den ene tingen hen var usikker på.
 */

export type Blokk =
  /**
   * Overskrift med anker. Målet for et oppsummeringspunkt.
   *
   * `id` MÅ være unik i teksten og matche et `anker` i oppsummeringen.
   * Testene feiler hvis et anker peker i tomme luften — en lenke som ikke
   * hopper noe sted er verre enn ingen lenke.
   */
  | { type: "seksjon"; id: string; tittel: string }
  | { type: "avsnitt"; tekst: string }
  | { type: "punkter"; punkter: readonly string[] }
  | { type: "sjekkliste"; tittel?: string; punkter: readonly string[] }
  | { type: "steg"; steg: readonly { tittel: string; tekst: string }[] }
  /**
   * Tabell. Brukes der forskjeller mellom bransjer eller formater er
   * poenget — en tabell sier «disse er ikke like» tydeligere enn tre
   * avsnitt etter hverandre.
   */
  | {
      type: "tabell";
      kolonner: readonly string[];
      rader: readonly (readonly string[])[];
    }
  /**
   * Tegnet figur. Brukes der innholdet er en SPESIFIKASJON og ikke en
   * smakssak — safe zone, utsnitt, bildeutsnitt. En tegning viser regelen
   * selv; en video viser bare noen som følger den. Se Figur.tsx.
   */
  | { type: "figur"; navn: "trygg-sone" | "utsnitt" | "bildeutsnitt"; tekst: string }
  /** Kort advarsel eller presisering. Rammet inn, ett sted i teksten. */
  | { type: "merknad"; tekst: string }
  | { type: "sitat"; tekst: string; kilde: string };

export type Medie = {
  type: "video" | "bilde";
  /** Sti under /medier, uten filendelse. Video forutsetter .mp4 + .jpg. */
  fil: string;
  alt: string;
};

export type Kilde = {
  tittel: string;
  url: string;
  /** ISO-dato. Når noen sist verifiserte at kilden sier det vi sier den sier. */
  sjekket: string;
};

export type Punkt = {
  tekst: string;
  /** Må matche `id` på en seksjonsblokk i `innhold`. */
  anker: string;
};

export type Rubrikk = {
  slug: string;
  tittel: string;
  /** Én til to setninger. Dette er alt kortet viser av innholdet. */
  sammendrag: string;
  kategori: KategoriId;
  medie: Medie;
  /** ISO-dato. Vises som «oppdatert» og brukes til sortering på nyhet. */
  oppdatert: string;
  /** Anslått lesetid i minutter. */
  lesetid: number;
  godkjent: boolean;
  /** Rolle som eier rutinen og må kvalitetssikre den. Aldri et personnavn. */
  ansvarlig: string;
  /** Kun på godkjente rubrikker: hvor innholdet kommer fra. */
  kilde?: string;
  /**
   * Redaksjonell rekkefølge INNENFOR kategorien. Høyere tall = lenger til
   * venstre i raden, altså synlig uten å bla. De fem første er de som
   * faktisk blir lest, så tallet er en redaksjonell beslutning og ikke en
   * sorteringsdetalj.
   */
  prioritet: number;
  oppsummering: readonly Punkt[];
  innhold: readonly Blokk[];
  kilder?: readonly Kilde[];
};
