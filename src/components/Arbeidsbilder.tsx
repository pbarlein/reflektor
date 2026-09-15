import Image from "next/image";
import { Container } from "./Container";
import type { Bilde } from "@/content/arbeid";

/**
 * Stillbilder i to behandlinger.
 *
 * Bakgrunnen for at begge finnes: reel-veggen viser FORMATET, men abonnementet
 * leverer også foto, og fire klipp sier ingenting om mengde. Spørsmålet
 * «hvor mye får vi egentlig?» besvares ikke av kvalitet alene.
 *
 * YTELSE. Ytelse er prosjektets sterkest dokumenterte funn, og 20 bilder er
 * mye, så det styrer valgene her.
 *
 * `next/image` med `fill`, ikke <img>. Den leverer AVIF og WebP der
 * nettleseren støtter det, og lager responsive størrelser fra én kildefil.
 * Kildene er allerede nedskalert fra 4K, så optimaliseringen jobber med
 * 4 MB i stedet for 250.
 *
 * `fill` krever en posisjonert forelder med reservert høyde. Den har vi
 * uansett: `aspect-ratio` på cellen hindrer CLS, som er den dyre feilen når
 * mange bilder lastes inn under scrolling.
 *
 * Lazy er standard i next/image, så det står ikke eksplisitt. Ingen av disse
 * bildene er LCP-kandidater — de ligger alle godt under folden.
 */

/** Redaksjonelt nett: ujevn rytme, store flater, kvalitet er poenget. */
export function Arbeidsnett({ bilder }: { bilder: Bilde[] }) {
  return (
    <Container>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-12 sm:auto-rows-[5.5rem] sm:gap-4">
        {bilder.map((b) => (
          <figure
            key={b.fil}
            className={`relative overflow-hidden rounded-flate bg-flate-dempet ${b.celle ?? ""}`}
          >
            <Image
              src={`/arbeid/${b.fil}-1600.jpg`}
              alt={b.alt}
              fill
              sizes="(max-width: 640px) 50vw, 40vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
    </Container>
  );
}

/**
 * Tett bånd: like celler, full bredde, mengde er poenget.
 *
 * Her er likheten meningen. Et variert nett ville sagt «utvalgte høydepunkter»
 * — et jevnt, tett nett sier «dette er en vanlig måned». Det er den påstanden
 * abonnementet faktisk gjør.
 *
 * Bryter containeren med vilje. Et bånd som stopper ved tekstbredden leser som
 * en illustrasjon; ett som går ut av skjermen leser som en strøm.
 */
export function Arbeidsband({ bilder }: { bilder: Bilde[] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-2">
      {bilder.map((b) => (
        <figure
          key={b.fil}
          className="relative aspect-[4/5] overflow-hidden bg-flate-dempet"
        >
          <Image
            src={`/arbeid/${b.fil}-640.jpg`}
            alt={b.alt}
            fill
            sizes="(max-width: 640px) 33vw, 17vw"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
