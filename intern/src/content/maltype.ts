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
  /**
   * Verdien feltet står på før noen rører det.
   *
   * ── EN STANDARD MÅ SI HVORDAN REFLEKTOR JOBBER ────────────────────────
   *
   * Den kan si «To personer med alt utstyr» eller «Tirsdag og torsdag».
   * Det er sant hos oss til noen endrer det.
   *
   * Den kan IKKE si noe om kunden, personen eller dagen. «Nei, bare
   * romlyd» er ikke en standard, det er en gjetning — og en gjetning som
   * står forhåndsvalgt, blir aldri lest av den som skulle overprøvd den.
   *
   * 27.09.2026 lastet en produsent opp en produksjonsplan der noen snakker
   * på film. Feltet «Er det tale på dagen» sto på «Nei, bare romlyd», som
   * ingen hadde valgt, og instruksen sa at et utfylt felt gjelder foran
   * vedlegget. Opptakslisten ble laget uten mikrofon.
   *
   * Derfor skiller serveren nå på hva produsenten har VALGT og hva som
   * bare står der. Se `byggInstruks`. Regelen over gjelder likevel: en
   * standard som er en påstand om kunden, skal ikke finnes i det hele
   * tatt, uansett hvor godt serveren håndterer den.
   */
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

/**
 * Takene en mal trenger utover standarden.
 *
 * ── HVORFOR DETTE MÅTTE FINNES ────────────────────────────────────────────
 *
 * Takene i `TAK` er regnet for en ensider: fire kolonner, sju rader. De
 * passer for en tidsplan med tre oppsett. De passer ikke for en opptaksliste.
 *
 * Opptakslisten ber om åtte kolonner — avkryssing, nummer, oppsett, utsnitt,
 * kamera, motiv, lyd, sekunder — og 8–10 opptak. Den fikk fire kolonner og
 * sju rader, og forskjellen ble kastet uten et ord. Hvert eneste opptak kom
 * ut uten kamerabevegelse, motiv, lyd og lengde, og tre av ti opptak fantes
 * ikke. Malen har en regel som sier «mangler ett, er listen ikke ferdig» —
 * og validatoren fjernet fire av dem selv.
 *
 * Bevist 28.09.2026: 8 kolonner inn, 4 ut. 10 rader inn, 7 ut.
 *
 * Taket er altså ikke én sannhet. Det er en egenskap ved dokumentet, og
 * hører hjemme på malen. Det som ikke settes her, arver `TAK`.
 */
export type Maltak = {
  rader?: number;
  kolonner?: number;
  punkter?: number;
};

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
  /** Tak som avviker fra standarden. Se `Maltak`. */
  tak?: Maltak;
  /**
   * Navn malen også skal finnes på i søket, men ikke hete.
   *
   * «Produksjonsplan» og «Opptaksliste» var to maler fram til 28.09.2026.
   * Navnene sitter i fingrene hos dem som har brukt dem i månedsvis, og en
   * produsent som skriver «opptaksliste» og får «ingen maler heter noe som
   * ligner» konkluderer med at verktøyet har mistet noe — ikke at det har
   * fått et nytt navn.
   */
  kallenavn?: readonly string[];
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
