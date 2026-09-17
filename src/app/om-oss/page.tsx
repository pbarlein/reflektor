import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { Knappelenke } from "@/components/Knapp";
import { Logorad } from "@/components/Logorad";
import { BrodsmuleSchema, TeamSchema } from "@/components/Schema";
import { omoss } from "@/content/omoss";
import { basisUrl } from "@/lib/miljo";

/**
 * /om-oss.
 *
 * SIDEN HAR ÉN JOBB på et nettsted som selger et abonnement: å svare på
 * «hvem står bak, og blir de her neste år». Alt annet er pynt.
 *
 * Derfor er rekkefølgen: hva vi er → hvordan vi jobber → hvorfor vi jobber
 * slik → hvem vi er → hvem vi har jobbet for → ta kontakt. Historien står
 * ikke øverst, slik «om oss»-sider pleier, fordi ingen leser en firmahistorie
 * før de vet hva firmaet gjør.
 *
 * FOLKENE STÅR MED NAVN OG ROLLE, ikke med portretter. Reflektor har ingen
 * godkjente portrettbilder i repoet, og et grått plassholderhode er verre
 * enn ingen — det sier «vi rakk ikke dette» om nettopp den siden som skal
 * bygge tillit. Navn og rolle er dessuten det `Person`-markeringen trenger.
 *
 * INGEN OPPDIKTEDE VERDIER. «Vi brenner for kvalitet» og liknende er den
 * vanligste utfyllingen på en om-oss-side og det svakeste innholdet som
 * finnes: det er ikke etterprøvbart, det skiller ikke selskapet fra noen,
 * og det er ikke noe en språkmodell kan sitere. De tre prinsippene som står
 * her er konkrete og kan motbevises — rytme, pris, målemetode.
 */

export const metadata: Metadata = {
  title: omoss.metaTittel,
  description: omoss.metaBeskrivelse,
  alternates: { canonical: `${basisUrl()}/om-oss` },
};

export default function OmOss() {
  return (
    <>
      <TeamSchema />
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Om oss" }]}
      />

      {/* ── Hvem vi er ───────────────────────────────────────────── */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:items-start lg:gap-16">
            <div>
              <h1 className="max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
                {omoss.h1}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-blekk-dempet">
                {omoss.ingress}
              </p>
            </div>

            {/*
              Klippet fra en produksjonsdag, ikke et kontorbilde. Siden
              handler om folk som produserer; da skal bildet vise
              produksjon. Det er dessuten det eneste motivet i arkivet som
              viser Reflektor selv og ikke en kundes produkt.
            */}
            <figure className="lg:pt-2">
              <div className="relative aspect-[9/16] overflow-hidden rounded-medie bg-flate-dempet">
                <Klipp sti="/reels/produksjonsdag" ivrig />
              </div>
              <figcaption className="mt-3 text-sm text-blekk-dempet">
                Fra en produksjonsdag hos en kunde.
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* ── Slik jobber vi ───────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
            <Eyebrow variant="dyp" som="h2">
              {omoss.prinsipper.tittel}
            </Eyebrow>

            {/*
              Tre prinsipper med loddrette hårstreker mellom seg, samme
              språk som prisarket og som stegene på forsiden. Skillene sier
              «tre sidestilte påstander», i motsetning til tidslinja, som
              sier «tre trinn i rekkefølge». Forskjellen er reell her:
              disse tre gjelder samtidig.
            */}
            <ul className="mt-10 grid sm:grid-cols-3">
              {omoss.prinsipper.punkter.map((p, i, alle) => (
                <li
                  key={p.tittel}
                  className={`border-t border-[color:var(--kant-pa-dyp)] pt-6 pb-8 last:pb-0 sm:border-t-0 sm:pb-0 sm:px-8 ${
                    i === 0 ? "sm:pl-0" : ""
                  } ${
                    i === alle.length - 1
                      ? "sm:pr-0"
                      : "sm:border-r sm:border-[color:var(--kant-pa-dyp)]"
                  } ${i === 0 ? "border-t-0 pt-0" : ""}`}
                >
                  <h3 className="text-lg font-medium">{p.tittel}</h3>
                  <p className="mt-3 leading-relaxed text-pretty text-pa-dyp-dempet">
                    {p.tekst}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Hvorfor vi jobber slik ───────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-start lg:gap-16">
            <Eyebrow som="h2">{omoss.historie.tittel}</Eyebrow>
            {/*
              `max-w-2xl` på løpende tekst. Dette er sidens eneste virkelige
              avsnittstekst, og den skal ha samme linjelengde som resten av
              siden bruker — rundt 70 tegn.
            */}
            <div className="max-w-2xl">
              {omoss.historie.avsnitt.map((a, i) => (
                <p
                  key={a}
                  className={`leading-relaxed text-pretty ${
                    i === 0
                      ? "text-xl text-blekk sm:text-2xl"
                      : "mt-5 text-blekk-dempet"
                  }`}
                >
                  {a}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Folkene ──────────────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Eyebrow som="h2">{omoss.team.tittel}</Eyebrow>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-flate border border-kant bg-kant sm:grid-cols-2 lg:grid-cols-4">
            {omoss.team.ansatte.map((a) => (
              /*
                `flex flex-col` med `mt-auto` på rollen. Uten det henger
                rollen rett under navnet, og «Magne Finseth da Fonseca»
                brekker til to linjer mens de tre andre ikke gjør det — da
                står fire roller på tre ulike høyder. Nå flukter de.
              */
              <li key={a.navn} className="flex flex-col bg-flate px-6 py-7">
                <p className="text-lg font-medium text-balance">{a.navn}</p>
                <p className="mt-auto pt-1.5 text-[0.9375rem] text-pretty text-blekk-dempet">
                  {a.rolle}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Hvem vi har jobbet for ───────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Merkelapp som="h2">Produksjonskunder</Merkelapp>
          {/*
            Samme forbehold som på /vart-arbeid, og det er ikke en gjentakelse
            man kan spare inn: en logorekke uten denne setningen leser som en
            kundeliste for abonnementet. AGENTS.md er eksplisitt — produksjons-
            kunder navngis aldri som SoMe-abonnenter.
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
              {omoss.cta.tittel}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
              {omoss.cta.tekst}
            </p>
            <Knappelenke href="/#kontakt" className="mt-8">
              {omoss.cta.knapp}
            </Knappelenke>
          </div>
        </Container>
      </section>
    </>
  );
}
