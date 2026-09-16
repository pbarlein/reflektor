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
      <section className="pb-28 sm:pb-36">
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
