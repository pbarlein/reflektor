import type { Rubrikk } from "../rubrikktype.ts";

/**
 * Kundeforholdet.
 *
 * Denne kategorien er den som ligger nærmest Reflektors to mål. Den er
 * skrevet mot et funn som går igjen i undersøkelser av hvorfor kunder
 * forlater byråer: det handler nesten aldri om pris, og nesten alltid om
 * at noen sluttet å være proaktiv.
 */
export const KUNDE: readonly Rubrikk[] = [
  {
    slug: "hvorfor-kunder-slutter",
    tittel: "Hvorfor kunder slutter — og hva som faktisk holder dem",
    sammendrag:
      "Pris er nesten aldri grunnen. Undersøkelser peker på det samme hver gang: manglende initiativ og dårlig kommunikasjon. Det er begge deler innenfor vår kontroll.",
    kategori: "kunde",
    medie: {
      type: "video",
      fil: "reels/egon",
      alt: "Anrettede retter på et bord, sett ovenfra",
    },
    oppdatert: "2026-09-21",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hva undersøkelsene peker på", anker: "funn" },
      { tekst: "Pris er ikke problemet", anker: "pris" },
      { tekst: "De tre varsellampene", anker: "varsel" },
      { tekst: "Hva det betyr for deg, konkret", anker: "deg" },
    ],
    innhold: [
      { type: "seksjon", id: "funn", tittel: "Hva undersøkelsene peker på" },
      {
        type: "avsnitt",
        tekst:
          "Bransjeundersøkelser av hvorfor kunder bytter byrå lander gjentatte ganger på de samme toppårsakene: manglende proaktiv rådgivning, dårlig kommunikasjon, og manglende evne til å vise verdien av det som leveres.",
      },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til hva som IKKE står der. Ikke «for dårlig kvalitet på videoene». Ikke «for lite kreativt». De tre handler alle om hvordan kunden opplever å jobbe med oss mellom leveransene.",
      },
      {
        type: "merknad",
        tekst:
          "Tallene i slike undersøkelser varierer mellom kilder og bør ikke siteres til kunder som fasit. Rangeringen er likevel påfallende stabil, og det er rangeringen som er poenget her.",
      },
      { type: "seksjon", id: "pris", tittel: "Pris er ikke problemet" },
      {
        type: "avsnitt",
        tekst:
          "Pris rangerer typisk langt nede på listen over hvorfor kunder går. Det har en praktisk konsekvens: å tilby rabatt til en kunde som vurderer å slutte, løser sjelden noe. Det bekrefter bare at prisen var temaet, og da er neste samtale også om pris.",
      },
      {
        type: "avsnitt",
        tekst:
          "Sier en kunde at det er for dyrt, er det verdt å spørre én gang til hva som ligger bak. Ofte er «for dyrt» en høflig måte å si «jeg ser ikke hva jeg får».",
      },
      { type: "seksjon", id: "varsel", tittel: "Tre varsellamper" },
      {
        type: "punkter",
        punkter: [
          "Kunden slutter å svare like raskt som før. Ikke fiendtlig — bare tregere. Dette kommer nesten alltid først.",
          "Møtene blir korte og praktiske. Ingen spør om ideer lenger.",
          "De begynner å publisere ting selv, ved siden av det vi lager.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Alle tre er signaler om at kunden har begynt å tenke på oss som en leverandør i stedet for en partner. Det er reversibelt, men bare hvis noen oppdager det og gjør noe.",
      },
      { type: "seksjon", id: "deg", tittel: "Hva det betyr for deg" },
      {
        type: "avsnitt",
        tekst:
          "Det viktigste funnet er samtidig det mest oppmuntrende: årsakene er ting vi styrer selv. Ingen av dem krever større budsjett, bedre utstyr eller flere folk. De krever at noen tar initiativ, holder kunden informert, og viser hva som faktisk er levert.",
      },
      {
        type: "sitat",
        tekst: "Ved å alltid være proaktiv, godt forberedt og entusiastisk.",
        kilde: "Pål — om hvordan vi når begge målene",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er ikke en plakat. Det er en ganske presis beskrivelse av de tre tingene undersøkelsene sier at kunder savner når de går.",
      },
    ],
    kilder: [
      {
        tittel:
          "ALM Corp: Why clients fire marketing agencies — common reasons and warning signs",
        url: "https://almcorp.com/blog/why-clients-fire-marketing-agencies-retention-scripts/",
        sjekket: "2026-09-21",
      },
      {
        tittel: "Focus Digital: Average marketing agency churn report",
        url: "https://focus-digital.co/average-marketing-agency-churn/",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "proaktiv-kundekontakt",
    tittel: "Proaktiv kontakt mellom produksjonsdagene",
    sammendrag:
      "Kunden ser oss én dag i måneden. De resterende tjuetre er det opp til oss om vi finnes. En rytme som gjør «proaktiv» til noe konkret.",
    kategori: "kunde",
    medie: {
      type: "bilde",
      fil: "arbeid/pa-vei",
      alt: "Person med bagasje på vei gjennom en parkeringskjeller",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 96,
    oppsummering: [
      { tekst: "Tjuetre dager uten oss", anker: "dager" },
      { tekst: "Fire kontaktpunkter i måneden", anker: "punkter" },
      {
        tekst: "Retningen, ikke hyppigheten, gjør det proaktivt",
        anker: "retning",
      },
    ],
    innhold: [
      { type: "seksjon", id: "dager", tittel: "Tjuetre dager" },
      {
        type: "avsnitt",
        tekst:
          "En kunde på abonnement ser oss én dag i måneden. De resterende tjuetre virkedagene er det opp til oss om vi finnes. Blir vi tause mellom dagene, er det ikke kvaliteten på videoene som vurderes når fakturaen kommer — det er om det føltes som om noe skjedde.",
      },
      { type: "seksjon", id: "punkter", tittel: "Fire kontaktpunkter" },
      {
        type: "steg",
        steg: [
          {
            tittel: "Dagen etter produksjonsdagen",
            tekst:
              "Kort melding med ett bilde eller ett klipp fra dagen. Ikke en statusrapport — et tegn på at materialet er i hus og at noen jobber med det.",
          },
          {
            tittel: "Når første video er ute",
            tekst:
              "Si fra at den er publisert, og hvor. Kunden skal aldri oppdage sin egen publisering ved en tilfeldighet.",
          },
          {
            tittel: "Midt mellom to produksjonsdager",
            tekst:
              "Ett konkret forslag, basert på noe du faktisk har sett — en ny rett, en sesong som kommer, et lokale som er pusset opp.",
          },
          {
            tittel: "Uken før neste dag",
            tekst:
              "Bekreft tid, sted og hvem som stiller. Siste frist for å melde behov for stillbilder, siden de deler kapasitet med video.",
          },
        ],
      },
      { type: "seksjon", id: "retning", tittel: "Retningen" },
      {
        type: "avsnitt",
        tekst:
          "Det som gjør kontakten proaktiv er ikke hyppigheten. Det er retningen: vi kommer med noe, i stedet for å spørre om noe. Fire meldinger der alle fire ber kunden om noe, er reaktiv kontakt i fire porsjoner.",
      },
      {
        type: "merknad",
        tekst:
          "Et forslag trenger ikke være stort for å telle. Det må bare være ditt, og det må vise at du har sett på dem siden sist.",
      },
    ],
  },

  {
    slug: "forventninger-fra-dag-en",
    tittel: "Sett forventningene før de settes for deg",
    sammendrag:
      "De fleste konflikter med kunder er forventninger som aldri ble uttalt. Fem ting som skal være sagt høyt i oppstarten.",
    kategori: "kunde",
    medie: {
      type: "bilde",
      fil: "arbeid/stallen-1600",
      alt: "Et kjøkkenteam samlet rundt en rød bok",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 88,
    oppsummering: [
      { tekst: "Konflikter er uuttalte forventninger", anker: "uuttalt" },
      { tekst: "Fem ting som må sies høyt", anker: "fem" },
      { tekst: "Si det som er ubehagelig først", anker: "ubehagelig" },
    ],
    innhold: [
      { type: "seksjon", id: "uuttalt", tittel: "Uuttalte forventninger" },
      {
        type: "avsnitt",
        tekst:
          "Nesten hver vanskelig samtale med en kunde kan spores tilbake til noe ingen sa i starten. Kunden trodde noe, vi antok noe annet, og begge oppdaget det først da det ble et problem.",
      },
      { type: "seksjon", id: "fem", tittel: "Fem ting som må sies" },
      {
        type: "sjekkliste",
        tittel: "I oppstartsmøtet",
        punkter: [
          "Hva som inngår, og hva som ikke gjør det — særlig kommentarfelt, stories og betalt annonsering.",
          "At 8–10 videoer er et produksjonsmål, ikke en garanti, og hvorfor.",
          "At stillbilder dekkes ved behov, men deler kapasitet med video.",
          "Hvem hos dem som bestemmer, og hvem vi kontakter til daglig.",
          "Hva vi trenger fra dem: folk som stiller, tilgang til lokalet, og beskjed i tide.",
        ],
      },
      { type: "seksjon", id: "ubehagelig", tittel: "Si det ubehagelige først" },
      {
        type: "avsnitt",
        tekst:
          "Det er fristende å la det som begrenser leveransen ligge til senere. Ikke gjør det. Å si «vi håndterer ikke kommentarfeltet» i første møte er en detalj. Å si det i måned fire, etter at en kunde har fått en sur kommentar liggende i tre dager, er en konflikt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er dessuten en av grunnene til at Reflektor selger som vi gjør. Vi sier tydelig hva som ikke inngår, fordi «SoMe-byrå» betyr ulike ting hos ulike leverandører. Ærligheten er salgsargumentet — ikke et forbehold vi helst skulle vært foruten.",
      },
    ],
  },

  {
    slug: "daarlige-nyheter",
    tittel: "Å gi dårlige nyheter",
    sammendrag:
      "Noe kommer til å gå galt. Måten du sier fra på avgjør om det blir en ripe eller et brudd.",
    kategori: "kunde",
    medie: {
      type: "bilde",
      fil: "arbeid/bekkestua",
      alt: "To personer passerer hverandre i motlys fra et vindu",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 82,
    oppsummering: [
      { tekst: "Tidlig slår alltid pent", anker: "tidlig" },
      { tekst: "Fire deler i beskjeden", anker: "deler" },
      { tekst: "Ikke forklar for mye", anker: "forklar" },
      { tekst: "Hva du aldri gjør", anker: "aldri" },
    ],
    innhold: [
      { type: "seksjon", id: "tidlig", tittel: "Tidlig slår pent" },
      {
        type: "avsnitt",
        tekst:
          "En forsinkelse du melder på mandag er en forsinkelse. Den samme forsinkelsen kunden oppdager selv på torsdag, er et tillitsbrudd. Forskjellen er ikke størrelsen på problemet — det er hvem som oppdaget det først.",
      },
      { type: "seksjon", id: "deler", tittel: "Fire deler" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Si hva som har skjedd",
            tekst: "Rett fram, i første setning. Ingen oppbygging.",
          },
          {
            tittel: "2 — Si hva det betyr for dem",
            tekst:
              "Konsekvensen i deres kalender, ikke i vår. «Torsdagens post går ut mandag i stedet.»",
          },
          {
            tittel: "3 — Si hva vi gjør med det",
            tekst: "Konkret, og noe som allerede er i gang.",
          },
          {
            tittel: "4 — Si når de hører fra deg igjen",
            tekst:
              "Et tidspunkt. Dette er den delen folk glemmer, og den som gjør mest for roen.",
          },
        ],
      },
      { type: "seksjon", id: "forklar", tittel: "Ikke forklar for mye" },
      {
        type: "avsnitt",
        tekst:
          "En lang forklaring leser som en unnskyldning, selv når den er sann. Kunden trenger å vite hva som skjer videre, ikke hvorfor kameraet svarte som det gjorde. Hold årsaken til én setning med mindre de spør.",
      },
      { type: "seksjon", id: "aldri", tittel: "Aldri" },
      {
        type: "punkter",
        punkter: [
          "Aldri legg skylden på en kollega, en underleverandør eller kunden selv. Utad er det oss.",
          "Aldri lov noe du ikke vet at du kan holde, for å dempe stemningen der og da.",
          "Aldri la det ligge til neste møte fordi det passer dårlig nå.",
        ],
      },
    ],
  },

  {
    slug: "naar-kunden-er-misfornoyd",
    tittel: "Når kunden er misfornøyd",
    sammendrag:
      "Kritikk er informasjon, men den kommer sjelden pent pakket. Slik tar du imot den uten å bli defensiv, og uten å love bort huset.",
    kategori: "kunde",
    medie: {
      type: "bilde",
      fil: "arbeid/peppes2-vegg",
      alt: "Person i rosa jakke ved et bord i et lokale med dempet lys",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 74,
    oppsummering: [
      { tekst: "Første jobb: forstå hva de faktisk sier", anker: "forsta" },
      { tekst: "Skill mellom smak, forventning og feil", anker: "skill" },
      { tekst: "Hva du gjør med hver av de tre", anker: "gjor" },
    ],
    innhold: [
      { type: "seksjon", id: "forsta", tittel: "Forstå først" },
      {
        type: "avsnitt",
        tekst:
          "Den første reaksjonen er å forklare. Ikke gjør det. Still ett spørsmål til før du sier noe: «Kan du vise meg hvilken du tenker på?» eller «Hva var det du hadde sett for deg?» Halvparten av alle klager endrer form når de blir konkrete.",
      },
      { type: "seksjon", id: "skill", tittel: "Tre slags misnøye" },
      {
        type: "tabell",
        kolonner: ["Type", "Høres ut som", "Hva det egentlig er"],
        rader: [
          [
            "Smak",
            "«Jeg liker ikke den musikken»",
            "En preferanse. Legitim, og billig å innfri",
          ],
          [
            "Forventning",
            "«Jeg trodde vi skulle få flere»",
            "Noe som ble uklart i oppstarten",
          ],
          [
            "Feil",
            "«Navnet vårt er stavet feil»",
            "Vår feil. Skal rettes uten diskusjon",
          ],
        ],
      },
      { type: "seksjon", id: "gjor", tittel: "Hva du gjør" },
      {
        type: "punkter",
        punkter: [
          "Smak: fiks det hvis det er lett, og noter preferansen så den ikke gjentas. Ikke argumenter mot noens smak.",
          "Forventning: gå tilbake til hva som faktisk er avtalt, rolig og uten å ha rett. Avklar for framtiden i samme samtale.",
          "Feil: beklag én gang, rett det raskt, og si hva vi gjør for at det ikke skjer igjen. Ikke beklag tre ganger — det gjør feilen større enn den er.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Er du i tvil om det er forventning eller feil, behandle det som feil. Det koster oss lite, og det er den billigste måten å kjøpe tilbake tillit på.",
      },
    ],
  },

  {
    slug: "kundemotet",
    tittel: "Kundemøtet: struktur som gjør det verdt tiden",
    sammendrag:
      "Et møte uten struktur blir en statusoppdatering. Fire deler som gjør at kunden går ut med noe de ikke hadde da de kom inn.",
    kategori: "kunde",
    medie: {
      type: "bilde",
      fil: "arbeid/scene-vegg",
      alt: "Presentasjon foran storskjerm i en konferansesal",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 66,
    oppsummering: [
      { tekst: "Fire deler, i denne rekkefølgen", anker: "deler" },
      { tekst: "Begynn med det som gikk bra", anker: "bra" },
      { tekst: "Avslutt med hvem som gjør hva", anker: "slutt" },
    ],
    innhold: [
      { type: "seksjon", id: "deler", tittel: "Fire deler" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Hva vi leverte siden sist",
            tekst: "Kort. Vis, ikke fortell. To minutter.",
          },
          {
            tittel: "2 — Hva vi ser i tallene",
            tekst:
              "Tre setninger: hva vi ser, hva vi tror det betyr, hva vi gjør med det.",
          },
          {
            tittel: "3 — Hva vi foreslår framover",
            tekst:
              "Her ligger verdien av møtet. Kom med noe konkret, ikke en meny å velge fra.",
          },
          {
            tittel: "4 — Hva vi trenger fra dere",
            tekst: "Folk, tilgang, datoer, beslutninger. Med frister.",
          },
        ],
      },
      { type: "seksjon", id: "bra", tittel: "Begynn med det som gikk bra" },
      {
        type: "avsnitt",
        tekst:
          "Ikke som smisking, men fordi det setter rammen: dette er et samarbeid som produserer noe. Et møte som åpner med problemer, blir et problemmøte uansett hva som står på resten av agendaen.",
      },
      { type: "seksjon", id: "slutt", tittel: "Avslutt med hvem som gjør hva" },
      {
        type: "avsnitt",
        tekst:
          "Siste to minutter: les opp hvem som gjør hva, innen når. Send det samme skriftlig innen dagen er omme. Det tar fem minutter og fjerner nesten all tvil om hva som ble sagt.",
      },
    ],
  },
];
