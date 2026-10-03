import assert from "node:assert/strict";
import test from "node:test";

import { varsel } from "@/lib/lead.ts";
import { foroftigPaKanten } from "@/lib/mengde.ts";

/**
 * Sikkerhetsnettet rundt kontaktskjemaet, bestilt 04.10.2026.
 *
 * Tre ting som alle handler om det samme: et lead skal aldri forsvinne
 * stille. Enten kommer det fram, eller så står det tydelig et sted Pål ser.
 */

/* ───────────────────────── MENGDEBEGRENSNING ────────────────────────── */

/**
 * DEN VIKTIGSTE EGENSKAPEN ER AT DEN SLIPPER GJENNOM VED TVIL.
 *
 * Testen kjører utenfor Vercel, uten brannmurregel — nøyaktig situasjonen
 * som oppstår hvis regelen slettes eller tjenesten er nede. Svaret skal
 * være «ikke begrenset», aldri en kastet feil: en henvendelse er verdt mer
 * enn en grense.
 */
test("kantgrensen slipper gjennom når den ikke kan svare", async () => {
  const svar = await foroftigPaKanten(
    new Request("https://www.reflektor.no/api/skjema", { method: "POST" }),
  );
  assert.equal(svar, false);
});

/* ──────────────── ADVARSEL NÅR HUBSPOT IKKE FIKK LEADET ─────────────── */

const lead = (endringer: Record<string, unknown> = {}) => ({
  navn: "Marisol Sand",
  epost: "marisol@lamexicana.no",
  bedrift: "La Mexicana AS",
  telefon: "+47 966 84 028",
  melding: "Vi trenger film.",
  side: "/kontaktoss",
  nettside: "https://lamexicana.no",
  nettsideUtledet: false,
  kilde: "Instagram (lenke i bio)",
  ...endringer,
});

test("advarselen står øverst, før navnet", () => {
  const { tekst, html } = varsel(lead(), new Date("2026-10-05T10:00:00+02:00"), true);
  assert.ok(
    tekst.startsWith("⚠ Leadet ble IKKE lagret i HubSpot. Legg det inn manuelt."),
    tekst.slice(0, 120),
  );
  assert.ok(html.includes("⚠ Leadet ble IKKE lagret i HubSpot. Legg det inn manuelt."));
  // Advarselen skal stå FØR feltene, ikke etter.
  assert.ok(html.indexOf("IKKE lagret") < html.indexOf("Avsender"));
  // Resten av varselet er uendret.
  assert.ok(tekst.includes("Mobilnummer: +47 966 84 028"));
});

test("ingen advarsel når leadet kom fram", () => {
  const { tekst, html } = varsel(lead());
  assert.ok(!tekst.includes("IKKE lagret"));
  assert.ok(!html.includes("IKKE lagret"));
});

/* ───────────────────── VARSELET SOM IKKE KOM FRAM ───────────────────── */

/**
 * ETT FORSØK TIL ETTER TO SEKUNDER, og en logglinje som kan finnes igjen.
 *
 * Testene stubber `fetch`, så ingen e-post sendes. Nøkkelen settes fordi
 * `send` gir opp uten den — og da ville vi testet feil ting.
 */
test("et varsel som feiler én gang, sendes på nytt", async () => {
  const opprinnelig = globalThis.fetch;
  const nokkelFor = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test";
  let forsok = 0;

  try {
    globalThis.fetch = async () => {
      forsok += 1;
      return forsok === 1
        ? new Response("for mange", { status: 429 })
        : new Response("{}", { status: 200 });
    };
    const { sendLeadPaEpost } = await import("@/lib/lead.ts");
    await sendLeadPaEpost(lead());
  } finally {
    globalThis.fetch = opprinnelig;
    if (nokkelFor === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = nokkelFor;
  }

  assert.equal(forsok, 2, "skal ha prøvd nøyaktig én gang til");
});

test("to mislykkede forsøk gir en logglinje som kan søkes opp", async () => {
  const opprinnelig = globalThis.fetch;
  const opprinneligFeil = console.error;
  const nokkelFor = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test";
  const linjer: unknown[][] = [];
  let forsok = 0;

  try {
    globalThis.fetch = async () => {
      forsok += 1;
      return new Response("nede", { status: 500 });
    };
    console.error = (...a: unknown[]) => void linjer.push(a);
    const { sendLeadPaEpost } = await import("@/lib/lead.ts");
    await assert.rejects(() => sendLeadPaEpost(lead()));
  } finally {
    globalThis.fetch = opprinnelig;
    console.error = opprinneligFeil;
    if (nokkelFor === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = nokkelFor;
  }

  assert.equal(forsok, 2);
  const linje = linjer.find((l) => l[0] === "LEADVARSEL FEILET");
  assert.ok(linje, "fant ingen linje som starter med LEADVARSEL FEILET");
  const detaljer = linje[1] as { navn: string; epost: string };
  assert.equal(detaljer.navn, "Marisol Sand");
  assert.equal(detaljer.epost, "marisol@lamexicana.no");
});

/* ──────────────────── HELE RUTA, MED ALLE TRE LAGENE ────────────────── */

function innsending(): FormData {
  const k = new FormData();
  k.set("navn", "Marisol Sand");
  k.set("epost", "marisol@lamexicana.no");
  k.set("telefon", "47605070");
  k.set("side", "/kontaktoss");
  return k;
}

const post = async (ip: string) => {
  const { POST } = await import("@/app/api/skjema/route");
  return POST(
    new Request("https://www.reflektor.no/api/skjema", {
      method: "POST",
      body: innsending(),
      headers: { "x-forwarded-for": ip },
    }) as never,
  );
};

/**
 * OVER GRENSEN SVARER RUTA SOM VED SUKSESS.
 *
 * Den som sender skjemaet seks ganger skal ikke få en feilmelding og en
 * grunn til å prøve en annen vei. Det som ikke skjer, er at noe sendes
 * videre — og det er nettopp det testen måler: ingen kall ut av serveren.
 */
test("over mengdegrensen: 303 til /takk, men ingenting sendes videre", async () => {
  const opprinnelig = globalThis.fetch;
  const opprinneligAdvar = console.warn;
  process.env.RESEND_API_KEY = "test";
  let kall = 0;

  try {
    globalThis.fetch = async () => {
      kall += 1;
      return new Response("{}", { status: 200 });
    };
    console.warn = () => {};

    const ip = "203.0.113.77";
    for (let i = 0; i < 5; i++) await post(ip);
    await new Promise((r) => setTimeout(r, 60));
    const forGrensen = kall;

    const svar = await post(ip);
    await new Promise((r) => setTimeout(r, 60));

    assert.equal(svar.status, 303);
    assert.equal(new URL(svar.headers.get("location") ?? "").pathname, "/takk");
    assert.equal(kall, forGrensen, "ingenting skal ha gått ut av serveren");
  } finally {
    globalThis.fetch = opprinnelig;
    console.warn = opprinneligAdvar;
    delete process.env.RESEND_API_KEY;
  }
});

/**
 * DEN SOM BINDER DET SAMMEN: feiler HubSpot, skal varselet si fra.
 *
 * Testen later som HubSpot svarer 500 og leser hva som faktisk ble sendt
 * til Resend etterpå. Rekkefølgen — HubSpot først, så e-posten — er hele
 * grunnen til at advarselen kan stå der.
 */
test("feiler HubSpot, står advarselen i varselet som sendes", async () => {
  const opprinnelig = globalThis.fetch;
  const opprinneligFeil = console.error;
  process.env.RESEND_API_KEY = "test";
  let epostkropp = "";

  try {
    globalThis.fetch = async (inn, init) => {
      const url = String(inn);
      if (url.includes("hsforms.com")) return new Response("nede", { status: 500 });
      if (url.includes("resend.com")) {
        epostkropp = String(init?.body);
        return new Response("{}", { status: 200 });
      }
      return new Response("", { status: 200 });
    };
    console.error = () => {};

    await post("198.51.100.5");
    await new Promise((r) => setTimeout(r, 120));
  } finally {
    globalThis.fetch = opprinnelig;
    console.error = opprinneligFeil;
    delete process.env.RESEND_API_KEY;
  }

  assert.ok(epostkropp, "varselet ble aldri sendt");
  assert.ok(
    epostkropp.includes("Leadet ble IKKE lagret i HubSpot"),
    epostkropp.slice(0, 300),
  );
});
