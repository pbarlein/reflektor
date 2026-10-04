"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { utenomAbonnementet as u } from "@/content/site";
import { useSpillNarSynlig } from "@/lib/videosynlighet";
import { SEKSJONSLUFT } from "./rytme";

/**
 * «Utenom abonnementet»: fire kort ut til tjenestesidene.
 *
 * HVORFOR DEN STÅR RETT ETTER PRISEN. Leseren har nettopp fått vite hva
 * abonnementet koster. Den som tenker «dette er mer enn vi trenger» skal
 * møte alternativet der, og ikke i bunnteksten.
 *
 * KLIENTKOMPONENT fordi tre av fire flater er klipp. Et `Klipp` uten
 * `festRef` og uten `ivrig` laster aldri — det står for alltid på
 * plakatbildet. Samme feil som tjenestesidene hadde, meldt to ganger.
 *
 * HELE KORTET ER LENKEN, og kortmalen er den samme som på /vart-arbeid:
 * ramme, hover på kanten, understreking som tennes i aksentfargen. Å finne
 * på en egen kortstil for fire kort ville vært lappeteppet AGENTS.md advarer
 * mot.
 *
 * PRISEN STÅR PÅ HVERT KORT. Det er den opplysningen som avgjør om leseren
 * klikker videre eller ikke, og den skal ikke måtte hentes på neste side.
 */
export function UtenomAbonnementet() {
  const fest = useSpillNarSynlig();

  return (
    <section className={SEKSJONSLUFT}>
      <Container>
        <Merkelapp som="p">{u.merkelapp}</Merkelapp>
        <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
          {u.overskrift}
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
          {u.ingress}
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {u.kort.map((k) => (
            <li key={k.sti}>
              <Link
                href={k.sti}
                className="group flex h-full flex-col overflow-hidden rounded-flate border border-kant transition-colors hover:border-blekk-svak motion-reduce:transition-none"
              >
                {/*
                  KVADRATISK FLATE. Kildene er 9:16, 16:9 og 3:2, og
                  kvadratet er den eneste rammen som tar alle tre uten å
                  skjære bort motivet i den ene eller strekke den andre.
                */}
                <div className="relative aspect-square overflow-hidden bg-flate-dempet">
                  {k.medie.slag === "foto" ? (
                    <Image
                      src={k.medie.sti}
                      alt={k.alt}
                      fill
                      sizes="(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <Klipp sti={k.medie.sti} festRef={fest(k.medie.sti)} />
                  )}
                </div>
                <div className="flex grow flex-col p-5 sm:p-6">
                  <h3 className="display text-xl">
                    <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                      {k.tittel}
                    </span>
                    <span
                      aria-hidden
                      className="ml-2 inline-block text-base text-aksent transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-3 grow text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                    {k.tekst}
                  </p>
                  <p className="mt-5 text-sm tracking-[0.02em] text-blekk">
                    {k.pris}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/*
          KJEDELINJA ER IKKE ET FEMTE KORT. Kjeder er ikke en tjeneste ved
          siden av de fire — det er en kundetype som kjøper alle sammen. Som
          kort ville den sagt at man velger mellom reklamefilm OG kjeder.
        */}
        <p className="mt-8 text-[0.9375rem] text-blekk-dempet">
          {u.kjedelinje.foran}{" "}
          <Link
            href={u.kjedelinje.sti}
            className="text-blekk underline decoration-aksent decoration-1 underline-offset-[0.3em]"
          >
            {u.kjedelinje.tekst}
          </Link>
        </p>
      </Container>
    </section>
  );
}
