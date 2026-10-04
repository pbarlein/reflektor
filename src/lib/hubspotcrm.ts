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
      "lead_epost1_sendt",
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
          /*
            TIDSPUNKTET REGNES FRA E-POST 1 NÅR DEN ER SENDT, ellers fra
            innsendingen. Fra 04.10.2026 er det e-post 1 som starter
            klokka: påminnelsen er et svar på den, ikke på skjemaet.
            Mangler den — Meta-leads som ennå ikke er plukket opp — er
            innsendingstidspunktet det nærmeste vi har.
          */
          sendtInn: new Date(
            p.lead_epost1_sendt ?? p.recent_conversion_date ?? Date.now(),
          ),
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

/* ───────────────────── LEAD-E-POSTENE FRA PÅLS GMAIL ────────────────── */

/**
 * Egenskapene Cowork opprettet 04.10.2026 for å holde styr på de to
 * e-postene. De er sannheten om hva som er sendt — ikke en liste i minnet,
 * ikke en logg. En jobb som kjører hvert femte minutt må kunne krasje midt
 * i og starte på nytt uten å sende noe to ganger.
 */
export const EPOST_FELT = {
  en: "lead_epost1_sendt",
  to: "lead_epost2_sendt",
  trad: "lead_epost_trad_id",
  meldingsId: "lead_epost1_message_id",
} as const;

/**
 * Svarene fra Meta-skjemaet, med etikettene Pål skal se i varselet.
 *
 * NAVNENE ER HUBSPOTS EGNE, kontrollert mot kontakten 04.10.2026. De er
 * laget av Facebook-integrasjonen og ser ut som de gjør fordi de er avledet
 * av spørsmålsteksten i annonsen — ikke gjett på dem, les dem.
 *
 * VERDIENE KOMMER MED UNDERSTREK FOR MELLOMROM: «kanskje,_vi_vil_vite_mer».
 * Det er Metas egne nøkler, og de skal vaskes før de vises.
 */
export const METAFELT = [
  { navn: "hvor_mange_jobber_i_bedriften", etikett: "Antall ansatte" },
  {
    navn: "prisen_er_30_000_krmnd_passer_det_for_dere",
    etikett: "Passer 30 000 kr/mnd",
  },
  { navn: "nr_vil_dere_starte", etikett: "Oppstart" },
] as const;

const LESEFELT = [
  "email",
  "firstname",
  "lastname",
  "company",
  "phone",
  "mobilephone",
  "lifecyclestage",
  "engagements_last_meeting_booked",
  "recent_conversion_event_name",
  "recent_conversion_date",
  AVBRUTT_FELT,
  EPOST_FELT.en,
  EPOST_FELT.to,
  EPOST_FELT.trad,
  EPOST_FELT.meldingsId,
  ...METAFELT.map((f) => f.navn),
];

export type Leadkontakt = {
  id: string;
  epost: string;
  navn: string;
  bedrift: string;
  telefon: string;
  lifecycle: string;
  /** `recent_conversion_event_name`: hvilket skjema leadet kom fra. */
  hendelse: string;
  /** `recent_conversion_date`. */
  konvertert: string;
  epost1Sendt: string;
  epost2Sendt: string;
  tradId: string;
  meldingsId: string;
  avbrutt: string;
  moteBooket: string;
  /** Svarene fra Meta-skjemaet, etikett → verdi. Tom for nettsideleads. */
  metasvar: { etikett: string; verdi: string }[];
};

function somLeadkontakt(r: {
  id: string;
  properties: Record<string, string | null>;
}): Leadkontakt {
  const p = r.properties;
  return {
    id: r.id,
    epost: p.email ?? "",
    navn: [p.firstname, p.lastname].filter(Boolean).join(" ").trim(),
    bedrift: p.company ?? "",
    /* Mobilnummeret først: det er det Pål ringer. */
    telefon: p.mobilephone || p.phone || "",
    lifecycle: p.lifecyclestage ?? "",
    hendelse: p.recent_conversion_event_name ?? "",
    konvertert: p.recent_conversion_date ?? "",
    epost1Sendt: p[EPOST_FELT.en] ?? "",
    epost2Sendt: p[EPOST_FELT.to] ?? "",
    tradId: p[EPOST_FELT.trad] ?? "",
    meldingsId: p[EPOST_FELT.meldingsId] ?? "",
    avbrutt: p[AVBRUTT_FELT] ?? "",
    moteBooket: p.engagements_last_meeting_booked ?? "",
    metasvar: METAFELT.flatMap((f) => {
      const verdi = (p[f.navn] ?? "").trim();
      /* Understrek er Metas mellomrom. «innen_3_måneder» → «innen 3 måneder». */
      return verdi
        ? [{ etikett: f.etikett, verdi: verdi.replace(/_/g, " ") }]
        : [];
    }),
  };
}

async function sok(
  filterGroups: unknown[],
  limit = 50,
): Promise<Leadkontakt[] | null> {
  if (!harToken()) return null;
  try {
    const svar = await fetch(`${BASIS}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: hoder(),
      body: JSON.stringify({ filterGroups, properties: LESEFELT, limit }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (!svar.ok) {
      console.error(
        `[leadepost] Søket i HubSpot svarte ${svar.status}. ${await svar.text().catch(() => "")}`,
      );
      return null;
    }
    const data = (await svar.json()) as {
      results?: { id: string; properties: Record<string, string | null> }[];
    };
    return (data.results ?? []).map(somLeadkontakt);
  } catch (feil) {
    console.error("[leadepost] Søket i HubSpot feilet.", feil);
    return null;
  }
}

/** Én kontakt, slått opp på e-post. Null hvis den ikke finnes ennå. */
export async function hentLeadkontakt(
  epost: string,
): Promise<Leadkontakt | null> {
  if (!harToken()) return null;
  const adresse = encodeURIComponent(epost.trim().toLowerCase());
  try {
    const svar = await fetch(
      `${BASIS}/crm/v3/objects/contacts/${adresse}?idProperty=email&properties=${LESEFELT.join(",")}`,
      { headers: hoder(), signal: AbortSignal.timeout(TIDSTAK_MS) },
    );
    if (!svar.ok) return null;
    return somLeadkontakt(
      (await svar.json()) as {
        id: string;
        properties: Record<string, string | null>;
      },
    );
  } catch {
    return null;
  }
}

/**
 * Meta-leads som ikke har fått e-post 1.
 *
 * NETTSIDELEADS TAS AV SKJEMARUTA, med én gang. Kommer de likevel hit —
 * fordi kontakten ikke var opprettet da ruta prøvde — fanges de opp av at
 * `lead_epost1_sendt` er tom.
 */
export async function nyeLeadsUtenEpost(): Promise<Leadkontakt[] | null> {
  const toDogn = Date.now() - 48 * 60 * 60 * 1000;
  return sok([
    {
      filters: [
        {
          propertyName: "recent_conversion_date",
          operator: "GTE",
          value: String(toDogn),
        },
        { propertyName: EPOST_FELT.en, operator: "NOT_HAS_PROPERTY" },
        { propertyName: "lifecyclestage", operator: "NEQ", value: "customer" },
        /*
          AVBRUTT BETYR FERDIG BEHANDLET. Jobben setter feltet selv på de
          som har booket møte, og da skal kontakten ut av listen — ellers
          ville varselet om at hun har booket gått ut på nytt hvert femte
          minutt. Det er også feltet Pål trykker på i varselet.
        */
        { propertyName: AVBRUTT_FELT, operator: "NEQ", value: "true" },
      ],
    },
  ]);
}

/** Kontakter som har fått e-post 1, men ikke e-post 2. */
export async function venterPaaPaaminnelse(): Promise<Leadkontakt[] | null> {
  return sok([
    {
      filters: [
        { propertyName: EPOST_FELT.en, operator: "HAS_PROPERTY" },
        { propertyName: EPOST_FELT.to, operator: "NOT_HAS_PROPERTY" },
        { propertyName: AVBRUTT_FELT, operator: "NEQ", value: "true" },
        { propertyName: "lifecyclestage", operator: "NEQ", value: "customer" },
      ],
    },
  ]);
}

/* ──────────────── SAMME PERSON UNDER EN ANNEN ADRESSE ───────────────── */

/** Hvor langt tilbake et booket møte teller som ferskt. */
const BOOKINGVINDU_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Kontaktene som har booket møte i vinduet.
 *
 * FELTET ER MØTETIDSPUNKTET, IKKE BOOKINGTIDSPUNKTET. Det er lett å lese
 * feil: `engagements_last_meeting_booked` på kontakten fra 04.10.2026 sto
 * til 16.10 — møtet, ikke bookingen. Et filter på «siste fjorten dager»
 * ville derfor bommet på nettopp det tilfellet dette er bygget for. Vinduet
 * er «fra fjorten dager tilbake og framover»: det fanger både møtet som var
 * i forrige uke og møtet som skal være neste uke.
 *
 * HUBSPOT KAN IKKE SØKE PÅ «SLUTTER MED», så telefonnummer kan ikke
 * filtreres bort i søket. Vi henter dem som har booket — en kort liste — og
 * sammenligner her.
 */
export async function booketNylig(): Promise<Leadkontakt[] | null> {
  return sok([
    {
      filters: [
        {
          propertyName: "engagements_last_meeting_booked",
          operator: "GTE",
          value: String(Date.now() - BOOKINGVINDU_MS),
        },
      ],
    },
  ]);
}

/** Stadiene på avtalene som henger på kontakten. Tom liste ved feil. */
export async function dealstadier(kontaktId: string): Promise<string[]> {
  if (!harToken()) return [];
  try {
    const kobling = await fetch(
      `${BASIS}/crm/v4/objects/contacts/${kontaktId}/associations/deals?limit=20`,
      { headers: hoder(), signal: AbortSignal.timeout(TIDSTAK_MS) },
    );
    if (!kobling.ok) {
      console.error(
        `[leadepost] Fikk ikke avtalene til kontakt ${kontaktId} (${kobling.status}). Mangler tokenet crm.objects.deals.read?`,
      );
      return [];
    }
    const ider = (
      (await kobling.json()) as { results?: { toObjectId: string }[] }
    ).results?.map((r) => r.toObjectId);
    if (!ider?.length) return [];

    const avtaler = await fetch(`${BASIS}/crm/v3/objects/deals/batch/read`, {
      method: "POST",
      headers: hoder(),
      body: JSON.stringify({
        properties: ["dealstage"],
        inputs: ider.map((id) => ({ id })),
      }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (!avtaler.ok) return [];
    return (
      (await avtaler.json()) as {
        results?: { properties: { dealstage?: string } }[];
      }
    ).results
      ?.map((d) => d.properties.dealstage ?? "")
      .filter(Boolean) ?? [];
  } catch (feil) {
    console.error("[leadepost] Oppslag av avtaler feilet.", feil);
    return [];
  }
}

/** Skriver tilbake at e-posten er sendt. Returnerer om det gikk. */
export async function merkSendt(
  kontaktId: string,
  felt: Record<string, string>,
): Promise<boolean> {
  if (!harToken()) return false;
  try {
    const svar = await fetch(`${BASIS}/crm/v3/objects/contacts/${kontaktId}`, {
      method: "PATCH",
      headers: hoder(),
      body: JSON.stringify({ properties: felt }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (svar.ok) return true;
    console.error(
      `[leadepost] Klarte ikke merke kontakt ${kontaktId} som sendt (${svar.status}). ${await svar.text().catch(() => "")}`,
    );
    return false;
  } catch (feil) {
    console.error("[leadepost] Merkingen feilet.", feil);
    return false;
  }
}

/**
 * Legger e-posten i kontaktens tidslinje.
 *
 * FØRST SOM E-POSTAKTIVITET, så som notat. E-postaktiviteten er riktig
 * type og vises som en e-post; den krever en tilgang tokenet kanskje ikke
 * har. Notatet krever mindre og er bedre enn ingenting.
 *
 * FEILER BEGGE, SKJER INGENTING ANNET ENN EN LOGGLINJE. En e-post som er
 * sendt, men ikke logget, er fortsatt sendt — og kontakten har uansett
 * datoen i `lead_epost1_sendt`.
 */
export async function loggEpost(
  kontaktId: string,
  emne: string,
  tekst: string,
): Promise<void> {
  if (!harToken()) return;
  const na = new Date().toISOString();
  const kobling = (typeId: number) => [
    {
      to: { id: kontaktId },
      types: [
        { associationCategory: "HUBSPOT_DEFINED", associationTypeId: typeId },
      ],
    },
  ];

  const forsok = [
    {
      sti: "emails",
      kropp: {
        properties: {
          hs_timestamp: na,
          hs_email_direction: "EMAIL",
          hs_email_status: "SENT",
          hs_email_subject: emne,
          hs_email_text: tekst,
        },
        associations: kobling(198),
      },
    },
    {
      sti: "notes",
      kropp: {
        properties: { hs_timestamp: na, hs_note_body: `${emne}\n\n${tekst}` },
        associations: kobling(202),
      },
    },
  ];

  for (const f of forsok) {
    try {
      const svar = await fetch(`${BASIS}/crm/v3/objects/${f.sti}`, {
        method: "POST",
        headers: hoder(),
        body: JSON.stringify(f.kropp),
        signal: AbortSignal.timeout(TIDSTAK_MS),
      });
      if (svar.ok) return;
      console.error(
        `[leadepost] Klarte ikke logge e-posten som ${f.sti} (${svar.status}).`,
      );
    } catch {
      /* neste forsøk */
    }
  }
}
