import assert from "node:assert/strict";
import test from "node:test";

import {
  type Verktoykontekst,
  VERKTOY,
  kjorVerktoy,
} from "../src/lib/samtaleverktoy.ts";

/**
 * Verktøyene Claude kan kjøre i en rapportsamtale.
 *
 * De endrer ekte tilstand: avkryssingene styrer purringen på forfalte
 * steg, og beslutningssvaret er Påls svar til seg selv. Et verktøy som
 * treffer feil steg eller registrerer et svar han ikke ga, er verre enn
 * et verktøy som ikke finnes.
 */

function kontekst(over: Partial<Verktoykontekst> = {}): {
  k: Verktoykontekst;
  logg: string[];
} {
  const logg: string[] = [];
  const k: Verktoykontekst = {
    type: "betalt-markedsforing",
    id: "2026-W40",
    steg: [
      { title: "Følg opp de fem Meta-leadsene." },
      { title: "La kampanjen gå uendret ut uke 41." },
      { title: "Rydd dobbeltkontakter i HubSpot." },
    ],
    sporsmal: "Skal vi øke budsjettet?",
    settSteg: async (i, gjort) => {
      logg.push(`settSteg(${i}, ${gjort})`);
      return true;
    },
    svarPaaBeslutning: async (svar, kommentar) => {
      logg.push(`svar(${svar}, «${kommentar}»)`);
      return true;
    },
    skrivNotat: async (tekst) => {
      logg.push(`notat(«${tekst}»)`);
      return true;
    },
    tidligereUker: async (antall) => {
      logg.push(`uker(${antall})`);
      return "# Uke 39\n…";
    },
    ...over,
  };
  return { k, logg };
}

test("verktøyene er strenge og har lukkede skjemaer", () => {
  for (const v of VERKTOY) {
    assert.equal(v.strict, true, `${v.name} må være strict`);
    const s = v.input_schema as Record<string, unknown>;
    assert.equal(
      s.additionalProperties,
      false,
      `${v.name} må avvise ukjente felt`,
    );
    assert.ok(Array.isArray(s.required), `${v.name} mangler required`);
  }
});

/**
 * HubSpot har ingen kobling i intranettet. Et verktøy som het noe med
 * hubspot, ville fått modellen til å bekrefte en merking som aldri skjedde.
 */
test("det finnes ikke noe verktøy som later som det når HubSpot", () => {
  const navn = VERKTOY.map((v) => v.name).join(" ");
  for (const ord of ["hubspot", "meta", "google", "ads"]) {
    assert.equal(
      navn.toLowerCase().includes(ord),
      false,
      `«${ord}» i et verktøynavn lover tilgang vi ikke har`,
    );
  }
});

test("avkryssing treffer steget den fikk", async () => {
  const { k, logg } = kontekst();
  const r = await kjorVerktoy("kryss_av_steg", { indeks: 1, gjort: true }, k);
  assert.equal(r.feil, undefined);
  assert.deepEqual(logg, ["settSteg(1, true)"]);
  assert.match(r.gjort ?? "", /La kampanjen gå uendret/);
});

/**
 * Den viktigste grensen. Modellen teller fra 1 på skjermen og fra 0 i
 * data; bommer den, skal den få vite hvilke steg som finnes — ikke krysse
 * av et tilfeldig et.
 */
test("et steg utenfor rapporten krysses ikke av, og feilen navngir stegene", async () => {
  const { k, logg } = kontekst();
  for (const indeks of [3, -1, 99]) {
    const r = await kjorVerktoy("kryss_av_steg", { indeks, gjort: true }, k);
    assert.equal(r.feil, true, `indeks ${indeks} skulle vært avvist`);
    assert.match(r.tekst, /0: Følg opp/, "feilen må liste stegene");
  }
  assert.deepEqual(logg, [], "ingenting skal ha blitt skrevet");
});

test("en indeks som ikke er et heltall avvises", async () => {
  const { k, logg } = kontekst();
  for (const indeks of [1.5, "1", null, undefined]) {
    const r = await kjorVerktoy("kryss_av_steg", { indeks, gjort: true }, k);
    assert.equal(r.feil, true, `${String(indeks)} skulle vært avvist`);
  }
  assert.deepEqual(logg, []);
});

test("beslutningen registreres bare med et gyldig svar", async () => {
  const { k, logg } = kontekst();
  const ok = await kjorVerktoy(
    "svar_paa_beslutning",
    { svar: "ja", kommentar: "Vi prøver." },
    k,
  );
  assert.equal(ok.feil, undefined);
  assert.deepEqual(logg, ["svar(ja, «Vi prøver.»)"]);

  for (const svar of ["kanskje", "", "JA", 1]) {
    const r = await kjorVerktoy("svar_paa_beslutning", { svar }, k);
    assert.equal(r.feil, true, `«${String(svar)}» skulle vært avvist`);
  }
  assert.equal(logg.length, 1, "bare det gyldige svaret skal ha gått inn");
});

test("en uke uten beslutning kan ikke få et svar", async () => {
  const { k, logg } = kontekst({ sporsmal: null });
  const r = await kjorVerktoy(
    "svar_paa_beslutning",
    { svar: "ja", kommentar: "" },
    k,
  );
  assert.equal(r.feil, true);
  assert.deepEqual(logg, []);
});

test("et tomt notat lagres ikke", async () => {
  const { k, logg } = kontekst();
  for (const tekst of ["", "   ", null, 7]) {
    const r = await kjorVerktoy("skriv_notat", { tekst }, k);
    assert.equal(r.feil, true);
  }
  assert.deepEqual(logg, []);
});

/** Hver uke er et eget Blob-kall. Uten tak kan modellen be om tusen. */
test("antall uker klemmes til 1–8", async () => {
  for (const [bedt, ventet] of [
    [99, 8],
    [0, 1],
    [-5, 1],
    [4, 4],
  ] as const) {
    const { k, logg } = kontekst();
    await kjorVerktoy("hent_tidligere_uker", { antall: bedt }, k);
    assert.deepEqual(logg, [`uker(${ventet})`]);
  }
});

test("et ukjent verktøynavn gir feil, ikke et kast", async () => {
  const { k } = kontekst();
  const r = await kjorVerktoy("slett_alt", {}, k);
  assert.equal(r.feil, true);
  assert.match(r.tekst, /Ukjent verktøy/);
});

/**
 * En strøm som dør midt i et svar, etterlater halv tekst og ingen beskjed.
 * Alt som går galt skal komme tilbake som et resultat modellen kan lese.
 */
test("et verktøy som kaster, river ikke ned samtalen", async () => {
  const { k } = kontekst({
    settSteg: async () => {
      throw new Error("Blob nede");
    },
  });
  const r = await kjorVerktoy("kryss_av_steg", { indeks: 0, gjort: true }, k);
  assert.equal(r.feil, true);
  assert.match(r.tekst, /Blob nede/);
});

test("lagring som ikke fant rapporten, meldes fra om", async () => {
  const { k } = kontekst({ settSteg: async () => false });
  const r = await kjorVerktoy("kryss_av_steg", { indeks: 0, gjort: true }, k);
  assert.equal(r.feil, true);
  assert.match(r.tekst, /ikke funnet/i);
});
