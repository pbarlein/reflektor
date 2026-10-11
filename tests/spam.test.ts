import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOKKERGRENSE,
  epostdomene,
  generertBedrift,
  norskNummer,
  spamScore,
  utenNorsk,
  type Innsending,
} from "@/lib/spam.ts";
import { erEngangsadresse, manglerMx } from "@/lib/spamoppslag.ts";

/**
 * Spam-scoren på kontaktskjemaet, bestilt 11.10.2026.
 *
 * TRE FALSKE INNSENDINGER 10.–11.10 gikk rett forbi honningkrukka og
 * fartssjekken. Botten kjører JavaScript og oppfører seg som et menneske;
 * det eneste som skilte den var innholdet.
 *
 * DEN DYRESTE FEILEN ER IKKE EN BOT SOM SLIPPER GJENNOM — det er et ekte
 * lead som blir kastet. Skjemaleads er sidens eneste KPI. Derfor er det
 * like mange tester på at ekte henvendelser får null som på at de falske
 * blir stoppet.
 */

const tom: Innsending = {
  telefon: "",
  epost: "",
  melding: "",
  bedrift: "",
  land: "",
  botAktig: false,
  engangsadresse: false,
  manglerMx: null,
};

const inn = (endringer: Partial<Innsending> = {}): Innsending => ({
  ...tom,
  ...endringer,
});

/* ─────────────────────── DELREGLENE HVER FOR SEG ────────────────────── */

test("norske nummer kjennes igjen i de formene folk skriver dem", () => {
  for (const t of [
    "+4796684028",
    "+47 966 84 028",
    "0047 966 84 028",
    "96684028",
    "966 84 028",
    "+47 411 72 729",
    "46566604",
  ]) {
    assert.equal(norskNummer(t), true, t);
  }
});

test("utenlandske nummer kjennes ikke igjen", () => {
  for (const t of ["+1 555 123 4567", "+46 70 123 45 67", "(201) 555-0123"]) {
    assert.equal(norskNummer(t), false, t);
  }
});

/**
 * ÅTTE SIFFER SOM STARTER PÅ 4 ELLER 9 er et norsk mobilnummer. Et
 * amerikansk nummer er ti siffer, og et fasttelefonnummer her starter på
 * noe annet — da er det ikke mobilen Pål ringer uansett.
 */
test("et tisifret nummer uten landkode er ikke norsk", () => {
  assert.equal(norskNummer("4155550123"), false);
});

test("en norsk melding kjennes igjen på bokstavene eller på ordene", () => {
  assert.equal(utenNorsk("Vi trenger film til Instagram og nettsiden"), false);
  assert.equal(utenNorsk("Trenger hjelp med innhold hver maaned"), false);
  /* Ingen æøå, men «og» og «til» er der. */
  assert.equal(utenNorsk("Ser etter noen som kan lage video og foto til oss"), false);
});

test("en engelsk melding uten norske spor slår ut", () => {
  assert.equal(
    utenNorsk("We would like to discuss a potential partnership opportunity"),
    true,
  );
});

/**
 * EN KORT MELDING SIER INGENTING OM SPRÅK. «Photos» er en ekte
 * henvendelse — kontakt 882819192046 skrev nettopp det — og skal aldri
 * koste et poeng.
 */
test("en kort melding slår aldri ut", () => {
  assert.equal(utenNorsk("Photos"), false);
  assert.equal(utenNorsk("Hi"), false);
  assert.equal(utenNorsk(""), false);
});

test("genererte bedriftsnavn kjennes igjen", () => {
  assert.equal(generertBedrift("Koss - Grady"), true);
  assert.equal(generertBedrift("Metz, Waelchi and Corkery"), true);
});

/** Ekte navn skal aldri treffe. Mønstrene er smale med vilje. */
test("ekte bedriftsnavn treffer ikke", () => {
  for (const b of [
    "Lokk as",
    "La. MEXICANA As",
    "BAKST & RO",
    "Haugland Interiør AS",
    "Natulahland",
    "Soulcake",
    "Anton Sport",
    "Egon Restauranter AS",
  ]) {
    assert.equal(generertBedrift(b), false, b);
  }
});

test("domenet plukkes ut av adressen", () => {
  assert.equal(epostdomene("Ola@Firma.NO"), "firma.no");
  assert.equal(epostdomene("uten-krøllalfa"), "");
});

/* ──────────────────────── DE FALSKE INNSENDINGENE ───────────────────── */

/**
 * DE TRE FRA 10.–11.10.2026.
 *
 * KONTAKTENE ER SLETTET — Pål ryddet dem før denne jobben startet, og
 * HubSpot svarer `notFound` på alle tre ID-ene (888069876941,
 * 888274653411, 888251445478). Feltene under er derfor BYGGET OPP FRA
 * BESKRIVELSEN i bestillingen, ikke hentet: amerikansk telefonnummer,
 * engangsadresse eller tilfeldig yahoo-adresse, generert bedriftsnavn,
 * meningsløs melding på engelsk.
 *
 * DET ER VERDT Å MERKE SEG AT DE BLIR STOPPET UTEN E-POSTREGELEN. Verken
 * `smaqt.com` eller yahoo står på engangslista — kontrollert mot pakken,
 * 121 570 domener — så de to poengene der uteblir. Nummeret, meldingen og
 * navnet holder likevel.
 */
const FALSKE: { navn: string; inn: Innsending }[] = [
  {
    navn: "amerikansk nummer, engangsadresse, generert navn",
    inn: inn({
      telefon: "+1 646 555 0188",
      epost: "wbrekke@smaqt.com",
      bedrift: "Koss - Grady",
      melding:
        "We are reaching out regarding your services and would like more information.",
      land: "US",
    }),
  },
  {
    navn: "amerikansk nummer, yahoo-adresse, tre etternavn",
    inn: inn({
      telefon: "(201) 555-0123",
      epost: "qwfp2831@yahoo.com",
      bedrift: "Metz, Waelchi and Corkery",
      melding: "Please contact me about the opportunity we discussed earlier.",
      land: "US",
    }),
  },
  {
    navn: "uten land, men nummer, melding og navn slår ut",
    inn: inn({
      telefon: "+1 415 555 7788",
      epost: "tmp9183@smaqt.com",
      bedrift: "Hills - Johnston",
      melding: "I would like to know more about what your company can offer.",
    }),
  },
];

test("alle tre falske innsendingene blokkeres", () => {
  for (const f of FALSKE) {
    const r = spamScore(f.inn);
    assert.ok(
      r.score >= BLOKKERGRENSE,
      `${f.navn}: score ${r.score} (${r.treff.join(", ")})`,
    );
    assert.equal(r.utfall, "blokkert", f.navn);
  }
});

/** Uten e-postregelen holder de tre andre. Lista dekker ikke smaqt.com. */
test("de falske blokkeres også uten at adressen slår ut", () => {
  for (const f of FALSKE) {
    const r = spamScore({ ...f.inn, engangsadresse: false, manglerMx: null });
    assert.ok(r.score >= BLOKKERGRENSE, `${f.navn}: ${r.score}`);
  }
});

/* ──────────────────────── DE EKTE INNSENDINGENE ─────────────────────── */

/**
 * TO EKTE LEADS, HENTET FRA HUBSPOT 11.10.2026 — kontakt 886794200262
 * (Iver, Lokk as) og 882819192046 (Marisol, La. MEXICANA As) — og ett til
 * fra samme morgen, 888337466559 (Golnaz, Natulahland).
 */
test("ekte norske leads får null", () => {
  const ekte: [string, Innsending][] = [
    [
      "Iver, Lokk as",
      inn({
        telefon: "+47 411 72 729",
        epost: "iver@lokk.no",
        bedrift: "Lokk as",
        melding:
          "Some innhold. Mest mot custom hodeplagg men også mot produkter og Brands",
        land: "NO",
      }),
    ],
    [
      "Marisol, La. MEXICANA As",
      inn({
        telefon: "+4796684028",
        epost: "marisolsand.events@gmail.com",
        bedrift: "La. MEXICANA As",
        melding: "Photos",
        land: "NO",
      }),
    ],
    [
      "Golnaz, Natulahland",
      inn({
        telefon: "+4746566604",
        epost: "golnaz.tandorost@gmail.com",
        bedrift: "Natulahland",
        melding: "",
        land: "NO",
      }),
    ],
  ];

  for (const [navn, i] of ekte) {
    const r = spamScore(i);
    assert.equal(r.score, 0, `${navn}: ${r.treff.join(", ")}`);
    assert.equal(r.utfall, "ok", navn);
  }
});

/**
 * EN NORSK KUNDE PÅ REISE SKAL SLIPPE GJENNOM. Norsk nummer, norsk tekst,
 * spansk IP: ett treff, to poeng, flagget — ikke blokkert. Han får
 * varselet med ⚠-linja, og Pål ringer som vanlig.
 */
test("norsk kunde med utenlandsk IP flagges, men slippes gjennom", () => {
  const r = spamScore(
    inn({
      telefon: "+4791122334",
      epost: "post@nordvik.no",
      bedrift: "Nordvik AS",
      melding: "Vi trenger video til nettsiden og sosiale medier",
      land: "ES",
    }),
  );
  assert.equal(r.score, 2);
  assert.equal(r.utfall, "flagget");
  assert.deepEqual(r.treff, ["utenlandsk-ip"]);
});

/* ───────────────────────── GRENSETILFELLENE ─────────────────────────── */

test("honningkrukka blokkerer alene, som før", () => {
  const r = spamScore(inn({ botAktig: true }));
  assert.equal(r.score, 3);
  assert.equal(r.utfall, "blokkert");
  assert.deepEqual(r.treff, ["honningkrukke"]);
});

/**
 * ET DNS-OPPSLAG SOM IKKE SVARTE KOSTER INGENTING. `null` er «vi vet
 * ikke», og en feil hos oss skal aldri koste noen en henvendelse.
 */
test("ukjent MX gir null poeng", () => {
  assert.equal(spamScore(inn({ manglerMx: null })).score, 0);
  assert.equal(spamScore(inn({ manglerMx: false })).score, 0);
  assert.equal(spamScore(inn({ manglerMx: true })).score, 2);
});

/** Mangler landheaderen, skal ingen straffes for det. */
test("manglende land gir null poeng", () => {
  assert.equal(spamScore(inn({ land: "" })).score, 0);
  assert.equal(spamScore(inn({ land: "no" })).score, 0);
  assert.equal(spamScore(inn({ land: "SE" })).score, 0);
  assert.equal(spamScore(inn({ land: "DK" })).score, 0);
});

/** Tomt telefonfelt er ikke et utenlandsk nummer. */
test("tom telefon gir null poeng", () => {
  assert.equal(spamScore(inn({ telefon: "" })).score, 0);
  assert.equal(spamScore(inn({ telefon: "   " })).score, 0);
});

/**
 * TO MYKE TREFF ER IKKE NOK TIL Å BLOKKERE. En engelsk melding fra et
 * firma med bindestrek i navnet er mistenkelig, men ikke mer enn at Pål
 * skal få se den.
 */
test("to myke treff flagger, de blokkerer ikke", () => {
  const r = spamScore(
    inn({
      telefon: "+4791122334",
      bedrift: "Nordic - Design",
      melding: "We need help with social media content for our brand",
      land: "NO",
    }),
  );
  assert.equal(r.score, 2);
  assert.equal(r.utfall, "flagget");
});

/* ─────────── OPPSLAGENE (bestilt 11.10.2026) ────────────────────────── */

/**
 * ENGANGSLISTA MÅ FAKTISK LASTES. Da den ble importert via pakkenavnet,
 * kastet importen i Node og `erEngangsadresse` svarte nei på alt — regelen
 * var død uten at noe sa fra. Denne testen fanger det.
 *
 * `mailinator.com` er den mest kjente engangsadressen og står på lista.
 * `lokk.no` er en ekte kundes domene og skal ikke stå der.
 */
test("engangslista er lastet: kjent engangsdomene treffer", async () => {
  assert.equal(await erEngangsadresse("mailinator.com"), true);
  assert.equal(await erEngangsadresse("lokk.no"), false);
  assert.equal(await erEngangsadresse(""), false);
});

/**
 * MX-OPPSLAGET SKAL IKKE SVARE «MANGLER» NÅR DNS ER UTE AV DRIFT. I
 * sandkassen her svarer resolveren ENODATA på alt, også på gmail.com.
 * Uten kontrollspørsmålet ville hvert lead fått to poeng det ikke har
 * gjort seg fortjent til. `null` er det riktige svaret når vi ikke vet.
 */
test("manglerMx svarer aldri «mangler» uten en fungerende resolver", async () => {
  const kontroll = await manglerMx("gmail.com");
  if (kontroll === null) {
    /* Ingen DNS her. Da skal ingenting svare `true`. */
    assert.equal(await manglerMx("nordvik.no"), null);
  } else {
    /* DNS virker: gmail.com har MX, og et oppdiktet domene har ikke. */
    assert.equal(kontroll, false);
    assert.equal(await manglerMx("dette-domenet-finnes-ikke-reflektor.no"), true);
  }
  assert.equal(await manglerMx(""), null);
});
