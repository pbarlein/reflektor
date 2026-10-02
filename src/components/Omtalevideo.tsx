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
 * TO KILDER I PRIORITERT REKKEFØLGE: MP4 først, WebM som reserve. Her sto
 * «WebM først: VP9 er 34 % mindre». Snudd 02.10.2026 — se kommentaren ved
 * <source>. Kort fortalt: VP9 dekodes i programvare på de fleste iPhoner,
 * H.264 har maskinvaredekoder på alle, og noen sparte megabyte er ikke verdt
 * et bilde som fryser.
 *
 * `preload="metadata"`. Videoen ligger langt nede på alle sidene den brukes
 * og skal ikke koste noe i LCP, men metadata er noen få kilobyte — ikke
 * filmen. Her sto `preload="none"` med kildene satt inn av en
 * IntersectionObserver; se kommentaren over effekten for hvorfor den veien
 * er forlatt.
 */
export function Omtalevideo({
  sti,
  alt,
  forhold = "4/5",
  className = "",
}: {
  /** Sti uten filendelse. `.webm`, `.mp4`, `-poster.jpg` leses herfra. */
  sti: string;
  alt: string;
  /**
   * Formatet på rammen. Standard er 4:5.
   *
   * LAGT TIL 02.10.2026. Rammen var låst til 4:5, og siden videoen ligger
   * med `object-cover`, ble en 9:16-fil beskåret 30 % i bredden uten at noe
   * sa fra. Verdien MÅ stemme med fila som ligger i `sti` — det er ikke en
   * knapp for å endre utsnitt, det er en opplysning om hva fila er.
   */
  forhold?: "4/5" | "9/16";
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [lyd, settLyd] = useState(false);
  /*
    KILDENE RENDRES ALLTID, OG `preload="metadata"`. Forenklet 02.10.2026,
    tredje forsøk på «bildet henger mens lyden går» fra iPhone.

    FØR DETTE ble <source>-elementene satt inn først når en
    IntersectionObserver sa at flaten var i nærheten, med `preload="none"`.
    Hensikten var god — videoen ligger langt nede og skulle ikke koste noe i
    LCP — men den veien har en hel klasse feil i seg som ikke finnes i den
    vanlige: et element som rekker å ende i `NETWORK_NO_SOURCE` før kildene
    kommer, en `load()` som må rydde opp etterpå, og en `play()` som kan
    komme før elementet har noe å spille. Jeg lagde og målte bort én slik
    feil i dag alene — betingelsen som avbrøt MP4-nedlastingen midtveis.

    `preload="metadata"` henter noen få kilobyte, ikke filmen. Kostnaden er
    borte, og hele klassen med feil er borte med den. Det som er igjen er
    den kjedelige, vanlige veien: kilder i markeringen, nettleseren velger
    selv, observeren styrer bare play og pause.
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
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          void v.play().catch(() => {});
        }
      },
      { threshold: 0, rootMargin: "-8% 0px -8% 0px" },
    );
    iakt.observe(v);
    return () => iakt.disconnect();
  }, []);

  /*
    `muted` og `loop` STYRES AV TILSTAND, ikke av DOM-skriving.

    De sto som faste attributter i markeringen mens `vekslLyd` satte dem
    direkte på noden. Det virker helt til React av en eller annen grunn
    skriver attributtet på nytt — og da står lyden plutselig av igjen uten
    at knappen vet om det. En avspiller som kan komme i utakt med sin egen
    knapp er ikke verdt de to linjene det sparer.
  */
  function vekslLyd() {
    const v = ref.current;
    if (!v) return;
    const pa = !lyd;
    settLyd(pa);
    if (pa) v.currentTime = 0;
    void v.play().catch(() => {});
  }

  return (
    <div
      className={`relative overflow-hidden rounded-flate bg-flate-dempet ${
        forhold === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]"
      } ${className}`}
    >
      {/*
        INGEN <track> HER. Fjernet 02.10.2026, etter at Pål meldte fra fra
        en ekte iPhone: «den tekster fortsatt på mobil».

        Sporet lå her UTEN `default`, i den tro at det dermed var avslått.
        Det stemmer i Chromium — målt der, og det er nettopp derfor feilen
        overlevde. iOS Safari slår på et tekstspor på egen hånd når det
        finnes ett på brukerens språk, uavhengig av `default`. Da ligger
        nettleserens egen tekstboks oppå tekstingen som er BRENT INN i
        bildet, og man får to sett undertekster i samme ramme.

        BEGRUNNELSEN FOR Å HA DET ER IKKE TAPT. Den var at sporet «gjør det
        som blir sagt søkbart». Det er `transcript` i VideoObject-
        markeringen som faktisk gjør den jobben — en VTT-fil er ikke noe
        Google leser som innhold — og transkripsjonen ligger nå i
        markeringen på begge sidene som viser filmen. Kundecasen har den i
        tillegg som utslåbar tekst på siden.

        Den andre begrunnelsen, «lar den som vil slå det på selv», var
        tom: tekstingen er brent inn, så alle har den allerede.

        VTT-fila blir liggende i repoet. Se `undertekster` i caser.ts.
      */}
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover"
        poster={`${sti}-poster.jpg`}
        preload="metadata"
        muted={!lyd}
        loop={!lyd}
        playsInline
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        aria-label={alt}
      >
        {/*
          MP4 FØRST. Snudd 02.10.2026, etter at Pål meldte fra fra en ekte
          iPhone: «bildet henger mens lyden går.»

          WebM lå først, med den begrunnelsen at VP9 er 34 % mindre enn
          H.264 her. Den gevinsten er ikke verdt det den koster: VP9
          dekodes i programvare på de fleste iPhoner, mens H.264 har
          maskinvaredekoder på alle.

          Nettlesere velger den FØRSTE kilden de sier de støtter, så dette
          gir H.264 til alle. WebM blir stående som reserve. Rekkefølgen er
          det eneste verktøyet <source> gir — den kan ikke velges per
          nettleser uten å gjette på brukeragenten.

          `type` ER BEVISST UPRESIST. En eksakt kodekstreng (`avc1.64001f`)
          ville latt en nettleser uten H.264 hoppe over MP4-fila uten å be
          om den først. Men de to filene komponenten brukes med har ulikt
          nivå — `avc1.64001f` og `avc1.640028` — så én streng her ville
          vært feil for den ene. Og i praksis har hver eneste ekte
          nettleser H.264.

          FALLBACKEN ER VERIFISERT, og det skjedde ved et uhell: den
          Chromium testene kjører i er bygget uten H.264. Den ber om
          MP4-fila, avbryter, og faller til WebM — som er nettopp slik
          kjeden skal oppføre seg når den første kilden ikke går.
        */}
        <source src={`${sti}.mp4`} type="video/mp4" />
        <source src={`${sti}.webm`} type="video/webm" />
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
