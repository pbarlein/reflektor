import assert from "node:assert/strict";
import test from "node:test";

import {
  VARSEL_EMNE,
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
  // Oppfølgingslinjene kommer etter feltene og testes for seg under.
  const { tekst } = varsel(lead());
  assert.ok(
    tekst.startsWith(
      [
      "Avsender: Marisol Sand",
      "Mobilnummer: +47 966 84 028",
      "E-post: marisol@lamexicana.no",
      "Bedrift: La Mexicana AS",
      "Nettside: https://lamexicana.no",
        "Behov:",
        "Vi trenger film til Instagram.",
      ].join("\n"),
    ),
    tekst,
  );
});

test("tomme felt vises som tankestrek, ikke som tomrom", () => {
  const { tekst } = varsel(
    lead({ bedrift: "", telefon: "", nettside: "", melding: "" }),
  );
  for (const linje of ["Mobilnummer: –", "Bedrift: –", "Nettside: –"]) {
    assert.ok(tekst.includes(linje), `mangler «${linje}»`);
  }
  assert.ok(tekst.includes("Behov:\n–"));
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

/* ──────────────────────── OPPFØLGINGEN I VARSELET ───────────────────── */

/**
 * De tre linjene som kom til 04.10.2026.
 *
 * HubSpot sender nå selv presentasjon og bookinglenke med én gang, og en
 * påminnelse neste hverdag kl. 09:00. Pål skal se tidspunktet, fordi det er
 * fristen hans for å ringe først. Regelen for tidspunktet er testet for seg
 * i paaminnelse.test.ts; her testes at det faktisk havner i e-posten.
 */
test("varselet sier når påminnelsen går, og hvorfor han bør ringe først", () => {
  const { tekst, html } = varsel(lead(), new Date("2026-10-09T08:00:00+02:00"));
  assert.ok(
    tekst.includes(
      "Generisk Canva-presentasjon og møtelink sendt. Påminnelse sendes mandag 12. oktober kl. 09:00.",
    ),
    tekst,
  );
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));
  assert.ok(html.includes("Påminnelse sendes mandag 12. oktober kl. 09:00."));
  assert.ok(html.includes("Ring ASAP for å booke møte personlig."));
});

/**
 * INTERNE ADRESSER FÅR INGEN PÅMINNELSE, og da skal varselet heller ikke
 * love en. Det er testinnsendingene våre egne som ellers hadde fått Pål til
 * å tro at oppfølgingen virket.
 */
test("ingen oppfølgingslinjer for @reflektor.no", () => {
  const { tekst, html } = varsel(lead({ epost: "pal+test@reflektor.no" }));
  assert.ok(!tekst.includes("Påminnelse sendes"));
  assert.ok(!tekst.includes("Ring ASAP"));
  assert.ok(!html.includes("Avbryt påminnelse"));
});

/**
 * UTEN HEMMELIGHET, INGEN KNAPP — men varselet skal fortsatt komme fram.
 * Testen kjører uten `PAAMINNELSE_HEMMELIGHET` satt, som er nøyaktig det
 * som skjer hvis variabelen forsvinner fra Vercel.
 */
test("knappen utelates når lenken ikke kan signeres", () => {
  const { tekst, html } = varsel(lead());
  assert.ok(!tekst.includes("Avbryt påminnelse:"));
  assert.ok(!html.includes("/paaminnelse/avbryt"));
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));
  assert.ok(tekst.includes("Mobilnummer: +47 966 84 028"));
});

/* ────────────────────────── «SKRIV TIL <FORNAVN>» ───────────────────── */

/**
 * Knappen som åpner et svar med emnet ferdig utfylt, bestilt 03.10.2026.
 *
 * E-postadressen står allerede som mailto i feltlista. Det denne gjør i
 * tillegg, er å sette emnet og å være stor nok for en tommel.
 */
test("knappen åpner et svar til leadet med fast emne", () => {
  const { tekst, html } = varsel(lead());
  assert.ok(tekst.includes("Skriv til Marisol: marisol@lamexicana.no"));
  assert.ok(tekst.includes("Henvendelsen din til Reflektor"));
  assert.ok(
    html.includes(
      "mailto:marisol@lamexicana.no?subject=Henvendelsen%20din%20til%20Reflektor",
    ),
    html,
  );
  assert.ok(html.includes(">Skriv til Marisol</a>"));
});

test("bare fornavnet brukes, også med tre navn", () => {
  const { html } = varsel(lead({ navn: "Marisol Sand Hansen" }));
  assert.ok(html.includes(">Skriv til Marisol</a>"));
});

/**
 * UTEN NAVN STÅR DET «Skriv til leadet». En knapp som sier «Skriv til » og
 * ingenting mer, ser ødelagt ut — og navnet er ikke påkrevd i skjemaet for
 * en POST som kommer utenfra.
 */
test("uten navn får knappen en tekst som står på egne bein", () => {
  const { html } = varsel(lead({ navn: "" }));
  assert.ok(html.includes(">Skriv til leadet</a>"));
});

/**
 * Uten brukbar adresse er det ingenting å skrive til.
 *
 * MERK at feltlista fortsatt lager en mailto-lenke av det som ble skrevet
 * — den viser det leadet faktisk oppga. Testen ser derfor etter KNAPPEN,
 * ikke etter «mailto», som første utgave gjorde og som slo ut på feil ting.
 */
test("ingen knapp når e-posten ikke er en adresse", () => {
  const { tekst, html } = varsel(lead({ epost: "ikke en adresse" }));
  assert.ok(!tekst.includes("Skriv til"));
  assert.ok(!html.includes("Skriv til"));
  assert.ok(!html.includes("subject="));
});
