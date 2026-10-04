import assert from "node:assert/strict";
import test from "node:test";

import { artikler, delOppAvsnitt } from "@/content/artikler.ts";

/**
 * Internlenkene fra bloggen til sidene som selger.
 *
 * HVORFOR DETTE ER DEN VIKTIGSTE LENKETYPEN VI HAR. Search Console,
 * september–oktober 2026: bloggen har tusenvis av visninger, og
 * tjenestesidene har nesten ingen. `markedsforing-i-sosiale-medier-some`
 * alene har 2 514 visninger i måneden, `hva-er-innholdsproduksjon` 1 587.
 * /videoproduksjon-i-oslo har 34. Bloggen er det eneste stedet på
 * nettstedet som faktisk er synlig, og den må sende både lesere og
 * autoritet videre.
 *
 * ANKERTEKSTEN SIER HVA MÅLSIDEN ER. «les mer» bærer null; «reels-
 * produksjon» bærer alt. Det er samme regel som `lesVidere` følger, og den
 * står begrunnet øverst i artikler.ts.
 */

/** Sidene et klikk kan bli en henvendelse på. Bloggposter teller ikke. */
function erSalgsside(sti: string): boolean {
  return (
    sti === "/" ||
    [
      "/innholdsproduksjon",
      "/reklamefilm",
      "/videoproduksjon-i-oslo",
      "/eventfotograf-eventvideo",
      "/employer-branding-video-oslo",
      "/reels-produksjon",
      "/kjeder",
    ].includes(sti)
  );
}

/**
 * FRASEN MÅ STÅ ORDRETT OG BARE ÉN GANG i avsnittet sitt.
 *
 * `delOppAvsnitt` deler teksten på frasen. Står frasen to ganger, blir
 * begge til lenker; står den ikke i det hele tatt, forsvinner lenken uten
 * en feilmelding. Begge deler er stille feil som bare synes i nettleseren.
 */
test("hver lenkefrase står ordrett og nøyaktig én gang i avsnittet", () => {
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (!("lenker" in b) || !b.lenker?.length) continue;
      const tekst: string = b.tekst;
      for (const l of b.lenker) {
        const antall: number = tekst.split(l.frase).length - 1;
        assert.equal(
          antall,
          1,
          `${a.slug}: «${l.frase}» står ${antall} ganger i avsnittet`,
        );
      }
      /* Og delingen skal faktisk gi en lenke per oppføring. */
      const deler = delOppAvsnitt(tekst, b.lenker);
      const lenkedeler = deler.filter((d) => typeof d !== "string");
      assert.equal(
        lenkedeler.length,
        b.lenker.length,
        `${a.slug}: ${b.lenker.length} lenker ga ${lenkedeler.length} i teksten`,
      );
    }
  }
});

/** To lenker til samme side i samme avsnitt er støy, ikke signal. */
test("ingen side lenkes to ganger fra samme avsnitt", () => {
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (!("lenker" in b) || !b.lenker?.length) continue;
      const stier = b.lenker.map((l) => l.sti);
      assert.equal(
        new Set(stier).size,
        stier.length,
        `${a.slug}: samme sti to ganger i ett avsnitt`,
      );
    }
  }
});

/**
 * DE SYV MEST SYNLIGE ARTIKLENE SKAL LENKE TIL EN SALGSSIDE I SELVE
 * TEKSTEN, ikke bare i «Les videre»-boksen nederst. Boksen leses av dem som
 * kom til bunnen; lenken i teksten leses av alle, og den er den Google
 * vekter.
 *
 * Tallene i parentes er visninger per måned, målt i Search Console
 * 01.09–04.10.2026.
 */
const SYNLIGE: Record<string, number> = {
  "markedsforing-i-sosiale-medier-some": 2514,
  "hva-er-innholdsproduksjon": 1587,
  "hva-er-innholdsmarkedsforing": 864,
  "hva-er-videomarkedsfring": 761,
  "hva-gjr-en-innholdsprodusent": 566,
  "hva-er-employer-branding": 153,
  "hva-innebaerer-digital-historiefortelling": 117,
};

test("de mest synlige artiklene lenker til en salgsside i teksten", () => {
  for (const slug of Object.keys(SYNLIGE)) {
    const a = artikler.find((x) => x.slug === slug);
    assert.ok(a, `fant ikke ${slug}`);
    const iTeksten = a.blokker
      .flatMap((b) => ("lenker" in b ? (b.lenker ?? []) : []))
      .map((l) => l.sti)
      .filter(erSalgsside);
    assert.ok(
      iTeksten.length > 0,
      `${slug} (${SYNLIGE[slug]} visninger) lenker ikke til en salgsside i teksten`,
    );
  }
});

/** Og de aller største skal peke på mer enn én. */
test("de tre største artiklene lenker til minst to salgssider", () => {
  for (const slug of [
    "markedsforing-i-sosiale-medier-some",
    "hva-er-innholdsproduksjon",
    "hva-er-innholdsmarkedsforing",
  ]) {
    const a = artikler.find((x) => x.slug === slug)!;
    const stier = new Set(
      a.blokker
        .flatMap((b) => ("lenker" in b ? (b.lenker ?? []) : []))
        .map((l) => l.sti)
        .filter(erSalgsside),
    );
    assert.ok(
      stier.size >= 2,
      `${slug} lenker bare til ${JSON.stringify([...stier])}`,
    );
  }
});

/**
 * ANKERTEKSTEN SKAL IKKE VÆRE INNHOLDSLØS. «les mer», «her» og «klikk»
 * bærer ingen relevans videre.
 */
test("ingen innholdsløs ankertekst til salgssidene", () => {
  const tomme = ["les mer", "her", "klikk", "denne siden", "lenke"];
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (!("lenker" in b) || !b.lenker?.length) continue;
      for (const l of b.lenker) {
        if (!erSalgsside(l.sti)) continue;
        assert.ok(
          !tomme.includes(l.frase.trim().toLowerCase()),
          `${a.slug}: «${l.frase}» sier ingenting om ${l.sti}`,
        );
      }
    }
  }
});

/** «Les videre»-boksen skal fortsatt ha en salgsside øverst. */
test("hver artikkel har en salgsside i Les videre", () => {
  for (const a of artikler) {
    assert.ok(
      a.lesVidere.some((l) => erSalgsside(l.sti)),
      `${a.slug} har ingen salgsside i Les videre`,
    );
  }
});
