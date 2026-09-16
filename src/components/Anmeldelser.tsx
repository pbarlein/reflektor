import { Container } from "./Container";
import type { Anmeldelse } from "@/content/anmeldelser";

/**
 * Anmeldelser i to registre: ett løftet sitat på mørk flate, resten i et
 * hårstreksatt rutenett på lys.
 *
 * Hvorfor delt: den sterkeste anmeldelsen er kvalitativt forskjellig fra de
 * andre. Thomas Messel oppgir et tall — 70 % vekst — og et forbehold som gjør
 * tallet troverdig: «selv i et krevende marked med generell nedgang for alle
 * i vår bransje». Å legge den i et rutenett med sju andre gjør den til én av
 * åtte.
 *
 * Hvorfor MØRK flate: seksjonen var tidligere ren tekst på beige, i samme
 * register som alt rundt. Den leste som dokumentasjon. Et flatebytte i full
 * bredde gir det som mangler — en pause, og et øyeblikk der noe annet enn
 * Reflektor snakker. Det er sidens tredje mørke blokk, og det er grensen:
 * kadensen er prosess, bevis, kontakt, med lange lyse strekk imellom.
 *
 * Tallet blir stående INNE i sitatet, ikke løftet ut som en egen overskrift.
 * Forskjellen er ikke kosmetisk: «70 %» i display-grad leser som noe Reflektor
 * leverer, mens det samme tallet i et attribuert sitat leser som noe én kunde
 * sier om seg selv. Det siste er det som faktisk er tilfellet.
 *
 * Ingen stjerner og ingen totalvurdering — se merknaden i
 * src/content/anmeldelser.ts om hvordan kilden er filtrert.
 *
 * MERK — ingen Review- eller AggregateRating-schema. Googles retningslinjer
 * regner anmeldelser av en enhet, på enhetens egen side, som «self-serving».
 * Det gir null stjerner i søkeresultatet OG er et regelbrudd. Se A33.
 */
export function AnmeldelseFremhevet({
  anmeldelse,
  overskrift,
  eyebrow,
}: {
  anmeldelse?: Anmeldelse;
  overskrift: React.ReactNode;
  eyebrow: React.ReactNode;
}) {
  return (
    <div className="bg-dyp py-20 text-pa-dyp sm:py-28">
      <Container>
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-pa-dyp-dempet">
          <span
            className="size-1.5 shrink-0 rounded-full bg-aksent-pa-dyp"
            aria-hidden="true"
          />
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl sm:text-4xl">{overskrift}</h2>

        {anmeldelse && (
          <figure className="mt-14 max-w-5xl">
            <blockquote className="font-[family-name:var(--font-display-serif)] text-[1.75rem] leading-[1.2] tracking-[-0.015em] text-balance sm:text-[2.6rem] sm:leading-[1.15] lg:text-[3.4rem] lg:leading-[1.08]">
              {anmeldelse.sitat}
            </blockquote>
            <figcaption className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--kant-pa-dyp)] pt-6 text-sm tracking-[0.02em]">
              <span className="font-medium">{anmeldelse.navn}</span>
              {anmeldelse.selskap && (
                <>
                  <span
                    className="h-3.5 w-px bg-[color:var(--kant-pa-dyp)]"
                    aria-hidden="true"
                  />
                  <span className="text-pa-dyp-dempet">
                    {anmeldelse.selskap}
                  </span>
                </>
              )}
            </figcaption>
          </figure>
        )}
      </Container>
    </div>
  );
}

/**
 * De øvrige, i hårstreksrutenett.
 *
 * Styrken i navngitte anmeldelser ligger i ANTALLET avsendere som sier det
 * samme, og den effekten forsvinner når man ser ett av gangen — som er
 * nettopp det casesiden gjorde. Derfor tett, i samme blikk.
 *
 * Ingen kort, ingen skygger, ingen avatarer. Sitatet skal leses, ikke
 * innrammes.
 */
export function Anmeldelsesrutenett({
  anmeldelser,
  antallTotalt,
}: {
  anmeldelser: Anmeldelse[];
  antallTotalt: number;
}) {
  return (
    <Container>
      <ul className="grid gap-x-12 border-t border-kant-regel sm:grid-cols-2 lg:grid-cols-3">
        {anmeldelser.map((a) => (
          <li key={a.navn} className="border-b border-kant py-8">
            <blockquote className="leading-relaxed text-pretty">
              {a.sitat}
            </blockquote>
            <p className="mt-5 text-sm tracking-[0.02em]">
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

        Setningen om oppdragstype er ikke pynt. Anmeldelsene kommer fra både
        produksjonsoppdrag og månedsabonnement, og uten den opplysningen leser
        man hele veggen som abonnenter. Flere av selskapene her har aldri hatt
        abonnement.
      */}
      <p className="mt-7 max-w-2xl text-sm tracking-[0.02em] text-blekk-svak">
        Alle {antallTotalt} er hentet fra Reflektors anmeldelser på Google. De
        dekker både enkeltstående produksjonsoppdrag og løpende månedsavtaler.
      </p>
    </Container>
  );
}
