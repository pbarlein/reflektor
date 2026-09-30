"use client";

import Image from "next/image";

import { Klipp } from "@/components/Klipp";
import type { Arbeidsmedie, Referansefilm } from "@/content/tjenester";
import { useSpillNarSynlig } from "@/lib/videosynlighet";

/**
 * Mediene på tjenestesidene, skilt ut som klientkomponent 27.09.2026.
 *
 * HVORFOR DE MÅTTE UT AV LAYOUTEN. `Tjenestelayout` er en serverkomponent.
 * Den kan ikke holde en ref eller en IntersectionObserver, og klippene ble
 * derfor rendret uten `festRef`. Et `Klipp` uten `festRef` og uten `ivrig`
 * får verken autospill eller observer: det laster aldri, og står for alltid
 * på plakatbildet.
 *
 * Resultatet var at fire videoer så ut som fire stillbilder. Pål meldte det
 * to ganger — «du må åpenbart vise videoer og ikke bilder» — og han hadde
 * rett begge gangene, også etter at jeg hadde byttet alle fire til film.
 * Målt i nettleseren: `autoplay:false paused:true readyState:0`.
 *
 * Feilen fantes allerede i den gamle rullende raden, så den er eldre enn
 * denne omleggingen. Den var bare lettere å overse da halvparten av flatene
 * var stillbilder uansett.
 *
 * `Enkeltklipp` i Arbeidsbilder.tsx finnes av nøyaktig samme grunn. Denne
 * gjør det samme for et rutenett og for én film i bredformat.
 */

/** Fire medier i stående rutenett. Foto og film om hverandre. */
export function Arbeidsrutenett({ medier }: { medier: Arbeidsmedie[] }) {
  const fest = useSpillNarSynlig();

  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {medier.map((m) => (
        <li
          key={m.sti}
          /*
            FORMATET LESES AV FØRSTE MEDIE, ikke av hvert enkelt. Blandede
            formater i samme rutenett gir ujevn underkant — samme feil som
            arbeidsseksjonen på forsiden hadde, og grunnen til at denne
            komponenten låste 9:16 til å begynne med. Den låsingen holdt bare
            så lenge alt innholdet var stående klipp.
          */
          className={`relative overflow-hidden rounded-medie bg-flate-dempet ${
            medier[0].format === "4/5" ? "aspect-[4/5]" : "aspect-[9/16]"
          }`}
        >
          {m.type === "foto" ? (
            <Image
              src={m.sti}
              alt={m.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 24vw"
              className="object-cover"
            />
          ) : (
            <Klipp sti={m.sti} festRef={fest(m.sti)} />
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Referansefilmene: hele filmer, ikke utdrag.
 *
 * BESTILT AV PÅL 28.09.2026: «la videoene gå i sin helhet. blir en dårlig
 * referanse på siden om man bare ser en liten del.» Han har rett, og det
 * gjelder ikke bare lengden — det gjelder hva slags avspiller de trenger.
 *
 * TO OPPFØRSLER, OG DE LØSER TO FORSKJELLIGE OPPGAVER:
 *
 * `lyd: false` (standard) gir `Klipp`: dempet, i løkke, uten kontroller, og
 * den starter selv når den kommer i synsfeltet. Riktig for en film som leses
 * som bevegelse — en reklamefilm på femten sekunder uten replikk sier det
 * den skal si uten lyd. Alle syv filmene på /kjeder er av denne typen etter
 * Påls beskjed 29.09.2026.
 *
 * MERK AT AUTOSPILL OG LYD UTELUKKER HVERANDRE. Nettleserne blokkerer
 * autospill med lyd, så `Klipp` setter `muted`. Skal en film høres, må noen
 * trykke på den — og da er det `lyd: true` under.
 *
 * `lyd: true` gir en ekte avspiller: kontroller, lyd, ingen løkke, ingen
 * autospill. Filmene det gjelder er intervjuer og profilfilmer på 20–40
 * sekunder der hele poenget er det som blir SAGT. Dempet autospill i løkke
 * ville vist et ansikt som beveger leppene og aldri kommer til poenget —
 * verre enn ingen film.
 *
 * `preload="none"` og plakatbilde på begge. Ingenting lastes før noen
 * trykker play, og det er også derfor autospill ikke gir mening her: fire
 * megabyte skal ikke lastes ned for noen som ruller forbi.
 */
export function Referansefilmer({
  filmer,
  rad = false,
}: {
  filmer: Referansefilm[];
  rad?: boolean;
}) {
  const fest = useSpillNarSynlig();

  const ramme: Record<Referansefilm["format"], string> = {
    "16/9": "aspect-video",
    "4/5": "aspect-[4/5]",
    "9/16": "aspect-[9/16]",
  };

  /*
    SPALTEBREDDENE ER SIDEFORHOLDENE, REGNET UT — ikke skrevet.

    Her sto `sm:grid-cols-[1.778fr_0.8fr_0.5625fr]` som en fast klasse. De
    tre tallene er 16:9, 4:5 og 9:16, og de er riktige for formatraden på
    /kjeder, som har nøyaktig de tre filmene i nøyaktig den rekkefølgen.

    Men raden brukes av ENHVER seksjon med mer enn én film, og da holdt den
    ikke: to stående bak-kulissene-filmer på /reels-produksjon fikk 1,778fr
    og 0,8fr — den første ble mer enn dobbelt så bred som den andre, av to
    filmer med samme sideforhold. Funnet i nettleseren 30.09.2026.

    Nå regnes malen ut av filmenes egne formater. For /kjeder gir det
    nøyaktig de samme tre tallene som sto der før, så den raden er uendret.
  */
  const forhold: Record<Referansefilm["format"], number> = {
    "16/9": 1.778,
    "4/5": 0.8,
    "9/16": 0.5625,
  };
  const blandedeFormater = new Set(filmer.map((f) => f.format)).size > 1;

  const film = (f: Referansefilm) => (
    <figure
      key={f.sti}
      className={rad ? "flex flex-col" : f.format !== "16/9" ? "max-w-sm" : ""}
    >
      <div
        /*
          I EN BLANDET RAD PÅ TELEFON STYRES RAMMENE AV HØYDEN, ikke av
          bredden.

          Der ligger to stående filmer med ULIKT format ved siden av
          hverandre i to like brede spalter. Med breddestyrte rammer blir
          4:5-en 25 % lavere enn 9:16-en, og bildeteksten «4:5» henger i løse
          lufta ved siden av et bilde som fortsetter nedenfor den. En fast
          høyde gir dem samme underkant og bildetekstene samme linje.

          13 rem er valgt av bredden, ikke av høyden: 9:16 blir 117 px og
          4:5 blir 166 px, og begge får plass i en spalte på 169 px på en
          390 px skjerm.

          HAR ALLE FILMENE SAMME FORMAT, skal de derimot fylle spalten sin.
          Da er høydene like uansett, og den faste høyden ville bare gjort
          dem unødvendig små.

          Fra sm overtar spaltebreddene igjen — se kommentaren over.
        */
        className={`relative overflow-hidden rounded-medie bg-flate-dempet ${ramme[f.format]} ${
          rad && blandedeFormater && f.format !== "16/9"
            ? "h-52 w-auto sm:h-auto sm:w-full"
            : ""
        }`}
      >
        {f.lyd ? (
          /*
            ABSOLUTT POSISJONERT som i Klipp: et <video> uten posisjon
            bryter ut av en `aspect-*`-ramme i Safari.

            `controlsList` uten `nofullscreen` — i motsetning til Klipp.
            Dette er en film noen skal SE, og da skal fullskjerm være der.
          */
          <video
            className="absolute inset-0 size-full object-cover"
            src={`${f.sti}.mp4`}
            poster={`${f.sti}.jpg`}
            preload="none"
            controls
            playsInline
            controlsList="nodownload noremoteplayback"
            aria-label={f.alt}
          />
        ) : (
          <Klipp sti={f.sti} festRef={fest(f.sti)} />
        )}
      </div>
      <figcaption className="mt-3 text-sm text-blekk-dempet">
        {f.bildetekst}
      </figcaption>
    </figure>
  );

  /*
    RADEN: flere filmer side om side, like høye.

    PÅ TELEFON deler to filmer raden. Er de tre, tar den første hele
    bredden og de to andre deler raden under — tre i bredden på 375 px gir
    en 16:9-ramme på 95 px høyde, og da ser man ikke hva filmen viser.
  */
  if (rad) {
    return (
      <div
        /*
          MALEN SETTES SOM EN CSS-VARIABEL og leses av en arbitrær
          Tailwind-klasse ved sm. En inline `gridTemplateColumns` kunne ikke
          brukts: den gjelder alle bredder, og på telefon skal raden være to
          like spalter. Variabelen lar verdien være regnet ut i JavaScript og
          likevel bare gjelde fra sm og opp.
        */
        className="mt-6 grid grid-cols-2 items-start gap-3 sm:grid-cols-[var(--spalter)] sm:gap-4"
        style={{
          ["--spalter" as string]: filmer
            .map((f) => `${forhold[f.format]}fr`)
            .join(" "),
        }}
      >
        {filmer.map((f, i) => (
          <div
            key={f.sti}
            className={
              filmer.length > 2 && i === 0 ? "col-span-2 sm:col-span-1" : ""
            }
          >
            {film(f)}
          </div>
        ))}
      </div>
    );
  }

  return <div className="grid gap-10 lg:gap-12">{filmer.map(film)}</div>;
}
