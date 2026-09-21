import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Planleggingsfasen. Her vinnes eller tapes en produksjonsdag.
 *
 * Alle rubrikkene her er UTKAST — se rubrikktype.ts.
 */
export const PLANLEGGING: readonly Rubrikk[] = [
  {
    slug: "produksjonsdag-som-gir-8-10",
    tittel: "Slik planlegges en dag som gir 8–10 videoer",
    sammendrag:
      "Utkast: én dag skal dekke en måned. Det går bare opp hvis dagen er planlagt i blokker, ikke som en liste med opptak.",
    kategori: "planlegging",
    medie: {
      type: "video",
      fil: "reels/produksjonsdag",
      alt: "Rigging av kamera på stativ i forkant av opptak",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 94,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Leveransen er 8–10 ferdig redigerte videoer per måned, fra én produksjonsdag. Det er rundt én video per arbeidstime inkludert rigg, flytting og pauser. Det går ikke opp hvis dagen planlegges som en rekke enkeltopptak — hver flytting koster mer enn selve opptaket.",
      },
      {
        type: "avsnitt",
        tekst:
          "Grep: planlegg etter OPPSETT, ikke etter video. Alt som deler lokasjon, lys og medvirkende filmes samlet, uansett hvilken video det ender i.",
      },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Skriv ned de 8–10 videoene først",
            tekst:
              "Én linje hver: hva den handler om, og hva som må være i bildet. Ikke manus. Uten denne listen planlegger du en dag uten å vite hva den skal produsere.",
          },
          {
            tittel: "2 — Grupper dem i oppsett",
            tekst:
              "Hvilke deler samme sted, samme lys og samme person? Typisk lander 8–10 videoer på tre til fem oppsett. Er det flere oppsett enn fem, er dagen for spredt.",
          },
          {
            tittel: "3 — Legg oppsettene etter lyset, ikke etter listen",
            tekst:
              "Det som trenger dagslys, legges når lyset er der. Det som er uavhengig av lys, fyller resten. Rekkefølgen på listen er irrelevant.",
          },
          {
            tittel: "4 — Legg inn ett tomt oppsett",
            tekst:
              "Noe kommer opp på dagen som er bedre enn det som sto i planen. Uten en luke forsvinner det, eller så spiser det av noe annet.",
          },
          {
            tittel: "5 — Bekreft folk, ikke bare tid",
            tekst:
              "Hvert oppsett som krever en person, krever at personen vet at hen skal være med, når, og omtrent hvor lenge. Dette er den vanligste grunnen til at en dag glipper.",
          },
        ],
      },
      {
        type: "merknad",
        tekst:
          "Skal kunden ha stillbilder, må det avklares HER. Kapasiteten deles med video, og en beskjed på selve dagen betyr at noe annet ryker.",
      },
      {
        type: "avsnitt",
        tekst:
          "Planen skal få plass på én side. En plan som må scrolles på en telefon i en trapp mellom to etasjer, blir ikke lest.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: stemmer tre-til-fem oppsett med hvordan dere faktisk jobber, og finnes det en mal for dagsplanen?",
      },
    ],
  },
  {
    slug: "shotliste",
    tittel: "Shotliste: fra idé til opptaksklar liste",
    sammendrag:
      "Utkast: hva som må stå i en shotliste for at noen andre enn deg kan filme den, og hva som bare er støy.",
    kategori: "planlegging",
    medie: {
      type: "bilde",
      fil: "arbeid/helios-1600",
      alt: "Stylet stilleben: to flasker på grønt stoff med kongler",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 72,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Testen på en shotliste er enkel: kan en kollega som ikke var med i planleggingen filme dagen med den i hånda? Klarer hen ikke det, er listen dine egne notater.",
      },
      {
        type: "sjekkliste",
        tittel: "Per opptak",
        punkter: [
          "Oppsett-nummer, så listen kan sorteres etter rigg og ikke etter historie",
          "Bildeutsnitt: totalt, halvnært, nært, detalj",
          "Er kameraet i ro eller i bevegelse, og hvilken vei",
          "Hvem eller hva er i bildet",
          "Er det lyd på dette opptaket — tale, eller bare rom",
          "Omtrentlig lengde i sekunder",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Skriv sekunder, ikke «kort». «Kort» betyr fire sekunder for én person og femten for en annen, og forskjellen oppdages først i redigeringen.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det som IKKE hører hjemme i listen: begrunnelser, stemning, referanser og alt som beskriver hvorfor. Det hører til i planen. Shotlisten er en huskeliste for hendene.",
      },
      {
        type: "avsnitt",
        tekst:
          "Kryss av underveis. En shotliste uten avkryssing er en ønskeliste, og den eneste måten å oppdage at noe mangler mens man fortsatt står på lokasjon.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvilket verktøy brukes, og deles listen med kunden på forhånd eller ikke?",
      },
    ],
  },
  {
    slug: "lokasjonsbefaring",
    tittel: "Lokasjonsbefaring — hva du må sjekke før dagen",
    sammendrag:
      "Utkast: tjue minutter på lokasjon i forveien sparer to timer på produksjonsdagen. Det du ser etter er sjelden det du tror.",
    kategori: "planlegging",
    medie: {
      type: "bilde",
      fil: "arbeid/drone-1600",
      alt: "Hotellanlegg med utendørsbasseng sett ovenfra",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 60,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "En befaring handler ikke om å finne pene bakgrunner. Den handler om å finne det som kommer til å stoppe dagen, mens det fortsatt er tid til å løse det.",
      },
      {
        type: "sjekkliste",
        tittel: "Det som stopper en dag",
        punkter: [
          "Strøm: hvor er uttakene, og hvor langt unna er de det du skal filme?",
          "Lyd: ventilasjon, kjøledisk, musikkanlegg, trafikk. Kan noe av det slås av, og hvem har nøkkelen?",
          "Lys: hvilken vei vender vinduene, og når på dagen er rommet brukbart?",
          "Blandet lys: er det lysstoffrør eller LED i taket samtidig med dagslys?",
          "Plass: er det plass til stativ der du vil stå, eller må du filme håndholdt?",
          "Folk: er lokalet i drift mens vi filmer, og er de som er der forberedt?",
          "Tilgang: hvor parkerer vi, og hvor langt skal utstyret bæres?",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Vær på lokasjon på SAMME KLOKKESLETT som produksjonsdagen skal starte. Et rom som er perfekt klokka 14 kan være ubrukelig klokka 9, og omvendt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Ta bilder med telefonen av hvert aktuelle oppsett, og noter klokkeslettet på bildet. Det er den raskeste måten å planlegge rekkefølgen på dagen i etterkant.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: gjøres befaring alltid, eller bare på nye lokasjoner? Og hvem betaler for reisen når den er egen tur?",
      },
    ],
  },
  {
    slug: "forberedt-til-kundemote",
    tittel: "Godt forberedt til kundemøte",
    sammendrag:
      "Utkast: «godt forberedt» er det andre ordet i målet vårt. Her er et forsøk på hva det betyr konkret før et møte.",
    kategori: "planlegging",
    medie: {
      type: "bilde",
      fil: "arbeid/scene-vegg",
      alt: "Presentasjon foran storskjerm i en konferansesal",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 68,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Kunden merker forberedelse på ett sekund, og fraværet av den på mindre. Forskjellen er sjelden hvor lang tid du brukte — det er om du har sett på dem i det hele tatt siden sist.",
      },
      {
        type: "sjekkliste",
        tittel: "Før du går inn i møtet",
        punkter: [
          "Åpne kundens konto og se de siste postene. Vet du hvilken som gikk best?",
          "Har de publisert noe selv siden sist, utenom det vi lager?",
          "Hva ble lovet i forrige møte, og er det gjort?",
          "Har du ETT konkret forslag med deg, ikke bare en agenda?",
          "Vet du hvem som kommer, og hva de har ansvar for?",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Det siste punktet på listen er det som skiller et forberedt møte fra et pent møte: kom med noe. Et møte der vi bare spør hva kunden ønsker seg, flytter jobben vår over på dem.",
      },
      {
        type: "avsnitt",
        tekst:
          "Blir du spurt om et tall du ikke er sikker på — pris, frist, omfang — si at du sjekker og svarer samme dag. Et anslag som viser seg å være feil, koster mer enn ventetiden.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: finnes det en fast møtestruktur, og skal forslaget sendes før møtet eller legges fram i det?",
      },
    ],
  },
];
