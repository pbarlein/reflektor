import assert from "node:assert/strict";
import test from "node:test";

import { HORTVALG, HORT_FELT, hortEtikett, lesHortvalg } from "@/lib/hortomoss";

/**
 * «Hvor hørte du om oss?» — nedtrekket i kontaktskjemaet, bestilt 06.11.2026.
 *
 * TO TING KAN GÅ GALT UTEN AT NOEN MERKER DET:
 *
 * 1. En verdi som ikke finnes i HubSpot-egenskapen sendes inn. Da avviser
 *    HubSpot HELE innsendingen, og reserven i hubspot.ts sender den på nytt
 *    uten feltet. Leadet overlever, men hvis ingen leser loggen, ser alt
 *    normalt ut mens feltet aldri fylles.
 * 2. Feltet begynner å stoppe innsendinger. Det er valgfritt, og et
 *    valgfritt pyntefelt skal aldri kunne koste et lead.
 */

test("de sju verdiene er nøyaktig de som er opprettet i HubSpot", () => {
  assert.deepEqual(
    HORTVALG.map((v) => v.verdi),
    ["google", "ai", "meta", "linkedin", "anbefaling", "kjente_fra_for", "annet"],
  );
});

test("feltnavnet er det samme som egenskapsnavnet i HubSpot", () => {
  assert.equal(HORT_FELT, "hort_om_oss");
});

test("hver verdi har en etikett, og ingen står tom", () => {
  for (const v of HORTVALG) {
    assert.ok(v.etikett.trim().length > 0, `${v.verdi} mangler etikett`);
    assert.match(v.verdi, /^[a-z_]+$/, `${v.verdi} er ikke et gyldig internt navn`);
  }
});

/**
 * ALT SOM IKKE STÅR I LISTA BLIR TOMT. Dette er vakten mot at en POST
 * utenfra sender en verdi HubSpot ikke kjenner igjen.
 */
test("bare kjente verdier slipper gjennom", () => {
  assert.equal(lesHortvalg("google"), "google");
  assert.equal(lesHortvalg(" linkedin "), "linkedin");

  for (const tull of [
    "Google",
    "google; drop table",
    "<script>",
    "nei_ikke_nå",
    "",
    "   ",
    null,
    undefined,
    42,
    { verdi: "google" },
    ["google"],
  ]) {
    assert.equal(lesHortvalg(tull), "", `${JSON.stringify(tull)} slapp gjennom`);
  }
});

/**
 * TOMT SKAL IKKE SE UT SOM EN FEIL I VARSELET. Pål ba om ordet «ikke svart»,
 * ikke en tankestrek og ikke en tom linje.
 */
test("tom verdi blir «ikke svart» i varselet", () => {
  assert.equal(hortEtikett(""), "ikke svart");
  assert.equal(hortEtikett("finnes-ikke"), "ikke svart");
  assert.equal(hortEtikett("google"), "Google");
  assert.equal(hortEtikett("kjente_fra_for"), "Kjente Reflektor fra før");
});
