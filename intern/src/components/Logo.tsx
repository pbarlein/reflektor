import Image from "next/image";

/**
 * Reflektor-merket.
 *
 * IKONET, IKKE DET KOMPLETTE LOCKUPET — og det er et innholdsvalg, ikke et
 * designvalg.
 *
 * `reflektor-logo.svg` og `reflektor-logo-horisontal.svg` inneholder begge
 * taglinen «foto & video på månedlig basis». Det er den GAMLE
 * posisjoneringen, fra tiden som rent produksjonsselskap. Dagens er
 * «strategi, innhold og publisering til fast pris». Å sette den gamle
 * taglinen øverst på hver side i et internverktøy ville festet feil
 * selvbilde hos folkene som skal selge det nye.
 *
 * I vektorfilen overlapper ikonet og taglinen vertikalt, så de kan ikke
 * skilles ved beskjæring — og manualen sier at logoen aldri skal
 * manipuleres. Ikonet alene er derfor den eneste varianten som er både
 * ekte og riktig.
 *
 * Det er også ren SVG, så det er skarpt i alle størrelser og koster
 * ingenting.
 */
export function Logo({ klasse = "h-8" }: { klasse?: string }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/merke/reflektor-ikon.svg"
        alt="Reflektor"
        width={555}
        height={665}
        className={`${klasse} w-auto`}
        priority
      />
      {/*
        «Internt» er en etikett, ikke en del av merket. Den står i
        merkevarefonten med versaler og åpen sporing — samme oppskrift som
        alle andre etiketter i huben, slik at det er tydelig at dette er
        et tillegg og ikke en logotekst.
      */}
      <span className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
        Internt
      </span>
    </span>
  );
}
