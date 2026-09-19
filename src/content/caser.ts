/**
 * Kundecasene på /vart-arbeid.
 *
 * TEKSTEN ER MIGRERT ORDRETT fra de levende sidene på reflektor.no, hentet
 * 17.09.2026. Den er Reflektors egen, den er allerede godkjent, og den er
 * god. Copy-protokollen sier at jeg skal be om tekst, ikke skrive den — her
 * fantes den, og da er migrering riktig svar. Samme fremgangsmåte som for
 * FAQ-en og personvernerklæringen.
 *
 * HVILKE CASER SOM FINNES, og hvorfor det ikke er de to som sto i site.ts:
 *
 *   /vart-arbeid/egon ......... live, 200, i sitemapet
 *   /vart-arbeid/soulcake ..... live, 200, i sitemapet  ← manglet i site.ts
 *   /vart-arbeid/anton-sport .. 404 på dagens side      ← sto i site.ts
 *
 * Den nye siden var altså i ferd med å slette en levende URL og publisere
 * en oppdiktet. Se A45 i docs/vedlegg-a.md.
 *
 * Anton Sport står omtalt på dagens oversiktsside uten lenke — det er et
 * kundenavn, ikke et kundecase. Navnet lever videre i logorekken og i
 * reel-veggen, der det hører hjemme.
 *
 * TALLENE ER KUNDENS EGNE, IKKE VÅRE PÅSTANDER. Hver case oppgir kilde,
 * dato og hva tallene IKKE måler. Det er uvanlig ærlig for en bransje som
 * pleier å vise tall uten kontekst, og det er nettopp derfor det står:
 * en påstand med kilde og forbehold er den eneste typen en språkmodell kan
 * sitere uten å ta en sjanse, og den eneste en innkjøper kan etterprøve.
 * Forbeholdene skal ikke redigeres bort for å gjøre tallene penere.
 */

export type Tall = {
  /** Selve tallet, satt i display-grad. */
  verdi: string;
  /** Hva tallet gjelder. Står under tallet, i brødtekstgrad. */
  forklaring: string;
};

export type Steg = { tittel: string; tekst: string };

export type Eksempel = {
  tittel: string;
  tekst: string;
  /** Ett konkret tall fra nettopp dette prosjektet. */
  tall: string;
};

export type Kundecase = {
  /** URL-segment. MÅ IKKE ENDRES — begge er live på dagens side. */
  slug: string;
  kunde: string;
  /** Bransje og sted. Står i metadatalinja over overskriften. */
  sektor: string;
  /** Hva vi leverer. Står i samme linje. */
  tjenester: string;
  /** «Siden 2022». Samme linje. */
  siden: string;

  metaTittel: string;
  metaBeskrivelse: string;

  h1: string;
  ingress: string;

  /** Tre korte fakta om kunden. Rammer inn oppdragets størrelse. */
  fakta: string[];

  /** Fire målte tall. */
  tall: Tall[];
  /** Kilde, dato og hva tallene ikke måler. Skal alltid stå. */
  kilde: string;

  behov: { tittel: string; avsnitt: string[] };
  arbeid: { tittel: string; steg: Steg[] };

  /** Klippet fra samarbeidet, i public/reels/. */
  klipp: { fil: string; alt: string; attribusjon: string };

  /**
   * Stillbildene på kortet i oversikten, i public/caser/.
   *
   * EGNE BILDER OG IKKE KLIPPETS PLAKAT. Kortene brukte posterbildet fra
   * videoen — en 540×960 JPEG trukket ut av et komprimert 9:16-klipp — vist
   * i en liggende ramme på 660 px. To feil samtidig: oppskalert
   * videokomprimering, og hoder kuttet av fordi et stående motiv ble
   * sentrert i en liggende ramme. Pål meldte begge.
   *
   * ETT ELLER TO BILDER. Rammen er 4:3. Begge kildene er 0,67 stående, og
   * to av dem side om side fyller nøyaktig 4:3 — altså kan Egon vise to
   * motiver uten å beskjære noen av dem. Der det bare finnes ett bilde,
   * fyller det rammen alene, og da avgjør `fokus` hva som blir med.
   *
   * `fokus` er `object-position`. Ikke en smaksinnstilling: sentrert (50 %)
   * kutter hodene på Soulcake-bildet. Verdien er valgt ved å sammenligne
   * utsnitt i faktisk visningsstørrelse, slik docs/media.md foreskriver.
   */
  kortbilder: { fil: string; alt: string; fokus?: string }[];

  eksempler: { tittel: string; punkter: Eksempel[] };

  flater: {
    tittel: string;
    tekst: string;
    forbehold: string;
    merkelapper: string[];
  };

  /** Kort oppsummering til kortet på oversiktssiden. */
  kortingress: string;
  /**
   * Tallet som løftes fram på kortet i oversikten.
   *
   * ALDRI ET ABSOLUTT REKKEVIDDETALL. Kortene sto først med «6,8 mill.» og
   * «323 000» ved siden av hverandre — begge totale visninger, begge siden
   * 2022. Pål: «dette ser ikke veldig bra ut ved siden av hverandre når
   * begge samarbeidene er like gamle.» Han har rett, og det er en
   * saklighetsfeil og ikke en designfeil: Soulcake har 58 792 følgere og
   * publiserer nesten daglig, Egon er en restaurantkjede med en helt annen
   * kontoprofil. Tallene måler kundens publikum, ikke vårt arbeid, og
   * stilt opp mot hverandre leser de som en rangering mellom to kunder.
   *
   * Kortet skal derfor bære et RELATIVT tall som beskriver Reflektors
   * bidrag: en andel eller en vekst. Da kan ingen av de to gjøre den andre
   * liten, og tallet sier faktisk noe om samarbeidet.
   *
   * De absolutte tallene står fortsatt på casesidene, der de har kilde,
   * dato og forbehold rundt seg. Det er der de hører hjemme.
   */
  korttall: Tall;
};

export const kundecaser: Kundecase[] = [
  {
    slug: "soulcake",
    kunde: "Soulcake",
    sektor: "Bakeri og kafé, Oslo",
    tjenester: "Instagram og Facebook",
    siden: "Siden 2022",

    metaTittel: "Soulcake: foto og video for bakeri og kafé – kundecase",
    metaBeskrivelse:
      "Hvordan Reflektor produserer foto og video for Soulcake på fast månedlig basis siden 2022: over 80 % av innholdet på Instagram, 6,8 millioner visninger på reels og lanseringer med Freia og Ivorie.",

    h1: "Foto og video for Soulcake",
    ingress:
      "Én fast produksjonsdag i måneden siden 2022. Over 80 prosent av foto og video på @soulcake.oslo kommer fra oss i Reflektor.",

    fakta: [
      "58 792 følgere på Instagram",
      "5 butikker og kafé",
      "Fast produksjonsdag hver måned",
    ],

    tall: [
      {
        verdi: "80 %+",
        forklaring: "av foto og video på kontoen kommer fra Reflektor",
      },
      {
        verdi: "6,8 mill.",
        forklaring: "visninger på 228 reels, april 2022 – sept. 2026",
      },
      {
        verdi: "+96 %",
        forklaring: "visninger per reel fra 2022 til 2026",
      },
      {
        verdi: "924",
        forklaring: "likes per innlegg i 2026, opp fra 348 i 2024",
      },
    ],
    kilde:
      "Offentlige Instagram-data via Supermetrics per 4. september 2026. Tallene gjelder hele kontoen i samarbeidsperioden. Likes og visninger måler engasjement, ikke salg.",

    behov: {
      tittel:
        "Noe helt spesielt, som måtte formidles like fristende som det smaker",
      avsnitt: [
        "Soulcake har vokst fra ett lite cupcake-bakeri til fem butikker, kafé, egne cookies og salg via Wolt og Morgenlevering. Instagram er hovedkanalen, og de publiserer nesten daglig.",
        "De visste at de hadde noe folk blir begeistret for. Det de trengte, var å smitte publikum med den samme begeistringen – kreativt, profesjonelt, kontinuerlig og fristende.",
      ],
    },

    arbeid: {
      tittel: "Én dag i måneden. Ideene utvikler vi sammen.",
      steg: [
        {
          tittel: "Idé og plan",
          tekst:
            "Utgangspunktet er det som står på Soulcakes plan – nye smaker, sesonger, åpninger – og konseptene utvikler vi sammen.",
        },
        {
          tittel: "Produksjonsdag",
          tekst:
            "Én fast dag i måneden, pluss ekstra opptak ved lanseringer. Vi har regi, kamera, lys og kjøreplan.",
        },
        {
          tittel: "Klipp og levering",
          tekst:
            "Ferdig redigerte reels, annonsevideoer og produktbilder – klare til feed, annonser, butikk og nettbutikk.",
        },
      ],
    },

    klipp: {
      fil: "soulcake",
      alt: "Vertikalt klipp fra Soulcake-bakeriet",
      attribusjon: "Filmet og klippet av Reflektor, publisert av Soulcake",
    },

    eksempler: {
      tittel: "Fra cookie-lansering til samarbeid med Freia og Ivorie",
      punkter: [
        {
          tittel: "Cookies blir egen produktlinje",
          tekst:
            "Fra første cookie-lansering i 2022 til «Dough It Yourself» i 2024 har våre produktbilder fulgt hver nyhet.",
          tall: "1 875 likes på DIY-lanseringen",
        },
        {
          tittel: "Ivorie x Soulcake",
          tekst:
            "Pop-up med matcha-cookies og iskaffe hos Ivorie Studio – vi leverte lanseringsvideo og foto fra åpningsdagen.",
          tall: "Kø ut på gaten fra åpning",
        },
        {
          tittel: "Freia x Soulcake",
          tekst:
            "Produktfoto, fabrikkopptak, lanseringsvideo og pop-up-film – hele det visuelle for fire nye produkter.",
          tall: "3 399 likes på lanseringsposten",
        },
      ],
    },

    flater: {
      tittel: "Materialet lever langt utenfor feeden",
      tekst:
        "Samme produksjonsdag gir innhold til organiske innlegg og betalt annonsering, plakater og skjermer i butikk, nettbutikken og produktsidene hos Wolt og Morgenlevering.",
      forbehold:
        "Vi har ikke tilgang til kundens annonsekonto, så betalt distribusjon er ikke med i tallene.",
      merkelapper: [
        "Butikk og kafé",
        "Nettbutikk",
        "Samarbeid",
        "Reels",
        "Wolt og Morgenlevering",
        "Annonser",
        "Lansering og pop-up",
      ],
    },

    /*
     * FREIA-BILDET ER BESTILT AV PÅL 19.09.2026. docs/media.md merket
     * Freia-motivene som noe han måtte ta stilling til, fordi Freia eies av
     * Orkla og Orkla er holdt utenfor kundelisten. Det er avklart nå, og
     * casen navngir allerede samarbeidet i klartekst: «Freia x Soulcake».
     */
    kortbilder: [
      {
        fil: "soulcake",
        alt: "Fire ansatte i hvite frakker og hårnett holder overdimensjonerte Freia-sjokolader i et fabrikklokale",
        fokus: "50% 20%",
      },
    ],

    kortingress:
      "Én fast produksjonsdag i måneden siden 2022. Over 80 prosent av foto og video på @soulcake.oslo kommer fra oss.",
    korttall: {
      verdi: "80 %+",
      forklaring: "av foto og video på @soulcake.oslo kommer fra oss",
    },
  },

  {
    slug: "egon",
    kunde: "Egon",
    sektor: "Restaurantkjede, hele Norge",
    tjenester: "Foto, video og skjermer",
    siden: "Siden 2022",

    metaTittel: "Egon: foto og video for restaurantkjeden – kundecase",
    metaBeskrivelse:
      "Hvordan Reflektor produserer foto, reels, kampanjefilm og skjermreklame for Egon på fast månedlig basis siden 2022: nærmere 50 restauranter, seks formater per film og 323 000 reels-visninger.",

    h1: "Foto og video for Egon",
    ingress:
      "Månedlige produksjoner for en av Norges største restaurantkjeder siden 2022. Menyfoto, reels, kampanjefilm og skjermreklame – alt fra samme opptaksdag.",

    fakta: [
      "1984 åpnet den første Egon på Nordstrand",
      "Nærmere 50 restauranter over hele landet",
      "Fast produksjonsdag hver måned",
    ],

    tall: [
      {
        verdi: "4 år",
        forklaring: "løpende samarbeid, fra juli 2022 til i dag",
      },
      {
        verdi: "323 000",
        forklaring: "reels-visninger på @egon_restauranter i perioden",
      },
      {
        verdi: "4×",
        forklaring:
          "reels-visninger per år, fra 28 241 i 2023 til 115 636 i 2025",
      },
      {
        /*
         * Tallet står alene, enheten hører til forklaringen. Dagens side
         * skriver «6 formater» som ett uttrykk, men i en rad med fire tall
         * brekker det til to linjer og river ned justeringen mellom de
         * fire. Samme opplysning, samme ord, bare delt på riktig sted.
         */
        verdi: "6",
        forklaring:
          "formater per film – til SoMe, skjermer i restaurant og kjøpesenter, og annonser",
      },
    ],
    kilde:
      "Offentlige Instagram-data via Supermetrics per 8. september 2026. Tallene gjelder hele kontoen til Egon i samarbeidsperioden og måler visninger, ikke salg.",

    behov: {
      tittel:
        "Én kjede, nærmere 50 restauranter og en meny som skifter hele året",
      avsnitt: [
        "Egon har servert nordmenn siden 1984 og er i dag nærmere 50 restauranter fra sør til nord, med egen app, kampanjer hver måned og ny meny hver sommer. Alt skal se likt ut, uansett hvilken by gjesten sitter i.",
        "Med så mange flater – Instagram og Facebook, skjermer i restaurantene og på kjøpesentrene, annonser og rekruttering – trengte Egon et fast tempo på nytt visuelt innhold. Retten som lanseres 1. juni må se like fristende ut på skjermen i Byporten som i feeden.",
      ],
    },

    arbeid: {
      tittel: "Fast produksjonsdag. Ferdige filer i alle formater.",
      steg: [
        {
          tittel: "Idé og plan",
          tekst:
            "Egons kampanjeplan er utgangspunktet – ny meny, sesongkampanjer, Min drømmerett – og konseptene utvikler vi sammen.",
        },
        {
          tittel: "Produksjonsdag",
          tekst:
            "Én fast dag i måneden på en av restaurantene, pluss ekstra opptak ved lanseringer. Vi har regi, kamera, lys og styling.",
        },
        {
          tittel: "Klipp og levering",
          tekst:
            "Reels, kampanjefilm og foto levert i 9:16, 4:5, 16:9 og skjermformater – klart til Egons kanaler, skjermer og annonser.",
        },
      ],
    },

    klipp: {
      fil: "egon",
      alt: "Vertikalt klipp fra en Egon-restaurant",
      attribusjon: "Filmet og klippet av Reflektor, publisert av Egon",
    },

    eksempler: {
      tittel: "Fra gjestenes drømmeburger til ny meny 1. juni",
      punkter: [
        {
          tittel: "Drømmeburgeren",
          tekst:
            "Egon ba gjestene sende inn sin drømmeburger. Vinneren, Brutal Burger, fotograferte og filmet vi til meny, skjermer og annonser før lanseringen i september 2025.",
          tall: "800+ innsendte oppskrifter",
        },
        {
          tittel: "Min drømmerett",
          tekst:
            "Samme grep for hele menyen i 2026: gjestene sendte inn retter, finalistene ble filmet i sommer, og vinnerretten ble lansert 1. september.",
          tall: "4 129 visninger på reelen med innsendingsfrist",
        },
        {
          tittel: "Ny meny og EGONGULL",
          tekst:
            "Til menylanseringen 1. juni 2026 leverte vi åtte retter som egne filmer, samlefilm og skjermversjoner – pluss film til Egons egen grytechips.",
          tall: "7 reels på 7 dager i nedtellingen",
        },
      ],
    },

    flater: {
      tittel: "Materialet lever på skjermer, i annonser og i feeden",
      tekst:
        "Samme produksjonsdag gir innhold til Instagram og Facebook, skjermene i restaurantene og på kjøpesentrene, annonser, rekruttering og menyen – i alle formater Egon trenger.",
      forbehold:
        "Vi har ikke tilgang til Egons annonsekonto, så betalt distribusjon er ikke med i tallene.",
      merkelapper: [
        "Kampanje",
        "Meny",
        "Reels",
        "Restaurant",
        "Rekruttering",
        "Skjermer",
        "Lansering",
      ],
    },

    kortbilder: [
      {
        fil: "egon-bord",
        alt: "Bord dekket med retter fra Egons meny: pizza, burger, pasta, nachos, tacos og pommes frites",
      },
      {
        fil: "egon-rett",
        alt: "Biff med pommes frites, brokkoli og saus på en mørk tallerken",
      },
    ],

    kortingress:
      "Menyfoto, reels, kampanjefilm og skjermreklame for nærmere 50 restauranter – fast produksjonsdag hver måned siden 2022.",
    korttall: {
      verdi: "4×",
      forklaring: "flere reels-visninger i året, fra 2023 til 2025",
    },
  },
];

export function hentCase(slug: string): Kundecase | undefined {
  return kundecaser.find((c) => c.slug === slug);
}

/** Neste case i rekka, for lenka nederst. Går rundt. */
export function nesteCase(slug: string): Kundecase {
  const i = kundecaser.findIndex((c) => c.slug === slug);
  return kundecaser[(i + 1) % kundecaser.length];
}
