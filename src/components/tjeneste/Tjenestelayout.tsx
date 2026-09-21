import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { Knappelenke } from "@/components/Knapp";
import { Logorad } from "@/components/Logorad";
import { BrodsmuleSchema, FaqSchema, TjenesteSchema } from "@/components/Schema";
import { eiker, type Tjenesteside } from "@/content/tjenester";

import { Tekst } from "./Tekst";

/**
 * Felles layout for tjenestesidene.
 *
 * REKKEFØLGEN ER IKKE SMAK. Den følger av at 44,2 % av alle LLM-siteringer
 * hentes fra de første 30 % av en side, og 55 % for Google AI Overviews.
 * Derfor står svaret øverst, som eget designelement, før bevis og før
 * argumentasjon. En side som bygger opp til poenget sitt blir sitert på
 * oppbyggingen.
 *
 * Se docs/synlighet-2026.md for kildene og docs/sidearkitektur.md for
 * hvorfor avgrensningsblokken finnes.
 *
 * «DERE», IKKE «DU». Overskriftene sa «Er du på riktig side?» og «Det du
 * lurer på», mens brødteksten på samme side sier «dere» gjennomgående.
 * Nettstedet snakker til et selskap, ikke til en privatperson — og et
 * personskifte midt på siden leser som to forfattere. Avgrensningsblokken
 * er omformulert til «Er dette riktig side?», som slipper unna valget helt.
 */
export function Tjenestelayout({
  side,
  nav = false,
}: {
  side: Tjenesteside;
  nav?: boolean;
}) {
  return (
    <>
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: side.h1 }]}
      />
      <TjenesteSchema
        navn={side.h1}
        beskrivelse={side.beskrivelse}
        sti={side.sti}
        tjenestetype={side.tjenestetype}
      />
      <FaqSchema qa={side.faq.map((f) => ({ sporsmal: f.sporsmal, svar: f.svar }))} />

      {/* ── Svaret, før alt annet ─────────────────────────────────── */}
      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <Container>
          <Eyebrow>{side.merkelapp}</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            {side.h1}
          </h1>

          {/*
            SVARET SOM EGET ELEMENT, ikke som ingress. Større grad, egen
            venstrekant, og det eneste som står i denne blokken. Både
            leseren og en språkmodell skal kunne hente hele svaret herfra
            uten å lese videre — det er hele poenget med å sette det først.
          */}
          <p className="mt-8 max-w-3xl border-l-2 border-aksent pl-6 text-lg leading-relaxed text-pretty sm:pl-8 sm:text-xl">
            <Tekst>{side.svar}</Tekst>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Knappelenke href="/#kontakt">Få et forslag</Knappelenke>
            <p className="text-sm text-blekk-dempet">
              Svar innen 3 virkedager. Uforpliktende.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Toppbilde, der siden ikke allerede har klipp ──────────── */}
      {side.bilde && (
        <section className="pb-20">
          <Container>
            <figure className="relative aspect-[21/9] overflow-hidden rounded-flate bg-flate-dempet sm:aspect-[21/8]">
              <Image
                src={`/arbeid/${side.bilde.fil}.jpg`}
                alt={side.bilde.alt}
                fill
                priority
                sizes="(min-width: 1280px) 68rem, 100vw"
                className="object-cover"
                style={
                  side.bilde.fokus
                    ? { objectPosition: side.bilde.fokus }
                    : undefined
                }
              />
            </figure>
          </Container>
        </section>
      )}

      {/* ── Avgrensning: hva siden IKKE dekker ────────────────────── */}
      {side.avgrensning.lenker.length > 0 && (
        <section className="pb-20">
          <Container>
            {/*
              ANTI-KANNIBALISERING SOM SYNLIG DESIGN.

              Blokken gjør to jobber på én gang. Leseren som havnet feil
              blir sendt riktig sted med én gang, i stedet for å lese en
              hel side om noe annet. Og språkmodellen får et eksplisitt
              avgrensningssignal den kan sitere — «X er ikke Y, fordi Z» er
              nøyaktig formen en svarmotor leter etter når to begreper
              ligner på hverandre.

              De fleste byråer skriver det motsatte: at de kan alt. Det gir
              fem sider som sier det samme, og en søkemotor som ikke vet
              hvilken av dem den skal vise.
            */}
            <div className="rounded-flate border border-kant px-6 py-8 sm:px-10 sm:py-9">
              <Merkelapp som="h2">Er dette riktig side?</Merkelapp>
              <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
                <Tekst>{side.avgrensning.tekst}</Tekst>
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {side.avgrensning.lenker.map((l) => (
                  <li key={l.sti}>
                    <Link
                      href={l.sti}
                      className="inline-flex min-h-6 items-center gap-2 underline decoration-transparent underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
                    >
                      {l.tekst}
                      <span aria-hidden className="text-aksent">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* ── Eikene, bare på navet ─────────────────────────────────── */}
      {nav && (
        <section className="pb-20">
          <Container>
            <Merkelapp som="h2">Fire typer prosjekter</Merkelapp>
            <h3 className="display mt-4 max-w-2xl text-2xl text-balance sm:text-[1.75rem]">
              Skilt på hvor innholdet skal vises — ikke på hvordan det ser ut
            </h3>
            {/*
              Navets avgrensning rendres HER og ikke i blokken over, fordi
              den ikke har noe å avgrense MOT. Den forklarer i stedet hvorfor
              det finnes fire sider og ikke én, og det hører hjemme rett over
              de fire.
            */}
            <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-blekk-dempet">
              <Tekst>{side.avgrensning.tekst}</Tekst>
            </p>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-flate bg-kant sm:grid-cols-2">
              {eiker.map((e) => (
                <li key={e.sti} className="bg-flate">
                  <Link
                    href={e.sti}
                    className="group flex h-full flex-col p-7 transition-colors hover:bg-flate-dempet motion-reduce:transition-none sm:p-9"
                  >
                    <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
                      {e.flate}
                    </p>
                    <h3 className="display mt-4 text-2xl sm:text-[1.75rem]">
                      <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                        {e.navn}
                      </span>
                    </h3>
                    <p className="mt-3 grow leading-relaxed text-pretty text-blekk-dempet">
                      {e.beskrivelse}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── Seksjonene ────────────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-x-10 gap-y-14 lg:grid-cols-[9rem_1fr]">
            <Merkelapp className="lg:pt-2" som="h2">
              Det dere lurer på
            </Merkelapp>
            <div className="max-w-2xl">
              {side.seksjoner.map((s, i) => (
                <div
                  key={s.sporsmal}
                  className={i > 0 ? "mt-14 border-t border-kant pt-14" : ""}
                >
                  {/*
                    h3 og ikke h2: seksjonen over eier h2-en. Men typografisk
                    er dette sidens bærende overskrifter, og `.display` er
                    designsystemets egen utgang for akkurat det — se
                    overstyringer.css.
                  */}
                  <h3 className="display text-2xl text-balance sm:text-[1.75rem]">
                    {s.sporsmal}
                  </h3>
                  <p className="mt-4 leading-relaxed text-pretty text-blekk-dempet">
                    <Tekst>{s.svar}</Tekst>
                  </p>

                  {s.punkter && (
                    <ul className="mt-6 grid gap-3">
                      {s.punkter.map((p) => (
                        <li key={p} className="flex gap-3 text-pretty">
                          <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-aksent" />
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/*
                    SITATET ER IKKE PYNT. GEO-studien (Aggarwal et al., ACM
                    KDD 2024) målte at sitater øker siteringssannsynligheten
                    i svarmotorer med 37 % — det største enkeltgrepet de
                    testet. Sitatene her er hentet ordrett fra Googles
                    anmeldelser i src/content/anmeldelser.ts. Ingen er
                    omskrevet.
                  */}
                  {s.sitat && (
                    <figure className="mt-8 rounded-flate bg-dyp px-6 py-7 text-pa-dyp sm:px-8">
                      <blockquote className="text-pretty">
                        <p className="leading-relaxed">«{s.sitat.tekst}»</p>
                      </blockquote>
                      <figcaption className="mt-5 font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                        {s.sitat.navn}
                        <span aria-hidden className="px-2 text-aksent-pa-dyp">
                          ·
                        </span>
                        {s.sitat.rolle}
                      </figcaption>
                    </figure>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Klipp, der siden har dem ──────────────────────────────── */}
      {side.klipp && side.klipp.length > 0 && (
        <section className="pb-20">
          <Container>
            <Merkelapp som="h2">Fra arbeidet</Merkelapp>
          </Container>
          <div className="mt-8">
            <ul className="flex gap-4 overflow-x-auto px-6 pb-2 sm:gap-6 sm:px-10">
              {side.klipp.map((fil) => (
                <li
                  key={fil}
                  className="relative aspect-[9/16] w-[14rem] shrink-0 overflow-hidden rounded-medie bg-flate-dempet sm:w-[17rem]"
                >
                  <Klipp sti={`/reels/${fil}`} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[9rem_1fr]">
            <Merkelapp className="lg:pt-3" som="h2">
              Flere spørsmål
            </Merkelapp>
            <div className="max-w-2xl">
              {/*
                FAQ PÅ HVER TJENESTESIDE, ikke bare på /faq. FAQ-schema
                korrelerer med ca. 40 % høyere siteringsvekt i ChatGPT, og
                svarene ligger i DOM-en også når trekkspillet er lukket —
                språkmodeller klikker ikke.
              */}
              <div className="border-t border-kant">
                {side.faq.map((f) => (
                  <details
                    key={f.sporsmal}
                    name={`faq-${side.sti}`}
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
                      <Tekst>{f.svar}</Tekst>
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Produksjonskunder ─────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <Merkelapp som="h2">Produksjonskunder</Merkelapp>
          {/*
            AGENTS.md: produksjonskunder navngis aldri som SoMe-abonnenter.
            Setningen står derfor her, som den gjør på /vart-arbeid.
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

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
            <h2 className="max-w-2xl text-3xl text-balance sm:text-4xl">
              Fortell oss hva dere skal lage
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-pa-dyp-dempet">
              Skriv kort om prosjektet, så får dere et forslag tilbake innen
              tre virkedager. Uforpliktende.
            </p>
            <Knappelenke href="/#kontakt" className="mt-8">
              Få et forslag
            </Knappelenke>
          </div>
        </Container>
      </section>
    </>
  );
}
