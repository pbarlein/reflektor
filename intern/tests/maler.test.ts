import assert from "node:assert/strict";
import test from "node:test";

import { MALER, byggInstruks, malFraSlug } from "../src/content/maler.ts";
import { RUBRIKKER } from "../src/content/rubrikker/index.ts";

/**
 * Malene er data, og data kan være feil på måter typene ikke fanger: to
 * felt med samme id, en rubrikklenke som peker på noe som ikke finnes, en
 * regel som forsvant fra instruksen.
 */
test("slugger er unike og URL-vennlige", () => {
  const sett = new Set<string>();
  for (const m of MALER) {
    assert.match(m.slug, /^[a-z0-9-]+$/, `${m.slug} er ikke URL-vennlig`);
    assert.ok(!sett.has(m.slug), `${m.slug} finnes to ganger`);
    sett.add(m.slug);
    assert.equal(malFraSlug(m.slug)?.navn, m.navn);
  }
});

test("feltnøkler er unike innenfor hver mal", () => {
  for (const m of MALER) {
    const sett = new Set<string>();
    for (const f of m.felt) {
      assert.ok(!sett.has(f.id), `${m.slug}: feltet ${f.id} finnes to ganger`);
      sett.add(f.id);
    }
  }
});

test("valg- og flervalgsfelt har noe å velge mellom", () => {
  for (const m of MALER) {
    for (const f of m.felt) {
      if (f.type === "valg" || f.type === "flervalg") {
        assert.ok(
          f.valg && f.valg.length >= 2,
          `${m.slug}/${f.id} er et valgfelt uten valg`,
        );
      }
      /*
       * En standardverdi som ikke står i lista, gir en <select> som viser
       * noe brukeren ikke kan velge på nytt hvis hen bytter bort fra den.
       */
      if (f.standard && f.type === "valg") {
        assert.ok(
          f.valg?.includes(f.standard),
          `${m.slug}/${f.id}: standard «${f.standard}» står ikke blant valgene`,
        );
      }
    }
  }
});

test("rubrikklenker peker på rubrikker som finnes og er i drift", () => {
  const drift = new Set(
    RUBRIKKER.filter((r) => r.status === "lansert").map((r) => r.slug),
  );
  for (const m of MALER) {
    for (const slug of m.rubrikker ?? []) {
      assert.ok(
        drift.has(slug),
        `${m.slug} lenker til «${slug}», som ikke er i drift`,
      );
    }
  }
});

test("hver mal har et oppdrag, en struktur og minst ett påkrevd felt", () => {
  for (const m of MALER) {
    assert.ok(m.oppdrag.length > 40, `${m.slug}: oppdraget er for tynt`);
    assert.ok(m.struktur.length >= 3, `${m.slug}: strukturen er for tynn`);
    assert.ok(m.skisse.length >= 3, `${m.slug}: skissen er for tynn`);
    assert.ok(
      m.felt.some((f) => f.paakrevd),
      `${m.slug}: ingen felt er påkrevd`,
    );
  }
});

test("instruksen bærer husreglene, også når skjemaet er tomt", () => {
  for (const m of MALER) {
    const tom = byggInstruks(m, {});
    assert.match(tom, /Ikke finn på tall/, `${m.slug} mangler oppdikt-regelen`);
    assert.match(tom, /30 000 kr\/mnd/, `${m.slug} mangler prisregelen`);
    assert.match(tom, /IKKE OPPGITT/, `${m.slug} lister ikke tomme felt`);
    for (const r of m.regler ?? []) {
      assert.ok(tom.includes(r), `${m.slug}: en egen regel falt ut`);
    }
  }
});

test("utfylte verdier havner i instruksen, tomme gjør det ikke", () => {
  const m = malFraSlug("produksjonsplan");
  assert.ok(m);
  const ut = byggInstruks(m, { kunde: "Jordbærpikene", lokasjon: "   " });
  assert.match(ut, /- Kunde: Jordbærpikene/);
  assert.ok(
    !/- Lokasjon: /.test(ut),
    "et felt med bare mellomrom skal telles som tomt",
  );
  assert.match(ut, /IKKE OPPGITT[\s\S]*- Lokasjon/);
});
