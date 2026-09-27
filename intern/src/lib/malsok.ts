/**
 * Søket i malvelgeren.
 *
 * Ligger for seg selv fordi det er den eneste delen av velgeren som har en
 * riktig og en gal oppførsel — resten er utseende og fokus. Her kan den
 * prøves uten en nettleser.
 */

export type Sokbar = {
  navn: string;
  kort: string;
  ansvarlig: string;
  naar: string;
  fase: string;
  /** Tidligere navn malen fortsatt skal finnes på. Se `Mal.kallenavn`. */
  kallenavn?: readonly string[];
};

/**
 * Treffer malen søket?
 *
 * ── HVORFOR DET SØKES I ALT, OG IKKE BARE I NAVNET ────────────────────────
 *
 * En produsent husker ikke alltid hva dokumentet heter. Hen husker at det
 * er «det vi sender etter møtet», eller at det er noe kundeansvarlig lager.
 * Søker man bare i navnet, må man kunne navnet fra før — og da trenger man
 * ikke søke.
 *
 * Hvert ord behandles for seg, slik at «plan opptak» treffer på tvers av
 * feltene. Alle ordene må treffe: å legge til et ord skal snevre inn, aldri
 * utvide.
 */
export function treffer(m: Sokbar, spørring: string): boolean {
  const ord = spørring.toLowerCase().split(/\s+/).filter(Boolean);
  if (!ord.length) return true;

  const høystakk =
    `${m.navn} ${m.kort} ${m.ansvarlig} ${m.naar} ${m.fase} ${(m.kallenavn ?? []).join(" ")}`.toLowerCase();
  return ord.every((o) => høystakk.includes(o));
}
