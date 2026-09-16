/**
 * Google-anmeldelser av Reflektor.
 *
 * Dette er FAKTA, ikke copy. Derfor ligger de her og ikke som TBD-slots i
 * sider/front.ts: ingen skal skrive dem, de skal gjengis.
 *
 * Kilde: Reflektors Google Business Profile, place-ID
 * ChIJv6K0bydvQUYRKCndqlmZMpk. Hentet 15.09.2026 ved å rendre
 * www.reflektor.no i Chromium og fange API-svaret Elfsight-widgeten selv
 * gjør — tekstene ligger ikke i HTML-en og finnes ikke i noe crawl.
 * Fremgangsmåten står i docs/media.md.
 *
 * Alle ni er 5 av 5. `sitat` er et utdrag; `fulltekst` er ordrett hele
 * anmeldelsen.
 *
 * VIKTIG FORBEHOLD — ingen totalvurdering skal vises på siden.
 * Forespørselen widgeten gjør inneholder `min_rating=5` og
 * `filter_content=text_required`. Kilden er altså FILTRERT til femstjerners
 * anmeldelser med tekst. At disse ni er 5 av 5 er derfor ikke bevis på at
 * Reflektor har 5,0 i snitt — det kan finnes lavere vurderinger, med eller
 * uten tekst, som widgeten aldri hentet.
 *
 * Derfor står det ingen stjernerad og ingen «5,0 av 5» noe sted i designet.
 * Skal en totalvurdering vises, må den hentes fra Google Business Profile
 * direkte og oppdateres når den endrer seg. Utdraget kutter bare — det legger aldri til et ord, og det
 * fjerner aldri et forbehold. Sammenlign selv: begge står i denne filen.
 *
 * `selskap` er hentet fra anmeldelsen selv der den nevner det, ellers fra
 * Reflektors offentlige svar på anmeldelsen. Der ingen av delene sier det,
 * står feltet tomt — det gjettes ikke.
 */
export type Anmeldelse = {
  navn: string;
  selskap?: string;
  dato: string;
  sitat: string;
  fulltekst: string;
  /** false = må godkjennes av Pål før den kan vises. Se merknad. */
  klarert: boolean;
  merknad?: string;
};

export const anmeldelser: Anmeldelse[] = [
  {
    navn: "Thomas Messel",
    selskap: "Vindu Butikken",
    dato: "2025-08-22",
    sitat:
      "Reflektor har gjort en stor forskjell for Vindu Butikken AS – vi opplever økt synlighet, flere kunder og solid vekst, 70 % så langt i år sammenliknet med fjoråret, selv i et krevende marked med generell nedgang for alle i vår bransje.",
    fulltekst:
      "Fantastisk samarbeidspartner! Reflektor har gjort en stor forskjell for Vindu Butikken AS – vi opplever økt synlighet, flere kunder og solid vekst, 70% så langt i år sammenliknet med fjoråret, selv i et krevende marked med generell nedgang for alle i vår bransje. Engasjerte, hyggelige og dyktige folk som virkelig kan faget sitt!",
    klarert: true,
  },
  {
    navn: "Axel Hauge",
    selskap: "Anton Sport",
    dato: "2025-07-16",
    sitat:
      "Vi liker spesielt godt hvordan de får alle til å føle seg avslappet, naturlig og finne seg til rette foran kamera, selv med lite modell-erfaring fra tidligere. De ser aldri begrensninger og heller muligheter uansett årstid eller lokasjon.",
    fulltekst:
      "Vi i Anton Sport er meget godt fornøyd med Reflektor og vårt månedlige samarbeid. De er alltid imøtekommende, lytter til våre ønsker og forsøker å nå et best mulig resultat utifra de kriteriene vi setter. De kommer ofte med innspill som tilfører innholdet noe ekstra. Vi liker spesielt godt hvordan de får alle til å føle seg avslappet, naturlig og finne seg til rette foran kamera, selv med lite modell-erfaring fra tidligere. De ser aldri begrensninger og heller muligheter uansett årstid eller lokasjon. At de er en meget trivelig gjeng kommer som en ekstra bonus på toppen av det hele. De har våre varmeste anbefalinger.",
    klarert: true,
  },
  {
    navn: "Ingrid Gulaker Motrøen",
    selskap: "The Well",
    dato: "2025-07-15",
    sitat:
      "De er fleksible, løsningsorienterte og skjønner både merkevaren vår og målgruppen. Alltid høy kvalitet på leveransene, og samtidig en «value for money»-partner vi virkelig stoler på.",
    fulltekst:
      "Vi har samarbeidet med Reflektor et års tid, og er utrolig fornøyde. De er fleksible, løsningsorienterte og skjønner både merkevaren vår og målgruppen. Alltid høy kvalitet på leveransene, og samtidig en \"value for money\"-partner vi virkelig stoler på. I tillegg er de rett og slett veldig fine folk å jobbe med. Anbefales på det varmeste!",
    klarert: true,
  },
  {
    navn: "Marion Ilona Heggland Skjørberg",
    selskap: "Baker Brun",
    dato: "2025-07-15",
    sitat:
      "Det som virkelig skiller dem ut, er hvor samarbeidsvillige og engasjerte de er. De stiller opp, byr på seg selv, og er rett og slett kjempefine folk man blir glad i.",
    fulltekst:
      "Vi kunne ikke vært mer fornøyd med samarbeidet vårt med Reflektor. De tar seg av alt innen markedsføring på Google – fra A til Å. De har tatt flotte bilder for oss, hjulpet oss med artikler i samarbeid med en dyktig journalist, og fulgt oss tett opp hele veien. Det som virkelig skiller dem ut, er hvor samarbeidsvillige og engasjerte de er. De stiller opp, byr på seg selv, og er rett og slett kjempefine folk man blir glad i. En genuin glede å jobbe med, og vi føler oss trygge på at vi er i de beste hender. Vi anbefaler dem på det varmeste!",
    klarert: true,
  },
  {
    navn: "Sven Erik Brastad",
    selskap: "EIK Servering",
    dato: "2022-11-26",
    sitat:
      "EIK Servering har vært kunde av Reflektor over en lengre periode, og vi er svært fornøyd med produktet de leverer.",
    fulltekst:
      "Meget dyktige fotografer, og ikke minst skikkelig bra folk! EIK Servering har vært kunde av Reflektor over en lengre periode, og vi er svært fornøyd med produktet de leverer.",
    klarert: true,
  },
  {
    navn: "Vilde Haugland",
    selskap: "Kompis",
    dato: "2022-11-21",
    sitat:
      "Reflektor er dyktige, kreative, superhyggelige og ikke minst profesjonelle.",
    fulltekst:
      "Reflektor er dyktige, kreative, superhyggelige og ikke minst profesjonelle. Anbefaler denne gjengen på det sterkeste!",
    klarert: true,
  },
  {
    navn: "Linda Marie Erlandsen K.",
    dato: "2022-11-22",
    sitat:
      "Dyktige foto og videographer som lytter og forstår vårt behov som kunde! Utrolig effektive i arbeidet som de leverer, samtidig som det er et fantastisk resultat.",
    fulltekst:
      "Dyktige foto og videographer som lytter og forstår vårt behov som kunde! Utrolig effektive i arbeidet som de leverer, samtidig som det er et fantastisk resultat :D Anbefaler varmt å bruke Reflektor!",
    klarert: true,
    merknad:
      "Verken anmeldelsen eller Reflektors svar nevner selskap. Står uten — navn alene er svakere bevis enn navn + selskap, men å gjette er verre.",
  },
  {
    navn: "Vigdis Bonvik-Stone",
    selskap: "Orkla Foods Norge",
    dato: "2022-11-21",
    sitat:
      "Teamet i Reflektor jobber lynraskt, presist og leverer høy kvalitet hver gang. Jeg har jobbet med dem mange ganger med merkevarer for Orkla Foods Norge og har aldri vært skuffet.",
    fulltekst:
      "Teamet i reflektor jobber lynraskt, presist og leverer høy kvalitet hver gang. Jeg har jobbet med dem mange ganger med merkevarer for Orkla Foods Norge og har aldri vært skuffet. Anbefales på det sterkeste.",
    klarert: true,
    merknad:
      "Godkjent av Pål 15.09 med én betingelse: den skal ikke villede til å tro at Orkla er abonnent. Derfor står den i rutenettet under en seksjonsramme som slår fast at anmeldelsene dekker BÅDE produksjonsoppdrag og månedsabonnement, uten å knytte noen av navnene til den ene eller den andre. Sitatet sier selv «merkevarer for Orkla Foods Norge» — altså produksjon, ikke drift av kanaler. Bredden i selskapsstørrelse er poenget: en anmeldelse fra et konsern og en fra en enkeltbutikk sier noe ulikt, og begge deler er verdt å vise.",
  },
  {
    navn: "Dragos Bucataru",
    dato: "2022-11-21",
    sitat:
      "Their monthly package has allowed us to create a monthly content schedule for our business, which has added a lot of organisation to our marketing calendar.",
    fulltekst:
      "We have been working with Reflektor for almost 6 months, as part of their monthly content package. We are incredibly happy with the quality of work they produce, their professionalism and creativity. They are also very flexible in terms of the type of content they produce, whether it would be videos, stop-motion, photos, advertisements, infotainment commercials, etc. Their monthly package has allowed us to create a monthly content schedule for our business, which has added a lot of organisation to our marketing calendar. The quality is always fantastic and it helps that they are incredibly nice people!",
    klarert: true,
    merknad:
      "Klarert av Pål 15.09. Den eneste anmeldelsen som beskriver selve månedsabonnementet — altså produktet forsiden selger — og dermed den mest relevante av alle ni. Ingen selskapsnavn nevnes, verken i anmeldelsen eller i Reflektors svar, så den navngir ingen abonnent.",
  },
];

/** Kun de som er klarert for visning. */
export const klarerteAnmeldelser = anmeldelser.filter((a) => a.klarert);

/**
 * Google Business Profile — tallene slik Google selv viser dem.
 *
 * HENTET 16.09.2026 ved å rendre kartoppføringen i Chromium og lese panelet:
 *   https://www.google.com/maps/place/?q=place_id:ChIJv6K0bydvQUYRKCndqlmZMpk
 * Panelet viste «Reflektor AS · 5,0 ★★★★★ (11) · Markedsføringsbyrå»,
 * Tvetenveien 162, 0671 Oslo, +47 47 60 50 70, reflektor.no.
 *
 * DETTE OPPHEVER DELER AV FORBEHOLDET OVER. Forbeholdet gjaldt at
 * Elfsight-widgeten filtrerer på `min_rating=5`, så de ni tekstene kan ikke
 * brukes til å regne ut et snitt. Men Google publiserer selv snittet og
 * antallet, og det er en annen og bedre kilde enn en slutning fra ni sitater.
 *
 * At snittet er 5,0 over 11 betyr dessuten at alle elleve er femstjerners:
 * én firestjerners ville gitt 54/11 = 4,909, som Google viser som 4,9.
 * De to som mangler her er altså uten tekst, ikke lavere vurdert.
 *
 * TALLENE MÅ ETTERSES. De endrer seg når noen legger igjen en ny anmeldelse.
 * Sjekk lenken over før lansering, og ved hver gjennomgang av forsiden.
 * Står det noe annet enn 5,0 og 11 der, er siden feil.
 *
 * FORTSATT INGEN AggregateRating-schema. At tallet er sant gjør det ikke
 * lovlig å merke opp: Google regner anmeldelser av en enhet, på enhetens
 * egen side, som self-serving. Se A33.
 */
export const googleProfil = {
  snitt: "5,0",
  antall: 11,
  medTekst: 9,
  url: "https://www.google.com/maps/place/?q=place_id:ChIJv6K0bydvQUYRKCndqlmZMpk",
  hentet: "2026-09-16",
} as const;
