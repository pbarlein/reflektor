import assert from "node:assert/strict";
import test from "node:test";

import { KATEGORIER } from "../src/content/kategorier.ts";
import { RUBRIKKER } from "../src/content/rubrikker/index.ts";

/**
 * Innholdet er data, og data kan være feil på måter typene ikke fanger.
 *
 * Testene her dekker det som ser riktig ut i en editor og er galt i
 * nettleseren: et anker som ikke finnes, en mediefil som ikke er referert
 * riktig, en tabellrad med for få celler. Alt sammen ting som gir en side
 * som RENDRER, men som er ødelagt for den som leser den.
 */
test("alle oppsummeringspunkter peker på en seksjon som finnes", () => {
  for (const r of RUBRIKKER) {
    const ankre = new Set(
      r.innhold.filter((b) => b.type === "seksjon").map((b) => b.id),
    );
    for (const p of r.oppsummering) {
      assert.ok(
        ankre.has(p.anker),
        `${r.slug}: «${p.tekst}» peker på «${p.anker}» som ikke finnes`,
      );
    }
  }
});

test("hver rubrikk har minst tre oppsummeringspunkter", () => {
  // Under tre er ikke en oppsummering, det er en overskrift til.
  for (const r of RUBRIKKER) {
    assert.ok(
      r.oppsummering.length >= 3,
      `${r.slug} har bare ${r.oppsummering.length} punkter`,
    );
  }
});

test("seksjons-id-er er unike innenfor hver rubrikk", () => {
  for (const r of RUBRIKKER) {
    const ider = r.innhold
      .filter((b) => b.type === "seksjon")
      .map((b) => b.id);
    assert.equal(
      new Set(ider).size,
      ider.length,
      `${r.slug} har gjentatte seksjons-id-er`,
    );
  }
});

test("tabeller har like mange celler som kolonner i hver rad", () => {
  for (const r of RUBRIKKER) {
    for (const b of r.innhold) {
      if (b.type !== "tabell") continue;
      for (const rad of b.rader) {
        assert.equal(
          rad.length,
          b.kolonner.length,
          `${r.slug}: tabellrad «${rad[0]}» har ${rad.length} celler, ikke ${b.kolonner.length}`,
        );
      }
    }
  }
});

test("mediestier peker inn i /medier uten filendelse", () => {
  for (const r of RUBRIKKER) {
    assert.match(
      r.medie.fil,
      /^(reels|arbeid)\/[a-z0-9-]+$/,
      `${r.slug} har mediesti «${r.medie.fil}»`,
    );
    assert.ok(r.medie.alt.length > 10, `${r.slug} mangler ordentlig alt-tekst`);
  }
});

test("alt-tekst navngir ikke kunder", () => {
  /*
   * AGENTS.md: produksjonskunder navngis aldri som SoMe-abonnenter. Filnavn
   * som `egon` og `peppes1-1600` er kundenavn; alt-teksten skal beskrive
   * BILDET. Denne testen fanger at noen kopierer filnavnet inn i alt-feltet.
   */
  const kundenavn = [
    "egon",
    "peppes",
    "soulcake",
    "zeroh",
    "battery",
    "goretex",
    "the well",
    "thewell",
    "anton",
    "gekko",
  ];
  for (const r of RUBRIKKER) {
    const alt = r.medie.alt.toLowerCase();
    for (const navn of kundenavn) {
      assert.ok(
        !alt.includes(navn),
        `${r.slug}: alt-teksten inneholder kundenavnet «${navn}»`,
      );
    }
  }
});

test("hver kategori har minst tre rubrikker", () => {
  // En rad med to kort ser ut som en feil, ikke som en kategori.
  for (const k of KATEGORIER) {
    const antall = RUBRIKKER.filter((r) => r.kategori === k.id).length;
    assert.ok(antall >= 3, `${k.id} har bare ${antall} rubrikker`);
  }
});

test("godkjent innhold oppgir alltid kilde", () => {
  for (const r of RUBRIKKER.filter((x) => x.godkjent)) {
    assert.ok(r.kilde, `${r.slug} er godkjent uten å si hvor den kommer fra`);
  }
});

test("ansvarlig er en rolle, ikke et personnavn", () => {
  // Å tildele en navngitt kollega en oppgave hen ikke har sagt ja til, er
  // ikke vårt å gjøre. Se rubrikktype.ts.
  const roller = new Set([
    "Produsent",
    "Redigerer",
    "Kundeansvarlig",
    "Daglig leder",
  ]);
  for (const r of RUBRIKKER) {
    assert.ok(
      roller.has(r.ansvarlig),
      `${r.slug} har ansvarlig «${r.ansvarlig}», som ikke er en kjent rolle`,
    );
  }
});

test("eksempler har permalenke, konto, tall og dato", () => {
  /*
   * Poenget med eksempelblokken er at «denne presterte godt» skal være
   * etterprøvbart. Da må URL-en peke på en reel som kan åpnes, kontoen må
   * stå der, tallene må være tall — og datoen må finnes, fordi et
   * visningstall uten dato blir feil av seg selv etter hvert som det
   * vokser.
   */
  for (const r of RUBRIKKER) {
    for (const b of r.innhold) {
      if (b.type !== "eksempel") continue;
      const d = b.data;
      assert.match(
        d.url,
        /^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/$/,
        `${r.slug}: «${d.url}» er ikke en reel-permalenke`,
      );
      assert.ok(d.konto.length > 0 && !d.konto.startsWith("@"),
        `${r.slug}: konto skal være brukernavn uten krøllalfa`);
      assert.ok(Number.isInteger(d.visninger) && d.visninger > 0,
        `${r.slug}: visninger mangler eller er ikke et heltall`);
      assert.ok(Number.isInteger(d.likes) && d.likes > 0,
        `${r.slug}: likes mangler eller er ikke et heltall`);
      assert.match(d.hentet, /^\d{4}-\d{2}-\d{2}$/,
        `${r.slug}: «hentet» må være en ISO-dato`);
      assert.ok(d.seEtter.length > 40,
        `${r.slug}: «se etter» må si noe konkret, ikke bare navngi teknikken`);
    }
  }
});

test("eksempler bruker ikke Reflektors egen konto", () => {
  /*
   * Eksemplene i fagartiklene skal vise HÅNDVERKET, ikke oss. Bruker vi
   * vårt eget arbeid til å forklare en teknikk, binder vi forklaringen til
   * én måte å gjøre det på — og fagbiblioteket blir en portefølje.
   *
   * Vårt eget arbeid hører hjemme på forsiden og på kortene, der det
   * bygger stolthet. Ikke her.
   */
  for (const r of RUBRIKKER) {
    for (const b of r.innhold) {
      if (b.type !== "eksempel") continue;
      assert.ok(
        !/reflektor/i.test(b.data.konto),
        `${r.slug}: eksempelet bruker Reflektors egen konto`,
      );
    }
  }
});

