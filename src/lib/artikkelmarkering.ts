/**
 * JSON-LD-objektene for artikler og forfatteren.
 *
 * HVORFOR DE BOR HER OG IKKE I Schema.tsx. Markeringen er data, ikke
 * utforming — og data skal kunne testes. `Schema.tsx` er en `.tsx`-fil, og
 * node kan ikke importere JSX i en test (`ERR_UNKNOWN_FILE_EXTENSION`).
 * Så lenge objektene lå der, var den eneste måten å kontrollere dem på å
 * bygge nettstedet og lese HTML-en.
 *
 * Feilen det verner mot er usynlig: et `author` som peker på selskapet i
 * stedet for personen, eller et `dateModified` som faller ut, ser helt likt
 * ut på siden. Google og språkmodellene merker det. De sier ikke fra.
 *
 * Komponentene i Schema.tsx gjør nå bare én ting: serialiserer det disse
 * funksjonene returnerer. Se tests/artikkelschema.test.ts.
 */

import { basisUrl } from "./miljo";

export const orgId = () => `${basisUrl()}/#organisasjon`;
export const forfatterId = () => `${basisUrl()}/om-oss#pal-barlein`;

/**
 * Forfatteren, ett sted.
 *
 * Bylinen, forfatterboksen og markeringen leser alle herfra, slik at navnet
 * og lenkene ikke kan komme i utakt mellom de tre.
 */
export const forfatter = {
  navn: "Pål Barlein",
  rolle: "CEO i Reflektor",
  sti: "/om-oss#pal-barlein",
  linkedin: "https://www.linkedin.com/in/p%C3%A5l-barlein-36131926/",
} as const;

/**
 * Personen i sin helhet. Refereres fra hver artikkel med `@id`, slik at
 * objektet ikke gjentas femten ganger — og slik at en stavefeil i den
 * sekstende ikke blir en egen person i grafen.
 */
export function forfatterMarkering() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": forfatterId(),
    name: forfatter.navn,
    jobTitle: "CEO",
    url: `${basisUrl()}${forfatter.sti}`,
    worksFor: { "@id": orgId() },
    /* Eneste eksterne stedet identiteten kan bekreftes. Det er det `sameAs` er til for. */
    sameAs: [forfatter.linkedin],
  };
}

export type Artikkelmarkering = {
  tittel: string;
  beskrivelse: string;
  sti: string;
  publisert: string;
  /** Settes bare når artikkelen faktisk er innholdsoppdatert. */
  oppdatert?: string;
  /** Delingsbildet, uten vertsnavn. Se scripts/og-bilder.ts. */
  bilde?: string;
};

export function artikkelMarkering({
  tittel,
  beskrivelse,
  sti,
  publisert,
  oppdatert,
  bilde,
}: Artikkelmarkering) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tittel,
    description: beskrivelse,
    datePublished: publisert,
    /*
      `dateModified` ER ALLTID MED. Endret 02.10.2026.

      Her sto den bare når `oppdatert` fantes, med den begrunnelsen at en
      dato satt til byggetidspunktet ville vært usann. Den begrunnelsen
      står — og den er grunnen til at feltet IKKE settes til i dag, men til
      publiseringsdatoen når ingenting er endret.

      Forskjellen er at Google leser et manglende `dateModified` som
      «ukjent», ikke som «uendret». En artikkel som aldri er rørt HAR en
      siste endringsdato, og det er den den ble skrevet.
    */
    dateModified: oppdatert ?? publisert,
    /*
      Google ber uttrykkelig om et bilde på Article. Uten det kan
      artikkelen ikke vises med bilde i søkeresultater eller i Discover.
    */
    ...(bilde ? { image: `${basisUrl()}${bilde}` } : {}),
    inLanguage: "nb-NO",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${basisUrl()}${sti}` },
    /*
      FORFATTEREN ER EN PERSON, ikke selskapet. `publisher` er fortsatt
      organisasjonen: det er den som utgir, og den som eier nettstedet.
    */
    author: { "@id": forfatterId() },
    publisher: { "@id": orgId() },
  };
}
