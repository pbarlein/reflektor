/**
 * Levering av skjemaleads på e-post.
 *
 * Leads er den eneste KPI-en (brief 0.3). Derfor to prinsipper her:
 *
 * 1. Redirect til /takk skal ALLTID skje, også når e-posten feiler. Mister vi
 *    den sidevisningen, mister vi GA4-hendelsen og Google Ads-konverteringen –
 *    altså selve målingen. En lead som kommer fram men ikke telles er ille;
 *    en som verken kommer fram eller telles er verre.
 * 2. Feil logges tydelig. De er kun synlige i Vercel-loggen, så en testinnsending
 *    etter hver endring er ikke valgfritt.
 *
 * Nøkkelen ligger i Vercel-miljøvariabler, aldri i repoet (brief 8.1.2).
 */

import { rensEnLinje, serUtSomEpost } from "./skjemavern";

export type Lead = {
  navn: string;
  epost: string;
  bedrift: string;
  telefon: string;
  melding: string;
  side: string;
};

const MOTTAKER = process.env.LEAD_MOTTAKER ?? "pal@reflektor.no";

/**
 * Avsender. `onboarding@resend.dev` fungerer uten å røre DNS, men kan kun
 * sende til adressen Resend-kontoen er registrert på. Skal leads gå til flere
 * mottakere, må et eget domene verifiseres i Resend – det krever DNS-oppføringer
 * for e-post, ikke for nettstedet, og flytter altså ikke reflektor.no.
 */
const AVSENDER = process.env.LEAD_AVSENDER ?? "Reflektor <onboarding@resend.dev>";

export async function sendLeadPaEpost(lead: Lead): Promise<void> {
  const nokkel = process.env.RESEND_API_KEY;

  if (!nokkel) {
    /*
     * INNHOLDET LOGGES IKKE. Her sto hele leadet som JSON — navn, e-post og
     * telefon i klartekst i Vercel-loggen. Loggen er tilgangsstyrt, men
     * personopplysninger skal ikke ligge der uansett, og siden har en
     * personvernerklæring som ikke nevner det.
     *
     * Feilen skal fortsatt være umulig å overse: mangler nøkkelen, kommer
     * ingen leads fram i det hele tatt.
     */
    console.error(
      `[lead] RESEND_API_KEY mangler – leadet fra ${lead.side} ble IKKE sendt.`,
    );
    return;
  }

  const linjer = [
    `Navn:    ${lead.navn}`,
    `E-post:  ${lead.epost}`,
    `Bedrift: ${lead.bedrift || "—"}`,
    `Telefon: ${lead.telefon || "—"}`,
    `Side:    ${lead.side}`,
    "",
    lead.melding || "(ingen melding)",
  ].join("\n");

  const svar = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${nokkel}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: AVSENDER,
      to: [MOTTAKER],
      /*
       * Svar går rett til den som fylte ut skjemaet — men bare hvis
       * adressen ser ut som en adresse. Er den det ikke, utelates feltet:
       * e-posten skal komme fram uansett, og en ugyldig `reply_to` gir 422
       * fra Resend og dermed ingen e-post.
       */
      ...(serUtSomEpost(lead.epost) ? { reply_to: lead.epost } : {}),
      subject: rensEnLinje(
        `Ny henvendelse fra ${lead.navn || "nettsiden"}`,
      ).slice(0, 160),
      text: linjer,
    }),
  });

  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`Resend svarte ${svar.status}: ${detaljer}`);
  }
}
