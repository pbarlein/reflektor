import assert from "node:assert/strict";
import test from "node:test";

import { trygtNeste } from "../src/lib/retursti.ts";

/**
 * Åpen videresending er angrepet denne funksjonen finnes for å stoppe: en
 * lenke til VÅRT domene, med vår innlogging og vår hengelås, som sender
 * brukeren til angriperens side etterpå.
 *
 * Testene her er derfor ikke «dekning». De er listen over former angrepet
 * faktisk tar, og hver av dem har vært en ekte CVE i et ekte produkt.
 */
test("beholder en vanlig intern sti", () => {
  assert.equal(
    trygtNeste("/rubrikk/lyd-kan-ikke-reddes"),
    "/rubrikk/lyd-kan-ikke-reddes",
  );
  assert.equal(trygtNeste("/?filter=opptak"), "/?filter=opptak");
});

test("avviser absolutt URL til et annet domene", () => {
  assert.equal(trygtNeste("https://angriper.no"), "/");
  assert.equal(trygtNeste("http://angriper.no/logg-inn"), "/");
});

test("avviser protokollrelativ URL", () => {
  // `//angriper.no` er IKKE en sti. Nettleseren leser den som et annet
  // domene med samme protokoll — den klassiske omgåelsen av en sjekk som
  // bare krever at strengen starter med «/».
  assert.equal(trygtNeste("//angriper.no"), "/");
  assert.equal(trygtNeste("//angriper.no/noe"), "/");
});

test("avviser bakoverskråstrek, som noen nettlesere leser som skråstrek", () => {
  assert.equal(trygtNeste("/\\angriper.no"), "/");
});

test("avviser stier inn i API-et", () => {
  assert.equal(trygtNeste("/api/auth/dev"), "/");
});

test("tomme og manglende verdier gir forsiden", () => {
  assert.equal(trygtNeste(null), "/");
  assert.equal(trygtNeste(undefined), "/");
  assert.equal(trygtNeste(""), "/");
});
