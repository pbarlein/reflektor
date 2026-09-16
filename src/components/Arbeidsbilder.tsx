"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "./Container";
import type { Bilde, Celle } from "@/content/arbeid";

/**
 * Arbeidsseksjonen: foto og stående video om hverandre, i fire like høye
 * kolonner.
 *
 * Se src/content/arbeid.ts for hvorfor blokken er rektangulær, hvorfor
 * enhetene er som de er, og hvorfor klippene ligger i de høye cellene.
 *
 * TO LAYOUTER, ikke én responsiv. Under lg er det et vanlig tomkolonners
 * rutenett med faste formater per celle — fire kolonner à 288 px finnes ikke
 * på en telefon. Fra lg overtar flex-stablene med fast høyde, og det er DER
 * blokken blir rektangulær. Å presse den ene løsningen ned på mobil ville
 * gitt celler på under 90 px.
 *
 * YTELSE. Ytelse er prosjektets sterkest dokumenterte funn, og seksjonen har
 * både bilder og fire klipp:
 *
 * - `next/image` med `fill` gir AVIF og responsive størrelser fra én kildefil.
 * - Video har `preload="none"` og posterbilde. Ingenting lastes før klippet
 *   er i synsfeltet.
 * - Bare klipp som er synlige spiller. IntersectionObserver pauser resten.
 * - Høyden er reservert av containeren, så ingen CLS.
 * - `prefers-reduced-motion` slår av autospill helt. Da står posterbildet.
 */
export function Arbeidskolonner({ kolonner }: { kolonner: Celle[][] }) {
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
      { threshold: 0.3 },
    );
    for (const v of Object.values(refs.current)) if (v) iakt.observe(v);
    return () => iakt.disconnect();
  }, []);

  const celle = (c: Celle, mobilFormat: string) => (
    <figure
      key={c.fil}
      className={`relative overflow-hidden rounded-flate bg-flate-dempet ${mobilFormat} lg:aspect-auto ${
        c.enheter === 2 ? "lg:flex-[2]" : "lg:flex-1"
      }`}
    >
      {c.type === "foto" ? (
        <Image
          src={`/arbeid/${c.fil}-1600.jpg`}
          alt={c.alt}
          fill
          sizes="(max-width: 1024px) 50vw, 24vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={(el) => {
            refs.current[c.fil] = el;
          }}
          className="size-full object-cover"
          poster={`/reels/${c.fil}.jpg`}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          controlsList="nodownload noremoteplayback nofullscreen"
        >
          <source src={`/reels/${c.fil}.mp4`} type="video/mp4" />
        </video>
      )}
    </figure>
  );

  return (
    <Container>
      <div className="grid grid-cols-2 gap-3 lg:h-[60.5rem] lg:grid-cols-4 lg:gap-4">
        {kolonner.map((kol, k) => (
          <div key={k} className="contents lg:flex lg:h-full lg:flex-col lg:gap-4">
            {kol.map((c) =>
              celle(c, c.enheter === 2 ? "aspect-[9/16]" : "aspect-[4/5]"),
            )}
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
