"use client";

import type { Rubrikk } from "@/content/rubrikktype";

/**
 * «Rubrikkene som ligger øverst, skal være de mest sette.»
 *
 * DET ER ET KRAV OM ET TALL SOM MÅ MÅLES, og det er verdt å være presis om
 * hva som faktisk telles her.
 *
 * Tellingen skjer i `localStorage`, altså PER NETTLESER. Da er «mest sett»
 * = mest åpnet av DEG, ikke av Reflektor. Det er en ekte måling, og den blir
 * riktigere jo mer huben brukes — men den er personlig, og det skal
 * grensesnittet si tydelig fra om. Det står «Mest brukt av deg» i
 * sorteringsvelgeren, ikke «Mest populære».
 *
 * HVORFOR IKKE FELLES TALL. Et delt tall krever et delt lager. Vercel-
 * funksjoner er kortlivede, så en fil eller en variabel i minnet nullstilles
 * uten varsel; det ville gitt et tall som SER felles ut og ikke er det.
 * Alternativet er Vercel KV eller en annen database — fullt mulig, men det
 * er infrastruktur noen må sette opp og betale for, og valget er ikke mitt
 * å ta. Se LES-MEG.md for hvor byttet gjøres: hele lageret ligger bak de to
 * funksjonene under.
 *
 * INGEN PERSONDATA. Lageret inneholder rubrikk-slugger og heltall. Ingen
 * e-post, ingen identifikator, ingenting som forlater nettleseren.
 */

import { useSyncExternalStore } from "react";

const NOKKEL = "reflektor_intern_visninger_v1";

export type Visninger = Record<string, number>;

/**
 * Leser tellerne. Returnerer ALLTID et objekt, aldri `null`.
 *
 * `localStorage` kan kaste — privat modus i eldre Safari, blokkerte
 * informasjonskapsler, en utvidelse som har meninger. En hub som ikke
 * rendrer fordi en teller ikke kunne leses, er en dårlig byttehandel.
 */
export function lesVisninger(): Visninger {
  if (typeof window === "undefined") return {};
  try {
    const rå = window.localStorage.getItem(NOKKEL);
    if (!rå) return {};
    const data: unknown = JSON.parse(rå);
    if (!data || typeof data !== "object") return {};
    const rent: Visninger = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isFinite(v) && v > 0) rent[k] = v;
    }
    return rent;
  } catch {
    return {};
  }
}

/** Teller én åpning. Kalles fra rubrikksiden, ikke fra kortet. */
export function tellVisning(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const tall = { ...hentSnapshot() };
    tall[slug] = (tall[slug] ?? 0) + 1;
    window.localStorage.setItem(NOKKEL, JSON.stringify(tall));
  } catch {
    /* Tellingen er en bekvemmelighet. Den skal aldri være en feilkilde. */
  }
  // Uansett om skrivingen gikk gjennom: si fra, så leseren henter på nytt.
  meldFra();
}

/*
 * ══════════════════════════════════════════════════════════════════════════
 * LAGERET SOM EN EKSTERN KILDE
 * ══════════════════════════════════════════════════════════════════════════
 *
 * `localStorage` ER en ekstern kilde, og React har en egen krok for akkurat
 * det: `useSyncExternalStore`. Den løser to ting en `useEffect` med
 * `setState` ikke løser:
 *
 *   1. HYDRERING. Serveren har ingen localStorage. Kroken tar imot et eget
 *      serversnapshot — et tomt, fast objekt — og bruker det under
 *      hydrering. Da kan klient og server ikke være uenige.
 *   2. ENDRINGER FRA ANDRE FANER. `storage`-hendelsen fyrer i ALLE andre
 *      faner på samme opphav. Leser noen en rubrikk i fane to, sorterer
 *      huben i fane én seg om av seg selv.
 *
 * SNAPSHOTET MÅ BUFRES. Kroken sammenligner med `Object.is`; et nytt objekt
 * for hvert kall ville gitt uendelig omrendring. Derfor cachen under, som
 * bare tømmes når noe faktisk har endret seg.
 */

/** Fast referanse. Et nytt `{}` per kall ville gitt uendelig omrendring. */
const TOMT: Visninger = Object.freeze({});

let buffer: Visninger | null = null;
const lyttere = new Set<() => void>();

function meldFra(): void {
  buffer = null;
  for (const l of lyttere) l();
}

function hentSnapshot(): Visninger {
  buffer ??= lesVisninger();
  return buffer;
}

function hentServerSnapshot(): Visninger {
  return TOMT;
}

function abonner(varsle: () => void): () => void {
  lyttere.add(varsle);
  /*
   * `storage` fyrer bare i ANDRE faner, aldri i den som skrev. Det er
   * derfor `tellVisning` også kaller `meldFra()` selv — uten det ville
   * telleren i egen fane vært stum til neste fanebytte.
   */
  const fraAnnenFane = (e: StorageEvent) => {
    if (e.key === NOKKEL || e.key === null) meldFra();
  };
  window.addEventListener("storage", fraAnnenFane);
  return () => {
    lyttere.delete(varsle);
    window.removeEventListener("storage", fraAnnenFane);
  };
}

/** Kroken komponentene bruker. */
export function useVisninger(): Visninger {
  return useSyncExternalStore(abonner, hentSnapshot, hentServerSnapshot);
}

export function nullstillVisninger(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NOKKEL);
  } catch {
    /* Se over. */
  }
  meldFra();
}

/**
 * Sorteringene.
 *
 * `prioritet` er tiebreaker i alle tre, og det er poenget med feltet: før
 * noen har åpnet noe som helst, er den redaksjonelle rekkefølgen det beste
 * svaret på «hva er viktigst». Den blir gradvis overstyrt av faktisk bruk i
 * stedet for å bli erstattet av en tilfeldig rekkefølge.
 */
export type Sortering = "brukt" | "nytt" | "redaksjonelt";

export function sorter(
  rubrikker: readonly Rubrikk[],
  sortering: Sortering,
  visninger: Visninger,
): Rubrikk[] {
  const kopi = [...rubrikker];
  if (sortering === "nytt") {
    return kopi.sort(
      (a, b) =>
        b.oppdatert.localeCompare(a.oppdatert) || b.prioritet - a.prioritet,
    );
  }
  if (sortering === "redaksjonelt") {
    return kopi.sort((a, b) => b.prioritet - a.prioritet);
  }
  return kopi.sort(
    (a, b) =>
      (visninger[b.slug] ?? 0) - (visninger[a.slug] ?? 0) ||
      b.prioritet - a.prioritet,
  );
}
