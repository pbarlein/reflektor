/**
 * De tre oppslagene leadfilteret trenger utenfra: MX, Brønnøysund og om
 * e-postdomenet har en nettside som svarer.
 *
 * SKILT FRA lib/leadfilter.ts MED VILJE. Reglene er rene og testes uten
 * nett; dette er delen som kan henge, feile og svare forskjellig fra gang
 * til gang.
 *
 * INGEN AV DEM GIR «AVVIST» NÅR DE FEILER. Et oppslag som ikke kommer
 * fram er vår feil, ikke avsenderens: MX-sjekken svarer «har MX», og de to
 * andre svarer `null`, som betyr at de ikke kan godkjenne — men heller
 * ikke avvise. Da blir utfallet «usikker», og Pål får varselet.
 */
import { promises as dns } from "node:dns";

import { LIKHETSGRENSE, navnelikhet, normaliserFirma } from "./leadfilter";

/** Taket på DNS-oppslaget. Bestilt av Pål 12.10.2026. */
const MX_TIDSTAK_MS = 3000;
/** Taket på Brønnøysund. */
const BRREG_TIDSTAK_MS = 5000;
/** Taket på sjekken av nettsiden. */
const NETT_TIDSTAK_MS = 5000;

const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";

/**
 * Tar e-postdomenet imot e-post?
 *
 * SVARER «JA» NÅR OPPSLAGET FEILER, og det er bestillingens eget krav: vi
 * skal ikke avvise på egen feil. Bare et ekte negativt svar fra DNS —
 * domenet finnes ikke, eller har ingen MX — gir «nei».
 *
 * EN RESOLVER SOM IKKE VIRKER SVARER ENODATA PÅ ALT, også på gmail.com.
 * Målt 11.10.2026. Derfor spørres et kontrolldomene før et negativt svar
 * godtas — samme grep som i lib/spamoppslag.ts, og av samme grunn.
 */
const KONTROLLDOMENE = "gmail.com";

async function mx(domene: string): Promise<string[]> {
  return await Promise.race([
    dns.resolveMx(domene),
    new Promise<never>((_, nei) =>
      setTimeout(() => nei(new Error("tidsavbrudd")), MX_TIDSTAK_MS),
    ),
  ]).then((svar) => svar.map((m) => m.exchange));
}

function negativt(feil: unknown): boolean {
  const kode = (feil as { code?: string }).code;
  return kode === "ENODATA" || kode === "ENOTFOUND" || kode === "NXDOMAIN";
}

export async function harMx(domene: string): Promise<boolean> {
  if (!domene) return true;
  try {
    return (await mx(domene)).length > 0;
  } catch (feil) {
    if (!negativt(feil)) return true;
    if (domene === KONTROLLDOMENE) return true;
    try {
      /* Virker resolveren? Bare da er det negative svaret ekte. */
      return (await mx(KONTROLLDOMENE)).length === 0;
    } catch {
      return true;
    }
  }
}

/* ───────────────────────── BRØNNØYSUND ──────────────────────────────── */

type Enhet = { navn?: string; hjemmeside?: string };

/**
 * Finnes firmaet i Enhetsregisteret?
 *
 * `null` BETYR AT VI IKKE FIKK SVAR. Det er ikke det samme som «ikke
 * funnet»: det første gir «usikker», det andre gir det også — men bare det
 * siste er et svar vi kan si noe om senere.
 *
 * TO VEIER TIL ET TREFF, begge bestilt: navnet er likt nok (0,8 av de fem
 * første treffene), eller `hjemmeside` på et treff peker på det samme
 * domenet som e-posten. Den andre er den sterkeste: et firma som har
 * registrert nettsiden sin, og en e-post på samme domene, er det samme
 * firmaet.
 */
export async function brregTreff(
  firma: string,
  domene: string,
): Promise<boolean | null> {
  const sok = normaliserFirma(firma);
  if (!sok) return null;

  try {
    const svar = await fetch(
      `${BRREG}?navn=${encodeURIComponent(sok)}&size=5`,
      {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(BRREG_TIDSTAK_MS),
      },
    );
    if (!svar.ok) {
      console.error(`[leadfilter] Brønnøysund svarte ${svar.status}.`);
      return null;
    }

    const data = (await svar.json()) as {
      _embedded?: { enheter?: Enhet[] };
    };
    const enheter = data._embedded?.enheter ?? [];
    if (!enheter.length) return false;

    for (const e of enheter.slice(0, 5)) {
      if (e.navn && navnelikhet(firma, e.navn) >= LIKHETSGRENSE) return true;
      if (domene && e.hjemmeside && vertFra(e.hjemmeside) === domene) {
        return true;
      }
    }
    return false;
  } catch (feil) {
    console.error("[leadfilter] Oppslaget mot Brønnøysund feilet.", feil);
    return null;
  }
}

/** Verten i en adresse som kan mangle protokoll og ha www foran. */
function vertFra(adresse: string): string {
  const t = adresse.trim().toLocaleLowerCase("en-US");
  if (!t) return "";
  try {
    const url = new URL(t.startsWith("http") ? t : `https://${t}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* ────────────────────── SVARER DOMENET PÅ HTTPS? ────────────────────── */

/**
 * Har e-postdomenet en nettside som svarer?
 *
 * `null` BETYR AT VI IKKE FIKK SJEKKET. Et firma kan ha en helt vanlig
 * nettside som er nede i de fem sekundene vi spør, og det skal ikke være
 * nok til noe som helst.
 *
 * DET ER E-POSTDOMENET SOM SJEKKES, OG BARE DET. Bestillingen har to
 * veier — «e-postdomenet svarer» eller «nettside-feltet peker på samme
 * domene som e-posten og svarer» — men de to er samme spørsmål: krever
 * man at nettsiden er det samme domenet, er det domenet man sjekker.
 * Feltet brukes derfor ikke her. Grunnen er god nok alene: hvem som helst
 * kan skrive inn hvilken som helst nettside i et skjemafelt.
 *
 * HER STO EN SJEKK SOM SVARTE `null` NÅR `nettside` PEKTE ET ANNET STED.
 * Den gjorde at et firma med en helt gyldig e-post sluttet å kunne
 * godkjennes fordi noen hadde skrevet feil nettside i skjemaet.
 */
export async function domeneSvarer(domene: string): Promise<boolean | null> {
  if (!domene) return null;

  try {
    const svar = await fetch(`https://${domene}/`, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(NETT_TIDSTAK_MS),
    });
    return svar.status < 400;
  } catch {
    /*
      INGEN LOGGLINJE HER. Et domene som ikke svarer er det normale
      utfallet for et oppdiktet firma, ikke en feil i vårt system — og en
      feillinje per spam-lead ville gjort loggen ubrukelig.
    */
    return null;
  }
}
