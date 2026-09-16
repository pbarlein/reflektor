import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { FaqSchema } from "@/components/Schema";
import { faqSporsmal } from "@/content/faq";

/**
 * /faq — nitten spørsmål, ordrett fra dagens reflektor.no.
 *
 * Siden var en stubb med en overskrift og en TODO. Se A41 i
 * docs/vedlegg-a.md for hvorfor den måtte bygges, og faq.ts for hvor
 * teksten kommer fra og hva som må avklares i den.
 *
 * TITTEL OG BESKRIVELSE ER BEHOLDT fra dagens side. De er skrevet for
 * søkeordene siden allerede rangerer på, og å skrive dem om ville vært å
 * finne på copy for å endre noe som virker.
 */
export const metadata: Metadata = {
  title: "Ofte stilte spørsmål – SoMe-byrå og fast pris",
  description:
    "Svar på de vanligste spørsmålene om Reflektors SoMe-abonnement: pris (30 000 kr/mnd), hva som er inkludert, Instagram og Facebook, bindingstid og oppstart.",
};

export default function Faq() {
  return (
    <>
      {/*
        FaqSchema gir ingen rich result — Google slo av funksjonen 7. mai
        2026. Den står fordi JSON-LD er der språkmodeller henter
        entitetsfakta; de kjører ikke JavaScript. Se Schema.tsx og A41.
      */}
      <FaqSchema qa={faqSporsmal} />

      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <Container>
          <h1 className="max-w-3xl text-4xl text-balance sm:text-5xl">
            Ofte stilte spørsmål om SoMe-byrå og fast pris
          </h1>

          {/*
            SVARENE LIGGER I DOM-EN OGSÅ NÅR DE ER LUKKET. <details> skjuler
            dem visuelt, men innholdet står i HTML-en — det er hele grunnen
            til at trekkspill er trygt her. En løsning som henter svaret
            først ved klikk ville gjort nitten svar usynlige for alt som
            ikke kjører JavaScript, og det er nettopp språkmodellene.
          */}
          <div className="mt-12 max-w-2xl divide-y divide-kant border-y border-kant">
            {faqSporsmal.map((p) => (
              <details key={p.sporsmal} className="group py-5">
                <summary className="cursor-pointer font-medium marker:text-blekk-svak">
                  {p.sporsmal}
                </summary>
                <p className="mt-3 leading-relaxed text-pretty text-blekk-dempet">
                  {p.svar}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-[1.0625rem] leading-relaxed">
            Står ikke spørsmålet her?{" "}
            <Link href="/#kontakt" className="underline hover:text-aksent">
              Skriv til oss
            </Link>
            , så svarer vi.
          </p>
        </Container>
      </section>
    </>
  );
}
