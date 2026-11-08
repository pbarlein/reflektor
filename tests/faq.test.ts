import assert from "node:assert/strict";
import { test } from "node:test";

import {
  delAvsnitt,
  faqKategorier,
  faqSporsmal,
  forsidensSporsmal,
  forsidensSporsmalForMarkup,
  hentFaq,
} from "@/content/faq";
import { kr, tilbud } from "@/content/site";
import { seksjonerSomFaq, tjenestesider } from "@/content/tjenester";
import { artikler, somFaq } from "@/content/artikler";

/**
 * Vakt mot FAQPage-duplikater på tvers av URL-er.
 *
 * Google sier eksplisitt at samme spørsmål og svar ikke skal merkes opp som
 * FAQPage på flere sider på samme nettsted. Nettstedet har FAQPage på seksten
 * sider, og spørsmålene er skrevet av mennesker over flere uker — det er
 * nøyaktig den slags regel som brytes uten at noen ser det.
 *
 * ARTIKLENE TELLER MED BEGGE SINE KILDER: den håndskrevne `tilleggsfaq` og
 * den som utledes av spørsmålsoverskriftene i teksten.
 *
 * RETTET 29.09.2026. Her sto det at de utledede er «per definisjon unike for
 * artikkelen», og testen hoppet derfor over dem. Antakelsen var feil: to
 * prisartikler fikk begge overskriften «Hva koster det hos Reflektor?», og
 * dermed sto det samme FAQPage-spørsmålet på to URL-er uten at noe sa fra.
 * Utledningen (`somFaq`) er flyttet til artikler.ts nettopp så testen kan
 * kalle den samme funksjonen som bloggmalen rendrer.
 */
function alleKilder(): { side: string; sporsmal: string[] }[] {
  return [
    { side: "/", sporsmal: forsidensSporsmalForMarkup.map((p) => p.sporsmal) },
    { side: "/faq", sporsmal: faqSporsmal.map((p) => p.sporsmal) },
    /*
     * ALLE TJENESTESIDER, OG BEGGE KILDENE PÅ HVER.
     *
     * UTVIDET 01.10.2026. Lista her var skrevet for hånd og hadde fem av
     * sju sider — /kjeder og /reels-produksjon manglet, altså kunne de
     * innføre et duplikat uten at testen merket det. Nå leses den fra
     * `tjenestesider`, så en ny side er dekket i det den legges til.
     *
     * Samtidig tok markeringen bare `faq`-lista. Seksjonsoverskrifter som
     * er spørsmål går nå også inn, og da må testen lese den samme
     * funksjonen malen rendrer — samme lærdom som for bloggen 21.09.2026.
     */
    ...tjenestesider.map((t) => ({
      side: t.sti,
      sporsmal: [
        ...seksjonerSomFaq(t).map((p) => p.sporsmal),
        ...t.faq.map((p) => p.sporsmal),
      ],
    })),
    ...artikler.map((a) => ({
      side: `/blogg/${a.slug}`,
      sporsmal: [
        ...somFaq(a.blokker).map((p) => p.sporsmal),
        ...(a.tilleggsfaq ?? []).map((p) => p.sporsmal),
      ],
    })),
  ];
}

test("ingen FAQPage-spørsmål står på to sider", () => {
  const eiere = new Map<string, string[]>();

  for (const { side, sporsmal } of alleKilder()) {
    for (const s of sporsmal) {
      const n = s.trim().toLowerCase();
      eiere.set(n, [...(eiere.get(n) ?? []), side]);
    }
  }

  const doble = [...eiere.entries()].filter(([, sider]) => sider.length > 1);
  assert.deepEqual(
    doble.map(([s, sider]) => `${s} → ${sider.join(", ")}`),
    [],
  );
});

test("forsiden viser flere spørsmål enn den merker opp", () => {
  // Avviket er bestemt, ikke tilfeldig. Se src/content/faq.ts.
  assert.ok(forsidensSporsmal.length > forsidensSporsmalForMarkup.length);
});

test("alle forsidens egne spørsmål er med i markeringen", () => {
  // Filteret skal fjerne de fire fra /faq — ingenting annet.
  const egne = forsidensSporsmal.filter(
    (p) => !faqSporsmal.some((f) => f.sporsmal === p.sporsmal),
  );
  assert.deepEqual(
    forsidensSporsmalForMarkup.map((p) => p.sporsmal),
    egne.map((p) => p.sporsmal),
  );
});

/**
 * ── 09.11.2026: ENKELTPROSJEKTER ────────────────────────────────────
 *
 * Bakgrunnen er en motsetning som sto live. Forsiden og seks tjenestesider
 * sa at Reflektor tar enkeltprosjekter fra 40 000 kr; FAQ-en sa at vi ikke
 * selger enkeltoppdrag. ChatGPT hentet begge i Påls faktakontroll samme
 * dag. En språkmodell som finner to svar på nettstedet, velger selv.
 *
 * Testene under vokter de tre tingene som kan gli tilbake uten at noen ser
 * det: setningen som var feil, avgrensningen som fortsatt er sann, og at
 * markeringen sier det samme som siden.
 */

test("FAQ-en sier ikke lenger at vi ikke selger enkeltoppdrag", () => {
  const tekst = faqSporsmal.map((p) => `${p.sporsmal} ${p.svar}`).join("\n");
  assert.doesNotMatch(tekst, /ikke prøvepakker eller enkeltoppdrag/i);
  assert.doesNotMatch(tekst, /enkeltoppdrag/i);
});

test("avgrensningen vi faktisk har, står fortsatt", () => {
  const binding = faqSporsmal.find((p) =>
    p.sporsmal.startsWith("Er det bindingstid"),
  );
  assert.ok(binding, "spørsmålet om bindingstid er borte");
  // Abonnementet selges ikke som prøvepakke eller én enkelt dag. Det er en
  // annen sak enn et enkeltprosjekt, og det er distinksjonen svaret bærer.
  assert.match(
    binding.svar,
    /ikke som prøvepakke eller én enkelt produksjonsdag/,
  );
  assert.match(binding.svar, /tre måneder/);
});

test("enkeltprosjekter har sitt eget spørsmål, med fra-prisen", () => {
  const punkt = faqSporsmal.find((p) =>
    p.sporsmal.startsWith("Tar dere enkeltprosjekter"),
  );
  assert.ok(punkt, "spørsmålet om enkeltprosjekter mangler");
  assert.equal(punkt.kategori, "pris");
  assert.match(punkt.svar, new RegExp(`${kr(tilbud.fraPrisProsjekt)} kr`));
});

test("fra-prisen står i «Hva koster det?» også", () => {
  const pris = hentFaq("Hva koster det?");
  assert.match(pris.svar, new RegExp(`${kr(tilbud.fraPrisProsjekt)} kr`));
});

/**
 * LENKETEKST SOM IKKE FINNES ER EN STILLE FEIL. `delAvsnitt` lar avsnittet
 * stå som ren tekst når teksten ikke treffer — det er riktig oppførsel på
 * en levende side, og nettopp derfor må testen fange skrivefeilen i stedet.
 */
test("hver lenketekst finnes ordrett i svaret sitt", () => {
  for (const p of faqSporsmal) {
    for (const l of p.lenker ?? []) {
      assert.ok(
        p.svar.includes(l.tekst),
        `«${l.tekst}» finnes ikke i svaret på «${p.sporsmal}»`,
      );
      assert.ok(l.sti.startsWith("/"), `${l.sti} er ikke en intern sti`);
    }
  }
});

test("delAvsnitt deler på første forekomst og beholder teksten", () => {
  const lenke = {
    tekst: "siden om innholdsproduksjon",
    sti: "/innholdsproduksjon",
  };
  const deler = delAvsnitt(`Les mer på ${lenke.tekst}.`, [lenke]);
  assert.deepEqual(deler, ["Les mer på ", lenke, "."]);

  // Samme tekst to ganger: bare den første blir lenke.
  const to = delAvsnitt(`${lenke.tekst} og ${lenke.tekst}`, [lenke]);
  assert.deepEqual(to, [lenke, ` og ${lenke.tekst}`]);

  // Uten treff, og uten lenker i det hele tatt: avsnittet står urørt.
  assert.deepEqual(delAvsnitt("Ingen lenke her", [lenke]), ["Ingen lenke her"]);
  assert.deepEqual(delAvsnitt("Ingen lenke her"), ["Ingen lenke her"]);

  // Hele avsnittet er lenken: ingen tomme biter rundt.
  assert.deepEqual(delAvsnitt(lenke.tekst, [lenke]), [lenke]);
});

/**
 * MARKERINGEN SKAL VÆRE SIDEN. Antallet er det billigste målet på at de to
 * ikke har glidd fra hverandre: siden rendrer `faqSporsmal` gruppert, og
 * markeringen sender samme liste flat.
 */
test("markeringen sender nøyaktig de spørsmålene siden viser", () => {
  const kjente = new Set(faqKategorier.map((k) => k.id));
  for (const p of faqSporsmal) {
    assert.ok(p.kategori, `«${p.sporsmal}» mangler kategori og vises ikke`);
    assert.ok(kjente.has(p.kategori), `ukjent kategori på «${p.sporsmal}»`);
  }
  assert.equal(faqSporsmal.length, 20);
});
