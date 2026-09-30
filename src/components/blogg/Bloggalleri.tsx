import Image from "next/image";

import type { Bloggmedie } from "@/content/artikler";

/**
 * Et galleri fra ett oppdrag: ett hovedbilde og tre til fem miniatyrer.
 *
 * SERVERKOMPONENT, i motsetning til `Bloggmedier`. Den måtte være klient
 * fordi filmene trenger en IntersectionObserver for å starte selv. Her er
 * alt stillbilder, og da er det ingenting å holde styr på i nettleseren.
 *
 * HVORFOR IKKE BARE FLERE MEDIEBLOKKER. En medieblokk krever samme
 * sideforhold på alle elementene, fordi to rammer med ulik høyde ved siden
 * av hverandre gir skjev underkant og bildetekster på hver sin linje. Et
 * ekte galleri fra et arrangement har blandet format — i Retail24-serien er
 * fire liggende og ett stående — og det kravet kan derfor ikke gjelde her.
 *
 * MINIATYRENE ER KVADRATISKE. Det er den eneste rammen som tar både
 * liggende og stående uten å skjære bort motivet i det ene eller strekke
 * det andre. Hovedbildet beholder sitt eget format.
 *
 * TO I BREDDEN PÅ TELEFON, fire fra `sm`. Fire kvadrater på en 390 px
 * skjerm blir 80 px hver, og da ser man ikke hva de viser.
 */

const RAMME: Record<Bloggmedie["format"], string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "9/16": "aspect-[9/16]",
};

export function Bloggalleri({
  elementer,
  bildetekst,
}: {
  elementer: Bloggmedie[];
  bildetekst?: string;
}) {
  const [hoved, ...rest] = elementer;

  return (
    <figure className="mt-10">
      <div
        className={`relative overflow-hidden rounded-medie bg-flate-dempet ${RAMME[hoved.format]}`}
      >
        <Image
          src={`${hoved.sti}.jpg`}
          alt={hoved.alt}
          fill
          sizes="(min-width: 768px) 42rem, 100vw"
          className="object-cover"
          style={hoved.fokus ? { objectPosition: hoved.fokus } : undefined}
        />
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-4 sm:gap-4">
        {rest.map((m) => (
          <li
            key={m.sti}
            className="relative aspect-square overflow-hidden rounded-medie bg-flate-dempet"
          >
            <Image
              src={`${m.sti}.jpg`}
              alt={m.alt}
              fill
              sizes="(min-width: 640px) 11rem, 45vw"
              className="object-cover"
              style={m.fokus ? { objectPosition: m.fokus } : undefined}
            />
          </li>
        ))}
      </ul>
      {bildetekst && (
        <figcaption className="mt-3 text-sm text-blekk-dempet">
          {bildetekst}
        </figcaption>
      )}
    </figure>
  );
}
