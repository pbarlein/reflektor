import assert from "node:assert/strict";
import test from "node:test";

import { flyttMedOver, stegnokkel } from "../src/lib/rapportflytt.ts";

/**
 * Feilen disse testene finnes for.
 *
 * 27.09.2026 ble rapportoppgaven kjørt to ganger på samme uke. Pål hadde
 * krysset av to steg og svart «ja» på beslutningen mellom kjøringene.
 * Avkryssingene lå lagret som indekser, og den nye utgaven hadde andre steg
 * i de samme posisjonene: hakene ble stående på tekst han aldri hadde sett.
 * Svaret ble hengende under et nytt spørsmål.
 */

const NAA = "2026-09-27T19:24:34.000Z";

function fra(
  titler: string[],
  gjort: number[],
  sporsmal: string | null = null,
  svar: "ja" | "nei" | "senere" | null = null,
) {
  return {
    steg: titler.map((title) => ({ title })),
    sporsmal,
    gjorteSteg: gjort.map((indeks) => ({
      indeks,
      tidspunkt: "2026-09-27T19:14:52.000Z",
    })),
    beslutning: svar ? { svar } : null,
  };
}

function til(titler: string[], sporsmal: string | null = null) {
  return { steg: titler.map((title) => ({ title })), sporsmal };
}

test("haken følger teksten, ikke posisjonen", () => {
  const r = flyttMedOver(
    fra(["Bestill ny video.", "Sjekk Google.", "Mål sommervideoen."], [1]),
    /* Samme steg, ny rekkefølge, ett nytt steg på toppen. */
    til(["Nytt steg først.", "Mål sommervideoen.", "Sjekk Google."]),
    NAA,
  );
  assert.deepEqual(
    r.gjorteSteg.map((g) => g.indeks),
    [2],
    "«Sjekk Google.» flyttet fra plass 1 til plass 2",
  );
  assert.equal(r.mistet, null);
});

test("avkryssingen på et steg som er borte, blir meldt fra om", () => {
  const r = flyttMedOver(
    fra(["Bestill ny video.", "Sjekk Google."], [0, 1]),
    til(["Sjekk Google."]),
    NAA,
  );
  assert.deepEqual(
    r.gjorteSteg.map((g) => g.indeks),
    [0],
  );
  assert.deepEqual(r.mistet?.steg, ["Bestill ny video."]);
  assert.equal(r.mistet?.tidspunkt, NAA);
});

test("tidspunktet for avkryssingen beholdes gjennom flyttingen", () => {
  const r = flyttMedOver(
    fra(["Sjekk Google."], [0]),
    til(["Noe annet.", "Sjekk Google."]),
    NAA,
  );
  assert.equal(r.gjorteSteg[0]?.tidspunkt, "2026-09-27T19:14:52.000Z");
});

test("omskrevet tegnsetting er samme steg", () => {
  const r = flyttMedOver(
    fra(["Sjekk at Google faktisk står stille."], [0]),
    til(["sjekk at google faktisk står stille"]),
    NAA,
  );
  assert.deepEqual(
    r.gjorteSteg.map((g) => g.indeks),
    [0],
  );
  assert.equal(r.mistet, null);
});

test("to like haker lander ikke på samme nye steg", () => {
  const r = flyttMedOver(
    fra(["Ring kunden", "Ring kunden!"], [0, 1]),
    til(["Ring kunden"]),
    NAA,
  );
  assert.equal(r.gjorteSteg.length, 1);
  assert.deepEqual(r.mistet?.steg, ["Ring kunden!"]);
});

test("svaret står så lenge spørsmålet står", () => {
  const sp = "Skal vi bestille ny annonsevideo til Meta nå?";
  const r = flyttMedOver(fra([], [], sp, "ja"), til([], sp), NAA);
  assert.equal(r.beslutning?.svar, "ja");
  assert.equal(r.mistet, null);
});

test("endret spørsmål tar ikke med seg det gamle svaret", () => {
  const r = flyttMedOver(
    fra([], [], "Skal vi lage en ny leadsvideo til Meta i oktober?", "ja"),
    til([], "Skal vi bestille ny annonsevideo til Meta nå?"),
    NAA,
  );
  assert.equal(r.beslutning, null, "svaret skal ikke henge under nytt spørsmål");
  assert.equal(
    r.mistet?.beslutning?.sporsmal,
    "Skal vi lage en ny leadsvideo til Meta i oktober?",
  );
  assert.equal(r.mistet?.beslutning?.svar, "ja");
});

test("et spørsmål som bare har fått ny tegnsetting, teller som endret", () => {
  /*
   * Motsatt regel av stegene, og med vilje. Se `flyttMedOver`: på et
   * ja/nei-spørsmål er en løs sammenligning en felle, ikke en hjelp.
   */
  const r = flyttMedOver(
    fra([], [], "Skal vi bestille ny video nå?", "ja"),
    til([], "Skal vi bestille ny video nå"),
    NAA,
  );
  assert.equal(r.beslutning, null);
});

test("forsvant beslutningen helt, meldes det gamle svaret fra om", () => {
  const r = flyttMedOver(
    fra([], [], "Skal vi bestille ny video nå?", "nei"),
    til([], null),
    NAA,
  );
  assert.equal(r.beslutning, null);
  assert.equal(r.mistet?.beslutning?.svar, "nei");
});

test("første utgave mister ingenting", () => {
  const r = flyttMedOver(null, til(["Sjekk Google."], "Skal vi?"), NAA);
  assert.deepEqual(r.gjorteSteg, []);
  assert.equal(r.beslutning, null);
  assert.equal(r.mistet, null);
});

test("en hake som allerede pekte utenfor, forsvinner uten støy", () => {
  /* Kan bare oppstå i data skrevet før denne rettelsen. */
  const r = flyttMedOver(fra(["Ett steg"], [7]), til(["Ett steg"]), NAA);
  assert.deepEqual(r.gjorteSteg, []);
  assert.equal(r.mistet, null);
});

test("stegnokkel skiller fortsatt to ulike steg", () => {
  assert.notEqual(stegnokkel("Sjekk Google."), stegnokkel("Sjekk Meta."));
});
