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
      {omtale &&
        (() => {
          /*
            MARKERINGEN SKAL PEKE PÅ FILA SOM FAKTISK VISES HER. Rettet
            02.10.2026, da forsiden gikk over til 9:16-utgaven.

            `contentUrl` og `thumbnailUrl` sto på 4:5-fila, som nå bare
            brukes på kundecasen og tjenestesidene. En VideoObject som
            oppgir en annen fil enn den som ligger på siden er en påstand
            som ikke stemmer — og `thumbnailUrl` er dessuten det Google
            viser i videoresultater, så feil plakat er feil bilde i søk.

            Alt annet — navn, beskrivelse, lengde, dato — er identisk: det
            er samme opptak, bare et annet utsnitt.
          */
          const sti = omtale.video.stiStaende ?? omtale.video.sti;
          return (
            <FilmSchema
              navn={omtale.video.navn}
              beskrivelse={omtale.video.beskrivelse}
              sti={sti}
              plakat={`${sti}-poster.jpg`}
              sekunder={omtale.video.sekunder}
              publisert={omtale.video.publisert}
              /*
                TRANSKRIPSJONEN ER LAGT TIL 02.10.2026, samtidig som
                <track>-elementet ble fjernet fra avspilleren (iOS Safari
                slo det på av seg selv og la nettleserens tekstboks oppå
                den innbrente tekstingen).

                Begrunnelsen for sporet var at det gjorde det som blir sagt
                søkbart. Det er DETTE feltet som faktisk gjør den jobben —
                en VTT-fil leses ikke som innhold — og kundecasen har hatt
                det hele tiden. Forsiden hadde det ikke. Nå har begge det,
                og rensingen er den samme som der.
              */
              transkripsjon={omtale.transkripsjon
                .join(" ")
                .replace(/[«»]/g, "")
                .replace(/\s+/g, " ")
                .trim()}
              sidesti="/"
            />
          );
        })()}
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
      {/*
        ANMELDELSENE STÅR HER, RETT ETTER LOGORADEN, bestilt av Pål
        02.10.2026: «anmeldelsesdelen må rett over slik ser det ut når vi
        filmer hos andre. da bygger vi tillit enda raskere.»

        Den lå nederst til 01.10.2026, så over prisen, og nå her. Rekkefølgen
        er altså: hvem som helst kan påstå noe om seg selv i heroen, logoene
        viser hvem som har kjøpt, og så sier en av dem det selv — på film, med
        ansikt og navn, etter fem år som kunde. Først deretter viser vi
        arbeidet. Belegget kommer før påstanden, ikke etter.

        RYTMEN GÅR OPP. Heroen er `bg-flate-dempet`, denne er mørk,
        «Slik ser det ut» er lys, «Dere setter av én dag» er mørk igjen.
        Lys og mørk veksler hele veien ned, og ingen to mørke flater møtes.

        DEN MØRKE FLATEN ER INNFELT, ikke helbredds. Endret 02.10.2026,
        bestilt av Pål. Her sto «denne er `bg-dyp`», altså en stripe fra
        kant til kant. Alle de andre mørke flatene på nettstedet er innfelte
        paneler — også «Dere setter av én dag» rett under. Anmeldelsene var
        den eneste som ikke var det.

        UTENOM ABONNEMENTET BLIR STÅENDE RETT OVER PRISEN av samme grunn:
        priskortet er `glassflate` på mørk bunn, og den grå blokken er pusten
        foran det.
      */}
      <Anmeldelsesseksjon />
      <Arbeidet />
      <SlikFungererDet />
      <Arbeidsrutenett />
      <UtenomAbonnementet />
      <Pris />
      <Vegg />
      <Faq />
      <Kontakt />
      <Bunnlogoer />
    </>
  );
}
