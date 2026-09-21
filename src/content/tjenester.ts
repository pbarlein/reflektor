import { site } from "./site";

/**
 * Tjenestesidene.
 *
 * STRUKTUREN ER BESTEMT AV AEO-RESEARCHEN, ikke av smak. Se
 * docs/synlighet-2026.md kapittel 3 for kildene. De fire funnene som
 * former hvert felt her:
 *
 * 1. 44,2 % av alle LLM-siteringer hentes fra de første 30 % av en side
 *    (Search Engine Land); for Google AI Overviews 55 % (CXL). Derfor
 *    `svar` — et selvstendig svar på 40–60 ord rett under H1, før alt
 *    annet. Det er ikke en ingress. Det er svaret.
 *
 * 2. Spørsmålsformede H2-er, der hver seksjon er en SELVSTENDIG siterbar
 *    enhet. Et avsnitt som ikke gir mening løsrevet, blir ikke sitert.
 *
 * 3. Sitater gir +37 % synlighet, statistikk +22 % (Aggarwal et al.,
 *    «GEO», ACM KDD 2024, arXiv:2311.09735). Derfor `sitat` og tall der
 *    vi faktisk har dem.
 *
 * 4. FAQ-schema gir ca. +40 % siteringsvekt i ChatGPT. Derfor `faq` på
 *    hver side, ikke bare på /faq.
 *
 * ANTI-KANNIBALISERING: hver side har `avgrensning` — hva siden IKKE
 * dekker, med lenke dit det hører hjemme. Det gjør to jobber: leseren
 * havner riktig, og språkmodellen får et eksplisitt avgrensningssignal den
 * kan sitere. Se docs/sidearkitektur.md.
 *
 * TBD ER IKKE SLURV. Prosjektpriser, leveringstider og hvilke kunder som
 * har hatt tv-reklame spesifikt, finnes ikke verifisert noe sted i dette
 * repoet. AGENTS.md: «Ikke finn på copy, tall, kundenavn, priser eller
 * resultater.» Pål opphevet copy-protokollen for denne jobben, ikke
 * integritetsregelen. content:check fanger hver eneste en.
 */

export type Seksjon = {
  /** H2. Spørsmålsform der det er naturlig — det speiler hvordan folk spør. */
  sporsmal: string;
  /** Svaret, front-loaded. Første setning skal kunne stå alene. */
  svar: string;
  punkter?: string[];
  /** Sitat fra en navngitt kilde. +37 % siteringssannsynlighet. */
  sitat?: { tekst: string; navn: string; rolle: string };
};

export type Tjenesteside = {
  sti: string;
  tittel: string;
  beskrivelse: string;
  h1: string;
  /** 40–60 ord. Står rett under H1, før alt annet. */
  svar: string;
  /** schema.org serviceType. Må være unik per side. */
  tjenestetype: string;
  /** Merkelapp over H1. */
  merkelapp: string;
  avgrensning: {
    tekst: string;
    lenker: { sti: string; tekst: string }[];
  };
  seksjoner: Seksjon[];
  faq: { sporsmal: string; svar: string }[];
  /** Fra-pris som tekst, eller null når den ikke er oppgitt. */
  pris: string | null;
  /** Reels som skal vises. Filnavn fra src/content/reels.ts. */
  klipp?: string[];
};

const KONTAKT = { sti: "/#kontakt", tekst: "Få et forslag" };

/* ────────────────────────────────────────────────────────────────────
   /reklamefilm — filmen dere betaler for å få vist
   ──────────────────────────────────────────────────────────────────── */

export const reklamefilm: Tjenesteside = {
  sti: "/reklamefilm",
  tittel: "Reklamefilm | Produksjon for TV, nett og sosiale medier",
  beskrivelse:
    "Reflektor produserer reklamefilm for TV, nettannonser og sosiale medier. Vi lager filmen — vi kjøper ikke sendetid. Produksjon fra Oslo, for bedrifter i hele Norge.",
  h1: "Reklamefilm",
  merkelapp: "Produksjon",
  tjenestetype: "Produksjon av reklamefilm for betalte flater",
  svar: "En reklamefilm er laget for å vises mot betaling — på TV, som nettannonse eller i sosiale medier. Reflektor står for produksjonen: idé, manus, opptak, klipp, lyd og fargekorrigering. Vi produserer filmen. Vi kjøper ikke sendetid eller annonseplass.",
  avgrensning: {
    tekst:
      "Skal filmen ligge på deres egne flater — nettsiden, en tjenesteside eller en skjerm i butikk — er det videoproduksjon, ikke reklamefilm. Skal den brukes til rekruttering, er det employer branding. Forskjellen er ikke hvordan filmen ser ut, men hvor den vises.",
    lenker: [
      { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
      {
        sti: "/employer-branding-video-oslo",
        tekst: "film for rekruttering",
      },
    ],
  },
  seksjoner: [
    {
      sporsmal: "Kjøper dere sendetid på TV?",
      svar: "Nei. Reflektor er et produksjonshus, ikke et mediebyrå. Vi lager filmen, og dere eller mediebyrået deres kjøper flaten den skal vises på. Det er verdt å vite før dere ber om pris: et tilbud fra oss dekker produksjonen, ikke visningene. Spør man «hva koster tv-reklame», er svaret egentlig to regninger fra to leverandører.",
    },
    {
      sporsmal: "Hva koster en reklamefilm?",
      svar: "TBD(reklamefilm.pris — fra-pris for en produksjon, og hva som skiller en liten fra en stor)",
    },
    {
      sporsmal: "Hva skiller en reklamefilm fra en vanlig bedriftsvideo?",
      svar: "Hvem som ser den, og hvorfor. En reklamefilm vises for folk som ikke lette etter dere — den må fange oppmerksomhet den ikke har fått på forhånd, og den betales per visning. En bedriftsvideo på deres egen nettside møter noen som allerede er der og allerede er interessert. Det første krever en idé som stopper skrollingen. Det andre krever klarhet.",
      punkter: [
        "Reklamefilm: betalt flate, kort, må bryte gjennom",
        "Video på egne flater: gratis flate, kan være lengre, skal forklare",
      ],
    },
    {
      sporsmal: "Hvordan foregår en produksjon?",
      svar: "TBD(reklamefilm.prosess — de faktiske stegene fra forespørsel til levert film, med hvem som gjør hva)",
    },
    {
      sporsmal: "Hvem har Reflektor produsert for?",
      svar: "Reflektor har produsert foto og video for blant andre Anton Sport, The Well, Peppes Pizza, Egon og Baker Brun. TBD(reklamefilm.kunder — hvilke av disse, eller hvilke andre, som har hatt reklamefilm eller tv-reklame)",
    },
  ],
  faq: [
    {
      sporsmal: "Hvor lang bør en reklamefilm være?",
      svar: "Det avhenger av flaten. En TV-reklame kjøpes i faste lengder, oftest 15 eller 30 sekunder. En annonse i sosiale medier har ingen fast lengde, men de første to sekundene avgjør om resten blir sett. Vi klipper som regel filmen i flere lengder, slik at samme opptak dekker flere flater.",
    },
    {
      sporsmal: "Kan vi bruke filmen flere steder?",
      svar: "Ja. Alt innhold Reflektor produserer er deres, med fri bruk i annonser, på nettsider, skjermer og i presentasjoner. Det gjelder også råmaterialet som ikke kom med i den ferdige filmen.",
    },
    {
      sporsmal: "Trenger vi et manus før vi tar kontakt?",
      svar: "Nei. De fleste kommer med et mål, ikke et manus — «vi skal lansere noe», «vi skal inn på TV til høsten». Idé og manus er en del av produksjonen.",
    },
    {
      sporsmal: "Jobber dere utenfor Oslo?",
      svar: "Ja. Reflektor holder til i Oslo og produserer for bedrifter i hele Norge.",
    },
  ],
  pris: null,
  klipp: ["antonsport", "goretex"],
};

/* ────────────────────────────────────────────────────────────────────
   /videoproduksjon-i-oslo — filmen på flater kunden selv eier
   ──────────────────────────────────────────────────────────────────── */

export const videoproduksjon: Tjenesteside = {
  sti: "/videoproduksjon-i-oslo",
  tittel: "Videoproduksjon i Oslo | Film til nettside, skjerm og kanaler",
  beskrivelse:
    "Videoproduksjon for bedrifter: bannervideo til nettsiden, film til tjenestesider, innhold til skjermer og brand video. Reflektor produserer i Oslo, for hele Norge.",
  h1: "Videoproduksjon i Oslo",
  merkelapp: "Produksjon",
  tjenestetype: "Videoproduksjon for bedriftens egne flater",
  svar: "Videoproduksjon er film til flater dere selv eier: forsiden av nettsiden, en tjenesteside som trenger forklaring, skjermer i butikk eller resepsjon, og egne kanaler. Reflektor står for idé, opptak, klipp, teksting og fargekorrigering. Filmen koster ingenting å vise, fordi flaten er deres.",
  avgrensning: {
    tekst:
      "Skal dere betale for å få filmen vist — på TV eller som annonse — er det reklamefilm. Skal den brukes til å rekruttere, er det employer branding, og den har en egen side fordi den snakker til et annet publikum enn kundene deres.",
    lenker: [
      { sti: "/reklamefilm", tekst: "reklamefilm for betalte flater" },
      {
        sti: "/employer-branding-video-oslo",
        tekst: "film for rekruttering",
      },
    ],
  },
  seksjoner: [
    {
      sporsmal: "Hva slags video lager dere til egne flater?",
      svar: "Film som skal forklare, ikke fange. Den vanligste jobben er en kort bannervideo øverst på forsiden, film som viser hva en tjeneste faktisk innebærer, innhold til skjermer i lokalet, og brand video som forteller hvem selskapet er.",
      punkter: [
        "Bannervideo til forside og landingssider",
        "Film til tjenestesider — det som er vanskelig å forklare i tekst",
        "Innhold til skjermer i butikk, resepsjon og på messe",
        "Brand video om selskapet",
      ],
    },
    {
      sporsmal: "Hvorfor video på nettsiden i det hele tatt?",
      svar: "Fordi noen ting ikke lar seg skrive. Et rom, et håndverk, en maskin i bevegelse eller stemningen på et sted er raskere å vise enn å beskrive. Det som kan forklares i en setning, bør forklares i en setning — video på nettsider blir dyrt og dårlig når det brukes på noe tekst ville løst bedre.",
    },
    {
      sporsmal: "Hva koster videoproduksjon for bedrift?",
      svar: "TBD(videoproduksjon.pris — fra-pris for en produksjonsdag, og hva som påvirker den)",
    },
    {
      sporsmal: "Hvor mange filmer får vi ut av én dag?",
      svar: "Det avhenger av hvor mye som skal rigges om underveis. Til sammenligning er abonnementet vårt bygget på at én produksjonsdag gir 8–10 ferdige videoer — men da filmer vi løpende innhold, ikke fire ulike oppsett med lyssetting. TBD(videoproduksjon.antall — realistisk antall for en prosjektdag)",
    },
    {
      sporsmal: "Hvem produserer Reflektor for?",
      svar: "Anton Sport, The Well, Peppes Pizza, Egon, Baker Brun, Idun Industri, Selvaag, Retail24, Centropa, Happis og Soul Cake — innen retail, restaurant og mat, eiendom, finans og industri.",
      sitat: {
        tekst:
          "Vi liker spesielt godt hvordan de får alle til å føle seg avslappet, naturlig og finne seg til rette foran kamera, selv med lite modell-erfaring fra tidligere. De ser aldri begrensninger og heller muligheter uansett årstid eller lokasjon.",
        navn: "Axel Hauge",
        rolle: "Anton Sport",
      },
    },
  ],
  faq: [
    {
      sporsmal: "Kan vi bruke filmen i annonser senere?",
      svar: "Ja. Alt innhold Reflektor produserer er deres, med fri bruk i annonser, på nettsider, skjermer og i presentasjoner. En film laget til nettsiden kan brukes som annonse uten at dere må tilbake til oss for rettigheter.",
    },
    {
      sporsmal: "Tekster dere filmene?",
      svar: "Ja. De fleste ser film uten lyd første gang, særlig på mobil. Teksting og fargekorrigering er del av leveransen.",
    },
    {
      sporsmal: "Filmer dere hos oss eller i studio?",
      svar: "Som regel hos dere. Det er der folkene, produktene og lokalene er, og det er det som gjør filmen gjenkjennelig. Vi kan også filme hos oss eller på lokasjon når motivet krever det.",
    },
    {
      sporsmal: "Hvor lang tid tar det?",
      svar: "TBD(videoproduksjon.leveringstid — fra opptak til ferdig film)",
    },
  ],
  pris: null,
  klipp: ["thewell", "soulcake"],
};

/* ────────────────────────────────────────────────────────────────────
   /employer-branding-video-oslo — filmen som skal gjøre folk til søkere
   ──────────────────────────────────────────────────────────────────── */

export const employerBranding: Tjenesteside = {
  sti: "/employer-branding-video-oslo",
  tittel: "Employer branding-video | Film som gjør folk til søkere",
  beskrivelse:
    "Employer branding-video fra Reflektor: film til stillingsannonser, karriereside og rekrutteringskanaler. Produsert hos dere, med deres egne ansatte. Oslo og hele Norge.",
  h1: "Employer branding-video",
  merkelapp: "Produksjon",
  tjenestetype: "Produksjon av film for arbeidsgivermerkevare og rekruttering",
  svar: "Employer branding-video er film som skal få folk til å søke jobb hos dere. Den vises i stillingsannonser, på karrieresiden og i rekrutteringskanaler — ikke til kundene deres, men til dem dere vil ansette. Reflektor filmer hos dere, med de ansatte dere faktisk har.",
  avgrensning: {
    tekst:
      "Denne siden handler om filmen. Vil dere vite hva employer branding er som fagfelt, og hvorfor det virker, har vi skrevet om det i bloggen. Skal filmen selge til kunder i stedet for å rekruttere, er det videoproduksjon eller reklamefilm.",
    lenker: [
      {
        sti: "/blogg/hva-er-employer-branding",
        tekst: "hva employer branding er",
      },
      { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
    ],
  },
  seksjoner: [
    {
      sporsmal: "Hvorfor film, og ikke bare en god stillingsannonse?",
      svar: "Fordi kandidater velger et sted, ikke en tekst. En stillingsannonse kan beskrive oppgavene, men ikke lokalet, tempoet eller menneskene man skal sitte ved siden av. Det er det som avgjør om noen trykker «søk» — og det er nettopp det som lar seg vise, men ikke skrive.",
    },
    {
      sporsmal: "Hvem skal være med i filmen?",
      svar: "De som faktisk jobber der. Ikke skuespillere, og helst ikke bare ledelsen. En kandidat gjenkjenner en iscenesatt arbeidsplass umiddelbart, og da virker filmen mot sin hensikt. Vi filmer folk mens de gjør jobben sin.",
      sitat: {
        tekst:
          "Det som virkelig skiller dem ut, er hvor samarbeidsvillige og engasjerte de er. De stiller opp, byr på seg selv, og er rett og slett kjempefine folk man blir glad i.",
        navn: "Marion Ilona Heggland Skjørberg",
        rolle: "Baker Brun",
      },
    },
    {
      sporsmal: "Hva koster en employer branding-video?",
      svar: "TBD(employerbranding.pris — fra-pris, og hva som skiller en enkel fra en omfattende)",
    },
    {
      sporsmal: "Hvor skal filmen brukes?",
      svar: "Der kandidatene er. Stillingsannonsen er det åpenbare stedet, men karrieresiden, LinkedIn og onboarding av nyansatte bruker ofte det samme materialet. Én produksjonsdag dekker som regel alle tre, fordi det er samme opptak klippet i ulike lengder.",
      punkter: [
        "Stillingsannonser",
        "Karriereside",
        "LinkedIn og egne kanaler",
        "Onboarding av nyansatte",
      ],
    },
  ],
  faq: [
    {
      sporsmal: "Må de ansatte snakke til kamera?",
      svar: "Nei. Mange av de beste rekrutteringsfilmene har ingen som snakker — bare folk som jobber, og tekst som forklarer. Vi avtaler formen på forhånd, og ingen blir satt foran et kamera uten å vite om det.",
    },
    {
      sporsmal: "Kan vi bruke filmen etter at stillingen er besatt?",
      svar: "Ja. Innholdet er deres, med fri bruk. De fleste bruker filmen om igjen ved neste utlysning, og på karrieresiden i mellomtiden.",
    },
    {
      sporsmal: "Hvor lang bør en rekrutteringsfilm være?",
      svar: "Kort i annonsen, lengre på karrieresiden. I en stillingsannonse konkurrerer filmen med alt annet i feeden. På karrieresiden har kandidaten allerede bestemt seg for å se, og tåler mer.",
    },
  ],
  pris: null,
};

/* ────────────────────────────────────────────────────────────────────
   /eventfotograf-eventvideo — dokumentasjonen av noe som skjer én gang
   ──────────────────────────────────────────────────────────────────── */

export const event: Tjenesteside = {
  sti: "/eventfotograf-eventvideo",
  tittel: "Eventfotograf og eventvideo | Dekning av arrangementer",
  beskrivelse:
    "Eventfotograf og eventvideo fra Reflektor: foto og film fra konferanser, lanseringer, messer og firmaarrangementer. Materiale dere kan bruke i ettertid. Oslo og hele Norge.",
  h1: "Eventfotograf og eventvideo",
  merkelapp: "Produksjon",
  tjenestetype: "Foto- og videodekning av arrangementer",
  svar: "Eventdekning er foto og film fra noe som skjer én gang: en konferanse, en lansering, en messe eller et firmaarrangement. Jobben er å komme hjem med materiale dere kan bruke i ettertid — ikke bare bilder fra dagen, men innhold til kanalene og til neste gang dere skal invitere.",
  avgrensning: {
    tekst:
      "Dette er dekning av noe som skjer. Skal dere lage film om selskapet eller et produkt, planlagt fra bunnen, er det videoproduksjon. Skal den vises som betalt annonse, er det reklamefilm.",
    lenker: [
      { sti: "/videoproduksjon-i-oslo", tekst: "planlagt videoproduksjon" },
      { sti: "/reklamefilm", tekst: "reklamefilm" },
    ],
  },
  seksjoner: [
    {
      sporsmal: "Hva får dere igjen for å dokumentere et arrangement?",
      svar: "Materiale som lever lenger enn dagen. Bildene og klippene fra en konferanse er det som selger neste års konferanse, og de fyller kanalene i ukene etterpå. Et arrangement uten dekning er en investering som forsvinner samme kveld.",
    },
    {
      sporsmal: "Hva koster eventfotograf?",
      svar: "TBD(event.pris — fra-pris for en halv og en hel dag)",
    },
    {
      sporsmal: "Når får vi materialet?",
      svar: "TBD(event.leveringstid — og om det finnes en hurtigleveranse for bilder som skal ut samme kveld)",
    },
    {
      sporsmal: "Foto, film, eller begge deler?",
      svar: "De fleste arrangementer trenger begge. Bilder er raskest ut og enklest å bruke i mange kanaler; film fanger stemningen og taleren. På større arrangementer er det som regel to personer, fordi én ikke kan gjøre begge deler samtidig uten å gå glipp av noe.",
    },
  ],
  faq: [
    {
      sporsmal: "Dekker dere arrangementer utenfor Oslo?",
      svar: "Ja. Reflektor holder til i Oslo og jobber i hele Norge.",
    },
    {
      sporsmal: "Trenger dere en kjøreplan på forhånd?",
      svar: "Ja, i grove trekk. Vi trenger å vite når det som må dekkes faktisk skjer — talen, avdukingen, prisutdelingen. Resten løser seg i rommet.",
    },
    {
      sporsmal: "Kan vi bruke bildene i annonser?",
      svar: "Ja. Innholdet er deres, med fri bruk. Husk at folk på bildene må ha samtykket til å bli fotografert — det er arrangørens ansvar, og vi hjelper gjerne med hvordan det løses i praksis.",
    },
  ],
  pris: null,
};

/* ────────────────────────────────────────────────────────────────────
   /innholdsproduksjon — navet
   ──────────────────────────────────────────────────────────────────── */

/**
 * NAV-SIDE, IKKE EN SJETTE TJENESTE. Avgjort 21.09.2026.
 *
 * «Innholdsproduksjon» er den største kommersielle muligheten i hele
 * analysen: 450 i volum, vanskelighetsgrad 0, 1,80 $ i CPC — og Reflektor
 * eier allerede URL-en uten å rangere på den.
 *
 * Men den er samtidig den som ligner mest på forsiden. «Innholdsproduksjon»
 * er bokstavelig talt det abonnementet gjør. Bygget som «vi produserer
 * innhold for bedrifter», ville den blitt /sosiale-medier-byra på nytt
 * under et annet navn — og den siden ble 301-et bort nettopp fordi to
 * sider med samme fakta deler signalene i to.
 *
 * Løsningen er at den eier paraplybegrepet og RUTER. Den beskriver ikke
 * abonnementet, og den gjentar ikke de fire spesialsidene. Den sier hva
 * som finnes og sender folk videre. Det er en etablert arkitektur — nav og
 * eiker — og den kannibaliserer ikke, fordi et nav ikke konkurrerer med
 * sine egne eiker om å svare på det samme spørsmålet.
 *
 * `/tjenester` 301-er til `/` i dag, så det finnes ingen oversiktsside.
 * Dette er den.
 */
export const innholdsproduksjon: Tjenesteside = {
  sti: "/innholdsproduksjon",
  tittel: "Innholdsproduksjon | Foto og video for bedrifter",
  beskrivelse:
    "Innholdsproduksjon fra Reflektor: reklamefilm, video til egne flater, employer branding og eventdekning — eller løpende produksjon til fast månedspris. Oslo, hele Norge.",
  h1: "Innholdsproduksjon",
  merkelapp: "Oversikt",
  tjenestetype: "Produksjon av foto og video for bedrifter",
  svar: "Innholdsproduksjon er arbeidet med å lage foto og video en bedrift kan bruke: til annonser, til nettsiden, til rekruttering og til sosiale medier. Reflektor gjør det på to måter — som enkeltprosjekter, eller som løpende produksjon til fast månedspris. Hvilken av dem som passer, avhenger av om behovet er en kampanje eller en kalender.",
  avgrensning: {
    tekst:
      "Denne siden er oversikten. Hver tjeneste har sin egen side med pris, leveranse og eksempler, fordi en reklamefilm og en rekrutteringsvideo er to forskjellige kjøp med to forskjellige budsjetter.",
    lenker: [],
  },
  seksjoner: [
    {
      sporsmal: "Prosjekt eller abonnement — hva trenger dere?",
      svar: "Et prosjekt løser én oppgave med en start og en slutt: en lansering, en kampanje, en stilling som skal fylles. Et abonnement løser et problem som ikke tar slutt — at kanalene må fylles hver uke, hele året. De fleste som spør om innholdsproduksjon trenger et prosjekt først, og oppdager etter hvert at de også trenger kalenderen.",
      punkter: [
        "Prosjekt: én leveranse, avtalt omfang, egen pris",
        `Abonnement: ${site.kontakt.firma} produserer og publiserer løpende, ${new Intl.NumberFormat("nb-NO").format(30000)} kr/mnd`,
      ],
    },
    {
      sporsmal: "Hvem produserer Reflektor for?",
      svar: "Anton Sport, The Well, Peppes Pizza, Egon, Baker Brun, Idun Industri, Selvaag, Retail24, Centropa, Happis og Soul Cake — innen retail, restaurant og mat, eiendom, finans, industri og teknologi.",
      sitat: {
        tekst:
          "Teamet i Reflektor jobber lynraskt, presist og leverer høy kvalitet hver gang. Jeg har jobbet med dem mange ganger med merkevarer for Orkla Foods Norge og har aldri vært skuffet.",
        navn: "Vigdis Bonvik-Stone",
        rolle: "Orkla Foods Norge",
      },
    },
  ],
  faq: [
    {
      sporsmal: "Hva er forskjellen på innholdsproduksjon og markedsføring?",
      svar: "Innholdsproduksjon er å lage materialet. Markedsføring er å bestemme hvor det skal vises og betale for det. Reflektor produserer, og publiserer i sosiale medier for abonnementskundene — vi kjøper ikke annonseplass og styrer ikke annonsebudsjetter.",
    },
    {
      sporsmal: "Kan vi begynne med ett prosjekt og gå over til abonnement?",
      svar: "Ja, og det er den vanligste veien. Et prosjekt viser hvordan samarbeidet fungerer i praksis, og abonnementet er svaret hvis konklusjonen er at dere trenger dette hver måned og ikke én gang.",
    },
    {
      sporsmal: "Eier vi innholdet?",
      svar: "Ja. Alt Reflektor produserer er deres, med fri bruk i annonser, på nettsider, skjermer og i presentasjoner.",
    },
    {
      sporsmal: "Hvor holder dere til?",
      svar: `Reflektor holder til i ${site.kontakt.adresse} og produserer for bedrifter i hele Norge.`,
    },
  ],
  pris: null,
};

export const tjenestesider: Tjenesteside[] = [
  innholdsproduksjon,
  reklamefilm,
  videoproduksjon,
  employerBranding,
  event,
];

/** Eikene navet ruter til. Rekkefølgen er etter søkevolum. */
export const eiker = [
  {
    sti: "/reklamefilm",
    navn: "Reklamefilm",
    flate: "Betalte flater — TV, nettannonser, sosiale medier",
    beskrivelse:
      "Filmen dere betaler for å få vist. Den må fange folk som ikke lette etter dere.",
  },
  {
    sti: "/videoproduksjon-i-oslo",
    navn: "Videoproduksjon",
    flate: "Egne flater — nettside, tjenesteside, skjerm",
    beskrivelse:
      "Filmen som forklarer, til folk som allerede har funnet dere.",
  },
  {
    sti: "/employer-branding-video-oslo",
    navn: "Employer branding-video",
    flate: "Rekruttering — stillingsannonse, karriereside",
    beskrivelse: "Filmen som gjør at folk søker jobb hos dere.",
  },
  {
    sti: "/eventfotograf-eventvideo",
    navn: "Event­fotograf og eventvideo",
    flate: "Dokumentasjon — konferanse, lansering, messe",
    beskrivelse: "Dekningen av noe som skjer én gang, og skal brukes etterpå.",
  },
] as const;

export { KONTAKT };
