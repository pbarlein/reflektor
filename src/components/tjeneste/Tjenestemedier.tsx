"use client";

import Image from "next/image";

import { Klipp } from "@/components/Klipp";
import type { Arbeidsmedie } from "@/content/tjenester";
import { useSpillNarSynlig } from "@/lib/videosynlighet";

/**
 * Mediene på tjenestesidene, skilt ut som klientkomponent 27.09.2026.
 *
 * HVORFOR DE MÅTTE UT AV LAYOUTEN. `Tjenestelayout` er en serverkomponent.
 * Den kan ikke holde en ref eller en IntersectionObserver, og klippene ble
 * derfor rendret uten `festRef`. Et `Klipp` uten `festRef` og uten `ivrig`
 * får verken autospill eller observer: det laster aldri, og står for alltid
 * på plakatbildet.
 *
 * Resultatet var at fire videoer så ut som fire stillbilder. Pål meldte det
 * to ganger — «du må åpenbart vise videoer og ikke bilder» — og han hadde
 * rett begge gangene, også etter at jeg hadde byttet alle fire til film.
 * Målt i nettleseren: `autoplay:false paused:true readyState:0`.
 *
 * Feilen fantes allerede i den gamle rullende raden, så den er eldre enn
 * denne omleggingen. Den var bare lettere å overse da halvparten av flatene
 * var stillbilder uansett.
 *
 * `Enkeltklipp` i Arbeidsbilder.tsx finnes av nøyaktig samme grunn. Denne
 * gjør det samme for et rutenett og for én film i bredformat.
 */

/** Fire medier i stående rutenett. Foto og film om hverandre. */
export function Arbeidsrutenett({ medier }: { medier: Arbeidsmedie[] }) {
  const fest = useSpillNarSynlig();

  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {medier.map((m) => (
        <li
          key={m.sti}
          className="relative aspect-[9/16] overflow-hidden rounded-medie bg-flate-dempet"
        >
          {m.type === "foto" ? (
            <Image
              src={m.sti}
              alt={m.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 24vw"
              className="object-cover"
            />
          ) : (
            <Klipp sti={m.sti} festRef={fest(m.sti)} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** Én film i sitt eget bredformat, med bildetekst. */
export function Hovedfilm({
  sti,
  bildetekst,
}: {
  sti: string;
  bildetekst: string;
}) {
  const fest = useSpillNarSynlig();

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-medie bg-flate-dempet">
        <Klipp sti={sti} festRef={fest(sti)} />
      </div>
      <figcaption className="mt-3 text-sm text-blekk-dempet">
        {bildetekst}
      </figcaption>
    </figure>
  );
}
