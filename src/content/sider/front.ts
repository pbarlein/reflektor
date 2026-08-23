import { TBD, tekst, type Side } from "./_slot.ts";

/**
 * Forsiden – merkevaresiden (brief 3.0.1).
 *
 * KRITISK: forsiden skal IKKE inneholde «sosiale medier byrå» i H1 eller
 * title. Det ordet tilhører /sosiale-medier-byra alene. Forsiden har ingen
 * egen søkeordsjobb utover merkevaresøk.
 *
 * Primær-CTA peker til /sosiale-medier-byra, ikke til skjema. Forsiden selger
 * ikke ferdig – den sender videre.
 *
 * Nummer 2 i copy-rekkefølgen (9.1), fordi den bare komprimerer det
 * abonnementssiden allerede har sagt.
 */
export const front: Side = {
  sti: "/",
  spørsmål: "Hvem er Reflektor?",
  søkeord: ["kun merkevaresøk – ingen kommersielle ord her"],
  ready: false,
  seksjoner: [
    {
      nr: 0,
      navn: "Metadata",
      jobb: "Merkevaresøk. Ingen kommersielle ord.",
      slots: {
        /*
         * MÅ IKKE inneholde «sosiale medier byrå». Det ordet tilhører
         * /sosiale-medier-byra alene, og to sider som kjemper om samme ord
         * er kannibalisering – ikke dobbelt sjanse.
         */
        "front.meta.title": tekst("Reflektor – strategi, innhold og publisering til fast pris", { maksTegn: 60 }),
        "front.meta.description": tekst(
          "Oslo-basert byrå for sosiale medier, video og foto. Fast månedspris, ingen bindingstid. Se arbeidet og be om et strategiforslag.",
          { maksTegn: 155 },
        ),
      },
    },
    {
      nr: 1,
      navn: "Hero",
      jobb: "Hvem Reflektor er, på én linje.",
      slots: {
        /*
         * Uendret fra dagens forside. Briefen peker på formuleringen som en
         * som skal bevares, og den holder forsiden ute av konkurranse med
         * abonnementssiden om søkespråket.
         */
        "front.hero.h1": tekst("Sosiale medier – nesten på autopilot.", {
          maksOrd: 8,
          jobb: "Merkevare, ikke søkeord. Ikke «sosiale medier byrå».",
        }),
        "front.hero.sub": tekst(
          "Vi produserer, klipper og publiserer. Dere godkjenner. Fast pris, én dag i måneden.",
          { maksTegn: 180 },
        ),
        "front.hero.cta": tekst("Få et strategiforslag", {
          maksTegn: 24,
          jobb: "Peker til /sosiale-medier-byra, ikke til skjema.",
        }),
      },
    },
    {
      nr: 2,
      navn: "Arbeidet",
      jobb: "Rutenett av faktisk produsert video. Hele beviset.",
      slots: {
        "front.work.h2": tekst("Arbeidet", { maksTegn: 60 }),
        "front.work.sub": tekst("Alt under er produsert av oss. Ingen stockvideo.", { maksTegn: 120 }),
        "front.work.caption[0]": TBD({ maksTegn: 60 }),
        "front.work.caption[1]": TBD({ maksTegn: 60 }),
        "front.work.caption[2]": TBD({ maksTegn: 60 }),
        "front.work.caption[3]": TBD({ maksTegn: 60 }),
        "front.work.caption[4]": TBD({ maksTegn: 60 }),
        "front.work.caption[5]": TBD({ maksTegn: 60 }),
      },
    },
    {
      nr: 3,
      navn: "Abonnementet",
      jobb: "Komprimert. Lenker videre – selger ikke ferdig her.",
      slots: {
        "front.sub.h2": tekst("Abonnementet", { maksTegn: 60 }),
        "front.sub.body": tekst(
          "Én produksjonsdag i måneden gir 8–10 ferdige videoer, publisert to ganger i uken på Instagram med kryssposting til Facebook. 30 000 kr/mnd, ingen bindingstid.",
          { maksTegn: 280 },
        ),
        // Lenker videre, selger ikke. Konverteringen skjer på abonnementssiden.
        "front.sub.cta": tekst("Se hva som inngår", { maksTegn: 24 }),
      },
    },
    {
      nr: 4,
      navn: "Engangsoppdrag",
      jobb: "Fire kort til landingssidene. Intern lenking som teller.",
      slots: {
        "front.services.h2": tekst("Trenger dere bare én ting?", { maksTegn: 60 }),
        "front.services.items[0]": tekst("Reklamefilm — film til TV og nett. Fra 40 000 kr.", { maksTegn: 90 }),
        "front.services.items[1]": tekst("Innholdsproduksjon — video og foto til egne kanaler.", { maksTegn: 90 }),
        "front.services.items[2]": tekst("Produktfoto — produktbilder til nettbutikk og katalog.", { maksTegn: 90 }),
        "front.services.items[3]": tekst("Videoproduksjon i Oslo — ett oppdrag, én leveranse.", { maksTegn: 90 }),
      },
    },
    {
      nr: 5,
      navn: "Kunder",
      jobb: "Logobjelke med bildetekst som gjør produksjonskunde tydelig.",
      slots: {
        "front.clients.h2": tekst("Hvem vi produserer for", { maksTegn: 60 }),
        "front.clients.intro": tekst(
          "Bedriftene under er produksjonskunder. Hvem vi drifter sosiale medier for, oppgir vi ikke offentlig.",
          { maksTegn: 150 },
        ),
      },
    },
    {
      nr: 6,
      navn: "Kontakt",
      jobb: "Maks 4 felt. Skjema → /takk.",
      slots: {
        /*
         * Bevisst ikke «Få et strategiforslag». Den overskriften tilhører
         * abonnementssiden – to identiske overskrifter over samme skjema
         * gjør sidene umulige å skille i GA4.
         */
        "front.contact.h2": tekst("Snakk med oss", { maksTegn: 60 }),
        "front.contact.sub": tekst(
          "Fortell kort om bedriften, så får dere et konkret forslag tilbake — ikke en generisk presentasjon.",
          { maksTegn: 200 },
        ),
      },
    },
  ],
};
