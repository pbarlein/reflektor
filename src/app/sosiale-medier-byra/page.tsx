import type { Metadata } from "next";

import { UnderArbeid } from "@/components/UnderArbeid";
import { basisUrl } from "@/lib/miljo";
import { landingssider } from "@/content/site";

const side = landingssider.find((s) => s.slug === "sosiale-medier-byra")!;

/**
 * Ingressen fra site.ts er 186 tegn — for lang for en beskrivelse. Her er
 * den kuttet ved siste hele setning som holder seg under 158. Ingen ny copy:
 * setningene er ordrett de samme, den siste er bare utelatt.
 */
const beskrivelse = side.ingress.split(" Ingen bindingstid")[0];

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
};

export default function SosialeMedierByra() {
  return <UnderArbeid sti="/sosiale-medier-byra" />;
}
