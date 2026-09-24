import assert from "node:assert/strict";
import test from "node:test";

import {
  lesRader,
  publiseringTilTekst,
  rensBrukernavn,
  sammenstill,
} from "../src/lib/supermetrics.ts";

/**
 * ── HVORFOR DENNE FILEN ER SÅ OPPTATT AV FORM ─────────────────────────────
 *
 * Supermetrics-kontrakten er lest i dokumentasjonen og aldri kjørt mot en
 * ekte nøkkel — Reflektors abonnement er Claude-koblingen, ikke API-
 * produktet. Vi vet altså ikke sikkert om svaret kommer som lister eller
 * objekter, eller om det har en hoderad.
 *
 * Det er en grunn til å tåle begge deler, ikke til å la være å teste. Den
 * dagen nøkkelen finnes, skal feilen være «tom liste», ikke en unntaksfeil
 * som tar hele dokumentgenereringen med seg.
 */

test("brukernavn renses til det Supermetrics kan slå opp", () => {
  for (const [inn, ut] of [
    ["@jordbaerpikene", "jordbaerpikene"],
    ["  jordbaerpikene  ", "jordbaerpikene"],
    ["https://www.instagram.com/jordbaerpikene/", "jordbaerpikene"],
    ["instagram.com/jordbaerpikene?hl=nb", "jordbaerpikene"],
    ["", ""],
  ] as const) {
    assert.equal(rensBrukernavn(inn), ut, `«${inn}»`);
  }
});

test("rader leses både som lister og som objekter", () => {
  const somListe = lesRader({
    data: [["2026-09-01", "VIDEO", "Burger", "https://x", 120, 4, 8400]],
  });
  const somObjekt = lesRader({
    data: [
      {
        post_timestamp: "2026-09-01T10:00:00+0000",
        post_type: "VIDEO",
        post_caption: "Burger",
        post_permalink: "https://x",
        post_likes: "120",
        post_comments: "4",
        post_views: "8400",
      },
    ],
  });
  for (const [navn, r] of [
    ["liste", somListe],
    ["objekt", somObjekt],
  ] as const) {
    assert.equal(r.length, 1, navn);
    assert.equal(r[0].format, "Video", navn);
    assert.equal(r[0].likes, 120, navn);
    assert.equal(r[0].visninger, 8400, navn);
    assert.equal(r[0].dato, "2026-09-01", navn);
  }
});

/**
 * Med `no_headers` skal det ikke komme en hoderad. Kommer den likevel,
 * ville den blitt et innlegg med 0 likes og dratt medianen ned.
 */
test("en eventuell hoderad telles ikke som et innlegg", () => {
  const rader = lesRader({
    data: [
      ["post_timestamp", "post_type", "post_caption", "post_permalink"],
      ["2026-09-01", "IMAGE", "Noe", "https://x", 10, 1, null],
    ],
  });
  assert.equal(rader.length, 1);
  assert.equal(rader[0].format, "Bilde");
});

test("uventede svar gir tom liste og ikke et unntak", () => {
  for (const rått of [null, undefined, 42, "nei", {}, { data: "nei" }, []]) {
    assert.deepEqual(lesRader(rått), []);
  }
});

/**
 * ── DETTE ER HELE GRUNNEN TIL AT MEDIAN BLE VALGT ─────────────────────────
 *
 * Nitten videoer under tusen visninger og én på 240 000 gir et snitt på over
 * tolv tusen. En produsent som planlegger en dag mot det tallet, planlegger
 * mot noe som skjedde én gang.
 */
test("én viral video flytter ikke medianen", () => {
  const rader = [
    ...Array.from({ length: 19 }, (_, i) => ({
      dato: "2026-09-01",
      format: "Video" as const,
      tekst: `nr ${i}`,
      lenke: "",
      likes: 10,
      kommentarer: 0,
      visninger: 500,
    })),
    {
      dato: "2026-09-02",
      format: "Video" as const,
      tekst: "den som traff",
      lenke: "",
      likes: 9000,
      kommentarer: 300,
      visninger: 240_000,
    },
  ];
  const konto = sammenstill("test", "Kunden", rader);
  const video = konto.fordeling.find((f) => f.format === "Video");
  assert.equal(video?.antall, 20);
  assert.equal(video?.visninger, 500, "medianen skal ikke dras av utliggeren");
  assert.equal(konto.topp[0].visninger, 240_000, "toppen skal fortsatt vises");
});

test("formatene holdes fra hverandre, og tomme formater utelates", () => {
  const konto = sammenstill("test", "Konkurrent", [
    {
      dato: "2026-09-01",
      format: "Video",
      tekst: "a",
      lenke: "",
      likes: 100,
      kommentarer: 2,
      visninger: 5000,
    },
    {
      dato: "2026-09-02",
      format: "Bilde",
      tekst: "b",
      lenke: "",
      likes: 40,
      kommentarer: 1,
      visninger: null,
    },
  ]);
  assert.deepEqual(
    konto.fordeling.map((f) => f.format),
    ["Video", "Bilde"],
    "karusell har ingen innlegg og skal ikke stå der med nuller",
  );
  assert.equal(
    konto.fordeling.find((f) => f.format === "Bilde")?.visninger,
    null,
    "bilder rapporterer ikke visninger, og da skal det ikke stå 0",
  );
});

/**
 * Tallene er det eneste målte i grunnlaget. Sniker de seg inn i et dokument
 * som ikke ber om tall, står det en Instagram-statistikk i en
 * produksjonsplan.
 */
test("teksten til dokumentet sier fra at tallene er bakgrunn", () => {
  const p = {
    kontoer: [
      sammenstill("kunde", "Kunden" as const, [
        {
          dato: "2026-09-01",
          format: "Video" as const,
          tekst: "a",
          lenke: "",
          likes: 1,
          kommentarer: 0,
          visninger: 2,
        },
      ]),
    ],
    mislyktes: ["borte"],
    fra: "2025-09-24",
    til: "2026-09-24",
  };

  const tilResearch = publiseringTilTekst(p);
  const tilDokument = publiseringTilTekst(p, true);

  assert.ok(!tilResearch.includes("DETTE ER BAKGRUNN"));
  assert.ok(tilDokument.includes("DETTE ER BAKGRUNN"));
  for (const t of [tilResearch, tilDokument]) {
    assert.match(t, /MEDIANEN ER TALLET SOM BETYR NOE/);
    assert.match(t, /@borte/, "et hull skal vises, ikke ties i hjel");
  }
});
