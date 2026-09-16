"use client";

import Image from "next/image";

import { Container } from "./Container";
import { Klipp } from "./Klipp";
import type { Celle, Medie, Veggcelle } from "@/content/arbeid";
import { useSpillNarSynlig } from "@/lib/videosynlighet";

/**
 * Arbeidsseksjonen: foto og stående video om hverandre, i fire like høye
 * kolonner.
 *
 * Se src/content/arbeid.ts for hvorfor blokken er rektangulær, hvorfor
 * enhetene er som de er, og hvorfor klippene ligger i de høye cellene.
 *
 * TO LAYOUTER, ikke én responsiv. Under lg er det et vanlig tokolonners
 * rutenett med faste formater per celle — fire kolonner à 288 px finnes ikke
 * på en telefon. Fra lg overtar flex-stablene med fast høyde, og det er DER
 * blokken blir rektangulær. Å presse den ene løsningen ned på mobil ville
 * gitt celler på under 90 px.
 *
 * YTELSE. Ytelse er prosjektets sterkest dokumenterte funn, og seksjonen har
 * både bilder og fire klipp:
 *
 * - `next/image` med `fill` gir AVIF og responsive størrelser fra én kildefil.
 * - Video har `preload="none"` og posterbilde. Ingenting lastes før klippet
 *   er i synsfeltet.
 * - Bare klipp som er synlige spiller. Se useSpillNarSynlig i lib/.
 * - Høyden er reservert av containeren, så ingen CLS.
 * - `prefers-reduced-motion` slår av autospill helt. Da står posterbildet.
 */
export function Arbeidskolonner({ kolonner }: { kolonner: Celle[][] }) {
  const fest = useSpillNarSynlig();

  const celle = (c: Celle, mobilFormat: string) => (
    <figure
      key={c.fil}
      /*
        `break-inside-avoid` og `mb-3` hører til spaltemodusen under lg — se
        rutenettet nedenfor. De nullstilles fra lg, der cellene igjen er
        flex-barn med egen høyde.
      */
      className={`relative mb-3 break-inside-avoid overflow-hidden rounded-flate bg-flate-dempet ${mobilFormat} lg:mb-0 lg:aspect-auto ${
        c.enheter === 2 ? "lg:flex-[2]" : "lg:flex-1"
      }`}
    >
      {c.type === "foto" ? (
        <Image
          src={`/arbeid/${c.fil}-1600.jpg`}
          alt={c.alt}
          fill
          sizes="(max-width: 1024px) 50vw, 24vw"
          className="object-cover"
        />
      ) : (
        <Klipp sti={`/reels/${c.fil}`} festRef={fest(c.fil)} />
      )}
    </figure>
  );

  return (
    <Container>
      {/*
        TO LAYOUTMOTORER, fordi oppgaven er to forskjellige.

        FRA lg: fire flex-spalter med fast totalhøyde. Cellene får 1 eller 2
        enheter av høyden, og blokken blir rektangulær — komposisjonen er
        kuratert, se arbeid.ts.

        UNDER lg: CSS-SPALTER, ikke rutenett. Dette er en RETTELSE. Her sto
        `grid-cols-2` med celler i 9:16 og 4:5 om hverandre. Et rutenett gir
        hver rad høyden til den høyeste cellen i raden, så en 4:5-celle ved
        siden av en 9:16 etterlot rundt 280 px tomt under seg. Det var det
        Pål så som at «grids blir litt off».

        `columns-2` pakker i stedet cellene nedover og balanserer spaltene
        selv. Et rutenett KAN ikke gjøre det uten masonry, som ennå ikke er
        i nettleserne.

        TRE SPALTER FRA sm. Med to spalter ble blokken 3 233 px på en iPad
        Mini — bildene blir bredere, men antallet er det samme, så høyden
        løper. Tre spalter holder den på samme høyde som på telefon.

        Leserekkefølgen blir spalte for spalte i stedet for rad for rad. For
        et kuratert galleri uten bildetekster er det uten betydning — det
        finnes ingen rekkefølge å miste.
      */}
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:grid lg:h-[60.5rem] lg:grid-cols-4 lg:gap-4 lg:[column-count:auto]">
        {kolonner.map((kol, k) => (
          <div
            key={k}
            className="contents lg:flex lg:h-full lg:flex-col lg:gap-4"
          >
            {kol.map((c) =>
              celle(c, c.enheter === 2 ? "aspect-[9/16]" : "aspect-[4/5]"),
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}

/**
 * ARBEIDSVEGGEN: to fullbreddsrader som driver hver sin vei mens du ruller.
 *
 * Se src/content/arbeid.ts for hvorfor cellene har fast høyde og varierende
 * bredde, og globals.css for hvorfor bevegelsen henger på rulleposisjonen og
 * ikke på en tidtaker.
 *
 * ÉN OPPFØRSEL PÅ ALLE BREDDER: skjult overflow med scroll-drevet drift.
 *
 * Det har vært tre varianter, og de to første var begge feil.
 *
 * FØRST: vannrett rullefelt under lg, drift fra lg. Begrunnelsen var at
 * drift og fingerrulling i samme felt gir to ting som flytter innholdet
 * samtidig. Riktig observasjon — men konsekvensen var at veggen sto helt
 * stille på telefon, og siden den er ni celler bred, nådde fem av klippene
 * intersectionRatio 0,00 gjennom en hel gjennomrulling. De lastet aldri.
 * Innholdet var «nåbart» bare for den som gjettet at raden kunne dras i.
 *
 * SÅ: drift lagt til på mobil, men rullefeltet beholdt. Da hadde jeg
 * innført nøyaktig konflikten begrunnelsen over advarte mot, og axe fanget
 * en annen følge av det: et rullefelt uten fokuserbart innhold kan ikke nås
 * med tastatur i det hele tatt.
 *
 * NÅ: `overflow-hidden` overalt. Driften avdekker raden mens man ruller
 * siden, på telefon som på desktop. Ingen konkurranse om hvem som flytter
 * innholdet, ingen utilgjengelig rulleflate, og på telefon forsvinner
 * dessuten faren for at en vannrett dragning stjeler den loddrette
 * rullingen.
 *
 * `overflow-hidden` er uansett nødvendig, ikke valgfritt: uten den ville en
 * rad på 2 900 px laget vannrett rulling på hele dokumentet. Den har også en
 * bieffekt som kostet en feilsøking: `overflow-x: hidden` med `overflow-y:
 * visible` beregnes til `overflow-y: auto`, så wrapperen blir en egen
 * rullecontainer. Derfor kan ikke radene bruke `view()` direkte — se
 * globals.css.

 * RADHØYDEN ER LAVERE PÅ MOBIL ENN FORHOLDET SKULLE TILSI. Bredden følger
 * av høyden, så en 16:9-celle på 208 px høyde blir 370 px bred — nesten hele
 * en telefonskjerm, og da ser man ett motiv om gangen i stedet for en vegg.
 * 176 px gir 313 px, og to og en halv celle i blikket.
 *
 * DET SKJULTE ER IKKE BORTE. Man ser rundt halve raden om gangen, og driften
 * avdekker resten mens man ruller. Alle cellene ligger i HTML-en med
 * alt-tekst, så søk og språkmodeller får hele veggen uansett. Prisen er at
 * ingen kan dra i raden — cellene er dekorative og uten lenker, så det
 * koster ingen handling.
 *
 * DEKODERBUDSJETTET ER REGNET, IKKE GJETTET. Syv klipp kan spille samtidig
 * her. Fem stående à 440x782 og to liggende à 1024x576 er til sammen
 * 2,9 millioner piksler i kildeoppløsning — men de vises i celler på under
 * 400 px høyde, og det er dekoderarbeidet som teller. Ett 1080p-klipp er
 * 2,07 millioner piksler per ramme; disse syv til sammen ligger i samme
 * størrelsesorden, med maskinvaredekoding på alt. Derfor ingen kunstig
 * grense på hvor mange som får spille: den ville bare gitt frosne celler
 * som ser ut som en feil.
 */
export function Arbeidsvegg({ rader }: { rader: Veggcelle[][] }) {
  const fest = useSpillNarSynlig();

  const format: Record<Veggcelle["format"], string> = {
    "9/16": "aspect-[9/16]",
    "3/4": "aspect-[3/4]",
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    "16/9": "aspect-[16/9]",
  };

  return (
    <div className="vegg-spor flex flex-col gap-2 lg:gap-4">
      {rader.map((rad, r) => (
        <div
          key={r}
          /*
            INGEN MARGIN OG INGEN PADDING HER. Første versjon hadde
            `-mx-5 px-5`, kopiert fra reel-veggen — men den ligger inne i en
            Container, og denne gjør ikke det. Seksjonen er allerede full
            bredde, så de negative margene dyttet raden 20 px utenfor
            vinduet og ga vannrett rulling på HELE dokumentet, målt på
            390 og 768 px. Full bredde betyr at cellene starter på kanten.
          */
          className="overflow-hidden"
        >
          <ul
            className={`
              flex h-[11rem] w-max gap-2 sm:h-[15rem] lg:h-[21rem] lg:gap-4
              2xl:h-[24rem]
              ${r % 2 === 0 ? "vegg-drift-venstre" : "vegg-drift-hoyre"}
            `}
          >
            {rad.map((c) => (
              <li
                key={c.fil}
                className={`relative h-full shrink-0 overflow-hidden rounded-medie bg-flate-dempet ${format[c.format]}`}
              >
                {c.type === "foto" ? (
                  <Image
                    src={`/arbeid/${c.fil}-vegg.jpg`}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <Klipp sti={`/arbeid/${c.fil}`} festRef={fest(c.fil)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Ett enkeltklipp med samme regler som resten: plakat, ingen forhåndslasting,
 * spiller bare når det er i synsfeltet.
 *
 * Finnes fordi page.tsx er en serverkomponent og ikke kan holde en ref eller
 * en IntersectionObserver. Heroklippet slipper unna uten dette — det er over
 * folden og spiller fra første sekund — men et klipp lenger nede må vente på
 * at noen ser det.
 */
export function Enkeltklipp({
  medie,
  sti,
  className,
}: {
  medie: Medie;
  sti: string;
  className?: string;
}) {
  const fest = useSpillNarSynlig();
  return (
    <figure className={className}>
      <Klipp sti={`${sti}/${medie.fil}`} festRef={fest(medie.fil)} />
    </figure>
  );
}
