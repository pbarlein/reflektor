import { RUBRIKKER, antallUgodkjente } from "@/content/rubrikker";
import { hentBruker } from "@/lib/tilgang";

/**
 * Bunnfeltet. Kort, med ÉN opplysning som betyr noe: hvor mange rubrikker
 * som fortsatt er fagutkast.
 *
 * Tallet står på hver side fordi det er lett å glemme at det bare synker
 * hvis noen gjør noe. En teller nederst er den billigste påminnelsen som
 * finnes.
 */
export async function Bunnfelt() {
  const bruker = await hentBruker();
  if (!bruker) return null;

  const utkast = antallUgodkjente();

  return (
    <footer className="mt-24 border-t border-kant bg-dempet py-10">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-3 px-5 text-[0.8125rem] text-blekk-dempet sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Reflektor internt — kun for ansatte. Ikke del lenker utenfor huset.</p>
        <p>
          {utkast === 0 ? (
            "Alt innhold er kvalitetssikret."
          ) : (
            <>
              <span className="font-medium text-varsel">{utkast}</span> av{" "}
              {RUBRIKKER.length} rubrikker er fagutkast som må kvalitetssikres.
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
