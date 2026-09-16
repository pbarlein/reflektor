"use client";

import { Container } from "./Container";
import { Klipp } from "./Klipp";
import type { Reel } from "@/content/reels";
import { useSpillNarSynlig } from "@/lib/videosynlighet";

/**
 * Reel-vegg: 9:16-innhold i telefonformat, fire bransjer i én rad.
 *
 * Mønsteret researchen anbefalte for vertikalt innhold på desktop.
 * Alternativet — å strekke 9:16 til en bakgrunnsvideo — koster mest der det
 * er dyrest, i heroen, og gir dårligere LCP uten å vise formatet slik det
 * faktisk leveres.
 *
 * FIRE klipp i ÉN rad, ikke seks i to. Seks 9:16-rammer ga 2,2 skjermhøyder
 * på desktop. Fire i én rad viser hele utvalget i ett blikk — se
 * src/content/reels.ts for hvorfor akkurat disse fire.
 *
 * Formatet beskjæres til 8:16 (1:2) med `object-fit: cover`. Kildefilene
 * forblir 9:16 — beskjæringen ligger i CSS, så den kan endres uten å
 * re-enkode. Smalere kolonne gir tettere vegg.
 *
 * Ingen telefonramme. Mockup-telefoner rundt vertikal video daterer en side
 * umiddelbart. Ingen skygge — skiller lages med flate og linje.
 *
 * Mobil ruller vannrett med snap og «peek» på neste ramme. Dette er ikke en
 * karusell i den forstand researchen advarer mot: den roterer ikke av seg
 * selv, den skjuler ikke hovedbudskapet, og alt er nåbart med én swipe.
 *
 * YTELSE — dette er prosjektets sterkeste evidens, så den styrer her:
 * - Klippene er 640×1138, ikke 720×1280. Cellen er ~285 CSS px bred, altså
 *   570 device px ved 2x — 720 var overdimensjonert. Målt på den deployede
 *   siden ga nedskaleringen 9,72 → 7,28 MB, og en ramme fra hvert klipp vist
 *   ved faktisk størrelse er ikke til å skille fra originalen.
 * - `poster` lastes, video gjør det ikke. `preload="none"`.
 * - Bare klippet som er i synsfeltet spiller. Se useSpillNarSynlig — den
 *   lå tidligere her med terskel 0,6, og det var en feil: på mobil peeker
 *   neste klipp inn med rundt en tredjedel, så det nådde aldri 0,6 og
 *   spilte aldri. Nå avgjøres det av overlapp, ikke av andel.
 * - `aspect-ratio` på containeren reserverer høyden. Uten den får vi CLS.
 * - Klippene er dekorative: `aria-hidden` og `tabindex={-1}`. Informasjonen
 *   ligger i bildeteksten, ikke i videoen.
 * - `prefers-reduced-motion` stopper autospill helt. Da står posterbildet.
 */
export function ReelVegg({ reels }: { reels: Reel[] }) {
  const fest = useSpillNarSynlig();

  return (
    <Container>
      {/*
        `tabIndex={0}` gjelder bare den vannrette modusen under sm, men står
        alltid — en tabindex på et rutenett som ikke ruller er et tomt
        tabbestopp, ikke en feil, og alternativet er å speile breakpointet i
        JavaScript. Fra sm ruller ikke raden, så stoppet gjør ingenting.

        Uten den kunne en tastaturbruker på telefon bare se det første av de
        fire klippene. axe fanget det.

        INGEN `role="group"` her. Første forsøk satte det, og da mistet <ul>
        sin listerolle — barna ble <li> uten liste, som axe meldte som et
        nytt brudd. `aria-label` alene beholder rollen og gir navnet.
      */}
      <ul
        tabIndex={0}
        aria-label="Klipp fra produksjonsdager, rull vannrett"
        className="
          -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0
          lg:grid-cols-4 lg:gap-4
        "
      >
        {reels.map((reel) => (
          <li key={reel.fil} className="w-[70vw] shrink-0 snap-start sm:w-auto">
            <div className="relative aspect-[8/16] overflow-hidden rounded-medie bg-flate-dempet">
              <Klipp sti={`/reels/${reel.fil}`} festRef={fest(reel.fil)} />
            </div>
            <p className="mt-3 text-sm tracking-[0.02em]">
              {reel.kunde ? (
                <>
                  <span className="font-medium">{reel.kunde}</span>
                  <span className="text-blekk-dempet"> · {reel.kontekst}</span>
                </>
              ) : (
                <span className="text-blekk-dempet">{reel.kontekst}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
