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

/**
 * GJENGANGEREN. Lagt til 21.09.2026 etter at målingen i nettleseren viste
 * at `samtykke_oppdatert` manglet helt på besøk nummer to.
 *
 * De fem taggene som ikke leser Consent Mode — Meta, Apollo, HubSpot,
 * Clarity, Microsoft Ads — kan bare styres inne i GTM-containeren. Henges
 * de på denne hendelsen uten at den gjentas, fyrer de den ene gangen
 * brukeren klikker og aldri mer for den personen. Det er en feil ingen
 * ville oppdaget ved å se på siden.
 */
test("oppstartsskriptet gjentar samtykket for gjengangere", () => {
  const k = standardSkript();
  assert.ok(k.includes("samtykke_oppdatert"), "hendelsen mangler i skriptet");
  assert.ok(k.includes('samtykke_kilde:"lagret"'), "kilden må merkes");
  assert.ok(
    /if\(v\)window\.dataLayer\.push/.test(k),
    "gjentakelsen må være betinget av at cookien finnes — uten svar skal ingen hendelse sendes",
  );
});

/**
 * Rekkefølgen er hele grunnen til at gjentakelsen ligger i skriptet og
 * ikke i en React-effekt: GTM leser dataLayer når containeren starter, og
 * på besøk to starter den allerede ved første render.
 */
test("gjentakelsen kommer etter consent default, ikke før", () => {
  const k = standardSkript();
  assert.ok(
    k.indexOf('"consent","default"') < k.indexOf("samtykke_oppdatert"),
    "Consent Mode må være satt før hendelsen sendes",
  );
});

/**
 * Skriptet kjøres som en streng i <head>. Denne testen simulerer en
 * gjenganger ved å gi den en cookie, og ser på hva som faktisk havner i
 * dataLayer — ikke på hva strengen inneholder.
 */
test("gjenganger med fullt samtykke får hendelsen med granted", () => {
  const kjor = (cookie: string) => {
    const dataLayer: Record<string, unknown>[] = [];
    const doc = {
      cookie,
      documentElement: { setAttribute() {} },
    };
    const vindu: Record<string, unknown> = { dataLayer };
    new Function("window", "document", standardSkript())(vindu, doc);
    return dataLayer;
  };

  const full = kjor(`${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: true })}`);
  const hendelse = full.find((x) => x.event === "samtykke_oppdatert");
  assert.ok(hendelse, "gjengangeren må få hendelsen");
  assert.equal(hendelse.samtykke_analyse, "granted");
  assert.equal(hendelse.samtykke_markedsforing, "granted");
  assert.equal(hendelse.samtykke_kilde, "lagret");

  const uten = kjor("");
  assert.ok(
    !uten.some((x) => x.event === "samtykke_oppdatert"),
    "uten cookie skal det IKKE sendes noen hendelse — da har ingen svart",
  );

  /*
    DEN FARLIGE RETNINGEN. En gjenganger som sa nei skal få hendelsen med
    «denied», ikke bli utelatt. Utelates den, ser en utløser i GTM ingen
    forskjell på «sa nei» og «har ikke svart» — og en tagg satt opp feil
    ville fyrt på begge.
  */
  const nei = kjor(`${COOKIE_NAVN}=${serialiser(INGEN_SAMTYKKE)}`);
  const avslag = nei.find((x) => x.event === "samtykke_oppdatert");
  assert.ok(avslag, "et avslag er også et svar og skal sendes");
  assert.equal(avslag.samtykke_analyse, "denied");
  assert.equal(avslag.samtykke_markedsforing, "denied");

  /* Og den blandede: analyse ja, markedsføring nei. */
  const delvis = kjor(
    `${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: false })}`,
  );
  const blandet = delvis.find((x) => x.event === "samtykke_oppdatert");
  assert.equal(blandet?.samtykke_analyse, "granted");
  assert.equal(blandet?.samtykke_markedsforing, "denied");
});
