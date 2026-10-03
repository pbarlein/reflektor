/**
 * Oppslag og oppdatering på HubSpot-kontakter, for påminnelsessidene.
 *
 * DETTE ER IKKE SAMME VEI SOM lib/hubspot.ts. Den sender skjemainnsendinger
 * til et uautentisert skjema-endepunkt, og trenger ingen nøkkel. Her leses og
 * SKRIVES det på kontakter i CRM-et, og det krever et token fra en privat
 * app i HubSpot.
 *
 * ALT FUNGERER UTEN TOKENET. Mangler det, svarer funksjonene «ikke satt opp»
 * og sidene sier fra på norsk. Varselet til Pål, skjemaet og innsendingen til
 * HubSpot er ikke avhengig av noe her.
 */

import { paaminnelseTidspunkt } from "./paaminnelse";

const BASIS = "https://api.hubapi.com";
const TIDSTAK_MS = 8000;

/** Egenskapen arbeidsflyten sjekker før den sender påminnelsen. */
export const AVBRUTT_FELT = "paminnelse_avbrutt";

/** Navnene på de to skjemaene som utløser oppfølgingen. */
export const SKJEMANAVN = {
  nettside: "reflektor.no – kontaktskjema",
  meta: "Reflektor SoMe-abonnement",
} as const;

export type Utfall =
  | { ok: true }
  | { ok: false; grunn: "ikke-satt-opp" | "ikke-funnet" | "feil" };

export function harToken(): boolean {
  return Boolean(process.env.HUBSPOT_TOKEN);
}

function hoder(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/**
 * Slår av påminnelsen for én kontakt.
 *
 * SLÅR OPP PÅ E-POST og ikke på id, med `idProperty=email`. Pål trykker på
 * en knapp i en e-post; der finnes ingen HubSpot-id, og en id ville dessuten
 * måttet vært hentet først — ett kall til som kan feile.
 *
 * 404 ER IKKE EN FEIL, det er et tidsspørsmål. Innsendingen til HubSpot skjer
 * etter at svaret til besøkende er sendt, og varselet til Pål kan rekke fram
 * først. Da finnes ikke kontakten ennå, og riktig svar er «prøv igjen om et
 * minutt» — ikke «noe gikk galt».
 */
export async function avbrytPaaminnelse(epost: string): Promise<Utfall> {
  if (!harToken()) return { ok: false, grunn: "ikke-satt-opp" };
  const adresse = encodeURIComponent(epost.trim().toLowerCase());

  try {
    const svar = await fetch(
      `${BASIS}/crm/v3/objects/contacts/${adresse}?idProperty=email`,
      {
        method: "PATCH",
        headers: hoder(),
        body: JSON.stringify({ properties: { [AVBRUTT_FELT]: "true" } }),
        signal: AbortSignal.timeout(TIDSTAK_MS),
      },
    );
    if (svar.ok) return { ok: true };
    if (svar.status === 404) return { ok: false, grunn: "ikke-funnet" };
    console.error(
      `[paaminnelse] HubSpot svarte ${svar.status} på avbryt. ${await svar
        .text()
        .catch(() => "")}`,
    );
    return { ok: false, grunn: "feil" };
  } catch (feil) {
    console.error("[paaminnelse] Kallet til HubSpot feilet.", feil);
    return { ok: false, grunn: "feil" };
  }
}

export type Planlagt = {
  epost: string;
  navn: string;
  bedrift: string;
  kilde: "Nettside" | "Meta";
  sendtInn: Date;
};

/**
 * Leadene som har en påminnelse på vei.
 *
 * FILTRENE SPEILER ARBEIDSFLYTEN, og rekkefølgen er ikke tilfeldig: samme
 * betingelser som HubSpot selv bruker for å la være å sende. Står det et
 * lead her som likevel ikke får påminnelse, er det listen som er feil — og
 * da er den verre enn ingen liste.
 *
 * FIRE DØGN TILBAKE holder: påminnelsen går senest mandag morgen for et lead
 * som kom inn fredag. Et lengre vindu ville fylt listen med leads som for
 * lengst har fått sin.
 *
 * TO GRUPPER FORDI HUBSPOT OR-ER GRUPPER OG AND-ER FILTRE. Det er den eneste
 * måten å si «fra nettskjemaet ELLER Meta-skjemaet» på.
 */
export async function hentPlanlagte(): Promise<Planlagt[] | null> {
  if (!harToken()) return null;

  const fire = Date.now() - 4 * 24 * 60 * 60 * 1000;
  const felles = [
    { propertyName: "recent_conversion_date", operator: "GTE", value: String(fire) },
    { propertyName: AVBRUTT_FELT, operator: "NEQ", value: "true" },
    { propertyName: "engagements_last_meeting_booked", operator: "NOT_HAS_PROPERTY" },
    { propertyName: "lifecyclestage", operator: "NEQ", value: "customer" },
  ];

  const kropp = {
    filterGroups: [SKJEMANAVN.nettside, SKJEMANAVN.meta].map((navn) => ({
      filters: [
        ...felles,
        {
          propertyName: "recent_conversion_event_name",
          operator: "CONTAINS_TOKEN",
          value: `*${navn}*`,
        },
      ],
    })),
    properties: [
      "email",
      "firstname",
      "lastname",
      "company",
      "recent_conversion_date",
      "recent_conversion_event_name",
    ],
    sorts: [{ propertyName: "recent_conversion_date", direction: "DESCENDING" }],
    limit: 50,
  };

  try {
    const svar = await fetch(`${BASIS}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: hoder(),
      body: JSON.stringify(kropp),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (!svar.ok) {
      console.error(
        `[paaminnelse] Søket i HubSpot svarte ${svar.status}. ${await svar
          .text()
          .catch(() => "")}`,
      );
      return null;
    }
    const data = (await svar.json()) as {
      results?: { properties: Record<string, string | null> }[];
    };

    const na = Date.now();

    return (data.results ?? [])
      .map((r) => {
        const p = r.properties;
        const navn = [p.firstname, p.lastname].filter(Boolean).join(" ").trim();
        const hendelse = p.recent_conversion_event_name ?? "";
        return {
          epost: p.email ?? "",
          navn,
          bedrift: p.company ?? "",
          kilde: hendelse.includes(SKJEMANAVN.meta)
            ? ("Meta" as const)
            : ("Nettside" as const),
          sendtInn: new Date(p.recent_conversion_date ?? Date.now()),
        };
      })
      /*
        PÅMINNELSER SOM ALLEREDE HAR GÅTT, ER IKKE NOE Å AVBRYTE. Filteret
        ligger her og ikke i siden: `Date.now()` under rendring er en uren
        verdi, og React-kompilatoren avviser den med rette — to rendringer av
        samme data ville gitt to forskjellige lister.
      */
      .filter((l) => l.epost && paaminnelseTidspunkt(l.sendtInn).getTime() > na);
  } catch (feil) {
    console.error("[paaminnelse] Søket i HubSpot feilet.", feil);
    return null;
  }
}
