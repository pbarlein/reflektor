import Link from "next/link";

import { Logo } from "@/components/Logo";
import { hentBruker } from "@/lib/tilgang";

/**
 * Toppfeltet.
 *
 * RENDRER INGENTING UTEN INNLOGGET BRUKER, og det er derfor det kan stå i
 * layouten. Innloggingssiden deler layout med resten — å bygge to layouter
 * for å slippe én betingelse her hadde vært dyrere.
 *
 * Klistret, fordi huben er en side man skroller i og «tilbake til toppen»
 * skal være ett klikk unna uansett hvor man er. `backdrop-blur` og en
 * halvgjennomsiktig flate, så klippene bak forsvinner under uten å bli
 * borte — det er samme materiale som glassflaten, i tynnere lag.
 */
export async function Toppfelt() {
  const bruker = await hentBruker();
  if (!bruker) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--kant-pa-dyp)] bg-[rgba(27,15,12,0.82)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[84rem] items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="rounded-interaktiv transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {/*
            E-POSTEN OG IKKE NAVNET, på skjermer der det er plass. På et
            intranett er det verdifulle å kunne se HVILKEN konto man er
            innlogget med — folk har ofte to Google-kontoer i samme
            nettleser, og «Magne» svarer ikke på spørsmålet om det er
            jobbkontoen.
          */}
          <span className="hidden text-[0.8125rem] text-pa-dyp-svak sm:inline">
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
              className="rounded-interaktiv border border-[color:var(--kant-pa-dyp)] px-3.5 py-1.5 text-[0.8125rem] font-medium text-pa-dyp-dempet transition-colors hover:border-aksent hover:text-pa-dyp motion-reduce:transition-none"
            >
              Logg ut
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
