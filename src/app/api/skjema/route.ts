import { NextResponse, type NextRequest } from "next/server";
import { sendLeadPaEpost } from "@/lib/lead";

/**
 * Skjemainnsending.
 *
 * HVORFOR RUTEHÅNDTERER OG IKKE SERVERHANDLING:
 *
 * Første versjon brukte en serverhandling med redirect("/takk"). Den fungerer
 * teknisk, men gir en KLIENTSIDE-navigasjon – nettleseren henter en
 * RSC-nyttelast og bytter innhold uten å laste dokumentet på nytt. I
 * kjøretidsloggen ser det slik ut:
 *
 *     GET /takk.rsc 200
 *
 * GTM-containeren lastes én gang i layouten. Ved en slik navigasjon kjører
 * den ikke på nytt, og verken page_view eller Google Ads-konverteringstaggen
 * ville fyrt uten at GTM i tillegg var satt opp med en History Change-trigger.
 *
 * Et vanlig skjema som POSTer hit og får 303 tilbake gir derimot en ekte
 * dokumentnavigasjon: ny URL i adressefeltet, full sidelasting, GTM kjører på
 * nytt. Det er det målingen er avhengig av.
 *
 * Bonus: skjemaet virker også uten JavaScript.
 */
export async function POST(req: NextRequest) {
  const data = await req.formData();

  let botAktig = false;

  // Honningkrukke: feltet er skjult for mennesker. Utfylt = bot.
  if (data.get("firmanavn")) botAktig = true;

  // Innsending under to sekunder etter lasting er praktisk talt alltid maskinell.
  const lastet = Number(data.get("lastet") ?? 0);
  if (lastet && Date.now() - lastet < 2000) botAktig = true;

  if (!botAktig) {
    const lead = {
      navn: String(data.get("navn") ?? ""),
      epost: String(data.get("epost") ?? ""),
      bedrift: String(data.get("bedrift") ?? ""),
      telefon: String(data.get("telefon") ?? ""),
      melding: String(data.get("melding") ?? ""),
      side: String(data.get("side") ?? "ukjent"),
    };

    /*
     * E-postfeil skal aldri hindre videresendingen. Uten /takk mister vi
     * GA4-hendelsen og Ads-konverteringen, og da er leadet usynlig i målingen
     * selv om det kom fram i innboksen.
     */
    try {
      await sendLeadPaEpost(lead);
    } catch (feil) {
      console.error("[lead] Sending feilet:", feil);
    }
  }

  // 303 gjør om POST til GET, slik at /takk ikke kan sendes inn på nytt
  // ved oppdatering av siden.
  return NextResponse.redirect(new URL("/takk", req.url), 303);
}
