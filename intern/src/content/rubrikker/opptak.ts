import type { Rubrikk } from "../rubrikktype.ts";

/** Opptaksfasen. Håndverket, og feilene som ikke lar seg rette etterpå. */
export const OPPTAK: readonly Rubrikk[] = [
  {
    slug: "lyd-kan-ikke-reddes",
    tittel: "Lyd er det eneste du ikke kan redde etterpå",
    sammendrag:
      "Dårlig lys kan graderes, skjevt bilde kan beskjæres, feil farge kan rettes. Dårlig lyd er borte. Sjekken som må gå før første opptak.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "reels/thewell",
      alt: "Behandling ved en flislagt vegg i dempet lys",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hvorfor lyd er i en egen klasse", anker: "klasse" },
      { tekst: "Sjekken på hver nye lokasjon", anker: "sjekk" },
      { tekst: "Romtone: tretti sekunder som redder klippingen", anker: "romtone" },
      { tekst: "Hør mens det filmes, ikke bare før", anker: "hor" },
    ],
    innhold: [
      { type: "seksjon", id: "klasse", tittel: "Hvorfor lyd er annerledes" },
      {
        type: "avsnitt",
        tekst:
          "Alt annet i et opptak har en vei tilbake. Undereksponert bilde kan løftes. Skjev horisont kan rettes. Feil hvitbalanse er en glidebryter. Lyd med romklang, brumming fra en kjøledisk eller vind i mikrofonen har ingen vei tilbake.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og det oppdages typisk først når materialet åpnes i redigering, dagen etter, når alle har gått hjem. Det er derfor dette er den dyreste enkeltfeilen på en produksjonsdag — ikke fordi lyd er viktigst, men fordi det er den eneste feilen som krever at man filmer på nytt.",
      },
      {
        type: "merknad",
        tekst:
          "Selv på videoer folk ser uten lyd: teksting lages fra lyden. Er lyden ubrukelig, blir tekstingen feil, og da er videoen ubrukelig for begge grupper.",
      },
      { type: "seksjon", id: "sjekk", tittel: "Før første opptak" },
      {
        type: "sjekkliste",
        tittel: "På hver nye lokasjon",
        punkter: [
          "Ta opp ti sekunder stillhet og HØR PÅ DEM med hodetelefoner. Ikke se på nivåmåleren — hør.",
          "Ventilasjon, kjøledisk, kaffemaskin, bakgrunnsmusikk: kan noe slås av? Spør, ikke anta.",
          "Er mikrofonen på personen, ikke på kameraet? Avstand er den største enkeltfaktoren.",
          "Vindbeskyttelse på, også innendørs hvis det er trekk eller vifte.",
          "Nivå: toppene rundt −12 til −6 dB. Klipper det, er det ødelagt.",
          "Batteri i senderen, og et reservebatteri i lomma.",
        ],
      },
      { type: "seksjon", id: "romtone", tittel: "Romtone" },
      {
        type: "avsnitt",
        tekst:
          "Ta alltid opp tretti sekunder romtone på hver lokasjon: bare rommet, uten folk og uten bevegelse. Det koster en halv gitarpause og redder hver eneste klippovergang der to opptak med ulik bakgrunnsstøy møtes.",
      },
      {
        type: "avsnitt",
        tekst:
          "Uten romtone hører man hvert klipp som et hopp, fordi stillheten skifter karakter. Med romtone under, hører man ingenting — og det er hele poenget.",
      },
      { type: "seksjon", id: "hor", tittel: "Hør underveis" },
      {
        type: "avsnitt",
        tekst:
          "Hør på lyden mens det filmes, ikke bare før. En mikrofon som løsner midt i en tagning, hører du med en gang og ser aldri. Det samme gjelder en jakke som skraper, et armbånd som klirrer og en telefon i lomma som gir interferens.",
      },
    ],
  },

  {
    slug: "lyssetting-pa-lokasjon",
    tittel: "Lyssetting når du ikke kan bygge om rommet",
    sammendrag:
      "Kundens lokale er sjelden bygget for å filmes i. Hva du gjør med dagslys, taklys og blandet lys når du har minutter og ikke timer.",
    kategori: "opptak",
    medie: {
      type: "bilde",
      fil: "arbeid/bekkestua",
      alt: "To personer passerer hverandre i motlys fra et vindu",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 92,
    oppsummering: [
      { tekst: "Lys på lokasjon er en forhandling, ikke en oppbygging", anker: "forhandling" },
      { tekst: "Fire grep, i rekkefølge", anker: "grep" },
      { tekst: "Blandet lys er den vanligste usynlige feilen", anker: "blandet" },
      { tekst: "Sjekk bakgrunnen før du sjekker personen", anker: "bakgrunn" },
      { tekst: "Lås hvitbalansen", anker: "hvitbalanse" },
    ],
    innhold: [
      { type: "seksjon", id: "forhandling", tittel: "En forhandling" },
      {
        type: "avsnitt",
        tekst:
          "På en produksjonsdag hos en kunde er lys noe du forhandler med, ikke noe du bygger. Lokalet er i drift, folk skal jobbe, og du har minutter per oppsett. Det betyr at du velger hvor du står ut fra lyset som finnes, i stedet for å lage lyset der du vil stå.",
      },
      { type: "seksjon", id: "grep", tittel: "Fire grep" },
      {
        type: "steg",
        steg: [
          {
            tittel: "Finn vinduet før du finner bakgrunnen",
            tekst:
              "Dagslys fra siden er nesten alltid det beste lyset i rommet, og det er gratis. Plasser personen slik at vinduet treffer ansiktet skrått forfra.",
          },
          {
            tittel: "Slå av taklyset hvis du kan",
            tekst:
              "Lys rett ovenfra gir skygger under øynene, og taklys har som regel en annen fargetemperatur enn dagslyset.",
          },
          {
            tittel: "Kan du ikke slå det av, la dagslyset vinne",
            tekst:
              "Gå nærmere vinduet, slik at dagslyset er klart sterkest. Blandet lys er et problem når kildene er like sterke, ikke når én dominerer.",
          },
          {
            tittel: "Legg til én lampe, ikke tre",
            tekst:
              "Ett mykt lys som fyller skyggesiden holder i de aller fleste oppsett. Tre lamper er en oppbygging, og den har du ikke tid til.",
          },
        ],
      },
      { type: "seksjon", id: "blandet", tittel: "Blandet lys" },
      {
        type: "avsnitt",
        tekst:
          "To lyskilder med ulik farge i samme bilde er den vanligste grunnen til at et opptak ser amatørmessig ut uten at man ser hvorfor. Ansiktet blir grønnlig på den ene siden og blått på den andre, og ingen fargekorrigering retter begge samtidig.",
      },
      {
        type: "avsnitt",
        tekst:
          "Løsningen er alltid den samme: få én kilde til å dominere. Enten slå av den andre, eller flytt deg til der den ene er sterk nok til å overdøve den andre.",
      },
      { type: "seksjon", id: "bakgrunn", tittel: "Bakgrunnen først" },
      {
        type: "avsnitt",
        tekst:
          "Sjekk hva som er bak personen før du sjekker personen. En utbrent vindusflate, en stikkontakt rett bak hodet eller en søppelbøtte i hjørnet er lettere å flytte seg vekk fra enn å rette i etterkant.",
      },
      { type: "seksjon", id: "hvitbalanse", tittel: "Lås hvitbalansen" },
      {
        type: "avsnitt",
        tekst:
          "Sett hvitbalansen manuelt når oppsettet står. Automatisk hvitbalanse endrer seg når noen går gjennom bildet eller en sky passerer, og da glir fargen midt i tagningen. Det er umulig å rette pent.",
      },
    ],
  },

  {
    slug: "komponer-for-9-16",
    tittel: "Komponer for 9:16 uten å ødelegge for alt annet",
    sammendrag:
      "Innholdet skal virke i feeden og kunne brukes fritt av kunden etterpå. Det stiller to krav til samme bilde, og plattformen spiser mer av det enn du tror.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "reels/goretex",
      alt: "Sko i bevegelse over skogbunn, filmet lavt",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 86,
    oppsummering: [
      { tekst: "To krav til samme bilde", anker: "krav" },
      { tekst: "Hvor mye grensesnittet faktisk dekker", anker: "trygg" },
      { tekst: "Når du filmer stående, og når du ikke gjør det", anker: "naar" },
      { tekst: "Midtfeltet er ikke midten", anker: "midt" },
    ],
    innhold: [
      { type: "seksjon", id: "krav", tittel: "To krav" },
      {
        type: "avsnitt",
        tekst:
          "Leveransen er sosiale medier, altså stående 9:16. Men kunden har fri bruk av alt innhold — nettsider, skjermer, presentasjoner, annonser — og de flatene er stort sett liggende. Filmer vi bare stående, er materialet ubrukelig utenfor feeden.",
      },
      { type: "seksjon", id: "trygg", tittel: "Det trygge området" },
      {
        type: "avsnitt",
        tekst:
          "Meta oppgir selv hvor mye av bildet grensesnittet kan dekke i Stories og Reels: omtrent 14 % i toppen, 35 % i bunnen og 6 % i hver side bør holdes fri for tekst, logoer og andre viktige elementer.",
      },
      {
        type: "merknad",
        tekst:
          "35 % i bunnen er mer enn de fleste tror — det er over en tredjedel av bildet. Et ansikt plassert der blir dekket av brukernavn, bildetekst og knapper. Dette er en retningslinje for annonser, men den beskriver det samme grensesnittet som ligger over organisk innhold.",
      },
      {
        type: "figur",
        navn: "trygg-sone",
        tekst:
          "Det stiplede feltet er alt du kan regne med at seeren ser. 35 % i bunnen er over en tredjedel av bildet — et ansikt plassert der blir dekket av brukernavn, bildetekst og knapper. Tallene er Metas egne for Stories og Reels.",
      },
      { type: "seksjon", id: "naar", tittel: "Stående eller liggende" },
      {
        type: "punkter",
        punkter: [
          "Stående når bevegelsen er loddrett, når det er én person, og når det skal i feeden først.",
          "Liggende med god luft rundt motivet når det er flere personer, eller når det åpenbart skal på skjerm eller nettside.",
          "Trenger du begge: film liggende i høyere oppløsning og hold motivet i midtfeltet, så kan et stående utsnitt hentes ut uten å miste skarphet.",
        ],
      },
      { type: "seksjon", id: "midt", tittel: "Midtfeltet" },
      {
        type: "avsnitt",
        tekst:
          "Midtfeltet er ikke midten av bildet. Et stående utsnitt av et liggende bilde tar omtrent den midterste tredjedelen i bredden. Alt som må være med, må ligge innenfor den — ellers får du valget mellom å miste motivet eller miste utsnittet.",
      },
      {
        type: "figur",
        navn: "utsnitt",
        tekst:
          "Det oransje feltet er alt som overlever når et 16:9-opptak beskjæres til 9:16. Alt i de grå feltene er borte. Derfor: film liggende med god luft, men komponer som om bare midten finnes.",
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
        tittel: "Instagram Help: Reel size and aspect ratios",
        url: "https://help.instagram.com/1038071743007909",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "filme-folk-som-ikke-vil",
    tittel: "Å filme folk som helst slipper",
    sammendrag:
      "De fleste vi filmer er ikke skuespillere, og mange gruer seg. Hvordan du får noe ekte ut av en som er ukomfortabel — på fem minutter.",
    kategori: "opptak",
    medie: {
      type: "bilde",
      fil: "arbeid/portrett-vegg",
      alt: "Portrett av en person utendørs i dagslys",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 94,
    oppsummering: [
      { tekst: "Nervøsitet er normalt, og det syns på kamera", anker: "nervos" },
      { tekst: "Fem grep som virker nesten alltid", anker: "grep" },
      { tekst: "Aldri be noen «være naturlig»", anker: "naturlig" },
      { tekst: "Når du skal gi deg", anker: "gi-deg" },
    ],
    innhold: [
      { type: "seksjon", id: "nervos", tittel: "Nervøsitet syns" },
      {
        type: "avsnitt",
        tekst:
          "De aller fleste vi filmer har aldri gjort det før. De vet ikke hva de skal gjøre med hendene, de hører sin egen stemme for første gang, og de er redde for å se dumme ut foran kolleger. Alt dette syns på kamera, og det er ikke deres feil — det er vår jobb å løse det.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er også en kundeleveranse. En ansatt som fikk en dårlig opplevelse foran kamera, sier nei neste gang. Da har vi gjort neste produksjonsdag vanskeligere.",
      },
      { type: "seksjon", id: "grep", tittel: "Fem grep" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Start med kameraet i gang, uten å si det er en tagning",
            tekst:
              "Den beste taket er nesten alltid det som skjer før personen tror det gjelder. Si «jeg bare sjekker lyden» og still første spørsmål der.",
          },
          {
            tittel: "2 — Still spørsmål om noe de kan",
            tekst:
              "Be dem forklare noe de gjør hver dag. Fagkunnskap gjør folk trygge; å snakke om seg selv gjør dem ikke det.",
          },
          {
            tittel: "3 — Gi dem noe å gjøre med hendene",
            tekst:
              "La dem jobbe mens de snakker. Å skjære, pakke, montere eller skjenke fjerner halve problemet uten at du sier noe.",
          },
          {
            tittel: "4 — Si når det er bra",
            tekst:
              "«Den var fin» etter første tak endrer hele kroppsspråket. Ikke spar på det til slutt.",
          },
          {
            tittel: "5 — Ta det igjen, men ikke mange ganger",
            tekst:
              "To eller tre tak. Etter det blir folk dårligere, ikke bedre — de begynner å høre på seg selv.",
          },
        ],
      },
      { type: "seksjon", id: "naturlig", tittel: "Ikke si «vær naturlig»" },
      {
        type: "avsnitt",
        tekst:
          "Det er den mest brukte og minst nyttige regien som finnes. Den gir personen en oppgave hen ikke kan løse, og bekrefter samtidig at hen ikke er naturlig nå. Gi en konkret handling i stedet: «se på meg, ikke i kameraet», «fortell det til meg som om jeg aldri har vært her».",
      },
      { type: "seksjon", id: "gi-deg", tittel: "Når du skal gi deg" },
      {
        type: "avsnitt",
        tekst:
          "Noen kommer ikke til å bli komfortable, og det er greit. Da filmer du hendene, arbeidet og resultatet i stedet, og bruker stemmen til noen andre. En video uten ansiktet deres er uendelig mye bedre enn en video der de ser ulykkelige ut.",
      },
      {
        type: "merknad",
        tekst:
          "Spør alltid om samtykke til at opptaket brukes, og si hvor det skal publiseres. Det er både riktig og påkrevd — og det er lettere å spørre før enn å fjerne etterpå.",
      },
    ],
  },

  {
    slug: "b-roll",
    tittel: "Dekningsbilder: hvor mye, og hva slags",
    sammendrag:
      "Mangel på dekningsbilder er den vanligste grunnen til at en redigering tar dobbelt så lang tid som den skulle.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "arbeid/matcha",
      alt: "Nærbilde av grønt skum i en kopp",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 76,
    oppsummering: [
      { tekst: "Hva dekningsbilder faktisk løser", anker: "loser" },
      { tekst: "Fire som nesten alltid brukes", anker: "fire" },
      { tekst: "Film lenger enn du tror du trenger", anker: "lenger" },
      { tekst: "Hold kameraet i ro på halvparten", anker: "ro" },
    ],
    innhold: [
      { type: "seksjon", id: "loser", tittel: "Hva de løser" },
      {
        type: "avsnitt",
        tekst:
          "Dekningsbilder er alt som ikke er hovedopptaket: hender, detaljer, omgivelser, folk som går forbi. De gjør at et klipp kan kuttes uten at det synes, og at en video på tretti sekunder ikke består av ett statisk bilde.",
      },
      {
        type: "avsnitt",
        tekst:
          "De løser også et problem du ikke har oppdaget ennå: når personen sier noe halvveis feil, og du må klippe midt i setningen. Uten dekning ser det ut som en glipp. Med dekning ser det ut som et valg.",
      },
      { type: "seksjon", id: "fire", tittel: "Fire som alltid brukes" },
      {
        type: "sjekkliste",
        tittel: "Per oppsett med tale",
        punkter: [
          "Hendene som gjør det personen snakker om",
          "Detaljen på nært hold — produktet, verktøyet, resultatet",
          "Rommet sett utenfra eller ovenfra, som etablerer hvor vi er",
          "En bevegelse inn i eller ut av bildet, som gir et klippepunkt",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Fire klipp på fem til åtte sekunder tar under to minutter å filme og sparer typisk et kvarter i redigering.",
      },
      { type: "seksjon", id: "lenger", tittel: "Lenger enn du tror" },
      {
        type: "avsnitt",
        tekst:
          "Film hvert dekningsbilde lenger enn du tror du trenger. Et klipp på to sekunder kan ikke forlenges; ett på åtte kan alltid kortes. Dette er den billigste forsikringen som finnes på en produksjonsdag.",
      },
      { type: "seksjon", id: "ro", tittel: "Kameraet i ro" },
      {
        type: "avsnitt",
        tekst:
          "Hold kameraet i ro på minst halvparten av dekningsbildene. En redigering der alt beveger seg, har ingen steder å puste — og bevegelse som ikke er begrunnet, leser som usikkerhet.",
      },
    ],
  },

  {
    slug: "filme-i-en-bedrift-i-drift",
    tittel: "Å filme i en bedrift som er i drift",
    sammendrag:
      "Vi er gjester i noen andres arbeidsdag. Hvordan du får det du trenger uten å stoppe driften — og hvorfor det avgjør om vi blir invitert tilbake.",
    kategori: "opptak",
    medie: {
      type: "bilde",
      fil: "arbeid/dag4-vegg",
      alt: "To personer i arbeid ved en utsalgsluke",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 68,
    oppsummering: [
      { tekst: "Vi koster dem noe mens vi er der", anker: "koster" },
      { tekst: "Praktiske regler som gjør oss lette å ha i huset", anker: "regler" },
      { tekst: "Sikkerhet og adgang", anker: "sikkerhet" },
    ],
    innhold: [
      { type: "seksjon", id: "koster", tittel: "Vi koster dem noe" },
      {
        type: "avsnitt",
        tekst:
          "Hver time vi er der, er en time noen bruker på oss i stedet for på jobben sin. Det er lett å glemme når vi er konsentrert om vårt. Kunden husker sjelden akkurat hvilke klipp vi fikk — men de husker om det var slitsomt å ha oss der.",
      },
      { type: "seksjon", id: "regler", tittel: "Lette å ha i huset" },
      {
        type: "punkter",
        punkter: [
          "Si hvor lenge du trenger dem, og hold det. Går det over, si fra i stedet for å håpe de ikke merker det.",
          "Rigg ferdig før du henter folk. Ingen skal stå og vente mens du finner en kabel.",
          "Ikke blokker en dør, en kasse eller en vei folk må gå.",
          "Rydd opp etter hvert oppsett, ikke til slutt.",
          "Takk dem som stilte opp, med navn, før du går.",
        ],
      },
      { type: "seksjon", id: "sikkerhet", tittel: "Sikkerhet og adgang" },
      {
        type: "avsnitt",
        tekst:
          "I produksjonslokaler, kjøkken og byggeplasser gjelder deres regler, ikke våre. Vernesko, hårnett, synlighetsvest, adgangskort. Spør hva som kreves før dagen, ikke i resepsjonen.",
      },
      {
        type: "merknad",
        tekst:
          "Filmer du der det behandles mat eller pasienter, spør spesifikt hva som ikke kan være i bildet. Det finnes regler om hygiene og personvern som de kjenner og ikke vi.",
      },
    ],
  },
];
