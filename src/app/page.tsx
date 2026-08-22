import Link from "next/link";
import { Container } from "@/components/Container";
import { site, tilbud, prosess } from "@/content/site";

/**
 * Forsiden.
 *
 * Teksten er hentet fra dagens side, ikke nyskrevet. Merk at «nesten» i
 * overskriften er kursivert med vilje – den innrømmer at kunden fortsatt må
 * stille med folk og lokasjon. Ikke stryk den for å gjøre løftet større.
 *
 * Løst: / og /hjem serverte identisk innhold på Squarespace. Her finnes
 * forsiden kun på /, og /hjem redirigerer hit (next.config.ts).
 */
export default function Forside() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Sosiale medier – <em className="italic">nesten</em> på autopilot.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-blekk-dempet text-pretty">
            {site.ingress}
          </p>
          <div className="mt-10">
            <Link
              href="/kontaktoss"
              className="rounded-full bg-aksent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
            >
              Ta kontakt
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-kant py-20">
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-kant bg-kant sm:grid-cols-3">
            {prosess.map((steg) => (
              <li key={steg.navn} className="bg-flate p-8">
                <h2 className="font-medium">{steg.navn}</h2>
                <p className="mt-2 text-sm text-blekk-dempet text-pretty">
                  {steg.tekst}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-kant py-20">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight">
            Én fast pris. Alt inkludert.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-pretty">
            {tilbud.prisPerManed.toLocaleString("nb-NO")} kr per måned.
            Strategi, produksjon, redigering og publisering to ganger i uka på
            Instagram og Facebook. Produksjonsmål: {tilbud.videoerPerManed}{" "}
            videoer i måneden.
          </p>
          <p className="mt-4 max-w-2xl text-blekk-dempet text-pretty">
            Ingen timepriser. Ingen bindingstid. Fri bruk av alt innhold – klart
            til gjenbruk i annonser, på nettsider, skjermer og presentasjoner.
          </p>
          <div className="mt-8">
            <Link
              href="/sosiale-medier-byra"
              className="rounded-full border border-kant px-6 py-3 text-sm font-medium transition-colors hover:bg-flate-dempet"
            >
              Se hva som inngår
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-kant py-20">
        <Container>
          <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-balance">
            Vi lager komplett strategiforslag til SoMe i løpet av{" "}
            {tilbud.strategiforslagVirkedager} virkedager!
          </h2>
          <p className="mt-6 max-w-2xl text-blekk-dempet text-pretty">
            Lyst til å møte oss? Book en uforpliktende prat – vi holder til i{" "}
            {site.kontakt.sted} og jobber med bedrifter i hele Norge. Fortell
            oss om din bedrift, og vi lager et komplett strategiforslag til SoMe
            i løpet av {tilbud.strategiforslagVirkedager} virkedager. Sammen
            planlegger vi første shoot og kommer i gang på kort tid!
          </p>
          <div className="mt-8">
            {/* Skjemalead er eneste KPI – primær-CTA peker alltid mot skjema. */}
            <Link
              href="/kontaktoss"
              className="rounded-full bg-aksent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
            >
              Få et strategiforslag
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
