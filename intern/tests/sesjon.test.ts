import assert from "node:assert/strict";
import test from "node:test";

process.env.SESJON_HEMMELIGHET =
  "test-hemmelighet-som-er-minst-trettito-tegn-lang";

const { cookieValg, harSesjonshemmelighet, lesSesjon, signerSesjon } =
  await import("../src/lib/sesjon.ts");

const BRUKER = {
  epost: "magne@reflektor.no",
  navn: "Test Testesen",
  bilde: "",
};

/**
 * Sesjonscookien er den eneste tingen som skiller en ansatt fra alle andre.
 * Testene her dekker de fire måtene den kan svikte på, og alle fire er
 * usynlige i grensesnittet: en forfalsket signatur som godtas, en utløpt
 * sesjon som lever videre, et felt som kan flyttes uten at signaturen ryker,
 * og søppel som gir et kast i stedet for en avvisning.
 */
test("en signert sesjon kan leses tilbake", async () => {
  const token = await signerSesjon(BRUKER);
  assert.deepEqual(await lesSesjon(token), BRUKER);
});

test("en endret nyttelast avvises", async () => {
  const token = await signerSesjon(BRUKER);
  const [, signatur] = token.split(".");

  // Bytt e-posten, behold signaturen. Dette er hele angrepet: uten HMAC er
  // cookien bare et JSON-objekt brukeren selv kan skrive.
  const forfalsket = Buffer.from(
    JSON.stringify({
      ...BRUKER,
      epost: "angriper@annetdomene.no",
      utloper: Math.floor(Date.now() / 1000) + 600,
    }),
  )
    .toString("base64url")
    .replace(/=+$/, "");

  assert.equal(await lesSesjon(`${forfalsket}.${signatur}`), null);
});

test("en endret signatur avvises", async () => {
  const token = await signerSesjon(BRUKER);
  const [kropp] = token.split(".");
  assert.equal(await lesSesjon(`${kropp}.AAAAAAAAAAAAAAAAAAAAAAAAAAAA`), null);
});

test("en utløpt sesjon avvises", async () => {
  // Signert med riktig nøkkel, men med `utloper` i fortiden. Signaturen er
  // gyldig — det er tiden som ikke er det.
  const kropp = Buffer.from(
    JSON.stringify({ ...BRUKER, utloper: Math.floor(Date.now() / 1000) - 5 }),
  )
    .toString("base64url")
    .replace(/=+$/, "");
  const nokkel = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.SESJON_HEMMELIGHET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = Buffer.from(
    await crypto.subtle.sign("HMAC", nokkel, new TextEncoder().encode(kropp)),
  )
    .toString("base64url")
    .replace(/=+$/, "");

  assert.equal(await lesSesjon(`${kropp}.${sig}`), null);
});

test("søppel gir null, ikke et kast", async () => {
  for (const verdi of [undefined, "", "tull", "a.b", "....", "eyJ.eyJ.eyJ"]) {
    assert.equal(await lesSesjon(verdi), null, `feilet for ${verdi}`);
  }
});

test("cookien er httpOnly og lax, og secure kun på https", () => {
  // `lax` og ikke `strict`: returen fra Google er en toppnivånavigasjon fra
  // et annet opphav, og `strict` ville holdt cookien tilbake akkurat der.
  assert.equal(cookieValg(true).httpOnly, true);
  assert.equal(cookieValg(true).sameSite, "lax");
  assert.equal(cookieValg(true).secure, true);
  assert.equal(cookieValg(false).secure, false);
});

test("hemmeligheten må være minst 32 tegn", () => {
  assert.equal(harSesjonshemmelighet(), true);
  const forrige = process.env.SESJON_HEMMELIGHET;
  process.env.SESJON_HEMMELIGHET = "for-kort";
  assert.equal(harSesjonshemmelighet(), false);
  delete process.env.SESJON_HEMMELIGHET;
  assert.equal(harSesjonshemmelighet(), false);
  process.env.SESJON_HEMMELIGHET = forrige;
});
