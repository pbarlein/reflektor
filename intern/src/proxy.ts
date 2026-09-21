import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAVN, lesSesjon } from "@/lib/sesjon";

/**
 * `proxy.ts`, IKKE `middleware.ts`.
 *
 * Next 16 har døpt om middleware til proxy. `middleware.ts` virker fortsatt,
 * men er merket deprecated, og filen ville vært en tidsinnstilt
 * oppgraderingsjobb. Funksjonen er den samme.
 *
 * ROLLEN ER SMAL MED VILJE. Dette laget gjør ÉN ting: sender en forespørsel
 * uten gyldig sesjonscookie til innloggingen. Selve autorisasjonen skjer i
 * `krevBruker()` på hver side — se src/lib/tilgang.ts for hvorfor begge
 * deler finnes.
 */
export async function proxy(foresporsel: NextRequest) {
  const { pathname, search } = foresporsel.nextUrl;

  const bruker = await lesSesjon(foresporsel.cookies.get(COOKIE_NAVN)?.value);
  if (bruker) {
    // Allerede innlogget? Da er innloggingssiden feil sted å være.
    if (pathname === "/logg-inn") {
      return NextResponse.redirect(new URL("/", foresporsel.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/logg-inn" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  /*
   * `neste` tar brukeren dit hen faktisk skulle, etter innlogging. Uten den
   * lander enhver delt lenke til en rubrikk på forsiden, og mottakeren må
   * lete seg fram igjen.
   *
   * KUN STIEN, aldri en absolutt URL: `neste=https://angriper.no` ville gjort
   * innloggingen til en åpen videresending. Verdien valideres én gang til
   * der den brukes — se /api/auth/retur.
   */
  const mal = new URL("/logg-inn", foresporsel.url);
  if (pathname !== "/") mal.searchParams.set("neste", pathname + search);
  return NextResponse.redirect(mal);
}

export const config = {
  /*
   * Alt unntatt Next sine egne filer, ikoner og media i /medier.
   *
   * MEDIA ER BEVISST UTENFOR. Klippene og bildene er de samme filene som
   * ligger åpent på reflektor.no; å kjøre hver enkelt av dem gjennom en
   * HMAC-verifisering er ren kostnad. Er det innhold som IKKE skal være
   * åpent, hører det ikke hjemme i /public i det hele tatt — da skal det
   * ligge bak et eget endepunkt. Se LES-MEG.md.
   *
   * ROBOTS.TXT MÅ OGSÅ UTENFOR, og det er en RETTELSE. Den lå innenfor, og
   * da svarte den 307 mot /logg-inn — altså fikk ingen crawler noen gang
   * se `Disallow: /`. En robots.txt bak innlogging er en robots.txt som
   * ikke finnes, og en crawler uten regler antar at alt er lov.
   *
   * Sidene er riktignok `noindex` uansett, så dette var aldri eneste
   * sperre. Men å ha to sperrer der den ene er slått av uten at noen vet
   * det, er verre enn å ha én.
   */
  matcher: [
    "/((?!_next/static|_next/image|medier/|robots.txt|favicon.ico|.*\\.svg$).*)",
  ],
};
