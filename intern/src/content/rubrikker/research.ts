import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Researchfasen. Alt som skjer før vi foreslår noe.
 *
 * Alle rubrikkene her er UTKAST. De er skrevet som faglig fornuftige
 * forslag, ikke som Reflektors vedtatte metode — se rubrikktype.ts.
 */
export const RESEARCH: readonly Rubrikk[] = [
  {
    slug: "kartlegg-konkurrentene",
    tittel: "Kartlegg kundens tre nærmeste konkurrenter",
    sammendrag:
      "Utkast: en halvtimes arbeid som gjør første strategiforslag konkret i stedet for generelt. Hva du ser etter, og hva du ignorerer.",
    kategori: "research",
    medie: {
      type: "video",
      fil: "reels/gekko",
      alt: "Syklist på en sti i skogen",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 70,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Vi lover strategiforslag innen tre virkedager. Det er kort tid, og det er derfor researchen må være avgrenset på forhånd. Tre konkurrenter, én time, tre ting å se etter — ikke en bransjeanalyse.",
      },
      {
        type: "avsnitt",
        tekst:
          "Velg tre kontoer som selger noe likt til noen like, i et marked kunden kjenner igjen. Den største aktøren i Norge er sjelden en av dem: budsjettet og rekkevidden deres gjør innholdet umulig å lære noe av.",
      },
      {
        type: "sjekkliste",
        tittel: "Per konkurrent, maks 20 minutter",
        punkter: [
          "Hvor ofte publiserer de? Tell de siste fire ukene, ikke de siste fire postene.",
          "Hvilke tre poster har klart flest visninger eller kommentarer enn resten?",
          "Hva er de tre postene faktisk av — person, produkt, sted, prosess?",
          "Er det tale i dem, eller bare musikk og tekst?",
          "Hvor lange er de? Noter sekunder, ikke «korte».",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Ikke noter hva du synes om innholdet. Smaken din er irrelevant her; det eneste som teller er hva som skiller de tre beste postene fra de tjue andre.",
      },
      {
        type: "avsnitt",
        tekst:
          "Resultatet skal kunne skrives på fem linjer, og de fem linjene skal kunne leses opp i et kundemøte uten forklaring. Klarer du ikke det, har du samlet inntrykk i stedet for funn.",
      },
      {
        type: "sitat",
        tekst:
          "Et strategiforslag som kunne vært sendt til hvilken som helst kunde i samme bransje, er ikke et strategiforslag.",
        kilde: "Utkast — til diskusjon",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: er tre konkurrenter riktig antall, og skal funnene inn i strategidokumentet eller bare i forberedelsen til møtet?",
      },
    ],
  },
  {
    slug: "hooks-som-allerede-virker",
    tittel: "Finn hooks som allerede virker i kundens nisje",
    sammendrag:
      "Utkast: de første ordene avgjør om resten blir sett. Slik bygger du et lite bibliotek av åpninger som er dokumentert virksomme — ikke gjettet.",
    kategori: "research",
    medie: {
      type: "video",
      fil: "reels/antonburst",
      alt: "Nærbilde av en sko som sparker opp jord i fart",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 64,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "En hook er de første ordene eller det første bildet. Den avgjør om noen ser videre, og den er det eneste elementet i en video som kan endres uten å filme på nytt. Det gjør den til det billigste stedet å bli bedre.",
      },
      {
        type: "avsnitt",
        tekst:
          "Poenget med å samle dem er ikke å kopiere. Det er å slippe å finne opp en åpning fra bunnen hver gang, under tidspress, på en produksjonsdag.",
      },
      {
        type: "steg",
        steg: [
          {
            tittel: "Samle",
            tekst:
              "Når du ser en video i kundens nisje som har merkbart flere visninger enn resten på samme konto: noter de første fem ordene og det første bildet. Ikke hele videoen.",
          },
          {
            tittel: "Klassifiser",
            tekst:
              "Er det et spørsmål, en påstand, et tall, en feil noen gjør, eller et bilde som ikke gir mening før sekund tre? Fem kategorier holder.",
          },
          {
            tittel: "Oversett",
            tekst:
              "Skriv om hooken til kundens virkelighet. Den skal kunne filmes hos dem, med det de har, på den dagen vi er der.",
          },
          {
            tittel: "Test på én",
            tekst:
              "Prøv én ny hook-type per produksjonsdag, ikke fem. Fem samtidig gir ingen mulighet til å vite hvilken som virket.",
          },
        ],
      },
      {
        type: "merknad",
        tekst:
          "En hook som lover noe videoen ikke leverer, gir høy visning og lav fullføring. Det er verre enn en svak hook: plattformen lærer at innholdet skuffer.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvor skal biblioteket ligge, og hvem vedlikeholder det?",
      },
    ],
  },
  {
    slug: "innsikt-fra-kundens-folk",
    tittel: "Hent innsikt fra kundens egne ansatte",
    sammendrag:
      "Utkast: de som står i resepsjonen eller på kjøkkenet vet hvilke spørsmål som faktisk stilles. Fire spørsmål som gir en måneds innhold.",
    kategori: "research",
    medie: {
      type: "bilde",
      fil: "arbeid/servering",
      alt: "Gjester rundt et bord som jubler sammen",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 58,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Ledelsen vet hva bedriften vil si. De ansatte i førstelinja vet hva kundene faktisk lurer på. De to listene overlapper sjeldnere enn man skulle tro, og den andre er den som gir innhold folk stopper på.",
      },
      {
        type: "sjekkliste",
        tittel: "Fire spørsmål, stilt til noen som møter kunder daglig",
        punkter: [
          "Hva spør folk om oftest — det samme spørsmålet, hver uke?",
          "Hva blir folk overrasket over når de får vite det?",
          "Hva tror folk om dere som ikke stemmer?",
          "Hva er dere stolte av som nesten ingen utenfra vet om?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Still dem løst, i en pause, uten notatblokk framme. Det samme spørsmålet i et møterom med ledelsen til stede gir et annet og dårligere svar.",
      },
      {
        type: "merknad",
        tekst:
          "Spørsmål tre er det verdifulle og det vanskeligste. En misforståelse som gjentar seg, er et innholdstema som allerede har publikum.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: skal dette gjøres på befaringen, i oppstartsmøtet, eller løpende på produksjonsdagene?",
      },
    ],
  },
];
