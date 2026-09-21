import Image from "next/image";

import { Klipp } from "@/components/Klipp";
import type { Medie } from "@/content/rubrikktype";

/**
 * Bildet eller klippet i et kort.
 *
 * `fill` og ikke width/height: filene under /medier kopieres inn ved bygg og
 * finnes ikke som statiske importer, så Next kan ikke lese dimensjonene selv.
 * Rammen bestemmer formatet uansett — kortene er et rutenett, ikke en
 * bildeserie.
 *
 * `sizes` ER PÅKREVD sammen med `fill`, og verdien er ikke en gjetning: den
 * speiler rutenettet i Rubrikkortliste — én kolonne under sm, to til og med
 * lg, tre over. Uten den laster Next full bredde til hvert eneste kort.
 */
const SIZES = "(min-width: 1024px) 28rem, (min-width: 640px) 45vw, 92vw";

export function Medieflate({
  medie,
  prioritert = false,
}: {
  medie: Medie;
  /**
   * Kun for kort over folden. `priority` på alle kortene ville bedt
   * nettleseren om å hente tjue bilder samtidig, og da er ingen av dem
   * prioritert.
   */
  prioritert?: boolean;
}) {
  const sti = `/medier/${medie.fil}`;

  if (medie.type === "video") {
    return <Klipp sti={sti} alt={medie.alt} />;
  }

  return (
    <Image
      src={`${sti}.jpg`}
      alt={medie.alt}
      fill
      sizes={SIZES}
      priority={prioritert}
      className="object-cover"
    />
  );
}
