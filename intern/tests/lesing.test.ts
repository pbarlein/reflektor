import assert from "node:assert/strict";
import test from "node:test";

import { RUBRIKKER } from "../src/content/rubrikker/index.ts";
import type { Rubrikk } from "../src/content/rubrikktype.ts";
import {
  NY_MAKS,
  lesMaske,
  lesetilstander,
  nesteRubrikk,
  skrivMaske,
} from "../src/lib/lesing.ts";

/** En rubrikk med akkurat de feltene reglene bryr seg om. */
function lag(nr: number, oppdatert: string, ekstra: Partial<Rubrikk> = {}) {
  return {
    nr,
    slug: `r${nr}`,
    oppdatert,
    prioritet: nr,
    ...ekstra,
  } as unknown as Rubrikk;
}

test("hver rubrikk har et unikt nr", () => {
  /*
   * `nr` er posisjonen i bitmasken som bærer lesestatusen. To rubrikker med
   * samme tall betyr at den ene blir huket av når noen leser den andre —
   * en feil som er usynlig i koden og bare merkelig i bruk.
   */
  const sett = new Map<number, string>();
  for (const r of RUBRIKKER) {
    assert.ok(
      Number.isInteger(r.nr) && r.nr > 0 && r.nr <= 400,
      `${r.slug}: nr må være et positivt heltall under 400, var ${r.nr}`,
    );
    const fraFor = sett.get(r.nr);
    assert.ok(
      fraFor === undefined,
      `nr ${r.nr} brukes av både ${fraFor} og ${r.slug}`,
    );
    sett.set(r.nr, r.slug);
  }
});

test("høyst én rubrikk er fremhevet, og den sier hvorfor", () => {
  /*
   * «Start her» peker på én ting. To fremhevede rubrikker peker i to
   * retninger, og da peker de ingen vei — som er nøyaktig forvirringen
   * hele lesesystemet skal fjerne.
   */
  const fremhevede = RUBRIKKER.filter((r) => r.fremhevet);
  assert.ok(
    fremhevede.length <= 1,
    `${fremhevede.length} er fremhevet: ${fremhevede.map((r) => r.slug).join(", ")}`,
  );
  for (const r of fremhevede) {
    assert.ok(
      (r.fremhevet ?? "").length > 25,
      `${r.slug}: «fremhevet» må si HVORFOR den gjelder nå`,
    );
  }
});

test("bitmasken tåler en rundtur med alle rubrikkene", () => {
  const alle = RUBRIKKER.map((r) => r.nr).sort((a, b) => a - b);
  const tilbake = [...lesMaske(skrivMaske(alle))].sort((a, b) => a - b);
  assert.deepEqual(tilbake, alle);
});

test("bitmasken for hele huben får plass i en informasjonskapsel", () => {
  /*
   * Kapselen sendes med hver eneste forespørsel, også bilder og video. Hele
   * poenget med bitmasken framfor en liste med slugger var at den er liten.
   * Blir den stor igjen, er valget feil og skal tas opp på nytt.
   */
  const lengde = skrivMaske(RUBRIKKER.map((r) => r.nr)).length;
  assert.ok(lengde < 120, `bitmasken er ${lengde} tegn — for mye for en kapsel`);
});

test("tom og ødelagt kapsel gir tomt sett, ikke en feil", () => {
  assert.equal(lesMaske(undefined).size, 0);
  assert.equal(lesMaske("").size, 0);
  assert.equal(lesMaske("!!!ikke base64!!!").size, 0);
});

test("få ferske rubrikker merkes som nye", () => {
  const naa = new Date("2026-09-21");
  const rubrikker = [
    lag(1, "2026-09-20"),
    lag(2, "2026-09-19"),
    lag(3, "2026-01-01"),
  ];
  const t = lesetilstander(rubrikker, new Set(), naa);
  assert.equal(t.get("r1"), "ny");
  assert.equal(t.get("r2"), "ny");
  assert.equal(t.get("r3"), "ulest", "gammel rubrikk skal ikke være ny");
});

test("når ALT er ferskt, merkes ingenting som nytt", () => {
  /*
   * Dette er regelen hele merkesystemet står og faller på. En nyansatt
   * åpner en hub der alt er nytt og ingenting er lest. Femti NY-merker er
   * ikke femti signaler — det er null. Retningen ligger i «Start her».
   *
   * Regelen er hentet fra retningslinjene for uleste-markører: bruk dem
   * bare når det som kommer inn er sjeldent.
   */
  const naa = new Date("2026-09-21");
  const mange = Array.from({ length: NY_MAKS + 1 }, (_, i) =>
    lag(i + 1, "2026-09-20"),
  );
  const t = lesetilstander(mange, new Set(), naa);
  assert.ok(
    [...t.values()].every((v) => v === "ulest"),
    "over grensa skal ingen merkes som nye",
  );
});

test("lest slår ny", () => {
  const naa = new Date("2026-09-21");
  const t = lesetilstander([lag(1, "2026-09-20")], new Set([1]), naa);
  assert.equal(t.get("r1"), "lest");
});

test("en lest rubrikk teller ikke mot NY-grensa", () => {
  /*
   * Grensa skal telle det leseren faktisk får se. Teller vi med de leste,
   * kan én ulest rubrikk bli usynlig fordi fem andre ble lest i går.
   */
  const naa = new Date("2026-09-21");
  const rubrikker = Array.from({ length: NY_MAKS + 1 }, (_, i) =>
    lag(i + 1, "2026-09-20"),
  );
  const lest = new Set([1, 2, 3, 4, 5].slice(0, NY_MAKS));
  const t = lesetilstander(rubrikker, lest, naa);
  assert.equal(t.get(`r${NY_MAKS + 1}`), "ny");
});

test("neste rubrikk er den fremhevede, ellers høyest prioritet", () => {
  const a = lag(1, "2026-09-01", { prioritet: 10 });
  const b = lag(2, "2026-09-01", { prioritet: 99 });
  const c = lag(3, "2026-09-01", { prioritet: 50, fremhevet: "Start her." });

  assert.equal(nesteRubrikk([a, b, c], new Set())?.slug, "r3", "fremhevet først");
  assert.equal(
    nesteRubrikk([a, b, c], new Set([3]))?.slug,
    "r2",
    "lest fremhevet: høyest prioritet av resten",
  );
  assert.equal(
    nesteRubrikk([a, b, c], new Set([1, 2, 3])),
    undefined,
    "alt lest: ingen anbefaling",
  );
});
