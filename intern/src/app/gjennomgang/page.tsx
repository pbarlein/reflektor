import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { finnKategori } from "@/content/kategorier";
import {
  I_DRIFT,
  TIL_GJENNOMGANG,
  gjennomgangPerRolle,
} from "@/content/rubrikker";
import { erRedaktor } from "@/lib/redaktor";
import { krevBruker } from "@/lib/tilgang";
import { lesetid } from "@/lib/lesetid";

export const metadata: Metadata = { title: "Til gjennomgang" };

/**
 * Arbeidsbenken for det som er skrevet, men ikke satt i drift.
 *
 * ── HVORFOR DEN FINNES ────────────────────────────────────────────────────
 *
 * Huben lanserte med to rubrikker per kategori. Det er ikke fordi resten er
 * dårlig — det er fordi en fasit ikke kan være halvt vedtatt. De øvrige
 * tekstene er skrevet, lagret og versjonert, og de venter her på at noen
 * med fagansvar sier ja.
 *
 * ── SORTERT ETTER ROLLE, IKKE ETTER KATEGORI ──────────────────────────────
 *
 * Fordi det er slik jobben faktisk fordeles. Den som skal gå gjennom
 * opptaksrutinene, skal se sin egen bunke — ikke lete i en liste på
 * trettifire.
 *
 * ── `notFound()` OG IKKE `redirect()` ─────────────────────────────────────
 *
 * En omdirigering forteller den som ikke har tilgang at siden finnes. En
 * 404 sier ingenting. Det spiller liten rolle her — alt innholdet er
 * ansattes eget fagstoff — men det er den billigste av to like enkle
 * varianter, og da er det ingen grunn til å velge den andre.
 */
export default async function Gjennomgang() {
  const bruker = await krevBruker();
  if (!erRedaktor(bruker)) notFound();

  const grupper = gjennomgangPerRolle();

  return (
    <Container>
      <div className="py-8 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
        >
          <span aria-hidden>←</span> Tilbake til huben
        </Link>

        <div className="mt-7 max-w-[46rem]">
          <p className="font-sans text-xs font-medium tracking-[0.08em] text-varsel uppercase">
            Kun for deg
          </p>
          <h1 className="display mt-4 text-[2.25rem] leading-[1.02] tracking-[-0.03em] text-pretty text-blekk sm:text-[3rem]">
            {TIL_GJENNOMGANG.length} tekster venter på at noen sier ja
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
            Huben er i drift med {I_DRIFT.length} rubrikker — to per kategori.
            Disse {TIL_GJENNOMGANG.length} er skrevet og lagret, men vises ikke
            for de ansatte. De er ikke borte, og ingenting er slettet.
          </p>
        </div>

        {/*
          HVA «GODKJENNE» FAKTISK BETYR I DAG. Siden kan leses, men ikke
          klikkes godkjent — det krever en database å skrive til, og den
          finnes ikke ennå. Å late som om knappen finnes, ville vært verre
          enn å si det.
        */}
        <div className="mt-8 max-w-[46rem] rounded-flate border border-kant bg-kort px-5 py-4">
          <p className="text-[0.9375rem] leading-relaxed text-blekk">
            <strong className="font-medium">Slik fungerer det nå:</strong> les
            en tekst, og si fra hvilke som er godkjent — eller hva som må
            endres. Da settes de i drift og dukker opp i huben for alle.
          </p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-blekk-dempet">
            Å kunne trykke «godkjent» her og få det lagret, krever en database
            siden ikke har ennå. Den kan bygges når bunken begynner å bli liten
            nok til at knappen er verdt det.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {grupper.map(({ rolle, rubrikker }) => (
            <section key={rolle} aria-labelledby={`rolle-${rolle}`}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-kant-regel pt-5">
                <h2
                  id={`rolle-${rolle}`}
                  className="display text-[1.75rem] leading-tight tracking-[-0.02em] text-blekk"
                >
                  {rolle}
                </h2>
                <p className="text-[0.9375rem] text-blekk-dempet">
                  {rubrikker.length} tekster ·{" "}
                  {rubrikker.reduce((s, r) => s + lesetid(r), 0)} minutter i alt
                </p>
              </div>

              <ul className="mt-4 flex flex-col">
                {rubrikker.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/rubrikk/${r.slug}`}
                      className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-kant py-3.5 transition-colors hover:bg-kort motion-reduce:transition-none"
                    >
                      <span className="w-28 shrink-0 font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-blekk-svak uppercase">
                        {finnKategori(r.kategori).kort}
                      </span>
                      <span className="min-w-0 flex-1 text-[1.0625rem] text-pretty text-blekk group-hover:underline group-hover:underline-offset-4">
                        {r.tittel}
                      </span>
                      <span className="text-[0.8125rem] text-blekk-svak tabular-nums">
                        {lesetid(r)} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
