import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/**
 * Intranettet har ingen redirects og ingen rewrites.
 *
 * Det er verdt å si eksplisitt: hovedprosjektets `next.config.ts` bærer et
 * redirect-kart bygget på faktiske visningstall fra Search Console, og det
 * er det mest verdifulle enkeltstående i det repoet. Ingenting av det hører
 * hjemme her. Dette prosjektet har ingen historikk å bevare, ingen lenker
 * utenfra, og skal ikke ha noen.
 */
const nextConfig: NextConfig = {
  /*
   * ROTEN SETTES EKSPLISITT. Uten den finner Turbopack to package-lock.json
   * — hovedprosjektets og vårt — og velger hovedprosjektets mappe som
   * arbeidsrot. Da leter den etter moduler ett nivå for høyt, og
   * filsporingen tar med seg hele salgssiden i byggen.
   */
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },

  /*
   * Bildene ligger i /public/medier og serveres lokalt. Ingen eksterne
   * domener er tillatt — et internt verktøy skal ikke kunne bli en åpen
   * bildeproxy hvis noen en dag legger inn en URL i innholdet.
   */
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
