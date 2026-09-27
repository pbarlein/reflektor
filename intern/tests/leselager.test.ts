import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test, { after, before } from "node:test";

import { lestAvPerson, merkLest } from "../src/lib/leselager.ts";

/**
 * Lesestatusen som følger personen.
 *
 * Testene kjører mot disk-varianten, som er den samme kodeveien som Blob
 * bortsett fra selve lagringen — `lokaltLager()` slår inn når
 * NODE_ENV ikke er production og det ikke finnes noen Blob-token.
 */

const HJEM = process.cwd();
let mappe: string;

before(async () => {
  assert.notEqual(
    process.env.NODE_ENV,
    "production",
    "testen ville skrevet mot ekte Blob",
  );
  assert.ok(
    !process.env.BLOB_READ_WRITE_TOKEN,
    "testen ville skrevet mot ekte Blob",
  );
  mappe = await mkdtemp(join(tmpdir(), "leselager-"));
  process.chdir(mappe);
});

after(async () => {
  process.chdir(HJEM);
  await rm(mappe, { recursive: true, force: true });
});

test("en ukjent person har ikke lest noe", async () => {
  assert.deepEqual([...(await lestAvPerson("ny@reflektor.no"))], []);
});

test("det som merkes lest, kan leses tilbake", async () => {
  await merkLest("a@reflektor.no", [3, 1]);
  assert.deepEqual([...(await lestAvPerson("a@reflektor.no"))].sort(), [1, 3]);
});

test("to personer deler ikke framdrift", async () => {
  await merkLest("b@reflektor.no", [7]);
  await merkLest("c@reflektor.no", [9]);
  assert.deepEqual([...(await lestAvPerson("b@reflektor.no"))], [7]);
  assert.deepEqual([...(await lestAvPerson("c@reflektor.no"))], [9]);
});

/**
 * Den viktigste egenskapen. En gammel fane som sender inn et kortere sett,
 * skal ikke kunne gjøre lest til ulest — det er den eneste måten framdrift
 * kan gå bakover på uten at noen har bedt om det.
 */
test("merking legger bare til, aldri fjerner", async () => {
  await merkLest("d@reflektor.no", [1, 2, 3]);
  const etter = await merkLest("d@reflektor.no", [2]);
  assert.deepEqual(
    [...etter].sort((x, y) => x - y),
    [1, 2, 3],
  );
});

test("samme nummer to ganger teller én gang", async () => {
  await merkLest("e@reflektor.no", [4]);
  const etter = await merkLest("e@reflektor.no", [4, 4, 4]);
  assert.equal(etter.size, 1);
});

test("søppelverdier slipper ikke inn i lageret", async () => {
  const etter = await merkLest("f@reflektor.no", [
    0,
    -3,
    1.5,
    NaN,
    5,
  ] as number[]);
  assert.deepEqual([...etter], [5]);
});

/**
 * E-posten former en filsti. Den kommer fra vår egen innlogging, men en
 * adresse som kan peke ut av mappen er en feil uansett hvor den kom fra.
 */
test("en adresse kan ikke skrive utenfor sin egen mappe", async () => {
  await merkLest("../../rømt@reflektor.no", [2]);
  const nede = await lestAvPerson("../../rømt@reflektor.no");
  assert.deepEqual([...nede], [2], "leses tilbake på samme vaskede navn");

  /*
   * Det som betyr noe er ikke at tegnene «..» er borte — vaskingen gjør
   * dem om til en del av navnet, og «..-..-r-mt@reflektor.no.json» er et
   * helt ufarlig filnavn. Kravet er at fila fortsatt ligger INNE i mappen.
   */
  const { readdir } = await import("node:fs/promises");
  const rot = join(mappe, ".leselager", "lesing");
  for (const f of await readdir(rot)) {
    assert.equal(
      resolve(rot, f).startsWith(rot + "/"),
      true,
      `${f} havnet utenfor lesing/`,
    );
  }
});
