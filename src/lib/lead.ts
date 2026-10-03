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

import { avbrytLenke } from "./avbrytsignatur";
import { faarPaaminnelse, paaminnelseTekst } from "./paaminnelse";
import { serUtSomEpost } from "./skjemavern";

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
export function varsel(
  lead: Lead,
  sendt: Date = new Date(),
): { tekst: string; html: string } {
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

  /*
    «SKRIV TIL <FORNAVN>», bestilt av Cowork 03.10.2026.

    E-postadressen står allerede som en mailto-lenke i feltlista. Denne
    knappen gjør to ting den ikke gjør: den fyller ut emnet, og den er stor
    nok til å treffes med tommelen. Pål svarer leads fra telefonen, og et
    emne han slipper å finne på selv er ett ledd mindre mellom henvendelsen
    og svaret.

    EMNET ER FAST og formulert fra leadets side — «Henvendelsen din til
    Reflektor» — så den som får svaret kjenner igjen hva det gjelder uten å
    åpne e-posten.

    FORNAVNET ER FØRSTE ORD, kappet og escapet, som i delNavn i hubspot.ts.
    Mangler navnet, står det «Skriv til leadet»: en knapp som sier «Skriv
    til » og ingenting mer, ser ødelagt ut.
  */
  const fornavn = lead.navn.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  const skriv = serUtSomEpost(lead.epost)
    ? {
        tekst: fornavn ? `Skriv til ${fornavn}` : "Skriv til leadet",
        lenke: `mailto:${lead.epost}?subject=${encodeURIComponent("Henvendelsen din til Reflektor")}`,
      }
    : null;

  /*
    OPPFØLGINGEN, LAGT TIL 04.10.2026.

    HubSpot sender nå selv en e-post med presentasjon og bookinglenke med én
    gang leadet kommer inn, og en påminnelse neste hverdag kl. 09:00. Pål
    skal se tidspunktet her, fordi det er fristen hans: rekker han å ringe
    før den går, booker han møtet selv i stedet for å la en automatisk
    e-post gjøre det.

    STÅR IKKE FOR INTERNE ADRESSER. Arbeidsflyten hopper over
    @reflektor.no, og et varsel som lover en påminnelse som aldri kommer, er
    verre enn ingen opplysning. Se lib/paaminnelse.ts.

    KNAPPEN KAN MANGLE. Den krever en signatur, og uten hemmeligheten i
    miljøet lages ingen lenke — se lib/avbrytsignatur.ts. Da står de to
    første linjene alene, og varselet er ellers som før.
  */
  const oppfolging = faarPaaminnelse(lead.epost)
    ? {
        linje: `Generisk Canva-presentasjon og møtelink sendt. Påminnelse sendes ${paaminnelseTekst(sendt)}.`,
        ring: "Ring ASAP for å booke møte personlig.",
        lenke: avbrytLenke(lead.epost),
      }
    : null;

  const tekst = [
    ...rader.map(([navn, verdi]) => `${navn}: ${verdi}`),
    "Behov:",
    behov,
    ...(skriv
      ? ["", `${skriv.tekst}: ${lead.epost} (emne: Henvendelsen din til Reflektor)`]
      : []),
    ...(oppfolging
      ? [
          "",
          oppfolging.linje,
          "",
          oppfolging.ring,
          ...(oppfolging.lenke ? ["", `Avbryt påminnelse: ${oppfolging.lenke}`] : []),
        ]
      : []),
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
    ...(skriv
      ? [
          /*
            SEKUNDÆR KNAPP, med ramme og uten fyll. Den primære handlingen i
            denne e-posten er å RINGE — det står med fete typer lenger nede —
            og to like knapper ville sagt at de to er like viktige.
          */
          `<p style="margin:20px 0 0"><a href="${esc(skriv.lenke)}" style="display:inline-block;padding:13px 20px;border:1px solid #d6cfc6;border-radius:8px;color:#2a2521;text-decoration:none">${esc(skriv.tekst)}</a></p>`,
        ]
      : []),
    ...(oppfolging
      ? [
          `<p style="margin:24px 0 0">${esc(oppfolging.linje)}</p>`,
          `<p style="margin:16px 0 0"><strong>${esc(oppfolging.ring)}</strong></p>`,
          ...(oppfolging.lenke
            ? [
                /*
                  KNAPPEN ER EN LENKE SOM SER UT SOM EN KNAPP, og det er
                  ikke en forenkling: e-postklienter kjører ikke skript, og
                  en <button> i en e-post gjør ingenting. Padding og
                  bakgrunn på en <a> er den eneste knappen som finnes her.

                  MÅLET ER TOMMELEN PÅ EN TELEFON. 14 px loddrett padding
                  gir en flate på rundt 46 px, som er over Apples
                  anbefalte 44.
                */
                `<p style="margin:20px 0 0"><a href="${esc(oppfolging.lenke)}" style="display:inline-block;padding:14px 22px;background:#d8441f;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Avbryt påminnelse</a></p>`,
              ]
            : []),
        ]
      : []),
    "</div>",
  ].join("");

  return { tekst, html };
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
