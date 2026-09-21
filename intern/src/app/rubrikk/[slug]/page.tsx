import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Godkjentbanner } from "@/components/Godkjenning";
import { Innhold } from "@/components/Innhold";
import { Medieflate } from "@/components/Medieflate";
import { Rubrikkort } from "@/components/Rubrikkort";
import { Teller } from "@/components/Teller";
import { finnKategori } from "@/content/kategorier";
import { RUBRIKKER, finnRubrikk } from "@/content/rubrikker";
import { krevBruker } from "@/lib/tilgang";

type Props = { params: Promise<{ slug: string }> };

/**
 * `generateStaticParams` gjør rutene kjente ved bygg. Sidene rendres
 * fortsatt per forespørsel — `krevBruker()` leser cookies, og det er en
 * request-time-API som slår av prerendering. Det er riktig: en
 * forhåndsrendret intern side er en side som kan serveres uten at noen har
 * logget inn.
 *
 * Verdien ligger i at en feilstavet slug fanges ved bygg i stedet for som
 * en 404 i bruk.
 */
export async function generateStaticParams() {
  return RUBRIKKER.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rubrikk = finnRubrikk(slug);
  if (!rubrikk) return { title: "Ikke funnet" };
  return {
    title: rubrikk.tittel,
    description: rubrikk.sammendrag,
  };
}

export default async function Rubrikkside({ params }: Props) {
  await krevBruker();

  const { slug } = await params;
  const rubrikk = finnRubrikk(slug);
  if (!rubrikk) notFound();

  const kategori = finnKategori(rubrikk.kategori);

  /*
   * BESLEKTEDE: samme kategori, sortert etter redaksjonell prioritet.
   *
   * Ikke «mest brukt» her — de tellerne ligger i localStorage og finnes
   * ikke på serveren. Å hente dem på klienten for en rad på tre kort ville
   * gitt et hopp i layouten etter hydrering, for en gevinst ingen ba om.
   */
  const beslektede = RUBRIKKER.filter(
    (r) => r.kategori === rubrikk.kategori && r.slug !== rubrikk.slug,
  )
    .sort((a, b) => b.prioritet - a.prioritet)
    .slice(0, 3);

  const dato = new Date(rubrikk.oppdatert).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Teller slug={rubrikk.slug} />
      <Container>
        <div className="py-8 sm:py-12">
          {/*
            TILBAKELENKE OG IKKE BRØDSMULER. Hierarkiet er to nivåer dypt —
            forside og rubrikk. En brødsmulesti for to nivåer er en
            komponent som sier «denne siden er komplisert» om en side som
            ikke er det.
          */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-pa-dyp-dempet transition-colors hover:text-pa-dyp motion-reduce:transition-none"
          >
            <span aria-hidden>←</span> Alle rubrikker
          </Link>

          <article className="mt-8">
            <header>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                {kategori.nr ? (
                  <span aria-hidden className="tabular-nums text-aksent">
                    {String(kategori.nr).padStart(2, "0")}
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-aksent"
                  />
                )}
                {kategori.navn}
              </p>

              <h1 className="display mt-5 text-[2.25rem] leading-[1.02] tracking-[-0.03em] text-pretty text-pa-dyp sm:text-[3rem] lg:text-[3.75rem]">
                {rubrikk.tittel}
              </h1>

              <p className="mt-5 max-w-[46rem] text-[1.125rem] leading-relaxed text-pretty text-pa-dyp-dempet sm:text-xl">
                {rubrikk.sammendrag}
              </p>

              {/*
                `<time>` med maskinlesbar `dateTime`. Datoen vises på norsk;
                attributtet er ISO, slik at den også er entydig for det som
                leser markeringen i stedet for pikslene.
              */}
              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-pa-dyp-svak">
                <time dateTime={rubrikk.oppdatert}>Oppdatert {dato}</time>
                <span aria-hidden>·</span>
                <span>{rubrikk.lesetid} min lesetid</span>
                <span aria-hidden>·</span>
                <span>Eier: {rubrikk.ansvarlig}</span>
              </p>
            </header>

            {/*
              MEDIEFLATEN STÅR ETTER INGRESSEN, ikke før overskriften. Et
              stort bilde øverst dytter tittelen under folden på en telefon
              — og tittelen er det eneste som forteller om man har åpnet
              riktig rubrikk.
            */}
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-medie bg-[rgba(245,240,232,0.06)]">
              <Medieflate medie={rubrikk.medie} prioritert />
            </div>

            <div className="mt-10">
              <Godkjentbanner rubrikk={rubrikk} />
            </div>

            <div className="mt-10 sm:mt-12">
              <Innhold blokker={rubrikk.innhold} />
            </div>
          </article>

          {beslektede.length > 0 && (
            <section
              aria-labelledby="beslektet"
              className="mt-20 border-t border-[color:var(--kant-pa-dyp)] pt-10"
            >
              <h2
                id="beslektet"
                className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase"
              >
                Mer fra {kategori.navn.toLowerCase()}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beslektede.map((r) => (
                  <Rubrikkort key={r.slug} rubrikk={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </>
  );
}
