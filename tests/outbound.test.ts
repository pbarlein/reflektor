import assert from "node:assert/strict";
import test from "node:test";

import {
  bookingslug,
  erOutboundBooking,
  moteEmne,
  motekanal,
} from "@/lib/hubspotcrm.ts";

/**
 * Outbound-møtene, bestilt 06.10.2026.
 *
 * HVA SOM STÅR PÅ SPILL: Impact Motion får betalt per booket møte fra
 * outbound. Fakturagrunnlaget er avtalene som har gått inn i «Møte booket»
 * med kilde «Outbound – Impact Motion». Teller koden feil her, fakturerer
 * vi feil — i den ene eller den andre retningen.
 *
 * SKILLET ER BOOKINGSIDEN. Outbound-leadene booker på reflektor.no/booking,
 * som går til en egen HubSpot-side. HubSpot skriver den som en konvertering
 * på kontakten: «Meetings Link: reflektor/outbound». Lest ut av portalen
 * 06.10.2026 — de tre kontaktene som har booket står alle med «Meetings
 * Link: paal-barlein/intro», som er inbound-siden.
 */

/* ───────────────────── GJENKJENNINGEN AV SLUGGEN ────────────────────── */

test("outbound-sluggen kjennes igjen, inbound gjør det ikke", () => {
  assert.equal(erOutboundBooking("Meetings Link: reflektor/outbound"), true);
  assert.equal(erOutboundBooking("Meetings Link: paal-barlein/intro"), false);
});

/**
 * ALT SOM IKKE ER OUTBOUND-SIDEN ER INBOUND. Et skjemalead, et Meta-lead,
 * en tredje bookingside, en tom verdi. Å gjette feil vei ville satt kilden
 * «Outbound» på et møte Impact Motion ikke har skaffet.
 */
test("alt annet regnes som inbound", () => {
  for (const hendelse of [
    "",
    "reflektor.no – kontaktskjema",
    "Facebook Lead Ads: Reflektor SoMe-abonnement",
    "Meetings Link: reflektor/noe-annet",
    "reflektor/outbound",
  ]) {
    assert.equal(erOutboundBooking(hendelse), false, hendelse || "(tom)");
  }
});

/** Store og små bokstaver og en ekstra skråstrek skal ikke avgjøre noe. */
test("sluggen leses tålelig", () => {
  assert.equal(bookingslug("Meetings Link: reflektor/outbound"), "reflektor/outbound");
  assert.equal(bookingslug("MEETINGS LINK:  /reflektor/outbound/ "), "reflektor/outbound");
  assert.equal(bookingslug("reflektor.no – kontaktskjema"), "");
});

/* ──────────────────── AVTALEN SOM FØLGER AV MØTET ───────────────────── */

/** Pipelinen slik HubSpot svarer, kontrollert 06.10.2026. */
const PIPELINE = {
  results: [
    {
      id: "default",
      label: "Reflektor – salg",
      stages: [
        { id: "appointmentscheduled", label: "Interessert", displayOrder: 0 },
        { id: "presentationscheduled", label: "Møte booket", displayOrder: 1 },
        { id: "decisionmakerboughtin", label: "Tilbud sendt", displayOrder: 2 },
        { id: "closedwon", label: "Vunnet", displayOrder: 3 },
        { id: "6002758898", label: "Hviler", displayOrder: 4 },
        { id: "closedlost", label: "Tapt", displayOrder: 5 },
      ],
    },
  ],
};

const NA = new Date("2026-10-06T13:15:00Z");
const FERSK = "2026-10-06T13:00:00Z";

const OUTBOUND = "Meetings Link: reflektor/outbound";
const INBOUND = "Meetings Link: paal-barlein/intro";
const KILDE = "Outbound – Impact Motion";

const kontakt = (endringer: Record<string, unknown> = {}) => ({
  id: "900100100",
  epost: "ingrid@nordlysbakeri.no",
  navn: "Ingrid Nordlys",
  bedrift: "Nordlys Bakeri AS",
  telefon: "+47 900 11 222",
  lifecycle: "lead",
  hendelse: OUTBOUND,
  forsteHendelse: "",
  bookingKilde: "",
  bookingMedium: "",
  analysekilde: "",
  konvertert: "2026-10-06T09:00:00Z",
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "2026-10-14T09:00:00Z",
  metasvar: [],
  ...endringer,
});

type Oppsett = {
  /** Avtaler per kontakt-ID, med stadium og eventuell kilde fra før. */
  avtaler: Record<
    string,
    { id: string; stadium: string; opprettet?: string; kilde?: string }[]
  >;
  /** Kontakter søket på telefon og bedrift skal finne. */
  makkere?: ReturnType<typeof kontakt>[];
  /** Selskapene kontakten henger på. */
  selskaper?: Record<string, string[]>;
  /** Svar HubSpot gir på POST av en ny avtale. */
  opprettStatus?: number;
};

/** Kjører jobben mot en falsk HubSpot og rapporterer hva som ble skrevet. */
async function medHubspot(
  oppsett: Oppsett,
  booket: ReturnType<typeof kontakt>[],
) {
  const opprinnelig = globalThis.fetch;
  const for_ = { ...process.env };
  const logg = console.info;
  const feil = console.error;

  const flyttet: { avtale: string; stadium: string }[] = [];
  const kilder: { avtale: string; kilde: string }[] = [];
  const opprettet: Record<string, string>[] = [];
  const koblet: { avtale: string; type: string; id: string }[] = [];
  const kontaktfelt: { kontakt: string; felt: Record<string, string> }[] = [];
  const emner: string[] = [];

  process.env.HUBSPOT_TOKEN = "test";
  /* Uten nøkkelen ville `send` gitt seg med én gang, og vi testet ingenting. */
  process.env.RESEND_API_KEY = "test";
  console.info = () => {};
  console.error = () => {};

  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    const metode = init?.method ?? "GET";
    const kropp = init?.body ? JSON.parse(String(init.body)) : undefined;

    if (url.startsWith("https://api.resend.com/")) {
      emner.push((kropp as { subject: string }).subject);
      return Response.json({ id: "e1" });
    }

    if (url.includes("/crm/v3/pipelines/deals")) return Response.json(PIPELINE);

    const tilAvtaler = url.match(/\/contacts\/(\d+)\/associations\/deals/);
    if (tilAvtaler) {
      return Response.json({
        results: (oppsett.avtaler[tilAvtaler[1]!] ?? []).map((a) => ({
          toObjectId: a.id,
        })),
      });
    }

    const tilSelskap = url.match(/\/contacts\/(\d+)\/associations\/companies/);
    if (tilSelskap) {
      return Response.json({
        results: (oppsett.selskaper?.[tilSelskap[1]!] ?? []).map((id) => ({
          toObjectId: id,
        })),
      });
    }

    if (url.includes("/objects/deals/batch/read")) {
      const bedt = (kropp as { inputs: { id: string }[] }).inputs.map((i) => i.id);
      return Response.json({
        results: Object.values(oppsett.avtaler)
          .flat()
          .filter((a) => bedt.includes(a.id))
          .map((a) => ({
            id: a.id,
            properties: {
              dealstage: a.stadium,
              createdate: a.opprettet ?? FERSK,
              kilde: a.kilde ?? "",
            },
          })),
      });
    }

    /* Aktivitetene på en avtale: ingen, så dubletten kan arkiveres. */
    if (/\/objects\/deals\/\d+\?associations=/.test(url)) {
      return Response.json({ associations: {} });
    }

    const kobling = url.match(
      /\/objects\/deals\/(\d+)\/associations\/default\/(contacts|companies)\/(\d+)$/,
    );
    if (kobling && metode === "PUT") {
      koblet.push({ avtale: kobling[1]!, type: kobling[2]!, id: kobling[3]! });
      return Response.json({});
    }

    if (url.endsWith("/crm/v3/objects/deals") && metode === "POST") {
      if (oppsett.opprettStatus) {
        return new Response("nei", { status: oppsett.opprettStatus });
      }
      const p = (kropp as { properties: Record<string, string> }).properties;
      opprettet.push(p);
      return Response.json({ id: "9999" });
    }

    const avtale = url.match(/\/objects\/deals\/(\d+)$/);
    if (avtale && metode === "PATCH") {
      const p = (kropp as { properties: Record<string, string> }).properties;
      if (p.dealstage) flyttet.push({ avtale: avtale[1]!, stadium: p.dealstage });
      if (p.kilde) kilder.push({ avtale: avtale[1]!, kilde: p.kilde });
      return Response.json({ id: avtale[1] });
    }
    if (avtale && metode === "DELETE") return new Response(null, { status: 204 });

    const patchKontakt = url.match(/\/objects\/contacts\/(\d+)$/);
    if (patchKontakt && metode === "PATCH") {
      kontaktfelt.push({
        kontakt: patchKontakt[1]!,
        felt: (kropp as { properties: Record<string, string> }).properties,
      });
      return Response.json({ id: patchKontakt[1] });
    }

    if (url.includes("/objects/contacts/search")) {
      return Response.json({
        results: (oppsett.makkere ?? []).map((m) => ({
          id: m.id,
          properties: {
            email: m.epost,
            firstname: m.navn,
            company: m.bedrift,
            phone: m.telefon,
            recent_conversion_event_name: m.hendelse,
            engagements_last_meeting_booked: m.moteBooket,
          },
        })),
      });
    }

    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    const { flyttAvtalerForBookede } = await import("@/lib/leadutsending.ts");
    const telling = await flyttAvtalerForBookede(
      booket as never,
      NA,
    );
    return { telling, flyttet, kilder, opprettet, koblet, kontaktfelt, emner };
  } finally {
    globalThis.fetch = opprinnelig;
    console.info = logg;
    console.error = feil;
    process.env = for_;
  }
}

test("outbound-booking med avtale i Interessert: flyttes og får kilde", async () => {
  const { telling, flyttet, kilder } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt()],
  );

  assert.equal(telling.flyttet, 1);
  assert.equal(telling.opprettet, 0);
  assert.deepEqual(flyttet, [
    { avtale: "9001", stadium: "presentationscheduled" },
  ]);
  assert.deepEqual(kilder, [{ avtale: "9001", kilde: KILDE }]);
});

/**
 * MØTET UTEN AVTALE. Den som er ringt opp av Impact Motion har aldri vært
 * innom skjemaet vårt, så ingen arbeidsflyt har laget en avtale. Uten en ny
 * avtale ville møtet vært booket uten at noe talte det.
 */
test("outbound-booking uten avtale: ny avtale i Møte booket", async () => {
  const { telling, opprettet, koblet } = await medHubspot(
    { avtaler: {}, selskaper: { "900100100": ["7001"] } },
    [kontakt()],
  );

  assert.equal(telling.opprettet, 1);
  assert.equal(opprettet.length, 1);
  assert.equal(opprettet[0]!.dealname, "Nordlys Bakeri AS – outbound");
  assert.equal(opprettet[0]!.dealstage, "presentationscheduled");
  assert.equal(opprettet[0]!.pipeline, "default");
  assert.equal(opprettet[0]!.kilde, KILDE);

  /* Avtalen skal henge på både kontakten og selskapet. */
  assert.deepEqual(koblet, [
    { avtale: "9999", type: "contacts", id: "900100100" },
    { avtale: "9999", type: "companies", id: "7001" },
  ]);
});

/**
 * TILBUD SENDT RØRES IKKE, OG FÅR HELLER INGEN NY AVTALE VED SIDEN AV.
 * Saken er i gang; et nytt møte i den er ikke et nytt salg.
 */
test("outbound-booking med avtale i Tilbud sendt: ingenting skjer", async () => {
  const { telling, flyttet, kilder, opprettet } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "decisionmakerboughtin" }] } },
    [kontakt()],
  );

  assert.equal(telling.flyttet, 0);
  assert.equal(telling.opprettet, 0);
  assert.deepEqual(flyttet, []);
  assert.deepEqual(kilder, []);
  assert.deepEqual(opprettet, []);
});

/**
 * HVILER OG TAPT ER LAGT BORT. Booker hun på nytt via outbound, er det en
 * ny sak — og det er et fakturerbart møte.
 */
test("outbound-booking på en sak som hviler eller er tapt: ny avtale", async () => {
  for (const stadium of ["6002758898", "closedlost"]) {
    const { telling, flyttet, opprettet } = await medHubspot(
      { avtaler: { "900100100": [{ id: "9001", stadium }] } },
      [kontakt()],
    );
    assert.equal(telling.opprettet, 1, stadium);
    assert.equal(opprettet[0]!.kilde, KILDE, stadium);
    assert.deepEqual(flyttet, [], stadium);
  }
});

/**
 * INBOUND SKAL ALDRI FÅ KILDE OUTBOUND. Det er den feilen som koster
 * penger: et møte Reflektor skaffet selv, fakturert som Impact Motions.
 */
test("inbound-booking: flyttes som før, kilden røres ikke", async () => {
  const { telling, flyttet, kilder, opprettet, kontaktfelt } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt({ hendelse: INBOUND })],
  );

  assert.equal(telling.flyttet, 1);
  assert.deepEqual(flyttet, [
    { avtale: "9001", stadium: "presentationscheduled" },
  ]);
  assert.deepEqual(kilder, []);
  assert.deepEqual(opprettet, []);
  assert.deepEqual(kontaktfelt, []);
});

/** Et inbound-lead uten avtale får heller ingen avtale laget. */
test("inbound-booking uten avtale: ingen ny avtale", async () => {
  const { telling, opprettet } = await medHubspot({ avtaler: {} }, [
    kontakt({ hendelse: INBOUND }),
  ]);

  assert.equal(telling.opprettet, 0);
  assert.deepEqual(opprettet, []);
});

/**
 * EN KILDE SOM ALT STÅR DER, STÅR. «Meta» på avtalen betyr at noen har
 * bestemt hvor leadet kom fra, og en booking er ikke grunn til å overprøve
 * dem.
 */
test("en avtale som alt har en annen kilde beholder den", async () => {
  const { kilder } = await medHubspot(
    {
      avtaler: {
        "900100100": [
          { id: "9001", stadium: "appointmentscheduled", kilde: "Meta" },
        ],
      },
    },
    [kontakt()],
  );

  assert.deepEqual(kilder, []);
});

/**
 * SAMME SELSKAP, ANNEN E-POST. Booker noen med en annen adresse enn den
 * HubSpot har fra før, lager HubSpot en ny kontakt. Dublettsjekken på
 * telefon og bedriftsnavn finner den opprinnelige avtalen, og da skal den
 * flyttes — ikke en ny lages ved siden av.
 */
test("samme selskap med en annen e-post gir ingen avtale nummer to", async () => {
  const booker = kontakt({ id: "900100100", epost: "ingrid@gmail.com" });
  const makker = kontakt({
    id: "900200200",
    epost: "ingrid@nordlysbakeri.no",
    bedrift: "Nordlys Bakeri",
    moteBooket: "",
  });

  const { telling, flyttet, kilder, opprettet } = await medHubspot(
    {
      avtaler: {
        "900200200": [{ id: "8001", stadium: "appointmentscheduled" }],
      },
      makkere: [makker],
    },
    [booker],
  );

  assert.equal(telling.opprettet, 0, "det skulle ikke blitt laget en ny avtale");
  assert.deepEqual(opprettet, []);
  assert.deepEqual(flyttet, [
    { avtale: "8001", stadium: "presentationscheduled" },
  ]);
  assert.deepEqual(kilder, [{ avtale: "8001", kilde: KILDE }]);
});

/**
 * OUTBOUND-LEADS SKAL IKKE HA INBOUND-E-POSTENE. Presentasjonen og
 * påminnelsen er skrevet til noen som nettopp fylte ut skjemaet vårt.
 */
test("outbound-booking slår av oppfølgings-e-postene", async () => {
  const { kontaktfelt } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt()],
  );

  assert.deepEqual(kontaktfelt, [
    { kontakt: "900100100", felt: { paminnelse_avbrutt: "true" } },
  ]);
});

/** Er den alt slått av, skrives den ikke på nytt hvert femte minutt. */
test("flagget skrives ikke om igjen når det alt står", async () => {
  const { kontaktfelt } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt({ avbrutt: "true" })],
  );

  assert.deepEqual(kontaktfelt, []);
});

/** Feiler opprettelsen, telles den som en feil og resten går videre. */
test("en avtale som ikke lot seg opprette telles som feil", async () => {
  const { telling } = await medHubspot(
    { avtaler: {}, opprettStatus: 403 },
    [kontakt()],
  );

  assert.equal(telling.opprettet, 0);
  assert.equal(telling.feilet, 1);
});

/* ─────────── EMNET PÅ MØTEVARSELET (bestilt 06.10.2026) ─────────────── */

/**
 * Pål leser varselet på mobil og skal se på én linje hvem som skaffet
 * møtet. HubSpot sender også sitt eget, men emnet der er fast — «Du har
 * blitt booket av: …» — og sier ingenting om kanal.
 *
 * KANALEN INNENFOR OUTBOUND KOMMER FRA SPORINGSPARAMETERNE på lenken.
 * Impact Motion må legge dem på: reflektor.no/booking?utm_source=instantly
 * for e-post, ?utm_source=heyreach for LinkedIn. Uten dem kan de to ikke
 * skilles, og da står det bare «outbound».
 */
test("emnet sier gruppe og kanal", () => {
  const k = (endringer: Record<string, string>) => ({
    hendelse: OUTBOUND,
    forsteHendelse: "",
    bookingKilde: "",
    bookingMedium: "",
    analysekilde: "",
    ...endringer,
  });

  assert.equal(
    moteEmne(motekanal(k({ bookingKilde: "instantly" }))),
    "NYTT MØTE outbound e-post",
  );
  assert.equal(
    moteEmne(motekanal(k({ bookingKilde: "masterinbox" }))),
    "NYTT MØTE outbound e-post",
  );
  assert.equal(
    moteEmne(motekanal(k({ bookingKilde: "heyreach" }))),
    "NYTT MØTE outbound LinkedIn",
  );
  assert.equal(
    moteEmne(motekanal(k({ bookingMedium: "linkedin" }))),
    "NYTT MØTE outbound LinkedIn",
  );
});

/** Uten sporingsparametere står det «outbound» alene, ikke en gjetning. */
test("outbound uten sporing får ingen påstått kanal", () => {
  assert.equal(
    moteEmne(
      motekanal({
        hendelse: OUTBOUND,
        forsteHendelse: "",
        bookingKilde: "",
        bookingMedium: "",
        analysekilde: "",
      }),
    ),
    "NYTT MØTE outbound",
  );
});

/**
 * INBOUND SKILLER META FRA NETTSIDEN. Verdiene er lest ut av portalen
 * 06.10.2026: Meta-leadet fra 04.10 har «meta»/«paid_social» på bookingen
 * og PAID_SOCIAL som kanal, fordi annonsen la parameterne på lenken.
 */
test("inbound skiller Meta fra reflektor.no", () => {
  const meta = motekanal({
    hendelse: INBOUND,
    forsteHendelse: "Meetings Link: paal-barlein/intro",
    bookingKilde: "meta",
    bookingMedium: "paid_social",
    analysekilde: "PAID_SOCIAL",
  });
  assert.equal(moteEmne(meta), "NYTT MØTE inbound Meta");

  const nettside = motekanal({
    hendelse: INBOUND,
    forsteHendelse: "/kontaktoss: reflektor.no – kontaktskjema",
    bookingKilde: "",
    bookingMedium: "",
    analysekilde: "DIRECT_TRAFFIC",
  });
  assert.equal(moteEmne(nettside), "NYTT MØTE inbound reflektor.no");
});

/** Et Meta-lead kjennes igjen på skjemanavnet alene, uten sporing. */
test("Facebook Lead Ads alene er nok til å si Meta", () => {
  assert.equal(
    moteEmne(
      motekanal({
        hendelse: INBOUND,
        forsteHendelse: "Facebook Lead Ads: Reflektor SoMe-abonnement okt 2026",
        bookingKilde: "",
        bookingMedium: "",
        analysekilde: "",
      }),
    ),
    "NYTT MØTE inbound Meta",
  );
});

/**
 * VARSELET GÅR NÅR AVTALEN FAKTISK KOMMER INN I «MØTE BOOKET», og navnet
 * står i emnet så to møter samme dag ikke havner i samme Gmail-tråd.
 */
test("varselet sendes med kanalen i emnet", async () => {
  const { telling, emner } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt({ bookingKilde: "heyreach" })],
  );

  assert.equal(telling.varslet, 1);
  assert.deepEqual(emner, [
    "NYTT MØTE outbound LinkedIn – Ingrid Nordlys (Nordlys Bakeri AS)",
  ]);
});

test("en ny avtale for et outbound-møte varsles også", async () => {
  const { telling, emner } = await medHubspot({ avtaler: {} }, [
    kontakt({ bookingKilde: "instantly" }),
  ]);

  assert.equal(telling.opprettet, 1);
  assert.deepEqual(emner, [
    "NYTT MØTE outbound e-post – Ingrid Nordlys (Nordlys Bakeri AS)",
  ]);
});

test("inbound-booking gir varsel med inbound i emnet", async () => {
  const { emner } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [
      kontakt({
        hendelse: INBOUND,
        forsteHendelse: "/kontaktoss: reflektor.no – kontaktskjema",
      }),
    ],
  );

  assert.deepEqual(emner, [
    "NYTT MØTE inbound reflektor.no – Ingrid Nordlys (Nordlys Bakeri AS)",
  ]);
});

/**
 * STÅR AVTALEN ALLEREDE I «MØTE BOOKET», ER MØTET ALT VARSLET OM. Jobben
 * kjører hvert femte minutt i fjorten dager; uten denne regelen ville Pål
 * fått det samme varselet rundt fire tusen ganger.
 */
test("ingen varsel når avtalen alt står i Møte booket", async () => {
  const { telling, emner } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "presentationscheduled" }] } },
    [kontakt()],
  );

  assert.equal(telling.varslet, 0);
  assert.deepEqual(emner, []);
});

/** Et møte på en sak i Tilbud sendt flytter ingenting, og varsler ikke. */
test("ingen varsel når ingenting ble gjort", async () => {
  const { telling, emner } = await medHubspot(
    { avtaler: { "900100100": [{ id: "9001", stadium: "decisionmakerboughtin" }] } },
    [kontakt()],
  );

  assert.equal(telling.varslet, 0);
  assert.deepEqual(emner, []);
});
