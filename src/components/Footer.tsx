import { Container } from "./Container";
import { site } from "@/content/site";

/**
 * Minimal footer mens siden designes på nytt.
 *
 * NAP-blokken står, og skal stå. Den må være identisk med det som ligger i
 * eksterne kataloger – krysskildekonsistens er et teknisk signal for
 * AI-siteringer, ikke en redaksjonell detalj. Ikke omformuler den.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-kant py-10">
      <Container>
        <address className="text-sm text-blekk-dempet not-italic">
          {site.kontakt.firma} · Org.nr. {site.kontakt.orgnr} ·{" "}
          {site.kontakt.adresse}
          <br />
          <a href={`mailto:${site.kontakt.epost}`} className="hover:text-blekk">
            {site.kontakt.epost}
          </a>{" "}
          ·{" "}
          <a
            href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
            className="hover:text-blekk"
          >
            {site.kontakt.telefon}
          </a>
        </address>
      </Container>
    </footer>
  );
}
