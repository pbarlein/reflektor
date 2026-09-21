import { cookies } from "next/headers";

import { LEST_KAPSEL, lesMaske } from "@/lib/lesing";

/**
 * Serversiden av lesestatusen, skilt ut i egen fil.
 *
 * `next/headers` finnes bare i server-komponenter. Lå det i lesing.ts — som
 * lesesporingen i nettleseren også importerer fra — ville byggen dra et
 * server-API inn i klientpakken og stoppe. Skillet er derfor ikke
 * ryddighet, det er en forutsetning for at det bygger.
 */
export async function lestAvBrukeren(): Promise<Set<number>> {
  const bok = await cookies();
  return lesMaske(bok.get(LEST_KAPSEL)?.value);
}
