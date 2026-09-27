import assert from "node:assert/strict";
import test from "node:test";

/**
 * Bryterne som skal snus ved cutover.
 *
 * Begge er av typen feil som er usynlig til den koster: en side som
 * indekseres for tidlig konkurrerer mot den levende siden i søk, og en
 * container som laster for tidlig blander forhåndsvisningstrafikk inn i
 * GA4-eiendommen som måler Reflektors eneste KPI.
 *
 * Det siste er ikke hypotetisk. GTM sin egen dekningsrapport, lest 27.09.2026,
 * viser at containeren allerede fyrer på reflektor-ny.vercel.app — inkludert
 * /takk — og på tre Vercel-forhåndsvisninger.
 *
 * `miljo.ts` leser miljøvariabler på modulnivå, så testene setter dem og
 * importerer modulen på nytt med en cache-buster i URL-en.
 */
async function last(env: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return await import(`../src/lib/miljo.ts?t=${Math.random()}`);
}

const AV = {
  NEXT_PUBLIC_TILLAT_INDEKSERING: undefined,
  NEXT_PUBLIC_TILLAT_SPORING: undefined,
};

test("standard er av: verken indeksering eller sporing", async () => {
  const m = await last(AV);
  assert.equal(m.tillatIndeksering(), false);
  assert.equal(
    m.tillatSporing(),
    false,
    "Uten bryter skal GTM ikke lastes. Hver sidevisning fra en " +
      "forhåndsvisning er støy i tallene som måler den eneste KPI-en.",
  );
});

test("indeksering slår også på sporing — én bryter ved cutover", async () => {
  const m = await last({ ...AV, NEXT_PUBLIC_TILLAT_INDEKSERING: "true" });
  assert.equal(m.tillatIndeksering(), true);
  assert.equal(
    m.tillatSporing(),
    true,
    "Når DNS peker hit skal begge være på. Å måtte huske to brytere på " +
      "cutover-dagen er en feil som venter på å skje.",
  );
});

test("sporing kan slås på alene, for bevisst testing", async () => {
  const m = await last({ ...AV, NEXT_PUBLIC_TILLAT_SPORING: "true" });
  assert.equal(
    m.tillatIndeksering(),
    false,
    "Å teste sporing skal ALDRI åpne indekseringssperren.",
  );
  assert.equal(m.tillatSporing(), true);
});

test("bare strengen «true» teller", async () => {
  for (const v of ["1", "TRUE", "ja", "yes", ""]) {
    const m = await last({ ...AV, NEXT_PUBLIC_TILLAT_INDEKSERING: v });
    assert.equal(
      m.tillatIndeksering(),
      false,
      `«${v}» skal ikke åpne sperren. En slurvete verdi i Vercel-panelet ` +
        `skal feile lukket, ikke åpent.`,
    );
  }
});
