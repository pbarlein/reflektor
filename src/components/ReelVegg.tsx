"use client";

import { useEffect, useRef } from "react";
import { Container } from "./Container";
import type { Reel } from "@/content/reels";

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
 * - Bare klippet som er i viewport spiller. IntersectionObserver pauser
 *   resten. Fire samtidige autoplay er målbar LCP- og batteriskade.
 * - `aspect-ratio` på containeren reserverer høyden. Uten den får vi CLS.
 * - Klippene er dekorative: `aria-hidden` og `tabindex={-1}`. Informasjonen
 *   ligger i bildeteksten, ikke i videoen.
 * - `prefers-reduced-motion` stopper autospill helt. Da står posterbildet.
 */
export function ReelVegg({ reels }: { reels: Reel[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const roligere = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (roligere) return;

    const iakt = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          const v = p.target as HTMLVideoElement;
          if (p.isIntersecting) {
            // play() avvises hvis fanen er skjult. Det er ikke en feil.
            void v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.6 },
    );

    for (const v of refs.current) if (v) iakt.observe(v);
    return () => iakt.disconnect();
  }, []);

  return (
    <Container>
      <ul
        className="
          -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0
          lg:grid-cols-4 lg:gap-4
        "
      >
        {reels.map((reel, i) => (
          <li key={reel.fil} className="w-[70vw] shrink-0 snap-start sm:w-auto">
            <div className="aspect-[8/16] overflow-hidden rounded-medie bg-flate-dempet">
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="size-full object-cover"
                poster={`/reels/${reel.fil}.jpg`}
                preload="none"
                muted
                loop
                playsInline
                aria-hidden="true"
                tabIndex={-1}
                disablePictureInPicture
                controlsList="nodownload noremoteplayback nofullscreen"
              >
                <source src={`/reels/${reel.fil}.mp4`} type="video/mp4" />
              </video>
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
