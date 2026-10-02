import { artikler } from "@/content/artikler";
import { site } from "@/content/site";
import { basisUrl, tillatIndeksering } from "@/lib/miljo";

/**
 * /blogg/rss.xml — RSS 2.0-feed for bloggen.
 *
 * HVORFOR DEN FINNES. Squarespace serverte en feed på `/blogg?format=rss`.
 * Det er Squarespaces egen konvensjon, ikke vår, og etter cutover svarte
 * adressen med HTML-oversikten i stedet — altså en feed som plutselig ikke
 * var en feed. Alt som abonnerte, sluttet å virke uten en feilmelding.
 *
 * Hvem abonnerer? Det vet vi ikke, og det er nettopp derfor den
 * gjenopprettes: en RSS-leser, en nyhetsaggregator eller et verktøy som
 * henter artikler er usynlig i både Ahrefs og GA4. «Ingen data» er ikke
 * bevis på at ingen bruker den — AGENTS.md, «Ahrefs-data må leses med
 * forbehold». Feeden koster én fil og kan ikke gjøre skade.
 *
 * `/blogg?format=rss` 301-er hit. Se next.config.ts.
 *
 * GENERERT FRA SAMME KILDE SOM OVERSIKTEN, `src/content/artikler.ts`. Ingen
 * copy finnes bare her, og en ny artikkel havner i feeden uten at noen må
 * huske det.
 *
 * SAMME BRYTER SOM RESTEN. Er indeksering avslått, svarer den 404 — som
 * /llms.txt. En feed er en invitasjon til å hente og republisere innhold, og
 * den skal ikke stå åpen på en forhåndsvisning. Se src/lib/miljo.ts.
 */
export const dynamic = "force-static";

/**
 * XML-escaping. Fem tegn, og alle fem må være med.
 *
 * `&` FØRST, ellers escapes ampersanden i `&lt;` på nytt. Rekkefølgen her er
 * ikke en smakssak — den er forskjellen mellom en gyldig feed og en som
 * ingen leser kan parse. Artikkeltitlene inneholder både `&` og
 * apostrofer.
 */
function xml(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Dato på RFC 822-form, som RSS 2.0 krever.
 *
 * `toUTCString()` gir «Mon, 21 Sep 2026 00:00:00 GMT». Det er formen
 * spesifikasjonen ber om, med den ene tillatte avviket den selv nevner:
 * «GMT» i stedet for «+0000». Validatorene godtar begge.
 *
 * `publisert` er en ren ISO-dato uten klokkeslett, så alle artikler står
 * som midnatt UTC. Det er riktig: datoen er det vi faktisk vet, og et
 * oppdiktet klokkeslett ville vært en presisjon vi ikke har.
 */
function rfc822(isoDato: string): string {
  return new Date(`${isoDato}T00:00:00Z`).toUTCString();
}

function lag(): string {
  const base = basisUrl();
  const sortert = [...artikler].sort((a, b) =>
    b.publisert.localeCompare(a.publisert),
  );

  /*
   * `lastBuildDate` er datoen til den nyeste artikkelen, ikke tidspunktet
   * feeden ble bygget. Feeden er statisk, så et byggetidspunkt ville
   * fortalt at noe var nytt hver gang vi deployet en knappefarge.
   */
  const sist = sortert[0]?.publisert;

  const poster = sortert.map((a) => {
    const url = `${base}/blogg/${a.slug}`;
    return [
      "    <item>",
      `      <title>${xml(a.tittel)}</title>`,
      `      <link>${xml(url)}</link>`,
      `      <guid isPermaLink="true">${xml(url)}</guid>`,
      `      <pubDate>${rfc822(a.publisert)}</pubDate>`,
      `      <description>${xml(a.beskrivelse)}</description>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(`${site.navn} – blogg`)}</title>`,
    `    <link>${xml(`${base}/blogg`)}</link>`,
    `    <description>${xml(
      "Artikler fra Reflektor om sosiale medier, videomarkedsføring, " +
        "innholdsproduksjon og employer branding.",
    )}</description>`,
    "    <language>nb-NO</language>",
    ...(sist ? [`    <lastBuildDate>${rfc822(sist)}</lastBuildDate>`] : []),
    /*
     * `atom:link rel="self"` er ikke pynt. Den sier hvor feeden selv bor,
     * og uten den klager både W3Cs validator og flere lesere — som
     * dessuten bruker den til å følge feeden om adressen flyttes.
     */
    `    <atom:link href="${xml(`${base}/blogg/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    ...poster,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function GET(): Response {
  if (!tillatIndeksering()) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(lag(), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
