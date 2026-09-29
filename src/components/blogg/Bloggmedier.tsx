"use client";

import Image from "next/image";

import { Klipp } from "@/components/Klipp";
import type { Bloggmedie } from "@/content/artikler";
import { useSpillNarSynlig } from "@/lib/videosynlighet";

/**
 * Bildene og filmene inne i en bloggartikkel.
 *
 * KLIENTKOMPONENT AV SAMME GRUNN SOM `Tjenestemedier`. Bloggmalen er en
 * serverkomponent. Den kan ikke holde en ref eller en IntersectionObserver,
 * og et `Klipp` uten `festRef` og uten `ivrig` laster aldri — det står for
 * alltid på plakatbildet. Fire videoer som så ut som fire stillbilder er
 * nøyaktig den feilen tjenestesidene hadde, og Pål meldte den to ganger.
 *
 * TO OPPFØRSLER, SOM PÅ TJENESTESIDENE:
 *
 * `lyd` utelatt gir `Klipp`: dempet, i løkke, uten kontroller, starter selv
 * når den kommer i synsfeltet. Riktig for korte klipp som leses som
 * bevegelse — bak kulissene, et produkt, en rett.
 *
 * `lyd: true` gir en ekte avspiller med kontroller og uten autospill.
 * Riktig for intervjuer og profilfilmer på 20–40 sekunder, der poenget er
 * det som blir SAGT. Dempet autospill i løkke ville vist et ansikt som
 * beveger leppene og aldri kommer til poenget.
 *
 * SAMME SPALTE SOM BRØDTEKSTEN, og det er et valg. Bloggmalen legger alle
 * blokkene inne i en spalte på 42rem, så mediene her kan ikke bli bredere
 * enn teksten uansett hva `max-w` sier. Det er toppbildet som er det brede
 * innslaget på siden; mediene inne i teksten skal lese som en del av
 * artikkelen, ikke som avbrytelser.
 */

const RAMME: Record<Bloggmedie["format"], string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "9/16": "aspect-[9/16]",
};

/**
 * Hvor bred blokken får lov til å bli, etter format og antall.
 *
 * STÅENDE MEDIER MÅ HOLDES IGJEN. Et 9:16-par i full bredde blir 672 px
 * høyt på skjerm, og da er det ikke lenger et innslag i en artikkel — det
 * er en avbrytelse leseren må rulle forbi. Et liggende par i samme bredde
 * blir 212 px. Tallene under er valgt slik at alle blokkene lander på
 * omtrent samme høyde uansett format, og det er høyden som avgjør rytmen i
 * en tekst.
 */
const BREDDE: Record<Bloggmedie["format"], { en: string; par: string }> = {
  "16/9": { en: "max-w-3xl", par: "max-w-3xl" },
  "4/5": { en: "max-w-sm", par: "max-w-xl" },
  "9/16": { en: "max-w-xs", par: "max-w-md" },
};

export function Bloggmedier({
  elementer,
  bildetekst,
}: {
  elementer: Bloggmedie[];
  bildetekst?: string;
}) {
  const fest = useSpillNarSynlig();
  const par = elementer.length === 2;

  return (
    <figure
      className={`mt-10 ${BREDDE[elementer[0].format][par ? "par" : "en"]}`}
    >
      {/*
        TO I BREDDEN OGSÅ PÅ TELEFON, og det er et valg. Begge elementene i
        en blokk har samme sideforhold — det håndheves i artikler.ts — så de
        får samme høyde uten at høyden er satt noe sted, og bildetekstene
        havner på samme linje. Et stående klipp blir 171 px bredt på en 390
        px skjerm, og det er nok til å se hva det viser.

        Å stable dem under hverandre i stedet ville gjort artikkelen dobbelt
        så lang på telefon uten å vise noe mer.
      */}
      <div className={par ? "grid grid-cols-2 gap-3 sm:gap-4" : ""}>
        {elementer.map((m) => (
          <div
            key={m.sti}
            className={`relative overflow-hidden rounded-medie bg-flate-dempet ${RAMME[m.format]}`}
          >
            {m.slag === "foto" ? (
              <Image
                src={`${m.sti}.jpg`}
                alt={m.alt}
                fill
                sizes={
                  par
                    ? "(min-width: 640px) 24rem, 50vw"
                    : "(min-width: 768px) 48rem, 100vw"
                }
                className="object-cover"
                style={m.fokus ? { objectPosition: m.fokus } : undefined}
              />
            ) : m.lyd ? (
              /*
                ABSOLUTT POSISJONERT som i Klipp: et <video> uten posisjon
                bryter ut av en `aspect-*`-ramme i Safari.

                `controlsList` uten `nofullscreen`. Dette er en film noen
                skal SE, og da skal fullskjerm være der.
              */
              <video
                className="absolute inset-0 size-full object-cover"
                src={`${m.sti}.mp4`}
                poster={`${m.sti}.jpg`}
                preload="none"
                controls
                playsInline
                controlsList="nodownload noremoteplayback"
                aria-label={m.alt}
              />
            ) : (
              <Klipp sti={m.sti} festRef={fest(m.sti)} />
            )}
          </div>
        ))}
      </div>
      {bildetekst && (
        <figcaption className="mt-3 text-sm text-blekk-dempet">
          {bildetekst}
        </figcaption>
      )}
    </figure>
  );
}
