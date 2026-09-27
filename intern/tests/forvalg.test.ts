import assert from "node:assert/strict";
import test from "node:test";

import { MALER, byggInstruks, eksempelverdier } from "../src/content/maler.ts";

/**
 * ── HVA SOM GIKK GALT, OG HVORFOR DET ER EN HEL KLASSE ────────────────────
 *
 * 27.09.2026 lastet en produsent opp en produksjonsplan der noen snakker på
 * film. Feltet «Er det tale på dagen» sto på «Nei, bare romlyd» — ingen
 * hadde valgt det, det var feltets standardverdi — og instruksen sa at et
 * utfylt felt gjelder foran vedlegget. Opptakslisten ble laget uten
 * mikrofon.
 *
 * Modellen fulgte instruksen. Instruksen kunne ikke skille «produsenten har
 * svart dette» fra «feltet åpnet med dette».
 *
 * Feilen var ikke ett felt. Fjorten felt hadde standardverdi, og seks av
 * dem var påstander om kunden, personen eller dagen. Testene under vokter
 * begge lagene av fiksen: at slike påstander ikke finnes som forvalg, og at
 * et urørt forvalg aldri opptrer som et svar.
 */

const medStandard = MALER.flatMap((m) =>
  m.felt.filter((f) => f.standard !== undefined).map((f) => ({ m, f })),
);

test("et urørt forvalg står aldri som svar i INFORMASJONEN", () => {
  for (const m of MALER) {
    const std: Record<string, string> = {};
    for (const f of m.felt) if (f.standard) std[f.id] = f.standard;
    if (!Object.keys(std).length) continue;

    const ut = byggInstruks(m, std);
    const informasjonen = ut.split("INFORMASJONEN")[1]?.split("\n\n")[0] ?? "";

    for (const f of m.felt) {
      if (f.standard === undefined) continue;
      assert.ok(
        !informasjonen.includes(`- ${f.etikett}: ${f.standard}`),
        `${m.slug}/${f.id}: standardverdien står som et svar produsenten har gitt. Da slår den et opplastet vedlegg som sier noe annet.`,
      );
    }
    assert.match(
      ut,
      /STANDARDVALG INGEN HAR BEKREFTET/,
      `${m.slug}: forvalgene er borte fra instruksen i stedet for å stå svakere`,
    );
  }
});

test("et forvalg produsenten har tatt stilling til, teller som svar", () => {
  for (const { m, f } of medStandard) {
    const ut = byggInstruks(m, { [f.id]: f.standard! }, false, "", [f.id]);
    const informasjonen = ut.split("INFORMASJONEN")[1]?.split("\n\n")[0] ?? "";
    assert.ok(
      informasjonen.includes(`- ${f.etikett}: ${f.standard}`),
      `${m.slug}/${f.id}: produsenten valgte denne, men den behandles fortsatt som et forvalg`,
    );
  }
});

/**
 * Med vedlegg må rangeringen stå svart på hvitt. Uten den setningen er det
 * opp til modellen å gjette hva som veier tyngst, og den gjettet feil.
 */
test("instruksen sier at vedlegget slår et forvalg", () => {
  for (const m of MALER) {
    if (!m.opplasting) continue;
    const ut = byggInstruks(m, {}, true);
    assert.match(
      ut,
      /gjelder IKKE foran vedlegget/,
      `${m.slug}: ingenting sier at vedlegget vinner over et forvalg`,
    );
  }
});

/**
 * Regelen fra maltype.ts: en standard kan si hvordan Reflektor jobber. Den
 * kan ikke si noe om kunden, personen eller dagen.
 *
 * Listen er uttømmende med vilje. Skal en ny standard inn, må den føres opp
 * her sammen med begrunnelsen — og da må noen ta stilling til om den
 * beskriver oss eller gjetter om dem.
 */
const REFLEKTORS_EGEN_STANDARD: Record<string, string> = {
  "produksjonsplan/fraOss": "vi stiller alltid med to og alt utstyr",
  "produksjonsplan/bruksflater": "det er dette abonnementet leverer for",
  "produksjonsplan/formater": "våre leveranseformater",
  "produksjonsplan/logo": "vår standardbehandling, og den trygge veien",
  "samtykke-film-og-bilde/varighet": "vår avtaleterm",
  "leveranseoversikt/formater": "våre leveranseformater",
  "leveranseoversikt/teksting": "vår standard for teksting",
  "publiseringsplan/dager": "rytmen to i uka, se rubrikken",
};

test("en standardverdi beskriver Reflektor, ikke kunden", () => {
  for (const { m, f } of medStandard) {
    assert.ok(
      REFLEKTORS_EGEN_STANDARD[`${m.slug}/${f.id}`],
      `${m.slug}/${f.id} står forhåndsvalgt på «${f.standard}». Er det slik Reflektor jobber, før den opp i REFLEKTORS_EGEN_STANDARD med en begrunnelse. Er det en påstand om kunden, personen eller dagen, skal feltet starte tomt — en gjetning som står forhåndsvalgt, blir aldri lest av den som skulle overprøvd den.`,
    );
  }
});

test("et påkrevd felt har ikke standardverdi", () => {
  for (const m of MALER) {
    for (const f of m.felt) {
      assert.ok(
        !(f.paakrevd && f.standard !== undefined),
        `${m.slug}/${f.id}: påkrevd OG forhåndsutfylt. Feltet blir aldri savnet, så kravet har ingen virkning — velg hvilken av de to som skal gjelde.`,
      );
    }
  }
});

/** Et fullt utfylt eksempel skal ikke etterlate hverken hull eller gjetninger. */
test("eksempelet gir en instruks uten hull og uten forvalg", () => {
  for (const m of MALER) {
    const v = eksempelverdier(m);
    const ut = byggInstruks(m, v, false, "", Object.keys(v));
    assert.ok(
      !/IKKE OPPGITT/.test(ut),
      `${m.slug}: eksempelet lar felt stå tomme`,
    );
    assert.ok(
      !/STANDARDVALG INGEN HAR BEKREFTET/.test(ut),
      `${m.slug}: eksempelet etterlater ubekreftede forvalg`,
    );
  }
});

/** Feltoppsett som ikke kan stemme, uansett innhold. */
test("feltene er satt opp konsistent", () => {
  for (const m of MALER) {
    for (const f of m.felt) {
      const id = `${m.slug}/${f.id}`;
      const erValg = f.type === "valg" || f.type === "flervalg";
      if (erValg) {
        assert.ok(f.valg?.length, `${id}: valgfelt uten valg`);
        assert.ok(
          !f.plassholder,
          `${id}: valgfelt har plassholder, som aldri vises`,
        );
        if (f.standard !== undefined) {
          assert.ok(
            f.valg?.includes(f.standard),
            `${id}: standard «${f.standard}» står ikke blant valgene`,
          );
        }
      } else {
        assert.ok(
          !f.valg,
          `${id}: ${f.type}-felt har en valg-liste ingen bruker`,
        );
      }
      if (f.type !== "dato") {
        assert.equal(
          f.eksempelDager,
          undefined,
          `${id}: eksempelDager på ${f.type}`,
        );
      } else {
        assert.ok(!f.plassholder, `${id}: datofelt har plassholder`);
      }
      assert.ok(
        !(f.grunnlag && f.paakrevd),
        `${id}: grunnlagsfelt kan ikke være påkrevd`,
      );
      assert.ok(f.etikett.trim().length > 0, `${id}: tom etikett`);
    }
  }
});
