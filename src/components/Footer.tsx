import Link from "next/link";
import { Merkelapp } from "./Eyebrow";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { site } from "@/content/site";
import { bunnmeny } from "@/content/navigasjon";

/**
 * Bunnteksten.
 *
 * NAP-blokken står, og skal stå. Den må være identisk med det som ligger i
 * eksterne kataloger – krysskildekonsistens er et teknisk signal for
 * AI-siteringer, ikke en redaksjonell detalj. Ikke omformuler den.
 *
 * VERIFISERT 16.09.2026 mot Googles egen oppføring (Reflektor AS,
 * place-ID ChIJv6K0bydvQUYRKCndqlmZMpk): Tvetenveien 162, 0671 Oslo,
 * +47 47 60 50 70, reflektor.no. Alt stemmer med site.ts og med
 * PostalAddress i Schema.tsx. Endres noe her, må alle tre følge etter.
 *
 * NAVIGASJONEN ER NY. Headeren har fire punkter og bærer ikke tjenestesidene
 * — begrunnelsen står i src/content/navigasjon.ts. Da må de ligge her, ellers
 * har fem live sider null sidevise interne lenker. To `<nav>` på samme side
 * må ha hver sin `aria-label`, ellers er de to navigasjonslandemerkene
 * umulige å skille for en skjermleser.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-kant py-14">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between sm:gap-16">
          <div>
            <Link href="/" aria-label="Reflektor – til forsiden">
              <Logo variant="merke" className="h-8 text-base" />
            </Link>
            <address className="mt-6 text-sm leading-relaxed text-blekk-dempet not-italic">
              {site.kontakt.firma}
              <br />
              {site.kontakt.adresse}
              <br />
              Org.nr. {site.kontakt.orgnr}
              <br />
              <a
                href={`mailto:${site.kontakt.epost}`}
                className="hover:text-blekk"
              >
                {site.kontakt.epost}
              </a>
              <br />
              <a
                href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
                className="hover:text-blekk"
              >
                {site.kontakt.telefon}
              </a>
            </address>
          </div>

          <nav
            aria-label="Bunntekst"
            className="grid grid-cols-2 gap-10 sm:gap-16"
          >
            {bunnmeny.map((spalte) => (
              <div key={spalte.tittel}>
                <Merkelapp som="h2">{spalte.tittel}</Merkelapp>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {spalte.lenker.map((l) => (
                    <li key={l.sti}>
                      <Link href={l.sti} className="hover:text-aksent-tekst">
                        {l.navn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
