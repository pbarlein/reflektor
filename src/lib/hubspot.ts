/**
 * Leadlevering til HubSpot. Lagt til 02.10.2026.
 *
 * HVORFOR DEN FINNES. Fram til nå havnet leads i HubSpot bare via
 * sporingsskriptet i nettleseren — «collected forms», altså HubSpot som
 * leser av et skjema det ikke eier. Det betyr at leadet forsvinner for alle
 * som blokkerer sporing, og at det ikke finnes i det hele tatt før
 * samtykkekontrollen i GTM slipper HubSpot-taggen gjennom. Dette kallet går
 * fra serveren, etter at skjemaet er mottatt, og er dermed uavhengig av både
 * annonseblokkering og samtykke til markedsføringscookies.
 *
 * E-POSTEN ER FORTSATT HOVEDKANALEN. Se lib/lead.ts. Denne er et tillegg,
 * ikke en erstatning: en lead som bare ligger i et CRM ingen åpner er ikke
 * en lead noen svarer på.
 *
 * ID-ENE ER IKKE HEMMELIGE. Skjema-GUID og portal-ID ligger i klartekst i
 * hver HubSpot-innbygging på hver side som bruker den, og endepunktet er
 * uautentisert med vilje — det er samme endepunkt et HubSpot-skjema i en
 * nettleser poster til. Derfor står de her og ikke i en miljøvariabel:
 * en «hemmelighet» som er offentlig gjør bare at koden ikke kan leses.
 *
 * OPPRINNELSE, så ingen trenger å gjette senere: begge er opprettet i
 * HubSpot 02.10.2026, i portalen Reflektor allerede bruker (EU-hosting).
 * Skjemaet heter «reflektor.no – kontaktskjema (API)». Arbeidsflyten
 * «Nytt lead – inbound (nettside + Meta)» starter på «Recent conversion
 * date is known» og fyrer også på innsendinger herfra — den skal ikke røres.
 */

import type { Lead } from "./lead";
import { serUtSomEpost } from "./skjemavern";

/** HubSpot-portalen Reflektor bruker. EU-hosting. */
export const PORTAL_ID = "148641188";

/** Skjemaet «reflektor.no – kontaktskjema (API)». */
export const SKJEMA_GUID = "ca67f6ca-0e02-433f-85bb-7f0825ccf60d";

export const ENDEPUNKT = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${SKJEMA_GUID}`;

/**
 * Hvor lenge vi venter på HubSpot.
 *
 * Kallet skjer etter at svaret til besøkende er sendt (se `after()` i
 * api/skjema/route.ts), så taket handler ikke om ventetid for noen. Det
 * handler om at en funksjon som henger ikke skal holde en serverless-
 * invokasjon åpen til plattformens eget tak slår inn.
 */
const TIDSTAK_MS = 4000;

/**
 * Deler navnet i fornavn og etternavn.
 *
 * HubSpot har to felt, skjemaet har ett. Valget her er det eneste som ikke
 * ødelegger noe: FØRSTE ord er fornavn, ALT RESTEN er etternavn. «Pål Erik
 * Barlein» blir «Pål» + «Erik Barlein», ikke «Pål Erik» + «Barlein» — vi kan
 * ikke vite hvilket mellomnavn som er hva, og en gjetning som deler feil
 * skriver feil navn inn i CRM-et for alltid.
 *
 * Ett ord gir tomt etternavn, og tomt navn gir to tomme felt. Begge er
 * gyldige: HubSpot krever bare e-post.
 */
export function delNavn(navn: string): { fornavn: string; etternavn: string } {
  const ord = navn.trim().split(/\s+/).filter(Boolean);
  if (ord.length === 0) return { fornavn: "", etternavn: "" };
  return { fornavn: ord[0], etternavn: ord.slice(1).join(" ") };
}

export type Hubspotfelt = { name: string; value: string };

export type Hubspotinnsending = {
  fields: Hubspotfelt[];
  context: { hutk?: string; pageUri: string; pageName: string };
};

/**
 * Bygger nyttelasten. Ren funksjon, så den kan testes uten nett.
 *
 * TOMME FELT UTELATES. HubSpot godtar en tom streng, men den skriver seg inn
 * som en tom verdi og overskriver det som eventuelt sto der fra før på en
 * kontakt som har sendt inn tidligere. Et felt som ikke sendes, lar den
 * gamle verdien stå.
 *
 * IP-ADRESSEN SENDES IKKE. `context.ipAddress` finnes i API-et, men det
 * eneste vi kunne sendt herfra er serverens egen adresse — altså Vercels,
 * ikke besøkendes. Den ville vært både feil og en personopplysning vi ikke
 * har bruk for.
 *
 * `nettside_kilde` er en egen kontaktegenskap (tekst), opprettet
 * 02.10.2026. Den bærer samme streng som «Kilde» i lead-e-posten — UTM,
 * gclid, referrer og landingsside fra besøkets første sidevisning. Se
 * lib/kilde.ts.
 */
export function byggInnsending(
  lead: Lead,
  hutk: string | undefined,
  basis: string,
): Hubspotinnsending {
  const { fornavn, etternavn } = delNavn(lead.navn);

  const felt: [string, string][] = [
    ["email", lead.epost],
    ["firstname", fornavn],
    ["lastname", etternavn],
    ["company", lead.bedrift],
    ["phone", lead.telefon],
    ["message", lead.melding],
    ["nettside_kilde", lead.kilde],
  ];

  const sti = lead.side.startsWith("/") ? lead.side : `/${lead.side}`;

  return {
    fields: felt
      .filter(([, verdi]) => verdi !== "")
      .map(([name, value]) => ({ name, value })),
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: `${basis}${sti}`,
      pageName: sti,
    },
  };
}

/** Plukker `hubspotutk` ut av en hel cookie-streng. Tom hvis den ikke finnes. */
export function lesHutk(cookie: string | null | undefined): string | undefined {
  if (!cookie) return undefined;
  for (const bit of cookie.split(";")) {
    const skille = bit.indexOf("=");
    if (skille < 0) continue;
    if (bit.slice(0, skille).trim() !== "hubspotutk") continue;
    const verdi = bit.slice(skille + 1).trim();
    return verdi || undefined;
  }
  return undefined;
}

/**
 * Sender leadet. Kaster aldri — den logger.
 *
 * GRUNNEN TIL AT DEN IKKE KASTER står i route.ts: svaret til besøkende er
 * alltid 303 til /takk, og dette kallet kjører etter at svaret er sendt.
 * En kastet feil her ville blitt en ufanget avvisning i en kontekst der
 * ingen venter på den.
 *
 * FEILEN SKAL VÆRE UMULIG Å OVERSE I VERCEL-LOGGEN, og den skal kunne leses
 * uten å kjenne koden. Derfor står statuskoden og HubSpots egen
 * feilbeskrivelse i meldingen. Personopplysninger logges ikke — kun hvilken
 * side leadet kom fra, slik lib/lead.ts gjør det.
 */
export async function sendLeadTilHubspot(
  lead: Lead,
  hutk: string | undefined,
  basis: string,
): Promise<void> {
  /*
   * E-post er det ene feltet HubSpot krever. Mangler den, ville kallet gitt
   * 400 uten at noe kunne vært gjort med det — da er en tydelig logglinje
   * mer verdt enn et forsøk.
   */
  if (!serUtSomEpost(lead.epost)) {
    console.error(
      `[hubspot] Leadet fra ${lead.side} har ingen brukbar e-postadresse og ble IKKE sendt til HubSpot.`,
    );
    return;
  }

  try {
    const svar = await fetch(ENDEPUNKT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(byggInnsending(lead, hutk, basis)),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });

    if (!svar.ok) {
      const detaljer = await svar.text().catch(() => "");
      console.error(
        `[hubspot] HubSpot svarte ${svar.status} på leadet fra ${lead.side}. Leadet er IKKE i CRM-et. ${detaljer}`,
      );
      return;
    }
  } catch (feil) {
    console.error(
      `[hubspot] Kallet feilet for leadet fra ${lead.side}. Leadet er IKKE i CRM-et.`,
      feil,
    );
  }
}
