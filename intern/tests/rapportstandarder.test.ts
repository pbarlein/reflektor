import assert from "node:assert/strict";
import test from "node:test";

import { type Rapport, medStandarder } from "../src/content/rapporttype.ts";

/**
 * Feilen denne filen finnes for.
 *
 * 28.09.2026 ble mal v2.1-feltene lagt til i `Rapport`. Alle fire
 * rapportene i butikken begynte å svare 500 med «Cannot read properties of
 * undefined (reading 'value')». Typesjekken var grønn hele veien.
 *
 * Grunnen: `lesRapport` kjører ved MOTTAK, og den validerte rapporten
 * skrives til Blob. Utvider man typen, lyver den om alt som allerede er
 * lagret — kompilatoren tror feltet finnes, og skjermen faller.
 *
 * Testene her kjører mot formen en rapport HAR i butikken, ikke mot formen
 * typen påstår. Derfor `as unknown as Rapport`: det er hele poenget at
 * objektet ikke oppfyller typen.
 */

/** En rapport slik den ble lagret før v2.1. */
function gammel(): Rapport {
  return {
    schema: "reflektor.report.v1",
    type: "betalt-markedsforing",
    id: "betalt-markedsforing-2026-W38",
    year: 2026,
    week: 38,
    period: { from: "2026-09-11", to: "2026-09-17", label: "11.–17. sept." },
    generated_at: "2026-09-17T05:46:00Z",
    verdict: { level: "act", label: "HANDLING KREVES", short: "Ett lead" },
    subject: "Uke 38",
    headline: "Ett lead på to uker.",
    decision: null,
    kpis: {
      cpl_4w: {
        weeks: [35, 36, 37, 38],
        spend: 27359,
        leads: 3,
        cpl: 9120,
        change_pct: 223,
        limit: 2000,
      },
      leads_week: { value: 1, meta: 0, google: 1 },
      /* Ingen `by_channel` — feltet fantes ikke. */
      customers_90d: {
        count: 3,
        spend: 98000,
        names: ["Happis"],
        cost_per_customer: 32667,
      },
      /* Ingen `other_spend_4w`, ingen `google_cpc_4w`. */
      spend_week: { value: 4459, meta: 400, google: 4059, change_pct: -30 },
    },
    alert: { active: true, reasons: ["Over grensen."], text: "" },
    quiet: false,
    status: [],
    /* Uker uten `meta_other_cost`, `g_clicks` og `g_cpc`. */
    weeks: [
      {
        w: 38,
        meta_cost: 400,
        meta_leads: 0,
        g_cost: 4059,
        g_leads: 1,
        cost: 4459,
        leads: 1,
        cpl: 4459,
      },
    ],
    /* Annonser uten `ad_id`. */
    ads: [
      {
        platform: "meta",
        campaign: "Leads",
        ad: "Sommervideo",
        on: true,
        cost_week: 400,
        impressions_week: 900,
        frequency_week: 4.2,
        leads_week: 0,
        monthly: [],
      },
    ],
    hubspot: {
      new_contacts: 0,
      sources: {},
      paid_social_customers_total: 3,
      paid_social_customers_new_week: 0,
    },
    insights: ["Ett lead."],
    /* Ingen `changes`, ingen `unexplained`. */
    steps: [],
    previous_steps: [],
    data_gaps: [],
    sources: {},
    footer: "Kilder …",
    test: false,
  } as unknown as Rapport;
}

/**
 * Den ene testen som ville ha fanget 500-feilen. Hvert uttrykk her er et
 * sted en skjerm faktisk leser, og som var `undefined` i butikken.
 */
test("en rapport fra før v2.1 kan leses uten å falle", () => {
  const r = medStandarder(gammel());

  assert.equal(r.kpis.google_cpc_4w.value, null, "skjermen leser .value");
  assert.equal(r.kpis.google_cpc_4w.change_pct, null);
  assert.equal(r.kpis.other_spend_4w, 0);
  assert.deepEqual(r.kpis.customers_90d.by_channel, []);
  assert.deepEqual(r.changes, []);
  assert.deepEqual(r.unexplained, []);
  assert.equal(r.weeks[0].meta_other_cost, 0);
  assert.equal(r.weeks[0].g_clicks, null);
  assert.equal(r.weeks[0].g_cpc, null);
  assert.equal(r.ads[0].ad_id, "");
});

test("det som allerede står, røres ikke", () => {
  const r = medStandarder(gammel());
  assert.equal(r.kpis.cpl_4w.cpl, 9120);
  assert.equal(r.kpis.customers_90d.count, 3);
  assert.equal(r.weeks[0].meta_cost, 400);
  assert.equal(r.ads[0].ad, "Sommervideo");
  assert.equal(r.headline, "Ett lead på to uker.");
});

/**
 * En v2.1-rapport skal komme uendret ut. Ville normaliseringen nullet et
 * felt som var satt, hadde den vært verre enn feilen den retter.
 */
test("en v2.1-rapport går uendret gjennom", () => {
  const ny = {
    ...gammel(),
    kpis: {
      ...gammel().kpis,
      other_spend_4w: 1200,
      google_cpc_4w: { value: 38, prev: 21, change_pct: 81 },
      customers_90d: {
        ...gammel().kpis.customers_90d,
        by_channel: [
          {
            channel: "meta",
            name: "Meta",
            count: 3,
            spend: 52000,
            names: [],
            cost_per_customer: 17333,
          },
        ],
      },
    },
    weeks: [
      { ...gammel().weeks[0], meta_other_cost: 600, g_clicks: 105, g_cpc: 39 },
    ],
    ads: [{ ...gammel().ads[0], ad_id: "120219" }],
    changes: [
      {
        date: "2026-08-31",
        date_label: "31.8.",
        platform: "google",
        platform_name: "Google",
        what: "Byttet budstrategi.",
        effect: "",
      },
    ],
    unexplained: ["Klikkprisen har økt."],
  } as Rapport;

  assert.deepEqual(medStandarder(ny), ny);
});

/**
 * Normaliseringen skriver ikke i objektet den fikk. Rapporten kan komme
 * fra en delt hurtigbuffer, og en mutasjon der ville spredt seg.
 */
test("rapporten som sendes inn endres ikke", () => {
  const inn = gammel();
  const kopi = JSON.parse(JSON.stringify(inn));
  medStandarder(inn);
  assert.deepEqual(JSON.parse(JSON.stringify(inn)), kopi);
});
