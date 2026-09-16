import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ReelVegg } from "@/components/ReelVegg";
import {
  AnmeldelseFremhevet,
  Anmeldelsesrutenett,
} from "@/components/Anmeldelser";
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
import { arbeidskolonner, band } from "@/content/arbeid";
import { Arbeidskolonner, Arbeidsband } from "@/components/Arbeidsbilder";
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

            {/*
              Loddrette hårstreker mellom stegene, i samme språk som
              prisbordet. --kant-pa-dyp er en egen verdi: den vanlige
              hårstreken er regnet mot beige og forsvinner helt på brunt.

              Skillene er strukturelle, ikke dekor — de sier at dette er tre
              trinn i rekkefølge, ikke tre likestilte påstander.
            */}
            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0">
              {slotsISeksjon(front, 3)
                .filter((s) => s.id.includes("steps"))
                .map((slot, i) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  return (
                    <li
                      key={slot.id}
                      className={`sm:px-8 ${i === 0 ? "sm:pl-0" : ""} ${
                        i < 2 ? "sm:border-r sm:border-[color:var(--kant-pa-dyp)]" : "sm:pr-0"
                      }`}
                    >
                      <span className="font-mono text-sm text-aksent-pa-dyp">
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
        Stillbildene står nå som EGEN seksjon etter prosessblokken, ikke rett
        under klippene.

        Grunnen er rytme: reel-veggen og åtte store bilder rett etter
        hverandre ble en vegg av bildeflate uten pusterom, og leseren mistet
        argumentet mellom dem. Prosessblokken deler dem — video, tekst, foto —
        og fotonettet får da også fungere som bevis PÅ det blokken nettopp
        påsto, i stedet for som mer av det samme.

        Ingen egen overskrift, med vilje. Seksjonen er et visuelt pustehull i
        argumentet, ikke et nytt kapittel, og en overskrift ville gjort den
        til det siste.
      */}
      <section className="pb-28 sm:pb-36" aria-label="Arbeid fra produksjonsdager">
        <Arbeidskolonner kolonner={arbeidskolonner} />
      </section>

      {/*
        4 · PRIS

        Prisen er kvalifiseringsøyeblikket. Den var tidligere en venstrestilt
        tekstspalte, og leste som en prisliste i stedet for som et tilbud.

        Tre grep, alle basert på at seksjonen manglet visuelt uttrykk og ikke
        informasjon:

        1. TALLET I SERIFF, i display-grad. Det var satt i Poppins fordi det
           ligger i en <p>. Et seksifret beløp i høykontrast-seriff på 8rem er
           forskjellen på at prisen leses som en opplysning og at den leses
           som et løfte. Skalakontrast er det billigste wow-grepet som finnes,
           og det eneste som ikke er dekor.

        2. ET BILDE. Seksjonen solgte en produksjonsdag uten å vise en. Bildet
           viser nettopp opptak, og står i samme rad som tallet — det binder
           prisen til det man får for den.

        3. TALLRAD. De tre tellbare størrelsene — 1 produksjonsdag, 8–10
           videoer, 2 publiseringer i uken — lå begravet i kulepunkter. De er
           tall, og tall skal se ut som tall. Verdiene leses fra `tilbud`, og
           ordene er de samme som står i den godkjente copyen.

        Tallraden ligger i venstre spalte og ikke under begge, slik at bildet
        får fylle sin spalte i full høyde. Ellers oppstår et tomrom som gjør
        at seksjonen ser uferdig ut nettopp der den skal virke mest sikker.

        Det som inngår er beholdt som bord, men nedtonet: det er
        dokumentasjon, ikke argument.
      */}
      <section className="pb-28 sm:pb-36">
        <Container>
          <Eyebrow>{hentTekst(front, "front.price.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.price.h2") ?? <Tbd id="front.price.h2" />}
          </h2>

          {/*
            Tallet, vilkårene og tallraden i venstre spalte; bildet fyller
            høyre i full høyde.

            Første forsøk satte de to spaltene side om side med items-end, og
            da ble tallet bunnjustert mot et høyt bilde — med et stort tomrom
            over. Bildet skal ramme inn spalten, ikke bestemme hvor teksten
            begynner.
          */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="flex flex-col justify-between gap-12">
              <div>
                {/* Verdien leses fra tilbud, aldri skrevet inn her. Prisen
                    står flere steder på siden, og de skal ikke kunne gli fra
                    hverandre. */}
                <p className="font-[family-name:var(--font-display-serif)] text-[5.5rem] leading-[0.82] tracking-[-0.03em] sm:text-[8rem] lg:text-[8.5rem]">
                  {tilbud.prisPerManed.toLocaleString("nb-NO")}
                </p>
                <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-lg">
                  <span className="text-blekk-dempet">kr/mnd</span>
                  <span
                    className="hidden h-4 w-px bg-kant-regel sm:block"
                    aria-hidden="true"
                  />
                  <span>Tre måneders oppsigelse. Ingen bindingstid.</span>
                </p>
              </div>

              {/* Tallrad — de tellbare størrelsene, hentet fra tilbud */}
              <dl className="grid grid-cols-3 border-t border-kant-regel pt-8">
                {[
                  [tilbud.produksjonsdagerPerManed, "produksjonsdag", "i måneden"],
                  [tilbud.videoerPerManed, "ferdige videoer", "hver måned"],
                  [tilbud.posterPerUke, "publiseringer", "i uken"],
                ].map(([tall, ord, nar], i) => (
                  <div
                    key={ord}
                    className={i > 0 ? "border-l border-kant pl-5" : "pr-5"}
                  >
                    <dt className="sr-only">{`${ord} ${nar}`}</dt>
                    <dd>
                      <span className="block font-[family-name:var(--font-display-serif)] text-4xl leading-none tracking-[-0.02em] sm:text-5xl">
                        {tall}
                      </span>
                      <span className="mt-3 block text-sm leading-snug tracking-[0.02em] text-blekk-dempet">
                        {ord}
                        <br />
                        {nar}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="relative aspect-[4/3] overflow-hidden rounded-flate bg-flate-dempet lg:aspect-auto">
              <Image
                src="/arbeid/dag4-1600.jpg"
                alt="Opptak med kamera under en produksjonsdag"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </figure>
          </div>

          {/* Dokumentasjonen: hva som inngår, og hva som ikke gjør det */}
          <div className="mt-14 rounded-flate border border-kant">
            <ul className="grid sm:grid-cols-2">
              {tilbud.inngar.map((punkt, i) => (
                <li
                  key={punkt}
                  className={`flex gap-3.5 px-6 py-4 text-[0.9rem] leading-relaxed text-blekk-dempet sm:px-8 ${
                    i < tilbud.inngar.length - (tilbud.inngar.length % 2 === 0 ? 2 : 1)
                      ? "border-b border-kant"
                      : ""
                  } ${i % 2 === 0 ? "sm:border-r sm:border-r-kant" : ""}`}
                >
                  <span
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-aksent"
                    aria-hidden="true"
                  />
                  <span>{punkt}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-x-12 gap-y-4 border-t border-kant bg-flate-dempet/60 px-6 py-6 text-[0.9rem] leading-relaxed text-blekk-dempet sm:grid-cols-2 sm:px-8">
              <p>
                <span className="font-medium text-blekk">Inngår ikke: </span>
                {tilbud.inngarIkke.join(", ").toLowerCase()}.
              </p>
              <p>
                {hentTekst(front, "front.price.note") ?? (
                  <Tbd id="front.price.note" />
                )}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/*
        5 · ANMELDELSER

        Seksjonen var ren tekst på beige, i samme register som alt rundt, og
        leste som dokumentasjon i stedet for som bevis. Den er nå delt i to:
        det sterkeste sitatet på mørk flate i full bredde, resten i
        hårstreksrutenett på lys.

        Flatebyttet gjør jobben ord ikke kan gjøre her — det markerer at det
        er noen andre enn Reflektor som snakker.
      */}
      <section className="bg-dyp text-pa-dyp">
        <AnmeldelseFremhevet
          eyebrow={hentTekst(front, "front.reviews.eyebrow")}
          overskrift={
            hentTekst(front, "front.reviews.h2") ?? (
              <Tbd id="front.reviews.h2" />
            )
          }
          anmeldelse={klarerteAnmeldelser[0]}
        />
        <Anmeldelsesrutenett
          anmeldelser={klarerteAnmeldelser.slice(1)}
          antallTotalt={klarerteAnmeldelser.length}
        />
      </section>

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
