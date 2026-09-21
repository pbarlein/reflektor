"use client";

import { useEffect, useRef, useState } from "react";

import { LEST_KAPSEL, LEST_LEVETID, lesMaske, skrivMaske } from "@/lib/lesing";

/** Synlig tid på siden før noe regnes som lest. */
const KREVD_MS = 60_000;

/**
 * Merker en rubrikk som lest, og viser hva som skal til.
 *
 * ── TO KRAV, OG BEGGE MÅ VÆRE OPPFYLT ─────────────────────────────────────
 *
 * 1. Rullet helt til bunnen av teksten.
 * 2. Vært på siden i minst ett minutt.
 *
 * Hver for seg er de lette å lure. Ruller du raskt til bunnen, har du ikke
 * lest noe. Lar du fanen ligge åpen i en time, heller ikke. Sammen er de en
 * rimelig terskel — og viktigere: de er SAGT HØYT nederst på siden, så
 * ingen lurer på hvorfor haken ikke kom.
 *
 * ── TIDEN TELLES BARE NÅR SIDEN ER SYNLIG ─────────────────────────────────
 *
 * `document.visibilityState` stopper klokka når fanen bytter. En rubrikk
 * som ligger i en bakgrunnsfane mens du spiser lunsj, blir ikke lest av
 * seg selv. Det er forskjellen på et framdriftsverktøy og en teller.
 *
 * ── DEN SKRIVER TIL EGEN NETTLESER, INGEN ANNEN STEDS ─────────────────────
 *
 * Statusen havner i en informasjonskapsel hos den ansatte. Den sendes ikke
 * til noen, og ingen kan slå opp hvem som har lest hva. Se src/lib/lesing.ts.
 */
export function Lesesporing({
  nr,
  alleredeLest,
}: {
  nr: number;
  alleredeLest: boolean;
}) {
  const [bunn, settBunn] = useState(false);
  const [sekunder, settSekunder] = useState(0);
  const merke = useRef<HTMLDivElement | null>(null);

  /*
   * `lest` ER UTLEDET, ikke lagret.
   *
   * Første utgave hadde en egen tilstand som ble satt fra en effekt når
   * begge kravene slo inn. React-kompilatoren avviste den med rette:
   * setState i en effekt gir en ekstra render for noe som allerede følger
   * av de to andre tilstandene. Utledet er det også umulig å få ut av takt
   * med kapselen.
   */
  const oppfylt = bunn && sekunder >= KREVD_MS / 1000;
  const lest = alleredeLest || oppfylt;

  /*
   * Klokka. Ett intervall, og det teller bare når fanen er synlig.
   * Tilstanden oppdateres én gang i sekundet — nok til en teller, og lite
   * nok til at ingenting merkes.
   */
  useEffect(() => {
    if (lest) return;
    let ms = 0;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      ms += 1000;
      settSekunder(Math.min(Math.round(ms / 1000), KREVD_MS / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [lest]);

  /*
   * Bunnen. IntersectionObserver på selve merket, som står nederst i
   * artikkelen — ingen scroll-lytter, ingen utregning av sidehøyde, og
   * riktig svar også når siden er kortere enn skjermen.
   */
  useEffect(() => {
    const el = merke.current;
    if (!el || lest) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) settBunn(true);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lest]);

  /*
   * Den eneste effekten som skriver noe: kapselen. Ingen setState her —
   * effekten oppdaterer et eksternt system med tilstanden React allerede
   * har, som er nøyaktig det effekter er til for.
   */
  useEffect(() => {
    if (!oppfylt || alleredeLest) return;
    const naa = document.cookie
      .split("; ")
      .find((d) => d.startsWith(`${LEST_KAPSEL}=`))
      ?.split("=")[1];
    const sett = lesMaske(naa);
    sett.add(nr);
    document.cookie = `${LEST_KAPSEL}=${skrivMaske(sett)}; path=/; max-age=${LEST_LEVETID}; samesite=lax`;
  }, [oppfylt, alleredeLest, nr]);

  const igjen = Math.max(0, KREVD_MS / 1000 - sekunder);

  return (
    <div ref={merke} className="mt-12 border-t border-kant-regel pt-6">
      {lest ? (
        <p className="flex items-center gap-2.5 text-[0.9375rem] text-blekk-dempet">
          <span
            aria-hidden
            className="flex size-6 items-center justify-center rounded-full bg-blekk text-[0.75rem] text-kort"
          >
            ✓
          </span>
          Lest. Den er huket av på forsiden.
        </p>
      ) : (
        /*
          KRAVENE STÅR HER, ikke i en hjelpetekst. Et merke som dukker opp
          av seg selv er magi; magi gjør folk usikre på om de gjorde noe
          feil. To linjer fjerner hele spørsmålet.
        */
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] text-blekk-svak">
          <span className="flex items-center gap-2">
            <Hake på={bunn} />
            Rullet til bunnen
          </span>
          <span className="flex items-center gap-2">
            <Hake på={igjen === 0} />
            {igjen === 0
              ? "Ett minutt på siden"
              : `Ett minutt på siden (${igjen} s igjen)`}
          </span>
        </div>
      )}
    </div>
  );
}

function Hake({ på }: { på: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-4 items-center justify-center rounded-full text-[0.625rem] ${
        på ? "bg-blekk-dempet text-kort" : "border border-kant text-transparent"
      }`}
    >
      ✓
    </span>
  );
}
