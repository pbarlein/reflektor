import { osloDeler, osloTidspunkt } from "./paaminnelse";

/**
 * Når på døgnet e-post 1 får gå ut.
 *
 * BESTILT AV PÅL 04.10.2026. E-posten ser ut som en Pål har skrevet selv,
 * fra hans egen Gmail. Da kan den ikke komme kl. 03:12. En presentasjon som
 * ankommer midt på natten avslører at det er en maskin som sendte den, og
 * det er nøyaktig det hele oppsettet er bygget for å unngå.
 *
 * VINDUET ER 07:00–21:00. Kommer leadet innenfor, sendes e-posten som før —
 * innen fem minutter. Kommer det utenfor, holdes den til NESTE MORGEN KL.
 * 08:00, og jobben sender da alt som ligger i kø.
 *
 * ÅTTE OM MORGENEN, IKKE SJU. Vinduet åpner 07:00, men køen tømmes 08:00.
 * Det er med vilje: et lead som kom 02:00 skal ikke ligge først i innboksen
 * når kunden slår på telefonen, men komme inn i en vanlig arbeidsmorgen.
 *
 * HELG TELLER SOM VANLIG DAG. Et lead lørdag kl. 23 får e-posten søndag kl.
 * 08. Her skiller denne regelen seg fra påminnelsen, som venter til
 * nærmeste hverdag: presentasjonen er svaret på en henvendelse personen
 * nettopp har sendt, og den tåler ikke å ligge til mandag.
 *
 * ALT REGNES I EUROPE/OSLO. Vercel kjører i UTC. Se lib/paaminnelse.ts for
 * hvorfor klokka må leses gjennom `Intl` og ikke med `getHours()`.
 */

/** Første time e-posten får gå ut. */
export const VINDU_FRA = 7;
/** Første time den IKKE får gå ut. 21 betyr «til og med 20:59». */
export const VINDU_TIL = 21;
/** Klokka køen tømmes neste morgen. */
export const KOTIME = 8;

/** Er det nå lov å sende e-post 1? */
export function innenforVinduet(na: Date): boolean {
  const { time } = osloDeler(na);
  return time >= VINDU_FRA && time < VINDU_TIL;
}

/**
 * Når e-post 1 går ut for et lead som kom inn på `konvertert`.
 *
 * Er vi innenfor vinduet, er svaret «nå». Ellers er det neste morgen kl.
 * 08:00 — regnet fra NÅ, ikke fra konverteringen. Et lead som kom 23:30 og
 * en jobb som kjører 00:05 skal gi samme svar: i dag kl. 08:00.
 *
 * ETTER MIDNATT ER «NESTE MORGEN» I DAG. Klokka 02:00 på en tirsdag er
 * svaret tirsdag 08:00, ikke onsdag. Derfor legges det bare til et døgn når
 * klokka alt har passert køtimen.
 */
export function planlagtSending(na: Date): Date {
  if (innenforVinduet(na)) return na;

  const d = osloDeler(na);
  const senereIDag = d.time < KOTIME;
  const dag = senereIDag ? d.dag : d.dag + 1;

  /* Veien om UTC normaliserer månedsskifte og årsskifte. */
  const neste = new Date(Date.UTC(d.ar, d.maned - 1, dag));
  return osloTidspunkt(
    neste.getUTCFullYear(),
    neste.getUTCMonth() + 1,
    neste.getUTCDate(),
    KOTIME,
    0,
  );
}

/** Venter e-posten på at vinduet skal åpne? */
export function venterPaaVinduet(na: Date): boolean {
  return !innenforVinduet(na);
}
