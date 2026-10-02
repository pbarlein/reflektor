import assert from "node:assert/strict";
import test from "node:test";

import {
  artikkelMarkering,
  forfatterMarkering,
} from "../src/lib/artikkelmarkering.ts";
import { artikler } from "../src/content/artikler.ts";

/**
 * Markeringen på artiklene.
 *
 * HVORFOR DETTE TESTES HER OG IKKE I content:check. Prompten for runde 3 ba
 * om å utvide innholdssjekken «hvis den validerer schema». Den gjør ikke
 * det — `scripts/content-check.ts` ser på slots og TBD-markører, ikke på
 * JSON-LD. Vakten hører derfor hjemme her.
 *
 * FEILEN DEN SKAL FANGE ER USYNLIG. Et `author` som peker på
 * organisasjonen i stedet for personen, eller et `dateModified` som
 * forsvinner, ser helt likt ut på siden. Det eneste som merker det er
 * Google og språkmodellene, og de sier ikke fra.
 *
 * OBJEKTENE LIGGER I lib/artikkelmarkering.ts og ikke i Schema.tsx. Node
 * kan ikke importere JSX i en test — `ERR_UNKNOWN_FILE_EXTENSION` på
 * «.tsx» — så så lenge de lå i komponenten, var eneste måte å kontrollere
 * dem på å bygge nettstedet og lese HTML-en. Nå er markeringen rene
 * funksjoner, og komponentene serialiserer det de returnerer.
 */

const PERSON_ID = "https://www.reflektor.no/om-oss#pal-barlein";
const ORG_ID = "https://www.reflektor.no/#organisasjon";

function skjemaFor(a: (typeof artikler)[number]): Record<string, unknown> {
  return artikkelMarkering({
    tittel: a.tittel,
    beskrivelse: a.beskrivelse,
    sti: `/blogg/${a.slug}`,
    publisert: a.publisert,
    oppdatert: a.oppdatert,
    bilde: `/bilder/og/blogg-${a.slug}.jpg`,
  });
}

/*
  Markeringen leser basisUrl(), som peker på det ekte domenet bare når
  indeksering er på. Testene her handler om innholdet i markeringen, så
  bryteren settes for kjøringen.
*/
process.env.NEXT_PUBLIC_TILLAT_INDEKSERING = "true";

test("hver artikkel har Pål som forfatter, ikke selskapet", () => {
  for (const a of artikler) {
    const d = skjemaFor(a);
    assert.deepEqual(
      d.author,
      { "@id": PERSON_ID },
      `${a.slug}: author skal peke på personen. Et aksjeselskap som ` +
        `forfatter er det Google kaller manglende forfatterinformasjon, ` +
        `og en språkmodell har ingen å sitere.`,
    );
    assert.deepEqual(
      d.publisher,
      { "@id": ORG_ID },
      `${a.slug}: publisher skal fortsatt være organisasjonen. Det er den ` +
        `som utgir og eier nettstedet.`,
    );
  }
});

test("hver artikkel har dateModified og image", () => {
  for (const a of artikler) {
    const d = skjemaFor(a);
    assert.equal(
      d.dateModified,
      a.oppdatert ?? a.publisert,
      `${a.slug}: dateModified mangler eller er feil. Google leser et ` +
        `manglende felt som «ukjent», ikke som «uendret».`,
    );
    assert.equal(
      d.image,
      `https://www.reflektor.no/bilder/og/blogg-${a.slug}.jpg`,
      `${a.slug}: image mangler. Uten det kan artikkelen ikke vises med ` +
        `bilde i søkeresultater eller i Discover.`,
    );
    assert.ok(
      typeof d.datePublished === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.datePublished),
      `${a.slug}: datePublished må være en ISO-dato.`,
    );
  }
});

test("personen beskrives én gang, med LinkedIn som sameAs", () => {
  const d: Record<string, unknown> = forfatterMarkering();

  assert.equal(d["@type"], "Person");
  assert.equal(d["@id"], PERSON_ID);
  assert.equal(d.name, "Pål Barlein");
  assert.equal(d.jobTitle, "CEO");
  assert.deepEqual(d.worksFor, { "@id": ORG_ID });
  assert.deepEqual(d.sameAs, [
    "https://www.linkedin.com/in/p%C3%A5l-barlein-36131926/",
  ]);
  assert.equal(
    d.url,
    "https://www.reflektor.no/om-oss#pal-barlein",
    "url må treffe ankeret på /om-oss, ellers lover lenken noe den ikke holder",
  );
});

test("hvert OG-bilde markeringen lover finnes faktisk", async () => {
  const { existsSync } = await import("node:fs");
  const path = await import("node:path");
  for (const a of artikler) {
    const fil = path.join(
      import.meta.dirname,
      "..",
      "public",
      "bilder",
      "og",
      `blogg-${a.slug}.jpg`,
    );
    assert.ok(
      existsSync(fil),
      `${a.slug}: markeringen oppgir et delingsbilde som ikke ligger i ` +
        `repoet. Kjør scripts/og-bilder.ts.`,
    );
  }
});
