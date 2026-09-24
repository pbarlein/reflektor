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
};

export const BRIEFVERKTOY = "lever_brief";

const BTAK = { funn: 8, tekst: 300, fra: 140 } as const;

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
    "Finn det som ENDRER dette dokumentet, og bare det.",
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
            typeof q.tekst === "string" ? q.tekst.trim().slice(0, BTAK.tekst) : "";
          if (!tekst) return null;
          return {
            tekst,
            fra:
              typeof q.fra === "string" ? q.fra.trim().slice(0, BTAK.fra) : "",
          };
        })
        .filter((f): f is Briefunn => f !== null)
    : [];

  return {
    funn,
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
