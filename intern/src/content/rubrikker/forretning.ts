import type { Rubrikk } from "../rubrikktype.ts";

/**
 * Forretningsforståelse.
 *
 * Tallene her er HENTET fra `tilbud` i hovedprosjektets site.ts, ikke
 * konstruert. Der en rubrikk regner videre på dem, står regnestykket åpent
 * så leseren kan etterprøve det — og så ingen tror at et anslag er en
 * bokført kostnad.
 */
export const FORRETNING: readonly Rubrikk[] = [
  {
    slug: "hvordan-reflektor-tjener-penger",
    nr: 7,
    tittel: "Hvordan Reflektor tjener penger",
    sammendrag:
      "Modellen er enkel nok til å forklares på to minutter, og den forklarer nesten alle valgene vi tar. Her er den.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/kontor",
      alt: "Nærbilde av en person i strikkegenser, filmet i dempet lys",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 100,
    oppsummering: [
      { tekst: "Abonnement, ikke prosjekt", anker: "abonnement" },
      { tekst: "Hvorfor én produksjonsdag er hele nøkkelen", anker: "dagen" },
      { tekst: "Hva som skjer når en kunde slutter", anker: "slutter" },
      { tekst: "Hvorfor vi ikke jager nye kunder først", anker: "jager" },
    ],
    innhold: [
      {
        type: "seksjon",
        id: "abonnement",
        tittel: "Abonnement, ikke prosjekt",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor selger 30 000 kr/mnd for én produksjonsdag, 8–10 ferdige videoer og publisering to ganger i uken. Det er en abonnementsmodell, ikke en prosjektmodell — og forskjellen er større enn den ser ut.",
      },
      {
        type: "avsnitt",
        tekst:
          "I en prosjektmodell starter du på null hver måned og må selge på nytt. I en abonnementsmodell vet du hva neste måned bringer, så lenge ingen slutter. Det gjør inntekten forutsigbar, og forutsigbar inntekt er det som gjør at vi kan ansette folk og si nei til feil oppdrag.",
      },
      { type: "seksjon", id: "dagen", tittel: "Produksjonsdagen er nøkkelen" },
      {
        type: "avsnitt",
        tekst:
          "Modellen står og faller på at én dag hos kunden gir en hel måned med innhold. Klarer vi det, går regnestykket opp. Må vi tilbake to ganger for å levere det samme, er marginen borte — uten at kunden betaler noe mer.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er derfor planleggingen er så viktig, og hvorfor «vi tar det på dagen» er dyrere enn det høres ut. Hver ekstra reise spiser av det som skal betale lønn.",
      },
      { type: "seksjon", id: "slutter", tittel: "Når en kunde slutter" },
      {
        type: "avsnitt",
        tekst:
          "En kunde som sier opp, tar med seg 30 000 kr i måneden. Oppsigelsestiden er tre måneder, så tapet er kjent en stund i forveien — men det er tapt uansett med mindre noen erstatter dem.",
      },
      {
        type: "avsnitt",
        tekst:
          "Å skaffe en ny kunde koster tid i salg, møter, oppstart og en periode der vi lærer bedriften å kjenne. Å beholde en eksisterende koster en melding i uka og et godt forslag i måneden. Det er hele begrunnelsen for mål nummer én.",
      },
      {
        type: "seksjon",
        id: "jager",
        tittel: "Derfor jager vi ikke nye først",
      },
      {
        type: "avsnitt",
        tekst:
          "Et byrå som mister like mange kunder som det skaffer, står stille uansett hvor mye det selger. Vekst kommer av differansen, ikke av tilgangen. Derfor er «at faste kunder aldri sier opp» det første målet, og ikke en hyggelig tilleggsambisjon.",
      },
      {
        type: "merknad",
        tekst:
          "Tallene her er hentet fra det som står åpent på nettsiden. Det som ikke står der — faktiske marginer, lønnskostnader og hvor mange kunder vi har — gjengis ikke her. Spør Pål hvis du vil vite mer.",
      },
    ],
    kilder: [
      {
        tittel: "Reflektor: pris og leveranse, slik den står på nettsiden",
        url: "https://www.reflektor.no/sosiale-medier-byra",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "hva-du-faktisk-paavirker",
    nr: 8,
    tittel: "Hva du faktisk påvirker",
    sammendrag:
      "Det er lett å tro at forretningen er noe andre styrer. Her er de fire tingene hver enkelt av oss påvirker, uke for uke.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/goretex2-vegg",
      alt: "Hånd som knytter en skolisse på en sko",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 90,
    oppsummering: [
      { tekst: "Fire ting du avgjør selv", anker: "fire" },
      { tekst: "Den ene som betyr mest", anker: "mest" },
      {
        tekst: "Det du ikke påvirker, og som du kan slippe å bekymre deg for",
        anker: "ikke",
      },
    ],
    innhold: [
      { type: "seksjon", id: "fire", tittel: "Fire ting" },
      {
        type: "punkter",
        punkter: [
          "Om produksjonsdagen gir nok materiale, avgjøres av deg som er der. Går dagen i vasken, må noen tilbake, og da forsvinner marginen på den kunden.",
          "Om kunden føler seg sett mellom dagene, avgjøres av hvem som tar kontakt. Det er her oppsigelser starter, lenge før noen sier noe.",
          "Om innholdet holder standard, ser kunden med en gang. Den dårligste videoen setter nivået i hodet deres.",
          "Om rytmen holder, er synlig for alle. Et hull i feeden er det tydeligste tegnet på at noe ikke fungerer.",
        ],
      },
      { type: "seksjon", id: "mest", tittel: "Den som betyr mest" },
      {
        type: "avsnitt",
        tekst:
          "Det er nummer to som betyr mest. En kunde tåler en svakere måned med innhold hvis de opplever at noen følger med. De tåler ikke en god måned der de aldri hørte fra oss, for da vet de ikke at den var god.",
      },
      { type: "seksjon", id: "ikke", tittel: "Det du ikke påvirker" },
      {
        type: "avsnitt",
        tekst:
          "Rekkevidde, algoritmer og om en enkelt post plutselig går bra eller dårlig, ligger utenfor det du styrer. Det er verdt å si høyt, fordi det er lett å ta det personlig når tallene svinger.",
      },
      {
        type: "avsnitt",
        tekst:
          "Jobben vår er å gjøre det som øker sannsynligheten, konsekvent, over tid. Resten er utenfor, og å bekymre seg for det tar energi fra de fire tingene over.",
      },
    ],
  },

  {
    slug: "hvorfor-fast-pris",
    nr: 9,
    tittel: "Hvorfor vi har fast pris",
    sammendrag:
      "Vi har ingen timepriser, ingen etterfakturering og ingen tillegg for ekstra runder. Det er en posisjonering, og den har konsekvenser for hvordan vi jobber.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/kafe1-1600",
      alt: "Produktstilling med flasker på en farget bakgrunn",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 80,
    oppsummering: [
      { tekst: "Hva fast pris gjør for kunden", anker: "kunden" },
      { tekst: "Hva det krever av oss", anker: "oss" },
      {
        tekst: "Hva du sier når noen ber om «bare én ting til»",
        anker: "en-ting-til",
      },
    ],
    innhold: [
      { type: "seksjon", id: "kunden", tittel: "Hva det gjør for kunden" },
      {
        type: "avsnitt",
        tekst:
          "Bransjen er full av byråer som ikke oppgir pris. For en kunde betyr det usikkerhet i hver eneste henvendelse: koster det noe å ringe? Blir dette en tilleggsfaktura? Fast pris fjerner den usikkerheten, og det er derfor det virker som salgsargument.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det betyr også at kunden tør å be om ting. Det er en fordel: en kunde som spør, er en kunde som er engasjert.",
      },
      { type: "seksjon", id: "oss", tittel: "Hva det krever av oss" },
      {
        type: "avsnitt",
        tekst:
          "Når prisen er fast, er tid vår risiko. En dag som går dårlig, en ekstra runde med endringer, en reise til — alt det betaler vi selv. Det er ikke urettferdig; det er prisen for forutsigbarheten kunden kjøper.",
      },
      {
        type: "avsnitt",
        tekst:
          "Konsekvensen er at god planlegging ikke er en dyd her. Det er forretningsmodellen.",
      },
      { type: "seksjon", id: "en-ting-til", tittel: "«Bare én ting til»" },
      {
        type: "avsnitt",
        tekst:
          "Små ekstraønsker er normale og stort sett hyggelige. De blir et problem når de blir mange, eller når de vokser til noe som er en egen leveranse — en reklamefilm, en fotosesjon, en ny kanal.",
      },
      {
        type: "avsnitt",
        tekst:
          "Grensen går ved om det kan gjøres på den produksjonsdagen vi uansett er der. Kan det gjøres da, gjør vi det gjerne. Kan det ikke det, er det en ekstra produksjonsdag, og den har en egen pris. Si det vennlig og tidlig, så det ikke blir en overraskelse på fakturaen.",
      },
      {
        type: "merknad",
        tekst:
          "Er du usikker på om noe er innenfor: spør før du lover. Et «jeg sjekker og kommer tilbake i dag» er alltid et gyldig svar.",
      },
    ],
  },

  {
    slug: "hva-en-produksjonsdag-egentlig-koster",
    nr: 10,
    tittel: "Hva en produksjonsdag egentlig koster",
    sammendrag:
      "Ikke i kroner, for de tallene hører ikke hjemme her. Men i det som faktisk brukes opp: tid, oppmerksomhet og kundens tålmodighet.",
    kategori: "posisjon",
    status: "gjennomgang",
    medie: {
      type: "bilde",
      fil: "arbeid/dag4-vegg",
      alt: "To personer i arbeid ved en utsalgsluke",
    },
    oppdatert: "2026-09-21",
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 68,
    oppsummering: [
      { tekst: "Tre ting som brukes opp på en dag", anker: "tre" },
      { tekst: "Hvor tiden faktisk går", anker: "tid" },
      { tekst: "Den dyreste timen på dagen", anker: "dyrest" },
    ],
    innhold: [
      { type: "seksjon", id: "tre", tittel: "Tre ting brukes opp" },
      {
        type: "punkter",
        punkter: [
          "Vår tid går med til planlegging, reise, opptak, redigering og publisering.",
          "Kundens tid går med fordi folk stiller opp for oss i stedet for å gjøre jobben sin.",
          "Kundens tålmodighet er en begrenset ressurs, og den brukes opp raskere enn man tror.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Den tredje er den vi oftest glemmer å regne med, og den eneste som ikke fylles opp igjen av seg selv.",
      },
      { type: "seksjon", id: "tid", tittel: "Hvor tiden går" },
      {
        type: "avsnitt",
        tekst:
          "Selve opptakene er sjelden det som tar tid. Rigg, flytting, venting på folk og venting på at lokalet skal bli ledig er det som spiser dagen. Det er derfor planlegging etter oppsett — og ikke etter video — er det enkeltgrepet som gir mest.",
      },
      { type: "seksjon", id: "dyrest", tittel: "Den dyreste timen" },
      {
        type: "avsnitt",
        tekst:
          "Den første. Går riggen tregt, eller viser det seg at noe ikke er avklart, forskyver det alt etterpå — og det er alltid det siste oppsettet som ryker. Det siste oppsettet er ofte det med kundens viktigste innhold, fordi vi sparte det til sist.",
      },
      {
        type: "merknad",
        tekst:
          "Legg det viktigste oppsettet tidlig, ikke sist. Da er det i boks når noe går galt, og det går alltid galt til slutt.",
      },
    ],
  },
];
