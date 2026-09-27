import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { FELLESFELT, erTest, lesRapport } from "../src/content/rapporttype.ts";
import { forfalt, kr, norskDato, prosent } from "../src/lib/rapportformat.ts";
import { iSendevindu } from "../src/lib/rapportformat.ts";

/**
 * Vedlegg A fra oppdraget, kopiert inn som fixtur.
 *
 * Testen leste den først rett fra den opplastede oppdragsfilen. Det virket
 * på maskinen den ble skrevet på, og ville strøket overalt ellers — en test
 * som avhenger av en fil utenfor repoet, er en test som ikke kan kjøres.
 */
const VEDLEGG_A = JSON.parse(
  readFileSync(new URL("./fixtures/vedlegg-a.json", import.meta.url), "utf8"),
) as Record<string, unknown>;

test("vedlegg A leses uten feil", () => {
  const l = lesRapport(VEDLEGG_A);
  assert.ok(l.ok, l.ok ? "" : l.feil.join(" "));
  if (!l.ok) return;
  assert.equal(l.rapport.id, "betalt-markedsforing-2026-W39");
  assert.equal(l.rapport.verdict.level, "act");
  assert.equal(l.rapport.weeks.length, 12);
  assert.equal(l.rapport.ads.length, 3);
  assert.equal(l.rapport.test, true);
});

/**
 * ── HELE PAYLOADEN SKAL OVERLEVE ──────────────────────────────────────────
 *
 * Malen kommer til å få nye felt. De skal lagres selv om ingen skjerm viser
 * dem ennå — ellers er en oppgradering av malen et datatap vi oppdager
 * måneder senere.
 */
test("ukjente felt kastes ikke bort", () => {
  const l = lesRapport({ ...VEDLEGG_A, noe_helt_nytt: { a: 1 } });
  assert.ok(l.ok);
  if (!l.ok) return;
  assert.deepEqual(l.rå.noe_helt_nytt, { a: 1 });
});

test("manglende påkrevde felt gir alle feilene på én gang", () => {
  const l = lesRapport({ schema: "reflektor.report.v1", type: "x" });
  assert.ok(!l.ok);
  if (l.ok) return;
  /* Ni av elleve fellesfelt mangler — schema og type er de to som finnes. */
  assert.equal(l.feil.length, FELLESFELT.length - 2);
  assert.ok(l.feil.every((f) => f.startsWith("Mangler")));
});

test("feil schema avvises", () => {
  const l = lesRapport({ ...VEDLEGG_A, schema: "noe.annet.v9" });
  assert.ok(!l.ok);
  if (l.ok) return;
  assert.ok(l.feil.some((f) => /Ukjent schema/.test(f)));
});

/** En id blir til en filsti. Den får ikke inneholde hva som helst. */
test("id-er som kan peke ut av mappen avvises", () => {
  for (const id of [
    "../../etc/passwd",
    "a/b",
    "med mellomrom",
    "a".repeat(200),
  ]) {
    const l = lesRapport({ ...VEDLEGG_A, id });
    assert.ok(!l.ok, `«${id}» slapp gjennom`);
  }
});

test("søppel inn gir feil, ikke unntak", () => {
  for (const x of [null, undefined, 42, "nei", [], {}]) {
    const l = lesRapport(x);
    assert.ok(!l.ok);
  }
});

/**
 * Testflagget kan komme to veier. Bommer vi på den ene, havner oppdiktede
 * tall i arkivet og i trendene.
 */
test("en rapport er test både på flagget og på bunnteksten", () => {
  assert.equal(erTest({ test: true, footer: "" }), true);
  assert.equal(erTest({ footer: "TESTDATA · kilder …" }), true);
  assert.equal(erTest({ footer: "noe med testdata i seg" }), true);
  assert.equal(erTest({ test: false, footer: "Ekte tall" }), false);
  assert.equal(erTest({}), false);
});

test("beløp og prosent skrives som bestilt", () => {
  assert.equal(kr(2000).replace(/ /g, " "), "2 000 kr");
  assert.equal(kr(11278).replace(/ /g, " "), "11 278 kr");
  assert.equal(kr(null), "–");
  assert.equal(prosent(198.5).replace(/ /g, " "), "+199 %");
  assert.equal(prosent(-17.1).replace(/ /g, " "), "−17 %");
});

test("datoer skrives som «fredag 2. oktober»", () => {
  assert.equal(norskDato("2026-10-02"), "fredag 2. oktober");
});

/**
 * ── SENDEVINDUET ──────────────────────────────────────────────────────────
 *
 * Regnes ut med Intl og ikke med en fast timeforskjell, fordi Norge bytter
 * mellom +01 og +02. Testen sjekker begge sider av det skiftet.
 */
test("purringer sendes bare hverdager 08–17, Oslo-tid", () => {
  const nei = [
    ["2026-09-26T10:00:00Z", "lørdag"],
    ["2026-09-27T10:00:00Z", "søndag"],
    ["2026-09-28T04:00:00Z", "mandag 06 lokal"],
    ["2026-09-28T15:30:00Z", "mandag 17:30 lokal"],
    ["2026-01-05T06:30:00Z", "vintertid, 07:30 lokal"],
  ] as const;
  for (const [t, hva] of nei) {
    assert.equal(iSendevindu(new Date(t)), false, `${hva} skulle vært utenfor`);
  }

  const ja = [
    ["2026-09-28T06:30:00Z", "mandag 08:30 sommertid"],
    ["2026-09-30T12:00:00Z", "onsdag midt på dagen"],
    ["2026-01-05T08:00:00Z", "mandag 09:00 vintertid"],
  ] as const;
  for (const [t, hva] of ja) {
    assert.equal(iSendevindu(new Date(t)), true, `${hva} skulle vært innenfor`);
  }
});

test("en frist har passert først dagen etter", () => {
  const naa = new Date("2026-10-02T09:00:00Z");
  assert.equal(forfalt("2026-10-01", naa), true);
  assert.equal(
    forfalt("2026-10-02", naa),
    false,
    "fristen er i dag, ikke passert",
  );
  assert.equal(forfalt("2026-10-03", naa), false);
  assert.equal(forfalt("", naa), false, "tom frist kan ikke passere");
});
