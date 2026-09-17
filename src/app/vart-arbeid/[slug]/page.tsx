import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Klipp } from "@/components/Klipp";
import { Knappelenke } from "@/components/Knapp";
import { BrodsmuleSchema, KundecaseSchema } from "@/components/Schema";
import { hentCase, kundecaser, nesteCase } from "@/content/caser";
import { basisUrl } from "@/lib/miljo";

/**
 * Ett kundecase.
 *
 * MALEN ER REFLEKTORS EGEN, migrert fra de levende sidene. Den er bygget
 * rundt spørsmålene en innkjøper stiller i rekkefølge, og det er derfor den
 * virker:
 *
 *   hvem er dette      → metadatalinja
 *   hva gjør dere      → H1 og ingress
 *   hvor stort er det  → tre fakta
 *   virker det         → fire tall, med kilde
 *   hvorfor dem        → behovet
 *   hvordan går det til→ tre steg
 *   hvordan ser det ut → klippet
 *   hva konkret        → tre eksempler
 *   hva får vi igjen   → flatene
 *   hva koster det     → CTA
 *
 * TALLENE KOMMER FØR HISTORIEN, og det er motsatt av hvordan de fleste
 * byråer bygger et case. Grunnen er at leseren allerede vet hva han leter
 * etter: om dette har virket for noen som ligner ham. Å be ham lese 400 ord
 * før han får vite det, er å be ham gjøre en jobb han ikke skylder oss.
 *
 * KILDELINJA UNDER TALLENE SKAL ALDRI FJERNES. Den oppgir verktøy, dato,
 * hva tallene gjelder og hva de IKKE måler. Det er det som skiller et tall
 * fra en påstand — og det er den eneste formen en språkmodell kan gjengi
 * uten å ta en risiko på våre vegne.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return kundecaser.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const k = hentCase(slug);
  if (!k) return {};
  return {
    title: k.metaTittel,
    description: k.metaBeskrivelse,
    alternates: { canonical: `${basisUrl()}/vart-arbeid/${k.slug}` },
  };
}

export default async function CaseSide({ params }: Props) {
  const { slug } = await params;
  const k = hentCase(slug);
  if (!k) notFound();
  const neste = nesteCase(slug);

  return (
    <>
      <KundecaseSchema
        tittel={k.metaTittel}
        beskrivelse={k.metaBeskrivelse}
        sti={`/vart-arbeid/${k.slug}`}
        kunde={k.kunde}
      />
      <BrodsmuleSchema
        ledd={[
          { navn: "Hjem", sti: "/" },
          { navn: "Vårt arbeid", sti: "/vart-arbeid" },
          { navn: k.kunde },
        ]}
      />

      <article>
        {/* ── Identitet og løfte ─────────────────────────────────── */}
        <section className="pt-10 pb-14 sm:pt-14 sm:pb-20">
          <Container>
            {/*
              Brødsmulen er en ekte <nav>, ikke pynt. Den er inngangen
              tilbake til oversikten for den som lander rett på casen fra
              søk — og det gjør de fleste, siden casen rangerer på kundens
              navn og oversikten ikke rangerer på noe.
            */}
            <nav aria-label="Du er her" className="text-sm text-blekk-dempet">
              <Link href="/vart-arbeid" className="hover:text-aksent-tekst">
                Vårt arbeid
              </Link>
              <span aria-hidden className="px-2">
                /
              </span>
              <span className="text-blekk">{k.kunde}</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                {/*
                  Metadatalinja. Fire faktaopplysninger som svarer «hvem,
                  hvor, hva, hvor lenge» før overskriften rekker å love noe.
                  Den er satt som én rad med skiller, ikke som en tabell:
                  det er en byline, ikke data man skal sammenligne.
                */}
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
                  <span className="text-blekk">{k.kunde}</span>
                  <span aria-hidden className="text-blekk-svak">
                    ·
                  </span>
                  <span>{k.sektor}</span>
                  <span aria-hidden className="text-blekk-svak">
                    ·
                  </span>
                  <span>{k.tjenester}</span>
                  <span aria-hidden className="text-blekk-svak">
                    ·
                  </span>
                  <span>{k.siden}</span>
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
                  {k.h1}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-blekk-dempet">
                  {k.ingress}
                </p>
              </div>

              {/*
                De tre faktaene står i en egen skinne til høyre på store
                skjermer og faller under ingressen på små. De er ikke
                resultater — de er skalaen oppdraget foregår i, og de gjør
                tallene lenger nede lesbare. «323 000 visninger» betyr noe
                annet for femti restauranter enn for én.
              */}
              {/*
                <ul> OG IKKE <dl>. Første utkast brukte en definisjonsliste
                med bare <dd> og ingen <dt>. Det er ugyldig markup — en <dl>
                er par av begrep og forklaring — og disse er ikke par. De er
                tre frittstående opplysninger, altså en liste.
              */}
              <ul className="grid gap-px overflow-hidden rounded-flate border border-kant bg-kant sm:grid-cols-3 lg:w-80 lg:grid-cols-1">
                {k.fakta.map((f) => (
                  <li
                    key={f}
                    className="bg-flate px-5 py-4 text-[0.9375rem] leading-snug text-pretty text-blekk-dempet"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* ── Tallene ────────────────────────────────────────────── */}
        <section className="pb-20">
          <Container>
            <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
              <Eyebrow variant="dyp">Målt</Eyebrow>

              {/*
                Fire tall i display-serif. Grader: tallet er seksjonens
                største typografi, forklaringen er brødtekst. Kontrasten
                mellom dem er poenget — tallet fanges i et blikk, setningen
                leses av den som allerede er interessert.
              */}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-9 lg:grid-cols-4">
                {k.tall.map((t) => (
                  <div key={t.forklaring}>
                    <dt className="font-[family-name:var(--font-display-serif)] text-3xl leading-none text-pa-dyp sm:text-4xl lg:text-5xl">
                      {t.verdi}
                    </dt>
                    <dd className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
                      {t.forklaring}
                    </dd>
                  </div>
                ))}
              </dl>

              {/*
                KILDELINJA. Liten, men aldri skjult bak en «les mer».
                Den er grunnen til at tallene over kan stå: verktøy, dato,
                omfang og hva de ikke måler. Uten den er det fire påstander.
              */}
              <p className="mt-10 max-w-3xl border-t border-[color:var(--kant-pa-dyp)] pt-6 text-sm leading-relaxed text-pretty text-pa-dyp-dempet">
                {k.kilde}
              </p>
            </div>
          </Container>
        </section>

        {/* ── Behovet, med klippet ved siden av ──────────────────── */}
        <section className="pb-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16">
              <div className="max-w-2xl">
                <Eyebrow>Behovet</Eyebrow>
                <h2 className="mt-4 text-3xl text-balance sm:text-4xl">
                  {k.behov.tittel}
                </h2>
                {k.behov.avsnitt.map((a) => (
                  <p
                    key={a}
                    className="mt-5 leading-relaxed text-pretty text-blekk-dempet"
                  >
                    {a}
                  </p>
                ))}
              </div>

              {/*
                Klippet står her og ikke i en egen seksjon lenger nede.
                Grunnen er praktisk: dette er det lengste tekstpartiet på
                siden, og en stående video ved siden av gir øyet et sted å
                hvile uten at et eneste ord forsvinner. Det er også det
                eneste stedet der «hvordan ser det ut» og «hva trengte de»
                står ved siden av hverandre.
              */}
              <figure className="lg:sticky lg:top-28">
                <div className="relative aspect-[9/16] overflow-hidden rounded-medie bg-flate-dempet">
                  <Klipp sti={`/reels/${k.klipp.fil}`} ivrig />
                </div>
                <figcaption className="mt-3 text-sm text-blekk-dempet">
                  {k.klipp.attribusjon}
                </figcaption>
              </figure>
            </div>
          </Container>
        </section>

        {/* ── Slik jobber vi ─────────────────────────────────────── */}
        <section className="pb-20">
          <Container>
            <Eyebrow>Slik jobber vi</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
              {k.arbeid.tittel}
            </h2>

            {/*
              Samme tidslinje som på forsiden: nummeret i en sirkel med en
              skinne mellom stegene på mobil, loddrette hårstreker mellom
              spaltene fra sm. To geometrier for samme budskap — dette er
              tre trinn i rekkefølge, ikke tre likestilte påstander.
            */}
            <ol className="mt-10 grid sm:grid-cols-3">
              {k.arbeid.steg.map((s, i, alle) => {
                const sist = i === alle.length - 1;
                return (
                  <li
                    key={s.tittel}
                    className={`relative pb-9 pl-14 last:pb-0 sm:pb-0 sm:pl-0 sm:px-8 ${
                      i === 0 ? "sm:pl-0" : ""
                    } ${sist ? "sm:pr-0" : "sm:border-r sm:border-kant"}`}
                  >
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border border-kant font-[family-name:var(--font-display-serif)] text-lg leading-none text-aksent-tekst sm:static sm:block sm:size-auto sm:rounded-none sm:border-0 sm:text-2xl"
                    >
                      {i + 1}
                    </span>
                    {!sist && (
                      <span
                        aria-hidden
                        className="absolute top-11 bottom-2 left-[1.125rem] w-px bg-kant sm:hidden"
                      />
                    )}
                    <h3 className="text-lg font-medium sm:mt-4">{s.tittel}</h3>
                    <p className="mt-2 leading-relaxed text-pretty text-blekk-dempet">
                      {s.tekst}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>

        {/* ── Tre eksempler ──────────────────────────────────────── */}
        <section className="pb-20">
          <Container>
            <Eyebrow>Tre eksempler</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
              {k.eksempler.tittel}
            </h2>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-flate border border-kant bg-kant sm:grid-cols-3">
              {k.eksempler.punkter.map((e) => (
                <li
                  key={e.tittel}
                  className="flex flex-col bg-flate px-6 py-7 sm:px-7"
                >
                  <h3 className="text-lg font-medium text-balance">
                    {e.tittel}
                  </h3>
                  <p className="mt-3 grow leading-relaxed text-pretty text-blekk-dempet">
                    {e.tekst}
                  </p>
                  {/*
                    Tallet står nederst i kortet, ikke i brødteksten. Da
                    flukter de tre tallene på tvers av kortene uansett hvor
                    lang teksten over er, og de kan leses som en rad.
                  */}
                  <p className="mt-6 border-t border-kant pt-4 text-[0.9375rem] font-medium text-pretty text-aksent-tekst">
                    {e.tall}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* ── Flatene ────────────────────────────────────────────── */}
        <section className="pb-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow>Ett opptak, mange flater</Eyebrow>
                <h2 className="mt-4 text-3xl text-balance sm:text-4xl">
                  {k.flater.tittel}
                </h2>
              </div>
              <div>
                <p className="leading-relaxed text-pretty text-blekk-dempet">
                  {k.flater.tekst}
                </p>

                {/*
                  Merkelappene er en liste og ikke en setning, fordi det er
                  det de er: en oppramsing av flater. En skjermleser skal
                  få «liste med sju elementer», ikke sju løsrevne ord.
                */}
                <ul className="mt-6 flex flex-wrap gap-2">
                  {k.flater.merkelapper.map((m) => (
                    <li
                      key={m}
                      className="rounded-interaktiv border border-kant px-3 py-1.5 text-sm text-blekk-dempet"
                    >
                      {m}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm leading-relaxed text-pretty text-blekk-svak">
                  {k.flater.forbehold}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="pb-20">
          <Container>
            <div className="rounded-flate border border-kant px-6 py-12 sm:px-14 sm:py-14">
              <h2 className="max-w-2xl text-3xl text-balance sm:text-4xl">
                Vil dere ha det samme?
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-pretty text-blekk-dempet">
                Én produksjonsdag i måneden, ferdig klippet i alle formater.
                Fast pris, ingen bindingstid.
              </p>
              <Knappelenke href="/#kontakt" className="mt-8">
                Få et strategiforslag
              </Knappelenke>
            </div>
          </Container>
        </section>

        {/* ── Neste case ─────────────────────────────────────────── */}
        <section className="pb-24 sm:pb-32">
          <Container>
            <Merkelapp>Neste kundecase</Merkelapp>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-t border-kant pt-6">
              <Link
                href={`/vart-arbeid/${neste.slug}`}
                /*
                  `display` fordi lenken ser ut som en overskrift, men er en
                  <a>. Designsystemet gir serifen til h1 og h2 som elementer;
                  `.display` er klassen for alt annet som skal se slik ut.
                  Den står i overstyringer.css sammen med h1-regelen.
                */
                className="group display text-2xl sm:text-3xl"
              >
                <span className="underline decoration-kant decoration-1 underline-offset-[0.3em] transition-colors group-hover:decoration-aksent motion-reduce:transition-none">
                  {neste.h1}
                </span>
              </Link>
              <Link
                href="/vart-arbeid"
                className="text-[0.9375rem] text-blekk-dempet hover:text-aksent-tekst"
              >
                Se alt arbeid
              </Link>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
