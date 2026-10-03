import assert from "node:assert/strict";
import test from "node:test";

import { adresseFra, harSvarITrad } from "@/lib/gmail.ts";

/**
 * Sjekken «har leadet svart?».
 *
 * Den avgjør om påminnelsen går ut, og den leser Gmail. Testene her bytter
 * ut nettverket: ingen av dem snakker med Google.
 *
 * TRE UTFALL, OG DET TREDJE ER DET VIKTIGE. `true` stopper påminnelsen,
 * `false` slipper den gjennom, og `null` betyr at vi ikke fikk lest tråden
 * — da slipper den OGSÅ gjennom. Et usikkert nei skal ikke stilne
 * oppfølgingen.
 */

const EPOST1 = new Date("2026-10-05T07:00:00Z");

/** Gmail regner tid i millisekunder som tekst. */
const tid = (iso: string) => String(new Date(iso).getTime());

type Melding = { fra: string; nar?: string };

/**
 * Setter opp en falsk Gmail: nøkkelkallet svarer med en nøkkel, og
 * trådkallet svarer med meldingene som sendes inn her.
 */
async function medTrad<T>(
  meldinger: Melding[] | { status: number },
  gjor: () => Promise<T>,
): Promise<T> {
  const opprinneligFetch = globalThis.fetch;
  const opprinneligeMiljo = {
    id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    hemmelighet: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    fornying: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    konto: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    avsender: process.env.GMAIL_AVSENDER,
  };

  process.env.GOOGLE_OAUTH_CLIENT_ID = "id";
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "hemmelighet";
  process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "fornying";
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  process.env.GMAIL_AVSENDER = "pal@reflektor.no";

  globalThis.fetch = (async (inn: string | URL | Request) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("oauth2.googleapis.com")) {
      return Response.json({ access_token: "nøkkel" });
    }
    if (!Array.isArray(meldinger)) {
      return new Response("nei", { status: meldinger.status });
    }
    return Response.json({
      messages: meldinger.map((m) => ({
        ...(m.nar ? { internalDate: tid(m.nar) } : {}),
        payload: { headers: [{ name: "From", value: m.fra }] },
      })),
    });
  }) as typeof globalThis.fetch;

  try {
    return await gjor();
  } finally {
    globalThis.fetch = opprinneligFetch;
    for (const [n, v] of [
      ["GOOGLE_OAUTH_CLIENT_ID", opprinneligeMiljo.id],
      ["GOOGLE_OAUTH_CLIENT_SECRET", opprinneligeMiljo.hemmelighet],
      ["GOOGLE_OAUTH_REFRESH_TOKEN", opprinneligeMiljo.fornying],
      ["GOOGLE_SERVICE_ACCOUNT_JSON", opprinneligeMiljo.konto],
      ["GMAIL_AVSENDER", opprinneligeMiljo.avsender],
    ] as const) {
      if (v === undefined) delete process.env[n];
      else process.env[n] = v;
    }
  }
}

test("adressen plukkes ut av headeren, uansett form", () => {
  assert.equal(adresseFra("Pål Barlein <pal@reflektor.no>"), "pal@reflektor.no");
  assert.equal(adresseFra("henrik@example.no"), "henrik@example.no");
  assert.equal(adresseFra("  HENRIK@Example.NO  "), "henrik@example.no");
  assert.equal(
    adresseFra("=?UTF-8?B?UMOlbCBCYXJsZWlu?= <PAL@reflektor.no>"),
    "pal@reflektor.no",
  );
});

test("bare vår egen e-post i tråden er ikke et svar", async () => {
  const svar = await medTrad(
    [{ fra: "Pål Barlein <pal@reflektor.no>", nar: "2026-10-05T07:00:00Z" }],
    () => harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, false);
});

test("et svar fra leadet stopper påminnelsen", async () => {
  const svar = await medTrad(
    [
      { fra: "Pål Barlein <pal@reflektor.no>", nar: "2026-10-05T07:00:00Z" },
      { fra: "Henrik Dale <henrik@example.no>", nar: "2026-10-05T09:12:00Z" },
    ],
    () => harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, true);
});

/**
 * HVEM SOM HELST ANNEN TELLER. En kollega på kopi, en videresending eller
 * et autosvar er også et tegn på at tråden lever — og da skal ikke maskinen
 * mase.
 */
test("svar fra en helt annen adresse teller også", async () => {
  const svar = await medTrad(
    [{ fra: "post@annetfirma.no", nar: "2026-10-05T10:00:00Z" }],
    () => harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, true);
});

/**
 * GMAIL TRÅDER PÅ EMNE. Har Pål snakket med adressen før, kan eldre
 * meldinger ligge i samme tråd. De er ikke svar på denne henvendelsen.
 */
test("en eldre melding i samme tråd er ikke et svar", async () => {
  const svar = await medTrad(
    [
      { fra: "Henrik Dale <henrik@example.no>", nar: "2026-08-01T10:00:00Z" },
      { fra: "Pål Barlein <pal@reflektor.no>", nar: "2026-10-05T07:00:00Z" },
    ],
    () => harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, false);
});

test("stor og liten bokstav i adressen er samme adresse", async () => {
  const svar = await medTrad(
    [{ fra: "PAL@Reflektor.NO", nar: "2026-10-05T08:00:00Z" }],
    () => harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, false);
});

test("mangler klokkeslettet, regnes meldingen som et svar", async () => {
  const svar = await medTrad([{ fra: "henrik@example.no" }], () =>
    harSvarITrad("t1", EPOST1),
  );
  assert.equal(svar, true);
});

test("en tom tråd er ikke et svar", async () => {
  assert.equal(await medTrad([], () => harSvarITrad("t1", EPOST1)), false);
});

/* ───────────────────── NÅR VI IKKE FIKK LEST TRÅDEN ─────────────────── */

test("manglende lesetilgang gir null, ikke falskt nei", async () => {
  assert.equal(await medTrad({ status: 403 }, () => harSvarITrad("t1", EPOST1)), null);
});

test("en feil hos Google gir null", async () => {
  assert.equal(await medTrad({ status: 500 }, () => harSvarITrad("t1", EPOST1)), null);
});

test("uten tråd-id gjøres ingen kall, og svaret er null", async () => {
  const opprinnelig = globalThis.fetch;
  let kalt = false;
  globalThis.fetch = (async () => {
    kalt = true;
    return Response.json({});
  }) as typeof globalThis.fetch;
  try {
    assert.equal(await harSvarITrad("", EPOST1), null);
    assert.equal(kalt, false);
  } finally {
    globalThis.fetch = opprinnelig;
  }
});

/**
 * VI BER OM SÅ LITE SOM MULIG. `format=metadata` med bare `From` gir oss
 * det vi trenger uten å laste ned innholdet i noens e-post.
 */
test("trådkallet er et GET som bare henter From-headeren", async () => {
  const opprinnelig = globalThis.fetch;
  const opprinneligeMiljo = {
    id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    hemmelighet: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    fornying: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    konto: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  };
  process.env.GOOGLE_OAUTH_CLIENT_ID = "id";
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "hemmelighet";
  process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "fornying";
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  const kall: { url: string; metode: string }[] = [];
  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    kall.push({ url, metode: init?.method ?? "GET" });
    if (url.includes("oauth2.googleapis.com")) {
      return Response.json({ access_token: "nøkkel" });
    }
    return Response.json({ messages: [] });
  }) as typeof globalThis.fetch;

  try {
    await harSvarITrad("1a103c426c99918f", EPOST1);
  } finally {
    globalThis.fetch = opprinnelig;
    for (const [n, v] of [
      ["GOOGLE_OAUTH_CLIENT_ID", opprinneligeMiljo.id],
      ["GOOGLE_OAUTH_CLIENT_SECRET", opprinneligeMiljo.hemmelighet],
      ["GOOGLE_OAUTH_REFRESH_TOKEN", opprinneligeMiljo.fornying],
      ["GOOGLE_SERVICE_ACCOUNT_JSON", opprinneligeMiljo.konto],
    ] as const) {
      if (v === undefined) delete process.env[n];
      else process.env[n] = v;
    }
  }

  const trad = kall.find((k) => k.url.includes("gmail.googleapis.com"));
  assert.ok(trad, "trådkallet ble ikke gjort");
  assert.equal(trad.metode, "GET");
  assert.ok(trad.url.includes("/threads/1a103c426c99918f"));
  assert.ok(trad.url.includes("format=metadata"));
  assert.ok(trad.url.includes("metadataHeaders=From"));
  /* Ingenting som ber om innholdet i meldingene. */
  assert.ok(!trad.url.includes("format=full"));
});
