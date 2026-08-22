import type { MetadataRoute } from "next";
import { basisUrl, tillatIndeksering } from "@/lib/miljo";

export default function robots(): MetadataRoute.Robots {
  // Standard: steng alt. Se src/lib/miljo.ts for hvorfor.
  if (!tillatIndeksering()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${basisUrl()}/sitemap.xml`,
  };
}
