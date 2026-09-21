import { NextResponse, type NextRequest } from "next/server";

import {
  googleOppsett,
  lesIdToken,
  returadresse,
  vekslInnKode,
} from "@/lib/google";
import { trygtNeste } from "@/lib/retursti";
import { COOKIE_NAVN, cookieValg, signerSesjon } from "@/lib/sesjon";

/**
 * Steg 3: Google sender brukeren tilbake hit med en kode.
 *
 * FEILMELDINGENE UTAD ER GROVKORNEDE MED VILJE. Brukeren får «kunne ikke
 * logge inn» og hvilket steg som feilet — ikke hvilket krav i id_token som
 * ikke stemte. Den som prøver seg, skal ikke få vite om domenet var feil
 * eller om e-posten var ubekreftet.
 */
export async function GET(foresporsel: NextRequest) {
  const url = foresporsel.nextUrl;
  const tilFeil = (kode: string) =>
    NextResponse.redirect(new URL(`/logg-inn?feil=${kode}`, foresporsel.url));

  const oppsett = googleOppsett();
  if (!oppsett) return tilFeil("mangler-oppsett");

  // Google melder selv fra når brukeren avbryter i kontovelgeren.
  if (url.searchParams.get("error")) return tilFeil("avbrutt");

  const kode = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const forventetState = foresporsel.cookies.get("rf_state")?.value;
  const kodeVerifiser = foresporsel.cookies.get("rf_verifiser")?.value;

  /*
   * STATE-SJEKKEN ER CSRF-VERNET. Uten den kan en angriper starte flyten med
   * SIN konto og lokke offeret til å fullføre den — offeret ender innlogget
   * som angriperen, og alt hen så gjør, skjer på angriperens konto.
   */
  if (!kode || !state || !forventetState || state !== forventetState) {
    return tilFeil("ugyldig-state");
  }
  if (!kodeVerifiser) return tilFeil("ugyldig-state");

  const idToken = await vekslInnKode({
    oppsett,
    kode,
    retur: returadresse(foresporsel),
    kodeVerifiser,
  });
  if (!idToken) return tilFeil("innveksling");

  const krav = lesIdToken(idToken, oppsett);
  if (!krav) return tilFeil("ikke-tilgang");

  const neste = trygtNeste(foresporsel.cookies.get("rf_neste")?.value);
  const svar = NextResponse.redirect(new URL(neste, foresporsel.url));

  const erHttps = new URL(foresporsel.url).protocol === "https:";
  svar.cookies.set(
    COOKIE_NAVN,
    await signerSesjon({
      epost: krav.epost,
      navn: krav.navn,
      bilde: krav.bilde,
    }),
    cookieValg(erHttps),
  );

  // Flytcookiene har gjort jobben sin og skal ikke ligge igjen.
  for (const navn of ["rf_state", "rf_verifiser", "rf_neste"]) {
    svar.cookies.set(navn, "", { path: "/", maxAge: 0 });
  }
  return svar;
}
