import assert from "node:assert/strict";
import test from "node:test";

/**
 * Avtalen flyttes til «Møte booket» når leadet booker.
 *
 * HubSpot setter `engagements_last_meeting_booked` når noen booker via
 * møtelenken, men flytter ikke avtalen. Pål måtte dra kortet selv.
 *
 * STADIE-ID-ENE SLÅS OPP, IKKE HARDKODES, og testene speiler den faktiske
 * pipelinen: «presentationscheduled» heter «Møte booket», og «Hviler» er et
 * rent tall. Rekkefølgen fra API-et er det som avgjør hva som er «et
 * tidligere stadium» — derfor trengs ingen liste over hva som ikke skal
 * røres.
 */

/** Pipelinen slik HubSpot svarer, kontrollert 04.10.2026. */
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

const kontakt = (endringer: Record<string, unknown> = {}) => ({
  id: "882425783540",
  epost: "bakstogro@outlook.com",
  navn: "Munirat O Ajetunmobi Olabode",
  bedrift: "BAKST & RO",
  telefon: "",
  lifecycle: "lead",
  hendelse: "Meetings Link: paal-barlein/intro",
  konvertert: "2026-10-04T06:39:41Z",
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "2026-10-16T09:00:00Z",
  metasvar: [],
  ...endringer,
});

type Oppsett = {
  /** Avtaler per kontakt-ID. */
  avtaler: Record<string, { id: string; stadium: string }[]>;
  /** Kontakter søket på telefon og bedrift skal finne. */
  makkere?: ReturnType<typeof kontakt>[];
  /** Svar HubSpot gir på PATCH av en avtale. */
  patchStatus?: number;
  /** Status på oppslaget av pipelinene. */
  pipelineStatus?: number;
};

/** Kjører flyttingen mot en falsk HubSpot og returnerer hva som ble flyttet. */
async function medHubspot(
  oppsett: Oppsett,
  booket: ReturnType<typeof kontakt>[],
) {
  const opprinnelig = globalThis.fetch;
  const for_ = { ...process.env };
  const logg = console.info;
  const feil = console.error;
  const flyttet: { avtale: string; stadium: string }[] = [];

  process.env.HUBSPOT_TOKEN = "test";
  console.info = () => {};
  console.error = () => {};

  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    const metode = init?.method ?? "GET";

    if (url.includes("/crm/v3/pipelines/deals")) {
      if (oppsett.pipelineStatus) {
        return new Response("nei", { status: oppsett.pipelineStatus });
      }
      return Response.json(PIPELINE);
    }

    /* Koblingen kontakt → avtaler. */
    const kobling = url.match(/\/contacts\/(\d+)\/associations\/deals/);
    if (kobling) {
      const liste = oppsett.avtaler[kobling[1]!] ?? [];
      return Response.json({
        results: liste.map((a) => ({ toObjectId: a.id })),
      });
    }

    if (url.includes("/objects/deals/batch/read")) {
      const bedt = (JSON.parse(String(init?.body)) as { inputs: { id: string }[] })
        .inputs.map((i) => i.id);
      const alle = Object.values(oppsett.avtaler).flat();
      return Response.json({
        results: alle
          .filter((a) => bedt.includes(a.id))
          .map((a) => ({ id: a.id, properties: { dealstage: a.stadium } })),
      });
    }

    const patch = url.match(/\/objects\/deals\/(\d+)$/);
    if (patch && metode === "PATCH") {
      if (oppsett.patchStatus) {
        return new Response("nei", { status: oppsett.patchStatus });
      }
      const kropp = JSON.parse(String(init?.body)) as {
        properties: { dealstage: string };
      };
      flyttet.push({ avtale: patch[1]!, stadium: kropp.properties.dealstage });
      return Response.json({ id: patch[1] });
    }

    /* Søket etter samme person. */
    if (url.includes("/objects/contacts/search")) {
      return Response.json({
        results: (oppsett.makkere ?? []).map((m) => ({
          id: m.id,
          properties: {
            email: m.epost,
            firstname: m.navn,
            company: m.bedrift,
            phone: m.telefon,
            engagements_last_meeting_booked: m.moteBooket,
          },
        })),
      });
    }

    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    const { flyttAvtalerForBookede } = await import("@/lib/leadutsending.ts");
    const telling = await (
      flyttAvtalerForBookede as (
        b: ReturnType<typeof kontakt>[],
      ) => Promise<{ flyttet: number; "hoppet-over": number; feilet: number }>
    )(booket);
    return { telling, flyttet };
  } finally {
    globalThis.fetch = opprinnelig;
    console.info = logg;
    console.error = feil;
    process.env = for_;
  }
}

test("en avtale i Interessert flyttes til Møte booket", async () => {
  const { telling, flyttet } = await medHubspot(
    { avtaler: { "882425783540": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 1);
  assert.deepEqual(flyttet, [{ avtale: "9001", stadium: "presentationscheduled" }]);
});

/**
 * DE FIRE STADIENE SOM ALDRI SKAL RØRES. Alle ligger etter «Møte booket» i
 * pipelinen, så regelen «bare framover» dekker dem — uten en liste som kan
 * bli utdatert.
 */
test("avtaler i Tilbud sendt, Vunnet, Hviler og Tapt røres ikke", async () => {
  for (const stadium of [
    "decisionmakerboughtin",
    "closedwon",
    "6002758898",
    "closedlost",
  ]) {
    const { telling, flyttet } = await medHubspot(
      { avtaler: { "882425783540": [{ id: "9001", stadium }] } },
      [kontakt()],
    );
    assert.equal(telling.flyttet, 0, stadium);
    assert.equal(telling["hoppet-over"], 1, stadium);
    assert.deepEqual(flyttet, [], stadium);
  }
});

test("en avtale som alt står i Møte booket flyttes ikke på nytt", async () => {
  const { telling, flyttet } = await medHubspot(
    { avtaler: { "882425783540": [{ id: "9001", stadium: "presentationscheduled" }] } },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 0);
  assert.deepEqual(flyttet, []);
});

/**
 * BAKST & RO-SAKEN. Bookingen laget en ny kontakt uten avtale; avtalen hang
 * på Meta-kontakten med en annen e-postadresse. Bookingkontakten hadde ikke
 * telefonnummer i det hele tatt — det var bedriftsnavnet som bandt dem
 * sammen.
 */
test("avtalen på en annen kontakt med samme bedrift flyttes", async () => {
  const metakontakt = kontakt({
    id: "883323161813",
    epost: "lolademunirat@yahoo.com",
    navn: "Bakst & Ro | Hjemmebakt i Asker",
    telefon: "+4797744426",
    moteBooket: "",
  });

  const { telling, flyttet } = await medHubspot(
    {
      avtaler: {
        "883323161813": [{ id: "9002", stadium: "appointmentscheduled" }],
      },
      makkere: [metakontakt],
    },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 1);
  assert.deepEqual(flyttet, [{ avtale: "9002", stadium: "presentationscheduled" }]);
});

test("en kontakt uten noe slektskap gir ingen flytting", async () => {
  const fremmed = kontakt({
    id: "999",
    epost: "fremmed@example.no",
    bedrift: "Soulcake",
    telefon: "+4799887766",
    moteBooket: "",
  });
  const { telling, flyttet } = await medHubspot(
    {
      avtaler: { "999": [{ id: "9003", stadium: "appointmentscheduled" }] },
      makkere: [fremmed],
    },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 0);
  assert.deepEqual(flyttet, []);
});

/** Et ukjent stadium hører til en annen pipeline og er ikke vårt å flytte. */
test("et stadium som ikke finnes i pipelinen røres ikke", async () => {
  const { telling } = await medHubspot(
    { avtaler: { "882425783540": [{ id: "9001", stadium: "noe_annet" }] } },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 0);
  assert.equal(telling["hoppet-over"], 1);
});

/**
 * MANGLER SKRIVETILGANG, SKAL RESTEN AV JOBBEN GÅ SOM NORMALT. 403 er
 * svaret når tokenet ikke har crm.objects.deals.write.
 */
test("uten skrivetilgang telles feilen, og ingenting kaster", async () => {
  const { telling } = await medHubspot(
    {
      avtaler: { "882425783540": [{ id: "9001", stadium: "appointmentscheduled" }] },
      patchStatus: 403,
    },
    [kontakt()],
  );
  assert.equal(telling.feilet, 1);
  assert.equal(telling.flyttet, 0);
});

test("uten pipelineoppslag flyttes ingenting, og ingenting kaster", async () => {
  const { telling, flyttet } = await medHubspot(
    {
      avtaler: { "882425783540": [{ id: "9001", stadium: "appointmentscheduled" }] },
      pipelineStatus: 403,
    },
    [kontakt()],
  );
  assert.equal(telling.flyttet, 0);
  assert.deepEqual(flyttet, []);
});

test("en kontakt uten booking røres ikke", async () => {
  const { telling, flyttet } = await medHubspot(
    { avtaler: { "882425783540": [{ id: "9001", stadium: "appointmentscheduled" }] } },
    [kontakt({ moteBooket: "" })],
  );
  assert.equal(telling.flyttet, 0);
  assert.deepEqual(flyttet, []);
});
