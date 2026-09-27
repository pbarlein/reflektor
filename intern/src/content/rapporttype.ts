/**
 * Rapportformatet `reflektor.report.v1`.
 *
 * ── HVEM EIER SANNHETEN ───────────────────────────────────────────────────
 *
 * Ikke intranettet. Den planlagte oppgaven kjører `rapport_mal.py`, og DEN
 * regner ut pris per lead, dommen og varselet. Vi viser og visualiserer,
 * og regner aldri ut en egen variant av et tall som allerede står i
 * payloaden.
 *
 * Grunnen er enkel: to steder som regner det samme, blir før eller siden
 * uenige, og da er det ingen som vet hvilket tall som gjelder. Trenger en
 * graf et avledet tall — for eksempel firewukerssnittet per uke — brukes
 * samme formel som malen: sum forbruk delt på sum leads over vinduet.
 *
 * ── HELE PAYLOADEN LAGRES, IKKE BARE DET VI FORSTÅR ───────────────────────
 *
 * Feltene under er de vi leser i dag. Kommer det nye med en senere versjon
 * av malen, skal de overleve lagringen selv om ingen skjerm viser dem
 * ennå. Derfor validerer vi det påkrevde og bærer resten uendret videre.
 */

export type Domnivaa = "act" | "watch" | "ok";

export type Periode = { from: string; to: string; label: string };

export type Dom = { level: Domnivaa; label: string; short: string };

export type Beslutning = {
  question: string;
  recommendation: string;
  cost_nok: number | null;
  deadline_label: string;
  if_nothing: string;
};

export type Vindu = {
  weeks: number[];
  spend: number;
  leads: number;
  cpl: number | null;
  complete?: boolean;
};

export type Nokkeltall = {
  cpl_4w: Vindu & { prev?: Vindu; change_pct: number | null; limit: number };
  leads_week: { value: number; meta: number; google: number };
  customers_90d: {
    count: number;
    spend: number;
    names: string[];
    cost_per_customer: number | null;
  };
  spend_week: {
    value: number;
    meta: number;
    google: number;
    change_pct: number | null;
  };
};

export type Uke = {
  w: number;
  meta_cost: number;
  meta_leads: number;
  g_cost: number;
  g_leads: number;
  cost: number;
  leads: number;
  cpl: number | null;
};

export type Annonse = {
  platform: string;
  campaign: string;
  ad: string;
  on: boolean;
  cost_week: number;
  impressions_week: number;
  frequency_week: number | null;
  leads_week: number;
  monthly: { month: string; cost: number; leads: number }[];
};

export type Kanalstatus = {
  channel: string;
  name: string;
  on: boolean;
  text: string;
};

export type Steg = {
  title: string;
  detail: string;
  owner: string;
  due: string;
  due_label: string;
};

export type Forrigesteg = {
  title: string;
  status: "done" | "not_done" | "unknown";
  evidence: string;
};

export type Rapport = {
  schema: string;
  type: string;
  id: string;
  year: number;
  week: number;
  period: Periode;
  generated_at: string;
  verdict: Dom;
  subject: string;
  headline: string;
  decision: Beslutning | null;
  kpis: Nokkeltall;
  alert: { active: boolean; reasons: string[]; text: string };
  quiet: boolean;
  status: Kanalstatus[];
  weeks: Uke[];
  ads: Annonse[];
  hubspot: {
    new_contacts: number;
    sources: Record<string, number>;
    paid_social_customers_total: number;
    paid_social_customers_new_week: number;
  };
  insights: string[];
  steps: Steg[];
  previous_steps: Forrigesteg[];
  data_gaps: string[];
  sources: Record<string, string>;
  footer: string;
  test: boolean;
};

export const SKJEMA = "reflektor.report.v1";

/**
 * Feltene enhver rapporttype må ha.
 *
 * SEO, økonomi og salg kommer senere. De deler denne stammen; resten er
 * typespesifikt. Listen er derfor grensen for hva rapportsenteret kan
 * love å vise uansett hva slags rapport det er.
 */
export const FELLESFELT = [
  "schema",
  "type",
  "id",
  "period",
  "verdict",
  "subject",
  "headline",
  "kpis",
  "insights",
  "steps",
  "footer",
] as const;

const NIVAAER: Domnivaa[] = ["act", "watch", "ok"];

/** En rapport er test hvis flagget er satt, eller bunnteksten røper det. */
export function erTest(r: { test?: unknown; footer?: unknown }): boolean {
  if (r.test === true) return true;
  return typeof r.footer === "string" && /TESTDATA/i.test(r.footer);
}

function tekst(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function tall(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function tallEllerNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function liste<T>(v: unknown, kart: (x: unknown) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  return v.map(kart).filter((x): x is T => x !== null);
}
function strenger(v: unknown): string[] {
  return liste(v, (x) => (typeof x === "string" && x.trim() ? x.trim() : null));
}

export type Lesning =
  | { ok: true; rapport: Rapport; rå: Record<string, unknown> }
  | { ok: false; feil: string[] };

/**
 * Leser en innkommende payload.
 *
 * ── HVORFOR FEILENE SAMLES OPP ────────────────────────────────────────────
 *
 * Avsenderen er en planlagt oppgave, ikke et menneske foran en skjerm.
 * Den får svaret én gang i uka, og den som skal rette feilen leser det i
 * en logg. Da er «mangler period, verdict og steps» én runde, mens
 * «mangler period» er tre uker.
 */
export function lesRapport(rått: unknown): Lesning {
  const feil: string[] = [];
  if (!rått || typeof rått !== "object" || Array.isArray(rått)) {
    return { ok: false, feil: ["Payloaden er ikke et objekt."] };
  }
  const o = rått as Record<string, unknown>;

  for (const f of FELLESFELT) {
    if (o[f] === undefined || o[f] === null) feil.push(`Mangler «${f}».`);
  }
  if (o.schema !== undefined && o.schema !== SKJEMA) {
    feil.push(`Ukjent schema «${String(o.schema)}», ventet «${SKJEMA}».`);
  }
  const id = tekst(o.id).trim();
  if (id && !/^[a-z0-9-]{3,120}$/i.test(id)) {
    feil.push("«id» kan bare inneholde bokstaver, tall og bindestrek.");
  }
  const p = o.period as Record<string, unknown> | undefined;
  if (p && typeof p === "object" && !tekst(p.label).trim()) {
    feil.push("«period.label» er tom.");
  }
  const v = o.verdict as Record<string, unknown> | undefined;
  if (v && typeof v === "object" && !NIVAAER.includes(v.level as Domnivaa)) {
    feil.push(`«verdict.level» må være ${NIVAAER.join(", ")}.`);
  }
  if (Array.isArray(o.insights) && o.insights.length === 0) {
    feil.push("«insights» er tom.");
  }
  if (feil.length) return { ok: false, feil };

  const k = (o.kpis ?? {}) as Record<string, unknown>;
  const c4 = (k.cpl_4w ?? {}) as Record<string, unknown>;
  const lw = (k.leads_week ?? {}) as Record<string, unknown>;
  const c90 = (k.customers_90d ?? {}) as Record<string, unknown>;
  const sw = (k.spend_week ?? {}) as Record<string, unknown>;
  const al = (o.alert ?? {}) as Record<string, unknown>;
  const hs = (o.hubspot ?? {}) as Record<string, unknown>;
  const dec = o.decision as Record<string, unknown> | null | undefined;

  const vindu = (x: unknown): Vindu => {
    const q = (x ?? {}) as Record<string, unknown>;
    return {
      weeks: liste(q.weeks, (w) => tallEllerNull(w)),
      spend: tall(q.spend),
      leads: tall(q.leads),
      cpl: tallEllerNull(q.cpl),
      complete: q.complete === true,
    };
  };

  const rapport: Rapport = {
    schema: SKJEMA,
    type: tekst(o.type, "ukjent"),
    id,
    year: tall(o.year),
    week: tall(o.week),
    period: {
      from: tekst(p?.from),
      to: tekst(p?.to),
      label: tekst(p?.label),
    },
    generated_at: tekst(o.generated_at),
    verdict: {
      level: (v?.level as Domnivaa) ?? "ok",
      label: tekst(v?.label),
      short: tekst(v?.short),
    },
    subject: tekst(o.subject),
    headline: tekst(o.headline),
    decision: dec
      ? {
          question: tekst(dec.question),
          recommendation: tekst(dec.recommendation),
          cost_nok: tallEllerNull(dec.cost_nok),
          deadline_label: tekst(dec.deadline_label),
          if_nothing: tekst(dec.if_nothing),
        }
      : null,
    kpis: {
      cpl_4w: {
        ...vindu(c4),
        prev: c4.prev ? vindu(c4.prev) : undefined,
        change_pct: tallEllerNull(c4.change_pct),
        limit: tall(c4.limit) || 2000,
      },
      leads_week: {
        value: tall(lw.value),
        meta: tall(lw.meta),
        google: tall(lw.google),
      },
      customers_90d: {
        count: tall(c90.count),
        spend: tall(c90.spend),
        names: strenger(c90.names),
        cost_per_customer: tallEllerNull(c90.cost_per_customer),
      },
      spend_week: {
        value: tall(sw.value),
        meta: tall(sw.meta),
        google: tall(sw.google),
        change_pct: tallEllerNull(sw.change_pct),
      },
    },
    alert: {
      active: al.active === true,
      reasons: strenger(al.reasons),
      text: tekst(al.text),
    },
    quiet: o.quiet === true,
    status: liste(o.status, (x) => {
      const q = (x ?? {}) as Record<string, unknown>;
      if (!tekst(q.name).trim()) return null;
      return {
        channel: tekst(q.channel),
        name: tekst(q.name),
        on: q.on === true,
        text: tekst(q.text),
      };
    }),
    weeks: liste(o.weeks, (x) => {
      const q = (x ?? {}) as Record<string, unknown>;
      if (typeof q.w !== "number") return null;
      return {
        w: q.w,
        meta_cost: tall(q.meta_cost),
        meta_leads: tall(q.meta_leads),
        g_cost: tall(q.g_cost),
        g_leads: tall(q.g_leads),
        cost: tall(q.cost),
        leads: tall(q.leads),
        cpl: tallEllerNull(q.cpl),
      };
    }),
    ads: liste(o.ads, (x) => {
      const q = (x ?? {}) as Record<string, unknown>;
      if (!tekst(q.ad).trim() && !tekst(q.campaign).trim()) return null;
      return {
        platform: tekst(q.platform),
        campaign: tekst(q.campaign),
        ad: tekst(q.ad),
        on: q.on === true,
        cost_week: tall(q.cost_week),
        impressions_week: tall(q.impressions_week),
        frequency_week: tallEllerNull(q.frequency_week),
        leads_week: tall(q.leads_week),
        monthly: liste(q.monthly, (m) => {
          const r = (m ?? {}) as Record<string, unknown>;
          if (!tekst(r.month).trim()) return null;
          return {
            month: tekst(r.month),
            cost: tall(r.cost),
            leads: tall(r.leads),
          };
        }),
      };
    }),
    hubspot: {
      new_contacts: tall(hs.new_contacts),
      sources:
        hs.sources && typeof hs.sources === "object"
          ? Object.fromEntries(
              Object.entries(hs.sources as Record<string, unknown>).map(
                ([nk, nv]) => [nk, tall(nv)],
              ),
            )
          : {},
      paid_social_customers_total: tall(hs.paid_social_customers_total),
      paid_social_customers_new_week: tall(hs.paid_social_customers_new_week),
    },
    insights: strenger(o.insights),
    steps: liste(o.steps, (x) => {
      const q = (x ?? {}) as Record<string, unknown>;
      if (!tekst(q.title).trim()) return null;
      return {
        title: tekst(q.title),
        detail: tekst(q.detail),
        owner: tekst(q.owner),
        due: tekst(q.due),
        due_label: tekst(q.due_label),
      };
    }),
    previous_steps: liste(o.previous_steps, (x) => {
      const q = (x ?? {}) as Record<string, unknown>;
      if (!tekst(q.title).trim()) return null;
      const s = tekst(q.status);
      return {
        title: tekst(q.title),
        status:
          s === "done" || s === "not_done"
            ? (s as "done" | "not_done")
            : "unknown",
        evidence: tekst(q.evidence),
      };
    }),
    data_gaps: strenger(o.data_gaps),
    sources:
      o.sources && typeof o.sources === "object"
        ? Object.fromEntries(
            Object.entries(o.sources as Record<string, unknown>).map(
              ([sk, sv]) => [sk, String(sv)],
            ),
          )
        : {},
    footer: tekst(o.footer),
    test: erTest(o),
  };

  return { ok: true, rapport, rå: o };
}
