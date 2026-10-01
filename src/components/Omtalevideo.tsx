"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Omtalevideoen fra en kunde: dempet autospill med en synlig lydknapp.
 *
 * HVORFOR IKKE `Klipp` OG IKKE `Referansefilmer`. `Klipp` er dekorativt —
 * `aria-hidden`, ingen lyd, ingen kontroller. Denne har et budskap og skal
 * høres. `Referansefilmer` med `lyd: true` gir nettleserens egen
 * kontrollinje og ingen autospill, og da står en 22 sekunders omtale som et
 * stillbilde til noen oppdager at den er en video.
 *
 * MELLOMLØSNINGEN ER DEN RIKTIGE HER, og den er mulig fordi tekstingen er
 * brent inn i bildet: videoen går dempet i løkke, så man ser at hun snakker
 * og kan LESE hva hun sier, og en tydelig knapp slår på lyden. Ingen blir
 * overrasket av lyd, og ingen går glipp av innholdet.
 *
 * LØKKEN STOPPER NÅR LYDEN SLÅS PÅ. En omtale som starter på nytt midt i
 * setningen er irriterende å høre på; som stum bakgrunn er løkken riktig.
 * Da spoles den også til start, slik at man hører hele.
 *
 * TRE KILDER I PRIORITERT REKKEFØLGE. WebM først: VP9 er 34 % mindre enn
 * H.264 her (5,5 mot 8,3 MB) og dekker Chrome, Edge, Firefox og Safari fra
 * 16. MP4 er reserven, og den er det Safari på eldre iOS velger.
 *
 * `preload="none"` til den kommer i synsfeltet. Videoen ligger langt nede
 * på begge sidene den brukes, og skal ikke koste noe i LCP.
 */
export function Omtalevideo({
  sti,
  alt,
  undertekster,
  className = "",
}: {
  /** Sti uten filendelse. `.webm`, `.mp4`, `-poster.jpg` leses herfra. */
  sti: string;
  alt: string;
  /** Sti til VTT-fila. Utelates om det ikke finnes teksting. */
  undertekster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [lyd, settLyd] = useState(false);
  const [lastet, settLastet] = useState(false);

  /*
    LASTES FØRST NÅR DEN ER I NÆRHETEN. `preload="none"` alene er ikke nok:
    uten kilder i DOM-en laster ingenting, men med dem laster Safari likevel
    metadata. Her legges <source> først inn når observeren sier fra, og da
    er ventetiden uansett borte før noen ser flaten.
  */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const iakt = new IntersectionObserver(
      ([p]) => {
        if (!p.isIntersecting) {
          v.pause();
          return;
        }
        settLastet(true);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          void v.play().catch(() => {});
        }
      },
      { threshold: 0, rootMargin: "-8% 0px -8% 0px" },
    );
    iakt.observe(v);
    return () => iakt.disconnect();
  }, []);

  function vekslLyd() {
    const v = ref.current;
    if (!v) return;
    const pa = !lyd;
    settLyd(pa);
    v.muted = !pa;
    v.loop = !pa;
    if (pa) v.currentTime = 0;
    void v.play().catch(() => {});
  }

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-flate bg-flate-dempet ${className}`}
    >
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover"
        poster={`${sti}-poster.jpg`}
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        aria-label={alt}
      >
        {lastet && (
          <>
            <source src={`${sti}.webm`} type="video/webm" />
            <source src={`${sti}.mp4`} type="video/mp4" />
            {undertekster && (
              /*
                IKKE `default`. Tekstingen er BRENT INN i bildet, og en
                `default`-track legger nettleserens egen tekstboks oppå den
                — to sett undertekster i samme ramme, målt i nettleseren
                01.10.2026. Sporet ligger her likevel, fordi det gjør det
                som blir sagt søkbart og lar den som vil slå det på selv.
              */
              <track
                kind="captions"
                src={undertekster}
                srcLang="no"
                label="Norsk"
              />
            )}
          </>
        )}
      </video>
      {/*
        KNAPPEN LIGGER ØVERST TIL HØYRE. Nederst sto den først, men der
        ligger den innbrente tekstingen — knappen dekket ordene den skulle
        gi deg lyden til. Øverst er flaten tom i alle 22 sekundene.

        Den har tekst og ikke bare et ikon, fordi et høyttalerikon alene
        like gjerne leses som «lyden er på» som «trykk for lyd».
      */}
      <button
        type="button"
        onClick={vekslLyd}
        aria-pressed={lyd}
        className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-dyp/80 px-4 py-2 text-sm font-medium text-pa-dyp backdrop-blur-sm transition-colors hover:bg-dyp motion-reduce:transition-none"
      >
        <span aria-hidden>{lyd ? "🔊" : "🔇"}</span>
        {lyd ? "Slå av lyd" : "Slå på lyd"}
      </button>
    </div>
  );
}
