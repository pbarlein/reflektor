import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Publiseringsfasen. To poster i uka, hele året.
 *
 * Alle rubrikkene her er UTKAST — se rubrikktype.ts.
 */
export const PUBLISERING: readonly Rubrikk[] = [
  {
    slug: "rytmen-to-i-uka",
    tittel: "To publiseringer i uken — slik settes rytmen",
    sammendrag:
      "Utkast: kontinuitet er hele produktet. Hvordan en måneds materiale fordeles så kontoen aldri står stille, heller ikke i juli.",
    kategori: "publisering",
    medie: {
      type: "video",
      fil: "reels/antonsport",
      alt: "Skikjører i løypa mellom trær",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 88,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Det kunden kjøper er ikke 8–10 videoer. Det er at kontoen ikke står stille — 2 poster i uken, 52 uker i året. Regnestykket går opp: 2 × 52 = 104, altså 8,7 i måneden. Én video er én post.",
      },
      {
        type: "merknad",
        tekst:
          "Derfor er et forsprang viktigere enn en perfekt post. Ligger det alltid to uker med ferdig innhold i kø, overlever rytmen sykdom, en utsatt produksjonsdag og en ferie. Gjør den ikke det, er den ett uhell unna et hull kunden ser.",
      },
      {
        type: "steg",
        steg: [
          {
            tittel: "Fordel før du planlegger datoer",
            tekst:
              "Sorter månedens videoer etter hvor tidsavhengige de er. Det som er knyttet til en dato eller en sesong, låses først. Resten er fyllmasse som kan flyttes fritt — og den er det som redder rytmen.",
          },
          {
            tittel: "Sett to faste dager",
            tekst:
              "Samme to ukedager hver uke. Faste dager gjør hull synlige for oss før de blir synlige for kunden.",
          },
          {
            tittel: "Planlegg fram, ikke etter",
            tekst:
              "Legg alt i kø så snart det er ferdig. Innhold som venter på «riktig øyeblikk» blir liggende.",
          },
          {
            tittel: "Hold ferier i planen",
            tekst:
              "Juli og romjulen er ukene der alle andre slutter å publisere. Det er også ukene der kontinuiteten er lettest å merke — i vår favør.",
          },
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Blir en produksjonsdag utsatt, er den første oppgaven å sikre rytmen, ikke å finne ny dato. Kunden merker et hull i feeden lenge før hen merker at en dag ble flyttet.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvilket verktøy brukes til planlegging, og hvor stort forsprang sikter vi faktisk mot?",
      },
    ],
  },
  {
    slug: "bildetekst-og-forste-kommentar",
    tittel: "Bildetekst og første kommentar",
    sammendrag:
      "Utkast: bildeteksten leses av de som allerede har stoppet. Hva den skal gjøre, og hvorfor emneknagger ikke hører hjemme i den.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/mat2-vegg",
      alt: "Person i oransje topp på et båtdekk",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 74,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Videoen gjør jobben med å stoppe folk. Bildeteksten har en annen oppgave: den snakker til dem som allerede har stoppet, og den avgjør om de gjør noe.",
      },
      {
        type: "punkter",
        punkter: [
          "Første linje er den eneste som vises før «mer». Den skal kunne stå alene.",
          "Ikke gjenta det videoen nettopp sa. Legg til noe — konteksten, prisen, navnet, når det skjer.",
          "Én handling, hvis noen. «Bestill bord», «kom innom torsdag». Ikke tre.",
          "Skriv som kunden snakker, ikke som en pressemelding.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Emneknagger hører hjemme i første kommentar, ikke i bildeteksten. Det holder teksten lesbar. Ti relevante er bedre enn tretti generelle — en emneknagg med millioner av poster er ikke et sted noen finner en lokal bedrift.",
      },
      {
        type: "avsnitt",
        tekst:
          "Lokasjonsmerking hver gang det finnes en lokasjon. For en bedrift med et fysisk sted er det en av få gratis måter å bli funnet av folk i nærheten på.",
      },
      {
        type: "merknad",
        tekst:
          "Husk hva som IKKE inngår: vi håndterer ikke kommentarfelt og meldinger. Får en post kommentarer som krever svar, er det kundens jobb — og hvis de ikke vet det, er det vår jobb å ha sagt fra.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: skrives bildetekstene av oss eller av kunden, og hvem godkjenner dem før publisering?",
      },
    ],
  },
  {
    slug: "krysspublisering-til-facebook",
    tittel: "Krysspublisering til Facebook",
    sammendrag:
      "Utkast: det som publiseres på Instagram krysspubliseres til Facebook. Hva som følger med automatisk, og hva som må sjekkes manuelt.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/dag4-vegg",
      alt: "To personer i arbeid ved en utsalgsluke",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 56,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Leveransen er publisering til Instagram to ganger i uken med krysspublisering til Facebook. Det er én beslutning om innhold, ikke to — og det er slik det er solgt.",
      },
      {
        type: "sjekkliste",
        tittel: "Sjekk etter hver krysspublisering",
        punkter: [
          "Kom videoen faktisk ut på Facebook, eller stoppet den i køen?",
          "Er formatet beholdt, eller er det beskåret?",
          "Følger teksten med, og gir den mening uten Instagram-konteksten?",
          "Peker eventuelle @-omtaler på en konto som finnes på Facebook?",
          "Er emneknaggene med? På Facebook gjør de mindre nytte og kan gjerne kuttes.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Krysspublisering som feiler, feiler stille. Ingen får beskjed. Derfor er den manuelle sjekken hele poenget — uten den oppdages et hull på Facebook først når kunden spør.",
      },
      {
        type: "avsnitt",
        tekst:
          "Er tilgangen til Facebook-siden knyttet til en enkeltperson hos kunden, er det et driftsproblem som bør løses før det blir akutt. Slutter den personen, stopper krysspubliseringen.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvordan settes krysspubliseringen opp i dag, og hvem eier tilgangene?",
      },
    ],
  },
];
