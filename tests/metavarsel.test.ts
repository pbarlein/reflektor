import assert from "node:assert/strict";
import test from "node:test";

import { META_VARSEL_EMNE, sendMetaVarsel, varsel } from "@/lib/lead.ts";

/**
 * Varselet til Pål for et Meta-lead.
 *
 * MALEN SKAL VÆRE DEN SAMME SOM FOR NETTSIDELEADS. Det er hele bestillingen
 * fra 04.10.2026: HubSpot-varselet hadde fast tekst om «neste hverdag kl.
 * 09:00», ingen avbryt-knapp, og Metas rå verdier («nei,_ikke_nå») rett i
 * e-posten. Pål skal lese ett format.
 *
 * VERDIENE I TESTENE ER DE FAKTISKE fra leadet 04.10.2026, fordi det er det
 * tilfellet som gikk galt.
 */

const META = {
  navn: "Bakst & Ro | Hjemmebakt i Asker",
  epost: "lolademunirat@yahoo.com",
  bedrift: "BAKST & RO",
  telefon: "+4797744426",
  metasvar: [
    { etikett: "Antall ansatte", verdi: "1–4" },
    { etikett: "Passer 30 000 kr/mnd", verdi: "kanskje, vi vil vite mer" },
    { etikett: "Oppstart", verdi: "innen 3 måneder" },
  ],
};

/** Fanger det som sendes til Resend. */
async function medResend(
  kjor: () => Promise<void>,
): Promise<Record<string, unknown>[]> {
  const opprinnelig = globalThis.fetch;
  const opprinneligNokkel = process.env.RESEND_API_KEY;
  const opprinneligHemmelighet = process.env.PAAMINNELSE_HEMMELIGHET;
  const sendt: Record<string, unknown>[] = [];

  process.env.RESEND_API_KEY = "test";
  /* Uten hemmeligheten lages ingen signert avbryt-lenke. */
  process.env.PAAMINNELSE_HEMMELIGHET = "testhemmelighet-nok-lang";
  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("api.resend.com")) {
      sendt.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return Response.json({ id: "1" });
    }
    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    await kjor();
  } finally {
    globalThis.fetch = opprinnelig;
    if (opprinneligNokkel === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = opprinneligNokkel;
    if (opprinneligHemmelighet === undefined)
      delete process.env.PAAMINNELSE_HEMMELIGHET;
    else process.env.PAAMINNELSE_HEMMELIGHET = opprinneligHemmelighet;
  }
  return sendt;
}

test("Meta-varselet har samme felter og knapper som nettsidevarselet", async () => {
  const sendt = await medResend(async () => {
    await sendMetaVarsel({ ...META, sendt: new Date("2026-10-04T06:41:00Z") });
  });

  assert.equal(sendt.length, 1);
  const e = sendt[0]!;
  /*
    PREFIKSET STÅR URØRT FØRST — leadsjekken søker på det — og navnet og
    bedriften kommer etter, så Gmail ikke tråder varslene sammen.
  */
  assert.ok(String(e.subject).startsWith(META_VARSEL_EMNE));
  assert.equal(
    e.subject,
    "NYTT LEAD fra Meta – Bakst & Ro | Hjemmebakt i Asker (BAKST & RO)",
  );
  /* Svar går til leadet, ikke til Resend. */
  assert.equal(e.reply_to, "lolademunirat@yahoo.com");

  const tekst = String(e.text);
  for (const felt of [
    "Avsender:",
    "Mobilnummer:",
    "E-post:",
    "Bedrift:",
    "Antall ansatte:",
    "Passer 30 000 kr/mnd:",
    "Oppstart:",
  ]) {
    assert.ok(tekst.includes(felt), `mangler ${felt}`);
  }

  /* Verdiene skal være vasket, ikke Metas nøkler. */
  assert.ok(tekst.includes("kanskje, vi vil vite mer"));
  assert.ok(!tekst.includes("_vil_vite_"));

  /* Eksakt dato, ikke «neste hverdag kl. 09:00». */
  assert.ok(tekst.includes("Påminnelse sendes mandag 5. oktober kl. 09:00"), tekst);
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));

  const html = String(e.html);
  assert.ok(html.includes("Skriv til Bakst"), "mangler skriv-knappen");
  assert.ok(html.includes("Avbryt påminnelse"), "mangler avbryt-knappen");

  /* Meta-skjemaet har verken nettside eller fritekst. */
  assert.ok(!tekst.includes("Nettside:"));
  assert.ok(!tekst.includes("Behov:"));
});

/**
 * HAR PERSONEN ALT BOOKET, skal varselet si det — og ikke love en
 * påminnelse som ikke kommer, eller en e-post som ikke ble sendt.
 */
test("har leadet booket, sier varselet det i stedet", async () => {
  const sendt = await medResend(async () => {
    await sendMetaVarsel({
      ...META,
      moteBooket: new Date("2026-10-16T09:00:00Z"),
    });
  });

  const tekst = String(sendt[0]!.text);
  assert.ok(
    tekst.includes(
      "Har allerede booket møte fredag 16. oktober kl. 11:00. Ingen automatisk e-post sendt.",
    ),
    tekst,
  );
  assert.ok(!tekst.includes("Påminnelse sendes"));
  assert.ok(!tekst.includes("Canva-presentasjon"));
  /* Det finnes ingen påminnelse å avbryte. */
  assert.ok(!String(sendt[0]!.html).includes("Avbryt påminnelse"));
  /* Ringe skal han fortsatt. */
  assert.ok(tekst.includes("Ring ASAP"));
});

/** Nettsidevarselet skal være uendret av at Meta fikk sin variant. */
test("nettsidevarselet har fortsatt nettside og behov", () => {
  const { tekst } = varsel({
    navn: "Henrik Dale",
    epost: "henrik@example.no",
    bedrift: "Nordvik",
    telefon: "+4791122334",
    melding: "Vi trenger film",
    side: "/kontaktoss",
    nettside: "https://nordvik.no",
    nettsideUtledet: false,
    kilde: "google",
  });
  assert.ok(tekst.includes("Nettside:"));
  assert.ok(tekst.includes("Behov:"));
  assert.ok(!tekst.includes("Antall ansatte:"));
});

/* ──────────────── BAKST & RO, HELE VEIEN (04.10.2026) ───────────────── */

/**
 * SCENARIET SOM GIKK GALT, kjørt gjennom hele jobben.
 *
 * 06:38 kom Meta-leadet på lolademunirat@yahoo.com. 06:39 booket samme
 * person møte via reflektor.no/book, med bakstogro@outlook.com, og HubSpot
 * laget en ny kontakt. 06:40 sendte jobben presentasjon og «book her» til
 * BEGGE. Testen krever at ingen av dem får e-post, og at varselet sier at
 * personen har booket.
 */

const METAKONTAKT = {
  id: "883323161813",
  epost: "lolademunirat@yahoo.com",
  navn: "Bakst & Ro | Hjemmebakt i Asker",
  bedrift: "BAKST & RO",
  telefon: "+4797744426",
  lifecycle: "lead",
  hendelse: "Facebook Lead Ads: Reflektor SoMe-abonnement Untitled form",
  konvertert: "2026-10-04T06:38:31Z",
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "",
  metasvar: [
    { etikett: "Antall ansatte", verdi: "1–4" },
    { etikett: "Passer 30 000 kr/mnd", verdi: "kanskje, vi vil vite mer" },
    { etikett: "Oppstart", verdi: "innen 3 måneder" },
  ],
};

const BOOKINGKONTAKT = {
  ...METAKONTAKT,
  id: "882425783540",
  epost: "bakstogro@outlook.com",
  navn: "Munirat O Ajetunmobi Olabode",
  telefon: "",
  hendelse: "Meetings Link: paal-barlein/intro",
  konvertert: "2026-10-04T06:39:41Z",
  moteBooket: "2026-10-16T09:00:00Z",
  metasvar: [],
};

/**
 * Kjører med alle nøkler satt, og teller hvem som ble ringt opp: Gmail,
 * Resend eller HubSpot.
 */
async function medAlt(
  kjor: (
    sendEpost1: (
      k: typeof METAKONTAKT,
      na?: Date,
      booket?: (typeof METAKONTAKT)[],
    ) => Promise<string>,
  ) => Promise<void>,
): Promise<{ gmail: number; resend: Record<string, unknown>[]; hubspot: string[] }> {
  const opprinnelig = globalThis.fetch;
  const for_ = { ...process.env };
  const logg = console.info;

  Object.assign(process.env, {
    LEAD_EPOST_AKTIV: "true",
    HUBSPOT_TOKEN: "test",
    RESEND_API_KEY: "test",
    PAAMINNELSE_HEMMELIGHET: "testhemmelighet-nok-lang",
    GOOGLE_OAUTH_CLIENT_ID: "id",
    GOOGLE_OAUTH_CLIENT_SECRET: "hemmelighet",
    GOOGLE_OAUTH_REFRESH_TOKEN: "fornying",
  });
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  delete process.env.LEAD_EPOST_TEST_ADRESSE;

  const telling = {
    gmail: 0,
    resend: [] as Record<string, unknown>[],
    hubspot: [] as string[],
  };

  console.info = () => {};
  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("oauth2.googleapis.com")) {
      return Response.json({ access_token: "nøkkel" });
    }
    if (url.includes("gmail.googleapis.com")) {
      telling.gmail += 1;
      return Response.json({ threadId: "t1" });
    }
    if (url.includes("api.resend.com")) {
      telling.resend.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return Response.json({ id: "1" });
    }
    if (url.includes("api.hubapi.com")) {
      telling.hubspot.push(String(init?.body ?? ""));
      return Response.json({ results: [] });
    }
    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    const { sendEpost1 } = await import("@/lib/leadutsending.ts");
    await kjor(sendEpost1 as never);
  } finally {
    globalThis.fetch = opprinnelig;
    console.info = logg;
    process.env = for_;
  }
  return telling;
}

test("Meta-lead som booket ett minutt senere: ingen e-post til noen av dem", async () => {
  const booket = [BOOKINGKONTAKT];
  const t = await medAlt(async (sendEpost1) => {
    /* Meta-kontakten: bundet til bookingen av telefon og bedrift. */
    assert.equal(
      await sendEpost1(METAKONTAKT, new Date("2026-10-04T06:42:00Z"), booket),
      "hoppet-over",
    );
    /* Bookingkontakten selv: møtet står på henne. */
    assert.equal(
      await sendEpost1(BOOKINGKONTAKT, new Date("2026-10-04T06:42:00Z"), booket),
      "hoppet-over",
    );
  });

  assert.equal(t.gmail, 0, "ingen e-post skulle gått til kunden");

  /* Ett varsel, og det gjelder Meta-leadet. */
  assert.equal(t.resend.length, 1);
  const tekst = String(t.resend[0]!.text);
  assert.ok(
    tekst.includes("Har allerede booket møte fredag 16. oktober kl. 11:00."),
    tekst,
  );
  assert.ok(tekst.includes("Ingen automatisk e-post sendt."));
  assert.ok(!tekst.includes("Påminnelse sendes"));

  /* Begge kontaktene merkes, så neste kjøring ikke gjør det om igjen. */
  assert.equal(t.hubspot.filter((k) => k.includes("paminnelse_avbrutt")).length, 2);
});

/** Uten bookingen skal Meta-leadet få presentasjonen som normalt. */
test("Meta-lead uten booking får e-posten og varselet", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(METAKONTAKT, new Date("2026-10-04T06:42:00Z"), []),
      "sendt",
    );
  });

  assert.equal(t.gmail, 1);
  assert.equal(t.resend.length, 1);
  const tekst = String(t.resend[0]!.text);
  assert.ok(tekst.includes("Påminnelse sendes"), tekst);
  assert.ok(!tekst.includes("Har allerede booket"));
});

/** Ett minutt etter Meta-skjemaet skal jobben vente, ikke sende. */
test("Meta-lead som er under tre minutter gammelt venter", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(METAKONTAKT, new Date("2026-10-04T06:39:00Z"), []),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
  assert.equal(t.resend.length, 0);
});

/** En booking er ikke et skjemalead, og skal aldri utløse e-post 1. */
test("en kontakt opprettet av en booking får ingen e-post", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        { ...BOOKINGKONTAKT, moteBooket: "" },
        new Date("2026-10-04T06:45:00Z"),
        [],
      ),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
});
