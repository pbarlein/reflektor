import Link from "next/link";

import { Anmeldelsesrad } from "@/components/Anmeldelser";
import { Omtalevideo } from "@/components/Omtalevideo";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { klarerteAnmeldelser } from "@/content/anmeldelser";
import { hentCase } from "@/content/caser";
import { front } from "@/content/sider/front";
import { SEKSJONSLUFT } from "./rytme";

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
 * TILBAKE TIL 4:5, bestilt av Pål 02.10.2026 samme kveld som den ble satt
 * til 9:16: «Soul cake videoen i anmeldelser kan du croppe om til 4:5 …
 * videoen ble uforholdsmessig stor.»
 *
 * Han har rett. I 9:16 var videoen 626 px høy i en 22 rem spalte, mens
 * teksten ved siden av målte 330. Seksjonen ble 1 368 px på desktop, og
 * nesten 300 av dem var film uten noe å stå ved siden av.
 *
 * DETTE ER IKKE EN BESKJÆRING AV 9:16-FILA. Produksjonen har levert en egen
 * 4:5-eksport — `Ragnhild omtale 4x5.mov` — der den innbrente tekstingen er
 * satt INNE i 4:5-rammen. En ren beskjæring av 9:16-utgaven ville tatt bort
 * 30 % av bredden og dermed deler av teksten. Fila det pekes på her er den
 * eksporten, og den har ligget i repoet hele tiden: `sti`, ikke
 * `stiStaende`.
 *
 * Verifisert bilde for bilde før byttet: «REFLEKTOR X SOULCAKE»-plakaten og
 * alle undertekstlinjene står i sin helhet innenfor rammen.
 *
 * 9:16-UTGAVEN ER SLETTET 03.10.2026. Den lå igjen «i tilfelle», og da var
 * den 10 MB i deployen som ingen nettleser noen gang ba om. Masteren ligger
 * i Dropbox; trengs formatet igjen, kodes det på nytt derfra.
 */
function Kundevideo() {
  const ord = soulcakeOrd();
  if (!ord) return null;

  return <Omtalevideo forhold="4/5" sti={ord.video.sti} alt={ord.video.alt} />;
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
        LUFTEN UNDER ER NÅ FELLES FOR HELE FORSIDEN, se SEKSJONSLUFT i
        rytme.ts. Her sto `pb-16 sm:pb-24` skrevet ut, satt 02.10.2026 etter
        Påls «litt for mye spacing over arbeid». Verdien er den samme — det
        er den som ble gjort gjeldende for alle seksjonene 04.10.2026 — men
        den står ett sted nå, ikke ti.
      */}
      <section className={SEKSJONSLUFT}>
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
