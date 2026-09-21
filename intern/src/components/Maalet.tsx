import { Klipp } from "@/components/Klipp";
import { Merkelapp } from "@/components/Eyebrow";

/**
 * Målet, satt i prisseksjonens form.
 *
 * FORMEN ER LÅNT MED VILJE, og det er ikke dekorasjon. Prisseksjonen på
 * salgssiden er bygget som et REGNESTYKKE: faktorer på én linje, en
 * sumstrek, og under streken svaret i ett stort ord. Bestillingen her var at
 * intranettet skal ha samme design — men grepet passer også innholdsmessig,
 * og det er den egentlige grunnen til at det er brukt akkurat her.
 *
 * Påls beskjed har nemlig nøyaktig den strukturen:
 *
 *     «Alle ansatte har disse målene: at faste kunder aldri sier opp, at
 *      engangskunder kommer tilbake til oss. Hvordan? Ved å alltid være
 *      proaktiv, godt forberedt og entusiastisk.»
 *
 * To mål, ett spørsmål, ett svar. Over streken står målene. Streken ER
 * spørsmålet «Hvordan?». Under streken står svaret, i display-grad.
 *
 * ALLE ORDENE ER HANS. Ingenting under er omskrevet, og det er et krav og
 * ikke en høflighet: AGENTS.md sier «ikke finn på copy». Den eneste teksten
 * jeg har lagt til, er navigasjonssetningen nederst, som beskriver hva
 * resten av siden er — ikke hva Reflektor mener.
 */

/** Ordrett fra Pål. Ikke skriv om. */
const MALENE = [
  "At faste kunder aldri sier opp",
  "At engangskunder kommer tilbake til oss",
] as const;

export function Maalet() {
  return (
    <section aria-labelledby="malet" className="scroll-mt-20">
      <div className="glassflate rounded-medie px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/*
          ETIKETTEN ER EN <p>, IKKE EN SKJULT <h2>.

          Første versjon hadde begge deler: en `sr-only` <h2> med «Målet» og
          en aria-hidden <p> med det samme. Det ga en <h2> FØR sidens <h1>,
          altså en overskriftsrekke som starter på nivå to og hopper opp —
          nøyaktig det axe melder, og nøyaktig det som gjør en side
          vanskelig å navigere med skjermleser.

          Seksjonen navngis i stedet av `aria-labelledby` mot <h1> under.
          Etiketten er da det den ser ut som: en etikett.
        */}
        <Merkelapp>Målet</Merkelapp>

        {/*
          KLIPPET SPENNER HELE BLOKKEN, ikke bare en rad i den.

          VENSTRE SPALTE SETTER HØYDEN: mål, strek og svar til sammen.
          Klippet fyller den med `h-full` og lander av seg selv tett opp mot
          9:16. Da kan det ikke oppstå dødplass ved siden av teksten,
          uansett hvor lang den blir — det er samme feil som kostet en runde
          i prisseksjonen på salgssiden.
        */}
        <div className="lg:grid lg:grid-cols-[1fr_15rem] lg:items-stretch lg:gap-14">
          <div>
            {/*
              MÅLENE SOM FAKTORER. `<dl>` og ikke `<ol>`: løpenummeret er en
              etikett på et mål, ikke en rangering — det ene målet er ikke
              viktigere enn det andre.

              `flex-col-reverse` gir den visuelle rekkefølgen — nummeret
              øverst, målet under — uten å røre DOM-rekkefølgen, som er den
              hjelpemidler leser.
            */}
            <dl className="mt-8 grid gap-x-10 gap-y-8 sm:mt-10 sm:grid-cols-2">
              {MALENE.map((mal, i) => (
                /*
                  `justify-end` OG IKKE STANDARD. Med `column-reverse` går
                  hovedaksen nedenfra og opp, så `flex-start` pakker
                  innholdet mot BUNNEN av cellen. Målene er én og to linjer
                  lange, og da havnet de to løpenumrene i ulik høyde — 02 sto
                  synlig over 01.

                  `justify-end` pakker mot aksens slutt, altså mot toppen.
                  Numrene står på linje uansett hvor lange målene blir.
                */
                <div key={mal} className="flex flex-col-reverse justify-end">
                  <dt className="mt-3 text-[1.0625rem] leading-snug text-pretty text-pa-dyp sm:text-xl">
                    {mal}
                  </dt>
                  <dd className="display text-[2.5rem] leading-none tabular-nums text-aksent sm:text-[3rem]">
                    {String(i + 1).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>

            {/*
              SUMSTREKEN, med spørsmålet på. Vanlig hårstrek og ikke
              tykkere: en tykk strek ville lest som en seksjonsdeler i
              stedet for et regnetegn.

              «Hvordan?» står ordrett slik Pål skrev det, og det er
              nøyaktig det streken gjør — den skiller målene fra måten.
            */}
            <div className="mt-9 border-t border-[color:var(--kant-pa-dyp)] pt-9 sm:mt-10 sm:pt-10">
              <p className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                Hvordan?
              </p>

              {/*
                SVARET. `leading-[0.95]` fordi Instrument Serif har rikelig
                luft innebygd; i display-grad blir standard linjeavstand til
                et hull over underteksten.

                Gradene er valgt så setningen fyller spalten uten å brekke
                stygt på noen skjerm — 320, 360, 390, 414 og 1440.
              */}
              <h1
                id="malet"
                className="display mt-4 text-[2.25rem] leading-[0.95] tracking-[-0.03em] text-pretty text-pa-dyp sm:text-[3.25rem] lg:text-[4.25rem]"
              >
                Proaktiv, godt forberedt og entusiastisk.
              </h1>
              <p className="mt-5 text-[1.0625rem] text-pa-dyp-dempet sm:text-xl">
                Alltid.
              </p>
            </div>
          </div>

          {/*
            Under lg ligger klippet OVER teksten i et bredt, roligere
            format. Der har det ingen høyde å matche, og et stående klipp
            ville dyttet svaret langt ned på skjermen.
          */}
          <div className="relative order-first mt-8 aspect-[16/9] overflow-hidden rounded-flate bg-[rgba(245,240,232,0.06)] sm:aspect-[21/9] lg:order-none lg:mt-0 lg:aspect-auto lg:h-full">
            <Klipp
              sti="/medier/reels/produksjonsdag"
              alt="Fra en produksjonsdag på lokasjon"
            />
          </div>
        </div>

        {/*
          Navigasjonssetningen. Den eneste teksten i denne seksjonen som
          ikke er Påls — den beskriver hva resten av siden er, og påstår
          ingenting om Reflektor.
        */}
        <p className="mt-10 border-t border-[color:var(--kant-pa-dyp)] pt-7 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet sm:mt-12 sm:pt-8">
          Alt under er midler til de to målene: hvordan vi forbereder oss,
          hvordan vi filmer, hvordan vi klipper og hvordan vi publiserer.
        </p>
      </div>
    </section>
  );
}
