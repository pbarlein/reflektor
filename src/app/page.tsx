import type { Metadata } from "next";

import {
  FaqSchema,
  FilmSchema,
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
import { UtenomAbonnementet } from "@/components/forside/UtenomAbonnementet";
import { SlikFungererDet } from "@/components/forside/SlikFungererDet";
import { Vegg } from "@/components/forside/Vegg";
import { forsidensSporsmalForMarkup } from "@/content/faq";
import { hentCase } from "@/content/caser";
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
  const omtale = hentCase("soulcake")?.kundeord;
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
        OMTALEVIDEOEN SOM VideoObject, også her. Den står på to sider, og en
        språkmodell som leser forsiden alene skal ikke måtte følge lenken til
        kundecasen for å vite at kunden sier dette på film. `mainEntityOfPage`
        skiller de to forekomstene fra hverandre.

        Review-markeringen står bare på kundecasen. Omtalen hører til den
        siden, og to Review-objekter for det samme sitatet ville vært to
        anmeldelser i markeringen og én i virkeligheten.
      */}
      {omtale && (
        <FilmSchema
          navn={omtale.video.navn}
          beskrivelse={omtale.video.beskrivelse}
          sti={omtale.video.sti}
          plakat={`${omtale.video.sti}-poster.jpg`}
          sekunder={omtale.video.sekunder}
          publisert={omtale.video.publisert}
          sidesti="/"
        />
      )}
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
      {/*
        SEKS, IKKE TI. De fire siste spørsmålene i seksjonen er hentet fra
        /faq og er merket opp der. Google forbyr samme spørsmål og svar som
        FAQPage på to URL-er. Begrunnelsen i sin helhet står ved
        `forsidensSporsmalForMarkup` i src/content/faq.ts.
      */}
      <FaqSchema qa={forsidensSporsmalForMarkup} />

      <Hero />
      <Logostripe />
      <Arbeidet />
      <SlikFungererDet />
      <Arbeidsrutenett />
      {/*
        ANMELDELSENE ER FLYTTET OPP FORBI PRISEN, 01.10.2026, bestilt av Pål
        («burde kundeanmeldelsene med soulcakereferansen være høyere oppe?»).

        Prisen er 30 000 kr/mnd og står åpent. Et tall i den størrelsen leses
        som dyrt eller rimelig ut fra hva leseren alt tror om avsenderen, og
        den troen bygges av andre enn oss. Sto anmeldelsene under prisen,
        kom belegget etter at tallet var vurdert. Nå kommer omtalen fra Soul
        Cake — på film, med ansikt og navn — rett før.

        UTENOM ABONNEMENTET BLIR STÅENDE MELLOM DE TO, og det er ikke
        tilfeldig: anmeldelsesseksjonen er `bg-dyp` i full bredde og
        priskortet er `glassflate` på mørk bunn. Side om side ville de blitt
        to mørke flater etter hverandre uten pust imellom. Den grå blokken
        skiller dem.
      */}
      <Anmeldelsesseksjon />
      <UtenomAbonnementet />
      <Pris />
      <Vegg />
      <Faq />
      <Kontakt />
      <Bunnlogoer />
    </>
  );
}
