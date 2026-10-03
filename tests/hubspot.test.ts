import assert from "node:assert/strict";
import test from "node:test";

import {
  avvisteFelt,
  byggInnsending,
  delNavn,
  ENDEPUNKT,
  lesHutk,
  sendLeadTilHubspot,
} from "@/lib/hubspot";
import type { Lead } from "@/lib/lead";

/**
 * Leadlevering til HubSpot.
 *
 * HVORFOR DET TESTES. Kallet skjer etter at svaret er sendt til besøkende,
 * og det logger i stedet for å kaste. Det betyr at en feil her er helt
 * usynlig fra nettsiden: skjemaet virker, /takk kommer, e-posten kommer —
 * og CRM-et står tomt. Det eneste sporet er en linje i Vercel-loggen som
 * ingen leser før noen savner et lead.
 *
 * Tre ting dekkes:
 *   1. navnesplitten, som skriver seg rett inn i CRM-et og ikke kan rettes
 *      maskinelt etterpå
 *   2. at `nettside_kilde` faktisk følger med — det er det eneste feltet
 *      som sier hvilken annonse leadet kom fra
 *   3. at en feil eller et tidsavbrudd fra HubSpot ikke kan velte svaret
 *      til besøkende, altså 303 til /takk
 */

const BASIS = "https://www.reflektor.no";

function lead(endringer: Partial<Lead> = {}): Lead {
  return {
    navn: "Pål Barlein",
    epost: "pal@reflektor.no",
    bedrift: "Reflektor",
    telefon: "99887766",
    melding: "Hei",
    side: "/kontaktoss",
    nettside: "https://reflektor.no",
    nettsideUtledet: false,
    kilde: "Google Ads | source=google | medium=cpc",
    ...endringer,
  };
}

test("navnet deles i fornavn og resten", () => {
  assert.deepEqual(delNavn("Pål"), { fornavn: "Pål", etternavn: "" });
  assert.deepEqual(delNavn("Pål Barlein"), {
    fornavn: "Pål",
    etternavn: "Barlein",
  });
  /*
   * TRE ORD GÅR TIL FORNAVN + «RESTEN», ikke til to og ett. Vi kan ikke
   * vite om «Erik» er mellomnavn eller del av et dobbelt fornavn, og en
   * gjetning som deler feil står i CRM-et for alltid.
   */
  assert.deepEqual(delNavn("Pål Erik Barlein"), {
    fornavn: "Pål",
    etternavn: "Erik Barlein",
  });
  assert.deepEqual(delNavn(""), { fornavn: "", etternavn: "" });
  assert.deepEqual(delNavn("   "), { fornavn: "", etternavn: "" });
  /* Doble mellomrom skal ikke bli et tomt «mellomnavn». */
  assert.deepEqual(delNavn("  Pål   Barlein "), {
    fornavn: "Pål",
    etternavn: "Barlein",
  });
});

test("nettside_kilde følger med nyttelasten", () => {
  const innsending = byggInnsending(lead(), undefined, BASIS);
  const felt = new Map(innsending.fields.map((f) => [f.name, f.value]));

  assert.equal(
    felt.get("nettside_kilde"),
    "Google Ads | source=google | medium=cpc",
  );
  assert.equal(felt.get("email"), "pal@reflektor.no");
  assert.equal(felt.get("firstname"), "Pål");
  assert.equal(felt.get("lastname"), "Barlein");
  assert.equal(felt.get("company"), "Reflektor");
  assert.equal(felt.get("phone"), "99887766");
  assert.equal(felt.get("message"), "Hei");
});

test("tomme felt utelates i stedet for å overskrive", () => {
  const innsending = byggInnsending(
    lead({ bedrift: "", telefon: "", kilde: "", navn: "Pål" }),
    undefined,
    BASIS,
  );
  const navn = innsending.fields.map((f) => f.name);

  assert.ok(!navn.includes("company"));
  assert.ok(!navn.includes("phone"));
  assert.ok(!navn.includes("nettside_kilde"));
  /* Ett ord i navnefeltet gir tomt etternavn, som dermed også utelates. */
  assert.ok(!navn.includes("lastname"));
  assert.ok(navn.includes("firstname"));
  assert.ok(navn.includes("email"));
});

test("konteksten peker på siden leadet kom fra, og sender ikke IP", () => {
  const u = byggInnsending(lead(), "abc123", BASIS);

  assert.equal(u.context.pageUri, "https://www.reflektor.no/kontaktoss");
  assert.equal(u.context.pageName, "/kontaktoss");
  assert.equal(u.context.hutk, "abc123");
  assert.ok(
    !("ipAddress" in u.context),
    "IP-adressen skal ikke sendes: det eneste vi kunne sendt herfra er " +
      "serverens egen, ikke besøkendes.",
  );

  /* `side` uten skråstrek («ukjent») skal ikke gi en ødelagt URL. */
  const ukjent = byggInnsending(lead({ side: "ukjent" }), undefined, BASIS);
  assert.equal(ukjent.context.pageUri, "https://www.reflektor.no/ukjent");
  assert.equal(ukjent.context.hutk, undefined);
});

test("hubspotutk plukkes ut av cookie-strengen", () => {
  assert.equal(lesHutk("hubspotutk=abc123"), "abc123");
  assert.equal(
    lesHutk("reflektor_samtykke=1.11; hubspotutk=abc123; _ga=GA1.1.2"),
    "abc123",
  );
  assert.equal(lesHutk("reflektor_samtykke=1.11"), undefined);
  assert.equal(lesHutk(""), undefined);
  assert.equal(lesHutk(null), undefined);
  /* Tom verdi er ikke en nøkkel, og skal ikke sendes som en. */
  assert.equal(lesHutk("hubspotutk="), undefined);
  /* Navnet skal ikke treffe på et prefiks. */
  assert.equal(lesHutk("nothubspotutk=abc"), undefined);
});

test("sendLeadTilHubspot kaster aldri, uansett hva HubSpot gjør", async () => {
  const opprinnelig = globalThis.fetch;

  try {
    globalThis.fetch = async () => new Response("Bad request", { status: 400 });
    await assert.doesNotReject(sendLeadTilHubspot(lead(), undefined, BASIS));

    globalThis.fetch = async () => {
      throw new Error("TimeoutError");
    };
    await assert.doesNotReject(sendLeadTilHubspot(lead(), undefined, BASIS));

    /* Uten brukbar e-post gjøres ikke kallet i det hele tatt. */
    let kalt = false;
    globalThis.fetch = async () => {
      kalt = true;
      return new Response("", { status: 200 });
    };
    await sendLeadTilHubspot(
      lead({ epost: "ikke en adresse" }),
      undefined,
      BASIS,
    );
    assert.equal(kalt, false);
  } finally {
    globalThis.fetch = opprinnelig;
  }
});

test("nyttelasten sendes som JSON til riktig endepunkt", async () => {
  const opprinnelig = globalThis.fetch;
  let url: string | undefined;
  let kropp: unknown;

  try {
    globalThis.fetch = async (inn, init) => {
      url = String(inn);
      kropp = JSON.parse(String(init?.body));
      return new Response("", { status: 200 });
    };
    await sendLeadTilHubspot(lead(), "abc123", BASIS);
  } finally {
    globalThis.fetch = opprinnelig;
  }

  assert.equal(url, ENDEPUNKT);
  assert.ok(
    ENDEPUNKT.includes("/148641188/ca67f6ca-0e02-433f-85bb-7f0825ccf60d"),
    "Portal-ID og skjema-GUID skal være de som er opprettet i HubSpot " +
      "02.10.2026. Endres de, går leadene til et skjema som ikke finnes.",
  );
  assert.deepEqual(kropp, byggInnsending(lead(), "abc123", BASIS));
});

/**
 * DEN VIKTIGSTE TESTEN I FILA.
 *
 * Regelen i hodet på api/skjema/route.ts er at svaret ALLTID er 303 til
 * /takk — også for bot, også når e-posten feiler, og nå også når HubSpot
 * feiler. /takk bærer GA4-hendelsen og Ads-konverteringen, altså målingen
 * av Reflektors eneste KPI. Et annet svar herfra koster en konvertering.
 *
 * `after()` kaster utenfor en forespørselskontekst, og testen kjører
 * nettopp utenfor en. Det er derfor den også dekker fallbacken i ruta:
 * uten `try/catch` rundt `after()` ville denne testen gitt 500.
 */
test("skjemaruta svarer 303 til /takk selv om HubSpot feiler", async () => {
  const opprinnelig = globalThis.fetch;

  try {
    globalThis.fetch = async () => {
      throw new Error("nett nede");
    };

    const { POST } = await import("@/app/api/skjema/route");

    const kropp = new FormData();
    kropp.set("navn", "Pål Barlein");
    kropp.set("epost", "pal@reflektor.no");
    kropp.set("side", "/kontaktoss");

    const svar = await POST(
      new Request("https://www.reflektor.no/api/skjema", {
        method: "POST",
        body: kropp,
        headers: { cookie: "hubspotutk=abc123" },
      }) as never,
    );

    assert.equal(svar.status, 303);
    assert.equal(new URL(svar.headers.get("location") ?? "").pathname, "/takk");
  } finally {
    globalThis.fetch = opprinnelig;
  }
});

/**
 * `website` KOM INN 04.10.2026. Feltet må finnes i HubSpots egen
 * skjemadefinisjon for at innsendingen skal godtas — gjør det ikke det,
 * avvises HELE leadet med 400. Derfor både at det sendes, og at det kan
 * sendes uten.
 */
test("nettsiden følger med, og kan sendes uten", () => {
  const med = byggInnsending(lead(), undefined, BASIS);
  assert.equal(
    med.fields.find((f) => f.name === "website")?.value,
    "https://reflektor.no",
  );

  const uten = byggInnsending(lead(), undefined, BASIS, new Set(["website"]));
  assert.equal(
    uten.fields.find((f) => f.name === "website"),
    undefined,
  );
  assert.ok(
    uten.fields.find((f) => f.name === "email"),
    "resten av leadet skal fortsatt være med",
  );
});

test("«(fra e-post)» er en merknad til Pål, ikke en del av adressen", () => {
  const i = byggInnsending(
    lead({ nettside: "https://trenogmat.no", nettsideUtledet: true }),
    undefined,
    BASIS,
  );
  const v = i.fields.find((f) => f.name === "website")?.value;
  assert.equal(v, "https://trenogmat.no");
  assert.ok(!v?.includes("e-post"));
});

/**
 * RESERVEN NÅR HUBSPOT IKKE KJENNER ET FELT, skrevet om 04.10.2026.
 *
 * Fram til da antok forsøk nummer to at det alltid var `website` som ble
 * avvist. Var det et annet felt, fjernet forsøket feil felt og HELE leadet
 * gikk tapt — navn, e-post og telefon med.
 */
const AVVIST = (felt: string) =>
  JSON.stringify({
    status: "error",
    message: `Error in 'fields.${felt}'.`,
    errors: [
      {
        message: `Error in 'fields.${felt}'. The property "${felt}" does not exist.`,
        errorType: "FIELD_NOT_IN_FORM_DEFINITION",
      },
    ],
  });

test("feltnavnet leses ut av HubSpots egen feilmelding", () => {
  assert.deepEqual([...avvisteFelt(AVVIST("website"))], ["website"]);
  assert.deepEqual([...avvisteFelt(AVVIST("nettside_kilde"))], [
    "nettside_kilde",
  ]);

  // Ingen feilkode, eller en annen feil: ikke prøv igjen.
  assert.equal(avvisteFelt("").size, 0);
  assert.equal(avvisteFelt('{"errors":[{"errorType":"INVALID_EMAIL"}]}').size, 0);

  // E-post tas aldri ut — uten den ville forsøk nummer to vært nytteløst.
  assert.equal(avvisteFelt(AVVIST("email")).size, 0);
});

test("forsøk nummer to fjerner nettopp det feltet HubSpot avviste", async () => {
  const opprinnelig = globalThis.fetch;
  const sendt: Record<string, string>[][] = [];

  try {
    globalThis.fetch = async (_inn, init) => {
      const kropp = JSON.parse(String(init?.body)) as {
        fields: Record<string, string>[];
      };
      sendt.push(kropp.fields);
      return sendt.length === 1
        ? new Response(AVVIST("nettside_kilde"), { status: 400 })
        : new Response("", { status: 200 });
    };

    await sendLeadTilHubspot(lead(), "abc123", BASIS);
  } finally {
    globalThis.fetch = opprinnelig;
  }

  assert.equal(sendt.length, 2, "nøyaktig ett nytt forsøk");
  assert.ok(sendt[0].some((f) => f.name === "nettside_kilde"));
  assert.ok(
    !sendt[1].some((f) => f.name === "nettside_kilde"),
    "det avviste feltet skal være ute",
  );
  assert.ok(
    sendt[1].some((f) => f.name === "website"),
    "resten av leadet skal fortsatt være med",
  );
  assert.ok(sendt[1].some((f) => f.name === "email"));
});

test("en 400 uten feltnavn gir ingen nye forsøk", async () => {
  const opprinnelig = globalThis.fetch;
  let antall = 0;

  try {
    globalThis.fetch = async () => {
      antall += 1;
      return new Response('{"errors":[{"errorType":"INVALID_EMAIL"}]}', {
        status: 400,
      });
    };
    await sendLeadTilHubspot(lead(), undefined, BASIS);
  } finally {
    globalThis.fetch = opprinnelig;
  }

  assert.equal(antall, 1);
});

/**
 * KILDEN SKAL ALLTID MED TIL HUBSPOT, bestilt 04.10.2026.
 *
 * `nettside_kilde` er det eneste feltet i CRM-et som sier hvilken annonse
 * eller kanal en henvendelse kom fra. Den sluttet å komme fram da skjemaet
 * fikk en «Sender …»-tilstand — se Kontaktskjema.tsx for hva som faktisk
 * skjedde — og feilen var usynlig fordi varselet til Pål ikke viser kilden.
 * Denne testen dekker serversiden av veien.
 */
test("nettside_kilde er med både med og uten website", () => {
  const med = byggInnsending(lead(), undefined, BASIS);
  assert.equal(
    med.fields.find((f) => f.name === "nettside_kilde")?.value,
    lead().kilde,
  );

  const uten = byggInnsending(
    lead(),
    undefined,
    BASIS,
    new Set(["website"]),
  );
  assert.equal(
    uten.fields.find((f) => f.name === "nettside_kilde")?.value,
    lead().kilde,
  );
  assert.equal(uten.fields.find((f) => f.name === "website"), undefined);
});

test("ruta sender kilden fra skjemafeltet videre til HubSpot", async () => {
  const opprinnelig = globalThis.fetch;
  let sendt: { name: string; value: string }[] = [];

  try {
    globalThis.fetch = async (_inn, init) => {
      const k = JSON.parse(String(init?.body)) as {
        fields: { name: string; value: string }[];
      };
      if (k.fields) sendt = k.fields;
      return new Response("", { status: 200 });
    };

    const { POST } = await import("@/app/api/skjema/route");

    const kropp = new FormData();
    kropp.set("navn", "Marisol");
    kropp.set("epost", "marisol@example.no");
    kropp.set("telefon", "47605070");
    kropp.set("side", "/kontaktoss");
    kropp.set("kilde", "Instagram (lenke i bio) | source=ig | landet på: /");

    await POST(
      new Request("https://www.reflektor.no/api/skjema", {
        method: "POST",
        body: kropp,
      }) as never,
    );
    // after() kjører utenfor forespørselskonteksten i test: ruta faller
    // tilbake til et direkte kall, og det er ferdig når POST er det.
    await new Promise((r) => setTimeout(r, 50));
  } finally {
    globalThis.fetch = opprinnelig;
  }

  assert.equal(
    sendt.find((f) => f.name === "nettside_kilde")?.value,
    "Instagram (lenke i bio) | source=ig | landet på: /",
  );
});
