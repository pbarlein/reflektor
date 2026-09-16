import assert from "node:assert/strict";
import test from "node:test";

import {
  FELTGRENSER,
  foroftig,
  klientnokkel,
  rens,
  rensEnLinje,
  serUtSomEpost,
} from "../src/lib/skjemavern.ts";

/**
 * Prosjektets første tester, og de dekker med vilje bare ett sted: vernet
 * rundt `/api/skjema`.
 *
 * Grunnen er at dette er det eneste i kodebasen der en feil er USYNLIG.
 * Alt annet vises på skjermen eller fanges av content:check og lenkesjekk.
 * En regex som slutter å fjerne kontrolltegn ser helt lik ut i en diff, og
 * ingen oppdager det før noen utnytter det.
 *
 * Kjøres med `npm test`. De trenger ingen nettverkstilgang og sender ingen
 * e-post.
 */

const kontrolltegn = String.fromCharCode(0, 7, 27, 127);

test("rens trimmer og fjerner kontrolltegn", () => {
  assert.equal(rens("  Pål  ", "navn"), "Pål");
  assert.equal(rens(`Pål${kontrolltegn}`, "navn"), "Pål");
  assert.equal(rens(null, "navn"), "");
  assert.equal(rens(new File([], "x"), "navn"), "");
});

test("rens fjerner linjeskift i ettlinjede felt, men beholder dem i meldingen", () => {
  assert.equal(rens("Pål\r\nBcc: ond@eksempel.no", "navn"), "PålBcc: ond@eksempel.no");
  assert.equal(rens("Linje 1\nLinje 2", "melding"), "Linje 1\nLinje 2");
  assert.equal(rens(`Linje 1\n${kontrolltegn}Linje 2`, "melding"), "Linje 1\nLinje 2");
});

test("rens kutter på feltgrensen og markerer kuttet", () => {
  const ut = rens("a".repeat(9000), "melding");
  assert.ok(ut.startsWith("a".repeat(FELTGRENSER.melding)));
  assert.ok(ut.endsWith("[…kuttet]"));
  assert.equal(rens("a".repeat(FELTGRENSER.navn), "navn").length, FELTGRENSER.navn);
});

test("rensEnLinje fjerner linjeskift", () => {
  assert.equal(rensEnLinje("Ny\r\nBcc: ond@eksempel.no"), "Ny Bcc: ond@eksempel.no");
});

test("serUtSomEpost slipper gjennom vanlige adresser og stopper åpenbar søppel", () => {
  assert.ok(serUtSomEpost("pal@reflektor.no"));
  assert.ok(serUtSomEpost("fornavn.etternavn+merke@under.domene.co.uk"));
  assert.ok(!serUtSomEpost("ikke en adresse"));
  assert.ok(!serUtSomEpost("a@b"));
  assert.ok(!serUtSomEpost(""));
  assert.ok(!serUtSomEpost(`${"a".repeat(250)}@b.no`));
});

test("foroftig slipper gjennom fem i minuttet og stopper resten", () => {
  const na = 1_000_000;
  const svar = Array.from({ length: 8 }, (_, i) => foroftig("test-a", na + i));
  assert.deepEqual(svar.slice(0, 5), [false, false, false, false, false]);
  assert.deepEqual(svar.slice(5), [true, true, true]);
});

test("foroftig nullstiller etter vinduet, og skiller mellom nøkler", () => {
  const na = 2_000_000;
  for (let i = 0; i < 6; i++) foroftig("test-b", na + i);
  assert.equal(foroftig("test-b", na + 61_000), false, "vinduet skal ha løpt ut");
  assert.equal(foroftig("test-c", na), false, "annen nøkkel skal være upåvirket");
});

test("klientnokkel tar første adresse i x-forwarded-for", () => {
  assert.equal(
    klientnokkel(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" })),
    "1.2.3.4",
  );
  assert.equal(klientnokkel(new Headers({ "x-real-ip": "9.9.9.9" })), "9.9.9.9");
  assert.equal(klientnokkel(new Headers()), "ukjent");
});
