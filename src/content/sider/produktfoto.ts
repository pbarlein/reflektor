import { TBD, type Side } from "./_slot.ts";
import { lagBro } from "../shared/bridge.ts";

/**
 * /produktfoto – slot-inventar etter brief kapittel 6.
 *
 * Seksjon 4 (kapasitet og leveringstid) er hele salget på denne siden. Uten
 * tall for bilder per dag og leveringstid er siden innholdsløs – ført opp som
 * punkt 8 i vedlegg A.
 *
 * ready står false til all copy er godkjent av Pål.
 */
export const produktfoto: Side = {
  sti: "/produktfoto",
  avatar: "4 — E-handelsansvarlig (kategori/netthandel)",
  spørsmål:
    "Hvor mange produkter kan dere fotografere, hvor fort, og hva koster det per bilde?",
  søkeord: [
    "produktfoto + produktbilder (H1)",
    "produktbilder oslo (FAQ)",
  ],
  ready: false,
  seksjoner: [
    {
      nr: 1,
      navn: "Hero",
      jobb: "H1 dekker både «produktfoto» og «produktbilder».",
      slots: {
        "pf.hero.h1": TBD({
          maksOrd: 8,
          jobb: "Må dekke både «produktfoto» og «produktbilder».",
        }),
        "pf.hero.sub": TBD({
          maksTegn: 160,
          jobb: "Hva kunden sitter igjen med.",
        }),
        "pf.hero.cta": TBD({
          maksTegn: 24,
          jobb: "Handling, ikke «Les mer».",
        }),
      },
    },
    {
      nr: 2,
      navn: "Bevis over folden",
      jobb: "Retail- og handelskunder er Reflektors sterkeste kort her.",
      slots: {
        "pf.proof.line": TBD({
          maksTegn: 90,
          jobb: "Navngitte produksjonskunder – aldri som SoMe-abonnenter.",
        }),
      },
    },
    {
      nr: 3,
      navn: "Bildetyper",
      jobb: "Pakkshot, miljø, detalj, bevegelig. Vist, ikke beskrevet.",
      slots: {
        "pf.types.items[0]": TBD({ maksTegn: 70 }),
        "pf.types.items[1]": TBD({ maksTegn: 70 }),
        "pf.types.items[2]": TBD({ maksTegn: 70 }),
        "pf.types.items[3]": TBD({ maksTegn: 70 }),
      },
    },
    {
      nr: 4,
      navn: "Kapasitet og leveringstid",
      jobb: "Bilder per dag, leveringstid i dager, formater. Hele salget.",
      slots: {
        "pf.capacity.stats[0]": TBD({ maksTegn: 40, jobb: "Bilder per dag." }),
        "pf.capacity.stats[1]": TBD({ maksTegn: 40, jobb: "Leveringstid i dager." }),
        "pf.capacity.stats[2]": TBD({ maksTegn: 40, jobb: "Formater." }),
      },
    },
    {
      nr: 5,
      navn: "Pris",
      jobb: "Per bilde eller per dag.",
      slots: {
        "pf.price.from": TBD({ maksTegn: 40 }),
        "pf.price.body": TBD({ maksTegn: 240 }),
      },
    },
    {
      nr: 6,
      navn: "Før / etter",
      jobb: "Leverandørbilde vs. eget bilde.",
      slots: {
        "pf.beforeafter.caption": TBD({ maksTegn: 120 }),
      },
    },
    {
      nr: 7,
      navn: "Sitat + CTA",
      jobb: "Sosialt bevis rett før handling.",
      slots: {
        "pf.quote.body": TBD({ maksTegn: 240 }),
        "pf.quote.navn": TBD({ maksTegn: 60, jobb: "Navn og rolle. Anonyme sitater har ingen verdi." }),
        "pf.cta.h2": TBD({ maksTegn: 60 }),
        "pf.cta.knapp": TBD({ maksTegn: 24 }),
      },
    },
    {
      nr: 8,
      navn: "FAQ",
      jobb: "Innvendingshåndtering. «produktbilder oslo» hører hjemme her.",
      slots: Object.fromEntries(
        Array.from({ length: 5 }, (_, i) => [
          `pf.faq.qa[${i}]`,
          TBD({ maksTegn: 400 }),
        ]),
      ),
    },
    lagBro("pf", 9),
    {
      nr: 10,
      navn: "Kontakt",
      jobb: "Skjemaet. Eneste inbound-strøm siden jobber for.",
      slots: {
        "pf.contact.h2": TBD({ maksTegn: 60 }),
        "pf.contact.body": TBD({ maksTegn: 200 }),
      },
    },
  ],
};
