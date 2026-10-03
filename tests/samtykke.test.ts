import assert from "node:assert/strict";
import test from "node:test";

import {
  COOKIE_NAVN,
  FULLT_SAMTYKKE,
  INGEN_SAMTYKKE,
  lesFraCookiestreng,
  parse,
  serialiser,
  meldTilClarity,
  standardSkript,
  tilClaritysignaler,
  tilSignaler,
  type Clarityvindu,
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
  assert.deepEqual(
    lesFraCookiestreng(`${COOKIE_NAVN}=${encodeURIComponent("1.01")}`),
    {
      analyse: false,
      markedsforing: true,
    },
  );
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
  assert.ok(k.includes('"consent","default"'), "må sette default");
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
 * De tre taggene som ikke leser Consent Mode — Apollo, Clarity og HubSpot —
 * kan bare styres inne i GTM-containeren. (Her sto «fem … Meta, Microsoft
 * Ads». Rettet 02.10.2026: Meta-pikselen var injisert av Squarespace og
 * forsvant ved cutover, og Microsoft Ads finnes ikke i containeren i det
 * hele tatt. Se docs/gtm-samtykke.md.) Henges
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

  const full = kjor(
    `${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: true })}`,
  );
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

/**
 * MICROSOFT CLARITY. Lagt til 02.10.2026.
 *
 * Clarity leser hverken Googles samtykkesignaler eller dataLayer. Den tar
 * opp sesjonen og setter egne cookies, og fram til samtykkekontrollen er
 * satt på taggen inne i GTM er dette kallet det eneste som forteller den
 * hva brukeren svarte.
 *
 * NØKKELNAVNENE ER DET SOM KAN GÅ GALT. De er `ad_Storage` og
 * `analytics_Storage` — med stor S, ulikt Googles `ad_storage`. Verifisert
 * mot Microsofts egen dokumentasjon 02.10.2026. En liten s her gir et kall
 * Clarity ignorerer, uten en feilmelding noe sted.
 */
test("Clarity-signalene bruker Microsofts nøkkelnavn, med stor S", () => {
  assert.deepEqual(tilClaritysignaler(INGEN_SAMTYKKE), {
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });
  assert.deepEqual(tilClaritysignaler(FULLT_SAMTYKKE), {
    ad_Storage: "granted",
    analytics_Storage: "granted",
  });
  assert.deepEqual(
    tilClaritysignaler({ analyse: true, markedsforing: false }),
    { ad_Storage: "denied", analytics_Storage: "granted" },
  );
});

/**
 * KØEN ER HELE POENGET. Clarity lastes av GTM, asynkront, og samtykket er
 * kjent før det. Et kall på et `window.clarity` som ikke finnes ennå ville
 * forsvunnet, og Clarity ville aldri fått signalet for den sidevisningen.
 */
test("meldTilClarity legger kallet i kø når Clarity ikke er lastet", () => {
  const vindu: Clarityvindu = {};
  meldTilClarity(vindu, FULLT_SAMTYKKE);

  assert.ok(vindu.clarity, "stubben må opprettes");
  assert.deepEqual(vindu.clarity.q, [
    ["consentv2", { ad_Storage: "granted", analytics_Storage: "granted" }],
  ]);
});

test("meldTilClarity bruker Clarity direkte når den er lastet", () => {
  const kall: unknown[][] = [];
  const vindu: Clarityvindu = {
    clarity: (...a: unknown[]) => {
      kall.push(a);
    },
  };
  meldTilClarity(vindu, { analyse: true, markedsforing: false });

  assert.deepEqual(kall, [
    ["consentv2", { ad_Storage: "denied", analytics_Storage: "granted" }],
  ]);
  assert.equal(
    vindu.clarity?.q,
    undefined,
    "en lastet Clarity skal ikke få en kø påtvunget",
  );
});

/**
 * Oppstartsskriptet må melde fra til Clarity også for den som IKKE har
 * svart ennå — da med `denied` på begge.
 *
 * DET ER IKKE OVERFLØDIG. Clarity skiller ikke mellom «sa nei» og «har ikke
 * svart»; den skiller mellom «har et signal» og «har ikke noe». Uten signal
 * kjører den som før, med cookies, og fra 31.10.2025 håndhever den dessuten
 * et krav om signal for besøk fra EØS.
 */
test("oppstartsskriptet melder fra til Clarity, også uten svar", () => {
  const kjor = (cookie: string) => {
    const kall: unknown[][] = [];
    const doc = { cookie, documentElement: { setAttribute() {} } };
    const vindu: Record<string, unknown> = {
      dataLayer: [],
      clarity: (...a: unknown[]) => kall.push(a),
    };
    new Function("window", "document", standardSkript())(vindu, doc);
    return kall;
  };

  assert.deepEqual(kjor(""), [
    ["consentv2", { ad_Storage: "denied", analytics_Storage: "denied" }],
  ]);

  assert.deepEqual(
    kjor(
      `${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: true })}`,
    ),
    [["consentv2", { ad_Storage: "granted", analytics_Storage: "granted" }]],
  );

  assert.deepEqual(
    kjor(
      `${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: false })}`,
    ),
    [["consentv2", { ad_Storage: "denied", analytics_Storage: "granted" }]],
  );
});

/**
 * Skriptet må opprette køen selv når Clarity ikke finnes — det er det
 * normale tilfellet, siden skriptet kjører i <head> og GTM laster Clarity
 * etterpå.
 */
test("oppstartsskriptet oppretter Clarity-køen når Clarity ikke finnes", () => {
  const doc = { cookie: "", documentElement: { setAttribute() {} } };
  const vindu: Record<string, unknown> = { dataLayer: [] };
  new Function("window", "document", standardSkript())(vindu, doc);

  const clarity = vindu.clarity as { q?: unknown[] } | undefined;
  assert.ok(clarity, "køen må opprettes i <head>, før GTM laster Clarity");
  assert.equal(clarity.q?.length, 1);
});

/**
 * Clarity-kallet må komme ETTER consent default, av samme grunn som
 * gjentakelsen av `samtykke_oppdatert`: rekkefølgen i <head> er den ene
 * tingen som er garantert her, og den skal ikke byttes om ved et uhell.
 */
test("Clarity-kallet kommer etter consent default", () => {
  const k = standardSkript();
  assert.ok(k.indexOf('"consent","default"') < k.indexOf("consentv2"));
  assert.ok(
    k.includes("ad_Storage") && k.includes("analytics_Storage"),
    "nøklene skal ha stor S — en liten s gir et kall Clarity ignorerer",
  );
});

/**
 * SAMTYKKET MÅ OVERLEVE TIL NESTE SIDE, og det gjorde det ikke.
 *
 * Målt på live 03.10.2026: etter «Godta alle» gikk første sidevisning med
 * `gcs=G111`, og alle senere med `G100` — også `/takk`, der konverteringen
 * telles. GA4 viste null `generate_lead` og null `takk_page_view` for 02.10.
 *
 * GTM-containeren har sin egen «Consent Mode - Default»-tagg som kjører
 * inne i `gtm.js` og setter alt til nektet igjen. En `default` kan
 * overstyres av en annen `default`; en `update` kan den ikke.
 *
 * Testen ser på hva som faktisk havner i dataLayer, ikke på hva strengen
 * inneholder — det er den eneste måten å fange at rekkefølgen er riktig.
 */
test("lagret samtykke sendes som BÅDE default og update", () => {
  const kjor = (cookie: string) => {
    const dataLayer: unknown[] = [];
    const doc = { cookie, documentElement: { setAttribute() {} } };
    const vindu: Record<string, unknown> = { dataLayer };
    new Function("window", "document", standardSkript())(vindu, doc);
    return dataLayer
      .filter(
        (x): x is IArguments => typeof x === "object" && x !== null && "0" in x,
      )
      .map((x) => [x[0], x[1], x[2]]);
  };

  const full = kjor(
    `${COOKIE_NAVN}=${serialiser({ analyse: true, markedsforing: true })}`,
  );
  const defaults = full.filter((k) => k[0] === "consent" && k[1] === "default");
  const updates = full.filter((k) => k[0] === "consent" && k[1] === "update");

  assert.equal(defaults.length, 1, "nøyaktig én default");
  assert.equal(updates.length, 1, "nøyaktig én update");
  assert.equal(
    full.findIndex((k) => k[1] === "default") <
      full.findIndex((k) => k[1] === "update"),
    true,
    "default må komme før update",
  );
  for (const sett of [defaults[0][2], updates[0][2]]) {
    const s = sett as Record<string, string>;
    assert.equal(s.analytics_storage, "granted");
    assert.equal(s.ad_storage, "granted");
    assert.equal(s.ad_user_data, "granted");
    assert.equal(s.ad_personalization, "granted");
  }
});

test("bare nødvendige: update sendes med denied på markedsføring", () => {
  const dataLayer: unknown[] = [];
  const doc = {
    cookie: `${COOKIE_NAVN}=${serialiser({ analyse: false, markedsforing: false })}`,
    documentElement: { setAttribute() {} },
  };
  new Function("window", "document", standardSkript())({ dataLayer }, doc);
  const update = dataLayer
    .filter(
      (x): x is IArguments => typeof x === "object" && x !== null && "0" in x,
    )
    .find((x) => x[0] === "consent" && x[1] === "update");
  assert.ok(update, "den som har svart nei skal også få en update");
  const s = update[2] as Record<string, string>;
  assert.equal(s.analytics_storage, "denied");
  assert.equal(s.ad_storage, "denied");
});

test("ingen cookie gir ingen update", () => {
  const dataLayer: unknown[] = [];
  const doc = { cookie: "", documentElement: { setAttribute() {} } };
  new Function("window", "document", standardSkript())({ dataLayer }, doc);
  const update = dataLayer
    .filter(
      (x): x is IArguments => typeof x === "object" && x !== null && "0" in x,
    )
    .find((x) => x[0] === "consent" && x[1] === "update");
  assert.equal(
    update,
    undefined,
    "uten svar er tilstanden nektet fra default — en update ville sagt at noen har svart nei",
  );
});
