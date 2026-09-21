import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Markedsnyheter. Hva som skjer utenfor huset.
 *
 * DENNE KATEGORIEN ER DEN MEST UTSATTE FOR PÅFUNN, og utkastene her er
 * skrevet med det for øye. En «markedsnyhet» er i praksis en påstand om
 * verden — hva en plattform har endret, hva bransjen gjør, hva kunder mener.
 * Slike påstander kan ikke skrives av en modell uten kilde; de kan bare
 * hentes.
 *
 * Derfor inneholder rubrikkene her RAMMEN og SPØRSMÅLENE, ikke svarene.
 * De er strukturen som skal fylles med noe noen faktisk har sjekket.
 */
export const MARKED: readonly Rubrikk[] = [
  {
    slug: "endringer-pa-plattformene",
    tittel: "Endringer på Instagram og Facebook",
    sammendrag:
      "Utkast: plattformene endrer formater og anbefalinger flere ganger i året. Rutinen for å fange opp endringer før en kunde spør.",
    kategori: "marked",
    medie: {
      type: "video",
      fil: "arbeid/kakao",
      alt: "Mørk drikke som helles i et glass",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 54,
    innhold: [
      {
        type: "merknad",
        tekst:
          "Denne rubrikken inneholder med hensikt ingen konkrete plattformfakta. Slike tall og regler er ferskvare, og en gjengivelse skrevet uten kilde vil være feil før den er lest. Den beskriver rutinen for å holde dem riktige.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det som endrer seg og som faktisk påvirker leveransen vår, er ganske få ting: anbefalt oppløsning og lengde, hvordan grensesnittet dekker bildet, hva som kan krysspubliseres automatisk, og hvordan innhold merkes.",
      },
      {
        type: "sjekkliste",
        tittel: "Når noe ser ut til å ha endret seg",
        punkter: [
          "Sjekk plattformens egen dokumentasjon, ikke en bransjeartikkel om den.",
          "Verifiser på en ekte konto før det formidles videre.",
          "Noter dato for når det ble sjekket. Uten dato er informasjonen verdiløs om tre måneder.",
          "Oppdater rubrikken om eksport eller teksting hvis endringen berører dem.",
          "Si fra til kundeansvarlige før kundene oppdager det selv.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det siste punktet er det som gjør dette til en markedsnyhet og ikke en teknisk detalj: å fortelle kunden om en endring før de spør, er proaktivitet i sin billigste form.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: hvem har ansvar for å følge med, og hvor ofte?",
      },
    ],
  },
  {
    slug: "hva-kunder-sporr-om",
    tittel: "Spørsmål kunder stiller — og hva vi svarer",
    sammendrag:
      "Utkast: rammen for et levende dokument. Samme spørsmål stilles av nye kunder igjen og igjen; svarene bør ikke improviseres hver gang.",
    kategori: "marked",
    medie: {
      type: "bilde",
      fil: "arbeid/stallen-1600",
      alt: "Et kjøkkenteam samlet rundt en rød bok",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 52,
    innhold: [
      {
        type: "merknad",
        tekst:
          "Svarene under er IKKE fylt ut. Å skrive hva Reflektor mener om pris, resultater eller konkurrenter uten at noen har sagt det, ville vært påfunn av akkurat den typen AGENTS.md forbyr. Rammen står; svarene må inn fra folk.",
      },
      {
        type: "avsnitt",
        tekst:
          "Nye kunder stiller i stor grad de samme spørsmålene. Et improvisert svar er sjelden galt, men det er sjelden helt likt forrige gang — og ulike svar fra ulike ansatte er det som gjør at en kunde begynner å lure.",
      },
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
      {
        type: "avsnitt",
        tekst:
          "To av dem har allerede et svar i huset: fri bruk av alt innhold står i leveransen, og at kommentarfelt ikke inngår står eksplisitt i hva som ikke inngår. Resten må besvares av noen som kan svare på vegne av Reflektor.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: fyll inn svarene, og sett godkjent når de er det. Dette er rubrikken som er mest verdt å få ferdig først.",
      },
    ],
  },
  {
    slug: "ai-i-innholdsproduksjon",
    tittel: "AI i innholdsproduksjon — hva vi sier til kunder",
    sammendrag:
      "Utkast: spørsmålet kommer i stadig flere møter. Rammen for et standpunkt Reflektor må ta selv — det kan ikke utledes.",
    kategori: "marked",
    medie: {
      type: "bilde",
      fil: "arbeid/spa",
      alt: "Hånd som slår an en gongong",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 50,
    innhold: [
      {
        type: "merknad",
        tekst:
          "Dette er den rubrikken det er farligst å la en modell skrive ferdig. Et standpunkt om AI er en posisjonering, og posisjoneringer tas av Reflektor — ikke av verktøyet som skriver dem ned.",
      },
      {
        type: "avsnitt",
        tekst:
          "Spørsmålet kommer i to former: «bruker dere AI?» og «trenger vi dere når det finnes AI?». Det første er et spørsmål om håndverk, det andre om verdi. De krever ulike svar, og begge bør være like hver gang de stilles.",
      },
      {
        type: "punkter",
        punkter: [
          "Hvor går grensen for oss — teksting, klipping, manusforslag, generert bilde og video?",
          "Skal kunden opplyses når et verktøy er brukt, og i så fall hvordan?",
          "Hva er det vi gjør som ikke lar seg erstatte — og kan vi si det på én setning?",
          "Hva gjør vi hvis en kunde BER om generert innhold?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Ett moment som er verdt å ta med i vurderingen: det vi selger er at noen faktisk møter opp hos kunden én dag i måneden og filmer virkeligheten deres. Det er den delen av leveransen som ikke har en generert variant.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: Reflektor må lande standpunktet. Deretter kan denne rubrikken settes godkjent.",
      },
    ],
  },
];
