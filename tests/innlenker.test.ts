import assert from "node:assert/strict";
import { test } from "node:test";

import { artikler, delOppAvsnitt } from "@/content/artikler";

/**
 * Vakt på lenkene inne i bloggavsnittene.
 *
 * `delOppAvsnitt` kaster på en frase som ikke står i teksten, eller står to
 * ganger. Den kjører ved rendring, altså i byggen — men bare for artikler
 * som faktisk bygges. Denne testen kjører den over ALLE avsnitt, slik at en
 * feil fanges før den rekker å bli en byggefeil i CI.
 *
 * Den fanger også det ene tilfellet ingen ville sett: at noen retter en
 * skrivefeil i brødteksten og dermed river frasen lenken hang på.
 */
test("alle innlenker peker på ord som faktisk står i avsnittet", () => {
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (b.type !== "avsnitt" || !b.lenker) continue;
      assert.doesNotThrow(
        () => delOppAvsnitt(b.tekst, b.lenker),
        `${a.slug}: ${b.tekst.slice(0, 60)}`,
      );
    }
  }
});

test("innlenkene peker bare på egne sider", () => {
  const utenfor: string[] = [];
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (b.type !== "avsnitt" || !b.lenker) continue;
      for (const l of b.lenker) {
        if (!l.sti.startsWith("/")) utenfor.push(`${a.slug}: ${l.sti}`);
      }
    }
  }
  // Utgående lenker hører i `kilde`-blokker, som har target og rel satt.
  assert.deepEqual(utenfor, []);
});

test("ingen artikkel lenker til seg selv", () => {
  const selv: string[] = [];
  for (const a of artikler) {
    for (const b of a.blokker) {
      if (b.type !== "avsnitt" || !b.lenker) continue;
      for (const l of b.lenker) {
        if (l.sti === `/blogg/${a.slug}`) selv.push(a.slug);
      }
    }
  }
  assert.deepEqual(selv, []);
});

test("delOppAvsnitt kaster på frase som ikke finnes, og på dobbel frase", () => {
  assert.throws(() =>
    delOppAvsnitt("Kort tekst.", [{ frase: "finnes ikke", sti: "/" }]),
  );
  assert.throws(() =>
    delOppAvsnitt("pris og pris", [{ frase: "pris", sti: "/" }]),
  );
});

test("delOppAvsnitt kaster på overlappende fraser", () => {
  assert.throws(() =>
    delOppAvsnitt("foto og videoproduksjon her", [
      { frase: "og videoproduksjon", sti: "/a" },
      { frase: "videoproduksjon her", sti: "/b" },
    ]),
  );
});

test("delOppAvsnitt bevarer teksten ordrett", () => {
  const tekst = "Reflektor tar hele jobben for 30 000 kr/mnd. Les mer.";
  const deler = delOppAvsnitt(tekst, [
    { frase: "30 000 kr/mnd", sti: "/#pris" },
  ]);
  const satt = deler.map((d) => (typeof d === "string" ? d : d.frase)).join("");
  assert.equal(satt, tekst);
});
