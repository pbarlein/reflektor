import assert from "node:assert/strict";
import { test } from "node:test";

import {
  faqSporsmal,
  forsidensSporsmal,
  forsidensSporsmalForMarkup,
} from "@/content/faq";
import {
  innholdsproduksjon,
  reklamefilm,
  videoproduksjon,
  employerBranding,
  event,
} from "@/content/tjenester";
import { artikler } from "@/content/artikler";

/**
 * Vakt mot FAQPage-duplikater på tvers av URL-er.
 *
 * Google sier eksplisitt at samme spørsmål og svar ikke skal merkes opp som
 * FAQPage på flere sider på samme nettsted. Nettstedet har FAQPage på seksten
 * sider, og spørsmålene er skrevet av mennesker over flere uker — det er
 * nøyaktig den slags regel som brytes uten at noen ser det.
 *
 * Artiklenes FAQ er BARE den håndskrevne (`tilleggsfaq`). Den som utledes av
 * spørsmålsoverskrifter i selve teksten bygges i bloggmalen og er per
 * definisjon unik for artikkelen.
 */
function alleKilder(): { side: string; sporsmal: string[] }[] {
  return [
    { side: "/", sporsmal: forsidensSporsmalForMarkup.map((p) => p.sporsmal) },
    { side: "/faq", sporsmal: faqSporsmal.map((p) => p.sporsmal) },
    ...[
      ["/innholdsproduksjon", innholdsproduksjon],
      ["/reklamefilm", reklamefilm],
      ["/videoproduksjon-i-oslo", videoproduksjon],
      ["/employer-branding-video-oslo", employerBranding],
      ["/eventfotograf-eventvideo", event],
    ].map(([sti, t]) => ({
      side: sti as string,
      sporsmal: (t as typeof reklamefilm).faq.map((p) => p.sporsmal),
    })),
    /*
     * Bare den HÅNDSKREVNE tilleggs-FAQ-en. Den som utledes av artikkelens
     * egne spørsmålsoverskrifter bygges i bloggmalen, og er per definisjon
     * unik for artikkelen den står i.
     */
    ...artikler.map((a) => ({
      side: `/blogg/${a.slug}`,
      sporsmal: (a.tilleggsfaq ?? []).map((p) => p.sporsmal),
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
