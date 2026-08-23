import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { HeroVideo } from "@/components/HeroVideo";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { hentTekst, slotsISeksjon, TbdMarkor } from "@/components/Slot";
import { front } from "@/content/sider/front";
import { site, tilbud, kundelogoer, landingssider } from "@/content/site";

/**
 * Forsiden – merkevaresiden (brief 3.0.1).
 *
 * Seks seksjoner i låst rekkefølge. To ting skiller den fra en landingsside:
 *
 * 1. Primær-CTA peker til /sosiale-medier-byra, ikke til skjemaet. Forsiden
 *    selger ikke ferdig – den sender videre.
 * 2. Den skal IKKE inneholde «sosiale medier byrå» i H1 eller title. Ordet
 *    tilhører abonnementssiden alene. To sider som kjemper om samme søkeord
 *    er kannibalisering, ikke dobbelt sjanse.
 *
 * Seksjon 4 er intern lenking som teller: fire kort som fører videre til
 * landingssidene.
 */
export const metadata: Metadata = {
  title: hentTekst(front, "front.meta.title") ?? undefined,
  description: hentTekst(front, "front.meta.description") ?? undefined,
  alternates: { canonical: "https://www.reflektor.no/" },
};

export default function Forside() {
  return (
    <>
      {/* 1 · HERO */}
      <section className="relative isolate overflow-hidden bg-mork py-20 text-blekk-invers sm:py-28">
        <HeroVideo className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-mork/55" aria-hidden="true" />
        <Container>
          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
            {hentTekst(front, "front.hero.h1") ?? <TbdMarkor id="front.hero.h1" />}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-blekk-invers/70">
            {hentTekst(front, "front.hero.sub") ?? <TbdMarkor id="front.hero.sub" />}
          </p>
          <div className="mt-10">
            {/* Peker til abonnementssiden, ikke til skjema (3.0.1). */}
            <Link
              href="/sosiale-medier-byra"
              className="knapp-skjev inline-block rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-hover"
            >
              {hentTekst(front, "front.hero.cta") ?? <TbdMarkor id="front.hero.cta" />}
            </Link>
          </div>
        </Container>
      </section>

      {/* 2 · ARBEIDET — hele beviset. Faktisk produsert video, ingen stock. */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-medium">
            {hentTekst(front, "front.work.h2") ?? <TbdMarkor id="front.work.h2" />}
          </h2>
          <p className="mt-3 text-blekk-dempet">
            {hentTekst(front, "front.work.sub") ?? <TbdMarkor id="front.work.sub" />}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {slotsISeksjon(front, 2)
              .filter((s) => s.id.includes("caption"))
              .map((slot) => (
              <li key={slot.id}>
                {/* aspect-ratio reserverer høyden før videoen finnes (CLS). */}
                <div className="flex aspect-[9/16] items-center justify-center bg-flate-dempet text-sm text-blekk-svak">
                  video
                </div>
                <p className="mt-2 text-sm text-blekk-dempet">
                  {slot.verdi ?? <TbdMarkor id={slot.id} />}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3 · ABONNEMENTET — komprimert. Lenker videre, selger ikke ferdig. */}
      <section className="pb-16">
        <Container>
          <div className="gradient-brun px-8 py-12 text-blekk-invers sm:px-12">
            <h2 className="text-3xl font-medium">
              {hentTekst(front, "front.sub.h2") ?? <TbdMarkor id="front.sub.h2" />}
            </h2>
            <p className="mt-5 max-w-2xl">
              {hentTekst(front, "front.sub.body") ?? <TbdMarkor id="front.sub.body" />}
            </p>

            {/* De fire tellbare punktene og prisen er låste fakta, ikke copy. */}
            <ul className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2">
              {tilbud.inngar.slice(0, 4).map((punkt) => (
                <li key={punkt} className="text-blekk-invers/80">
                  {punkt}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-3xl font-medium">
              {tilbud.prisPerManed.toLocaleString("nb-NO")} kr/mnd
            </p>

            <div className="mt-8">
              <Link
                href="/sosiale-medier-byra"
                className="knapp-skjev inline-block rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-hover"
              >
                {hentTekst(front, "front.sub.cta") ?? <TbdMarkor id="front.sub.cta" />}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 4 · ENGANGSOPPDRAG — intern lenking som teller. */}
      <section className="pb-16">
        <Container>
          <h2 className="text-2xl font-medium">
            {hentTekst(front, "front.services.h2") ?? (
              <TbdMarkor id="front.services.h2" />
            )}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {slotsISeksjon(front, 4)
              .filter((s) => s.id.includes("items"))
              .map((slot, i) => {
              const mal = landingssider[i] ?? landingssider[0];
              return (
                <li key={slot.id}>
                  <Link
                    href={`/${mal.slug}`}
                    className="block h-full border border-kant p-6 transition-colors hover:bg-flate-dempet"
                  >
                    {slot.verdi ?? <TbdMarkor id={slot.id} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 5 · KUNDER — produksjonskunder, aldri abonnenter. */}
      <section className="pb-16">
        <Container>
          <h2 className="text-2xl font-medium">
            {hentTekst(front, "front.clients.h2") ?? (
              <TbdMarkor id="front.clients.h2" />
            )}
          </h2>
          <p className="mt-4 max-w-xl text-blekk-dempet">
            {hentTekst(front, "front.clients.intro") ?? (
              <TbdMarkor id="front.clients.intro" />
            )}
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-blekk-dempet">
            {kundelogoer.map((kunde) => (
              <li key={kunde}>{kunde}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6 · KONTAKT */}
      <section id="kontakt" className="bg-mork py-16 text-blekk-invers">
        <Container>
          <div className="max-w-xl">
            <h2 className="text-3xl font-medium">
              {hentTekst(front, "front.contact.h2") ?? (
                <TbdMarkor id="front.contact.h2" />
              )}
            </h2>
            <p className="mt-4 text-blekk-invers/70">
              {hentTekst(front, "front.contact.sub") ?? (
                <TbdMarkor id="front.contact.sub" />
              )}
            </p>
            <Kontaktskjema side="/" />
          </div>
          <p className="mt-10 text-sm text-blekk-invers/50">
            {site.kontakt.epost} · {site.kontakt.telefon}
          </p>
        </Container>
      </section>
    </>
  );
}
