"use client";

import { useEffect, useRef } from "react";

/**
 * Ett klipp i et kort.
 *
 * HVER ATTRIBUTT HAR EN GRUNN — samme sett som på salgssiden:
 *
 * - `muted`: autospill med lyd er blokkert i alle nettlesere. Uten den
 *   spiller ingenting av dette.
 * - `playsInline`: iOS-kravet. Uten den overtar Safari og spiller i
 *   fullskjerm ved autospill.
 * - `loop`: klippene er 6–8 sekunder og skal lese som bevegelse i en flate,
 *   ikke som en film med slutt.
 * - `aria-hidden` og `tabIndex={-1}`: informasjonen ligger i teksten rundt.
 *   Et dekorativt klipp i tabrekkefølgen er en stopp uten innhold for den
 *   som bruker tastatur.
 * - `preload="none"`: det ligger opptil et par dusin kort på forsiden. Uten
 *   den ville hver eneste av dem hentet metadata ved sidelast.
 *
 * ABSOLUTT POSISJONERT. Et <video> uten width/height har en egen naturlig
 * størrelse fra fila. I normalflyt blir `height: 100%` mot en forelder med
 * auto høyde behandlet som auto — og da bestemmer VIDEOEN hvor høyt kortet
 * blir. Rammen rundt må ha `relative` og en egen høyde eller et format.
 */
export function Klipp({ sti, alt }: { sti: string; alt: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /*
     * Ingen bevegelse betyr ingen bevegelse. Da står plakatbildet, som er
     * hentet fra klippet selv — brukeren mister motivet, ikke innholdet.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /*
     * TERSKELEN ER NULL, OG ROTEN ER KRYMPET INN. Ikke «hvor stor andel av
     * elementet er synlig» — den andelen kan et element aldri nå hvis det
     * er høyere enn vinduet eller klippes i bredden — men «overlapper
     * elementet den delen av skjermen brukeren ser på».
     *
     * Dette er rettelsen fra hovedprosjektet, dokumentert i
     * src/lib/videosynlighet.ts der: med terskel 0,6 spilte klipp som så
     * vidt var inne fra siden, aldri.
     */
    const iakt = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          // play() avvises når fanen er skjult og i strømsparing på iOS.
          // Begge deler er normalt, ikke noe vi kan gjøre med.
          if (p.isIntersecting) void el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0, rootMargin: "-8% 0px -8% 0px" },
    );
    iakt.observe(el);
    return () => iakt.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      poster={`${sti}.jpg`}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      controlsList="nodownload noremoteplayback nofullscreen"
    >
      <source src={`${sti}.mp4`} type="video/mp4" />
      {/* Alt-teksten står i et skjult element og ikke som attributt: <video>
          har ingen alt. Den leses av skjermleseren gjennom kortets egen
          tekst, men finnes her for det tilfellet at klippet er alt som
          bærer meningen. */}
      <span className="sr-only">{alt}</span>
    </video>
  );
}
