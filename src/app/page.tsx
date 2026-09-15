import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ReelVegg } from "@/components/ReelVegg";
import { Anmeldelser } from "@/components/Anmeldelser";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { hentTekst, slotsISeksjon, TbdMarkor } from "@/components/Slot";
import { front } from "@/content/sider/front";
import { site, tilbud, kundelogoer } from "@/content/site";

/**
 * Forsiden.
 *
 * Seksjonsrekkefølgen følger evidensen, ikke briefens kapittel 3.0.1:
 * tilbudet over folden → arbeidet → prosess → pris → bevis → innvendinger →
 * kontakt. Alle tre researchsporene fant den rekkefølgen uavhengig.
 *
 * Grep som er bevisst utelatt, med begrunnelse i
 * docs/research-konvertering.md: sticky CTA (negativ i den høyest powerede
 * replikasjonen, 8,1 mill. brukere), karusell (~1 % klikker), scroll-utløst
 * innfading (skjuler innhold til JS har kjørt, forverrer LCP), bakgrunnsvideo
 * i hero (dyrest sted å legge video).
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
  const reeltekster = slotsISeksjon(front, 2)
    .filter((s) => s.id.includes("caption"))
    .map((s) => s.verdi);

  return (
    <>
      {/* 1 · HERO — posisjonering i øvre halvdel av første skjerm */}
      <section className="py-20 sm:py-28">
        <Container>
          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-[4.25rem]">
            Sosiale medier – <em className="not-italic text-aksent">nesten</em>{" "}
            på autopilot.
          </h1>

          <p className="mt-7 max-w-xl text-lg text-blekk-dempet">
            {hentTekst(front, "front.hero.sub") ?? <Tbd id="front.hero.sub" />}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#kontakt"
              className="rounded-interaktiv bg-aksent px-7 py-3.5 font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-aksent-hover"
            >
              {hentTekst(front, "front.hero.cta") ?? <Tbd id="front.hero.cta" />}
            </a>
            {/* Prisen står allerede her. Selvkvalifisering, og AEO vekter det. */}
            <p className="text-blekk-dempet">
              {tilbud.prisPerManed.toLocaleString("nb-NO")} kr/mnd · ingen
              bindingstid
            </p>
          </div>

          <p className="mt-10 max-w-lg text-sm text-blekk-dempet">
            {hentTekst(front, "front.hero.proof") ?? (
              <Tbd id="front.hero.proof" />
            )}
          </p>

          {/* Kunderekken hører hjemme her, ikke i anmeldelsesseksjonen: den
              er produksjonserfaring, ikke en uttalelse. Å blande logoer og
              sitater lar logoene lese som om de sto bak sitatene — og disse
              kundene er produksjonskunder, aldri SoMe-abonnenter. */}
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm text-blekk-svak">
            {kundelogoer.map((kunde) => (
              <li key={kunde}>{kunde}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2 · ARBEIDET — vis produktet før du forklarer det */}
      <section className="pb-20">
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
          <ReelVegg tekster={reeltekster} />
        </div>
      </section>

      {/* 3 · SLIK FUNGERER DET — mørk blokk som kapittelskille */}
      <section className="pb-20">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <Eyebrow>
              <span className="text-pa-dyp">
                {hentTekst(front, "front.how.eyebrow")}
              </span>
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

      {/* 4 · PRIS — åpent, med vilkårene */}
      <section className="pb-20">
        <Container>
          <Eyebrow>{hentTekst(front, "front.price.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.price.h2") ?? <Tbd id="front.price.h2" />}
          </h2>

          <p className="mt-8 text-5xl font-medium sm:text-6xl">
            {tilbud.prisPerManed.toLocaleString("nb-NO")} kr
            <span className="text-2xl text-blekk-dempet">/mnd</span>
          </p>
          <p className="mt-3 text-lg">
            Tre måneders oppsigelse. Ingen bindingstid.
          </p>

          <ul className="mt-10 grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-2">
            {tilbud.inngar.map((punkt) => (
              <li key={punkt} className="flex gap-3">
                <span className="text-aksent" aria-hidden="true">
                  —
                </span>
                {punkt}
              </li>
            ))}
          </ul>

          {/* Å si hva som IKKE inngår er en del av stemmen, ikke en svakhet. */}
          <p className="mt-8 max-w-xl text-blekk-dempet">
            Inngår ikke: {tilbud.inngarIkke.join(", ").toLowerCase()}.
          </p>
          <p className="mt-3 max-w-xl text-blekk-dempet">
            {hentTekst(front, "front.price.note") ?? (
              <Tbd id="front.price.note" />
            )}
          </p>
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
          anmeldelser={slotsISeksjon(front, 5)
            .filter((s) => s.id.includes("quote"))
            .map((s) => ({ id: s.id, verdi: s.verdi }))}
        />
      </section>

      {/* 6 · FAQ — native details, ingen JavaScript */}
      <section className="pb-20">
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
