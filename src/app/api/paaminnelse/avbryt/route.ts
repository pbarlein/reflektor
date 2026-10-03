import { type NextRequest, NextResponse } from "next/server";

import { gyldigSignatur } from "@/lib/avbrytsignatur";
import { avbrytPaaminnelse } from "@/lib/hubspotcrm";
import { basisUrl } from "@/lib/miljo";

/**
 * Avbryter påminnelsen. ENDRINGEN SKJER HER, ikke på siden som viser
 * knappen.
 *
 * HVORFOR POST OG IKKE GET. Lenken ligger i en e-post, og e-postklienter og
 * sikkerhetsskannere åpner lenker på egen hånd for å sjekke dem. En GET som
 * endrer noe, ville slått av påminnelsen for et lead ingen hadde bestemt seg
 * for ennå. GET viser bare et spørsmål; POST svarer på det.
 *
 * SIGNATUREN SJEKKES HER OGSÅ, ikke bare på siden. Siden er bare et skjema —
 * hvem som helst kan sende en POST uten å ha vært innom den.
 *
 * SVARET ER 303 TIL SIDEN, med utfallet i adressen. Samme mønster som
 * kontaktskjemaet: en vanlig sidelasting etterpå, som tåler at noen
 * oppdaterer.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.formData().catch(() => null);
  const epost = String(data?.get("e") ?? "").trim();
  const signatur = String(data?.get("s") ?? "");
  const retur = String(data?.get("retur") ?? "/paaminnelse/avbryt");

  const tilbake = (status: string) => {
    const u = new URL(retur.startsWith("/") ? retur : "/paaminnelse/avbryt", basisUrl());
    u.searchParams.set("status", status);
    if (u.pathname === "/paaminnelse/avbryt") {
      u.searchParams.set("e", epost);
      u.searchParams.set("s", signatur);
    }
    return NextResponse.redirect(u, 303);
  };

  if (!epost || !gyldigSignatur(epost, signatur)) return tilbake("ugyldig");

  const utfall = await avbrytPaaminnelse(epost);
  return tilbake(utfall.ok ? "ok" : utfall.grunn);
}
