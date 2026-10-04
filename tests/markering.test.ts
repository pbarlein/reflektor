import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { artikkelSlugs } from "@/content/artikler.ts";
import { tjenestesider } from "@/content/tjenester.ts";

/**
 * Canonical, brødsmuler og FAQ-schema.
 *
 * TESTENE LESER KILDEN, ikke den bygde siden. Det er en avveining: en test
 * mot bygget HTML ville vært sterkere, men ville krevd et helt bygg for å
 * kjøre. Her er spørsmålet «finnes feltet i det hele tatt», og det svarer
 * kilden på — en side som mangler canonical, mangler ordet «canonical».
 *
 * BESTILLINGEN SA AT BLOGGEN MANGLET BEGGE. Den gjorde ikke det: canonical
 * sto i `generateMetadata` i /blogg/[slug] og brødsmulene i
 * BrodsmuleSchema, begge siden tidligere. Testene her er derfor en vakt mot
 * at de forsvinner, ikke en ny funksjon.
 */

const APP = "src/app";

/** Alle page.tsx under src/app, med ruten de svarer på. */
function sider(katalog = APP, prefiks = ""): { rute: string; fil: string }[] {
  const ut: { rute: string; fil: string }[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) {
      if (navn === "api") continue;
      ut.push(...sider(sti, `${prefiks}/${navn}`));
    } else if (navn === "page.tsx") {
      ut.push({ rute: prefiks || "/", fil: sti });
    }
  }
  return ut;
}

/** Sider som med vilje står utenfor sitemapet og derfor ikke trenger canonical. */
const UTENFOR = new Set(["/takk", "/paaminnelse", "/paaminnelse/avbryt"]);

test("alle indekserbare sider setter canonical", () => {
  const mangler = sider()
    .filter((s) => !UTENFOR.has(s.rute))
    .filter((s) => !readFileSync(s.fil, "utf8").includes("canonical"));
  assert.deepEqual(
    mangler.map((s) => s.rute),
    [],
    "disse sidene mangler canonical",
  );
});

test("bloggposten setter canonical på sin egen URL", () => {
  const kilde = readFileSync(`${APP}/blogg/[slug]/page.tsx`, "utf8");
  assert.ok(kilde.includes("canonical: `${basisUrl()}/blogg/${a.slug}`"), kilde.slice(0, 0));
  assert.ok(artikkelSlugs.length > 0);
});

test("brødsmuler markeres på tjenestesider, blogg og caser", () => {
  for (const fil of [
    "src/components/tjeneste/Tjenestelayout.tsx",
    `${APP}/blogg/[slug]/page.tsx`,
    `${APP}/blogg/page.tsx`,
    `${APP}/vart-arbeid/[slug]/page.tsx`,
  ]) {
    assert.ok(
      readFileSync(fil, "utf8").includes("BrodsmuleSchema"),
      `${fil} mangler brødsmuler`,
    );
  }
});

/**
 * FAQ-SCHEMAET SKAL SI DET SAMME SOM SIDEN.
 *
 * Layouten sender `side.faq` både til markeringen og til trekkspillet, så
 * antallet kan ikke gli fra hverandre. Det testen fanger, er det som KAN
 * gli: tomme spørsmål, tomme svar, og to like spørsmål på samme side.
 */
test("hver side har en FAQ uten tomme eller dupliserte spørsmål", () => {
  for (const s of tjenestesider) {
    assert.ok(s.faq.length >= 3, `${s.sti} har bare ${s.faq.length} spørsmål`);
    const sett = new Set<string>();
    for (const f of s.faq) {
      assert.ok(f.sporsmal.trim().length > 5, `${s.sti}: tomt spørsmål`);
      assert.ok(f.svar.trim().length > 20, `${s.sti}: tomt svar`);
      assert.ok(
        !sett.has(f.sporsmal.toLowerCase()),
        `${s.sti}: «${f.sporsmal}» står to ganger`,
      );
      sett.add(f.sporsmal.toLowerCase());
    }
  }
});

/**
 * ET SPØRSMÅL SKAL IKKE STÅ BÅDE SOM SEKSJON OG SOM FAQ. Fire slike
 * duplikater ble ryddet 21.09.2026, og det er lett å gjeninnføre ett når man
 * legger til en FAQ.
 */
test("ingen FAQ gjentar en seksjonsoverskrift på samme side", () => {
  for (const s of tjenestesider) {
    const seksjoner = new Set(
      s.seksjoner.map((x) => x.sporsmal.toLowerCase().replace(/[?.]/g, "")),
    );
    for (const f of s.faq) {
      const q = f.sporsmal.toLowerCase().replace(/[?.]/g, "");
      assert.ok(!seksjoner.has(q), `${s.sti}: «${f.sporsmal}» står begge steder`);
    }
  }
});

test("hver tjenesteside har en unik tittel og H1", () => {
  const titler = tjenestesider.map((s) => s.tittel.toLowerCase());
  const h1er = tjenestesider.map((s) => s.h1.toLowerCase());
  assert.equal(new Set(titler).size, titler.length, "to sider deler tittel");
  assert.equal(new Set(h1er).size, h1er.length, "to sider deler H1");
});
