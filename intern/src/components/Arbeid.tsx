import { ARBEIDSLINJE } from "@/content/arktype";
import type { Skissedel } from "@/content/maltype";

/**
 * Det man ser mens Claude jobber.
 *
 * ── HVORFOR IKKE TEKSTEN SOM STRØMMER ─────────────────────────────────────
 *
 * Første utgave lot teksten renne inn i vinduet mens den ble skrevet. Det
 * ser imponerende ut i ti sekunder, og så begynner man å lese. Da leser man
 * et halvferdig dokument, danner seg en mening om en setning som ikke er
 * ferdig, og ruller oppover for å se om det som forsvant var viktig.
 *
 * Her er svaret struktur, ikke tekst — det finnes ikke et halvferdig
 * dokument å vise. Det som finnes, er hvor langt Claude har kommet, og det
 * er nok: man skal vite at det går framover, ikke lese over skulderen.
 *
 * ── MÅLT, IKKE PÅFUNNET ───────────────────────────────────────────────────
 *
 * Tallene kommer fra strømmen: hver del som er ferdig utfylt, teller. En
 * framdriftslinje som beveger seg av seg selv og står på 90 % mens noe
 * henger, er verre enn ingen linje. Denne står stille når Claude tenker,
 * og det er riktig.
 */
export function Arbeid({
  deler,
  gjort,
  rettelse,
  fase,
  sok,
}: {
  deler: readonly Skissedel[];
  gjort: number;
  rettelse: boolean;
  fase: "research" | "skriver";
  /** Søkene som er gjort, nyeste sist. Modellens egne ord. */
  sok: readonly string[];
}) {
  const andel = deler.length ? Math.min(gjort / deler.length, 1) : 0;

  /*
   * ── RESEARCHFASEN HAR INGEN TELLER, OG SKAL IKKE FÅ EN ────────────────
   *
   * Vi vet ikke hvor mange søk som trengs — det bestemmer Claude underveis.
   * En prosentlinje her måtte vært funnet på. Søkeordene er bedre: de sier
   * nøyaktig hva som skjer, med modellens egne ord, og de er verdt å lese.
   */
  if (fase === "research") {
    return (
      <div className="rounded-flate border border-kant bg-kort p-6 sm:p-8">
        <p className="font-sans text-[0.8125rem] font-medium tracking-[0.08em] text-aksent-tekst uppercase">
          Undersøker kunden
        </p>
        <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
          Claude søker opp hva bedriften driver med, hvordan de er bygget opp,
          og hva som er god praksis for akkurat dette dokumentet. Du får se
          hva den fant, med kilder, før dokumentet lages.
        </p>

        {sok.length > 0 && (
          <ol className="mt-6 flex flex-col gap-2.5">
            {sok.map((q, i) => {
              const siste = i === sok.length - 1;
              return (
                <li
                  key={`${q}-${i}`}
                  className={`flex items-center gap-3 text-[0.9375rem] ${
                    siste ? "text-blekk" : "text-blekk-svak"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.625rem] ${
                      siste
                        ? "animate-pulse border border-aksent"
                        : "bg-aksent text-[color:var(--text-on-accent)]"
                    }`}
                  >
                    {siste ? "" : "✓"}
                  </span>
                  <span className="min-w-0 truncate">{q}</span>
                </li>
              );
            })}
          </ol>
        )}

        <p aria-live="polite" className="sr-only">
          {sok.length
            ? `Søker på ${sok[sok.length - 1]}.`
            : "Claude undersøker kunden."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-flate border border-kant bg-kort p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-sans text-[0.8125rem] font-medium tracking-[0.08em] text-aksent-tekst uppercase">
          {rettelse ? "Retter dokumentet" : "Lager dokumentet"}
        </p>
        <p className="font-sans text-[0.8125rem] tabular-nums text-blekk-svak">
          {gjort} av {deler.length}
        </p>
      </div>

      {/*
        Striper og ikke en prosentsirkel: dokumentet HAR deler, og en stripe
        per del sier hvor mye som gjenstår uten å oversette det til et tall
        ingen har bedt om.
      */}
      <div className="mt-5 flex gap-1.5" aria-hidden>
        {deler.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
              i < gjort
                ? "bg-aksent"
                : i === gjort
                  ? "animate-pulse bg-[color:var(--surface-accent-soft)]"
                  : "bg-kant"
            }`}
          />
        ))}
      </div>

      <ol className="mt-6 flex flex-col gap-3">
        {deler.map((d, i) => {
          const ferdig = i < gjort;
          const naa = i === gjort;
          return (
            <li
              key={`${d}-${i}`}
              className={`flex items-center gap-3 text-[0.9375rem] transition-colors duration-500 motion-reduce:transition-none ${
                ferdig
                  ? "text-blekk-dempet"
                  : naa
                    ? "text-blekk"
                    : "text-blekk-svak"
              }`}
            >
              <span
                aria-hidden
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.625rem] ${
                  ferdig
                    ? "bg-aksent text-[color:var(--text-on-accent)]"
                    : naa
                      ? "border border-aksent"
                      : "border border-kant"
                }`}
              >
                {ferdig ? "✓" : ""}
              </span>
              {ARBEIDSLINJE[d]}
              {naa && <span className="sr-only">— pågår</span>}
            </li>
          );
        })}
      </ol>

      <p aria-live="polite" className="sr-only">
        {gjort === 0
          ? "Claude leser gjennom skjemaet."
          : `${gjort} av ${deler.length} deler er ferdige.`}
      </p>

      <div
        className="mt-6 h-1 w-full overflow-hidden rounded-full bg-dempet"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-aksent transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.max(4, andel * 100)}%` }}
        />
      </div>
    </div>
  );
}
