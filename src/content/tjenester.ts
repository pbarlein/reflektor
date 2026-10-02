import type { Bloggmedie } from "./artikler";
import { kr, site, tilbud } from "./site";

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
  /**
   * Avsnitt som skal stå ETTER punktlista.
   *
   * LAGT TIL 30.09.2026. «Riktig lengde for riktig video» på
   * /reels-produksjon har formen ledesetning → liste → oppsummering, og
   * oppsummeringen hører til etter lista. Uten dette feltet havnet den i
   * `svar` og ble rendret mellom kolonet og punktene den innleder.
   *
   * Feilen var min, ikke copyens. Fanget i nettleseren.
   */
  etterord?: string;
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
  /**
   * Kildehenvisning med utgående lenke, under svaret.
   *
   * LAGT TIL 30.09.2026 for /reels-produksjon, som er den første
   * tjenestesiden som bygger et argument på tall utenfra. Bloggen har hatt
   * `kilde` siden 21.09; tjenestesidene hadde det ikke, fordi de fram til nå
   * bare oppga Reflektors egne fakta.
   *
   * GEO-researchen er entydig på hvorfor det er verdt en egen felttype:
   * «Unsupported claims rarely get cited by AI engines. If you state a claim
   * without linking to data, answer engines cannot verify it and will prefer
   * a competitor who cites specific numbers.» Se docs/synlighet-2026.md.
   *
   * Én kilde per seksjon. Trenger en seksjon to, er den to seksjoner.
   */
  kilde?: { tekst: string; url: string }[];
  /**
   * Film(er) som hører til NETTOPP denne seksjonen.
   *
   * LAGT TIL 29.09.2026, bestilt av Pål: «legg til eksempler på siden basert
   * på hovedmappen med bilder og videoer i dropbox».
   *
   * Sidens `filmer` ligger samlet øverst, før seksjonene. Det er riktig når
   * filmene viser det SIDEN handler om. På /kjeder viser hver film én
   * bestemt kunde, og da hører den hjemme i kundens egen blokk: filmen står
   * som belegg rett under påstanden den belegger. Fire filmer stablet øverst
   * ville tvunget leseren til å huske hvilken som var hvem.
   *
   * Én film fyller spalten. Flere legges på rad — det er formatraden under
   * «Volum og format», der hele poenget er å se de samme 23 sekundene i tre
   * fasonger ved siden av hverandre.
   */
  filmer?: Referansefilm[];
  /**
   * Punkter med egen overskrift, og eventuelt en lenke videre.
   *
   * LAGT TIL 01.10.2026. `punkter` er flate strenger, og det holdt så lenge
   * hvert punkt var én setning. «Hva slags video trenger dere?» på
   * videosiden er fem typer film med hver sin forklaring, og to av dem har
   * sin egen side å peke til. Som flate punkter ville de blitt fem lange
   * setninger uten struktur, og lenkene ville måttet samles i en haug
   * nederst der ingen kan se hvilken som hører til hva.
   */
  delblokker?: {
    tittel: string;
    tekst: string;
    lenke?: { sti: string; tekst: string };
  }[];
  /**
   * Nummerer `delblokker` som en ordnet liste.
   *
   * «Slik jobber vi» er seks steg i rekkefølge. En punktliste sier at
   * rekkefølgen er likegyldig; det er den ikke, og `<ol>` sier det både til
   * leseren og til en språkmodell.
   */
  nummerert?: boolean;
  /**
   * Omtalevideoen fra en kunde, vist i seksjonen.
   *
   * Henter innholdet fra kundecasen, slik at sitatet og filmen står ett
   * sted. Verdien er slugen til caset.
   */
  kundeord?: string;
  /**
   * Et bildegalleri fra ett oppdrag: hovedbilde og tre til fem miniatyrer.
   *
   * SAMME KOMPONENT SOM BLOGGEN BRUKER. Eventsiden og prisguiden viser de
   * samme fem bildene fra den samme kvelden, og da skal de se like ut.
   */
  galleri?: Bloggmedie[];
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
  /**
   * `4/5` kom til 29.09.2026. Det er ikke et webformat vi har funnet på —
   * det er ett av de seks Egon faktisk får levert hver måned, og hele
   * poenget med formatraden på /kjeder er å vise de ekte eksportene.
   */
  format: "16/9" | "9/16" | "4/5";
  alt: string;
  bildetekst: string;
  sekunder: number;
  lyd?: boolean;
};

export type Arbeidsmedie = {
  type: "foto" | "video";
  sti: string;
  alt: string;
  /**
   * Rutenettets format. Standard er stående 9:16, som klippene er.
   *
   * `4/5` finnes fordi /kjeder viser stillfoto og ikke klipp. Arkivbildene
   * er tatt i 2:3 og 3:2, og en 9:16-ramme skjærer bort halve motivet i et
   * liggende bilde. 4:5 tar begge deler med en beskjæring som ikke merkes.
   * Formatet må være likt for alle fire, ellers blir underkanten ujevn.
   */
  format?: "9/16" | "4/5";
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
   * Hvilken pris siden faktisk selger, og dermed hva som markeres opp.
   *
   * LAGT TIL 30.09.2026. Fram til nå var alle tjenestesidene prosjektsider,
   * og layouten sendte derfor `fraPris` til schemaet på alle sammen — altså
   * `minPrice` lik fra-prisen på enkeltprosjekter.
   *
   * /reels-produksjon er den første som selger abonnementet. Der ville
   * fra-prisen på prosjekter vært en usann opplysning: siden sier én pris i
   * brødteksten og schemaet ville sagt en annen. Feil pris i markeringen er
   * verre enn ingen pris — samme begrunnelse som står i Schema.tsx.
   */
  prismodell?: "prosjekt" | "abonnement";
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

/* ────────────────────────────────────────────────────────────────────
   /reklamefilm — filmen dere betaler for å få vist
   ──────────────────────────────────────────────────────────────────── */

export const reklamefilm: Tjenesteside = {
  sti: "/reklamefilm",
  tittel: "Reklamefilm for TV, nett og sosiale medier",
  beskrivelse:
    "Reflektor produserer reklamefilm for TV, nettannonser og sosiale medier. Vi lager filmen. Vi kjøper ikke sendetid. Oslo, for hele Norge.",
  h1: "Reklamefilm",
  merkelapp: "Produksjon",
  tjenestetype: "Produksjon av reklamefilm for betalte flater",
  svar: "En reklamefilm er laget for å vises mot betaling: på TV, som nettannonse eller i sosiale medier. Reflektor står for produksjonen: idé, manus, opptak, klipp, lyd og fargekorrigering. Vi produserer filmen. Vi kjøper ikke sendetid eller annonseplass.",
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
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster, avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nDere kan påvirke tallet selv. Holder dere lokasjon og eventuelle statister eller skuespillere, går prisen ned, og på en reklamefilm er det ofte de to postene som veier mest.`,
    },
    {
      sporsmal: "Hva skiller en reklamefilm fra en vanlig bedriftsvideo?",
      svar: "Hvem som ser den, og hvorfor. En reklamefilm vises for folk som ikke lette etter dere. Den må fange oppmerksomhet den ikke har fått på forhånd, og den betales per visning. En bedriftsvideo på deres egen nettside møter noen som allerede er der og allerede er interessert. Det første krever en idé som stopper skrollingen. Det andre krever klarhet.",
      punkter: [
        "Reklamefilm: betalt flate, kort, må bryte gjennom",
        "Video på egne flater: gratis flate, kan være lengre, skal forklare",
      ],
    },
    {
      sporsmal: "Hvordan foregår en produksjon?",
      svar: "Sju steg, og dere er med på alle de avgjørende. Vi begynner med et introduksjonsmøte, og dere får et løsningsforslag med pris før noe settes i gang.",
      punkter: [
        "Introduksjonsmøte: hva skal filmen gjøre?",
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
      svar: "Reflektor har laget reklamefilm for Vitusapotek, Peppes Pizza og Samlerhuset. Vi har laget TV-reklamen for Vitusapotek i forbindelse med Skal vi danse, og for Peppes i forbindelse med Premier League. Utover reklamefilm har vi produsert foto og video for blant andre Anton Sport, The Well, Egon og Baker Brun.",
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
      svar: "Nei. De fleste kommer med et mål, ikke et manus: «vi skal lansere noe», «vi skal inn på TV til høsten». Idé og manus er en del av produksjonen.",
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
  /*
   * UTVIDET TIL HOVEDSIDEN FOR VIDEO 01.10.2026.
   *
   * BAKGRUNNEN ER SØKETALL OG KONKURRENTENE. «Videoproduksjon» og
   * «videoproduksjon oslo» har 150 søk i måneden hver, «bedriftsvideo» og
   * «bedriftsfilm» 70 og 50, «film produksjon» og «filmproduksjon oslo» 100
   * hver. Alle sidene på side 1 — Noblewolf, M51, Epic Media — dekker alle
   * typer film på én side, med eksempler, prosess, bevis og FAQ.
   *
   * Siden avgrenset seg tidligere til «film til egne flater» og brukte
   * verken ordet «bedriftsfilm» eller «bedriftsvideo». Den hadde ingen
   * prosess og ingen tall. Nå er den hovedsiden; reklamefilm, employer
   * branding og event beholder sine egne sider og lenkes herfra.
   */
  /*
   * TITTELEN ER KORTET 01.10.2026. Levert copy var «Videoproduksjon i Oslo
   * – bedriftsfilm, video og reklamefilm», som med « | Reflektor» ble 71
   * tegn og dermed kuttet i Google rundt 60. «Reklamefilm» er tatt ut: den
   * har sin egen side som rangerer for ordet, og her kostet den plassen til
   * de to ordene som faktisk er nye for denne siden.
   */
  tittel: "Videoproduksjon i Oslo – bedriftsfilm og video",
  beskrivelse:
    "Videoproduksjon for bedrifter i Oslo og hele Norge: bedriftsfilm, video til nettside og sosiale medier, reklamefilm og eventvideo. Fra 40 000 kr per prosjekt.",
  h1: "Videoproduksjon i Oslo",
  merkelapp: "Produksjon",
  tjenestetype: "Videoproduksjon for bedrifter",
  svar: `Reflektor er et produksjonshus i Oslo som lager video for bedrifter i hele Norge: bedriftsfilm, video til nettsiden, innhold til sosiale medier, reklamefilm og eventvideo. Vi står for idé, opptak, klipp, teksting og fargekorrigering. Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr.`,
  avgrensning: [
    "Skal filmen rekruttere og ikke selge, er det ",
    {
      sti: "/employer-branding-video-oslo",
      tekst: "employer branding-video",
    },
    ". Det er et annet publikum, og derfor en annen film. Trenger dere nytt innhold hver måned i stedet for ett prosjekt, er det ",
    { sti: "/", tekst: "SoMe-abonnementet" },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Hva slags video trenger dere?",
      svar: "Vi skiller filmene på hvor de skal vises. Det avgjør lengde, tone og hva filmen må få til.",
      delblokker: [
        {
          tittel: "Bedriftsfilm og bedriftsvideo",
          tekst:
            "Filmen som viser hvem dere er: folkene, arbeidsmåten og det dere faktisk leverer. Den brukes på forsiden av nettsiden, i salgsmøter, på messer og i rekruttering. Den lages som en hovedfilm med kortere versjoner til sosiale medier og LinkedIn.",
        },
        {
          tittel: "Video til nettsiden",
          tekst:
            "Bannervideo øverst på forsiden, film til tjenestesider og det som er vanskelig å forklare i tekst. Et rom, et håndverk eller en maskin i bevegelse er raskere å vise enn å beskrive.",
        },
        {
          tittel: "Innhold til sosiale medier og skjermer",
          tekst:
            "Korte, tekstede klipp i 9:16 og 4:5, laget for å bli sett uten lyd. Vi lager også innhold til skjermer i butikk, i resepsjonen og på messe. Trenger dere dette hver måned, er abonnementet eller Reels-produksjon riktigere enn et prosjekt.",
          lenke: { sti: "/reels-produksjon", tekst: "Reels-produksjon" },
        },
        {
          tittel: "Reklamefilm",
          tekst:
            "Filmen dere betaler for å få vist. Vi har laget TV-reklame for Peppes Pizza og Vitusapotek.",
          lenke: { sti: "/reklamefilm", tekst: "Reklamefilm for TV og nett" },
        },
        {
          tittel: "Eventvideo",
          tekst:
            "Film og foto fra konferanser, lanseringer og firmaarrangementer.",
          lenke: {
            sti: "/eventfotograf-eventvideo",
            tekst: "Eventfoto og eventvideo",
          },
        },
      ],
      etterord: "Skal filmen rekruttere, er det employer branding-video.",
      lenker: [
        {
          sti: "/employer-branding-video-oslo",
          tekst: "Employer branding-video i Oslo",
        },
      ],
    },
    {
      /*
       * SEKS STEG, NUMMERERT. Konkurrentene på side 1 har alle en prosess;
       * denne siden hadde ingen. Den som vurderer et prosjekt til 40 000 kr
       * og oppover vil vite hva som skjer mellom bestilling og levering —
       * og rekkefølgen er en del av svaret, derfor <ol> og ikke <ul>.
       */
      sporsmal: "Slik jobber vi",
      svar: "",
      nummerert: true,
      delblokker: [
        {
          tittel: "Introduksjonsmøte",
          tekst:
            "Hva skal filmen få til, for hvem, og hvor skal den vises? Dere trenger ikke manus. Et mål holder.",
        },
        {
          tittel: "Forslag med pris",
          tekst:
            "Dere får et løsningsforslag med fast pris innen tre virkedager. Vi bruker ikke timepriser.",
        },
        {
          tittel: "Planlegging",
          tekst:
            "Vi lager kjøreplan og avtaler lokasjon, medvirkende og hvilke formater dere trenger, før opptaksdagen.",
        },
        {
          tittel: "Opptak",
          tekst:
            "Som regel hos dere, der folkene og produktene er. Vi har med kamera, lys og lyd.",
        },
        {
          tittel: "Klipp og korrigering",
          tekst:
            "Dere ser et utkast og gir tilbakemelding før vi ferdigstiller. Teksting og fargekorrigering er inkludert.",
        },
        {
          tittel: "Levering",
          tekst:
            "Ferdige filer i alle formatene dere trenger, som regel innen to uker etter opptaksdagen. Alt er deres, med fri bruk.",
        },
      ],
    },
    {
      /*
       * BEVISET, OG DET ER TO TYPER. Videoen er kunden i egne ord; tallene
       * under er målt. Axel Hauges sitat sto tidligere på «Hvem produserer
       * Reflektor for?» — det er flyttet hit, der de andre kundeordene står.
       */
      sporsmal: "Kunden om oss",
      svar: "Soulcake har brukt oss til foto og video siden 2022. Over 80 prosent av foto og video på @soulcake.oslo kommer fra Reflektor, og reelsene har hatt 6,8 millioner visninger fra april 2022 til september 2026.",
      kundeord: "soulcake",
      lenker: [{ sti: "/vart-arbeid/soulcake", tekst: "Les Soulcake-casen" }],
      sitat: {
        tekst:
          "Vi liker spesielt godt hvordan de får alle til å føle seg avslappet, naturlig og finne seg til rette foran kamera, selv med lite modell-erfaring fra tidligere. De ser aldri begrensninger og heller muligheter uansett årstid eller lokasjon.",
        navn: "Axel Hauge",
        rolle: "Anton Sport",
      },
    },
    {
      sporsmal: "Hva koster videoproduksjon?",
      svar: `Enkeltprosjekter hos oss starter på ${kr(tilbud.fraPrisProsjekt)} kr. Hvor prosjektet lander, avhenger av tre ting: antall opptaksdager, hvor mange som må være på settet og hvor mye etterarbeid filmen krever. Holder dere lokasjon og medvirkende selv, går prisen ned.\n\nTrenger dere video hver måned og ikke én gang, er løpende produksjon ${kr(tilbud.prisPerManed)} kr/mnd for én produksjonsdag og ${tilbud.videoerPerManed} ferdige videoer.`,
      lenker: [
        {
          sti: "/blogg/hva-koster-videoproduksjon",
          tekst:
            "Hva koster videoproduksjon? Vi har sammenlignet norske prisguider",
        },
      ],
    },
    {
      sporsmal: "Hvor mange filmer får vi ut av én dag?",
      svar: "Det kommer an på kompleksitet og omfang, og vi tilpasser leveransen til det hver enkelt kunde faktisk trenger. Er volum viktigere enn produksjonsverdi, er det planleggingen som avgjør, og da legger vi dagen opp for å nå et bestemt antall. Til sammenligning er abonnementet bygget på at én produksjonsdag gir 8–10 ferdige videoer, men da filmer vi løpende innhold og rigger ikke om mellom hvert oppsett. Si hva tallet skal være, så planlegger vi mot det.",
    },
    {
      sporsmal: "Hvem lager Reflektor video for?",
      svar: "Anton Sport, The Well, Peppes Pizza, Egon, Baker Brun, Idun Industri, Selvaag, Retail24, Centropa, Happis og Soulcake. Bransjene er retail, restaurant og mat, eiendom, finans og industri. Ikke alle er abonnementskunder.",
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
      svar: "Vi leverer som regel innen to uker etter opptaksdagen. Haster det, sier dere fra i planleggingen. Ved spesielle behov kan vi levere raskere.",
    },
    {
      sporsmal: "Hvor mange versjoner av filmen får vi?",
      svar: "Det avtaler vi før opptak. Som regel får dere en hovedfilm og kortere versjoner i formatene dere trenger, for eksempel 16:9 til nettsiden og 9:16 og 4:5 til sosiale medier. Det er billigere å planlegge versjonene før opptaksdagen enn å klippe om etterpå.",
    },
    {
      sporsmal: "Hvor lang bør en bedriftsfilm være?",
      svar: "Kortere enn de fleste tror. En hovedfilm til nettsiden fungerer ofte best på ett til to minutter, med kortere klipp på 15–60 sekunder til sosiale medier. Vi klipper som regel flere lengder fra samme opptak.",
    },
    {
      sporsmal: "Lager dere video utenfor Oslo?",
      /*
        GATEADRESSEN LESES FRA `site.kontakt`, ikke skrevet inn. NAP-
        konsistens er ett av de fire punktene AGENTS.md sier synligheten
        faktisk krever, og en adresse skrevet to steder er en adresse som
        før eller siden står ulikt. Postnummeret kuttes fordi setningen
        allerede sier «i Oslo».
      */
      svar: `Ja. Reflektor holder til i ${site.kontakt.adresse.split(",")[0]} i Oslo og produserer for bedrifter i hele Norge, blant annet for Retail24 i Sandefjord.`,
    },
  ],
  pris: null,
  /* VIDEO TIL EGNE FLATER. The Well og Soulcake sto her fra før og passer.
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
  svar: "Employer branding-video er film som skal få folk til å søke jobb hos dere. Den vises i stillingsannonser, på karrieresiden og i rekrutteringskanaler, ikke til kundene deres, men til dem dere vil ansette. Reflektor filmer hos dere, med de ansatte dere faktisk har.",
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
      svar: "De som faktisk jobber der, og helst ikke bare ledelsen. Vi bruker ikke skuespillere. En arbeidsplass som er satt i scene, er lett å gjennomskue, og da mister filmen troverdighet. Vi filmer folk mens de gjør jobben sin.",
      sitat: {
        tekst:
          "Det som virkelig skiller dem ut, er hvor samarbeidsvillige og engasjerte de er. De stiller opp, byr på seg selv, og er rett og slett kjempefine folk man blir glad i.",
        navn: "Marion Ilona Heggland Skjørberg",
        rolle: "Baker Brun",
      },
    },
    {
      sporsmal: "Hva koster en employer branding-video?",
      svar: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden. Hva et prosjekt faktisk koster, avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.\n\nÉn film dekker én stilling. Skal dere fremstå som en attraktiv arbeidsgiver over tid, må folk se dere også i periodene dere ikke lyser ut noe. Kontinuitet er nøkkelen her, og mange velger derfor et løpende samarbeid framfor en enkeltproduksjon.`,
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
      svar: "Nei. Mange av de beste rekrutteringsfilmene har ingen som snakker, bare folk som jobber og tekst som forklarer. Vi avtaler formen på forhånd, og ingen blir satt foran et kamera uten å vite om det.",
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
  /*
   * KORTET 01.10.2026. Levert copy ble 79 tegn med « | Reflektor» og ble
   * kuttet midt i «firmaarrangement». Begge søkeordene — eventfotograf og
   * eventvideo — og stedet står igjen; «konferanse og firmaarrangement»
   * står i meta description i stedet, der det er plass.
   */
  tittel: "Eventfotograf og eventvideo i Oslo",
  beskrivelse:
    "Eventfotograf og eventvideo for konferanser, lanseringer og firmaarrangementer. Eventvideo, klipp til sosiale medier og 50+ bilder. Fra 40 000 kr.",
  h1: "Eventfotograf og eventvideo",
  merkelapp: "Produksjon",
  tjenestetype: "Foto- og videodekning av arrangementer",
  svar: "Eventdekning er foto og film fra noe som skjer én gang: en konferanse, en lansering, en messe eller et firmaarrangement. Jobben er å komme hjem med materiale dere kan bruke i ettertid: innhold til kanalene, og bilder dere kan invitere med neste gang.",
  avgrensning: [
    "Dette er dekning av noe som faktisk skjer. Skal filmen planlegges fra bunnen i stedet, er det ",
    { sti: "/videoproduksjon-i-oslo", tekst: "planlagt videoproduksjon" },
    ". Skal den vises som betalt annonse, er det ",
    { sti: "/reklamefilm", tekst: "reklamefilm" },
    ".",
  ],
  seksjoner: [
    {
      /*
       * LEVERANSEN FØRST. Konkurrentene på side 1 viser pris, leveranse og
       * eksempler; denne siden hadde pris, men ingen konkret leveranse og
       * ingen eksempler. Den som søker «eventfotograf» vil vite hva som
       * kommer ut av dagen, og det svaret skal ikke ligge nede i en FAQ.
       */
      sporsmal: "Dette får dere fra et arrangement",
      svar: "Vi filmer og tar bilder på samme arrangement. En typisk leveranse er:",
      punkter: [
        "en eventvideo på 30–60 sekunder",
        "én eller flere kortere versjoner til sosiale medier",
        "50 bilder eller flere, ferdig redigert",
        "redigering og korrigeringer til dere er fornøyde",
      ],
      etterord: `Enkeltoppdrag starter på ${kr(tilbud.fraPrisProsjekt)} kr. Skal foredrag, seminarer eller debatter filmes i sin helhet, blir jobben større, og prisen deretter.`,
    },
    {
      /*
       * EKSEMPELET ER DET SAMME SOM I PRISGUIDEN, med vilje: samme kveld,
       * samme film, samme fem bilder, samme komprimerte filer. To ulike
       * eksempler på to sider om samme tjeneste ville sagt mindre, ikke mer
       * — og den som kommer fra bloggen til tjenestesiden skal kjenne seg
       * igjen.
       */
      sporsmal: "Eksempel: Retail24 i Sandefjord",
      svar: "Retail24 er abonnementskunde hos oss. I august 2026 brukte de månedens produksjonsdag på et arrangement i Sandefjord. Leveransen ble én eventvideo, åtte intervjuer og rundt 190 ferdig redigerte bilder.",
      filmer: [
        {
          sti: "/arbeid/retail24-sandefjord",
          format: "16/9",
          alt: "Eventvideo fra et firmaarrangement i Sandefjord",
          bildetekst:
            "Eventvideoen fra kvelden. 1 minutt og 43 sekunder, filmet og klippet av Reflektor.",
          sekunder: 103,
          lyd: true,
        },
      ],
      galleri: [
        {
          slag: "foto",
          sti: "/arbeid/retail24-sandefjord-1",
          format: "16/9",
          alt: "Gjester samlet rundt buffeten i hagen under et firmaarrangement",
        },
        {
          slag: "foto",
          sti: "/arbeid/retail24-sandefjord-2",
          format: "16/9",
          alt: "Smilende gjester rundt et bord under arrangementet",
        },
        {
          slag: "foto",
          sti: "/arbeid/retail24-sandefjord-3",
          format: "16/9",
          alt: "Murbygning med rød løper og veteranbil foran inngangen",
        },
        {
          slag: "foto",
          sti: "/arbeid/retail24-sandefjord-4",
          format: "16/9",
          alt: "Servitør i et mørkt, panelkledd rom med tente lysestaker",
        },
        {
          slag: "foto",
          sti: "/arbeid/retail24-sandefjord-5",
          format: "9/16",
          alt: "Champagnetårn av glass på en antikk kommode",
        },
      ],
      etterord: `Har dere flere arrangementer i året, kan produksjonsdagen i abonnementet til ${kr(tilbud.prisPerManed)} kr/mnd legges til et arrangement.`,
      lenker: [{ sti: "/", tekst: "Les om abonnementet" }],
    },
    {
      sporsmal: "Hva får dere igjen for å dokumentere et arrangement?",
      svar: "Materiale som lever lenger enn dagen. Bildene og klippene fra en konferanse er det som selger neste års konferanse, og de fyller kanalene i ukene etterpå. Et arrangement uten dekning er en investering som forsvinner samme kveld.",
    },
    {
      /*
       * LEVERANSELISTA ER LAGT TIL 30.09.2026, bestilt i copyen til
       * prisguiden for eventfoto. De to sidene svarte på det samme
       * spørsmålet med ulik presisjon: bloggen listet hva som faktisk
       * kommer ut av dagen, mens denne siden bare oppga prisen. En leser
       * som sammenligner dem skulle ikke lure på om det er to tilbud.
       *
       * Setningen om produksjonsdagen står også begge steder nå. Den er
       * poenget for kunder med noen arrangementer i året: da bestiller de
       * ikke eventdekning per gang.
       *
       * KVELDSARBEID ER IKKE LENGER OPPGITT SOM DEN VANLIGSTE ÅRSAKEN til
       * at prisen stiger. Rettet 30.09.2026 etter Påls korreksjon: «vi kan
       * også si 50K for et event der vi ikke jobber kveld, så bastant
       * påstand om at det er den vanligste årsaken til prisøkning må vekk.»
       *
       * Setningen står nå med de tre faktorene som faktisk avgjør, uten å
       * rangere dem. Å peke ut én driver som den vanligste er dessuten et
       * tall vi ikke har.
       */
      sporsmal: "Hva koster eventfotograf?",
      svar: `Eventdekning hos oss starter på ${kr(tilbud.fraPrisProsjekt)} kr. Da filmer vi og tar bilder på samme arrangement: eventvideo, kortere klipp til sosiale medier og 50+ ferdig redigerte bilder. Løpende samarbeid er ${kr(tilbud.prisPerManed)} kr i måneden, og produksjonsdagen kan legges til et arrangement.\n\nDet som flytter prisen, er hvor lenge vi er der, hvor mange som må være til stede samtidig, og hvor mye som skal klippes etterpå.`,
      lenker: [
        {
          sti: "/blogg/hva-koster-eventfotograf",
          tekst: "Hva koster en eventfotograf i Oslo? Se prisene i markedet",
        },
      ],
    },
    {
      sporsmal: "Når får vi materialet?",
      svar: "Som regel innen to uker. Må deler av leveransen ut samme kveld eller dagen etter, får vi som regel til det. Si fra i planleggingen, så legger vi opp dagen etter det.",
    },
    {
      /*
       * SISTE SETNING OMSKREVET 01.10.2026. Her sto «På større arrangementer
       * er det som regel to personer, fordi én ikke kan gjøre begge deler
       * samtidig uten å gå glipp av noe.»
       *
       * Det er den samme feilen Pål fanget i eventprisguiden 30.09.2026, og
       * jeg overså den her i gjennomgangen samme dag. Én produsent dekker
       * som regel begge deler hos oss, og de får det til. Setningen sier nå
       * det samme om PRIS, uten å si noe om kvalitet. Se AGENTS.md.
       */
      sporsmal: "Foto, film eller begge deler?",
      svar: "De fleste arrangementer trenger begge. Bilder er raskest ut og enklest å bruke i mange kanaler. Film fanger stemningen og taleren. Hos oss dekker som regel én produsent begge deler. Skal flere ting skje samtidig, som scene, mingling og intervjuer i parallell, setter vi på flere folk, og da blir jobben større.",
    },
    {
      sporsmal: "Arrangementer vi dekker",
      svar: "",
      punkter: [
        "Konferanser og seminarer",
        "Kick-off og firmafester",
        "Produktlanseringer og åpninger",
        "Messer og stands",
        "Prisutdelinger og jubileer",
      ],
    },
  ],
  faq: [
    {
      sporsmal: "Dekker dere arrangementer utenfor Oslo?",
      svar: "Ja. Reflektor holder til i Oslo og jobber i hele Norge.",
    },
    {
      sporsmal: "Hva er en eventvideo?",
      svar: "En kort film på 30–60 sekunder som fanger stemningen på et arrangement: folkene, høydepunktene og det som ble sagt. Den brukes til å oppsummere arrangementet i sosiale medier og til å invitere til neste.",
    },
    {
      sporsmal: "Kan dere filme hele foredrag i tillegg til eventvideo?",
      svar: "Ja. Skal foredrag, seminarer eller debatter filmes i sin helhet, planlegger vi med flere kameraer og egen lyd. Det gjør jobben større, så si fra tidlig i planleggingen.",
    },
    {
      sporsmal: "Trenger dere en kjøreplan på forhånd?",
      svar: "Ja, i grove trekk. Vi trenger å vite når det som må dekkes faktisk skjer: talen, avdukingen, prisutdelingen. Resten løser seg i rommet.",
    },
    {
      sporsmal: "Kan vi bruke bildene i annonser?",
      svar: "Ja. Innholdet er deres, med fri bruk. Husk at folk på bildene må ha samtykket til å bli fotografert. Det er arrangørens ansvar, og vi hjelper gjerne med hvordan det løses i praksis.",
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
    "Innholdsproduksjon fra Reflektor: reklamefilm, video til egne flater, employer branding og eventdekning, som prosjekt eller fast månedspris.",
  h1: "Innholdsproduksjon",
  merkelapp: "Oversikt",
  tjenestetype: "Produksjon av foto og video for bedrifter",
  svar: "Innholdsproduksjon er arbeidet med å lage foto og video en bedrift kan bruke: til annonser, til nettsiden, til rekruttering og til sosiale medier. Reflektor gjør det på to måter: som enkeltprosjekter, eller som løpende produksjon til fast månedspris. Hvilken av dem som passer, avhenger av om behovet er en kampanje eller en kalender.",
  /*
   * FJERNET 27.09.2026. Her sto «Denne siden er oversikten. Hver tjeneste
   * har sin egen side …». Rett under står eikene — fire kort som viser
   * nøyaktig det samme, med lenker. Setningen var en innledning til noe
   * leseren allerede ser.
   */
  avgrensning: null,
  seksjoner: [
    {
      sporsmal: "Prosjekt eller abonnement: hva trenger dere?",
      svar: "Et prosjekt har en start og en slutt: en lansering, en kampanje, en stilling som skal fylles. Et abonnement er for dere som trenger noe nytt å publisere hver uke, året rundt. Mange begynner med ett prosjekt. Viser det seg at dere trenger påfyll hver måned, blir abonnement som regel rimeligere enn å bestille ett prosjekt av gangen.",
      punkter: [
        `Prosjekt: én leveranse, avtalt omfang, fra ${kr(tilbud.fraPrisProsjekt)} kr`,
        `Abonnement: ${site.navn} produserer og publiserer løpende, ${kr(tilbud.prisPerManed)} kr/mnd`,
      ],
      /*
       * LENKENE ER LAGT TIL 30.09.2026. Naven rutet bare til de fire
       * prosjekttjenestene — se `eiker` nederst i fila. Den andre halvdelen
       * av svaret, det løpende, hadde ingen vei videre i det hele tatt, og
       * /kjeder og /reels-produksjon var dermed usynlige fra naven.
       *
       * De ligger her og ikke i `eiker` med vilje. Eikene er sortert etter
       * FLATE — betalt, egen, rekruttering, dokumentasjon — og det er en
       * taksonomi de to løpende tjenestene ikke hører hjemme i. Å presse dem
       * inn ville gjort seks kort av fire og ødelagt logikken som gjør
       * eikene lesbare.
       */
      lenker: [
        { sti: "/", tekst: "SoMe-abonnementet, med pris og leveranse" },
        { sti: "/reels-produksjon", tekst: "Reels-produksjon til fast pris" },
        { sti: "/kjeder", tekst: "Løpende produksjon for kjeder og retail" },
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
      svar: `Et prosjekt starter på ${kr(tilbud.fraPrisProsjekt)} kr, og hvor det lander, avgjøres av tre ting. Vi bruker ikke timepriser, så prisen avtales før vi begynner. Abonnementet har ingen slik variasjon: ${kr(tilbud.prisPerManed)} kr/mnd er prisen hver måned, for én produksjonsdag, ${tilbud.videoerPerManed} ferdig redigerte videoer som produksjonsmål og publisering ${tilbud.posterPerUke} ganger i uka.`,
      punkter: [...tilbud.prisdrivere],
    },
    {
      sporsmal: "Hvem produserer Reflektor for?",
      svar: "Anton Sport, The Well, Peppes Pizza, Egon, Baker Brun, Idun Industri, Selvaag, Retail24, Centropa, Happis og Soulcake. Bransjene er retail, restaurant og mat, eiendom, finans, industri og teknologi.",
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
      svar: "Innholdsproduksjon er å lage materialet. Markedsføring er å bestemme hvor det skal vises og betale for det. Reflektor produserer, og for abonnementskundene publiserer vi også i sosiale medier. Vi kjøper ikke annonseplass og styrer ikke annonsebudsjetter.",
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
   /reels-produksjon — kort stående video til fast pris
   ──────────────────────────────────────────────────────────────────── */

/**
 * SIDEN ER TILTAK 1 I AEO-PLANEN, og copyen er levert ferdig av Claude Chat
 * 30.09.2026. Jeg har satt den inn, ikke skrevet den.
 *
 * HVORFOR «REELS» OG IKKE «TIKTOK». Chats begrunnelse, gjengitt fordi den
 * styrer hele sidens ordvalg: «reels» har 1 300 søk i måneden i Norge,
 * «tiktok byrå» har 0. TikTok nevnes likevel eksplisitt der det gir mening,
 * fordi AEO-promptene 8 og 12 bruker ordet.
 *
 * DEN MOTSIER IKKE FAQ-EN. `/faq` sier at vi publiserer i to kanaler
 * bevisst. Denne siden selger PRODUKSJONEN av kort stående video og sier
 * rett ut hvem som publiserer hvor — filene leveres i 9:16, og kunden står
 * fritt til å bruke dem på TikTok og YouTube Shorts.
 *
 * TO TALL ER JUSTERT MOT KILDEN, og det er den eneste endringen i copyen:
 *
 * 1. «Etter 90 sekunder faller rekkevidden tydelig» → «over to minutter».
 *    Socialinsiders bøtter er under 30 s: 5,20 %, 30–60 s: 5,60 %,
 *    60–90 s: 5,30 % og over 120 s: 3,50 %. Fallet er dokumentert over 120
 *    sekunder, ikke over 90.
 * 2. «bedriftskontoer med under 10 000 følgere» → «1 000–5 000 følgere».
 *    Tallet 65,5 % gjelder båndet 1–5K i kilden. 5–10K er ikke oppgitt.
 *
 * Begge er kontrollert mot kilden 30.09.2026. Metas formuleringer er
 * derimot gjengitt riktig og ordrett: «Feature your brand and key message
 * within the first 3 seconds» og «Shorter videos (6–15 seconds) are more
 * effective».
 *
 * AVGRENSNINGEN ER SKREVET 30.09.2026, på Påls beskjed: «strukturer slik du
 * mener er best mtp instrukser om hva som ikke dekkes. sørg for at ingen
 * sider konkurrerer med hverandre.»
 *
 * Den var det eneste som manglet da siden ble bygget, og den er ikke
 * pynt: dette er siden med størst overlapp på hele nettstedet. Forsiden
 * selger det samme abonnementet til den samme prisen. Forskjellen er hvilket
 * spørsmål de svarer på — «hvem lager Reels til fast pris» mot «hva koster et
 * SoMe-byrå» — og uten en setning som sier det, konkurrerer de to om det
 * samme signalet.
 *
 * Avgrensningen peker derfor OPPOVER til forsiden, ikke sidelengs til
 * søsterssidene: leseren som vil ha hele leveransen beskrevet, skal dit.
 * De to andre lenkene skiller mot de to nærmeste formene for film.
 */
export const reelsproduksjon: Tjenesteside = {
  sti: "/reels-produksjon",
  tittel: "Reels-produksjon for bedrifter – fast pris",
  /*
   * KORTET FRA 177 TIL 155 TEGN 01.10.2026. Google kutter rundt 160. «Én
   * produksjonsdag i måneden» er tatt ut — prisen og videotallet sier det
   * samme til den som skanner et søkeresultat.
   */
  beskrivelse:
    "Merkevarebyggende Reels til Instagram og Facebook, levert stående i 9:16 og klare for TikTok og YouTube Shorts. 8–10 ferdige videoer, 30 000 kr/mnd.",
  h1: "Reels som bygger merkevaren deres, ikke bare følgertallet",
  merkelapp: "Reels-produksjon",
  tjenestetype: "Produksjon av Reels og kort stående video til fast pris",
  prismodell: "abonnement",
  svar: `Vi produserer korte, stående videoer for bedrifter i hele Norge til fast pris. Én produksjonsdag i måneden hos dere gir ${tilbud.videoerPerManed} ferdige Reels. Vi publiserer dem på Instagram og Facebook. Dere får filene i 9:16, og de er klare for TikTok og YouTube Shorts hvis dere vil bruke dem der også.`,
  /*
   * TOPPBILDET VAR ET UTTREKK FRA FILM. Byttet 30.09.2026 etter Påls
   * beskjed: «sørg for at ... du ikke tar screen shots fra videoer.» Han
   * har rett, og feilen var min: arkivet har nesten ingen FOTOGRAFIER av
   * oss selv på jobb — bak-kulissene-materialet er film — og i stedet for
   * å si det, klippet jeg ut enkeltbilder som så ut som nettopp det de var.
   *
   * ERSTATNINGEN ER DET ENESTE EKTE OPPTAKSBILDET VI HAR: en kunde som
   * blir filmet på lokasjon, med fotografen i bildet. Det er nøyaktig det
   * denne siden selger — vi kommer ut og filmer — og derfor er det denne
   * siden som får det, og ikke bloggartikkelen det sto på før.
   */
  bilde: {
    fil: "popup-arbeid-1800",
    alt: "En kunde blir filmet bak disken i en popup-butikk",
  },
  avgrensning: [
    "Denne siden handler om formatet: kort, stående video produsert løpende. Vil dere se hele leveransen med strategi, publisering og vilkår beskrevet samlet, står den på ",
    { sti: "/", tekst: "siden om SoMe-abonnementet" },
    ". Skal dere ha én film til én kampanje i stedet for innhold hver måned, er det ",
    { sti: "/reklamefilm", tekst: "reklamefilm" },
    ". Og skal filmen ligge på nettsiden eller på en skjerm i stedet for i feeden, er det ",
    { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
    ".",
  ],
  seksjoner: [
    {
      sporsmal: "Kort video er der kundene deres ser dere først",
      svar: "For mindre bedriftskontoer er Reels det formatet som når flest. Socialinsider analyserte 140 000 Reels fra bedrifter i første halvår 2026. Blant kontoer med 1 000–5 000 følgere nådde Reels i snitt 9,8 % av følgerne, mot 8,8 % for karuseller og 7,0 % for bilder.\n\nProblemet er sjelden kanalen. Problemet er at video tar tid. Noen må finne ideene, filme, klippe, tekste og poste, og gjøre det uke etter uke. Hos de fleste bedrifter stopper det etter den tredje videoen.\n\nVi tar hele den jobben. Dere stiller opp én dag i måneden.",
      kilde: [
        {
          tekst:
            "Tallene er fra Socialinsiders analyse av 140 000 Instagram Reels publisert av bedriftskontoer mellom januar og juni 2026.",
          url: "https://www.socialinsider.io/blog/instagram-reels-statistics",
        },
      ],
    },
    {
      sporsmal: "Merkevarebygging, ikke trendjag",
      svar: "En trendvideo kan få mange visninger, men blir fort glemt. Vi lager Reels som gjør at folk husker hvem de så:",
      punkter: [
        "Faste formater som går igjen. Seerne kjenner dere igjen før de ser logoen.",
        "Ekte folk og ekte arbeid. Ansatte, produkter og hverdagen hos dere. Ikke stockfilm og dansetrender.",
        "Tydelig uttrykk. Samme tone, farger og tekststil i hver video, slik at feeden henger sammen.",
        "Laget for å ses uten lyd. Alle videoer har tekst på skjermen, fordi mange scroller forbi med lyden av.",
      ],
    },
    {
      /*
       * REN LISTE, UTEN LEDESETNING. Copyen har ingen, og jeg skriver den
       * ikke. Layouten hopper over tomme avsnitt — se Tjenestelayout.
       */
      sporsmal: "Slik fungerer det",
      svar: "",
      punkter: [
        "Plan. Før hver produksjonsdag lager vi et opptaksmanus med ideer og formater. Dere godkjenner det før vi kommer.",
        "Produksjonsdag. Vi kommer til dere med utstyr og filmer alt på én dag. Dere trenger ikke forberede noe annet enn å være til stede.",
        `Klipp og publisering. Vi klipper ${tilbud.videoerPerManed} ferdige Reels, tekster dem og publiserer ${tilbud.posterPerUke} ganger i uka på Instagram og Facebook.`,
        "Filene er deres. Dere får alle videoene i 9:16 og kan bruke dem på TikTok, YouTube Shorts, nettsiden eller i annonser.",
      ],
      filmer: [
        {
          sti: "/arbeid/bts-baker-brun",
          format: "9/16",
          alt: "Stillbilde fra opptak: kamera på rigg over et bord med kaker.",
          bildetekst: "Baker Brun. Bak kulissene fra en produksjonsdag.",
          sekunder: 23,
        },
        {
          sti: "/arbeid/bts-anton-sport",
          format: "9/16",
          alt: "Stillbilde fra opptak: filmfotograf med kamera på gimbal ute om høsten.",
          bildetekst: "Anton Sport. Bak kulissene fra en dag på lokasjon.",
          sekunder: 27,
        },
      ],
      lenker: [
        {
          sti: "/blogg/hva-er-en-produksjonsdag",
          tekst: "Les hva en produksjonsdag er",
        },
      ],
    },
    {
      sporsmal: "Én film, flere formater",
      svar: "Vi filmer med tanke på gjenbruk. Det samme opptaket kan bli en Reel, en kortere versjon til annonser og et stillbilde til feeden. Dere får mer ut av dagen uten å betale for flere dager.",
      filmer: [
        {
          sti: "/arbeid/kjeder-format-16x9",
          format: "16/9",
          alt: "Stillbilde fra filmen i 16:9-format: en rett fotografert ovenfra.",
          bildetekst: "16:9",
          sekunder: 23,
        },
        {
          sti: "/arbeid/kjeder-format-4x5",
          format: "4/5",
          alt: "Stillbilde fra filmen i 4:5-format: en rett fotografert ovenfra.",
          bildetekst: "4:5",
          sekunder: 23,
        },
        {
          sti: "/arbeid/kjeder-format-9x16",
          format: "9/16",
          alt: "Stillbilde fra filmen i 9:16-format: en rett fotografert ovenfra.",
          bildetekst: "9:16",
          sekunder: 23,
        },
      ],
    },
    {
      sporsmal: "Riktig lengde for riktig video",
      svar: "Det finnes ingen fasit for hvor lang en Reel skal være. Lengden avhenger av hva videoen skal gjøre, så vi velger den for hver enkelt video:",
      etterord:
        "Uansett lengde bruker vi mest tid på de første sekundene. På bedriftskontoer med 1 000–5 000 følgere sveiper rundt 65 % av seerne videre innen tre sekunder, ifølge den samme analysen. Det er der seeren bestemmer seg for å bli.",
      punkter: [
        "Produktvideo og annonser: 6–15 sekunder. Meta anbefaler selv korte videoer, der merkevaren og budskapet kommer i løpet av de første tre sekundene.",
        "Bak kulissene eller en ansatt som forteller: 30–60 sekunder. Det gir rom for en start som fanger, en historie og en avslutning. I Socialinsiders analyse av 140 000 Reels fra bedrifter nådde Reels på 30–60 sekunder litt lenger ut enn både kortere og lengre videoer. Over to minutter faller rekkevidden tydelig.",
        "Forklaring eller tips: så lang som poenget krever, men ikke et sekund lenger.",
      ],
      kilde: [
        {
          tekst:
            "Meta anbefaler «shorter videos (6–15 seconds)» og at merkevaren og hovedbudskapet vises «within the first 3 seconds».",
          url: "https://www.facebook.com/business/help/188534925073536",
        },
        {
          tekst:
            "Rekkevidde etter lengde og andelen som sveiper videre innen tre sekunder er fra Socialinsiders analyse av 140 000 Reels fra bedriftskontoer, januar–juni 2026.",
          url: "https://www.socialinsider.io/blog/instagram-reels-statistics",
        },
      ],
    },
    {
      sporsmal: "Klare for TikTok og YouTube Shorts",
      svar: "Vi publiserer på Instagram og Facebook. Alle videoene leveres i 9:16, som er formatet TikTok og YouTube Shorts bruker. Dere kan legge ut de samme filene der uten ekstra produksjon.",
    },
    {
      /* REN LISTE, som «Slik fungerer det». Copyen har ingen ledesetning. */
      sporsmal: "Hva som er inkludert",
      svar: "",
      punkter: [
        "Strategi og opptaksmanus før hver produksjonsdag",
        "Én produksjonsdag i måneden hos dere",
        `${tilbud.videoerPerManed} ferdig klippede Reels med tekst`,
        `Publisering ${tilbud.posterPerUke} ganger i uka på Instagram og Facebook`,
        "Alle filer i 9:16 til fri bruk på andre kanaler",
        `Fast pris: ${kr(tilbud.prisPerManed)} kr/mnd, ingen bindingstid og tre måneders oppsigelse`,
      ],
    },
    {
      sporsmal: "Se hva vi har laget",
      /*
       * BRANSJELISTA ER BEKREFTET AV PÅL 30.09.2026. Den sto som en
       * BEKREFT-plassholder i under ett døgn: mat og retail var dekket av
       * kundelista i site.ts, mens eiendom og teknologi ikke var belagt noe
       * sted i repoet.
       *
       * Påls svar, ordrett: «ja, vi kan si eiendom og teknologi. vi har
       * blant annet Selvaag Eiendom på abonnementet.» Bildet nederst i
       * `arbeid` er hentet fra nettopp den kundemappen.
       *
       * NAVNET ER GODKJENT SAMME DAG. Spørsmålet ble stilt fordi en bransje
       * kan nevnes uten navn, mens et navn krever at Pål godkjenner nettopp
       * det navnet. Svaret var «Ja, selvaag eiendom skal stå med navn», og
       * skrivemåten under er hans egen.
       *
       * ETT NAVN, IKKE HELE LISTA. Kundelista står allerede to steder på
       * nettstedet, og den hører hjemme der. Her er poenget at eiendom ikke
       * er en påstand: ett navn som kan etterprøves gjør mer for troverdig-
       * heten enn elleve som leseren må ta på tro.
       */
      svar: "Vi har produsert foto og video for bedrifter innen mat, eiendom, retail og teknologi, blant annet Selvaag Eiendom.",
      lenker: [{ sti: "/vart-arbeid", tekst: "Se kundecasene våre" }],
    },
  ],
  faq: [
    {
      sporsmal: "Kan vi legge ut Reels-videoene på TikTok selv?",
      svar: "Ja. Alle videoene leveres stående i 9:16, som er formatet TikTok bruker. Dere eier filene og kan publisere dem der, på YouTube Shorts eller hvor dere vil.",
    },
    {
      sporsmal: "Hva er forskjellen på en merkevare-Reel og en trendvideo?",
      svar: "En trendvideo låner en lyd eller et format som alle andre også bruker. En merkevare-Reel bygger på det som er unikt for dere: folkene, produktene og måten dere jobber på. Den varer lenger, og seerne husker hvem den kom fra.",
    },
    {
      sporsmal: "Hvem står foran kamera?",
      svar: "Det avgjør dere. Mange bruker ansatte, fordi ekte folk gir mer tillit enn skuespillere. Andre filmer bare produkter, lokaler eller prosesser. Vi hjelper dere som ikke er vant til kamera med å bli komfortable.",
    },
    {
      sporsmal: "Må vi komme med ideene selv?",
      svar: "Nei. Vi lager opptaksmanus før hver produksjonsdag. Dere kommer gjerne med innspill, men dere trenger ikke å gjøre det.",
    },
    {
      sporsmal: "Hvor raskt kommer de første videoene ut?",
      svar: "Vanligvis innen en uke etter første produksjonsdag. Dere trenger bare å gi oss tilgang til kontoene og godkjenne materialet.",
    },
    {
      sporsmal: "Hvor lang bør en Reel være?",
      svar: "Det kommer an på hva videoen skal gjøre. Produktvideoer og annonser fungerer best på 6–15 sekunder, som også er det Meta anbefaler. En historie fra bak kulissene trenger gjerne 30–60 sekunder. Over to minutter faller rekkevidden tydelig. Vi velger lengde etter innholdet, ikke etter en fast regel.",
    },
  ],
  pris: null,
  /*
   * «FRA ARBEIDET» ER REEL-VEGGEN PÅ DENNE SIDEN. Chat ba om den under
   * «Merkevarebygging»; rutenettet står lenger nede, der copyen uansett
   * ender på «Se hva vi har laget».
   *
   * TRE STÅENDE KLIPP, IKKE FIRE FLATER. Bestilt av Pål 30.09.2026:
   * «eksempelet over burde være tre stående ved siden av hverandre og
   * autoplay.» Her sto tre klipp og ett stillbilde fra en byggeplass, og
   * bildet var feil på to måter: det var en flate uten bevegelse på en side
   * om kort video, og motivet lignet et eiendomsprospekt mer enn innhold
   * til en feed. Påls dom: «dette er et elendig bilde å bruke her.»
   *
   * DE TRE ER PÅLS EGNE FORSLAG — Anton Sport, Egon og Soulcake. De
   * dekker sportsbutikk, restaurantkjede og bakeri, alle tre er ferdige
   * eksporter fra kundemappen, og alle tre er 9:16 med autospill. Ingen
   * kunde navngis i alt-teksten, som i resten av rutenettene.
   *
   * EIENDOM MISTER SIN FLATE HER, og det er greit: bransjen står nevnt med
   * navn i seksjonen rett over, og et navn som kan etterprøves bærer mer
   * enn et bilde som ikke overbeviser.
   */
  arbeid: [
    {
      type: "video",
      sti: "/reels/antonsport",
      alt: "Vertikalt klipp av en skiløper i bakken",
    },
    {
      type: "video",
      sti: "/reels/egon",
      alt: "Vertikalt klipp av delte retter på et restaurantbord",
    },
    {
      type: "video",
      sti: "/reels/soulcake",
      alt: "Vertikalt klipp av to gjester i et bakeri",
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
      svar: "Reflektor produserer foto og video for Anton Sport til kampanjer, skjermer i butikk, sosiale medier og merkevarebygging gjennom året. Samarbeidet er månedlig og har vart i over tre år.",
      punkter: [
        "Løpende foto og video, hver måned",
        "Kampanjer, skjermer i butikk, sosiale medier og merkevarebygging",
        "Over tre år med samarbeid",
        /*
         * BESVART AV PÅL 29.09.2026: «anton produserer vi for, og har ikke
         * ansvaret for publisering. vi planlegger sammen med kunden.»
         *
         * Punktet sier begge deler, og rekkefølgen er ikke tilfeldig:
         * planleggingen er felles, kanalene er kundens. Det er den samme
         * arbeidsdelingen som «Passer for dere hvis …» beskriver lenger
         * nede, og som skiller kjedekundene fra SoMe-abonnementet.
         */
        "Vi planlegger sammen med Anton Sport. Publisering og dialog i kanalene gjør de selv.",
      ],
      /*
       * AUTOSPILL, IKKE AVSPILLER. Bestilt av Pål 29.09.2026: «endre på
       * kjede-siden slik at alle videoene blir autoplay sånn som vitus sin
       * video.» Se samlet begrunnelse ved Vitusapotek lenger ned.
       */
      filmer: [
        {
          sti: "/arbeid/kjeder-anton-sport",
          format: "16/9",
          alt: "Stillbilde fra filmen: to syklister på en grusvei i skogen.",
          bildetekst:
            "Anton Sport, mai 2026. Film fra én produksjonsdag, levert i 16:9 og 9:16.",
          sekunder: 25,
        },
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
      svar: "Egon har servert nordmenn siden 1984 og teller i dag nærmere 50 restauranter fra sør til nord. Reflektor har produsert menyfoto, reels, kampanjefilm og skjermreklame for kjeden siden 2022, fra én fast produksjonsdag i måneden.",
      punkter: [
        "Nærmere 50 restauranter over hele landet",
        "Menyfoto, reels, kampanjefilm og skjermreklame",
        "Seks formater per film: sosiale medier, skjermer i restaurant og kjøpesenter, og annonser",
        "Fast produksjonsdag hver måned siden 2022",
      ],
      /*
       * AUTOSPILL, IKKE AVSPILLER. Bestilt av Pål 29.09.2026: «endre på
       * kjede-siden slik at alle videoene blir autoplay sånn som vitus sin
       * video.» Se samlet begrunnelse ved Vitusapotek lenger ned.
       */
      filmer: [
        {
          sti: "/arbeid/kjeder-egon",
          format: "16/9",
          alt: "Stillbilde fra filmen: en hånd heller saus over en rett, med teksten «Trøffelsoppsaus».",
          bildetekst:
            "Egon, august 2026. Kampanjefilmen «Min drømmerett», levert i fem formater.",
          sekunder: 19,
        },
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
      /*
       * AUTOSPILL, IKKE AVSPILLER. Bestilt av Pål 29.09.2026: «endre på
       * kjede-siden slik at alle videoene blir autoplay sånn som vitus sin
       * video.» Se samlet begrunnelse ved Vitusapotek lenger ned.
       */
      filmer: [
        {
          sti: "/arbeid/kjeder-peppes",
          format: "16/9",
          alt: "Stillbilde fra filmen: to personer spiser pizza i en sofa.",
          bildetekst: "Peppes Pizza, august 2026. Reklamefilm på 15 sekunder.",
          sekunder: 15,
        },
      ],
    },
    {
      sporsmal: "Vitusapotek",
      svar: "Reflektor har laget TV-reklame for Vitusapotek i forbindelse med Skal vi danse.",
      punkter: [
        "TV-reklame",
        "Kampanje knyttet til Skal vi danse",
        /*
         * PUNKT LAGT TIL 29.09.2026, og det er en utvidelse av innholdet —
         * ikke en omskriving av det som sto. Seksjonen sa bare TV-reklame,
         * og da hadde filmen under ingen forankring i teksten.
         *
         * Belegget er leveransen selv: Kundemappe/Vitusapoteket/2025/Juli/
         * Reels V3/ har de samme fem filmene i 16-9, 9-16 og 1-1, og i dem
         * står apotekets egen farmasøyt navngitt på skjermen. Det er en
         * sterkere kilde enn noen av de publiserte tekstene — men det er en
         * ny opplysning på siden, og den er meldt til Pål som nettopp det.
         */
        "Filmer med apotekets egne farmasøyter, levert i 16:9, 9:16 og 1:1",
      ],
      /*
       * BYTTET 29.09.2026 på Påls beskjed: «bytt ut eksempelet til vitus på
       * siden med tv-reklamen der to danser.»
       *
       * Her lå farmasøytfilmen fra Reels V3. Den er en ekte leveranse, men
       * den illustrerte kulepunkt tre og ikke de to første — og seksjonen
       * handler om TV-reklamen.
       *
       * Sponsorplakater/Versjon 3 har seks vignetter. Tre av dem er fra
       * skogen med en soldat, tre er fra dansegulvet. Nummer 4 er den ENESTE
       * der to danser sammen; 5 og 6 viser én danser. Kontrollert ved å
       * hente ut rammer fra alle seks og se på dem.
       *
       * ALLE FIRE KJEDEFILMENE SPILLER AV SEG SELV. Bestilt av Pål
       * 29.09.2026: «endre på kjede-siden slik at alle videoene blir
       * autoplay sånn som vitus sin video.» Denne var den første som gikk i
       * dempet løkke; nå gjør Anton Sport, Egon og Peppes det samme, og
       * formatraden gjorde det fra før. `lyd` er utelatt på alle syv.
       *
       * AUTOSPILL BETYR DEMPET, og det er ikke vårt valg. Alle nettlesere
       * blokkerer autospill med lyd — se `muted` i Klipp.tsx. En film som
       * skal starte selv, kan ikke høres. De fire kjedefilmene tåler det:
       * Maridalen er sykling, «Min drømmerett» har teksten brent inn i
       * bildet, Peppes-spoten og denne vignetten leses som bevegelse.
       * Lydsporene er derfor fjernet fra filene — et spor som aldri kan
       * spilles er bare vekt.
       *
       * DE TO PÅ /employer-branding-video-oslo BEHOLDER `lyd: true`. Der er
       * det motsatt: en profilfilm og en kundeomtale der hele poenget er
       * det som blir SAGT. Dempet autospill ville vist et ansikt som
       * beveger leppene og aldri kommer til poenget. Skillet står i
       * Referansefilmer og gjelder fortsatt.
       *
       * PRISEN, SAGT RETT UT: filmene lastes nå mens man ruller i stedet
       * for ved klikk. Ruller man hele siden, er det rundt 29 MB mot null
       * før. `preload="none"` står, så ingenting hentes før filmen faktisk
       * kommer i synsfeltet, og den som ikke ruller ned til Peppes laster
       * den aldri. Skal tallet ned, er det oppløsningen som må ned — og det
       * er referansefilmer, så det er en avveining mot kvaliteten på det vi
       * viser fram.
       */
      filmer: [
        {
          sti: "/arbeid/kjeder-vitusapotek",
          format: "16/9",
          alt: "Stillbilde fra filmen: to dansere på et parkettgulv, med Vitusapotek-logoen over.",
          bildetekst:
            "Vitusapotek, september 2025. Sponsorvignett for TV 2, levert i seks varianter.",
          sekunder: 4,
        },
      ],
    },
    {
      sporsmal: "Passer for dere hvis …",
      svar: "Passer for kjeder med eget markedsteam som vil eie publisering og dialog med kundene. Vi leverer innholdet, dere styrer kanalene.",
    },
    {
      sporsmal: "Løpende innhold og kampanjefilm fra samme team",
      /*
       * BESVART AV PÅL 29.09.2026: «vi er et lite team totalt i hele
       * reflektor, og alle kan gjøre alt.»
       *
       * Svaret er altså ja, og det gjelder alle kjedekundene. Setningen sier
       * hva det betyr for kunden — samme folk på begge leveransene — og ikke
       * hvor mange vi er. En kjede som vurderer et byrå leser «lite team»
       * som en kapasitetsrisiko, og det er ikke poenget Pål gjør.
       */
      svar: "Det samme teamet lager løpende innhold og kampanjefilm, slik at butikkinnhold og reklame har samme bildespråk. Det gjelder alle kjedekundene våre: det er de samme folkene på produksjonsdagen i butikk og på reklamefilmen.",
    },
    {
      sporsmal: "Volum og format",
      svar: `Trenger dere mer innhold, legger dere til produksjonsdager. Hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr. Videoene leveres stående i 9:16, og dere står helt fritt til å bruke dem på TikTok, i annonser, på nettsiden og andre flater.\n\nUnder står den samme filmen på 23 sekunder i tre av de seks formatene Egon får levert hver måned.`,
      punkter: [
        `SoMe-abonnementet koster ${kr(tilbud.prisPerManed)} kr/mnd`,
        `Hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr`,
        "Ingen bindingstid. 3 måneders oppsigelse.",
      ],
      /*
       * FORMATRADEN. Dette er sidens eneste påstand som ellers bare er en
       * påstand: «seks formater per film» står tre steder på siden, og et
       * tall i en kulepunktliste er lett å skrive og umulig å etterprøve.
       *
       * Filene er de ekte eksportene fra Kundemappe/Egon/2026/Mai/, der
       * 16x9, 9x16, 4x5, 1152x1058, 1700x1500 og Store filer ligger side om
       * side med samme film i hver. Tre av dem er tatt med — seks ville vært
       * seks avspillere av det samme, og poenget er sett etter tre.
       *
       * Bildetekstene sier BARE formatet. Å skrive hvilken flate hvert
       * format går til ville vært en ny påstand; hvilke flater kjeden bruker
       * står allerede i teksten over, hentet fra kundecaset.
       */
      filmer: [
        {
          sti: "/arbeid/kjeder-format-16x9",
          format: "16/9",
          alt: "Stillbilde fra filmen i 16:9-format: en rett fotografert ovenfra.",
          bildetekst: "16:9",
          sekunder: 23,
        },
        {
          sti: "/arbeid/kjeder-format-4x5",
          format: "4/5",
          alt: "Samme film i 4:5-format.",
          bildetekst: "4:5",
          sekunder: 23,
        },
        {
          sti: "/arbeid/kjeder-format-9x16",
          format: "9/16",
          alt: "Samme film i 9:16-format.",
          bildetekst: "9:16",
          sekunder: 23,
        },
      ],
    },
  ],
  /*
   * STILLFOTO, ETT PER KJEDE. Filmene viser bevegelse; dette viser det
   * andre halve av leveransen. Bildene er hentet fra hver kundes egen mappe
   * i Kundemappe, og alt-teksten navngir kunden — det gjør den ikke på
   * tjenestesidene, der et navngitt kundebilde ville antydet at kunden har
   * kjøpt akkurat den tjenesten. Her ER kunden temaet for seksjonen over,
   * så navnet er riktig og ikke en påstand.
   *
   * 4:5 og ikke 9:16: originalene er 2:3 og 3:2, og en 9:16-ramme skjærer
   * bort halve motivet i de liggende.
   */
  arbeid: [
    {
      type: "foto",
      sti: "/arbeid/kjeder-foto-anton-sport.jpg",
      alt: "Sko i en bekk, fotografert for Anton Sport.",
      format: "4/5",
    },
    {
      type: "foto",
      sti: "/arbeid/kjeder-foto-egon.jpg",
      alt: "Tacos på et fat, fotografert for Egon.",
      format: "4/5",
    },
    {
      type: "foto",
      sti: "/arbeid/kjeder-foto-peppes.jpg",
      alt: "To pizzaer og en dessert på et bord, fotografert for Peppes Pizza.",
      format: "4/5",
    },
    {
      type: "foto",
      sti: "/arbeid/kjeder-foto-vitusapotek.jpg",
      alt: "Julevarer lagt ut på grønt stoff, fotografert for Vitusapotek.",
      format: "4/5",
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

/**
 * Seksjonsoverskrifter som ER spørsmål, som FAQ-par.
 *
 * LAGT TIL 01.10.2026 i SEO-gjennomgangen før lansering. Tjenestesidene
 * hadde bare `faq`-lista i markeringen, mens fire av de mest siterbare
 * spørsmålene på nettstedet sto som vanlige seksjoner uten markering:
 * «Hva koster videoproduksjon?», «Hva koster eventfotograf?», «Hvorfor
 * video på nettsiden i det hele tatt?» og «Hva får dere igjen for å
 * dokumentere et arrangement?». Det er prisspørsmålene som siteres i
 * AI-svar, og de lå utenfor.
 *
 * SAMME TRE FILTRE SOM BLOGGEN BRUKER, og det er ikke tilfeldig: en
 * seksjonsoverskrift er bare et FAQ-spørsmål hvis den kan siteres alene.
 *
 *   1. Må ende på spørsmålstegn.
 *   2. Må begynne med et spørreord — «Slik jobber vi» og «Dette får dere»
 *      er seksjoner, ikke spørsmål.
 *   3. Må ha et svar. En seksjon med tom `svar` er en ren liste, og et
 *      FAQ-par uten svar er verdiløst.
 *
 * SVARET KUTTES VED FØRSTE AVSNITT. Flere av svarene er tre avsnitt lange,
 * og et FAQ-svar skal være det korte svaret. Første avsnitt er front-loaded
 * i denne malen — det er regelen `svar`-feltet er skrevet etter.
 */
const SPØRREORD =
  /^(hva|hvorfor|hvordan|hvem|når|hvor|kan|bør|må|trenger|er|skal|finnes|går|koster|lønner)\b/i;

export function seksjonerSomFaq(side: Tjenesteside) {
  return side.seksjoner
    .filter(
      (s) =>
        s.sporsmal.trim().endsWith("?") &&
        SPØRREORD.test(s.sporsmal.trim()) &&
        s.svar.trim().length > 0,
    )
    .map((s) => ({
      sporsmal: s.sporsmal,
      svar: s.svar.split("\n\n")[0].trim(),
    }));
}

export const tjenestesider: Tjenesteside[] = [
  innholdsproduksjon,
  kjeder,
  reelsproduksjon,
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
    flate: "Betalte flater: TV, nettannonser, sosiale medier",
    beskrivelse:
      "Filmen dere betaler for å få vist. Den må fange folk som ikke lette etter dere.",
  },
  {
    sti: "/videoproduksjon-i-oslo",
    navn: "Videoproduksjon",
    flate: "Egne flater: nettside, tjenesteside, skjerm",
    beskrivelse: "Filmen som forklarer, til folk som allerede har funnet dere.",
  },
  {
    sti: "/employer-branding-video-oslo",
    navn: "Employer branding-video",
    flate: "Rekruttering: stillingsannonse, karriereside",
    beskrivelse: "Filmen som gjør at folk søker jobb hos dere.",
  },
  {
    sti: "/eventfotograf-eventvideo",
    navn: "Event­fotograf og eventvideo",
    flate: "Dokumentasjon: konferanse, lansering, messe",
    beskrivelse: "Dekningen av noe som skjer én gang og skal brukes etterpå.",
  },
] as const;

export { KONTAKT };
