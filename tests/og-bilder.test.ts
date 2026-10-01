import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { artikler } from "@/content/artikler";
import { kundecaser } from "@/content/caser";

/**
 * Vakt mot delingsbilder som har glidd fra motivet sitt.
 *
 * Artiklene og casene har hvert sitt og:image, beskåret fra toppbildet av
 * `scripts/og-bilder.ts`. Det som kan gå galt er stille:
 *
 *   1. En ny artikkel får ingen fil, og kortet faller tilbake på
 *      merkevarebildet uten at noe sier fra.
 *   2. Et toppbilde byttes, og delingsbildet blir stående med det gamle
 *      motivet. Filen finnes jo — bare med feil innhold i.
 *
 * Nummer to er den farlige, og den er grunnen til `kilder.json`: skriptet
 * noterer hvilket motiv og hvilket fokuspunkt hver fil faktisk ble laget
 * fra. Datostempler ville ikke duget — et git-utsjekk gir alle filer samme
 * tid, så en test på «nyere enn kilden» ville vært grønn uansett.
 */
const MAPPE = join(process.cwd(), "public/bilder/og");

const forventet = Object.fromEntries([
  ...artikler.map((a) => [
    `blogg-${a.slug}`,
    { kilde: a.bilde.fil, fokus: a.bilde.fokus },
  ]),
  ...kundecaser.map((k) => [
    `case-${k.slug}`,
    { kilde: k.kortbilder[0]!.fil, fokus: k.kortbilder[0]!.fokus },
  ]),
]);

test("hver artikkel og hvert case har et delingsbilde", () => {
  const mangler = Object.keys(forventet).filter(
    (navn) => !existsSync(join(MAPPE, `${navn}.jpg`)),
  );
  assert.deepEqual(
    mangler,
    [],
    "Kjør: FFMPEG=<sti> node --experimental-strip-types --import ./tests/alias.mjs scripts/og-bilder.ts",
  );
});

test("delingsbildene er laget fra motivene som står i innholdet nå", () => {
  const fasit = JSON.parse(readFileSync(join(MAPPE, "kilder.json"), "utf8"));
  assert.deepEqual(
    JSON.parse(JSON.stringify(fasit)),
    JSON.parse(JSON.stringify(forventet)),
    "Et toppbilde eller fokuspunkt er endret uten at delingsbildet er laget på nytt.",
  );
});

/**
 * 1200×630 er formatet Facebook, LinkedIn, X og Slack alle leser. Leses ut
 * av JPEG-hodet i stedet for å stoles på: skriptet kan ha blitt kjørt med
 * en ffmpeg som gjorde noe annet enn vi tror.
 */
function jpegMal(fil: string): { bredde: number; hoyde: number } | null {
  const d = readFileSync(fil);
  let i = 2;
  while (i < d.length - 9) {
    if (d[i] !== 0xff) {
      i++;
      continue;
    }
    const m = d[i + 1]!;
    if (m === 0xc0 || m === 0xc1 || m === 0xc2) {
      return { hoyde: d.readUInt16BE(i + 5), bredde: d.readUInt16BE(i + 7) };
    }
    if (m === 0x01 || (m >= 0xd0 && m <= 0xd9)) {
      i += 2;
      continue;
    }
    i += 2 + d.readUInt16BE(i + 2);
  }
  return null;
}

test("delingsbildene er 1200×630", () => {
  const feil = Object.keys(forventet)
    .map((navn) => ({ navn, mal: jpegMal(join(MAPPE, `${navn}.jpg`)) }))
    .filter(({ mal }) => mal?.bredde !== 1200 || mal?.hoyde !== 630)
    .map(({ navn, mal }) => `${navn}: ${mal?.bredde}×${mal?.hoyde}`);
  assert.deepEqual(feil, []);
});
