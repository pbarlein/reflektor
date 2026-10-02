import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Knappelenke } from "@/components/Knapp";
import { site, tilbud, kr } from "@/content/site";
import { basisUrl } from "@/lib/miljo";

/**
 * /en — én engelsk side, ikke en engelsk utgave av nettstedet.
 *
 * HVORFOR BARE ÉN. Et helt oversatt nettsted er en forpliktelse: hver
 * endring i norsk copy må speiles, og en engelsk side som henger et halvt
 * år etter er verre enn ingen. Dette er i stedet én side som svarer på det
 * en engelskspråklig faktisk lurer på — hva vi gjør, hva det koster, hvem
 * vi har jobbet for, og hvordan de får tak i oss.
 *
 * SKJEMAET ER PÅ NORSK, og knappen går derfor til /kontaktoss. Et engelsk
 * skjema ville krevd en egen variant av hele innsendingsveien — felter,
 * e-postmal, HubSpot-feltene — for en målgruppe vi ikke vet størrelsen på.
 * Her står e-post og telefon rett under knappen i stedet.
 *
 * INGEN FAQ-MARKERING. Nettstedet har FAQPage på seksten sider allerede, og
 * Google sier eksplisitt at samme spørsmål ikke skal merkes opp flere
 * steder. Denne siden gjentar innhold fra forsiden på et annet språk, og
 * det er nettopp den situasjonen der en duplikat-FAQ ville oppstått.
 *
 * TALLENE LESES FRA `tilbud` og `site`, ikke skrevet inn. Prisen står
 * dermed ett sted for hele nettstedet, uansett språk.
 */
export const metadata: Metadata = {
  title: "Social media agency in Oslo – fixed monthly price | Reflektor",
  description:
    "Reflektor films at your company one day a month and publishes 8–10 videos on Instagram and Facebook. NOK 30,000 per month, no lock-in.",
  alternates: {
    canonical: `${basisUrl()}/en`,
    /*
      HREFLANG PEKER BEGGE VEIER. Google krever at henvisningene er
      gjensidige: sier /en at forsiden er den norske utgaven, må forsiden si
      at /en er den engelske. Gjør den ikke det, ignoreres hele settet.
      Forsiden har samme blokk — se src/app/page.tsx.

      `x-default` er siden som skal vises når ingen av språkene passer.
      Forsiden er riktig valg: den er den fullstendige, og den engelske er
      en oppsummering.
    */
    languages: {
      "nb-NO": basisUrl(),
      en: `${basisUrl()}/en`,
      "x-default": basisUrl(),
    },
  },
};

function Seksjon({
  tittel,
  children,
}: {
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pb-14">
      <Container>
        <h2 className="max-w-2xl text-2xl text-balance sm:text-3xl">
          {tittel}
        </h2>
        <div className="mt-5 max-w-2xl">{children}</div>
      </Container>
    </section>
  );
}

export default function English() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Social media agency in Oslo – fixed monthly price",
    url: `${basisUrl()}/en`,
    inLanguage: "en",
    description:
      "Reflektor films at your company one day a month and publishes 8–10 videos on Instagram and Facebook.",
    about: { "@id": `${basisUrl()}/#organisasjon` },
    isPartOf: { "@id": `${basisUrl()}/#organisasjon` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />

      {/*
        `lang="en"` PÅ INNHOLDET, ikke på <html>. Rotelementet er `nb` for
        hele nettstedet, og det skal det være — header, footer og
        samtykkebanner er norske. Å sette `en` på artikkelen er det som
        faktisk er sant her, og det er dette skjermlesere leser.
      */}
      <article lang="en">
        <section className="pt-16 pb-12 sm:pt-24">
          <Container>
            <Eyebrow>In English</Eyebrow>
            <h1 className="mt-4 max-w-4xl text-3xl text-balance sm:text-4xl lg:text-5xl">
              Social media content, made in Oslo, at a fixed monthly price
            </h1>
            <p className="mt-8 max-w-3xl border-l-2 border-aksent pl-6 text-lg leading-relaxed text-pretty sm:pl-8 sm:text-xl">
              Reflektor is a social media agency and production company in Oslo.
              We spend one production day a month at your company and turn it
              into {tilbud.videoerPerManed} finished videos. We publish twice a
              week on Instagram and Facebook, all year. The price is NOK{" "}
              {kr(tilbud.prisPerManed)} per month, with no lock-in period.
            </p>
          </Container>
        </section>

        <Seksjon tittel="How it works">
          <ul className="grid gap-3">
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              <strong className="font-medium text-blekk">We plan.</strong> A
              content plan for the month, built around your goals and your
              season.
            </li>
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              <strong className="font-medium text-blekk">
                We film one day.
              </strong>{" "}
              Our team comes to you and shoots photo and video in one day.
            </li>
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              <strong className="font-medium text-blekk">
                We edit and publish.
              </strong>{" "}
              You get {tilbud.videoerPerManed} videos and two posts a week, plus
              all the files in 9:16 for TikTok and YouTube Shorts.
            </li>
          </ul>
        </Seksjon>

        <Seksjon tittel="Price">
          <ul className="grid gap-3">
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              <strong className="font-medium text-blekk">
                Ongoing subscription:
              </strong>{" "}
              NOK {kr(tilbud.prisPerManed)} per month. No lock-in, three months&rsquo;
              notice.
            </li>
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              <strong className="font-medium text-blekk">Single projects</strong>{" "}
              (commercials, company films, event coverage): from NOK{" "}
              {kr(tilbud.fraPrisProsjekt)}.
            </li>
            <li className="leading-relaxed text-pretty text-blekk-dempet">
              No hourly rates. Everything we produce is yours to use freely.
            </li>
          </ul>
        </Seksjon>

        <Seksjon tittel="Who we work with">
          <p className="leading-relaxed text-pretty text-blekk-dempet">
            We have produced for Anton Sport for over three years, made content
            for Egon&rsquo;s nearly 50 restaurants across Norway, and produced TV
            commercials for Vitusapotek and Peppes Pizza. Reflektor was named a
            Gazelle company by Dagens Næringsliv in 2025.
          </p>
        </Seksjon>

        <section className="pb-24 sm:pb-32">
          <Container>
            <div className="max-w-2xl rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
              <h2 className="text-2xl text-balance sm:text-3xl">Talk to us</h2>
              <p className="mt-5 leading-relaxed text-pretty text-pa-dyp-dempet">
                We work with companies across Norway and are happy to talk in
                English.
              </p>
              {/*
                KNAPPEN GÅR TIL DET NORSKE SKJEMAET, og det er med vilje — se
                filhodet. Kontaktopplysningene står rett under, slik at den
                som heller vil skrive en e-post slipper å gå via et skjema på
                et språk de ikke leser.
              */}
              <div className="mt-7">
                <Knappelenke href="/kontaktoss">Contact us</Knappelenke>
              </div>
              <p className="mt-5 text-sm text-pa-dyp-dempet">
                <a
                  href={`mailto:${site.kontakt.epost}`}
                  className="underline underline-offset-4 hover:text-pa-dyp"
                >
                  {site.kontakt.epost}
                </a>
                {" · "}
                <a
                  href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
                  className="underline underline-offset-4 hover:text-pa-dyp"
                >
                  {site.kontakt.telefon}
                </a>
                {` · ${site.kontakt.adresse}`}
              </p>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
