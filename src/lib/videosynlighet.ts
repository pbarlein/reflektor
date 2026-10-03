"use client";

import { useEffect, useRef } from "react";

/**
 * Spiller klipp som er i synsfeltet, og pauser resten.
 *
 * SAMLET 16.09.2026. Før lå den samme logikken tre steder — i ReelVegg, i
 * Arbeidskolonner og i Arbeidsveggen — med hver sin terskel: 0,6, 0,3 og
 * 0,15. Ingen av de tre tallene var begrunnet noe sted, og de ga tre ulike
 * oppførsler for det som for brukeren er samme ting.
 *
 * TERSKELEN VAR DESSUTEN FEIL MODELL, og det ga en ekte feil på mobil.
 * `threshold` måler hvor stor ANDEL av elementet som er synlig. Den andelen
 * kan et element aldri nå hvis det er større enn vinduet eller klippes i
 * bredden — og reel-raden gjør nettopp det siste: på telefon er den en
 * vannrett snap-rad der neste klipp «peeker» inn med rundt en tredjedel.
 *
 * Målt på deployet, iPhone 13: det peekende klippet nådde maks 0,34 i
 * andel. Med terskel 0,6 spilte det aldri. Brukeren så ett klipp i
 * bevegelse og ett frosset ved siden av. Det var en av feilene Pål meldte.
 *
 * LØSNINGEN ER Å SPØRRE OM NOE ANNET: ikke «hvor mye av elementet er
 * synlig», men «overlapper elementet den delen av skjermen brukeren ser
 * på». Det uttrykkes med `threshold: 0` og en innkrympet rot. Da spiller
 * alt som faktisk er i bildet — uansett om elementet er høyere enn vinduet,
 * smalere enn cellen eller halvveis inne fra siden — og ingenting som ikke
 * er det.
 *
 * `rootMargin` er negativ i topp og bunn, ikke i sidene. Vannrett skal
 * terskelen være null: et klipp som så vidt er inne fra høyre, ER synlig,
 * og det er hele poenget med peek-layouten.
 */
const ROTMARGIN = "-8% 0px -8% 0px";

/**
 * Returnerer en festefunksjon, ikke selve refen.
 *
 * React-kompilatoren tillater ikke at en ref som sendes inn som prop,
 * muteres i mottakeren. Nøkkelen er kallerens eget valg — filnavn i
 * bildeveggene, indeks i reel-raden — og trenger bare være stabil innenfor
 * én liste.
 */
export function useSpillNarSynlig() {
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    /*
     * Ingen bevegelse betyr ingen bevegelse. Da står plakatbildet, som er
     * hentet fra klippet selv — brukeren mister motivet, ikke innholdet.
     *
     * HER STO `return`. Det var riktig så lenge plakaten lå i markeringen,
     * og ble feil 03.10.2026 da den ble flyttet til `data-plakat`: en tidlig
     * retur betydde at den som har slått av bevegelse ikke fikk NOE å se.
     * Nå settes plakaten uansett, og det er bare avspillingen som står over.
     */
    const roligere = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const iakt = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          const v = p.target as HTMLVideoElement;
          // play() avvises når fanen er skjult, og i strømsparing på iOS.
          // Begge deler er normalt, ikke en feil vi kan gjøre noe med.
          if (p.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0, rootMargin: ROTMARGIN },
    );

    /*
     * FORLASTEREN, lagt til 03.10.2026. Klippene står med `preload="none"`,
     * og uten denne begynner nedlastingen først i det øyeblikket cellen er
     * i bildet — altså ser man plakatbildet et halvt sekund før filmen
     * starter, hver gang.
     *
     * 200 px er omtrent en halv tomme rulling på en telefon: nok til at
     * starten av fila er hentet når cellen kommer fram, lite nok til at en
     * som aldri ruller dit heller ikke laster noe.
     *
     * Den setter `preload` og nøyer seg med det. Å kalle `play()` her ville
     * startet klipp utenfor skjermen, og det er nettopp det den negative
     * margen under er til for å unngå.
     */
    const forlaster = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          if (!p.isIntersecting) continue;
          const v = p.target as HTMLVideoElement;
          /*
           * PLAKATEN FØRST, OG UANSETT. Den er det eneste den som har slått
           * av bevegelse får se — se Klipp.tsx for hvorfor den ikke står i
           * markeringen fra start.
           */
          const plakat = v.dataset.plakat;
          if (plakat && !v.poster) v.poster = plakat;
          if (!roligere && v.preload === "none") v.preload = "metadata";
          forlaster.unobserve(v);
        }
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );

    for (const v of Object.values(refs.current))
      if (v) {
        if (!roligere) iakt.observe(v);
        forlaster.observe(v);
      }
    return () => {
      iakt.disconnect();
      forlaster.disconnect();
    };
  }, []);

  return (nokkel: string) => (el: HTMLVideoElement | null) => {
    refs.current[nokkel] = el;
  };
}
