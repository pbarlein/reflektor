import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { HeroVideo } from "@/components/HeroVideo";
import { StickyCta } from "@/components/StickyCta";
import { FaqSchema, TjenesteSchema } from "@/components/Schema";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { SlotTekst, hentTekst, slotsISeksjon, TbdMarkor } from "@/components/Slot";
import { home } from "@/content/sider/home";
import { kundelogoer } from "@/content/site";

/**
 * /sosiale-medier-byra – abonnementssiden.
 *
 * Seksjonsrekkefølgen er LÅST (brief kapittel 6). Antall seksjoner kan
 * reduseres, aldri omrokeres.
 *
 * Copy hentes etter protokollen i kapittel 9. Slots uten godkjent tekst vises
 * som TBD-markør – content:check hindrer at de når produksjon.
 *
 * Fellesregler fra 6.1 som styrer layouten her: hele tilbudet i første
 * skjermbilde, H1 under 8 ord, navngitt bevis over folden, én primær CTA,
 * maks fire skjemafelt, sitat plassert ved CTA, sticky CTA på mobil og inline
 * på desktop – ikke begge.
 */
export const metadata: Metadata = {
  // Hentes fra innholdslaget, ikke skrevet her (brief 8.3).
  title: hentTekst(home, "home.meta.title") ?? undefined,
  description: hentTekst(home, "home.meta.description") ?? undefined,
  alternates: { canonical: "https://www.reflektor.no/sosiale-medier-byra" },
};

export default function Abonnementssiden() {
  const h1 = hentTekst(home, "home.hero.h1");
  const cta = hentTekst(home, "home.hero.cta");

  /*
   * FAQ-schema bygges kun av spørsmål som faktisk har godkjent tekst.
   * Formatet er spørsmål på første linje, svar på resten.
   */
  const faq = slotsISeksjon(home, 9)
    .filter((s) => s.verdi)
    .map((s) => {
      const [sporsmal, ...resten] = s.verdi!.split("\n");
      return { sporsmal, svar: resten.join("\n").trim() };
    })
    .filter((p) => p.svar);

  return (
    <>
      <TjenesteSchema
        navn="Sosiale medier på fast pris"
        beskrivelse="Strategi, produksjon, redigering og publisering på Instagram og Facebook."
        sti="/sosiale-medier-byra"
      />
      <FaqSchema qa={faq} />
      {/* 1 · HERO — bakgrunnssløyfe av eget arbeid, poster først */}
      <section className="relative isolate overflow-hidden bg-mork py-16 text-blekk-invers sm:py-24">
        <HeroVideo className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        {/* Beskyttelsesgradient sikrer AA-kontrast på tekst over video (8.6) */}
        <div
          className="absolute inset-0 -z-10 bg-mork/55"
          aria-hidden="true"
        />
        <Container>
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            {h1 ?? <TbdMarkor id="home.hero.h1" />}
          </h1>
          <SlotTekst
            side={home}
            id="home.hero.sub"
            som="p"
            className="mt-6 block max-w-xl text-lg text-blekk-invers/70"
          />
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {/* Inline på desktop. På mobil tar StickyCta over (6.1). */}
            <a
              href="#kontakt"
              className="knapp-skjev hidden rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-hover sm:inline-block"
            >
              {cta ?? <TbdMarkor id="home.hero.cta" />}
            </a>
          </div>
          {/* Navngitt bevis over folden (6.1) */}
          <SlotTekst
            side={home}
            id="home.hero.proof"
            som="p"
            className="mt-8 block text-sm text-blekk-invers/60"
          />
        </Container>
      </section>

      {/* 2 · HVA DU FÅR */}
      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-medium">Hva du får</h2>
          <ul className="mt-8 grid gap-px overflow-hidden border border-kant bg-kant sm:grid-cols-2 lg:grid-cols-4">
            {slotsISeksjon(home, 2).map((slot) => (
              <li key={slot.id} className="bg-flate p-6 text-lg">
                {slot.verdi ?? <TbdMarkor id={slot.id} />}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3 · PRIS OG VILKÅR — skal stå tidlig, viktigste innvending */}
      <section className="pb-14">
        <Container>
          <div className="gradient-brun px-8 py-12 text-blekk-invers sm:px-12">
            <h2 className="text-2xl font-medium">Pris og vilkår</h2>
            <p className="mt-4 text-4xl font-medium sm:text-5xl">
              {hentTekst(home, "home.pricing.amount")}
            </p>
            <p className="mt-3 text-lg">{hentTekst(home, "home.pricing.terms")}</p>
            <SlotTekst
              side={home}
              id="home.pricing.note"
              som="p"
              className="mt-6 block max-w-xl text-blekk-invers/70"
            />
          </div>
        </Container>
      </section>

      {/* 4 · ARBEIDET — rutenett av faktisk produsert video, ingen stock */}
      <section className="pb-14">
        <Container>
          <h2 className="text-2xl font-medium">Arbeidet</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {slotsISeksjon(home, 4).map((slot) => (
              <li key={slot.id}>
                {/* aspect-ratio løser både beskjæring og CLS i samme grep (8.1.1).
                    9:16 er formatet som faktisk leveres. */}
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

      {/* 5 · SLIK FUNGERER DET */}
      <section className="bg-flate-dempet py-14">
        <Container>
          <h2 className="text-2xl font-medium">Slik fungerer det</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {slotsISeksjon(home, 5).map((slot, i) => (
              <li key={slot.id}>
                <span className="font-mono text-sm text-aksent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2">{slot.verdi ?? <TbdMarkor id={slot.id} />}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 6 · HVEM VI PRODUSERER FOR — produksjonskunder, aldri abonnenter */}
      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-medium">Hvem vi produserer for</h2>
          <SlotTekst
            side={home}
            id="home.clients.intro"
            som="p"
            className="mt-4 block max-w-xl text-blekk-dempet"
          />
          <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-blekk-dempet">
            {kundelogoer.map((kunde) => (
              <li key={kunde}>{kunde}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 8 · ENGANGSOPPDRAG */}
      <section className="pb-14">
        <Container>
          <h2 className="text-2xl font-medium">Trenger dere bare én ting?</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {slotsISeksjon(home, 8).map((slot) => (
              <li key={slot.id} className="border border-kant p-6">
                {slot.verdi ?? <TbdMarkor id={slot.id} />}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 9 · FAQ — native details, ingen JavaScript (8.1.1) */}
      <section className="pb-14">
        <Container>
          <h2 className="text-2xl font-medium">Ofte stilte spørsmål</h2>
          <div className="mt-8 max-w-2xl divide-y divide-kant border-y border-kant">
            {slotsISeksjon(home, 9).map((slot) => (
              <details key={slot.id} className="py-4">
                <summary className="cursor-pointer font-medium">
                  {slot.verdi ? slot.verdi.split("\n")[0] : <TbdMarkor id={slot.id} />}
                </summary>
                {slot.verdi && (
                  <p className="mt-3 text-blekk-dempet">
                    {slot.verdi.split("\n").slice(1).join("\n")}
                  </p>
                )}
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* 7 + 10 · SITAT VED CTA, SÅ KONTAKT (6.1: sitat plasseres ved CTA) */}
      <section id="kontakt" className="bg-mork py-16 text-blekk-invers">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SlotTekst
                side={home}
                id="home.contact.h2"
                som="h2"
                className="block text-3xl font-medium"
              />
              <SlotTekst
                side={home}
                id="home.contact.sub"
                som="p"
                className="mt-4 block max-w-md text-blekk-invers/70"
              />
              <Kontaktskjema />
            </div>

            <figure className="lg:pt-4">
              <blockquote className="text-xl text-blekk-invers/90">
                <SlotTekst side={home} id="home.quote.body" />
              </blockquote>
              <figcaption className="mt-4 text-sm text-blekk-invers/60">
                <SlotTekst side={home} id="home.quote.attrib" />
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* Luft så den faste knappen ikke dekker skjemaets sendeknapp */}
      <div className="h-20 sm:hidden" aria-hidden="true" />
      <StickyCta tekst={cta ?? "Ta kontakt"} />
    </>
  );
}
