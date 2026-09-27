import type { Uke } from "@/content/rapporttype";
import { kr, tall } from "@/lib/rapportformat";

/**
 * Pris per lead, tolv uker, med grensen synlig.
 *
 * ── HVORFOR SØYLER OG IKKE EN LINJE ───────────────────────────────────────
 *
 * En uke uten leads har ingen pris per lead. En linje måtte enten hoppet
 * over uka eller trukket en strek gjennom den — og begge deler lyver: den
 * ene skjuler at det ble brukt penger, den andre finner på et tall.
 *
 * Søyler har ikke det problemet. Mangler søylen, er det fordi det ikke kom
 * noen leads, og da står det «0 leads» der i stedet. Det er den uka Pål
 * skal se.
 *
 * ── FARGENE ER FRAMHEVING, IKKE KATEGORIER ────────────────────────────────
 *
 * Én serie. Søylene over grensen er i varselfargen, resten i en dempet grå.
 * Det er ikke to kategorier — det er ett tall og en terskel.
 *
 * Paret er kjørt gjennom fargevalidatoren mot hvit flate:
 *   #B3341A ↔ #BFB5A8 — ΔE 30,5 normalt syn, 26,5 deutan, 32,0 tritan.
 * Første forsøk var #7A6A60, som strøk med ΔE 14,6 — to søyler ved siden av
 * hverandre ville vært vanskelige å skille selv med fullt fargesyn.
 *
 * Den dempede grå ligger under 3:1 mot hvitt. Det er med vilje — den skal
 * vike — og validatoren krever da at tallene også finnes i tekst. Derfor
 * står tabellen under grafen, ikke som et tillegg, men som forutsetningen
 * for at grafen får lov til å se sånn ut.
 */

const OVER = "#B3341A";
const UNDER = "#BFB5A8";

export function Ukegraf({
  uker,
  grense,
}: {
  uker: readonly Uke[];
  /** Grensen fra rapporten, ikke en vi har funnet på. */
  grense: number;
}) {
  if (!uker.length) return null;

  /*
   * Skalaen må ha plass til både den dyreste uka og grenselinja, ellers
   * havner linja utenfor grafen de ukene alt er billig.
   */
  const tak = Math.max(...uker.map((u) => u.cpl ?? 0), grense) * 1.12;
  const hoyde = (v: number) => `${Math.max(1.5, (v / tak) * 100)}%`;

  return (
    <figure className="m-0">
      {/*
        ── ETIKETTEN HAR SIN EGEN PLASS ────────────────────────────────────
        Første forsøk la den over grenselinja til høyre. Den ble malt over av
        uke 38, som tilfeldigvis var en høy søyle — teksten sto der, men var
        uleselig. Å heve den med z-index ville bare snudd problemet: da
        dekker etiketten søylen.

        Nå er det avsatt en renne til høyre som søylene ikke får bruke.
        Linja går tvers over, etiketten står i rennen, og de kan ikke kollidere
        uansett hvordan tallene ser ut. På telefon er rennen for dyr — der
        står grensen i bildeteksten i stedet.
      */}
      <div className="relative h-[190px] w-full pr-0 sm:pr-[6.5rem]">
        <div
          aria-hidden
          className="absolute inset-x-0 border-t border-dashed border-[color:var(--kant-sterk)] sm:right-[6.5rem]"
          style={{ bottom: hoyde(grense) }}
        >
          <span className="absolute top-1/2 left-full ml-2 hidden -translate-y-1/2 font-sans text-[0.6875rem] whitespace-nowrap tracking-[0.04em] text-blekk-dempet sm:block">
            {kr(grense)} per lead
          </span>
        </div>

        <ol className="flex h-full w-full items-end gap-[2px]">
          {uker.map((u) => {
            const over = u.cpl !== null && u.cpl > grense;
            return (
              <li
                key={u.w}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                {/*
                  Verdien vises ved hover og ved tastaturfokus — og bare der
                  det finnes en peker. På en telefon er det ingen hover, og
                  bobla stakk 9 px utenfor skjermen på de siste søylene og ga
                  hele siden vannrett rulling.

                  Ingenting går tapt: tallene står i tabellen under, som
                  uansett er påkrevd her. Se kommentaren over.
                */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-interaktiv border border-kant bg-kort px-2 py-1 font-sans text-[0.6875rem] whitespace-nowrap text-blekk opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none sm:block">
                  Uke {u.w} · {kr(u.cost)} · {u.leads} leads
                </span>

                {u.cpl === null ? (
                  <span
                    className="mb-0 flex h-full items-end justify-center"
                    title={`Uke ${u.w}: ${tall(u.leads)} leads`}
                  >
                    {u.cost > 0 && (
                      <span
                        aria-hidden
                        className="mb-0.5 block h-1.5 w-1.5 rounded-full bg-[color:var(--varsel)]"
                      />
                    )}
                  </span>
                ) : (
                  <span
                    /* 4 px avrundet topp, forankret i grunnlinja. */
                    className="block w-full rounded-t-[4px]"
                    style={{
                      height: hoyde(u.cpl),
                      background: over ? OVER : UNDER,
                    }}
                  />
                )}

                <span className="mt-1.5 block text-center font-sans text-[0.625rem] tabular-nums text-blekk-svak">
                  {u.w}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
        Pris per lead, Meta og Google samlet. Rød søyle er over grensen på{" "}
        {kr(grense)}. En prikk betyr at det ble brukt penger uten at det kom
        leads — da finnes det ingen pris per lead å tegne. Ukestall svinger mye
        når det er få leads, så dommen styres av snittet for fire uker.
      </figcaption>
    </figure>
  );
}

/**
 * Tallene bak grafen.
 *
 * Ikke et tillegg for spesielt interesserte. Den dempede søylefargen ligger
 * under 3:1 mot flaten, og da er tekstversjonen påkrevd — ikke valgfri.
 */
export function Uketabell({
  uker,
  grense,
}: {
  uker: readonly Uke[];
  grense: number;
}) {
  return (
    <table className="mt-5 w-full border-collapse text-[0.8125rem]">
      <caption className="sr-only">
        Forbruk, leads og pris per lead per uke, siste tolv uker.
      </caption>
      <thead>
        <tr className="text-blekk-svak">
          <th scope="col" className="py-1.5 text-left font-medium">
            Uke
          </th>
          <th scope="col" className="py-1.5 text-right font-medium">
            Brukt
          </th>
          <th scope="col" className="py-1.5 text-right font-medium">
            Leads
          </th>
          <th scope="col" className="py-1.5 text-right font-medium">
            Per lead
          </th>
        </tr>
      </thead>
      <tbody>
        {uker.map((u) => (
          <tr key={u.w} className="border-t border-kant">
            <td className="py-1.5 tabular-nums text-blekk-dempet">{u.w}</td>
            <td className="py-1.5 text-right tabular-nums text-blekk-dempet">
              {kr(u.cost)}
            </td>
            <td className="py-1.5 text-right tabular-nums text-blekk-dempet">
              {u.leads}
            </td>
            <td
              className={`py-1.5 text-right tabular-nums ${
                u.cpl !== null && u.cpl > grense
                  ? "font-medium text-varsel"
                  : "text-blekk-dempet"
              }`}
            >
              {u.cpl === null ? (u.cost > 0 ? "0 leads" : "–") : kr(u.cpl)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
