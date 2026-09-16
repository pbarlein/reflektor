import { Anmeldelsesrad } from "@/components/Anmeldelser";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { klarerteAnmeldelser } from "@/content/anmeldelser";
import { front } from "@/content/sider/front";

/**
 * Google-anmeldelsene.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
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
        />
      </section>
    </>
  );
}
