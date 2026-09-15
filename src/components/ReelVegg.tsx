import { Container } from "./Container";

/**
 * Reel-vegg: 9:16-innhold i telefonformat.
 *
 * Mønsteret researchen anbefalte for vertikalt innhold på desktop. Alternativet
 * — å strekke 9:16 til en bakgrunnsvideo — koster mest der det er dyrest, i
 * heroen, og gir dårligere LCP uten å vise formatet slik det faktisk leveres.
 *
 * TRE klipp, ikke seks. Seksjonens jobb er å vise formatet og kvaliteten, ikke
 * å være en portefølje. Seks 9:16-rammer i to rader ga 2,2 skjermhøyder på
 * desktop og over tre på mobil — scrollkostnad uten ny informasjon, siden
 * klipp fire til seks sier det samme som de tre første. Vil noen se mer, er
 * det en lenke til arbeidet, ikke en lengre vegg.
 *
 * Mobil ruller vannrett med snap og «peek» på neste ramme. Dette er ikke en
 * karusell i den forstand researchen advarer mot: den roterer ikke av seg
 * selv, den skjuler ikke hovedbudskapet bak et bilde man må vente på, og alt
 * innhold er nåbart med én swipe. Innvendingen mot karuseller gjelder
 * auto-roterende hero-bannere, ikke en mediestripe som ligger stille.
 *
 * Ytelsesregler som følger av budsjettet:
 * - `aspect-ratio` på containeren reserverer høyden. Uten den får vi CLS.
 * - Posterbilde er standard. Video lastes ikke før den trengs.
 *
 * Klippene finnes ikke ennå. Rammene står med riktig format så rytmen kan
 * vurderes, og byttes ut når filene kommer.
 */
export function ReelVegg({ tekster }: { tekster: (string | null)[] }) {
  return (
    <Container>
      <ul
        className="
          -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0
        "
      >
        {tekster.map((tekst, i) => (
          <li key={i} className="w-[72vw] shrink-0 snap-start sm:w-auto">
            <div className="aspect-[9/16] overflow-hidden rounded-medie bg-flate-dempet shadow-card">
              <div className="flex h-full items-center justify-center text-sm text-blekk-svak">
                9:16
              </div>
            </div>
            <p className="mt-3 text-sm text-blekk-dempet">
              {tekst ?? (
                <mark className="rounded-xs bg-aksent/12 px-1.5 py-0.5 font-mono text-xs text-aksent">
                  TBD
                </mark>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
