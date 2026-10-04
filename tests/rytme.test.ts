import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";

import { SEKSJONSLUFT } from "@/components/forside/rytme.ts";

/**
 * Forsidens vertikale rytme.
 *
 * REGELEN ER GAMMEL, VERDIENE VAR DET IKKE. «Hver seksjon betaler for
 * luften under seg, ingen har luft over» har stått i Arbeidet.tsx hele
 * tiden, og den ble fulgt. Men hver seksjon hadde sin egen verdi: pb-14,
 * pb-16, pb-20, pb-24 og pb-28, med fem sm-varianter oppå. Luften over
 * priskortet ble 144 px og luften under 80.
 *
 * Målt i nettleseren 04.10.2026, 1440 px bred: 144 over, 80 under. Etter:
 * 96 og 96.
 *
 * Testen fanger den eneste måten dette kan gli fra hverandre igjen på: at
 * noen skriver en pb-verdi rett på en seksjon i stedet for å bruke
 * konstanten.
 */

const KATALOG = "src/components/forside";

/** Seksjoner som med vilje ikke er en seksjon på forsiden. */
const UNNTAK = new Set(["rytme.ts"]);

function filer(): string[] {
  return readdirSync(KATALOG).filter(
    (n) => n.endsWith(".tsx") && !UNNTAK.has(n),
  );
}

test("ingen forsideseksjon skriver sin egen bunnluft", () => {
  const syndere: string[] = [];
  for (const navn of filer()) {
    const kilde = readFileSync(`${KATALOG}/${navn}`, "utf8");
    for (const m of kilde.matchAll(/<section[^>]*className="([^"]*)"/g)) {
      if (/\bs?m?:?pb-\d+/.test(m[1]!)) syndere.push(`${navn}: ${m[1]}`);
    }
  }
  assert.deepEqual(syndere, [], "disse setter pb rett på <section>");
});

test("hver forsideseksjon bruker den felles verdien", () => {
  for (const navn of filer()) {
    const kilde = readFileSync(`${KATALOG}/${navn}`, "utf8");
    const seksjoner = [...kilde.matchAll(/<section[^>]/g)];
    if (!seksjoner.length) continue;
    assert.ok(
      kilde.includes("SEKSJONSLUFT"),
      `${navn} har en <section> uten å bruke SEKSJONSLUFT`,
    );
  }
});

/**
 * VERDIEN SKAL VÆRE DEN SAMME PÅ BEGGE SIDER AV ENHVER SEKSJON. Det følger
 * av at det bare finnes én verdi — men bare hvis den verdien faktisk er én
 * bunnluft og ikke en blanding.
 */
test("den felles verdien er én bunnluft, mobil og skjerm", () => {
  assert.match(SEKSJONSLUFT, /^pb-\d+ sm:pb-\d+$/);
  assert.equal(SEKSJONSLUFT, "pb-16 sm:pb-24");
});
