"use client";

import { useSyncExternalStore } from "react";

/**
 * Bakgrunnsvideo i heroen.
 *
 * Grepene her følger direkte av ytelsesbudsjettet i brief 8.7, og av at
 * dagens side gjør det motsatte: 13,7 MB video uten poster, i 2597×1080
 * uansett skjerm, som gir en tom svart boks med spinner i flere sekunder.
 *
 * - `poster` vises alltid først. Ingen tom flate mens video lastes.
 * - `aspect-ratio` reserverer høyden, så ingenting hopper (CLS).
 * - Egen fil per skjermstørrelse via `<source media>` – mobil laster 0,9 MB,
 *   ikke 1,9 MB skalert ned i nettleseren.
 * - `preload="none"`: posteren bærer førstevisningen, videoen hentes etterpå.
 * - Uten lyd. `muted` er også det som gjør at autoplay i det hele tatt tillates.
 * - `prefers-reduced-motion` respekteres fullt ut – da vises kun posteren, og
 *   videofilen lastes aldri.
 */
/*
 * matchMedia er en ekstern kilde, ikke komponentens egen tilstand.
 * useSyncExternalStore leser den direkte – ingen effekt, ingen ekstra render,
 * og ingen risiko for at serveren og klienten er uenige under hydrering.
 */
const SPORRING = "(prefers-reduced-motion: reduce)";

function abonner(varsle: () => void) {
  const mq = window.matchMedia(SPORRING);
  mq.addEventListener("change", varsle);
  return () => mq.removeEventListener("change", varsle);
}

export function HeroVideo({ className }: { className?: string }) {
  const rolig = useSyncExternalStore(
    abonner,
    () => window.matchMedia(SPORRING).matches,
    () => false, // Serveren kjenner ikke brukerens preferanse.
  );

  if (rolig) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/bilder/seksjoner/hero-poster.jpg"
        alt=""
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      poster="/bilder/seksjoner/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    >
      <source src="/video/hero-mobil.mp4" media="(max-width: 640px)" type="video/mp4" />
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
