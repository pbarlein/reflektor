import { TBD, type Side } from "./_slot.ts";

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
        "front.meta.title": TBD({ maksTegn: 60 }),
        "front.meta.description": TBD({ maksTegn: 155 }),
      },
    },
    {
      nr: 1,
      navn: "Hero",
      jobb: "Hvem Reflektor er, på én linje.",
      slots: {
        "front.hero.h1": TBD({
          maksOrd: 8,
          jobb: "Merkevare, ikke søkeord. Ikke «sosiale medier byrå».",
        }),
        "front.hero.sub": TBD({ maksTegn: 180 }),
        "front.hero.cta": TBD({
          maksTegn: 24,
          jobb: "Peker til /sosiale-medier-byra, ikke til skjema.",
        }),
      },
    },
    {
      nr: 2,
      navn: "Arbeidet",
      jobb: "Rutenett av faktisk produsert video. Hele beviset.",
      slots: Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [
          `front.work.caption[${i}]`,
          TBD({ maksTegn: 60 }),
        ]),
      ),
    },
    {
      nr: 3,
      navn: "Abonnementet",
      jobb: "Komprimert. Lenker videre – selger ikke ferdig her.",
      slots: {
        "front.sub.h2": TBD({ maksTegn: 60 }),
        "front.sub.body": TBD({ maksTegn: 280 }),
        "front.sub.cta": TBD({ maksTegn: 24 }),
      },
    },
    {
      nr: 4,
      navn: "Engangsoppdrag",
      jobb: "Fire kort til landingssidene. Intern lenking som teller.",
      slots: Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [
          `front.services.items[${i}]`,
          TBD({ maksTegn: 80 }),
        ]),
      ),
    },
    {
      nr: 5,
      navn: "Kunder",
      jobb: "Logobjelke med bildetekst som gjør produksjonskunde tydelig.",
      slots: {
        "front.clients.intro": TBD({ maksTegn: 120 }),
      },
    },
    {
      nr: 6,
      navn: "Kontakt",
      jobb: "Maks 4 felt. Skjema → /takk.",
      slots: {
        "front.contact.h2": TBD({ maksTegn: 60 }),
        "front.contact.sub": TBD({ maksTegn: 200 }),
      },
    },
  ],
};
