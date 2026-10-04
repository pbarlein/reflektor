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
import { planlagtSending, venterPaaVinduet } from "./sendevindu";

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
  /**
   * Når e-post 1 går ut, hvis den ennå ikke har gått.
   *
   * Null betyr at den er sendt. Satt betyr at leadet kom utenom
   * sendevinduet og ligger i kø — se lib/sendevindu.ts. Pål skal kunne se
   * på denne siden at e-posten ikke har gått ennå, ikke bare at det kommer
   * en påminnelse en gang.
   */
  planlagtEpost1: Date | null;
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

    const na = new Date();

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
          /*
            VENTER E-POST 1 PÅ SENDEVINDUET, regnes påminnelsen fra den
            PLANLAGTE sendetiden og ikke fra innsendingen. Et lead som kom
            lørdag kl. 23 får e-posten søndag kl. 08 og påminnelsen mandag
            — ikke søndag.
          */
          planlagtEpost1:
            !p.lead_epost1_sendt && venterPaaVinduet(na)
              ? planlagtSending(na)
              : null,
          sendtInn: new Date(
            p.lead_epost1_sendt ??
              (venterPaaVinduet(na)
                ? planlagtSending(na).toISOString()
                : (p.recent_conversion_date ?? Date.now())),
          ),
        };
      })
      /*
        PÅMINNELSER SOM ALLEREDE HAR GÅTT, ER IKKE NOE Å AVBRYTE. Filteret
        ligger her og ikke i siden: `Date.now()` under rendring er en uren
        verdi, og React-kompilatoren avviser den med rette — to rendringer av
        samme data ville gitt to forskjellige lister.
      */
      .filter(
        (l) => l.epost && paaminnelseTidspunkt(l.sendtInn).getTime() > na.getTime(),
      );
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

/**
 * Stadiene på avtalene som henger på kontakten. Tom liste ved feil.
 *
 * Bygger på `avtalerFor`, så det finnes bare én vei til avtalene.
 */
export async function dealstadier(kontaktId: string): Promise<string[]> {
  return (await avtalerFor(kontaktId)).map((a) => a.stadium);
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

/* ──────────── AVTALEN FLYTTES TIL «MØTE BOOKET» (04.10.2026) ─────────── */

/**
 * Pipelinen og stadiet vi flytter til, slått opp i HubSpot.
 *
 * IKKE HARDKODET, og det er et poeng. Stadie-ID-ene i denne porteføljen er
 * en blanding av HubSpots standardnavn (`presentationscheduled` heter «Møte
 * booket») og et rent tall (`6002758898` heter «Hviler»). Skriver noen om
 * pipelinen, skal koden følge etter — ikke flytte avtaler til et stadium
 * som ikke finnes lenger.
 *
 * REKKEFØLGEN KOMMER OGSÅ FRA API-ET, og det er den som avgjør hva som er
 * «et tidligere stadium». Da trenger vi ingen liste over hvilke stadier
 * som IKKE skal røres: Tilbud sendt, Vunnet, Hviler og Tapt ligger alle
 * etter Møte booket, og regelen «bare framover» dekker alle fire.
 */
export type Stadiekart = {
  /** ID-en til «Møte booket». */
  maal: string;
  /** Stadie-ID → rekkefølge i pipelinen. */
  ordre: Map<string, number>;
};

/** Navnet på pipelinen og stadiet, slik de står i HubSpot. */
const PIPELINE_NAVN = "Reflektor – salg";
const MAALSTADIUM = "Møte booket";

/** Tegnvask før sammenligning: «–» og «-» skal regnes som samme strek. */
function likNavn(a: string, b: string): boolean {
  const vask = (t: string) =>
    t
      .toLocaleLowerCase("nb-NO")
      .replace(/[‐-―]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  return vask(a) === vask(b);
}

/**
 * Henter stadiekartet.
 *
 * ETT OPPSLAG PER KJØRING, OG INGEN MELLOMLAGRING. Den som kaller, henter
 * kartet én gang og bruker det på alle kontaktene. Her sto en cache på
 * modulnivå; den gjorde koden umulig å teste ærlig — én test fylte
 * cachen, og de neste testet aldri oppslaget. Et GET hvert femte minutt er
 * en billigere pris enn en test som later som.
 */
export async function hentStadiekart(): Promise<Stadiekart | null> {
  if (!harToken()) return null;

  try {
    const svar = await fetch(`${BASIS}/crm/v3/pipelines/deals`, {
      headers: hoder(),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (!svar.ok) {
      console.error(
        `[avtale] Fikk ikke pipelinene (${svar.status}). ${await svar.text().catch(() => "")}`,
      );
      return null;
    }

    const data = (await svar.json()) as {
      results?: {
        label?: string;
        stages?: { id?: string; label?: string; displayOrder?: number }[];
      }[];
    };

    const pipeline =
      data.results?.find((p) => likNavn(p.label ?? "", PIPELINE_NAVN)) ??
      /* Finnes bare én, er det den. Navnet kan være endret. */
      (data.results?.length === 1 ? data.results[0] : undefined);

    if (!pipeline?.stages?.length) {
      console.error(`[avtale] Fant ikke pipelinen «${PIPELINE_NAVN}».`);
      return null;
    }

    const maal = pipeline.stages.find((s) => likNavn(s.label ?? "", MAALSTADIUM));
    if (!maal?.id) {
      console.error(`[avtale] Fant ikke stadiet «${MAALSTADIUM}».`);
      return null;
    }

    const ordre = new Map<string, number>();
    for (const s of pipeline.stages) {
      if (s.id) ordre.set(s.id, s.displayOrder ?? 0);
    }

    return { maal: maal.id, ordre };
  } catch (feil) {
    console.error("[avtale] Oppslaget av pipelinene feilet.", feil);
    return null;
  }
}

export type Avtale = {
  id: string;
  stadium: string;
  /** Når avtalen ble opprettet. Styrer 24-timersgrensen for arkivering. */
  opprettet: string;
};

/** Avtalene som henger på kontakten, med id og stadium. Tom ved feil. */
export async function avtalerFor(kontaktId: string): Promise<Avtale[]> {
  if (!harToken()) return [];
  try {
    const kobling = await fetch(
      `${BASIS}/crm/v4/objects/contacts/${kontaktId}/associations/deals?limit=20`,
      { headers: hoder(), signal: AbortSignal.timeout(TIDSTAK_MS) },
    );
    if (!kobling.ok) {
      console.error(
        `[avtale] Fikk ikke avtalene til kontakt ${kontaktId} (${kobling.status}). Mangler tokenet crm.objects.deals.read?`,
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
        properties: ["dealstage", "createdate"],
        inputs: ider.map((id) => ({ id })),
      }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (!avtaler.ok) return [];
    return (
      (
        (await avtaler.json()) as {
          results?: {
            id: string;
            properties: { dealstage?: string; createdate?: string };
          }[];
        }
      ).results
        ?.filter((d) => d.properties.dealstage)
        .map((d) => ({
          id: d.id,
          stadium: d.properties.dealstage!,
          opprettet: d.properties.createdate ?? "",
        })) ?? []
    );
  } catch (feil) {
    console.error("[avtale] Oppslag av avtaler feilet.", feil);
    return [];
  }
}

/**
 * Flytter én avtale til et nytt stadium.
 *
 * KREVER `crm.objects.deals.write`. Mangler den, svarer HubSpot 403, og da
 * sier logglinjen det rett ut — det er den ene feilen som ikke retter seg
 * selv.
 */
export async function flyttAvtale(
  avtaleId: string,
  stadium: string,
): Promise<boolean> {
  if (!harToken()) return false;
  try {
    const svar = await fetch(`${BASIS}/crm/v3/objects/deals/${avtaleId}`, {
      method: "PATCH",
      headers: hoder(),
      body: JSON.stringify({ properties: { dealstage: stadium } }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (svar.ok) return true;
    console.error(
      `[avtale] Klarte ikke flytte avtale ${avtaleId} (${svar.status})${svar.status === 403 ? " — mangler tokenet crm.objects.deals.write?" : ""}. ${await svar.text().catch(() => "")}`,
    );
    return false;
  } catch (feil) {
    console.error("[avtale] Flyttingen feilet.", feil);
    return false;
  }
}

/**
 * Kontakter som kan være samme person som `k`, slått opp på telefon eller
 * bedrift.
 *
 * SØKET ER BREDT, FILTERET ER SMALT. HubSpot kan ikke søke på «slutter
 * med», så vi ber om eksakte treff på de tre feltene og lar
 * `sammePerson` i lib/leadepost.ts avgjøre. Det var bedriftsnavnet som
 * bandt de to kontaktene sammen 04.10.2026 — bookingkontakten hadde ikke
 * telefonnummer i det hele tatt.
 */
export async function mulighetsmakker(
  k: Leadkontakt,
): Promise<Leadkontakt[] | null> {
  const grupper: { filters: Record<string, string>[] }[] = [];
  const telefon = k.telefon.trim();
  if (telefon) {
    grupper.push({ filters: [{ propertyName: "phone", operator: "EQ", value: telefon }] });
    grupper.push({
      filters: [{ propertyName: "mobilephone", operator: "EQ", value: telefon }],
    });
  }
  if (k.bedrift.trim()) {
    grupper.push({
      filters: [{ propertyName: "company", operator: "EQ", value: k.bedrift.trim() }],
    });
  }
  if (!grupper.length) return [];
  return sok(grupper, 20);
}

/* ────────── DUBLETTAVTALEN VED BOOKING (04.10.2026) ─────────────────── */

/** Aktivitetstypene som betyr at noen har jobbet med avtalen. */
const AKTIVITETER = ["notes", "calls", "emails", "tasks"] as const;

/**
 * Har noen gjort noe med avtalen etter at den ble opprettet?
 *
 * HVORFOR IKKE BARE «HAR DEN NOTATER». Arbeidsflyten legger selv et notat
 * på avtalen i samme øyeblikk den lages — kontrollert på de to avtalene fra
 * 04.10.2026, begge hadde ett notat. En regel om «ingen notater» ville
 * derfor aldri slått til, og nettopp den avtalen vi vil rydde bort hadde
 * stått igjen.
 *
 * GRENSEN ER TI MINUTTER ETTER OPPRETTELSEN. Alt som kom med i selve
 * opprettelsen, regnes som maskinens eget. Skriver Pål et notat etterpå, er
 * avtalen hans — og da røres den ikke.
 *
 * `null` BETYR AT VI IKKE FIKK SVAR, og den som spør skal da la avtalen
 * stå. Å slette noe vi ikke klarte å sjekke, er den ene feilen som ikke kan
 * rettes med et nytt kall.
 */
export async function harEgenAktivitet(
  avtaleId: string,
  opprettet: string,
): Promise<boolean | null> {
  if (!harToken()) return null;
  const grense = new Date(opprettet).getTime() + 10 * 60 * 1000;
  if (Number.isNaN(grense)) return null;

  try {
    const svar = await fetch(
      `${BASIS}/crm/v3/objects/deals/${avtaleId}?associations=${AKTIVITETER.join(",")}`,
      { headers: hoder(), signal: AbortSignal.timeout(TIDSTAK_MS) },
    );
    if (!svar.ok) {
      console.error(
        `[avtale] Fikk ikke aktivitetene på avtale ${avtaleId} (${svar.status}).`,
      );
      return null;
    }

    const data = (await svar.json()) as {
      associations?: Record<string, { results?: { id: string }[] }>;
    };

    for (const type of AKTIVITETER) {
      const ider = data.associations?.[type]?.results?.map((r) => r.id) ?? [];
      if (!ider.length) continue;

      const les = await fetch(`${BASIS}/crm/v3/objects/${type}/batch/read`, {
        method: "POST",
        headers: hoder(),
        body: JSON.stringify({
          properties: ["hs_createdate"],
          inputs: ider.slice(0, 50).map((id) => ({ id })),
        }),
        signal: AbortSignal.timeout(TIDSTAK_MS),
      });
      if (!les.ok) return null;

      const poster = (
        (await les.json()) as {
          results?: { properties: { hs_createdate?: string } }[];
        }
      ).results;

      for (const a of poster ?? []) {
        const laget = new Date(a.properties.hs_createdate ?? "").getTime();
        /* Mangler tidspunktet, regner vi den som noens eget arbeid. */
        if (Number.isNaN(laget) || laget > grense) return true;
      }
    }

    return false;
  } catch (feil) {
    console.error("[avtale] Oppslag av aktiviteter feilet.", feil);
    return null;
  }
}

/**
 * Arkiverer en avtale.
 *
 * SLETTINGEN ER GJENOPPRETTBAR. HubSpot flytter avtalen til papirkurven og
 * holder den der i nitti dager, så en feil her kan rettes i grensesnittet.
 * Det er grunnen til at dette i det hele tatt kan gjøres av en maskin.
 */
export async function arkiverAvtale(avtaleId: string): Promise<boolean> {
  if (!harToken()) return false;
  try {
    const svar = await fetch(`${BASIS}/crm/v3/objects/deals/${avtaleId}`, {
      method: "DELETE",
      headers: hoder(),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });
    if (svar.ok || svar.status === 204) return true;
    console.error(
      `[avtale] Klarte ikke arkivere avtale ${avtaleId} (${svar.status})${svar.status === 403 ? " — mangler tokenet crm.objects.deals.write?" : ""}.`,
    );
    return false;
  } catch (feil) {
    console.error("[avtale] Arkiveringen feilet.", feil);
    return false;
  }
}

/**
 * Knytter en kontakt til en avtale.
 *
 * SÅ BOOKINGEN VISES DER DEN HØRER HJEMME. Arkiverer vi avtalen bookingen
 * laget, må kontakten som booket henge på avtalen som blir stående —
 * ellers forsvinner sporet av møtet fra den.
 */
export async function knyttKontaktTilAvtale(
  avtaleId: string,
  kontaktId: string,
): Promise<boolean> {
  if (!harToken()) return false;
  try {
    const svar = await fetch(
      `${BASIS}/crm/v4/objects/deals/${avtaleId}/associations/default/contacts/${kontaktId}`,
      {
        method: "PUT",
        headers: hoder(),
        signal: AbortSignal.timeout(TIDSTAK_MS),
      },
    );
    if (svar.ok) return true;
    console.error(
      `[avtale] Klarte ikke knytte kontakt ${kontaktId} til avtale ${avtaleId} (${svar.status}).`,
    );
    return false;
  } catch (feil) {
    console.error("[avtale] Koblingen feilet.", feil);
    return false;
  }
}
