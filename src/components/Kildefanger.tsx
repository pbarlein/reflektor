"use client";

import { useEffect } from "react";

import { KILDE_NOKKEL, byggKilde, skalLagres } from "@/lib/kilde";

/**
 * Lagrer hvor besøkende kom fra, på hver side, slik at kontaktskjemaet kan
 * sende det med uansett hvilken side personen landet på først.
 * Se lib/kilde.ts for format og regler.
 *
 * Ligger i rotlayoutet. Rendrer ingenting.
 */
export function Kildefanger() {
  useEffect(() => {
    try {
      const lagret = localStorage.getItem(KILDE_NOKKEL);
      if (!skalLagres(lagret, location.search)) return;
      localStorage.setItem(
        KILDE_NOKKEL,
        byggKilde(location.search, document.referrer, location.hostname, location.pathname),
      );
    } catch {
      // localStorage kan være sperret (privat modus, blokkerte data).
      // Skjemaet faller da tilbake på dette besøket alene.
    }
  }, []);

  return null;
}
