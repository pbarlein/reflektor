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
 * TIDSPUNKTET FOR FORRIGE INNSENDING KOMMER FRA GITHUB, ikke fra en fil.
 * Her sto `actions/cache`, og den kan ikke lagre på et
 * `deployment_status`-event: «The event type deployment_status is not
 * supported because it's not tied to a branch or tag ref». Jobben så
 * vellykket ut, men tidspunktet ble aldri lagret — og da ville alle 34
 * URL-ene gått inn på nytt ved hver eneste utrulling, som er den ene
 * tingen IndexNow ber oss la være. Fanget i loggen fra første kjøring
 * 08.10.2026.
 *
 * I STEDET SPØR JOBBEN GITHUB om når denne arbeidsflyten sist kjørte uten
 * feil. Det er den samme opplysningen, uten noe å lagre og uten noe som
 * kan komme i utakt.
 *
 * FEILER ALDRI UTRULLINGEN. IndexNow er en hyggelighet, ikke en
 * avhengighet. Jobben står utenfor CI, og en rød markering her stopper
 * verken bygget eller utrullingen — siden er for lengst ute når dette
 * kjører. Men den SKAL bli rød når innsendingen feiler, slik at neste
 * kjøring prøver de samme URL-ene om igjen.
 */
import {
  INDEXNOW_ENDEPUNKT,
  INDEXNOW_NOKKEL,
  INDEXNOW_NOKKELFIL,
  INDEXNOW_VERT,
} from "../src/lib/indexnow.ts";

/** Taket IndexNow setter per innsending. */
const MAKS_URLER = 10000;

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
    return;
  }

  /*
    EN FEILET INNSENDING SKAL MERKES SOM FEILET, og det er derfor dette
    kaster. Neste kjøring leser tidspunktet fra forrige VELLYKKEDE kjøring
    av denne jobben — feiler denne, står det gamle tidspunktet, og de samme
    URL-ene prøves igjen. Å avslutte med 0 uansett ville gjort én feil til
    et permanent hull: de sidene ville aldri blitt meldt.

    JOBBEN STÅR UTENFOR CI. En rød markering her stopper verken bygget
    eller utrullingen — siden er for lengst ute når dette kjører.
  */
  throw new Error(`IndexNow svarte ${res.status}. ${tekst.slice(0, 300)}`);
}

if (process.argv[1]?.endsWith("indexnow.ts")) {
  await hoved().catch((f: unknown) => {
    console.error("IndexNow-innsendingen feilet:", f);
    process.exitCode = 1;
  });
}
