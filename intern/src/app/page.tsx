import { Container } from "@/components/Container";
import { MaaKunne, type Kortdata } from "@/components/MaaKunne";
import { Maalet } from "@/components/Maalet";
import { Oversikt } from "@/components/Oversikt";
import { Snarveier } from "@/components/Snarveier";
import { Sok } from "@/components/Sok";
import { finnKategori } from "@/content/kategorier";
import { I_DRIFT, kategorierMedInnhold } from "@/content/rubrikker";
import { lesetid } from "@/lib/lesetid";
import { lesetilstander, pensumrekkefolge } from "@/lib/lesing";
import { lestAvBrukeren } from "@/lib/lesing-server";
import { fornavn, krevBruker } from "@/lib/tilgang";

/**
 * Forsiden.
 *
 * SERVERKOMPONENT. Bare søket og rekka er klientkode; alt innholdet går
 * over ledningen som HTML.
 *
 * `krevBruker()` OG IKKE BARE PROXYEN. Next sier selv at proxy-laget er en
 * optimistisk sjekk, ikke en autorisasjonsløsning. Se src/lib/tilgang.ts.
 *
 * ── REKKEFØLGEN, OG HVORFOR DEN ER SLIK (omarbeidet 28.09.2026) ───────────
 *
 * Dette er startsiden alle ansatte har i nettleseren og ser hver dag. Da er
 * rekkefølgen ikke smak, den er en rangering av hva folk faktisk kom for:
 *
 *   1. MÅLET       hvem vi er. Én skjerm, uendret tekst, ingen handling.
 *   2. SNARVEIENE  det man kom for å GJØRE. Seks ruter, én linje.
 *   3. PENSUM      det man må kunne. Framdriften ligger i kortene selv.
 *   4. SØKET       for den som vet hva hen leter etter.
 *   5. OVERSIKTEN  hele biblioteket, tett, til oppslag.
 *
 * Det gamle oppsettet hadde et framdriftskort og et søk øverst, og deretter
 * åtte vannrette karuseller med to kort i hver. Se `Oversikt` for hvorfor
 * de åtte karusellene var feil form for seksten rubrikker.
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

  /*
   * Rekkefølgen er en regel, ikke et oppsett — se `pensumrekkefolge`.
   *
   * Bare det kortet viser sendes over til klienten. Rubrikkene bærer også
   * hele brødteksten, og den skal ikke over ledningen to ganger.
   */
  const rekke: Kortdata[] = pensumrekkefolge(I_DRIFT).map((r) => ({
    slug: r.slug,
    tittel: r.tittel,
    kategori: finnKategori(r.kategori).kort,
    minutter: lesetid(r),
    medie: r.medie,
    tilstand: tilstander[r.slug] ?? "ulest",
  }));

  const antallLest = I_DRIFT.filter((r) => lest.has(r.nr)).length;

  return (
    <>
      <Maalet navn={fornavn(bruker)} />

      {/*
        RUTENE STÅR FØR ALT LESESTOFF.

        Ingen logger inn her for å lese — de logger inn for å lage en
        produksjonsplan før de drar på lokasjon. Se `Snarveier`.
      */}
      <Snarveier />

      <MaaKunne kort={rekke} lest={antallLest} />

      <Container>
        <div className="pt-12 sm:pt-16">
          {/*
            SØKET STÅR MELLOM PENSUM OG OVERSIKTEN.

            Det er den eneste kontrollen som går på tvers av alt, og
            gjennomgående funn i undersøkelser av intranett er at bruken
            faller når folk ikke finner fram raskt. Her står det rett over
            biblioteket det søker i — den som ikke fant det hen lette etter
            i rekka over, møter feltet før hen begynner å bla.
          */}
          <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
            Finn noe bestemt
          </h2>
          <div className="mt-3">
            <Sok rubrikker={I_DRIFT} tilstander={tilstander} />
          </div>
        </div>
      </Container>

      <Oversikt grupper={grupper} tilstander={tilstander} />
    </>
  );
}
