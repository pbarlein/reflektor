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

function prov(grunn) {
  return ENDELSER.map((e) => grunn + e).find(
    (k) => existsSync(k) && statSync(k).isFile(),
  );
}

export async function resolve(spesifikator, kontekst, neste) {
  const [sti, spørring] = spesifikator.split("?");

  /*
   * RELATIVE IMPORTER TRENGER SAMME BEHANDLING SOM ALIASENE.
   *
   * Hooken løste bare `@/…`, og det holdt til aliaset pekte på en fil som
   * selv importerer relativt: `tjenester.ts` gjør `from "./site"`, og node
   * krever endelsen. Testen som avdekket det importerte `@/content/tjenester`
   * — aliaset løste fint, og så falt resolveren på linjen etter.
   *
   * TypeScript skriver relative importer uten endelse akkurat som aliasene,
   * så regelen er den samme: prøv endelsene i TypeScripts rekkefølge.
   */
  if (sti.startsWith("./") || sti.startsWith("../")) {
    if (kontekst.parentURL?.startsWith("file:")) {
      const grunn = path.resolve(
        path.dirname(new URL(kontekst.parentURL).pathname),
        sti,
      );
      const treff = prov(grunn);
      if (treff) {
        const url = pathToFileURL(treff).href;
        return neste(spørring ? `${url}?${spørring}` : url, kontekst);
      }
    }
  }

  if (sti.startsWith("@/")) {
    const treff = prov(path.join(SRC, sti.slice(2)));
    if (treff) {
      const url = pathToFileURL(treff).href;
      return neste(spørring ? `${url}?${spørring}` : url, kontekst);
    }
  }

  return neste(spesifikator, kontekst);
}
