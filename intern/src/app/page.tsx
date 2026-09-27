import { Maalet } from "@/components/Maalet";
import { Oversikt } from "@/components/Oversikt";
import { Snarveier } from "@/components/Snarveier";
import { I_DRIFT, kategorierMedInnhold } from "@/content/rubrikker";
import { lesetilstander } from "@/lib/lesing";
import { lestAvBrukeren } from "@/lib/lesing-server";
import { fornavn, krevBruker } from "@/lib/tilgang";

/**
 * Forsiden.
 *
 * SERVERKOMPONENT. Bare søket er klientkode; alt innholdet går over
 * ledningen som HTML.
 *
 * `krevBruker()` OG IKKE BARE PROXYEN. Next sier selv at proxy-laget er en
 * optimistisk sjekk, ikke en autorisasjonsløsning. Se src/lib/tilgang.ts.
 *
 * ── TRE SEKSJONER, ETTER HVA FOLK FAKTISK KOM FOR ─────────────────────────
 *
 *   1. MÅLET       hvem vi er. Én skjerm, uendret tekst, ingen handling.
 *   2. SNARVEIENE  det man kom for å GJØRE. Seks ruter, én linje.
 *   3. PENSUM      det man må kunne, med søket i toppen av seksjonen.
 *
 * Punkt tre var to seksjoner til 28.09.2026: en sidelengs rekke med
 * overskriften «Dette må du kunne godt», og et rutenett under med
 * overskriften «Alt innholdet». De viste de samme seksten rubrikkene med
 * samme lesestatus. Se `Oversikt`.
 *
 * Søket lå mellom dem. Nå ligger det i seksjonen det søker i, som en
 * kontroll over listen — ikke som en egen overskrift med eget felt.
 */
export default async function Forside() {
  const bruker = await krevBruker();
  const grupper = kategorierMedInnhold();

  /*
   * ALT REGNES MOT `I_DRIFT`, IKKE MOT ALT SOM ER SKREVET.
   *
   * Framdriften skal vise «3 av 16 lest», ikke «3 av 50» — de trettifire
   * andre er ikke noe den ansatte kan lese, og en teller som aldri kan bli
   * full er en teller ingen bryr seg om. Søket går samme vei: finner man
   * en tekst som ikke er i drift, har skjulingen ingen verdi.
   *
   * LESESTATUSEN REGNES ÉN GANG, HER.
   *
   * Ikke per kort. Om et kort skal merkes NY avhenger av hvor mange andre
   * som også er nye — se NY_MAKS i src/lib/lesing.ts — og det kan bare
   * avgjøres når man ser hele samlingen.
   *
   * Statusen kommer fra to kilder: informasjonskapselen i denne
   * nettleseren, og butikken som følger personen mellom maskiner. Se
   * src/lib/lesing-server.ts.
   */
  const lest = await lestAvBrukeren();
  const tilstander = Object.fromEntries(
    lesetilstander(I_DRIFT, lest, new Date()),
  );

  return (
    <>
      <Maalet navn={fornavn(bruker)} />

      {/*
        RUTENE STÅR FØR ALT LESESTOFF.

        Ingen logger inn her for å lese — de logger inn for å lage en
        produksjonsplan før de drar på lokasjon. Se `Snarveier`.
      */}
      <Snarveier />

      <Oversikt grupper={grupper} tilstander={tilstander} />
    </>
  );
}
