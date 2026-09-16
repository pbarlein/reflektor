"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "./Container";
import type { Celle, Medie, Veggcelle } from "@/content/arbeid";

/**
 * Spiller bare klippene som er i synsfeltet, og bare hvis brukeren tåler
 * bevegelse. Refene er nøklet på filnavn, ikke på en teller: en teller ville
 * måttet muteres under render, og det er ikke lov.
 *
 * Siden har tretten klipp til sammen. Uten denne pausingen ville alle spilt
 * samtidig etter første scroll — målbar batteri- og dekoderkostnad, og ingen
 * ser mer enn én seksjon om gangen uansett.
 */
function useSynligeKlipp(terskel: number) {
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const iakt = new IntersectionObserver(
      (poster) => {
        for (const p of poster) {
          const v = p.target as HTMLVideoElement;
          // play() avvises hvis fanen er skjult. Det er ikke en feil.
          if (p.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: terskel },
    );
    for (const v of Object.values(refs.current)) if (v) iakt.observe(v);
    return () => iakt.disconnect();
  }, [terskel]);

  // Returnerer en festefunksjon, ikke selve refen. React-kompilatoren tillater
  // ikke at en ref som er sendt inn som prop, muteres i mottakeren.
  return (fil: string) => (el: HTMLVideoElement | null) => {
    refs.current[fil] = el;
  };
}

/**
 * Klippene er dekorative. Informasjonen ligger i bildene rundt og i teksten,
 * så videoen er `aria-hidden` og utenfor tabrekkefølgen. `preload="none"`
 * betyr at ingenting hentes før klippet er i synsfeltet; fram til da står
 * plakatbildet.
 */
function Klipp({
  medie,
  sti,
  festRef,
}: {
  medie: Medie;
  sti: string;
  festRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <video
      ref={festRef}
      /*
        ABSOLUTT POSISJONERT, og det er ikke kosmetikk. Et `<video>` uten
        width/height har en egen naturlig størrelse fra fila — 640x1136 for
        et stående klipp. I normalflyt blir `height: 100%` mot en forelder
        med auto høyde behandlet som auto, og da bestemmer VIDEOEN hvor høy
        rammen blir.

        Det kostet en runde i prisseksjonen: teksten skulle bestemme høyden
        og klippet fylle den, men klippet dyttet raden til 540 px — nøyaktig
        9:16 av spaltebredden — og teksten fikk 68 px dødplass under seg.

        Absolutt posisjonering gjør at klippet ikke bidrar med høyde noe
        sted. Alle tre bruksstedene har `relative` på rammen, og der rammen
        har et fast format er dette identisk med `size-full` i flyt.
      */
      className="absolute inset-0 size-full object-cover"
      poster={`${sti}/${medie.fil}.jpg`}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      controlsList="nodownload noremoteplayback nofullscreen"
    >
      <source src={`${sti}/${medie.fil}.mp4`} type="video/mp4" />
    </video>
  );
}

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
 * - Bare klipp som er synlige spiller. Se useSynligeKlipp.
 * - Høyden er reservert av containeren, så ingen CLS.
 * - `prefers-reduced-motion` slår av autospill helt. Da står posterbildet.
 */
export function Arbeidskolonner({ kolonner }: { kolonner: Celle[][] }) {
  const fest = useSynligeKlipp(0.3);

  const celle = (c: Celle, mobilFormat: string) => (
    <figure
      key={c.fil}
      className={`relative overflow-hidden rounded-flate bg-flate-dempet ${mobilFormat} lg:aspect-auto ${
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
        <Klipp medie={c} sti="/reels" festRef={fest(c.fil)} />
      )}
    </figure>
  );

  return (
    <Container>
      <div className="grid grid-cols-2 gap-3 lg:h-[60.5rem] lg:grid-cols-4 lg:gap-4">
        {kolonner.map((kol, k) => (
          <div key={k} className="contents lg:flex lg:h-full lg:flex-col lg:gap-4">
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
 * TO OPPFØRSLER, IKKE ÉN RESPONSIV. Under lg er raden et vanlig vannrett
 * rullefelt: fingeren gjør jobben, alt er nåbart, ingen animasjon. Fra lg
 * er den skjult overflow med drift. Grunnen er at drift OG fingerrulling i
 * samme felt gir to ting som flytter på innholdet samtidig, og da vet man
 * aldri hvem som styrer.
 *
 * `overflow-hidden` fra lg er nødvendig, ikke valgfritt: uten den ville en
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
 * DET SKJULTE ER IKKE BORTE. Fra lg ser man rundt halve raden om gangen, og
 * driften avdekker resten mens man ruller. Alle cellene ligger i HTML-en med
 * alt-tekst, så søk og språkmodeller får hele veggen uansett. Prisen er at
 * en museløs desktopbruker ikke kan dra i raden — cellene er dekorative og
 * uten lenker, så det koster ingen handling.
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
  const fest = useSynligeKlipp(0.15);

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
          className="
            overflow-x-auto
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:overflow-hidden
          "
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
                  <Klipp medie={c} sti="/arbeid" festRef={fest(c.fil)} />
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
  const fest = useSynligeKlipp(0.3);
  return (
    <figure className={className}>
      <Klipp medie={medie} sti={sti} festRef={fest(medie.fil)} />
    </figure>
  );
}
