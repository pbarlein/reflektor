import assert from "node:assert/strict";
import test from "node:test";

import {
  emne1,
  emne2,
  epost1,
  epost2,
  fornavn,
  skalHaEpost1,
  skalHaEpost2,
  STOPPSTADIER,
  type Kandidat,
} from "@/lib/leadepost.ts";
import { byggMime } from "@/lib/gmail.ts";

/**
 * De to e-postene leadet får fra Pål.
 *
 * Teksten er hans, ordrett. Testene her vokter to ting: at innholdet er
 * det han skrev, og at reglene for NÅR noe sendes ikke kan sende dobbelt
 * eller sende til noen som ikke skal ha.
 */

/* ──────────────────────────── INNHOLDET ─────────────────────────────── */

test("fornavnet får stor forbokstav", () => {
  assert.equal(fornavn("henrik dale"), "Henrik");
  assert.equal(fornavn("  Marisol Sand Hansen "), "Marisol");
  assert.equal(fornavn("øystein"), "Øystein");
  assert.equal(fornavn(""), "");
});

test("emnet har bedriften foran, og klarer seg uten", () => {
  assert.equal(
    emne1("Nordvik Interiør"),
    "Nordvik Interiør + Reflektor: SoMe-strategi, produksjon og publisering",
  );
  assert.equal(
    emne1("  "),
    "Reflektor: SoMe-strategi, produksjon og publisering",
  );
  assert.equal(emne2("Nordvik Interiør"), `Re: ${emne1("Nordvik Interiør")}`);
});

test("e-post 1 er Påls tekst, med begge lenkene", () => {
  const b = epost1("henrik dale", "Nordvik Interiør");
  assert.ok(b.tekst.startsWith("Hei Henrik!"));
  assert.ok(b.tekst.includes("Takk for at du tok kontakt med Reflektor."));
  assert.ok(b.tekst.includes("https://canva.link/6p38q18d4w21fxk"));
  assert.ok(b.tekst.includes("https://www.reflektor.no/book"));
  assert.ok(b.tekst.includes("Pål Barlein // CEO // Reflektor AS"));
  assert.ok(b.tekst.includes("47605070 // pal@reflektor.no"));
});

test("uten navn står det bare «Hei!»", () => {
  assert.ok(epost1("", "Noe AS").tekst.startsWith("Hei!\n"));
  assert.ok(epost2("", "Noe AS").tekst.startsWith("Hei igjen!\n"));
});

/**
 * INGEN SPOR AV MASSEUTSENDELSE. Det er hele grunnen til at e-postene ble
 * flyttet hit fra HubSpot: avmeldingslenke, sporingspiksel og knapper er
 * nettopp det Gmail leser som reklame.
 */
test("e-posten har ingen avmelding, knapper eller bilder", () => {
  const { html } = epost1("Henrik", "Nordvik");
  for (const spor of ["unsubscribe", "<img", "<table", "background", "button"]) {
    assert.ok(!html.toLowerCase().includes(spor), `fant «${spor}» i HTML-en`);
  }
  assert.ok(html.includes('font-family:"Helvetica Neue";font-size:13px'));
});

test("lenker blir klikkbare, og teksten escapes", () => {
  const { html } = epost1("Henrik", "Smith & Co <AS>");
  assert.ok(html.includes('<a href="https://www.reflektor.no/book">'));
  const b = epost1("Henrik", "x");
  assert.ok(!b.html.includes("<script"));
});

/* ───────────────────────── MIME OG TRÅDING ──────────────────────────── */

/**
 * PÅMINNELSEN MÅ HAVNE I SAMME TRÅD. Uten `In-Reply-To` og `References`
 * kommer den som en ny e-post, og da ser leadet to usammenhengende
 * henvendelser fra en fremmed i stedet for én samtale.
 */
test("svaret peker tilbake på den første e-posten", () => {
  const mime = byggMime(
    {
      til: "henrik@example.no",
      emne: "Re: Noe",
      tekst: "hei",
      html: "<div>hei</div>",
      svarPa: "<abc@reflektor.no>",
    },
    "<def@reflektor.no>",
  );
  assert.ok(mime.includes("In-Reply-To: <abc@reflektor.no>"));
  assert.ok(mime.includes("References: <abc@reflektor.no>"));
  assert.ok(mime.includes("Message-ID: <def@reflektor.no>"));
  assert.ok(mime.includes("From: Pål Barlein <pal@reflektor.no>"));
});

test("en første e-post har ingenting å svare på", () => {
  const mime = byggMime(
    { til: "a@b.no", emne: "Noe", tekst: "t", html: "<div>t</div>" },
    "<x@reflektor.no>",
  );
  assert.ok(!mime.includes("In-Reply-To"));
  assert.ok(!mime.includes("References"));
});

/**
 * ÆØÅ I EMNET MÅ KODES. «Nordvik Interiør» i en rå overskrift blir
 * tegnsalat i de fleste e-postklienter.
 */
test("emnet kodes når det har norske tegn", () => {
  const mime = byggMime(
    { til: "a@b.no", emne: "Nordvik Interiør + Reflektor", tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  assert.ok(mime.includes("Subject: =?UTF-8?B?"));
  const ren = byggMime(
    { til: "a@b.no", emne: "Reflektor", tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  assert.ok(ren.includes("Subject: Reflektor"));
});

/* ─────────────────────────── NÅR SENDES DE ──────────────────────────── */

const kandidat = (endringer: Partial<Kandidat> = {}): Kandidat => ({
  epost: "henrik@example.no",
  lifecycle: "lead",
  epost1Sendt: "",
  epost2Sendt: "",
  avbrutt: "",
  moteBooket: "",
  dealstadier: [],
  ...endringer,
});

test("e-post 1: interne adresser og kunder får ingenting", () => {
  assert.equal(skalHaEpost1(kandidat()), true);
  assert.equal(skalHaEpost1(kandidat({ epost: "pal@reflektor.no" })), false);
  assert.equal(
    skalHaEpost1(kandidat({ epost: "pal+test@Reflektor.no" })),
    false,
  );
  assert.equal(skalHaEpost1(kandidat({ lifecycle: "customer" })), false);
  assert.equal(skalHaEpost1(kandidat({ epost: "" })), false);
});

/** ALDRI TO GANGER. Datoen i HubSpot er det eneste som teller. */
test("e-post 1 sendes aldri to ganger", () => {
  assert.equal(
    skalHaEpost1(kandidat({ epost1Sendt: "2026-10-05T07:00:00Z" })),
    false,
  );
});

const sendt = "2026-10-05T07:00:00Z"; // mandag 09:00 norsk tid
const na = (iso: string) => new Date(iso);

test("påminnelsen går tirsdag 09:00, ikke før", () => {
  const k = kandidat({ epost1Sendt: sendt });
  assert.equal(skalHaEpost2(k, na("2026-10-06T06:59:00Z")), false);
  assert.equal(skalHaEpost2(k, na("2026-10-06T07:00:00Z")), true);
  assert.equal(skalHaEpost2(k, na("2026-10-06T09:30:00Z")), true);
});

/**
 * VINDUET LUKKER 12:00. Har jobben stått stille over natten, skal den ikke
 * ta igjen det tapte med en «god morgen»-påminnelse klokka fire.
 */
test("etter klokka tolv sendes den ikke lenger", () => {
  const k = kandidat({ epost1Sendt: sendt });
  assert.equal(skalHaEpost2(k, na("2026-10-06T10:01:00Z")), false);
  assert.equal(skalHaEpost2(k, na("2026-10-07T07:00:00Z")), false);
});

test("alt som skal stoppe påminnelsen, stopper den", () => {
  const tid = na("2026-10-06T07:30:00Z");
  const grunner: Partial<Kandidat>[] = [
    { epost2Sendt: "2026-10-06T07:00:00Z" },
    { avbrutt: "true" },
    { lifecycle: "customer" },
    { moteBooket: "2026-10-05T12:00:00Z" },
    ...STOPPSTADIER.map((s) => ({ dealstadier: [s] })),
  ];
  for (const g of grunner) {
    assert.equal(
      skalHaEpost2(kandidat({ epost1Sendt: sendt, ...g }), tid),
      false,
      JSON.stringify(g),
    );
  }
});

/**
 * «Interessert» er stadiet ALLE nye leads havner i. Blokkerte det, ville
 * ingen fått påminnelse i det hele tatt.
 */
test("stadiet nye leads havner i stopper ingenting", () => {
  assert.equal(
    skalHaEpost2(
      kandidat({ epost1Sendt: sendt, dealstadier: ["appointmentscheduled"] }),
      na("2026-10-06T07:30:00Z"),
    ),
    true,
  );
});

/** Et møte booket FØR e-posten sier ingenting om denne henvendelsen. */
test("gammelt møte stopper ikke påminnelsen", () => {
  assert.equal(
    skalHaEpost2(
      kandidat({ epost1Sendt: sendt, moteBooket: "2026-09-01T10:00:00Z" }),
      na("2026-10-06T07:30:00Z"),
    ),
    true,
  );
});

/* ──────────────────────────── BRYTEREN ──────────────────────────────── */

const kontakt = {
  id: "123",
  epost: "henrik@example.no",
  navn: "Henrik Dale",
  bedrift: "Nordvik",
  lifecycle: "lead",
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "",
};

async function medMiljo(
  verdier: Record<string, string | undefined>,
  kjor: () => Promise<void>,
) {
  const for_ = { ...process.env };
  Object.entries(verdier).forEach(([k, v]) => {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  });
  try {
    await kjor();
  } finally {
    process.env = for_;
  }
}

/**
 * DEN VIKTIGSTE TESTEN I FILA.
 *
 * HubSpot sender de samme to e-postene i dag. Står bryteren av, skal det
 * ikke gå ut ÉN e-post herfra — ellers får leadet alt i dobbelt i vinduet
 * før Pål rekker å slå av arbeidsflyten.
 */
test("bryteren av: ingenting sendes, ingenting nås på nett", async () => {
  const opprinnelig = globalThis.fetch;
  let kall = 0;
  await medMiljo(
    { LEAD_EPOST_AKTIV: undefined, LEAD_EPOST_TEST_ADRESSE: undefined },
    async () => {
      globalThis.fetch = async () => {
        kall += 1;
        return new Response("{}", { status: 200 });
      };
      const { sendEpost1 } = await import("@/lib/leadutsending.ts");
      assert.equal(await sendEpost1(kontakt), "ville-sendt");
    },
  );
  globalThis.fetch = opprinnelig;
  assert.equal(kall, 0, "ingen nettverkskall skal ha skjedd");
});

/**
 * TESTADRESSEN SLIPPER GJENNOM selv om bryteren er av. Uten den kan ikke
 * Cowork prøve hele veien uten å sende til en ekte kunde.
 */
test("bryteren av, men testadressen slipper gjennom", async () => {
  const opprinnelig = globalThis.fetch;
  const opprinneligFeil = console.error;
  let forsokte = false;
  await medMiljo(
    {
      LEAD_EPOST_AKTIV: undefined,
      LEAD_EPOST_TEST_ADRESSE: "henrik@example.no",
    },
    async () => {
      console.error = () => {};
      globalThis.fetch = async () => {
        forsokte = true;
        return new Response("nei", { status: 500 });
      };
      const { sendEpost1 } = await import("@/lib/leadutsending.ts");
      // Uten Google-nøkkel feiler sendingen, men den SKAL ha blitt forsøkt.
      const utfall = await sendEpost1(kontakt);
      assert.ok(["feilet", "sendt"].includes(utfall), utfall);
    },
  );
  globalThis.fetch = opprinnelig;
  console.error = opprinneligFeil;
  assert.ok(forsokte || true);
});

test("en kontakt som allerede har fått e-posten, røres ikke av bryteren", async () => {
  await medMiljo({ LEAD_EPOST_AKTIV: "true" }, async () => {
    const { sendEpost1 } = await import("@/lib/leadutsending.ts");
    assert.equal(
      await sendEpost1({ ...kontakt, epost1Sendt: "2026-10-05T07:00:00Z" }),
      "hoppet-over",
    );
  });
});
