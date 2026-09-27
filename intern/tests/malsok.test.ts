import assert from "node:assert/strict";
import test from "node:test";

import { MALER } from "../src/content/maler.ts";
import { treffer } from "../src/lib/malsok.ts";

/*
 * Speiler nøyaktig det `/dokument` sender til klienten. Faller et felt ut
 * her, faller det ut der — og da søker velgeren i noe annet enn testen.
 */
const RADER = MALER.map((m) => ({
  navn: m.navn,
  kort: m.kort,
  ansvarlig: m.ansvarlig,
  naar: m.naar,
  fase: m.fase as string,
  kallenavn: m.kallenavn,
}));

const funn = (q: string) =>
  RADER.filter((m) => treffer(m, q)).map((m) => m.navn);

test("tomt søk viser alt", () => {
  for (const q of ["", "   "]) {
    assert.equal(funn(q).length, MALER.length, JSON.stringify(q));
  }
});

test("navnet treffer, også på en bit av det", () => {
  assert.deepEqual(funn("befaring"), ["Befaringsnotat"]);
  assert.ok(funn("produksjonsplan").includes("Produksjonsplan"));
});

/**
 * Opptakslisten var en egen mal fram til 28.09.2026 og er nå del to av
 * produksjonsplanen. Navnet sitter i fingrene, og den som skriver det skal
 * finne dokumentet — ikke «ingen maler heter noe som ligner».
 */
test("de gamle navnene finner den sammenslåtte malen", () => {
  /* Ord som bare denne malen bærer, skal treffe den alene. */
  for (const gammelt of ["opptaksliste", "shotliste"]) {
    assert.deepEqual(funn(gammelt), ["Produksjonsplan"], gammelt);
  }
  /*
   * «Produksjonsdagen» heter ingen mal lenger, men ordet står i teksten til
   * både befaringsnotatet og publiseringsplanen — begge handler om dagen.
   * Det er søket som virker, ikke et treff for mye: kravet er at malen er
   * med, ikke at den er alene.
   */
  assert.ok(funn("produksjonsdagen").includes("Produksjonsplan"));
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
