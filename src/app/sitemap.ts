import type { MetadataRoute } from "next";
import { site, tjenester, caser, bloggSlugs } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (sti: string) => `${site.domene}${sti}`;

  return [
    { url: url("/"), priority: 1 },
    { url: url("/tjenester"), priority: 0.8 },
    ...tjenester.map((t) => ({ url: url(`/tjenester/${t.slug}`), priority: 0.8 })),
    { url: url("/arbeid"), priority: 0.7 },
    ...caser.map((c) => ({ url: url(`/arbeid/${c.slug}`), priority: 0.6 })),
    { url: url("/blogg"), priority: 0.7 },
    ...bloggSlugs.map((slug) => ({ url: url(`/blogg/${slug}`), priority: 0.6 })),
    { url: url("/om-oss"), priority: 0.5 },
    { url: url("/kontakt"), priority: 0.5 },
    { url: url("/gratis-strategimote"), priority: 0.9 },
  ];
}
