import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Motekalender } from "@/components/Motekalender";
import { TakkHendelse } from "@/components/TakkHendelse";
import { tilbud } from "@/content/site";

export const metadata: Metadata = {
  title: "Takk for henvendelsen",
  // Kvitteringssider skal ikke indekseres.
  robots: { index: false, follow: false },
};

/**
 * Konverteringssiden.
 *
 * Dette er sidevisningen GA4 måler som `takk_page_view`, og som Google Ads
 * teller konverteringer på. 107+ historiske konverteringer henger på den.
 * Endres URL-en eller hendelsen, mister Reflektor målingen av sin eneste KPI.
 *
 * INNHOLDET ER BYTTET 04.10.2026. URL-en, `noindex` og `<TakkHendelse />`
 * er uendret — det er bare det som står på siden som er nytt.
 *
 * FØR DETTE STO DET «Takk for henvendelsen. Vi tar kontakt så snart vi kan.»
 * og ingenting mer. To ting var galt med det:
 *
 * 1. Nettsiden lover et strategiforslag innen tre virkedager. Takkesiden sa
 *    ingenting om det, så den som nettopp hadde fylt ut visste ikke hva som
 *    skulle skje eller når.
 * 2. Den hadde ingen vei videre. Et lead som er varmt NÅ måtte vente på at
 *    Pål rakk å ringe.
 *
 * KALENDEREN STÅR HØYT OPPE, og det er hele grepet. Research 03.10.2026:
 * vises kalenderen umiddelbart etter innsending, booker rundt to av tre
 * møte; ved manuell oppfølging er tallet rundt én av tre.
 *
 * INGENTING FRA SKJEMAET VISES SOM TEKST HER. Ikke navn, ikke bedrift.
 * Siden er `noindex`, men URL-en og innholdet går til GA4, GTM og Clarity,
 * og en personopplysning på en kvitteringsside er en personopplysning gitt
 * bort uten at noen ba om det. Forhåndsutfyllingen av kalenderen går en
 * annen vei — se Motekalender.tsx.
 */
export default function Takk() {
  return (
    <section className="pt-14 pb-24 sm:pt-20 sm:pb-32">
      <TakkHendelse />
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl text-balance sm:text-4xl lg:text-5xl">
            Takk! Vi har fått henvendelsen.
          </h1>

          {/*
            «SÅ RINGER VI DEG» VAR FEIL, rettet 06.10.2026. Bookingen i
            HubSpot lager et videomøte med Google Meet-lenke, ikke en
            telefonsamtale — så setningen lovet noe kalenderen ikke leverer.

            FORMULERINGEN ER PÅLS EGEN, hentet fra e-post 1: «Jeg ringer deg
            så snart jeg kan … Vil du heller velge tid selv, kan du booke
            her.» Da sier siden og e-posten det samme, og rekkefølgen er
            riktig: telefonen er det som skjer uansett, kalenderen er for
            den som vil styre selv.
          */}
          <p className="mt-6 text-lg leading-relaxed text-pretty text-blekk-dempet">
            Vi ringer deg så snart vi kan. Vil du heller velge tid selv, kan du
            booke et møte under.
          </p>
        </div>

        {/*
          KALENDEREN I FULL BREDDE under teksten, ikke inne i `max-w-2xl`.
          HubSpots iframe har sin egen tokolonners layout fra rundt 700 px,
          og den trenger plassen for å slippe en rullefelt inne i en
          rullefelt.
        */}
        <Motekalender />

        <div className="mt-14 max-w-2xl sm:mt-16">
          <h2 className="text-2xl text-balance sm:text-3xl">Dette skjer ellers</h2>
          <ol className="mt-6 grid gap-5">
            {[
              "Vi ser på bedriften deres og kanalene dere har i dag.",
              `Innen ${tilbud.strategiforslagVirkedager} virkedager får du et konkret strategiforslag for sosiale medier.`,
              "Vi tar kontakt på telefon eller e-post og går gjennom det sammen med deg.",
            ].map((steg, i) => (
              <li key={steg} className="flex gap-4">
                <span
                  aria-hidden
                  className="display shrink-0 text-[0.9375rem] tabular-nums text-aksent"
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed text-pretty text-blekk-dempet">
                  {steg}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-[1.0625rem]">
            Mens du venter:{" "}
            <Link
              href="/vart-arbeid"
              className="group inline-flex items-center gap-2 underline decoration-aksent decoration-1 underline-offset-[0.35em]"
            >
              se hva vi har laget for Soulcake og Egon
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
