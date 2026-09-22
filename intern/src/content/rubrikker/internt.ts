import type { Rubrikk } from "../rubrikktype.ts";

/**
 * Slik gjør vi det.
 *
 * DE TRE FØRSTE ER DE ENESTE GODKJENTE I HELE HUBEN, og det er fordi de er
 * HENTET og ikke skrevet: Påls egne ord, og tall fra `tilbud` i
 * hovedprosjektets site.ts. Alt annet i huben er fagutkast.
 */
export const INTERNT: readonly Rubrikk[] = [
  {
    slug: "malet",
    nr: 11,
    tittel: "Målet: at kunder blir, og at de kommer tilbake",
    sammendrag:
      "De to målene alle i Reflektor jobber mot, og den ene måten vi kommer dit på. Alt annet i denne huben er midler til dette.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "reels/produksjonsdag",
      alt: "Kamera rigget på stativ i en døråpning under en produksjonsdag",
    },
    oppdatert: "2026-09-21",
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde: "Påls egne ord, gjengitt ordrett og uten omskrivinger.",
    prioritet: 100,
    oppsummering: [
      { tekst: "De to målene", anker: "mal" },
      { tekst: "Hvordan", anker: "hvordan" },
      { tekst: "Hvorfor akkurat disse tre ordene", anker: "hvorfor" },
    ],
    innhold: [
      { type: "seksjon", id: "mal", tittel: "De to målene" },
      {
        type: "avsnitt",
        tekst:
          "Alle ansatte i Reflektor har de samme to målene. De er verdt å kunne utenat, fordi de avgjør hvilken av to mulige handlinger som er riktig, nesten hver eneste dag.",
      },
      {
        type: "punkter",
        punkter: [
          "At faste kunder aldri sier opp",
          "At engangskunder kommer tilbake til oss",
        ],
      },
      { type: "seksjon", id: "hvordan", tittel: "Hvordan" },
      {
        type: "sitat",
        tekst: "Ved å alltid være proaktiv, godt forberedt og entusiastisk.",
        kilde: "Pål",
      },
      { type: "seksjon", id: "hvorfor", tittel: "Hvorfor akkurat de tre" },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til at ingen av de tre handler om utstyr, teknikk eller talent. De handler om hvordan kunden opplever å jobbe med oss — før, under og etter produksjonsdagen. Det er den opplevelsen som avgjør om noen sier opp, og den er innenfor alles kontroll.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er også påfallende likt det undersøkelser av byråbytte peker på: kunder går fordi ingen tok initiativ, ikke fordi arbeidet var dårlig. Se rubrikken om hvorfor kunder slutter.",
      },
      {
        type: "merknad",
        tekst:
          "Står du fast i et valg og ingen rutine dekker det: spør hvilket alternativ som gjør det mest sannsynlig at kunden blir. Det svaret er nesten alltid riktig.",
      },
    ],
  },

  {
    slug: "hva-abonnementet-inneholder",
    fremhevet:
      "Start her. Du kan ikke si noe troverdig til en kunde før du vet nøyaktig hva vi har lovet dem — og hva vi ikke har.",
    nr: 12,
    tittel: "Hva abonnementet inneholder — og hva det ikke gjør",
    sammendrag:
      "Leveransen, prisen og vilkårene ordrett slik de står på nettsiden. Kunn dette før du snakker med en kunde om omfang.",
    kategori: "posisjon",
    status: "lansert",
    medie: {
      type: "bilde",
      fil: "arbeid/pa-vei",
      alt: "Person med bagasje på vei gjennom en parkeringskjeller",
    },
    oppdatert: "2026-09-22",
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde:
      "Hentet fra tilbudsteksten i hovedprosjektet. Det er den samme kilden som nettsiden viser.",
    prioritet: 96,
    oppsummering: [
      { tekst: "Pris og vilkår", anker: "pris" },
      { tekst: "De seks punktene som inngår", anker: "inngar" },
      { tekst: "Stillbilder — ved behov, ikke fast", anker: "stillbilder" },
      {
        tekst: "Hva som ikke inngår, og hvorfor vi sier det høyt",
        anker: "ikke",
      },
    ],
    innhold: [
      { type: "seksjon", id: "pris", tittel: "Pris og vilkår" },
      {
        type: "avsnitt",
        tekst:
          "Prisen er 30 000 kr/mnd. Én pris, alt inkludert, ingen binding. Ingen timepriser, ingen etterfakturering og ingen tillegg for ekstra runder. Oppsigelsestiden er tre måneder; bindingstid utover den finnes ikke.",
      },
      { type: "seksjon", id: "inngar", tittel: "Dette inngår" },
      {
        type: "punkter",
        punkter: [
          "Produksjon av SoMe-strategi og produksjonsplaner",
          "Én produksjonsdag per måned hos dere, hos oss eller ute på lokasjon",
          "Produksjonsmål: 8–10 videoer ferdig redigert per måned",
          "Publisering til Instagram 2 ganger per uke med krysspublisering til Facebook",
          "Teksting og fargekorrigering",
          "Fri bruk av alt innhold – annonser, nettsider, skjermer, presentasjoner",
        ],
      },
      {
        type: "merknad",
        tekst:
          "To publiseringer i uken betyr TO, ikke to på hver kanal. De går til Instagram og krysspubliseres til Facebook. 2 × 52 = 104 i året, altså 8,7 i måneden, og det er derfor produksjonsmålet er 8–10.",
      },
      { type: "seksjon", id: "stillbilder", tittel: "Stillbilder" },
      {
        type: "avsnitt",
        tekst:
          "Stillbilder leveres ved behov, ikke som fast leveranse: si fra i planleggingen, så dekkes det på samme produksjonsdag. Kapasiteten deles med video, og det er derfor 8–10 er et produksjonsmål og ikke en garanti.",
      },
      { type: "seksjon", id: "ikke", tittel: "Hva som ikke inngår" },
      {
        type: "avsnitt",
        tekst:
          "Håndtering av kommentarfelt og meldinger. Stories. Betalt annonsering med annonsebudsjetter.",
      },
      {
        type: "avsnitt",
        tekst:
          "Vi sier dette tydelig og tidlig, fordi «SoMe-byrå» betyr ulike ting hos ulike leverandører. Ærligheten er salgsargumentet — ikke et forbehold vi helst skulle vært foruten.",
      },
    ],
    kilder: [
      {
        tittel:
          "Reflektor: leveranse, pris og vilkår slik de står på nettsiden",
        url: "https://www.reflektor.no/sosiale-medier-byra",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "prisen-sier-vi-hoyt",
    nr: 13,
    tittel: "Prisen sier vi høyt",
    sammendrag:
      "Pristransparens er den ene posisjoneringen Reflektor faktisk eier. Slik skrives prisen, og hvorfor vi aldri er vage om den.",
    kategori: "posisjon",
    status: "lansert",
    medie: {
      type: "bilde",
      fil: "arbeid/dag6-vegg",
      alt: "Bakevarer på brett i en disk",
    },
    oppdatert: "2026-09-22",
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde:
      "Hentet fra de låste rammene i prosjektbriefen og fra tilbudsteksten i hovedprosjektet.",
    prioritet: 88,
    oppsummering: [
      { tekst: "Slik skrives prisen", anker: "skrives" },
      { tekst: "Hvorfor åpenheten virker", anker: "hvorfor" },
      { tekst: "De andre tallene", anker: "tall" },
      { tekst: "Når du blir usikker", anker: "usikker" },
    ],
    innhold: [
      { type: "seksjon", id: "skrives", tittel: "Slik skrives den" },
      {
        type: "avsnitt",
        tekst:
          "«30 000 kr/mnd». Aldri med mva-notasjon, aldri som «fra», aldri som «ta kontakt for pris». Den står åpent på nettsiden, og det er et bevisst valg: bransjen er full av byråer som ikke oppgir pris, og det er nettopp derfor vi gjør det.",
      },
      { type: "seksjon", id: "hvorfor", tittel: "Hvorfor åpenheten virker" },
      {
        type: "avsnitt",
        tekst:
          "Det nærmeste vi kommer et vitenskapelig belegg, er forskning på kostnadsåpenhet. Mohan, Buell og John testet i seks studier hva som skjer når en bedrift frivillig viser hva et produkt koster å lage. Effekten var positiv, og den gikk gjennom tillit: åpenheten leses som at bedriften deler noe den kunne holdt skjult, og den tilliten gjør folk mer villige til å kjøpe. I et felteksperiment hos en nettbutikk økte salget.",
      },
      {
        type: "merknad",
        tekst:
          "Vær presis hvis du bruker dette i et møte. Forskningen handler om å vise KOSTNADER, ikke pris, og den er gjort på forbrukere og ikke på bedriftskunder. Mekanismen — frivillig åpenhet om noe ubehagelig skaper tillit — er den som overføres. Ikke tallene.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det praktiske poenget er hvorfor vi ikke bare oppgir prisen, men oppgir den uten forbehold. «Fra 30 000» og «ta kontakt for pris» er begge signaler om at det finnes noe vi ikke vil si ennå. Da er det ikke lenger åpenhet — da er det en invitasjon til en forhandling, og hele fordelen er borte.",
      },
      { type: "seksjon", id: "tall", tittel: "De andre tallene" },
      {
        type: "punkter",
        punkter: [
          "Ekstra produksjonsdag — reklamefilm, produktfoto og lignende — er 30 000 kr.",
          "Strategiforslag leveres innen tre virkedager.",
          "Tre måneders oppsigelse, ingen bindingstid. Begge deler sies eksplisitt.",
        ],
      },
      { type: "seksjon", id: "usikker", tittel: "Når du blir usikker" },
      {
        type: "avsnitt",
        tekst:
          "Blir du usikker på et tall i et kundemøte: si at du sjekker og kommer tilbake samme dag. Et omtrentlig tall som viser seg å være feil, koster mer enn en times venting.",
      },
    ],
    kilder: [
      {
        tittel:
          "Mohan, Buell & John (2020): Lifting the Veil — The Benefits of Cost Transparency. Marketing Science 39(6), 1105–1121",
        url: "https://doi.org/10.1287/mksc.2019.1200",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Reflektor: prisen slik den står åpent på nettsiden — 30 000 kr/mnd",
        url: "https://www.reflektor.no/sosiale-medier-byra",
        sjekket: "2026-09-22",
      },
    ],
  },
];
