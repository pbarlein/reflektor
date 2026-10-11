import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { POST } from "@/app/api/skjema/route.ts";

import { varmOppOppslag, ventPaEtterpa } from "./etterpa.ts";

/* Lista lastes før første måling. Se etterpa.ts. */
await varmOppOppslag();

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

/*
 * HVER INNSENDING FÅR SIN EGEN IP. Mengdebegrensningen i ruta slipper
 * gjennom fem per klientnøkkel, og nøkkelen er `x-forwarded-for` — eller
 * «ukjent» når headeren mangler. Uten denne telleren ville alle testene i
 * fila delt kvote, og den sjette og sjuende blitt stoppet av
 * mengdegrensen i stedet for av det de faktisk tester. Målt 11.10.2026:
 * nøyaktig det skjedde.
 */
let teller = 0;

function innsending(
  felt: Record<string, string>,
  hoder: Record<string, string> = {},
) {
  const data = new FormData();
  for (const [navn, verdi] of Object.entries(felt)) data.set(navn, verdi);
  teller += 1;
  return new NextRequest("https://www.reflektor.no/api/skjema", {
    method: "POST",
    body: data,
    headers: { "x-forwarded-for": `203.0.113.${teller}`, ...hoder },
  });
}

/*
 * NØKKELEN SETTES, ELLERS TESTER VI FEIL TING: `send` gir opp uten
 * RESEND_API_KEY, og da ville null kall vært null uansett hva ruta gjorde.
 *
 * `after()` finnes ikke utenfor en forespørselskontekst. Ruta fanger det
 * og kaller funksjonen uten å vente — derfor ventes køen ut her før vi
 * teller. Se etterpa.ts for hvorfor det ikke er en fast pause.
 */
async function medTeltFetch(req: NextRequest) {
  const opprinnelig = globalThis.fetch;
  const nokkelFor = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test";
  let kall = 0;
  const emner: string[] = [];
  const tekster: string[] = [];
  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    kall += 1;
    if (String(inn).startsWith("https://api.resend.com/")) {
      const k = JSON.parse(String(init?.body)) as { subject: string; text: string };
      emner.push(k.subject);
      tekster.push(k.text);
    }
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  try {
    const svar = await POST(req);
    await ventPaEtterpa(() => kall > 0);
    return { svar, kall, emner, tekster };
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

/* ─────────── SPAM-SPERRA I RUTA (bestilt 11.10.2026) ────────────────── */

/**
 * De tre falske innsendingene 10.–11.10.2026 gikk forbi honningkrukka og
 * fartssjekken. Scoren i lib/spam.ts tar dem på innholdet; her testes at
 * ruta faktisk gjør noe med svaret.
 *
 * DET SOM TELLES ER `fetch`-KALL. Både HubSpot-innsendingen og varselet
 * til Pål går over nettet, så null kall er beviset på at en blokkert
 * innsending ikke gikk videre noe sted.
 */
test("en falsk innsending blokkeres, og ingenting sendes videre", async () => {
  const { svar, kall } = await medTeltFetch(
    innsending(
      {
        side: "/kontaktoss",
        navn: "Wendell Brekke",
        epost: "wbrekke@smaqt.com",
        telefon: "+1 646 555 0188",
        bedrift: "Koss - Grady",
        melding:
          "We are reaching out regarding your services and would like more information.",
      },
      { "x-vercel-ip-country": "US" },
    ),
  );

  assert.equal(svar.status, 303);
  assert.equal(new URL(svar.headers.get("location") ?? "").pathname, "/takk");
  assert.equal(kall, 0, "en blokkert innsending skal ikke nå HubSpot eller Resend");
});

/** Honningkrukka blokkerer fortsatt alene, nå gjennom scoren. */
test("utfylt honningkrukke blokkerer", async () => {
  const { svar, kall } = await medTeltFetch(
    innsending({
      side: "/kontaktoss",
      navn: "Kari Nordmann",
      epost: "kari@nordvik.no",
      telefon: "91122334",
      firmanavn: "fanget",
    }),
  );

  assert.equal(svar.status, 303);
  assert.equal(kall, 0);
});

/**
 * ETT TREFF SLIPPES GJENNOM, MEN MERKES. En norsk kunde på reise får to
 * poeng på IP-en alene. Hun skal fram til Pål — med en advarsel han kan
 * se, ikke en stille sletting.
 */
test("et enkelt treff flagges: leadet kommer fram, varselet advarer", async () => {
  const { svar, kall, tekster } = await medTeltFetch(
    innsending(
      {
        side: "/kontaktoss",
        navn: "Kari Nordmann",
        epost: "kari@nordvik.no",
        telefon: "+47 911 22 334",
        bedrift: "Nordvik AS",
        melding: "Vi trenger video til nettsiden og sosiale medier",
      },
      { "x-vercel-ip-country": "ES" },
    ),
  );

  assert.equal(svar.status, 303);
  assert.ok(kall > 0, "leadet skulle vært sendt videre");
  assert.ok(tekster.length, "det skulle gått et varsel");
  assert.match(tekster[0]!, /⚠ Mulig spam \(utenlandsk-ip\) – sjekk før oppfølging/);
  /* En flagget innsending skal ikke love presentasjon eller påminnelse. */
  assert.ok(!tekster[0]!.includes("Påminnelse sendes"), tekster[0]);
  assert.ok(!tekster[0]!.includes("Canva-presentasjon"), tekster[0]);
});

/** Et rent norsk lead går som før, uten advarsel. */
test("et rent lead får ingen advarsel", async () => {
  const { svar, kall, tekster } = await medTeltFetch(
    innsending(
      {
        side: "/kontaktoss",
        navn: "Iver Kappelslåen",
        epost: "iver@lokk.no",
        telefon: "+47 411 72 729",
        bedrift: "Lokk as",
        melding: "Some innhold. Mest mot custom hodeplagg og produkter",
      },
      { "x-vercel-ip-country": "NO" },
    ),
  );

  assert.equal(svar.status, 303);
  assert.ok(kall > 0);
  assert.ok(tekster.length, "det skulle gått et varsel");
  assert.ok(!tekster[0]!.includes("Mulig spam"), tekster[0]);
});
