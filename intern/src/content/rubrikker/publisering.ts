import type { Rubrikk } from "../rubrikktype.ts";

/** Publiseringsfasen. To poster i uka, hele året. */
export const PUBLISERING: readonly Rubrikk[] = [
  {
    slug: "rytmen-to-i-uka",
    tittel: "Rytmen er hele produktet",
    sammendrag:
      "Kunden kjøper ikke 8–10 videoer. De kjøper at kontoen aldri står stille. Slik fordeles en måneds materiale så rytmen tåler at noe går galt.",
    kategori: "publisering",
    medie: {
      type: "video",
      fil: "reels/soulcake",
      alt: "To personer med kaffe foran en rosa vegg",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 100,
    oppsummering: [
      { tekst: "Regnestykket bak to i uka", anker: "regnestykke" },
      { tekst: "Forspranget er viktigere enn den perfekte posten", anker: "forsprang" },
      { tekst: "Fire steg for å legge måneden", anker: "steg" },
      { tekst: "Juli og romjulen er vår beste måned", anker: "ferie" },
    ],
    innhold: [
      { type: "seksjon", id: "regnestykke", tittel: "Regnestykket" },
      {
        type: "avsnitt",
        tekst:
          "2 poster i uken × 52 uker = 104 i året, altså 8,7 i måneden. Det er derfor produksjonsmålet er 8–10. Én video er én post, og de to postene går til Instagram med krysspublisering til Facebook — ikke to på hver.",
      },
      { type: "seksjon", id: "forsprang", tittel: "Forspranget" },
      {
        type: "avsnitt",
        tekst:
          "Ligger det alltid to uker med ferdig innhold i kø, overlever rytmen sykdom, en utsatt produksjonsdag og en ferie. Gjør den ikke det, er den ett uhell unna et hull kunden ser.",
      },
      {
        type: "merknad",
        tekst:
          "Derfor er et forsprang viktigere enn en perfekt post. En litt svakere video som går ut i tide, er bedre enn en veldig god video som kommer etter et hull.",
      },
      { type: "seksjon", id: "steg", tittel: "Fire steg" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Sorter etter tidsavhengighet",
            tekst:
              "Det som er knyttet til en dato eller sesong låses først. Resten kan flyttes fritt, og det er den som redder rytmen.",
          },
          {
            tittel: "2 — Sett to faste ukedager",
            tekst:
              "Samme to dager hver uke. Faste dager gjør hull synlige for oss før de blir synlige for kunden.",
          },
          {
            tittel: "3 — Legg i kø med en gang",
            tekst:
              "Innhold som venter på «riktig øyeblikk» blir liggende. Riktig øyeblikk er som regel neste faste dag.",
          },
          {
            tittel: "4 — Sikre rytmen før du finner ny dato",
            tekst:
              "Blir en produksjonsdag utsatt: første oppgave er å fylle køen, ikke å booke ny dag. Kunden merker et hull i feeden lenge før de merker at en dag ble flyttet.",
          },
        ],
      },
      { type: "seksjon", id: "ferie", tittel: "Juli og romjulen" },
      {
        type: "avsnitt",
        tekst:
          "Det er ukene der nesten alle andre slutter å publisere. Det er også ukene der kontinuitet er lettest å merke — i vår favør. En konto som går som vanlig i fellesferien, ser ut som en bedrift som har orden på seg.",
      },
    ],
  },

  {
    slug: "hva-tallene-betyr",
    tittel: "Hva tallene betyr, og hva de ikke betyr",
    sammendrag:
      "Visninger er det minst nyttige tallet på skjermen. Her er hva du faktisk skal se på, og hvordan du snakker om det med en kunde uten å love noe.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/kontor",
      alt: "Nærbilde av en person i strikkegenser, filmet i dempet lys",
    },
    oppdatert: "2026-09-21",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 94,
    oppsummering: [
      { tekst: "Hvorfor visninger er nesten ubrukelig alene", anker: "visninger" },
      { tekst: "De fire tallene som faktisk sier noe", anker: "fire" },
      { tekst: "Én post sier ingenting. Ti sier noe", anker: "ti" },
      { tekst: "Slik snakker du om tall uten å love noe", anker: "snakk" },
    ],
    innhold: [
      { type: "seksjon", id: "visninger", tittel: "Visninger alene" },
      {
        type: "avsnitt",
        tekst:
          "Visninger forteller hvor mange som fikk se noe, ikke hvor mange som fikk noe ut av det. En video kan få mange visninger fordi den ble vist bredt og deretter droppet raskt. Det er ikke en suksess — det er en åpning som lovet noe innholdet ikke holdt.",
      },
      { type: "seksjon", id: "fire", tittel: "Fire tall som sier noe" },
      {
        type: "tabell",
        kolonner: ["Tall", "Hva det sier", "Hva du gjør med det"],
        rader: [
          [
            "Hvor mange som blir forbi de første sekundene",
            "Om åpningen holder det den lover",
            "Svakt tall: bytt åpning, ikke hele videoen",
          ],
          [
            "Hvor stor andel som ser til slutten",
            "Om lengden passer innholdet",
            "Faller det tidlig: kort ned, eller flytt poenget fram",
          ],
          [
            "Lagringer og delinger",
            "Om innholdet var nyttig nok til å tas vare på",
            "Det sterkeste signalet vi har. Lag mer av det som lagres",
          ],
          [
            "Profilbesøk etter en post",
            "Om noen ble nysgjerrige på bedriften",
            "Nærmest et kjøpssignal. Verdt mer enn tusen visninger",
          ],
        ],
      },
      { type: "seksjon", id: "ti", tittel: "Én post sier ingenting" },
      {
        type: "avsnitt",
        tekst:
          "Enkeltposter svinger voldsomt, av grunner ingen kontrollerer. Se på ti poster, ikke én. Det du leter etter er mønstre: hvilken type innhold som gjentatte ganger gjør det bedre enn snittet på samme konto.",
      },
      {
        type: "merknad",
        tekst:
          "Sammenlign alltid en konto med seg selv, aldri med en annen. Følgertall, bransje og historikk gjør sammenligning på tvers av kontoer meningsløs.",
      },
      { type: "seksjon", id: "snakk", tittel: "Hvordan du snakker om det" },
      {
        type: "avsnitt",
        tekst:
          "Si hva vi ser, hva vi tror det betyr, og hva vi gjør med det neste måned. Tre setninger. Ikke lov et tall — vi har ingen kontroll over rekkevidde, og et løfte du ikke kan holde er det dyreste du kan si i et kundemøte.",
      },
      {
        type: "sitat",
        tekst:
          "Vi ser at de to videoene der noen forklarer noe, ble lagret mest. Vi tror folk bruker dem som oppslag. Neste måned lager vi tre av den typen.",
        kilde: "Eksempel på hvordan det kan sies",
      },
    ],
  },

  {
    slug: "bildetekst-og-forste-kommentar",
    tittel: "Bildetekst og første kommentar",
    sammendrag:
      "Bildeteksten leses av dem som allerede har stoppet. Hva den skal gjøre, og hvorfor emneknagger ikke hører hjemme i den.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/mat2-vegg",
      alt: "Person i oransje topp på et båtdekk",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 78,
    oppsummering: [
      { tekst: "Bildetekstens faktiske jobb", anker: "jobb" },
      { tekst: "Fire regler", anker: "regler" },
      { tekst: "Emneknagger og lokasjon", anker: "knagger" },
      { tekst: "Kommentarfeltet er ikke vårt", anker: "kommentarer" },
    ],
    innhold: [
      { type: "seksjon", id: "jobb", tittel: "Jobben" },
      {
        type: "avsnitt",
        tekst:
          "Videoen gjør jobben med å stoppe folk. Bildeteksten har en annen oppgave: den snakker til dem som allerede har stoppet, og avgjør om de gjør noe.",
      },
      { type: "seksjon", id: "regler", tittel: "Fire regler" },
      {
        type: "punkter",
        punkter: [
          "Første linje er den eneste som vises før «mer». Den skal kunne stå alene.",
          "Ikke gjenta det videoen nettopp sa. Legg til noe — konteksten, prisen, navnet, når det skjer.",
          "Én handling, hvis noen i det hele tatt. «Bestill bord.» Ikke tre ting.",
          "Skriv som kunden snakker, ikke som en pressemelding.",
        ],
      },
      { type: "seksjon", id: "knagger", tittel: "Emneknagger og lokasjon" },
      {
        type: "avsnitt",
        tekst:
          "Emneknagger hører hjemme i første kommentar, ikke i bildeteksten. Det holder teksten lesbar. Ti relevante er bedre enn tretti generelle — en emneknagg med millioner av poster er ikke et sted noen finner en lokal bedrift.",
      },
      {
        type: "avsnitt",
        tekst:
          "Lokasjonsmerk hver gang det finnes en lokasjon. For en bedrift med et fysisk sted er det en av få gratis måter å bli funnet av folk i nærheten på.",
      },
      { type: "seksjon", id: "kommentarer", tittel: "Kommentarfeltet" },
      {
        type: "merknad",
        tekst:
          "Vi håndterer ikke kommentarer og meldinger — det står eksplisitt i hva som ikke inngår. Får en post kommentarer som krever svar, er det kundens jobb. Og hvis de ikke vet det, er det vår jobb å ha sagt fra i god tid.",
      },
    ],
  },

  {
    slug: "krysspublisering-til-facebook",
    tittel: "Krysspublisering til Facebook",
    sammendrag:
      "Det som publiseres på Instagram krysspubliseres til Facebook. Hva som følger med automatisk, og hva som må sjekkes for hånd.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/aktivering-vegg",
      alt: "Utendørs stand med folk samlet rundt",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 62,
    oppsummering: [
      { tekst: "Én beslutning, ikke to", anker: "en" },
      { tekst: "Sjekklisten etter hver publisering", anker: "sjekk" },
      { tekst: "Tilgangene er et driftsproblem", anker: "tilgang" },
    ],
    innhold: [
      { type: "seksjon", id: "en", tittel: "Én beslutning" },
      {
        type: "avsnitt",
        tekst:
          "Leveransen er publisering til Instagram to ganger i uken med krysspublisering til Facebook. Det er én beslutning om innhold, ikke to, og det er slik det er solgt.",
      },
      { type: "seksjon", id: "sjekk", tittel: "Sjekk etter hver gang" },
      {
        type: "sjekkliste",
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
          "Krysspublisering som feiler, feiler stille. Ingen får beskjed. Uten den manuelle sjekken oppdages et hull på Facebook først når kunden spør.",
      },
      { type: "seksjon", id: "tilgang", tittel: "Tilgangene" },
      {
        type: "avsnitt",
        tekst:
          "Er tilgangen til Facebook-siden knyttet til én enkeltperson hos kunden, er det et driftsproblem som bør løses før det blir akutt. Slutter den personen, stopper krysspubliseringen — og det oppdages i verste fall uker senere.",
      },
    ],
  },

  {
    slug: "naar-noe-gikk-darlig",
    tittel: "Når en post gikk dårlig",
    sammendrag:
      "Det kommer til å skje, jevnlig. Hvordan du finner ut hvorfor uten å overtolke, og hva du sier til kunden.",
    kategori: "publisering",
    medie: {
      type: "bilde",
      fil: "arbeid/spa",
      alt: "Hånd som slår an en gongong",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 56,
    oppsummering: [
      { tekst: "Enkeltposter svinger. Det er normalt", anker: "normalt" },
      { tekst: "Tre ting du sjekker før du konkluderer", anker: "sjekk" },
      { tekst: "Hva du sier til kunden", anker: "sier" },
    ],
    innhold: [
      { type: "seksjon", id: "normalt", tittel: "Svingninger er normalt" },
      {
        type: "avsnitt",
        tekst:
          "Rekkevidde varierer kraftig fra post til post av grunner ingen har kontroll over. En enkelt svak post er ikke et signal, og å endre strategi etter den er den vanligste overreaksjonen i bransjen.",
      },
      { type: "seksjon", id: "sjekk", tittel: "Tre sjekker" },
      {
        type: "punkter",
        punkter: [
          "Er den svak sammenlignet med de siste ti postene på samme konto, eller bare svakere enn den forrige?",
          "Falt folk av i de første sekundene, eller midtveis? Det første er åpningen, det andre er innholdet.",
          "Var det noe med tidspunktet — helligdag, stor nyhetssak, midt i ferien?",
        ],
      },
      { type: "seksjon", id: "sier", tittel: "Hva du sier" },
      {
        type: "avsnitt",
        tekst:
          "Si det før kunden spør. En kundeansvarlig som selv tar opp at en post gikk svakt, og sier hva vi gjør annerledes, framstår som en som følger med. En som venter på spørsmålet, framstår som en som ble tatt på fersken.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og vær ærlig om usikkerheten. «Vi vet ikke sikkert hvorfor, men vi ser at åpningen ikke holdt, og det prøver vi noe annet på» er et bedre svar enn en teori du ikke kan belegge.",
      },
    ],
  },
  {
    slug: "hva-vi-ikke-kan-love",
    tittel: "Hva vi ikke kan love på kundens vegne",
    sammendrag:
      "Noen bransjer har regler for hva som kan sies i markedsføring. Bryter vi dem, er det kunden som får tilsynet på nakken. Her er hva du må vite for å stille riktig spørsmål.",
    kategori: "publisering",
    medie: {
      type: "video",
      fil: "arbeid/spa",
      alt: "Hånd som slår an en gongong",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 88,
    oppsummering: [
      { tekst: "Hvorfor dette er vårt problem og ikke bare kundens", anker: "vart" },
      { tekst: "Bransjene der det gjelder særlig", anker: "bransjer" },
      { tekst: "Barn og unge har eget vern", anker: "barn" },
      { tekst: "Regelen som alltid gjelder: spør, ikke gjett", anker: "spor" },
    ],
    innhold: [
      {
        type: "merknad",
        tekst:
          "Dette er ikke juridisk rådgivning, og det er heller ikke ment å være det. Formålet er å gjøre deg i stand til å kjenne igjen når et spørsmål må stilles til noen som kan svare.",
      },
      { type: "seksjon", id: "vart", tittel: "Hvorfor det er vårt problem" },
      {
        type: "avsnitt",
        tekst:
          "Det er kunden som er ansvarlig for egen markedsføring. Men det er vi som skriver teksten, klipper videoen og trykker publiser. Havner kunden i trøbbel for noe vi formulerte, er det ikke en juridisk diskusjon som avgjør om de blir hos oss.",
      },
      { type: "seksjon", id: "bransjer", tittel: "Bransjer der det gjelder særlig" },
      {
        type: "tabell",
        kolonner: ["Område", "Det som er strengt regulert", "Hvem fører tilsyn"],
        rader: [
          [
            "Kosttilskudd og mat",
            "Helsepåstander. Kun godkjente påstander kan brukes, og man kan ikke gi inntrykk av at vanlig kosthold er utilstrekkelig",
            "Mattilsynet",
          ],
          [
            "Kosmetisk behandling",
            "Før- og etterbilder, påstander om effekt, og hvordan behandlinger framstilles",
            "Forbrukertilsynet",
          ],
          [
            "Trening og prestasjon",
            "Påstander om effekt av tilskudd og produkter. Samme regelverk som kosttilskudd",
            "Mattilsynet",
          ],
          [
            "Alt mot barn og unge",
            "Eget vern i markedsføringsloven. Mindreårige kan ikke oppfordres direkte til kjøp",
            "Forbrukertilsynet",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Fellesnevneren er påstander om virkning. «Dette gir deg mer energi», «du går ned i vekt», «huden blir yngre» er formuleringer som kan være ulovlige selv når de er velmente — og de er akkurat den typen setning som sniker seg inn i en bildetekst fordi den høres fin ut.",
      },
      { type: "seksjon", id: "barn", tittel: "Barn og unge" },
      {
        type: "avsnitt",
        tekst:
          "Markedsføringsloven gir mindreårige et eget vern, og terskelen er lavere enn folk tror. Filmer vi hos en kunde der barn er i bildet, eller lager innhold som åpenbart retter seg mot unge, er det verdt en avklaring før og ikke etter.",
      },
      {
        type: "merknad",
        tekst:
          "Barn i bildet er dessuten et personvernspørsmål uavhengig av markedsføring. Samtykke fra foresatte, hver gang, uten unntak.",
      },
      { type: "seksjon", id: "spor", tittel: "Spør, ikke gjett" },
      {
        type: "avsnitt",
        tekst:
          "Du skal ikke kunne regelverket. Du skal kjenne igjen at du er i nærheten av det. Kjennetegnet er enkelt: sier setningen noe om hva produktet GJØR med kroppen, helsa eller utseendet til noen — så stopp og spør.",
      },
      {
        type: "punkter",
        punkter: [
          "Spør kunden hva de selv har lov til å si. Regulerte bransjer vet det som regel godt.",
          "Be om å få formuleringen fra dem, skriftlig, hvis du er i tvil.",
          "Ta det videre til Pål hvis kunden ikke vet.",
          "I mellomtiden: vis, ikke påstå. Et bilde av behandlingen er trygt. En påstand om hva den gjør, er det ikke.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det siste punktet er også bedre innhold. «Se hvordan det gjøres» holder lenger enn «dette virker», og krever ingen godkjenning.",
      },
    ],
    kilder: [
      {
        tittel:
          "Forbrukertilsynet: Regler for markedsføring av skjønnhetsprodukter og -behandlinger",
        url: "https://www.forbrukertilsynet.no/wp-content/uploads/2021/08/Regler-for-markedsforing-av-skjonnhetsproduker-og-behandlinger.pdf",
        sjekket: "2026-09-21",
      },
      {
        tittel:
          "Forbrukertilsynet: Veiledning om markedsføring overfor barn og unge",
        url: "https://www.forbrukertilsynet.no/wp-content/uploads/2022/11/forbrukertilsynets-veiledning-om-markedsforing-overfor-barn-og-unge.pdf",
        sjekket: "2026-09-21",
      },
      {
        tittel: "Mattilsynet: Kosttilskudd eller treningsprodukt — hvilke regler gjelder?",
        url: "https://www.mattilsynet.no/mat-og-drikke/kosttilskott/kosttilskudd-eller-treningsprodukt--hvilke-regler-gjelder",
        sjekket: "2026-09-21",
      },
    ],
  },
];