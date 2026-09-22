import { site, tilbud } from "@/content/site";
import { basisUrl } from "@/lib/miljo";
import { googleProfil } from "@/content/anmeldelser";
import { omoss } from "@/content/omoss";

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
const ORG_ID = `${basisUrl()}/#organisasjon`;

export function OrganisasjonSchema() {
  const data = {
    "@context": "https://schema.org",
    // LocalBusiness fordi det er et fysisk kontor med besøksadresse i Oslo,
    // og fordi stedsangivelsen er en del av entiteten AI-svar siterer.
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.navn,
    legalName: site.kontakt.firma,
    url: `${basisUrl()}/`,
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

/**
 * Én Service per landingsside, koblet til Organization.
 *
 * `abonnementspris` ER VALGFRI, OG STANDARD ER AV — endret 21.09.2026.
 *
 * Komponenten hardkodet abonnementsprisen inn i `offers` for hver eneste
 * side som brukte den. Det var riktig så lenge den bare sto på forsiden.
 * Med fem tjenestesider blir det feil markering på fire av dem: en
 * reklamefilm er et prosjekt, ikke 30 000 kr i måneden, og en maskin som
 * leser JSON-LD har ingen måte å se at påstanden ikke gjelder.
 *
 * Feil pris i markeringen er verre enn ingen pris. Ingen pris er en
 * manglende opplysning; feil pris er en usann opplysning, og den forplanter
 * seg til det som siterer den.
 *
 * Prosjektsidene sender derfor ikke inn prisen. De får `offers` først når
 * Reflektor har en fra-pris å oppgi — se TBD-ene i src/content/tjenester.ts.
 *
 * `serviceType` er nytt og er anti-kannibalisering på maskinnivå: fem
 * Service-noder med identisk type og beskrivelse er fem sider som sier det
 * samme til det som leser markeringen. Se docs/sidearkitektur.md.
 */
export function TjenesteSchema({
  navn,
  beskrivelse,
  sti,
  tjenestetype,
  abonnementspris = false,
  fraPris = false,
}: {
  navn: string;
  beskrivelse: string;
  sti: string;
  tjenestetype?: string;
  abonnementspris?: boolean;
  /**
   * Oppgir `tilbud.fraPrisProsjekt` som en MINSTEPRIS, ikke som en pris.
   *
   * Forskjellen er ikke pedantisk. `price` betyr «dette koster det», og
   * det ville vært usant for et prosjekt som starter på 40 000 og kan
   * ende hvor som helst. `PriceSpecification.minPrice` er schema.orgs
   * måte å si «fra», og det er nøyaktig påstanden vi kan belegge.
   *
   * Grunnen til at det er verdt å markere opp i det hele tatt: AEO vekter
   * pristransparens tungt, og de fleste norske byråer oppgir ingenting.
   * Et tall en språkmodell kan lese er et tall den kan gjengi.
   */
  fraPris?: boolean;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: navn,
    description: beskrivelse,
    url: `${basisUrl()}${sti}`,
    ...(tjenestetype ? { serviceType: tjenestetype } : {}),
    provider: { "@id": ORG_ID },
    areaServed: "NO",
    ...(!fraPris
      ? {}
      : {
          offers: {
            "@type": "Offer",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: tilbud.fraPrisProsjekt,
              priceCurrency: tilbud.valuta,
            },
            availability: "https://schema.org/InStock",
          },
        }),
    ...(!abonnementspris
      ? {}
      : {
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
        }),
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
export function FaqSchema({
  qa,
}: {
  qa: { sporsmal: string; svar: string }[];
}) {
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

/**
 * BreadcrumbList.
 *
 * DETTE ER DEN ENE MARKERINGEN PÅ SIDEN SOM FAKTISK GIR ET RICH RESULT.
 * Google viser fortsatt brødsmuler i søkeresultatet — de erstatter den grå
 * URL-linja med en klikkbar sti. FAQ-funksjonen er død (se A41), men denne
 * lever, og den er dokumentert i Googles egen strukturerte data-oversikt.
 *
 * Den gjør to ting for et kundecase: den forteller Google at
 * `/vart-arbeid/egon` hører til `/vart-arbeid`, og den gir en språkmodell
 * hierarkiet uten å måtte gjette det ut av URL-en.
 *
 * `item` utelates på siste ledd. Det er Googles egen anbefaling — det siste
 * leddet ER den aktuelle siden, og en lenke til seg selv er støy.
 */
export function BrodsmuleSchema({
  ledd,
}: {
  ledd: { navn: string; sti?: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ledd.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.navn,
      ...(l.sti ? { item: `${basisUrl()}${l.sti}` } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Ett kundecase som Article.
 *
 * SCHEMA.ORG HAR INGEN «CaseStudy»-TYPE. Article er det nærmeste som
 * finnes og som faktisk blir lest. Alternativet — CreativeWork — er så
 * generisk at det ikke sier noe.
 *
 * `about` er kunden som egen Organization. Det er hele poenget for AEO:
 * spørsmålet en språkmodell får er «hvem lager innhold for Egon», ikke
 * «hva heter Reflektors caser». Uten `about` er kundenavnet bare et ord i
 * en overskrift; med den er det en entitet knyttet til vår.
 *
 * `author` og `publisher` peker på Reflektor via @id, så entiteten ikke
 * gjentas. Det er samme grep som TjenesteSchema bruker.
 *
 * INGEN aggregateRating, ingen oppdiktet dato. Vi vet når vi hentet
 * tallene, ikke når siden ble skrevet, og en `datePublished` vi ikke kan
 * belegge ville vært en påstand for maskiner vi ikke ville tort å skrive
 * for mennesker.
 */
export function KundecaseSchema({
  tittel,
  beskrivelse,
  sti,
  kunde,
}: {
  tittel: string;
  beskrivelse: string;
  sti: string;
  kunde: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tittel,
    description: beskrivelse,
    url: `${basisUrl()}${sti}`,
    inLanguage: "nb-NO",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    about: { "@type": "Organization", name: kunde },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Vårt arbeid",
      url: `${basisUrl()}/vart-arbeid`,
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
 * Folkene, som `Person` knyttet til Reflektor.
 *
 * DETTE ER ET ENTITETSSIGNAL, ikke et rich result. Google viser ingen
 * ansattliste i søkeresultatet, og det er ikke poenget. Poenget er at
 * `employee` er den eneste maskinlesbare måten å si at disse fire menneskene
 * hører til dette selskapet — og «hvem jobber i Reflektor» er nøyaktig den
 * typen spørsmål en svarmotor får og besvarer fra JSON-LD, ikke fra HTML.
 *
 * `jobTitle` er rollene slik de står synlig på siden. Ingen e-post, ingen
 * bilder, ingen profilsider: markeringen skal ikke påstå mer enn siden viser.
 *
 * Markeringen henger på Organization via @id, så entiteten ikke gjentas.
 */
export function TeamSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${basisUrl()}/om-oss`,
    mainEntity: {
      "@id": ORG_ID,
      employee: omoss.team.ansatte.map((a) => ({
        "@type": "Person",
        name: a.navn,
        jobTitle: a.rolle,
        worksFor: { "@id": ORG_ID },
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
 * Article-markering for et blogginnlegg.
 *
 * `datePublished` er den EKTE datoen fra Squarespace. Ferskhet er en
 * siteringsfaktor — 83 % av AI-siteringer på kommersielle søk går til sider
 * oppdatert siste 12 måneder — men en dato vi flytter for å se ferskere ut
 * er en usann påstand for maskiner vi ikke ville tort å skrive for
 * mennesker. Samme regel som KundecaseSchema følger.
 *
 * Ingen `dateModified`. Vi vet når teksten ble publisert på Squarespace, og
 * vi vet når den ble flyttet hit — men en flytting er ikke en revisjon, og
 * å markere den som det ville vært å jukse med nettopp det signalet.
 */
export function ArtikkelSchema({
  tittel,
  beskrivelse,
  sti,
  publisert,
}: {
  tittel: string;
  beskrivelse: string;
  sti: string;
  publisert: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tittel,
    description: beskrivelse,
    datePublished: publisert,
    inLanguage: "nb-NO",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${basisUrl()}${sti}` },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
