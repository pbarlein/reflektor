import type { Epost } from "@/lib/gmail";

import type { Mal } from "./maltype.ts";

/**
 * Det Claude fant i e-posten.
 *
 * ── HVORFOR E-POSTEN IKKE SENDES RETT INN I DOKUMENTINSTRUKSEN ────────────
 *
 * Den enkleste løsningen var å lime åtte e-poster inn i instruksen og la
 * modellen finne ut av det. Tre grunner til at det er feil:
 *
 * 1. Produsenten ville ikke sett hva som ble brukt. En brief hentet fra en
 *    e-post ingen husker, er en påstand med ekstra selvtillit.
 * 2. Åtte tråder er mye tekst, og det meste er ikke brief. Signaturer,
 *    møteavtaler, «takk for sist».
 * 3. Det som faktisk gjelder, blir borte i det som ikke gjør det.
 *
 * Derfor trekkes det ut først, som funn med referanse til meldingen de kom
 * fra — og produsenten ser listen over hvilke e-poster som ble lest.
 */

export type Briefunn = {
  /** Selve funnet, som en fullstendig setning. */
  tekst: string;
  /** Emnet på meldingen det kom fra. */
  fra: string;
};

export type Brief = {
  funn: Briefunn[];
  /** Meldingene som faktisk ble lest. Vises til produsenten. */
  lest: { emne: string; avsender: string; dato: string }[];
  /**
   * Lenken til SoMe-strategien i Canva, hvis den lå i en av trådene.
   *
   * ── HVORFOR DEN HAR SITT EGET FELT ────────────────────────────────────
   *
   * Bestilt 24.09.2026: «i mail-researchen skal du være spesielt på søken
   * etter en canva-lenke med some-strategi som jeg har sendt i en mailtråd
   * på et tidspunkt til kunden og til produsenten.»
   *
   * Som et funn blant åtte andre ville den druknet, og produsenten måtte
   * lest gjennom listen for å se om den var der. Som eget felt kan den
   * vises som en knapp, og produsenten ser på ett blikk om strategien er
   * funnet eller ikke.
   */
  strategi: string;
};

export const BRIEFVERKTOY = "lever_brief";

const BTAK = { funn: 8, tekst: 300, fra: 140, strategi: 500 } as const;

export function briefSkjema(): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      funn: {
        type: "array",
        description:
          "Det i e-posten som endrer dette dokumentet. Tom liste hvis ingenting gjør det.",
        items: {
          type: "object",
          properties: {
            tekst: { type: "string" },
            fra: {
              type: "string",
              description: "Emnet på e-posten funnet kommer fra.",
            },
          },
          required: ["tekst", "fra"],
        },
      },
      strategi: {
        type: "string",
        description:
          "Lenken til kundens SoMe-strategi i Canva, hvis en av e-postene inneholder en. Tom streng hvis ingen gjør det. Bare selve URL-en.",
      },
    },
    required: ["funn"],
  };
}

export function briefInstruks(
  mal: Mal,
  kunde: string,
  poster: readonly Epost[],
): string {
  return [
    `En produsent i Reflektor skal lage dokumentet «${mal.navn}» for kunden ${kunde}. Under ligger e-post fra hens egen postkasse som nevner kunden.`,
    "",
    "Du har to oppgaver.",
    "",
    [
      "OPPGAVE 1: FINN SOME-STRATEGIEN",
      "Et sted i disse trådene ligger det med stor sannsynlighet en lenke til kundens SoMe-strategi i Canva. Den er sendt fra Reflektor til kunden og til produsenten, og den kan ligge langt tilbake i tid.",
      "Slik ser den ut: en URL på canva.com, som regel canva.com/design/... . Den kan stå bak en tekstlenke, i en signatur, eller i et videresendt utdrag.",
      "Er det flere canva-lenker, velg den som handler om strategi, innholdsplan eller sosiale medier — ikke en presentasjon eller et bildeoppsett. Er du i tvil mellom to, velg den nyeste.",
      "Finner du ingen, lever tom streng. Ikke oppgi en lenke du har konstruert, og ikke oppgi en canva.com-lenke du ikke har sett i teksten.",
      "Fant du strategien, ta med et funn som sier hvilken e-post den lå i, så produsenten finner tråden.",
    ].join("\n"),
    "",
    "OPPGAVE 2: FINN DET SOM ENDRER DETTE DOKUMENTET, og bare det.",
    "",
    [
      "DETTE ER FUNN",
      "- Noe kunden har bedt om, sagt ja til eller sagt nei til.",
      "- Datoer, klokkeslett, navn og roller som gjelder oppdraget.",
      "- Føringer på innhold, uttrykk eller leveranse.",
      "- Noe som er endret siden sist.",
    ].join("\n"),
    "",
    [
      "DETTE ER IKKE FUNN",
      "- Høflighetsfraser, signaturer, møteinnkallinger, automatiske svar.",
      "- Det som gjelder en annen kunde eller et annet oppdrag.",
      "- Det som allerede er gammelt fordi en nyere e-post sier noe annet. Nyeste melding gjelder.",
      "- Din egen tolkning av hva de sikkert mener.",
    ].join("\n"),
    "",
    "Hvert funn skal ha emnet på e-posten det kommer fra, så produsenten kan finne den igjen. Finner du ingenting som gjelder dokumentet, lever en tom liste — det er et riktig svar, og bedre enn å strekke noe til å passe.",
    "Skriv på norsk, i fullstendige setninger.",
    "",
    "── E-POSTEN ──",
    poster
      .map(
        (p, i) =>
          `[${i + 1}] ${p.dato} · fra ${p.fra} · emne: ${p.emne}\n${p.tekst}`,
      )
      .join("\n\n---\n\n"),
    "",
    `Kall ${BRIEFVERKTOY} når du er ferdig.`,
  ].join("\n");
}

export function lesBrief(
  rått: unknown,
  poster: readonly Epost[],
): Brief | null {
  if (!rått || typeof rått !== "object") return null;
  const o = rått as Record<string, unknown>;

  const funn = Array.isArray(o.funn)
    ? o.funn
        .slice(0, BTAK.funn)
        .map((f) => {
          if (!f || typeof f !== "object") return null;
          const q = f as Record<string, unknown>;
          const tekst =
            typeof q.tekst === "string"
              ? q.tekst.trim().slice(0, BTAK.tekst)
              : "";
          if (!tekst) return null;
          return {
            tekst,
            fra:
              typeof q.fra === "string" ? q.fra.trim().slice(0, BTAK.fra) : "",
          };
        })
        .filter((f): f is Briefunn => f !== null)
    : [];

  /*
   * Bare ekte canva-lenker slipper gjennom. Modellen har fått beskjed om å
   * ikke konstruere en, men feltet blir til en knapp produsenten trykker
   * på, og en knapp skal ikke kunne peke hvor som helst.
   */
  const rå = typeof o.strategi === "string" ? o.strategi.trim() : "";
  const strategi = /^https:\/\/([a-z0-9-]+\.)*canva\.com\//i.test(rå)
    ? rå.slice(0, BTAK.strategi)
    : "";

  return {
    funn,
    strategi,
    lest: poster.map((p) => ({
      emne: p.emne,
      avsender: p.fra,
      dato: p.dato,
    })),
  };
}

/** Briefen slik dokumentinstruksen ser den. */
export function briefTilTekst(brief: Brief): string {
  if (!brief.funn.length) return "";
  return [
    "DETTE STÅR I E-POSTEN MED KUNDEN",
    "Hentet fra produsentens egen postkasse rett før dette dokumentet ble laget, og produsenten har sett listen.",
    "",
    ...brief.funn.map((f) => `- ${f.tekst}`),
    "",
    "DETTE VEIER TYNGST AV ALT. Det er kunden som har sagt det, skriftlig. Står det i strid med researchen fra nettet, gjelder e-posten. Står det i strid med et utfylt felt, gjelder feltet — produsenten har sett begge deler og valgt.",
  ].join("\n");
}
