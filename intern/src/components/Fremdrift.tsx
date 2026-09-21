import Link from "next/link";

import { Medieflate } from "@/components/Medieflate";
import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Framdriften, og den ene tingen du bør åpne nå.
 *
 * ── HVORFOR ÉN ANBEFALING OG IKKE EN LISTE ────────────────────────────────
 *
 * Huben har femti rubrikker fordelt på ti rader. For den som kan den, er
 * det et oppslagsverk. For den som er ny, er det femti like store dører.
 *
 * Denne boksen gjør det motsatte av resten av siden: den fjerner valg. Ett
 * kort, én handling, og en grunn til at det er akkurat det kortet. Det er
 * det eneste stedet på forsiden som PEKER.
 *
 * ── FRAMDRIFTEN ER MOTIVASJONEN, IKKE KONTROLLEN ──────────────────────────
 *
 * Tallet står der fordi en teller som beveger seg er noe av det få som får
 * folk til å komme tilbake til et oppslagsverk frivillig. Det er også
 * grunnen til at det står «du» og ikke «ansatte»: statusen ligger i din
 * egen nettleser, ingen andre ser den, og den er ikke en kvittering noen
 * kan be om. Se src/lib/lesing.ts.
 */
export function Fremdrift({
  antall,
  lest,
  neste,
  ugodkjente,
}: {
  antall: number;
  lest: number;
  neste: Rubrikk | undefined;
  ugodkjente: number;
}) {
  const andel = antall === 0 ? 0 : Math.round((lest / antall) * 100);

  return (
    <section
      aria-labelledby="fremdrift"
      className="overflow-hidden rounded-medie border border-kant bg-kort"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 pt-5 sm:px-7 sm:pt-6">
        <h2
          id="fremdrift"
          className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase"
        >
          Din framdrift
        </h2>
        <p className="text-[0.9375rem] text-blekk-dempet">
          <span className="font-medium text-blekk tabular-nums">{lest}</span> av{" "}
          <span className="tabular-nums">{antall}</span> lest
        </p>
      </div>

      {/*
        `<progress>` ville vært riktig element, men det kan ikke styles likt
        på tvers av nettlesere uten tre sett leverandørprefikser. En div med
        role og aria-verdier gir samme informasjon til hjelpemidler, og én
        strek å vedlikeholde.
      */}
      <div className="px-5 pt-3 sm:px-7">
        <div
          role="progressbar"
          aria-valuenow={lest}
          aria-valuemin={0}
          aria-valuemax={antall}
          aria-label={`${lest} av ${antall} rubrikker lest`}
          className="h-1.5 w-full overflow-hidden rounded-full bg-dempet"
        >
          <div
            className="h-full rounded-full bg-aksent transition-[width] duration-700 motion-reduce:transition-none"
            style={{ width: `${andel}%` }}
          />
        </div>
      </div>

      {neste ? (
        <Link
          href={`/rubrikk/${neste.slug}`}
          className="group mt-5 flex items-stretch gap-4 border-t border-kant transition-colors hover:bg-dempet motion-reduce:transition-none"
        >
          <div className="relative w-28 shrink-0 overflow-hidden sm:w-36">
            <Medieflate medie={neste.medie} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-5 sm:pr-7">
            <p className="font-sans text-[0.6875rem] font-medium tracking-[0.08em] text-aksent-tekst uppercase">
              {neste.fremhevet ? "Start her" : "Fortsett her"}
            </p>
            <p className="display mt-1.5 text-[1.25rem] leading-tight text-pretty text-blekk sm:text-[1.5rem]">
              {neste.tittel}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[0.875rem] leading-relaxed text-pretty text-blekk-dempet">
              {neste.fremhevet ?? neste.sammendrag}
            </p>
          </div>
          <span
            aria-hidden
            className="flex items-center pr-5 text-blekk-svak transition-transform group-hover:translate-x-1 motion-reduce:transition-none sm:pr-7"
          >
            →
          </span>
        </Link>
      ) : (
        <p className="mt-5 border-t border-kant px-5 py-5 text-[0.9375rem] text-blekk-dempet sm:px-7">
          Du har lest alt som ligger her. Nye rubrikker blir merket med{" "}
          <span className="font-medium text-blekk">Ny</span> på forsiden.
        </p>
      )}

      {ugodkjente > 0 && (
        /*
          DEN UBEHAGELIGE LINJA STÅR SIST, OG DEN STÅR HVER DAG.
          Innholdet er ment som obligatorisk lesing, men det meste er
          fagutkast som ingen har vedtatt. Å skjule det ville gjort huben
          til noe den ikke er ennå.
        */
        <p className="border-t border-kant px-5 py-3 text-[0.8125rem] text-blekk-svak sm:px-7">
          {ugodkjente} av {antall} er fagutkast som ikke er kvalitetssikret
          ennå. De er merket <span className="text-varsel">Utkast</span>.
        </p>
      )}
    </section>
  );
}
