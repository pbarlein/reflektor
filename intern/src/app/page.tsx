import { Container } from "@/components/Container";
import { Maalet } from "@/components/Maalet";
import { Rad } from "@/components/Rad";
import { Sok } from "@/components/Sok";
import { BOLKER, type Bolk } from "@/content/kategorier";
import { RUBRIKKER, kategorierMedInnhold } from "@/content/rubrikker";
import { fornavn, krevBruker } from "@/lib/tilgang";

/**
 * Forsiden: målet, søket, og deretter én rad per kategori.
 *
 * SERVERKOMPONENT. Bare søket og radene er klientkode; alt innholdet går
 * over ledningen som HTML.
 *
 * `krevBruker()` OG IKKE BARE PROXYEN. Next sier selv at proxy-laget er en
 * optimistisk sjekk, ikke en autorisasjonsløsning. Se src/lib/tilgang.ts.
 */
export default async function Forside() {
  const bruker = await krevBruker();
  const grupper = kategorierMedInnhold();

  // Bolkene i rekkefølge, med kategoriene sine. Se kategorier.ts for hvorfor
  // rekkefølgen er håndverk → kunde → oss.
  const bolker: Bolk[] = ["handverk", "kunde", "oss"];

  return (
    <>
      <Container>
        <div className="pt-8 pb-12 sm:pt-12">
          <p className="text-[0.9375rem] text-blekk-dempet">
            Hei, {fornavn(bruker)}.
          </p>

          <div className="mt-5 sm:mt-7">
            <Maalet />
          </div>

          {/*
            SØKET STÅR FOR SEG, over radene og under målet.

            Det er den eneste kontrollen på siden som går på tvers av alt, og
            gjennomgående funn i undersøkelser av intranett er at bruken
            faller når folk ikke finner fram raskt. Derfor: alltid synlig,
            alltid samme sted, og det søker i brødteksten og ikke bare i
            titlene.
          */}
          <div className="mt-10 sm:mt-12">
            <Sok rubrikker={RUBRIKKER} />
          </div>
        </div>
      </Container>

      {/*
        RADENE LIGGER UTENFOR CONTAINEREN, og det er ikke en forglemmelse.
        Hver rad har sin egen sidepolstring, slik at kortene kan blas helt
        ut til skjermkanten i stedet for å stoppe i en usynlig vegg midt på
        siden. Overskriftene er fortsatt på linje med resten.
      */}
      <div className="flex flex-col gap-14 pb-8 sm:gap-20">
        {bolker.map((bolk) => {
          const iBolk = grupper.filter((g) => g.kategori.bolk === bolk);
          if (iBolk.length === 0) return null;
          return (
            <div key={bolk} className="flex flex-col gap-14 sm:gap-20">
              <Bolkoverskrift bolk={bolk} />
              {iBolk.map(({ kategori, rubrikker }, i) => (
                <Rad
                  key={kategori.id}
                  kategori={kategori}
                  rubrikker={rubrikker}
                  prioriter={bolk === "handverk" && i === 0}
                />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

/**
 * Skillet mellom de tre bolkene.
 *
 * En hårstrek og en etikett, ikke en stor overskrift. Bolkene er en
 * gruppering av ti rader — de skal hjelpe øyet å orientere seg, ikke
 * konkurrere med kategorinavnene som er det man faktisk leter etter.
 */
function Bolkoverskrift({ bolk }: { bolk: Bolk }) {
  const b = BOLKER[bolk];
  return (
    <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-kant-regel pt-5">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-aksent-tekst uppercase">
          {b.navn}
        </p>
        <p className="text-[0.9375rem] text-blekk-dempet">{b.ingress}</p>
      </div>
    </div>
  );
}
