import type { NextConfig } from "next";

/**
 * Redirect-kart fra dagens Squarespace-side.
 *
 * Bakgrunn: se docs/kontekst.md. Kort fortalt bærer bloggen hele SEO-verdien,
 * så alle /blogg/<slug> beholdes uendret og trenger ingen redirect. Det som
 * står her er opprydding i tjenestesider, kontakt-URL-er og rene feil.
 *
 * Regel: alltid pek til endelig URL. Dagens side har allerede 301-kjeder på de
 * mest trafikkerte sidene – vi skal ikke forlenge dem.
 */
const redirects: NextConfig["redirects"] = async () => [
  // --- Kontakt: /kontakt og /kontakt-oss er 404 i dag, /kontaktoss er ekte ---
  { source: "/kontaktoss", destination: "/kontakt", permanent: true },
  { source: "/kontakt-oss", destination: "/kontakt", permanent: true },

  // --- Kundecaser ---
  { source: "/vart-arbeid", destination: "/arbeid", permanent: true },
  { source: "/vart-arbeid/:slug", destination: "/arbeid/:slug", permanent: true },
  { source: "/vrt-arbeid", destination: "/arbeid", permanent: true },

  // --- Tjenester: samles under ett hierarki (var spredt på rotnivå) ---
  {
    source: "/innholdsproduksjon",
    destination: "/tjenester/innholdsproduksjon",
    permanent: true,
  },
  {
    source: "/videoproduksjon-i-oslo",
    destination: "/tjenester/videoproduksjon",
    permanent: true,
  },
  {
    source: "/employer-branding-video-oslo",
    destination: "/tjenester/employer-branding",
    permanent: true,
  },
  {
    source: "/eventfotograf-eventvideo",
    destination: "/tjenester/event-foto-video",
    permanent: true,
  },
  {
    source: "/tjenester/eventfotograf-eventvideo",
    destination: "/tjenester/event-foto-video",
    permanent: true,
  },

  // --- Gamle fototjenester: alle varianter samles på én side ---
  ...[
    "/foto",
    "/produktfoto",
    "/eiendomsfotograf",
    "/bilderavansatte",
    "/tjenester/bedriftsfoto",
    "/tjenester/bilderavansatte",
    "/tjenester/produktfoto",
    "/tjenester/eiendomsfotograf",
    "/tjenester/boligfoto",
    "/tjenester/matfotograf",
    "/tjenester/fotograf",
  ].map((source) => ({
    source,
    destination: "/tjenester/foto",
    permanent: true,
  })),

  // --- Gamle tjeneste-URL-er uten direkte etterfølger: til oversikten ---
  ...[
    "/tjenester/foto-og-video",
    "/tjenester/performance-marketing",
    "/tjenester/markedsforing",
    "/tjenester/videograf",
    "/tjenester/videoproduksjon",
    "/tjenester/innholdsproduksjon",
    "/tjenester/some-annonsering",
    "/tjenester/konverteringsoptimalisering",
    "/tjenester/betalt-sok",
    "/tjenester/seo",
  ].map((source) => ({
    source,
    destination: "/tjenester",
    permanent: true,
  })),

  // --- Personsider hadde alle title «Contact 1» – peker til om-oss ---
  { source: "/magne-finseth-da-fonseca", destination: "/om-oss", permanent: true },
  { source: "/viktor-noren", destination: "/om-oss", permanent: true },
  { source: "/jon-sverre", destination: "/om-oss", permanent: true },
  { source: "/folk", destination: "/om-oss", permanent: true },

  // --- Konvertering: skjemaet er nå en del av landingssiden ---
  {
    source: "/gratis-strategimote-kontaktskjema",
    destination: "/gratis-strategimote",
    permanent: true,
  },

  // --- Diverse opprydding ---
  { source: "/privacypolicy", destination: "/personvern", permanent: true },
  { source: "/cart", destination: "/", permanent: true },
  { source: "/forside-v2", destination: "/", permanent: true },
  {
    // Svarte 403 – trolig et kodet mellomrom som har blitt del av slugen
    source: "/blogg/hva-gjr-en-innholdsprodusentnbsp",
    destination: "/blogg/hva-gjr-en-innholdsprodusent",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  redirects,
};

export default nextConfig;
