import { Klipp } from "@/components/Klipp";

/**
 * Målet, satt som et regnestykke.
 *
 * FORMEN ER LÅNT FRA PRISSEKSJONEN på salgssiden, og den passer også
 * innholdsmessig: faktorer over en strek, svaret under. Påls beskjed har
 * nøyaktig den strukturen — to mål, ett spørsmål, ett svar.
 *
 * ALLE ORDENE ER HANS. Ingenting er omskrevet.
 *
 * ── HVORFOR DENNE STÅR ØVERST ─────────────────────────────────────────────
 *
 * Forskning på hvorfor folk identifiserer seg med arbeidsplassen sin peker
 * på to ting: SÆRPREG — at det er noe eget ved stedet — og at man ser hva
 * det står for. En hub som åpner med en søkeboks er et arkiv. En som åpner
 * med hva vi faktisk prøver å få til, og med arbeidet vi har gjort, er noe
 * annet.
 *
 * Det er også praktisk begrunnet: alt annet i huben er midler til disse to
 * målene, og det er lettere å bruke et oppslagsverk når man vet hva det
 * sikter mot.
 */

/** Ordrett fra Pål. Ikke skriv om. */
const MALENE = [
  "At faste kunder aldri sier opp",
  "At engangskunder kommer tilbake til oss",
] as const;

export function Maalet() {
  return (
    <section
      aria-labelledby="malet"
      className="overflow-hidden rounded-medie border border-kant bg-kort"
    >
      <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:items-stretch">
        <div className="px-6 py-9 sm:px-10 sm:py-11 lg:px-12">
          <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
            Målet
          </p>

          {/*
            MÅLENE SOM FAKTORER. `<dl>` og ikke `<ol>`: løpenummeret er en
            etikett, ikke en rangering — det ene målet er ikke viktigere enn
            det andre.

            `flex-col-reverse` med `justify-end` gir den visuelle
            rekkefølgen (nummer øverst) uten å røre DOM-rekkefølgen, som er
            den hjelpemidler leser. `justify-end` fordi hovedaksen i
            `column-reverse` går nedenfra og opp: uten den bunnjusteres
            cellene, og numrene havner i ulik høyde når målene er ulikt
            lange.
          */}
          <dl className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {MALENE.map((mal, i) => (
              <div key={mal} className="flex flex-col-reverse justify-end">
                <dt className="mt-2.5 text-[1.0625rem] leading-snug text-pretty text-blekk sm:text-[1.125rem]">
                  {mal}
                </dt>
                <dd className="display text-[2.25rem] leading-none tabular-nums text-aksent sm:text-[2.75rem]">
                  {String(i + 1).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>

          {/*
            SUMSTREKEN, med spørsmålet på. Vanlig hårstrek og ikke tykkere:
            en tykk strek ville lest som en seksjonsdeler i stedet for et
            regnetegn.
          */}
          <div className="mt-8 border-t border-kant-regel pt-8">
            <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
              Hvordan?
            </p>
            <h1
              id="malet"
              className="display mt-3.5 text-[2rem] leading-[0.98] tracking-[-0.03em] text-pretty text-blekk sm:text-[2.75rem] lg:text-[3.5rem]"
            >
              Proaktiv, godt forberedt og entusiastisk.
            </h1>
            <p className="mt-4 text-[1.0625rem] text-blekk-dempet sm:text-xl">
              Alltid.
            </p>
          </div>

          {/*
            Navigasjonssetningen. Den eneste teksten her som ikke er Påls —
            den beskriver hva resten av siden er, og påstår ingenting om
            Reflektor.
          */}
          <p className="mt-8 border-t border-kant pt-6 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
            Alt under er midler til de to målene: hvordan vi forbereder oss,
            hvordan vi filmer, hvordan vi klipper, hvordan vi publiserer — og
            hvordan vi er å jobbe med.
          </p>
        </div>

        {/*
          Klippet er vårt eget arbeid, ikke et illustrasjonsbilde. Det er
          poenget: det er lettere å være stolt av et sted når man ser hva
          stedet lager.

          Under lg ligger det OVER teksten i et bredt format. Der har det
          ingen høyde å matche, og et stående klipp ville dyttet svaret
          langt ned på skjermen.
        */}
        <div className="relative order-first aspect-[16/9] bg-dempet sm:aspect-[21/9] lg:order-none lg:aspect-auto lg:h-full">
          <Klipp
            sti="/medier/reels/produksjonsdag"
            alt="Fra en produksjonsdag på lokasjon"
          />
        </div>
      </div>
    </section>
  );
}
