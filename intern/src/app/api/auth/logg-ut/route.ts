import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAVN } from "@/lib/sesjon";

/**
 * Utlogging er POST, ikke GET.
 *
 * En GET-utlogging kan utløses av et <img src="/api/auth/logg-ut"> på en
 * hvilken som helst side. Det er ikke farlig, men det er irriterende på en
 * måte som ser ut som en feil i intranettet. POST med en skjemaknapp koster
 * ingenting og fjerner muligheten.
 *
 * MERK at dette bare rydder VÅR cookie. Google-sesjonen i nettleseren står,
 * og det er riktig: vi skal ikke logge folk ut av Gmail fordi de forlot
 * intranettet.
 */
export async function POST(foresporsel: NextRequest) {
  const svar = NextResponse.redirect(new URL("/logg-inn", foresporsel.url), {
    // 303 gjør at nettleseren følger opp med GET. Uten den forsøker den
    // POST mot innloggingssiden, som svarer 405.
    status: 303,
  });
  svar.cookies.set(COOKIE_NAVN, "", { path: "/", maxAge: 0 });
  return svar;
}
