import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ReelVegg } from "@/components/ReelVegg";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { reels } from "@/content/reels";
import { front } from "@/content/sider/front";

/**
 * Arbeidet: reel-raden, produktet vist før det forklares.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Arbeidet() {
  return (
    <>
      {/* 2 · ARBEIDET — vis produktet før du forklarer det */}
      {/*
        TOPPLUFT, LAGT TIL 02.10.2026. Pål: «avstand mellom seksjonene er
        for kort.»

        Målt på live før rettelsen: avstanden fra bunnen av den mørke
        anmeldelsesseksjonen til toppen av «ARBEIDET» var **0 px**, både på
        390 og 1440. Overskriften lå klistret inntil fargekanten.

        ÅRSAKEN ER VERDT Å KUNNE, for den kommer igjen. Forsiden har én
        rytme: hver seksjon betaler for luften UNDER seg, og ingen har luft
        over. Det virker så lenge naboene deler bakgrunn. Anmeldelsene er
        den eneste seksjonen på forsiden med egen bakgrunnsfarge, og da
        havner dens `py-20 sm:py-28` INNENFOR fargen — den lager ingen
        avstand etter at fargen slutter. Denne seksjonen må derfor betale
        for luften selv.

        Verdien er litt større enn den mørke seksjonens egen innvendige
        luft. Et fargeskifte er et hardere brudd enn en vanlig
        seksjonsovergang og tåler mer.

        Legges det en ny seksjon med egen bakgrunn på siden, har den samme
        behov: den under må ha `pt-`.
      */}
      <section className="pt-24 pb-28 sm:pt-32 sm:pb-36">
        <Container>
          <Eyebrow>{hentTekst(front, "front.work.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.work.h2") ?? (
              <TbdMarkor id="front.work.h2" />
            )}
          </h2>
          <p className="mt-3 max-w-xl text-blekk-dempet">
            {hentTekst(front, "front.work.sub") ?? (
              <TbdMarkor id="front.work.sub" />
            )}
          </p>
        </Container>
        <div className="mt-10">
          <ReelVegg reels={reels} />
        </div>
      </section>
    </>
  );
}
