import type { Rubrikk } from "../rubrikktype.ts";

/**
 * Folk og fag.
 *
 * Denne kategorien handler om hvordan man blir god her, hvordan man hjelper
 * andre å bli det, og hva som holder folk gående over tid. Den er skrevet
 * mot etablert forskning der den finnes — særlig på onboarding og på
 * motivasjon — fordi det er et felt med usedvanlig mye synsing i omløp.
 */
export const FOLK: readonly Rubrikk[] = [
  {
    slug: "hva-som-holder-folk-gaende",
    tittel: "Hva som faktisk holder folk gående",
    sammendrag:
      "Motivasjon er ikke et humør. Det er tre behov som enten blir dekket eller ikke — og alle tre kan påvirkes av hvordan vi jobber sammen.",
    kategori: "folk",
    medie: {
      type: "video",
      fil: "reels/produksjonsdag",
      alt: "Kamera rigget på stativ i en døråpning under en produksjonsdag",
    },
    oppdatert: "2026-09-21",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 100,
    oppsummering: [
      { tekst: "Tre behov, ikke ett humør", anker: "tre" },
      { tekst: "Selvbestemmelse: å eie sine egne valg", anker: "autonomi" },
      { tekst: "Mestring: å bli merkbart bedre", anker: "mestring" },
      { tekst: "Tilhørighet: å bety noe for noen her", anker: "tilhorighet" },
      { tekst: "Hva du kan gjøre for en kollega i dag", anker: "gjor" },
    ],
    innhold: [
      { type: "seksjon", id: "tre", tittel: "Tre behov" },
      {
        type: "avsnitt",
        tekst:
          "Den mest solide forskningen vi har på motivasjon i arbeidslivet peker på tre psykologiske behov: selvbestemmelse, mestring og tilhørighet. Blir de dekket, holder folk seg gående av seg selv. Blir de frustrert, hjelper verken bonus eller pizza særlig lenge.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er ikke en trivselsteori. Det er en av de best dokumenterte modellene i arbeidspsykologi, og den er nyttig her fordi den gjør motivasjon til noe konkret — tre ting som kan sjekkes, ikke en stemning man håper på.",
      },
      { type: "seksjon", id: "autonomi", tittel: "Selvbestemmelse" },
      {
        type: "avsnitt",
        tekst:
          "Å oppleve at det du gjør er ditt eget valg, ikke bare noe du ble bedt om. I praksis handler det sjelden om å bestemme alt — det handler om å forstå hvorfor, og å ha reell innflytelse på hvordan.",
      },
      {
        type: "avsnitt",
        tekst:
          "Konkret her: en produsent som får vite hva videoen skal oppnå, tar bedre valg på lokasjon enn en som får en liste med opptak. Samme jobb, helt ulik opplevelse av den.",
      },
      { type: "seksjon", id: "mestring", tittel: "Mestring" },
      {
        type: "avsnitt",
        tekst:
          "Å bli merkbart bedre på noe som er vanskelig nok til å telle. Dette er den som ryker først i en travel hverdag: man gjør det man allerede kan, fordi det går fortest, og etter et år har man gjort det samme tolv ganger i stedet for å ha blitt bedre tolv ganger.",
      },
      {
        type: "avsnitt",
        tekst:
          "Motgiften er billig: én ny ting per produksjonsdag. En åpningstype du ikke har prøvd, en lyssetting du ikke er trygg på, et intervju du vanligvis lar en annen ta.",
      },
      { type: "seksjon", id: "tilhorighet", tittel: "Tilhørighet" },
      {
        type: "avsnitt",
        tekst:
          "Å bety noe for folkene rundt seg. I et lite selskap der mye av arbeidet skjer ute hos kunder, er dette det letteste å miste uten at noen merker det. Man drar hjem fra en lokasjon, redigerer alene, og ser kolleger i forbifarten.",
      },
      { type: "seksjon", id: "gjor", tittel: "Hva du kan gjøre i dag" },
      {
        type: "punkter",
        punkter: [
          "Si til en kollega hva som var bra i noe de lagde — spesifikt, ikke «fin video».",
          "Forklar hvorfor, ikke bare hva, neste gang du ber noen om noe.",
          "Spør en du jobber med hva de vil bli bedre på, og gi dem en oppgave som krever det.",
          "Del noe som ikke gikk bra, og hva du lærte. Det gjør det trygt for andre å gjøre det samme.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Det siste punktet er det som betyr mest og koster mest. Et miljø der bare suksesser deles, er et miljø der alle tror de er de eneste som bommer.",
      },
    ],
    kilder: [
      {
        tittel:
          "American Psychological Association: Self-determination theory — a quarter century of human motivation research",
        url: "https://www.apa.org/research-practice/conduct-research/self-determination-theory",
        sjekket: "2026-09-21",
      },
      {
        tittel:
          "Hagger et al. (2026): Self-Determination Theory and Workplace Outcomes — A Meta-Analysis, Stress and Health",
        url: "https://onlinelibrary.wiley.com/doi/10.1002/smi.70151",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "forste-nitti-dager",
    tittel: "De første nitti dagene",
    sammendrag:
      "Hvordan vi tar imot en ny kollega avgjør hvor fort de blir gode, og om de blir værende. Forskningen er tydelig på hva som virker.",
    kategori: "folk",
    medie: {
      type: "bilde",
      fil: "arbeid/dag1-1600",
      alt: "Nærbilde av desserter på et brett",
    },
    oppdatert: "2026-09-21",
    lesetid: 6,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 92,
    oppsummering: [
      { tekst: "Hva forskningen peker på", anker: "forskning" },
      { tekst: "Fire ting en ny person trenger", anker: "fire" },
      { tekst: "Uke for uke", anker: "uker" },
      { tekst: "Den vanligste feilen: å kaste dem ut i det", anker: "feil" },
    ],
    innhold: [
      { type: "seksjon", id: "forskning", tittel: "Hva forskningen peker på" },
      {
        type: "avsnitt",
        tekst:
          "En systematisk gjennomgang av forskning på onboarding fant at strukturert og støttet opplæring i selve jobben er den enkeltstrategien med sterkest dokumentert effekt. Ikke kurs, ikke håndbøker — å gjøre jobben sammen med noen som kan den, med struktur rundt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Et mye brukt rammeverk deler onboarding i fire: det formelle, avklaring av rollen, kulturen, og kontakten med folk. De tre siste er de som oftest blir hoppet over, fordi bare det formelle har en sjekkliste.",
      },
      { type: "seksjon", id: "fire", tittel: "Fire ting de trenger" },
      {
        type: "tabell",
        kolonner: ["Hva", "Spørsmålet de har", "Hvem svarer"],
        rader: [
          [
            "Det formelle",
            "Hvor får jeg utstyr, tilganger, kontrakt?",
            "Daglig leder, første dag",
          ],
          [
            "Rollen",
            "Hva er min jobb, og hva er ikke min jobb?",
            "Nærmeste fagperson, første uke",
          ],
          [
            "Kulturen",
            "Hvordan gjør vi ting her egentlig?",
            "Alle, hele tiden — og derfor det letteste å rote til",
          ],
          [
            "Folkene",
            "Hvem kan jeg spørre om hva?",
            "Fadder, gjennom hele perioden",
          ],
        ],
      },
      { type: "seksjon", id: "uker", tittel: "Uke for uke" },
      {
        type: "steg",
        steg: [
          {
            tittel: "Uke 1 — Se på",
            tekst:
              "Bli med på en produksjonsdag uten ansvar. Målet er å se hvordan en dag faktisk ser ut, ikke å bidra.",
          },
          {
            tittel: "Uke 2–4 — Gjør en del",
            tekst:
              "Ta ansvar for én avgrenset ting per dag — lyd, dekningsbilder, ett oppsett. Med noen ved siden av.",
          },
          {
            tittel: "Uke 5–8 — Gjør det meste, med gjennomgang",
            tekst:
              "Kjør egne oppsett, og gå gjennom materialet sammen med en erfaren etterpå. Gjennomgangen er der læringen skjer.",
          },
          {
            tittel: "Uke 9–12 — Egen dag",
            tekst:
              "Egen produksjonsdag hos en kunde som ikke er den vanskeligste. Med noen tilgjengelig på telefon.",
          },
        ],
      },
      { type: "seksjon", id: "feil", tittel: "Den vanligste feilen" },
      {
        type: "avsnitt",
        tekst:
          "Å sende noen ut alene i uke to fordi det er travelt. Det føles effektivt og er det motsatte: personen bruker tre måneder på å avlære ting ingen fortalte dem, og kunden får en dårligere dag i mellomtiden.",
      },
      {
        type: "merknad",
        tekst:
          "Sett av en fadder ved navn, ikke «spør hvem som helst». Uten et navn spør folk ingen.",
      },
    ],
    kilder: [
      {
        tittel:
          "PLOS One: Effectiveness of formal onboarding for facilitating organizational socialization — a systematic review",
        url: "https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0281823",
        sjekket: "2026-09-21",
      },
    ],
  },

  {
    slug: "tilbakemelding-som-virker",
    tittel: "Tilbakemelding som virker",
    sammendrag:
      "«Fin video» hjelper ingen. Slik gir du en tilbakemelding som faktisk gjør neste jobb bedre — og slik tar du imot en.",
    kategori: "folk",
    medie: {
      type: "bilde",
      fil: "arbeid/portrett-vegg",
      alt: "Portrett av en person utendørs i dagslys",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 86,
    oppsummering: [
      { tekst: "Pek på handlingen, ikke på personen", anker: "handling" },
      { tekst: "Tre deler som gjør den brukbar", anker: "deler" },
      { tekst: "Når den skal gis", anker: "naar" },
      { tekst: "Hvordan du tar imot", anker: "imot" },
    ],
    innhold: [
      { type: "seksjon", id: "handling", tittel: "Handlingen, ikke personen" },
      {
        type: "avsnitt",
        tekst:
          "«Du er slurvete med lyd» er en dom over en person. «Mikrofonen sto på kameraet i det intervjuet, og derfor ble stemmen tynn» er en observasjon om en handling. Den første gjør folk defensive, den andre gjør dem bedre.",
      },
      { type: "seksjon", id: "deler", tittel: "Tre deler" },
      {
        type: "steg",
        steg: [
          {
            tittel: "1 — Hva du så",
            tekst: "Konkret og etterprøvbart. Noe den andre også kan se.",
          },
          {
            tittel: "2 — Hva konsekvensen ble",
            tekst:
              "Hvorfor det betydde noe. Uten dette høres det ut som en smakssak.",
          },
          {
            tittel: "3 — Hva du ville gjort",
            tekst:
              "Et alternativ, ikke bare en feil. Ellers har du beskrevet et problem og overlatt løsningen til den som allerede ikke fant den.",
          },
        ],
      },
      { type: "seksjon", id: "naar", tittel: "Når" },
      {
        type: "avsnitt",
        tekst:
          "Så nær hendelsen som mulig, og aldri foran kunden. En tilbakemelding som kommer i medarbeidersamtalen tre måneder senere, er ikke en tilbakemelding — det er en anklage med lang oppbevaringstid.",
      },
      { type: "seksjon", id: "imot", tittel: "Å ta imot" },
      {
        type: "avsnitt",
        tekst:
          "Første impuls er å forklare hvorfor det ble som det ble. Hold den tilbake i ti sekunder og still ett spørsmål i stedet: «Hva ville du gjort?» Da får du noe å bruke, i stedet for en diskusjon om hvem som har rett.",
      },
      {
        type: "merknad",
        tekst:
          "Du trenger ikke være enig. Du trenger å ha forstått hva som ble sagt før du bestemmer deg for om du er enig.",
      },
    ],
  },

  {
    slug: "bli-bedre-med-vilje",
    tittel: "Å bli bedre med vilje",
    sammendrag:
      "Erfaring alene gjør deg ikke bedre — den gjør deg raskere på det du allerede gjør. Slik bruker du jobben til faktisk å utvikle deg.",
    kategori: "folk",
    medie: {
      type: "video",
      fil: "reels/goretex",
      alt: "Sko i bevegelse over skogbunn, filmet lavt",
    },
    oppdatert: "2026-09-21",
    lesetid: 5,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 78,
    oppsummering: [
      { tekst: "Hvorfor ti år kan bli ett år ti ganger", anker: "ti-aar" },
      { tekst: "Én ting per produksjonsdag", anker: "en-ting" },
      { tekst: "Se på ditt eget materiale som en fremmed", anker: "fremmed" },
      { tekst: "Stjel systematisk", anker: "stjel" },
    ],
    innhold: [
      { type: "seksjon", id: "ti-aar", tittel: "Ett år, ti ganger" },
      {
        type: "avsnitt",
        tekst:
          "Det er fullt mulig å jobbe ti år med video og bli marginalt bedre. Det skjer når man gjør det man allerede kan, hver gang, fordi det er raskest og tryggest. Erfaring gir da hastighet, ikke dybde.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det som faktisk utvikler folk, er å jobbe litt over evne, med tilbakemelding, gjentatte ganger. Det er ubehagelig, og det er grunnen til at de fleste ikke gjør det uten at noen legger til rette for det.",
      },
      { type: "seksjon", id: "en-ting", tittel: "Én ting per dag" },
      {
        type: "avsnitt",
        tekst:
          "Velg én ting før hver produksjonsdag som du ikke er trygg på, og gjør den med vilje. Ikke fem. Én ting gir deg noe å legge merke til; fem gir deg en dårlig dag og ingen læring.",
      },
      {
        type: "punkter",
        punkter: [
          "Et intervju du vanligvis lar noen andre ta",
          "En lyssetting du pleier å unngå fordi den tar tid",
          "En åpningstype du aldri har prøvd",
          "Å klippe en video uten musikk, og se om den holder",
        ],
      },
      { type: "seksjon", id: "fremmed", tittel: "Se på det som en fremmed" },
      {
        type: "avsnitt",
        tekst:
          "Åpne noe du lagde for tre måneder siden og se på det uten å huske hvorfor valgene ble tatt. Det er den billigste kvalitetskontrollen som finnes, og den eneste måten å oppdage vaner du ikke visste du hadde.",
      },
      { type: "seksjon", id: "stjel", tittel: "Stjel systematisk" },
      {
        type: "avsnitt",
        tekst:
          "Når du ser noe som virker — en overgang, en åpning, en måte å ramme inn et ansikt på — så ikke bare beundre det. Finn ut hva som gjør at det virker, og prøv det innen to uker. En idé du ikke har prøvd, er ikke lært.",
      },
    ],
  },

  {
    slug: "stolthet-og-standard",
    tittel: "Stolthet og standard",
    sammendrag:
      "Hva som skiller noe som er godt nok fra noe vi vil sette navnet vårt på — og hvorfor den forskjellen er verdt tiden den koster.",
    kategori: "folk",
    medie: {
      type: "bilde",
      fil: "arbeid/mat1-1600",
      alt: "Fire personer i arbeidstøy samlet i et produksjonslokale",
    },
    oppdatert: "2026-09-21",
    lesetid: 4,
    godkjent: false,
    ansvarlig: "Daglig leder",
    prioritet: 72,
    oppsummering: [
      {
        tekst: "Standarden er den dårligste vi slipper gjennom",
        anker: "standard",
      },
      { tekst: "Fem ting som aldri går ut", anker: "aldri" },
      { tekst: "Når godt nok faktisk er godt nok", anker: "godt-nok" },
    ],
    innhold: [
      {
        type: "seksjon",
        id: "standard",
        tittel: "Standarden er den dårligste",
      },
      {
        type: "avsnitt",
        tekst:
          "En bedrifts kvalitetsnivå er ikke det beste den har levert. Det er det dårligste den har sluppet gjennom. Kunden husker ikke snittet — de husker den ene videoen som var uskarp, og de lurer på om neste blir sånn.",
      },
      { type: "seksjon", id: "aldri", tittel: "Fem ting som aldri går ut" },
      {
        type: "sjekkliste",
        tittel: "Uansett tidspress",
        punkter: [
          "Uskarpt hovedmotiv",
          "Lyd med romklang eller støy som kunne vært unngått",
          "Feilstavet tekst eller feil navn",
          "Video som er beskåret feil så noe viktig er borte",
          "Innhold som viser noe kunden ikke ville vist — rot, tomme lokaler, ansatte som ikke vet de er med",
        ],
      },
      { type: "seksjon", id: "godt-nok", tittel: "Når godt nok er godt nok" },
      {
        type: "avsnitt",
        tekst:
          "Det finnes også en motsatt felle. Å bruke to timer ekstra på en video ingen ser forskjell på, mens køen tømmes og rytmen ryker, er ikke høy standard — det er dårlig prioritering.",
      },
      {
        type: "avsnitt",
        tekst:
          "Skillet er enkelt: kvalitet som seeren merker, er verdt tid. Kvalitet bare vi merker, er verdt lite. Listen over er det seeren merker.",
      },
      {
        type: "sitat",
        tekst:
          "Det som gjør at en kunde blir, er sjelden den beste videoen. Det er at det aldri kommer en dårlig en.",
        kilde: "Utkast — til diskusjon",
      },
    ],
  },

  {
    slug: "naar-du-star-fast",
    tittel: "Når du står fast",
    sammendrag:
      "Alle står fast. Det som skiller folk er hvor lenge de blir stående før de spør. Her er når og hvordan.",
    kategori: "folk",
    medie: {
      type: "bilde",
      fil: "arbeid/kafe2-vegg",
      alt: "Person i rosa hettegenser utendørs med armene hevet",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Produsent",
    prioritet: 64,
    oppsummering: [
      { tekst: "Tjue minutter, så spør", anker: "tjue" },
      { tekst: "Slik spør du så du får et svar", anker: "hvordan" },
      { tekst: "Er du på lokasjon: ring", anker: "lokasjon" },
    ],
    innhold: [
      { type: "seksjon", id: "tjue", tittel: "Tjue minutter" },
      {
        type: "avsnitt",
        tekst:
          "En brukbar regel: prøv selv i tjue minutter, så spør. Kortere, og du lærer ingenting. Lenger, og du bruker en time av din tid på noe en kollega løser på to minutter — og det er ikke gjerrig, det er bare dyrt.",
      },
      { type: "seksjon", id: "hvordan", tittel: "Hvordan du spør" },
      {
        type: "avsnitt",
        tekst:
          "Si hva du prøver å oppnå, hva du har prøvd, og hva som skjedde. Tre setninger. «Får ikke til lyden» krever tre spørsmål tilbake før noen kan hjelpe; «prøver å få ren lyd i et lokale med ventilasjon, har flyttet mikrofonen nærmere, fortsatt brumming» kan besvares med en gang.",
      },
      { type: "seksjon", id: "lokasjon", tittel: "På lokasjon: ring" },
      {
        type: "avsnitt",
        tekst:
          "Står du hos en kunde og noe er galt, ring. Ikke send melding og vent. Tiden er dyrere der enn noe annet sted, og en kunde som ser at du løser det raskt, opplever det som kompetanse — ikke som et problem.",
      },
      {
        type: "merknad",
        tekst:
          "Det er alltid greit å ringe. Ingen her kommer til å synes at du forstyrret.",
      },
    ],
  },
];
