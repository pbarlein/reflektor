import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { POST } from "@/app/api/skjema/route.ts";

/**
 * HENDELSEN 06.10.2026 kl. 15:08: en POST til /api/skjema der bare det
 * skjulte feltet «side» var fylt ut. Navn, e-post, telefon, bedrift og
 * melding var tomme. Pål fikk et leadvarsel med «–» i alle feltene, og
 * ingen måte å svare på noe.
 *
 * Den slapp gjennom begge vaktene som fantes: honningkrukka var tom, og
 * fartssjekken hopper over når «lastet» mangler. Derfor denne tredje:
 * ENTEN noe som ser ut som en e-postadresse, ELLER noe som helst i
 * telefonfeltet. Et ekte lead med skrivefeil i det ene kommer fortsatt
 * fram.
 *
 * TESTEN TELLER `fetch`-KALL. Både HubSpot-innsendingen og varselet til
 * Pål går ut over nettet, så null kall er beviset på at ingenting ble
 * sendt videre. Å teste på returverdien ville ikke vist noe: svaret er
 * 303 til /takk uansett, med vilje.
 */

function innsending(felt: Record<string, string>) {
  const data = new FormData();
  for (const [navn, verdi] of Object.entries(felt)) data.set(navn, verdi);
  return new NextRequest("https://www.reflektor.no/api/skjema", {
    method: "POST",
    body: data,
  });
}

/*
 * NØKKELEN SETTES, ELLERS TESTER VI FEIL TING: `send` gir opp uten
 * RESEND_API_KEY, og da ville null kall vært null uansett hva ruta gjorde.
 *
 * `after()` finnes ikke utenfor en forespørselskontekst. Ruta fanger det
 * og kaller funksjonen uten å vente — derfor tømmes køen her før vi teller.
 */
async function medTeltFetch(req: NextRequest) {
  const opprinnelig = globalThis.fetch;
  const nokkelFor = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test";
  let kall = 0;
  globalThis.fetch = (async () => {
    kall += 1;
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  try {
    const svar = await POST(req);
    await new Promise((ferdig) => setTimeout(ferdig, 100));
    return { svar, kall };
  } finally {
    globalThis.fetch = opprinnelig;
    if (nokkelFor === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = nokkelFor;
  }
}

test("tom innsending gir 303 til /takk uten å sendes videre", async () => {
  const { svar, kall } = await medTeltFetch(innsending({ side: "/kontaktoss" }));

  assert.equal(svar.status, 303);
  assert.equal(new URL(svar.headers.get("location") ?? "").pathname, "/takk");
  assert.equal(kall, 0);
});

/**
 * ET TELEFONNUMMER ALENE ER NOK. Da finnes det en måte å svare på, og
 * leadet skal fram — også uten e-post.
 */
test("bare telefon er nok til at leadet sendes videre", async () => {
  const { svar, kall } = await medTeltFetch(
    innsending({ side: "/kontaktoss", telefon: "96684028" }),
  );

  assert.equal(svar.status, 303);
  assert.ok(kall > 0, "leadet skulle vært sendt videre");
});

/**
 * EN E-POSTADRESSE ALENE ER OGSÅ NOK, selv om telefonfeltet er påkrevd i
 * skjemaet. Attributtet er en hjelp til brukeren, ikke en garanti.
 */
test("bare e-post er nok til at leadet sendes videre", async () => {
  const { svar, kall } = await medTeltFetch(
    innsending({ side: "/kontaktoss", epost: "marisol@lamexicana.no" }),
  );

  assert.equal(svar.status, 303);
  assert.ok(kall > 0, "leadet skulle vært sendt videre");
});
