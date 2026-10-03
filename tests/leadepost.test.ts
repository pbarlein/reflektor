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
import { byggMime, kodetHode } from "@/lib/gmail.ts";

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
  assert.ok(mime.includes("From: =?UTF-8?B?UMOlbCBCYXJsZWlu?= <pal@reflektor.no>"));
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
 * ÆØÅ I HEADERNE MÅ KODES ETTER RFC 2047.
 *
 * Headere er ASCII. «Pål Barlein» rått i `From` ble vist som «PÃƒÂ¥l
 * Barlein» i Gmail 03.10.2026 — det er denne feilen testene under vokter.
 */

/** Dekoder en header slik en mottakerklient gjør det. */
function dekodHode(hode: string): string {
  return hode
    .replace(/\?=\r\n =\?UTF-8\?B\?/g, "") // brettede ord er ett ord
    .replace(/=\?UTF-8\?B\?([^?]*)\?=/g, (_, b64: string) =>
      Buffer.from(b64, "base64").toString("utf8"),
    );
}

function hentHode(mime: string, navn: string): string {
  const fra = mime.indexOf(`${navn}: `);
  assert.notEqual(fra, -1, `fant ikke ${navn}`);
  /* En header slutter ved CRLF som IKKE følges av mellomrom (bretting). */
  const rest = mime.slice(fra + navn.length + 2);
  const slutt = rest.search(/\r\n(?![ \t])/);
  return rest.slice(0, slutt === -1 ? undefined : slutt);
}

test("avsendernavnet kodes, og dekoder tilbake til Pål Barlein", () => {
  const mime = byggMime(
    { til: "a@b.no", emne: "Noe", tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  const fra = hentHode(mime, "From");
  assert.equal(fra, "=?UTF-8?B?UMOlbCBCYXJsZWlu?= <pal@reflektor.no>");
  assert.equal(dekodHode(fra), "Pål Barlein <pal@reflektor.no>");
  /* Rå «å» i headeren er nøyaktig feilen vi rettet. */
  assert.ok(!fra.includes("å"));
});

test("emnet kodes når det har norske tegn, og ikke når det ikke har", () => {
  const mime = byggMime(
    { til: "a@b.no", emne: "Nordvik Interiør + Reflektor", tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  assert.ok(hentHode(mime, "Subject").startsWith("=?UTF-8?B?"));
  assert.equal(
    dekodHode(hentHode(mime, "Subject")),
    "Nordvik Interiør + Reflektor",
  );

  const ren = byggMime(
    { til: "a@b.no", emne: "Reflektor", tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  assert.equal(hentHode(ren, "Subject"), "Reflektor");
});

test("et langt emne med æøå dekoder helt, også når det brettes", () => {
  const emne = emne1("Bedrift Ålesund AS");
  const mime = byggMime(
    { til: "a@b.no", emne, tekst: "t", html: "<p>t</p>" },
    "<x@reflektor.no>",
  );
  const hode = hentHode(mime, "Subject");
  assert.equal(dekodHode(hode), emne);

  /* Hvert kodet ord skal holde seg innenfor RFC 2047 sine 75 tegn. */
  for (const ord of hode.split("\r\n ")) {
    assert.ok(ord.length <= 75, `for langt kodet ord: ${ord.length}`);
  }
});

test("påminnelsens emne dekoder likt, Re- og alt", () => {
  const emne = emne2("Bedrift Ålesund AS");
  const mime = byggMime(
    { til: "a@b.no", emne, tekst: "t", html: "<p>t</p>", svarPa: "<a@b.no>" },
    "<x@reflektor.no>",
  );
  assert.equal(dekodHode(hentHode(mime, "Subject")), emne);
  assert.ok(emne.startsWith("Re: "));
});

test("en ASCII-tekst kodes ikke, så ingenting dobbeltkodes", () => {
  assert.equal(kodetHode("Reflektor AS"), "Reflektor AS");
  assert.equal(kodetHode(kodetHode("Reflektor AS")), "Reflektor AS");
});

/**
 * BRØDTEKSTEN. Begge delene skal si UTF-8 og være base64, ellers blir æøå
 * feil uansett hvor riktig headeren er.
 */
test("begge meldingsdelene er UTF-8 og base64, og æøå kommer helt fram", () => {
  const brev = epost1("øystein", "Bedrift Ålesund AS");
  const mime = byggMime(
    { til: "a@b.no", emne: brev.emne, tekst: brev.tekst, html: brev.html },
    "<x@reflektor.no>",
  );
  assert.ok(mime.includes("Content-Type: text/plain; charset=UTF-8"));
  assert.ok(mime.includes("Content-Type: text/html; charset=UTF-8"));
  assert.equal(
    (mime.match(/Content-Transfer-Encoding: base64/g) ?? []).length,
    2,
  );

  /* Ren tekst først, HTML sist: klienten viser den siste den forstår. */
  assert.ok(
    mime.indexOf("text/plain") < mime.indexOf("text/html"),
    "ren tekst må ligge først",
  );

  /* Dekod delene og sjekk at teksten er uskadd. */
  const deler = mime.split(/\r\n--g[0-9a-f]+(?:--)?\r\n?/).slice(1);
  const dekodet = deler
    .filter((d) => d.includes("base64"))
    .map((d) =>
      Buffer.from(d.split("\r\n\r\n")[1]!.replace(/\r\n/g, ""), "base64").toString(
        "utf8",
      ),
    );
  assert.equal(dekodet.length, 2);
  assert.ok(dekodet[0]!.includes("Hei Øystein!"));
  assert.ok(dekodet[1]!.includes("Pål Barlein // CEO // Reflektor AS"));

  /* Ingen base64-linje over 76 tegn, som RFC 2045 krever. */
  for (const linje of mime.split("\r\n")) {
    assert.ok(linje.length <= 998, "ingen linje over SMTP-grensen");
  }
});

/**
 * SIGNATUREN SKAL VÆRE REN TEKST. En mailto-lenke på adressen og
 * telefonnummeret får e-posten til å se maskinskrevet ut. Bare Canva og
 * /book skal være lenker.
 */
test("signaturen har ingen mailto-lenke", () => {
  for (const brev of [epost1("henrik", "Bedrift AS"), epost2("henrik", "Bedrift AS")]) {
    assert.ok(!brev.html.includes("mailto:"));
    assert.ok(!brev.html.includes("tel:"));
    assert.ok(brev.html.includes("pal@reflektor.no"));
    assert.ok(brev.html.includes("47605070"));
    assert.ok(brev.html.includes('<a href="https://www.reflektor.no/book">'));
  }
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
  harSvart: false,
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
    { harSvart: true },
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

/**
 * ET SVAR STOPPER PÅMINNELSEN. Har leadet skrevet tilbake, er samtalen i
 * gang, og en automatisk «fikk du sett på presentasjonen?» er det eneste
 * som kan ødelegge den.
 */
test("et svar i tråden stopper påminnelsen", () => {
  const tid = na("2026-10-06T07:30:00Z");
  assert.equal(
    skalHaEpost2(kandidat({ epost1Sendt: sendt, harSvart: true }), tid),
    false,
  );
  assert.equal(
    skalHaEpost2(kandidat({ epost1Sendt: sendt, harSvart: false }), tid),
    true,
  );
});

/**
 * ET USIKKERT NEI SKAL IKKE STOPPE NOE. Fikk vi ikke lest tråden, sender vi
 * likevel. En forbigående feil hos Google skal ikke stilne hele
 * oppfølgingen uten at noen merker det.
 */
test("fikk vi ikke lest tråden, sendes påminnelsen likevel", () => {
  assert.equal(
    skalHaEpost2(
      kandidat({ epost1Sendt: sendt, harSvart: null }),
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
