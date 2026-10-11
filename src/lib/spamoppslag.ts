/**
 * De to oppslagene spam-scoren trenger utenfra: engangslista og MX.
 *
 * SKILT FRA lib/spam.ts MED VILJE. Scoren er ren og testes uten nett;
 * dette er den delen som kan feile, henge og svare forskjellig fra gang
 * til gang. Begge svarer med noe trygt når de ikke får svar.
 */
import { promises as dns } from "node:dns";

/** Taket på DNS-oppslaget. Bestilt av Pål 11.10.2026. */
const MX_TIDSTAK_MS = 2000;

/**
 * Engangslista, lastet først når den trengs.
 *
 * `await import()` OG IKKE EN VANLIG IMPORT. Lista er 2,4 MB og 121 570
 * domener. En vanlig import ville lastet den ved hver kaldstart av ruta,
 * også for de innsendingene som aldri kommer så langt.
 *
 * `/index.js` OG IKKE PAKKENAVNET ALENE. Pakkas `main` peker rett på
 * `index.json`, og et `await import()` av en JSON-modul krever
 * `with { type: "json" }` i Node. Uten det kaster importen
 * ERR_IMPORT_ATTRIBUTE_MISSING, og lista ble et tomt sett — regelen var
 * død uten å si fra. Målt 11.10.2026. `index.js` er CommonJS og gjør
 * `require('./index.json')`, som virker både i Node og i bygget.
 */
let lista: Set<string> | null = null;

export async function erEngangsadresse(domene: string): Promise<boolean> {
  if (!domene) return false;
  if (!lista) {
    try {
      const m = (await import("disposable-email-domains/index.js")) as unknown as {
        default: string[];
      };
      lista = new Set(m.default);
      /* En tom liste er en ødelagt liste, ikke et gyldig svar. */
      if (lista.size === 0) console.error("[spam] Engangslista er tom.");
    } catch (feil) {
      console.error("[spam] Fikk ikke lastet engangslista.", feil);
      lista = new Set();
    }
  }
  return lista.has(domene);
}

/**
 * Et domene som alltid har MX. Brukes som kontrollspørsmål, ikke som regel.
 *
 * HVORFOR DET TRENGS: en kjøretid uten fungerende DNS svarer ENODATA på
 * alt — også på gmail.com. Målt i denne sandkassen 11.10.2026. Uten
 * kontrollen ville «ingen MX» vært sant for hvert eneste lead, og alle
 * fått to poeng de ikke har gjort seg fortjent til.
 */
const KONTROLLDOMENE = "gmail.com";

async function slaaOppMx(domene: string): Promise<string[]> {
  return await Promise.race([
    dns.resolveMx(domene),
    new Promise<never>((_, nei) =>
      setTimeout(() => nei(new Error("tidsavbrudd")), MX_TIDSTAK_MS),
    ),
  ]).then((svar) => svar.map((m) => m.exchange));
}

/** Er dette et ekte «domenet tar ikke imot e-post»-svar? */
function negativtSvar(feil: unknown): boolean {
  const kode = (feil as { code?: string }).code;
  return kode === "ENODATA" || kode === "ENOTFOUND" || kode === "NXDOMAIN";
}

/**
 * Mangler domenet MX-record?
 *
 * `null` BETYR AT VI IKKE FIKK SVAR — tidsavbrudd, nettverksfeil, eller en
 * kjøretid uten DNS. Da gir regelen i lib/spam.ts null poeng. En DNS-feil
 * er vår feil, ikke avsenderens.
 *
 * ENODATA OG NXDOMAIN ER EKTE SVAR — men bare hvis resolveren virker.
 * Derfor spørres KONTROLLDOMENE om det samme før et negativt svar
 * godtas. Det koster ett ekstra oppslag, og kun i de få tilfellene der
 * svaret var negativt.
 */
export async function manglerMx(domene: string): Promise<boolean | null> {
  if (!domene) return null;
  try {
    return (await slaaOppMx(domene)).length === 0;
  } catch (feil) {
    if (!negativtSvar(feil)) return null;
    if (domene === KONTROLLDOMENE) return null;
    try {
      /* Virker resolveren? Da er det negative svaret ekte. */
      return (await slaaOppMx(KONTROLLDOMENE)).length > 0 ? true : null;
    } catch {
      return null;
    }
  }
}
