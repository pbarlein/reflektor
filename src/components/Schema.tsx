import { site, tilbud } from "@/content/site";

/**
 * JSON-LD (brief 8.3).
 *
 * Organization videreføres fra dagens implementasjon. NAP skal være identisk
 * med det som står i eksterne kataloger – krysskildekonsistens er et direkte
 * signal for AI-siteringer, og behandles som en teknisk oppgave, ikke en
 * redaksjonell.
 *
 * VideoObject implementeres først når thumbnail-filer finnes (vedlegg A 11).
 */
const ORG_ID = "https://www.reflektor.no/#organisasjon";

export function OrganisasjonSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.navn,
    url: "https://www.reflektor.no/",
    email: site.kontakt.epost,
    telephone: site.kontakt.telefon,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.kontakt.sted,
      addressCountry: "NO",
      // TODO: gateadresse og postnummer – må være identisk med GBP og Ocast.
    },
    areaServed: "NO",
    // TODO (vedlegg A): sameAs videreføres fra dagens Code Injection HEADER,
    // åtte kilder. Må hentes fra fersk kilde, ikke fra cache.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Én Service per landingsside, koblet til Organization. */
export function TjenesteSchema({
  navn,
  beskrivelse,
  sti,
}: {
  navn: string;
  beskrivelse: string;
  sti: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: navn,
    description: beskrivelse,
    url: `https://www.reflektor.no${sti}`,
    provider: { "@id": ORG_ID },
    areaServed: "NO",
    offers: {
      "@type": "Offer",
      price: tilbud.prisPerManed,
      priceCurrency: tilbud.valuta,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * FAQPage på alle sider med FAQ-seksjon.
 *
 * Tar kun med spørsmål som faktisk har godkjent tekst – schema med TBD-innhold
 * ville vært verre enn ingen schema.
 */
export function FaqSchema({ qa }: { qa: { sporsmal: string; svar: string }[] }) {
  if (qa.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((p) => ({
      "@type": "Question",
      name: p.sporsmal,
      acceptedAnswer: { "@type": "Answer", text: p.svar },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
