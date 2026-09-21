import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Redigeringsfasen. Fra råmateriale til noe som stopper tommelen.
 *
 * Alle rubrikkene her er UTKAST — se rubrikktype.ts.
 */
export const REDIGERING: readonly Rubrikk[] = [
  {
    slug: "de-forste-tre-sekundene",
    tittel: "De første tre sekundene",
    sammendrag:
      "Utkast: mesteparten av publikum bestemmer seg før sekund tre. Hva som skal skje der, og de fire tingene som garantert koster deg dem.",
    kategori: "redigering",
    medie: {
      type: "video",
      fil: "reels/battery",
      alt: "Boks i nærbilde med væske som spruter",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 90,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "En video i en feed konkurrerer ikke med andre videoer. Den konkurrerer med tommelen. Beslutningen om å bli eller dra tas før seeren har rukket å tenke, og den tas på det som er i bildet — ikke på det som kommer.",
      },
      {
        type: "punkter",
        punkter: [
          "Start på bevegelse eller på et ansikt. Et statisk bilde av et lokale er en pause seeren ikke har bedt om.",
          "Hvis det snakkes: første setning skal være poenget, ikke opptakten til det.",
          "Tekst på skjerm fra bilde én, hvis videoen har et budskap som kan leses.",
          "Det som er mest interessant i hele videoen, skal være synlig eller antydet i sekund én.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Fire ting som koster deg seeren umiddelbart: logo-animasjon, «hei, og velkommen til», en oppbygging som forklarer hva videoen skal handle om, og stillhet.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den vanligste feilen er ikke at åpningen er kjedelig. Det er at den gode delen ligger på tjue sekunder. Klipp foran: begynn videoen der det begynner å bli interessant, og bruk det som lå foran som dekning senere — hvis det i det hele tatt skal med.",
      },
      {
        type: "avsnitt",
        tekst:
          "Test på deg selv med lyden av. Åpner du videoen på telefonen, uten lyd, i en feed — er det noe som gjør at du ikke drar videre? Er svaret nei, er det åpningen som må endres, ikke resten.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: skal det være en fast regel om tekst i bilde én, og hvordan forholder det seg til kunder med egen profilmal?",
      },
    ],
  },
  {
    slug: "teksting-og-tekstplakater",
    tittel: "Teksting og tekstplakater",
    sammendrag:
      "Utkast: teksting inngår i leveransen. Slik settes den så den er lesbar på en telefon i sollys — og ikke havner bak grensesnittet.",
    kategori: "redigering",
    medie: {
      type: "video",
      fil: "reels/zeroh",
      alt: "Folk samlet ved en stand på et utendørsarrangement",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 82,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Teksting står i leveransen, og den er ikke et tilgjengelighetstillegg — det er standardmåten innhold i en feed konsumeres på. Mesteparten av avspillingen skjer uten lyd.",
      },
      {
        type: "sjekkliste",
        tittel: "Krav til teksten",
        punkter: [
          "Maks to linjer om gangen, og aldri mer enn rundt seks ord per linje.",
          "Plassert i midtre tredjedel av høyden — ikke nederst.",
          "Bakplate, skygge eller kontur. Hvit tekst rett på bildet forsvinner i første lyse flate.",
          "Samme posisjon gjennom hele videoen. Tekst som hopper opp og ned, er slitsom å følge.",
          "Les korrektur. Feilstavet teksting på en kundes konto er vår feil, ikke maskinens.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Nedre fjerdedel av bildet er plattformens område: brukernavn, bildetekst og knapper legger seg der. Tekst som ligger for lavt, er dekket på noen skjermstørrelser og synlig på andre — og du ser det ikke i redigeringsprogrammet.",
      },
      {
        type: "avsnitt",
        tekst:
          "Automatisk generert teksting er et utgangspunkt, ikke et resultat. Norsk gjenkjennes godt, men produktnavn, egennavn og fagord blir feil, og det er nettopp de ordene kunden legger merke til.",
      },
      {
        type: "avsnitt",
        tekst:
          "Tekstplakater — de som bærer et budskap, ikke tale — skal stå lenge nok til å leses to ganger. Regn to og et halvt sekund for en kort linje, og les den høyt for deg selv mens du ser på: rekker du det, rekker seeren det.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: har vi en fast tekststil per kunde, og hvor ligger malene?",
      },
    ],
  },
  {
    slug: "eksport-for-instagram-og-facebook",
    tittel: "Eksportinnstillinger for Instagram og Facebook",
    sammendrag:
      "Utkast: riktig eksport er forskjellen mellom skarpt og grøtete etter plattformens egen komprimering. Forslag til faste innstillinger.",
    kategori: "redigering",
    medie: {
      type: "bilde",
      fil: "arbeid/noods",
      alt: "Flere retter i skåler, sett rett ovenfra mot oransje bakgrunn",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Redigerer",
    prioritet: 62,
    innhold: [
      {
        type: "merknad",
        tekst:
          "Plattformenes anbefalinger endrer seg. Tallene under er et utgangspunkt for en intern standard, ikke en gjengivelse av gjeldende dokumentasjon. Sjekk mot kilden før dette settes som regel.",
      },
      {
        type: "avsnitt",
        tekst:
          "Alt du laster opp blir komprimert på nytt av plattformen. Du kan ikke unngå det, men du kan gi den et utgangspunkt som tåler behandlingen. Hovedregelen er å levere høyere kvalitet enn det som vises, og å unngå at filen komprimeres to ganger.",
      },
      {
        type: "punkter",
        punkter: [
          "Format 9:16, altså 1080 × 1920 piksler.",
          "H.264, MP4, progressiv — ikke interlaced.",
          "Samme bildefrekvens som opptaket. Konvertering mellom 25 og 30 gir rykk i panoreringer.",
          "Lyd i AAC, 48 kHz, stereo.",
          "Én eksport fra tidslinjen, lastet rett opp. Ikke eksporter, komprimer og last opp.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Normaliser lydnivået før eksport. Videoer som veksler mellom for lavt og for høyt mellom postene, er noe seeren merker selv om hen ikke vet hva det er.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og: overfør filen til telefonen på en måte som ikke komprimerer den underveis. En video sendt som vanlig melding er allerede degradert før plattformen får se den.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvilke faktiske eksportforvalg brukes i dag, og lastes det opp fra telefon eller fra planleggingsverktøy?",
      },
    ],
  },
];
