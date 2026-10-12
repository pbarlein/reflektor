import assert from "node:assert/strict";
import test from "node:test";

import {
  ENGANGSDOMENER,
  erEngangsdomene,
  erSpamnavn,
  spamgrunn,
  spamtekst,
  TAPT_STADIUM,
} from "@/lib/leadspam.ts";

/**
 * Spam-sperra på lead-e-postene, bestilt av Pål 12.10.2026.
 *
 * HENDELSEN, verifisert i «Sendt» samme morgen: jobben sendte e-post 1 og
 * 2 til alle nye leads, også de falske. `golnaz.tandorost@gmail.com` fikk
 * påminnelsen kl. 09:00 og ble merket som spam kl. 09:20 — tjue minutter
 * for sent. `kari@mailinator.com` og `marisol@example.no` fikk den også.
 *
 * TESTENE HER ER RENE. Reglene bor i lib/leadspam.ts nettopp for å kunne
 * testes uten nett; oppslagene som mater dem ligger i
 * lib/leadutsending.ts og testes gjennom ruta lenger ned.
 */

const spor = (endringer: Partial<Parameters<typeof spamgrunn>[0]> = {}) => ({
  epost: "ingrid@nordlysbakeri.no",
  finnes: true as boolean | null,
  avtaler: [] as { navn: string; stadium: string }[],
  ...endringer,
});

/* ───────────────────────────── ADRESSEN ─────────────────────────────── */

test("engangs- og eksempeladresser kjennes igjen", () => {
  for (const d of ["mailinator.com", "example.no", "smaqt.com", "yopmail.com"]) {
    assert.equal(erEngangsdomene(`kari@${d}`), true, d);
  }
});

/** Jokertegnet må treffe alle toppdomenene tjenesten bytter mellom. */
test("et mønster med .* treffer alle toppdomener", () => {
  assert.equal(erEngangsdomene("a@tempmail.com"), true);
  assert.equal(erEngangsdomene("a@tempmail.net"), true);
  assert.equal(erEngangsdomene("a@guerrillamail.biz"), true);
  assert.equal(erEngangsdomene("a@10minutemail.co.uk"), true);
  /* «tempmail» uten toppdomene er ikke et domene. */
  assert.equal(erEngangsdomene("a@tempmail."), false);
});

/**
 * DE EKTE KUNDENE MÅ SLIPPE GJENNOM. Dette er den dyre feilen: en regel
 * som tar spam og et lead på samme tid koster en kunde, ikke en e-post.
 */
test("vanlige adresser er ikke engangsadresser", () => {
  for (const e of [
    "ingrid@nordlysbakeri.no",
    "golnaz.tandorost@gmail.com",
    "iver@lokk.no",
    "noen@hotmail.com",
    "marisol@lamexicana.no",
    /* Ligner, men er det ikke. */
    "noen@exampleting.no",
    "noen@notmailinator.com",
  ]) {
    assert.equal(erEngangsdomene(e), false, e);
  }
  assert.equal(erEngangsdomene(""), false);
  assert.equal(erEngangsdomene("uten-krøllalfa"), false);
});

test("listen er én konstant, og alt i den er små bokstaver", () => {
  assert.ok(ENGANGSDOMENER.length >= 11);
  for (const d of ENGANGSDOMENER) assert.equal(d, d.toLowerCase(), d);
});

/* ──────────────────── SALGSASSISTENTENS MERKING ─────────────────────── */

/**
 * PREFIKSET ER «SPAM – » MED TANKESTREK, kontrollert i HubSpot 12.10.2026
 * på avtale 525998356680 og 526037736636. Sjekken ser bare på de fire
 * bokstavene, så merkingen kan skrives med hva som helst etterpå.
 */
test("avtalenavn merket SPAM kjennes igjen, uansett skrivemåte", () => {
  assert.equal(
    erSpamnavn("SPAM – Golnaz TandorostTandorost – Natulahland (Meta)"),
    true,
  );
  assert.equal(erSpamnavn("spam - noe"), true);
  assert.equal(erSpamnavn("Spam: noe"), true);
  assert.equal(erSpamnavn("  SPAM noe  "), true);
});

test("vanlige avtalenavn er ikke spam", () => {
  assert.equal(erSpamnavn("Kid Interiør – SoMe-abonnement (LinkedIn)"), false);
  assert.equal(erSpamnavn("Nordlysbakeriet – reklamefilm"), false);
  assert.equal(erSpamnavn(""), false);
});

/* ───────────────────────── HELE VURDERINGEN ─────────────────────────── */

test("avtale merket SPAM stopper e-posten", () => {
  assert.equal(
    spamgrunn(
      spor({ avtaler: [{ navn: "SPAM – David møller", stadium: "closedlost" }] }),
    ),
    "spam-avtale",
  );
});

/** Tapt alene er nok — merkingen av navnet kommer ikke alltid med. */
test("avtale i Tapt stopper e-posten", () => {
  assert.equal(
    spamgrunn(
      spor({
        avtaler: [{ navn: "Natulahland (Meta)", stadium: TAPT_STADIUM }],
      }),
    ),
    "tapt-avtale",
  );
});

test("en slettet kontakt stopper e-posten", () => {
  assert.equal(spamgrunn(spor({ finnes: false })), "slettet");
});

/**
 * ET LEAD MED AVTALE I INTERESSERT ER EN HELT VANLIG KUNDE. Stadiet alle
 * nye leads havner i må aldri stoppe noe.
 */
test("et vanlig lead i Interessert slipper gjennom", () => {
  assert.equal(
    spamgrunn(
      spor({
        avtaler: [
          { navn: "Nordlysbakeriet – SoMe", stadium: "appointmentscheduled" },
        ],
      }),
    ),
    null,
  );
  assert.equal(spamgrunn(spor()), null);
});

/**
 * VI VET IKKE ER IKKE SPAM. Fikk vi ikke lest HubSpot, skal det ikke bli
 * en dom: den som kaller stopper sendingen for nå og prøver igjen, uten å
 * merke kontakten. Et sekund med nettverksfeil skal ikke drepe
 * oppfølgingen av et ekte lead for godt.
 */
test("uten svar fra HubSpot gis ingen grunn", () => {
  assert.equal(spamgrunn(spor({ finnes: null })), null);
});

/**
 * ADRESSEN DØMMER SELV OM HUBSPOT ER NEDE. Den sjekken trenger ingenting
 * utenfra, og `mailinator.com` er ikke en kunde uansett hva CRM-et sier.
 */
test("engangsadressen stoppes også når HubSpot ikke svarer", () => {
  assert.equal(
    spamgrunn(spor({ epost: "kari@mailinator.com", finnes: null })),
    "engangsdomene",
  );
});

test("hver grunn har en forklaring som kan vises", () => {
  for (const g of [
    "slettet",
    "spam-avtale",
    "tapt-avtale",
    "engangsdomene",
  ] as const) {
    assert.ok(spamtekst(g).length > 5, g);
  }
});

/* ───────── HELE VEIEN GJENNOM JOBBEN (bestilt 12.10.2026) ──────────── */

/**
 * DE FEM TILFELLENE BESTILLINGEN BER OM, målt på det som faktisk skjer:
 * gikk det en e-post til Google, og ble kontakten merket?
 *
 * STUBBEN SVARER PÅ ADRESSE OG IKKE PÅ REKKEFØLGE. En stubb som svarer
 * «første kall, andre kall» går i stykker så snart koden bytter om på to
 * oppslag — og da feiler testen for noe helt annet enn det den handler om.
 */
type Stubbsvar = { avtaler?: { navn: string; stadium: string }[]; finnes?: boolean };

type Telling = {
  tilGoogle: number;
  merket: Record<string, string>[];
  feil: string[];
};

async function medHubspot(
  svar: Stubbsvar,
  kjor: (t: Telling) => Promise<void>,
): Promise<Telling> {
  const forFetch = globalThis.fetch;
  const forFeil = console.error;
  const forMiljo = { ...process.env };
  const t: Telling = { tilGoogle: 0, merket: [], feil: [] };

  process.env.LEAD_EPOST_AKTIV = "true";
  process.env.HUBSPOT_TOKEN = "test";
  delete process.env.LEAD_EPOST_TEST_ADRESSE;
  /* Uten disse gir sendGmail opp før nettet, og da måler vi ingenting. */
  process.env.GOOGLE_OAUTH_CLIENT_ID = "test";
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "test";
  process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "test";

  const avtaler = svar.avtaler ?? [];
  const finnes = svar.finnes ?? true;

  console.error = (...a: unknown[]) => t.feil.push(a.map(String).join(" "));

  globalThis.fetch = (async (
    inn: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = String(inn);
    const metode = init?.method ?? "GET";

    if (url.includes("googleapis.com")) {
      t.tilGoogle += 1;
      /* Tokenet, og så selve sendingen. Begge svarer nok for å gå videre. */
      return Response.json({
        access_token: "t",
        id: "m1",
        threadId: "tr1",
        messages: [],
      });
    }

    /* Finnes kontakten? Slettet gir 404, som i HubSpot. */
    if (/\/crm\/v3\/objects\/contacts\/\d+\?/.test(url)) {
      return finnes
        ? Response.json({ id: "123", properties: { email: "a@b.no" } })
        : new Response("not found", { status: 404 });
    }

    /* Merkingen. Den er det vi vil se. */
    if (metode === "PATCH" && url.includes("/objects/contacts/")) {
      t.merket.push(
        (JSON.parse(String(init?.body)) as { properties: Record<string, string> })
          .properties,
      );
      return Response.json({ id: "123" });
    }

    if (url.includes("/associations/deals")) {
      return Response.json({
        results: avtaler.map((_, i) => ({ toObjectId: `d${i}` })),
      });
    }

    if (url.includes("/objects/deals/batch/read")) {
      return Response.json({
        results: avtaler.map((a, i) => ({
          id: `d${i}`,
          properties: {
            dealstage: a.stadium,
            dealname: a.navn,
            createdate: "2026-10-05T06:00:00Z",
          },
        })),
      });
    }

    /* Alt annet — søk, logging, tidslinje — svarer tomt og greit. */
    return Response.json({ results: [] });
  }) as typeof fetch;

  try {
    await kjor(t);
    return t;
  } finally {
    globalThis.fetch = forFetch;
    console.error = forFeil;
    process.env = forMiljo;
  }
}

const LEAD = {
  id: "123",
  epost: "ingrid@nordlysbakeri.no",
  navn: "Ingrid Lie",
  bedrift: "Nordlysbakeriet",
  telefon: "+4791122334",
  lifecycle: "lead",
  hendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  forsteHendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  bookingKilde: "",
  bookingMedium: "",
  analysekilde: "",
  konvertert: "2026-10-05T06:00:00Z",
  metasvar: [] as { etikett: string; verdi: string }[],
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "",
  behov: "",
  nettside: "",
};

/** E-post 1 går i sendevinduet; påminnelsen dagen etter kl. 09:00. */
const FOR_EPOST1 = new Date("2026-10-05T10:00:00+02:00");
const SENDT_EPOST1 = "2026-10-05T08:00:00Z";
const FOR_EPOST2 = new Date("2026-10-06T09:30:00+02:00");

const venter = { ...LEAD, epost1Sendt: SENDT_EPOST1, tradId: "" };

const AVBRUTT = "paminnelse_avbrutt";

test("avtale merket SPAM: ingen påminnelse, og kontakten merkes avbrutt", async () => {
  const t = await medHubspot(
    { avtaler: [{ navn: "SPAM – Ingrid Lie", stadium: "closedlost" }] },
    async () => {
      const { sendEpost2 } = await import("@/lib/leadutsending.ts");
      assert.equal(await sendEpost2(venter, FOR_EPOST2), "hoppet-over");
    },
  );

  assert.equal(t.tilGoogle, 0, "ingen e-post skal ha gått ut");
  assert.ok(
    t.merket.some((m) => m[AVBRUTT] === "true"),
    "kontakten skulle vært merket avbrutt",
  );
});

test("avtale i Tapt: ingen påminnelse", async () => {
  const t = await medHubspot(
    { avtaler: [{ navn: "Nordlysbakeriet – SoMe", stadium: "closedlost" }] },
    async () => {
      const { sendEpost2 } = await import("@/lib/leadutsending.ts");
      assert.equal(await sendEpost2(venter, FOR_EPOST2), "hoppet-over");
    },
  );

  assert.equal(t.tilGoogle, 0);
  assert.ok(t.merket.some((m) => m[AVBRUTT] === "true"));
});

/**
 * EN SLETTET KONTAKT SKAL IKKE GI EN FEILLINJE. Det finnes ingenting å
 * skrive til, og et forsøk på å merke henne ville gitt et 404 i loggen for
 * noe som gikk helt etter planen.
 */
test("slettet kontakt: ingen påminnelse, ingen feil, ingen merking", async () => {
  const t = await medHubspot({ finnes: false }, async () => {
    const { sendEpost2 } = await import("@/lib/leadutsending.ts");
    assert.equal(await sendEpost2(venter, FOR_EPOST2), "hoppet-over");
  });

  assert.equal(t.tilGoogle, 0);
  assert.deepEqual(t.merket, [], "en slettet kontakt skal ikke merkes");
  assert.deepEqual(t.feil, [], t.feil.join(" | "));
});

test("engangsadresse: ingen e-post 1", async () => {
  for (const epost of ["kari@mailinator.com", "marisol@example.no"]) {
    const t = await medHubspot({}, async () => {
      const { sendEpost1 } = await import("@/lib/leadutsending.ts");
      assert.equal(
        await sendEpost1({ ...LEAD, epost }, FOR_EPOST1),
        "hoppet-over",
        epost,
      );
    });
    assert.equal(t.tilGoogle, 0, epost);
    assert.ok(
      t.merket.some((m) => m[AVBRUTT] === "true"),
      epost,
    );
  }
});

/**
 * DEN VIKTIGSTE TESTEN I FILA. En sperre som også tar de ekte leadene
 * koster en kunde, ikke en e-post.
 */
test("vanlig lead i Interessert: både e-post 1 og påminnelsen går", async () => {
  const avtaler = [
    { navn: "Nordlysbakeriet – SoMe", stadium: "appointmentscheduled" },
  ];

  const en = await medHubspot({ avtaler }, async () => {
    const { sendEpost1 } = await import("@/lib/leadutsending.ts");
    assert.equal(await sendEpost1(LEAD, FOR_EPOST1), "sendt");
  });
  assert.ok(en.tilGoogle > 0, "e-post 1 skulle gått ut");
  assert.ok(
    !en.merket.some((m) => m[AVBRUTT] === "true"),
    "et ekte lead skal ikke merkes avbrutt",
  );

  const to = await medHubspot({ avtaler }, async () => {
    const { sendEpost2 } = await import("@/lib/leadutsending.ts");
    assert.equal(await sendEpost2(venter, FOR_EPOST2), "sendt");
  });
  assert.ok(to.tilGoogle > 0, "påminnelsen skulle gått ut");
  assert.ok(!to.merket.some((m) => m[AVBRUTT] === "true"));
});
