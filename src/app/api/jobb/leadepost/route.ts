import { type NextRequest, NextResponse } from "next/server";

import { kjorLeadepostjobb } from "@/lib/leadutsending";

/**
 * Jobben som sender lead-e-postene. Kjøres hvert femte minutt.
 *
 * HVORFOR EN JOBB OG IKKE BARE SKJEMARUTA. To grunner:
 *
 * 1. META-LEADS er aldri innom nettsiden. De kommer rett inn i HubSpot fra
 *    Meta-skjemaet, og det eneste stedet de kan plukkes opp er et søk.
 * 2. PÅMINNELSEN skal gå neste hverdag kl. 09:00. Ingenting skjer på
 *    nettsiden da; noen må se etter.
 *
 * NØKKELEN ER PÅKREVD. Uten den kan hvem som helst be oss sende e-post til
 * leads. Vercels egen cron sender `Authorization: Bearer <CRON_SECRET>` når
 * variabelen finnes; en jobb utenfra kan sende samme header eller `?n=`.
 *
 * SVARET ER ALLTID 200 MED EN OPPTELLING, også når ingenting ble sendt.
 * En cron som får en feilkode prøver igjen, og «ingen å sende til» er ikke
 * en feil.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function harNokkel(req: NextRequest): boolean {
  const n = process.env.CRON_SECRET;
  if (!n) return false;
  const hode = req.headers.get("authorization");
  return hode === `Bearer ${n}` || req.nextUrl.searchParams.get("n") === n;
}

async function kjor(req: NextRequest) {
  if (!harNokkel(req)) {
    return NextResponse.json({ feil: "ingen tilgang" }, { status: 401 });
  }
  const svar = await kjorLeadepostjobb();
  console.info("[leadepost] Jobb kjørt:", JSON.stringify(svar));
  return NextResponse.json(svar);
}

export const GET = kjor;
export const POST = kjor;
