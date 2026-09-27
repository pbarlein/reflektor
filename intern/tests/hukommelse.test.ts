import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * ── HVORFOR EN TEST LESER KILDEKODE ───────────────────────────────────────
 *
 * Hukommelsen sto tom fra dagen den ble bygget, og ingen test fanget det.
 * Den kunne ikke det heller: koden var riktig, API-bruken var riktig, og
 * hver enkelt funksjon gjorde jobben sin når den ble kalt. Feilen var NÅR
 * den ble kalt — `void husKunde(...)` rett etter at svarstrømmen var lukket.
 * Vercel fryser funksjonen i det svaret er ferdig, og løftet ble revet med
 * midt i et TLS-håndtrykk.
 *
 * Det er ikke noe en enhetstest kan se. Den som kunne sett det, måtte kjørt
 * mot ekte lagring på ekte Vercel, og den testen har vi ikke.
 *
 * Dette er det nest beste: en vakt mot mønsteret. Den beviser ingenting om
 * at lagringen virker — den hindrer at nettopp denne feilen kommer tilbake
 * uten at noen legger merke til det.
 */

const RUTE = readFileSync(
  new URL("../src/app/api/dokument/route.ts", import.meta.url),
  "utf8",
);

test("hukommelsen skrives ikke med void etter at svaret er sendt", () => {
  /* Kommentarer får nevne mønsteret — det er der historien står forklart. */
  const kode = RUTE.split("\n")
    .filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("//"))
    .join("\n");

  for (const kall of ["husKunde", "husRettelse"]) {
    assert.ok(
      !new RegExp(`void\\s+${kall}\\s*\\(`).test(kode),
      `${kall} kalles med void. Etter at strømmen er lukket, fryser Vercel funksjonen og løftet dør midt i tilkoblingen — legg jobben i etterpaa-køen i stedet.`,
    );
  }
});

test("etterarbeidet planlegges med after, som holder funksjonen i live", () => {
  assert.match(
    RUTE,
    /import \{[^}]*\bafter\b[^}]*\} from "next\/server"/,
    "after importeres ikke",
  );
  assert.match(RUTE, /after\(async \(\) => \{/, "after brukes ikke");
  assert.match(
    RUTE,
    /etterpaa\.push\(/,
    "ingenting legges i køen, og da har after ingenting å gjøre",
  );
});
