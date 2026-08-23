import type { NextConfig } from "next";

/**
 * Redirect-kart.
 *
 * PRINSIPP: live URL-er flyttes ikke. Redirects retter kun opp faktiske
 * 404-er og én 403. Se docs/kontekst.md.
 *
 * Første utkast brøt dette – det flyttet /innholdsproduksjon og /kontaktoss,
 * som begge er live sider det annonseres mot. Ikke gjenta det. Sjekk at en URL
 * faktisk er død før du legger inn en redirect for den.
 */
const redirects: NextConfig["redirects"] = async () => [
  // --- Kontakt: /kontakt og /kontakt-oss er 404, /kontaktoss er den ekte ---
  { source: "/kontakt", destination: "/kontaktoss", permanent: true },
  { source: "/kontakt-oss", destination: "/kontaktoss", permanent: true },

  // --- Skrivefeil-URL-er som gir 404 ---
  { source: "/vrt-arbeid", destination: "/vart-arbeid", permanent: true },
  { source: "/forside-v2", destination: "/", permanent: true },
  /*
   * BEKREFTET duplikat: Ahrefs-crawlen 2026-08-18 viser at / og /hjem
   * serverte identisk innhold – samme title, samme H1, samme 1068 ord.
   * Forsiden finnes derfor kun på / her.
   */
  { source: "/hjem", destination: "/", permanent: true },

  // --- Personsider: /folk og /jon-sverre er 404 ---
  { source: "/folk", destination: "/om-oss", permanent: true },
  { source: "/jon-sverre", destination: "/om-oss", permanent: true },

  // --- Døde tjeneste-URL-er til nærmeste levende landingsside ---
  {
    source: "/tjenester/sosiale-medier",
    destination: "/sosiale-medier-byra",
    permanent: true,
  },
  {
    source: "/tjenester/some-annonsering",
    destination: "/sosiale-medier-byra",
    permanent: true,
  },
  {
    source: "/tjenester/innholdsproduksjon",
    destination: "/innholdsproduksjon",
    permanent: true,
  },
  /*
   * Søkekonsollen viser 1 935 visninger og posisjon 15,8 på «produktfoto» for
   * denne URL-en, med 22 rangerende søkeord. Første versjon sendte den til
   * forsiden sammen med resten av det døde /tjenester/-treet – det ville kastet
   * bort den sterkeste enkeltposisjonen vi har på et kommersielt søkeord.
   */
  {
    source: "/tjenester/produktfoto",
    destination: "/produktfoto",
    permanent: true,
  },
  /* 1 466 visninger, 43 søkeord. Samme resonnement. */
  {
    source: "/tjenester/eventfotograf-eventvideo",
    destination: "/eventfotograf-eventvideo",
    permanent: true,
  },
  /* 87 visninger, posisjon 8,7. Oversikten finnes ikke lenger – til forsiden. */
  { source: "/tjenester", destination: "/", permanent: true },

  /*
   * Resten av /tjenester/-treet er 404 uten en åpenbar etterfølger. De sendes
   * til forsiden for å berge lenkeverdi. Vurder å peke dem mer presist når
   * snapshotene viser hva sidene faktisk handlet om.
   */
  ...[
    "/tjenester/seo",
    "/tjenester/betalt-sok",
    "/tjenester/markedsforing",
    "/tjenester/performance-marketing",
    "/tjenester/konverteringsoptimalisering",
    "/tjenester/foto-og-video",
    "/tjenester/videograf",
    "/tjenester/videoproduksjon",
    "/tjenester/fotograf",
    "/tjenester/matfotograf",
    "/tjenester/boligfoto",
    "/tjenester/bedriftsfoto",
    "/tjenester/eiendomsfotograf",
    "/tjenester/bilderavansatte",
  ].map((source) => ({ source, destination: "/", permanent: true })),

  // --- Svarte 403, trolig et kodet mellomrom som ble del av slugen ---
  {
    source: "/blogg/hva-gjr-en-innholdsprodusentnbsp",
    destination: "/blogg/hva-gjr-en-innholdsprodusent",
    permanent: true,
  },

  /*
   * IKKE LAGT INN, med vilje:
   *
   * /cart   – Squarespace-rest. Forsvinner av seg selv ved plattformbytte.
   * /privacypolicy, /gratis-strategimote, /videoproduksjon-i-oslo,
   * /employer-branding-video-oslo, /eventfotograf-eventvideo
   *         – alle live (HTTP 200). Beholdes som de er.
   */
];

const nextConfig: NextConfig = {
  redirects,
};

export default nextConfig;
