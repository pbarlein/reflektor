import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { TbdMarkor, hentTekst, slotsISeksjon } from "@/components/Slot";
import { front } from "@/content/sider/front";

/**
 * Slik fungerer det: mørk blokk som kapittelskille.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function SlikFungererDet() {
  return (
    <>
      {/* 3 · SLIK FUNGERER DET — mørk blokk som kapittelskille */}
      <section className="pb-20">
        <Container>
          <div className="rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
            <Eyebrow variant="dyp">
              {hentTekst(front, "front.how.eyebrow")}
            </Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
              {hentTekst(front, "front.how.h2") ?? (
                <TbdMarkor id="front.how.h2" />
              )}
            </h2>

            {/*
            Loddrette hårstreker mellom stegene, i samme språk som
            prisbordet. --kant-pa-dyp er en egen verdi: den vanlige
            hårstreken er regnet mot beige og forsvinner helt på brunt.

            Skillene er strukturelle, ikke dekor — de sier at dette er tre
            trinn i rekkefølge, ikke tre likestilte påstander.
          */}
            {/*
            TO GEOMETRIER FOR SAMME BUDSKAP: «dette er tre trinn i
            rekkefølge, ikke tre likestilte påstander.»

            Desktop sier det med LODDRETTE hårstreker mellom spaltene, i
            samme språk som prisarket. --kant-pa-dyp er en egen verdi: den
            vanlige hårstreken er regnet mot beige og forsvinner på brunt.

            Mobil sier det med en TIDSLINJE. Her var seksjonen 1 005 px
            ren tekst uten et eneste bilde — den lengste sammenhengende
            tekststrekningen på siden, og en av dem Pål meldte som «for
            mye tekst». Stablet med 40 px mellomrom var de tre stegene tre
            like avsnitt; nummeret sto på egen linje over tittelen og kostet
            en linje per steg.

            Nummeret er nå en sirkel i en skinne til venstre, med en strek
            som binder stegene sammen. Det tar bort tre linjer, gjør
            rekkefølgen synlig uten å forklare den, og fjerner ingen copy.
            Streken stopper på siste steg — den peker framover, og etter
            det siste er det ingenting å peke på.
          */}
            <ol className="mt-12 grid gap-0 md:-mx-8 md:grid-cols-3 lg:-mx-12">
              {slotsISeksjon(front, 3)
                .filter((s) => s.id.includes("steps"))
                .map((slot, i, alle) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  const sist = i === alle.length - 1;
                  return (
                    <li
                      key={slot.id}
                      /*
                        LUFTA RUNDT HÅRSTREKEN VAR USYMMETRISK, og det var
                        en klassekollisjon og ikke et designvalg: `sm:pl-0`
                        og `sm:px-8` sto begge i samme klassestreng. Tailwind
                        sorterer `pl` etter `px`, så `pl-0` vant på alle tre
                        stegene og `px-8` ga padding bare mot høyre. Målt:
                        33 px fra streken til teksten til venstre for den,
                        0 px til teksten til høyre. Streken klistret seg til
                        steget den innleder, og leste da som en ramme rundt
                        ett steg i stedet for et skille mellom to.

                        LØSNINGEN ER IKKE Å SETTE `pl-0` PÅ FØRSTE STEG
                        IGJEN. Da blir de tre tekstspaltene ulikt brede —
                        ytterste steg får padding på én side, midterste på
                        to — og forskjellen er hele gutteren. Tre trinn som
                        skal leses som likeverdige kan ikke ha ulik
                        linjelengde.

                        I stedet har ALLE tre lik padding, og hele <ol>
                        trekkes ut i gutterbredden med negativ margin. Da
                        flukter første steg med h2-en over og siste med
                        høyre kant, samtidig som alle tre tekstspaltene er
                        nøyaktig like brede og hårstrekene står midt i
                        lufta. Den negative margen er alltid mindre enn
                        kortets egen padding, så ingenting stikker ut.

                        LIKE SPALTER KOSTER ÉN GUTTER PER SPALTE, og det
                        flyttet bruddpunktet. På sm (640 px) ble de tre
                        tekstspaltene 116 px brede — smalere enn ordet
                        «produksjonsdag». Tre kolonner starter derfor først
                        på md (768 px). Under det står den stablede
                        tidslinja, som uansett er den bedre lesningen på
                        den bredden. Målt på åtte bredder fra 640 til
                        1920: spaltene er like brede overalt, ingenting
                        stikker utenfor kortet, og ingen sidescroll.
                      */
                      className={`relative pb-9 pl-14 last:pb-0 md:px-8 md:pb-0 lg:px-12 ${
                        sist
                          ? ""
                          : "md:border-r md:border-[color:var(--kant-pa-dyp)]"
                      }`}
                    >
                      {/*
                      Skinna finnes bare under md. Fra md overtar de
                      loddrette skillene, og da ville en sirkel til venstre
                      vært to systemer som sier det samme.
                    */}
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border border-[color:var(--kant-pa-dyp)] font-[family-name:var(--font-display-serif)] text-lg leading-none text-aksent-pa-dyp md:static md:size-auto md:block md:rounded-none md:border-0 md:text-base"
                      >
                        {i + 1}
                      </span>
                      {!sist && (
                        <span
                          aria-hidden
                          className="absolute top-11 bottom-2 left-[1.125rem] w-px bg-[color:var(--kant-pa-dyp)] md:hidden"
                        />
                      )}
                      {delt ? (
                        <>
                          <h3 className="text-lg font-medium md:mt-3">
                            {delt[0].trim()}
                          </h3>
                          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet md:text-base">
                            {delt.slice(1).join("|").trim()}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3">
                          <TbdMarkor id={slot.id} />
                        </p>
                      )}
                    </li>
                  );
                })}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
