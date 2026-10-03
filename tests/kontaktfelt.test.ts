import assert from "node:assert/strict";
import test from "node:test";

import {
  nettsideFraEpost,
  normaliserMobil,
  normaliserNettside,
} from "@/lib/kontaktfelt";

/**
 * Mobilnummer og nettside, lagt til 04.10.2026.
 *
 * Mobilnummeret ble påkrevd fordi Pål ringer leads samme dag. Da må
 * nummeret i varselet være et nummer han kan trykke på, uansett hvordan det
 * ble skrevet inn — og det skrives inn på fem forskjellige måter.
 */

test("norske nummer får fast form, uansett hvordan de skrives", () => {
  for (const inn of [
    "47605070",
    "476 05 070",
    "476-05-070",
    "+4747605070",
    "+47 476 05 070",
    "004747605070",
    "0047 476 05 070",
    " 47 60 50 70 ",
  ]) {
    const s = normaliserMobil(inn);
    assert.ok(s.ok, `«${inn}» ble avvist: ${s.ok ? "" : s.feil}`);
    assert.equal(s.visning, "+47 476 05 070", `fra «${inn}»`);
    assert.equal(s.lenke, "+4747605070", `fra «${inn}»`);
  }
});

test("lenken har ingen mellomrom, visningen har", () => {
  const s = normaliserMobil("96684028");
  assert.ok(s.ok);
  assert.equal(s.visning, "+47 966 84 028");
  assert.equal(s.lenke, "+4796684028");
});

test("utenlandske nummer med landkode godtas som de er", () => {
  const s = normaliserMobil("+46 70 123 45 67");
  assert.ok(s.ok);
  assert.equal(s.lenke, "+46701234567");
});

test("feil nummer gir en feilmelding på norsk, ikke en generell feil", () => {
  for (const inn of ["", "123", "476050", "abcdefgh", "4760507012345678901"]) {
    const s = normaliserMobil(inn);
    assert.equal(s.ok, false, `«${inn}» burde vært avvist`);
    if (!s.ok) {
      assert.ok(s.feil.length > 10, `feilmeldingen for «${inn}» er for kort`);
      assert.ok(/[æøåA-Z]/.test(s.feil), "skal være på norsk");
    }
  }
});

/* ─────────────────────────────── NETTSIDE ─────────────────────────────── */

/**
 * FELTET ER IKKE `type="url"`, og det er grunnen til at denne funksjonen
 * finnes: nettleserens egen validering avviser «dinbedrift.no» fordi den
 * mangler protokoll — altså nøyaktig slik folk skriver en nettside.
 */
test("adresser med og uten protokoll ender likt", () => {
  for (const inn of [
    "reflektor.no",
    "https://reflektor.no",
    "http://reflektor.no",
    "  reflektor.no/  ",
    "REFLEKTOR.NO",
  ]) {
    const s = normaliserNettside(inn);
    assert.ok(s.ok, `«${inn}» ble avvist`);
    assert.equal(s.url, "https://reflektor.no", `fra «${inn}»`);
  }
});

test("http oppgraderes til https", () => {
  const s = normaliserNettside("http://dinbedrift.no/om-oss");
  assert.ok(s.ok);
  assert.ok(s.url.startsWith("https://"));
});

test("www beholdes når det er skrevet", () => {
  const s = normaliserNettside("www.reflektor.no");
  assert.ok(s.ok);
  assert.equal(s.url, "https://www.reflektor.no");
});

test("noe som ikke er en adresse avvises", () => {
  for (const inn of ["bare tekst", "https://", "abc", "@@@"]) {
    assert.equal(normaliserNettside(inn).ok, false, `«${inn}»`);
  }
});

test("tomt felt er ikke en feil", () => {
  const s = normaliserNettside("");
  assert.equal(s.ok, false);
  if (!s.ok) assert.equal(s.feil, "", "tomt felt skal ikke gi feilmelding");
});

/* ────────────────────────── NETTSIDE FRA E-POST ───────────────────────── */

test("bedriftsdomenet brukes når nettsiden mangler", () => {
  assert.equal(
    nettsideFraEpost("marisol@lamexicana.no"),
    "https://lamexicana.no",
  );
  assert.equal(nettsideFraEpost("post@Trenogmat.NO"), "https://trenogmat.no");
});

/**
 * GRATISADRESSER GIR INGEN NETTSIDE. «gmail.com» er ikke kundens nettside,
 * og en lenke dit i varselet ville vært støy Pål måtte lære seg å overse.
 */
test("gratisadresser gir ingen nettside", () => {
  for (const e of [
    "noen@gmail.com",
    "noen@hotmail.com",
    "noen@outlook.com",
    "noen@icloud.com",
    "noen@online.no",
    "noen@yahoo.no",
  ]) {
    assert.equal(nettsideFraEpost(e), null, e);
  }
});

test("søppel inn gir null, ikke en halv adresse", () => {
  for (const e of ["", "ikke-en-epost", "noen@", "@domene.no", "noen@domene"]) {
    assert.equal(nettsideFraEpost(e), null, `«${e}»`);
  }
});
