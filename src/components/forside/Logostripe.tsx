import { Logorad } from "@/components/Logorad";

/**
 * Logoraden mellom heroen og arbeidsseksjonen.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Logostripe() {
  return (
    <>
      {/*
      LOGORADEN. Plassert mellom heroen og arbeidsseksjonen på Påls
      bestilling, og det er også riktig sted: heroens siste linje er
      navngitt bevis i TEKST, og raden er det samme beviset i BILDER.

      Full bredde, utenfor Container. En logostripe som stopper ved
      tekstbredden leser som en illustrasjon; en som går ut av skjermen
      leser som en liste det er mer av. Det siste er sant — elleve logoer
      i riktige proporsjoner måler 2 018 px.

      Se Logorad.tsx for drift, pause og tilgjengelighet, og logoer.ts for
      hvorfor raden ikke har overskrift.
    */}
      <section
        className="pb-24 sm:pb-32"
        aria-label="Kunder Reflektor har produsert foto og video for"
      >
        <Logorad />
      </section>
    </>
  );
}
