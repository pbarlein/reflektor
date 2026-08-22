import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { site, landingssider } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-mork py-16 text-blekk-invers">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="merke" pa="mork" className="h-8 text-base" />
            <p className="mt-4 text-sm text-blekk-invers/60">
              {site.taglineKort}
            </p>
          </div>

          <nav aria-label="Tjenester">
            <p className="text-sm font-medium">Tjenester</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-invers/60">
              {landingssider.map((side) => (
                <li key={side.slug}>
                  <Link href={`/${side.slug}`} className="hover:text-blekk-invers">
                    {side.tittel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Selskap">
            <p className="text-sm font-medium">Selskap</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-invers/60">
              <li><Link href="/om-oss" className="hover:text-blekk-invers">Om oss</Link></li>
              <li><Link href="/vart-arbeid" className="hover:text-blekk-invers">Vårt arbeid</Link></li>
              <li><Link href="/faq" className="hover:text-blekk-invers">Ofte stilte spørsmål</Link></li>
              <li><Link href="/blogg" className="hover:text-blekk-invers">Blogg</Link></li>
              <li><Link href="/personvern" className="hover:text-blekk-invers">Personvern</Link></li>
            </ul>
          </nav>

          {/* NAP-blokken understøtter lokal synlighet – skal alltid stå her. */}
          <address className="not-italic">
            <p className="text-sm font-medium">Kontakt</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-invers/60">
              <li>
                <a href={`mailto:${site.kontakt.epost}`} className="hover:text-blekk-invers">
                  {site.kontakt.epost}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
                  className="hover:text-blekk-invers"
                >
                  {site.kontakt.telefon}
                </a>
              </li>
              <li>{site.kontakt.sted}</li>
              {/* TODO: gateadresse og org.nr. fra footeren på dagens side */}
            </ul>
          </address>
        </div>

        <p className="mt-12 text-sm text-blekk-invers/40">
          © {new Date().getFullYear()} {site.navn}. Alle rettigheter forbeholdt.
        </p>
      </Container>
    </footer>
  );
}
