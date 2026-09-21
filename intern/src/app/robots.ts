import type { MetadataRoute } from "next";

/**
 * Ingenting her skal indekseres. Noensinne.
 *
 * Dette er beltet ved siden av bukseselene i layout.tsx: `noindex` i
 * <head> gjelder sider som faktisk lastes, robots.txt gjelder crawleren som
 * vurderer om den skal laste dem. Begge deler, og ingen bryter å skru av.
 *
 * Merk at robots.txt ikke er en tilgangskontroll — den ber pent. Det som
 * faktisk stenger, er innloggingen i src/proxy.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
