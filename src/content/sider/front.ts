import { TBD, tekst, type Side } from "./_slot.ts";

/**
 * Forsiden.
 *
 * Strukturen er bestemt av evidens, ikke av briefens kapittel 3.0.1 — som er
 * satt til side. Rekkefølgen er den alle tre researchsporene fant uavhengig
 * av hverandre: tilbudet over folden, arbeidet umiddelbart, så prosess, pris,
 * bevis, innvendinger, kontakt.
 *
 * Begrunnelse for at arbeidet kommer så tidlig: Reflektor er et videobyrå.
 * Å vise produktet er både bevis og arbeidsprøve i samme element, og det er
 * billigere enn å beskrive det.
 *
 * NN/g eyetracking: 57 % av visningstiden ligger over folden, og over 65 % av
 * den tiden i øvre halvdel. Posisjoneringen må stå der — beviset kan ligge
 * lenger nede.
 */
export const front: Side = {
  sti: "/",
  spørsmål: "Kan noen andre overta sosiale medier for oss?",
  søkeord: ["merkevaresøk — ingen kommersielle ord i H1 eller title"],
  ready: false,
  seksjoner: [
    {
      nr: 0,
      navn: "Metadata",
      jobb: "Avgjør om noen klikker i søkeresultatet.",
      slots: {
        "front.meta.title": TBD({ maksTegn: 60 }),
        "front.meta.description": TBD({
          maksTegn: 155,
          jobb: "Prisen bør stå. AEO vekter pristransparens tungt.",
        }),
      },
    },
    {
      nr: 1,
      navn: "Hero",
      jobb: "Tilbudet, arbeidsmengden og beviset i øvre halvdel av første skjerm.",
      slots: {
        // Godkjent 23.08. Kursiveringen av «nesten» er poenget: løftet og
        // forbeholdet i samme setning.
        "front.hero.h1": tekst("Sosiale medier – nesten på autopilot.", {
          maksOrd: 8,
        }),
        "front.hero.sub": TBD({
          maksTegn: 180,
          jobb: "Arbeidsmengden for kunden. Den er innvendingen, ikke prisen.",
        }),
        "front.hero.cta": TBD({ maksTegn: 24 }),
        "front.hero.proof": TBD({
          maksTegn: 100,
          jobb: "Navngitt bevis over folden. Kun bekreftede produksjonskunder.",
        }),
      },
    },
    {
      nr: 2,
      navn: "Arbeidet",
      jobb: "Vis produktet. Reel-vegg i 9:16, ikke bakgrunnsvideo.",
      slots: {
        "front.work.eyebrow": tekst("Arbeidet", { maksTegn: 30 }),
        "front.work.h2": TBD({ maksTegn: 60 }),
        "front.work.sub": TBD({
          maksTegn: 120,
          jobb: "Slå fast at alt er egenprodusert. Ingen stock.",
        }),
        // Klippene er IKKE slots. De ligger i src/content/reels.ts med
        // kunde og bransje — se begrunnelsen for utvalget der.
      },
    },
    {
      nr: 3,
      navn: "Slik fungerer det",
      jobb: "Gjør modellen synlig. Innvendingen løses ved å vise, ikke love.",
      slots: {
        "front.how.eyebrow": tekst("Slik jobber vi", { maksTegn: 30 }),
        "front.how.h2": TBD({ maksTegn: 70 }),
        ...Object.fromEntries(
          Array.from({ length: 3 }, (_, i) => [
            `front.how.steps[${i}]`,
            TBD({ maksTegn: 180, jobb: "Tittel og forklaring, skilt med |." }),
          ]),
        ),
      },
    },
    {
      nr: 4,
      navn: "Pris",
      jobb: "Åpen pris. Selvkvalifisering, og AEO vekter det tungt.",
      slots: {
        "front.price.eyebrow": tekst("Pris", { maksTegn: 30 }),
        "front.price.h2": TBD({ maksTegn: 60 }),
        "front.price.note": TBD({
          maksTegn: 220,
          jobb: "Hva som gjør fastprisen mulig. Innvendingen bak innvendingen.",
        }),
      },
    },
    {
      nr: 5,
      navn: "Anmeldelser",
      jobb: "Navngitt sosialt bevis. Den best støttede formen som finnes.",
      slots: {
        "front.reviews.eyebrow": tekst("Det kundene sier", { maksTegn: 30 }),
        "front.reviews.h2": TBD({ maksTegn: 70 }),
        // Selve anmeldelsene er IKKE slots. De er fakta hentet fra Google og
        // ligger i src/content/anmeldelser.ts — ingen skal skrive dem om.
        // Her står bare rammen rundt dem.
      },
    },
    {
      nr: 6,
      navn: "FAQ",
      jobb: "Innvendingshåndtering. Lengde er ikke variabelen — dekning er.",
      slots: Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [
          `front.faq.qa[${i}]`,
          TBD({ maksTegn: 500, jobb: "Spørsmål | svar." }),
        ]),
      ),
    },
    {
      nr: 7,
      navn: "Kontakt",
      jobb: "Skjemaet. Eneste inbound-strøm siden jobber for.",
      slots: {
        "front.contact.h2": TBD({ maksTegn: 60 }),
        "front.contact.sub": TBD({ maksTegn: 200 }),
      },
    },
  ],
};
