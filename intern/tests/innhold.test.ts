import assert from "node:assert/strict";
import test from "node:test";

import { KATEGORIER } from "../src/content/kategorier.ts";
import { I_DRIFT, RUBRIKKER } from "../src/content/rubrikker/index.ts";
import { lesetid } from "../src/lib/lesetid.ts";
import { lesBrief } from "../src/content/brieftype.ts";

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
    const ider = r.innhold.filter((b) => b.type === "seksjon").map((b) => b.id);
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

/**
 * En rubrikk i drift er en fasit noen følger på en produksjonsdag. Da skal
 * påstandene i den kunne følges tilbake til noe som ikke er oss.
 *
 * Testen gjelder BARE rubrikker i drift. Utkast til gjennomgang får ligge
 * uten kilder — det er nettopp det gjennomgangen er til for.
 */
test("hver rubrikk i drift oppgir minst én kilde", () => {
  for (const r of I_DRIFT) {
    assert.ok(
      r.kilder && r.kilder.length > 0,
      `${r.slug} er i drift uten en eneste kilde`,
    );
  }
});

test("kilder har tittel, url og sjekkdato", () => {
  const dato = /^\d{4}-\d{2}-\d{2}$/;
  for (const r of RUBRIKKER) {
    for (const k of r.kilder ?? []) {
      assert.ok(
        k.tittel.trim().length > 10,
        `${r.slug}: kildetittel er for kort`,
      );
      assert.ok(
        k.url.startsWith("https://"),
        `${r.slug}: kilde uten https-lenke (${k.url})`,
      );
      assert.match(
        k.sjekket,
        dato,
        `${r.slug}: ugyldig sjekkdato (${k.sjekket})`,
      );
    }
  }
});

/**
 * Lesetiden regnes, men den kan fortsatt bli tullete hvis noen endrer
 * formelen. To til tjue minutter er rammen: under to er ikke verdt en
 * lenke, over tjue er ikke en rubrikk lenger.
 */
test("regnet lesetid ligger innenfor to og tjue minutter", () => {
  for (const r of RUBRIKKER) {
    const min = lesetid(r);
    assert.ok(
      Number.isInteger(min) && min >= 2 && min <= 20,
      `${r.slug} får lesetid ${min}`,
    );
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
      assert.ok(
        d.konto.length > 0 && !d.konto.startsWith("@"),
        `${r.slug}: konto skal være brukernavn uten krøllalfa`,
      );
      assert.ok(
        Number.isInteger(d.visninger) && d.visninger > 0,
        `${r.slug}: visninger mangler eller er ikke et heltall`,
      );
      assert.ok(
        Number.isInteger(d.likes) && d.likes > 0,
        `${r.slug}: likes mangler eller er ikke et heltall`,
      );
      assert.match(
        d.hentet,
        /^\d{4}-\d{2}-\d{2}$/,
        `${r.slug}: «hentet» må være en ISO-dato`,
      );
      assert.ok(
        d.seEtter.length > 40,
        `${r.slug}: «se etter» må si noe konkret, ikke bare navngi teknikken`,
      );

      /*
       * HVEM SELSKAPET ER, OG HVOR STORT DET ER.
       *
       * Eksemplene skal komme fra selskaper som selger et produkt eller en
       * tjeneste, og fra konti som er blant de beste i verden på dette.
       * Ingen av delene kan en test avgjøre alene — men den kan kreve at
       * påstanden STÅR DER, i en form leseren kan etterprøve selv ved å
       * åpne kontoen.
       *
       * Følgertallet er dokumentert på samme måte som visningstallet:
       * hentet, ikke anslått. Grensen på hundre tusen er ikke magisk. Den
       * er der for å stoppe det som vil skje ellers — at noen finner et
       * fint klipp fra en liten konto og kaller det verdensklasse.
       */
      assert.ok(
        d.hvem.length > 40,
        `${r.slug}: «hvem» må si hva selskapet selger, ikke bare navnet`,
      );
      assert.ok(
        Number.isInteger(d.folgere) && d.folgere > 100_000,
        `${r.slug}: følgertallet mangler, eller kontoen er for liten til å kalles verdensklasse`,
      );
    }
  }
});

test("ingen post brukes som eksempel to steder", () => {
  /*
   * Samme video i to rubrikker er ikke en teknisk feil, men det er en
   * faglig en. Et eksempel skal vise ÉN ting, og den som møter det samme
   * klippet igjen tre rubrikker senere, slutter å lese «se etter»-teksten
   * — den har jo allerede sagt hva videoen handler om.
   *
   * Dette fanget ikke noe da det ble skrevet. Det er meningen: det står
   * her for å fange den dagen en travel produsent gjenbruker det letteste
   * eksempelet i stedet for å finne et nytt.
   */
  const sett = new Map<string, string>();
  for (const r of RUBRIKKER) {
    for (const b of r.innhold) {
      if (b.type !== "eksempel") continue;
      const fra = sett.get(b.data.url);
      assert.ok(
        fra === undefined,
        `${r.slug}: samme post er allerede brukt i ${fra} — ${b.data.url}`,
      );
      sett.set(b.data.url, r.slug);
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

/**
 * ── STRATEGILENKA BLIR EN KNAPP, OG DA MÅ DEN VÆRE EKTE ───────────────────
 *
 * `brief.strategi` rendres som en lenke produsenten klikker på. Modellen har
 * fått beskjed om ikke å konstruere en lenke, men en instruks er ikke en
 * garanti — og en `javascript:`-lenke eller et domene som bare ligner på
 * canva.com, er en åpen dør i et panel folk stoler på.
 */
test("bare ekte canva-lenker slipper gjennom som SoMe-strategi", () => {
  const poster = [
    { id: "1", emne: "e", fra: "f", dato: "2026-09-01", tekst: "t" },
  ];

  const godtatt = [
    "https://www.canva.com/design/DAF123/view",
    "https://canva.com/design/DAF123",
  ];
  for (const url of godtatt) {
    assert.equal(
      lesBrief({ funn: [], strategi: url }, poster)?.strategi,
      url,
      url,
    );
  }

  const avvist = [
    "javascript:alert(1)",
    "http://www.canva.com/design/DAF123",
    "https://canva.com.angriper.no/design",
    "https://ikkecanva.com/design",
    "https://notcanva.com/x",
    "canva.com/design/DAF123",
    "",
    42,
  ];
  for (const url of avvist) {
    assert.equal(
      lesBrief({ funn: [], strategi: url }, poster)?.strategi,
      "",
      `${String(url)} skulle vært avvist`,
    );
  }
});
