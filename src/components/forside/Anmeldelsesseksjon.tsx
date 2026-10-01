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
 * Omtalevideoen fra Soul Cake, øverst i seksjonen.
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
function Kundeord() {
  const soulcake = hentCase("soulcake");
  const ord = soulcake?.kundeord;
  if (!ord) return null;

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-center lg:gap-14">
      <Omtalevideo
        sti={ord.video.sti}
        alt={ord.video.alt}
        undertekster={ord.video.undertekster}
      />
      <div className="max-w-xl">
        <p className="leading-relaxed text-pretty text-pa-dyp-dempet">
          Ragnhild Gaarde Bucataru i Soul Cake om fem år med foto og video fra
          Reflektor.
        </p>
        <blockquote className="mt-5 border-l-2 border-aksent-pa-dyp pl-5 text-xl leading-relaxed text-pretty sm:text-2xl">
          «Vi prøver egentlig å booke dem opp, så det ikke er plass til dere
          andre.»
        </blockquote>
        <Link
          href="/vart-arbeid/soulcake"
          className="group mt-6 inline-flex items-center gap-2 text-sm tracking-[0.02em] text-pa-dyp underline decoration-aksent-pa-dyp decoration-1 underline-offset-[0.35em]"
        >
          Se hele Soul Cake-casen
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </div>
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
      <section className="bg-dyp text-pa-dyp">
        <Anmeldelsesrad
          eyebrow={hentTekst(front, "front.reviews.eyebrow")}
          overskrift={
            hentTekst(front, "front.reviews.h2") ?? (
              <TbdMarkor id="front.reviews.h2" />
            )
          }
          anmeldelser={klarerteAnmeldelser}
          innslag={<Kundeord />}
        />
      </section>
    </>
  );
}
