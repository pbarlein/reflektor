import assert from "node:assert/strict";
import test from "node:test";

process.env.PAAMINNELSE_HEMMELIGHET = "test-hemmelighet-som-er-lang-nok-xyz";

const { avbrytLenke, gyldigSignatur, signer } = await import(
  "@/lib/avbrytsignatur.ts"
);

test("samme adresse gir samme signatur, uansett skrivemåte", () => {
  assert.equal(signer("Marisol@Example.NO"), signer("  marisol@example.no "));
});

test("en annen adresse gir en annen signatur", () => {
  assert.notEqual(signer("a@example.no"), signer("b@example.no"));
});

/**
 * DEN VIKTIGE: uten gyldig signatur skal ingenting skje. Lenken ligger i en
 * e-post og krever ingen innlogging — uten denne sjekken kunne hvem som
 * helst slått av oppfølgingen for en gjettet adresse.
 */
test("bare riktig signatur godtas", () => {
  const e = "marisol@example.no";
  const s = signer(e)!;
  assert.equal(gyldigSignatur(e, s), true);
  assert.equal(gyldigSignatur("annen@example.no", s), false);
  assert.equal(gyldigSignatur(e, ""), false);
  assert.equal(gyldigSignatur(e, s.slice(0, -1)), false);
  assert.equal(gyldigSignatur(e, s + "a"), false);
  assert.equal(gyldigSignatur(e, signer("annen@example.no")!), false);
});

test("lenken peker på avbrytsiden og bærer begge feltene", () => {
  const u = new URL(avbrytLenke("Marisol@Example.no")!);
  assert.equal(u.pathname, "/paaminnelse/avbryt");
  assert.equal(u.searchParams.get("e"), "marisol@example.no");
  assert.equal(
    gyldigSignatur("marisol@example.no", u.searchParams.get("s") ?? ""),
    true,
  );
});
