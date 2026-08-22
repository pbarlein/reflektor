import type { MetadataRoute } from "next";
import { site, alleLandingssider, caser, bloggSlugs } from "@/content/site";

/** /takk er bevisst utelatt – kvitteringssiden skal ikke indekseres. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (sti: string) => `${site.domene}${sti}`;

  return [
    { url: url("/"), priority: 1 },
    // Kommersielle landingssider prioriteres – de bærer leadsene.
    ...alleLandingssider.map((side) => ({
      url: url(`/${side.slug}`),
      priority: side.status === "live" ? 0.9 : 0.5,
    })),
    { url: url("/gratis-strategimote"), priority: 0.9 },
    { url: url("/kontaktoss"), priority: 0.8 },
    { url: url("/vart-arbeid"), priority: 0.7 },
    ...caser.map((c) => ({ url: url(`/vart-arbeid/${c.slug}`), priority: 0.6 })),
    { url: url("/om-oss"), priority: 0.6 },
    { url: url("/faq"), priority: 0.6 },
    // Bloggen beholdes for lenkeverdien, men prioriteres lavt.
    { url: url("/blogg"), priority: 0.4 },
    ...bloggSlugs.map((slug) => ({ url: url(`/blogg/${slug}`), priority: 0.3 })),
  ];
}
