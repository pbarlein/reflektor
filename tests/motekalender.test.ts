import assert from "node:assert/strict";
import test from "node:test";

import { erBooket } from "@/lib/motemelding.ts";

/**
 * Lytteren på booking, lagt til 04.10.2026.
 *
 * HubSpot sender `{ meetingBookSucceeded: true }` fra iframen når et møte
 * er bekreftet, og det er alt som finnes å lytte på — hverken møtelenke
 * eller tidspunkt følger med.
 *
 * DET FARLIGE ER AVSENDEREN. `window.addEventListener("message", …)` tar
 * imot fra enhver ramme på siden og fra ethvert vindu som har en referanse
 * til vårt. Uten en opphavssjekk kunne hvem som helst utløst en
 * konverteringshendelse i GA4 ved å poste ett objekt.
 */

test("ekte melding fra HubSpot godtas", () => {
  assert.equal(
    erBooket("https://meetings-eu1.hubspot.com", {
      meetingBookSucceeded: true,
    }),
    true,
  );
  assert.equal(
    erBooket("https://meetings.hubspot.com", { meetingBookSucceeded: true }),
    true,
  );
});

test("feil avsender gir ingen hendelse", () => {
  for (const opphav of [
    "https://hubspot.com.angriper.no",
    "https://nothubspot.com",
    "https://evil.example",
    "null",
    "",
    "ikke en url",
  ]) {
    assert.equal(
      erBooket(opphav, { meetingBookSucceeded: true }),
      false,
      `«${opphav}» skulle vært avvist`,
    );
  }
});

test("riktig avsender, men ingen booking", () => {
  const opphav = "https://meetings-eu1.hubspot.com";
  for (const data of [
    { meetingBookSucceeded: false },
    { meetingBookSucceeded: "true" },
    { noeAnnet: true },
    {},
    null,
    undefined,
    "meetingBookSucceeded",
    42,
  ]) {
    assert.equal(erBooket(opphav, data), false, JSON.stringify(data));
  }
});
