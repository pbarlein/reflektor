import assert from "node:assert/strict";
import test from "node:test";

import { byggKilde, erMerket, skalLagres } from "../src/lib/kilde.ts";

/**
 * Kilden er det eneste som sier hvilken annonse et lead kom fra. Feiler den,
 * ser henvendelsen helt normal ut — den mangler bare svaret på hvor pengene
 * ga resultat. Derfor tester.
 *
 * SKREVET OM 03.10.2026 sammen med selve strengen. Eksemplene under er de
 * samme Pål oppga, inkludert det ekte leadet fra Instagram som utløste
 * omskrivingen.
 */

const OSS = "www.reflektor.no";

test("det ekte Instagram-leadet: etikett først, ingen fbclid, ingen ref", () => {
  assert.equal(
    byggKilde(
      "?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA8",
      "https://l.instagram.com/",
      OSS,
      "/",
    ),
    "Instagram (lenke i bio) | source=ig | medium=social | content=link_in_bio | landet på: /",
  );
});

test("Instagram uten lenke i bio", () => {
  assert.equal(
    byggKilde("?utm_source=instagram&utm_medium=social", "", OSS, "/"),
    "Instagram | source=instagram | medium=social | landet på: /",
  );
});

test("Facebook kjennes igjen på kilden og på referreren", () => {
  assert.equal(
    byggKilde("?utm_source=fb&utm_medium=social", "", OSS, "/"),
    "Facebook | source=fb | medium=social | landet på: /",
  );
  assert.equal(
    byggKilde("", "https://m.facebook.com/", OSS, "/"),
    "Facebook | landet på: /",
  );
});

test("Google Ads både fra cpc og fra gclid alene", () => {
  assert.equal(
    byggKilde(
      "?utm_source=google&utm_medium=cpc&utm_campaign=reklamefilm&gclid=Cj0KabC",
      "https://www.google.com/",
      OSS,
      "/reklamefilm",
    ),
    "Google Ads | source=google | medium=cpc | campaign=reklamefilm | landet på: /reklamefilm",
  );
  assert.equal(
    byggKilde("?gclid=Cj0KabC", "", OSS, "/"),
    "Google Ads | landet på: /",
  );
  assert.equal(
    byggKilde("?gbraid=abc", "", OSS, "/"),
    "Google Ads | landet på: /",
  );
});

test("Meta-annonse krever betalt medium, ikke bare fbclid", () => {
  assert.equal(
    byggKilde(
      "?utm_source=facebook&utm_medium=paid_social&fbclid=abc",
      "",
      OSS,
      "/",
    ),
    "Meta-annonse | source=facebook | medium=paid_social | landet på: /",
  );
  /* Samme fbclid, organisk medium: dette er en vanlig lenke, ikke en annonse. */
  assert.equal(
    byggKilde("?utm_source=ig&utm_medium=social&fbclid=abc", "", OSS, "/"),
    "Instagram | source=ig | medium=social | landet på: /",
  );
});

test("organisk søk fra referreren alene", () => {
  assert.equal(
    byggKilde("", "https://www.google.com/", OSS, "/"),
    "Google søk | landet på: /",
  );
  assert.equal(
    byggKilde("", "https://www.bing.com/search?q=some+byra", OSS, "/"),
    "Bing søk | landet på: /",
  );
});

test("LinkedIn", () => {
  assert.equal(
    byggKilde("?utm_source=linkedin", "", OSS, "/om-oss"),
    "LinkedIn | source=linkedin | landet på: /om-oss",
  );
  assert.equal(
    byggKilde("", "https://lnkd.in/abc", OSS, "/"),
    "LinkedIn | landet på: /",
  );
});

test("direkte besøk", () => {
  assert.equal(byggKilde("", "", OSS, "/"), "Direkte | landet på: /");
});

test("intern navigasjon teller ikke som referrer", () => {
  assert.equal(
    byggKilde("", "https://www.reflektor.no/blogg", OSS, "/kontaktoss"),
    "Direkte | landet på: /kontaktoss",
  );
});

test("ukjent kilde navngis, ukjent nettsted får med stien", () => {
  assert.equal(
    byggKilde("?utm_source=partnerside&utm_medium=banner", "", OSS, "/"),
    "Annet: partnerside | source=partnerside | medium=banner | landet på: /",
  );
  assert.equal(
    byggKilde("", "https://blogg.no/artikkel-om-video", OSS, "/"),
    "Annet: blogg.no | ref: blogg.no/artikkel-om-video | landet på: /",
  );
  /* Uten sti sier referreren det samme som etiketten, og utelates. */
  assert.equal(
    byggKilde("", "https://blogg.no/", OSS, "/"),
    "Annet: blogg.no | landet på: /",
  );
});

/**
 * KLIKK-ID-ER SKAL ALDRI UT I TEKSTEN. Det er hele grunnen til omskrivingen,
 * og den eneste regelen her som er lett å bryte ved et uhell senere — en ny
 * plattform med en ny parameter legges til i listen, og så skrives den ut
 * fordi noen la den i feil array.
 */
test("ingen klikk-ID havner i strengen", () => {
  const sok =
    "?utm_source=ig&gclid=A1&gbraid=B2&wbraid=C3&fbclid=D4&msclkid=E5" +
    "&ttclid=F6&li_fat_id=G7&igshid=H8&_hsenc=I9&_hsmi=J10&mc_eid=K11";
  const ut = byggKilde(sok, "", OSS, "/");
  for (const id of [
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "msclkid",
    "ttclid",
    "li_fat_id",
    "igshid",
    "_hsenc",
    "_hsmi",
    "mc_eid",
  ]) {
    assert.ok(!ut.includes(id), `${id} står i «${ut}»`);
  }
  for (const verdi of ["A1", "B2", "C3", "D4", "E5", "K11"]) {
    assert.ok(!ut.includes(verdi), `verdien ${verdi} står i «${ut}»`);
  }
});

test("strengen begynner alltid med en lesbar etikett", () => {
  for (const [sok, ref] of [
    ["", ""],
    ["?utm_source=ig", ""],
    ["?gclid=x", "https://www.google.com/"],
    ["", "https://t.co/abc"],
  ]) {
    const ut = byggKilde(sok, ref, OSS, "/");
    assert.ok(!/^[a-z_]+=/.test(ut), `«${ut}» begynner med et nøkkelnavn`);
  }
});

test("lange verdier kuttes", () => {
  const lang = "x".repeat(400);
  const ut = byggKilde(`?utm_campaign=${lang}`, "", OSS, "/");
  assert.ok(ut.length < 300);
  assert.ok(ut.includes("…"));
});

/**
 * `erMerket` kjenner fortsatt klikk-ID-ene, selv om de ikke skrives ut. Et
 * annonseklikk skal overskrive en tidligere lagret kilde — det er klikket
 * som forklarer henvendelsen.
 */
test("erMerket ser både UTM og klikk-ID", () => {
  assert.equal(erMerket("?utm_source=ig"), true);
  assert.equal(erMerket("?fbclid=abc"), true);
  assert.equal(erMerket("?ttclid=abc"), true);
  assert.equal(erMerket("?side=2"), false);
  assert.equal(erMerket(""), false);
});

test("skalLagres: første besøk alltid, senere bare ved annonseklikk", () => {
  assert.equal(skalLagres(null, ""), true);
  assert.equal(skalLagres("Direkte | landet på: /", ""), false);
  assert.equal(skalLagres("Direkte | landet på: /", "?gclid=abc"), true);
});

/**
 * E-post og nyhetsbrev, lagt til 04.10.2026. Uten denne havnet et klikk fra
 * et nyhetsbrev under «Annet», som ikke sier noe om hvor det kom fra.
 */
test("nyhetsbrev kjennes igjen på medium og på klikksporingen", () => {
  assert.equal(
    byggKilde("?utm_source=nyhetsbrev&utm_medium=email", "", OSS, "/"),
    "E-post/nyhetsbrev | source=nyhetsbrev | medium=email | landet på: /",
  );
  assert.equal(
    byggKilde("?_hsenc=abc123", "", OSS, "/tilbud"),
    "E-post/nyhetsbrev | landet på: /tilbud",
  );
});

/**
 * TAKET. Strengen står i et felt Pål leser på telefon. Uten et tak kan en
 * kampanje med fem lange UTM-verdier bygge den samme veggen av tekst som
 * utløste omskrivingen.
 */
test("strengen er aldri over 250 tegn", () => {
  const lang = "kampanje-".repeat(20);
  const ut = byggKilde(
    `?utm_source=${lang}&utm_medium=${lang}&utm_campaign=${lang}&utm_content=${lang}&utm_term=${lang}`,
    "https://en-veldig-lang-referrer.example.com/en/lang/sti/som/fortsetter",
    OSS,
    "/en/ganske/lang/landingsside",
  );
  assert.ok(ut.length <= 250, `var ${ut.length} tegn`);
  assert.ok(ut.startsWith("Annet:"), "etiketten skal fortsatt stå først");
});
