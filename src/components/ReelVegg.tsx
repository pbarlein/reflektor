import { Container } from "./Container";

/**
 * Reel-vegg: 9:16-innhold i telefonformat.
 *
 * Mønsteret researchen anbefalte for vertikalt innhold på desktop. Alternativet
 * — å strekke 9:16 til en bakgrunnsvideo — koster mest der det er dyrest, i
 * heroen, og gir dårligere LCP uten å vise formatet slik det faktisk leveres.
 *
 * Ytelsesregler som følger av budsjettet:
 * - `aspect-ratio` på containeren reserverer høyden. Uten den får vi CLS.
 * - Posterbilde er standard. Video lastes ikke før den trengs.
 * - `loading="lazy"` på alt unntatt de to første.
 *
 * Klippene finnes ikke ennå. Rammene står med riktig format så rytmen kan
 * vurderes, og byttes ut når filene kommer.
 */
export function ReelVegg({ tekster }: { tekster: (string | null)[] }) {
  return (
    <Container>
      <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {tekster.map((tekst, i) => (
          <li key={i}>
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
