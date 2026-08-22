import Image from "next/image";

/**
 * Reflektor-logoen.
 *
 * Kilde: Reflektor_Logo_by_Holum_Studio, vektorisert fra .ai-filen.
 * Manualen tillater sort på lys bakgrunn, hvit på mørk, eller merkevarefarger.
 * Logoen skal aldri strekkes eller manipuleres.
 *
 * Hvorfor ordmerket settes i Poppins framfor å hentes fra vektorfilen:
 * de offisielle lockupene inneholder taglinen «foto & video på månedlig
 * basis», som er den gamle posisjoneringen som produksjonsselskap. Dagens
 * header bruker ikon + ordmerke uten tagline. I vektorfilen overlapper
 * ikonet og taglinen vertikalt, så de kan ikke skilles ved beskjæring.
 * Poppins er merkevarefonten, så satt ordmerke er tro mot profilen – og
 * skalerer skarpt i alle størrelser.
 *
 * De komplette lockupene ligger fortsatt i public/bilder/logo/ til bruk der
 * taglinen hører hjemme (trykk, presentasjoner, sosiale profiler).
 */
type Props = {
  /** «merke» = ikon + ordmerke. «ikon» = kun R-ikonet. */
  variant?: "merke" | "ikon";
  pa?: "lys" | "mork";
  className?: string;
};

export function Logo({ variant = "merke", pa = "lys", className }: Props) {
  const ikon = (
    <Image
      src="/bilder/logo/reflektor-ikon.svg"
      alt=""
      width={555}
      height={665}
      className="h-full w-auto"
      priority
    />
  );

  if (variant === "ikon") {
    return (
      <span className={className} role="img" aria-label="Reflektor">
        {ikon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      role="img"
      aria-label="Reflektor"
    >
      {ikon}
      <span
        className={`text-[1.6em] font-medium lowercase tracking-tight ${
          pa === "mork" ? "text-blekk-invers" : "text-blekk"
        }`}
      >
        reflektor
      </span>
    </span>
  );
}
