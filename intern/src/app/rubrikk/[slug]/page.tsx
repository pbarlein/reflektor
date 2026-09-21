import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Godkjentbanner } from "@/components/Godkjenning";
import { Innhold, Kildeliste } from "@/components/Innhold";
import { Oppsummering } from "@/components/Oppsummering";
import { Rubrikkort } from "@/components/Rubrikkort";
import { finnKategori } from "@/content/kategorier";
import { RUBRIKKER, finnRubrikk, rubrikkerIKategori } from "@/content/rubrikker";
import { krevBruker } from "@/lib/tilgang";

type Props = { params: Promise<{ slug: string }> };

/**
 * Rutene er kjente ved bygg. Sidene rendres fortsatt per forespørsel —
 * `krevBruker()` leser cookies, som er en request-time-API og slår av
 * prerendering. Det er riktig: en forhåndsrendret intern side er en side
 * som kan serveres uten at noen har logget inn.
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
  return { title: rubrikk.tittel, description: rubrikk.sammendrag };
}

export default async function Rubrikkside({ params }: Props) {
  await krevBruker();

  const { slug } = await params;
  const rubrikk = finnRubrikk(slug);
  if (!rubrikk) notFound();

  const kategori = finnKategori(rubrikk.kategori);
  const beslektede = rubrikkerIKategori(rubrikk.kategori)
    .filter((r) => r.slug !== rubrikk.slug)
    .slice(0, 4);

  const dato = new Date(rubrikk.oppdatert).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Container>
      <div className="py-8 sm:py-10">
        {/*
          TILBAKELENKE OG IKKE BRØDSMULER. Hierarkiet er to nivåer dypt. En
          brødsmulesti for to nivåer er en komponent som sier «denne siden
          er komplisert» om en side som ikke er det.
        */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
        >
          <span aria-hidden>←</span> Alle rubrikker
        </Link>

        {/*
          TO SPALTER FRA lg: teksten til venstre, oppsummeringen klistret til
          høyre. Oppsummeringen er et navigasjonsverktøy — den er mest verdt
          mens man leser, ikke bare før man begynner.

          Under lg ligger den over teksten, der den leses én gang og blir
          liggende. Det er riktig der: en klistret boks på en telefon spiser
          en tredjedel av skjermen.
        */}
        {/*
          TRE GRIDBARN, IKKE TO SPALTER MED HVER SIN STABEL.

          Første versjon rendret oppsummeringen to ganger — én `lg:hidden`
          for telefon og én `hidden lg:block` for desktop. Det ga TO
          <nav>-landemerker med samme navn i DOM-en, og to sett lenker til
          de samme ankrene. En skjermleser annonserte navigasjonen to
          ganger, og et automatisk klikk traff den skjulte først.

          Nå finnes den én gang. På telefon faller den naturlig mellom
          bildet og teksten, fordi det er der den står i DOM-en. Fra lg
          flyttes den til høyre spalte med `lg:col-start-2` og blir
          klistret. Ingen duplisering, og rekkefølgen for hjelpemidler er
          den samme som den visuelle.
        */}
        <article className="mt-7 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-12">
          <header className="min-w-0 lg:col-start-1">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
              {kategori.nr ? (
                <span aria-hidden className="tabular-nums text-aksent-tekst">
                  {String(kategori.nr).padStart(2, "0")}
                </span>
              ) : (
                <span aria-hidden className="size-1.5 rounded-full bg-aksent" />
              )}
              {kategori.navn}
            </p>

            <h1 className="display mt-4 text-[2.25rem] leading-[1.02] tracking-[-0.03em] text-pretty text-blekk sm:text-[3rem]">
              {rubrikk.tittel}
            </h1>

            <p className="mt-4 max-w-[46rem] text-[1.125rem] leading-relaxed text-pretty text-blekk-dempet">
              {rubrikk.sammendrag}
            </p>

            {/*
              `<time>` med maskinlesbar `dateTime`. Datoen vises på norsk;
              attributtet er ISO, så den er entydig for det som leser
              markeringen i stedet for pikslene.
            */}
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-blekk-svak">
              <time dateTime={rubrikk.oppdatert}>Oppdatert {dato}</time>
              <span aria-hidden>·</span>
              <span>{rubrikk.lesetid} min</span>
              <span aria-hidden>·</span>
              <span>Eier: {rubrikk.ansvarlig}</span>
            </p>

            {/*
              INGEN TOPPBILDE HER. Det sto en 21:9-flate på dette stedet.
              Den er fjernet, av to grunner som begge er målbare:

              1. DEN VAR USKARP, og måtte være det. Kildene i /medier er
                 stående reels på 540 × 960. En 21:9-flate i full
                 spaltebredde er rundt 1200 px bred. 540 piksler strukket
                 til 1200 er uskarpt uansett hvor god originalen er.

              2. DEN DYTTET TEKSTEN NED. Rubrikkene er oppslagsverk. Den
                 som åpner «De første tre sekundene» skal lese, ikke se på
                 et bilde som illustrerer at vi lager film.

              Media hører fortsatt hjemme på KORTENE. Der er flaten liten
              nok til at 540 px holder, og der gjør bildene jobben sin: de
              viser hva vi leverer. Inne i en fagartikkel gjør de det ikke.

              `rubrikk.medie` brukes derfor fortsatt — bare av Rubrikkort.
            */}
          </header>

          <div className="mt-8 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0">
            <Oppsummering punkter={rubrikk.oppsummering} />
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div className="mt-8">
              <Godkjentbanner rubrikk={rubrikk} />
            </div>

            <div className="mt-10">
              <Innhold blokker={rubrikk.innhold} />
            </div>

            {rubrikk.kilder && rubrikk.kilder.length > 0 && (
              <Kildeliste kilder={rubrikk.kilder} />
            )}
          </div>
        </article>

        {beslektede.length > 0 && (
          <section
            aria-labelledby="beslektet"
            className="mt-20 border-t border-kant-regel pt-10"
          >
            <h2
              id="beslektet"
              className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase"
            >
              Mer fra {kategori.navn.toLowerCase()}
            </h2>
            <div className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(17rem,1fr))]">
              {beslektede.map((r) => (
                <Rubrikkort key={r.slug} rubrikk={r} fyll />
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
