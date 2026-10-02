import assert from "node:assert/strict";
import test from "node:test";

import { tilbud } from "../src/content/site.ts";

/**
 * `inngar` og `inngarKort` er to utgaver av den samme leveransen: den lange
 * ligger i JSON-LD-en på forsiden, den korte står på siden. Går de fra
 * hverandre, lover markeringen noe annet enn teksten — og det er nøyaktig
 * den feilen ingen oppdager, fordi den bare er synlig for maskiner.
 *
 * Testen er derfor ikke pedanteri. Den er det eneste som binder de to
 * listene sammen.
 */

test("inngarKort har like mange punkter som inngar", () => {
  assert.equal(tilbud.inngarKort.length, tilbud.inngar.length);
});

test("ingen av de korte punktene er tomme eller lengre enn de lange", () => {
  tilbud.inngarKort.forEach((kort, i) => {
    assert.ok(kort.trim().length > 0, `punkt ${i} er tomt`);
    assert.ok(
      kort.length <= tilbud.inngar[i].length,
      `punkt ${i} er ikke kortere enn originalen`,
    );
  });
});

/**
 * «Produksjonsmål» er Påls eget forbehold på videotallet, og AGENTS.md sier
 * at det ikke skal mykes opp eller fjernes. Den korte utgaven er stedet det
 * er lettest å miste det, siden hele poenget der er å stryke ord.
 */
test("forbeholdet om produksjonsmål står i begge utgavene", () => {
  assert.ok(tilbud.inngar.some((p) => p.includes("Produksjonsmål")));
  assert.ok(tilbud.inngarKort.some((p) => p.includes("Produksjonsmål")));
  assert.ok(tilbud.stillbilder.includes("produksjonsmål og ikke en garanti"));
});
