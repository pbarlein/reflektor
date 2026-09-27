import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import nextConfig from "../next.config.ts";

/**
 * Redirect-kartet.
 *
 * Testene her dekker prosjektets mest gjentatte feil. AGENTS.md advarer mot
 * den to ganger, og fila selv dokumenterer tre tilfeller: A40 (redirect til
 * en side som ikke fantes), A54 (ni bloggslugs uten innhold) og
 * /gratis-strategimote (oppført som live lenge etter at den var slettet).
 * Alle tre har samme form — «et kart som var riktig da det ble tegnet».
 *
 * Feilen er usynlig i bygget: Next godtar en 301 til hva som helst, og
 * hverken lint, tester eller lenkesjekk har hittil sett på dette kartet.
 * Det første som merker den er betalt trafikk som lander på en 404.
 *
 * To ting kan verifiseres uten nett, og begge gjøres her:
 *   1. ingen live annonseside er kilde i en redirect (regel 1)
 *   2. hvert mål finnes faktisk som rute
 *
 * Det som IKKE kan verifiseres her er om en kilde faktisk er død på dagens
 * side. Det krever et oppslag mot reflektor.no, og det må gjøres for hånd.
 */

/** Sidene det annonseres mot. Flyttes aldri. AGENTS.md, «Fire ting». */
const LIVE_ANNONSESIDER = [
  "/sosiale-medier-byra",
  "/innholdsproduksjon",
  "/reklamefilm",
  "/kontaktoss",
];

/**
 * `/takk` er hellig, og nå vet vi presis hvorfor.
 *
 * Lest ut av den publiserte GTM-containeren 27.09.2026: både GA4-hendelsen
 * `generate_lead` og Ads-konverteringen (11026823614) fyrer på én betingelse,
 * og den er ikke en hendelse fra koden vår. Den er:
 *
 *   sidesti === "/takk"  OG  referrer ~ /^https?:\/\/(www\.)?reflektor\.no\/(?!takk)/i
 *
 * `takk_page_view`, som TakkHendelse.tsx sender, har INGEN utløser som lytter
 * på den i containeren. Den er et ufarlig, men for tiden virkningsløst krok-
 * punkt. Det som faktisk bærer de 107+ konverteringene er stien og
 * referreren.
 *
 * Derfor er dette den farligste redirecten som kan legges inn: en 301 fra
 * /takk ville flyttet stien, og konverteringen ville stilnet uten at noe
 * annet på siden så galt ut. Verifisert i nettleser at referreren overlever
 * skjemaets POST → 303: /kontaktoss → /api/skjema → /takk beholder
 * /kontaktoss som referrer.
 */
const HELLIG = "/takk";

function ruter(): Set<string> {
  const rot = path.join(import.meta.dirname, "..", "src", "app");
  const funnet = new Set<string>();

  const gå = (katalog: string, sti: string) => {
    for (const navn of readdirSync(katalog)) {
      const full = path.join(katalog, navn);
      if (statSync(full).isDirectory()) {
        // Gruppemapper (foo) er ikke del av URL-en.
        gå(full, navn.startsWith("(") ? sti : `${sti}/${navn}`);
      } else if (navn === "page.tsx") {
        funnet.add(sti === "" ? "/" : sti);
      }
    }
  };

  gå(rot, "");
  return funnet;
}

async function kart() {
  assert.ok(nextConfig.redirects, "next.config.ts mangler redirects");
  return await nextConfig.redirects();
}

test("ingen live annonseside er kilde i en redirect", async () => {
  for (const r of await kart()) {
    assert.ok(
      !LIVE_ANNONSESIDER.includes(r.source),
      `${r.source} er en live side det annonseres mot og skal ikke ` +
        `omdirigeres. Se AGENTS.md, regel 1. Unntaket for ` +
        `/sosiale-medier-byra gjelder først ved cutover, og settes inn ` +
        `da — ikke før. Se docs/cutover.md.`,
    );
  }
});

test("hvert redirect-mål finnes som rute", async () => {
  const finnes = ruter();

  for (const r of await kart()) {
    const mål = r.destination.split(/[?#]/)[0];
    const dynamisk = [...finnes].some((rute) =>
      new RegExp(`^${rute.replace(/\[[^\]]+\]/g, "[^/]+")}$`).test(mål),
    );

    assert.ok(
      dynamisk,
      `${r.source} → ${r.destination}, men ${mål} finnes ikke som rute. ` +
        `En 301 til en side som ikke finnes er verre enn ingen redirect: ` +
        `den lover en etterfølger og leverer 404. Se A40.`,
    );
  }
});

test("ingen redirect peker til seg selv eller videre til en annen redirect", async () => {
  const kilder = new Map((await kart()).map((r) => [r.source, r.destination]));

  for (const [kilde, mål] of kilder) {
    assert.notEqual(kilde, mål, `${kilde} omdirigerer til seg selv`);
    assert.ok(
      !kilder.has(mål),
      `${kilde} → ${mål}, men ${mål} omdirigerer videre til ` +
        `${kilder.get(mål)}. En kjede taper lenkeverdi og er unødvendig ` +
        `— pek ${kilde} rett på sluttmålet.`,
    );
  }
});

test("ingen kilde er oppført to ganger", async () => {
  const sett = new Map<string, string>();

  for (const r of await kart()) {
    const før = sett.get(r.source);
    assert.equal(
      før,
      undefined,
      `${r.source} er oppført to ganger: → ${før} og → ${r.destination}. ` +
        `Next bruker den første, så den andre er død kode som ser ` +
        `virksom ut.`,
    );
    sett.set(r.source, r.destination);
  }
});

test("/takk er aldri kilde i en redirect", async () => {
  for (const r of await kart()) {
    assert.notEqual(
      r.source,
      HELLIG,
      `${HELLIG} er kilde i en redirect til ${r.destination}. Det slår ut ` +
        `både GA4-hendelsen og Ads-konverteringen: begge fyrer på at stien ` +
        `ER /takk. 107+ historiske konverteringer henger på den. Se ` +
        `AGENTS.md, «Fire ting», punkt 2.`,
    );
  }
});

test("/takk finnes som rute", async () => {
  assert.ok(
    ruter().has(HELLIG),
    `${HELLIG} finnes ikke som rute. Uten den er det ingen sidevisning å ` +
      `måle, og Reflektor mister sin eneste KPI.`,
  );
});

test("hver redirect er en eksplisitt 301", async () => {
  for (const r of await kart()) {
    assert.equal(
      "permanent" in r,
      false,
      `${r.source} bruker \`permanent\`. Next oversetter det til 308, ikke ` +
        `301. Google behandler de to likt, men dagens Squarespace svarer 301 ` +
        `og all dokumentasjonen vår sier 301 — et byrå som kjører en ` +
        `redirect-sjekk skal ikke måtte lure på avviket. Bruk ` +
        `\`statusCode: 301\`.`,
    );
    assert.equal(
      (r as { statusCode?: number }).statusCode,
      301,
      `${r.source} har statusCode ${(r as { statusCode?: number }).statusCode}. ` +
        `Kartet skal være 301 hele veien. Bestemt 27.09.2026.`,
    );
  }
});
