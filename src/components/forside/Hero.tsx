import { Container } from "@/components/Container";
import { knappeklasser } from "@/components/Knapp";
import { Klipp } from "@/components/Klipp";
import { TbdMarkor, hentTekst } from "@/components/Slot";

import { front } from "@/content/sider/front";
import { tilbud } from "@/content/site";

/**
 * Heroen: posisjonering i øvre halvdel av første skjerm.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Hero() {
  return (
    <>
      {/* 1 · HERO — posisjonering i øvre halvdel av første skjerm.
        Rytmen varierer bevisst mellom seksjonene: jevn vertikal padding
        overalt er et malsignal. Forholdet mellom største og minste
        seksjonsrytme her er omtrent 3:1. */}
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-36">
        <Container>
          {/*
          Tekst og klipp side om side, begge innenfor containeren, så
          venstre- og høyrekant flukter med arbeidsseksjonen under.

          `items-stretch` er poenget: figuren arver høyden fra tekstspalten,
          og klippet beskjæres med object-cover til den høyden. Da fyller
          det rammen uten at heroen vokser, og uten at et 9:16-format
          dikterer hvor høy førsteskjermen blir.

          7/5-delingen og ikke 6/6: teksten bærer posisjoneringen og skal
          ha mest plass. NN/g-tallene sier at 57 % av visningstiden ligger
          over folden, og over 65 % av den i øvre halvdel — det er teksten
          som må stå der, ikke bildet.
        */}
          <div className="grid items-stretch gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
            <div>
              <h1 className="max-w-4xl text-[2.75rem] leading-[1.04] sm:text-6xl sm:leading-[1.02] lg:text-[4.25rem] lg:leading-[1.0]">
                {/* Kursiv, ikke oransje. Instrument Serif har en ekte kursiv, og
              den er den naturlige uthevingen i et seriffsnitt. Det frigjør
              aksentfargen til CTA-en alene — oransje to steder i samme
              viewport svekker knappen, som er det ene stedet fargen skal
              bety «trykk her». */}
                Sosiale medier – <em>nesten</em> på autopilot.
              </h1>

              <p className="mt-7 max-w-xl text-lg text-blekk-dempet">
                {hentTekst(front, "front.hero.sub") ?? (
                  <TbdMarkor id="front.hero.sub" />
                )}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                {/*
            Knappen bytter utseende når teksten mangler. Grunnen er ikke
            kosmetisk: TBD-markøren er oransje på lys flate, og inne i en
            oransje knapp blir den usynlig. Da ser previewen ut som en
            ferdig knapp uten tekst, i stedet for som en manglende slot.
            Preview er flaten Pål vurderer på — det skal være umulig å tro
            at noe er ferdig når det ikke er det.
          */}
                {hentTekst(front, "front.hero.cta") ? (
                  <a
                    href="#kontakt"
                    className={knappeklasser()}
                  >
                    {hentTekst(front, "front.hero.cta")}
                  </a>
                ) : (
                  <span className="inline-block rounded-interaktiv border border-dashed border-aksent px-7 py-3.5">
                    <TbdMarkor id="front.hero.cta" />
                  </span>
                )}
                {/* Prisen står allerede her. Selvkvalifisering, og AEO vekter det. */}
                <p className="tracking-[0.02em] text-blekk-dempet">
                  {tilbud.prisPerManed.toLocaleString("nb-NO")} kr/mnd · ingen
                  bindingstid
                </p>
              </div>

              {/*
          Beviset står som SETNING, ikke som logorekke. Den tidligere
          rekken med sju navn sto rett under denne linjen og sa nesten det
          samme — fem av navnene var de samme.

          Setningen er dessuten det tryggere av de to: «Produserer foto og
          video for …» sier eksplisitt hva kundeforholdet ER. En bar rekke
          med navn under et tilbud om månedsabonnement inviterer til å lese
          dem som abonnenter, og det ville vært en feilaktig referanse.
        */}
              <p className="mt-10 max-w-xl text-sm tracking-[0.02em] text-blekk-dempet">
                {hentTekst(front, "front.hero.proof") ?? (
                  <TbdMarkor id="front.hero.proof" />
                )}
              </p>
            </div>

            {/*
            Heroklippet er det ENESTE som spiller uten IntersectionObserver.
            Det er over folden fra første sekund, så det finnes ingen
            «kommer i synsfeltet»-hendelse å vente på. Derfor også
            preload="metadata" og ikke "none": her er ventetiden synlig.

            Fortsatt dekorativt — informasjonen ligger i teksten ved siden
            av, og klippet er uten lyd.

            VEKT: dette klippet er LCP-elementet, siden det maler før H1
            rekker det. Målt gikk LCP fra 996 ms (H1) til 1 232 ms da det
            kom inn, og førstelasten fra 0,99 til 2,72 MB. Derfor er det
            kodet hardere enn de andre — CRF 33 og åtte sekunder — etter at
            samme bilderute ved faktisk visningsstørrelse viste ingen
            synlig forskjell mot CRF 31. Endres dette klippet, må LCP
            måles på nytt.
          */}
            {/*
            Klippet ligger ABSOLUTT inne i figuren. Uten det bestemmer
            videoens eget 9:16-format hvor høy raden blir, og heroen vokser
            til nesten 1 400 px. Nå arver figuren høyden fra tekstspalten,
            og klippet beskjæres til den — som var hele poenget med å legge
            dem side om side.
          */}
            <figure className="relative h-[26rem] overflow-hidden rounded-flate bg-flate-dempet sm:h-[32rem] lg:h-auto">
              <Klipp sti="/reels/antonburst" ivrig />
            </figure>
          </div>
        </Container>
      </section>
    </>
  );
}
