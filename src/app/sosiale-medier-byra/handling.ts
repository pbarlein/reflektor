"use server";

import { redirect } from "next/navigation";
import { sendLeadPaEpost } from "@/lib/lead";

/**
 * Skjemainnsending (brief 8.1).
 *
 * Serverside-håndtering med spam-beskyttelse som ikke er CAPTCHA: en
 * honningkrukke og en tidssjekk. Begge usynlige for mennesker, null
 * konverteringstap.
 *
 * Redirect til /takk er ikke valgfritt – hele målingen henger på den
 * sidevisningen (se src/components/TakkHendelse.tsx).
 */
export async function sendSkjema(formData: FormData) {
  let botAktig = false;

  // Honningkrukke: felt skjult for mennesker. Utfylt = bot.
  if (formData.get("firmanavn")) botAktig = true;

  // Innsending under to sekunder etter lasting er praktisk talt alltid maskinell.
  const lastet = Number(formData.get("lastet") ?? 0);
  if (lastet && Date.now() - lastet < 2000) botAktig = true;

  if (!botAktig) {
    const lead = {
      navn: String(formData.get("navn") ?? ""),
      epost: String(formData.get("epost") ?? ""),
      telefon: String(formData.get("telefon") ?? ""),
      melding: String(formData.get("melding") ?? ""),
      side: "/sosiale-medier-byra",
    };

    /*
     * E-postfeil skal aldri hindre redirecten. Uten /takk mister vi GA4-
     * hendelsen og Google Ads-konverteringen, og da er leadet usynlig i
     * målingen selv om det kom fram.
     *
     * redirect() kaster en egen kontrollflytfeil, så den må stå UTENFOR
     * try/catch – ellers svelger fangsten den og responsen blir hengende.
     */
    try {
      await sendLeadPaEpost(lead);
    } catch (feil) {
      console.error("[lead] Sending feilet:", feil);
    }
  }

  redirect("/takk");
}
