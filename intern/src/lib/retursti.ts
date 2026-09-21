/**
 * Validering av `?neste=`.
 *
 * En innloggingsside som sender brukeren videre til en adresse fra
 * spørrestrengen, ER en åpen videresending med mindre adressen begrenses.
 * Angrepet er velkjent: en lenke til VÅRT domene, med vår innlogging og vår
 * hengelås, som ender på angriperens side etterpå.
 *
 * Reglene, og hva hver av dem stopper:
 *
 *   må starte med «/»      → stopper https://angriper.no
 *   ikke «//» eller «/\»   → stopper protokollrelativ //angriper.no, som
 *                            nettleseren leser som et annet domene
 *   ikke «/api/»           → ingen grunn til å lande på et endepunkt, og
 *                            det er der en videresending ville vært mest
 *                            forvirrende
 */
export function trygtNeste(verdi: string | null | undefined): string {
  if (!verdi) return "/";
  if (!verdi.startsWith("/")) return "/";
  if (verdi.startsWith("//") || verdi.startsWith("/\\")) return "/";
  if (verdi.startsWith("/api/")) return "/";
  return verdi;
}
