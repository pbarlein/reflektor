import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { BrodsmuleSchema } from "@/components/Schema";
import { artikler } from "@/content/artikler";
import { basisUrl } from "@/lib/miljo";

/**
 * Bloggoversikten.
 *
 * LISTER ÅTTE, IKKE SYTTEN. Den gamle versjonen mappet over `bloggSlugs` og
 * utledet en tittel av slugen — «Hva er videomarkedsfring» med skrivefeilen
 * og alt. Ni av de sytten pekte dessuten på sider som ikke finnes: tre er
 * aliaser som 301-er videre, seks er døde. Se A54 i docs/vedlegg-a.md.
 *
 * Nå leses `artikler`, som er de som faktisk har innhold, og titlene er de
 * ekte fra Squarespace.
 *
 * SORTERT NYEST FØRST. Ferskhet er en siteringsfaktor, og den nyeste
 * artikkelen — «Hva koster et SoMe-byrå i Norge?» — er dessuten den eneste
 * bunn-trakt-teksten i bunken. Forskningen sier at det er den typen som
 * siteres; «hva er»-guidene er kategorien AI-motorene svarer på selv.
 */
export const metadata: Metadata = {
  title: "Blogg – sosiale medier, video og innholdsproduksjon",
  description:
    "Artikler fra Reflektor om sosiale medier, videomarkedsføring, innholdsproduksjon og employer branding.",
  alternates: { canonical: `${basisUrl()}/blogg` },
};

export default function Blogg() {
  const sortert = [...artikler].sort((a, b) =>
    b.publisert.localeCompare(a.publisert),
  );

  return (
    <>
      <BrodsmuleSchema ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Blogg" }]} />

      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <Container>
          <Eyebrow>Blogg</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Om sosiale medier, video og innholdsproduksjon
          </h1>
          {/*
            ANTALLET TELLES, det skrives ikke. Her sto «Åtte artikler» mens
            det var ni — tallet ble skrevet da bloggen hadde åtte migrerte
            innlegg, og ble ikke oppdatert da den niende kom til samme dag.
            Et tall på siden som er feil, koster mer tillit enn tallet er
            verdt. Nå kan det ikke skje igjen.

            «Skrevet for å forklare» er dessuten dempet fra «skrevet for å
            forklare, ikke for å selge». Den nyeste artikkelen sammenligner
            og ender med Reflektors egen pris — den selger, og påstanden om
            det motsatte var en overdrivelse vi ikke trenger.
          */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-blekk-dempet">
            {sortert.length} artikler om faget vi jobber med — skrevet for å
            forklare noe, ikke for å fylle en kalender.
          </p>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-flate bg-kant sm:grid-cols-2">
            {sortert.map((a) => (
              <li key={a.slug} className="bg-flate">
                <Link
                  href={`/blogg/${a.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-flate-dempet motion-reduce:transition-none sm:p-9"
                >
                  <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
                    <time dateTime={a.publisert}>
                      {new Date(a.publisert).toLocaleDateString("nb-NO", {
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                  <h2 className="display mt-4 text-2xl text-balance sm:text-[1.75rem]">
                    <span className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                      {a.tittel}
                    </span>
                  </h2>
                  <p className="mt-4 grow leading-relaxed text-pretty text-blekk-dempet">
                    {a.beskrivelse}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
