import assert from "node:assert/strict";
import test from "node:test";

import {
  TAK,
  arkSkjema,
  delforklaring,
  deleneI,
  lesArk,
  lesSvar,
  takFor,
} from "../src/content/arktype.ts";
import { MALER, byggRettelse, malFraSlug } from "../src/content/maler.ts";
import type { Mal } from "../src/content/maltype.ts";

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
        { type: "liste", punkter: ["Oktober: to dager."] },
        /* Produksjonsplanen har ingen signaturdel. */
        { type: "signatur", felter: [{ navn: "X", rolle: "Y" }] },
      ],
    },
    plan,
  );
  assert.ok(ark);
  assert.deepEqual(
    ark.deler.map((d) => d.type),
    ["liste"],
  );
});

function stortAark(mal: Mal) {
  const langt = "x".repeat(2_000);
  return lesArk(
    {
      overskrift: langt,
      undertittel: langt,
      deler: [
        {
          type: "tabell",
          kolonner: Array.from({ length: 12 }, (_, i) => `k${i}`),
          rader: Array.from({ length: 30 }, () =>
            Array.from({ length: 12 }, () => langt),
          ),
        },
      ],
    },
    mal,
  );
}

test("for lange verdier kappes, de kastes ikke", () => {
  const mal = malFraSlug("publiseringsplan")!;
  const ark = stortAark(mal);
  assert.ok(ark);
  assert.equal(ark.overskrift.length, TAK.overskrift);
  assert.equal(ark.undertittel.length, TAK.undertittel);
  const d = ark.deler[0];
  assert.equal(d.kolonner?.length, TAK.kolonner);
  assert.equal(d.rader?.length, TAK.rader);
  assert.equal(d.rader?.[0][0].length, TAK.celle);
});

/**
 * Taket er malens, ikke husets.
 *
 * Opptakslisten ba om åtte kolonner og ti opptak og fikk fire og sju. Fire
 * av seks opplysninger per opptak ble kastet uten et ord, i en mal som selv
 * sier «mangler ett, er listen ikke ferdig». Se `Maltak`.
 */
/**
 * Taket var 12×8 for opptakslisten fram til 01.10.2026. Den står ikke
 * lenger i planen — se kommentaren over malen. Tidsplanen trenger ni rader
 * for en dag fra 09 til 15, og standarden på sju holder ikke.
 *
 * Poenget med testen er uendret: det malen ber om, skal komme helt gjennom
 * valideringen. Det var her fire av åtte kolonner ble kastet i stillhet.
 */
test("en mal med eget tak beholder det den faktisk trenger", () => {
  const mal = malFraSlug("produksjonsplan")!;
  const t = takFor(mal);
  assert.equal(t.kolonner, 3, "Når, Hva, Hvem");
  assert.equal(t.rader, 9, "rigg, blokkene, pause og nedrigg");
  assert.ok(
    t.rader > TAK.rader,
    "malen hever standarden, ellers er taket dødt",
  );

  const ark = stortAark(mal);
  assert.ok(ark);
  const d = ark.deler.find((x) => x.type === "tabell");
  assert.ok(d, "fant ingen tabell i det store arket");
  assert.equal(d.kolonner?.length, 3);
  assert.equal(d.rader?.length, 9);
  assert.equal(d.rader?.[0].length, 3, "hele raden overlever, ikke halve");
});

/** Det modellen får vite, må være det samme som valideringen håndhever. */
test("instruksen oppgir malens eget tak, ikke standarden", () => {
  const ut = delforklaring(malFraSlug("produksjonsplan")!);
  assert.match(ut, /«kolonner» \(3 maks\)/);
  assert.match(ut, /«rader» \(9 maks\)/);

  const vanlig = delforklaring(malFraSlug("publiseringsplan")!);
  assert.match(vanlig, new RegExp(`«kolonner» \\(${TAK.kolonner} maks\\)`));
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
      hode: ["Torsdag 8. oktober 2026", "Sted: Storo"],
      deler: [
        {
          type: "tabell",
          kolonner: ["Når", "Hva", "Hvem"],
          rader: [["09.00", "Vi rigger", ""]],
        },
      ],
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
    /*
     * Produksjonsplanen er ikke en ensider — den bærer både kundens plan og
     * opptakslisten. Plassregelen gjelder likevel, med en annen overskrift.
     */
    assert.match(
      ut,
      /DETTE ER EN ENSIDER|HVER DEL SKAL VÆRE KOMPLETT/,
      `${m.slug}`,
    );
    /* Tallet som står i instruksen må være malens eget, ikke husets. */
    assert.ok(
      ut.includes(`Maks ${takFor(m).rader} rader`),
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
    avklaringer: [
      " Hvem stiller fra kunden? ",
      "",
      42,
      null,
      "b",
      "c",
      "d",
      "e",
    ],
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
