import Link from "next/link";

import { Anmeldelsesrad } from "@/components/Anmeldelser";
import { Omtalevideo } from "@/components/Omtalevideo";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { klarerteAnmeldelser } from "@/content/anmeldelser";
import { hentCase } from "@/content/caser";
import { front } from "@/content/sider/front";

/**
 * Google-anmeldelsene.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
/**
 * Omtalevideoen fra Soulcake, øverst i seksjonen.
 *
 * HVORFOR DEN STÅR FØRST OG IKKE SIST. De elleve Google-anmeldelsene er
 * tekst noen har skrevet; dette er en kunde som sier det på kamera, med
 * ansikt og navn. Den tyngste kilden skal stå der blikket allerede er.
 *
 * TEKSTEN ER KORT MED VILJE. Hele historien står på kundecasen, og lenken
 * dit er poenget med innslaget: forsiden skal ikke fortelle saken, den skal
 * gjøre at noen klikker på den.
 *
 * INNHOLDET HENTES FRA CASET, ikke skrevet på nytt her. Sitatet og navnet
 * står ett sted, og de to sidene kan ikke komme i utakt.
 */
function soulcakeOrd() {
  return hentCase("soulcake")?.kundeord ?? null;
}

/**
 * Videoen, i venstre spalte.
 *
 * 9:16 OG STØRRE, endret 02.10.2026 etter bestilling fra Pål. To ting lå
 * bak den gamle 4:5-rammen på 18 rem, og begge er rettet:
 *
 * 1. FILA VAR BESKÅRET. Masteren fra produksjonen er 1080×1920, altså ekte
 *    9:16. Utgaven som lå på nettstedet var en 4:5-versjon laget for de
 *    smale spaltene på case- og tjenestesidene. Forsiden viser nå hele
 *    formatet, fra den samme masteren — se `stiStaende` i caser.ts.
 * 2. RAMMEN VAR LÅST TIL 4:5 i komponenten, og siden videoen ligger med
 *    `object-cover`, ville en 9:16-fil i den rammen blitt klippet 30 % i
 *    bredden uten at noe sa fra. Derfor er formatet nå en opplysning
 *    komponenten får, ikke en antakelse den gjør.
 */
function Kundevideo() {
  const ord = soulcakeOrd();
  if (!ord) return null;

  return (
    <Omtalevideo
      forhold="9/16"
      sti={ord.video.stiStaende ?? ord.video.sti}
      alt={ord.video.alt}
    />
  );
}

/**
 * Sitatet og lenken, under overskriften i høyre spalte.
 *
 * BILDETEKSTEN ER FJERNET 02.10.2026, bestilt av Pål: «på mobil har du
 * tekstet videoen. fjern teksten om den ikke har noen hensikt. videoen er
 * jo tekstet fra før av.»
 *
 * Her sto «Ragnhild Gaarde Bucataru i Soulcake om fem år med foto og video
 * fra Reflektor.» rett over sitatet — og på telefon, der spaltene stables,
 * landet den rett under videoen og leste som en bildetekst. Den fortalte
 * dessuten det videoen viser: hun sier selv på kamera at det er fem år, og
 * den innbrente tekstingen gjengir det ordrett.
 *
 * DET ENESTE DEN GJORDE SOM VIDEOEN IKKE GJØR, var å navngi henne. Navnet
 * er derfor flyttet dit det hører hjemme — under sitatet, som attribusjon,
 * i samme form som på kundecasen og tjenestesidene. Setningen er borte,
 * opplysningen er ikke.
 *
 * `sagtAv` HENTES FRA CASET og er ikke skrevet på nytt her, slik filhodet
 * over lover. Sitatet er fortsatt en bevisst forkortet utgave for forsiden:
 * den fulle versjonen står på casen.
 */
function Kundesitat() {
  const ord = soulcakeOrd();
  if (!ord) return null;

  return (
    <div className="mt-6 max-w-xl">
      <blockquote className="border-l-2 border-aksent-pa-dyp pl-5 text-xl leading-relaxed text-pretty sm:text-2xl">
        «Vi prøver egentlig å booke dem opp, så det ikke er plass til dere
        andre.»
      </blockquote>
      <p className="mt-3 pl-5 text-sm text-pa-dyp-dempet">– {ord.sagtAv}</p>
      <Link
        href="/vart-arbeid/soulcake"
        className="group mt-6 inline-flex items-center gap-2 text-sm tracking-[0.02em] text-pa-dyp underline decoration-aksent-pa-dyp decoration-1 underline-offset-[0.35em]"
      >
        Se hele Soulcake-casen
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </div>
  );
}

export function Anmeldelsesseksjon() {
  return (
    <>
      {/*
      5 · ANMELDELSER

      Seksjonen har vært gjennom to omskrivinger. Først var den ren tekst
      på beige og leste som dokumentasjon. Så ble den et løftet sitat pluss
      åtte glasskort i tre rader — riktig i uttrykk, men 1 500 piksler høy,
      og den brøt rytmen i siden.

      Nå er den én rad: Googles egen vurdering som tall, og sitatene som en
      rad man kan dra i. Se Anmeldelser.tsx for hva som er byttet mot hva.

      Flaten forblir mørk. Ikke for variasjonens skyld — glasskortene
      trenger noe å bryte mot, og flatebyttet markerer at det er noen andre
      enn Reflektor som snakker.
    */}
      {/*
        LUFTEN LIGGER HER, UTENFOR PANELET. Endret 02.10.2026 sammen med at
        flaten ble innfelt (se Anmeldelser.tsx).

        Før dette var seksjonen `bg-dyp text-pa-dyp` uten padding, og all
        luften lå inne i fargen. Da lagde den ingen avstand til naboene:
        målt på live var det 0 px mellom bunnen av den mørke stripen og
        overskriften i seksjonen under. Nå betaler seksjonen for luften
        under seg, som alle de andre på forsiden, og Logostripe over
        betaler for luften på toppen med samme verdi.

        Fargen og tekstfargen hører til panelet, ikke til seksjonen — ellers
        ville `text-pa-dyp` farget bone-tekst på lys bakgrunn utenfor
        panelet.
      */}
      {/*
        LUFTA ER STRAMMET INN 02.10.2026, bestilt av Pål: «litt for mye
        spacing over arbeid». Her sto `pb-24 sm:pb-32`, altså 96 px på mobil
        og 128 på desktop ned til «Slik ser det ut når vi filmer hos andre».

        Avstanden kom av en rettelse dagen før — seksjonen hadde 0 px under
        seg og måtte få luft som alle andre — og den ble satt én hakk for
        romslig. `pb-16 sm:pb-24` gir 64 og 96, som er samme verdi som
        seksjonen over betaler på toppen.
      */}
      <section className="pb-16 sm:pb-24">
        <Anmeldelsesrad
          eyebrow={hentTekst(front, "front.reviews.eyebrow")}
          overskrift={
            hentTekst(front, "front.reviews.h2") ?? (
              <TbdMarkor id="front.reviews.h2" />
            )
          }
          anmeldelser={klarerteAnmeldelser}
          video={<Kundevideo />}
          sitat={<Kundesitat />}
        />
      </section>
    </>
  );
}
