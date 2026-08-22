/**
 * Sentralisert innhold for reflektor.no.
 *
 * ALT tekstinnhold bor her, ikke i komponentene, slik at tekst kan byttes ett
 * sted når budskapsplattformen foreligger (se docs/kontekst.md).
 *
 * Felt merket UAVKLART er plassholdere. De er IKKE godkjent av Reflektor og
 * er utledet av nøkkeltall – ikke av faktisk sidetekst, som ikke kan leses
 * herfra (nettverksblokkering, se docs/kontekst.md).
 */

export const site = {
  navn: "Reflektor",
  domene: "https://www.reflektor.no",
  sprak: "nb-NO",

  tagline: "Strategi, innhold og publisering til fast pris",

  // UAVKLART – plassholder inntil budskapsplattform foreligger.
  ingress:
    "Vi hjelper bedrifter med å bli synlige i sosiale medier – med strategi, " +
    "innholdsproduksjon og publisering samlet hos ett byrå.",

  kontakt: {
    // UAVKLART – hentes fra NAP-blokken i footeren på dagens side.
    epost: "",
    telefon: "",
    orgnr: "",
    sted: "Oslo",
  },
} as const;

/**
 * Kommersielle landingssider.
 *
 * KRITISK: disse slugene ligger på rotnivå fordi det er URL-ene Google Ads og
 * Google Business Profile peker på. De skal ikke flyttes inn under et
 * /tjenester/-hierarki – første utkast gjorde det og ville sendt betalt
 * trafikk bort fra sidene den er kjøpt inn til (docs/kontekst.md).
 *
 * Rekkefølgen speiler annonsegruppene i Google Ads.
 */
export type Landingsside = {
  slug: string;
  navn: string;
  ingress: string;
  /** Tilsvarende annonsegruppe i Google Ads, der det finnes. */
  annonsegruppe?: string;
  status: "live" | "under-bygging";
};

export const landingssider: Landingsside[] = [
  {
    slug: "sosiale-medier-byra",
    navn: "Sosiale medier",
    // UAVKLART – erstattes med faktisk tekst fra siden.
    ingress:
      "Strategi, innhold og publisering i kanalene der kundene deres allerede er.",
    annonsegruppe: "SoMe-byrå",
    status: "live",
  },
  {
    slug: "innholdsproduksjon",
    navn: "Innhold og video",
    ingress:
      "Jevn tilgang på innhold som holder kanalene levende gjennom hele året.",
    annonsegruppe: "Innhold og video",
    status: "live",
  },
  {
    slug: "reklamefilm",
    navn: "Reklamefilm",
    ingress: "Film som fungerer i feeden – fra idé til ferdig klipp.",
    annonsegruppe: "Reklamefilm",
    status: "under-bygging",
  },
];

export type Case = { slug: string; kunde: string; ingress: string };

/**
 * Kundecaser under /vart-arbeid. Kun Egon er bekreftet publisert.
 *
 * /matogdrikke/oda, /orkla og /wolt gir 404 i dag – mulige caser som har
 * falt ut. Bør sjekkes mot snapshotene når de foreligger.
 */
export const caser: Case[] = [
  { slug: "egon", kunde: "Egon", ingress: "Foto og video for restaurantkjeden." },
];

/**
 * Bloggslugs fra dagens side. MÅ IKKE ENDRES.
 *
 * Bloggen beholdes utelukkende for lenkeverdien – ~481 refererende domener er
 * ekte autoritet. Innholdet er ordbok- og skoleoppgavestoff som ikke
 * konverterer, og studenttrafikk er ikke en KPI. Bloggen skal derfor ikke
 * utvides med mer av samme type, og skal ikke styre arkitekturen.
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

/**
 * Eldre landingssider som fortsatt svarer 200 på dagens side.
 *
 * De er ikke nevnt i 2026-arbeidet og er ikke annonsegrupper, men de er live
 * og noen har rangeringer (/eventfotograf-eventvideo på «videograf», pos. 10).
 * Rutene beholdes derfor så de ikke blir 404. Om de skal konsolideres inn i de
 * tre primære landingssidene avgjøres når snapshotene viser innholdet.
 */
export const eldreLandingssider: Landingsside[] = [
  {
    slug: "videoproduksjon-i-oslo",
    navn: "Videoproduksjon i Oslo",
    ingress: "Videoproduksjon for bedrifter i Oslo-området.",
    status: "live",
  },
  {
    slug: "employer-branding-video-oslo",
    navn: "Employer branding-video",
    ingress: "Onboarding- og kulturfilm som viser fram arbeidsplassen.",
    status: "live",
  },
  {
    slug: "eventfotograf-eventvideo",
    navn: "Eventfotograf og -videograf",
    ingress: "Dekning av arrangementer, klart til publisering samme uke.",
    status: "live",
  },
];

export const alleLandingssider = [...landingssider, ...eldreLandingssider];
