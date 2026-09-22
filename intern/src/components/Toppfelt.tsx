import Link from "next/link";

import { Logo } from "@/components/Logo";
import { erRedaktor } from "@/lib/redaktor";
import { hentBruker } from "@/lib/tilgang";

/**
 * Toppfeltet.
 *
 * RENDRER INGENTING UTEN INNLOGGET BRUKER, og det er derfor det kan stå i
 * layouten. Innloggingssiden deler layout med resten — å bygge to layouter
 * for å slippe én betingelse ville vært dyrere.
 *
 * Klistret, fordi dette er en side man ruller mye i. `backdrop-blur` og en
 * halvgjennomsiktig flate, så innholdet forsvinner under uten å bli borte.
 */
export async function Toppfelt() {
  const bruker = await hentBruker();
  if (!bruker) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-kant bg-[rgba(246,244,241,0.85)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-interaktiv transition-opacity hover:opacity-70 motion-reduce:transition-none"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {/*
            GJENNOMGANGSKNAPPEN VISES KUN FOR REDAKTØRER. For alle andre
            finnes den ikke — ikke nedtonet, ikke låst. En knapp man ikke
            kan bruke, er en knapp man lurer på hva gjør.
          */}
          {erRedaktor(bruker) && (
            <Link
              href="/gjennomgang"
              className="rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-1.5 text-[0.8125rem] font-medium text-varsel transition-colors hover:border-varsel motion-reduce:transition-none"
            >
              Til gjennomgang
            </Link>
          )}

          {/*
            E-POSTEN OG IKKE NAVNET, der det er plass. På et intranett er
            det verdifulle å se HVILKEN konto man er innlogget med — folk
            har ofte to Google-kontoer i samme nettleser, og «Magne» svarer
            ikke på det spørsmålet.
          */}
          <span className="hidden text-[0.8125rem] text-blekk-dempet sm:inline">
            {bruker.epost}
          </span>
          {/*
            POST OG IKKE EN LENKE. En GET-utlogging kan utløses av et
            <img src="/api/auth/logg-ut"> hvor som helst. Ikke farlig, men
            det ser ut som en feil i intranettet.
          */}
          <form action="/api/auth/logg-ut" method="post">
            <button
              type="submit"
              className="rounded-interaktiv border border-kant px-3.5 py-1.5 text-[0.8125rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
            >
              Logg ut
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
