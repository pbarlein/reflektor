import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAVN, cookieValg, signerSesjon } from "@/lib/sesjon";
import { devInnloggingTillatt } from "@/lib/utvikling";

/**
 * Innlogging uten Google — kun lokalt. Se src/lib/utvikling.ts for de to
 * betingelsene som må holde, og hvorfor det er to og ikke én.
 *
 * Endepunktet svarer 404 og ikke 403 når det er avslått. En 403 bekrefter at
 * ruta finnes.
 */
export async function POST(foresporsel: NextRequest) {
  if (!devInnloggingTillatt()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const svar = NextResponse.redirect(new URL("/", foresporsel.url), {
    status: 303,
  });
  svar.cookies.set(
    COOKIE_NAVN,
    await signerSesjon({
      // Tydelig oppdiktet navn. Ser man dette i et skjermbilde, er det
      // umiddelbart klart at skjermbildet er tatt lokalt.
      epost: "utvikling@reflektor.no",
      navn: "Lokal utvikling",
      bilde: "",
    }),
    cookieValg(new URL(foresporsel.url).protocol === "https:"),
  );
  return svar;
}
