"use client";

import Image from "next/image";

import { Klipp } from "@/components/Klipp";
import type { Arbeidsmedie, Referansefilm } from "@/content/tjenester";
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

/**
 * Referansefilmene: hele filmer, ikke utdrag.
 *
 * BESTILT AV PÅL 28.09.2026: «la videoene gå i sin helhet. blir en dårlig
 * referanse på siden om man bare ser en liten del.» Han har rett, og det
 * gjelder ikke bare lengden — det gjelder hva slags avspiller de trenger.
 *
 * TO OPPFØRSLER, OG DE LØSER TO FORSKJELLIGE OPPGAVER:
 *
 * `lyd: false` (standard) gir `Klipp`: dempet, i løkke, uten kontroller.
 * Riktig for en film som leses som bevegelse — en reklamefilm på femten
 * sekunder uten replikk sier det den skal si uten lyd.
 *
 * `lyd: true` gir en ekte avspiller: kontroller, lyd, ingen løkke, ingen
 * autospill. Filmene det gjelder er intervjuer og profilfilmer på 20–40
 * sekunder der hele poenget er det som blir SAGT. Dempet autospill i løkke
 * ville vist et ansikt som beveger leppene og aldri kommer til poenget —
 * verre enn ingen film.
 *
 * `preload="none"` og plakatbilde på begge. Ingenting lastes før noen
 * trykker play, og det er også derfor autospill ikke gir mening her: fire
 * megabyte skal ikke lastes ned for noen som ruller forbi.
 */
export function Referansefilmer({ filmer }: { filmer: Referansefilm[] }) {
  const fest = useSpillNarSynlig();

  return (
    <div className="grid gap-10 lg:gap-12">
      {filmer.map((f) => (
        <figure key={f.sti} className={f.format === "9/16" ? "max-w-sm" : ""}>
          <div
            className={`relative overflow-hidden rounded-medie bg-flate-dempet ${
              f.format === "9/16" ? "aspect-[9/16]" : "aspect-video"
            }`}
          >
            {f.lyd ? (
              /*
                ABSOLUTT POSISJONERT som i Klipp: et <video> uten posisjon
                bryter ut av en `aspect-*`-ramme i Safari.

                `controlsList` uten `nofullscreen` — i motsetning til Klipp.
                Dette er en film noen skal SE, og da skal fullskjerm være der.
              */
              <video
                className="absolute inset-0 size-full object-cover"
                src={`${f.sti}.mp4`}
                poster={`${f.sti}.jpg`}
                preload="none"
                controls
                playsInline
                controlsList="nodownload noremoteplayback"
                aria-label={f.alt}
              />
            ) : (
              <Klipp sti={f.sti} festRef={fest(f.sti)} />
            )}
          </div>
          <figcaption className="mt-3 text-sm text-blekk-dempet">
            {f.bildetekst}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
