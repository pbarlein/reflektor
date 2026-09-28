import assert from "node:assert/strict";
import test from "node:test";

import { SKJEMA, lesRapport } from "../src/content/rapporttype.ts";
import {
  type Brukersvar,
  byggMarkdown,
  filnavn,
} from "../src/lib/rapportmarkdown.ts";

/**
 * Filen Pål laster ned og legger i Claude-prosjektet.
 *
 * Den leses av en språkmodell som skal resonnere om tallene. Da er det to
 * ting som faktisk kan gjøre skade: et tall som er feil, og et tall som
 * ser ekte ut uten å være det. Testene her handler om begge.
 */

/** En gyldig rapport, bygget gjennom den ekte leseren. */
function rapport(over: Record<string, unknown> = {}) {
  const l = lesRapport({
    schema: SKJEMA,
    type: "marked",
    id: "2026-w39",
    year: 2026,
    week: 39,
    period: {
      from: "2026-09-22",
      to: "2026-09-28",
      label: "22.–28. september",
    },
    generated_at: "2026-09-29T05:00:00Z",
    verdict: { level: "act", label: "Handle", short: "Prisen per lead stiger" },
    subject: "Betalt markedsføring",
    headline: "Fire uker på rad over grensen.",
    kpis: {
      cpl_4w: {
        weeks: [36, 37, 38, 39],
        spend: 48000,
        leads: 20,
        cpl: 2400,
        change_pct: 12,
        limit: 2000,
      },
      leads_week: { value: 5, meta: 3, google: 2 },
      customers_90d: {
        count: 2,
        spend: 96000,
        names: ["Kunde A"],
        cost_per_customer: 48000,
      },
      spend_week: { value: 12000, meta: 7000, google: 5000, change_pct: -4 },
    },
    insights: ["Frekvensen på den eldste annonsen er over fire."],
    steps: [
      {
        title: "Skru av annonsen med høyest frekvens.",
        detail: "",
        owner: "Pål",
        due: "2026-10-02",
        due_label: "fredag 2. oktober",
      },
      {
        title: "Be om ny video.",
        detail: "Tre varianter.",
        owner: "Pål",
        due: "",
        due_label: "",
      },
    ],
    footer: "Laget av rapport_mal.py",
    ...over,
  });
  assert.equal(
    l.ok,
    true,
    `fikseringen er ugyldig: ${!l.ok ? l.feil.join(" ") : ""}`,
  );
  return l.ok ? l.rapport : never();
}
function never(): never {
  throw new Error("uoppnåelig");
}

const TOMT: Brukersvar = {
  mottatt: "2026-09-29T05:02:00Z",
  beslutning: null,
  gjorteSteg: [],
  notater: [],
};

const NAA = new Date("2026-09-29T09:00:00Z");

test("filen åpner med tittel, nedlastingstidspunkt og forordet", () => {
  const md = byggMarkdown([{ rapport: rapport(), svar: TOMT }], NAA);
  assert.match(md, /^# Reflektor — markedsrapport uke 39, 2026\n/);
  assert.match(md, /Lastet ned fra intranettet/);
  assert.match(md, /## Om denne filen/);
  /* Forordet må si hva KPI-en er; uten den er tallene uten målestokk. */
  assert.match(md, /skjemaleads/);
});

/**
 * Den viktigste testen i fila.
 *
 * `rapportformat.ts` setter hardt mellomrom inne i beløp, så «2 000 kr»
 * ikke brekker over to linjer på en skjerm. I en tekstfil er det et tegn
 * som ser ut som mellomrom uten å være det: søk og klipp-og-lim slutter å
 * virke, og den som leser filen ser ingenting galt.
 */
test("ingen harde mellomrom slipper ut i filen", () => {
  const md = byggMarkdown([{ rapport: rapport(), svar: TOMT }], NAA);
  assert.equal(md.includes(" "), false, "fant hardt mellomrom");
  assert.match(md, /48 000 kr/, "beløpet skal fortsatt ha tusenskille");
});

test("tallene fra rapporten står i filen, uendret", () => {
  const md = byggMarkdown([{ rapport: rapport(), svar: TOMT }], NAA);
  assert.match(md, /2 400 kr/, "pris per lead");
  assert.match(md, /grense 2 000 kr/);
  assert.match(md, /\+12 %/, "endringen med fortegn");
  assert.match(md, /Leads denne uka:\*\* 5 \(Meta 3, Google 2\)/);
  assert.match(md, /Kundene: Kunde A/);
});

test("avkryssing og svar er Påls, og vises som hans", () => {
  const md = byggMarkdown(
    [
      {
        rapport: rapport({
          decision: {
            question: "Skal vi bestille ny video?",
            recommendation: "Ja.",
            cost_nok: 30000,
            deadline_label: "fredag",
            if_nothing: "Frekvensen fortsetter å stige.",
          },
        }),
        svar: {
          ...TOMT,
          beslutning: {
            svar: "ja",
            kommentar: "Bestilt.",
            tidspunkt: "2026-09-29T07:10:00Z",
          },
          gjorteSteg: [{ indeks: 0, tidspunkt: "2026-09-29T07:12:00Z" }],
          notater: [
            { tekst: "Snakket med Meta.", tidspunkt: "2026-09-29T07:20:00Z" },
          ],
        },
      },
    ],
    NAA,
  );
  assert.match(md, /- \[x\] \*\*Skru av annonsen med høyest frekvens\.\*\*/);
  assert.match(md, /- \[ \] \*\*Be om ny video\.\*\*/);
  assert.match(md, /Pål svarte «ja»/);
  assert.match(md, /Kommentar: Bestilt\./);
  assert.match(md, /Snakket med Meta\./);
});

test("en ubesvart beslutning står som ubesvart", () => {
  const md = byggMarkdown(
    [
      {
        rapport: rapport({
          decision: {
            question: "Skal vi?",
            recommendation: "Ja.",
            cost_nok: null,
            deadline_label: "",
            if_nothing: "",
          },
        }),
        svar: TOMT,
      },
    ],
    NAA,
  );
  assert.match(md, /\*\*Ubesvart\.\*\*/);
});

/**
 * Testdata er den ene feilen som ikke kan oppdages i etterkant: leser man
 * filen om tre måneder, ser oppdiktede tall nøyaktig ut som ekte tall.
 */
test("en testrapport roper det ut, både i filen og i filnavnet", () => {
  const r = { rapport: rapport({ test: true }), svar: TOMT };
  const md = byggMarkdown([r], NAA);
  assert.match(md, /\*\*TESTDATA\.\*\*/);
  assert.match(filnavn([r], NAA), /-TESTDATA\.md$/);
});

test("filnavnet sier uke og år for én, og dato for flere", () => {
  const en = [{ rapport: rapport(), svar: TOMT }];
  assert.equal(filnavn(en, NAA), "reflektor-markedsrapport-uke-39-2026.md");
  assert.equal(
    filnavn([...en, ...en], NAA),
    "reflektor-markedsrapporter-2026-09-29.md",
  );
  /* Kun ASCII: æøå i Content-Disposition må kodes, og nettleserne er uenige. */
  for (const navn of [filnavn(en, NAA), filnavn([...en, ...en], NAA)]) {
    assert.match(navn, /^[\x20-\x7e]+$/, `${navn} er ikke ren ASCII`);
  }
});

/**
 * Et rørtegn i et kundenavn eller et annonsenavn deler tabellraden i to, og
 * da flytter alle tallene til høyre for det seg én kolonne. Navnene kommer
 * fra Meta og Google, ikke fra oss.
 */
test("et rørtegn i et annonsenavn ødelegger ikke tabellen", () => {
  const md = byggMarkdown(
    [
      {
        rapport: rapport({
          ads: [
            {
              platform: "Meta",
              campaign: "Leads | Q4",
              ad: "Video A",
              on: true,
              cost_week: 5000,
              impressions_week: 40000,
              frequency_week: 4.2,
              leads_week: 3,
              monthly: [],
            },
          ],
        }),
        svar: TOMT,
      },
    ],
    NAA,
  );
  const rader = md.split("\n").filter((l) => l.startsWith("| Meta"));
  assert.equal(rader.length, 1);
  /*
   * Kun de UESCAPEDE rørtegnene deler celler. Teller man alle, teller man
   * med det escapede, og da beviser testen det motsatte av det den skal.
   */
  assert.equal(
    rader[0].split(/(?<!\\)\|/).length - 1,
    9,
    `raden har feil antall celler: ${rader[0]}`,
  );
  assert.match(rader[0], /Leads \\\| Q4/);
});

test("flere rapporter får oversiktstabell og overskriftsnivå to", () => {
  const md = byggMarkdown(
    [
      { rapport: rapport(), svar: TOMT },
      { rapport: rapport({ id: "2026-w38", week: 38 }), svar: TOMT },
    ],
    NAA,
  );
  assert.match(md, /^# Reflektor — markedsrapporter, 2 uker\n/);
  assert.match(md, /## Ukene i korthet/);
  assert.match(md, /^## Uke 39, 2026 — /m);
  assert.match(md, /^## Uke 38, 2026 — /m);
  assert.equal(
    md.split("\n").filter((l) => l.startsWith("# ")).length,
    1,
    "kun filens egen tittel skal være nivå én",
  );
});

test("null rapporter gir en fil som sier det, ikke en tom fil", () => {
  const md = byggMarkdown([], NAA);
  assert.match(md, /Ingen rapporter å laste ned ennå/);
  assert.ok(md.endsWith("\n"));
});
