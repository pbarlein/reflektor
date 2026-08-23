import Link from "next/link";
import { Container } from "@/components/Container";
import { site, tilbud, prosess, kundelogoer } from "@/content/site";

/**
 * Forsiden.
 *
 * Følger seksjonsrytmen fra dagens side: mørk hero, lys beige flate for
 * prosessen, brun gradient for pristilbudet, beige igjen for CTA.
 *
 * «nesten» i overskriften er kursivert med vilje – forbeholdet står i samme
 * setning som løftet. Ikke stryk det for å gjøre løftet større.
 */
export default function Forside() {
  return (
    <>
      <section className="bg-mork py-20 text-blekk-invers sm:py-28">
        <Container>
          <h1 className="max-w-4xl text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Sosiale medier – <em className="italic text-aksent">nesten</em> på
            autopilot.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-blekk-invers/70 text-pretty">
            {site.ingress}
          </p>
          <div className="mt-10">
            <Link
              href="/kontaktoss"
              className="knapp-skjev inline-block rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-mork"
            >
              Ta kontakt
            </Link>
          </div>
        </Container>
      </section>

      {/* Produksjonskunder – ikke SoMe-abonnenter. Se kommentar i site.ts. */}
      <section className="border-b border-kant py-10">
        <Container>
          <p className="text-xs tracking-widest text-blekk-dempet uppercase">
            Noen av bedriftene vi har produsert innhold for
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3 text-sm text-blekk-dempet">
            {kundelogoer.map((kunde) => (
              <li key={kunde}>{kunde}</li>
            ))}
          </ul>
          {/* TODO: erstatt med logofiler i public/bilder/kunder/ */}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <ul className="grid gap-10 sm:grid-cols-3">
            {prosess.map((steg) => (
              <li key={steg.navn}>
                <h2 className="text-xl font-medium">{steg.navn}</h2>
                <p className="mt-3 text-blekk-dempet text-pretty">{steg.tekst}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="gradient-brun rounded-2xl px-8 py-14 text-blekk-invers sm:px-14">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Én fast pris. Alt inkludert.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-pretty">
              {tilbud.prisPerManed.toLocaleString("nb-NO")} kr per måned.
              Strategi, produksjon, redigering og publisering to ganger i uka på
              Instagram og Facebook. Produksjonsmål: {tilbud.videoerPerManed}{" "}
              videoer i måneden.
            </p>
            <p className="mt-4 max-w-2xl text-blekk-invers/70 text-pretty">
              Ingen timepriser. Ingen bindingstid. Fri bruk av alt innhold –
              klart til gjenbruk i annonser, på nettsider, skjermer og
              presentasjoner.
            </p>
            <div className="mt-10">
              <Link
                href="/kontaktoss"
                className="knapp-skjev inline-block rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-mork"
              >
                Ta en prat
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <h2 className="max-w-3xl text-3xl font-medium tracking-tight text-balance sm:text-4xl">
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
              className="knapp-skjev inline-block rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-mork"
            >
              Få et strategiforslag
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
