import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Galleri } from "@/components/Galleri";
import { Bloggmedier } from "@/components/blogg/Bloggmedier";
import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Knappelenke } from "@/components/Knapp";
import {
  ArtikkelSchema,
  BrodsmuleSchema,
  FaqSchema,
} from "@/components/Schema";
import {
  artikkelSlugs,
  delOppAvsnitt,
  finnArtikkel,
  somFaq,
  type Innlenke,
} from "@/content/artikler";
import { basisUrl } from "@/lib/miljo";

type Props = { params: Promise<{ slug: string }> };

/**
 * Bloggartikkelen.
 *
 * TEKSTEN ER MIGRERT 21.09.2026, ordrett fra Squarespace. Se
 * src/content/artikler.ts. Denne fila er malen rundt den.
 *
 * ÅTTE SIDER, IKKE SYTTEN. `generateStaticParams` leser `artikkelSlugs`,
 * som er de slugene som faktisk har innhold. De ni øvrige i `bloggSlugs` —
 * tre aliaser og seks døde — håndteres som 301 i next.config.ts, nøyaktig
 * slik dagens side gjør det. Bygget vi alle sytten, ville seks sider som
 * ikke finnes blitt publisert, og tre aliaser blitt til duplikatinnhold der
 * det i dag står én kanonisk URL. Se A54 i docs/vedlegg-a.md.
 *
 * FAQ-SCHEMA UTEN Å RØRE TEKSTEN. Artiklene har allerede spørsmålsformede
 * H2-er — «Hva er employer branding?», «Hvorfor er det så vanskelig å finne
 * en pris?» — hver etterfulgt av svaret. Det ER en FAQ. `somFaq` i
 * artikler.ts plukker parene ut og markerer dem opp. FAQ-schema korrelerer
 * med ca. 40 % høyere siteringsvekt i ChatGPT, og her koster det ingen ny
 * copy.
 */

/**
 * Ett avsnitt, med lenker lagt rundt ord som allerede står i teksten.
 *
 * Se `Innlenke` i src/content/artikler.ts for hvorfor lenkene ligger i
 * avsnittene og ikke bare i boksen nederst. Kort: sju av artiklene slutter
 * med «Les mer om abonnementet.» uten lenke, og en invitasjon uten klikk er
 * en tapt lead på de eneste sidene som har organisk trafikk.
 */
function Avsnitt({
  blokk,
  className,
}: {
  blokk: { tekst: string; lenker?: Innlenke[] };
  className?: string;
}) {
  return (
    <p className={className}>
      {delOppAvsnitt(blokk.tekst, blokk.lenker).map((d, i) =>
        typeof d === "string" ? (
          d
        ) : (
          <Link
            key={i}
            href={d.sti}
            className="underline decoration-aksent/40 underline-offset-4 transition-colors hover:text-blekk hover:decoration-aksent motion-reduce:transition-none"
          >
            {d.frase}
          </Link>
        ),
      )}
    </p>
  );
}

export function generateStaticParams() {
  return artikkelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = finnArtikkel(slug);
  if (!a) return {};
  return {
    title: a.metaTittel ?? a.tittel,
    description: a.beskrivelse,
    alternates: { canonical: `${basisUrl()}/blogg/${a.slug}` },
    /*
      EGET DELINGSBILDE. Merkevarebildet i `layout.tsx` gjelder fortsatt
      resten av nettstedet — begrunnelsen der står. Artiklene er unntaket:
      de er det som faktisk limes inn i en e-post eller en Slack-tråd, og
      da er motivet poenget. Bildet er toppbildet beskåret til 1200×630 av
      `scripts/og-bilder.ts`, så det koster ingen nye motiver.

      `images` settes KUN her og arves ikke bakover: Next slår sammen
      `openGraph` fra layouten med denne, og et felt som settes vinner.
      Resten — type, locale, siteName — kommer fortsatt fra layouten.
    */
    openGraph: {
      images: [
        {
          url: `/bilder/og/blogg-${a.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: a.bilde.alt,
        },
      ],
    },
  };
}

export default async function BloggInnlegg({ params }: Props) {
  const { slug } = await params;
  const a = finnArtikkel(slug);
  if (!a) notFound();

  /*
    ÉN FAQPage-NODE, ikke to. Utledede og håndskrevne par slås sammen før
    markeringen skrives. To FAQPage-noder på samme URL er to entiteter som
    påstår å beskrive den samme siden, og da må den som leser dem velge.
  */
  const faq = [
    ...somFaq(a.blokker),
    ...(a.tilleggsfaq ?? []).map((t) => ({
      sporsmal: t.sporsmal,
      svar: t.svar,
    })),
  ];
  const [ingress, ...resten] =
    a.blokker[0]?.type === "avsnitt"
      ? [a.blokker[0], ...a.blokker.slice(1)]
      : [null, ...a.blokker];

  return (
    <>
      <BrodsmuleSchema
        ledd={[
          { navn: "Hjem", sti: "/" },
          { navn: "Blogg", sti: "/blogg" },
          { navn: a.tittel },
        ]}
      />
      <ArtikkelSchema
        tittel={a.tittel}
        beskrivelse={a.beskrivelse}
        sti={`/blogg/${a.slug}`}
        publisert={a.publisert}
        oppdatert={a.oppdatert}
      />
      {faq.length > 0 && <FaqSchema qa={faq} />}

      <article className="pt-16 pb-20 sm:pt-24">
        <Container>
          <Eyebrow>Blogg</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-4xl text-balance sm:text-5xl">
            {a.tittel}
          </h1>
          {/*
            Datoen står synlig, ikke bare i markeringen. Leseren skal kunne
            se hvor gammel teksten er uten å grave i kildekoden — og en
            skjult dato er et signal man later som man ikke har.
          */}
          <p className="mt-6 font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
            <time dateTime={a.publisert}>
              {new Date(a.publisert).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {/*
              OPPDATERINGSDATOEN STÅR VED SIDEN AV, ikke i stedet for.
              Leseren skal kunne se både når teksten ble skrevet og når den
              sist ble rørt — en artikkel fra 2024 som er oppdatert i år er
              noe annet enn en fra i år, og å skjule det første ville vært
              å pynte på alderen.
            */}
            {a.oppdatert && (
              <>
                {" · Oppdatert "}
                <time dateTime={a.oppdatert}>
                  {new Date(a.oppdatert).toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </p>

          {ingress && ingress.type === "avsnitt" && (
            <Avsnitt
              blokk={ingress}
              className="mt-8 max-w-3xl border-l-2 border-aksent pl-6 text-lg leading-relaxed text-pretty sm:pl-8 sm:text-xl"
            />
          )}

          {/*
            TOPPBILDET STÅR ETTER INGRESSEN, ikke over tittelen.

            Over tittelen ville det skjøvet H1 og svaret ned under folden,
            og 44 % av LLM-siteringer hentes fra de første 30 % av en side.
            Her gjør det jobben sin uten å koste noe: det bryter opp en lang
            brødtekst der leseren ellers møter to tusen ord i strekk.

            Bredere enn teksten, med vilje. Brødteksten er 42rem for
            lesbarhetens skyld; bildet trenger ikke den begrensningen, og
            forskjellen gir siden en rytme den ikke hadde.
          */}
          <figure className="relative mt-12 aspect-[16/9] max-w-3xl overflow-hidden rounded-medie bg-flate-dempet">
            <Image
              src={`/arbeid/${a.bilde.fil}.jpg`}
              alt={a.bilde.alt}
              fill
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-cover"
              style={
                a.bilde.fokus ? { objectPosition: a.bilde.fokus } : undefined
              }
            />
          </figure>

          <div className="mt-12 max-w-2xl">
            {resten.map((b, i) => {
              if (!b) return null;
              if (b.type === "overskrift") {
                const Tag = b.niva === 2 ? "h2" : "h3";
                return (
                  <Tag
                    key={i}
                    className={
                      b.niva === 2
                        ? "display mt-12 text-2xl text-balance first:mt-0 sm:text-[1.75rem]"
                        : "mt-9 text-lg font-medium text-balance first:mt-0"
                    }
                  >
                    {b.tekst}
                  </Tag>
                );
              }
              if (b.type === "liste") {
                return (
                  <ul key={i} className="mt-5 grid gap-3">
                    {b.punkter.map((p) => (
                      <li key={p} className="flex gap-3 text-pretty">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1 shrink-0 rounded-full bg-aksent"
                        />
                        <span className="leading-relaxed text-blekk-dempet">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.type === "kilde") {
                return (
                  <p
                    key={i}
                    className="mt-5 border-l-2 border-kant pl-5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet"
                  >
                    {b.tekst}{" "}
                    <a
                      href={b.url}
                      target="_blank"
                      rel={b.nofollow ? "noopener nofollow" : "noopener"}
                      className="inline-flex min-h-6 items-center underline underline-offset-2 hover:text-aksent-tekst"
                    >
                      Kilde
                    </a>
                  </p>
                );
              }
              if (b.type === "medier") {
                return (
                  <Bloggmedier
                    key={i}
                    elementer={b.elementer}
                    bildetekst={b.bildetekst}
                  />
                );
              }
              if (b.type === "galleri") {
                return (
                  <Galleri
                    key={i}
                    elementer={b.elementer}
                    bildetekst={b.bildetekst}
                  />
                );
              }
              if (b.type === "tabell") {
                /*
                  EN TABELL MED PROSA I CELLENE MÅ STABLES PÅ TELEFON.

                  Målt 30.09.2026: pristabellen for 2026 har celler på over
                  200 tegn, og ble 548 px bred i en spalte på 342 px. To av
                  fire kolonner lå utenfor skjermen, og raden med Reflektors
                  egen pris var 289 px høy. De ni andre tabellene på bloggen
                  har ingen celle over 48 tegn og blir 342–414 px brede — de
                  trenger ingenting.

                  Terskelen leses derfor av innholdet, ikke av antall
                  kolonner: 60 tegn skiller de to gruppene med god margin, og
                  en ny tabell med prosa treffer regelen av seg selv.

                  PÅ TELEFON BLIR HVER RAD ET KORT, med kolonnenavnet som
                  etikett over hver verdi — hentet fra `data-etikett`, ikke
                  skrevet to ganger i DOM-en. Fra `sm` er det den samme
                  vanlige tabellen som før, uendret.
                */
                const prosa = b.rader.some((r) =>
                  r.some((celle) => celle.length > 60),
                );
                return (
                  /*
                    EN TABELL SOM KAN RULLE SIDEVEIS MÅ KUNNE FÅ TASTATURFOKUS.
                    Uten `tabIndex` kommer den som bare bruker tastatur seg
                    aldri til kolonnene utenfor skjermen. Meldt av axe-core
                    30.09.2026 (`scrollable-region-focusable`).

                    Bare på tabellene som faktisk kan rulle: en prosatabell er
                    stablet på telefon og full bredde på skjerm, og ville ellers
                    blitt et tomt tabbstopp.
                  */
                  <div
                    key={i}
                    className="mt-7 overflow-x-auto"
                    tabIndex={prosa ? undefined : 0}
                  >
                    <table
                      className={`w-full border-collapse text-left text-[0.9375rem] ${
                        prosa ? "block sm:table" : ""
                      }`}
                    >
                      <thead
                        className={
                          prosa ? "sr-only sm:table-header-group" : undefined
                        }
                      >
                        <tr className="border-b border-blekk-svak">
                          {/*
                            HJØRNECELLEN ER TOM I FLERE AV TABELLENE — første
                            kolonne er radetiketter, ikke en kategori med navn.
                            En tom `<th>` er en overskrift uten innhold, og axe
                            melder den (`empty-table-header`). En `<td>` er
                            riktig element for et tomt hjørne.
                          */}
                          {b.kolonner.map((k, j) =>
                            k ? (
                              <th
                                key={k}
                                scope="col"
                                className="py-3 pr-4 font-sans text-xs font-medium tracking-[0.06em] text-blekk-dempet uppercase last:pr-0"
                              >
                                {k}
                              </th>
                            ) : (
                              <td key={j} className="py-3 pr-4 last:pr-0" />
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody
                        className={
                          prosa ? "block sm:table-row-group" : undefined
                        }
                      >
                        {b.rader.map((r) => (
                          <tr
                            key={r.join()}
                            className={`border-b border-kant ${
                              prosa ? "block py-4 sm:table-row sm:py-0" : ""
                            }`}
                          >
                            {r.map((celle, j) => (
                              <td
                                key={j}
                                data-etikett={prosa ? b.kolonner[j] : undefined}
                                /*
                                  KORTE CELLER SKAL IKKE KNEKKES I EN
                                  PROSATABELL. Med automatisk tabellayout tar
                                  prosakolonnene all bredden, og «3 000–5 000
                                  kr» ble brutt over fire linjer mens
                                  setningene ved siden av lå på tre. Prisen er
                                  det leseren kom for; den skal stå på én
                                  linje. Målt i nettleseren 30.09.2026.

                                  Bare fra `sm`: på telefon er raden stablet,
                                  og der finnes ikke problemet.
                                */
                                className={`py-3 pr-4 leading-relaxed last:pr-0 ${
                                  j === 0
                                    ? "text-blekk"
                                    : "tabular-nums text-blekk-dempet"
                                } ${
                                  prosa
                                    ? `${celle.length <= 22 ? "sm:whitespace-nowrap " : ""}block py-0 pt-3 first:pt-0 first:text-base first:font-medium before:mb-1 before:block before:font-sans before:text-xs before:font-medium before:tracking-[0.06em] before:text-blekk-dempet before:uppercase before:content-[attr(data-etikett)] first:before:hidden sm:table-cell sm:py-3 sm:align-top sm:text-[0.9375rem] sm:font-normal sm:before:hidden`
                                    : ""
                                }`}
                              >
                                {celle}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <Avsnitt
                  key={i}
                  blokk={b}
                  className="mt-5 leading-relaxed text-pretty text-blekk-dempet"
                />
              );
            })}
          </div>
        </Container>
      </article>

      {/* ── Håndskrevet FAQ ───────────────────────────────────────── */}
      {a.tilleggsfaq && a.tilleggsfaq.length > 0 && (
        <section className="pb-16">
          <Container>
            {/*
              SYNLIG, IKKE BARE I MARKERINGEN. Google krever at
              FAQ-markering gjenspeiler innhold brukeren faktisk ser — og
              uavhengig av kravet: en FAQ ingen kan lese hjelper ingen.

              Spørsmålene her er skrevet, ikke utledet. Hvert av dem er
              kontrollert mot alle spørsmål som allerede finnes på
              nettstedet, slik at ingen tjenesteside mister eierskapet til
              sitt eget. Se `tilleggsfaq` i artikler.ts.
            */}
            <div className="max-w-2xl">
              <Merkelapp som="h2">Ofte stilt etterpå</Merkelapp>
              <div className="mt-6 border-t border-kant">
                {a.tilleggsfaq.map((t) => (
                  <details
                    key={t.sporsmal}
                    name={`ekstra-${a.slug}`}
                    className="faq-rad group border-b border-kant"
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-5 py-5 text-[1.0625rem] leading-snug font-medium [&::-webkit-details-marker]:hidden">
                      <span className="flex-1 text-pretty">{t.sporsmal}</span>
                      <span
                        aria-hidden
                        className="relative mt-2 block size-3 shrink-0 text-blekk-dempet"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                      </span>
                    </summary>
                    <div className="pr-8 pb-6">
                      <p className="leading-relaxed text-pretty text-blekk-dempet">
                        {t.svar}
                      </p>
                      {t.lenker && (
                        <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
                          {t.lenker.map((l) => (
                            <li key={l.sti}>
                              <Link
                                href={l.sti}
                                className="inline-flex min-h-6 items-center gap-2 text-[0.9375rem] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
                              >
                                {l.tekst}
                                <span aria-hidden className="text-aksent">
                                  →
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Broen: fra bredt søk til kommersiell side ─────────────── */}
      <section className="pb-20">
        <Container>
          {/*
            DETTE ER HELE GRUNNEN TIL AT BLOGGEN BEHOLDES.

            Artiklene rangerer på ordene folk søker på FØRST — «some» 3 300,
            «reklame» 2 200, «employer branding» 400. Tjenestesidene er der
            kjøpet skjer. Uten en lenke mellom dem er trafikken verdiløs, og
            det er nøyaktig kritikken i AGENTS.md: innholdet konverterer
            ikke.

            Ankerteksten sier hva den andre siden ER, ikke «les mer».
            Ankertekst er et av de sterkeste interne relevanssignalene som
            finnes, og «les mer» bærer null av det.
          */}
          <div className="max-w-2xl rounded-flate border border-kant px-6 py-8 sm:px-10 sm:py-9">
            <Merkelapp som="h2">Fra Reflektor</Merkelapp>
            <ul className="mt-5 grid gap-3">
              {a.lesVidere.map((l) => (
                <li key={l.sti}>
                  <Link
                    href={l.sti}
                    className="inline-flex min-h-6 items-center gap-2 text-[1.0625rem] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
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

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
            <h2 className="max-w-2xl text-3xl text-balance sm:text-4xl">
              Skal vi lage innholdet for dere?
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-pa-dyp-dempet">
              Fortell oss om bedriften, så får dere et forslag tilbake innen tre
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
