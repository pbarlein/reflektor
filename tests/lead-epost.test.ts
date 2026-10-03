import assert from "node:assert/strict";
import test from "node:test";

import {
  VARSEL_EMNE,
  bekreftelse,
  harFattBekreftelse,
  varsel,
  type Lead,
} from "@/lib/lead";
import { delNavn } from "@/lib/hubspot";

/**
 * Varselet er fra 03.10.2026 det ENESTE Pål får om et nettsidelead —
 * HubSpots egne skjemavarsler er slått av, og arbeidsflyten varsler bare om
 * Meta-leads. Formatet er derfor ikke en smaksak, og rekkefølgen er hans,
 * ordrett.
 *
 * Det som er lett å ødelegge uten å se det er rekkefølgen, en manglende
 * tom-verdi, og at brukerinnhold slipper ut av HTML-en. Derfor står det her.
 */

function lead(endringer: Partial<Lead> = {}): Lead {
  return {
    navn: "Marisol Sand",
    epost: "marisol@lamexicana.no",
    bedrift: "La Mexicana AS",
    telefon: "+47 966 84 028",
    melding: "Vi trenger film til Instagram.",
    side: "/kontaktoss",
    nettside: "https://lamexicana.no",
    nettsideUtledet: false,
    kilde: "Instagram (lenke i bio) | landet på: /",
    ...endringer,
  };
}

test("emnet er fast", () => {
  assert.equal(VARSEL_EMNE, "NYTT LEAD fra reflektor.no");
});

test("rekkefølgen i varselet er Påls, ordrett", () => {
  const { tekst } = varsel(lead());
  assert.equal(
    tekst,
    [
      "Avsender: Marisol Sand",
      "Mobilnummer: +47 966 84 028",
      "E-post: marisol@lamexicana.no",
      "Bedrift: La Mexicana AS",
      "Nettside: https://lamexicana.no",
      "Behov:",
      "Vi trenger film til Instagram.",
    ].join("\n"),
  );
});

test("tomme felt vises som tankestrek, ikke som tomrom", () => {
  const { tekst } = varsel(
    lead({ bedrift: "", telefon: "", nettside: "", melding: "" }),
  );
  for (const linje of ["Mobilnummer: –", "Bedrift: –", "Nettside: –"]) {
    assert.ok(tekst.includes(linje), `mangler «${linje}»`);
  }
  assert.ok(tekst.endsWith("Behov:\n–"));
});

test("mobil, e-post og nettside er lenker i HTML-en", () => {
  const { html } = varsel(lead());
  assert.ok(html.includes('href="tel:+4796684028"'), "tel-lenke");
  assert.ok(html.includes('href="mailto:marisol@lamexicana.no"'), "mailto");
  assert.ok(html.includes('href="https://lamexicana.no"'), "nettside");
});

test("en utledet nettside er merket, men bare for Pål", () => {
  const { tekst, html } = varsel(
    lead({ nettside: "https://trenogmat.no", nettsideUtledet: true }),
  );
  assert.ok(tekst.includes("Nettside: https://trenogmat.no (fra e-post)"));
  assert.ok(html.includes("(fra e-post)"));
});

/**
 * INGEN KILDE, INGEN SIDE. Begge sto i varselet før 04.10.2026 og er tatt
 * ut: de hører hjemme i HubSpot, og hvert felt her er et felt Pål må lese
 * forbi for å finne telefonnummeret.
 */
test("varselet inneholder ikke kilde eller side", () => {
  /*
    Meldingen her nevner ikke noen kanal med vilje. Den første utgaven av
    testen brukte standardleadet, der kunden selv skriver «Instagram» i
    behovet — og da slo assertionen ut på kundens egen tekst, ikke på
    kilden. En test som kan feile av riktig grunn er ingen test.
  */
  const { tekst, html } = varsel(
    lead({ melding: "Vi trenger hjelp med film." }),
  );
  for (const ut of [tekst, html]) {
    assert.ok(!ut.includes("Kilde"), "kilde skal ikke stå i varselet");
    assert.ok(!ut.includes("/kontaktoss"), "siden skal ikke stå i varselet");
    assert.ok(!ut.includes("Instagram"), "etiketten skal ikke stå i varselet");
    assert.ok(
      !ut.includes("lenke i bio"),
      "etiketten skal ikke stå i varselet",
    );
  }
});

test("brukerinnhold slipper ikke ut av HTML-en", () => {
  const { html } = varsel(
    lead({
      navn: "<script>alert(1)</script>",
      melding: 'a & b < c "d"',
    }),
  );
  assert.ok(!html.includes("<script>"), "taggen skal være escapet");
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("a &amp; b &lt; c &quot;d&quot;"));
});

/* ───────────────────────────── BEKREFTELSEN ───────────────────────────── */

test("bekreftelsen bruker bare fornavnet", () => {
  const { tekst } = bekreftelse("Marisol Sand Hansen");
  assert.ok(tekst.startsWith("Hei Marisol!"));
  assert.ok(!tekst.includes("Sand"), "etternavnet skal ikke med");
});

test("bekreftelsen tåler tomt navn", () => {
  assert.ok(bekreftelse("").tekst.startsWith("Hei!"));
});

/**
 * BEKREFTELSEN GJENGIR INGEN ANNEN BRUKERTEKST. En e-post fra vårt domene
 * som bærer tekst en fremmed har skrevet, til en adresse hun selv har
 * valgt, er en vei til misbruk. Fornavnet er kort nok til ikke å bære et
 * budskap, og det kuttes og escapes.
 */
test("fornavnet kuttes og escapes", () => {
  const { tekst, html } = bekreftelse(`${"x".repeat(80)} <b>hei</b>`);
  assert.ok(!html.includes("<b>"));
  const hilsen = tekst.split("\n")[0];
  assert.ok(hilsen.length <= 46, `hilsenen var ${hilsen.length} tegn`);
});

test("bekreftelsen lenker til /book og lover tre virkedager", () => {
  const { tekst } = bekreftelse("Marisol");
  assert.ok(tekst.includes("https://www.reflektor.no/book"));
  assert.ok(tekst.includes("tre virkedager"));
});

test("samme adresse får bare én bekreftelse per ti minutter", () => {
  const na = Date.now();
  const e = `test-${na}@example.com`;
  assert.equal(harFattBekreftelse(e, na), false, "første gang skal gå");
  assert.equal(harFattBekreftelse(e, na + 1000), true, "andre gang stoppes");
  assert.equal(
    harFattBekreftelse(e, na + 11 * 60_000),
    false,
    "etter vinduet går det igjen",
  );
  assert.equal(
    harFattBekreftelse(`annen-${na}@example.com`, na + 1000),
    false,
    "en annen adresse er ikke berørt",
  );
});

/* ──────────────────────────── NAVN TIL HUBSPOT ────────────────────────── */

/**
 * Dealnavnet i HubSpot settes sammen av fornavn, etternavn og bedrift i en
 * arbeidsflyt. Et felt som BEGYNNER eller SLUTTER med mellomrom gir et
 * dealnavn med dobbelt mellomrom, uten at noe ser rart ut i HubSpot.
 */
test("fornavn og etternavn har aldri mellomrom i endene", () => {
  for (const inn of [
    "  Marisol  ",
    "Marisol",
    "Pål  Erik   Barlein",
    "   ",
    "",
  ]) {
    const { fornavn, etternavn } = delNavn(inn);
    assert.equal(fornavn, fornavn.trim(), `fornavn fra «${inn}»`);
    assert.equal(etternavn, etternavn.trim(), `etternavn fra «${inn}»`);
    assert.ok(!fornavn.includes("  "));
    assert.ok(!etternavn.includes("  "));
  }
});

test("ett ord gir tomt etternavn, ikke et mellomrom", () => {
  assert.deepEqual(delNavn("  Marisol "), {
    fornavn: "Marisol",
    etternavn: "",
  });
});
