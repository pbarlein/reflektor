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
  /*
   * BEVISST AVVIK FRA DAGENS SIDE. Squarespace 301-er denne til /vart-arbeid
   * (målt 27.09.2026). Det ser ut som en sekkedestinasjon, ikke en vurdering:
   * adressen handler om SoMe-annonsering, og /sosiale-medier-byra svarer
   * presis på det. Regel 1 i AGENTS.md verner live adresser, ikke døde, så
   * her veier relevans tyngre enn å speile.
   */
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
   * DET DØDE /tjenester/-TREET — MÅLENE HENTET FRA DAGENS SIDE 27.09.2026.
   *
   * Hele treet pekte til forsiden her, med kommentaren «vurder å peke dem
   * mer presist når snapshotene viser hva sidene handlet om». Snapshotene
   * var aldri riktig kilde. Squarespace har sitt eget redirect-kart, og det
   * er mer presist enn vårt var: foto- og videoadressene går til
   * /innholdsproduksjon, casene til /vart-arbeid. Hver enkelt URL er hentet
   * uten å følge redirects, og målet under er det Squarespace faktisk svarer.
   *
   * DETTE ER POENGET: målene er ikke en smakssak. Google har allerede
   * konsolidert disse adressene inn i /innholdsproduksjon og /vart-arbeid.
   * Sendte vi dem til forsiden ved cutover, ville vi kastet den
   * konsolideringen og bedt Google lære alt på nytt — mot en mindre
   * relevant side. Samme prinsipp som bloggmålene lenger ned: dagens side
   * er kartet.
   *
   * Ett bevisst avvik, /tjenester/some-annonsering, er merket lenger opp.
   */

  /* Foto og video → innholdsproduksjon, som i dag. */
  ...[
    "/tjenester/foto-og-video",
    "/tjenester/fotograf",
    "/tjenester/videograf",
    "/tjenester/videoproduksjon",
    "/tjenester/matfotograf",
    "/tjenester/bedriftsfoto",
    "/tjenester/bilderavansatte",
    /*
     * PRODUKTFOTO: TJENESTEN ER AVVIKLET (Pål, 19.09.2026). Adressen står
     * her kun for lenkeverdien, ikke som et argument for å gjenopplive
     * siden — og lenkeverdien er målt til nær null: én backlink, nofollow,
     * fra DR 22 med trafikk 1, sist sett 15.03.2025. De 1 935 «visningene»
     * i notatet over var visninger i Search Console, ikke lenker. To helt
     * ulike ting. Redirecten koster ingenting og tas med, men her er det
     * ingenting å redde.
     */
    "/tjenester/produktfoto",
  ].map((source) => ({
    source,
    destination: "/innholdsproduksjon",
    permanent: true,
  })),

  /* Case- og resultatadresser → vårt arbeid, som i dag. */
  ...[
    "/tjenester/markedsforing",
    "/tjenester/konverteringsoptimalisering",
    "/tjenester/boligfoto",
    "/tjenester/eiendomsfotograf",
  ].map((source) => ({
    source,
    destination: "/vart-arbeid",
    permanent: true,
  })),

  /* Uten en nærmere etterfølger → forsiden, som i dag. */
  ...[
    "/tjenester",
    "/tjenester/seo",
    "/tjenester/betalt-sok",
    "/tjenester/performance-marketing",
    /* Duplikat av tjenesteoversikten. 404 i dag. */
    "/tjenester-1",
  ].map((source) => ({ source, destination: "/", permanent: true })),

  /* 1 466 visninger, 43 søkeord. Live etterfølger med samme navn. */
  {
    source: "/tjenester/eventfotograf-eventvideo",
    destination: "/eventfotograf-eventvideo",
    permanent: true,
  },

  /*
   * ADRESSER MED LENKER SOM IKKE STOD I KARTET. Lagt inn 27.09.2026.
   *
   * Funnet ved å spørre Ahrefs om hver URL som har minst én dofollow-lenke,
   * i stedet for å gå ut fra /tjenester/-treet. Ingen av dem stod her, alle
   * er målt døde eller omdirigerte på dagens side, og uten dette ville de
   * blitt 404 ved cutover.
   *
   * /butikk-hovedside er den største enkeltposten utenom forsiden: 11
   * refererende domener og 14 dofollow-lenker, høyeste kilde DR 74. Det er
   * mer dofollow-lenkeverdi enn noen annen underside har. Den er en rest fra
   * nettsiden før Squarespace — .php-adresser og /index.php/513806 — og
   * Squarespace 301-er dem alle til forsiden i dag.
   */

  /* Gammel nettbutikk og .php-rester → forsiden, som i dag. */
  ...[
    "/butikk-hovedside",
    "/butikk-hovedside/513806",
    "/butikk-hovedside/index.php/513806",
    "/butikk-hovedside/Video-og-lydtenester.php",
    "/index.php/513806",
    "/513806",
    "/Video-og-lydtenester.php",
    "/flaminko",
  ].map((source) => ({ source, destination: "/", permanent: true })),

  /* Squarespace-foto uten /tjenester/-prefiks. 404 i dag. */
  ...[
    "/fotograf",
    "/bedriftsfoto",
    "/bilderavansatte",
    "/matfoto",
  ].map((source) => ({
    source,
    destination: "/innholdsproduksjon",
    permanent: true,
  })),

  /* Case- og kategorisider. 404 i dag. */
  ...[
    "/matogdrikke/orkla",
    "/matogdrikke/wolt",
    "/sport",
    "/eiendomsfotograf",
    "/prosjekter/nettside-sydspissen-hotell",
  ].map((source) => ({
    source,
    destination: "/vart-arbeid",
    permanent: true,
  })),

  /*
   * Personsider. /palbarlein er 404; de to andre 301-er til /om-oss i dag,
   * men stod ikke i kartet og ville derfor blitt 404 ved cutover.
   */
  ...["/palbarlein", "/magne-finseth-da-fonseca", "/viktor-noren"].map(
    (source) => ({ source, destination: "/om-oss", permanent: true }),
  ),

  /*
   * /videoproduksjon er 404 i dag — ingen etablert destinasjon å speile.
   * Da velger vi den mest relevante nye siden, ikke forsiden:
   * /videoproduksjon-i-oslo eier disse ordene i sidearkitekturen.
   */
  {
    source: "/videoproduksjon",
    destination: "/videoproduksjon-i-oslo",
    permanent: true,
  },

  // --- Svarte 403, trolig et kodet mellomrom som ble del av slugen ---
  {
    source: "/blogg/hva-gjr-en-innholdsprodusentnbsp",
    destination: "/blogg/hva-gjr-en-innholdsprodusent",
    permanent: true,
  },

  /*
   * /gratis-strategimote ER SLETTET. Rettet 21.09.2026.
   *
   * Notatet nederst i denne fila oppførte den som «live (HTTP 200)» og
   * sa at den skulle beholdes som den er. Det var feil, og feilen var
   * dyr: jeg rakk å bygge en hel side for adressen før Pål sa at den var
   * slettet på Squarespace. Hentet på nytt samme dag — den svarer 404.
   *
   * LÆRDOMMEN ER EN GJENGANGER I DETTE PROSJEKTET. Notatet var en påstand
   * om virkeligheten, skrevet en gang og aldri sjekket igjen. Det er samme
   * klasse feil som bloggslugene (A54) og som redirecten til /produktfoto
   * (A40): et kart som var riktig da det ble tegnet.
   *
   * Dette er derimot presis den situasjonen regel 1 i AGENTS.md ber om en
   * redirect for — «redirects skal kun rette opp faktiske 404-er». Målet
   * er /kontaktoss: samme intensjon, og den er live med 7 693 ord.
   */
  { source: "/gratis-strategimote", destination: "/kontaktoss", permanent: true },

  /*
   * BLOGGEN: NI AV SYTTEN SLUGS HAR ALDRI HATT INNHOLD. Lagt inn 21.09.2026.
   *
   * `bloggSlugs` i site.ts lister 17. Målt mot levende reflektor.no
   * 19.09.2026 — hver enkelt hentet, uten å følge redirects — var 8 ekte
   * artikler, 3 aliaser og 6 døde. Squarespace svarer 200 på en soft-404:
   * den serverer bloggoversikten med oversiktens egen title. En sjekk på
   * statuskode alene melder alle 17 som friske, og det er nesten sikkert
   * slik lista oppsto. Se A54 i docs/vedlegg-a.md.
   *
   * Uten disse omdirigeringene ville cutover publisert 6 sider som ikke
   * finnes, og 3 aliaser som selvstendige artikler — altså duplikatinnhold
   * der det i dag står én kanonisk URL med tre innganger.
   *
   * MÅLENE SPEILER DAGENS SIDE NØYAKTIG. Det var fristende å sende
   * `hva-er-reklame` til /reklamefilm i stedet for til /blogg — den
   * rangerer tross alt på «reklame» (2 200) og «reklamer» (800). Men søket
   * er informasjonssøkende og /reklamefilm er kommersiell, og en 301 til
   * noe som ikke svarer på spørsmålet behandles som en myk 404. Dagens mål
   * er det trygge, og det er dessuten regel 1 i AGENTS.md i praksis:
   * levende adresser skal oppføre seg som før.
   */

  /* Tre aliaser — 301 til den kanoniske artikkelen, som i dag. */
  {
    source: "/blogg/hvordan-markedsfore-bedrift",
    destination: "/blogg/markedsforing-i-sosiale-medier-some",
    permanent: true,
  },
  {
    source: "/blogg/hva-er-digital-markedsforing",
    destination: "/blogg/markedsforing-i-sosiale-medier-some",
    permanent: true,
  },
  {
    source: "/blogg/hva-er-inbound-marketing",
    destination: "/blogg/hva-er-innholdsmarkedsforing",
    permanent: true,
  },

  /* Seks døde — 301 til oversikten, som i dag. */
  {
    source:
      "/blogg/hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de",
    destination: "/blogg",
    permanent: true,
  },
  {
    source: "/blogg/hva-er-holdningskampanje",
    destination: "/blogg",
    permanent: true,
  },
  { source: "/blogg/hva-er-reklame", destination: "/blogg", permanent: true },
  { source: "/blogg/hva-er-personas", destination: "/blogg", permanent: true },
  {
    source: "/blogg/hva-er-visuell-identitet",
    destination: "/blogg",
    permanent: true,
  },
  {
    source: "/blogg/hvordan-ta-portrett-bilder",
    destination: "/blogg",
    permanent: true,
  },

  /*
   * IKKE LAGT INN, med vilje:
   *
   * /cart   – Squarespace-rest. Forsvinner av seg selv ved plattformbytte.
   * /privacypolicy, /videoproduksjon-i-oslo,
   * /employer-branding-video-oslo, /eventfotograf-eventvideo
   *         – alle live (HTTP 200). Beholdes som de er.
   *
   * Vurdert 27.09.2026, funnet i samme Ahrefs-gjennomgang som A63:
   *
   * /wp-content/uploads/2020/03/logo-reflektor-minimal.png
   *         – én dofollow-lenke, men det er en bildefil fra
   *           WordPress-tiden. En 301 fra et bilde til en HTML-side gir
   *           ingen lenkeverdi, den gir bare et ødelagt bilde hos den som
   *           lenker.
   * /blogg?format=rss
   *         – fire dofollow, men alle fra vårt eget Squarespace-preview,
   *           og spørrestrengen treffer /blogg som er live. Ingenting å
   *           gjøre. En ekte RSS-feed på ny side er en egen vurdering.
   */
];

const nextConfig: NextConfig = {
  images: {
    /*
     * AVIF først, WebP som fallback. Next serverer bare WebP som standard.
     * Gevinsten er beskjeden her — de tjue bildene veier 0,77 MB etter
     * WebP-konvertering, målt på deployen — men AVIF er typisk 20–30 %
     * mindre igjen, og det koster ingenting utover litt byggetid.
     */
    formats: ["image/avif", "image/webp"],
  },
  redirects,
};

export default nextConfig;
