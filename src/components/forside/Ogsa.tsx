import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Merkelapp } from "@/components/Eyebrow";
import { ogsaFraReflektor } from "@/content/site";

/**
 * «Også fra Reflektor»: to kort som peker ut av abonnementet.
 *
 * HVORFOR DEN STÅR RETT ETTER PRISEN. Leseren har nettopp fått vite hva
 * abonnementet er og hva det koster. Spørsmålet som melder seg der er «er
 * dette alt dere gjør, og er dere store nok for oss?». Det er nøyaktig
 * spørsmålet Google AI Mode svarte nei på 29.09.2026, med forsidens egen
 * tekst som begrunnelse.
 *
 * BYGGET OM 29.09.2026. Pål: «denne seksjonen ser litt random plassert ut og
 * ikke så bra designet.» Begge deler stemte, men årsaken var den samme:
 * seksjonen var to løse avsnitt uten ramme, uten flate og uten bilde, i
 * venstre halvdel av en side der alt over og under er tunge, mørke blokker.
 * En tekst uten form mellom to blokker med form leser som noe som ble til
 * overs.
 *
 * Plasseringen er derfor beholdt, og formen er byttet. Nå er den to kort i
 * full bredde, og rekkefølgen blir mørkt priskort → lyst mellomspill →
 * mørkt anmeldelsesfelt. Det er en rytme; det forrige var et hull.
 *
 * KORTMALEN ER IKKE NY. Ramme, hover på kanten, understreking som tennes i
 * aksentfargen, bilde øverst og tekst som vokser — alt er det samme
 * mønsteret som kundecasene på /vart-arbeid. Å finne på en egen kortstil
 * for to kort ville vært nettopp lappeteppet AGENTS.md advarer mot.
 *
 * HELE KORTET ER KLIKKBART, ikke bare lenketeksten. Treffflaten var før en
 * linje på rundt 200 px; nå er den kortet. Lenketeksten er samtidig blitt
 * kortets overskrift — den sa allerede hva den andre siden ER, og det er
 * nøyaktig det en overskrift skal gjøre.
 *
 * SEKSJONEN RØRER INGEN LÅST SLOT, og det er ikke skrevet én ny setning.
 * Setningene om «Instagram og Facebook», «30 000 kr/mnd» og «ingen
 * timepriser» står uendret der de sto, og copyen her er ordrett den samme
 * som før ombyggingen. Den ligger i src/content/site.ts, ikke her.
 */
export function Ogsa() {
  return (
    <section className="pb-20 sm:pb-24">
      <Container>
        <Merkelapp som="h2">Også fra Reflektor</Merkelapp>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8">
          {ogsaFraReflektor.map((o) => (
            <li key={o.sti}>
              <Link
                href={o.sti}
                className="group flex h-full flex-col overflow-hidden rounded-flate border border-kant transition-colors hover:border-blekk-svak motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-flate-dempet">
                  <Image
                    src={o.bilde}
                    alt={o.alt}
                    fill
                    sizes="(min-width: 640px) 34rem, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex grow flex-col p-6 sm:p-7">
                  {/*
                    PILEN STÅR INNTIL OVERSKRIFTEN, ikke på en egen linje
                    under teksten. Der sto den først, og da lå den alene
                    nederst i kortet som et tegn uten tilhørighet. Inntil
                    overskriften leser den som en del av lenken, som er det
                    den er. Den er dekorativ og skjult for skjermlesere —
                    <Link> sier allerede hvor den fører, med overskriften som
                    ledetekst.
                  */}
                  <h3 className="display text-xl sm:text-2xl">
                    <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                      {o.lenketekst}
                    </span>
                    <span
                      aria-hidden
                      className="ml-3 inline-block text-base text-aksent transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-3 grow leading-relaxed text-pretty text-blekk-dempet">
                    {o.tekst}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
