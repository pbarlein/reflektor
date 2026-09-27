import assert from "node:assert/strict";
import test from "node:test";

import { deleneI } from "../src/content/arktype.ts";
import {
  MALER,
  byggInstruks,
  byggRettelse,
  eksempelverdier,
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
      /*
       * Grunnlagsfelt SKAL ikke stå i strukturen. De styrer hva Claude
       * undersøker, og de holdes bevisst ute av dokumentet — se `grunnlag`
       * i maltype.ts. Regelen for dem er den motsatte, og den står i sin
       * egen test under.
       */
      if (f.grunnlag) continue;
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
    assert.match(
      m.oppdrag,
      /Overskriften er/,
      `${m.slug}: hva er overskriften?`,
    );
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

/**
 * «Fyll inn eksempel» skal fylle ALT.
 *
 * Et halvfylt eksempel er verre enn ingen knapp: produsenten tror skjemaet
 * er ferdig, trykker «Lag dokumentet», og får TBD-er hen ikke forsto at hen
 * selv skulle fylt inn.
 */
test("eksempelet fyller hvert eneste felt", () => {
  for (const m of MALER) {
    const v = eksempelverdier(m);
    for (const f of m.felt) {
      /* Oppslagsnøkler fylles ikke ut av eksempelet. Se `eksempelverdier`. */
      if (f.grunnlag) continue;
      assert.ok(
        (v[f.id] ?? "").trim().length > 0,
        `${m.slug}: feltet «${f.etikett}» har ingen eksempelverdi`,
      );
    }
  }
});

test("eksempelverdier for valgfelt står blant valgene", () => {
  for (const m of MALER) {
    const v = eksempelverdier(m);
    for (const f of m.felt) {
      if (f.type === "valg") {
        assert.ok(
          f.valg?.includes(v[f.id]),
          `${m.slug}/${f.id}: eksempelet «${v[f.id]}» er ikke et av valgene`,
        );
      }
      if (f.type === "flervalg") {
        for (const del of v[f.id].split(" · ")) {
          assert.ok(
            f.valg?.includes(del),
            `${m.slug}/${f.id}: «${del}» er ikke et av valgene`,
          );
        }
      }
    }
  }
});

/**
 * Datoene regnes ut fra dagen i dag. En fast dato i et eksempel er feil
 * dato fra og med dagen etter.
 */
test("datoeksempler er datoer, og de flytter seg med dagen", () => {
  const idag = new Date().toISOString().slice(0, 10);
  for (const m of MALER) {
    const v = eksempelverdier(m);
    for (const f of m.felt) {
      if (f.type !== "dato") continue;
      assert.match(v[f.id], /^\d{4}-\d{2}-\d{2}$/, `${m.slug}/${f.id}`);
      if ((f.eksempelDager ?? 14) > 0) {
        assert.ok(v[f.id] > idag, `${m.slug}/${f.id} skulle ligget fram i tid`);
      }
    }
  }
});

/**
 * ── GRUNNLAGSFELT MÅ FAKTISK BRUKES TIL NOE ───────────────────────────────
 *
 * Testen over slipper grunnlagsfeltene forbi kravet om at hvert felt skal
 * være nevnt i strukturen. Uten en erstatning ville den unntaksregelen vært
 * en bakdør: et hvilket som helst felt kunne merkes `grunnlag` og forsvinne
 * ut av all kontroll — synlig i skjemaet, fylt ut av produsenten, og brukt
 * av ingenting.
 *
 * Derfor denne listen. Den er kort med vilje. Skal et nytt grunnlagsfelt
 * inn, må noe i serveren først lære seg å lese det, og id-en må føres opp
 * her sammen med hvem som bruker den.
 */
const GRUNNLAG_SOM_BRUKES: Record<string, string> = {
  /** `hentPublisering` i src/lib/supermetrics.ts slår opp kontoen. */
  instagram: "supermetrics",
  /** Samme oppslag, som sammenligningsgrunnlag. */
  konkurrenter: "supermetrics",
  /** Sendes inn i researchen, og letes etter i e-posten når den er tom. */
  somestrategi: "research + brief",
};

test("hvert grunnlagsfelt leses av noe på serveren", () => {
  for (const m of MALER) {
    for (const f of m.felt) {
      if (!f.grunnlag) continue;
      assert.ok(
        GRUNNLAG_SOM_BRUKES[f.id],
        `${m.slug}: «${f.etikett}» er merket grunnlag, men ingenting leser den. Et felt ingen bruker er verre enn ikke noe felt — produsenten fyller det ut og tror det telte.`,
      );
    }
  }
});

/**
 * Grunnlagsfeltene skal ALDRI havne i instruksens innholdsdel. Et
 * Instagram-brukernavn under INFORMASJONEN blir før eller siden en
 * tabellcelle hos kunden, og en Canva-lenke i en produksjonsplan er en
 * arbeidsnotis på avveie.
 */
test("grunnlagsfelt står verken under INFORMASJONEN eller IKKE OPPGITT", () => {
  for (const m of MALER) {
    const grunnlag = m.felt.filter((f) => f.grunnlag);
    if (!grunnlag.length) continue;

    const verdier = Object.fromEntries(
      grunnlag.map((f) => [f.id, "@noeutfylt"]),
    );
    for (const ut of [byggInstruks(m, verdier), byggInstruks(m, {})]) {
      for (const f of grunnlag) {
        assert.ok(
          !ut.includes(`- ${f.etikett}`),
          `${m.slug}: «${f.etikett}» er ført opp som innhold i instruksen`,
        );
      }
      assert.ok(
        !ut.includes("@noeutfylt"),
        `${m.slug}: verdien av et grunnlagsfelt lekket inn i instruksen`,
      );
    }
  }
});

/**
 * ── DET PRODUSENTEN HAR BEDT OM, SKAL IKKE KUNNE FORSVINNE ────────────────
 *
 * 25.09.2026: en produsent ba om voiceover per opptak i runde tre, trykket
 * «Kort ned så det får plass» i runde fem, og måtte spørre «nå er voice over
 * borte?» i runde seks.
 *
 * Runde fem så bare dokumentet og ordene «kort ned». Ingenting fortalte
 * modellen at voiceover-seksjonen var bestilt og ikke påfunnet, og da er den
 * det billigste å kutte: den er lang, og den står ikke i strukturen.
 */
test("tidligere rettelser følger med som stående instrukser", () => {
  const mal = MALER[0];
  const ark = {
    overskrift: "Tittel",
    undertittel: "Under",
    deler: [],
  };
  const tidligere = [
    "Det skal være profesjonell voiceover. Lag manus til voiceover.",
    "Gjør betraktelig kortere.",
  ];

  const ut = byggRettelse(
    mal,
    {},
    ark,
    "Kort ned så det får plass.",
    false,
    "",
    tidligere,
  );

  for (const t of tidligere) {
    assert.ok(ut.includes(t), `den stående instruksen «${t}» følger ikke med`);
  }
  assert.match(
    ut,
    /KAN DU IKKE FJERNE FOR Å SPARE PLASS/,
    "listen står der uten regelen som gjør den bindende",
  );
});

/**
 * Uten tidligere rettelser skal blokka ikke stå der i det hele tatt. En tom
 * overskrift med ingenting under er støy i en instruks som allerede er lang.
 */
test("stående-instrukser-blokka utelates når det ikke finnes noen", () => {
  const ut = byggRettelse(
    MALER[0],
    {},
    { overskrift: "T", undertittel: "U", deler: [] },
    "Bytt navn.",
    false,
    "",
    ["", "   "],
  );
  assert.ok(!ut.includes("STÅENDE INSTRUKSER"));
});

/**
 * Kuttet i seg selv var forsvarlig — ensideren krever at noe vikes. At det
 * skjedde i stillhet, var det ikke.
 */
test("hver instruks krever at et kutt blir sagt fra om", () => {
  for (const m of MALER) {
    assert.match(
      byggInstruks(m, {}),
      /TOK DU NOE BORT FOR Å FÅ PLASS, SKAL DET STÅ I BESKJEDEN/,
      `${m.slug}: ingenting krever at kutt blir nevnt`,
    );
  }
});
