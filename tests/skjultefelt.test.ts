import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * DE SKJULTE FELTENE I KONTAKTSKJEMAET MÅ VÆRE KONTROLLERT AV REACT.
 *
 * BAKGRUNNEN ER EN EKTE FEIL, 03.–04.10.2026. `lastet` og `kilde` fikk
 * verdiene sine satt imperativt i en effekt — `ref.current.value = …` — på
 * felt som ellers bare hadde `defaultValue`. Det virket i ukevis, helt til
 * knappen fikk en «Sender …»-tilstand. Den tilstanden utløser en ny render
 * MIDT I INNSENDINGEN, og React setter da et ukontrollert felt tilbake til
 * `defaultValue`: en verdi React ikke selv har skrevet, kjenner den ikke.
 *
 * Målt på live: rett før klikket sto riktig kilde i feltet, og i `FormData`
 * ved innsending sto `kilde=""` — på samme DOM-node. Resultatet var at
 * HubSpot sluttet å få vite hvilken annonse leadene kom fra, og at
 * bot-tidsstempelet alltid var null. Ingenting feilet synlig: e-posten kom,
 * leadet kom, bare kilden var borte.
 *
 * TESTEN LESER KILDEKODEN og ikke DOM-en, fordi komponenten er `.tsx` og
 * ikke kan importeres av Nodes typefjerning. Den er grov med vilje: den
 * fanger nøyaktig mønsteret som forsvant stille sist.
 */

const kilde = readFileSync(
  new URL("../src/components/Kontaktskjema.tsx", import.meta.url),
  "utf8",
);

test("de skjulte feltene rendres med value, ikke defaultValue", () => {
  for (const navn of ["lastet", "side", "kilde"]) {
    const linje = kilde
      .split("\n")
      .find((l) => l.includes(`name="${navn}"`) && l.includes('type="hidden"'));
    assert.ok(linje, `fant ikke det skjulte feltet «${navn}»`);
    assert.ok(
      linje.includes("value={"),
      `«${navn}» må rendres med value={…} så React styrer verdien`,
    );
    assert.ok(
      !linje.includes("defaultValue"),
      `«${navn}» må ikke bruke defaultValue — verdien overlever ikke en ` +
        "render under innsending",
    );
    assert.ok(
      !linje.includes("ref={"),
      `«${navn}» skal ikke settes via en ref`,
    );
  }
});

test("ingen verdier settes direkte på skjemafeltenes DOM-noder", () => {
  // Kommentarene får nevne mønsteret — det er nettopp der det forklares.
  const kode = kilde
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  assert.ok(
    !/\.current\.value\s*=/.test(kode),
    "En verdi satt direkte på DOM-noden blir nullstilt av neste render. " +
      "Bruk React-tilstand.",
  );
});
