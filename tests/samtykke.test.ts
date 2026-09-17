import assert from "node:assert/strict";
import test from "node:test";

import {
  COOKIE_NAVN,
  FULLT_SAMTYKKE,
  INGEN_SAMTYKKE,
  lesFraCookiestreng,
  parse,
  serialiser,
  standardSkript,
  tilSignaler,
} from "../src/lib/samtykke.ts";

/**
 * Samtykkelogikken.
 *
 * Testene her dekker det samme slaget som tests/skjemavern.ts: koden der en
 * feil er USYNLIG. Et samtykke som ikke lagres, en cookie som tolkes feil,
 * eller et signal som blir stående på «granted» — siden ser helt lik ut i
 * alle tre tilfellene, og det første noen merker er et tilsyn eller et brev.
 */

test("serialiser og parse er hverandres motstykker", () => {
  for (const s of [
    INGEN_SAMTYKKE,
    FULLT_SAMTYKKE,
    { analyse: true, markedsforing: false },
    { analyse: false, markedsforing: true },
  ]) {
    assert.deepEqual(parse(serialiser(s)), s);
  }
});

test("parse avviser alt som ikke er et gyldig svar", () => {
  for (const v of [
    null,
    undefined,
    "",
    "   ",
    "1.1",
    "1.111",
    "1.12",
    "ja",
    "0.11",
    "2.11",
    "1.ab",
  ]) {
    assert.equal(parse(v), null, `skulle avvist ${JSON.stringify(v)}`);
  }
});

test("parse avviser en annen versjon, så vi kan spørre på nytt", () => {
  assert.equal(parse("9.11"), null);
});

test("lesFraCookiestreng finner vår cookie blant andre", () => {
  const c = `_ga=GA1.1.x; ${COOKIE_NAVN}=1.10; annen=verdi`;
  assert.deepEqual(lesFraCookiestreng(c), {
    analyse: true,
    markedsforing: false,
  });
  assert.equal(lesFraCookiestreng("_ga=GA1.1.x; annen=verdi"), null);
  assert.equal(lesFraCookiestreng(""), null);
  assert.equal(lesFraCookiestreng("uten-likhetstegn"), null);
});

test("lesFraCookiestreng tåler prosentkoding", () => {
  assert.deepEqual(lesFraCookiestreng(`${COOKIE_NAVN}=${encodeURIComponent("1.01")}`), {
    analyse: false,
    markedsforing: true,
  });
});

test("ingen samtykke gir nektet på alle signaler unntatt security", () => {
  const s = tilSignaler(INGEN_SAMTYKKE);
  assert.equal(s.security_storage, "granted");
  for (const [k, v] of Object.entries(s)) {
    if (k === "security_storage") continue;
    assert.equal(v, "denied", `${k} skulle vært nektet`);
  }
});

test("fullt samtykke innvilger de fire Consent Mode v2 krever", () => {
  const s = tilSignaler(FULLT_SAMTYKKE);
  for (const k of [
    "ad_storage",
    "ad_user_data",
    "ad_personalization",
    "analytics_storage",
  ]) {
    assert.equal(s[k], "granted", `${k} skulle vært innvilget`);
  }
  // Signaler vi ikke bruker skal ikke innvilges selv ved fullt samtykke.
  assert.equal(s.functionality_storage, "denied");
  assert.equal(s.personalization_storage, "denied");
});

test("analyse og markedsføring styrer hver sine signaler", () => {
  const bareAnalyse = tilSignaler({ analyse: true, markedsforing: false });
  assert.equal(bareAnalyse.analytics_storage, "granted");
  assert.equal(bareAnalyse.ad_storage, "denied");
  assert.equal(bareAnalyse.ad_user_data, "denied");
  assert.equal(bareAnalyse.ad_personalization, "denied");

  const bareMarked = tilSignaler({ analyse: false, markedsforing: true });
  assert.equal(bareMarked.analytics_storage, "denied");
  assert.equal(bareMarked.ad_storage, "granted");
});

/**
 * Skriptet i <head> er en streng, og en streng kan ikke typesjekkes. Disse
 * to testene er det eneste som står mellom en skrivefeil der og en side der
 * samtykket stille slutter å virke.
 */
test("standardSkript nevner alle signalene og setter dem nektet som utgangspunkt", () => {
  const k = standardSkript();
  for (const s of Object.keys(tilSignaler(INGEN_SAMTYKKE))) {
    assert.ok(k.includes(s), `${s} mangler i skriptet`);
  }
  assert.ok(k.includes('"consent","default"'), "må sette default, ikke update");
  assert.ok(k.includes(COOKIE_NAVN), "må lese vår egen cookie");
  assert.ok(k.includes("ads_data_redaction"), "Googles anbefaling mangler");
  assert.ok(k.includes("url_passthrough"), "Googles anbefaling mangler");
  assert.ok(k.includes("data-samtykke"), "banneret leser dette attributtet");
});

test("standardSkript er gyldig JavaScript", () => {
  assert.doesNotThrow(() => new Function(standardSkript()));
});
