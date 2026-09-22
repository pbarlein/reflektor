import type { Rubrikk } from "../rubrikktype.ts";

/** Redigeringsfasen. Fra råmateriale til noe som stopper tommelen. */
export const REDIGERING: readonly Rubrikk[] = [
  {
    slug: "de-forste-tre-sekundene",
    nr: 41,
    tittel: "De første tre sekundene",
    sammendrag:
      "Beslutningen om å bli eller dra tas før seeren rekker å tenke. Hva som skal skje der, og de fire tingene som garantert koster deg dem.",
    kategori: "redigering",
    status: "lansert",
    medie: {
      type: "video",
      fil: "reels/antonburst",
      alt: "Nærbilde av en sko som sparker opp jord i fart",
    },
    oppdatert: "2026-09-22",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hva videoen faktisk konkurrerer med", anker: "konkurrent" },
      { tekst: "Fire ting som skal skje tidlig", anker: "skal" },
      { tekst: "Fire ting som koster deg seeren", anker: "koster" },
      {
        tekst: "Den vanligste feilen: det gode ligger på tjue sekunder",
        anker: "tjue",
      },
      { tekst: "Testen du gjør på deg selv", anker: "test" },
    ],
    innhold: [
      { type: "seksjon", id: "konkurrent", tittel: "Hva du konkurrerer med" },
      {
        type: "avsnitt",
        tekst:
          "En video i en feed konkurrerer ikke med andre videoer. Den konkurrerer med tommelen. Seeren har ikke valgt å se på noe bestemt, og avgjørelsen tas på det som er i bildet — ikke på det som kommer.",
      },
      {
        type: "avsnitt",
        tekst:
          "Instagram har publisert hva de faktisk anslår for en reel: hvor sannsynlig det er at du deler den videre, at du ser den helt ut, at du liker den, og at du går til lydsiden. To av de fire avgjøres i praksis av åpningen. Den som drar etter to sekunder, verken fullfører eller deler.",
      },
      {
        type: "avsnitt",
        tekst:
          "Legg til at mye av avspillingen skjer uten lyd. I en studie med 161 deltakere ble det samme tekstede innholdet vist med og uten lyd: uten lyd rapporterte deltakerne langt høyere anstrengelse og frustrasjon, og de brukte lengre tid på hver undertekst. Åpningen må altså gi mening for noen som ikke hører noe, og som allerede jobber hardere enn du tror.",
      },
      { type: "seksjon", id: "skal", tittel: "Hva som skal skje" },
      {
        type: "punkter",
        punkter: [
          "Start på bevegelse eller på et ansikt. Et statisk bilde av et lokale er en pause seeren ikke har bedt om.",
          "Hvis det snakkes: første setning skal være poenget, ikke opptakten til det.",
          "Legg tekst på skjermen fra bilde én, hvis videoen har et budskap som kan leses.",
          "Det mest interessante i hele videoen skal være synlig eller antydet med en gang.",
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DaDm7nEP76s/",
          konto: "figma",
          hvem: "Figma — amerikansk programvareselskap. Selger et designverktøy på abonnement til bedrifter og designteam over hele verden.",
          folgere: 961188,
          visninger: 836031,
          likes: 35526,
          hentet: "2026-09-21",
          seEtter:
            "Åpningen er et spørsmål, ikke en introduksjon: «wdym brat was designed in Figma??» står som tekst i bilde én, over et rom du ennå ikke har kontekst for. Hullet mellom det du vet og det du vil vite er hele kroken. Legg merke til at selskapet ikke sier ett ord om hva de selger før du allerede har bestemt deg for å se.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dc_b9-ChQoS/",
          konto: "scrubdaddy",
          hvem: "Scrub Daddy — amerikansk produsent av rengjøringsprodukter. Selger svamper og børster i dagligvare og på nett, globalt.",
          folgere: 714712,
          visninger: 1356029,
          likes: 43771,
          hentet: "2026-09-21",
          seEtter:
            "Dette er motsatt oppskrift, men samme prinsipp. Produktet er i bilde én, i hånda og i bruk, så nært at du ser hva det er før du har lest noe. Ingen logoanimasjon, ingen oppbygging. Dette er grepet for et fysisk produkt: vis tingen tett nok til at den blir konkret, før du sier noe som helst.",
        },
      },
      { type: "seksjon", id: "koster", tittel: "Hva som koster deg seeren" },
      {
        type: "merknad",
        tekst:
          "De fire er logoanimasjonen, «hei og velkommen til», en oppbygging som forklarer hva videoen skal handle om, og stillhet. Alle fire er vanlige, og alle fire er bortkastede sekunder.",
      },
      {
        type: "seksjon",
        id: "tjue",
        tittel: "Det gode ligger på tjue sekunder",
      },
      {
        type: "avsnitt",
        tekst:
          "Den vanligste feilen er ikke at åpningen er kjedelig. Det er at den gode delen ligger for langt inn. Klipp foran: begynn videoen der det begynner å bli interessant, og bruk det som lå foran som dekning senere — hvis det i det hele tatt skal med.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det føles feil første gang, fordi det bryter med rekkefølgen tingene skjedde i. Men seeren var ikke der, og bryr seg ikke om kronologien din.",
      },
      { type: "seksjon", id: "test", tittel: "Testen" },
      {
        type: "avsnitt",
        tekst:
          "Se videoen på telefonen, uten lyd, i en feed. Er det noe som gjør at du ikke drar videre? Er svaret nei, er det åpningen som må endres — ikke resten.",
      },
    ],
    kilder: [
      {
        tittel:
          "Instagram: Instagram Ranking Explained — How Our Algorithm Works",
        url: "https://about.instagram.com/blog/announcements/instagram-ranking-explained",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Szarkowska m.fl. (2024): Watching subtitled videos with the sound off. PLOS ONE 19(10), e0306251",
        url: "https://doi.org/10.1371/journal.pone.0306251",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "teksting-og-tekstplakater",
    nr: 42,
    tittel: "Teksting som faktisk er lesbar",
    sammendrag:
      "Teksting inngår i leveransen, og de fleste ser uten lyd. Slik settes den så den er lesbar på en telefon i sollys — og ikke havner bak grensesnittet.",
    kategori: "redigering",
    status: "lansert",
    medie: {
      type: "video",
      fil: "reels/zeroh",
      alt: "Folk samlet ved en stand på et utendørsarrangement",
    },
    oppdatert: "2026-09-22",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 92,
    oppsummering: [
      { tekst: "Teksting er ikke et tillegg", anker: "ikke-tillegg" },
      { tekst: "Fem krav til selve teksten", anker: "krav" },
      { tekst: "Hvor på skjermen den kan stå", anker: "hvor" },
      { tekst: "Automatisk teksting er et utkast", anker: "auto" },
      { tekst: "Hvor lenge en tekstplakat skal stå", anker: "lenge" },
    ],
    innhold: [
      { type: "seksjon", id: "ikke-tillegg", tittel: "Ikke et tillegg" },
      {
        type: "avsnitt",
        tekst:
          "Teksting står i leveransen, og den er ikke et tilgjengelighetstillegg — det er standardmåten innhold i en feed blir sett på. Store deler av avspillingen skjer uten lyd, på steder der lyd ikke er et alternativ.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den gjør også innholdet tilgjengelig for folk som ikke hører godt. Det er en selvfølge, og det er verdt å si høyt: vi tekster alt, uten at noen må be om det.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er verdt å vite hva teksting faktisk gjør og ikke gjør. En studie med 161 deltakere viste de samme tekstede videoene med og uten lyd. Forståelsen holdt seg nesten like høy uten lyd — 78 mot 81 prosent. Tekstingen gjorde altså jobben sin.",
      },
      {
        type: "avsnitt",
        tekst:
          "Men den gjorde den dyrere for seeren. Uten lyd oppga deltakerne klart høyere opplevd vanskelighet, innsats og frustrasjon, de følte seg mindre dratt inn i innholdet og likte det mindre. Blikkmålingene viste hvorfor: de brukte lengre tid på hver undertekst og hoppet sjeldnere over dem, fordi teksten var den eneste kanalen igjen.",
      },
      {
        type: "merknad",
        tekst:
          "Dette er det praktiske poenget i hele rubrikken. Uten lyd er tekstingen ikke en støtte til innholdet — den ER innholdet, og den leses saktere enn du tror. Derfor: færre ord, lenger på skjermen, og aldri to tekster som konkurrerer om blikket samtidig.",
      },
      { type: "seksjon", id: "krav", tittel: "Fem krav" },
      {
        type: "sjekkliste",
        tittel: "Til selve teksten",
        punkter: [
          "Maks to linjer om gangen, og sjelden mer enn seks ord per linje.",
          "Bruk bakplate, skygge eller kontur. Hvit tekst rett på bildet forsvinner i den første lyse flaten.",
          "Samme posisjon gjennom hele videoen. Tekst som hopper opp og ned er slitsom å følge.",
          "Store nok bokstaver til å leses på en telefon i sollys, ikke på skjermen din.",
          "Les korrektur. Feilstavet teksting på en kundes konto er vår feil, ikke maskinens.",
        ],
      },
      { type: "seksjon", id: "hvor", tittel: "Hvor den kan stå" },
      {
        type: "avsnitt",
        tekst:
          "Meta oppgir at rundt 14 % i toppen, 35 % i bunnen og 6 % i hver side bør holdes fri for tekst og logoer i Stories og Reels. Den nederste tredjedelen er altså plattformens område: brukernavn, bildetekst og knapper legger seg der.",
      },
      {
        type: "merknad",
        tekst:
          "Tekst som ligger for lavt er dekket på noen skjermstørrelser og synlig på andre — og du ser det ikke i redigeringsprogrammet. Legg tekstingen i midtre tredjedel av høyden, ikke nederst.",
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbGaNt0RRcN/",
          konto: "shopify",
          hvem: "Shopify — kanadisk teknologiselskap. Selger en nettbutikkplattform på abonnement til netthandlere over hele verden.",
          folgere: 2672728,
          visninger: 225638,
          likes: 1209,
          hentet: "2026-09-21",
          seEtter:
            "Tekstplakaten står midt i bildehøyden, ikke nederst. To ord, store nok til å leses på en armlengdes avstand, og de bærer hele premisset for videoen før noen har sagt noe. Ingenting av teksten er i nedre tredjedel — det er der brukernavn, bildetekst og knapper legger seg på telefonen.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DdT0BvWjdmP/",
          konto: "festool",
          hvem: "Festool — tysk produsent av elektroverktøy. Selger sager, slipere og støvsugere til snekkere, malere og industri gjennom forhandlere.",
          folgere: 610867,
          visninger: 221850,
          likes: 1716,
          hentet: "2026-09-21",
          seEtter:
            "Samme regel, men en helt annen bransje. Plakaten står i øvre midtfelt over et gjærsagblad, med produktnavnet på én linje og bruksområdet på den neste. To linjer, ingen hel setning. En snekker vet på et halvt sekund om dette angår hen. Legg merke til at teksten ikke gjentar det bildet allerede viser: bildet viser sagen, og teksten sier hva den er til.",
        },
      },
      { type: "seksjon", id: "auto", tittel: "Automatikk er et utkast" },
      {
        type: "avsnitt",
        tekst:
          "Automatisk generert teksting er et utgangspunkt, ikke et resultat. Norsk gjenkjennes godt, men produktnavn, egennavn, stedsnavn og fagord blir feil — og det er nettopp de ordene kunden legger merke til. Dialekt gjør det verre.",
      },
      { type: "seksjon", id: "lenge", tittel: "Hvor lenge en plakat står" },
      {
        type: "avsnitt",
        tekst:
          "Tekstplakater — de som bærer et budskap i stedet for tale — skal stå lenge nok til å leses to ganger. Regn rundt to og et halvt sekund for en kort linje. Les den høyt for deg selv mens du ser på: rekker du det, rekker seeren det.",
      },
    ],
    kilder: [
      {
        tittel:
          "Meta Business Help Centre: About text overlays and the Safe Zone for ads in Stories and Reels",
        url: "https://www.facebook.com/business/help/980593475366490/",
        sjekket: "2026-09-21",
      },
      {
        tittel:
          "Szarkowska, Ragni, Szkriba, Black, Orrego-Carmona & Kruger (2024): Watching subtitled videos with the sound off affects viewers’ comprehension, cognitive load, immersion, enjoyment, and gaze patterns. PLOS ONE 19(10), e0306251",
        url: "https://doi.org/10.1371/journal.pone.0306251",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "eksport-og-spesifikasjoner",
    nr: 43,
    tittel: "Eksport: å gi plattformen et godt utgangspunkt",
    sammendrag:
      "Alt du laster opp blir komprimert på nytt. Du kan ikke unngå det, men du kan levere noe som tåler behandlingen.",
    kategori: "redigering",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/noods",
      alt: "Flere retter i skåler, sett rett ovenfra mot oransje bakgrunn",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 70,
    oppsummering: [
      { tekst: "Hovedregelen", anker: "regel" },
      { tekst: "Hva Meta selv oppgir", anker: "meta" },
      { tekst: "Komprimer aldri to ganger", anker: "to-ganger" },
      { tekst: "Normaliser lyden før eksport", anker: "lyd" },
    ],
    innhold: [
      { type: "seksjon", id: "regel", tittel: "Hovedregelen" },
      {
        type: "avsnitt",
        tekst:
          "Lever høyere kvalitet enn det som vises, og unngå at filen komprimeres to ganger. Det er hele prinsippet. Resten er detaljer som følger av det.",
      },
      { type: "seksjon", id: "meta", tittel: "Hva Meta oppgir" },
      {
        type: "punkter",
        punkter: [
          "9:16 anbefales for Reels for å unngå beskjæring eller svarte felt.",
          "Maks bredde 1440 piksler — bredere skaleres ned uansett.",
          "H.264 eller HEVC, progressiv skanning, i MP4 eller MOV.",
          "Lyd i AAC, 48 kHz.",
          "Bildefrekvens mellom 23 og 60.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Plattformspesifikasjoner er ferskvare. Tallene over er hentet fra Metas egen dokumentasjon på datoen i kildelisten. Skal de brukes til noe som betyr noe, sjekk dem på nytt først.",
      },
      { type: "seksjon", id: "to-ganger", tittel: "Ikke komprimer to ganger" },
      {
        type: "avsnitt",
        tekst:
          "Gjør én eksport fra tidslinjen, og last den rett opp. Ikke eksporter, komprimer og last opp. Pass også på overføringen til telefonen: en video sendt som vanlig melding er allerede forringet før plattformen får se den.",
      },
      {
        type: "avsnitt",
        tekst:
          "Bruk samme bildefrekvens som opptaket. Konvertering mellom 25 og 30 gir små rykk i panoreringer som er umulige å se i én video og irriterende å se i ti.",
      },
      { type: "seksjon", id: "lyd", tittel: "Normaliser lyden" },
      {
        type: "avsnitt",
        tekst:
          "Lydnivå som spretter opp og ned fra post til post, er noe seeren merker uten å vite hva det er. Legg deg på ett fast nivå på tvers av alle videoene i samme måned.",
      },
    ],
    kilder: [
      {
        tittel: "Instagram Help: Reel size and aspect ratios",
        url: "https://help.instagram.com/1038071743007909",
        sjekket: "2026-09-21",
      },
      {
        tittel: "Meta Ads Guide: Instagram Reels",
        url: "https://www.facebook.com/business/ads-guide/update/video/instagram-reels",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "klipperytme",
    nr: 44,
    tittel: "Klipperytme: når det skal gå fort, og når det ikke skal",
    sammendrag:
      "Rask klipping er ikke automatisk bedre. Rytmen skal følge innholdet og bransjen, ikke en trend.",
    kategori: "redigering",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "reels/antonsport",
      alt: "Skikjører i løypa mellom trær",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 66,
    oppsummering: [
      { tekst: "Rytmen følger innholdet", anker: "folger" },
      { tekst: "Når rask klipping er riktig", anker: "rask" },
      { tekst: "Når den er feil", anker: "feil" },
      { tekst: "Klipp på bevegelse", anker: "bevegelse" },
    ],
    innhold: [
      { type: "seksjon", id: "folger", tittel: "Rytmen følger innholdet" },
      {
        type: "avsnitt",
        tekst:
          "Det er fristende å klippe raskt fordi det føles moderne. Men rytmen er ikke en stil du legger oppå — den er en konsekvens av hva videoen skal gjøre med seeren.",
      },
      { type: "seksjon", id: "rask", tittel: "Når raskt er riktig" },
      {
        type: "punkter",
        punkter: [
          "Rask klipping er riktig når det er energi i selve motivet, som bevegelse, sport eller et travelt kjøkken.",
          "Den er riktig når videoen skal vise mye på kort tid, som et utvalg eller en forvandling.",
          "Den er riktig når det ikke er tale i videoen, og rytmen må komme fra bildene alene.",
        ],
      },
      { type: "seksjon", id: "feil", tittel: "Når det er feil" },
      {
        type: "punkter",
        punkter: [
          "Rask klipping er feil når noen forklarer noe. Et kutt midt i en tanke gjør tanken vanskeligere å følge.",
          "Den er feil når motivet er rolig av natur, som en behandling, et håndverk eller mat som skal se god ut.",
          "Den er feil når fagligheten er poenget. Rask klipping på en teknisk forklaring leser som at vi ikke tror folk gidder å høre etter.",
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Db15EO7NRhH/",
          konto: "saltandstraw",
          hvem: "Salt & Straw — amerikansk iskremkjede fra Portland. Selger iskrem over disk i egne butikker og på nett.",
          folgere: 511400,
          visninger: 1120874,
          likes: 9519,
          hentet: "2026-09-21",
          seEtter:
            "Dette er raskt, og riktig raskt. En oppskrift har mange steg som alle må vises, og ingen av dem må forstås i dybden. Da er tett klipping ikke en stil, men den eneste måten å få plass til alt. Tell klippene i de første ti sekundene, og gjør det samme på eiendomseksempelet ved siden av. Forskjellen er ikke smak.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Da0gfUkBRZs/",
          konto: "sothebysrealty",
          hvem: "Sotheby's International Realty — internasjonal eiendomsmegler i luksussegmentet. Formidler boliger gjennom lokale kontorer i over åtti land.",
          folgere: 582523,
          visninger: 398913,
          likes: 19382,
          hentet: "2026-09-21",
          seEtter:
            "Dette er samme måned og samme plattform, med motsatt rytme. Bildene får stå. Grunnen er at motivet skal FØLES og ikke telles, akkurat som et behandlingsrom, en sal eller et lokale en kunde skal ønske seg til. Hadde dette vært klippet like tett som iskremoppskriften ved siden av, hadde huset sett stresset ut — og det er det motsatte av det som selger det.",
        },
      },
      { type: "seksjon", id: "bevegelse", tittel: "Klipp på bevegelse" },
      {
        type: "avsnitt",
        tekst:
          "Et kutt som ligger midt i en bevegelse, for eksempel en hånd som går ned eller en dør som lukkes, forsvinner for øyet. Det samme kuttet to bilder senere, når alt står stille, ser man med en gang. Dette er den enkleste måten å få en redigering til å virke mer gjennomarbeidet enn den er.",
      },
    ],
  },

  {
    slug: "musikk-og-lyd-i-redigering",
    nr: 45,
    tittel: "Musikk og lyd i redigeringen",
    sammendrag:
      "Musikk kan bære en video eller ødelegge den. Og rettighetene er ikke en detalj — det er kundens konto som rammes.",
    kategori: "redigering",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "arbeid/kakao",
      alt: "Mørk drikke som helles i et glass",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 58,
    oppsummering: [
      { tekst: "Rettigheter først", anker: "rettigheter" },
      { tekst: "Musikkens jobb er å støtte, ikke å fylle", anker: "jobb" },
      { tekst: "Behold lyden fra opptaket", anker: "opptakslyd" },
    ],
    innhold: [
      { type: "seksjon", id: "rettigheter", tittel: "Rettigheter først" },
      {
        type: "avsnitt",
        tekst:
          "Musikk som ikke er klarert kan gi dempet lyd, blokkert video eller merknader på kundens konto. Det er kunden som rammes, ikke vi, og det er derfor dette ikke er en detalj.",
      },
      {
        type: "merknad",
        tekst:
          "Plattformenes egne musikkbibliotek har egne regler for bedriftskontoer, og de er ikke de samme som for privatkontoer. Sjekk hva som faktisk gjelder for en profesjonell konto før du bruker et populært spor.",
      },
      { type: "seksjon", id: "jobb", tittel: "Musikkens jobb" },
      {
        type: "avsnitt",
        tekst:
          "Musikk skal støtte tempoet som allerede finnes i klippingen. Legger du musikk på for å skjule at videoen mangler rytme, hører man det. Prøv å se redigeringen uten musikk: fungerer den ikke da, er det klippingen som må fikses.",
      },
      {
        type: "seksjon",
        id: "opptakslyd",
        tittel: "Behold lyden fra opptaket",
      },
      {
        type: "avsnitt",
        tekst:
          "Lyden fra stedet — kaffemaskinen, kniven mot fjøla, stemmene i lokalet — gjør videoen ekte på en måte musikk ikke kan. Legg den under musikken i stedet for å erstatte den. Det er ofte forskjellen på at noe ser ut som en reklame og at det ser ut som en bedrift.",
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbBSuIVAOu_/",
          konto: "caterpillarinc",
          hvem: "Caterpillar — amerikansk produsent av anleggsmaskiner. Selger gravemaskiner, dozere og motorer til entreprenører og industri.",
          folgere: 1091197,
          visninger: 875386,
          likes: 5511,
          hentet: "2026-09-21",
          seEtter:
            "Bildeteksten er hele poenget, og den er på fire ord: «No trending audio needed.» Et selskap med 1,1 millioner følgere sier rett ut at de dropper trendlyden — og får 875 386 visninger på det. Neste gang du strekker deg etter et musikkspor: hør gjennom opptakslyden først, og spør om den er dårligere enn det du var i ferd med å legge oppå. Ofte er den ikke det.",
        },
      },
    ],
  },
];
