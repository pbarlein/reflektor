import Link from "next/link";
import { Container } from "./Container";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-kant py-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{site.navn}</p>
            <p className="mt-2 text-sm text-blekk-dempet">
              {site.taglineKort}
            </p>
            {/* TODO: NAP-blokk – adresse, telefon og org.nr. Finnes i footeren
                på dagens side, men fanges ikke av Ahrefs-crawlen. Må hentes
                manuelt; understøtter lokal synlighet. */}
          </div>
          <nav aria-label="Tjenester">
            <p className="text-sm font-medium">Tjenester</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-dempet">
              <li><Link href="/sosiale-medier-byra" className="hover:text-blekk">Sosiale medier på fast pris</Link></li>
              <li><Link href="/innholdsproduksjon" className="hover:text-blekk">Innholdsproduksjon</Link></li>
              <li><Link href="/reklamefilm" className="hover:text-blekk">Reklamefilm</Link></li>
              <li><Link href="/employer-branding-video-oslo" className="hover:text-blekk">Employer branding-video</Link></li>
              <li><Link href="/eventfotograf-eventvideo" className="hover:text-blekk">Event­foto og -video</Link></li>
            </ul>
          </nav>
          <nav aria-label="Selskap">
            <p className="text-sm font-medium">Selskap</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-dempet">
              <li><Link href="/om-oss" className="hover:text-blekk">Om oss</Link></li>
              <li><Link href="/vart-arbeid" className="hover:text-blekk">Vårt arbeid</Link></li>
              <li><Link href="/faq" className="hover:text-blekk">Ofte stilte spørsmål</Link></li>
              <li><Link href="/blogg" className="hover:text-blekk">Blogg</Link></li>
              <li><Link href="/kontaktoss" className="hover:text-blekk">Ta kontakt</Link></li>
              <li><Link href="/personvern" className="hover:text-blekk">Personvern</Link></li>
            </ul>
          </nav>
        </div>
        <p className="mt-10 text-sm text-blekk-dempet">
          © {new Date().getFullYear()} {site.navn}. {site.kontakt.sted}.
        </p>
      </Container>
    </footer>
  );
}
