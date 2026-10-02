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
/*
 * STATUSKODE: 301, satt eksplisitt. Bestemt av Pål 27.09.2026.
 *
 * `statusCode: 301` — Next sin vanlige måte — gir **308**, ikke 301. Målt mot
 * produksjonsbygget. Google og Bing behandler de to som likeverdige, så 308
 * var ikke en feil. Men dagens Squarespace svarer 301, hele dokumentasjonen
 * vår sier 301, og et byrå som kjører en redirect-sjekk skal ikke måtte lure
 * på hvorfor tallet er et annet enn det som står skrevet.
 *
 * Derfor `statusCode: 301` på alle oppføringene, ikke `permanent`. De to kan
 * ikke kombineres — Next godtar én av dem per oppføring. En test i
 * tests/redirects.test.ts holder kartet på 301, slik at en ny oppføring med
 * `statusCode: 301` ikke sniker inn en 308 igjen.
 */
const redirects: NextConfig["redirects"] = async () => [
  // --- Kontakt: /kontakt og /kontakt-oss er 404, /kontaktoss er den ekte ---
  { source: "/kontakt", destination: "/kontaktoss", statusCode: 301 },
  { source: "/kontakt-oss", destination: "/kontaktoss", statusCode: 301 },

  // --- Skrivefeil-URL-er som gir 404 ---
  { source: "/vrt-arbeid", destination: "/vart-arbeid", statusCode: 301 },
  { source: "/forside-v2", destination: "/", statusCode: 301 },
  /*
   * BEKREFTET duplikat: Ahrefs-crawlen 2026-08-18 viser at / og /hjem
   * serverte identisk innhold – samme title, samme H1, samme 1068 ord.
   * Forsiden finnes derfor kun på / her.
   */
  { source: "/hjem", destination: "/", statusCode: 301 },

  // --- Personsider: /folk og /jon-sverre er 404 ---
  { source: "/folk", destination: "/om-oss", statusCode: 301 },
  { source: "/jon-sverre", destination: "/om-oss", statusCode: 301 },

  // --- Døde tjeneste-URL-er til nærmeste levende landingsside ---
  {
    source: "/tjenester/sosiale-medier",
    destination: "/",
    statusCode: 301,
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
    destination: "/",
    statusCode: 301,
  },
  {
    source: "/tjenester/innholdsproduksjon",
    destination: "/innholdsproduksjon",
    statusCode: 301,
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
    /*
     * /produktfoto UTEN /tjenester/ — lagt til 02.10.2026.
     *
     * Search Console rapporterte 18 404-er på den nye siden etter cutover.
     * Seksten var dekket av kartet her. Denne var ikke: adressen fantes på
     * Squarespace som en egen side ved siden av /tjenester/produktfoto, og
     * den falt utenfor fordi kartet ble tegnet fra /tjenester/-treet.
     *
     * KONTROLLERT FØR DEN BLE LAGT INN, slik regel 1 i AGENTS.md krever:
     * https://www.reflektor.no/produktfoto svarer 404. Den er altså død,
     * og dette er en faktisk 404 som rettes — ikke en live adresse som
     * flyttes. Samme mål som /tjenester/produktfoto, av samme grunn: det
     * er dit Google allerede har konsolidert produktfoto-adressene.
     */
    "/produktfoto",
  ].map((source) => ({
    source,
    destination: "/innholdsproduksjon",
    statusCode: 301,
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
    statusCode: 301,
  })),

  /* Uten en nærmere etterfølger → forsiden, som i dag. */
  ...[
    "/tjenester",
    "/tjenester/seo",
    "/tjenester/betalt-sok",
    "/tjenester/performance-marketing",
    /* Duplikat av tjenesteoversikten. 404 i dag. */
    "/tjenester-1",
  ].map((source) => ({ source, destination: "/", statusCode: 301 })),

  /*
   * JOKERREGELEN FOR RESTEN AV /tjenester/. Lagt inn 27.09.2026.
   *
   * Squarespace sin egen omdirigeringstabell — lest av i GTM-oppdraget, ikke
   * gjettet — har linja `/tjenester/[name] -> /vart-arbeid`. Den forklarer noe
   * jeg hadde misforstått: de fire adressene jeg målte til /vart-arbeid
   * (markedsforing, konverteringsoptimalisering, boligfoto, eiendomsfotograf)
   * har ingen egen linje i tabellen. De traff denne jokeren.
   *
   * Det var altså aldri fire vurderinger, men én sekkeregel. Det bekrefter
   * samtidig avviket for /tjenester/some-annonsering lenger opp: den traff
   * jokeren også, så å sende den til /sosiale-medier-byra overstyrer ingen
   * beslutning.
   *
   * Jokeren må stå ETTER alle de spesifikke oppføringene — Next bruker første
   * treff. Den er trygg her fordi den nye siden ikke har noen /tjenester/-rute
   * å skygge for.
   */
  /*
   * FLYTTET OPP 02.10.2026. Sto etter jokeren under, og ble derfor aldri
   * brukt: Next tar første treff, så /tjenester/eventfotograf-eventvideo
   * havnet på /vart-arbeid. Oppdaget på live-siden etter cutover.
   */
  {
    source: "/tjenester/eventfotograf-eventvideo",
    destination: "/eventfotograf-eventvideo",
    statusCode: 301,
  },
  { source: "/tjenester/:rest+", destination: "/vart-arbeid", statusCode: 301 },

  /*
   * TRE ADRESSER JEG IKKE HADDE. Fra samme tabell, 27.09.2026.
   *
   * Ingen av dem hadde jeg funnet ved å prøve meg fram utenfra — man finner
   * ikke en adresse man ikke vet finnes. Det er nettopp derfor tabellen var
   * det viktigste punktet i oppdraget.
   */
  {
    source: "/some-byra",
    destination: "/",
    statusCode: 301,
  },
  {
    source: "/video-og-innhold",
    destination: "/innholdsproduksjon",
    statusCode: 301,
  },
  {
    source: "/innholdsproduksjon-arkiv-2026",
    destination: "/innholdsproduksjon",
    statusCode: 301,
  },

  /*
   * IKKE KOPIERT: `/blogg/[name] -> /blogg`.
   *
   * Squarespace har også en joker for bloggen. Den er trygg der, fordi
   * Squarespace matcher sine egne sider først og jokeren bare fanger resten.
   *
   * I Next kjører redirects FØR ruting. En `/blogg/:slug` → `/blogg` ville
   * derfor slått ut hver eneste ekte artikkel — hele bloggen, som er det ene
   * vi beholder for søkesynligheten. De seks døde slugene står oppført hver
   * for seg lenger nede, og det er den riktige formen her.
   *
   * RETTET 02.10.2026: her sto «lenkeverdiens skyld (~481 refererende
   * domener)». Tallet var domenets, ikke bloggens. Målt i Ahrefs har hele
   * /blogg-stien 3 levende refererende domener; de 589 domenet har, peker
   * nesten alle på forsiden. Grunnen til å beholde URL-ene er at artiklene
   * rangerer på ord folk søker på — aliaset
   * /blogg/hvordan-markedsfore-bedrift har alene 41 279 visninger. Det er
   * presis sammenblandingen av visninger og lenkeverdi som advarselen
   * nederst i denne fila handler om. Se AGENTS.md, regel 3.
   */

  /* 1 466 visninger, 43 søkeord. Live etterfølger med samme navn. */

  /*
   * ADRESSER MED LENKER SOM IKKE STOD I KARTET. Lagt inn 27.09.2026.
   *
   * Funnet ved å spørre Ahrefs om hver URL som har minst én dofollow-lenke,
   * i stedet for å gå ut fra /tjenester/-treet. Alle er målt døde eller
   * omdirigerte på dagens side, og uten dette ville de blitt 404 ved cutover.
   *
   * Én klynge ble funnet og forkastet igjen samme dag — se notatet om
   * reflector.no nederst i fila. Les det før du legger til noe her på
   * grunnlag av en Ahrefs-rapport.
   */

  /* Squarespace-foto uten /tjenester/-prefiks. 404 i dag. */
  ...["/fotograf", "/bedriftsfoto", "/bilderavansatte", "/matfoto"].map(
    (source) => ({
      source,
      destination: "/innholdsproduksjon",
      statusCode: 301,
    }),
  ),

  /* Case- og kategorisider. 404 i dag. */
  ...[
    "/matogdrikke/orkla",
    "/matogdrikke/wolt",
    "/sport",
    "/eiendomsfotograf",
  ].map((source) => ({
    source,
    destination: "/vart-arbeid",
    statusCode: 301,
  })),

  /*
   * Personsider. /palbarlein er 404; de to andre 301-er til /om-oss i dag,
   * men stod ikke i kartet og ville derfor blitt 404 ved cutover.
   */
  ...["/palbarlein", "/magne-finseth-da-fonseca", "/viktor-noren"].map(
    (source) => ({ source, destination: "/om-oss", statusCode: 301 }),
  ),

  /*
   * /videoproduksjon er 404 i dag — ingen etablert destinasjon å speile.
   * Da velger vi den mest relevante nye siden, ikke forsiden:
   * /videoproduksjon-i-oslo eier disse ordene i sidearkitekturen.
   */
  {
    source: "/videoproduksjon",
    destination: "/videoproduksjon-i-oslo",
    statusCode: 301,
  },

  // --- Svarte 403, trolig et kodet mellomrom som ble del av slugen ---
  {
    source: "/blogg/hva-gjr-en-innholdsprodusentnbsp",
    destination: "/blogg/hva-gjr-en-innholdsprodusent",
    statusCode: 301,
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
  {
    source: "/gratis-strategimote",
    destination: "/kontaktoss",
    statusCode: 301,
  },

  /*
   * SKJEMASIDEN SOM HØRTE TIL /gratis-strategimote. Lagt til 02.10.2026.
   *
   * Squarespace hadde en egen side for selve skjemaet, og den ble lenket
   * fra knappen på strategimøtesiden. Den sto ikke i kartet her, og dukket
   * opp blant de 18 404-ene i Search Console etter cutover.
   *
   * Kontrollert samme dag: https://www.reflektor.no/gratis-strategimote-kontaktskjema
   * svarer 404. Målet er /kontaktoss, som for siden den hørte til — det er
   * der skjemaet står nå.
   */
  {
    source: "/gratis-strategimote-kontaktskjema",
    destination: "/kontaktoss",
    statusCode: 301,
  },

  /*
   * RSS-FEEDEN. Lagt til 02.10.2026.
   *
   * Squarespace serverte bloggens feed på `/blogg?format=rss` — deres egen
   * konvensjon, ikke vår. Etter cutover svarte adressen med HTML-oversikten
   * i stedet: en feed som ikke lenger var en feed, uten at noe meldte fra.
   * Alt som abonnerte, sluttet stille å virke.
   *
   * `has` ER DET SOM GJØR DENNE TRYGG. Betingelsen gjelder bare når
   * spørringen faktisk er `format=rss`. `/blogg` uten parametere treffes
   * ikke, og oversikten står urørt — den er en live side med organisk
   * trafikk, og en ubetinget redirect herfra ville vært nøyaktig det regel 1
   * i AGENTS.md forbyr.
   *
   * NEXT SENDER SPØRRINGEN VIDERE TIL MÅLET, så svaret er
   * `/blogg/rss.xml?format=rss`. Verifisert på live: den svarer 200 med
   * riktig content-type — feeden ignorerer parameteren, og
   * `atom:link rel="self"` peker på den rene adressen. Det finnes ingen
   * dokumentert måte å droppe den på, og den er harmløs. Ikke «rett» dette
   * ved å fjerne `has`.
   *
   * Feeden ligger i src/app/blogg/rss.xml/route.ts.
   */
  {
    source: "/blogg",
    has: [{ type: "query" as const, key: "format", value: "rss" }],
    destination: "/blogg/rss.xml",
    statusCode: 301,
  },

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
    statusCode: 301,
  },
  {
    source: "/blogg/hva-er-digital-markedsforing",
    destination: "/blogg/markedsforing-i-sosiale-medier-some",
    statusCode: 301,
  },
  {
    source: "/blogg/hva-er-inbound-marketing",
    destination: "/blogg/hva-er-innholdsmarkedsforing",
    statusCode: 301,
  },

  /*
   * DE DØDE PEKER NÅ PÅ NÆRMESTE TEMA, IKKE PÅ OVERSIKTEN. Endret
   * 02.10.2026.
   *
   * Her sto «seks døde — 301 til oversikten, som i dag», og speilingen av
   * Squarespace var riktig på cutover-dagen. Men en 301 til en
   * oversiktsside behandler Google i praksis som en myk 404: målet svarer
   * ikke på det den gamle adressen svarte på, og lenkeverdien går tapt i
   * stedet for å flytte seg.
   *
   * Hver av dem er derfor vurdert på tema, og alle fem fant et mål. Ingen
   * redirect i kartet peker lenger på /blogg. Finner neste gjennomgang en
   * gammel adresse uten nær slektning, er oversikten fortsatt bedre enn en
   * 404 — men den skal være siste utvei, ikke standardvalget.
   */

  /*
   * «Virkemidler i reklame» er en egen H2 i /blogg/hva-er-reklame. Dette
   * er den tetteste treffer i hele kartet: samme spørsmål, samme ord.
   */
  {
    source:
      "/blogg/hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de",
    destination: "/blogg/hva-er-reklame",
    statusCode: 301,
  },
  /*
   * En holdningskampanje er en reklamekampanje som skal endre en holdning
   * i stedet for å selge et produkt. Artikkelen om reklame dekker både
   * definisjonen, typene og virkemidlene, og er nærmeste levende side.
   */
  {
    source: "/blogg/hva-er-holdningskampanje",
    destination: "/blogg/hva-er-reklame",
    statusCode: 301,
  },
  /*
   * Personas er et verktøy for å bestemme hvem innholdet er for. Det er
   * nøyaktig jobben strategiartikkelen gjør.
   */
  {
    source: "/blogg/hva-er-personas",
    destination: "/blogg/sosiale-medier-strategi",
    statusCode: 301,
  },
  /*
   * Visuell identitet handler om hvordan innholdet ser ut. Artikkelen om
   * innholdsproduksjon er den som forklarer hva som lages og hvordan.
   */
  {
    source: "/blogg/hva-er-visuell-identitet",
    destination: "/blogg/hva-er-innholdsproduksjon",
    statusCode: 301,
  },
  /*
   * Portrettfoto er en tjeneste vi leverer, ikke et tema vi har skrevet
   * om. Da er tjenestesiden riktigere enn en artikkel: den som søkte etter
   * hvordan man tar portretter, er nærmere å ville ha dem tatt.
   */
  {
    source: "/blogg/hvordan-ta-portrett-bilder",
    destination: "/innholdsproduksjon",
    statusCode: 301,
  },

  /*
   * CUTOVER 02.10.2026 — speiler Bulk Redirects i Vercel.
   *
   * /sosiale-medier-byra → / er unntaket fra regel 1 i AGENTS.md, bestilt
   * 15.09.2026 og utført på cutover-dagen etter at Google Ads hadde byttet
   * endelig URL til /. Plassholdersiden (UnderArbeid) er fjernet samtidig.
   * Det som utløste det: Google AI-oversikt siterte fortsatt adressen, og den
   * viste «Under arbeid». Se docs/cutover.md.
   *
   * /privacypolicy → /personvern: personvernerklæringen ble migrert til
   * /personvern uten redirect, mens kommentaren under feilaktig sa at
   * /privacypolicy var «live». Den ga 404 etter cutover. Meta Lead Ads-
   * skjemaene lenker trolig hit (docs/kontekst.md).
   *
   * Begge ligger også som Bulk Redirects i Vercel-prosjektet, lagt inn
   * 02.10.2026 før denne koden fantes. Vercel-reglene vinner. De kan fjernes
   * der når dette er deployet.
   */
  {
    source: "/sosiale-medier-byra",
    destination: "/",
    statusCode: 301,
  },
  {
    source: "/privacypolicy",
    destination: "/personvern",
    statusCode: 301,
  },

  /*
   * IKKE LAGT INN, med vilje:
   *
   * /cart   – Squarespace-rest. Forsvinner av seg selv ved plattformbytte.
   * /videoproduksjon-i-oslo, /employer-branding-video-oslo,
   * /eventfotograf-eventvideo
   *         – alle live (HTTP 200). Beholdes som de er.
   *         (/privacypolicy sto her også. Det var feil — se over.)
   *
   * /blogg?format=rss
   *         – fire dofollow, men alle fra vårt eget Squarespace-preview,
   *           og spørrestrengen treffer /blogg som er live. Ingenting å
   *           gjøre. En ekte RSS-feed på ny side er en egen vurdering.
   * /wp-content/uploads/2020/03/logo-reflektor-minimal.png
   *         – én dofollow-lenke, men det er en bildefil. En 301 fra et
   *           bilde til en HTML-side gir ingen lenkeverdi, den gir bare et
   *           ødelagt bilde hos den som lenker.
   */

  /*
   * ADVARSEL: ANDRE SELSKAPER I AHREFS-RAPPORTEN. Målt 27.09.2026.
   *
   * IKKE legg inn redirects for disse. Jeg gjorde det, og tok feil:
   *
   *   /butikk-hovedside/, /butikk-hovedside/513806, /index.php/513806,
   *   /513806, /Video-og-lydtenester.php, /flaminko/,
   *   /prosjekter/nettside-sydspissen-hotell/
   *
   * Ahrefs fører dem som URL-er på reflektor.no, og `/butikk-hovedside/`
   * ser ut som den største enkeltposten utenom forsiden: 11 refererende
   * domener, 14 dofollow-lenker, høyeste kilde DR 74. Jeg la dem inn på det
   * grunnlaget, og Pål stoppet det: adressene tilhører ikke Reflektor.
   *
   * ANKERTEKSTEN AVSLØRER DET. Lenkene sier «www.reflector.no»,
   * «reflector.no» og «Reflector Produksjoner» — reflector med C, et annet
   * domene. Kildene er Hardanger Folkeblad, uskedalen.no,
   * webby.no/norskesteder/?/280/Jondal/ og mic.no/listento.no
   * (musikkbransjen). Datoene er 2013–2018, alle døde innen 2019. Filnavnet
   * «Video-og-lydtenester» er nynorsk. Det er et lyd- og videoselskap i
   * Jondal, ikke et byrå i Oslo.
   *
   * /flaminko/ er lenket fra flaminko.no selv (2019, dødt samme år).
   * /prosjekter/nettside-sydspissen-hotell/ og PNG-fila over kommer begge
   * fra logospng.com, en logoskraper, 2020–2021 — en WordPress-side med
   * /prosjekter/, altså nok et selskap som het noe med Reflektor.
   *
   * LÆRDOMMEN: `url_to` i Ahrefs er ikke bevis på at adressen er vår. Les
   * ankertekst, kildedomene og dato før du tror på en rapport. Et stort tall
   * på en URL du ikke kjenner igjen er en grunn til å sjekke, ikke til å
   * handle. Se A63.
   */
];

/**
 * Sikkerhetsheadere.
 *
 * LAGT TIL 29.09.2026 etter teknisk gjennomgang. Siden serverte ingen av dem;
 * det eneste som lå der var HSTS, som Vercel setter selv.
 *
 * DETTE ER DE BILLIGE. Hver av dem er én linje, ingen av dem kan brekke noe
 * på et nettsted som dette, og ingen av dem krever vedlikehold når innholdet
 * endres.
 *
 * DET ER IKKE EN CSP HER, OG DET ER ET VALG. En Content-Security-Policy som
 * faktisk begrenser skript måtte listet opp alt GTM-containeren laster — GA4,
 * Google Ads, Apollo, Clarity, HubSpot — og containeren styres utenfor dette
 * repoet. Første gang noen legger til en tagg i GTM, ville taggen blitt
 * blokkert av en fil de ikke vet finnes, og det de ville mistet er målingen
 * av den eneste KPI-en. En CSP som må vedlikeholdes to steder av to personer
 * er verre enn ingen CSP. `frame-ancestors` er unntaket: det direktivet rører
 * ikke skript i det hele tatt.
 */
const sikkerhetsheadere = [
  // Hindrer at nettleseren gjetter innholdstype på noe vi har merket.
  { key: "X-Content-Type-Options", value: "nosniff" },
  /*
   * Referrer: fullt domene ut, aldri sti til en annen opprinnelse. Dette er
   * nettleserens standard i dag, men standarder flytter seg og målingen vår
   * avhenger av at referreren overlever — GA4-nøkkelhendelsen krever
   * `page_referrer contains reflektor.no`. Da skriver vi den ned.
   */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Ingen på siden ber om kamera, mikrofon eller posisjon. Da sier vi nei.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  /*
   * Bare vi kan ramme inn våre egne sider. Uten dette kan hvem som helst
   * legge kontaktskjemaet i en usynlig iframe på sitt eget domene.
   *
   * `frame-ancestors` og ikke `X-Frame-Options`: den nyere erstatter den
   * eldre i alle nettlesere som er i bruk, og to headere for samme jobb er
   * nettopp rotet denne gjennomgangen skal fjerne.
   */
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

const nextConfig: NextConfig = {
  /*
   * `X-Powered-By: Next.js` fjernet. Den forteller bare hvilket rammeverk
   * som kjører, og det er en opplysning som gagner den som leter etter et
   * rammeverk med et kjent hull mer enn den gagner oss.
   */
  poweredByHeader: false,

  async headers() {
    return [
      { source: "/:sti*", headers: sikkerhetsheadere },

      /*
       * CACHE PÅ FILENE I public/. Lagt til 02.10.2026.
       *
       * De ble levert med `max-age=0`, altså «spør meg på nytt hver gang».
       * Lighthouse målte 295 KiB som kunne vært gjenbrukt på forsiden
       * alene. Det er bilder, logoer og plakatbilder som ikke har endret
       * seg på uker.
       *
       * IKKE `immutable`, og det er hele poenget med å skrive dette ned.
       * `immutable` betyr «denne URL-en vil aldri svare med noe annet», og
       * det er bare sant når filnavnet endres ved ny versjon. Filene våre
       * heter det samme etter en utskifting — `peppes1-1600.jpg` er
       * `peppes1-1600.jpg` også om motivet byttes. Med `immutable` ville
       * et bytte ikke nådd fram til noen som hadde besøkt siden før, og vi
       * ville ikke hatt noen måte å tvinge det på.
       *
       * `stale-while-revalidate` gir det beste av begge: nettleseren viser
       * den lagrede fila med en gang og henter en ny i bakgrunnen. Ett
       * døgn fersk, en uke brukbar.
       *
       * NEXTS EGNE FILER ER IKKE BERØRT. /_next/static har allerede
       * innholdshash i filnavnet og settes til `immutable` av Next selv —
       * der ER det sant.
       */
      {
        source:
          "/:sti*.:ext(jpg|jpeg|png|webp|avif|gif|svg|ico|mp4|webm|woff|woff2|vtt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      /*
       * INDEKSERINGSSPERREN SOM HEADER, ikke bare som meta-tagg.
       *
       * `robots` i layout.tsx setter `noindex` i HTML-en. Det dekker sider.
       * Det dekker ikke sitemap.xml, llms.txt eller en fil noen lenker
       * direkte til — de er ikke HTML og har ingen <head>.
       *
       * Samme bryter som alt annet: se src/lib/miljo.ts. Er indeksering
       * slått på, forsvinner headeren med den.
       */
      ...(process.env.NEXT_PUBLIC_TILLAT_INDEKSERING === "true"
        ? []
        : [
            {
              source: "/:sti*",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ]),
    ];
  },

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
