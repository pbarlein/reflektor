import type { Rubrikk } from "../rubrikktype.ts";

/** Planleggingsfasen. Her vinnes eller tapes en produksjonsdag. */
export const PLANLEGGING: readonly Rubrikk[] = [
  {
    slug: "produksjonsdag-som-gir-8-10",
    nr: 30,
    tittel: "Slik planlegges en dag som gir 8–10 videoer",
    sammendrag:
      "Én dag skal dekke en måned. Det går bare opp hvis dagen planlegges i oppsett, ikke som en liste med opptak.",
    kategori: "planlegging",
    status: "lansert",
    medie: {
      type: "video",
      fil: "reels/produksjonsdag",
      alt: "Kamera rigget på stativ i en døråpning under en produksjonsdag",
    },
    oppdatert: "2026-09-22",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 100,
    oppsummering: [
      { tekst: "Regnestykket som må gå opp", anker: "regnestykke" },
      { tekst: "Planlegg etter oppsett, ikke etter video", anker: "oppsett" },
      {
        tekst: "Hvorfor hver omstilling koster mer enn den ser ut",
        anker: "bytte",
      },
      { tekst: "Fem steg fra liste til dagsplan", anker: "steg" },
      { tekst: "Luken du alltid skal legge inn", anker: "luke" },
      { tekst: "Det som oftest velter en dag", anker: "velter" },
    ],
    innhold: [
      { type: "seksjon", id: "regnestykke", tittel: "Regnestykket" },
      {
        type: "avsnitt",
        tekst:
          "Leveransen er 8–10 ferdig redigerte videoer per måned, fra én produksjonsdag. Med rigg, flytting og pauser er det rundt én video per arbeidstime. Det går ikke opp hvis dagen planlegges som en rekke enkeltopptak, fordi hver flytting koster mer enn selve opptaket.",
      },
      { type: "seksjon", id: "oppsett", tittel: "Planlegg etter oppsett" },
      {
        type: "avsnitt",
        tekst:
          "Grepet er å slutte å tenke i videoer og begynne å tenke i oppsett. Alt som deler lokasjon, lys og medvirkende filmes samlet — uansett hvilken video det ender i. Redigeringen setter det sammen etterpå; kameraet bryr seg bare om hvor det står.",
      },
      {
        type: "avsnitt",
        tekst:
          "Typisk lander 8–10 videoer på tre til fem oppsett. Er det flere enn fem, er dagen for spredt, og da mister du tid du trodde du hadde.",
      },
      { type: "seksjon", id: "bytte", tittel: "Hvorfor omstilling koster" },
      {
        type: "avsnitt",
        tekst:
          "Det er lett å tro at kostnaden ved å hoppe mellom oppgaver er tiden du bruker på å flytte stativet. Den er større enn som så. Rubinstein, Meyer og Evans viste i fire eksperimenter at selve omstillingen mellom to oppgaver koster tid i seg selv, og at kostnaden vokser jo mer sammensatte reglene for oppgavene er.",
      },
      {
        type: "avsnitt",
        tekst:
          "En produksjonsdag er nettopp sammensatte regler: lys, lyd, utsnitt, hvem som er med og hva videoen skal si. Bytter du oppsett åtte ganger fordi listen din er sortert etter video, betaler du den kostnaden åtte ganger — og du betaler den i konsentrasjon, ikke bare i minutter. Det er derfor en dag med fire oppsett og ti videoer er roligere enn en dag med ti oppsett og ti videoer, selv om opptakene er like mange.",
      },
      {
        type: "merknad",
        tekst:
          "Forskningen er gjort i laboratorium, på enklere oppgaver enn en produksjonsdag. Retningen er godt dokumentert, men ikke bruk den som et tall — bruk den som en grunn til å gruppere.",
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbY7ZH7j-pL/",
          konto: "caterpillarinc",
          hvem: "Caterpillar — amerikansk produsent av anleggsmaskiner. Selger gravemaskiner, dozere og motorer til entreprenører og industri.",
          folgere: 1091197,
          visninger: 121998,
          likes: 2209,
          hentet: "2026-09-21",
          seEtter:
            "Videoen er én arbeidsdag, delt i fire tidsstempler på skjermen: «7 am», «10 am», «1 pm» og «4 pm». Det er ikke en fortelling, det er en produksjonsplan gjort synlig. Fire oppsett, fire lyssituasjoner og fire steder på samme anlegg er klippet sammen til én video. Se på den som en kvittering for hvordan dagen ble planlagt: noen bestemte oppsettene før de dro, ikke underveis.",
        },
      },
      { type: "seksjon", id: "steg", tittel: "Fem steg" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Skriv ned de 8–10 videoene først",
            tekst:
              "Gi hver video én linje: hva den handler om, og hva som må være i bildet. Det skal ikke være et manus. Uten denne listen planlegger du en dag uten å vite hva den skal produsere.",
          },
          {
            tittel: "2 — Grupper dem i oppsett",
            tekst:
              "Hvilke deler samme sted, samme lys og samme person? Skriv oppsettnummer på hver video.",
          },
          {
            tittel: "3 — Legg oppsettene etter lyset",
            tekst:
              "Det som trenger dagslys, legges når lyset er der. Det som er uavhengig av lys, fyller resten. Rekkefølgen på listen din er irrelevant.",
          },
          {
            tittel: "4 — Bekreft folk, ikke bare tid",
            tekst:
              "Krever et oppsett en bestemt person, må personen vite at hen skal være med, når det skjer, og omtrent hvor lenge det tar.",
          },
          {
            tittel: "5 — Få planen ned på én side",
            tekst:
              "En plan som må scrolles på en telefon i en trapp mellom to etasjer, blir ikke lest.",
          },
        ],
      },
      { type: "seksjon", id: "luke", tittel: "Den tomme luken" },
      {
        type: "avsnitt",
        tekst:
          "Legg alltid inn ett oppsett uten innhold. Noe kommer opp på dagen som er bedre enn det som sto i planen — en rett som ser fantastisk ut, en kunde som sier noe godt, et lys som treffer. Uten en luke forsvinner det, eller så spiser det av noe annet.",
      },
      { type: "seksjon", id: "velter", tittel: "Det som velter en dag" },
      {
        type: "punkter",
        punkter: [
          "Folk som ikke visste at de skulle være med. Dette er den klart vanligste grunnen.",
          "Stillbilder som dukker opp som ønske på selve dagen. Kapasiteten deles med video — da ryker noe annet.",
          "Lokalet er i drift på en annen måte enn antatt, og vi kan ikke stå der vi planla.",
          "Tomt batteri eller fullt minnekort. Det er kjedelig, og det stopper alt når det først skjer.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Skal kunden ha stillbilder, må det avklares i planleggingen. Si det som et spørsmål hver gang, ikke vent på at de skal komme på det.",
      },
    ],
    kilder: [
      {
        tittel:
          "Rubinstein, Meyer & Evans (2001): Executive control of cognitive processes in task switching. Journal of Experimental Psychology: Human Perception and Performance 27(4), 763–797",
        url: "https://doi.org/10.1037/0096-1523.27.4.763",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Reflektor: leveransen slik den står på nettsiden — én produksjonsdag i måneden, 8–10 videoer",
        url: "https://www.reflektor.no/sosiale-medier-byra",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "shotliste",
    nr: 31,
    tittel: "Shotliste som en annen kan filme etter",
    sammendrag:
      "Testen er om en kollega som ikke var med i planleggingen kan filme dagen med listen i hånda. Her er hva som må stå der, og hva som bare er støy.",
    kategori: "planlegging",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/helios-1600",
      alt: "Stylet stilleben: to flasker på grønt stoff med kongler",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 84,
    oppsummering: [
      { tekst: "Seks felter per opptak", anker: "felter" },
      { tekst: "Skriv sekunder, ikke «kort»", anker: "sekunder" },
      { tekst: "Det som ikke hører hjemme i listen", anker: "ikke" },
      { tekst: "Kryss av underveis", anker: "kryss" },
    ],
    innhold: [
      { type: "seksjon", id: "felter", tittel: "Seks felter" },
      {
        type: "sjekkliste",
        tittel: "Per opptak",
        punkter: [
          "Oppsettnummer, så listen kan sorteres etter rigg og ikke etter historie",
          "Bildeutsnitt: totalt, halvnært, nært, detalj",
          "Er kameraet i ro eller i bevegelse, og hvilken vei",
          "Hvem eller hva er i bildet",
          "Er det lyd på dette opptaket — tale, eller bare rom",
          "Omtrentlig lengde i sekunder",
        ],
      },
      {
        type: "figur",
        navn: "bildeutsnitt",
        tekst:
          "Figuren viser de fire utsnittene og forholdet mellom motiv og ramme. «Detalj» er større enn rammen med vilje, fordi motivet skal klippes av. Bruk disse ordene i shotlisten, så vet den som filmer nøyaktig hvor nær hen skal gå.",
      },
      { type: "seksjon", id: "sekunder", tittel: "Sekunder, ikke «kort»" },
      {
        type: "avsnitt",
        tekst:
          "«Kort» betyr fire sekunder for én person og femten for en annen. Forskjellen oppdages først i redigeringen, når det er for sent å gjøre noe med den.",
      },
      { type: "seksjon", id: "ikke", tittel: "Hva som ikke skal stå der" },
      {
        type: "avsnitt",
        tekst:
          "Begrunnelser, stemningsord, referanser og alt annet som forklarer hvorfor, hører hjemme i planen og ikke her. Shotlisten er en huskeliste for hendene, og hvert ord som ikke hjelper hendene, gjør den tregere å lese.",
      },
      { type: "seksjon", id: "kryss", tittel: "Kryss av" },
      {
        type: "avsnitt",
        tekst:
          "En shotliste uten avkryssing er en ønskeliste. Avkryssingen er den eneste måten å oppdage at noe mangler mens man fortsatt står på lokasjon — og det er forskjellen på en liten justering og en ny reise.",
      },
    ],
  },

  {
    slug: "lokasjonsbefaring",
    nr: 32,
    tittel: "Befaring: se etter det som stopper dagen",
    sammendrag:
      "Tjue minutter på lokasjon i forveien sparer to timer på produksjonsdagen. Det du skal se etter er sjelden det du tror.",
    kategori: "planlegging",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/drone-1600",
      alt: "Hotellanlegg med utendørsbasseng sett ovenfra",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 72,
    oppsummering: [
      { tekst: "Befaring handler ikke om pene bakgrunner", anker: "hva" },
      { tekst: "Sjekklisten: sju ting som stopper en dag", anker: "liste" },
      { tekst: "Vær der på samme klokkeslett", anker: "klokke" },
    ],
    innhold: [
      { type: "seksjon", id: "hva", tittel: "Hva du faktisk ser etter" },
      {
        type: "avsnitt",
        tekst:
          "En befaring handler om å finne det som kommer til å stoppe dagen, mens det fortsatt er tid til å løse det. Pene bakgrunner finner du på dagen. Et lokale uten strøm der du trenger det, gjør du ikke noe med da.",
      },
      { type: "seksjon", id: "liste", tittel: "Sjekklisten" },
      {
        type: "sjekkliste",
        tittel: "Sju ting som stopper en dag",
        punkter: [
          "Strøm: hvor er uttakene, og hvor langt unna er de det du skal filme?",
          "Lyd: ventilasjon, kjøledisk, musikkanlegg, trafikk. Kan noe slås av, og hvem har nøkkelen?",
          "Lys: hvilken vei vender vinduene, og når på dagen er rommet brukbart?",
          "Blandet lys: er det lysstoffrør eller LED i taket samtidig med dagslys?",
          "Plass: er det plass til stativ der du vil stå, eller må du filme håndholdt?",
          "Folk: er lokalet i drift mens vi filmer, og er de som er der forberedt?",
          "Tilgang: hvor parkerer vi, og hvor langt skal utstyret bæres?",
        ],
      },
      { type: "seksjon", id: "klokke", tittel: "Samme klokkeslett" },
      {
        type: "avsnitt",
        tekst:
          "Vær på lokasjon på samme tid av døgnet som produksjonsdagen skal starte. Et rom som er perfekt klokka 14 kan være ubrukelig klokka 9, og omvendt. Ta bilder med telefonen av hvert aktuelle oppsett og noter klokkeslettet — det er den raskeste måten å legge rekkefølgen på dagen i etterkant.",
      },
    ],
  },

  {
    slug: "forberedt-til-kundemote",
    nr: 33,
    tittel: "Godt forberedt til kundemøte",
    sammendrag:
      "«Godt forberedt» er det andre ordet i målet vårt. Her er hva det betyr konkret, i minuttene før du går inn.",
    kategori: "planlegging",
    status: "lansert",
    medie: {
      type: "bilde",
      fil: "arbeid/scene-vegg",
      alt: "Presentasjon foran storskjerm i en konferansesal",
    },
    oppdatert: "2026-09-22",
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 90,
    oppsummering: [
      { tekst: "Fem sjekkpunkter før du går inn", anker: "sjekk" },
      { tekst: "Kom med noe — ikke bare en agenda", anker: "kom" },
      { tekst: "Når du blir spurt om et tall du ikke kan", anker: "tall" },
    ],
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Kunden merker forberedelse på ett sekund, og fraværet av den på mindre. Forskjellen er sjelden hvor lang tid du brukte — det er om du har sett på dem i det hele tatt siden sist.",
      },
      { type: "seksjon", id: "sjekk", tittel: "Fem sjekkpunkter" },
      {
        type: "sjekkliste",
        tittel: "Før du går inn",
        punkter: [
          "Åpne kundens konto og se de siste postene. Vet du hvilken som gikk best?",
          "Har de publisert noe selv siden sist, utenom det vi lager?",
          "Hva ble lovet i forrige møte, og er det gjort?",
          "Har du ETT konkret forslag med deg?",
          "Vet du hvem som kommer, og hva de har ansvar for?",
        ],
      },
      { type: "seksjon", id: "kom", tittel: "Kom med noe" },
      {
        type: "avsnitt",
        tekst:
          "Det fjerde punktet er det som skiller et forberedt møte fra et pent møte. Et møte der vi bare spør hva kunden ønsker seg, flytter jobben vår over på dem — og det er nøyaktig den jobben de betaler for å slippe.",
      },
      {
        type: "avsnitt",
        tekst:
          "Forslaget trenger ikke være stort. «Dere har en ny rett på menyen fra mandag — vi filmer den først på neste produksjonsdag» er nok. Poenget er retningen: vi kommer med noe, i stedet for å be om noe.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er ikke bare god tone. Undersøkelser av hvorfor kunder bytter byrå lander gjentatte ganger på manglende proaktiv rådgivning som en av toppårsakene — altså nøyaktig det å møte opp uten å ha noe med seg. Og i et feltforsøk hos en skytjenesteleverandør ble frafallet den første uken halvert blant de kundene som fikk uoppfordret hjelp i gang, sammenlignet med dem som måtte spørre selv. Initiativet var hele forskjellen.",
      },
      { type: "seksjon", id: "tall", tittel: "Når du ikke kan tallet" },
      {
        type: "avsnitt",
        tekst:
          "Si at du sjekker og svarer samme dag. Et anslag som viser seg å være feil, koster mer enn en times venting — og det koster på et sted som er dyrt å reparere, nemlig om kunden kan stole på det du sier.",
      },
    ],
    kilder: [
      {
        tittel:
          "Retana, Forman & Wu (2016): Proactive Customer Education, Customer Retention, and Demand for Technology Support — Evidence from a Field Experiment. Manufacturing & Service Operations Management 18(1), 34–50",
        url: "https://doi.org/10.1287/msom.2015.0547",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "ALM Corp: Why clients fire marketing agencies — common reasons and warning signs",
        url: "https://almcorp.com/blog/why-clients-fire-marketing-agencies-retention-scripts/",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "innholdsplan-for-en-maned",
    nr: 34,
    tittel: "Innholdsplan for en måned",
    sammendrag:
      "Hvordan en måneds poster settes sammen så det blir variasjon uten at det blir tilfeldig. En enkel miks som tåler å gjentas.",
    kategori: "planlegging",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/dag6-vegg",
      alt: "Bakevarer på brett i en disk",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 60,
    oppsummering: [
      { tekst: "Fire typer innhold, og hva hver gjør", anker: "typer" },
      { tekst: "Miksen som tåler å gjentas", anker: "miks" },
      {
        tekst: "Hva som låses til dato, og hva som kan flyttes fritt",
        anker: "laas",
      },
    ],
    innhold: [
      { type: "seksjon", id: "typer", tittel: "Fire typer" },
      {
        type: "punkter",
        punkter: [
          "Vise fram betyr produktet, lokalet og folkene. Det bygger gjenkjennelse, det er trygt, og det bør ikke være alt du lager.",
          "Lære bort betyr noe seeren kan bruke uansett om de kjøper. Det bygger tillit, og det er den typen som deles oftest.",
          "Vise prosessen betyr å vise hvordan noe blir til. Den typen er nesten alltid undervurdert, og den er billig å filme mens vi uansett er der.",
          "Be om noe betyr å bestille bord, komme innom eller melde seg på. Det virker bare hvis de tre andre typene har gjort jobben sin.",
        ],
      },
      { type: "seksjon", id: "miks", tittel: "Miksen" },
      {
        type: "avsnitt",
        tekst:
          "En brukbar fordeling over åtte til ti poster: rundt halvparten som viser fram, to til tre som lærer bort eller viser prosess, og én til to som ber om noe. Det er ikke en regel med fasit bak — det er en fordeling som gjør at kontoen ikke bare mater eller bare selger.",
      },
      {
        type: "merknad",
        tekst:
          "Kunder med lang kjøpsavstand skal ha mer «lære bort» og mindre «be om». Se rubrikken om bransjeforskjeller.",
      },
      { type: "seksjon", id: "laas", tittel: "Låst og løst" },
      {
        type: "avsnitt",
        tekst:
          "Sorter månedens videoer etter hvor tidsavhengige de er. Det som er knyttet til en dato eller en sesong, låses først. Resten kan flyttes fritt, og det er nettopp den delen som redder rytmen når noe glipper.",
      },
    ],
  },
];
