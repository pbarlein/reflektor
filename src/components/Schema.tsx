import { site, tilbud } from "@/content/site";
import { googleProfil } from "@/content/anmeldelser";

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
    /*
     * AggregateRating — og la det være helt klart hva den kan og ikke kan.
     *
     * DEN GIR IKKE STJERNER I GOOGLE. Googles egen dokumentasjon for
     * Review snippet, lest 16.09.2026, sier det rett ut: «If the entity
     * that's being reviewed controls the reviews about itself, their pages
     * that use LocalBusiness or any other type of Organization structured
     * data are ineligible for star review feature.» Forsiden er Reflektors
     * egen side om Reflektor. Den blir aldri kvalifisert.
     *
     * A33 sa at slik markering også er et REGELBRUDD. Det var for sterkt,
     * og er rettet: Google sier «ineligible», ikke «disallowed». Sidene
     * beholder vanlig søkeplassering; de får bare ikke stjernene.
     *
     * HVORFOR DEN LIKEVEL STÅR HER: rich results er ikke den eneste
     * leseren av JSON-LD. Språkmodellene henter entitetsfakta herfra, de
     * kjører ikke JavaScript, og AGENTS.md lister entitetssignaler i
     * markup som ett av fire krav til synlighet. Tallet er sant, det er
     * hentet fra Googles egen oppføring, og det står ett sted i koden.
     * Kostnaden er null og risikoen er null. Da tar vi den lille sjansen
     * for at det gjør nytte et sted vi ikke måler.
     *
     * ratingValue må være et tall i JSON, ikke «5,0» med norsk komma.
     * ratingCount er alle elleve; reviewCount er de ni med tekst. Begge
     * deler er presist, og forskjellen er ikke tilfeldig.
     *
     * TALLET MÅ ETTERSES. Se merknaden ved googleProfil.
     */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
      ratingCount: googleProfil.antall,
      reviewCount: googleProfil.medTekst,
    },
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
    /*
     * Hva som inngår, som STRUKTUR og ikke bare som HTML.
     *
     * Punktene står allerede synlig på forsiden, men bare som en liste i
     * markupen. `hasOfferCatalog` er schema.orgs måte å si «dette er
     * delene tjenesten består av», og den koster ingenting: den leses av
     * det som leser JSON-LD, og ignoreres av alt annet.
     *
     * Ingen rich result kommer ut av dette — Google har ingen funksjon som
     * viser en tjenestes innhold. Grunnen er den samme som for
     * aggregateRating: språkmodellene henter entitetsfakta fra JSON-LD, de
     * kjører ikke JavaScript, og «hva inngår i abonnementet» er nettopp
     * spørsmålet noen stiller en svarmotor.
     *
     * Verdiene leses fra tilbud.inngar. Ingen ny tekst — det er de samme
     * setningene som står synlig, og de kan ikke gli fra hverandre.
     *
     * UNNTAKENE ER IKKE MARKERT OPP. Schema.org har ingen ærlig måte å si
     * «dette inngår ikke». Å presse dem inn i en description ville gjort
     * markeringen dårligere enn å la være.
     */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dette inngår",
      itemListElement: tilbud.inngar.map((punkt) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: punkt },
      })),
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
 *
 * INGEN RICH RESULT KOMMER UT AV DETTE. Google sluttet å vise FAQ rich
 * results 7. mai 2026 og fjernet dokumentasjonssiden i juni; den svarer nå
 * 301 til changelogen. Allerede fra 2023 var funksjonen begrenset til
 * «well-known, authoritative government and health websites», så den har
 * uansett aldri vært innen rekkevidde for et videobyrå.
 *
 * Grunnen til at blokken står er en annen, og den er uendret: JSON-LD er
 * der språkmodeller henter entitetsfakta — de kjører ikke JavaScript — og
 * AGENTS.md lister entitetssignaler i markup som ett av fire krav til
 * synlighet. Se A41 i docs/vedlegg-a.md.
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
