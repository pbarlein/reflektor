/**
 * Løser `@/…` til `src/…` for testkjøringen.
 *
 * Bakgrunn: tsconfig har path-aliaset `@/*` → `src/*`, og Next forstår det.
 * Ren node gjør ikke det, så `node --test` kunne bare importere moduler som
 * tilfeldigvis ikke brukte aliaset. Det utelukket blant annet `miljo.ts`, som
 * bærer indekseringssperren og sporingsbryteren — nettopp de to tingene der
 * en feil er usynlig til den koster.
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SRC = path.resolve(import.meta.dirname, "..", "src");

/**
 * TypeScript-aliaser skrives uten filendelse (`@/content/site`), mens node
 * krever den. Hooken prøver derfor endelsene i samme rekkefølge som
 * TypeScript selv gjør.
 */
const ENDELSER = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(spesifikator, kontekst, neste) {
  if (spesifikator.startsWith("@/")) {
    const [sti, spørring] = spesifikator.slice(2).split("?");
    const grunn = path.join(SRC, sti);
    const treff = ENDELSER.map((e) => grunn + e).find(
      (k) => existsSync(k) && statSync(k).isFile(),
    );
    if (treff) {
      const url = pathToFileURL(treff).href;
      return neste(spørring ? `${url}?${spørring}` : url, kontekst);
    }
  }
  return neste(spesifikator, kontekst);
}
