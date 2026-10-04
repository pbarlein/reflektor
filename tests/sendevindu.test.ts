import assert from "node:assert/strict";
import test from "node:test";

import { varsel, type Lead } from "@/lib/lead.ts";
import { skalHaEpost1, type Kandidat } from "@/lib/leadepost.ts";
import { paaminnelseTekst } from "@/lib/paaminnelse.ts";
import {
  innenforVinduet,
  planlagtSending,
  venterPaaVinduet,
} from "@/lib/sendevindu.ts";

/**
 * Sendevinduet for e-post 1: 07:00–21:00 i Oslo.
 *
 * E-POSTEN SER UT SOM EN PÅL SKREV SELV, og da kan den ikke komme kl.
 * 03:12. Kommer leadet om natten, ligger det i kø til kl. 08:00.
 *
 * TIDSPUNKTENE I TESTENE ER SKREVET MED NORSK OFFSET (+02:00 om sommeren,
 * +01:00 om vinteren), fordi det er veggklokka i Oslo regelen handler om.
 * En test skrevet i UTC ville bestått i juli og feilet i november.
 */

/** 5. oktober 2026 er en mandag. Sommertid, +02:00. */
const oslo = (klokke: string) => new Date(`2026-10-05T${klokke}+02:00`);

test("vinduet åpner 07:00 og lukker 21:00", () => {
  assert.equal(innenforVinduet(oslo("06:59:59")), false);
  assert.equal(innenforVinduet(oslo("07:00:00")), true);
  assert.equal(innenforVinduet(oslo("20:59:59")), true);
  assert.equal(innenforVinduet(oslo("21:00:00")), false);
  assert.equal(innenforVinduet(oslo("03:12:00")), false);
  assert.equal(venterPaaVinduet(oslo("03:12:00")), true);
});

test("innenfor vinduet sendes e-posten nå", () => {
  const na = oslo("09:30:00");
  assert.equal(planlagtSending(na).getTime(), na.getTime());
  assert.equal(planlagtSending(oslo("20:59:00")).getTime(), oslo("20:59:00").getTime());
});

/**
 * DE FEM TILFELLENE PÅL BA OM. Merk at køtimen er 08:00, ikke 07:00: et
 * lead som kom kl. 02 skal ikke ligge først i innboksen når kunden slår på
 * telefonen, men komme inn i en vanlig arbeidsmorgen.
 */
test("utenfor vinduet holdes e-posten til neste morgen kl. 08:00", () => {
  /* Kl. 06:59 → samme dag kl. 08:00. */
  assert.equal(planlagtSending(oslo("06:59:00")).toISOString(), oslo("08:00:00").toISOString());
  /* Kl. 21:00 → neste dag kl. 08:00. */
  assert.equal(
    planlagtSending(oslo("21:00:00")).toISOString(),
    new Date("2026-10-06T08:00:00+02:00").toISOString(),
  );
  /* Kl. 23:30 → neste dag kl. 08:00. */
  assert.equal(
    planlagtSending(oslo("23:30:00")).toISOString(),
    new Date("2026-10-06T08:00:00+02:00").toISOString(),
  );
  /* Kl. 02:00 → SAMME dag kl. 08:00, ikke neste. */
  assert.equal(planlagtSending(oslo("02:00:00")).toISOString(), oslo("08:00:00").toISOString());
});

/**
 * HELG TELLER SOM VANLIG DAG. Her skiller sendevinduet seg fra
 * påminnelsen, som venter til nærmeste hverdag: presentasjonen er svaret på
 * en henvendelse personen nettopp har sendt, og den tåler ikke å ligge til
 * mandag.
 */
test("lead lørdag kl. 23 sendes søndag kl. 08", () => {
  /* 10. oktober 2026 er en lørdag. */
  const lordag = new Date("2026-10-10T23:00:00+02:00");
  assert.equal(
    planlagtSending(lordag).toISOString(),
    new Date("2026-10-11T08:00:00+02:00").toISOString(),
  );
});

/** Månedsskifte skal ikke gi 32. oktober. */
test("siste kveld i måneden gir første morgen i neste", () => {
  assert.equal(
    planlagtSending(new Date("2026-10-31T23:00:00+02:00")).toISOString(),
    new Date("2026-11-01T08:00:00+01:00").toISOString(),
  );
});

/**
 * NATTEN KLOKKA STILLES. 25.10.2026 stilles klokka tilbake én time. Et lead
 * natt til den dagen skal fortsatt få e-posten kl. 08:00 norsk tid — altså
 * 07:00 UTC, ikke 06:00.
 */
test("sommertidsovergangen gir fortsatt kl. 08:00 norsk tid", () => {
  const natt = new Date("2026-10-25T02:30:00+01:00");
  const planlagt = planlagtSending(natt);
  assert.equal(
    new Intl.DateTimeFormat("nb-NO", {
      timeZone: "Europe/Oslo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(planlagt),
    "08:00",
  );
});

/* ───────────────────────── REGELEN FOR E-POST 1 ─────────────────────── */

const kandidat = (endringer: Partial<Kandidat> = {}): Kandidat => ({
  epost: "henrik@example.no",
  lifecycle: "lead",
  hendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  konvertert: "2026-10-05T04:00:00Z",
  booketAnnetSted: false,
  epost1Sendt: "",
  epost2Sendt: "",
  avbrutt: "",
  moteBooket: "",
  dealstadier: [],
  harSvart: false,
  ...endringer,
});

test("e-post 1 sendes ikke om natten, men om morgenen", () => {
  assert.equal(skalHaEpost1(kandidat(), oslo("03:12:00")), false);
  assert.equal(skalHaEpost1(kandidat(), oslo("06:59:00")), false);
  assert.equal(skalHaEpost1(kandidat(), oslo("08:00:00")), true);
  assert.equal(skalHaEpost1(kandidat(), oslo("20:59:00")), true);
  assert.equal(skalHaEpost1(kandidat(), oslo("21:30:00")), false);
});

/* ────────────────────────── LINJEN I VARSELET ───────────────────────── */

const lead = (): Lead => ({
  navn: "Henrik Dale",
  epost: "henrik@example.no",
  bedrift: "Nordvik",
  telefon: "+4791122334",
  melding: "Vi trenger film",
  side: "/kontaktoss",
  nettside: "",
  nettsideUtledet: false,
  kilde: "google",
});

/**
 * VARSELET GÅR MED EN GANG, UANSETT KLOKKESLETT — men det skal ikke si at
 * noe er sendt når det ikke er sendt. Pål leser linjen for å vite hvor lang
 * tid han har på å ringe først.
 */
test("om natten sier varselet når presentasjonen går, ikke at den er sendt", () => {
  const { tekst, html } = varsel(lead(), oslo("23:30:00"));
  assert.ok(
    tekst.includes("Presentasjon og møtelink sendes tirsdag 6. oktober kl. 08:00."),
    tekst,
  );
  assert.ok(!tekst.includes("møtelink sendt"));
  assert.ok(html.includes("Presentasjon og møtelink sendes tirsdag 6. oktober kl. 08:00."));
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));
});

/**
 * PÅMINNELSEN REGNES FRA DEN FAKTISKE SENDETIDEN. Et lead lørdag kl. 23 får
 * e-posten søndag kl. 08, og påminnelsen mandag — ikke søndag.
 */
test("påminnelsen regnes fra sendetiden, ikke fra innsendingen", () => {
  const lordag = new Date("2026-10-10T23:00:00+02:00");
  const sondagMorgen = planlagtSending(lordag);
  const { tekst } = varsel(lead(), lordag);

  assert.ok(tekst.includes(`Påminnelse sendes ${paaminnelseTekst(sondagMorgen)}`), tekst);
  /* Søndag kl. 08 → påminnelse mandag kl. 09:00. */
  assert.ok(tekst.includes("Påminnelse sendes mandag 12. oktober kl. 09:00."), tekst);
  /* Regnet fra lørdag kveld ville svaret vært mandag også, men av en annen
     grunn — derfor sjekkes et tilfelle der de to faktisk skiller seg. */
});

/**
 * ET TILFELLE DER DE TO SVARENE SKILLER SEG. Et lead søndag kl. 23 sendes
 * mandag kl. 08, og påminnelsen går TIRSDAG. Regnet fra søndag ville den
 * gått mandag — altså før e-posten den minner om.
 */
test("søndag kveld gir påminnelse tirsdag, ikke mandag", () => {
  const { tekst } = varsel(lead(), new Date("2026-10-11T23:00:00+02:00"));
  assert.ok(tekst.includes("Presentasjon og møtelink sendes mandag 12. oktober kl. 08:00."), tekst);
  assert.ok(tekst.includes("Påminnelse sendes tirsdag 13. oktober kl. 09:00."), tekst);
});

test("innenfor vinduet er linjen som før", () => {
  const { tekst } = varsel(lead(), new Date("2026-10-09T08:00:00+02:00"));
  assert.ok(
    tekst.includes(
      "Generisk Canva-presentasjon og møtelink sendt. Påminnelse sendes mandag 12. oktober kl. 09:00.",
    ),
    tekst,
  );
});
