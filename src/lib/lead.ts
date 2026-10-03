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
  /** Hvor besøkende kom fra. Se lib/kilde.ts. Tom hvis ukjent. */
  kilde: string;
};

const MOTTAKER = process.env.LEAD_MOTTAKER ?? "pal@reflektor.no";

/**
 * Avsender. `onboarding@resend.dev` fungerer uten å røre DNS, men kan kun
 * sende til adressen Resend-kontoen er registrert på. Skal leads gå til flere
 * mottakere, må et eget domene verifiseres i Resend – det krever DNS-oppføringer
 * for e-post, ikke for nettstedet, og flytter altså ikke reflektor.no.
 */
const AVSENDER =
  process.env.LEAD_AVSENDER ?? "Reflektor <onboarding@resend.dev>";

/**
 * Emnefeltet.
 *
 * «Ny henvendelse: Marisol – La Mexicana AS». Navn og bedrift er det Pål
 * trenger for å vite om han skal åpne den nå eller etter møtet, og
 * innboksen på telefon viser rundt 40 tegn.
 *
 * Her sto «Ny henvendelse fra <navn>». Bedriften manglet, og det er den som
 * avgjør hvor interessant henvendelsen er.
 */
export function emne(lead: Pick<Lead, "navn" | "bedrift">): string {
  const navn = rensEnLinje(lead.navn).trim();
  const bedrift = rensEnLinje(lead.bedrift).trim();
  if (!navn && !bedrift) return "Ny henvendelse fra nettsiden";
  const hale = [navn, bedrift].filter(Boolean).join(" – ");
  return `Ny henvendelse: ${hale}`.slice(0, 160);
}

/** Escaper de fire tegnene som kan bryte ut av HTML-en i e-posten. */
function esc(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Telefonnummeret som `tel:`-lenke.
 *
 * Alt annet enn sifre og en innledende pluss fjernes fra selve lenken —
 * «+47 123 45 678» er riktig å LESE og feil å ringe. Teksten står som
 * skrevet.
 */
function telefonlenke(nummer: string): string {
  const rent = nummer.replace(/[^\d+]/g, "");
  if (!rent) return esc(nummer);
  return `<a href="tel:${esc(rent)}">${esc(nummer)}</a>`;
}

/**
 * Selve e-posten, i den rekkefølgen den leses.
 *
 * MELDINGEN ØVERST. Bestilt av Pål 03.10.2026. Her sto kontaktinfoen først
 * og meldingen nederst, etter en tom linje — altså måtte han forbi seks
 * linjer felt for å finne ut hva folk faktisk spurte om. Navn og bedrift
 * står allerede i emnefeltet.
 *
 * KILDEN NEDERST, av samme grunn: den er nyttig når han skal vurdere hvor
 * annonsekronene virker, og aldri det første han trenger å vite.
 *
 * BÅDE HTML OG REN TEKST. HTML-en gir `tel:`-lenken, som er hele poenget
 * på telefon — ett trykk i stedet for merk, kopier, lim inn. Ren tekst
 * følger med fordi en e-post uten den leses som vedlegg i enkelte klienter,
 * og fordi den er det som står igjen hvis HTML-en blokkeres.
 */
function brodtekst(lead: Lead): { tekst: string; html: string } {
  const felt: [string, string, string][] = [
    ["Navn", lead.navn, esc(lead.navn)],
    [
      "E-post",
      lead.epost,
      `<a href="mailto:${esc(lead.epost)}">${esc(lead.epost)}</a>`,
    ],
    ["Bedrift", lead.bedrift || "—", esc(lead.bedrift || "—")],
    [
      "Telefon",
      lead.telefon || "—",
      lead.telefon ? telefonlenke(lead.telefon) : "—",
    ],
    ["Side", lead.side, esc(lead.side)],
  ];

  const melding = lead.melding || "(ingen melding)";
  const kilde = lead.kilde || "ukjent";

  const tekst = [
    melding,
    "",
    "—",
    "",
    ...felt.map(([navn, verdi]) => `${navn}: ${verdi}`),
    "",
    `Kilde: ${kilde}`,
  ].join("\n");

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#2a2521">',
    `<p style="white-space:pre-wrap;margin:0 0 20px">${esc(melding)}</p>`,
    '<hr style="border:0;border-top:1px solid #ddd6cc;margin:0 0 20px">',
    '<table cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.6">',
    ...felt.map(
      ([navn, , verdi]) =>
        `<tr><td style="padding:0 16px 4px 0;color:#6b6258">${navn}</td><td style="padding:0 0 4px">${verdi}</td></tr>`,
    ),
    "</table>",
    `<p style="margin:20px 0 0;color:#6b6258;font-size:13px">Kilde: ${esc(kilde)}</p>`,
    "</div>",
  ].join("");

  return { tekst, html };
}

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

  const { tekst, html } = brodtekst(lead);

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
      subject: emne(lead),
      text: tekst,
      html,
    }),
  });

  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`Resend svarte ${svar.status}: ${detaljer}`);
  }
}
