import { Container } from "./Container";
import type { Anmeldelse } from "@/content/anmeldelser";

/**
 * Anmeldelser i to former: én løftet, resten i et hårstreksatt rutenett.
 *
 * Hvorfor delt: den sterkeste anmeldelsen er kvalitativt forskjellig fra de
 * andre. Thomas Messel oppgir et tall — 70 % vekst — og et forbehold som
 * gjør tallet troverdig: «selv i et krevende marked med generell nedgang for
 * alle i vår bransje». Å legge den i et rutenett med åtte andre gjør den til
 * én av ni. Å løfte den gir den vekten den fortjener.
 *
 * Resten står tett, i samme blikk. Styrken i navngitte anmeldelser ligger i
 * ANTALLET avsendere som sier det samme, og den effekten forsvinner når man
 * ser ett sitat av gangen — som er nettopp det casesiden gjør.
 *
 * Ingen kort, ingen skygger, ingen avatarer, ingen stjernerad per sitat. At
 * alle er 5 av 5 sies én gang, ikke ni ganger. Skiller er hårstreker.
 *
 * Pull-quoten settes i display-seriffen, ikke i Poppins. Den er et
 * overskriftsnivå i praksis — den har samme grad og samme jobb — og et
 * display-snitt som bare brukes på h1 og h2 leser som en inkonsekvens når
 * sidens største tekst står i brødtekstsnittet.
 *
 * MERK — ingen Review- eller AggregateRating-schema på disse.
 * Googles retningslinjer for review snippets sier at anmeldelser av en enhet,
 * plassert på enhetens egen side, er «self-serving». Det gir null stjerner i
 * søkeresultatet OG er et regelbrudd. Se docs/vedlegg-a.md.
 */
export function Anmeldelser({
  fremhevet,
  ovrige,
}: {
  fremhevet?: Anmeldelse;
  ovrige: Anmeldelse[];
}) {
  return (
    <>
      {fremhevet && (
        <Container>
          <figure className="mt-12 max-w-4xl">
            <blockquote className="font-[family-name:var(--font-display-serif)] text-[1.75rem] leading-[1.2] tracking-[-0.015em] text-balance sm:text-4xl sm:leading-[1.15] lg:text-[2.75rem] lg:leading-[1.1]">
              {fremhevet.sitat}
            </blockquote>
            <figcaption className="mt-7 text-sm tracking-[0.02em]">
              <span className="font-medium">{fremhevet.navn}</span>
              {fremhevet.selskap && (
                <span className="text-blekk-dempet"> · {fremhevet.selskap}</span>
              )}
            </figcaption>
          </figure>
        </Container>
      )}

      <Container>
        <ul className="mt-16 grid gap-x-12 border-t border-kant-regel sm:grid-cols-2 lg:grid-cols-3">
          {ovrige.map((a) => (
            <li key={a.navn} className="border-b border-kant py-7">
              <blockquote className="text-[0.95rem] leading-relaxed text-pretty">
                {a.sitat}
              </blockquote>
              <p className="mt-4 text-sm tracking-[0.02em]">
                <span className="font-medium">{a.navn}</span>
                {a.selskap && (
                  <span className="text-blekk-dempet"> · {a.selskap}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
        {/*
          Kildeattribusjon én gang, ikke per sitat.

          Setningen om oppdragstype er ikke pynt. Anmeldelsene kommer fra
          både produksjonsoppdrag og månedsabonnement, og uten den
          opplysningen leser en leser hele veggen som abonnenter. Det ville
          vært villedende: flere av selskapene her har aldri hatt abonnement.
          Å si det generelt — uten å knytte noe navn til noen av delene —
          er både sant og tilstrekkelig.
        */}
        <p className="mt-6 max-w-2xl text-sm tracking-[0.02em] text-blekk-svak">
          Alle {ovrige.length + (fremhevet ? 1 : 0)} er hentet fra Reflektors
          anmeldelser på Google, og alle er 5 av 5. De dekker både enkeltstående
          produksjonsoppdrag og løpende månedsavtaler.
        </p>
      </Container>
    </>
  );
}
