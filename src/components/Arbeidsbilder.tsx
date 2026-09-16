"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "./Container";
import type { Bilde, Kolonne } from "@/content/arbeid";

/**
 * Arbeidsseksjonen: foto og stående video om hverandre, i tre forskjøvne
 * stabler.
 *
 * Se src/content/arbeid.ts for hvorfor stabler og ikke rutenett med row-span,
 * og hvorfor klippene ligger i de smaleste cellene.
 *
 * YTELSE. Ytelse er prosjektets sterkest dokumenterte funn, og denne
 * seksjonen har både bilder og video, så den styrer valgene:
 *
 * - `next/image` med `fill` gir AVIF og responsive størrelser fra én kildefil.
 * - Video har `preload="none"` og posterbilde. Ingenting lastes før klippet
 *   er i synsfeltet.
 * - Bare klipp som faktisk er synlige spiller. IntersectionObserver pauser
 *   resten. Med sju klipp på siden totalt ville samtidig avspilling vært en
 *   målbar LCP- og batteriskade.
 * - `aspect-ratio` på hver celle reserverer høyden, så ingen CLS når en lang
 *   stabel lastes inn under scrolling.
 * - `prefers-reduced-motion` slår av autospill helt. Da står posterbildet.
 */
export function Arbeidskolonner({ kolonner }: { kolonner: Kolonne[] }) {
  /*
     Refsene nøkles på filnavn, ikke på løpenummer. Et løpenummer ville måttet
     telles opp under render, og det er en mutasjon som gir ustabile
     tilordninger når React rendrer på nytt — lint fanget det.
  */
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const iakt = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          const v = p.target as HTMLVideoElement;
          // play() avvises hvis fanen er skjult. Det er ikke en feil.
          if (p.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.4 },
    );
    for (const v of Object.values(refs.current)) if (v) iakt.observe(v);
    return () => iakt.disconnect();
  }, []);

  return (
    <Container>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {kolonner.map((kol, k) => (
          <div
            key={k}
            className={`flex flex-col gap-4 lg:gap-5 ${kol.forskyvning}`}
          >
            {kol.medier.map((m) => {
              if (m.type === "foto") {
                return (
                  <figure
                    key={m.fil}
                    className={`relative overflow-hidden rounded-flate bg-flate-dempet ${m.format}`}
                  >
                    <Image
                      src={`/arbeid/${m.fil}-1600.jpg`}
                      alt={m.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                      className="object-cover"
                    />
                  </figure>
                );
              }
              return (
                <figure
                  key={m.fil}
                  className="relative aspect-[9/16] overflow-hidden rounded-flate bg-flate-dempet"
                >
                  <video
                    ref={(el) => {
                      refs.current[m.fil] = el;
                    }}
                    className="size-full object-cover"
                    poster={`/reels/${m.fil}.jpg`}
                    preload="none"
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    tabIndex={-1}
                    disablePictureInPicture
                    controlsList="nodownload noremoteplayback nofullscreen"
                  >
                    <source src={`/reels/${m.fil}.mp4`} type="video/mp4" />
                  </video>
                </figure>
              );
            })}
          </div>
        ))}
      </div>
    </Container>
  );
}

/**
 * Tett bånd: like celler, full bredde, mengde er poenget.
 *
 * Bryter containeren med vilje. Et bånd som stopper ved tekstbredden leser
 * som en illustrasjon; ett som går ut av skjermen leser som en strøm.
 */
export function Arbeidsband({ bilder }: { bilder: Bilde[] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-2">
      {bilder.map((b) => (
        <figure
          key={b.fil}
          className="relative aspect-[4/5] overflow-hidden bg-flate-dempet"
        >
          <Image
            src={`/arbeid/${b.fil}-640.jpg`}
            alt={b.alt}
            fill
            sizes="(max-width: 640px) 33vw, 17vw"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
