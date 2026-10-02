import assert from "node:assert/strict";
import test from "node:test";

import { artikler } from "../src/content/artikler.ts";
import { site } from "../src/content/site.ts";

/**
 * RSS-feeden for bloggen.
 *
 * HVORFOR DEN TESTES. En feed er den eneste siden på nettstedet ingen
 * mennesker ser på. Er den ugyldig, slutter leserne å hente den — uten en
 * feilmelding, uten et utslag i GA4 og uten at noe på nettsiden ser galt
 * ut. Squarespace-feeden sluttet å virke ved cutover på presis den måten.
 *
 * Tre ting må holde, og alle tre er ting som brekker en feed stille:
 * gyldig XML, absolutte URL-er, og datoer på RFC 822-form.
 */

/** Feeden er låst bak indekseringsbryteren, som /llms.txt. Se miljo.ts. */
async function hentFeed(): Promise<string> {
  const for1 = process.env.NEXT_PUBLIC_TILLAT_INDEKSERING;
  process.env.NEXT_PUBLIC_TILLAT_INDEKSERING = "true";
  try {
    const { GET } = await import("../src/app/blogg/rss.xml/route.ts");
    const svar = GET();
    assert.equal(svar.status, 200);
    assert.equal(
      svar.headers.get("content-type"),
      "application/rss+xml; charset=utf-8",
    );
    return await svar.text();
  } finally {
    if (for1 === undefined) delete process.env.NEXT_PUBLIC_TILLAT_INDEKSERING;
    else process.env.NEXT_PUBLIC_TILLAT_INDEKSERING = for1;
  }
}

test("feeden er gyldig, balansert XML", async () => {
  const xml = await hentFeed();

  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<rss version="2.0"'));
  assert.ok(xml.trimEnd().endsWith("</rss>"));

  /*
   * TAGGENE MÅ BALANSERE. En enkel stabel er nok her: feeden er generert av
   * én funksjon med faste tagger, og det som kan gå galt er en glemt
   * slutt-tagg — ikke vilkårlig nøstet XML.
   */
  const stabel: string[] = [];
  for (const treff of xml.matchAll(/<(\/?)([a-zA-Z][\w:]*)([^>]*)>/g)) {
    const [, slutt, navn, rest] = treff;
    if (rest.trimEnd().endsWith("/")) continue;
    if (slutt) {
      assert.equal(stabel.pop(), navn, `</${navn}> lukker feil tagg`);
    } else {
      stabel.push(navn);
    }
  }
  assert.deepEqual(stabel, [], "en tagg er ikke lukket");

  /*
   * INGEN BAR AMPERSAND. Det er den vanligste grunnen til at en feed ikke
   * parser, og den oppstår i en artikkeltittel ingen tenkte på.
   */
  assert.ok(
    !/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(xml),
    "en ampersand er ikke escapet",
  );
});

test("hver artikkel står i feeden, med absolutt URL", async () => {
  const xml = await hentFeed();

  assert.equal(
    [...xml.matchAll(/<item>/g)].length,
    artikler.length,
    "feeden skal ha like mange poster som bloggen har artikler",
  );

  for (const a of artikler) {
    const url = `${site.domene}/blogg/${a.slug}`;
    assert.ok(xml.includes(`<link>${url}</link>`), `${a.slug} mangler link`);
    assert.ok(
      xml.includes(`<guid isPermaLink="true">${url}</guid>`),
      `${a.slug} mangler guid`,
    );
  }

  /*
   * ABSOLUTTE URL-ER OVERALT. En relativ URL i en feed er verdiløs: leseren
   * har ingen base å løse den mot.
   */
  for (const treff of xml.matchAll(/<(?:link|guid[^>]*)>([^<]+)</g)) {
    assert.ok(
      treff[1].startsWith("https://"),
      `${treff[1]} er ikke en absolutt URL`,
    );
  }
  assert.ok(xml.includes(`href="${site.domene}/blogg/rss.xml"`));
});

test("datoene er på RFC 822-form og stemmer med artiklene", async () => {
  const xml = await hentFeed();
  const datoer = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map(
    (t) => t[1],
  );

  assert.equal(datoer.length, artikler.length);

  for (const d of datoer) {
    assert.match(
      d,
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/,
      `${d} er ikke RFC 822`,
    );
    assert.ok(!Number.isNaN(Date.parse(d)), `${d} kan ikke parses`);
  }

  /* Nyest først, som bloggoversikten. */
  const tider = datoer.map((d) => Date.parse(d));
  assert.deepEqual(
    tider,
    [...tider].sort((a, b) => b - a),
    "feeden skal være sortert nyest først",
  );

  /*
   * DATOEN SKAL VÆRE ARTIKKELENS, IKKE BYGGETIDSPUNKTET. Ferskhet er en
   * siteringsfaktor, og en feed som sier «ny i dag» hver gang vi deployer
   * en knappefarge er en usann påstand. Samme regel som for `publisert`.
   */
  const nyeste = [...artikler].sort((a, b) =>
    b.publisert.localeCompare(a.publisert),
  )[0];
  assert.equal(
    xml.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/)?.[1],
    new Date(`${nyeste.publisert}T00:00:00Z`).toUTCString(),
  );
});

test("feeden er stengt når indeksering er avslått", async () => {
  const for1 = process.env.NEXT_PUBLIC_TILLAT_INDEKSERING;
  delete process.env.NEXT_PUBLIC_TILLAT_INDEKSERING;
  try {
    const { GET } = await import("../src/app/blogg/rss.xml/route.ts");
    assert.equal(
      GET().status,
      404,
      "en feed er en invitasjon til å republisere innhold, og skal ikke " +
        "stå åpen på en forhåndsvisning. Samme bryter som /llms.txt.",
    );
  } finally {
    if (for1 !== undefined) process.env.NEXT_PUBLIC_TILLAT_INDEKSERING = for1;
  }
});
