"use client";

import { useEffect } from "react";

/**
 * Får ankerlenker til å virke når de peker på siden man allerede er på.
 *
 * FEILEN DEN RETTER: en hash-navigasjon er idempotent. Klikker du «Pris»,
 * ruller tilbake til toppen og klikker «Pris» igjen, skjer ingenting —
 * URL-en er fortsatt `/#pris`, nettleseren ser ingen navigasjon, og det er
 * ingenting å rulle til. Første klikk virket; det er andre klikk som er
 * borte. Pål fant det på forsiden.
 *
 * Det gjelder ikke bare «Pris». Hero-knappen peker på `#kontakt`, og
 * header-CTA-en gjør det samme når du står på forsiden. Alle tre hadde
 * samme feil.
 *
 * DERFOR ÉN DELEGERT LYTTER I STEDET FOR EN onClick PER LENKE. Den fanger
 * alle ankerlenker som finnes nå og alle som kommer siden, og den kan ikke
 * glemmes på en ny lenke.
 *
 * TRE TING DEN GJØR SOM EN NAIV `scrollIntoView` IKKE GJØR:
 *
 * 1. Den lar modifikatorklikk være i fred — cmd, ctrl, shift, alt og
 *    midtklikk skal åpne i ny fane, ikke rulle.
 * 2. Den skriver hash-en inn i URL-en med `replaceState`, så lenken kan
 *    kopieres og deles som før. `pushState` ville fylt historikken med
 *    tilbakeknapp-trinn som ikke fører noe sted.
 * 3. Den flytter TASTATURFOKUS til målet. En ekte hash-navigasjon gjør
 *    det; `scrollIntoView` gjør det ikke. Uten dette ville en
 *    tastaturbruker rullet til prisseksjonen mens fokus ble stående i
 *    headeren, og neste Tab ville gått til «Vårt arbeid». Det er samme
 *    grep som hoppelenken bruker.
 *
 * Rullingen respekterer `scroll-padding-top` i globals.css, så målet lander
 * under den klistrede headeren og ikke bak den.
 */
export function Ankerhopp() {
  useEffect(() => {
    const ved = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const lenke = (e.target as Element | null)?.closest?.("a");
      const href = lenke?.getAttribute("href");
      if (!href) return;

      // «#kontakt» alltid; «/#pris» bare når vi faktisk står på forsiden.
      const id = href.startsWith("#")
        ? href.slice(1)
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(2)
          : null;
      if (!id) return;

      const mal = document.getElementById(id);
      if (!mal) return;

      e.preventDefault();
      mal.scrollIntoView({ block: "start" });
      window.history.replaceState(null, "", href);

      if (!mal.hasAttribute("tabindex")) mal.setAttribute("tabindex", "-1");
      mal.focus({ preventScroll: true });
    };

    document.addEventListener("click", ved);
    return () => document.removeEventListener("click", ved);
  }, []);

  return null;
}
