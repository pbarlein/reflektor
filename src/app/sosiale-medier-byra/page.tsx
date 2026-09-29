import type { Metadata } from "next";

import { UnderArbeid } from "@/components/UnderArbeid";
import { basisUrl } from "@/lib/miljo";
import { kortBeskrivelse, landingssider } from "@/content/site";

const side = landingssider.find((s) => s.slug === "sosiale-medier-byra")!;

/**
 * Ingressen fra site.ts er 186 tegn — for lang for en beskrivelse. Her er
 * den kuttet ved siste hele setning. Ingen ny copy: setningene er ordrett de
 * samme, den siste er bare utelatt.
 *
 * KUTTET GJØRES NÅ AV `kortBeskrivelse`, ikke av et `split` på ordene «Ingen
 * bindingstid». Endret 29.09.2026: den gamle varianten var bundet til
 * nøyaktig den formuleringen, og ville stille sluttet å kutte — uten å feile
 * — den dagen setningen ble omskrevet. Layouten trengte samme grep, og da
 * skal det stå ett sted.
 */
const beskrivelse = kortBeskrivelse(side.ingress);

/**
 * EGEN BESKRIVELSE, selv om siden er en plassholder.
 *
 * Uten `description` her arvet ruten forsidens fallback fra layout.tsx —
 * `site.ingress` på 238 tegn. Google kutter ved rundt 158, og en avkuttet
 * beskrivelse er det første en annonseklikker ser i søk. Ingressen fra
 * site.ts er godkjent copy og holder seg innenfor.
 */
export const metadata: Metadata = {
  title: side.tittel,
  description: beskrivelse,
  alternates: { canonical: `${basisUrl()}/sosiale-medier-byra` },
  /*
   * NOINDEX PÅ PLASSHOLDEREN. Lagt til 29.09.2026 etter teknisk gjennomgang.
   *
   * Siden er en naken «Under arbeid»-side. Så lenge indekseringssperren står
   * spiller det ingen rolle, men sperren er én miljøvariabel, og denne
   * adressen skal 301-es til forsiden ved cutover (AGENTS.md). Snus bryteren
   * før redirecten er lagt inn — og det er to separate handlinger utført av
   * to forskjellige systemer — indekserer Google en tom side på den URL-en
   * Google Ads annonserer mot.
   *
   * Sitemapet utelater den allerede av samme grunn. Dette lukker den siste
   * veien inn. Kostnaden er null: adressen skal uansett aldri rangere, den
   * skal videre.
   */
  robots: { index: false, follow: true },
};

export default function SosialeMedierByra() {
  return <UnderArbeid sti="/sosiale-medier-byra" />;
}
