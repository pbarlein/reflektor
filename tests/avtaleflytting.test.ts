import assert from "node:assert/strict";
import test from "node:test";

import { bedriftsord } from "@/lib/hubspotcrm.ts";
import { sammePerson } from "@/lib/leadepost.ts";

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

/** Tidspunktet testene later som er «nå». */
const NA = new Date("2026-10-04T09:15:00Z");
/** Opprettet for et kvarter siden: fersk nok til å kunne arkiveres. */
const FERSK = "2026-10-04T09:00:00Z";

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
  avtaler: Record<
    string,
    { id: string; stadium: string; opprettet?: string }[]
  >;
  /** Aktiviteter per avtale-ID, med opprettelsestidspunkt. */
  aktiviteter?: Record<string, string[]>;
  /** Kontakter søket på telefon og bedrift skal finne. */
  makkere?: ReturnType<typeof kontakt>[];
  /** Svar HubSpot gir på PATCH av en avtale. */
  patchStatus?: number;
  /** Status på oppslaget av pipelinene. */
  pipelineStatus?: number;
  /** Svar HubSpot gir på DELETE av en avtale. */
  slettStatus?: number;
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
  const arkivert: string[] = [];
  const koblet: { avtale: string; kontakt: string }[] = [];

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
          .map((a) => ({
            id: a.id,
            properties: {
              dealstage: a.stadium,
              createdate: a.opprettet ?? FERSK,
            },
          })),
      });
    }

    /* Aktivitetene på en avtale: notater, samtaler, e-poster, oppgaver. */
    const medAktiviteter = url.match(/\/objects\/deals\/(\d+)\?associations=/);
    if (medAktiviteter) {
      const tider = oppsett.aktiviteter?.[medAktiviteter[1]!] ?? [];
      return Response.json({
        id: medAktiviteter[1],
        associations: {
          notes: { results: tider.map((_, i) => ({ id: `n${i}` })) },
        },
      });
    }

    if (url.includes("/objects/notes/batch/read")) {
      const bedt = (JSON.parse(String(init?.body)) as { inputs: { id: string }[] })
        .inputs.map((i) => i.id);
      const alle = Object.values(oppsett.aktiviteter ?? {}).flat();
      return Response.json({
        results: bedt.map((id) => ({
          id,
          properties: { hs_createdate: alle[Number(id.slice(1))] },
        })),
      });
    }

    const kobling2 = url.match(
      /\/objects\/deals\/(\d+)\/associations\/default\/contacts\/(\d+)$/,
    );
    if (kobling2 && metode === "PUT") {
      koblet.push({ avtale: kobling2[1]!, kontakt: kobling2[2]! });
      return Response.json({});
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

    if (patch && metode === "DELETE") {
      if (oppsett.slettStatus) {
        return new Response("nei", { status: oppsett.slettStatus });
      }
      arkivert.push(patch[1]!);
      return new Response(null, { status: 204 });
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
        na: Date,
      ) => Promise<{
        flyttet: number;
        arkivert: number;
        "hoppet-over": number;
        feilet: number;
      }>
    )(booket, NA);
    return { telling, flyttet, arkivert, koblet };
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

/* ──────────── DUBLETTAVTALEN VED BOOKING (04.10.2026) ───────────────── */

/**
 * TESTEN SOM AVDEKKET DET. «Kristine Haugland» sendte skjemaet og fikk
 * kontakt og avtale. Så booket hun møte med en feilstavet e-postadresse,
 * HubSpot laget en ny kontakt, og arbeidsflyten laget en NY avtale på den.
 * Jobben kjente igjen henne, men flyttet den nye avtalen — så den
 * opprinnelige sto igjen i Interessert. To avtaler på samme person.
 */

/** Kontakten som booket, med den feilstavede adressen. */
const BOOKET = kontakt({
  id: "900001",
  epost: "p.barlein@gmeil.com",
  navn: "Kristine Haugland",
  bedrift: "Haugland interiør",
  telefon: "+4791122334",
});

/** Kontakten fra skjemaet. Samme telefon, samme bedrift. */
const SKJEMA = kontakt({
  id: "900002",
  epost: "p.barlein@gmail.com",
  navn: "Kristine Haugland",
  bedrift: "Haugland Interiør AS",
  telefon: "+4791122334",
  moteBooket: "",
});

test("dublett ved booking: den opprinnelige flyttes, den nye arkiveres", async () => {
  const { telling, flyttet, arkivert, koblet } = await medHubspot(
    {
      avtaler: {
        /* Arbeidsflyten laget denne på bookingkontakten. */
        "900001": [{ id: "524817129686", stadium: "presentationscheduled" }],
        /* Den opprinnelige, fra skjemaet. */
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );

  /* Den opprinnelige er flyttet, og bare den. */
  assert.deepEqual(flyttet, [
    { avtale: "524811441361", stadium: "presentationscheduled" },
  ]);
  /* Dubletten er arkivert. */
  assert.deepEqual(arkivert, ["524817129686"]);
  /* Bookingen vises på avtalen som står. */
  assert.deepEqual(koblet, [{ avtale: "524811441361", kontakt: "900001" }]);
  assert.equal(telling.flyttet, 1);
  assert.equal(telling.arkivert, 1);
});

/**
 * ARBEIDSFLYTENS EGET NOTAT SKAL IKKE BESKYTTE AVTALEN. Begge avtalene fra
 * 04.10.2026 hadde ett notat fra før — lagt på i samme øyeblikk avtalen ble
 * laget. En regel om «ingen notater» ville derfor aldri slått til.
 */
test("et notat fra opprettelsen stopper ikke arkiveringen", async () => {
  const { arkivert } = await medHubspot(
    {
      avtaler: {
        "900001": [
          {
            id: "524817129686",
            stadium: "presentationscheduled",
            opprettet: "2026-10-04T09:00:00Z",
          },
        ],
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      /* Notatet kom ett minutt etter avtalen: maskinens eget. */
      aktiviteter: { "524817129686": ["2026-10-04T09:01:00Z"] },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );
  assert.deepEqual(arkivert, ["524817129686"]);
});

/** Har Pål skrevet noe etterpå, er avtalen hans. */
test("et notat Pål skrev etterpå beskytter avtalen", async () => {
  const { arkivert, telling } = await medHubspot(
    {
      avtaler: {
        "900001": [
          {
            id: "524817129686",
            stadium: "presentationscheduled",
            opprettet: "2026-10-04T09:00:00Z",
          },
        ],
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      /* Et kvarter etter: noen har jobbet med den. */
      aktiviteter: { "524817129686": ["2026-10-04T09:14:00Z"] },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );
  assert.deepEqual(arkivert, []);
  assert.equal(telling.flyttet, 1, "den opprinnelige flyttes likevel");
});

test("en avtale eldre enn 24 timer arkiveres ikke", async () => {
  const { arkivert } = await medHubspot(
    {
      avtaler: {
        "900001": [
          {
            id: "524817129686",
            stadium: "presentationscheduled",
            opprettet: "2026-10-02T09:00:00Z",
          },
        ],
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );
  assert.deepEqual(arkivert, []);
});

test("en avtale i Tilbud sendt arkiveres ikke, selv som dublett", async () => {
  const { arkivert } = await medHubspot(
    {
      avtaler: {
        "900001": [{ id: "524817129686", stadium: "decisionmakerboughtin" }],
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );
  assert.deepEqual(arkivert, []);
});

/**
 * HELT NY PERSON SOM BOOKER DIREKTE. Ingen makker, så avtalen
 * arbeidsflyten laget er den eneste som finnes. Den beholdes og flyttes.
 */
test("direkte booking uten match: avtalen beholdes og flyttes", async () => {
  const { telling, flyttet, arkivert } = await medHubspot(
    {
      avtaler: {
        "900001": [{ id: "524817129686", stadium: "appointmentscheduled" }],
      },
      makkere: [],
    },
    [BOOKET],
  );
  assert.deepEqual(flyttet, [
    { avtale: "524817129686", stadium: "presentationscheduled" },
  ]);
  assert.deepEqual(arkivert, []);
  assert.equal(telling.flyttet, 1);
});

/**
 * STÅR MAKKERENS AVTALE FOR LANGT FRAMME, rører vi ingenting. To avtaler er
 * da en avgjørelse et menneske har tatt.
 */
test("er den opprinnelige vunnet, rører vi ingenting", async () => {
  const { telling, flyttet, arkivert } = await medHubspot(
    {
      avtaler: {
        "900001": [{ id: "524817129686", stadium: "appointmentscheduled" }],
        "900002": [{ id: "524811441361", stadium: "closedwon" }],
      },
      makkere: [SKJEMA],
    },
    [BOOKET],
  );
  assert.deepEqual(flyttet, []);
  assert.deepEqual(arkivert, []);
  assert.equal(telling["hoppet-over"], 1);
});

/** En sletting som feiler skal ikke kaste, bare telles. */
test("uten skrivetilgang telles arkiveringen som feilet", async () => {
  const { telling } = await medHubspot(
    {
      avtaler: {
        "900001": [{ id: "524817129686", stadium: "presentationscheduled" }],
        "900002": [{ id: "524811441361", stadium: "appointmentscheduled" }],
      },
      makkere: [SKJEMA],
      slettStatus: 403,
    },
    [BOOKET],
  );
  assert.equal(telling.arkivert, 0);
  assert.equal(telling.feilet, 1);
});

/* ───────────────── SØKET SOM FINNER SAMME PERSON ────────────────────── */

/**
 * SØKET MÅ VÆRE BREDERE ENN LIKHET.
 *
 * Her sto et eksakt søk på bedriftsnavnet, og det bommet 04.10.2026:
 * bookingkontakten hadde «Haugland interiør», skjemakontakten «Haugland
 * Interiør AS». Normaliseringen regner dem som samme bedrift, men et
 * likhetssøk i HubSpot gjør det ikke — så de to kontaktene ble aldri lagt
 * ved siden av hverandre, og dubletten sto igjen.
 */
test("første ord i bedriftsnavnet er det vi søker på", () => {
  assert.equal(bedriftsord("Haugland Interiør AS"), "Haugland");
  assert.equal(bedriftsord("Haugland interiør"), "Haugland");
  assert.equal(bedriftsord("BAKST & RO"), "BAKST");
  /* Selskapsformen alene er ikke noe å søke på. */
  assert.equal(bedriftsord("AS Noe"), "Noe");
  /* For kort til å søke trygt på. */
  assert.equal(bedriftsord("Ab"), "");
  assert.equal(bedriftsord(""), "");
});

/**
 * DE TO SKRIVEMÅTENE MÅ GI SAMME SØKEORD, og normaliseringen må regne dem
 * som samme bedrift. Det er de to leddene som til sammen avgjør om
 * dubletten blir funnet.
 */
test("de to skrivemåtene fra testen møtes i søkeordet", () => {
  assert.equal(
    bedriftsord("Haugland interiør"),
    bedriftsord("Haugland Interiør AS"),
  );
  assert.equal(
    sammePerson(
      { epost: "p.barlein@gmeil.com", telefon: "", bedrift: "Haugland interiør" },
      {
        epost: "p.barlein@gmail.com",
        telefon: "+47 912 34 567",
        bedrift: "Haugland Interiør AS",
      },
    ),
    true,
  );
});

/** Søket skal bruke et tokensøk på bedriften, ikke et likhetssøk. */
test("søket spør etter bedrifter som begynner med ordet", async () => {
  const opprinnelig = globalThis.fetch;
  const for_ = { ...process.env };
  process.env.HUBSPOT_TOKEN = "test";
  let kropp = "";

  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    if (String(inn instanceof Request ? inn.url : inn).includes("contacts/search")) {
      kropp = String(init?.body);
    }
    return Response.json({ results: [] });
  }) as typeof globalThis.fetch;

  try {
    const { mulighetsmakker } = await import("@/lib/hubspotcrm.ts");
    await mulighetsmakker(
      kontakt({ bedrift: "Haugland interiør", telefon: "" }) as never,
    );
  } finally {
    globalThis.fetch = opprinnelig;
    process.env = for_;
  }

  assert.ok(kropp.includes("CONTAINS_TOKEN"), kropp);
  assert.ok(kropp.includes("Haugland*"), kropp);
});
