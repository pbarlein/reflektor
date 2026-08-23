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
      nr: 1,
      navn: "Hero",
      jobb: "Tilbudet, prisen og beviset i ett skjermbilde.",
      slots: {
        "home.hero.h1": TBD({
          maksOrd: 8,
          jobb: "Må eie «some byrå» og «sosiale medier byrå».",
        }),
        "home.hero.sub": TBD({
          maksTegn: 180,
          jobb: "Hva kunden slipper å gjøre selv.",
        }),
        "home.hero.cta": TBD({ maksTegn: 24, jobb: "Handling, ikke «Les mer»." }),
        "home.hero.proof": TBD({
          maksTegn: 90,
          jobb: "Navngitt bevis over folden. Produksjonskunder.",
        }),
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
        "home.pricing.note": TBD({
          maksTegn: 200,
          jobb: "Hva som gjør fastprisen mulig – innvendingen bak innvendingen.",
        }),
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
      slots: Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [
          `home.process.steps[${i}]`,
          TBD({ maksTegn: 140 }),
        ]),
      ),
    },
    {
      nr: 6,
      navn: "Hvem vi produserer for",
      jobb: "Navngitte produksjonskunder, eksplisitt merket som det.",
      slots: {
        "home.clients.intro": TBD({
          maksTegn: 120,
          jobb: "Må gjøre tydelig at disse er produksjonskunder, ikke abonnenter.",
        }),
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
      slots: Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [
          `home.services.items[${i}]`,
          TBD({ maksTegn: 80 }),
        ]),
      ),
    },
    {
      nr: 9,
      navn: "FAQ",
      jobb: "Long tail-søk hører hjemme her. Merkes som FAQPage-schema.",
      slots: Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [
          `home.faq.qa[${i}]`,
          TBD({ maksTegn: 500 }),
        ]),
      ),
    },
    {
      nr: 10,
      navn: "Kontakt",
      jobb: "Maks 4 felt. Sender til /takk.",
      slots: {
        "home.contact.h2": TBD({ maksTegn: 60 }),
        "home.contact.sub": TBD({ maksTegn: 200 }),
      },
    },
  ],
};
