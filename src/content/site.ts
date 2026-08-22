/**
 * Sentralisert innhold for reflektor.no.
 *
 * ALT tekstinnhold bor her, ikke i komponentene. Grunnen er at strategi, tone
 * of voice og budskap ennå ikke er avklart (se docs/kontekst.md) – når det
 * kommer skal teksten kunne byttes ett sted uten å røre markup.
 *
 * Felt merket UAVKLART er plassholdere utledet av dagens nettside via
 * SEO-analyse. De er ikke godkjent av Reflektor og må erstattes.
 */

export const site = {
  navn: "Reflektor",
  domene: "https://www.reflektor.no",
  sprak: "nb-NO",

  // Fra dagens title-tag – den eneste posisjoneringen vi har belegg for.
  tagline: "Strategi, innhold og publisering til fast pris",

  // UAVKLART – plassholder inntil budskapsplattform foreligger.
  ingress:
    "Vi hjelper bedrifter med å bli synlige i sosiale medier – med strategi, " +
    "innholdsproduksjon og publisering samlet hos ett byrå.",

  kontakt: {
    // UAVKLART – e-post og telefon må fylles inn.
    epost: "",
    telefon: "",
    sted: "Oslo",
  },
} as const;

export type Tjeneste = {
  slug: string;
  navn: string;
  ingress: string;
  /** Søkeord vi vet er relevante, fra Ahrefs. Styrer tekst og metadata. */
  sokeord?: string[];
};

/**
 * Tjenestestrukturen er ny. Dagens /tjenester/* er 100 % 404, så vi har
 * ingen rangeringer å miste her og står fritt (docs/kontekst.md).
 */
export const tjenester: Tjeneste[] = [
  {
    slug: "sosiale-medier",
    navn: "Sosiale medier",
    ingress:
      "Strategi, innhold og publisering i kanalene der kundene deres allerede er.",
    sokeord: ["some markedsføring", "markedsføring i sosiale medier"],
  },
  {
    slug: "innholdsproduksjon",
    navn: "Innholdsproduksjon",
    ingress:
      "Jevn tilgang på innhold som holder kanalene levende gjennom hele året.",
    sokeord: ["innholdsproduksjon", "innholdsmarkedsføring"],
  },
  {
    slug: "videoproduksjon",
    navn: "Videoproduksjon",
    ingress: "Film som fungerer i feeden – fra idé til ferdig klipp.",
    sokeord: ["videoproduksjon oslo", "videograf"],
  },
  {
    slug: "employer-branding",
    navn: "Employer branding",
    ingress:
      "Vis fram arbeidsplassen slik at de rette folkene søker seg til dere.",
    sokeord: ["employer branding"],
  },
  {
    slug: "event-foto-video",
    navn: "Event­foto og -video",
    ingress: "Dekning av arrangementer, klart til publisering samme uke.",
    sokeord: ["eventfotograf", "videograf"],
  },
  {
    slug: "foto",
    navn: "Foto",
    ingress: "Produktfoto, bedriftsfoto og portretter av ansatte.",
    sokeord: ["produktfoto", "bedriftsfoto"],
  },
];

/**
 * Bloggslugs fra dagens side. MÅ IKKE ENDRES – bloggen bærer all
 * ikke-brandtrafikk (docs/kontekst.md). Tekstinnholdet skal migreres fra
 * Squarespace; her ligger bare rutingen.
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

export type Case = { slug: string; kunde: string; ingress: string };

/**
 * Kundecaser. Kun Egon er publisert på dagens side.
 *
 * Merk: /matogdrikke/oda, /matogdrikke/orkla og /matogdrikke/wolt gir 404 i
 * dag – det kan være caser som har falt ut. Bør sjekkes mot Reflektor.
 */
export const caser: Case[] = [
  {
    slug: "egon",
    kunde: "Egon",
    ingress: "Foto og video for restaurantkjeden.",
  },
];
