import type { Endring } from "@/content/rapporttype";
import { norskDato } from "@/lib/rapportformat";

/**
 * Endringer i annonsekontoene, lest av endringsloggen hos Meta og Google.
 *
 * ── HVORFOR DENNE SEKSJONEN FINNES ────────────────────────────────────────
 *
 * Mal v2.1 ble laget rundt én erkjennelse: et hopp i klikkpris eller
 * forbruk er ubrukelig uten å vite hva som ble endret i kontoen samtidig.
 * Uten loggen står man igjen med «Google virker ikke», når svaret kan være
 * «budstrategien ble byttet 31. august».
 *
 * Det er forskjellen på å stoppe en kanal og å rette en innstilling, og
 * det er den dyreste feilslutningen i hele rapporten. Derfor står
 * endringene FØR tallene de forklarer.
 *
 * ── DATOEN BÆRER SEKSJONEN ────────────────────────────────────────────────
 *
 * Malen sender `date_label` («31.8.») til e-posten, der plassen er trang.
 * Her er det plass til hele datoen, og den leses uten å tydes. `date` er
 * ISO og sorterbar; etiketten er bare et kortere navn på det samme.
 */
export function Endringene({ endringer }: { endringer: readonly Endring[] }) {
  if (!endringer.length) return null;

  /* Nyeste først. Malen sender dem ikke nødvendigvis sortert. */
  const sortert = [...endringer].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
        Endringer i kontoene
      </h2>
      <ol className="mt-3">
        {sortert.map((e, i) => (
          <li
            key={`${e.date}-${i}`}
            className="grid gap-x-5 gap-y-1 border-t border-kant py-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-sans text-[0.8125rem] tabular-nums text-blekk-dempet">
                {norskDato(e.date) || e.date_label}
              </span>
              {e.platform_name && (
                <span className="font-sans text-[0.6875rem] tracking-[0.08em] text-blekk-svak uppercase">
                  {e.platform_name}
                </span>
              )}
            </div>
            <p className="text-[0.9375rem] leading-relaxed text-pretty text-blekk">
              {e.what}
              {e.effect && (
                /*
                 * Virkningen er dempet, ikke skjult. Den er det eneste
                 * leddet som sier om endringen var riktig — men den er en
                 * observasjon i etterkant, ikke selve endringen.
                 */
                <span className="text-blekk-dempet"> — {e.effect}</span>
              )}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Hopp i tallene malen ikke fant en forklaring på.
 *
 * Står som varsel og ikke som en note, fordi det er en beskjed om at
 * grunnlaget er tynt: noe har flyttet seg mer enn 50 %, og endringsloggen
 * sier ikke hvorfor. Da skal ingen konkludere før noen har sett etter.
 */
export function Uforklart({ punkter }: { punkter: readonly string[] }) {
  if (!punkter.length) return null;

  return (
    <section className="rounded-flate border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-5 py-4">
      <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-varsel uppercase">
        Uforklart endring
      </h2>
      <ul className="mt-2 flex flex-col gap-1.5">
        {punkter.map((t, i) => (
          <li
            key={i}
            className="text-[0.9375rem] leading-relaxed text-pretty text-blekk"
          >
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-pretty text-blekk-dempet">
        Ingen endring i kontoen forklarer hoppet. Sjekk kontoen før du
        konkluderer med at kanalen ikke virker.
      </p>
    </section>
  );
}
