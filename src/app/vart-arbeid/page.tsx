import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { Knappelenke } from "@/components/Knapp";
import { Logorad } from "@/components/Logorad";
import { ReelVegg } from "@/components/ReelVegg";
import { BrodsmuleSchema } from "@/components/Schema";
import { kundecaser } from "@/content/caser";
import { reels } from "@/content/reels";
import { basisUrl } from "@/lib/miljo";

/**
 * /vart-arbeid — oversikten.
 *
 * NAVNET. Siden het «Kundecaser» i tittelfeltet og «Vårt arbeid» i
 * overskriften, både på dagens side og i stubben her. Det er ikke en feil
 * som skal rettes ved å velge ett av dem — de betyr forskjellige ting, og
 * forskjellen er poenget:
 *
 *   ARBEID er alt vi har laget. Klipp, bilder, kunder, bransjer.
 *   ET KUNDECASE er ett dokumentert samarbeid, med tall og kilde.
 *
 * Reflektor har mye av det første og to av det andre. Å kalle hele siden
 * «Kundecaser» ville lovet dokumentasjon for alt som vises. Å kalle den
 * «Vårt arbeid» og lenke til «kundecaser» inni, er presist.
 *
 * Målingen støtter det. Ingen leter etter siden på navnet: «kundecase» har
 * 70 søk/mnd i Norge og er folk som slår opp hva ordet betyr, «kundecaser»
 * har null, og hele /vart-arbeid* rangerer i dag på null søkeord. Blant
 * norske byråer heter punktet «Arbeider» hos TRY, POL, Nucleus,
 * Morgenstern og Tibe. Ingen av dem kaller det «Kundecaser». Se
 * docs/research-arbeidsside.md.
 *
 * URL-EN LIGGER FAST UANSETT. /vart-arbeid, /vart-arbeid/egon og
 * /vart-arbeid/soulcake er live og står i dagens sitemap. Regel én i
 * AGENTS.md: levende URL-er flyttes ikke.
 *
 * SIDEN VISER TRE TING I SYNKENDE BEVISKRAFT, og rekkefølgen er argumentet:
 *
 *   1. To dokumenterte kundecaser — navn, tall, kilde, egen side
 *   2. Utvalgt arbeid — klipp som viser håndverket, uten å påstå resultater
 *   3. Logorekka — produksjonskunder, som produksjonskunder
 *
 * Det tredje punktet er en felle prosjektet har vært nær å gå i før:
 * logorekka er PRODUKSJONSKUNDER, ikke SoMe-abonnenter, og skal aldri
 * fremstilles som det. Derfor står den nederst, med egen merkelapp, og ikke
 * blandet inn i casene.
 */

export const metadata: Metadata = {
  title: "Vårt arbeid – kundecaser innen foto, video og sosiale medier",
  description:
    "Dokumenterte kundecaser fra Reflektor: Soulcake og Egon, begge med fast produksjonsdag hver måned siden 2022. Se tall, arbeidsmåte og utvalgte klipp.",
  alternates: { canonical: `${basisUrl()}/vart-arbeid` },
};

export default function VartArbeid() {
  return (
    <>
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Vårt arbeid" }]}
      />

      {/* ── Overskrift ───────────────────────────────────────────── */}
      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <Container>
          <h1 className="max-w-4xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Vårt arbeid
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-blekk-dempet">
            Reflektor jobber tett med selskaper innen restaurant og mat,
            eiendom og finans, retail og teknologi. Her er et utvalg av
            prosjekter innen foto, video og sosiale medier.
          </p>
        </Container>
      </section>

      {/* ── De dokumenterte casene ───────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Eyebrow>Kundecaser</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
            To samarbeid, dokumentert med tall
          </h2>

          {/*
            KORTENE ER STORE OG FÅ. To caser i to kolonner, ikke et rutenett
            med plass til seks. Et rutenett bygget for flere enn man har,
            ser ut som et rutenett med hull i.

            Hvert kort bærer det samme som casen selv, i miniatyr: klipp,
            metadata, ingress og ÉTT tall. Tallet er det som gjør kortet til
            et bevis i stedet for en lenke — og det står med kildeforbehold
            på selve casesiden, dit kortet går.
          */}
          <ul className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {kundecaser.map((k) => (
              <li key={k.slug}>
                <Link
                  href={`/vart-arbeid/${k.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-flate border border-kant transition-colors hover:border-blekk-svak motion-reduce:transition-none"
                >
                  {/*
                    Klippet ligger liggende her og stående på casesiden.
                    Samme fil, to beskjæringer: kortet skal kunne stå ved
                    siden av et annet kort uten å bli en tårnrekke.
                  */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-flate-dempet">
                    <Klipp sti={`/reels/${k.klipp.fil}`} />
                  </div>

                  <div className="flex grow flex-col p-6 sm:p-8">
                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
                      <span className="text-blekk">{k.kunde}</span>
                      <span aria-hidden className="text-blekk-svak">
                        ·
                      </span>
                      <span>{k.sektor}</span>
                      <span aria-hidden className="text-blekk-svak">
                        ·
                      </span>
                      <span>{k.siden}</span>
                    </p>

                    <h3 className="mt-4 text-2xl text-balance sm:text-3xl">
                      <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                        {k.h1}
                      </span>
                    </h3>

                    <p className="mt-4 grow leading-relaxed text-pretty text-blekk-dempet">
                      {k.kortingress}
                    </p>

                    <p className="mt-7 flex items-baseline gap-3 border-t border-kant pt-5">
                      <span className="font-[family-name:var(--font-display-serif)] text-3xl leading-none">
                        {k.korttall.verdi}
                      </span>
                      <span className="text-sm leading-snug text-pretty text-blekk-dempet">
                        {k.korttall.forklaring}
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Utvalgt arbeid ───────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Eyebrow>Utvalgt arbeid</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
            Klipp fra flere bransjer
          </h2>
          {/*
            DENNE SEKSJONEN PÅSTÅR INGENTING OM RESULTATER, og formuleringen
            er valgt for det. Klippene viser håndverk og bredde. Et tall her
            ville krevd en kilde vi ikke har for hver enkelt kunde, og et
            tall uten kilde er verre enn ingen — særlig rett under to caser
            som har kilde.
          */}
          <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
            Produsert på faste produksjonsdager hos kundene. Utvalget viser
            bredden i bransjer og formater, ikke enkeltresultater.
          </p>
        </Container>

        <div className="mt-10">
          <ReelVegg reels={reels} />
        </div>
      </section>

      {/* ── Produksjonskunder ────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Merkelapp som="h2">Produksjonskunder</Merkelapp>
          {/*
            DEN VIKTIGSTE SETNINGEN PÅ SIDEN, og den ser ut som en
            bisetning. Logorekka er kunder Reflektor har produsert FOR — den
            er ikke en liste over SoMe-abonnenter, og den skal aldri kunne
            leses som det. AGENTS.md: produksjonskunder navngis aldri som
            SoMe-abonnenter.
          */}
          <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
            Selskaper Reflektor har produsert foto og video for. Ikke alle er
            abonnementskunder.
          </p>
        </Container>
        <div className="mt-8">
          <Logorad dekorativ />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="rounded-flate border border-kant px-6 py-12 sm:px-14 sm:py-14">
            <h2 className="max-w-2xl text-3xl text-balance sm:text-4xl">
              Skal vi lage det samme for dere?
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-blekk-dempet">
              Fortell oss om bedriften, så lager vi et komplett strategiforslag
              til sosiale medier.
            </p>
            <Knappelenke href="/#kontakt" className="mt-8">
              Få et strategiforslag
            </Knappelenke>
          </div>
        </Container>
      </section>
    </>
  );
}
