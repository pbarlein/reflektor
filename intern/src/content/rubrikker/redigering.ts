import type { Rubrikk } from "../rubrikktype.ts";

/** Redigeringsfasen. Fra råmateriale til noe som stopper tommelen. */
export const REDIGERING: readonly Rubrikk[] = [
  {
    slug: "de-forste-tre-sekundene",
    tittel: "De første tre sekundene",
    sammendrag:
      "Beslutningen om å bli eller dra tas før seeren rekker å tenke. Hva som skal skje der, og de fire tingene som garantert koster deg dem.",
    kategori: "redigering",
    medie: {
      type: "video",
      fil: "reels/battery",
      alt: "Boks i nærbilde med væske som spruter",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hva videoen faktisk konkurrerer med", anker: "konkurrent" },
      { tekst: "Fire ting som skal skje tidlig", anker: "skal" },
      { tekst: "Fire ting som koster deg seeren", anker: "koster" },
      { tekst: "Den vanligste feilen: det gode ligger på tjue sekunder", anker: "tjue" },
      { tekst: "Testen du gjør på deg selv", anker: "test" },
    ],
    innhold: [
      { type: "seksjon", id: "konkurrent", tittel: "Hva du konkurrerer med" },
      {
        type: "avsnitt",
        tekst:
          "En video i en feed konkurrerer ikke med andre videoer. Den konkurrerer med tommelen. Seeren har ikke valgt å se på noe bestemt, og avgjørelsen tas på det som er i bildet — ikke på det som kommer.",
      },
      { type: "seksjon", id: "skal", tittel: "Hva som skal skje" },
      {
        type: "punkter",
        punkter: [
          "Start på bevegelse eller på et ansikt. Et statisk bilde av et lokale er en pause seeren ikke har bedt om.",
          "Hvis det snakkes: første setning skal være poenget, ikke opptakten til det.",
          "Tekst på skjerm fra bilde én, hvis videoen har et budskap som kan leses.",
          "Det mest interessante i hele videoen skal være synlig eller antydet med en gang.",
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Da8ut-0zODu/",
          konto: "joshuaweissman",
          visninger: 20490442,
          likes: 675689,
          hentet: "2026-09-21",
          seEtter:
            "Åpningsbildet: to hender som presser en visp ned i en avokado. Det gir ikke mening ennå, og det er hele poenget — du må se videre for å forstå hva som skjer. Dette er «brudd i mønsteret» i sin reneste form.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dax9UuXzmKX/",
          konto: "joshuaweissman",
          visninger: 9788946,
          likes: 32825,
          hentet: "2026-09-21",
          seEtter:
            "Den starter midt i handlingen — væsken helles i panna i bilde én. Ingen introduksjon, ingen «i dag skal jeg vise dere». Sammenlign med hvor mange bedriftsvideoer som bruker de samme tre sekundene på en logo.",
        },
      },
      { type: "seksjon", id: "koster", tittel: "Hva som koster deg seeren" },
      {
        type: "merknad",
        tekst:
          "Logo-animasjon. «Hei, og velkommen til.» En oppbygging som forklarer hva videoen skal handle om. Stillhet. Alle fire er vanlige, og alle fire er bortkastede sekunder.",
      },
      { type: "seksjon", id: "tjue", tittel: "Det gode ligger på tjue sekunder" },
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
  },

  {
    slug: "teksting-og-tekstplakater",
    tittel: "Teksting som faktisk er lesbar",
    sammendrag:
      "Teksting inngår i leveransen, og de fleste ser uten lyd. Slik settes den så den er lesbar på en telefon i sollys — og ikke havner bak grensesnittet.",
    kategori: "redigering",
    medie: {
      type: "video",
      fil: "reels/zeroh",
      alt: "Folk samlet ved en stand på et utendørsarrangement",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
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
          "Teksting står i leveransen, og den er ikke et tilgjengelighetstillegg — det er standardmåten innhold i en feed blir sett på. Mesteparten av avspillingen skjer uten lyd, på steder der lyd ikke er et alternativ.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den gjør også innholdet tilgjengelig for folk som ikke hører godt. Det er en selvfølge, og det er verdt å si høyt: vi tekster alt, uten at noen må be om det.",
      },
      { type: "seksjon", id: "krav", tittel: "Fem krav" },
      {
        type: "sjekkliste",
        tittel: "Til selve teksten",
        punkter: [
          "Maks to linjer om gangen, og sjelden mer enn seks ord per linje.",
          "Bakplate, skygge eller kontur. Hvit tekst rett på bildet forsvinner i første lyse flate.",
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
          url: "https://www.instagram.com/reel/DaXT0z8MNAi/",
          konto: "topjaw",
          visninger: 1010828,
          likes: 20333,
          hentet: "2026-09-21",
          seEtter:
            "Tekstplakaten ligger i midtfeltet, ikke nederst, og den er stor nok til å leses på en armlengdes avstand. Den står der fra bilde én — du vet hva videoen handler om før du har bestemt deg for å se den.",
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
    ],
  },

  {
    slug: "eksport-og-spesifikasjoner",
    tittel: "Eksport: å gi plattformen et godt utgangspunkt",
    sammendrag:
      "Alt du laster opp blir komprimert på nytt. Du kan ikke unngå det, men du kan levere noe som tåler behandlingen.",
    kategori: "redigering",
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
          "Én eksport fra tidslinjen, lastet rett opp. Ikke eksporter, komprimer og last opp. Og pass på overføringen til telefonen: en video sendt som vanlig melding er allerede degradert før plattformen får se den.",
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
          "Videoer som veksler mellom for lavt og for høyt mellom postene, er noe seeren merker uten å vite hva det er. Legg deg på et fast nivå på tvers av alle videoene i samme måned.",
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
    tittel: "Klipperytme: når det skal gå fort, og når det ikke skal",
    sammendrag:
      "Rask klipping er ikke automatisk bedre. Rytmen skal følge innholdet og bransjen, ikke en trend.",
    kategori: "redigering",
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
          "Når det er energi i selve motivet — bevegelse, sport, travelt kjøkken.",
          "Når videoen skal vise mye på kort tid, som et utvalg eller en transformasjon.",
          "Når det ikke er tale, og rytmen må komme fra bildene.",
        ],
      },
      { type: "seksjon", id: "feil", tittel: "Når det er feil" },
      {
        type: "punkter",
        punkter: [
          "Når noen forklarer noe. Et kutt midt i en tanke gjør den vanskeligere å følge.",
          "Når motivet er rolig av natur — behandling, håndverk, mat som skal se god ut.",
          "Når fagligheten er poenget. Rask klipping på en teknisk forklaring leser som at vi ikke tror folk gidder å høre etter.",
        ],
      },
      { type: "seksjon", id: "bevegelse", tittel: "Klipp på bevegelse" },
      {
        type: "avsnitt",
        tekst:
          "Et kutt som ligger midt i en bevegelse — en hånd som går ned, en dør som lukkes — forsvinner for øyet. Samme kutt to bilder senere, når alt står stille, syns. Det er den enkleste måten å få en redigering til å virke mer gjennomarbeidet enn den er.",
      },
    ],
  },

  {
    slug: "musikk-og-lyd-i-redigering",
    tittel: "Musikk og lyd i redigeringen",
    sammendrag:
      "Musikk kan bære en video eller ødelegge den. Og rettighetene er ikke en detalj — det er kundens konto som rammes.",
    kategori: "redigering",
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
      { type: "seksjon", id: "opptakslyd", tittel: "Behold lyden fra opptaket" },
      {
        type: "avsnitt",
        tekst:
          "Lyden fra stedet — kaffemaskinen, kniven mot fjøla, stemmene i lokalet — gjør videoen ekte på en måte musikk ikke kan. Legg den under musikken i stedet for å erstatte den. Det er ofte forskjellen på at noe ser ut som en reklame og at det ser ut som en bedrift.",
      },
    ],
  },
];
