import { NextResponse, type NextRequest } from "next/server";

import { merkLest } from "@/lib/leselager";
import { hentBruker } from "@/lib/tilgang";

/**
 * Tar imot «jeg har lest denne».
 *
 * ── HVORFOR DET FINNES EN RUTE, OG IKKE BARE EN KAPSEL ────────────────────
 *
 * Kapselen skrives fortsatt, og den skrives FØRST: den er det som gjør at
 * forsiden er riktig i samme øyeblikk du går tilbake til den. Denne ruta er
 * det som gjør at den fortsatt er riktig på en annen maskin om tre uker.
 * Se leselager.ts.
 *
 * ── DEN SKRIVER BARE FOR DEN INNLOGGEDE ───────────────────────────────────
 *
 * Adressen kommer fra sesjonen, aldri fra kroppen. Ville den tatt imot en
 * e-post i payloaden, kunne hvem som helst skrevet framdrift på andres
 * vegne — og en framdriftsteller man ikke eier selv, er verdiløs.
 */
export const runtime = "nodejs";

export async function POST(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  /*
   * 401 og ikke en omdirigering: dette kalles fra `fetch`, og en
   * omdirigering til innloggingssiden ville kommet tilbake som HTML og sett
   * ut som en suksess.
   */
  if (!bruker) {
    return NextResponse.json({ feil: "Ikke innlogget." }, { status: 401 });
  }

  let kropp: unknown;
  try {
    kropp = await foresporsel.json();
  } catch {
    return NextResponse.json({ feil: "Ugyldig JSON." }, { status: 400 });
  }

  const raa = (kropp as { nr?: unknown })?.nr;
  /*
   * Tar imot både ett tall og en liste. Sporingen sender ett om gangen, men
   * en klient som har ligget offline skal kunne tømme køen sin i ett kall
   * uten at ruta trenger en egen variant.
   */
  const nr = (Array.isArray(raa) ? raa : [raa])
    .filter((n): n is number => Number.isInteger(n) && (n as number) > 0)
    .slice(0, 200);

  if (nr.length === 0) {
    return NextResponse.json(
      { feil: "«nr» må være ett eller flere positive heltall." },
      { status: 422 },
    );
  }

  const sett = await merkLest(bruker.epost, nr);
  return NextResponse.json({ ok: true, antall: sett.size });
}
