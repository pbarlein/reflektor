import assert from "node:assert/strict";
import test from "node:test";

import { emne } from "@/lib/lead";
import { delNavn } from "@/lib/hubspot";

/**
 * E-posten er hovedkanalen for leads. Den leses på telefon, i en innboks med
 * annet i, og rekkefølgen i den er bestilt: emnet skal si hvem og hvilken
 * bedrift, meldingen skal stå øverst, kilden nederst.
 *
 * Emnefeltet er det eneste av dette som er lett å ødelegge uten å se det —
 * resten er synlig i en testinnsending. Derfor står det her.
 */

test("emnet har navn og bedrift", () => {
  assert.equal(
    emne({ navn: "Marisol", bedrift: "La Mexicana AS" }),
    "Ny henvendelse: Marisol – La Mexicana AS",
  );
});

test("emnet tåler at bedriften mangler", () => {
  assert.equal(
    emne({ navn: "Marisol", bedrift: "" }),
    "Ny henvendelse: Marisol",
  );
});

test("emnet tåler at navnet mangler", () => {
  assert.equal(
    emne({ navn: "", bedrift: "La Mexicana AS" }),
    "Ny henvendelse: La Mexicana AS",
  );
});

test("emnet faller tilbake når begge mangler", () => {
  assert.equal(emne({ navn: "", bedrift: "" }), "Ny henvendelse fra nettsiden");
});

/**
 * MELLOMROM I NAVNEFELTENE. Dealnavnet i HubSpot settes sammen av fornavn,
 * etternavn og bedrift i en arbeidsflyt. «Marisol – La. MEXICANA As» fikk et
 * dobbelt mellomrom fordi etternavnet var tomt, og et felt som BEGYNNER
 * eller SLUTTER med mellomrom gir samme feil uten at noe ser rart ut i
 * HubSpot-grensesnittet.
 *
 * `delNavn` skal aldri slippe ut et slikt felt, uansett hva som kommer inn.
 */
test("fornavn og etternavn har aldri mellomrom i endene", () => {
  for (const inn of [
    "  Marisol  ",
    "Marisol",
    "Pål  Erik   Barlein",
    "\tAnne Berit\n",
    "   ",
    "",
  ]) {
    const { fornavn, etternavn } = delNavn(inn);
    assert.equal(fornavn, fornavn.trim(), `fornavn fra «${inn}»`);
    assert.equal(etternavn, etternavn.trim(), `etternavn fra «${inn}»`);
    assert.ok(!fornavn.includes("  "), `dobbelt mellomrom i «${fornavn}»`);
    assert.ok(!etternavn.includes("  "), `dobbelt mellomrom i «${etternavn}»`);
  }
});

test("ett ord gir tomt etternavn, ikke et mellomrom", () => {
  assert.deepEqual(delNavn("  Marisol "), {
    fornavn: "Marisol",
    etternavn: "",
  });
});
