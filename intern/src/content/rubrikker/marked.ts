import type { Rubrikk } from "../rubrikktype.ts";

/**
 * Markedet utenfor.
 *
 * DENNE KATEGORIEN ER DEN MEST UTSATTE FOR PÅFUNN. En «markedsnyhet» er i
 * praksis en påstand om verden — hva en plattform har endret, hva bransjen
 * gjør, hva kunder mener. Slike påstander kan ikke skrives uten kilde.
 *
 * Der det finnes en etterprøvbar kilde, står den i `kilder`. Der det ikke
 * gjør det, inneholder rubrikken rammen og spørsmålene, ikke svarene.
 */
export const MARKED: readonly Rubrikk[] = [
  {
    slug: "sosiale-medier-i-norge",
    nr: 20,
    tittel: "Sosiale medier i Norge — tallene som faktisk gjelder",
    sammendrag:
      "Det meste som siteres om SoMe er amerikansk. Her er hva vi vet om det norske markedet, og hva det betyr for hvilke kanaler vi anbefaler.",
    kategori: "research",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "reels/zeroh",
      alt: "Folk samlet ved en stand på et utendørsarrangement",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 100,
    oppsummering: [
      { tekst: "Hvorfor amerikanske tall er misvisende her", anker: "usa" },
      { tekst: "Hva Ipsos måler i Norge", anker: "ipsos" },
      { tekst: "Hva det betyr for Instagram og Facebook", anker: "betyr" },
      { tekst: "Når en kunde spør om TikTok", anker: "tiktok" },
    ],
    innhold: [
      { type: "seksjon", id: "usa", tittel: "Amerikanske tall bommer" },
      {
        type: "avsnitt",
        tekst:
          "Mesteparten av det som siteres i bransjen er hentet fra amerikanske undersøkelser. Plattformfordelingen der ligner ikke den norske, og aldersprofilen er en annen. Bruker du de tallene i et kundemøte, risikerer du å anbefale noe som ikke stemmer for markedet kunden faktisk selger i.",
      },
      { type: "seksjon", id: "ipsos", tittel: "Hva Ipsos måler" },
      {
        type: "avsnitt",
        tekst:
          "Ipsos har målt norsk bruk av sosiale medier kvartalsvis i mange år gjennom SoMe-trackeren. Det er den beste offentlig tilgjengelige kilden vi har på norske forhold, og den er verdt å kjenne hovedtrekkene i.",
      },
      {
        type: "avsnitt",
        tekst:
          "Hovedbildet er stabilt: Facebook har fortsatt størst samlet rekkevidde på tvers av aldersgrupper, mens Instagram står sterkest i aldersgruppene under 45. Snapchat dominerer blant de yngste. Daglig bruk av sosiale medier samlet har ligget på et høyt og svakt stigende nivå.",
      },
      {
        type: "merknad",
        tekst:
          "Ikke siter eksakte prosenttall fra hukommelsen. Slå opp den nyeste trackeren før du bruker et tall i et møte, og si hvilket kvartal det er fra.",
      },
      { type: "seksjon", id: "betyr", tittel: "Hva det betyr for oss" },
      {
        type: "avsnitt",
        tekst:
          "Det begrunner leveransen vår. Instagram med krysspublisering til Facebook treffer bredt i Norge på tvers av alder, med én produksjon. For de aller fleste norske bedrifter med et lokalt nedslagsfelt er det den mest effektive kombinasjonen som finnes — ikke fordi det er enklest for oss, men fordi det er der folk faktisk er.",
      },
      { type: "seksjon", id: "tiktok", tittel: "Når kunden spør om TikTok" },
      {
        type: "avsnitt",
        tekst:
          "Svar ærlig: det kan være riktig for dem, og det inngår ikke i abonnementet. TikTok har vokst raskt i Norge og treffer en yngre gruppe enn Facebook. Er kundens kjøpere under tretti, er spørsmålet legitimt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Ikke lov noe. Ta det med til Pål som et innspill om leveransen — flere kunder som spør om det samme, er informasjon verdt å samle opp.",
      },
    ],
    kilder: [
      {
        tittel: "Ipsos SoMe-tracker (Norge)",
        url: "https://www.ipsos.com/nb-no/ipsos-some-tracker",
        sjekket: "2026-09-21",
      },
      {
        tittel:
          "Kom24: Snapchat er eneste SoMe-kanal med jevn vekst i Norge (omtale av Ipsos SoMe-tracker)",
        url: "https://www.kom24.no/facebook-instagram-ipsos-some-tracker/snap-er-eneste-some-kanal-som-vokser-i-norge/945009",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "endringer-pa-plattformene",
    nr: 21,
    tittel: "Når plattformene endrer noe",
    sammendrag:
      "Formater, anbefalinger og grensesnitt endrer seg flere ganger i året. Rutinen for å fange det opp før en kunde spør.",
    kategori: "publisering",
    status: "gjennomgang",
    medie: {
      type: "video",
      fil: "reels/gekko",
      alt: "Syklist på en sti i skogen",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 84,
    oppsummering: [
      { tekst: "Hva som faktisk påvirker oss", anker: "paavirker" },
      {
        tekst: "Sjekklisten når noe ser ut til å ha endret seg",
        anker: "sjekk",
      },
      { tekst: "Si fra før kunden oppdager det", anker: "si-fra" },
    ],
    innhold: [
      {
        type: "merknad",
        tekst:
          "Denne rubrikken inneholder med hensikt ingen konkrete plattformtall. Slike tall er ferskvare, og et tall gjengitt uten kilde er som regel utdatert før noen rekker å lese det. Rubrikken beskriver i stedet rutinen for å holde tallene riktige.",
      },
      { type: "seksjon", id: "paavirker", tittel: "Hva som påvirker oss" },
      {
        type: "punkter",
        punkter: [
          "Anbefalt oppløsning, format og lengde",
          "Hvor mye av bildet grensesnittet dekker",
          "Hva som kan krysspubliseres automatisk",
          "Hvordan innhold merkes — reklame, samarbeid, generert innhold",
        ],
      },
      { type: "seksjon", id: "sjekk", tittel: "Sjekklisten" },
      {
        type: "sjekkliste",
        punkter: [
          "Sjekk plattformens egen dokumentasjon, ikke en bransjeartikkel om den.",
          "Verifiser på en ekte konto før det formidles videre.",
          "Noter dato for når det ble sjekket. Uten dato er informasjonen verdiløs om tre måneder.",
          "Oppdater rubrikken om eksport eller teksting hvis endringen berører dem.",
          "Si fra til kundeansvarlige.",
        ],
      },
      { type: "seksjon", id: "si-fra", tittel: "Si fra først" },
      {
        type: "avsnitt",
        tekst:
          "Å fortelle kunden om en endring før de spør, er proaktivitet i sin billigste form. Det koster en melding og kjøper uforholdsmessig mye tillit.",
      },
    ],
  },

  {
    slug: "hva-kunder-sporr-om",
    nr: 22,
    tittel: "Spørsmål kunder stiller — og hva vi svarer",
    sammendrag:
      "Dette er rammen for et levende dokument. De samme spørsmålene kommer igjen og igjen, og svarene bør ikke improviseres hver gang.",
    kategori: "kunde",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/stallen-1600",
      alt: "Et kjøkkenteam samlet rundt en rød bok",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 72,
    oppsummering: [
      { tekst: "Hvorfor ulike svar er et problem", anker: "ulike" },
      { tekst: "Spørsmålene som går igjen", anker: "sporsmal" },
      { tekst: "To som allerede har et svar", anker: "har-svar" },
    ],
    innhold: [
      {
        type: "merknad",
        tekst:
          "Svarene under er IKKE fylt ut. Å skrive hva Reflektor mener om resultater eller konkurrenter uten at noen har sagt det, ville vært påfunn. Rammen står; svarene må inn fra folk.",
      },
      { type: "seksjon", id: "ulike", tittel: "Hvorfor det betyr noe" },
      {
        type: "avsnitt",
        tekst:
          "Nye kunder stiller i stor grad de samme spørsmålene. Et improvisert svar er sjelden galt, men det er sjelden helt likt forrige gang — og ulike svar fra ulike ansatte er det som gjør at en kunde begynner å lure.",
      },
      { type: "seksjon", id: "sporsmal", tittel: "Spørsmålene" },
      {
        type: "punkter",
        punkter: [
          "«Hvor lang tid tar det før vi ser resultater?»",
          "«Hva skjer hvis vi ikke er fornøyde?»",
          "«Kan vi bruke videoene i annonser?»",
          "«Hvorfor bare Instagram og Facebook?»",
          "«Hvorfor håndterer dere ikke kommentarfeltet?»",
          "«Hva om vi ikke har noe å filme denne måneden?»",
        ],
      },
      { type: "seksjon", id: "har-svar", tittel: "To som allerede har svar" },
      {
        type: "avsnitt",
        tekst:
          "Fri bruk av alt innhold står i leveransen — svaret på spørsmål tre er ja. At kommentarfelt ikke inngår står eksplisitt i hva som ikke inngår. Resten må besvares av noen som kan svare på vegne av Reflektor.",
      },
    ],
  },

  {
    slug: "ai-i-innholdsproduksjon",
    nr: 23,
    tittel: "AI i innholdsproduksjon",
    sammendrag:
      "Spørsmålet kommer i stadig flere møter, og det kommer i to former. Dette er rammen for et standpunkt Reflektor må ta selv.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/fabrikk-vegg",
      alt: "Fire personer i arbeidstøy samlet i et produksjonslokale",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 60,
    oppsummering: [
      { tekst: "To ulike spørsmål", anker: "to" },
      { tekst: "Hva som må avklares", anker: "avklares" },
      { tekst: "Ett moment verdt å ta med", anker: "moment" },
    ],
    innhold: [
      {
        type: "merknad",
        tekst:
          "Dette er rubrikken det er farligst å la en modell skrive ferdig. Et standpunkt om AI er en posisjonering, og posisjoneringer tas av Reflektor — ikke av verktøyet som skriver dem ned.",
      },
      { type: "seksjon", id: "to", tittel: "To spørsmål" },
      {
        type: "avsnitt",
        tekst:
          "«Bruker dere AI?» er et spørsmål om håndverk. «Trenger vi dere når det finnes AI?» er et spørsmål om verdi. De krever hvert sitt svar, og begge svarene bør være like hver gang spørsmålet stilles.",
      },
      { type: "seksjon", id: "avklares", tittel: "Hva som må avklares" },
      {
        type: "punkter",
        punkter: [
          "Hvor går grensen for oss — teksting, klipping, manusforslag, generert bilde og video?",
          "Skal kunden opplyses når et verktøy er brukt, og i så fall hvordan?",
          "Hva gjør vi hvis en kunde BER om generert innhold?",
          "Hva krever plattformene av merking, og hva krever norsk markedsføringsrett?",
        ],
      },
      { type: "seksjon", id: "moment", tittel: "Ett moment" },
      {
        type: "avsnitt",
        tekst:
          "Det vi selger er at noen faktisk møter opp hos kunden én dag i måneden og filmer virkeligheten deres. Det er den delen av leveransen som ikke har en generert variant — og det er verdt å ha med i vurderingen når standpunktet skal landes.",
      },
    ],
  },
];
