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
 * VARSELET ER NÅ DET ENESTE PÅL FÅR. Endret av Cowork 03.10.2026: HubSpots
 * egne skjemavarsler er slått av, og arbeidsflyten «Nytt lead – inbound»
 * varsler bare for Meta-leads. Det som før var ett av tre varsler, er nå det
 * eneste — og da er formatet ikke en smaksak lenger.
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
  /** Normalisert nettside, `https://…`. Tom hvis ingen er oppgitt eller utledet. */
  nettside: string;
  /** Sant når nettsiden er utledet av e-postdomenet, ikke skrevet inn. */
  nettsideUtledet: boolean;
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

/** Påls egen adresse. Svar på bekreftelsen skal gå hit. */
const SVAR_TIL = "pal@reflektor.no";

/**
 * Emnet på varselet. Fast streng, bestilt av Pål 03.10.2026.
 *
 * HER STO NAVN OG BEDRIFT. De er tatt ut fordi emnet nå skal være
 * gjenkjennelig på ett blikk og sorterbart i innboksen — hvem det er, står
 * på første linje i meldingen. Et emne som varierer kan ikke filtreres på.
 */
export const VARSEL_EMNE = "NYTT LEAD fra reflektor.no";

/** Escaper de fire tegnene som kan bryte ut av HTML-en i e-posten. */
function esc(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TOM = "–";

/**
 * Varselet til Pål.
 *
 * REKKEFØLGEN OG ETIKETTENE ER PÅLS, ORDRETT, og de skal ikke pyntes på:
 *
 *   Avsender · Mobilnummer · E-post · Bedrift · Nettside · Behov
 *
 * Han ringer leads samme dag. Derfor står mobilnummeret på linje to, før
 * e-posten, og derfor er de tre kontaktveiene lenker: ett trykk på telefon
 * i stedet for merk, kopier, lim inn.
 *
 * INGEN KILDE, INGEN SIDE, INGEN TEKNISK INFORMASJON. Det sto her før og er
 * tatt ut med vilje. Alt det ligger i HubSpot, der det hører hjemme, og
 * hvert felt i denne e-posten er et felt Pål må lese forbi for å finne
 * telefonnummeret.
 *
 * BEHOVET STÅR TIL SLUTT og med linjeskiftene i behold. Det er det eneste
 * feltet som kan være langt, og `white-space: pre-wrap` er det som gjør at
 * avsnitt forblir avsnitt.
 */
export function varsel(lead: Lead): { tekst: string; html: string } {
  const nettside = lead.nettside
    ? lead.nettside + (lead.nettsideUtledet ? " (fra e-post)" : "")
    : TOM;

  const rader: [string, string, string][] = [
    ["Avsender", lead.navn || TOM, esc(lead.navn || TOM)],
    [
      "Mobilnummer",
      lead.telefon || TOM,
      lead.telefon
        ? `<a href="tel:${esc(lead.telefon.replace(/[^\d+]/g, ""))}">${esc(lead.telefon)}</a>`
        : TOM,
    ],
    [
      "E-post",
      lead.epost || TOM,
      lead.epost
        ? `<a href="mailto:${esc(lead.epost)}">${esc(lead.epost)}</a>`
        : TOM,
    ],
    ["Bedrift", lead.bedrift || TOM, esc(lead.bedrift || TOM)],
    [
      "Nettside",
      nettside,
      lead.nettside
        ? `<a href="${esc(lead.nettside)}">${esc(lead.nettside)}</a>${
            lead.nettsideUtledet
              ? ' <span style="color:#6b6258">(fra e-post)</span>'
              : ""
          }`
        : TOM,
    ],
  ];

  const behov = lead.melding || TOM;

  const tekst = [
    ...rader.map(([navn, verdi]) => `${navn}: ${verdi}`),
    "Behov:",
    behov,
  ].join("\n");

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.6;color:#2a2521">',
    '<table cellpadding="0" cellspacing="0" border="0" style="font-size:16px;line-height:1.6">',
    ...rader.map(
      ([navn, , verdi]) =>
        `<tr><td style="padding:0 16px 6px 0;color:#6b6258;white-space:nowrap">${navn}</td><td style="padding:0 0 6px">${verdi}</td></tr>`,
    ),
    "</table>",
    '<p style="margin:20px 0 4px;color:#6b6258">Behov:</p>',
    `<p style="white-space:pre-wrap;margin:0">${esc(behov)}</p>`,
    "</div>",
  ].join("");

  return { tekst, html };
}

/**
 * Bekreftelsen til den som sendte skjemaet.
 *
 * LAGT TIL 04.10.2026. Fram til nå fikk innsenderen ingenting — ikke en
 * kvittering, ikke en bekreftelse på at noe var mottatt. Nettsiden lover
 * svar innen tre virkedager; i tre dager visste ikke avsenderen om
 * henvendelsen i det hele tatt kom fram.
 *
 * DEN GJENTAR IKKE NOE AV DET BRUKEREN SKREV. Bare fornavnet, trimmet og
 * escapet. Grunnen er ikke estetikk: en bekreftelse som gjengir
 * brukerinnhold er en vei til å få vårt domene til å sende tekst noen andre
 * har skrevet, til en adresse de selv har valgt. Fornavnet er nok til at
 * e-posten føles personlig, og kort nok til at det ikke kan bære et budskap.
 *
 * LENKEN GÅR TIL /book, ikke rett til HubSpot. Den omdirigeringen finnes
 * fra før, brukes i e-poster, og gjør at kalenderadressen kan byttes ett
 * sted.
 */
export const BEKREFTELSE_EMNE = "Takk for henvendelsen – Reflektor";

export function bekreftelse(navn: string): { tekst: string; html: string } {
  const fornavn = rensEnLinje(navn ?? "")
    .trim()
    .split(/\s+/)[0]
    ?.slice(0, 40);

  const hilsen = fornavn ? `Hei ${fornavn}!` : "Hei!";
  const bok = "https://www.reflektor.no/book";

  const tekst = [
    hilsen,
    "",
    "Takk for at du tok kontakt. Vi ser på bedriften deres og sender deg et konkret strategiforslag for sosiale medier innen tre virkedager.",
    "",
    `Vil du heller ta en prat med en gang? Book 30 minutter her: ${bok}`,
    "",
    "Vennlig hilsen",
    "Pål Barlein",
    "Reflektor · +47 476 05 070 · reflektor.no",
  ].join("\n");

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.6;color:#2a2521">',
    `<p style="margin:0 0 16px">${esc(hilsen)}</p>`,
    '<p style="margin:0 0 16px">Takk for at du tok kontakt. Vi ser på bedriften deres og sender deg et konkret strategiforslag for sosiale medier innen tre virkedager.</p>',
    `<p style="margin:0 0 16px">Vil du heller ta en prat med en gang? <a href="${bok}">Book 30 minutter her</a>.</p>`,
    '<p style="margin:0;color:#6b6258">Vennlig hilsen<br>Pål Barlein<br>Reflektor · <a href="tel:+4747605070" style="color:#6b6258">+47 476 05 070</a> · <a href="https://www.reflektor.no" style="color:#6b6258">reflektor.no</a></p>',
    "</div>",
  ].join("");

  return { tekst, html };
}

/**
 * Hvor ofte samme adresse kan få en bekreftelse.
 *
 * SAMME FORBEHOLD SOM `foroftig` I skjemavern.ts: tilstanden ligger i minnet
 * til én lambda-instans, og Vercel kjører flere. Den stopper den som sender
 * skjemaet fem ganger på rad fordi hun er usikker på om det gikk gjennom.
 * Den stopper ikke en fordelt flom.
 *
 * Det er godt nok her, og grunnen er at konsekvensen er mild: det verste
 * som skjer er at noen får bekreftelsen to ganger. Varselet til Pål og
 * innsendingen til HubSpot er ikke berørt uansett.
 */
const BEKREFTELSE_VINDU_MS = 10 * 60_000;
const BEKREFTELSE_MAKS_SPOR = 2_000;
const sendtTil = new Map<string, number>();

export function harFattBekreftelse(epost: string, na = Date.now()): boolean {
  const n = epost.trim().toLowerCase();
  if (!n) return true;
  if (sendtTil.size > BEKREFTELSE_MAKS_SPOR) sendtTil.clear();
  const forrige = sendtTil.get(n);
  if (forrige !== undefined && na - forrige < BEKREFTELSE_VINDU_MS) return true;
  sendtTil.set(n, na);
  return false;
}

/** Ett sted for selve utsendingen, så feilhåndteringen er lik for begge. */
async function send(opp: {
  til: string;
  emne: string;
  tekst: string;
  html: string;
  svarTil?: string;
}): Promise<void> {
  const nokkel = process.env.RESEND_API_KEY;

  if (!nokkel) {
    /*
     * INNHOLDET LOGGES IKKE. Her sto hele leadet som JSON — navn, e-post og
     * telefon i klartekst i Vercel-loggen. Loggen er tilgangsstyrt, men
     * personopplysninger skal ikke ligge der uansett.
     */
    console.error(`[lead] RESEND_API_KEY mangler – «${opp.emne}» ble IKKE sendt.`);
    return;
  }

  const svar = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${nokkel}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: AVSENDER,
      to: [opp.til],
      /*
       * `reply_to` utelates når adressen ikke ser ut som en adresse:
       * e-posten skal komme fram uansett, og en ugyldig verdi gir 422 fra
       * Resend og dermed ingen e-post i det hele tatt.
       */
      ...(opp.svarTil && serUtSomEpost(opp.svarTil)
        ? { reply_to: opp.svarTil }
        : {}),
      subject: opp.emne,
      text: opp.tekst,
      html: opp.html,
    }),
  });

  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`Resend svarte ${svar.status}: ${detaljer}`);
  }
}

export async function sendLeadPaEpost(lead: Lead): Promise<void> {
  const { tekst, html } = varsel(lead);
  await send({
    til: MOTTAKER,
    emne: VARSEL_EMNE,
    tekst,
    html,
    svarTil: lead.epost,
  });
}

/**
 * Bekreftelsen. Kaster aldri — den skal aldri kunne stoppe varselet til Pål
 * eller innsendingen til HubSpot, og den er det minst viktige av de tre.
 */
export async function sendBekreftelse(lead: Lead): Promise<void> {
  try {
    if (!serUtSomEpost(lead.epost)) return;
    if (harFattBekreftelse(lead.epost)) return;
    const { tekst, html } = bekreftelse(lead.navn);
    await send({
      til: lead.epost,
      emne: BEKREFTELSE_EMNE,
      tekst,
      html,
      svarTil: SVAR_TIL,
    });
  } catch (feil) {
    console.error("[lead] Bekreftelsen feilet:", feil);
  }
}
