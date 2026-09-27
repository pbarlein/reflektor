import assert from "node:assert/strict";
import test from "node:test";

import { MALER } from "../src/content/maler.ts";
import { treffer } from "../src/lib/malsok.ts";

const RADER = MALER.map((m) => ({
  navn: m.navn,
  kort: m.kort,
  ansvarlig: m.ansvarlig,
  naar: m.naar,
  fase: m.fase as string,
}));

const funn = (q: string) =>
  RADER.filter((m) => treffer(m, q)).map((m) => m.navn);

test("tomt søk viser alt", () => {
  for (const q of ["", "   "]) {
    assert.equal(funn(q).length, MALER.length, JSON.stringify(q));
  }
});

test("navnet treffer, også på en bit av det", () => {
  assert.deepEqual(funn("rapport"), ["Månedsrapport til kunde"]);
  assert.ok(funn("produksjonsplan").includes("Produksjonsplan"));
});

/**
 * Den som ikke husker hva dokumentet heter, husker som regel hva det gjør.
 * Søker man bare i navnet, må man kunne navnet fra før.
 */
test("beskrivelsen og rollen treffer også", () => {
  assert.ok(
    funn("etter møtet").includes("Oppsummering etter kundemøte"),
    "et uttrykk fra beskrivelsen finner ikke malen",
  );
  const kundeansvarlig = funn("kundeansvarlig");
  assert.ok(kundeansvarlig.length >= 2, "rollen finner ingenting");
  assert.ok(
    kundeansvarlig.every((n) =>
      MALER.find((m) => m.navn === n && m.ansvarlig === "Kundeansvarlig"),
    ),
    "rollesøket drar med seg maler som har en annen ansvarlig",
  );
});

test("store og små bokstaver spiller ingen rolle", () => {
  assert.deepEqual(funn("RAPPORT"), funn("rapport"));
});

/**
 * Å legge til et ord skal alltid snevre inn. Gjorde det ikke det, ville
 * søket blitt mindre presist jo mer man skrev — stikk i strid med hva den
 * som skriver prøver på.
 */
test("flere ord snevrer inn, og treffer på tvers av feltene", () => {
  const ett = funn("plan");
  const to = funn("plan måned");
  assert.ok(to.length < ett.length, "det andre ordet snevret ikke inn");
  assert.ok(
    to.every((n) => ett.includes(n)),
    "det andre ordet utvidet treffet",
  );

  /* «kundeansvarlig» er rollen, «plan» står i navnet. Begge må telle. */
  assert.ok(
    funn("plan kundeansvarlig").includes("Publiseringsplan for en måned"),
  );
});

test("et søk uten treff gir tom liste, ikke alt", () => {
  assert.deepEqual(funn("zzzzz"), []);
});
