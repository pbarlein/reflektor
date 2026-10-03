import { type NextRequest, NextResponse } from "next/server";

/**
 * Nøkkelen til oversiktssiden, byttet mot en informasjonskapsel.
 *
 * FILA HETER `proxy.ts` OG IKKE `middleware.ts`. Denne Next-versjonen har
 * døpt om konvensjonen, og `middleware` gir en advarsel i byggeloggen om at
 * den er utfaset. Se node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/proxy.md.
 *
 * HVORFOR HER OG IKKE I SIDEN SELV. En serverkomponent kan lese
 * informasjonskapsler, men ikke sette dem. Nøkkelen skal brukes ÉN gang, fra
 * en lenke Pål får tilsendt, og så forsvinne fra adressefeltet — ellers
 * ligger den i nettleserhistorikken og i enhver skjermdeling. Middleware er
 * det eneste stedet som kan ta imot adressen, sette kapselen og sende
 * videre til den rene adressen i samme omgang.
 *
 * KUN /paaminnelse. `matcher` under sørger for at middleware ikke kjører på
 * en eneste annen side. Resten av nettstedet er statisk og skal fortsette å
 * være det.
 */

import { PAAMINNELSE_KAPSEL } from "@/lib/paaminnelse";

/*
  KONSTANTEN LIGGER I ET BIBLIOTEK OG IKKE HER. Dokumentasjonen er tydelig
  på at proxy kjøres atskilt fra rendringskoden og i noen tilfeller på CDN-et:
  den skal ikke dele moduler med sidene. Da må navnet på kapselen bo et
  tredje sted som begge kan lese.
*/
export function proxy(req: NextRequest) {
  const nokkel = process.env.PAAMINNELSE_NOKKEL;
  const gitt = req.nextUrl.searchParams.get("k");

  if (!nokkel || !gitt || gitt !== nokkel) return NextResponse.next();

  const ren = new URL(req.nextUrl.pathname, req.nextUrl.origin);
  const svar = NextResponse.redirect(ren);
  svar.cookies.set(PAAMINNELSE_KAPSEL, nokkel, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/paaminnelse",
    maxAge: 365 * 24 * 60 * 60,
  });
  return svar;
}

export const config = { matcher: ["/paaminnelse"] };
