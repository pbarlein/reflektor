/**
 * Maler for «Lag dokument».
 *
 * ── HVA DETTE ER, OG HVA DET IKKE ER ──────────────────────────────────────
 *
 * Dette er ikke en dokumentgenerator som produserer ferdig tekst selv. Det
 * er et skjema som samler NØYAKTIG den informasjonen et dokument trenger,
 * og setter den sammen med Reflektors egen standard til én instruks du gir
 * til Claude.
 *
 * Grunnen til at skjemaet finnes i det hele tatt: forskjellen på et brukbart
 * og et ubrukelig dokument er nesten aldri formuleringene. Det er at noen
 * glemte publiseringsmåneden, eller hvem som stiller fra kunden, eller at
 * skjermklippene ikke kan ha teksting. Et skjema glemmer ikke.
 *
 * ── FORMATET ER HENTET, IKKE FUNNET PÅ ────────────────────────────────────
 *
 * Produksjonsplanen er modellert på den faktiske planen Reflektor sendte
 * Jordbærpikene 18.09.2026 (`Jordbaerpikene_Storo_Reflektor_Produksjonsplan_2.pdf`,
 * ligger i Dropbox under Assets/Jordbærpikene). Rekkefølgen på seksjonene,
 * oppdelingen i SoMe-leveranse og skjermleveranse, og «hva vi trenger fra
 * kunden» med tidsbruk per person — alt er derfra.
 *
 * Endrer Reflektor formatet, er det `oppdrag` og `struktur` som skal
 * oppdateres. Ikke skjemaet.
 */

export type Feltype =
  /** Én linje. */
  | "tekst"
  /** Flere linjer. Brukes der svaret er en liste eller en beskrivelse. */
  | "lang"
  /** ISO-dato fra en datovelger. */
  | "dato"
  /** Én av `valg`. */
  | "valg"
  /** Null eller flere av `valg`. */
  | "flervalg";

export type Felt = {
  id: string;
  etikett: string;
  type: Feltype;
  /**
   * Én linje under etiketten. Skal si hva som faktisk skal stå — ikke
   * gjenta etiketten. «Kokk · 2 timer, caféeier · 30 min» er hjelp.
   * «Fyll inn hvem som trengs» er det ikke.
   */
  hjelp?: string;
  plassholder?: string;
  /**
   * Feltet MÅ fylles ut før instruksen kan lages. Bruk det bare der
   * dokumentet blir feil uten — ikke der det bare blir tynnere.
   */
  paakrevd?: boolean;
  valg?: readonly string[];
  standard?: string;
  /**
   * Verdien «Fyll inn eksempel» setter.
   *
   * ── HVORFOR DEN IKKE ER DEN SAMME SOM `plassholder` ───────────────────
   *
   * En plassholder er en antydning som skal forsvinne så snart man skriver.
   * Et eksempel er et helt svar, som skal vise hvor mye som hører hjemme i
   * feltet. For de fleste felt er de like nok til at plassholderen brukes
   * som eksempel, og da står det ikke noe her.
   *
   * Den står her når eksempelet må være lengre enn en antydning, eller når
   * det skal vise noe annet enn standardvalget — for eksempel at et
   * flervalg kan ha to avkryssinger.
   */
  eksempel?: string;
  /**
   * Datofelt: eksempelet er så mange dager fram i tid. Negativt er bakover.
   * En fast dato i et eksempel er feil dato fra og med dagen etter.
   */
  eksempelDager?: number;
  /**
   * Feltet er GRUNNLAG, ikke innhold.
   *
   * ── HVORFOR DET MÅTTE SKILLES ─────────────────────────────────────────
   *
   * Et Instagram-brukernavn og en lenke til SoMe-strategien styrer hva
   * Claude undersøker før dokumentet skrives. De skal aldri stå i
   * dokumentet selv — kunden vet hva kontoen sin heter, og en
   * produksjonsplan med en Canva-lenke i seg er en plan med en arbeidsnotis
   * limt inn.
   *
   * Uten dette skillet havnet slike felt under INFORMASJONEN sammen med
   * oppmøtetid og kontaktperson, og da er det bare et spørsmål om tid før
   * ett av dem dukker opp i en tabellcelle hos kunden.
   */
  grunnlag?: true;
};

/**
 * Blokktyper i miniatyren.
 *
 * Miniatyren tegnes av disse, ikke av et bilde. Da kan den aldri komme ut
 * av takt med malen den viser, og den koster null kilobyte.
 */
export type Skissedel =
  | "topp"
  | "fakta"
  | "tabellOgBoks"
  | "tabell"
  | "toKolonner"
  | "kort3"
  | "avsnitt"
  | "liste"
  | "signatur";

/**
 * Fasen i produksjonen malen hører til.
 *
 * ── HVORFOR MALENE ER GRUPPERT OG IKKE BARE LISTET ────────────────────────
 *
 * Malverket her skal dekke produksjon, og bare produksjon. Kundeavtaler,
 * pris, honorar og oppsigelse hører hjemme i tjenesteavtalen, som daglig
 * leder eier — ikke i et skjema en produsent fyller ut mellom to opptak.
 *
 * Fasen er hvordan den grensen holdes synlig. Et dokument som ikke passer
 * inn i «før, på eller etter opptak», er sannsynligvis ikke et
 * produksjonsdokument, og skal da ikke lages her.
 */
export type Fase = "Før opptak" | "På opptak" | "Etter opptak";

export const FASER: readonly Fase[] = [
  "Før opptak",
  "På opptak",
  "Etter opptak",
];

export type Mal = {
  slug: string;
  navn: string;
  /** Hvor i produksjonen dokumentet hører hjemme. Styrer grupperingen. */
  fase: Fase;
  /** Én setning på kortet. Hva dokumentet er til for. */
  kort: string;
  /** Rollen som vanligvis lager det. Aldri et personnavn. */
  ansvarlig: string;
  /** Når i løpet man lager det. Konkret tidspunkt, ikke «ved behov». */
  naar: string;
  skisse: readonly Skissedel[];
  /**
   * Malen tar imot et dokument som hovedinngang.
   *
   * ── HVORFOR OPPLASTING SLÅR SKJEMA FOR NOEN MALER ─────────────────────
   *
   * Opptakslisten bygges bakover fra produksjonsplanen. Skriver produsenten
   * den av inn i et skjema, gjør hen to ting: bruker tid på å gjengi noe
   * som allerede finnes, og bestemmer underveis hva som er verdt å ta med.
   * Det siste er det farlige — det som ikke blir skrevet av, finnes ikke
   * for den som lager listen.
   *
   * Er planen lastet opp, har Claude hele grunnlaget. Derfor ligger
   * opplastingen først, og feltene er noe man må be om å få se.
   */
  opplasting?: {
    /** Over opplastingsfeltet. Sier hvilket dokument som hører hjemme her. */
    etikett: string;
    /** Én linje under. Hva Claude bruker det til. */
    hjelp: string;
  };
  /** Slugger til rubrikker som styrer innholdet. Vises som lenker. */
  rubrikker?: readonly string[];
  felt: readonly Felt[];
  /** Hva dokumentet er. Første linje i instruksen til Claude. */
  oppdrag: string;
  /** Seksjonene dokumentet skal ha, i rekkefølge. */
  struktur: readonly string[];
  /** Regler som gjelder denne maltypen spesielt. */
  regler?: readonly string[];
};
