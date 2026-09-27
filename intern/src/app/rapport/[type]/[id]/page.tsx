import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Annonsegraf } from "@/components/rapport/Annonsegraf";
import { Beslutningen } from "@/components/rapport/Beslutningen";
import { Dommerke } from "@/components/rapport/Dommerke";
import { Nokkeltall } from "@/components/rapport/Nokkeltall";
import { Notatene, Stegene } from "@/components/rapport/Stegene";
import { Ukegraf, Uketabell } from "@/components/rapport/Ukegraf";
import { kr, norskTidspunkt } from "@/lib/rapportformat";
import { hentIndeks, hentInnstillinger, hentRapport } from "@/lib/rapportlager";
import { erRapportleser } from "@/lib/rapporttilgang";
import { krevBruker } from "@/lib/tilgang";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ type: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type, id } = await params;
  const l = await hentRapport(type, id);
  return { title: l ? `Uke ${l.rapport.week} · rapport` : "Rapport" };
}

/**
 * Én rapport.
 *
 * ── REKKEFØLGEN ER BESTILT, OG DEN ER RIKTIG ──────────────────────────────
 *
 * Dom, hovedsetning, beslutning, nøkkeltall — så resten. Pål skal kunne
 * bestemme seg på under tretti sekunder, og da må det han skal bestemme
 * ligge over det han kan grave i. Detaljene ligger sammenfoldet nederst,
 * der de ikke er i veien for noen.
 *
 * ── STILLE UKER ER KORTE ──────────────────────────────────────────────────
 *
 * Er `quiet` satt, har malen allerede avgjort at det ikke er noe å gjøre.
 * Da vises dom, én setning og nøkkeltallene — ikke to grafer og en tabell
 * som alle sier det samme: ingenting skjedde.
 */
export default async function Rapportside({ params }: Params) {
  const bruker = await krevBruker();
  if (!erRapportleser(bruker)) notFound();

  const { type, id } = await params;
  const l = await hentRapport(type, id);
  if (!l) notFound();

  const r = l.rapport;
  const innst = await hentInnstillinger(type);
  const grense = r.kpis.cpl_4w.limit || innst.cplGrense;

  /* Naboene i arkivet, til bla-lenkene. Samme type, samme testflagg. */
  const soesken = (await hentIndeks())
    .filter((x) => x.type === type && x.test === r.test)
    .sort((a, b) => a.mottatt.localeCompare(b.mottatt));
  const plass = soesken.findIndex((x) => x.id === id);
  const forrige = plass > 0 ? soesken[plass - 1] : null;
  const neste =
    plass >= 0 && plass < soesken.length - 1 ? soesken[plass + 1] : null;

  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-10">
        <Link
          href="/rapport"
          className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none print:hidden"
        >
          <span aria-hidden>←</span> Alle rapporter
        </Link>

        <article className="mt-7 flex max-w-[58rem] flex-col gap-7">
          {r.test && (
            <p className="rounded-flate border border-dashed border-[color:var(--varsel-kant)] px-4 py-2.5 font-sans text-[0.75rem] font-semibold tracking-[0.1em] text-varsel uppercase">
              Testdata · tallene er ikke ekte
            </p>
          )}

          {/*
            ── NÅR EN NY UTGAVE TOK MED SEG NOE ──────────────────────────

            Leveres samme uke på nytt, skrives rapporten om fra bunnen av.
            Avkryssinger flyttes etter tekst og et svar står bare så lenge
            spørsmålet gjør det — se `flyttMedOver`. Det som ikke kunne
            flyttes, sies her. Alternativet var at haken ble stående under
            en annen setning, og det er verre enn å miste den.
          */}
          {l.mistetVedOppdatering && (
            <section className="rounded-flate border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-5 py-4">
              <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-varsel uppercase">
                Rapporten er skrevet om siden du svarte
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-varsel">
                En ny utgave kom inn{" "}
                {norskTidspunkt(l.mistetVedOppdatering.tidspunkt)}. Dette
                fulgte ikke med, fordi teksten det hang på er borte:
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {l.mistetVedOppdatering.steg.map((t, i) => (
                  <li
                    key={i}
                    className="text-[0.9375rem] leading-relaxed text-pretty text-varsel"
                  >
                    Avkrysningen på «{t}»
                  </li>
                ))}
                {l.mistetVedOppdatering.beslutning && (
                  <li className="text-[0.9375rem] leading-relaxed text-pretty text-varsel">
                    Svaret «{l.mistetVedOppdatering.beslutning.svar}» på «
                    {l.mistetVedOppdatering.beslutning.sporsmal}»
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* ── 1 DOM OG 2 HOVEDSETNING ─────────────────────────────────── */}
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <Dommerke niva={r.verdict.level} stor />
              <span className="font-sans text-[0.75rem] tracking-[0.08em] text-blekk-svak uppercase">
                Uke {r.week} · {r.period.label}
              </span>
            </div>
            <h1 className="mt-4 max-w-[30ch] text-[clamp(1.5rem,3.2vw,2.125rem)] leading-tight tracking-[-0.02em] text-pretty">
              {r.verdict.short}
            </h1>
            <p className="mt-3 max-w-[64ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
              {r.headline}
            </p>
          </header>

          {/* ── 3 BESLUTNING ────────────────────────────────────────────── */}
          {r.decision && (
            <Beslutningen
              type={type}
              id={id}
              beslutning={r.decision}
              svar={l.beslutning}
            />
          )}

          {/* ── 4 NØKKELTALL ────────────────────────────────────────────── */}
          <Nokkeltall kpis={r.kpis} uke={r.week} varsel={r.alert.active} />

          {/* ── 5 VARSEL ────────────────────────────────────────────────── */}
          {r.alert.active && r.alert.reasons.length > 0 && (
            <section className="rounded-flate border-l-4 border-[color:var(--varsel)] bg-[color:var(--varsel-flate)] px-5 py-4">
              <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-varsel uppercase">
                Varsel
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5">
                {r.alert.reasons.map((g, i) => (
                  <li
                    key={i}
                    className="text-[0.9375rem] leading-relaxed text-pretty text-blekk"
                  >
                    {g}
                  </li>
                ))}
              </ul>
              {r.alert.text && (
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                  {r.alert.text}
                </p>
              )}
            </section>
          )}

          {/* ── 10 MANGLER DATA ─────────────────────────────────────────── */}
          {r.data_gaps.length > 0 && (
            <section className="rounded-flate border border-[color:var(--varsel-kant)] px-5 py-4">
              <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-varsel uppercase">
                Mangler data
              </h2>
              <ul className="mt-2 flex flex-col gap-1">
                {r.data_gaps.map((g, i) => (
                  <li
                    key={i}
                    className="text-[0.9375rem] text-pretty text-blekk-dempet"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {r.quiet ? (
            <p className="rounded-flate border border-kant bg-dempet px-5 py-4 text-[1rem] text-blekk-dempet">
              Ingen handling nødvendig denne uka.
            </p>
          ) : (
            <>
              {/* ── 6 HVA VI SER ────────────────────────────────────────── */}
              {r.insights.length > 0 && (
                <section>
                  <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                    Hva vi ser
                  </h2>
                  <ul className="mt-2.5 flex flex-col">
                    {r.insights.map((s, i) => (
                      <li
                        key={i}
                        className="border-b border-kant py-2.5 text-[1rem] leading-relaxed text-pretty text-blekk"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── 7 NESTE STEG ────────────────────────────────────────── */}
              {r.steps.length > 0 && (
                <section>
                  <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                    Neste steg
                  </h2>
                  <div className="mt-2.5">
                    <Stegene
                      type={type}
                      id={id}
                      steg={r.steps}
                      gjorteFraFor={l.gjorteSteg}
                    />
                  </div>
                </section>
              )}

              {/* ── 8 FORRIGE UKES STEG ─────────────────────────────────── */}
              {r.previous_steps.length > 0 && (
                <section>
                  <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                    Forrige ukes steg
                  </h2>
                  <ul className="mt-2.5 flex flex-col">
                    {r.previous_steps.map((s, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-baseline gap-x-2.5 border-b border-kant py-2 text-[0.9375rem]"
                      >
                        <span
                          className={`font-sans text-[0.625rem] font-semibold tracking-[0.1em] uppercase ${
                            s.status === "done"
                              ? "text-blekk"
                              : s.status === "not_done"
                                ? "text-varsel"
                                : "text-blekk-svak"
                          }`}
                        >
                          {s.status === "done"
                            ? "Gjort"
                            : s.status === "not_done"
                              ? "Ikke gjort"
                              : "Ukjent"}
                        </span>
                        <span className="text-blekk-dempet">{s.title}</span>
                        {s.evidence && (
                          <span className="text-blekk-svak">
                            – {s.evidence}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── 9 DETALJER ──────────────────────────────────────────── */}
              <details className="rounded-flate border border-kant bg-dempet print:open">
                <summary className="cursor-pointer list-none px-5 py-3.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none">
                  Detaljer · status per kanal, tolv uker, per annonse, HubSpot
                </summary>

                <div className="flex flex-col gap-7 border-t border-kant px-5 py-6">
                  {r.status.length > 0 && (
                    <section>
                      <h3 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                        Status nå
                      </h3>
                      <ul className="mt-2.5 flex flex-col gap-2">
                        {r.status.map((s) => (
                          <li
                            key={s.channel}
                            className={`border-l-[3px] bg-kort px-3.5 py-2.5 ${
                              s.on
                                ? "border-[color:var(--varsel)]"
                                : "border-[color:var(--kant-sterk)]"
                            }`}
                          >
                            <p className="text-[0.9375rem] font-medium text-blekk">
                              {s.name}
                              <span
                                className={`ml-2 rounded-sm px-1.5 py-0.5 font-sans text-[0.625rem] font-semibold tracking-[0.08em] uppercase ${
                                  s.on
                                    ? "bg-[color:var(--varsel-flate)] text-varsel"
                                    : "bg-dempet text-blekk-svak"
                                }`}
                              >
                                {s.on ? "På" : "Av"}
                              </span>
                            </p>
                            <p className="mt-1 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                              {s.text}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {r.weeks.length > 0 && (
                    <section>
                      <h3 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                        Tolv uker
                      </h3>
                      <div className="mt-3 rounded-interaktiv bg-kort px-4 pt-5 pb-4">
                        <Ukegraf uker={r.weeks} grense={grense} />
                        <Uketabell uker={r.weeks} grense={grense} />
                      </div>
                    </section>
                  )}

                  {r.ads.length > 0 && (
                    <section>
                      <h3 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                        Per annonse · pris per lead per måned
                      </h3>
                      <Annonsegraf annonser={r.ads} grense={grense} />
                    </section>
                  )}

                  <section>
                    <h3 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                      HubSpot
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                      {r.hubspot.new_contacts} nye kontakter
                      {Object.keys(r.hubspot.sources).length > 0
                        ? ` (${Object.entries(r.hubspot.sources)
                            .map(([k, v]) => `${k} ${v}`)
                            .join(" · ")})`
                        : ""}
                      . Kunder fra annonser siste 90 dager:{" "}
                      {r.kpis.customers_90d.count}
                      {r.kpis.customers_90d.names.length
                        ? ` (${r.kpis.customers_90d.names.join(", ")})`
                        : ""}
                      , {kr(r.kpis.customers_90d.spend)} brukt i samme periode.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                      Kilder
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
                      {Object.entries(r.sources)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ") || "ingen oppgitt"}
                      {r.generated_at &&
                        ` · laget ${norskTidspunkt(r.generated_at)}`}
                      {` · kom inn ${norskTidspunkt(l.mottatt)}`}
                      {l.versjoner.length > 0 &&
                        ` · ${l.versjoner.length + 1} utgaver`}
                    </p>
                  </section>
                </div>
              </details>
            </>
          )}

          {/* ── NOTATER ─────────────────────────────────────────────────── */}
          <section className="print:hidden">
            <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
              Dine notater
            </h2>
            <div className="mt-2.5">
              <Notatene type={type} id={id} fraFor={l.notater} />
            </div>
          </section>

          {/* ── BLA ─────────────────────────────────────────────────────── */}
          <nav className="flex justify-between gap-4 border-t border-kant pt-5 print:hidden">
            {forrige ? (
              <Link
                href={`/rapport/${forrige.type}/${forrige.id}`}
                className="rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
              >
                ← Uke {forrige.week}
              </Link>
            ) : (
              <span />
            )}
            {neste && (
              <Link
                href={`/rapport/${neste.type}/${neste.id}`}
                className="rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
              >
                Uke {neste.week} →
              </Link>
            )}
          </nav>

          <p className="text-[0.75rem] leading-relaxed text-pretty text-blekk-svak">
            {r.footer}
          </p>
        </article>
      </div>
    </Container>
  );
}
