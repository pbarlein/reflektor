/**
 * Sentralisert innhold for reflektor.no.
 *
 * Teksten her er HENTET FRA DAGENS SIDE via Ahrefs Site Audit-crawl
 * (prosjekt 10162201, crawlet 2026-08-18), ikke skrevet på nytt. Se
 * docs/kontekst.md for full analyse av budskap og tone of voice.
 *
 * Skal teksten endres: behold stemmen. Den er påfallende konsistent og
 * uvanlig for bransjen – konkrete tall, åpen pris, og eksplisitt om hva som
 * IKKE inngår. Ikke bytt den mot generisk byråspråk.
 */

export const site = {
  navn: "Reflektor",
  domene: "https://www.reflektor.no",
  sprak: "nb-NO",

  // H1 på forsiden. Kursiveringen av «nesten» er bevisst – den signaliserer
  // ærlighet om at kunden fortsatt må stille med folk og lokasjon.
  overskrift: "Sosiale medier – nesten på autopilot.",
  taglineKort: "Sosiale medier på fast pris – Instagram og Facebook",

  ingress:
    "1 produksjonsdag → 4 uker med innhold. Et SoMe-byrå for bedrifter som " +
    "vil være synlige hele året – uten å bruke hverdagen på det. Vi tar " +
    "strategi, produksjon, redigering og publisering på Instagram og " +
    "Facebook. To poster i uka, hele året.",

  kontakt: {
    sted: "Oslo",
    // UAVKLART – e-post, telefon og org.nr. ligger i footeren på dagens side,
    // men fanges ikke av crawlen. Må fylles inn manuelt.
    epost: "",
    telefon: "",
    orgnr: "",
  },

  // Brukes i Organization-schema. Gaselle-status er et konkret tillitssignal.
  omOss:
    "Reflektor holder til i Oslo. Bakgrunnen vår er foto- og " +
    "videoproduksjon, og produsentene som lager innholdet ditt har gjort " +
    "dette for noen av Norges mest kjente merkevarer. Reflektor ble kåret " +
    "til Gaselle-bedrift av Dagens Næringsliv i 2025.",
} as const;

/** Prisen står åpent på dagens side. Det er et bevisst posisjoneringsvalg. */
export const tilbud = {
  prisPerManed: 30000,
  valuta: "NOK",
  produksjonsdagerPerManed: 1,
  videoerPerManed: "8–10",
  posterPerUke: 2,
  kanaler: ["Instagram", "Facebook"],
  strategiforslagVirkedager: 3,
  /** Ekstra produksjonsdag for reklamefilm, produktfoto o.l. */
  ekstraProduksjonsdag: 30000,

  inngar: [
    "Produksjon av SoMe-strategi og produksjonsplaner",
    "Én produksjonsdag per måned hos dere, hos oss eller ute på lokasjon",
    "Produksjonsmål: 8–10 videoer ferdig redigert per måned",
    "Publisering til Instagram 2 ganger per uke med krysspublisering til Facebook",
    "Teksting og fargekorrigering",
    "Fri bruk av alt innhold – annonser, nettsider, skjermer, presentasjoner",
  ],

  /**
   * Like viktig som hva som inngår. Dagens side er eksplisitt på dette, og
   * begrunner det: «Vi sier dette tydelig fordi SoMe-byrå betyr ulike ting
   * hos ulike leverandører.» Ikke fjern denne seksjonen for å virke mer
   * imøtekommende – ærligheten er selve salgsargumentet.
   */
  inngarIkke: [
    "Håndtering av kommentarfelt og meldinger",
    "Stories",
    "Betalt annonsering og annonsebudsjetter",
  ],

  vilkar: [
    "Ingen timepriser",
    "Ingen bindingstid utover ordinær oppsigelsesfrist",
    "Ingen etterfakturering eller tillegg for ekstra runder",
  ],
} as const;

/** Arbeidsprosessen slik den presenteres på forsiden. */
export const prosess = [
  {
    navn: "Strategi",
    tekst:
      "Hvem dere skal nå, hva dere skal si, hvordan det skal se ut. " +
      "Strategien styrer alt vi produserer.",
  },
  {
    navn: "Produksjon",
    tekst:
      "Én dag i måneden kommer vi til dere med kamera, lys og kjøreplan. " +
      "Planen får dere i god tid – forberedelsene deres er små og tydelige.",
  },
  {
    navn: "Publisering",
    tekst:
      "Vi klipper, tekster og publiserer to ganger i uka på Instagram og " +
      "Facebook, hele året. Dere godkjenner før noe går ut.",
  },
] as const;

/** Prinsippene fra /om-oss. Kortformene er gode og bør beholdes. */
export const prinsipper = [
  {
    navn: "Rytme slår skippertak",
    tekst:
      "Én produksjonsdag i måneden. Publisering to ganger i uka, 52 uker i året.",
  },
  {
    navn: "Full åpenhet",
    tekst:
      "Fast pris – 30 000 kr/mnd. Ingen bindingstid utover oppsigelsesfrist. " +
      "Fri bruk av alt innhold som leveres.",
  },
  {
    navn: "Organisk som kompass",
    tekst:
      "Prestasjonen på organiske poster er en løpende A/B-test av hva som bør " +
      "prioriteres i deres betalte kanaler.",
  },
] as const;

export const team = [
  { navn: "Pål Barlein", rolle: "CEO" },
  { navn: "Magne Finseth da Fonseca", rolle: "Produsent & kundeansvarlig" },
  { navn: "Henrik Holthe", rolle: "Produsent & kundeansvarlig" },
  { navn: "Viktor Norén", rolle: "Produsent & kundeansvarlig" },
] as const;

export type Landingsside = {
  slug: string;
  navn: string;
  tittel: string;
  ingress: string;
  annonsegruppe?: string;
  status: "live" | "under-bygging";
};

/**
 * KRITISK: slugene ligger på rotnivå fordi det er URL-ene Google Ads og
 * Google Business Profile peker på. Ikke flytt dem (docs/kontekst.md).
 */
export const landingssider: Landingsside[] = [
  {
    slug: "sosiale-medier-byra",
    navn: "Pris",
    tittel: "Sosiale medier-byrå i Oslo med fast pris",
    ingress:
      "Reflektor tar hele jobben med bedriftens sosiale medier for " +
      "30 000 kr/mnd. Strategi, produksjon, redigering og publisering. " +
      "Ingen timepriser. Ingen bindingstid utover ordinær oppsigelsestid.",
    annonsegruppe: "SoMe-byrå",
    status: "live",
  },
  {
    slug: "innholdsproduksjon",
    navn: "Innholdsproduksjon",
    tittel: "Innholdsproduksjon og video for bedrifter",
    ingress: "Én dag hos dere. En måned med innhold.",
    annonsegruppe: "Innhold og video",
    status: "live",
  },
  {
    slug: "reklamefilm",
    navn: "Reklamefilm",
    tittel: "Reklamefilm",
    // UAVKLART – siden var ikke publisert da crawlen kjørte 2026-08-18.
    ingress: "Film som fungerer i feeden – fra idé til ferdig klipp.",
    annonsegruppe: "Reklamefilm",
    status: "under-bygging",
  },
];

/**
 * Eldre landingssider som fortsatt svarer 200. Beholdes så de ikke blir 404.
 */
export const eldreLandingssider: Landingsside[] = [
  {
    slug: "videoproduksjon-i-oslo",
    navn: "Videoproduksjon i Oslo",
    tittel: "Videoproduksjon i Oslo",
    ingress: "Videoproduksjon på månedlig basis for bedrifter i Oslo-området.",
    status: "live",
  },
  {
    slug: "employer-branding-video-oslo",
    navn: "Employer branding-video",
    tittel: "Employer branding video i Oslo",
    ingress:
      "Operativ partner for HR. Video som forankrer verdier i praksis, og " +
      "onboarding som gir raskere tilhørighet.",
    status: "live",
  },
  {
    slug: "eventfotograf-eventvideo",
    navn: "Eventfotograf og -videograf",
    tittel: "Eventfotograf og -videograf",
    ingress: "Dekning av arrangementer – foto og video fra eventet ditt.",
    status: "live",
  },
];

export const alleLandingssider = [...landingssider, ...eldreLandingssider];

export type Case = { slug: string; kunde: string; ingress: string };

/** Publiserte kundecaser på /vart-arbeid. */
export const caser: Case[] = [
  {
    slug: "egon",
    kunde: "Egon",
    ingress: "Foto og video på månedlig basis.",
  },
  {
    slug: "anton-sport",
    kunde: "Anton Sport",
    ingress: "Foto og video på månedlig basis.",
  },
];

/**
 * Bloggslugs. MÅ IKKE ENDRES.
 *
 * Beholdes for lenkeverdien (~481 refererende domener). Innholdet er
 * ordbok- og skoleoppgavestoff som ikke konverterer, og skal ikke utvides.
 */
export const bloggSlugs = [
  "hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de",
  "hva-innebaerer-digital-historiefortelling",
  "markedsforing-i-sosiale-medier-some",
  "hvordan-markedsfore-bedrift",
  "hva-er-holdningskampanje",
  "hva-er-reklame",
  "hva-er-innholdsmarkedsforing",
  "hva-er-inbound-marketing",
  "hva-er-employer-branding",
  "hva-er-innholdsproduksjon",
  "hva-er-personas",
  "hva-er-videomarkedsfring",
  "hva-gjr-en-innholdsprodusent",
  "hva-er-visuell-identitet",
  "hva-er-digital-markedsforing",
  "hvordan-ta-portrett-bilder",
  "hva-koster-et-some-byra",
] as const;
