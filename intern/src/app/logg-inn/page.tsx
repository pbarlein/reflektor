import type { Metadata } from "next";

import { Logo } from "@/components/Logo";
import { googleOppsett } from "@/lib/google";
import { harSesjonshemmelighet } from "@/lib/sesjon";
import { devInnloggingTillatt } from "@/lib/utvikling";

export const metadata: Metadata = { title: "Logg inn" };

/**
 * FEILTEKSTENE ER GROVKORNEDE MED VILJE. Brukeren får vite hva hen kan
 * gjøre, ikke hvilket krav i id_token som ikke stemte. Den som prøver seg,
 * skal ikke få et orakel som forteller om domenet var feil eller om
 * e-posten var ubekreftet.
 *
 * Unntaket er `mangler-oppsett`, som er en driftsfeil og ikke et
 * innloggingsforsøk. Der er en presis beskjed hele poenget.
 */
const FEIL: Record<string, string> = {
  "mangler-oppsett":
    "Google-innlogging er ikke satt opp på denne installasjonen. Se LES-MEG.md i intern/ for hvilke miljøvariabler som mangler.",
  avbrutt: "Innloggingen ble avbrutt.",
  "ugyldig-state":
    "Innloggingen tok for lang tid, eller ble startet i en annen fane. Prøv en gang til.",
  innveksling: "Fikk ikke svar fra Google. Prøv en gang til.",
  "ikke-tilgang":
    "Denne siden er kun for ansatte i Reflektor. Logg inn med din @reflektor.no-konto.",
};

export default async function LoggInn({
  searchParams,
}: {
  searchParams: Promise<{ feil?: string; neste?: string }>;
}) {
  const { feil, neste } = await searchParams;
  /*
   * BEGGE DELER MÅ VÆRE PÅ PLASS FOR AT INNLOGGING SKAL VIRKE. Google-
   * oppsettet får deg gjennom kontovelgeren; hemmeligheten er det
   * sesjonscookien signeres med. Mangler den siste, feiler flyten helt til
   * slutt, og feilen ser ut som et OAuth-problem uten å være det.
   */
  const oppsett = harSesjonshemmelighet() ? googleOppsett() : null;
  const manglerHemmelighet = !harSesjonshemmelighet();
  const dev = devInnloggingTillatt() && !manglerHemmelighet;

  const googleLenke = neste
    ? `/api/auth/google?neste=${encodeURIComponent(neste)}`
    : "/api/auth/google";

  return (
    /*
      `min-h-screen` og sentrert. Innloggingen er den eneste siden uten
      toppfelt og bunnfelt — de rendrer null uten bruker — så her er det
      ingenting annet som holder innholdet fra å ligge klistret i toppen.
    */
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-medie border border-kant bg-kort px-7 py-10 sm:px-9 sm:py-12">
          <Logo />

          <h1 className="display mt-8 text-[2.25rem] leading-[1.02] tracking-[-0.025em] text-blekk sm:text-[2.75rem]">
            Kun for ansatte
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
            Logg inn med Google-kontoen din på{" "}
            <span className="text-blekk">
              @{oppsett?.tillattDomene ?? "reflektor.no"}
            </span>
            .
          </p>

          {feil && FEIL[feil] && (
            /*
              `role="alert"` slik at meldingen leses opp med en gang den
              rendres. Uten den er en feilmelding etter en omdirigering
              usynlig for en skjermleserbruker — det er ingen fokusendring
              som avslører at noe nytt har kommet.
            */
            <p
              role="alert"
              className="mt-6 rounded-flate border border-[color:var(--varsel)]/45 bg-[color:var(--varsel-flate)] px-4 py-3.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk"
            >
              {FEIL[feil]}
            </p>
          )}

          {oppsett ? (
            <a
              href={googleLenke}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-interaktiv bg-aksent px-6 py-3.5 font-medium text-[color:var(--text-on-accent)] transition-colors hover:brightness-95 motion-reduce:transition-none"
            >
              {/* Googles G, tegnet inline. En ekstern logofil for én knapp
                  er et nettverkskall og en lisensvurdering til ingen nytte. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="size-5 shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.700v5.6h7.1c4.2-3.9 6.6-9.6 6.6-16.3z"
                />
                <path
                  fill="#34A853"
                  d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.6c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.8C7.9 41.1 15.4 46 24 46z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.6 27.9c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.8H4.3C2.8 16.8 2 20.3 2 23.8s.8 7 2.3 9.9l7.3-5.8z"
                />
                <path
                  fill="#EA4335"
                  d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.1 30 2 24 2 15.4 2 7.9 6.9 4.3 14l7.3 5.8c1.7-5.2 6.6-9.1 12.4-9.1z"
                />
              </svg>
              Logg inn med Google
            </a>
          ) : (
            <p className="mt-8 rounded-flate border border-dashed border-kant px-4 py-4 text-[0.9375rem] leading-relaxed text-blekk-dempet">
              {manglerHemmelighet ? (
                <>
                  <code className="text-blekk">SESJON_HEMMELIGHET</code>{" "}
                  mangler, eller er kortere enn 32 tegn. Uten den kan ingen
                  sesjon signeres. Lag en med{" "}
                  <code className="text-blekk">openssl rand -base64 48</code> —
                  se LES-MEG.md.
                </>
              ) : (
                <>
                  Google-innlogging mangler oppsett. Sett{" "}
                  <code className="text-blekk">GOOGLE_CLIENT_ID</code> og{" "}
                  <code className="text-blekk">GOOGLE_CLIENT_SECRET</code> — se
                  LES-MEG.md.
                </>
              )}
            </p>
          )}

          {dev && (
            /*
              Vises KUN lokalt, og bare når INTERN_DEV_INNLOGGING=true. Se
              src/lib/utvikling.ts for hvorfor det er to betingelser og ikke
              én. Endepunktet svarer 404 uansett hva denne knappen gjør,
              hvis betingelsene ikke holder.
            */
            <form action="/api/auth/dev" method="post" className="mt-4">
              <button
                type="submit"
                className="w-full rounded-interaktiv border border-dashed border-kant px-6 py-3 text-[0.9375rem] text-blekk-dempet transition-colors hover:border-aksent hover:text-blekk motion-reduce:transition-none"
              >
                Dev-innlogging (kun lokalt)
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 px-2 text-center text-[0.8125rem] leading-relaxed text-blekk-svak">
          Intranettet er ikke søkbart og skal ikke deles utenfor Reflektor.
        </p>
      </div>
    </div>
  );
}
