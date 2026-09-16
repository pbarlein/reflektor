/**
 * Miljøstyring for indeksering og URL-er.
 *
 * Bakgrunn: den nye siden bygges parallelt med at reflektor.no fortsatt kjører
 * på Squarespace. En indekserbar kopi på en .vercel.app-URL ville konkurrert
 * mot den levende siden i søk. Derfor er indeksering AVSLÅTT SOM STANDARD, og
 * må slås på bevisst ved lansering.
 *
 * Vercel setter X-Robots-Tag: noindex på previews av seg selv, men IKKE på
 * produksjonsdeployments. Det er hullet dette lukker.
 *
 * Slik åpnes den ved lansering – først når DNS faktisk peker hit:
 *   NEXT_PUBLIC_TILLAT_INDEKSERING=true
 */
import { site } from "@/content/site";

export function tillatIndeksering(): boolean {
  return process.env.NEXT_PUBLIC_TILLAT_INDEKSERING === "true";
}

/**
 * Kanonisk URL for gjeldende miljø.
 *
 * Peker på det ekte domenet kun når indeksering er slått på. Ellers brukes
 * deployment-URL-en, slik at previews ikke sender canonical-signaler til den
 * levende Squarespace-siden.
 *
 * DETTE ER DEN ENESTE FUNKSJONEN SOM SKAL SI HVA SIDEN HETER. Gjennomgangen
 * 16.09.2026 fant domenet definert tre steder: her, som `site.domene` (som
 * ingenting brukte), og hardkodet fem steder i Schema.tsx pluss i forsidens
 * canonical. De to siste pekte på reflektor.no uansett miljø, altså på den
 * levende Squarespace-siden — fra en preview som ikke skal indekseres i det
 * hele tatt.
 *
 * Nå leser denne `site.domene`, og alt annet leser denne. Ved cutover snus
 * hele siden med én miljøvariabel.
 */
export function basisUrl(): string {
  if (tillatIndeksering()) return site.domene;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
