import Link from "next/link";
import { Merkelapp } from "@/components/Eyebrow";

import { Container } from "@/components/Container";
import { faqSporsmal, forsidensSporsmal } from "@/content/faq";

export function Faq() {
  return (
    <>
      {/*
      6 · FAQ — bygget om 16.09.2026.

      TO ENDRINGER, og den ene betinger den andre.

      FLERE SPØRSMÅL. Seks ble ti. De fire nye er hentet ved referanse fra
      /faq, ikke kopiert — se `forsidensTillegg` i faq.ts for hvilke og
      hvorfor. Kort: de seks godkjente svarene dekket ikke de to reelle
      alternativene en kunde veier oss mot (ansette selv, annonsere i
      stedet), og heller ikke de to som avgjør om prisen føles forsvarlig.

      DET GJORDE DESIGNET TIL ET PROBLEM. Ti trekkspill i én spalte er en
      liste; seks var en kort liste. Derfor:

      - SKINNE OG BRED SPALTE, samme grep som prisarket. Overskriften står
        i skinna, spørsmålene i den brede spalten. Seksjonen leser som en
        del av samme dokument i stedet for som enda en stablet blokk.
      - EKSKLUSIVT TREKKSPILL via `name` på <details>. Nettleseren lukker
        det forrige når du åpner et nytt — null JavaScript. Uten det kunne
        ti åpne svar bli 4 000 tegn i én kolonne.
      - MYK ÅPNING via `::details-content` og `interpolate-size`. Ren CSS,
        se globals.css. Feiler den, åpner svaret momentant — altså slik
        <details> alltid har oppført seg.

      SVARENE LIGGER I DOM-EN OGSÅ NÅR DE ER LUKKET. Det er grunnen til at
      <details> er trygt her og en JavaScript-løsning ikke ville vært det:
      språkmodeller klikker ikke.
    */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[9rem_1fr]">
            <Merkelapp className="lg:pt-3">Spørsmål</Merkelapp>

            <div>
              <h2 className="max-w-xl text-3xl text-balance sm:text-4xl">
                Det folk lurer på før de tar kontakt
              </h2>

              <div className="mt-9 max-w-2xl border-t border-kant">
                {forsidensSporsmal.map((p) => (
                  <details
                    key={p.sporsmal}
                    name="forside-faq"
                    className="faq-rad group border-b border-kant"
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-5 py-5 text-[1.0625rem] leading-snug font-medium [&::-webkit-details-marker]:hidden">
                      <span className="flex-1 text-pretty">{p.sporsmal}</span>
                      {/*
                      Pluss som blir minus. To streker som krysser
                      hverandre, der den loddrette skaleres til null når
                      raden er åpen — ingen ikonfil, ingen rotasjon som
                      ser skjev ut på halve piksler.
                    */}
                      <span
                        aria-hidden
                        className="relative mt-2 block size-3 shrink-0 text-blekk-dempet"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                      </span>
                    </summary>
                    <p className="pr-8 pb-6 leading-relaxed text-pretty text-blekk-dempet">
                      {p.svar}
                    </p>
                  </details>
                ))}
              </div>

              <p className="mt-8 text-[1.0625rem]">
                {/*
                    `hover:text-aksent-tekst` og ikke `hover:text-aksent`.
                    Aksentfargen #DE4826 måler 3,78:1 mot den lyse flaten —
                    under AA-kravet på 4,5 for tekst under 24 px, og denne
                    lenka er 17. Token-fila har allerede den tilgjengelige
                    varianten for akkurat dette: --aksent-tekst-liten,
                    #C03A1C, som måler 4,95:1.

                    Dette er altså ikke en merkevarebeslutning. Merkevaren
                    er uendret; systemet hadde utgangen klar, den var bare
                    ikke brukt her.
                  */}
                  <Link
                    href="/faq"
                    className="underline hover:text-aksent-tekst"
                  >
                  Alle {faqSporsmal.length} spørsmål og svar
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
