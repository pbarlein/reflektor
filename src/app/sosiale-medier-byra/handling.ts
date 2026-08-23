"use server";

import { redirect } from "next/navigation";

/**
 * Skjemainnsending (brief 8.1).
 *
 * Serverside-håndtering med spam-beskyttelse som ikke er CAPTCHA – her en
 * honningkrukke pluss en tidssjekk. Begge er usynlige for mennesker og koster
 * ingenting i konvertering.
 *
 * Redirect til /takk er ikke valgfritt: hele målingen henger på den
 * sidevisningen. Se src/components/TakkHendelse.tsx.
 *
 * TODO (vedlegg A): mottaker er ikke avklart. Innsendingen redirigerer
 * korrekt, men leveres ikke videre ennå – HubSpot er koblet i prosjektet og er
 * det nærliggende målet. Må avklares før lansering.
 */
export async function sendSkjema(formData: FormData) {
  // Honningkrukke: felt skjult for mennesker. Utfylt = bot.
  if (formData.get("firmanavn")) {
    redirect("/takk");
  }

  // Skjemaer som sendes under to sekunder etter lasting er praktisk talt
  // alltid automatiserte.
  const lastet = Number(formData.get("lastet") ?? 0);
  if (lastet && Date.now() - lastet < 2000) {
    redirect("/takk");
  }

  const _lead = {
    navn: String(formData.get("navn") ?? ""),
    epost: String(formData.get("epost") ?? ""),
    telefon: String(formData.get("telefon") ?? ""),
    melding: String(formData.get("melding") ?? ""),
  };

  // TODO: send til mottaker når den er avklart.

  redirect("/takk");
}
