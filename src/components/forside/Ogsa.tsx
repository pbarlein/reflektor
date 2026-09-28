import Link from "next/link";

import { Container } from "@/components/Container";
import { Merkelapp } from "@/components/Eyebrow";
import { ogsaFraReflektor } from "@/content/site";

/**
 * «Også fra Reflektor»: to setninger som peker ut av abonnementet.
 *
 * HVORFOR DEN STÅR RETT ETTER PRISEN. Leseren har nettopp fått vite hva
 * abonnementet er og hva det koster. Spørsmålet som melder seg der er «er
 * dette alt dere gjør, og er dere store nok for oss?». Det er nøyaktig
 * spørsmålet Google AI Mode svarte nei på 29.09.2026, med forsidens egen
 * tekst som begrunnelse.
 *
 * SEKSJONEN RØRER INGEN LÅST SLOT. Den legger til; den skriver ikke om.
 * Setningene om «Instagram og Facebook», «30 000 kr/mnd» og «ingen
 * timepriser» står uendret der de sto, og teksten her handler om noe annet:
 * hvilke andre oppdrag Reflektor tar.
 *
 * Copyen ligger i src/content/site.ts, ikke her.
 */
export function Ogsa() {
  return (
    <section className="pb-20 sm:pb-24">
      <Container>
        <Merkelapp som="h2">Også fra Reflektor</Merkelapp>
        <ul className="mt-6 grid max-w-3xl gap-6 sm:grid-cols-2 sm:gap-8">
          {ogsaFraReflektor.map((o) => (
            <li key={o.sti}>
              <p className="leading-relaxed text-pretty text-blekk-dempet">
                {o.tekst}
              </p>
              <Link
                href={o.sti}
                className="mt-3 inline-flex min-h-6 items-center gap-2 text-[0.9375rem] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
              >
                {o.lenketekst}
                <span aria-hidden className="text-aksent">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
