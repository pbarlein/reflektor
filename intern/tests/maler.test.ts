import assert from "node:assert/strict";
import test from "node:test";

import { deleneI } from "../src/content/arktype.ts";
import {
  MALER,
  byggInstruks,
  byggRettelse,
  malFraSlug,
} from "../src/content/maler.ts";
import { FASER } from "../src/content/maltype.ts";
import { RUBRIKKER } from "../src/content/rubrikker/index.ts";

/**
 * Malene er data, og data kan være feil på måter typene ikke fanger: to
 * felt med samme id, en rubrikklenke som peker på noe som ikke finnes, en
 * regel som forsvant fra instruksen.
 */
test("slugger er unike og URL-vennlige", () => {
  const sett = new Set<string>();
  for (const m of MALER) {
    assert.match(m.slug, /^[a-z0-9-]+$/, `${m.slug} er ikke URL-vennlig`);
    assert.ok(!sett.has(m.slug), `${m.slug} finnes to ganger`);
    sett.add(m.slug);
    assert.equal(malFraSlug(m.slug)?.navn, m.navn);
  }
});

test("feltnøkler er unike innenfor hver mal", () => {
  for (const m of MALER) {
    const sett = new Set<string>();
    for (const f of m.felt) {
      assert.ok(!sett.has(f.id), `${m.slug}: feltet ${f.id} finnes to ganger`);
      sett.add(f.id);
    }
  }
});

test("valg- og flervalgsfelt har noe å velge mellom", () => {
  for (const m of MALER) {
    for (const f of m.felt) {
      if (f.type === "valg" || f.type === "flervalg") {
        assert.ok(
          f.valg && f.valg.length >= 2,
          `${m.slug}/${f.id} er et valgfelt uten valg`,
        );
      }
      /*
       * En standardverdi som ikke står i lista, gir en <select> som viser
       * noe brukeren ikke kan velge på nytt hvis hen bytter bort fra den.
       */
      if (f.standard && f.type === "valg") {
        assert.ok(
          f.valg?.includes(f.standard),
          `${m.slug}/${f.id}: standard «${f.standard}» står ikke blant valgene`,
        );
      }
    }
  }
});

test("rubrikklenker peker på rubrikker som finnes og er i drift", () => {
  const drift = new Set(
    RUBRIKKER.filter((r) => r.status === "lansert").map((r) => r.slug),
  );
  for (const m of MALER) {
    for (const slug of m.rubrikker ?? []) {
      assert.ok(
        drift.has(slug),
        `${m.slug} lenker til «${slug}», som ikke er i drift`,
      );
    }
  }
});

test("hver mal har et oppdrag, en struktur og minst ett påkrevd felt", () => {
  for (const m of MALER) {
    assert.ok(m.oppdrag.length > 40, `${m.slug}: oppdraget er for tynt`);
    assert.ok(m.struktur.length >= 3, `${m.slug}: strukturen er for tynn`);
    assert.ok(m.skisse.length >= 3, `${m.slug}: skissen er for tynn`);
    assert.ok(
      m.felt.some((f) => f.paakrevd),
      `${m.slug}: ingen felt er påkrevd`,
    );
  }
});

test("instruksen bærer husreglene, også når skjemaet er tomt", () => {
  for (const m of MALER) {
    const tom = byggInstruks(m, {});
    assert.match(tom, /Ikke finn på tall/, `${m.slug} mangler oppdikt-regelen`);
    assert.match(
      tom,
      /skal ALDRI stå i det/,
      `${m.slug} mangler forbudet mot forretningsvilkår`,
    );
    assert.match(tom, /IKKE OPPGITT/, `${m.slug} lister ikke tomme felt`);
    for (const r of m.regler ?? []) {
      assert.ok(tom.includes(r), `${m.slug}: en egen regel falt ut`);
    }
  }
});

test("utfylte verdier havner i instruksen, tomme gjør det ikke", () => {
  const m = malFraSlug("produksjonsplan");
  assert.ok(m);
  const ut = byggInstruks(m, { kunde: "Jordbærpikene", lokasjon: "   " });
  assert.match(ut, /- Kunde: Jordbærpikene/);
  assert.ok(
    !/- Lokasjon: /.test(ut),
    "et felt med bare mellomrom skal telles som tomt",
  );
  assert.match(ut, /IKKE OPPGITT[\s\S]*- Lokasjon/);
});

/**
 * ── PRISEN SKAL IKKE FINNES I MALVERKET ───────────────────────────────────
 *
 * Bestilt 24.09.2026: produsenter lager produksjonsdokumenter, ikke avtaler.
 * Pris, honorar og oppsigelse står i tjenesteavtalen, som daglig leder eier.
 *
 * Denne testen leser hele maldataen som tekst — navn, hjelpetekster,
 * plassholdere, struktur og regler — og slår ned på et beløp hvor som helst.
 * Grunnen til at den er så grov: forrige gang sto prisen i en regel som var
 * ment som en formatregel, og modellen leste den som en oppfordring.
 */
test("ingen mal nevner pris, honorar eller avtalevilkår", () => {
  const forbudt = [
    /\b\d[\d\s .]{2,}kr\b/i,
    /\bkroner\b/i,
    /\bkr\/mnd\b/i,
    /\bhonorar/i,
    /\btimesats/i,
    /\bfaktur/i,
    /\boppsigelse/i,
    /\bbindingstid/i,
    /\bmva\b/i,
    /\babonn/i,
    /prøveperiode/i,
    /engangsoppdrag/i,
  ];
  for (const m of MALER) {
    /*
     * Alt brukeren ser og alt dokumentet bygges av — men ikke `regler`.
     * En regel MÅ kunne si «ikke skriv noe om honorar», og det er det
     * motsatte av en overtredelse.
     */
    const { regler, ...resten } = m;
    const tekst = JSON.stringify(resten);
    for (const mønster of forbudt) {
      assert.ok(
        !mønster.test(tekst),
        `${m.slug} nevner noe som hører hjemme i tjenesteavtalen: ${mønster}`,
      );
    }

    /*
     * Nevner en regel penger, skal den forby dem. En regel som forklarer
     * HVORDAN prisen skrives, er nøyaktig feilen vi ble bitt av 23.09.
     */
    for (const regel of regler ?? []) {
      if (!forbudt.some((f) => f.test(regel))) continue;
      assert.match(
        regel,
        /\b(ikke|aldri|utenfor)\b/i,
        `${m.slug}: en regel nevner penger uten å forby dem: «${regel}»`,
      );
    }
  }
});

test("hver mal hører til en fase i produksjonen", () => {
  for (const m of MALER) {
    assert.ok(
      FASER.includes(m.fase),
      `${m.slug} har en fase som ikke finnes: ${m.fase}`,
    );
  }
  for (const fase of FASER) {
    assert.ok(
      MALER.some((m) => m.fase === fase),
      `fasen «${fase}» er tom, og da blir overskriften stående uten kort`,
    );
  }
});

/**
 * ── STRUKTUREN MÅ FØLGE DELENE ────────────────────────────────────────────
 *
 * Instruksen gir Claude to kart: hvilke DELER arket har, og hva hver del
 * skal inneholde. Er de ikke like lange, peker de på hver sin ting.
 *
 * Dette skjedde: da dokumentet gikk fra markdown til struktur, ble `skisse`
 * oppdatert og `struktur` glemt. Modellen fikk det nye oppsettet og den
 * gamle prosaen samtidig, og skrev dokumenttypen som overskrift i tillegg
 * til den arket allerede tegner. Ordet sto to ganger på samme side.
 */
test("én strukturlinje per del, i samme rekkefølge", () => {
  for (const m of MALER) {
    const deler = deleneI(m);
    assert.equal(
      m.struktur.length,
      deler.length,
      `${m.slug}: ${deler.length} deler, men ${m.struktur.length} strukturlinjer`,
    );
    deler.forEach((d, i) => {
      assert.ok(
        m.struktur[i].toUpperCase().startsWith(d.toUpperCase()),
        `${m.slug}: strukturlinje ${i + 1} skulle begynt med ${d.toUpperCase()}`,
      );
    });
  }
});

/**
 * ── INGEN FELT UTEN JOBB ──────────────────────────────────────────────────
 *
 * Et felt som ingen strukturlinje eller regel nevner, havner i
 * INFORMASJONEN og blir plassert der Claude finner det for godt. Da er det
 * ikke et felt, det er en gjetning — og den som fylte det ut, tror likevel
 * at det ble brukt.
 */
test("hvert felt er nevnt i oppdraget, strukturen eller reglene", () => {
  for (const m of MALER) {
    const tekst = [m.oppdrag, ...m.struktur, ...(m.regler ?? [])]
      .join(" ")
      .toLowerCase();
    for (const f of m.felt) {
      assert.ok(
        tekst.includes(f.etikett.toLowerCase()),
        `${m.slug}: feltet «${f.etikett}» er ikke nevnt noe sted, og blir dermed plassert på slump`,
      );
    }
  }
});

/**
 * Hodet tegnes av arket. Sier ikke oppdraget fra, skriver Claude
 * dokumenttypen som overskrift i tillegg.
 */
test("oppdraget sier fra om at hodet allerede finnes", () => {
  for (const m of MALER) {
    assert.match(
      m.oppdrag,
      /Ikke gjenta noe av det/,
      `${m.slug}: oppdraget advarer ikke mot å gjenta hodet`,
    );
    assert.match(m.oppdrag, /Overskriften er/, `${m.slug}: hva er overskriften?`);
  }
});

test("språkreglene og avviksregelen står i hver instruks", () => {
  for (const m of MALER) {
    const ny = byggInstruks(m, {});
    assert.match(ny, /ikke et salgsdokument/, m.slug);
    assert.match(ny, /Forbudte ord og vendinger/, m.slug);
    assert.match(ny, /Skriv fullstendige setninger/, m.slug);

    const rettet = byggRettelse(
      m,
      {},
      { overskrift: "T", undertittel: "U", deler: [{ type: deleneI(m)[0] }] },
      "Legg til en seksjon.",
    );
    assert.match(rettet, /EN RETTELSE, IKKE EN NY MAL/, m.slug);
    assert.match(rettet, /ikke et salgsdokument/, m.slug);
  }
});
