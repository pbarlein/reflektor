import type { Annonse } from "@/content/rapporttype";
import { kr } from "@/lib/rapportformat";

/**
 * Pris per lead per måned, én annonse om gangen.
 *
 * ── HVA DEN SKAL SVARE PÅ ─────────────────────────────────────────────────
 *
 * Bestilt: «per annonse: pris per lead per måned, så man ser når en annonse
 * blir slitt». Det er ett spørsmål, og det er et forløp: ble den dyrere?
 *
 * ── HVORFOR SMÅ MULTIPLER OG IKKE ÉN GRAF MED FLERE SERIER ────────────────
 *
 * Med tre annonser i samme graf blir fargene kategorier, og leseren må
 * holde en tegnforklaring i hodet mens han sammenligner. Hver annonse for
 * seg gir samme sammenligning uten det arbeidet — og det skalerer til ti
 * annonser uten å trenge ti farger, som uansett ikke ville latt seg skille.
 *
 * Fargen er den samme framhevingen som i ukegrafen: over grensen er rød,
 * under er dempet. Samme regel, samme to farger, hele veien.
 */

const OVER = "#B3341A";
const UNDER = "#BFB5A8";

function maaned(iso: string): string {
  const [aar, m] = iso.split("-");
  const navn = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  const i = Number(m) - 1;
  return navn[i] ? `${navn[i]}${aar ? ` ${aar.slice(2)}` : ""}` : iso;
}

export function Annonsegraf({
  annonser,
  grense,
}: {
  annonser: readonly Annonse[];
  grense: number;
}) {
  if (!annonser.length) return null;

  /* Felles skala på tvers av annonsene, ellers kan de ikke sammenlignes. */
  const alle = annonser.flatMap((a) =>
    a.monthly.map((m) => (m.leads ? m.cost / m.leads : 0)),
  );
  const tak = Math.max(...alle, grense) * 1.12;

  return (
    <ul className="mt-2 flex flex-col gap-4">
      {annonser.map((a, i) => (
        <li
          key={`${a.platform}-${a.campaign}-${a.ad}-${i}`}
          className="rounded-interaktiv border border-kant bg-kort px-3.5 py-3"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-[0.9375rem] font-medium text-blekk">
              {a.ad || a.campaign}
              <span
                className={`ml-2 rounded-sm px-1.5 py-0.5 font-sans text-[0.625rem] font-medium tracking-[0.08em] uppercase ${
                  a.on
                    ? "bg-[color:var(--varsel-flate)] text-varsel"
                    : "bg-dempet text-blekk-svak"
                }`}
              >
                {a.on ? "På" : "Av"}
              </span>
            </p>
            <p className="text-[0.75rem] text-blekk-svak">
              {a.campaign}
              {a.frequency_week
                ? ` · frekvens ${a.frequency_week.toFixed(1)}`
                : ""}
            </p>
          </div>

          {a.monthly.length > 0 ? (
            <ol className="mt-2.5 flex items-end gap-2">
              {a.monthly.map((m) => {
                const cpl = m.leads ? Math.round(m.cost / m.leads) : null;
                const over = cpl !== null && cpl > grense;
                return (
                  <li
                    key={m.month}
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <span className="mb-1 font-sans text-[0.6875rem] tabular-nums whitespace-nowrap text-blekk-dempet">
                      {cpl === null ? (m.cost > 0 ? "0 leads" : "–") : kr(cpl)}
                    </span>
                    <span className="flex h-[52px] w-full items-end">
                      {cpl !== null && (
                        <span
                          className="block w-full rounded-t-[4px]"
                          style={{
                            height: `${Math.max(3, (cpl / tak) * 100)}%`,
                            background: over ? OVER : UNDER,
                          }}
                        />
                      )}
                    </span>
                    <span className="mt-1 font-sans text-[0.625rem] whitespace-nowrap text-blekk-svak">
                      {maaned(m.month)}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-blekk-svak">
              Ingen måneder registrert på denne annonsen.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
