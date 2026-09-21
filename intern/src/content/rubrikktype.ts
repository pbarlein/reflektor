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
  | {
      type: "figur";
      navn: "trygg-sone" | "utsnitt" | "bildeutsnitt";
      tekst: string;
    }
  /**
   * Innebygd eksempel fra Instagram. Brukes der en teknikk må SES for å
   * forstås, og der vårt eget arbeid ville bundet forklaringen til én
   * måte å gjøre det på. Se Eksempel.tsx for hvorfor det er offisiell
   * innbygging og ikke en kopi.
   */
  | { type: "eksempel"; data: Eksempeldata }
  /** Kort advarsel eller presisering. Rammet inn, ett sted i teksten. */
  | { type: "merknad"; tekst: string }
  | { type: "sitat"; tekst: string; kilde: string };

/**
 * ── `nr` ──────────────────────────────────────────────────────────────────
 *
 * Et permanent, unikt tall per rubrikk. Det er IKKE en rekkefølge og skal
 * aldri vises. Det finnes av én grunn: lesestatus lagres som en bitmaske i
 * en informasjonskapsel, og bitmasken trenger en fast posisjon per rubrikk.
 *
 * TO REGLER, OG BEGGE ER VIKTIGE:
 *
 *   1. Et `nr` skal aldri endres. Gjør du det, flytter du lesestatusen til
 *      alle ansatte over på en annen rubrikk.
 *   2. Et `nr` skal aldri gjenbrukes. Slettes en rubrikk, blir tallet
 *      liggende tomt. Gjenbruk gir nye ansatte en rubrikk som allerede er
 *      huket av.
 *
 * Alternativet var å lagre slugger. Femti slugger er rundt 1 200 byte som
 * sendes med HVER forespørsel, også bilder og video. Bitmasken er sju.
 */
export type Medie = {
  type: "video" | "bilde";
  /** Sti under /medier, uten filendelse. Video forutsetter .mp4 + .jpg. */
  fil: string;
  alt: string;
};

/**
 * Et innebygd eksempel fra Instagram.
 *
 * ── TO REGLER FOR HVA SOM KAN STÅ HER ─────────────────────────────────────
 *
 * 1. KONTOEN SKAL VÆRE ET SELSKAP SOM SELGER NOE. Ikke en kokk, ikke en
 *    reiseskribent, ikke en skaper som lever av rekkevidden sin. En
 *    produsent som ser et matlagingsklipp med tjue millioner visninger,
 *    tenker med rette: «fint, men hva gjør jeg med en hudklinikk, en
 *    isbutikk, et konsulentselskap eller et bemanningsbyrå?» Eksempelet
 *    skal svare på det spørsmålet, ikke reise det.
 *
 * 2. KONTOEN SKAL VÆRE BLANT DE BESTE I VERDEN PÅ DETTE, ikke bare
 *    lokalt dyktig. `hvem` og `folgere` står der for å gjøre nettopp det
 *    tydelig: leseren skal se hvem selskapet er og hvor stort det er uten
 *    å lete.
 *
 * ── TALLENE ───────────────────────────────────────────────────────────────
 *
 * `visninger`, `likes` og `folgere` er OFFENTLIGE tall hentet med
 * Supermetrics (Instagram Public Data / Business Discovery). De skal ALDRI
 * settes for hånd — poenget med feltene er at «denne presterte godt» er
 * etterprøvbart og ikke en påstand. `hentet` er datoen tallene ble hentet;
 * de vokser etterpå, og uten dato blir de feil av seg selv.
 */
export type Eksempeldata = {
  /** Full permalenke til reelen. Kortkoden hentes ut av den. */
  url: string;
  /** Brukernavnet uten krøllalfa. */
  konto: string;
  /**
   * Én linje: hvem selskapet er, hva det selger og til hvem. Dette er
   * feltet som gjør at eksempelet treffer en produsent som skal lage
   * innhold for en kunde — ikke for en influenser.
   */
  hvem: string;
  /** Antall følgere på hentedatoen. Dokumentert, ikke anslått. */
  folgere: number;
  visninger: number;
  likes: number;
  /** ISO-dato for når tallene ble hentet. */
  hentet: string;
  /** Hva leseren skal se etter. Uten denne er det bare en fin video. */
  seEtter: string;
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
  /** Permanent og unikt. Se forklaringen over Medie. Endres aldri. */
  nr: number;
  /**
   * Satt på ÉN rubrikk om gangen, og bare når det er sant: grunnen til at
   * nettopp denne skal leses nå. Vises i «Start her» øverst på forsiden.
   *
   * At det er én, er ikke en begrensning — det er hele funksjonen. To
   * fremhevede rubrikker peker i to retninger, og da peker de ingen vei.
   * En test feiler hvis det står mer enn én.
   */
  fremhevet?: string;
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
