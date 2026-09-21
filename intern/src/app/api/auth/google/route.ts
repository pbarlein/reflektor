import { NextResponse, type NextRequest } from "next/server";

import {
  autorisasjonsUrl,
  googleOppsett,
  lagKodeVerifiser,
  lagState,
  returadresse,
} from "@/lib/google";
import { trygtNeste } from "@/lib/retursti";

/** Fem minutter. Nok til å velge konto, for lite til å ligge og slenge. */
const FLYT_LEVETID = 60 * 5;

/**
 * Steg 1: send brukeren til Google.
 *
 * De tre verdiene vi må huske til returen — state, PKCE-verifiseren og hvor
 * brukeren egentlig skulle — legges i korte, httpOnly cookies. Ikke i en
 * serverside-tabell: det ville krevd et lager for tre verdier som lever i
 * under et minutt, og gjort innloggingen avhengig av at lageret er oppe.
 */
export async function GET(foresporsel: NextRequest) {
  const oppsett = googleOppsett();
  if (!oppsett) {
    return NextResponse.redirect(
      new URL("/logg-inn?feil=mangler-oppsett", foresporsel.url),
    );
  }

  const state = lagState();
  const kodeVerifiser = lagKodeVerifiser();
  const retur = returadresse(foresporsel);
  const neste = trygtNeste(foresporsel.nextUrl.searchParams.get("neste"));

  const svar = NextResponse.redirect(
    await autorisasjonsUrl({ oppsett, retur, state, kodeVerifiser }),
  );

  const erHttps = new URL(foresporsel.url).protocol === "https:";
  const valg = {
    httpOnly: true,
    secure: erHttps,
    sameSite: "lax" as const,
    path: "/",
    maxAge: FLYT_LEVETID,
  };
  svar.cookies.set("rf_state", state, valg);
  svar.cookies.set("rf_verifiser", kodeVerifiser, valg);
  svar.cookies.set("rf_neste", neste, valg);
  return svar;
}
