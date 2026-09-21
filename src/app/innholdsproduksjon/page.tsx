import type { Metadata } from "next";

import { Tjenestelayout } from "@/components/tjeneste/Tjenestelayout";
import { innholdsproduksjon } from "@/content/tjenester";
import { basisUrl } from "@/lib/miljo";

/**
 * /innholdsproduksjon
 *
 * Innholdet ligger i src/content/tjenester.ts, layouten i
 * src/components/tjeneste/Tjenestelayout.tsx. Denne fila er bare koblingen,
 * av samme grunn som forsiden ble splittet: rekkefølgen på seksjonene er
 * det man kommer hit for å se, og den skal ikke drukne i begrunnelser.
 *
 * Søkeordsgrunnlaget står i docs/synlighet-2026.md, avgrensningen mot de
 * andre tjenestesidene i docs/sidearkitektur.md.
 */
export const metadata: Metadata = {
  title: innholdsproduksjon.tittel,
  description: innholdsproduksjon.beskrivelse,
  alternates: { canonical: `${basisUrl()}/innholdsproduksjon` },
};

export default function Innholdsproduksjon() {
  return <Tjenestelayout side={innholdsproduksjon} nav />;
}
