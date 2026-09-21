import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { BrodsmuleSchema, FaqSchema } from "@/components/Schema";
import { tilbud } from "@/content/site";
import { basisUrl } from "@/lib/miljo";

/**
 * /gratis-strategimote
 *
 * SIDEN HADDE BARE EN OVERSKRIFT. To ord i `main`. TODO-en sa «skjema og
 * verdiargumenter – avventer budskap og HubSpot-oppsett». Den er live og
 * står oppført i next.config.ts som en side som «beholdes som den er».
 *
 * TILBUDET MÅTTE RYDDES FØRST. Siden het «Gratis strategimøte», mens hele
 * resten av nettstedet lover et skriftlig forslag innen tre virkedager.
 * To ulike løfter for samme handling er samme feil som `/sosiale-medier-byra`
 * ble 301-et for — to sider med samme fakta deler signalene i to, og her
 * var ikke engang fakta de samme.
 *
 * Pål bekreftet rekkefølgen 19.09.2026: forslag først, så en prat om det.
 * Denne siden eier dermed PRATEN — den andre halvdelen av den sekvensen —
 * og er ærlig om at forslaget kommer først. Den konkurrerer ikke med
 * `/kontaktoss`, den forklarer hva møtet faktisk er.
 *
 * Ingen HubSpot-avhengighet. Skjemaet er det samme som ellers, gjennom
 * /api/skjema til /takk, som er den verifiserte strømmen.
 */
const FAQ = [
  {
    sporsmal: "Er strategimøtet virkelig gratis?",
    svar: "Ja. Det er ingen kostnad og ingen forpliktelse. Vi bruker tiden på å forstå bedriften og vise hva vi ville gjort — og det er like mye vår vurdering av om vi er riktig leverandør for dere, som deres vurdering av oss.",
  },
  {
    sporsmal: "Hva skjer før møtet?",
    svar: `Dere får et forslag først. Innen ${tilbud.strategiforslagVirkedager} virkedager sender vi et konkret utkast til hvordan en måned med Reflektor kan se ut hos dere. Møtet handler om det forslaget, ikke om å starte på blanke ark — da blir samtalen konkret fra første minutt.`,
  },
  {
    sporsmal: "Må vi forberede noe?",
    svar: "Nei. Det hjelper hvis dere vet hva dere vil oppnå, men dere trenger ikke ha en plan. De fleste kommer med et problem, ikke en løsning — «vi legger ut for sjelden», «det ser ikke profesjonelt ut», «vi får ikke tid».",
  },
  {
    sporsmal: "Blir vi ringt opp etterpå?",
    svar: "Bare hvis dere vil. Sier dere nei takk etter møtet, er det siste du hører fra oss. Vi har tre måneders oppsigelse og ingen bindingstid på selve avtalen også — vi vil ha kunder som blir fordi arbeidet virker.",
  },
];

export const metadata: Metadata = {
  title: "Gratis strategimøte | Reflektor",
  description:
    "Få et konkret forslag til sosiale medier innen tre virkedager, og et uforpliktende møte om det. Ingen kostnad, ingen forpliktelse.",
  alternates: { canonical: `${basisUrl()}/gratis-strategimote` },
};

export default function GratisStrategimote() {
  return (
    <>
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Gratis strategimøte" }]}
      />
      <FaqSchema qa={FAQ} />

      <section className="pt-16 pb-20 sm:pt-24">
        <Container>
          <Eyebrow>Uforpliktende</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Gratis strategimøte
          </h1>
          <p className="mt-8 max-w-2xl border-l-2 border-aksent pl-6 text-lg leading-relaxed text-pretty sm:pl-8 sm:text-xl">
            Dere får et konkret forslag først, innen{" "}
            {tilbud.strategiforslagVirkedager} virkedager — så tar vi en prat
            om det. Ingen kostnad, ingen forpliktelse, og ingen generisk
            presentasjon.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <Merkelapp som="h2">Slik går det for seg</Merkelapp>
              <ol className="mt-6 grid gap-6">
                {[
                  [
                    "Dere fyller ut skjemaet",
                    "Kort om bedriften og hva dere vil oppnå. Det tar et par minutter.",
                  ],
                  [
                    "Vi lager forslaget",
                    `Innen ${tilbud.strategiforslagVirkedager} virkedager får dere et utkast til hvordan en måned hos dere kan se ut — hva vi ville filmet, og hva som ville blitt publisert.`,
                  ],
                  [
                    "Vi tar praten",
                    "Et møte om forslaget, digitalt eller hos dere. Der finner vi ut om dette er riktig for begge parter.",
                  ],
                ].map(([tittel, tekst], i) => (
                  <li key={tittel} className="flex gap-5">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-kant font-[family-name:var(--font-display-serif)] text-lg leading-none text-aksent-tekst"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium">{tittel}</h3>
                      <p className="mt-2 leading-relaxed text-pretty text-blekk-dempet">
                        {tekst}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-flate bg-dyp p-6 sm:p-8">
              <div className="rounded-flate bg-flate p-6 text-blekk sm:p-8">
                <Kontaktskjema side="/gratis-strategimote" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[9rem_1fr]">
            <Merkelapp className="lg:pt-3" som="h2">
              Spørsmål
            </Merkelapp>
            <div className="max-w-2xl border-t border-kant">
              {FAQ.map((f) => (
                <details
                  key={f.sporsmal}
                  name="faq-strategimote"
                  className="faq-rad group border-b border-kant"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-5 py-5 text-[1.0625rem] leading-snug font-medium [&::-webkit-details-marker]:hidden">
                    <span className="flex-1 text-pretty">{f.sporsmal}</span>
                    <span
                      aria-hidden
                      className="relative mt-2 block size-3 shrink-0 text-blekk-dempet"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                      <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                    </span>
                  </summary>
                  <p className="pr-8 pb-6 leading-relaxed text-pretty text-blekk-dempet">
                    {f.svar}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
