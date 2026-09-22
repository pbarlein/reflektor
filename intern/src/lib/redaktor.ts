import type { Bruker } from "@/lib/sesjon";

/**
 * Hvem som ser gjennomgangssiden.
 *
 * ── HVORFOR EN LISTE OG IKKE EN ROLLE I GOOGLE ────────────────────────────
 *
 * Reflektor er små. Å sette opp grupper i Google Workspace, lese dem ved
 * innlogging og holde dem i synk, er mer maskineri enn det er folk. En
 * liste med e-postadresser i koden er ærlig om hva det faktisk er: en
 * håndfull navn som endres sjelden.
 *
 * ── DETTE ER IKKE EN SIKKERHETSGRENSE ─────────────────────────────────────
 *
 * Og det skal det ikke være. Alt på gjennomgangssiden er Reflektors eget
 * fagstoff, skrevet for de samme ansatte som allerede er logget inn. Den
 * er skjult for å holde huben ryddig — ikke for å holde noen ute. Skulle
 * innholdet en dag være noe ansatte IKKE skal se, holder ikke dette, og da
 * må tilgangen flyttes til serveren for alvor.
 */
const REDAKTORER = ["pal@reflektor.no"];

export function erRedaktor(bruker: Bruker | null): boolean {
  if (!bruker) return false;
  return REDAKTORER.includes(bruker.epost.toLowerCase().trim());
}
