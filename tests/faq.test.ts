import assert from "node:assert/strict";
import { test } from "node:test";

import {
  faqSporsmal,
  forsidensSporsmal,
  forsidensSporsmalForMarkup,
} from "@/content/faq";
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
