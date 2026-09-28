import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Dommerke } from "@/components/rapport/Dommerke";
import { Nedlastingsknapp } from "@/components/rapport/Nedlastingsknapp";
import { Slettknapp } from "@/components/rapport/Slettknapp";
import { forfalt, norskTidspunkt } from "@/lib/rapportformat";
import { harLager, hentIndeks, hentRapport } from "@/lib/rapportlager";
import { erRapportleser } from "@/lib/rapporttilgang";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Rapporter" };
export const dynamic = "force-dynamic";

/**
 * Rapportsenteret.
 *
 * ── DET SOM VENTER PÅ DEG, ØVERST ─────────────────────────────────────────
 *
 * Bestilt: Pål skal se tre ting hver mandag — hvordan det går, hva som bør
 * gjøres, og om han må bestemme noe. De to siste er handlinger, og de
 * ligger derfor over arkivet, ikke inni det. Er det ingenting som venter,
 * står det ingenting der: en tom «0 oppgaver»-boks er også noe å lese.
 *
 * ── HVORFOR 404 OG IKKE REDIRECT ──────────────────────────────────────────
 *
 * Samme valg som gjennomgangssiden. En omdirigering forteller den som ikke
 * har tilgang at siden finnes. Her er det annonseforbruk og kundenavn, og
 * da er den billigste varianten også den riktige.
 */
export default async function Rapporter() {
  const bruker = await krevBruker();
  if (!erRapportleser(bruker)) notFound();

  const indeks = await hentIndeks();
  const ekte = indeks.filter((r) => !r.test);
  const tester = indeks.filter((r) => r.test);

  /*
   * ── HVA SOM FAKTISK VENTER PÅ HAM ─────────────────────────────────────
   *
   * Testrapporter er utenfor. De er her for å vurdere skjermene, ikke for å
   * kreve noe — en «venter på deg» full av oppdiktede beslutninger gjør
   * boksen til noe man slutter å lese.
   *
   * BESLUTNINGEN: bare den nyeste rapportens. En beslutning fra uke 37 som
   * aldri ble besvart, er ikke lenger en beslutning — den er historie, og
   * uka den gjaldt er over. Samme regel som purringen bruker.
   *
   * STEGENE: alle som har passert fristen, også fra tidligere uker. Et steg
   * blir ikke mindre ugjort av at det ble bestilt for tre uker siden.
   */
  const venter: { id: string; type: string; tekst: string; hva: string }[] = [];
  const nyesteSett = new Set<string>();
  for (const rad of ekte.slice(0, 8)) {
    const l = await hentRapport(rad.type, rad.id);
    if (!l) continue;

    if (!nyesteSett.has(l.type)) {
      nyesteSett.add(l.type);
      if (l.rapport.decision && !l.beslutning) {
        venter.push({
          id: l.id,
          type: l.type,
          hva: "Ubesvart beslutning",
          tekst: l.rapport.decision.question,
        });
      }
    }

    for (const [i, s] of l.rapport.steps.entries()) {
      if (l.gjorteSteg.some((g) => g.indeks === i)) continue;
      if (!forfalt(s.due)) continue;
      venter.push({
        id: l.id,
        type: l.type,
        hva: "Frist passert",
        tekst: s.title,
      });
    }
  }

  const siste = ekte[0];

  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
        >
          <span aria-hidden>←</span> Tilbake til huben
        </Link>

        <div className="mt-7 max-w-[58rem]">
          <p className="font-sans text-xs font-medium tracking-[0.08em] text-varsel uppercase">
            Kun for deg
          </p>
          <h1 className="mt-2.5 text-[clamp(1.75rem,3.4vw,2.5rem)] tracking-[-0.02em]">
            Rapporter
          </h1>

          {!harLager() && (
            <p className="mt-4 rounded-flate border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-4 py-3 text-[0.9375rem] text-varsel">
              Lagringen er ikke satt opp — <code>BLOB_READ_WRITE_TOKEN</code>{" "}
              mangler. Ingen rapporter kan tas imot eller vises.
            </p>
          )}

          {/* ── DET SOM VENTER ─────────────────────────────────────────── */}
          {venter.length > 0 && (
            <section className="mt-7 rounded-flate border-2 border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-5 py-4">
              <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-varsel uppercase">
                Venter på deg
              </h2>
              <ul className="mt-2.5 flex flex-col gap-2">
                {venter.map((v, i) => (
                  <li key={i}>
                    <Link
                      href={`/rapport/${v.type}/${v.id}`}
                      className="group flex flex-wrap items-baseline gap-x-2.5 rounded-interaktiv text-[0.9375rem] text-blekk"
                    >
                      <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-varsel uppercase">
                        {v.hva}
                      </span>
                      <span className="group-hover:underline">{v.tekst}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── SISTE RAPPORT ──────────────────────────────────────────── */}
          {siste ? (
            <Link
              href={`/rapport/${siste.type}/${siste.id}`}
              className="group mt-7 block rounded-flate border border-kant bg-kort px-5 py-5 transition-colors hover:border-kant-sterk motion-reduce:transition-none"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Dommerke niva={siste.niva} stor />
                <span className="font-sans text-[0.75rem] tracking-[0.08em] text-blekk-svak uppercase">
                  Uke {siste.week} · {siste.periode}
                </span>
              </div>
              <p className="mt-3 text-[1.25rem] leading-snug font-medium text-pretty text-blekk group-hover:text-aksent-tekst">
                {siste.kort}
              </p>
              <p className="mt-2 text-[0.8125rem] text-blekk-svak">
                Kom inn {norskTidspunkt(siste.mottatt)}
              </p>
            </Link>
          ) : (
            <p className="mt-7 rounded-flate border border-dashed border-kant px-5 py-8 text-center text-[0.9375rem] text-pretty text-blekk-svak">
              {tester.length > 0
                ? "Ingen ekte rapporter ennå — bare testdataene nederst. Den planlagte oppgaven leverer den første mandag morgen."
                : "Ingen rapporter ennå. Den planlagte oppgaven leverer den første mandag morgen."}
            </p>
          )}

          {/* ── HELE HISTORIKKEN SOM FIL ───────────────────────────────── */}
          {ekte.length > 0 && (
            <section className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-flate border border-kant px-5 py-4">
              <div className="max-w-[46ch]">
                <h2 className="font-sans text-[0.9375rem] font-medium text-blekk">
                  Ta med rapportene som kontekst
                </h2>
                {/*
                  Setningen sier hva filen inneholder, ikke hvor god den er.
                  Se `Nedlastingsknapp` for hvorfor det siste punktet står
                  der.
                */}
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
                  Én Markdown-fil med alle {ekte.length} ukene: tall, varsler,
                  stegene og det du har krysset av og svart. Testdataene er ikke
                  med. Filen inneholder kundenavn og annonseforbruk.
                </p>
              </div>
              <Nedlastingsknapp antall={ekte.length} />
            </section>
          )}

          {/* ── ARKIV ──────────────────────────────────────────────────── */}
          {ekte.length > 1 && (
            <section className="mt-10">
              <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                Tidligere uker
              </h2>
              <ul className="mt-2.5 overflow-hidden rounded-flate border border-kant bg-kort">
                {ekte.slice(1).map((r) => (
                  <li
                    key={`${r.type}-${r.id}`}
                    className="border-t border-kant first:border-t-0"
                  >
                    <Link
                      href={`/rapport/${r.type}/${r.id}`}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-dempet motion-reduce:transition-none sm:px-5"
                    >
                      <span className="w-[4.5rem] shrink-0 font-sans text-[0.8125rem] tabular-nums text-blekk-svak">
                        Uke {r.week}
                      </span>
                      <span className="shrink-0">
                        <Dommerke niva={r.niva} />
                      </span>
                      <span className="min-w-0 flex-1 text-[0.9375rem] text-pretty text-blekk-dempet">
                        {r.kort}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── TESTRAPPORTER, TYDELIG ATSKILT ─────────────────────────── */}
          {tester.length > 0 && (
            <section className="mt-10">
              <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
                Testdata · {tester.length}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-[62ch] text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
                  Holdt utenfor arkivet, trendene og «venter på deg». Tallene er
                  ikke ekte.
                </p>
                <Slettknapp antall={tester.length} />
              </div>
              <ul className="mt-2.5 overflow-hidden rounded-flate border border-dashed border-kant">
                {tester.map((r) => (
                  <li
                    key={`${r.type}-${r.id}`}
                    className="border-t border-kant first:border-t-0"
                  >
                    <Link
                      href={`/rapport/${r.type}/${r.id}`}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-2.5 transition-colors hover:bg-dempet motion-reduce:transition-none"
                    >
                      <span className="w-[4.5rem] shrink-0 font-sans text-[0.8125rem] tabular-nums text-blekk-svak">
                        Uke {r.week}
                      </span>
                      <span className="shrink-0">
                        <Dommerke niva={r.niva} />
                      </span>
                      <span className="min-w-0 flex-1 text-[0.875rem] text-pretty text-blekk-svak">
                        {r.kort}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </Container>
  );
}
