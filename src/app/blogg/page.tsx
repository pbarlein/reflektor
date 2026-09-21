import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { BrodsmuleSchema } from "@/components/Schema";
import { artikler, lesetid, type Artikkel } from "@/content/artikler";
import { basisUrl } from "@/lib/miljo";

/**
 * Bloggoversikten.
 *
 * BYGGET OM 21.09.2026. Pål: «veldig lite inspirerende oversikt over
 * blogginnlegg … ta inspirasjon fra vårt arbeid.»
 *
 * Den forrige var ni like tekstkort i et rutenett. Alt hadde samme vekt,
 * ingenting hadde bilde, og den nyeste artikkelen — den eneste som er
 * skrevet for å selge noe — så nøyaktig ut som en ordbokartikkel fra 2024.
 *
 * TRE GREP, ALLE HENTET FRA /vart-arbeid:
 *
 * 1. BILDE FØRST. Kundecasene leder med et stort stillbilde, og det er det
 *    som gjør dem til noe annet enn en lenkeliste. Artiklene har nå det
 *    samme, valgt redaksjonelt per tema. Se `bilde` i artikler.ts for
 *    hvorfor motivene ikke navngir kunder.
 *
 * 2. ETT OPPSLAG SOM BÆRER. Casene er «store og få» fordi et rutenett
 *    bygget for flere enn man har ser ut som et rutenett med hull i. Her
 *    er problemet motsatt — ni artikler av svært ulik verdi — og løsningen
 *    er samme tanke: løft den ene som betyr mest, og la resten være et
 *    ryddig arkiv. Den nyeste får full bredde.
 *
 * 3. METADATA SOM RAD. Casene har «kunde · sektor · siden». Artiklene har
 *    «måned · lesetid». Lesetiden er regnet ut, ikke skrevet — se lesetid()
 *    i artikler.ts.
 *
 * SORTERT NYEST FØRST. Ferskhet er en siteringsfaktor, og den nyeste er
 * dessuten den eneste bunn-trakt-teksten i bunken.
 */
export const metadata: Metadata = {
  title: "Blogg – sosiale medier, video og innholdsproduksjon",
  description:
    "Artikler fra Reflektor om sosiale medier, videomarkedsføring, innholdsproduksjon og employer branding.",
  alternates: { canonical: `${basisUrl()}/blogg` },
};

function Metarad({ a }: { a: Artikkel }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
      <time dateTime={a.publisert}>
        {new Date(a.publisert).toLocaleDateString("nb-NO", {
          month: "long",
          year: "numeric",
        })}
      </time>
      <span aria-hidden className="text-blekk-svak">
        ·
      </span>
      <span>{lesetid(a)} min</span>
    </p>
  );
}

export default function Blogg() {
  const sortert = [...artikler].sort((a, b) =>
    b.publisert.localeCompare(a.publisert),
  );
  const [forste, ...resten] = sortert;

  return (
    <>
      <BrodsmuleSchema ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Blogg" }]} />

      <section className="pt-16 pb-14 sm:pt-24 sm:pb-16">
        <Container>
          <Eyebrow>Blogg</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Om sosiale medier, video og innholdsproduksjon
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-blekk-dempet">
            {sortert.length} artikler om faget vi jobber med — skrevet for å
            forklare noe, ikke for å fylle en kalender.
          </p>
        </Container>
      </section>

      {/* ── Hovedoppslaget ───────────────────────────────────────── */}
      {forste && (
        <section className="pb-16 sm:pb-20">
          <Container>
            <Link
              href={`/blogg/${forste.slug}`}
              className="group grid gap-8 overflow-hidden rounded-flate border border-kant transition-colors hover:border-blekk-svak motion-reduce:transition-none lg:grid-cols-2 lg:gap-0"
            >
              {/*
                Bildet fyller sin halvdel i full høyde, og teksten setter
                høyden. Samme konstruksjon som heroen på forsiden: da kan
                det ikke oppstå dødplass uansett hvor lang ingressen blir.
              */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                <Image
                  src={`/arbeid/${forste.bilde.fil}.jpg`}
                  alt={forste.bilde.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  style={
                    forste.bilde.fokus
                      ? { objectPosition: forste.bilde.fokus }
                      : undefined
                  }
                />
              </div>

              <div className="flex flex-col justify-center p-7 pt-0 sm:p-10 sm:pt-0 lg:p-12">
                <Merkelapp>Nyeste</Merkelapp>
                <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                  <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                    {forste.tittel}
                  </span>
                </h2>
                <p className="mt-5 leading-relaxed text-pretty text-blekk-dempet">
                  {forste.beskrivelse}
                </p>
                <div className="mt-7 border-t border-kant pt-5">
                  <Metarad a={forste} />
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ── Arkivet ──────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Merkelapp som="h2">Flere artikler</Merkelapp>
          <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {resten.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blogg/${a.slug}`}
                  className="group flex h-full flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-medie bg-flate-dempet">
                    <Image
                      src={`/arbeid/${a.bilde.fil}.jpg`}
                      alt={a.bilde.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={
                        a.bilde.fokus
                          ? { objectPosition: a.bilde.fokus }
                          : undefined
                      }
                    />
                  </div>
                  <div className="mt-5">
                    <Metarad a={a} />
                    <h3 className="display mt-3 text-xl text-balance sm:text-2xl">
                      <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                        {a.tittel}
                      </span>
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                      {a.beskrivelse}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
