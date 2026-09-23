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

export type Mal = {
  slug: string;
  navn: string;
  /** Én setning på kortet. Hva dokumentet er til for. */
  kort: string;
  /** Rollen som vanligvis lager det. Aldri et personnavn. */
  ansvarlig: string;
  /** Når i løpet man lager det. Konkret tidspunkt, ikke «ved behov». */
  naar: string;
  skisse: readonly Skissedel[];
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
