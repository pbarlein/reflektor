import assert from "node:assert/strict";
import test from "node:test";

import {
  avbrytBeskjed,
  faarPaaminnelse,
  paaminnelseTekst,
  paaminnelseTidspunkt,
} from "@/lib/paaminnelse.ts";

/**
 * Tidspunktet for HubSpot-påminnelsen.
 *
 * ALLE TESTENE ER SKREVET I NORSK VEGGKLOKKE, fordi det er den regelen er
 * formulert i. Hjelperen under lager tidspunktet fra en ISO-streng med
 * eksplisitt forskyvning, så testen ikke avhenger av hvilken sone den kjøres
 * i — Vercel kjører i UTC, maskinen min også, og en test som bare virker der
 * ville ikke fanget feilen den er skrevet for.
 */
const oslo = (iso: string) => new Date(iso);

test("mandag 10:00 gir tirsdag 09:00", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-05T10:00:00+02:00")),
    "tirsdag 6. oktober kl. 09:00",
  );
});

test("torsdag 23:59 gir fredag 09:00", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-08T23:59:00+02:00")),
    "fredag 9. oktober kl. 09:00",
  );
});

test("fredag 08:00 gir mandag 09:00", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-09T08:00:00+02:00")),
    "mandag 12. oktober kl. 09:00",
  );
});

test("lørdag gir mandag 09:00", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-10T14:30:00+02:00")),
    "mandag 12. oktober kl. 09:00",
  );
});

test("søndag 23:00 gir mandag 09:00", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-11T23:00:00+02:00")),
    "mandag 12. oktober kl. 09:00",
  );
});

/**
 * SOMMERTID TIL VINTERTID. Natt til søndag 25.10.2026 stilles klokka
 * tilbake. Et lead sendt lørdag 24. skal få mandag 26. kl. 09:00 norsk tid —
 * og det tidspunktet er 08:00 UTC, ikke 07:00 som uken før. En
 * implementasjon som regner i timer fra innsending bommer her.
 */
test("overgang til vintertid: lørdag 24.10 gir mandag 26.10 kl. 09:00", () => {
  const t = paaminnelseTidspunkt(oslo("2026-10-24T12:00:00+02:00"));
  assert.equal(paaminnelseTekst(oslo("2026-10-24T12:00:00+02:00")), "mandag 26. oktober kl. 09:00");
  assert.equal(t.toISOString(), "2026-10-26T08:00:00.000Z");
});

test("samme helg uken før er 07:00 UTC — altså sommertid", () => {
  const t = paaminnelseTidspunkt(oslo("2026-10-17T12:00:00+02:00"));
  assert.equal(t.toISOString(), "2026-10-19T07:00:00.000Z");
});

/**
 * MIDNATT I OSLO ER FORRIGE DØGN I UTC. Et lead som kommer inn fredag 23:30
 * norsk tid er fredag 21:30 i UTC. Regner man på UTC-dagen, blir svaret
 * lørdag — og påminnelsen havner en dag for tidlig.
 */
test("fredag 23:30 norsk tid er fortsatt fredag", () => {
  assert.equal(
    paaminnelseTekst(new Date("2026-10-09T21:30:00Z")),
    "mandag 12. oktober kl. 09:00",
  );
});

test("månedsskifte", () => {
  assert.equal(
    paaminnelseTekst(oslo("2026-10-31T09:00:00+01:00")),
    "mandag 2. november kl. 09:00",
  );
});

test("interne adresser får ingen påminnelse", () => {
  assert.equal(faarPaaminnelse("pal@reflektor.no"), false);
  assert.equal(faarPaaminnelse("  PAL+TEST@Reflektor.no "), false);
  assert.equal(faarPaaminnelse("marisol@example.no"), true);
  assert.equal(faarPaaminnelse("noen@ikkereflektor.no"), true);
});

/**
 * INGEN ADRESSE, INGEN PÅMINNELSE.
 *
 * 06.10.2026 kom en POST til /api/skjema der alt unntatt det skjulte
 * «side»-feltet var tomt. Varselet til Pål sto med «–» i hver linje, og
 * lovet likevel at presentasjonen var sendt og at påminnelsen kom. Det
 * finnes ingen mottaker å sende noe til.
 */
test("tom eller ugyldig adresse får ingen påminnelse", () => {
  assert.equal(faarPaaminnelse(""), false);
  assert.equal(faarPaaminnelse("   "), false);
  assert.equal(faarPaaminnelse("ikke-en-adresse"), false);
  assert.equal(faarPaaminnelse("mangler@domene"), false);
  /* Og en helt vanlig adresse slipper fortsatt gjennom. */
  assert.equal(faarPaaminnelse("kristine@haugland.no"), true);
});

/* ────────── UTFALLET AV «AVBRYT PÅMINNELSE» (06.10.2026) ────────────── */

/**
 * Oversikten på /paaminnelse leste ikke status-en ruta sendte tilbake.
 *
 * Gikk avbrytingen bra, forsvant raden fra listen — det er en slags
 * beskjed. Gikk den GALT, sto raden igjen uten ett ord om hvorfor, og da
 * måtte Pål tro at påminnelsen var avbrutt. Den går så til et lead han
 * nettopp har snakket med.
 *
 * TEKSTEN ER NÅ ÉN, DELT AV BEGGE SIDENE. De hadde hver sin formulering av
 * de samme fire utfallene.
 */
test("ingen status, ingen beskjed", () => {
  assert.equal(avbrytBeskjed(undefined), null);
  assert.equal(avbrytBeskjed(""), null);
});

test("en vellykket avbryting sier fra, og er ikke en feil", () => {
  assert.deepEqual(avbrytBeskjed("ok"), {
    tekst: "Påminnelsen er avbrutt.",
    feil: false,
  });
});

test("hvert utfall som ikke gikk bra er merket som feil", () => {
  for (const status of ["ikke-funnet", "ikke-satt-opp", "feil", "ugyldig"]) {
    const b = avbrytBeskjed(status);
    assert.ok(b, status);
    assert.equal(b.feil, true, status);
    assert.ok(b.tekst.length > 10, status);
  }
});

/**
 * DEN UKJENTE FEILEN MÅ SI AT INGENTING SKJEDDE. Her sto «Prøv igjen», som
 * ikke sier om påminnelsen gikk eller ikke.
 */
test("en ukjent feil sier rett ut at påminnelsen ikke er avbrutt", () => {
  assert.match(avbrytBeskjed("feil")!.tekst, /IKKE avbrutt/);
});
