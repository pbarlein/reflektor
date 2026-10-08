import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { INDEXNOW_NOKKEL, INDEXNOW_NOKKELFIL } from "@/lib/indexnow.ts";
import { lesSist, velgUrler } from "../scripts/indexnow.ts";

/**
 * IndexNow sier fra til Bing når en side har endret seg. ChatGPT-søk og
 * Copilot henter fra Bing, så det er AI-synligheten dette handler om.
 *
 * TO TING KAN GÅ GALT UTEN AT NOEN MERKER DET:
 *
 * 1. Nøkkelen og nøkkelfila kommer i utakt. Da svarer IndexNow 403, og
 *    ingen URL-er kommer fram — men nettstedet ser helt normalt ut.
 * 2. Utvalget blir for bredt. Sender vi alle femogtretti URL-ene ved hver
 *    utrulling, slutter Bing å tro på oss.
 */

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.reflektor.no</loc><lastmod>2026-10-04</lastmod></url>
<url><loc>https://www.reflektor.no/reklamefilm</loc><lastmod>2026-10-08</lastmod></url>
<url><loc>https://www.reflektor.no/kjeder</loc><lastmod>2026-10-02</lastmod></url>
<url><loc>https://www.reflektor.no/uten-dato</loc></url>
</urlset>`;

/* ───────────────────────── NØKKELEN OG FILA ─────────────────────────── */

test("nøkkelen er 32 heksadesimale tegn", () => {
  assert.match(INDEXNOW_NOKKEL, /^[0-9a-f]{32}$/);
});

/**
 * FILA MÅ HETE NØYAKTIG DET NØKKELEN HETER, og inneholde den. Bing henter
 * fila og sammenligner. Stemmer ikke de to, svarer IndexNow 403 — og det
 * er den eneste måten feilen viser seg på.
 */
test("nøkkelfila finnes i public og inneholder nøkkelen", () => {
  const sti = `public/${INDEXNOW_NOKKEL}.txt`;
  assert.ok(existsSync(sti), `${sti} finnes ikke`);
  assert.equal(readFileSync(sti, "utf8").trim(), INDEXNOW_NOKKEL);
});

test("keyLocation peker på den samme fila, på riktig vert", () => {
  assert.equal(
    INDEXNOW_NOKKELFIL,
    `https://www.reflektor.no/${INDEXNOW_NOKKEL}.txt`,
  );
});

/* ──────────────────────────── UTVALGET ──────────────────────────────── */

test("første gang sendes alle URL-ene i sitemapet", () => {
  const urler = velgUrler(SITEMAP, null);
  assert.equal(urler.length, 4);
  assert.ok(urler.includes("https://www.reflektor.no/kjeder"));
});

test("bare det som er endret siden sist sendes", () => {
  const urler = velgUrler(SITEMAP, new Date("2026-10-05T00:00:00Z"));
  assert.deepEqual(urler, [
    "https://www.reflektor.no/reklamefilm",
    "https://www.reflektor.no/uten-dato",
  ]);
});

/**
 * EN URL UTEN `lastmod` REGNES SOM ENDRET. Vi kan ikke si noe om den, og å
 * utelate den ville skjult den for Bing på ubestemt tid.
 */
test("en URL uten lastmod sendes alltid", () => {
  const urler = velgUrler(SITEMAP, new Date("2030-01-01T00:00:00Z"));
  assert.deepEqual(urler, ["https://www.reflektor.no/uten-dato"]);
});

/**
 * INGENTING NYTT, INGENTING SENDT. Dette er normaltilfellet: de fleste
 * utrullinger endrer ikke `lastmod` på noen side, og da skal innsendingen
 * være tom. En jobb som sender alt hver gang er verre enn ingen jobb.
 */
test("en utrulling uten innholdsendringer sender ingenting av det daterte", () => {
  const bare_datert = SITEMAP.replace(
    "<url><loc>https://www.reflektor.no/uten-dato</loc></url>\n",
    "",
  );
  assert.deepEqual(bare_datert === SITEMAP ? ["uendret"] : [], []);
  assert.deepEqual(velgUrler(bare_datert, new Date("2026-10-09T00:00:00Z")), []);
});

/** Datoer og tidspunkter med sone skal kunne måles mot hverandre. */
test("lastmod med klokkeslett og sone sammenlignes riktig", () => {
  const medSone = `<url><loc>https://www.reflektor.no/a</loc><lastmod>2026-10-08T23:00:00+02:00</lastmod></url>`;
  assert.deepEqual(velgUrler(medSone, new Date("2026-10-08T20:00:00Z")), [
    "https://www.reflektor.no/a",
  ]);
  assert.deepEqual(velgUrler(medSone, new Date("2026-10-08T22:00:00Z")), []);
});

/* ──────────────────────── TIDSPUNKTET FRA FØR ───────────────────────── */

test("et tomt eller ødelagt tidspunkt betyr «første gang»", () => {
  assert.equal(lesSist(undefined), null);
  assert.equal(lesSist(""), null);
  assert.equal(lesSist("   "), null);
  assert.equal(lesSist("i går"), null);
  assert.equal(
    lesSist("2026-10-08T07:00:00Z")?.toISOString(),
    "2026-10-08T07:00:00.000Z",
  );
});
