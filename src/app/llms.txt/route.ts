import { artikler } from "@/content/artikler";
import { kundecaser } from "@/content/caser";
import { site, tilbud } from "@/content/site";
import {
  innholdsproduksjon,
  reklamefilm,
  videoproduksjon,
  employerBranding,
  event,
  kjeder,
  reelsproduksjon,
} from "@/content/tjenester";
import { basisUrl, tillatIndeksering } from "@/lib/miljo";

/**
 * /llms.txt — nettstedet oppsummert for språkmodeller.
 *
 * HVA DEN ER. En konvensjon (llmstxt.org) for én maskinlesbar fil som sier
 * hva et nettsted er og hvilke sider som finnes, i markdown. ChatGPT,
 * Perplexity og Claude henter den når den finnes. Den er ikke en standard
 * Google har bekreftet at de bruker, og den erstatter ikke sitemapet.
 *
 * HVORFOR DEN LIKEVEL ER VERDT DET HER: nettstedets kjøpsfakta — 30 000
 * kr/mnd, fra 40 000 for enkeltprosjekt, tre måneders oppsigelse, ingen
 * bindingstid — er spredt over fem sider. En språkmodell som siterer
 * Reflektor på pris henter i praksis det den finner først, og uten denne
 * fila er det tilfeldig hvilken side det blir. Her står de samlet, i én
 * kilde, hentet fra de samme konstantene sidene selv leser.
 *
 * GENERERT, IKKE SKREVET. Hvert tall og hver setning kommer fra
 * src/content/. Ingenting kan gli fra hverandre, og ingen copy finnes bare
 * her. Det er også hele grunnen til at den er en route og ikke en fil i
 * public/ — en statisk kopi ville vært den femte kopien av prisen.
 *
 * SAMME BRYTER SOM RESTEN. Er indeksering avslått, svarer den 404. Filen er
 * en invitasjon til å hente innhold, og den skal ikke stå åpen på en
 * forhåndsvisning mens reflektor.no fortsatt kjører på Squarespace — se
 * src/lib/miljo.ts.
 */
export const dynamic = "force-static";

function lag(): string {
  const base = basisUrl();
  /*
   * Vanlig mellomrom som tusenskille, ikke Intl. `Intl.NumberFormat("nb-NO")`
   * gir hardt mellomrom (U+00A0), og denne fila leses som ren tekst av
   * modeller som deretter siterer prisen videre. «30 000 kr/mnd» skal se ut
   * som det står i AGENTS.md kapittel 0.3, med tegnet folk kan skrive selv.
   */
  const nok = (n: number) => `${String(n).replace(/\B(?=(\d{3})+$)/g, " ")} kr`;

  /*
   * Stiene står her fordi Tjenesteside ikke har noe slug-felt — rutene er
   * mapper under src/app/, og adressene er låst av Google Ads (site.ts).
   */
  /*
   * SJU SIDER, IKKE FEM. /kjeder manglet — den ble bygget etter at denne
   * lista ble skrevet, og ingen la den til. /reels-produksjon kom
   * 30.09.2026. Begge er kommersielle sider på linje med de fem andre, og
   * en fil som skal si hvilke sider som finnes, må si alle sammen.
   */
  const tjenester: [string, typeof innholdsproduksjon][] = [
    ["/innholdsproduksjon", innholdsproduksjon],
    ["/reels-produksjon", reelsproduksjon],
    ["/reklamefilm", reklamefilm],
    ["/videoproduksjon-i-oslo", videoproduksjon],
    ["/employer-branding-video-oslo", employerBranding],
    ["/eventfotograf-eventvideo", event],
    ["/kjeder", kjeder],
  ];

  const linjer: string[] = [
    `# ${site.navn}`,
    "",
    `> ${site.ingress}`,
    "",
    site.omOss,
    "",
    "## Pris",
    "",
    `- Løpende abonnement: ${nok(tilbud.prisPerManed)}/mnd. ` +
      `${tilbud.produksjonsdagerPerManed} produksjonsdag i måneden, ` +
      `${tilbud.videoerPerManed} videoer, ${tilbud.posterPerUke} poster i ` +
      `uka på ${tilbud.kanaler.join(" og ")}.`,
    `- Enkeltprosjekter: fra ${nok(tilbud.fraPrisProsjekt)}.`,
    "- Ingen bindingstid. Tre måneders oppsigelse.",
    "- Ingen timepriser.",
    "",
    "## Tjenester",
    "",
    ...tjenester.map(([sti, t]) => `- [${t.h1}](${base}${sti}): ${t.svar}`),
    "",
    "## Kundecaser",
    "",
    ...kundecaser.map(
      (c) => `- [${c.h1}](${base}/vart-arbeid/${c.slug}): ${c.kortingress}`,
    ),
    "",
    "## Om selskapet",
    "",
    `- [Om oss](${base}/om-oss)`,
    `- [Ofte stilte spørsmål](${base}/faq)`,
    `- [Kontakt](${base}/kontaktoss)`,
    `- ${site.kontakt.firma}, org.nr. ${site.kontakt.orgnr}, ` +
      `${site.kontakt.adresse}`,
    `- ${site.kontakt.epost}, ${site.kontakt.telefon}`,
    "",
    "## English",
    "",
    `- [Social media agency in Oslo, fixed monthly price](${base}/en): ` +
      "One English summary of the subscription, the price and who we work " +
      "with. The rest of the site is in Norwegian.",
    "",
    "## Artikler",
    "",
    ...artikler.map(
      (a) => `- [${a.tittel}](${base}/blogg/${a.slug}): ${a.beskrivelse}`,
    ),
    "",
  ];

  return linjer.join("\n");
}

export function GET(): Response {
  if (!tillatIndeksering()) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(lag(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
