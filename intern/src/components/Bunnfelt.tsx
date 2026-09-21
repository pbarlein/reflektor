import { hentBruker } from "@/lib/tilgang";
import { RUBRIKKER } from "@/content/rubrikker";

/**
 * Bunnfeltet. Kort, og med ÉN opplysning som faktisk betyr noe: hvor mange
 * rubrikker som fortsatt er utkast.
 *
 * Tallet står her og ikke bare på forsiden fordi det er lett å glemme at det
 * synker bare hvis noen gjør noe. En teller nederst på hver side er den
 * billigste påminnelsen som finnes.
 */
export async function Bunnfelt() {
  const bruker = await hentBruker();
  if (!bruker) return null;

  const utkast = RUBRIKKER.filter((r) => !r.godkjent).length;

  return (
    <footer className="mt-24 border-t border-[color:var(--kant-pa-dyp)] py-10">
      <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-3 px-6 text-[0.8125rem] text-pa-dyp-svak sm:flex-row sm:items-center sm:justify-between">
        <p>Reflektor internt — kun for ansatte. Ikke del lenker utenfor huset.</p>
        <p>
          {utkast === 0 ? (
            "Alt innhold er kvalitetssikret."
          ) : (
            <>
              <span className="font-medium text-varsel">{utkast}</span> av{" "}
              {RUBRIKKER.length} rubrikker er fortsatt utkast.
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
