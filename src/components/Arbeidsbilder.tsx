"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "./Container";
import type { Celle, Medie } from "@/content/arbeid";

/**
 * Spiller bare klippene som er i synsfeltet, og bare hvis brukeren tåler
 * bevegelse. Refene er nøklet på filnavn, ikke på en teller: en teller ville
 * måttet muteres under render, og det er ikke lov.
 *
 * Siden har tretten klipp til sammen. Uten denne pausingen ville alle spilt
 * samtidig etter første scroll — målbar batteri- og dekoderkostnad, og ingen
 * ser mer enn én seksjon om gangen uansett.
 */
function useSynligeKlipp(terskel: number) {
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
      { threshold: terskel },
    );
    for (const v of Object.values(refs.current)) if (v) iakt.observe(v);
    return () => iakt.disconnect();
  }, [terskel]);

  // Returnerer en festefunksjon, ikke selve refen. React-kompilatoren tillater
  // ikke at en ref som er sendt inn som prop, muteres i mottakeren.
  return (fil: string) => (el: HTMLVideoElement | null) => {
    refs.current[fil] = el;
  };
}

/**
 * Klippene er dekorative. Informasjonen ligger i bildene rundt og i teksten,
 * så videoen er `aria-hidden` og utenfor tabrekkefølgen. `preload="none"`
 * betyr at ingenting hentes før klippet er i synsfeltet; fram til da står
 * plakatbildet.
 */
function Klipp({
  medie,
  sti,
  festRef,
}: {
  medie: Medie;
  sti: string;
  festRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <video
      ref={festRef}
      className="size-full object-cover"
      poster={`${sti}/${medie.fil}.jpg`}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      controlsList="nodownload noremoteplayback nofullscreen"
    >
      <source src={`${sti}/${medie.fil}.mp4`} type="video/mp4" />
    </video>
  );
}

/**
 * Arbeidsseksjonen: foto og stående video om hverandre, i fire like høye
 * kolonner.
 *
 * Se src/content/arbeid.ts for hvorfor blokken er rektangulær, hvorfor
 * enhetene er som de er, og hvorfor klippene ligger i de høye cellene.
 *
 * TO LAYOUTER, ikke én responsiv. Under lg er det et vanlig tokolonners
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
 * - Bare klipp som er synlige spiller. Se useSynligeKlipp.
 * - Høyden er reservert av containeren, så ingen CLS.
 * - `prefers-reduced-motion` slår av autospill helt. Da står posterbildet.
 */
export function Arbeidskolonner({ kolonner }: { kolonner: Celle[][] }) {
  const fest = useSynligeKlipp(0.3);

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
        <Klipp medie={c} sti="/reels" festRef={fest(c.fil)} />
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
 *
 * Fire av de tolv cellene er klipp. Se src/content/arbeid.ts for hvorfor de
 * ligger akkurat der de ligger, og hvorfor de er beskåret til 4:5 allerede
 * ved enkoding — her er cellen 4:5 på alle bredder, så `object-cover` har
 * ingenting å beskjære.
 *
 * Terskelen er lavere enn i rutenettet (0,15 mot 0,3). Cellene er små, og en
 * hel rad er sjelden 30 % synlig samtidig på mobil.
 */
export function Arbeidsband({ medier }: { medier: Medie[] }) {
  const fest = useSynligeKlipp(0.15);

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-2">
      {medier.map((m) => (
        <figure
          key={m.fil}
          className="relative aspect-[4/5] overflow-hidden bg-flate-dempet"
        >
          {m.type === "foto" ? (
            <Image
              src={`/arbeid/${m.fil}-640.jpg`}
              alt={m.alt}
              fill
              sizes="(max-width: 640px) 33vw, 17vw"
              className="object-cover"
            />
          ) : (
            <Klipp medie={m} sti="/arbeid" festRef={fest(m.fil)} />
          )}
        </figure>
      ))}
    </div>
  );
}
