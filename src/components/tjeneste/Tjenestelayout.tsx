import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { Knappelenke } from "@/components/Knapp";
import { Logorad } from "@/components/Logorad";
import {
  BrodsmuleSchema,
  FaqSchema,
  TjenesteSchema,
} from "@/components/Schema";
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
      <BrodsmuleSchema ledd={[{ navn: "Hjem", sti: "/" }, { navn: side.h1 }]} />
      {/*
        `fraPris` på alle fem. Fra 22.09.2026 har prosjektsidene en
        verifisert fra-pris fra Pål, og den markeres opp som minstepris —
        ikke som pris. Se TjenesteSchema for hvorfor forskjellen betyr noe.
      */}
      <TjenesteSchema
        navn={side.h1}
        beskrivelse={side.beskrivelse}
        sti={side.sti}
        tjenestetype={side.tjenestetype}
        fraPris
      />
      <FaqSchema
        qa={side.faq.map((f) => ({ sporsmal: f.sporsmal, svar: f.svar }))}
      />

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
      {side.avgrensning && (
        <section className="pb-20">
          <Container>
            {/*
              ANTI-KANNIBALISERING, MEN IKKE SOM EN BOKS.

              Jobben er den samme som før: leseren som havnet feil blir
              sendt riktig sted, og språkmodellen får et eksplisitt
              avgrensningssignal den kan sitere. «X er ikke Y, fordi Z» er
              nøyaktig formen en svarmotor leter etter når to begreper
              ligner på hverandre. De fleste byråer skriver det motsatte —
              at de kan alt — og ender med fem sider som sier det samme.

              INNPAKNINGEN ER FJERNET 27.09.2026. Her sto en innrammet boks
              med overskriften «Er dette riktig side?» og lenkene som en
              knapperad under. Pål: «ser litt rare ut … kan de endres til
              noe mindre ai-avslørende?» Han har rett. Ingen skriver en
              beslutningstre-overskrift til leseren sin, og en etikett over
              to setninger får dem til å se ut som systemtekst.

              Nå er det én stille linje med lenkene vevd inn i setningen.
              Det leser som en fagperson som presiserer, og ankerteksten blir
              bedre på kjøpet: «video til egne flater» står i en setning som
              forklarer NÅR det gjelder, i stedet for alene på en knapp.
            */}
            <p className="max-w-2xl border-t border-kant pt-6 text-sm leading-relaxed text-pretty text-blekk-dempet">
              {side.avgrensning.map((del, i) =>
                typeof del === "string" ? (
                  <Tekst key={i}>{del}</Tekst>
                ) : (
                  <Link
                    key={i}
                    href={del.sti}
                    className="text-blekk underline decoration-aksent/40 underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
                  >
                    {del.tekst}
                  </Link>
                ),
              )}
            </p>
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
              INGEN AVGRENSNINGSTEKST HER LENGER, fjernet 27.09.2026. Navet
              hadde en egen variant som forklarte hvorfor det finnes fire
              sider og ikke én. Kortene under viser nøyaktig det samme, med
              lenker — setningen var en innledning til noe leseren allerede
              ser.
            */}
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
                  {/*
                    SVARET KAN VÆRE FLERE AVSNITT. Delt på blank linje og
                    rendret som egne <p>. Før dette lå alt i én <p>, og
                    linjeskiftene i kilden kollapset — to avsnitt ble til
                    ett langt. Prissvarene er nettopp det: fakta først, så
                    det som nyanserer dem.
                  */}
                  {s.svar.split("\n\n").map((avsnitt, j) => (
                    <p
                      key={j}
                      className="mt-4 leading-relaxed text-pretty text-blekk-dempet"
                    >
                      <Tekst>{avsnitt}</Tekst>
                    </p>
                  ))}

                  {s.punkter && (
                    <ul className="mt-6 grid gap-3">
                      {s.punkter.map((p) => (
                        <li key={p} className="flex gap-3 text-pretty">
                          <span
                            aria-hidden
                            className="mt-2.5 size-1 shrink-0 rounded-full bg-aksent"
                          />
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
      {side.arbeid && side.arbeid.length > 0 && (
        <section className="pb-20">
          <Container>
            <Merkelapp som="h2">Fra arbeidet</Merkelapp>
            {/*
              RUTENETT, IKKE RULLEFELT. Her sto en vannrett rad med faste
              bredder. Med to medier fylte den venstre halvdel av skjermen og
              lot resten stå tom — det så ut som noe som ikke var ferdig
              lastet, og det var det Pål meldte fra om.

              Et rullefelt er dessuten feil form når det bare er fire saker:
              det lover mer enn det finnes, og på desktop kan man ikke se at
              raden kan dras i. Fire i et rutenett fyller bredden og viser
              alt med én gang.

              ETT FORMAT FOR ALLE. Stående 9:16, som klippene allerede er.
              Foto beskjæres med object-cover. Blandede formater ville gitt
              ujevn underkant — samme feil som arbeidsseksjonen på forsiden
              hadde.
            */}
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {side.arbeid.map((m) => (
                <li
                  key={m.sti}
                  className="relative aspect-[9/16] overflow-hidden rounded-medie bg-flate-dempet"
                >
                  {m.type === "foto" ? (
                    <Image
                      src={m.sti}
                      alt={m.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 24vw"
                      className="object-cover"
                    />
                  ) : (
                    <Klipp sti={m.sti} />
                  )}
                </li>
              ))}
            </ul>
          </Container>
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
      {/*
        INGEN BUNNPADDING HER. Bunnteksten har `mt-24`, og det er den
        gjennomgående luften mot footeren — se Bunnlogoer.tsx, der
        avstanden er begrunnet. Med `pb-24 sm:pb-32` i tillegg ble
        tomrommet 224 px, altså dobbelt, og Pål meldte at det så tomt ut
        rett over footeren. Målt 27.09.2026.
      */}
      <section>
        <Container>
          <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
            <h2 className="max-w-2xl text-3xl text-balance sm:text-4xl">
              Fortell oss hva dere skal lage
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-pa-dyp-dempet">
              Skriv kort om prosjektet, så får dere et forslag tilbake innen tre
              virkedager. Uforpliktende.
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
