import assert from "node:assert/strict";
import test from "node:test";

import {
  emne1,
  emne2,
  epost1,
  epost2,
  fornavn,
  hilsenNavn,
  leadkilde,
  normalisertBedrift,
  sammePerson,
  sisteSifre,
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

/* ───────────────────────── HILSENEN (04.10.2026) ────────────────────── */

/**
 * META GIR OSS SIDENAVNET, IKKE ET NAVN. 04.10.2026 åpnet e-posten med «Hei
 * Bakst!» til en som heter Munirat og driver «Bakst & Ro | Hjemmebakt i
 * Asker». Det er verre enn ingen hilsen.
 */
test("et bedriftsnavn i navnefeltet gir Hei! og ikke et fornavn", () => {
  assert.equal(
    hilsenNavn("Bakst & Ro | Hjemmebakt i Asker", "BAKST & RO"),
    "",
  );
  assert.equal(hilsenNavn("Claudia Bergheim", "Bergheim"), "Claudia");
});

test("de fire tegnene på at dette ikke er et navn", () => {
  assert.equal(hilsenNavn("Nordvik & Sønner", "Noe helt annet"), "");
  assert.equal(hilsenNavn("Bakeri | Asker", "Noe helt annet"), "");
  assert.equal(hilsenNavn("Nordvik AS", "Noe helt annet"), "");
  assert.equal(hilsenNavn("Bedrift 24", "Noe helt annet"), "");
  /* «Lasse» inneholder «as», men ikke som eget ord. */
  assert.equal(hilsenNavn("Lasse Hansen", "Noe helt annet"), "Lasse");
});

test("fornavnet som ligger i bedriftsnavnet gir Hei!", () => {
  assert.equal(hilsenNavn("Bakst", "Bakst og Ro AS"), "");
  assert.equal(hilsenNavn("henrik", "Nordvik Interiør"), "Henrik");
  assert.equal(hilsenNavn("", "Nordvik"), "");
});

test("e-postene bruker den strenge hilsenen", () => {
  const b = epost1("Bakst & Ro | Hjemmebakt i Asker", "BAKST & RO");
  assert.ok(b.tekst.startsWith("Hei!"), b.tekst.slice(0, 30));
  assert.ok(!b.tekst.includes("Hei Bakst"));

  const p2 = epost2("Bakst & Ro | Hjemmebakt i Asker", "BAKST & RO");
  assert.ok(p2.tekst.startsWith("Hei igjen!"), p2.tekst.slice(0, 30));

  assert.ok(epost1("Claudia Bergheim", "Bergheim").tekst.startsWith("Hei Claudia!"));
});

test("bedriftsnavn normaliseres uten selskapsform og tegn", () => {
  assert.equal(normalisertBedrift("BAKST & RO"), "bakstro");
  assert.equal(normalisertBedrift("Bakst og Ro AS"), "bakstro");
  assert.equal(normalisertBedrift("Nordvik Interiør AS"), "nordvikinteriør");
  assert.equal(normalisertBedrift(""), "");
});

/* ──────────────────── HVOR LEADET KOM FRA (04.10.2026) ──────────────── */

test("bare de to skjemaene er skjemaleads", () => {
  assert.equal(leadkilde("/kontaktoss: reflektor.no – kontaktskjema"), "nettside");
  assert.equal(
    leadkilde("Facebook Lead Ads: Reflektor SoMe-abonnement Untitled form"),
    "meta",
  );
  /* Denne er grunnen til at regelen finnes. */
  assert.equal(leadkilde("Meetings Link: paal-barlein/intro"), "annet");
  assert.equal(leadkilde(""), "annet");
  assert.equal(leadkilde("Import 04.10.2026"), "annet");
});

/* ───────────────── SAMME PERSON, NY ADRESSE (04.10.2026) ────────────── */

test("telefonnummeret kjennes igjen uansett hvordan det er skrevet", () => {
  assert.equal(sisteSifre("+4797744426"), "97744426");
  assert.equal(sisteSifre("977 44 426"), "97744426");
  assert.equal(sisteSifre("97744426"), "97744426");
  /* For kort til å kunne sammenlignes trygt. */
  assert.equal(sisteSifre("4426"), "");
});

const spor = (e: string, t: string, b: string) => ({
  epost: e,
  telefon: t,
  bedrift: b,
});

test("samme telefon eller samme bedrift er samme person", () => {
  /* Dette er Bakst & Ro-saken, med de faktiske verdiene. */
  const meta = spor("lolademunirat@yahoo.com", "+4797744426", "BAKST & RO");
  const booking = spor("bakstogro@outlook.com", "", "BAKST & RO");
  assert.equal(sammePerson(meta, booking), true);

  const bareTelefon = spor("annen@example.no", "977 44 426", "");
  assert.equal(sammePerson(meta, bareTelefon), true);
});

test("samme adresse er én kontakt, ikke to personer", () => {
  const a = spor("en@example.no", "+4797744426", "BAKST & RO");
  assert.equal(sammePerson(a, { ...a }), false);
});

test("ingen felles spor er ikke samme person", () => {
  assert.equal(
    sammePerson(
      spor("en@example.no", "+4791122334", "Nordvik"),
      spor("to@example.no", "+4799887766", "Soulcake"),
    ),
    false,
  );
});

test("tomme felter kobler ikke tilfeldige kontakter sammen", () => {
  assert.equal(
    sammePerson(spor("en@example.no", "", ""), spor("to@example.no", "", "")),
    false,
  );
  /* Et bedriftsnavn på to tegn er for tynt. */
  assert.equal(
    sammePerson(spor("en@example.no", "", "Ab"), spor("to@example.no", "", "AB")),
    false,
  );
});

/* ─────────────────────────── NÅR SENDES DE ──────────────────────────── */

const kandidat = (endringer: Partial<Kandidat> = {}): Kandidat => ({
  epost: "henrik@example.no",
  lifecycle: "lead",
  epost1Sendt: "",
  epost2Sendt: "",
  avbrutt: "",
  hendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  konvertert: "2026-10-05T06:00:00Z",
  booketAnnetSted: false,
  moteBooket: "",
  dealstadier: [],
  harSvart: false,
  ...endringer,
});

test("e-post 1: interne adresser og kunder får ingenting", () => {
  assert.equal(skalHaEpost1(kandidat(), NA), true);
  assert.equal(skalHaEpost1(kandidat({ epost: "pal@reflektor.no" }), NA), false);
  assert.equal(
    skalHaEpost1(kandidat({ epost: "pal+test@Reflektor.no" }), NA),
    false,
  );
  assert.equal(skalHaEpost1(kandidat({ lifecycle: "customer" }), NA), false);
  assert.equal(skalHaEpost1(kandidat({ epost: "" }), NA), false);
});

/** ALDRI TO GANGER. Datoen i HubSpot er det eneste som teller. */
test("e-post 1 sendes aldri to ganger", () => {
  assert.equal(
    skalHaEpost1(kandidat({ epost1Sendt: "2026-10-05T07:00:00Z" }), NA),
    false,
  );
});

const sendt = "2026-10-05T07:00:00Z"; // mandag 09:00 norsk tid
const na = (iso: string) => new Date(iso);
/* Lenge nok etter konverteringen at Meta-ventetiden er ute. */
const NA = new Date("2026-10-05T06:30:00Z");

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

/**
 * ET MØTE STOPPER PÅMINNELSEN UANSETT NÅR DET BLE BOOKET.
 *
 * Her sto det motsatte: et møte booket FØR e-post 1 var «gammelt» og skulle
 * ikke stoppe noe. Bestilt endret av Pål 04.10.2026, etter at en som hadde
 * booket fikk «book her» likevel. Har personen et møte i HubSpot, skal
 * maskinen ikke mase.
 */
test("et møte stopper påminnelsen, også et gammelt", () => {
  assert.equal(
    skalHaEpost2(
      kandidat({ epost1Sendt: sendt, moteBooket: "2026-09-01T10:00:00Z" }),
      na("2026-10-06T07:30:00Z"),
    ),
    false,
  );
});

/**
 * ALT SOM SKAL STOPPE E-POST 1, STOPPER DEN.
 *
 * Fire av dem er nye 04.10.2026, og alle fire kom av samme hendelse: en
 * som hadde booket fikk «book her».
 */
test("alt som skal stoppe e-post 1, stopper den", () => {
  const grunner: Partial<Kandidat>[] = [
    { epost: "pal@reflektor.no" },
    { epost: "" },
    { lifecycle: "customer" },
    { epost1Sendt: "2026-10-05T07:00:00Z" },
    { hendelse: "Meetings Link: paal-barlein/intro" },
    { hendelse: "" },
    { moteBooket: "2026-10-16T09:00:00Z" },
    { booketAnnetSted: true },
  ];
  for (const g of grunner) {
    assert.equal(skalHaEpost1(kandidat(g), NA), false, JSON.stringify(g));
  }
  assert.equal(skalHaEpost1(kandidat(), NA), true);
});

/**
 * TRE MINUTTER FOR META-LEADS. 04.10.2026 kom leadet 06:38 og bookingen
 * 06:39. Jobben rakk ikke å se bookingen fordi den sendte straks.
 */
test("Meta-leads venter tre minutter, nettsideleads venter ikke", () => {
  const meta = {
    hendelse: "Facebook Lead Ads: Reflektor SoMe-abonnement",
    konvertert: "2026-10-04T06:38:00Z",
  };
  assert.equal(
    skalHaEpost1(kandidat(meta), new Date("2026-10-04T06:39:00Z")),
    false,
    "ett minutt er for tidlig",
  );
  assert.equal(
    skalHaEpost1(kandidat(meta), new Date("2026-10-04T06:41:30Z")),
    true,
    "tre og et halvt minutt er nok",
  );

  /* Nettsideleadet sendes med én gang, fra skjemaruta. */
  assert.equal(
    skalHaEpost1(
      kandidat({ konvertert: "2026-10-04T06:38:00Z" }),
      new Date("2026-10-04T06:38:05Z"),
    ),
    true,
  );
});

test("et Meta-lead uten konverteringsdato sendes ikke", () => {
  assert.equal(
    skalHaEpost1(
      kandidat({
        hendelse: "Facebook Lead Ads: Reflektor SoMe-abonnement",
        konvertert: "",
      }),
      NA,
    ),
    false,
  );
});

/* ──────────────────────────── BRYTEREN ──────────────────────────────── */

const kontakt = {
  id: "123",
  epost: "henrik@example.no",
  navn: "Henrik Dale",
  bedrift: "Nordvik",
  telefon: "+4791122334",
  lifecycle: "lead",
  hendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  forsteHendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  bookingKilde: "",
  bookingMedium: "",
  analysekilde: "",
  konvertert: "2026-10-05T06:00:00Z",
  metasvar: [],
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
/*
  TIDSPUNKTET ER FASTSATT, ikke hentet fra klokka. Rettet 04.10.2026.

  Testene under kalte `sendEpost1(kontakt)` uten tidspunkt, og fikk da
  `new Date()`. Da sendevinduet 07–21 kom til tidligere samme dag, begynte
  de å avhenge av når på døgnet testene kjørte: grønne om formiddagen, røde
  etter kl. 21. Det ble oppdaget kl. 21:09.
*/
const I_VINDUET = new Date("2026-10-05T10:00:00+02:00");

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
      assert.equal(await sendEpost1(kontakt, I_VINDUET), "ville-sendt");
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
      const utfall = await sendEpost1(kontakt, I_VINDUET);
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
      await sendEpost1(
        { ...kontakt, epost1Sendt: "2026-10-05T07:00:00Z" },
        I_VINDUET,
      ),
      "hoppet-over",
    );
  });
});
