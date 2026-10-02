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
import { DetteInngar } from "@/components/forside/DetteInngar";
import { Faq } from "@/components/forside/Faq";
import { Hero } from "@/components/forside/Hero";
import { Kontakt } from "@/components/forside/Kontakt";
import { Logostripe } from "@/components/forside/Logostripe";
import { Pris } from "@/components/forside/Pris";
import { UtenomAbonnementet } from "@/components/forside/UtenomAbonnementet";
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
  alternates: {
    canonical: `${basisUrl()}/`,
    /*
      HREFLANG, LAGT TIL 02.10.2026 sammen med /en.

      Henvisningene MÅ gå begge veier. Google krever at den engelske siden
      peker tilbake på den norske, og omvendt — gjør de ikke det, ignoreres
      hele settet, og da har vi markering uten virkning. /en har samme
      blokk.

      `x-default` er denne siden: den er den fullstendige, og den engelske
      er en oppsummering.
    */
    languages: {
      "nb-NO": basisUrl(),
      en: `${basisUrl()}/en`,
      "x-default": basisUrl(),
    },
  },
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
      {/*
        PRISEN ER FLYTTET HIT 02.10.2026, bestilt av Pål: «Hva tenker du om
        å skille "pris" og "dette inngår"? da kan vi sette prisseksjonen der
        "slik jobber vi" er i dag.»

        Her lå seksjonen «Slik jobber vi». Den er lagt ned, og de tre
        stegene står nå i DetteInngar nede på siden — begrunnelsen i sin
        helhet står i filhodet der. Kort: stegene og de seks punktene var
        samme leveranse fortalt to ganger, i hver sin mørke blokk, med
        priskortet imellom.

        PRISKORTET PASSER I SLUKET DEN ETTERLOT seg på to måter. Rytmen er
        uendret — begge er mørke flater mellom «Slik ser det ut» og
        bilderutenettet, så lys og mørk veksler fortsatt hele veien ned. Og
        kortet er nå kort nok til å tåle å stå høyt: uten «Dette inngår» er
        det fire tall, ett ord, prisen og ett klipp.

        AT PRISEN KOMMER TIDLIG ER POENGET, ikke en bivirkning. Prisåpenhet
        er den ene posisjoneringen Reflektor har dokumentert, og den som
        ikke har 30 000 kr i måneden skal få vite det før hun har rullet
        gjennom halve forsiden.
      */}
      <Pris />
      <Arbeidsrutenett />
      <UtenomAbonnementet />
      {/*
        DETTE INNGÅR står der priskortet sto, og arver begrunnelsen som lå
        her: den grå kortraden over er pusten foran en mørk flate, og
        seksjonen under er lys igjen.

        Den er to gamle seksjoner slått sammen — spesifikasjonen fra
        priskortet og de tre stegene fra «Slik jobber vi» — med en film fra
        en produksjonsdag ved siden av. Se DetteInngar.tsx.
      */}
      <DetteInngar />
      <Vegg />
      <Faq />
      <Kontakt />
      <Bunnlogoer />
    </>
  );
}
