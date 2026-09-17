import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Knappelenke } from "@/components/Knapp";
import { BrodsmuleSchema, FaqSchema } from "@/components/Schema";
import { faqKategorier, faqSporsmal } from "@/content/faq";
import { basisUrl } from "@/lib/miljo";

/**
 * /faq — nitten spørsmål, ordrett fra dagens reflektor.no.
 *
 * Se A41 i docs/vedlegg-a.md for hvorfor siden måtte bygges, og faq.ts for
 * hvor teksten kommer fra.
 *
 * TITTEL OG BESKRIVELSE ER BEHOLDT fra dagens side. De er skrevet for
 * søkeordene siden allerede rangerer på, og å skrive dem om ville vært å
 * finne på copy for å endre noe som virker.
 *
 * FIRE GRUPPER, IKKE NITTEN PUNKTER. Første versjon var én flat liste.
 * Ingen leser nitten spørsmål — man leter etter sitt eget, og i en flat
 * liste må man skanne alle for å finne det. Gruppene gjør at man finner
 * det, og rekkefølgen deres er et argument i seg selv: hva dere får, hva
 * det koster, hva dere får igjen, hvordan det foregår. Ingen tekst er
 * endret.
 *
 * SVARENE LIGGER I DOM-EN OGSÅ NÅR DE ER LUKKET. <details> skjuler dem
 * visuelt, men innholdet står i HTML-en — det er hele grunnen til at
 * trekkspill er trygt her. En løsning som henter svaret først ved klikk
 * ville gjort nitten svar usynlige for alt som ikke kjører JavaScript, og
 * det er nettopp språkmodellene.
 *
 * `name` PÅ HVER GRUPPE gir et eksklusivt trekkspill uten en eneste linje
 * JavaScript: åpner du ett spørsmål, lukkes det forrige i samme gruppe.
 * Attributtet er en nettleserfunksjon, ikke et bibliotek. Grupperingen er
 * per kategori og ikke for hele siden, slik at man kan ha ett åpent
 * prisspørsmål og ett åpent praktisk spørsmål samtidig — de besvarer to
 * ulike ting.
 */

export const metadata: Metadata = {
  title: "Ofte stilte spørsmål – SoMe-byrå og fast pris",
  description:
    "Svar på de vanligste spørsmålene om Reflektors SoMe-abonnement: pris (30 000 kr/mnd), hva som er inkludert, Instagram og Facebook, bindingstid og oppstart.",
  alternates: { canonical: `${basisUrl()}/faq` },
};

export default function Faq() {
  const grupper = faqKategorier.map((k) => ({
    ...k,
    punkter: faqSporsmal.filter((p) => p.kategori === k.id),
  }));

  return (
    <>
      {/*
        FaqSchema gir ingen rich result — Google slo av funksjonen 7. mai
        2026. Den står fordi JSON-LD er der språkmodeller henter
        entitetsfakta; de kjører ikke JavaScript. Se Schema.tsx og A41.

        Den sendes ALLE nitten i original rekkefølge, ikke gruppert.
        Grupperingen er en lesehjelp for mennesker; en maskin skal ha
        spørsmålene slik de er.
      */}
      <FaqSchema qa={faqSporsmal} />
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Ofte stilte spørsmål" }]}
      />

      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <Container>
          <h1 className="max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Ofte stilte spørsmål om SoMe-byrå og fast pris
          </h1>

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[16rem_1fr] lg:gap-16">
            {/*
              INNHOLDSFORTEGNELSEN ER ANKERLENKER, ikke et filter.
              Et filter ville skjult de andre gruppene, og da forsvinner
              både det tilfeldige funnet og — viktigere — teksten fra
              siden for alt som leser den uten å klikke.

              På store skjermer følger den med i rullingen. På små står den
              øverst som en vanlig liste: en klebrig meny på mobil ville
              spist plass fra selve svarene.
            */}
            <nav
              aria-label="Kategorier"
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <Eyebrow>Fire grupper</Eyebrow>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-2.5">
                {grupper.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className="text-[0.9375rem] text-blekk-dempet hover:text-aksent-tekst"
                    >
                      {g.tittel}
                      <span className="ml-2 text-blekk-svak tabular-nums">
                        {g.punkter.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
              SPØRSMÅLENE FÅR BREDERE SPALTE ENN SVARENE. Første versjon satte
              hele kolonnen til max-w-2xl, og da sto det en halv skjerm tom
              til høyre på desktop. Nå er raden bred nok til å fylle flaten,
              mens selve svaret holder lesemålet på rundt 70 tegn — det er
              svaret som er løpende tekst, ikke spørsmålsraden.
            */}
            <div className="max-w-3xl">
              {grupper.map((g) => (
                <section
                  key={g.id}
                  id={g.id}
                  /*
                    `scroll-mt` fordi headeren er klebrig. Uten den lander
                    ankerhoppet med overskriften bak headeren, og det ser ut
                    som at lenken bommet.
                  */
                  className="scroll-mt-28 pt-12 first:pt-0"
                >
                  <h2 className="text-2xl text-balance sm:text-3xl">
                    {g.tittel}
                  </h2>

                  <div className="mt-6 divide-y divide-kant border-y border-kant">
                    {g.punkter.map((p) => (
                      <details
                        key={p.sporsmal}
                        name={`faq-${g.id}`}
                        className="faq-rad group"
                      >
                        <summary className="flex cursor-pointer list-none items-start gap-4 py-5 font-medium">
                          <span className="grow text-pretty">{p.sporsmal}</span>
                          {/*
                            Pluss som blir minus. `list-none` fjerner
                            nettleserens egen trekant, som er ulik i hver
                            nettleser og ikke kan settes. Tegnet er
                            `aria-hidden`: <summary> er allerede en knapp
                            med tilstand for en skjermleser, og et «+» lest
                            opp ville vært støy.
                          */}
                          <span
                            aria-hidden
                            className="relative mt-2.5 size-3 shrink-0"
                          >
                            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-blekk-dempet" />
                            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-blekk-dempet transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                          </span>
                        </summary>
                        <p className="max-w-2xl pb-5 leading-relaxed text-pretty text-blekk-dempet">
                          {p.svar}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}

              {/* ── CTA ────────────────────────────────────────── */}
              <div className="mt-16 rounded-flate border border-kant px-6 py-10 sm:px-10">
                <h2 className="text-2xl text-balance sm:text-3xl">
                  Står ikke spørsmålet her?
                </h2>
                <p className="mt-3 leading-relaxed text-pretty text-blekk-dempet">
                  Skriv til oss, så svarer vi. Vi lager også et komplett
                  strategiforslag til sosiale medier i løpet av tre virkedager,
                  uten forpliktelser.
                </p>
                <Knappelenke href="/#kontakt" className="mt-7">
                  Få et strategiforslag
                </Knappelenke>
                <p className="mt-6 text-[0.9375rem] text-blekk-dempet">
                  Vil dere heller se hva vi har laget?{" "}
                  <Link
                    href="/vart-arbeid"
                    className="underline underline-offset-4 hover:text-aksent-tekst"
                  >
                    Se kundecasene
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
