import { site, tilbud } from "./site";

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
  /**
   * Lenker under seksjonen, til siden som utdyper den.
   *
   * LAGT TIL 29.09.2026 for /kjeder, der hver kundeblokk skal kunne peke
   * videre til kundecaset. Ankerteksten sier hva den andre siden ER — samme
   * regel som `lesVidere` på bloggen følger, og av samme grunn: ankertekst
   * er et av de sterkeste interne relevanssignalene som finnes.
   */
  lenker?: { sti: string; tekst: string }[];
};

/**
 * Ett medie i «Fra arbeidet».
 *
 * BYTTET FRA `klipp: string[]` 27.09.2026. Feltet tok bare video fra
 * /reels/, og det ga to problemer Pål fanget på /reklamefilm: bare to av fem
 * sider hadde noe å vise i det hele tatt, og de to klippene som lå der var
 * fra sportsbutikk — ikke reklamefilm.
 *
 * Arkivet har 36 medier med ferdig alt-tekst, men de fleste er foto. Ved å
 * ta imot begge kan hver side vise fire relevante saker i stedet for null
 * eller to tilfeldige.
 *
 * `sti` er uten filendelse for video (Klipp legger på .mp4 og .jpg selv) og
 * MED endelse for foto.
 */
/**
 * En ferdig film vist i sin helhet på en tjenesteside.
 *
 * `sti` er uten filendelse; komponenten legger på .mp4 og .jpg.
 *
 * `lyd` avgjør avspilleren, ikke bare volumet: med lyd får filmen
 * kontroller og spiller én gang, uten lyd går den dempet i løkke. Se
 * Referansefilmer i components/tjeneste/Tjenestemedier.tsx.
 *
 * `sekunder` er målt med ffmpeg på filen, ikke avrundet etter hukommelse.
 * Den brukes i VideoObject-markeringen.
 */
export type Referansefilm = {
  sti: string;
  format: "16/9" | "9/16";
  alt: string;
  bildetekst: string;
  sekunder: number;
  lyd?: boolean;
};

export type Arbeidsmedie = {
  type: "foto" | "video";
  sti: string;
  alt: string;
};

/** En bit av avgrensningen: ren tekst, eller en lenke. */
export type Avgrensningsdel = string | { sti: string; tekst: string };

export type Tjenesteside = {
  sti: string;
  /**
   * Toppbilde fra Reflektors eget arbeid i public/arbeid/.
   *
   * Motivet er valgt etter hva siden handler om: ansatte i arbeid over
   * employer branding, en foredragsholder over eventdekning. Alt-teksten
   * er ORDRETT fra arbeid.ts og navngir ingen kunde — et bilde av en
   * navngitt kunde over en tjenesteside ville antydet at kunden har kjøpt
   * akkurat den tjenesten, og det er en påstand vi ikke kan belegge.
   *
   * De to sidene som allerede har `klipp` får ikke toppbilde. Et stillbilde
   * rett over en rad med video er to løsninger på samme problem.
   */
  bilde?: { fil: string; alt: string; fokus?: string };
  tittel: string;
  beskrivelse: string;
  h1: string;
  /** 40–60 ord. Står rett under H1, før alt annet. */
  svar: string;
  /** schema.org serviceType. Må være unik per side. */
  tjenestetype: string;
  /** Merkelapp over H1. */
  merkelapp: string;
  /**
   * Avgrensningen: hva siden IKKE dekker, med lenke dit det hører hjemme.
   *
   * SKREVET OM 27.09.2026. Dette var en innrammet boks med overskriften «Er
   * dette riktig side?» og lenkene som en knapperad under. Pål: «ser litt
   * rare ut … kan de endres til noe mindre ai-avslørende?» Han har rett —
   * ingen skriver en beslutningstre-overskrift til leseren sin. Selve
   * avgrensningen gjør fortsatt to reelle jobber (leseren havner riktig, og
   * språkmodellen får et signal den kan sitere), så innholdet består. Det er
   * innpakningen som forsvant.
   *
   * Lenkene er derfor vevd INN i setningen i stedet for å ligge under den.
   * En streng er tekst, et objekt er en lenke. Det gir også bedre
   * ankertekst: «video til egne flater» står nå i en setning som forklarer
   * når det gjelder, ikke alene på en knapp.
   *
   * `null` for sider som ikke trenger den.
   */
  avgrensning: Avgrensningsdel[] | null;
  /**
   * Overskriften over seksjonene. Standard er «Det dere lurer på».
   *
   * LAGT TIL 29.09.2026. På de fem tjenestesidene ER seksjonene spørsmål, og
   * standarden er riktig. På /kjeder er de kundeblokker — «Det dere lurer
   * på» over en overskrift som bare sier «Anton Sport» er en merkelapp som
   * ikke passer innholdet.
   */
  seksjonstittel?: string;
  seksjoner: Seksjon[];
  faq: { sporsmal: string; svar: string }[];
  /** Fra-pris som tekst, eller null når den ikke er oppgitt. */
  pris: string | null;
  /**
   * Referansefilmer: hele filmer, vist stort rett under svaret.
   *
   * VAR `hovedfilm`, ÉN FILM I 16:9. Utvidet 28.09.2026 på Påls beskjed: «la
   * videoene gå i sin helhet. blir en dårlig referanse på siden om man bare
   * ser en liten del.» Feltet tar nå en liste, og hver film oppgir sitt eget
   * format — arkivets ferdige eksporter finnes både liggende og stående, og
   * å presse en stående film inn i en 16:9-ramme kaster bort to tredeler av
   * bildet.
   *
   * Plasseringen er høyt oppe med vilje: 44 % av sitatene språkmodeller
   * henter kommer fra første tredel av en side, og for et menneske er det å
   * faktisk se filmen det sterkeste beviset siden har.
   *
   * KUN FERDIGE EKSPORTER. Ikke råopptak fra kamera. Rått materiale er
   * ugradert og uklippet, og en referanse som viser ugradert materiale sier
   * det motsatte av det den skal si. Regelen kom fra Pål 28.09.2026 etter at
   * jeg hadde lagt inn to klipp skåret rett ut av 4K-råfiler.
   */
  filmer?: Referansefilm[];

  /**
   * «Fra arbeidet»: fire medier valgt etter hva siden handler om.
   *
   * FIRE, IKKE TO. Raden fylte tidligere bare venstre halvdel av skjermen
   * med to stående klipp, og så ut som noe som manglet. Fire fyller
   * rutenettet på alle bredder.
   */
  arbeid?: Arbeidsmedie[];
};

const KONTAKT = { sti: "/#kontakt", tekst: "Få et forslag" };

/**
 * Tall med mellomrom som tusenskille, slik prisen skrives ellers på
 * nettstedet: «30 000 kr/mnd». Aldri med mva-notasjon — låst ramme i
 * AGENTS.md kapittel 0.3.
 */
const kr = (n: number) => new Intl.NumberFormat("nb-NO").format(n);

/* ────────────────────────────────────────────────────────────────────
   /reklamefilm — filmen dere betaler for å få vist
   ──────────────────────────────────────────────────────────────────── */

export const reklamefilm: Tjenesteside = {
  sti: "/reklamefilm",
  tittel: "Reklamefilm for TV, nett og sosiale medier",
  beskrivelse:
    "Reflektor produserer reklamefilm for TV, nettannonser og sosiale medier. Vi lager filmen — vi kjøper ikke sendetid. Oslo, for hele Norge.",
  h1: "Reklamefilm",
  merkelapp: "Produksjon",
  tjenestetype: "Produksjon av reklamefilm for betalte flater",
  svar: "En reklamefilm er laget for å vises mot betaling — på TV, som nettannonse eller i sosiale medier. Reflektor står for produksjonen: idé, manus, opptak, klipp, lyd og fargekorrigering. Vi produserer filmen. Vi kjøper ikke sendetid eller annonseplass.",
  avgrensning: [
    "Reklamefilm er film dere betaler for å få vist. Skal den i stedet ligge på nettsiden deres eller på en skjerm i butikken, er det ",
    { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
    ". Skal den brukes til å rekruttere, er det ",
    {
      sti: "/employer-branding-video-oslo",
      tekst: "film for rekruttering",
    },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Kjøper dere sendetid på TV?",
      svar: "Nei. Reflektor er et produksjonshus, ikke et mediebyrå. Vi lager filmen, og dere eller mediebyrået deres kjøper flaten den skal vises på. Det er verdt å vite før dere ber om pris: et tilbud fra oss dekker produksjonen, ikke visningene. Skal filmen på TV, må dere regne med en kostnad til for sendetiden.",
    },
    {
      sporsmal: "Hva koster en reklamefilm?",
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nDere kan påvirke tallet selv. Holder dere lokasjon og eventuelle statister eller skuespillere, går prisen ned — og på en reklamefilm er det ofte de to postene som veier mest.`,
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
      svar: "Sju steg, og dere er med på alle de avgjørende. Vi begynner med et introduksjonsmøte, og dere får et løsningsforslag med pris før noe settes i gang.",
      punkter: [
        "Introduksjonsmøte — hva skal filmen gjøre?",
        "Løsningsforslag fra oss, med pris",
        "Gjennomgang og korrigeringer sammen med dere",
        "Koordinering av statister, skuespillere og lokasjon",
        "Dato for produksjon settes",
        "Opptaksdag",
        "Etterarbeid og korrigeringer",
      ],
    },
    /*
     * KAMPANJENE ER LAGT TIL 29.09.2026, og de er ikke ny copy. Setningen
     * «TV-reklamen for Vitusapotek i forbindelse med Skal vi Danse og for
     * Peppes i forbindelse med Premier League er begge laget av oss» står
     * ordrett på dagens /reklamefilm. Den forsvant i migreringen.
     *
     * Den står her fordi den er det mest gjenkjennelige beviset siden har.
     * Google AI Mode hentet ikke Reflektor da en kjede spurte, og snudde
     * først da Pål nevnte nettopp disse to reklamefilmene.
     */
    {
      sporsmal: "Hvem har Reflektor produsert for?",
      svar: "Reflektor har laget reklamefilm for Vitusapotek, Peppes Pizza og Samlerhuset. TV-reklamen for Vitusapotek i forbindelse med Skal vi danse, og for Peppes i forbindelse med Premier League, er begge laget av oss. Utover reklamefilm har vi produsert foto og video for blant andre Anton Sport, The Well, Egon og Baker Brun.",
      lenker: [
        { sti: "/kjeder", tekst: "Foto, video og reklamefilm for kjeder" },
      ],
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
  /*
   * INGEN LYD HER, og det er et valg. Filmen er femten sekunder uten replikk
   * og leses som bevegelse; dempet løkke er riktig avspiller for den. De to
   * filmene på employer branding-siden er intervjuer der poenget er det som
   * blir sagt, og de får kontroller.
   */
  filmer: [
    {
      sti: "/reels/peppes-reklamefilm",
      format: "16/9",
      alt: "Stillbilde fra reklamefilm for Peppes Pizza",
      bildetekst:
        "Reklamefilm for Peppes Pizza. 15 sekunder, produsert av Reflektor.",
      sekunder: 15,
    },
  ],
  /*
   * REKLAMEFILM. Her lå antonsport og goretex — to klipp fra sportsbutikk,
   * rett under en setning som sier at Anton Sport IKKE er reklamefilmkunde.
   * Nå vises materiale med reklamefilmens uttrykk: Egon og Peppes, som Pål
   * har bekreftet som reklamefilmkunder, og to produktbilder.
   */
  arbeid: [
    {
      type: "video",
      sti: "/reels/egon",
      alt: "Vertikalt klipp fra en Egon-restaurant",
    },
    {
      type: "foto",
      sti: "/arbeid/peppes1-1600.jpg",
      alt: "Gjest med pizzastykke foran et neonskilt",
    },
    /* Byttet fra zeroh 27.09.2026: det klippet er fra en utendørs aktivering
       med publikum, og leste som event, ikke reklamefilm. En helleskål er
       reklamefilmens eget språk. */
    {
      type: "video",
      sti: "/arbeid/kakao",
      alt: "Vertikalt klipp av kakaodrikk som helles",
    },
    {
      type: "foto",
      sti: "/arbeid/helios-1600.jpg",
      alt: "Flaskestilleben på grønt tekstil",
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────
   /videoproduksjon-i-oslo — filmen på flater kunden selv eier
   ──────────────────────────────────────────────────────────────────── */

export const videoproduksjon: Tjenesteside = {
  sti: "/videoproduksjon-i-oslo",
  tittel: "Videoproduksjon i Oslo – film til egne flater",
  beskrivelse:
    "Videoproduksjon for bedrifter: bannervideo, film til tjenestesider, innhold til skjermer og brand video. Produsert i Oslo, for hele Norge.",
  h1: "Videoproduksjon i Oslo",
  merkelapp: "Produksjon",
  tjenestetype: "Videoproduksjon for bedriftens egne flater",
  svar: "Videoproduksjon er film til flater dere selv eier: forsiden av nettsiden, en tjenesteside som trenger forklaring, skjermer i butikk eller resepsjon, og egne kanaler. Reflektor står for idé, opptak, klipp, teksting og fargekorrigering. Filmen koster ingenting å vise, fordi flaten er deres.",
  avgrensning: [
    "Skal dere betale for å få filmen vist, på TV eller som annonse, er det ",
    { sti: "/reklamefilm", tekst: "reklamefilm" },
    ". Skal den snakke til framtidige ansatte i stedet for til kunder, er det ",
    {
      sti: "/employer-branding-video-oslo",
      tekst: "film for rekruttering",
    },
    " — et annet publikum, og derfor en annen film.",
  ],
  seksjoner: [
    {
      sporsmal: "Hva slags video lager dere til egne flater?",
      svar: "Film som skal forklare noe, ikke fange oppmerksomhet i en feed. Den vanligste jobben er en kort bannervideo øverst på forsiden, film som viser hva en tjeneste faktisk innebærer, innhold til skjermer i lokalet, og brand video som forteller hvem selskapet er.",
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
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nHolder dere lokasjon og eventuelle medvirkende selv, går prisen ned.`,
    },
    {
      sporsmal: "Hvor mange filmer får vi ut av én dag?",
      svar: "Det kommer an på kompleksitet og omfang, og vi tilpasser til det hver enkelt kunde faktisk trenger. Er volum viktigere enn produksjonsverdi, er det planleggingen som avgjør — da legger vi dagen opp for å nå et bestemt antall. Til sammenligning er abonnementet bygget på at én produksjonsdag gir 8–10 ferdige videoer, men da filmer vi løpende innhold og rigger ikke om mellom hvert oppsett. Si hva tallet skal være, så planlegger vi mot det.",
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
      svar: "Vi leverer som regel innen to uker etter opptaksdagen. Haster det, sier dere fra i planleggingen — ved spesielle behov tilrettelegger vi for raskere leveranse.",
    },
  ],
  pris: null,
  /* VIDEO TIL EGNE FLATER. The Well og Soul Cake sto her fra før og passer.
     Lagt til elsykkelen og dronebildet: begge er typiske bannervideoer og
     forsidebilder, altså nettopp egne flater. */
  arbeid: [
    {
      type: "video",
      sti: "/reels/thewell",
      alt: "Vertikalt klipp fra behandling med leire på mosaikkflis",
    },
    {
      type: "video",
      sti: "/reels/soulcake",
      alt: "Vertikalt klipp fra bakeri",
    },
    { type: "video", sti: "/reels/gekko", alt: "Vertikalt klipp av elsykkel" },
    /*
     * FIRE AV FIRE ER FILM, rettet 27.09.2026. Her lå et dronebilde, altså
     * et stillbilde på siden som selger videoproduksjon. Pål: «du må
     * åpenbart vise videoer og ikke bilder på videoproduksjonssiden.»
     *
     * Treningslokalet er valgt fordi de tre andre er spa, bakeri og
     * produkt — fire ulike bransjer, og alle fire er typiske oppdrag der
     * filmen skal ligge på kundens egen nettside.
     */
    {
      type: "video",
      sti: "/arbeid/bekkestua",
      alt: "Vertikalt klipp fra et treningslokale",
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────
   /employer-branding-video-oslo — filmen som skal gjøre folk til søkere
   ──────────────────────────────────────────────────────────────────── */

export const employerBranding: Tjenesteside = {
  /*
   * TOPPBILDET ER EN 21:9-BANNER PÅ INNTIL 1088 px, altså 2176 px på en
   * skjerm med dobbel pikseltetthet. `-vegg`-filene er skalert for cellene i
   * arbeidsveggen og er 640–1000 px brede. Lagt inn her ble de skalert opp
   * to til tre ganger, og det var synlig. Byttet 28.09.2026 til de store
   * filene fra samme opptak.
   */
  bilde: {
    fil: "ansatte-produksjon-1600",
    alt: "Ansatte i arbeidstøy i et produksjonslokale",
    fokus: "center 30%",
  },
  sti: "/employer-branding-video-oslo",
  tittel: "Employer branding-video for rekruttering",
  beskrivelse:
    "Employer branding-video: film til stillingsannonser, karriereside og rekrutteringskanaler. Produsert hos dere, med deres egne ansatte.",
  h1: "Employer branding-video",
  merkelapp: "Produksjon",
  tjenestetype: "Produksjon av film for arbeidsgivermerkevare og rekruttering",
  svar: "Employer branding-video er film som skal få folk til å søke jobb hos dere. Den vises i stillingsannonser, på karrieresiden og i rekrutteringskanaler — ikke til kundene deres, men til dem dere vil ansette. Reflektor filmer hos dere, med de ansatte dere faktisk har.",
  avgrensning: [
    "Her handler det om filmen. Vil dere heller lese om ",
    {
      sti: "/blogg/hva-er-employer-branding",
      tekst: "hva employer branding er som fagfelt",
    },
    ", står det i bloggen. Skal filmen selge til kunder i stedet for å rekruttere, er det ",
    { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Hvorfor film, og ikke bare en god stillingsannonse?",
      svar: "En stillingsannonse kan beskrive oppgavene, men ikke lokalet, tempoet eller menneskene man skal jobbe sammen med. For mange kandidater er det akkurat det de lurer mest på, og det er lettere å vise enn å skrive.",
    },
    {
      sporsmal: "Hvem skal være med i filmen?",
      svar: "De som faktisk jobber der, og helst ikke bare ledelsen. Vi bruker ikke skuespillere. En arbeidsplass som er satt i scene er lett å gjennomskue, og da mister filmen troverdighet. Vi filmer folk mens de gjør jobben sin.",
      sitat: {
        tekst:
          "Det som virkelig skiller dem ut, er hvor samarbeidsvillige og engasjerte de er. De stiller opp, byr på seg selv, og er rett og slett kjempefine folk man blir glad i.",
        navn: "Marion Ilona Heggland Skjørberg",
        rolle: "Baker Brun",
      },
    },
    {
      sporsmal: "Hva koster en employer branding-video?",
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nÉn film dekker én stilling. Skal dere fremstå som en attraktiv arbeidsgiver over tid, må folk se dere også i periodene dere ikke lyser ut noe. Kontinuitet er nøkkelen her, og mange velger derfor et løpende samarbeid framfor en enkeltproduksjon.`,
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
  /*
   * TO HELE FILMER I STEDET FOR ET RUTENETT MED UTDRAG.
   *
   * Seksjonen «Fra arbeidet» er borte fra denne siden, og det er bestilt:
   * «la videoene gå i sin helhet. blir en dårlig referanse på siden om man
   * bare ser en liten del.» Rutenettet er fire ruter à fire sekunder. Det
   * fungerer som stemning, men det er ikke en referanse — og på en side som
   * selger film til rekruttering er referansen hele poenget.
   *
   * VEIEN HIT TOK TRE RUNDER, og to av dem var feil:
   *
   * 1. Rutenettet hadde duplikat, et uskarpt bilde og tre stillbilder på en
   *    side som selger video. Pål meldte alle tre.
   * 2. Erstatningen var fire klipp fra et firmaarrangement. Riktig type
   *    innhold, men jeg skrev samtidig at arkivet ikke hadde kontorvideo.
   *    Det var feil — Pål pekte på Smarketing og Eiendomskreditt.
   * 3. Erstatningen etter det var klippet ut av RÅ 4K-kamerafiler. Ugradert
   *    og uklippet materiale, presentert som referanse. Pål: «ikke bruk
   *    råklipp... åpenbart.»
   *
   * Nå: begge filmene er ferdige eksporter fra kundemappen, lagt inn hele og
   * med kontroller. Den ene er liggende, den andre stående, og begge er
   * filmet i kontorlokaler.
   *
   * INGEN PÅSTAND OM HVA KUNDEN HAR KJØPT. Bildetekstene sier hva filmene
   * ER — profilfilm og kundeomtale — ikke at de er employer branding.
   * Seksjonen viser arbeid, den hevder ikke at arbeidet var denne tjenesten.
   */
  filmer: [
    {
      sti: "/arbeid/profilfilm",
      format: "16/9",
      alt: "Stillbilde fra en profilfilm filmet i kontorlokaler",
      bildetekst:
        "Profilfilm for et rådgivningsselskap. 39 sekunder, filmet på kontoret.",
      sekunder: 39,
      lyd: true,
    },
    {
      sti: "/arbeid/kundeomtale",
      format: "9/16",
      alt: "Stillbilde fra et intervju filmet i kontorlokaler",
      bildetekst:
        "Kundeomtale, filmet stående for sosiale medier. 22 sekunder.",
      sekunder: 22,
      lyd: true,
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────
   /eventfotograf-eventvideo — dokumentasjonen av noe som skjer én gang
   ──────────────────────────────────────────────────────────────────── */

export const event: Tjenesteside = {
  /*
   * DUPLIKATET RETTET 28.09.2026 I RUTENETTET, IKKE HER. `aktivering-vegg`
   * sto både som toppbilde og som rute to i «Fra arbeidet» — samme bilde to
   * ganger på samme side.
   *
   * Første forsøk byttet toppbildet i stedet, til et dronebilde av et
   * anleggsområde. Det var skarpere, men viste et tomt basseng uten
   * mennesker over en overskrift om eventfotografi. Skarphet som gjør bildet
   * mindre relevant er ikke en forbedring. Aktiveringsbildet er et faktisk
   * arrangement, og 1000 px holder i denne rammen på vanlige skjermer.
   */
  bilde: {
    fil: "aktivering-vegg",
    alt: "Utendørs aktivering med stand og publikum",
    fokus: "center 40%",
  },
  sti: "/eventfotograf-eventvideo",
  tittel: "Eventfotograf og eventvideo for bedrifter",
  beskrivelse:
    "Eventfotograf og eventvideo: foto og film fra konferanser, lanseringer, messer og firmaarrangementer. Materiale dere kan bruke i ettertid.",
  h1: "Eventfotograf og eventvideo",
  merkelapp: "Produksjon",
  tjenestetype: "Foto- og videodekning av arrangementer",
  svar: "Eventdekning er foto og film fra noe som skjer én gang: en konferanse, en lansering, en messe eller et firmaarrangement. Jobben er å komme hjem med materiale dere kan bruke i ettertid: innhold til kanalene, og bilder dere kan invitere med neste gang.",
  avgrensning: [
    "Dette er dekning av noe som faktisk skjer. Skal filmen planlegges fra bunnen i stedet, er det ",
    { sti: "/videoproduksjon-i-oslo", tekst: "planlagt videoproduksjon" },
    " — og skal den vises som betalt annonse, ",
    { sti: "/reklamefilm", tekst: "reklamefilm" },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Hva får dere igjen for å dokumentere et arrangement?",
      svar: "Materiale som lever lenger enn dagen. Bildene og klippene fra en konferanse er det som selger neste års konferanse, og de fyller kanalene i ukene etterpå. Et arrangement uten dekning er en investering som forsvinner samme kveld.",
    },
    {
      sporsmal: "Hva koster eventfotograf?",
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nFor arrangementer er kveldsarbeid den vanligste fordyrende faktoren, sammen med hvor mange som må være til stede samtidig.`,
    },
    {
      sporsmal: "Når får vi materialet?",
      svar: "Som regel innen to uker. Men der det er essensielt å få deler av leveransen ut samme kveld eller dagen etter, imøtekommer vi som regel det — si fra i planleggingen, så legger vi opp dagen etter det.",
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
  /* EVENT. Tre bilder fra arrangementer og ett portrett. Portrettet hører
     hjemme her fordi det er en av de faktiske leveransene fra en
     arrangementsdag, ikke bare oversiktsbilder fra salen. */
  arbeid: [
    {
      type: "foto",
      sti: "/arbeid/scene-vegg.jpg",
      alt: "Foredragsholder foran en skjerm",
    },
    /*
     * BYTTET 28.09.2026. Her lå `aktivering-vegg.jpg` — det SAMME bildet som
     * står som toppbilde øverst på siden. To ruter over hverandre med samme
     * motiv leses som en feil i koden, ikke som to bilder. Nå står
     * aktiveringen bare ett sted, øverst, der den er stor.
     *
     * Erstatningen er fra prisutdelingen: et kjøkkenteam i det de får
     * beskjeden. Det er dekning av noe som skjer én gang, som er nøyaktig
     * det siden lover.
     */
    {
      type: "foto",
      sti: "/arbeid/stallen-team-1800.jpg",
      alt: "Kokker som får en pris på et kjøkken",
    },
    {
      type: "foto",
      sti: "/arbeid/dag4-vegg.jpg",
      alt: "Opptak med kamera under et arrangement",
    },
    /*
     * HENTET FRA DROPBOX 27.09.2026. Siden hadde fire stillbilder og ingen
     * film i det hele tatt — på en side som selger eventvideo. Dette er
     * popup-en for Freia: hjul, betjening og gjester, altså dekning av noe
     * som faktisk skjer. Transkodet fra 176 MB i 4K til 1,6 MB i 720x1280.
     */
    {
      type: "video",
      sti: "/reels/freia-popup",
      alt: "Vertikalt klipp fra en popup-butikk med lykkehjul og betjening",
    },
  ],
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
  /*
   * INTET TOPPBILDE, fjernet 28.09.2026. Her lå `dag4-vegg` — 640x960,
   * strukket over en banner på inntil 2176 px. Tre ganger opp, og synlig.
   *
   * Det ble forsøkt byttet til den store filen fra samme opptak, men da
   * kolliderte det med eventsiden: hele popup-dagen finnes i tre utsnitt, og
   * to av dem sto allerede på /eventfotograf-eventvideo. Tre nesten like
   * bilder fordelt på to sider er samme feil som duplikatet vi nettopp
   * fjernet, bare spredt utover.
   *
   * Arkivet har ikke et stort, liggende bilde som sier «innholdsproduksjon»
   * og ikke allerede brukes et annet sted. Da er ingen banner bedre enn en
   * uskarp eller en lånt: /reklamefilm og /videoproduksjon-i-oslo har heller
   * ingen, og siden har fire eikekort og et medierutenett fra før.
   *
   * Kommer det et egnet bilde, settes `bilde` tilbake — feltet er valgfritt.
   */
  sti: "/innholdsproduksjon",
  tittel: "Innholdsproduksjon | Foto og video for bedrifter",
  beskrivelse:
    "Innholdsproduksjon fra Reflektor: reklamefilm, video til egne flater, employer branding og eventdekning — som prosjekt eller fast månedspris.",
  h1: "Innholdsproduksjon",
  merkelapp: "Oversikt",
  tjenestetype: "Produksjon av foto og video for bedrifter",
  svar: "Innholdsproduksjon er arbeidet med å lage foto og video en bedrift kan bruke: til annonser, til nettsiden, til rekruttering og til sosiale medier. Reflektor gjør det på to måter — som enkeltprosjekter, eller som løpende produksjon til fast månedspris. Hvilken av dem som passer, avhenger av om behovet er en kampanje eller en kalender.",
  /*
   * FJERNET 27.09.2026. Her sto «Denne siden er oversikten. Hver tjeneste
   * har sin egen side …». Rett under står eikene — fire kort som viser
   * nøyaktig det samme, med lenker. Setningen var en innledning til noe
   * leseren allerede ser.
   */
  avgrensning: null,
  seksjoner: [
    {
      sporsmal: "Prosjekt eller abonnement — hva trenger dere?",
      svar: "Et prosjekt har en start og en slutt: en lansering, en kampanje, en stilling som skal fylles. Et abonnement er for dere som trenger noe nytt å publisere hver uke, året rundt. Mange begynner med ett prosjekt. Viser det seg at dere trenger påfyll hver måned, blir abonnement som regel rimeligere enn å bestille ett prosjekt av gangen.",
      punkter: [
        `Prosjekt: én leveranse, avtalt omfang, fra ${kr(tilbud.fraPrisProsjekt)} kr`,
        `Abonnement: ${site.kontakt.firma} produserer og publiserer løpende, ${kr(tilbud.prisPerManed)} kr/mnd`,
      ],
    },
    /*
     * LAGT TIL 27.09.2026. Bakgrunnen er målt, ikke antatt: «innholdsproduksjon»
     * har 14 444 visninger i Search Console på plass 11–12, men bare 16 klikk —
     * og det er Reflektors egen bloggartikkel om ordet som ligger foran denne
     * siden. Artikkelen er på 2 136 ord og forklarer hva ordet betyr. Denne
     * siden var på 375 og svarte ikke på det en kjøper spør om.
     *
     * INGEN NY COPY. `prisdrivere` er Påls egen ordlyd, lagt inn 22.09.2026 og
     * fram til nå brukt ingen steder i det hele tatt. Tallene er de to som
     * allerede står på siden, og «ingen timepriser» står i `tilbud.vilkar`.
     *
     * DEN GJENTAR IKKE SEKSJONEN OVER. Der er spørsmålet hvilken av de to
     * formene dere trenger. Her er det hva prisen henger på — at
     * prosjektprisen varierer og abonnementsprisen ikke gjør det. Den
     * forskjellen sto ingensteds, og den er det en kjøper vil vite.
     */
    {
      sporsmal: "Hva avgjør prisen på et prosjekt?",
      svar: `Et prosjekt starter på ${kr(tilbud.fraPrisProsjekt)} kr, og hvor det lander avgjøres av tre ting. Vi bruker ikke timepriser, så prisen avtales før vi begynner. Abonnementet har ingen slik variasjon: ${kr(tilbud.prisPerManed)} kr/mnd er prisen hver måned, for én produksjonsdag, ${tilbud.videoerPerManed} ferdig redigerte videoer som produksjonsmål og publisering ${tilbud.posterPerUke} ganger i uka.`,
      punkter: [...tilbud.prisdrivere],
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
  /* NAVET. Her er poenget bredden, ikke én type: en produksjonsdag, mat,
     drikke og butikk. Fire ulike oppdrag, som er det siden lover. */
  arbeid: [
    {
      type: "video",
      sti: "/reels/produksjonsdag",
      alt: "Vertikalt klipp fra en produksjonsdag",
    },
    {
      type: "foto",
      sti: "/arbeid/dag1-1600.jpg",
      alt: "Nærbilde av bakverk på brett",
    },
    {
      type: "video",
      sti: "/arbeid/matcha",
      alt: "Vertikalt klipp av matcha som vispes",
    },
    {
      type: "foto",
      sti: "/arbeid/kafe1-1600.jpg",
      alt: "Vegg av flasker i en butikkhylle",
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────
   /kjeder — kjedeerfaringen, skrevet med ordene en kjede søker på
   ──────────────────────────────────────────────────────────────────── */

/**
 * SIDEN FINNES PÅ GRUNN AV EN MÅLING, IKKE EN IDÉ.
 *
 * Pål testet Google AI Mode 29.09.2026 som «markedssjef i en norsk
 * interiørkjede som trenger et byrå til løpende innhold». Reflektor kom ikke
 * med i svaret. AI-en begrunnet det med VÅR EGEN TEKST: «én produksjonsdag,
 * 8–10 videoer», «Instagram og Facebook» og FAQ-en «Hva er ikke inkludert?».
 * Den leste dette som at vi er for små for en kjede, mangler TikTok og ikke
 * tar community management.
 *
 * Vurderingen snudde først da Pål selv nevnte Anton Sport, Egon, Peppes og
 * TV-reklamene. Da hentet AI-en case-sidene og kalte Reflektor «en av de
 * sterkeste kandidatene».
 *
 * Diagnosen er derfor ikke at fakta mangler. Den er at kjedefakta ikke er
 * skrevet med ordene en kjede bruker — kjede, retail, landsdekkende,
 * markedssjef, faste månedlige avtaler — og at begrensningene står uten
 * sammenheng og leses som et tak.
 *
 * REFERANSEKUNDENE ER IKKE SOME-ABONNENTER. Anton Sport, Egon, Peppes og
 * Vitusapotek er kunder på foto, video og reklamefilm. Ingen setning her
 * skal antyde noe annet — det er en låst ramme i AGENTS.md, og det er
 * dessuten sant: abonnementet er den eneste tjenesten der vi publiserer.
 *
 * HVER PÅSTAND HAR EN KILDE. Sitatet er ordrett fra anmeldelser.ts.
 * Egon-tallene fra caser.ts. Setningene om Anton Sport, Premier League og
 * Skal vi danse er Reflektors egen publiserte tekst på dagens side. Det som
 * IKKE har kilde står som en BEKREFT-plassholder, og scripts/bekreft-check.ts
 * stopper byggen på dem. To slike står igjen i denne filen.
 */
export const kjeder: Tjenesteside = {
  sti: "/kjeder",
  tittel: "Innhold for kjeder og retail",
  beskrivelse:
    "Reflektor lager foto, video og reklamefilm for norske kjeder: Anton Sport, Egon, Peppes Pizza og Vitusapotek. Faste månedlige avtaler, landsdekkende.",
  h1: "Foto, video og reklamefilm for kjeder",
  merkelapp: "Kjeder og retail",
  tjenestetype: "Løpende foto- og videoproduksjon for kjeder og retail",
  svar: "Reflektor lager foto, video og reklamefilm for norske kjeder. Vi har produsert for Anton Sport i over tre år, laget innhold til Egons nærmere 50 restauranter over hele landet, og laget TV-reklame for Vitusapotek og Peppes Pizza. Arbeidet går på faste månedlige avtaler, og markedsteamet hos kunden styrer kanalene selv.",
  seksjonstittel: "Kjedene vi produserer for",
  avgrensning: [
    "Skal dere ha én film til én kampanje, er det ",
    { sti: "/reklamefilm", tekst: "reklamefilm" },
    ". Skal dere ha løpende innhold til egne kanaler der vi også publiserer, er det ",
    { sti: "/", tekst: "SoMe-abonnementet" },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Anton Sport",
      svar: "Reflektor produserer foto og video for Anton Sport til kampanjer, skjermer i butikk, sosiale medier og merkevarebygging gjennom året. Samarbeidet er månedlig, og har vart i over tre år.",
      punkter: [
        "Løpende foto og video, hver måned",
        "Kampanjer, skjermer i butikk, sosiale medier og merkevarebygging",
        "Over tre år med samarbeid",
        "[BEKREFT: styrer Anton Sport selv publisering og dialog i kanalene? Påstanden finnes ikke i noe publisert materiale.]",
      ],
      sitat: {
        tekst:
          "Vi liker spesielt godt hvordan de får alle til å føle seg avslappet, naturlig og finne seg til rette foran kamera, selv med lite modell-erfaring fra tidligere. De ser aldri begrensninger og heller muligheter uansett årstid eller lokasjon.",
        navn: "Axel Hauge",
        rolle: "Anton Sport",
      },
    },
    {
      sporsmal: "Egon",
      svar: "Egon har servert nordmenn siden 1984 og er i dag nærmere 50 restauranter fra sør til nord. Reflektor har produsert menyfoto, reels, kampanjefilm og skjermreklame for kjeden siden 2022, fra én fast produksjonsdag i måneden.",
      punkter: [
        "Nærmere 50 restauranter over hele landet",
        "Menyfoto, reels, kampanjefilm og skjermreklame",
        "Seks formater per film — sosiale medier, skjermer i restaurant og kjøpesenter, og annonser",
        "Fast produksjonsdag hver måned siden 2022",
      ],
      lenker: [{ sti: "/vart-arbeid/egon", tekst: "Hele kundecaset for Egon" }],
    },
    {
      sporsmal: "Peppes Pizza",
      svar: "Reflektor har laget reklamefilm for Peppes Pizza. TV-reklamen i forbindelse med Premier League er laget av oss.",
      punkter: [
        "Reklamefilm for TV og nett",
        "TV-reklame knyttet til Premier League",
      ],
    },
    {
      sporsmal: "Vitusapotek",
      svar: "Reflektor har laget TV-reklame for Vitusapotek, i forbindelse med Skal vi danse.",
      punkter: ["TV-reklame", "Kampanje knyttet til Skal vi danse"],
    },
    {
      sporsmal: "Passer for dere hvis …",
      svar: "Passer for kjeder med eget markedsteam som vil eie publisering og dialog med kundene. Vi leverer innholdet, dere styrer kanalene.",
    },
    {
      sporsmal: "Løpende innhold og kampanjefilm fra samme team",
      svar: "Det samme teamet lager løpende innhold og kampanjefilm, slik at butikkinnhold og reklame har samme bildespråk. [BEKREFT: samme team — gjelder dette alle kjedekundene, eller bare noen?]",
    },
    {
      sporsmal: "Volum og format",
      svar: `Trenger dere mer innhold, legger dere til produksjonsdager. Hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr. Videoene leveres stående i 9:16, og dere står helt fritt til å bruke dem på TikTok, i annonser, på nettsiden og andre flater.`,
      punkter: [
        `SoMe-abonnementet koster ${kr(tilbud.prisPerManed)} kr/mnd`,
        `Hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr`,
        "Ingen bindingstid. 3 måneders oppsigelse.",
      ],
    },
  ],
  /*
   * SPØRSMÅLENE ER KONTROLLERT MOT ALLE ANDRE FAQ-ER PÅ NETTSTEDET.
   * tests/faq.test.ts feiler hvis ett av dem allerede står et annet sted —
   * Google forbyr samme spørsmål og svar som FAQPage på to URL-er.
   */
  faq: [
    {
      sporsmal: "Kan dere produsere for flere butikker i samme kjede?",
      svar: "Ja. For Egon produserer vi til nærmere 50 restauranter fra sør til nord, fra én fast produksjonsdag i måneden. Produksjonsdagene kan også fordeles på flere lokasjoner når kjeden trenger materiale fra ulike steder.",
    },
    {
      sporsmal:
        "Kan innholdet brukes på skjermer i butikk, ikke bare i sosiale medier?",
      svar: "Ja. For Egon leveres hver film i seks formater: til sosiale medier, til skjermer i restaurant og kjøpesenter, og til annonser. Dere har fri bruk av alt vi produserer.",
    },
    {
      sporsmal: "Jobber dere for kjeder utenfor Oslo?",
      svar: "Ja. Reflektor holder til i Oslo og produserer for bedrifter i hele Norge. Egon-materialet dekker restauranter fra sør til nord.",
    },
  ],
  pris: null,
};

export const tjenestesider: Tjenesteside[] = [
  innholdsproduksjon,
  kjeder,
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
    beskrivelse: "Filmen som forklarer, til folk som allerede har funnet dere.",
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
