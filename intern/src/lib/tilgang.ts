import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_NAVN, lesSesjon, type Bruker } from "@/lib/sesjon";

/**
 * Tilgangskontroll for server-komponenter.
 *
 * PROXYEN ER IKKE NOK ALENE, og Next sier det selv: proxy-laget er en
 * «optimistisk sjekk», ikke en autorisasjonsløsning. Den er der for at en
 * utlogget bruker skal lande på innloggingen uten å laste en tom side —
 * ikke for at sidene skal slippe å sjekke.
 *
 * Derfor kaller HVER beskyttet side `krevBruker()`. Doble sjekker er
 * billige; en beskyttet side som kun er beskyttet av en matcher-regel, er
 * ett regex-uhell unna å være åpen.
 */
export async function krevBruker(): Promise<Bruker> {
  const bruker = await hentBruker();
  if (!bruker) redirect("/logg-inn");
  return bruker;
}

export async function hentBruker(): Promise<Bruker | null> {
  const bok = await cookies();
  return lesSesjon(bok.get(COOKIE_NAVN)?.value);
}

/**
 * Snarvei til fornavnet, til hilsenen på forsiden.
 *
 * Google gir «Magne Finseth da Fonseca». En hilsen skal bruke det folk
 * kalles, ikke det som står i folkeregisteret.
 */
export function fornavn(bruker: Bruker): string {
  return bruker.navn.trim().split(/\s+/)[0] || bruker.epost.split("@")[0];
}
