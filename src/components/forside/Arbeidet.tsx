import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ReelVegg } from "@/components/ReelVegg";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { reels } from "@/content/reels";
import { front } from "@/content/sider/front";
import { SEKSJONSLUFT } from "./rytme";

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
        INGEN TOPPLUFT HER, og det er med vilje.

        02.10.2026 sto det `pt-24 sm:pt-32` her. Det var en lapp på et
        problem som lå et annet sted: anmeldelsesseksjonen over var en
        helbredds mørk stripe uten padding utenfor fargen, så avstanden
        mellom de to var målt 0 px. Da Pål samme dag ba om at den mørke
        flaten skulle bli smalere, ble den et innfelt panel med luften
        utenfor seg — og da betaler seksjonen over for avstanden selv, som
        alle andre på forsiden gjør.

        Lappen er derfor tatt bort igjen. Hadde den blitt stående, ville
        avstanden blitt dobbel.

        FORSIDENS RYTME, for den som lurer: hver seksjon betaler for luften
        UNDER seg, ingen har luft over, og verdien er den samme overalt —
        se SEKSJONSLUFT i rytme.ts. Legges det inn en ny seksjon med egen
        bakgrunnsfarge, må den fargede flaten være innfelt og luften ligge
        utenfor den — ellers oppstår nøyaktig den samme feilen igjen.
      */}
      <section className={SEKSJONSLUFT}>
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
