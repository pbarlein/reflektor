import type { Rubrikk } from "../rubrikktype.ts";

/** Opptaksfasen. Håndverket, og feilene som ikke lar seg rette etterpå. */
export const OPPTAK: readonly Rubrikk[] = [
  {
    slug: "lyd-kan-ikke-reddes",
    nr: 24,
    tittel: "Lyd er det eneste du ikke kan redde etterpå",
    sammendrag:
      "Dårlig lys kan løftes, skjevt bilde kan beskjæres, og feil farge kan rettes. Dårlig lyd er borte for godt. Her er sjekken som må gå før første opptak.",
    kategori: "opptak",
    status: "lansert",
    medie: {
      type: "video",
      fil: "reels/thewell",
      alt: "Behandling ved en flislagt vegg i dempet lys",
    },
    oppdatert: "2026-09-22",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hvorfor lyd er i en egen klasse", anker: "klasse" },
      { tekst: "Sjekken på hver nye lokasjon", anker: "sjekk" },
      { tekst: "Avstand slår alt annet utstyr", anker: "avstand" },
      {
        tekst: "Romtone: tretti sekunder som redder klippingen",
        anker: "romtone",
      },
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
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbKAm_kJrGq/",
          konto: "saltandstraw",
          hvem: "Salt & Straw — amerikansk iskremkjede fra Portland. Selger iskrem over disk i egne butikker og på nett.",
          folgere: 511400,
          visninger: 259880,
          likes: 6743,
          hentet: "2026-09-21",
          seEtter:
            "Se etter myggen på t-skjorta hans. Den sitter høyt på brystet, omtrent en håndsbredd under haka, og den er fullt synlig i bildet — de har ikke forsøkt å skjule den. Stedet er en iskrembutikk, med kjøleanlegg, folk og disk. En kameramikrofon hadde tatt hele rommet og bare litt av ham. Mygg på hovedpersonen er ikke en oppgradering, det er minstekravet så snart noen skal si noe i et lokale som er i drift.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DaK24mKOlqP/",
          konto: "marriottbonvoy",
          hvem: "Marriott Bonvoy — lojalitetsprogrammet til hotellkjeden Marriott. Selger opphold og medlemsfordeler på tvers av kjedens hotellmerker.",
          folgere: 2463084,
          visninger: 722530,
          likes: 24086,
          hentet: "2026-09-21",
          seEtter:
            "Her er samme grep brukt utendørs, og grunnen er en annen: vind. En mygg på kragen, tett på munnen, gir lyd som tåler luft i bevegelse. Legg også merke til at lyset er jevnt og kommer forfra, uten harde skygger i ansiktet. De har valgt sted for lyd og lys i samme vurdering, ikke først det ene og så det andre.",
        },
      },
      { type: "seksjon", id: "avstand", tittel: "Avstand slår utstyr" },
      {
        type: "avsnitt",
        tekst:
          "Det tredje punktet på lista er det viktigste, og det er fysikk og ikke smak. Lydstyrke faller med kvadratet av avstanden: dobler du avstanden fra munnen til mikrofonen, får du omtrent en fjerdedel av lydenergien inn. Rommet — ventilasjonen, kjøledisken, folkene i bakgrunnen — står derimot omtrent like sterkt uansett hvor mikrofonen er.",
      },
      {
        type: "avsnitt",
        tekst:
          "Konsekvensen er at avstand ikke bare gjør stemmen svakere. Den gjør forholdet mellom stemme og rom dårligere, og det forholdet er det du ikke kan reparere etterpå. En rimelig mygg tjue centimeter fra munnen slår en dyr mikrofon to meter unna, hver gang. Det er derfor svaret på «lyden ble dårlig» nesten aldri er bedre utstyr, men kortere avstand.",
      },
      {
        type: "avsnitt",
        tekst:
          "En ting til, som går motsatt vei av magefølelsen: du skal ikke spille inn høyt for at det skal bli «høyt nok». Kringkasting og strømmetjenester normaliserer lydstyrke på leveransen — den europeiske anbefalingen EBU R 128 setter for eksempel et felles målnivå for hele programmet — og det samme gjør plattformene vi publiserer på. Et opptak som klipper i toppene, er ødelagt for godt. Et opptak som er litt lavt, men rent, løftes på et sekund.",
      },
      { type: "seksjon", id: "romtone", tittel: "Romtone" },
      {
        type: "avsnitt",
        tekst:
          "Ta alltid opp tretti sekunder romtone på hver lokasjon: bare rommet, uten folk og uten bevegelse. Det tar et halvt minutt, og det redder klippovergangene der to opptak med ulik bakgrunnsstøy møtes.",
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
    kilder: [
      {
        tittel:
          "Point Source Audio: 4 methods of lav mic placement — hvorfor avstand til munnen er avgjørende",
        url: "https://www.point-sourceaudio.com/best-place-to-put-a-lavalier/",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Sweetwater inSync: Inverse Square Law — lydnivå faller 6 dB per dobling av avstand",
        url: "https://www.sweetwater.com/insync/inverse-square-law/",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "EBU R 128 (v5.0, november 2023): Loudness normalisation and permitted maximum level of audio signals",
        url: "https://tech.ebu.ch/publications/r128",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "lyssetting-pa-lokasjon",
    nr: 25,
    tittel: "Lyssetting når du ikke kan bygge om rommet",
    sammendrag:
      "Kundens lokale er sjelden bygget for å filmes i. Hva du gjør med dagslys, taklys og blandet lys når du har minutter og ikke timer.",
    kategori: "opptak",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/bekkestua",
      alt: "To personer passerer hverandre i motlys fra et vindu",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 92,
    oppsummering: [
      {
        tekst: "Lys på lokasjon er en forhandling, ikke en oppbygging",
        anker: "forhandling",
      },
      { tekst: "Fire grep, i rekkefølge", anker: "grep" },
      {
        tekst: "Blandet lys er den vanligste usynlige feilen",
        anker: "blandet",
      },
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
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dcv4Tg3BDes/",
          konto: "equinox",
          hvem: "Equinox — amerikansk treningskjede i høyprissegmentet. Selger medlemskap til klubber med basseng, spa og behandling.",
          folgere: 555326,
          visninger: 99394,
          likes: 1735,
          hentet: "2026-09-21",
          seEtter:
            "Rommet er mørkt, og det har bare én type lys: varme pærer i sedertre, speilet i vannet. Ingen har hengt opp en lampe. De har funnet rommet der husets eget lys allerede dominerer, og filmet der. Dette er situasjonen du møter hos behandlingssteder, spa og klinikker, og svaret er nesten alltid å velge rom i stedet for å tilføre lys.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbJeuQChAxu/",
          konto: "tatcha",
          hvem: "Tatcha — amerikansk hudpleiemerke med japansk utgangspunkt. Selger rens og kremer i egne kanaler og hos Sephora.",
          folgere: 1460176,
          visninger: 110466,
          likes: 2700,
          hentet: "2026-09-21",
          seEtter:
            "Her er det mykt dagslys fra siden, personen er vendt mot lyset, og bakgrunnen er ryddet før noen tenkte på ansiktet: én plante, en glatt vegg, og ingenting som stikker ut bak hodet. Produktene står fremme på disken, i samme lys som ham. Hele oppsettet kan bygges på to minutter i et hvilket som helst lokale med et vindu, og det er ingenting her du ikke finner hos en kunde.",
        },
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
          "Løsningen er alltid den samme: få én kilde til å dominere. Enten slår du av den andre, eller så flytter du deg dit den ene er sterk nok til å overstyre den andre.",
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
    nr: 26,
    tittel: "Komponer for 9:16 uten å ødelegge for alt annet",
    sammendrag:
      "Innholdet skal virke i feeden og kunne brukes fritt av kunden etterpå. Det stiller to krav til samme bilde, og plattformen spiser mer av det enn du tror.",
    kategori: "opptak",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "reels/goretex",
      alt: "Sko i bevegelse over skogbunn, filmet lavt",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 86,
    oppsummering: [
      { tekst: "To krav til samme bilde", anker: "krav" },
      { tekst: "Hvor mye grensesnittet faktisk dekker", anker: "trygg" },
      {
        tekst: "Når du filmer stående, og når du ikke gjør det",
        anker: "naar",
      },
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
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DbT2KxHKeHF/",
          konto: "yeti",
          hvem: "YETI — amerikansk produsent av kjølebokser, termokopper og turutstyr. Selger gjennom forhandlere og egen nettbutikk.",
          folgere: 2329069,
          visninger: 293912,
          likes: 15477,
          hentet: "2026-09-21",
          seEtter:
            "Alt som betyr noe ligger i midtfeltet: produktet, ansiktet, og avstanden mellom dem. Øverst er det luft, nederst er det luft. Legg en tommel over de nederste 35 prosentene av bildet og se hva du mister — svaret er ingenting. Det er testen du skal gjøre på hvert eneste oppsett før du trykker opptak.",
        },
      },
      { type: "seksjon", id: "naar", tittel: "Stående eller liggende" },
      {
        type: "punkter",
        punkter: [
          "Film stående når bevegelsen er loddrett, når det bare er én person i bildet, og når innholdet skal i feeden først.",
          "Film liggende med god luft rundt motivet når det er flere personer, eller når innholdet åpenbart skal på en skjerm eller en nettside.",
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
    nr: 27,
    tittel: "Å filme folk som helst slipper",
    sammendrag:
      "De fleste vi filmer er ikke skuespillere, og mange gruer seg. Hvordan du får noe ekte ut av en som er ukomfortabel — på fem minutter.",
    kategori: "opptak",
    status: "lansert",
    medie: {
      type: "bilde",
      fil: "arbeid/portrett-vegg",
      alt: "Portrett av en person utendørs i dagslys",
    },
    oppdatert: "2026-09-22",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 94,
    oppsummering: [
      {
        tekst: "Nervøsitet er normalt, og det syns på kamera",
        anker: "nervos",
      },
      { tekst: "Fem grep som virker nesten alltid", anker: "grep" },
      { tekst: "Aldri be noen «være naturlig»", anker: "naturlig" },
      { tekst: "Når du skal gi deg", anker: "gi-deg" },
      { tekst: "Samtykke: hva som faktisk kreves", anker: "samtykke" },
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
      {
        type: "avsnitt",
        tekst:
          "Én ting er verdt å vite, fordi du kan si den høyt: folk overvurderer systematisk hvor mye andre legger merke til dem. Gilovich, Medvec og Savitsky kalte det rampelyseffekten og målte den i flere forsøk — deltakerne trodde langt flere ville huske hva de hadde på seg eller hva de sa, enn det som faktisk var tilfelle. Vi tar utgangspunkt i vår egen opplevelse av situasjonen og justerer for lite for at andre ikke sitter inni den.",
      },
      {
        type: "avsnitt",
        tekst:
          "Praktisk: «ingen kommer til å se på håret ditt, de ser på det du gjør» er ikke en høflighet. Det er dokumentert, og det er verdt å si det som om du vet det.",
      },
      { type: "seksjon", id: "grep", tittel: "Fem grep" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Start opptaket før dere er i gang",
            tekst:
              "Det beste taket er nesten alltid det første, før personen har rukket å spenne seg. Sett kameraet i gang mens dere fortsatt snakker om noe annet, og still det første spørsmålet der. Du trenger ikke skjule at det går — det er ikke opptaket som gjør folk nervøse, det er «nå gjelder det».",
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
              "Et «den var fin» etter første tak endrer hele kroppsspråket. Ikke spar det til slutt.",
          },
          {
            tittel: "5 — Ta det igjen, men ikke mange ganger",
            tekst:
              "Ta to eller tre tak. Etter det blir folk dårligere og ikke bedre, fordi de begynner å høre på seg selv.",
          },
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dc3INy_MIA7/",
          konto: "nandosuk",
          hvem: "Nando's UK & Ireland — restaurantkjede med portugisisk-afrikansk grillkylling. Selger mat over disk i egne restauranter.",
          folgere: 456776,
          visninger: 1207671,
          likes: 84465,
          hentet: "2026-09-21",
          seEtter:
            "Vi ser en person i vernevest på et lager, med en flaske i hendene. Han har en oppgave — han holder noe, og han gjør noe — og det er derfor han ser rolig ut. Ingen står stille og «er seg selv». Dette er den mest sette videoen på kontoen de siste tre månedene, foran alt det som åpenbart har kostet mer. Grepet du kan kopiere, er å gi personen den jobben de gjør til daglig, og så filme den.",
        },
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dc6VZ86x4mH/",
          konto: "shakeshack",
          hvem: "Shake Shack — amerikansk burgerkjede. Selger burgere og milkshake over disk i egne restauranter.",
          folgere: 911636,
          visninger: 276351,
          likes: 8580,
          hentet: "2026-09-21",
          seEtter:
            "Her er samme prinsipp, på et kjøkken. Han står bak sin egen disk, i sine egne klær, og rekker noe mot kameraet. Hendene er opptatt, kroppen er på hjemmebane, og blikket går til kameraet bare et øyeblikk. Sammenlign med hvordan det hadde sett ut om han var bedt om å stille seg foran disken og fortelle om stedet.",
        },
      },
      { type: "seksjon", id: "naturlig", tittel: "Ikke si «vær naturlig»" },
      {
        type: "avsnitt",
        tekst:
          "Det er den mest brukte og minst nyttige regien som finnes. Den gir personen en oppgave hen ikke kan løse, og bekrefter samtidig at hen ikke er naturlig nå. Gi en konkret handling i stedet: «se på meg, ikke i kameraet», «fortell det til meg som om jeg aldri har vært her».",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er ikke bare klønete — det virker motsatt vei. Wegners teori om ironiske prosesser beskriver hvorfor: for å kontrollere at du ikke virker anspent, må du hele tiden lete etter tegn på at du er det. Kontrollen krever altså at du overvåker nøyaktig det du prøver å unngå, og under press og tidsnød tar overvåkningen over. Å be noen slutte å virke nervøs, er å be dem tenke på nervøsiteten sin.",
      },
      {
        type: "avsnitt",
        tekst:
          "Derfor virker en handling bedre enn en instruks om å føle noe. «Skjær opp den ene til» gir noe å gjøre. «Slapp av» gir noe å passe på.",
      },
      { type: "seksjon", id: "gi-deg", tittel: "Når du skal gi deg" },
      {
        type: "avsnitt",
        tekst:
          "Noen kommer ikke til å bli komfortable, og det er greit. Da filmer du hendene, arbeidet og resultatet i stedet, og bruker stemmen til noen andre. En video uten ansiktet deres er mye bedre enn en video der de ser ulykkelige ut.",
      },
      { type: "seksjon", id: "samtykke", tittel: "Samtykke" },
      {
        type: "avsnitt",
        tekst:
          "Datatilsynet skiller mellom portrettbilder, der én eller flere bestemte personer er hovedmotivet, og situasjonsbilder, der ingen enkeltperson er i fokus. Hovedregelen er at arbeidsgiver alltid bør spørre om samtykke før bilder eller film der ansatte kan gjenkjennes, publiseres. Alt vi lager for en kunde er i praksis portrett: vi filmer bestemte mennesker, tett på, for å publisere det.",
      },
      {
        type: "avsnitt",
        tekst:
          "I praksis betyr det tre ting. Spør før du filmer, ikke etter. Si hvor det skal publiseres — «Instagram og Facebook for arbeidsgiveren din» er konkret nok. Og godta et nei uten å forhandle: et samtykke som ble gitt fordi sjefen sto i rommet, er ikke verdt papiret.",
      },
      {
        type: "merknad",
        tekst:
          "Ansvaret for samtykke ligger hos kunden som arbeidsgiver, ikke hos oss. Men det er vi som står der med kameraet, og det er vi som oppdager at ingen har spurt. Spør, og si fra til kundeansvarlig hvis svaret er uklart.",
      },
    ],
    kilder: [
      {
        tittel:
          "Datatilsynet: Bilder av ansatte på nett — portrettbilder, situasjonsbilder og samtykke",
        url: "https://www.datatilsynet.no/personvern-pa-ulike-omrader/personvern-pa-arbeidsplassen/bilder-ansatte_nett/",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Gilovich, Medvec & Savitsky (2000): The spotlight effect in social judgment. Journal of Personality and Social Psychology 78(2), 211–222",
        url: "https://doi.org/10.1037/0022-3514.78.2.211",
        sjekket: "2026-09-22",
      },
      {
        tittel:
          "Wegner (1994): Ironic processes of mental control. Psychological Review 101(1), 34–52",
        url: "https://doi.org/10.1037/0033-295X.101.1.34",
        sjekket: "2026-09-22",
      },
    ],
  },

  {
    slug: "b-roll",
    nr: 28,
    tittel: "Dekningsbilder: hvor mye, og hva slags",
    sammendrag:
      "Mangel på dekningsbilder er den vanligste grunnen til at en redigering tar dobbelt så lang tid som den skulle.",
    kategori: "opptak",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "arbeid/matcha",
      alt: "Nærbilde av grønt skum i en kopp",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 76,
    oppsummering: [
      { tekst: "Hva dekningsbilder faktisk løser", anker: "loser" },
      { tekst: "Fire dekningsbilder som nesten alltid brukes", anker: "fire" },
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
      { type: "seksjon", id: "fire", tittel: "Fire som nesten alltid brukes" },
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
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/Dc63UzbgQ3t/",
          konto: "caterpillarinc",
          hvem: "Caterpillar — amerikansk produsent av anleggsmaskiner. Selger gravemaskiner, dozere og motorer til entreprenører og industri.",
          folgere: 1091197,
          visninger: 132356,
          likes: 6136,
          hentet: "2026-09-21",
          seEtter:
            "Dette dekningsbildet gjør to jobber samtidig. Kjeglen ligger uskarp i forgrunnen og rammer inn bildet, og den våte asfalten gir refleksjoner som forteller at det har regnet, uten at noen måtte si det. Hele grepet er ti sekunders arbeid på vei fra bilen til lokasjonen. Se etter forgrunnen hver gang du rigger et dekningsbilde: den koster ingenting, og den er forskjellen på et klipp og et bilde.",
        },
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
    nr: 29,
    tittel: "Å filme i en bedrift som er i drift",
    sammendrag:
      "Vi er gjester i noen andres arbeidsdag. Hvordan du får det du trenger uten å stoppe driften — og hvorfor det avgjør om vi blir invitert tilbake.",
    kategori: "opptak",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/dag4-vegg",
      alt: "To personer i arbeid ved en utsalgsluke",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 68,
    oppsummering: [
      { tekst: "Vi koster dem noe mens vi er der", anker: "koster" },
      {
        tekst: "Praktiske regler som gjør oss lette å ha i huset",
        anker: "regler",
      },
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
          "Ikke blokker en dør, en kasse eller en gang som folk må bruke.",
          "Rydd opp etter hvert oppsett, ikke til slutt.",
          "Takk dem som stilte opp, med navn, før du går.",
        ],
      },
      {
        type: "eksempel",
        data: {
          url: "https://www.instagram.com/reel/DdUn9ORgbRU/",
          konto: "dewalttough",
          hvem: "DEWALT — amerikansk verktøyprodusent. Selger elektroverktøy til håndverkere og byggeplasser gjennom forhandlere.",
          folgere: 1267628,
          visninger: 944383,
          likes: 4473,
          hentet: "2026-09-21",
          seEtter:
            "Videoen er filmet på en ekte byggeplass mens arbeidet pågår, sammen med et entreprenørfirma som er kreditert i bildeteksten. Håndverkeren ligger på gulvet og gjør det han skal. Han har ikke reist seg eller flyttet seg for kameraet — kameraet har lagt seg ned til ham. Det er hele forholdet mellom oss og en bedrift i drift, samlet i ett bilde: vi tilpasser oss arbeidet, ikke omvendt.",
        },
      },
      { type: "seksjon", id: "sikkerhet", tittel: "Sikkerhet og adgang" },
      {
        type: "avsnitt",
        tekst:
          "I produksjonslokaler, på kjøkken og på byggeplasser gjelder deres regler, ikke våre. Det kan være vernesko, hårnett, synlighetsvest eller adgangskort. Spør hva som kreves i god tid før dagen, ikke i resepsjonen.",
      },
      {
        type: "merknad",
        tekst:
          "Filmer du der det behandles mat eller pasienter, spør spesifikt hva som ikke kan være i bildet. Det finnes regler om hygiene og personvern som de kjenner og ikke vi.",
      },
    ],
  },
];
