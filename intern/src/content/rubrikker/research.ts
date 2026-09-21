import type { Rubrikk } from "../rubrikktype.ts";

/** Researchfasen. Alt som skjer før vi foreslår noe. */
export const RESEARCH: readonly Rubrikk[] = [
  {
    slug: "bransjen-bestemmer-alt",
    tittel: "Bransjen bestemmer alt",
    sammendrag:
      "Den samme oppskriften virker ikke for en restaurant og en industribedrift. Her er forskjellene som faktisk betyr noe, og hvordan du leser dem.",
    kategori: "research",
    medie: {
      type: "bilde",
      fil: "arbeid/noods",
      alt: "Flere retter i skåler, sett rett ovenfra mot oransje bakgrunn",
    },
    oppdatert: "2026-09-21",
    lesetid: 7,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 100,
    oppsummering: [
      { tekst: "Fire spørsmål avgjør hva slags innhold som virker", anker: "fire" },
      { tekst: "Slik skiller bransjene seg — konkret", anker: "tabell" },
      { tekst: "Kjøpsavstand er den viktigste enkeltfaktoren", anker: "avstand" },
      { tekst: "Tre feil vi gjør når vi overfører en oppskrift", anker: "feil" },
      { tekst: "Hva du gjør når bransjen er ny for deg", anker: "ny" },
    ],
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Det finnes råd som gjelder alle: lyd må være ren, de første sekundene avgjør, teksting er ikke valgfritt. Men mesteparten av det som står i en SoMe-guide gjelder én type bedrift, og guiden sier sjelden hvilken. Derfor virker det utmerket for kafeen og pinlig for maskinleverandøren.",
      },
      {
        type: "avsnitt",
        tekst:
          "Du trenger ikke en bransjeanalyse for å unngå det. Du trenger fire spørsmål.",
      },
      { type: "seksjon", id: "fire", tittel: "De fire spørsmålene" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Hvor lang er kjøpsavstanden?",
            tekst:
              "Kan noen se videoen og handle innen en time, eller tar beslutningen et halvt år og involverer fire personer? Dette er den viktigste faktoren, og den endrer alt annet.",
          },
          {
            tittel: "2 — Hvem bestemmer?",
            tekst:
              "Én person som bestemmer selv, eller en gruppe der noen skal overbevise noen andre internt? Det siste betyr at innholdet må kunne videresendes og stå på egne bein uten deg.",
          },
          {
            tittel: "3 — Er produktet synlig?",
            tekst:
              "Kan man se hva de selger? Mat, klær, lokaler og behandlinger filmer seg selv. Programvare, rådgivning og komponenter gjør det ikke — der er det folkene, prosessen eller resultatet som må bære bildet.",
          },
          {
            tittel: "4 — Hvor ofte kjøper samme kunde igjen?",
            tekst:
              "En kafé selger til de samme menneskene hver uke. En boligutvikler selger én gang i livet til hver kunde. Høy gjenkjøpsfrekvens tåler — og trenger — langt hyppigere og lettere innhold.",
          },
        ],
      },
      {
        type: "merknad",
        tekst:
          "Still de fire i oppstartsmøtet og skriv ned svarene. De tar tre minutter og styrer hele produksjonsplanen.",
      },
      { type: "seksjon", id: "tabell", tittel: "Slik faller bransjene ut" },
      {
        type: "avsnitt",
        tekst:
          "Dette er mønstre, ikke regler. En kunde kan bryte med sin egen bransje, og da er det kunden som gjelder. Men vet du ikke noe annet, er dette et bedre utgangspunkt enn å gjøre det samme som sist.",
      },
      {
        type: "tabell",
        kolonner: ["Type kunde", "Bærer innholdet", "Kadens", "Vanligste tabbe"],
        rader: [
          [
            "Servering og mat",
            "Produktet på nært hold, folk som lager det",
            "Tåler høy frekvens — samme gjester hver uke",
            "For pent. Maten skal se spiselig ut, ikke utstilt",
          ],
          [
            "Butikk og varehandel",
            "Vareutvalg, sesong, folk som bruker tingen",
            "Følger sesong og kampanje tett",
            "Å filme hylla i stedet for bruken",
          ],
          [
            "Trening, velvære, behandling",
            "Følelsen etterpå, og den som utfører",
            "Jevnt, med tydelige toppen i januar og august",
            "Løfter om resultat. Se rubrikken om hva vi ikke kan love",
          ],
          [
            "Industri og B2B",
            "Prosess, presisjon, fagfolk som forklarer",
            "Lavere frekvens, høyere tyngde per post",
            "Å prøve å være morsom. De vil ha nytte, ikke underholdning",
          ],
          [
            "Eiendom og bolig",
            "Rom, lys, nabolag, livet som skal leves der",
            "Prosjektdrevet, ikke løpende",
            "Å selge kvadratmeter. Folk kjøper et liv, ikke en plantegning",
          ],
          [
            "Tjenester og rådgivning",
            "Personene, og hvordan de tenker",
            "Jevnt, tålmodig — tillit bygges sakte",
            "Å snakke om seg selv i stedet for å være til nytte",
          ],
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbfagiNMwsw/",
          konto: "topjaw",
          visninger: 1149786,
          likes: 38613,
          hentet: "2026-09-21",
          seEtter:
            "Servering, etter oppskriften i tabellen: produktet på nært hold, rett ovenfra, med stedsnavnet som tekst fra bilde én. Kort kjøpsavstand — du kan bestille bord i kveld. Prøv å se for deg det samme grepet brukt på en maskinleverandør.",
        },
      },
      { type: "seksjon", id: "avstand", tittel: "Kjøpsavstanden endrer alt" },
      {
        type: "avsnitt",
        tekst:
          "Kort kjøpsavstand betyr at videoen kan be om noe. «Kom innom i kveld» er en rimelig ting å si til noen som bor i nabolaget og skal spise uansett. Da tåler innholdet å være direkte, og det tåler å gjenta seg.",
      },
      {
        type: "avsnitt",
        tekst:
          "Lang kjøpsavstand betyr at videoen ikke kan be om noe ennå. Den som skal investere i en produksjonslinje, gjør det ikke fordi en video ba om det. Jobben til innholdet er da å gjøre bedriften kjent og troverdig lenge før behovet oppstår — slik at de blir husket den dagen det oppstår.",
      },
      {
        type: "avsnitt",
        tekst:
          "Praktisk konsekvens: jo lengre avstand, jo mer skal innholdet lære bort og vise fram, og jo mindre skal det selge. Det er ikke idealisme. En selgende video til noen som er fem måneder unna å kjøpe, blir scrollet forbi.",
      },
      { type: "seksjon", id: "feil", tittel: "Tre feil når en oppskrift flyttes" },
      {
        type: "punkter",
        punkter: [
          "Å bruke kafé-tempoet på en fagbedrift. Rask klipping og trendlyd på en video om toleransekrav leser som at vi ikke forstår hva de driver med.",
          "Å bruke fagtempoet på en kafé. En rolig, forklarende video om råvarer der folk egentlig bare skal se om det ser godt ut, kaster bort de tre sekundene vi har.",
          "Å anta at «folk vil se folk» betyr det samme overalt. I servering er det gjestene og kokkene. I industri er det fagpersonen som kan forklare noe. I behandling er det den som skal ta i deg — der handler valget om trygghet, ikke sjarm.",
        ],
      },
      { type: "seksjon", id: "ny", tittel: "Når bransjen er ny for deg" },
      {
        type: "sjekkliste",
        tittel: "En halvtime før du foreslår noe",
        punkter: [
          "Finn tre kontoer i samme bransje som IKKE er de største. De største har budsjetter du ikke kan lære noe av.",
          "Noter hva de tre postene med mest respons faktisk viser — ikke hva du synes om dem.",
          "Finn ut hva et salg er verdt for kunden. En kaffe og en entreprise krever ulik tålmodighet.",
          "Spør kunden hvem som stiller spørsmål før de kjøper, og hva de spør om.",
          "Sjekk om bransjen har regler for hva man kan si. Helse, finans, alkohol og barn har alle sine.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Er du i tvil om en bransje har markedsføringsregler, så har den det. Spør før du filmer, ikke etter.",
      },
    ],
    kilder: [
      {
        tittel:
          "Windmill Strategy: Content and its role in social media for B2B industrial and manufacturing marketers",
        url: "https://www.windmillstrategy.com/content-and-its-role-in-social-media-for-b2b-industrial-and-manufacturing-marketers/",
        sjekket: "2026-09-21",
      },
      {
        tittel: "Emplifi: Restaurant social media strategy guide",
        url: "https://emplifi.io/resources/blog/restaurant-social-media-strategy/",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "kartlegg-konkurrentene",
    tittel: "Kartlegg de tre nærmeste konkurrentene",
    sammendrag:
      "En halvtimes arbeid som gjør første strategiforslag konkret i stedet for generelt. Hva du ser etter, og hva du skal la være å notere.",
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
    prioritet: 84,
    oppsummering: [
      { tekst: "Velg tre riktige konkurrenter, ikke tre store", anker: "velg" },
      { tekst: "Fem ting å notere per konto", anker: "noter" },
      { tekst: "Funnet skal få plass på fem linjer", anker: "resultat" },
    ],
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Vi lover strategiforslag innen tre virkedager. Det er kort tid, og derfor må researchen være avgrenset på forhånd: tre konkurrenter, én time, fem ting å se etter.",
      },
      { type: "seksjon", id: "velg", tittel: "Hvilke tre" },
      {
        type: "avsnitt",
        tekst:
          "Velg tre kontoer som selger noe likt til noen like, i et marked kunden kjenner igjen. Den største aktøren i Norge er nesten aldri en av dem — budsjettet og rekkevidden deres gjør innholdet umulig å lære noe av, og kunden blir bare motløs av å se det.",
      },
      {
        type: "avsnitt",
        tekst:
          "Er kunden lokal, skal minst to av de tre være lokale. En restaurant i Oslo konkurrerer ikke med en restaurant i Bergen om de samme gjestene.",
      },
      { type: "seksjon", id: "noter", tittel: "Fem ting per konto" },
      {
        type: "sjekkliste",
        tittel: "Maks 20 minutter hver",
        punkter: [
          "Hvor ofte publiserer de? Tell de siste fire ukene, ikke de siste fire postene.",
          "Hvilke tre poster har merkbart mer respons enn resten på samme konto?",
          "Hva viser de tre postene faktisk — person, produkt, sted eller prosess?",
          "Er det tale i dem, eller bare musikk og tekst?",
          "Hvor lange er de? Noter sekunder, ikke «korte».",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Ikke noter hva du synes om innholdet. Smaken din er irrelevant her. Det eneste som teller er hva som skiller de tre beste postene fra de tjue andre.",
      },
      { type: "seksjon", id: "resultat", tittel: "Fem linjer, ikke fem sider" },
      {
        type: "avsnitt",
        tekst:
          "Resultatet skal kunne leses opp i et kundemøte uten forklaring. Klarer du ikke det, har du samlet inntrykk i stedet for funn.",
      },
      {
        type: "sitat",
        tekst:
          "Et strategiforslag som kunne vært sendt til hvilken som helst kunde i samme bransje, er ikke et strategiforslag.",
        kilde: "Utkast — til diskusjon",
      },
    ],
  },

  {
    slug: "hooks-som-virker",
    tittel: "Åpninger som faktisk holder på folk",
    sammendrag:
      "Beslutningen om å bli eller dra tas før sekund tre. Her er hva som er dokumentert om åpninger, og hvordan du bygger et bibliotek i stedet for å finne opp én hver gang.",
    kategori: "research",
    medie: {
      type: "video",
      fil: "reels/antonburst",
      alt: "Nærbilde av en sko som sparker opp jord i fart",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 90,
    oppsummering: [
      { tekst: "Hva vi vet, og hvor sikkert vi vet det", anker: "vet" },
      { tekst: "Seks åpningstyper som er i vanlig bruk", anker: "typer" },
      { tekst: "Bygg et bibliotek i fire steg", anker: "bibliotek" },
      { tekst: "Den dyreste feilen: en åpning som lover for mye", anker: "lover" },
    ],
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "En hook er de første ordene eller det første bildet. Den avgjør om noen ser videre, og den er det eneste elementet i en ferdig video som kan byttes uten å filme på nytt. Det gjør den til det billigste stedet å bli bedre.",
      },
      { type: "seksjon", id: "vet", tittel: "Hva vi vet" },
      {
        type: "avsnitt",
        tekst:
          "To ting er godt nok dokumentert til å legges til grunn. Det første: beslutningen tas svært tidlig, innen de første sekundene. Det andre: teksting øker hvor lenge folk blir — de fleste ser uten lyd.",
      },
      {
        type: "merknad",
        tekst:
          "Vær forsiktig med prosenttallene som sirkulerer om hook-typer. Mye av det er bransjeblogger uten metode bak. Bruk dem som pekepinn på hva du kan teste, aldri som et løfte til en kunde.",
      },
      { type: "seksjon", id: "typer", tittel: "Seks typer" },
      {
        type: "punkter",
        punkter: [
          "Bruddet i mønsteret — et bilde som ikke gir mening før sekund tre, og som derfor må forklares.",
          "Nysgjerrighetsgapet — en setning som starter noe den ikke fullfører.",
          "Det direkte spørsmålet — treffer bare hvis spørsmålet er ett seeren faktisk har stilt seg.",
          "Påstanden — «Dette er den vanligste feilen vi ser.» Krever at du kan innfri.",
          "Problemet — start i irritasjonen, ikke i løsningen.",
          "Beviset — et resultat, en kø, et fullt lokale. Sterkest når det er ekte og udramatisk.",
        ],
      },
      { type: "seksjon", id: "bibliotek", tittel: "Bygg biblioteket" },
      {
        type: "steg",
        steg: [
          {
            tittel: "Samle",
            tekst:
              "Ser du en video i kundens nisje med merkbart mer respons enn resten på samme konto: noter de første fem ordene og det første bildet. Ikke hele videoen.",
          },
          {
            tittel: "Klassifiser",
            tekst:
              "Hvilken av de seks typene er det? Seks bøtter holder. Flere gjør biblioteket til et arkiv ingen bruker.",
          },
          {
            tittel: "Oversett",
            tekst:
              "Skriv om åpningen til kundens virkelighet. Den skal kunne filmes hos dem, med det de har, på dagen vi er der.",
          },
          {
            tittel: "Test én",
            tekst:
              "Prøv én ny type per produksjonsdag, ikke fem. Fem samtidig gir ingen mulighet til å vite hvilken som virket.",
          },
        ],
      },
      { type: "seksjon", id: "lover", tittel: "Når åpningen lover for mye" },
      {
        type: "avsnitt",
        tekst:
          "En åpning som lover noe videoen ikke leverer, gir høy visning og lav fullføring. Det er verre enn en svak åpning: plattformen lærer at innholdet skuffer, og neste post starter i motbakke.",
      },
      {
        type: "avsnitt",
        tekst:
          "Testen er enkel. Les åpningen høyt, og spør: hvis jeg bare fikk se denne videoen og ingenting annet, ville jeg følt meg lurt? Er svaret ja, så bytt den.",
      },
    ],
    kilder: [
      {
        tittel: "Metricool: Instagram Reel analytics — retention and skip rate",
        url: "https://metricool.com/instagram-reel-analytics/",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "innsikt-fra-kundens-folk",
    tittel: "Hent innsikten fra dem som møter kundene",
    sammendrag:
      "Ledelsen vet hva bedriften vil si. De i førstelinja vet hva folk faktisk lurer på. Fire spørsmål som gir en måneds innhold.",
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
    prioritet: 70,
    oppsummering: [
      { tekst: "Fire spørsmål, stilt til riktig person", anker: "sporsmal" },
      { tekst: "Hvor og hvordan du stiller dem", anker: "hvordan" },
      { tekst: "Det ene svaret som er mest verdt", anker: "gull" },
    ],
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "De to listene — hva bedriften vil si, og hva kundene lurer på — overlapper sjeldnere enn man skulle tro. Den andre er den som gir innhold folk stopper på.",
      },
      { type: "seksjon", id: "sporsmal", tittel: "De fire spørsmålene" },
      {
        type: "sjekkliste",
        tittel: "Til noen som møter kunder daglig",
        punkter: [
          "Hva spør folk om oftest — det samme spørsmålet, hver uke?",
          "Hva blir folk overrasket over når de får vite det?",
          "Hva tror folk om dere som ikke stemmer?",
          "Hva er dere stolte av som nesten ingen utenfra vet om?",
        ],
      },
      { type: "seksjon", id: "hvordan", tittel: "Hvor du stiller dem" },
      {
        type: "avsnitt",
        tekst:
          "Løst, i en pause, uten notatblokk framme. De samme spørsmålene i et møterom med ledelsen til stede gir et annet og dårligere svar — folk svarer da på vegne av bedriften i stedet for på vegne av seg selv.",
      },
      {
        type: "avsnitt",
        tekst:
          "Skriv ned svarene rett etterpå, med deres ord. Ikke oversett til markedsføringsspråk. Formuleringen deres ER innholdet; den er allerede testet på ekte kunder.",
      },
      { type: "seksjon", id: "gull", tittel: "Spørsmål tre" },
      {
        type: "avsnitt",
        tekst:
          "«Hva tror folk om dere som ikke stemmer» er det vanskeligste å svare på og det mest verdt. En misforståelse som gjentar seg, er et innholdstema som allerede har publikum — noen lurer på det, og ingen har svart.",
      },
    ],
  },

  {
    slug: "hvem-snakker-vi-til",
    tittel: "Hvem snakker vi egentlig til",
    sammendrag:
      "«Alle» er ikke en målgruppe, men en persona full av påfunn er ikke bedre. Slik beskriver du mottakeren på en måte som faktisk endrer hva du filmer.",
    kategori: "research",
    medie: {
      type: "bilde",
      fil: "arbeid/peppes1-1600",
      alt: "Person i blå jakke som spiser en bit, med tekstur i veggen bak",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 62,
    oppsummering: [
      { tekst: "Hvorfor personas som regel er bortkastet", anker: "persona" },
      { tekst: "Beskriv situasjonen, ikke personen", anker: "situasjon" },
      { tekst: "Tre spørsmål som endrer opptaket", anker: "endrer" },
    ],
    innhold: [
      { type: "seksjon", id: "persona", tittel: "Problemet med personas" },
      {
        type: "avsnitt",
        tekst:
          "«Kari, 34, glad i friluftsliv og gode opplevelser» er en oppdiktet person med oppdiktede egenskaper. Den endrer ingenting i hva vi filmer, og den føles produktiv å lage. Det er en dårlig kombinasjon.",
      },
      { type: "seksjon", id: "situasjon", tittel: "Beskriv situasjonen i stedet" },
      {
        type: "avsnitt",
        tekst:
          "Det nyttige er ikke hvem mottakeren er, men hvilken situasjon hen er i når innholdet dukker opp. «Står på trikken klokka 17 og har ikke bestemt seg for middag» er en beskrivelse du kan filme mot. «Er 34 og liker kvalitet» er det ikke.",
      },
      {
        type: "punkter",
        punkter: [
          "Hva skjer rett før de ser dette?",
          "Hva er de i ferd med å bestemme seg for?",
          "Hva holder dem tilbake akkurat nå?",
        ],
      },
      { type: "seksjon", id: "endrer", tittel: "Hva det endrer i opptaket" },
      {
        type: "avsnitt",
        tekst:
          "En som er sulten nå, trenger å se maten på nært hold og vite at det er åpent. En som planlegger et selskap om tre uker, trenger å se lokalet, bordoppsettet og hvor mange som får plass. Samme restaurant, to helt ulike opptak — og begge er riktige, til hver sin situasjon.",
      },
      {
        type: "merknad",
        tekst:
          "Er du usikker: spør kunden hva folk sier når de ringer. Setningene de gjentar i telefonen, er situasjonene.",
      },
    ],
  },
];
