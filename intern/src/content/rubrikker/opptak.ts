import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Opptaksfasen. Håndverket, og feilene som ikke lar seg rette etterpå.
 *
 * Alle rubrikkene her er UTKAST — se rubrikktype.ts.
 */
export const OPPTAK: readonly Rubrikk[] = [
  {
    slug: "lyd-kan-ikke-reddes",
    tittel: "Lyd er det eneste du ikke kan redde i etterkant",
    sammendrag:
      "Utkast: dårlig lys kan graderes, skjevt bilde kan beskjæres, feil farge kan rettes. Dårlig lyd er borte. Sjekken som må gå før første opptak.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "reels/thewell",
      alt: "Behandling ved en flislagt vegg i dempet lys",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 96,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Alt annet i et opptak har en vei tilbake. Undereksponert bilde kan løftes. Skjev horisont kan rettes. Feil hvitbalanse er en glidebryter. Lyd med romklang, brumming fra en kjøledisk eller vind i mikrofonen har ingen vei tilbake — og oppdages typisk først når materialet er åpnet i redigering, dagen etter, når alle har gått hjem.",
      },
      {
        type: "merknad",
        tekst:
          "Dette er den dyreste enkeltfeilen på en produksjonsdag. Ikke fordi lyden er viktigst, men fordi den er den eneste som krever at man filmer på nytt.",
      },
      {
        type: "sjekkliste",
        tittel: "Før første opptak på hver nye lokasjon",
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
        type: "avsnitt",
        tekst:
          "Ta alltid opp tretti sekunder romtone på hver lokasjon — bare rommet, uten folk og uten bevegelse. Den koster en halv gitarpause og redder hver eneste klipp­overgang der to opptak med ulik bakgrunnsstøy møtes.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og: hør på lyden mens det filmes, ikke bare før. En mikrofon som løsner midt i en tagning, hører du med en gang og ser aldri.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvilke mikrofoner er standard i riggen, og hvem har ansvar for at de er ladet før dagen?",
      },
    ],
  },
  {
    slug: "lyssetting-pa-lokasjon",
    tittel: "Lyssetting på lokasjon",
    sammendrag:
      "Utkast: kundens lokale er sjelden bygget for å filmes i. Hva du gjør med dagslys, taklys og blandet lys når du ikke kan bygge om rommet.",
    kategori: "opptak",
    medie: {
      type: "bilde",
      fil: "arbeid/bekkestua",
      alt: "To personer passerer hverandre i motlys fra et vindu",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 84,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "På en produksjonsdag hos en kunde er lys en forhandling, ikke en oppbygging. Lokalet er i drift, folk skal jobbe, og du har minutter — ikke timer — per oppsett.",
      },
      {
        type: "steg",
        steg: [
          {
            tittel: "Finn vinduet før du finner bakgrunnen",
            tekst:
              "Dagslys fra siden er nesten alltid det beste lyset i rommet, og det er gratis. Plasser personen slik at vinduet treffer ansiktet fra skrått foran, ikke bakfra.",
          },
          {
            tittel: "Slå av taklyset hvis du kan",
            tekst:
              "Taklys ovenfra gir skygger under øynene og har som regel en annen fargetemperatur enn dagslyset. To lyskilder med ulik farge i samme bilde er den vanligste grunnen til at et opptak ser amatørmessig ut uten at man ser hvorfor.",
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
        type: "merknad",
        tekst:
          "Sjekk bakgrunnen før du sjekker personen. En utbrent vindusflate eller en stikkontakt rett bak hodet er lettere å flytte seg vekk fra enn å rette i etterkant.",
      },
      {
        type: "avsnitt",
        tekst:
          "Lås hvitbalansen manuelt når oppsettet står. Automatisk hvitbalanse endrer seg når noen går gjennom bildet, og da glir fargen midt i tagningen.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hva består standardriggen av, og hva tas med på en vanlig abonnementsdag kontra en ekstra produksjonsdag?",
      },
    ],
  },
  {
    slug: "komponer-for-9-16",
    tittel: "Komponer for 9:16 uten å ødelegge for 16:9",
    sammendrag:
      "Utkast: innholdet skal virke i feeden og kunne brukes fritt av kunden etterpå. Det stiller to krav til samme bilde.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "reels/goretex",
      alt: "Sko i bevegelse over skogbunn, filmet lavt",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 78,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Leveransen er sosiale medier, altså stående 9:16. Men kunden har fri bruk av alt innhold — nettsider, skjermer, presentasjoner, annonser — og de flatene er stort sett liggende. Filmer vi bare stående, er materialet ubrukelig utenfor feeden.",
      },
      {
        type: "punkter",
        punkter: [
          "Film stående når bevegelsen er loddrett, når det er én person, og når det skal i feeden først.",
          "Film liggende med god luft rundt motivet når det er flere personer, eller når det åpenbart skal brukes på skjerm eller nettside.",
          "Trenger du begge: film liggende i høyere oppløsning og hold motivet i midtfeltet, så kan et stående utsnitt hentes ut uten å miste skarphet.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Midtfeltet er ikke midten av bildet. Et stående utsnitt av et liggende bilde tar omtrent den midterste tredjedelen — alt som må være med, må ligge innenfor den.",
      },
      {
        type: "avsnitt",
        tekst:
          "Hold nedre fjerdedel av det stående bildet ren. Der ligger brukernavn, bildetekst og knapper i grensesnittet, og et ansikt eller en viktig detalj plassert der blir dekket av plattformen selv.",
      },
      {
        type: "avsnitt",
        tekst:
          "Gjelder også teksting: tekstplakater som ligger for lavt i bildet, havner bak grensesnittet på noen skjermstørrelser. Se rubrikken om teksting i redigeringsfasen.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: filmes det som standard i en oppløsning som tåler utsnitt, og hva er den faktiske innstillingen på kameraene?",
      },
    ],
  },
  {
    slug: "b-roll",
    tittel: "B-roll: hvor mye, og hva slags",
    sammendrag:
      "Utkast: mangel på dekningsbilder er den vanligste grunnen til at en redigering tar dobbelt så lang tid som den skulle.",
    kategori: "opptak",
    medie: {
      type: "video",
      fil: "arbeid/matcha",
      alt: "Nærbilde av grønt skum i en kopp",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 66,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "B-roll er alt som ikke er hovedopptaket: hender, detaljer, omgivelser, folk som går forbi. Det er det som gjør at et klipp kan kuttes uten at det synes, og at en video på tretti sekunder ikke består av ett statisk bilde.",
      },
      {
        type: "avsnitt",
        tekst:
          "Tommelfingerregel for utkastet: til hvert oppsett med tale, film minst fire dekningsbilder på fem til åtte sekunder hver. Det tar under to minutter og sparer typisk et kvarter i redigering.",
      },
      {
        type: "sjekkliste",
        tittel: "Fire som nesten alltid brukes",
        punkter: [
          "Hendene som gjør det personen snakker om",
          "Detaljen på nært hold — produktet, verktøyet, resultatet",
          "Rommet sett utenfra eller ovenfra, som etablerer hvor vi er",
          "En bevegelse inn i eller ut av bildet, som gir et klippepunkt",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Film hvert dekningsbilde lenger enn du tror du trenger. Et klipp på to sekunder kan ikke forlenges; ett på åtte kan alltid kortes.",
      },
      {
        type: "avsnitt",
        tekst:
          "Hold kameraet i ro på minst halvparten. En redigering der alt beveger seg, har ingen steder å puste — og bevegelse som ikke er begrunnet, leser som usikkerhet.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: er fire per oppsett riktig nivå, eller bør tallet knyttes til videolengde i stedet?",
      },
    ],
  },
];
