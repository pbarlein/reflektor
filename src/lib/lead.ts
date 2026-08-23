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

export type Lead = {
  navn: string;
  epost: string;
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
    console.error(
      "[lead] RESEND_API_KEY mangler – leadet ble IKKE sendt. " +
        `Innhold: ${JSON.stringify(lead)}`,
    );
    return;
  }

  const linjer = [
    `Navn:    ${lead.navn}`,
    `E-post:  ${lead.epost}`,
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
      // Svar går rett til den som fylte ut skjemaet.
      reply_to: lead.epost,
      subject: `Ny henvendelse fra ${lead.navn || "nettsiden"}`,
      text: linjer,
    }),
  });

  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`Resend svarte ${svar.status}: ${detaljer}`);
  }
}
