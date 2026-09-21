import type { Metadata } from "next";

import {
  FaqSchema,
  OrganisasjonSchema,
  TjenesteSchema,
} from "@/components/Schema";
import { hentTekst } from "@/components/Slot";
import { Anmeldelsesseksjon } from "@/components/forside/Anmeldelsesseksjon";
import { Arbeidet } from "@/components/forside/Arbeidet";
import { Arbeidsrutenett } from "@/components/forside/Arbeidsrutenett";
import { Bunnlogoer } from "@/components/forside/Bunnlogoer";
import { Faq } from "@/components/forside/Faq";
import { Hero } from "@/components/forside/Hero";
import { Kontakt } from "@/components/forside/Kontakt";
import { Logostripe } from "@/components/forside/Logostripe";
import { Pris } from "@/components/forside/Pris";
import { SlikFungererDet } from "@/components/forside/SlikFungererDet";
import { Vegg } from "@/components/forside/Vegg";
import { forsidensSporsmal } from "@/content/faq";
import { front } from "@/content/sider/front";
import { basisUrl } from "@/lib/miljo";

/**
 * Forsiden.
 *
 * DENNE FILA ER EN INNHOLDSFORTEGNELSE, ikke en side. Hver seksjon ligger i
 * src/components/forside/ med sin egen begrunnelse. Fram til 16.09.2026 lå
 * alt her — 997 linjer, hvorav 340 kode og 556 kommentar. Kommentarene er
 * prosjektets beslutningslogg og skal bli, men de gjorde fila umulig å
 * navigere: rekkefølgen på seksjonene, som er det man vanligvis kommer hit
 * for å se, druknet i begrunnelser for enkeltvalg.
 *
 * Splittingen er ren flytting. Den rendrede HTML-en er verifisert identisk
 * før og etter, tegn for tegn.
 *
 * SEKSJONSREKKEFØLGEN følger evidensen, ikke briefens kapittel 3.0.1:
 * tilbudet over folden → bevis → arbeidet → prosess → pris → sosialt bevis
 * → innvendinger → kontakt. Alle tre researchsporene fant den rekkefølgen
 * uavhengig av hverandre.
 */
export const metadata: Metadata = {
  title: hentTekst(front, "front.meta.title") ?? undefined,
  description: hentTekst(front, "front.meta.description") ?? undefined,
  // Absolutt URL fra basisUrl(), ikke hardkodet — se miljo.ts.
  alternates: { canonical: `${basisUrl()}/` },
};

export default function Forside() {
  return (
    <>
      {/*
        JSON-LD. Usynlig på siden, men det er her språkmodeller henter
        entitetsfakta — de kjører ikke JavaScript. Se Schema.tsx, og A41 i
        docs/vedlegg-a.md for hvorfor FAQ-markeringen står selv om Google
        sluttet å vise FAQ rich results 7. mai 2026.
      */}
      <OrganisasjonSchema />
      {/*
        `abonnementspris` er eksplisitt her og bare her. Fra 21.09.2026 er
        prisblokken avslått som standard i TjenesteSchema, fordi de fire
        prosjektsidene ikke koster 30 000 kr i måneden. Forsiden er den ene
        siden der påstanden er sann.
      */}
      <TjenesteSchema
        navn="Sosiale medier til fast månedspris"
        beskrivelse={hentTekst(front, "front.meta.description") ?? ""}
        sti="/"
        tjenestetype="Løpende produksjon og publisering i sosiale medier"
        abonnementspris
      />
      {/*
        Markeringen leser SAMME liste som seksjonen på siden. Før bygde den
        sin egen fra bare de seks slotsene, så siden viste ti spørsmål og
        markeringen oppga seks.
      */}
      <FaqSchema qa={forsidensSporsmal} />

      <Hero />
      <Logostripe />
      <Arbeidet />
      <SlikFungererDet />
      <Arbeidsrutenett />
      <Pris />
      <Anmeldelsesseksjon />
      <Vegg />
      <Faq />
      <Kontakt />
      <Bunnlogoer />
    </>
  );
}
