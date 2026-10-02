import type { MetadataRoute } from "next";
import { artikler, artikkelSlugs } from "@/content/artikler";
import { alleLandingssider } from "@/content/site";
import { kundecaser } from "@/content/caser";
import { basisUrl } from "@/lib/miljo";

/**
 * SLUGS SITEMAPET IKKE SKAL INNEHOLDE.
 *
 * `/sosiale-medier-byra` har `status: "live"` i site.ts, og fikk derfor
 * prioritet 0,9 — nest høyest på hele nettstedet. Ruten er 301-et til `/`
 * siden cutover 02.10.2026 (AGENTS.md, bestilt 15.09.2026). Et sitemap er listen over sider vi ber
 * Google indeksere, og dette er en side vi allerede har bestemt skal
 * forsvinne. Samme selvmotsigelse som de ni bloggslugene under.
 *
 * `status` sier at ADRESSEN lever — den er Final URL i Google Ads og skal
 * ikke røres. Den sier ingenting om at det finnes innhold der.
 */
const utelatt = new Set(["sosiale-medier-byra"]);

/**
 * SISTE ENDRINGSDATO PER SIDE. Lagt til 02.10.2026.
 *
 * HVORFOR LISTA ER HÅNDHOLDT. `lastmod` er bare verdt noe når den er sann.
 * Google ignorerer feltet for hele nettstedet hvis det ikke er konsekvent
 * riktig, og byggetidspunktet er ikke en endringsdato — det ville påstått
 * at hver side ble revidert ved hver deploy, også når vi bare rettet en
 * knappefarge.
 *
 * Her sto derfor ingenting, og 16 av 31 URL-er manglet `lastmod`. Det er
 * den motsatte ytterligheten: en side uten dato leses som «ukjent», ikke
 * som «uendret», og da velger Google selv når den skal se innom.
 *
 * LØSNINGEN ER ÉN KILDE SOM OPPDATERES FOR HÅND. Artiklene har sin egen
 * ekte dato og står utenfor denne lista. Resten står her, og regelen er
 * enkel: endrer du innholdet på en side, flytt datoen. Gjør du det ikke,
 * la den stå. Datoen under er den dagen siden sist fikk endret innhold —
 * ikke den dagen noen rørte en fil.
 */
const SIST_ENDRET: Record<string, string> = {
  "/": "2026-10-02",
  "/innholdsproduksjon": "2026-10-02",
  "/reklamefilm": "2026-10-02",
  "/videoproduksjon-i-oslo": "2026-09-30",
  "/employer-branding-video-oslo": "2026-09-29",
  "/eventfotograf-eventvideo": "2026-09-30",
  "/kjeder": "2026-09-29",
  "/reels-produksjon": "2026-09-30",
  "/kontaktoss": "2026-10-02",
  "/vart-arbeid": "2026-09-30",
  "/om-oss": "2026-10-02",
  "/faq": "2026-09-29",
  "/personvern": "2026-10-02",
  "/blogg": "2026-10-02",
  "/en": "2026-10-02",
};

/** Datoen cutover ble gjennomført. Brukes der ingenting annet er kjent. */
const CUTOVER = "2026-10-02";

/**
 * Henter datoen for en sti, og faller tilbake på cutover-datoen.
 *
 * Fallbacken er ikke en gjetning: alt på nettstedet ble gjennomgått og
 * publisert på nytt den dagen. Den er likevel ment som et sikkerhetsnett —
 * en ny side skal føres opp i lista over.
 */
function sistEndret(sti: string): string {
  return SIST_ENDRET[sti] ?? CUTOVER;
}

/** /takk er bevisst utelatt – kvitteringssiden skal ikke indekseres. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (sti: string) => `${basisUrl()}${sti}`;

  return [
    /*
      FORSIDEN UTEN SKRÅSTREK. Rettet 29.09.2026.

      Her sto `url("/")`, altså «https://www.reflektor.no/». Canonical-taggen
      på samme side sier «https://www.reflektor.no» — uten. Forskjellen er
      ikke vår: Next normaliserer bort skråstreken i canonical etter
      `trailingSlash`-innstillingen, mens sitemapet skriver ut nøyaktig det
      det får.

      To strenger for nettstedets viktigste adresse er noe Google må tolke
      seg ut av. Her er det ett tegn å rette, og da retter vi det på siden
      som lar seg rette.
    */
    { url: basisUrl(), priority: 1, lastModified: sistEndret("/") },
    // Kommersielle landingssider prioriteres – de bærer leadsene.
    ...alleLandingssider
      .filter((side) => !utelatt.has(side.slug))
      .map((side) => ({
        url: url(`/${side.slug}`),
        priority: side.status === "live" ? 0.9 : 0.5,
        lastModified: sistEndret(`/${side.slug}`),
      })),
    /*
       /kjeder er en kommersiell side på linje med landingssidene, men den
       ligger ikke i `alleLandingssider` — den er ikke en gammel
       Squarespace-URL og har ingen annonsegruppe. Derfor står den her.
    */
    { url: url("/kjeder"), priority: 0.9, lastModified: sistEndret("/kjeder") },
    /* /reels-produksjon er ny 30.09.2026 og av samme type som /kjeder. */
    {
      url: url("/reels-produksjon"),
      priority: 0.9,
      lastModified: sistEndret("/reels-produksjon"),
    },
    {
      url: url("/kontaktoss"),
      priority: 0.8,
      lastModified: sistEndret("/kontaktoss"),
    },
    {
      url: url("/vart-arbeid"),
      priority: 0.7,
      lastModified: sistEndret("/vart-arbeid"),
    },
    /*
      KUNDECASENE HAR INGEN EGEN DATO I INNHOLDET, og skal ikke få en
      oppdiktet. De ble alle publisert på nytt ved cutover, og det er den
      datoen som er sann for dem.
    */
    ...kundecaser.map((c) => ({
      url: url(`/vart-arbeid/${c.slug}`),
      priority: 0.6,
      lastModified: CUTOVER,
    })),
    { url: url("/om-oss"), priority: 0.6, lastModified: sistEndret("/om-oss") },
    { url: url("/faq"), priority: 0.6, lastModified: sistEndret("/faq") },
    /*
      /personvern lå utenfor sitemapet fordi siden var `noindex` — en
      innstilling som var arvet fra stubben og aldri vurdert. Sperren er
      fjernet 29.09.2026, og da hører adressen hjemme her. Lav prioritet:
      den skal finnes og kunne siteres, ikke konkurrere med salgssidene.
    */
    {
      url: url("/personvern"),
      priority: 0.3,
      lastModified: sistEndret("/personvern"),
    },
    /*
      /en er én engelsk oppsummering, ikke en engelsk utgave av nettstedet.
      Lav prioritet av samme grunn som /personvern: den skal finnes og kunne
      indekseres, ikke konkurrere med salgssidene. hreflang på forsiden og
      på /en forteller Google hvordan de to henger sammen.
    */
    { url: url("/en"), priority: 0.4, lastModified: sistEndret("/en") },
    // Bloggen beholdes for lenkeverdien, men prioriteres lavt.
    { url: url("/blogg"), priority: 0.4, lastModified: sistEndret("/blogg") },
    /*
      ARTIKLENE, IKKE ALLE SLUGENE. Sitemapet mappet over `bloggSlugs`, som
      også lister ni slugs uten innhold — tre aliaser og seks døde, alle 301
      fra 21.09.2026. Et sitemap som annonserer URL-er som omdirigerer er en
      selvmotsigelse: det er en liste over sider vi ber Google indeksere, og
      de ni er sider vi ber Google glemme. `artikler` er de som finnes, og
      tallet skal ikke stå skrevet her — det endres når det skrives en ny.

      LASTMODIFIED STÅR NÅ PÅ ALLE URL-ENE. Endret 02.10.2026 — her sto at
      det «står bare her», fordi de øvrige sidene ikke hadde noen ekte dato.
      Begrunnelsen var riktig om byggetidspunktet og er beholdt i
      SIST_ENDRET øverst; konklusjonen var feil. En URL uten `lastmod`
      leses som «ukjent», ikke som «uendret», og 16 av 31 URL-er sto slik.

      Artiklene bruker sin egen `oppdatert`, og `publisert` når de ikke er
      rørt. Det er samme verdi som `dateModified` i markeringen, og de to
      skal aldri si forskjellige ting om samme side.
    */
    ...artikkelSlugs.map((slug) => ({
      url: url(`/blogg/${slug}`),
      priority: 0.3,
      lastModified:
        artikler.find((a) => a.slug === slug)!.oppdatert ??
        artikler.find((a) => a.slug === slug)!.publisert,
    })),
  ];
}
