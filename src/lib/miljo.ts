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
 * Om GTM-containeren skal lastes i det hele tatt.
 *
 * LAGT TIL 27.09.2026 ETTER MÅLING. GTM sin egen dekningsrapport viser at
 * containeren allerede fyrer på `reflektor-ny.vercel.app` — inkludert `/takk`
 * — og på minst tre Vercel-forhåndsvisninger. Sidevisningene derfra havner i
 * den ekte GA4-eiendommen og blandes med trafikken til den levende siden.
 *
 * Konverteringen er ikke rammet: både Ads-taggen og GA4-nøkkelhendelsen
 * krever at referreren inneholder reflektor.no, og det gjør den ikke fra en
 * vercel.app-adresse. Men `page_view`, `session_start` og `first_visit` telles,
 * og de er grunnlaget for alt annet i rapportene.
 *
 * Sporing følger derfor samme bryter som indeksering: begge skal snus i samme
 * øyeblikk, når DNS peker hit. Det er hele poenget med å ha én bryter.
 *
 * `NEXT_PUBLIC_TILLAT_SPORING=true` finnes for det ene tilfellet der man
 * bevisst vil teste containeren mot en forhåndsvisning. Den skal skrus av
 * igjen etterpå — hver sidevisning den slipper gjennom er støy i tallene som
 * måler Reflektors eneste KPI.
 */
export function tillatSporing(): boolean {
  return (
    tillatIndeksering() || process.env.NEXT_PUBLIC_TILLAT_SPORING === "true"
  );
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
