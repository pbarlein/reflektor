import { TBD, tekst, type Side } from "./_slot.ts";

/**
 * /sosiale-medier-byra – abonnementssiden (brief kapittel 6, SIDE 1).
 *
 * Slot-prefikset `home.` er beholdt av historiske grunner og peker på DENNE
 * siden, ikke på forsiden. Forsidens slots har prefikset `front.`.
 *
 * Rekkefølgen på seksjonene er LÅST. Antall kan reduseres, aldri omrokeres.
 *
 * Noen slots er forhåndsutfylt fordi de er låste rammer i brief 0.3 – pris,
 * vilkår og de fire tellbare punktene i leveransen. Brief 9.3 sier eksplisitt
 * at vi ikke skal be om godkjenning på det som allerede er definert i
 * dokumentet. Alt som krever stemme og overtalelse står som TBD.
 */
export const home: Side = {
  sti: "/sosiale-medier-byra",
  avatar: "1 (primær), 2 (sekundær)",
  spørsmål:
    "Kan noen andre overta sosiale medier for oss, uten at det blir min jobb å følge dem opp?",
  søkeord: ["some byrå (H1, title)", "sosiale medier byrå (H1, title)"],
  ready: false,
  seksjoner: [
    {
      nr: 0,
      navn: "Metadata",
      jobb: "Det som avgjør om noen klikker i søkeresultatet.",
      slots: {
        /*
         * Primærsøkeord først (8.3). «| Reflektor» legges på ett sted, i
         * metadatafunksjonen – aldri her.
         *
         * Prisankeret er med vilje tilbake: title-taggen var en periode
         * identisk med H1, og da forsvant «30 000 kr/mnd» fra SERP-snippeten.
         * Den er dagens formulering på reflektor.no, ikke nyskrevet.
         */
        "home.meta.title": tekst(
          "Sosiale medier-byrå i Oslo – fast pris 30 000 kr/mnd",
          { maksTegn: 60 },
        ),
        /*
         * Åpner på «SoMe-byrå» med vilje. H1 eier «sosiale medier-byrå», og
         * åtte ord rekker ikke til begge primærsøkeordene. Descriptionen tar
         * det andre uten å røre H1.
         *
         * «Ingen bindingstid» er valgt foran «tre måneders oppsigelse» fordi
         * det er det som henter klikket. Den låste rammen i 0.3 krever at
         * begge står eksplisitt på SIDEN – og det gjør de, i seksjon 3.
         */
        "home.meta.description": tekst(
          "SoMe-byrå i Oslo med fast pris: 30 000 kr/mnd. Én produksjonsdag " +
            "gir 8–10 ferdige videoer, publisert to ganger i uken. Ingen " +
            "bindingstid.",
          {
            maksTegn: 155,
            jobb: "Selger klikket i søkeresultatet. Ikke en gjentakelse av H1.",
          },
        ),
      },
    },
    {
      nr: 1,
      navn: "Hero",
      jobb: "Tilbudet, prisen og beviset i ett skjermbilde.",
      slots: {
        "home.hero.h1": tekst("Sosiale medier-byrå i Oslo med fast pris", {
          maksOrd: 8,
          jobb: "Må eie «some byrå» og «sosiale medier byrå».",
        }),
        "home.hero.sub": tekst(
          "Én produksjonsdag i måneden gir 8–10 ferdige videoer. Vi " +
            "publiserer to ganger i uken på Instagram og Facebook. Dere " +
            "godkjenner før noe går ut.",
          { maksTegn: 180, jobb: "Hva kunden slipper å gjøre selv." },
        ),
        // Samme ord som skjemaknappen nederst. Én formulering hele siden ned.
        "home.hero.cta": tekst("Få et strategiforslag", {
          maksTegn: 24,
          jobb: "Handling, ikke «Les mer».",
        }),
        // Navnene går igjen i logostripa i seksjon 6, så heroen og den
        // bekrefter hverandre framfor å introdusere et nytt sett.
        "home.hero.proof": tekst(
          "Vi produserer innhold for blant andre Orkla, Anton Sport, " +
            "Vitusapotek og The Well.",
          { maksTegn: 90, jobb: "Navngitt bevis over folden. Produksjonskunder." },
        ),
      },
    },
    {
      nr: 2,
      navn: "Hva du får",
      jobb: "Fire tellbare punkter.",
      slots: {
        // Låst i brief 0.3 og spesifisert i kapittel 6.
        "home.deliverable.items[0]": tekst("Én produksjonsdag per måned", { maksTegn: 60 }),
        "home.deliverable.items[1]": tekst("8–10 ferdige videoer", { maksTegn: 60 }),
        "home.deliverable.items[2]": tekst("Publisering to ganger i uka", { maksTegn: 60 }),
        "home.deliverable.items[3]": tekst("Instagram primær, Facebook kryss", { maksTegn: 60 }),
      },
    },
    {
      nr: 3,
      navn: "Pris og vilkår",
      jobb: "Den viktigste innvendingen. Skal stå tidlig.",
      slots: {
        // Låst i 0.3: skrives alltid slik, aldri «eks. mva» eksternt.
        "home.pricing.amount": tekst("30 000 kr/mnd", { maksTegn: 30 }),
        "home.pricing.terms": tekst(
          "Tre måneders oppsigelse. Ingen bindingstid.",
          { maksTegn: 80 },
        ),
        "home.pricing.note": tekst(
          "Prisen dekker produksjonsdag, redigering og publisering. " +
            "Kommentarfelt, stories og betalt annonsering inngår ikke — det " +
            "er derfor prisen står fast.",
          {
            maksTegn: 200,
            jobb: "Hva som gjør fastprisen mulig – innvendingen bak innvendingen.",
          },
        ),
      },
    },
    {
      nr: 4,
      navn: "Arbeidet",
      jobb: "Rutenett av faktisk produsert video. Ingen stockmateriale.",
      slots: Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [
          `home.work.caption[${i}]`,
          TBD({ maksTegn: 60, jobb: "Kunde og format." }),
        ]),
      ),
    },
    {
      nr: 5,
      navn: "Slik fungerer det",
      jobb: "Fire steg. Understreker hvor lite kunden må gjøre.",
      /*
       * Hvert steg sier hva kunden slipper å gjøre – det er jobben briefen
       * gir seksjonen. Steg 3 gjentar «godkjenner» fra hero-sub'en med vilje:
       * kontrollen over hva som publiseres er innvendingen som tåler å bli
       * sagt to ganger.
       */
      slots: {
        "home.process.steps[0]": tekst(
          "Vi blir enige om retning og hva som skal produseres. Ett møte, så er den delen unnagjort.",
          { maksTegn: 140 },
        ),
        "home.process.steps[1]": tekst(
          "Én produksjonsdag i måneden. Dere setter av tiden — vi står for resten.",
          { maksTegn: 140 },
        ),
        "home.process.steps[2]": tekst(
          "Vi klipper 8–10 ferdige videoer og legger dem i en publiseringsplan dere godkjenner.",
          { maksTegn: 140 },
        ),
        "home.process.steps[3]": tekst(
          "Vi publiserer to ganger i uken på Instagram, med kryssposting til Facebook.",
          { maksTegn: 140 },
        ),
      },
    },
    {
      nr: 6,
      navn: "Hvem vi produserer for",
      jobb: "Navngitte produksjonskunder, eksplisitt merket som det.",
      slots: {
        /*
         * Grensen var 120 tegn – et estimat fra meg, ikke et krav fra briefen.
         * Hevet til 150 fordi linja gjør to jobber: merker kundene som
         * produksjonskunder OG forklarer hvorfor abonnentene ikke navngis.
         * Den låste rammen i 0.3 krever begge deler.
         */
        "home.clients.intro": tekst(
          "Bedriftene under er produksjonskunder — vi har laget foto og video for dem. Hvem vi drifter sosiale medier for, oppgir vi ikke offentlig.",
          {
            maksTegn: 150,
            jobb: "Må gjøre tydelig at disse er produksjonskunder, ikke abonnenter.",
          },
        ),
      },
    },
    {
      nr: 7,
      navn: "Sitat",
      jobb: "Ett sitat, plassert ved CTA-en.",
      slots: {
        "home.quote.body": TBD({ maksTegn: 240 }),
        "home.quote.attrib": TBD({
          maksTegn: 60,
          jobb: "Navn og rolle. Anonyme sitater har ingen verdi.",
        }),
      },
    },
    {
      nr: 8,
      navn: "Engangsoppdrag",
      jobb: "«Trenger dere bare én ting?» Lenker ned til landingssidene.",
      /* Grensen hevet fra 80 til 90 – 80 var mitt estimat, ikke et designkrav. */
      slots: {
        "home.services.items[0]": tekst("Reklamefilm til TV og nett. Fra 40 000 kr, eller 30 000 kr som del av en fast avtale.", { maksTegn: 90 }),
        "home.services.items[1]": tekst("Innholdsproduksjon. Video og foto til egne kanaler, som enkeltprosjekt.", { maksTegn: 90 }),
        "home.services.items[2]": tekst("Produktfoto. Rene produktbilder til nettbutikk og katalog.", { maksTegn: 90 }),
        "home.services.items[3]": tekst("Videoproduksjon i Oslo. Ett oppdrag, én leveranse — uten abonnement.", { maksTegn: 90 }),
      },
    },
    {
      nr: 9,
      navn: "FAQ",
      jobb: "Long tail-søk hører hjemme her. Merkes som FAQPage-schema.",
      /*
       * Format: «spørsmål | svar». Skilletegnet brukes både av
       * FAQPage-schemaet og av details/summary-visningen.
       */
      slots: {
        "home.faq.qa[0]": tekst("Hva koster det? | 30 000 kr i måneden, fast. Prisen endrer seg ikke med hvor mye som produseres den måneden.", { maksTegn: 500 }),
        "home.faq.qa[1]": tekst("Er det bindingstid? | Nei. Tre måneders oppsigelse, ingen bindingstid utover det.", { maksTegn: 500 }),
        "home.faq.qa[2]": tekst("Hvilke kanaler publiserer dere i? | Instagram er primærkanal, med kryssposting til Facebook. To publiseringer i uken.", { maksTegn: 500 }),
        "home.faq.qa[3]": tekst("Hva gjør dere ikke? | Vi håndterer ikke kommentarfelt, stories eller betalt annonsering. Det er derfor prisen står fast.", { maksTegn: 500 }),
        "home.faq.qa[4]": tekst("Kan vi kjøpe én produksjon i stedet for abonnement? | Ja. Reklamefilm, produktfoto og videoproduksjon selges som enkeltoppdrag.", { maksTegn: 500 }),
        "home.faq.qa[5]": tekst("Hvor mye må vi gjøre selv? | Sette av én dag i måneden og godkjenne publiseringsplanen. Resten gjør vi.", { maksTegn: 500 }),
      },
    },
    {
      nr: 10,
      navn: "Kontakt",
      jobb: "Maks 4 felt. Sender til /takk.",
      slots: {
        // Samme ord som begge CTA-ene. Én formulering hele siden ned.
        "home.contact.h2": tekst("Få et strategiforslag", { maksTegn: 60 }),
        "home.contact.sub": tekst(
          "Fortell kort om bedriften, så får dere et konkret forslag tilbake — ikke en generisk presentasjon.",
          { maksTegn: 200 },
        ),
      },
    },
  ],
};
