import assert from "node:assert/strict";
import test from "node:test";

import { kodeUtfordring, lesIdToken, type Oppsett } from "../src/lib/google.ts";

const OPPSETT: Oppsett = {
  klientId: "vaar-klient.apps.googleusercontent.com",
  klientHemmelighet: "hemmelig",
  tillattDomene: "reflektor.no",
};

/** Lager et id_token med oppgitte krav. Signaturen er bare fyll — den
 *  verifiseres ikke, og grunnen til det står i google.ts. */
function token(krav: Record<string, unknown>): string {
  const del = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString("base64url").replace(/=+$/, "");
  return `${del({ alg: "RS256" })}.${del(krav)}.signatur`;
}

const GYLDIG = {
  iss: "https://accounts.google.com",
  aud: OPPSETT.klientId,
  exp: Math.floor(Date.now() / 1000) + 600,
  email: "magne@reflektor.no",
  email_verified: true,
  hd: "reflektor.no",
  name: "Test Testesen",
  picture: "https://example.invalid/bilde.jpg",
};

/**
 * DETTE ER DØRA. Alt som slipper gjennom `lesIdToken` blir en gyldig
 * sesjon, og hvert krav under er der for å stoppe noe bestemt. Testene
 * navngir hva.
 */
test("et gyldig Workspace-token slipper gjennom", () => {
  const krav = lesIdToken(token(GYLDIG), OPPSETT);
  assert.equal(krav?.epost, "magne@reflektor.no");
  assert.equal(krav?.navn, "Test Testesen");
});

test("begge Googles utstederformer godtas", () => {
  assert.ok(
    lesIdToken(token({ ...GYLDIG, iss: "accounts.google.com" }), OPPSETT),
  );
});

test("feil utsteder avvises", () => {
  assert.equal(
    lesIdToken(token({ ...GYLDIG, iss: "https://angriper.no" }), OPPSETT),
    null,
  );
});

test("token utstedt til en ANNEN app avvises", () => {
  // Uten aud-sjekken kan et token fra en hvilken som helst annen
  // Google-app brukes her. Det er den klassiske «confused deputy».
  assert.equal(
    lesIdToken(
      token({ ...GYLDIG, aud: "annen-app.apps.googleusercontent.com" }),
      OPPSETT,
    ),
    null,
  );
});

test("utløpt token avvises", () => {
  assert.equal(
    lesIdToken(
      token({ ...GYLDIG, exp: Math.floor(Date.now() / 1000) - 10 }),
      OPPSETT,
    ),
    null,
  );
});

test("ubekreftet e-post avvises", () => {
  assert.equal(
    lesIdToken(token({ ...GYLDIG, email_verified: false }), OPPSETT),
    null,
  );
  assert.equal(
    lesIdToken(token({ ...GYLDIG, email_verified: "true" }), OPPSETT),
    null,
  );
});

test("privat Gmail-konto uten hd avvises, selv med riktig e-postdomene", () => {
  // `hd` settes KUN på Workspace-kontoer. En ren strengsjekk på e-posten
  // ville ikke sett forskjell.
  const utenHd: Record<string, unknown> = { ...GYLDIG };
  delete utenHd.hd;
  assert.equal(lesIdToken(token(utenHd), OPPSETT), null);
});

test("riktig hd men e-post på et annet domene avvises", () => {
  assert.equal(
    lesIdToken(token({ ...GYLDIG, email: "noen@annetdomene.no" }), OPPSETT),
    null,
  );
});

test("et annet Workspace-domene avvises", () => {
  assert.equal(
    lesIdToken(
      token({ ...GYLDIG, hd: "annetbyra.no", email: "noen@annetbyra.no" }),
      OPPSETT,
    ),
    null,
  );
});

test("misformet token gir null, ikke et kast", () => {
  for (const t of ["", "a", "a.b", "a.b.c", "...", "x.!!!.y"]) {
    assert.equal(lesIdToken(t, OPPSETT), null, `feilet for «${t}»`);
  }
});

test("PKCE-utfordringen er base64url-SHA256 av verifiseren", async () => {
  // Kjent vektor fra RFC 7636, vedlegg B.
  assert.equal(
    await kodeUtfordring("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"),
    "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  );
});
