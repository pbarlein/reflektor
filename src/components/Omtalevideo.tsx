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
        /*
          `play()` BLIR STÅENDE HER, og ikke bare i effekten under. Den som
          ruller forbi og tilbake igjen skal få filmen i gang på nytt, og
          `lastet` er allerede `true` da — effekten kjører ikke flere
          ganger. Kallet er ufarlig før kildene finnes: løftet avvises, og
          avvisningen fanges.
        */
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
    REDNINGSPLANKE NÅR KILDENE KOM FOR SENT. Lagt til 02.10.2026.

    Et <video> uten <source> kan rekke å ende i `NETWORK_NO_SOURCE` — «jeg
    har prøvd alt jeg har, og fant ingenting». Dukker kildene opp etterpå,
    starter ikke nettleseren utvelgelsen på nytt av seg selv.

    BARE DEN TILSTANDEN SKAL UTLØSE `load()`. Første forsøk hadde også
    `readyState === 0` i betingelsen, og det var feil på en måte som er
    verdt å huske: `readyState` ER 0 mens den første kilden holder på å
    lastes. Effekten rakk dermed å kalle `load()` midt i en normal
    innlasting, og målt i nettleseren ga det `ERR_ABORTED` på MP4-fila og
    fall videre til WebM — altså presis motsatt av det rekkefølgen over
    skal oppnå.
  */
  useEffect(() => {
    if (!lastet) return;
    const v = ref.current;
    if (!v) return;
    if (v.networkState !== v.NETWORK_NO_SOURCE) return;
    v.load();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void v.play().catch(() => {});
    }
  }, [lastet]);

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
        /*
          `transform-gpu` gir videoen sitt eget komposisjonslag.

          Lagt til 02.10.2026 sammen med fryse-rettelsene over. Omtalen
          ligger nå inne i et panel med `overflow-hidden` og avrundede
          hjørner, og noen piksler unna kort med `backdrop-filter`. Den
          kombinasjonen er en kjent kilde til at WebKit slutter å tegne
          videoflaten mens avspillingen fortsetter — altså «bildet henger
          mens lyden går». Et eget lag tar videoen ut av den delte
          malingen.
        */
        className="absolute inset-0 size-full transform-gpu object-cover"
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
            {/*
              MP4 FØRST. Snudd 02.10.2026, etter at Pål meldte fra fra en
              ekte iPhone: «bildet henger mens lyden går.»

              WebM lå først, med den begrunnelsen at VP9 er 34 % mindre enn
              H.264 her. Den gevinsten er ikke verdt det den koster: VP9
              dekodes i programvare på de fleste iPhoner, mens H.264 har
              maskinvaredekoder på alle. Et bilde som fryser mens lyden
              løper videre er nøyaktig det en programvaredekoder som ikke
              rekker over sanntid ser ut som — og denne videoen er det
              sterkeste beviset på forsiden.

              Nettlesere velger den FØRSTE kilden de sier de støtter, så
              dette gir H.264 til alle. WebM blir stående som reserve.
              Rekkefølgen er det eneste verktøyet <source> gir — den kan
              ikke velges per nettleser uten å gjette på brukeragenten.

              `type` ER BEVISST UPRESIST. En eksakt kodekstreng
              (`avc1.64001f`) ville latt en nettleser uten H.264 hoppe over
              MP4-fila uten å be om den først. Men de to filene komponenten
              brukes med har ulikt nivå — `avc1.64001f` og `avc1.640028` —
              så én streng her ville vært feil for den ene. Og i praksis
              har hver eneste ekte nettleser H.264.

              FALLBACKEN ER VERIFISERT, og det skjedde ved et uhell: den
              Chromium testene kjører i er bygget uten H.264. Den ber om
              MP4-fila, avbryter, og faller til WebM — som er nettopp slik
              kjeden skal oppføre seg når den første kilden ikke går.
            */}
            <source src={`${sti}.mp4`} type="video/mp4" />
            <source src={`${sti}.webm`} type="video/webm" />
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
