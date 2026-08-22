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
export function tillatIndeksering(): boolean {
  return process.env.NEXT_PUBLIC_TILLAT_INDEKSERING === "true";
}

/**
 * Kanonisk URL for gjeldende miljø.
 *
 * Peker på det ekte domenet kun når indeksering er slått på. Ellers brukes
 * deployment-URL-en, slik at previews ikke sender canonical-signaler til den
 * levende Squarespace-siden.
 */
export function basisUrl(): string {
  if (tillatIndeksering()) return "https://www.reflektor.no";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
