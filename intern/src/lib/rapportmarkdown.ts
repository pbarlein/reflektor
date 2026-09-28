import type { Rapport, Steg } from "../content/rapporttype.ts";
import { kr, norskTidspunkt, prosent, tall } from "./rapportformat.ts";

/**
 * Rapporten som Markdown, til å laste ned.
 *
 * ── HVA DEN ER TIL ────────────────────────────────────────────────────────
 *
 * Bestilt 28.09.2026: Pål skal kunne laste ned rapporten og legge den i
 * Claude-prosjektet «reflektor-marketing», som kontekst for videre arbeid
 * med markedsføringen.
 *
 * Det styrer tre valg som ellers hadde gått andre veien:
 *
 *   1. MARKDOWN, IKKE JSON ELLER PDF. Mottakeren er en språkmodell som
 *      skal lese tallene og resonnere om dem. JSON bærer de samme tallene,
 *      men uten at noe sier hva `cpl_4w.change_pct` betyr — og et menneske
 *      kan ikke lese korrektur på det. PDF er verst av alle: tabeller blir
 *      til tekstsuppe i uttrekket.
 *   2. ALT BLIR MED, OGSÅ DET SKJERMEN SKJULER. Siden folder sammen
 *      annonsetabellen og ukehistorikken fordi Pål skal bestemme seg på
 *      tretti sekunder. Den som leser filen har ikke det hastverket, og et
 *      utelatt tall er et tall som ikke finnes.
 *   3. PÅLS EGNE SVAR ER MED. Avkryssinger, beslutningssvaret og notatene
 *      er det eneste i systemet som sier hva som FAKTISK ble gjort. Uten
 *      dem er filen en liste over forslag.
 *
 * ── HARDE MELLOMROM SKRIVES OM ────────────────────────────────────────────
 *
 * `rapportformat.ts` setter hardt mellomrom mellom tusenskille og «kr», så
 * et beløp ikke brekker over to linjer på en skjerm. I en tekstfil er det
 * bare et tegn som ser ut som mellomrom og ikke er det, og det blir en
 * felle for den som søker eller klipper ut tall. Her skrives de tilbake.
 *
 * ── INGEN NYE TALL REGNES UT HER ──────────────────────────────────────────
 *
 * Samme regel som resten av rapportsenteret, se `rapporttype.ts`: malen
 * eier utregningene. Denne filen gjengir, den konkluderer ikke.
 */

/* Hardt mellomrom fra rapportformat.ts. */
const HARDT = / /g;

const t = (n: number) => tall(n).replace(HARDT, " ");
const k = (n: number | null | undefined) => kr(n).replace(HARDT, " ");
const p = (n: number | null | undefined) => prosent(n).replace(HARDT, " ");

/**
 * Det filen trenger av det Pål har gjort. Strukturell type, som i
 * `rapportflytt.ts`: modulen skal kunne testes uten å dra inn
 * Blob-butikken, og `rapportlager.ts` åpner den ved import.
 */
export type Brukersvar = {
  mottatt: string;
  beslutning: { svar: string; kommentar: string; tidspunkt: string } | null;
  gjorteSteg: { indeks: number; tidspunkt: string }[];
  notater: { tekst: string; tidspunkt: string }[];
};

/** Tabellrad. Tomme celler blir «–», så ingen kolonne kollapser. */
function rad(celler: (string | number)[]): string {
  return `| ${celler.map((c) => String(c === "" ? "–" : c)).join(" | ")} |`;
}

function skille(antall: number): string {
  return `|${" --- |".repeat(antall)}`;
}

/**
 * Rørtegn i en celle deler tabellen i to. Kundenavn og annonsenavn kommer
 * utenfra og kan inneholde hva som helst.
 */
function celle(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
}

const DOM: Record<string, string> = {
  act: "Handle",
  watch: "Følg med",
  ok: "I rute",
};

function stegtekst(s: Steg, gjort: { tidspunkt: string } | undefined): string {
  const merke = gjort ? "x" : " ";
  const bak: string[] = [];
  if (s.owner) bak.push(s.owner);
  if (s.due_label) bak.push(`frist ${s.due_label}`);
  else if (s.due) bak.push(`frist ${s.due}`);
  if (gjort) bak.push(`krysset av ${norskTidspunkt(gjort.tidspunkt)}`);

  const hode = `- [${merke}] **${s.title}**${bak.length ? ` — ${bak.join(", ")}` : ""}`;
  return s.detail ? `${hode}\n  ${s.detail}` : hode;
}

/**
 * Én rapport som Markdown, uten toppnivåoverskrift for filen selv.
 *
 * `niva` er overskriftsnivået rapporten starter på: 1 når den er alene i
 * filen, 2 når den er én av mange. Uten det ville samlefilen fått ti
 * `# `-overskrifter og ingen struktur.
 */
export function rapportTilMarkdown(
  r: Rapport,
  svar: Brukersvar,
  niva: 1 | 2 = 1,
): string {
  const h = (n: number) => "#".repeat(niva + n - 1);
  const ut: string[] = [];

  ut.push(`${h(1)} Uke ${r.week}, ${r.year} — ${r.verdict.short || r.subject}`);
  ut.push("");

  if (r.test) {
    ut.push(
      "> **TESTDATA.** Tallene i denne rapporten er oppdiktede og skal ikke",
      "> brukes som grunnlag for noe som helst.",
      "",
    );
  }

  ut.push(
    `- **Periode:** ${r.period.label || `${r.period.from}–${r.period.to}`}`,
    /*
     * Malens egen merkelapp først, maskinnivået i parentes.
     *
     * Første utgave skrev «Handle — HANDLING KREVES»: vår oversettelse av
     * nivået, og malens merkelapp etter, som sier det samme med store
     * bokstaver. To ganger, og den ene ropte. Nivået står likevel med, som
     * `act`/`watch`/`ok` — det er den verdien som er stabil på tvers av
     * uker, og forordet forklarer den.
     */
    `- **Dom:** ${r.verdict.label || (DOM[r.verdict.level] ?? r.verdict.level)} (\`${r.verdict.level}\`)`,
  );
  if (r.generated_at) {
    ut.push(`- **Rapporten ble laget:** ${norskTidspunkt(r.generated_at)}`);
  }
  ut.push(`- **Kom inn på intranettet:** ${norskTidspunkt(svar.mottatt)}`);
  ut.push("");

  if (r.headline) ut.push(r.headline, "");

  /* ── BESLUTNINGEN ─────────────────────────────────────────────────── */
  if (r.decision) {
    ut.push(`${h(2)} Beslutning`, "");
    ut.push(`**${r.decision.question}**`, "");
    if (r.decision.recommendation) {
      ut.push(`- Anbefaling: ${r.decision.recommendation}`);
    }
    if (r.decision.cost_nok !== null) {
      ut.push(`- Koster: ${k(r.decision.cost_nok)}`);
    }
    if (r.decision.deadline_label) {
      ut.push(`- Frist: ${r.decision.deadline_label}`);
    }
    if (r.decision.if_nothing) {
      ut.push(`- Skjer ingenting: ${r.decision.if_nothing}`);
    }
    ut.push("");
    if (svar.beslutning) {
      const b = svar.beslutning;
      ut.push(
        `**Pål svarte «${b.svar}»** ${norskTidspunkt(b.tidspunkt)}.` +
          (b.kommentar ? ` Kommentar: ${b.kommentar}` : ""),
        "",
      );
    } else {
      ut.push("**Ubesvart.**", "");
    }
  }

  /* ── NØKKELTALL ───────────────────────────────────────────────────── */
  const kp = r.kpis;
  ut.push(`${h(2)} Nøkkeltall`, "");
  ut.push(
    `- **Pris per lead, fire uker:** ${k(kp.cpl_4w.cpl)}` +
      ` (grense ${k(kp.cpl_4w.limit)}` +
      (kp.cpl_4w.change_pct !== null
        ? `, endring ${p(kp.cpl_4w.change_pct)} mot forrige periode`
        : "") +
      `). ${t(kp.cpl_4w.leads)} leads for ${k(kp.cpl_4w.spend)}` +
      (kp.cpl_4w.weeks.length ? ` i uke ${kp.cpl_4w.weeks.join(", ")}` : "") +
      (kp.cpl_4w.complete === false ? ". Vinduet er ikke komplett" : "") +
      ".",
    `- **Leads denne uka:** ${t(kp.leads_week.value)}` +
      ` (Meta ${t(kp.leads_week.meta)}, Google ${t(kp.leads_week.google)}).`,
    `- **Forbruk denne uka:** ${k(kp.spend_week.value)}` +
      ` (Meta ${k(kp.spend_week.meta)}, Google ${k(kp.spend_week.google)})` +
      (kp.spend_week.change_pct !== null
        ? `, endring ${p(kp.spend_week.change_pct)}`
        : "") +
      ".",
    `- **Kunder siste 90 dager:** ${t(kp.customers_90d.count)}` +
      ` for ${k(kp.customers_90d.spend)}` +
      (kp.customers_90d.cost_per_customer !== null
        ? `, ${k(kp.customers_90d.cost_per_customer)} per kunde`
        : "") +
      ".",
  );
  if (kp.customers_90d.by_channel.length) {
    /*
     * Per kanal, når malen har det. Et samlet snitt skjuler at den ene
     * kanalen ga alle kundene og den andre kostet penger uten å gi noen —
     * og det er nøyaktig det man trenger for å flytte budsjett.
     */
    for (const kanal of kp.customers_90d.by_channel) {
      /*
       * En kanal uten kunder får ikke en pris per kunde — den finnes
       * ikke. Den får forbruket sitt, som er det tallet som betyr noe
       * når man vurderer å flytte pengene et annet sted.
       */
      ut.push(
        kanal.count > 0 && kanal.cost_per_customer !== null
          ? `  - ${kanal.name}: ${t(kanal.count)} kunder for ` +
              `${k(kanal.spend)}, ${k(kanal.cost_per_customer)} per kunde` +
              (kanal.names.length ? ` (${kanal.names.join(", ")})` : "") +
              "."
          : `  - ${kanal.name}: ingen kunder, ${k(kanal.spend)} brukt.`,
      );
    }
  } else if (kp.customers_90d.names.length) {
    ut.push(`  - Kundene: ${kp.customers_90d.names.join(", ")}`);
  }
  if (kp.other_spend_4w > 0) {
    ut.push(
      `- **Annet forbruk, fire uker:** ${k(kp.other_spend_4w)} til boostede` +
        ` innlegg og liknende. Teller ikke i pris per lead.`,
    );
  }
  if (kp.google_cpc_4w.value !== null) {
    ut.push(
      `- **Klikkpris Google, fire uker:** ${k(kp.google_cpc_4w.value)}` +
        (kp.google_cpc_4w.change_pct !== null
          ? ` (${p(kp.google_cpc_4w.change_pct)} mot fire uker før)`
          : "") +
        ".",
    );
  }
  ut.push("");

  /* ── VARSEL OG HULL I DATA ────────────────────────────────────────── */
  if (r.alert.active && (r.alert.reasons.length || r.alert.text)) {
    ut.push(`${h(2)} Varsel`, "");
    for (const g of r.alert.reasons) ut.push(`- ${g}`);
    if (r.alert.text) ut.push("", r.alert.text);
    ut.push("");
  }

  if (r.data_gaps.length) {
    ut.push(`${h(2)} Manglende data`, "");
    ut.push(
      "Tall som ikke finnes i denne rapporten. Konklusjoner som hviler på",
      "dem, hviler på ingenting.",
      "",
    );
    for (const g of r.data_gaps) ut.push(`- ${g}`);
    ut.push("");
  }

  if (r.quiet) {
    ut.push("*Malen vurderte uka som stille: ingen handling nødvendig.*", "");
  }

  /* ── ENDRINGENE, FØR OBSERVASJONENE DE FORKLARER ──────────────────── */
  if (r.changes.length) {
    ut.push(`${h(2)} Endringer i kontoene`, "");
    ut.push(
      "Lest av endringsloggen hos Meta og Google. Et hopp i klikkpris eller",
      "forbruk er ubrukelig uten denne: forskjellen på å stoppe en kanal og",
      "å rette en innstilling ligger her.",
      "",
    );
    for (const c of [...r.changes].sort((a, b) =>
      b.date.localeCompare(a.date),
    )) {
      ut.push(
        `- **${c.date}${c.platform_name ? ` · ${c.platform_name}` : ""}:**` +
          ` ${c.what}` +
          (c.effect ? ` — ${c.effect}` : ""),
      );
    }
    ut.push("");
  }

  /*
   * Uforklart står ETTER endringsloggen. Sto det før, leste man «ingen
   * registrert endring forklarer hoppet» uten å ha sett hvilke endringer
   * som var registrert, og de to avsnittene så ut som en selvmotsigelse.
   */
  if (r.unexplained.length) {
    ut.push(`${h(2)} Uforklart endring`, "");
    ut.push(
      "Hopp i tallene som ingen registrert endring i kontoene forklarer.",
      "Ikke konkluder med at en kanal ikke virker før noen har sett etter.",
      "",
    );
    for (const u of r.unexplained) ut.push(`- ${u}`);
    ut.push("");
  }

  /* ── HVA VI SER ───────────────────────────────────────────────────── */
  if (r.insights.length) {
    ut.push(`${h(2)} Hva vi ser`, "");
    for (const i of r.insights) ut.push(`- ${i}`);
    ut.push("");
  }

  /* ── STEGENE ──────────────────────────────────────────────────────── */
  if (r.steps.length) {
    ut.push(`${h(2)} Neste steg`, "");
    ut.push(`Avkryssingen er Påls egen, gjort på intranettet.`, "");
    for (const [i, s] of r.steps.entries()) {
      ut.push(
        stegtekst(
          s,
          svar.gjorteSteg.find((g) => g.indeks === i),
        ),
      );
    }
    ut.push("");
  }

  if (r.previous_steps.length) {
    const ord: Record<string, string> = {
      done: "Gjort",
      not_done: "Ikke gjort",
      unknown: "Uvisst",
    };
    ut.push(`${h(2)} Stegene fra forrige uke`, "");
    for (const s of r.previous_steps) {
      ut.push(
        `- **${ord[s.status]}:** ${s.title}` +
          (s.evidence ? ` — ${s.evidence}` : ""),
      );
    }
    ut.push("");
  }

  /* ── UKENE ────────────────────────────────────────────────────────── */
  if (r.weeks.length) {
    ut.push(`${h(2)} Uke for uke`, "");
    /*
     * «Meta forbruk» er KUN leadkampanjer fra mal v2.1, og «Meta annet» er
     * boostede innlegg. Skilles de ikke, ser en uke med mye boosting ut
     * som en uke der leadkampanjene var dyre.
     */
    ut.push(
      rad([
        "Uke",
        "Forbruk",
        "Leads",
        "Pris per lead",
        "Meta lead",
        "Meta annet",
        "Meta leads",
        "Google",
        "Google klikk",
        "Klikkpris",
        "Google leads",
      ]),
      skille(11),
    );
    for (const u of r.weeks) {
      ut.push(
        rad([
          u.w,
          k(u.cost),
          t(u.leads),
          k(u.cpl),
          k(u.meta_cost),
          u.meta_other_cost ? k(u.meta_other_cost) : "–",
          t(u.meta_leads),
          k(u.g_cost),
          u.g_clicks === null ? "–" : t(u.g_clicks),
          k(u.g_cpc),
          t(u.g_leads),
        ]),
      );
    }
    ut.push("");
  }

  /* ── ANNONSENE ────────────────────────────────────────────────────── */
  if (r.ads.length) {
    ut.push(`${h(2)} Annonser`, "");
    ut.push(
      rad([
        "Plattform",
        "Annonse-ID",
        "Kampanje",
        "Annonse",
        "På",
        "Forbruk uka",
        "Visninger",
        "Frekvens",
        "Leads uka",
      ]),
      skille(9),
    );
    for (const a of r.ads) {
      ut.push(
        rad([
          celle(a.platform),
          /* To annonser kan hete det samme. Id-en er det som skiller dem. */
          celle(a.ad_id) || "–",
          celle(a.campaign),
          celle(a.ad),
          a.on ? "Ja" : "Nei",
          k(a.cost_week),
          t(a.impressions_week),
          a.frequency_week === null
            ? "–"
            : a.frequency_week.toFixed(1).replace(".", ","),
          t(a.leads_week),
        ]),
      );
    }
    ut.push("");

    const medMaaned = r.ads.filter((a) => a.monthly.length);
    if (medMaaned.length) {
      ut.push(`${h(3)} Annonsene måned for måned`, "");
      for (const a of medMaaned) {
        ut.push(`**${celle(a.ad) || celle(a.campaign)}**`, "");
        ut.push(rad(["Måned", "Forbruk", "Leads"]), skille(3));
        for (const m of a.monthly) {
          ut.push(rad([celle(m.month), k(m.cost), t(m.leads)]));
        }
        ut.push("");
      }
    }
  }

  /* ── KANALENE ─────────────────────────────────────────────────────── */
  if (r.status.length) {
    ut.push(`${h(2)} Kanaler`, "");
    for (const s of r.status) {
      ut.push(
        `- **${s.name}** — ${s.on ? "på" : "av"}${s.text ? `. ${s.text}` : ""}`,
      );
    }
    ut.push("");
  }

  /* ── HUBSPOT ──────────────────────────────────────────────────────── */
  const hs = r.hubspot;
  const kilder = Object.entries(hs.sources);
  if (hs.new_contacts || kilder.length || hs.paid_social_customers_total) {
    ut.push(`${h(2)} HubSpot`, "");
    ut.push(
      `- Nye kontakter: ${t(hs.new_contacts)}`,
      `- Kunder fra betalt sosialt, totalt: ${t(hs.paid_social_customers_total)}`,
      `- Kunder fra betalt sosialt, nye denne uka: ${t(hs.paid_social_customers_new_week)}`,
    );
    for (const [navn, antall] of kilder) {
      ut.push(`- Kilde «${celle(navn)}»: ${t(antall)}`);
    }
    ut.push("");
  }

  /* ── PÅLS NOTATER ─────────────────────────────────────────────────── */
  if (svar.notater.length) {
    ut.push(`${h(2)} Påls notater`, "");
    for (const n of svar.notater) {
      ut.push(`- *${norskTidspunkt(n.tidspunkt)}:* ${n.tekst}`);
    }
    ut.push("");
  }

  /* ── KILDER ───────────────────────────────────────────────────────── */
  const kildeliste = Object.entries(r.sources);
  if (kildeliste.length) {
    ut.push(`${h(2)} Hvor tallene kommer fra`, "");
    for (const [navn, verdi] of kildeliste) {
      ut.push(`- **${celle(navn)}:** ${celle(verdi)}`);
    }
    ut.push("");
  }

  if (r.footer) ut.push(`*${r.footer}*`, "");

  return ut.join("\n");
}

/**
 * Forklaringen som står øverst i filen.
 *
 * Den som åpner filen om tre måneder — eller modellen som får den i et
 * prosjekt — vet ikke hva en «dom» er, at malen eier utregningene, eller at
 * leads telles på `/takk`. Det koster ti linjer å si det, og uten dem er
 * resten tall uten målestokk.
 *
 * Alt her står fast fordi det følger av systemet, ikke av tallene i en
 * bestemt uke. Ingenting tolkes.
 */
function forord(): string[] {
  return [
    "## Om denne filen",
    "",
    "Ukerapporten for Reflektors betalte markedsføring, lastet ned fra",
    "intranettet. Den er skrevet for å leses som kontekst, ikke for å",
    "arkiveres.",
    "",
    "- **Reflektors eneste KPI er skjemaleads** — utfylte kontaktskjemaer,",
    "  målt som sidevisning på `/takk` i GA4 og i Google Ads. Trafikk,",
    "  rangeringer og synlighet er ikke mål i seg selv.",
    "- **Tallene regnes ut av den planlagte oppgaven** som lager rapporten,",
    "  ikke av intranettet og ikke av denne filen. Ingenting er regnet om",
    "  her.",
    "- **«Dom»** er oppgavens egen vurdering av uka: *Handle*, *Følg med*",
    "  eller *I rute*.",
    "- **«Pris per lead»** måles over et firewukersvindu, mot en grense som",
    "  står oppgitt i hver rapport. Den regnes **kun på leadkampanjer** —",
    "  boostede innlegg og liknende står for seg som «annet forbruk».",
    "- **«Endringer i kontoene»** er lest av endringsloggen hos Meta og",
    "  Google. Et hopp i klikkpris eller forbruk betyr noe helt annet når",
    "  en innstilling ble endret samtidig: da skal innstillingen rettes og",
    "  testes, ikke kanalen stoppes.",
    "- **Avkryssinger, beslutningssvar og notater er Påls egne**, gjort på",
    "  intranettet i etterkant. De sier hva som faktisk ble gjort — resten",
    "  er hva oppgaven foreslo.",
    "- **Filen inneholder kundenavn og annonseforbruk.**",
    "",
  ];
}

export type Nedlastbar = { rapport: Rapport; svar: Brukersvar };

/**
 * Hele filen: forord, og så én eller flere rapporter.
 *
 * Nyeste først. Den som leser en kontekstfil ovenfra og ned, skal møte
 * situasjonen nå før historikken som førte dit.
 */
export function byggMarkdown(
  rapporter: readonly Nedlastbar[],
  lastetNed: Date = new Date(),
): string {
  const en = rapporter.length === 1;
  const forste = rapporter[0]?.rapport;

  const tittel = en
    ? `# Reflektor — markedsrapport uke ${forste?.week}, ${forste?.year}`
    : `# Reflektor — markedsrapporter, ${rapporter.length} uker`;

  const ut = [
    tittel,
    "",
    `*Lastet ned fra intranettet ${norskTidspunkt(lastetNed.toISOString())}.*`,
    "",
    ...forord(),
  ];

  if (!en && rapporter.length > 0) {
    ut.push("## Ukene i korthet", "");
    ut.push(
      rad(["Uke", "Dom", "Kort", "Leads", "Forbruk", "Pris per lead (4 uker)"]),
      skille(6),
    );
    for (const { rapport: r } of rapporter) {
      ut.push(
        rad([
          `${r.week}/${r.year}`,
          DOM[r.verdict.level] ?? r.verdict.level,
          celle(r.verdict.short),
          t(r.kpis.leads_week.value),
          k(r.kpis.spend_week.value),
          k(r.kpis.cpl_4w.cpl),
        ]),
      );
    }
    ut.push("");
  }

  if (rapporter.length === 0) {
    ut.push("*Ingen rapporter å laste ned ennå.*", "");
  }

  for (const { rapport, svar } of rapporter) {
    ut.push("---", "");
    ut.push(rapportTilMarkdown(rapport, svar, en ? 1 : 2));
  }

  return (
    ut
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trimEnd() + "\n"
  );
}

/**
 * Filnavnet. Kun ASCII: en `Content-Disposition` med æøå i må kodes, og
 * nettlesere er historisk uenige om hvordan.
 */
export function filnavn(
  rapporter: readonly Nedlastbar[],
  naa: Date = new Date(),
): string {
  const dato = naa.toISOString().slice(0, 10);
  if (rapporter.length === 1) {
    const r = rapporter[0].rapport;
    const test = r.test ? "-TESTDATA" : "";
    return `reflektor-markedsrapport-uke-${r.week}-${r.year}${test}.md`;
  }
  return `reflektor-markedsrapporter-${dato}.md`;
}
