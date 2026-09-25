import assert from "node:assert/strict";
import test from "node:test";

import { TAK, arkSkjema, deleneI, lesArk, lesSvar } from "../src/content/arktype.ts";
import { MALER, byggRettelse, malFraSlug } from "../src/content/maler.ts";

/**
 * `lesArk` er ikke bare en parser.
 *
 * Det samme arket kommer tilbake FRA KLIENTEN når noen ber om en rettelse,
 * og går inn i en instruks til Claude. Alt som slipper gjennom her, slipper
 * gjennom dit. Testene under er derfor på grensen, ikke på lykketreffet.
 */

const plan = malFraSlug("produksjonsplan");
assert.ok(plan);

test("delene er malens skisse uten toppen", () => {
  for (const m of MALER) {
    const d = deleneI(m);
    assert.ok(!d.includes("topp"), `${m.slug}: toppen er ikke en del`);
    assert.equal(
      d.length,
      m.skisse.length - (m.skisse.includes("topp") ? 1 : 0),
    );
    assert.ok(d.length >= 2, `${m.slug}: for få deler til et dokument`);
  }
});

test("skjemaet tillater bare malens egne deltyper", () => {
  for (const m of MALER) {
    const s = arkSkjema(m) as {
      properties: {
        deler: { items: { properties: { type: { enum: string[] } } } };
      };
    };
    assert.deepEqual(
      s.properties.deler.items.properties.type.enum,
      deleneI(m),
      `${m.slug}: skjemaet lister andre deler enn malen har`,
    );
  }
});

test("en deltype malen ikke har, kastes", () => {
  const ark = lesArk(
    {
      overskrift: "Tittel",
      undertittel: "Under",
      deler: [
        { type: "fakta", poster: [{ etikett: "Sted", verdi: "Storo" }] },
        /* Produksjonsplanen har ingen signaturdel. */
        { type: "signatur", felter: [{ navn: "X", rolle: "Y" }] },
      ],
    },
    plan,
  );
  assert.ok(ark);
  assert.deepEqual(
    ark.deler.map((d) => d.type),
    ["fakta"],
  );
});

test("for lange verdier kappes, de kastes ikke", () => {
  const langt = "x".repeat(2_000);
  const ark = lesArk(
    {
      overskrift: langt,
      undertittel: langt,
      deler: [
        {
          type: "tabell",
          kolonner: ["a", "b", "c", "d", "e", "f"],
          rader: Array.from({ length: 30 }, () => [langt, langt]),
        },
      ],
    },
    malFraSlug("opptaksliste")!,
  );
  assert.ok(ark);
  assert.equal(ark.overskrift.length, TAK.overskrift);
  assert.equal(ark.undertittel.length, TAK.undertittel);
  const d = ark.deler[0];
  assert.equal(d.kolonner?.length, TAK.kolonner);
  assert.equal(d.rader?.length, TAK.rader);
  assert.equal(d.rader?.[0][0].length, TAK.celle);
});

test("uten overskrift eller deler er det ikke et ark", () => {
  assert.equal(lesArk(null, plan), null);
  assert.equal(lesArk("nei", plan), null);
  assert.equal(lesArk({ overskrift: "", deler: [] }, plan), null);
  assert.equal(lesArk({ overskrift: "Tittel", deler: [] }, plan), null);
  assert.equal(
    lesArk({ overskrift: "Tittel", deler: [{ type: "finnes-ikke" }] }, plan),
    null,
  );
});

test("tomme punkter faller ut, de blir ikke tomme kuler", () => {
  const ark = lesArk(
    {
      overskrift: "Tittel",
      deler: [{ type: "liste", punkter: ["Ett", "   ", "", "To"] }],
    },
    malFraSlug("befaringsnotat")!,
  );
  assert.deepEqual(ark?.deler[0].punkter, ["Ett", "To"]);
});

test("rettelsen bærer både dokumentet og endringen", () => {
  const forrige = lesArk(
    {
      overskrift: "Reflektor × Jordbærpikene",
      undertittel: "Torsdag",
      deler: [{ type: "fakta", poster: [{ etikett: "Sted", verdi: "Storo" }] }],
    },
    plan,
  );
  assert.ok(forrige);

  const ut = byggRettelse(
    plan,
    { kunde: "Jordbærpikene" },
    forrige,
    "Slå sammen de to siste radene.",
  );
  assert.match(ut, /DOKUMENTET SLIK DET STÅR NÅ/);
  assert.match(ut, /Reflektor × Jordbærpikene/);
  assert.match(ut, /Slå sammen de to siste radene\./);
  assert.match(ut, /ikke noe mer/);
  /* Husreglene skal gjelde i en rettelse også. */
  assert.match(ut, /skal ALDRI stå i det/);
});

test("instruksen sier hvilke deler malen har, og hvor mye som får plass", () => {
  for (const m of MALER) {
    const ut = byggRettelse(
      m,
      {},
      { overskrift: "T", undertittel: "U", deler: [{ type: deleneI(m)[0] }] },
      "Endre noe.",
    );
    assert.match(ut, /DELENE DU SKAL FYLLE UT/, `${m.slug}`);
    assert.match(ut, /DETTE ER EN ENSIDER/, `${m.slug}`);
    assert.ok(
      ut.includes(`Maks ${TAK.rader} rader`),
      `${m.slug}: takhøyden for rader står ikke i instruksen`,
    );
  }
});

/**
 * ── SVARET TIL PRODUSENTEN ────────────────────────────────────────────────
 *
 * Det kommer i samme verktøykall som dokumentet, fra en modell, og går rett
 * på skjermen. Samme behandling som alt annet som kommer den veien: kappes,
 * og tåler hva som helst.
 */
test("svaret leses og kappes, og tåler søppel", () => {
  const langt = "a".repeat(5000);
  const s = lesSvar({
    beskjed: `  ${langt}  `,
    avklaringer: [" Hvem stiller fra kunden? ", "", 42, null, "b", "c", "d", "e"],
  });

  assert.equal(s.beskjed.length, TAK.beskjed);
  assert.ok(s.avklaringer.length <= TAK.avklaringer);
  assert.equal(s.avklaringer[0], "Hvem stiller fra kunden?");
  assert.ok(
    s.avklaringer.every((a) => a.length > 0),
    "tomme punkter skal ikke bli til tomme kulepunkter på skjermen",
  );
});

test("et manglende eller ugyldig svar er tomt, ikke en feil", () => {
  for (const rått of [null, undefined, 42, "nei", [], {}, { beskjed: 7 }]) {
    const s = lesSvar(rått);
    assert.equal(s.beskjed, "");
    assert.deepEqual(s.avklaringer, []);
  }
});

/**
 * Svaret er til produsenten og skal aldri havne på arket. Sniker det seg inn
 * i `Ark`, blir Reflektors egne avveininger stående i dokumentet kunden får.
 */
test("svaret blir ikke en del av arket", () => {
  const mal = MALER[0];
  const ark = lesArk(
    {
      overskrift: "Tittel",
      undertittel: "Under",
      deler: deleneI(mal).map((type) => ({ type, tittel: "T", tekst: "T" })),
      beskjed: "Jeg tok bort voiceover-seksjonen for å få plass.",
      avklaringer: ["Hvem stiller fra kunden?"],
    },
    mal,
  );
  assert.ok(ark);
  assert.ok(!JSON.stringify(ark).includes("voiceover"));
  assert.ok(!JSON.stringify(ark).includes("Hvem stiller"));
});
