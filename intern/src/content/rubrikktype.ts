import type { KategoriId } from "@/content/kategorier";

/**
 * Rubrikkene — alt innhold i huben.
 *
 * ── GODKJENT / UGODKJENT ──────────────────────────────────────────────────
 *
 * `godkjent: false` er STANDARD, og flagget er ikke en formalitet. AGENTS.md
 * i hovedprosjektet er utvetydig: «Ikke finn på copy, tall, kundenavn,
 * priser eller resultater», og «Claude Code ber om copy, skriver den ikke
 * selv».
 *
 * Her gjelder den regelen enda strengere enn på salgssidene, og av en annen
 * grunn. En påfunnet setning på forsiden er en påstand en kunde leser. En
 * påfunnet setning HER er en instruks en ansatt FØLGER — på en
 * produksjonsdag, hos en kunde, med kameraet i hånda. Feil rutine er dyrere
 * enn feil salgstekst.
 *
 * Derfor:
 *
 *   godkjent: false  Faglig utkast skrevet av Claude Code. Rimelig, men
 *                    IKKE Reflektors vedtatte praksis. Vises med rød
 *                    merkelapp og et felt som sier hvem som må kvalitets-
 *                    sikre den. Kan ikke forveksles med noe annet.
 *
 *   godkjent: true   Innholdet er HENTET, ikke skrevet. Enten fra Påls egne
 *                    ord, eller fra `src/content/site.ts` i hovedprosjektet.
 *                    `kilde` sier hvilket av delene, hver gang.
 *
 * Når Reflektor har gått gjennom et utkast: rett teksten, sett
 * `godkjent: true`, fyll `kilde` med hvem som godkjente og når.
 *
 * ── ANSVARLIG ER EN ROLLE, IKKE ET NAVN ───────────────────────────────────
 *
 * Feltet sier hvilken rolle som eier rutinen. Å skrive et personnavn her
 * ville vært å tildele en reell kollega en oppgave hen ikke har sagt ja til
 * — og navnet blir stående feil den dagen noen bytter rolle.
 *
 * ── MEDIE ─────────────────────────────────────────────────────────────────
 *
 * Alle filer ligger under /medier og kopieres inn fra hovedprosjektets
 * /public av `scripts/hent-medier.ts`. De er ikke sjekket inn her — se
 * LES-MEG.md for hvorfor.
 *
 * Alt-tekstene beskriver BILDET, ikke kunden. Hvilke kunder et klipp er
 * laget for, er ikke poenget i en hub om håndverk, og AGENTS.md er streng
 * på hvordan produksjonskunder omtales.
 */

export type Blokk =
  | { type: "avsnitt"; tekst: string }
  | { type: "punkter"; punkter: readonly string[] }
  | { type: "sjekkliste"; tittel?: string; punkter: readonly string[] }
  | { type: "steg"; steg: readonly { tittel: string; tekst: string }[] }
  /** Kort advarsel eller presisering. Rammet inn, ett sted i teksten. */
  | { type: "merknad"; tekst: string }
  | { type: "sitat"; tekst: string; kilde: string };

export type Medie = {
  type: "video" | "bilde";
  /** Sti under /medier, uten filendelse. Video forutsetter .mp4 + .jpg. */
  fil: string;
  alt: string;
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
  /** Rolle som eier rutinen og må kvalitetssikre den. */
  ansvarlig: string;
  /** Kun på godkjente rubrikker: hvor innholdet kommer fra. */
  kilde?: string;
  /**
   * Redaksjonell rekkefølge. Brukes FØR noen har lest noe som helst, og som
   * tiebreaker mellom to like ofte åpnede rubrikker. Høyere tall = høyere
   * opp. Se src/lib/visninger.ts for hvordan faktisk bruk overstyrer den.
   */
  prioritet: number;
  innhold: readonly Blokk[];
};
