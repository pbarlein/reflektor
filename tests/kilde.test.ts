import assert from "node:assert/strict";
import test from "node:test";

import { byggKilde, erMerket, skalLagres } from "../src/lib/kilde.ts";

/**
 * Kilden er det eneste som sier hvilken annonse et lead kom fra. Feiler den,
 * ser henvendelsen helt normal ut — den mangler bare svaret på hvor pengene
 * ga resultat. Derfor tester.
 */

test("byggKilde tar med UTM og gclid som verdi", () => {
  const k = byggKilde(
    "?utm_source=google&utm_medium=cpc&gclid=Cj0KabC",
    "https://www.google.com/",
    "www.reflektor.no",
    "/reklamefilm",
  );
  assert.equal(
    k,
    "source=google | medium=cpc | gclid=Cj0KabC || ref: https://www.google.com/ || landet paa: /reklamefilm",
  );
});

test("byggKilde uten merke og uten referrer gir «ingen utm» og «direkte»", () => {
  assert.equal(
    byggKilde("", "", "www.reflektor.no", "/"),
    "ingen utm || ref: direkte || landet paa: /",
  );
});

test("intern referrer regnes som direkte", () => {
  assert.match(
    byggKilde("", "https://www.reflektor.no/faq", "www.reflektor.no", "/kontaktoss"),
    /ref: direkte/,
  );
});

test("fbclid fra Meta tas med", () => {
  assert.match(byggKilde("?fbclid=IwAR1", "", "www.reflektor.no", "/"), /fbclid=IwAR1/);
});

test("lange verdier kuttes", () => {
  const k = byggKilde(`?gclid=${"x".repeat(500)}`, "", "www.reflektor.no", "/");
  assert.ok(k.length < 400);
});

test("erMerket kjenner igjen kampanjer og annonseklikk", () => {
  assert.equal(erMerket("?utm_source=meta"), true);
  assert.equal(erMerket("?gclid=abc"), true);
  assert.equal(erMerket("?side=2"), false);
  assert.equal(erMerket(""), false);
});

test("skalLagres: første besøk lagres, umerket besøk overskriver ikke, annonseklikk gjør det", () => {
  assert.equal(skalLagres(null, ""), true);
  assert.equal(skalLagres("ingen utm || ref: direkte || landet paa: /", ""), false);
  assert.equal(skalLagres("ingen utm || ref: direkte || landet paa: /", "?gclid=abc"), true);
});
