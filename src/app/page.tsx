import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ReelVegg } from "@/components/ReelVegg";
import { Anmeldelser } from "@/components/Anmeldelser";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { hentTekst, slotsISeksjon, TbdMarkor } from "@/components/Slot";
import {
  OrganisasjonSchema,
  TjenesteSchema,
  FaqSchema,
} from "@/components/Schema";
import { front } from "@/content/sider/front";
import { klarerteAnmeldelser } from "@/content/anmeldelser";
import { reels } from "@/content/reels";
import { redaksjonelt, band } from "@/content/arbeid";
import { Arbeidsnett, Arbeidsband } from "@/components/Arbeidsbilder";
import { site, tilbud } from "@/content/site";

/**
 * Forsiden.
 *
 * Seksjonsrekkefølgen følger evidensen, ikke briefens kapittel 3.0.1:
 * tilbudet over folden → arbeidet → prosess → pris → bevis → innvendinger →
 * kontakt. Alle tre researchsporene fant den rekkefølgen uavhengig.
 *
 * Grep som er bevisst utelatt, med begrunnelse i
 * docs/research-konvertering.md: scroll-utløst innfading (skjuler innhold til
 * JS har kjørt, forverrer LCP), auto-roterende hero-karusell (skjult innhold,
 * flyttende klikkmål), bakgrunnsvideo i hero (dyrest sted å legge video).
 *
 * Sticky CTA er også utelatt, men etter kildekontrollen 15.09 er grunnen en
 * annen enn før: Talabat-replikasjonen som sto som bevis mot sticky CTA
 * hadde et sticky element i BEGGE grupper og målte innholdet i det, ikke om
 * det fantes. Det finnes altså ikke bevis mot sticky CTA – bare fravær av
 * bevis for. Vi utelater den fordi den koster skjermplass på mobil og prisen
 * allerede står i heroen. Det er en designvurdering, ikke et forskningsfunn.
 */
export const metadata: Metadata = {
  title: hentTekst(front, "front.meta.title") ?? undefined,
  description: hentTekst(front, "front.meta.description") ?? undefined,
  alternates: { canonical: "https://www.reflektor.no/" },
};

function Tbd({ id }: { id: string }) {
  return <TbdMarkor id={id} />;
}

export default function Forside() {
  // FAQ-schemaet skal være ORDRETT identisk med det som står på siden.
  // Avvik mellom synlig tekst og markup er et kjent kvalitetsproblem, og
  // her koster det ingenting å unngå: begge leses fra samme slot.
  const faq = slotsISeksjon(front, 6)
    .map((slot) => slot.verdi?.split("|") ?? null)
    .filter((d): d is string[] => d !== null && d.length >= 2)
    .map((d) => ({ sporsmal: d[0].trim(), svar: d.slice(1).join("|").trim() }));

  return (
    <>
      {/*
        Entiteten eies av forsiden. Organization + LocalBusiness ligger kun
        her, ikke i layout — se begrunnelsen i Schema.tsx.

        Ingen Review eller AggregateRating. Google regner anmeldelser av seg
        selv, på egen side, som self-serving: det gir null stjerner OG er et
        regelbrudd. Se A33.
      */}
      <OrganisasjonSchema />
      <TjenesteSchema
        navn="Sosiale medier til fast månedspris"
        beskrivelse={hentTekst(front, "front.meta.description") ?? ""}
        sti="/"
      />
      <FaqSchema qa={faq} />

      {/* 1 · HERO — posisjonering i øvre halvdel av første skjerm.
          Rytmen varierer bevisst mellom seksjonene: jevn vertikal padding
          overalt er et malsignal. Forholdet mellom største og minste
          seksjonsrytme her er omtrent 3:1. */}
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-36">
        <Container>
          <h1 className="max-w-4xl text-[2.75rem] leading-[1.04] sm:text-6xl sm:leading-[1.02] lg:text-[5rem] lg:leading-[1.0]">
            {/* Kursiv, ikke oransje. Instrument Serif har en ekte kursiv, og
                den er den naturlige uthevingen i et seriffsnitt. Det frigjør
                aksentfargen til CTA-en alene — oransje to steder i samme
                viewport svekker knappen, som er det ene stedet fargen skal
                bety «trykk her». */}
            Sosiale medier – <em>nesten</em> på autopilot.
          </h1>

          <p className="mt-7 max-w-xl text-lg text-blekk-dempet">
            {hentTekst(front, "front.hero.sub") ?? <Tbd id="front.hero.sub" />}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            {/*
              Knappen bytter utseende når teksten mangler. Grunnen er ikke
              kosmetisk: TBD-markøren er oransje på lys flate, og inne i en
              oransje knapp blir den usynlig. Da ser previewen ut som en
              ferdig knapp uten tekst, i stedet for som en manglende slot.
              Preview er flaten Pål vurderer på — det skal være umulig å tro
              at noe er ferdig når det ikke er det.
            */}
            {hentTekst(front, "front.hero.cta") ? (
              <a
                href="#kontakt"
                className="rounded-interaktiv bg-aksent px-7 py-3.5 font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-aksent-hover"
              >
                {hentTekst(front, "front.hero.cta")}
              </a>
            ) : (
              <span className="inline-block rounded-interaktiv border border-dashed border-aksent px-7 py-3.5">
                <Tbd id="front.hero.cta" />
              </span>
            )}
            {/* Prisen står allerede her. Selvkvalifisering, og AEO vekter det. */}
            <p className="tracking-[0.02em] text-blekk-dempet">
              {tilbud.prisPerManed.toLocaleString("nb-NO")} kr/mnd · ingen
              bindingstid
            </p>
          </div>

          {/*
            Beviset står som SETNING, ikke som logorekke. Den tidligere
            rekken med sju navn sto rett under denne linjen og sa nesten det
            samme — fem av navnene var de samme.

            Setningen er dessuten det tryggere av de to: «Produserer foto og
            video for …» sier eksplisitt hva kundeforholdet ER. En bar rekke
            med navn under et tilbud om månedsabonnement inviterer til å lese
            dem som abonnenter, og det ville vært en feilaktig referanse.
          */}
          <p className="mt-10 max-w-xl text-sm tracking-[0.02em] text-blekk-dempet">
            {hentTekst(front, "front.hero.proof") ?? (
              <Tbd id="front.hero.proof" />
            )}
          </p>

        </Container>
      </section>

      {/* 2 · ARBEIDET — vis produktet før du forklarer det */}
      <section className="pb-28 sm:pb-36">
        <Container>
          <Eyebrow>{hentTekst(front, "front.work.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.work.h2") ?? <Tbd id="front.work.h2" />}
          </h2>
          <p className="mt-3 max-w-xl text-blekk-dempet">
            {hentTekst(front, "front.work.sub") ?? <Tbd id="front.work.sub" />}
          </p>
        </Container>
        <div className="mt-10">
          <ReelVegg reels={reels} />
        </div>

        {/*
          Stillbildene ligger i SAMME seksjon som klippene, under samme
          overskrift, uten eget mellomtittel-nivå.

          To grunner. Copy-protokollen: en ny seksjon ville krevd ny
          overskrift, og den skriver ikke jeg. Og innholdsmessig er det
          riktig — abonnementet leverer foto og video fra samme
          produksjonsdag, så å skille dem i to seksjoner ville antydet to
          leveranser der det er én.
        */}
        <Arbeidsnett bilder={redaksjonelt} />
      </section>

      {/* 3 · SLIK FUNGERER DET — mørk blokk som kapittelskille */}
      <section className="pb-20">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <Eyebrow variant="dyp">
              {hentTekst(front, "front.how.eyebrow")}
            </Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
              {hentTekst(front, "front.how.h2") ?? <Tbd id="front.how.h2" />}
            </h2>

            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {slotsISeksjon(front, 3)
                .filter((s) => s.id.includes("steps"))
                .map((slot, i) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  return (
                    <li key={slot.id}>
                      <span className="font-mono text-sm text-aksent">
                        {i + 1}
                      </span>
                      {delt ? (
                        <>
                          <h3 className="mt-3 text-lg font-medium">
                            {delt[0].trim()}
                          </h3>
                          <p className="mt-2 text-pa-dyp-dempet">
                            {delt.slice(1).join("|").trim()}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3">
                          <Tbd id={slot.id} />
                        </p>
                      )}
                    </li>
                  );
                })}
            </ol>
          </div>
        </Container>
      </section>

      {/*
        4 · PRIS

        Prisen er kvalifiseringsøyeblikket. Første versjon var venstrestilt
        løpende tekst — tallet, vilkårene, listen og forbeholdet under
        hverandre i én spalte — og den leste som nok et avsnitt i stedet for
        som et tilbud.

        Nå har den en egen flate med hårstrek rundt. Ikke et kort med skygge,
        som er 2020-språket: en ramme og et flatebytte. Tallet og vilkårene
        står i samme blikk øverst, listen under en delelinje, og forbeholdet
        nederst i sin egen celle.

        At det som IKKE inngår står like tydelig som det som inngår, er et
        valg. Å tie om det ville gjort tilbudet lettere å love og vanskeligere
        å tro på.
      */}
      <section className="pb-28 sm:pb-36">
        <Container>
          <Eyebrow>{hentTekst(front, "front.price.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.price.h2") ?? <Tbd id="front.price.h2" />}
          </h2>

          <div className="mt-10 rounded-flate border border-kant-regel">
            {/* Tallet og vilkårene i samme blikk */}
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 p-7 sm:p-10">
              <p className="text-6xl leading-[0.9] tracking-[-0.03em] sm:text-7xl">
                {tilbud.prisPerManed.toLocaleString("nb-NO")}
                <span className="text-3xl tracking-normal text-blekk-dempet">
                  {" "}
                  kr/mnd
                </span>
              </p>
              <p className="text-lg text-balance">
                Tre måneders oppsigelse.
                <br className="hidden sm:block" /> Ingen bindingstid.
              </p>
            </div>

            {/*
              Ingen kolonnemellomrom. Første versjon hadde gap-x-12, og da
              brøt hårstrekene i mellomrommet — to korte streker per rad i
              stedet for én. Det leste som en feil, ikke som et valg.

              Nå møtes de: skillet mellom kolonnene er en loddrett strek, og
              radskillene går ubrutt tvers over. Panelet leser som et bord.
            */}
            <ul className="grid border-t border-kant sm:grid-cols-2">
              {tilbud.inngar.map((punkt, i) => (
                <li
                  key={punkt}
                  className={`flex gap-3.5 border-b border-kant px-7 py-4 sm:px-10 ${
                    i % 2 === 0 ? "sm:border-r sm:border-r-kant" : ""
                  }`}
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-aksent"
                    aria-hidden="true"
                  />
                  <span className="text-[0.95rem] leading-relaxed">{punkt}</span>
                </li>
              ))}
            </ul>

            <div className="grid gap-x-12 gap-y-4 bg-flate-dempet/60 p-7 sm:grid-cols-2 sm:p-10">
              <p className="text-[0.95rem] leading-relaxed text-blekk-dempet">
                <span className="font-medium text-blekk">Inngår ikke: </span>
                {tilbud.inngarIkke.join(", ").toLowerCase()}.
              </p>
              <p className="text-[0.95rem] leading-relaxed text-blekk-dempet">
                {hentTekst(front, "front.price.note") ?? (
                  <Tbd id="front.price.note" />
                )}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5 · ANMELDELSER — navngitt bevis, stram form */}
      <section className="pb-20">
        <Container>
          <Eyebrow>{hentTekst(front, "front.reviews.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.reviews.h2") ?? (
              <Tbd id="front.reviews.h2" />
            )}
          </h2>
        </Container>
        <Anmeldelser
          fremhevet={klarerteAnmeldelser[0]}
          ovrige={klarerteAnmeldelser.slice(1)}
        />
      </section>

      {/*
        Tett bånd i full bredde, mellom beviset og innvendingene.

        Plasseringen er valgt: anmeldelsene sier at folk er fornøyde, båndet
        viser hvor mye de faktisk får. Rekkefølgen er «andre mener dette» →
        «her er mengden» → «her er det du lurer på» → skjema.

        Bryter containeren med vilje, og har ingen overskrift. Et bånd som
        stopper ved tekstbredden leser som en illustrasjon; ett som går ut av
        skjermen leser som en strøm. Uten overskrift leser det som en pause i
        argumentet, ikke som en ny seksjon — og det er nøyaktig jobben.
      */}
      <section className="pb-24" aria-label="Utvalg fra arbeidet">
        <Arbeidsband bilder={band} />
      </section>

      {/* 6 · FAQ — native details, ingen JavaScript */}
      <section className="pb-24">
        <Container>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Det folk lurer på før de tar kontakt
          </h2>
          <div className="mt-10 max-w-2xl divide-y divide-kant border-y border-kant">
            {slotsISeksjon(front, 6).map((slot) => {
              const delt = slot.verdi?.split("|") ?? null;
              return (
                <details key={slot.id} className="group py-5">
                  <summary className="cursor-pointer font-medium">
                    {delt ? delt[0].trim() : <Tbd id={slot.id} />}
                  </summary>
                  {delt && (
                    <p className="mt-3 text-blekk-dempet">
                      {delt.slice(1).join("|").trim()}
                    </p>
                  )}
                </details>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 7 · KONTAKT */}
      <section id="kontakt" className="pb-24">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <div>
                <h2 className="text-3xl sm:text-4xl">
                  {hentTekst(front, "front.contact.h2") ?? (
                    <Tbd id="front.contact.h2" />
                  )}
                </h2>
                <p className="mt-4 max-w-sm text-pa-dyp-dempet">
                  {hentTekst(front, "front.contact.sub") ?? (
                    <Tbd id="front.contact.sub" />
                  )}
                </p>

                <div className="mt-10 text-sm text-pa-dyp-dempet">
                  <p className="font-medium text-pa-dyp">
                    {site.kontakt.firma}
                  </p>
                  <p className="mt-1">{site.kontakt.adresse}</p>
                  <p className="mt-3">
                    <a href={`mailto:${site.kontakt.epost}`} className="hover:text-pa-dyp">
                      {site.kontakt.epost}
                    </a>
                  </p>
                </div>
              </div>

              {/* Skjemaet på lys flate — kontrast mot den mørke blokken, og
                  feltene leser som felt. */}
              <div className="rounded-flate bg-flate p-6 text-blekk sm:p-8">
                <Kontaktskjema side="/" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
