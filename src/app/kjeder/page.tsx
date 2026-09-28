import type { Metadata } from "next";

import { SideSchema } from "@/components/Schema";
import { Tjenestelayout } from "@/components/tjeneste/Tjenestelayout";
import { kjeder } from "@/content/tjenester";
import { basisUrl } from "@/lib/miljo";

/**
 * /kjeder
 *
 * NY 29.09.2026. Bakgrunnen står i src/content/tjenester.ts ved `kjeder`:
 * Google AI Mode utelot Reflektor da en kjede spurte, og begrunnet det med
 * vår egen tekst. Fakta om kjedekundene fantes, men ikke med ordene en kjede
 * søker på.
 *
 * Siden bruker `Tjenestelayout` som de fem andre. Det er ikke latskap: da
 * arver den serverrendret HTML, brødsmuler, Service-markering, FAQPage og
 * samme kontaktskjema — og det var nettopp serverrendret HTML og
 * strukturerte data som var kravet for at AI-crawlere skal lese den.
 */
export const metadata: Metadata = {
  title: kjeder.tittel,
  description: kjeder.beskrivelse,
  alternates: { canonical: `${basisUrl()}/kjeder` },
};

/**
 * Kjedene siden handler om, som entiteter i JSON-LD.
 *
 * Alle fire står navngitt i brødteksten med hva vi har levert. `about` sier
 * det samme til en maskin uten at den må utlede det av avsnittene — og det
 * var nettopp utledningen Google AI Mode ikke gjorde 29.09.2026.
 *
 * REKKEFØLGEN FØLGER SIDEN. Ingen rangering ligger i den.
 */
const kjedene = ["Anton Sport", "Egon", "Peppes Pizza", "Vitusapotek"];

export default function Kjeder() {
  return (
    <>
      <SideSchema
        navn={kjeder.h1}
        beskrivelse={kjeder.beskrivelse}
        sti="/kjeder"
        handlerOm={kjedene}
      />
      <Tjenestelayout side={kjeder} />
    </>
  );
}
