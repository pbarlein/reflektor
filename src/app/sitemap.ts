import type { MetadataRoute } from "next";
import { artikler, artikkelSlugs } from "@/content/artikler";
import { alleLandingssider } from "@/content/site";
import { kundecaser } from "@/content/caser";
import { basisUrl } from "@/lib/miljo";

/**
 * SLUGS SITEMAPET IKKE SKAL INNEHOLDE.
 *
 * `/sosiale-medier-byra` har `status: "live"` i site.ts, og fikk derfor
 * prioritet 0,9 — nest høyest på hele nettstedet. Men ruten er en
 * plassholder (`UnderArbeid`), og ved cutover skal den 301-es til `/`
 * (AGENTS.md, bestilt 15.09.2026). Et sitemap er listen over sider vi ber
 * Google indeksere, og dette er en side vi allerede har bestemt skal
 * forsvinne. Samme selvmotsigelse som de ni bloggslugene under.
 *
 * `status` sier at ADRESSEN lever — den er Final URL i Google Ads og skal
 * ikke røres. Den sier ingenting om at det finnes innhold der.
 */
const utelatt = new Set(["sosiale-medier-byra"]);

/** /takk er bevisst utelatt – kvitteringssiden skal ikke indekseres. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (sti: string) => `${basisUrl()}${sti}`;

  return [
    { url: url("/"), priority: 1 },
    // Kommersielle landingssider prioriteres – de bærer leadsene.
    ...alleLandingssider
      .filter((side) => !utelatt.has(side.slug))
      .map((side) => ({
        url: url(`/${side.slug}`),
        priority: side.status === "live" ? 0.9 : 0.5,
      })),
    /*
       /kjeder er en kommersiell side på linje med landingssidene, men den
       ligger ikke i `alleLandingssider` — den er ikke en gammel
       Squarespace-URL og har ingen annonsegruppe. Derfor står den her.
    */
    { url: url("/kjeder"), priority: 0.9 },
    { url: url("/kontaktoss"), priority: 0.8 },
    { url: url("/vart-arbeid"), priority: 0.7 },
    ...kundecaser.map((c) => ({
      url: url(`/vart-arbeid/${c.slug}`),
      priority: 0.6,
    })),
    { url: url("/om-oss"), priority: 0.6 },
    { url: url("/faq"), priority: 0.6 },
    // Bloggen beholdes for lenkeverdien, men prioriteres lavt.
    { url: url("/blogg"), priority: 0.4 },
    /*
      ARTIKLENE, IKKE ALLE SLUGENE. Sitemapet mappet over `bloggSlugs`, som
      også lister ni slugs uten innhold — tre aliaser og seks døde, alle 301
      fra 21.09.2026. Et sitemap som annonserer URL-er som omdirigerer er en
      selvmotsigelse: det er en liste over sider vi ber Google indeksere, og
      de ni er sider vi ber Google glemme. `artikler` er de som finnes, og
      tallet skal ikke stå skrevet her — det endres når det skrives en ny.

      LASTMODIFIED STÅR BARE HER. Artiklene har en ekte dato — `publisert`,
      hentet fra Squarespace og ikke pyntet. De øvrige sidene har ingen.
      Google bruker lastmod bare når den er konsekvent riktig, og ignorerer
      feltet for hele nettstedet når den ikke er det; byggetidspunktet er
      ikke en endringsdato, og å sette det ville vært å påstå at hver side
      ble revidert ved hver deploy. Se samme begrunnelse i
      ArtikkelSchema for hvorfor `dateModified` også mangler der.
    */
    ...artikkelSlugs.map((slug) => ({
      url: url(`/blogg/${slug}`),
      priority: 0.3,
      lastModified: artikler.find((a) => a.slug === slug)!.publisert,
    })),
  ];
}
