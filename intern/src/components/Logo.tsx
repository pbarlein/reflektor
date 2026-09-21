/**
 * Ordmerket, satt i display-serifen med en oransje prikk.
 *
 * Ikke en SVG-fil: hovedprosjektets logo er merkevaren og hører hjemme der.
 * Dette er intranettets egen etikett — samme typografi, tydelig merket
 * «internt», slik at et skjermbilde herfra aldri kan forveksles med
 * reflektor.no.
 */
export function Logo() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="display text-[1.375rem] leading-none tracking-[-0.02em] text-pa-dyp">
        Reflektor
      </span>
      <span
        aria-hidden
        className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-aksent"
      />
      <span className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
        Internt
      </span>
    </span>
  );
}
