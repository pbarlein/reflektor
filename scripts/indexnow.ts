/**
 * Sender endrede URL-er til IndexNow etter en produksjonsutrulling.
 *
 * KJØRES FRA GITHUB ACTIONS, ikke under bygget. Å melde fra om en side før
 * den er live er verre enn ikke å melde fra: Bing henter den, ser den gamle
 * versjonen, og lar være å komme tilbake med det første.
 *
 * HVA SOM SENDES: URL-ene i sitemapet med `lastmod` nyere enn forrige
 * vellykkede innsending. Første gang sendes alle. Ingenting sendes som ikke
 * står i sitemapet — en URL vi ikke selv mener er verdt å indeksere, skal
 * ikke dyttes inn i en søkemotor.
 *
 * `lastmod` I VÅRT SITEMAP ER HÅNDHOLDT. Se `SIST_ENDRET` i
 * src/app/sitemap.ts: datoen endrer seg når noen setter den, ikke ved hver
 * utrulling. Det er en styrke her — vi spammer ikke Bing med femogtretti
 * URL-er hver gang en knapp flytter seg — men det betyr også at en reell
 * innholdsendring ikke blir meldt hvis `SIST_ENDRET` ikke oppdateres.
 *
 * FEILER ALDRI UTRULLINGEN. IndexNow er en hyggelighet, ikke en avhengighet.
 * Svarer endepunktet 4xx eller er nede, logges det og skriptet avslutter
 * med 0.
 */
import { writeFileSync } from "node:fs";

import {
  INDEXNOW_ENDEPUNKT,
  INDEXNOW_NOKKEL,
  INDEXNOW_NOKKELFIL,
  INDEXNOW_VERT,
} from "../src/lib/indexnow.ts";

/** Taket IndexNow setter per innsending. */
const MAKS_URLER = 10000;

/** Hvor tidspunktet for forrige vellykkede innsending noteres. */
const TIDSPUNKTFIL = ".indexnow-sist";

/**
 * URL-ene i sitemapet som har endret seg siden sist.
 *
 * `sist` er `null` første gang — da sendes alt. Mangler en oppføring
 * `lastmod`, regnes den som endret: en URL uten dato kan vi ikke si noe om,
 * og å utelate den ville skjult den for Bing på ubestemt tid.
 *
 * SAMMENLIGNINGEN ER PÅ TIDSPUNKT, ikke på tekst. `lastmod` kan være
 * «2026-10-04» eller «2026-10-04T12:00:00+02:00», og de to skal kunne
 * måles mot hverandre.
 */
export function velgUrler(sitemap: string, sist: Date | null): string[] {
  const ut: string[] = [];

  for (const blokk of sitemap.split(/<url>/).slice(1)) {
    const loc = /<loc>\s*([^<]+?)\s*<\/loc>/.exec(blokk)?.[1];
    if (!loc) continue;

    if (sist) {
      const rå = /<lastmod>\s*([^<]+?)\s*<\/lastmod>/.exec(blokk)?.[1];
      const endret = rå ? new Date(rå) : null;
      /* Gyldig dato som IKKE er nyere enn sist: hopp over. */
      if (endret && !Number.isNaN(endret.getTime()) && endret <= sist) continue;
    }

    ut.push(loc);
  }

  return ut.slice(0, MAKS_URLER);
}

/** Leser tidspunktet for forrige innsending. Ugyldig eller tomt gir null. */
export function lesSist(rå: string | undefined): Date | null {
  if (!rå?.trim()) return null;
  const d = new Date(rå.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

/* ─────────────────────────── KJØRINGEN ──────────────────────────────── */

async function hoved() {
  const sitemapUrl = `https://${INDEXNOW_VERT}/sitemap.xml`;
  const sist = lesSist(process.env.INDEXNOW_SIST);

  const svar = await fetch(sitemapUrl, { cache: "no-store" });
  if (!svar.ok) {
    console.error(`Fikk ikke sitemapet (${svar.status}). Sender ingenting.`);
    return;
  }
  const urler = velgUrler(await svar.text(), sist);

  console.log(
    sist
      ? `Forrige innsending: ${sist.toISOString()}. Endret siden da: ${urler.length}.`
      : `Første innsending. Sender alle ${urler.length} URL-ene i sitemapet.`,
  );

  if (!urler.length) {
    console.log("Ingenting å melde. Ferdig.");
    skrivTidspunkt();
    return;
  }

  const res = await fetch(INDEXNOW_ENDEPUNKT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_VERT,
      key: INDEXNOW_NOKKEL,
      keyLocation: INDEXNOW_NOKKELFIL,
      urlList: urler,
    }),
  });

  /*
    200 og 202 ER BEGGE OK. 202 betyr «mottatt, nøkkelen sjekkes». 403 betyr
    at nøkkelfila ikke stemmer, 422 at en URL ikke hører til verten — begge
    er feil i oppsettet her, ikke hos Bing, og skal være lette å finne igjen
    i loggen.
  */
  const tekst = await res.text().catch(() => "");
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow svarte ${res.status}. ${urler.length} URL-er sendt.`);
    skrivTidspunkt();
  } else {
    console.error(`IndexNow svarte ${res.status}. ${tekst.slice(0, 300)}`);
  }
}

/**
 * Noterer at innsendingen gikk.
 *
 * SKRIVES BARE VED SUKSESS. Feiler innsendingen, står det gamle
 * tidspunktet, og de samme URL-ene prøves igjen ved neste utrulling. Å
 * notere uansett ville gjort en enkelt feil til et permanent hull: de
 * sidene ville aldri blitt meldt.
 *
 * FILA MELLOMLAGRES AV GITHUB ACTIONS mellom kjøringene. Forsvinner den —
 * cachen tømmes etter en uke uten bruk — sendes alt på nytt én gang. Det
 * er et akseptabelt utfall, og langt bedre enn å sende alt hver gang.
 */
function skrivTidspunkt() {
  try {
    writeFileSync(TIDSPUNKTFIL, new Date().toISOString());
  } catch (feil) {
    console.error("Klarte ikke notere tidspunktet:", feil);
  }
}

if (process.argv[1]?.endsWith("indexnow.ts")) {
  /* Ingen feil her skal stoppe noe. Se hodet på fila. */
  await hoved().catch((f) => console.error("IndexNow-innsendingen feilet:", f));
}
