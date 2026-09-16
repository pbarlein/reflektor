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
            <ol className="mt-12 grid gap-0 sm:grid-cols-3">
              {slotsISeksjon(front, 3)
                .filter((s) => s.id.includes("steps"))
                .map((slot, i, alle) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  const sist = i === alle.length - 1;
                  return (
                    <li
                      key={slot.id}
                      className={`relative pb-9 pl-14 last:pb-0 sm:pb-0 sm:pl-0 sm:px-8 ${
                        i === 0 ? "sm:pl-0" : ""
                      } ${
                        sist
                          ? "sm:pr-0"
                          : "sm:border-r sm:border-[color:var(--kant-pa-dyp)]"
                      }`}
                    >
                      {/*
                      Skinna finnes bare under sm. Fra sm overtar de
                      loddrette skillene, og da ville en sirkel til venstre
                      vært to systemer som sier det samme.
                    */}
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border border-[color:var(--kant-pa-dyp)] font-[family-name:var(--font-display-serif)] text-lg leading-none text-aksent-pa-dyp sm:static sm:size-auto sm:block sm:rounded-none sm:border-0 sm:text-base"
                      >
                        {i + 1}
                      </span>
                      {!sist && (
                        <span
                          aria-hidden
                          className="absolute top-11 bottom-2 left-[1.125rem] w-px bg-[color:var(--kant-pa-dyp)] sm:hidden"
                        />
                      )}
                      {delt ? (
                        <>
                          <h3 className="text-lg font-medium sm:mt-3">
                            {delt[0].trim()}
                          </h3>
                          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet sm:text-base">
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
