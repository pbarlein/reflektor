import { site, tilbud } from "@/content/site";

/**
 * JSON-LD (brief 8.3).
 *
 * NAP skal være identisk med det som står i eksterne kataloger –
 * krysskildekonsistens er et direkte signal for AI-siteringer, og behandles
 * som en teknisk oppgave, ikke en redaksjonell.
 *
 * ENTITETEN EIES AV FORSIDEN. Organization lå tidligere i layout.tsx, altså
 * på hver eneste side. Det gjør det uklart for en maskin hvilken URL som ER
 * Reflektor. Markeringen ligger nå kun på «/», og andre sider refererer til
 * den med @id i stedet for å gjenta den.
 *
 * Bakgrunnen er målt: «reflektor» (250 søk/mnd) rangerer på plass 5 – via
 * /kontaktoss, ikke forsiden. Forsiden bærer ikke merkevaren i dag.
 *
 * VideoObject implementeres først når thumbnail-filer finnes (vedlegg A 11).
 */
const ORG_ID = "https://www.reflektor.no/#organisasjon";

export function OrganisasjonSchema() {
  const data = {
    "@context": "https://schema.org",
    // LocalBusiness fordi det er et fysisk kontor med besøksadresse i Oslo,
    // og fordi stedsangivelsen er en del av entiteten AI-svar siterer.
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.navn,
    legalName: site.kontakt.firma,
    url: "https://www.reflektor.no/",
    email: site.kontakt.epost,
    telephone: site.kontakt.telefon,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tvetenveien 162",
      postalCode: "0671",
      addressLocality: site.kontakt.sted,
      addressCountry: "NO",
    },
    // Organisasjonsnummer som PropertyValue, ikke vatID: vatID er
    // MVA-nummeret (NO … MVA), som ikke er det samme som org.nr.
    identifier: {
      "@type": "PropertyValue",
      name: "Organisasjonsnummer",
      value: site.kontakt.orgnr.replace(/\s/g, ""),
    },
    areaServed: "NO",
    // Verifisert 15.09.2026 mot dagens reflektor.no, ikke mot cache.
    // Legg aldri til en profil som ikke er bekreftet – en død sameAs-lenke
    // svekker entitetssignalet i stedet for å styrke det.
    sameAs: [
      "https://www.facebook.com/reflektor.no/",
      "https://www.instagram.com/reflektor.no/",
      "https://www.linkedin.com/company/reflektor-as",
      "https://ocast.com/no/reflektor",
    ],
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
      // Prisen er per måned. Uten enheten leser en maskin 30 000 som
      // engangsbeløp, og da er markeringen verre enn ingen markering.
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: tilbud.prisPerManed,
        priceCurrency: tilbud.valuta,
        unitCode: "MON",
        billingIncrement: 1,
      },
      availability: "https://schema.org/InStock",
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
