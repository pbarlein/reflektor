/**
 * Metasjekk: lengden på <title> og <meta name="description"> slik Google
 * faktisk får dem.
 *
 * HVORFOR DEN FINNES. Den samme feilen er rettet for hånd fem ganger mellom
 * 01.10 og 25.10.2026: en tittel blir for lang og Google kutter den midt i
 * et ord. 01.10 ble 79 tegn kuttet midt i «firmaarrangement». 14.10 ble to
 * titler på 69 og 68 tegn rettet. 25.10 ble to til rettet — og samme dag
 * viste en måling mot live at forsiden, /innholdsproduksjon og /reklamefilm
 * fortsatt lå på 65–67.
 *
 * ÅRSAKEN ER AT INGEN MÅLTE DET SOM BLE PUBLISERT. Forsidens tittel har en
 * uttrykkelig grense — `maksTegn: 60` i content/sider/front.ts — og
 * strengen der er 53 tegn og går fri. Malen i layout.tsx legger på
 * « | Reflektor» etterpå, og de tolv tegnene har aldri vært med i noen
 * sjekk. Tjenestesidene har ingen grense i det hele tatt.
 *
 * DERFOR LESER DENNE SJEKKEN DET BYGDE HTML-ET, som markeringssjekken og av
 * samme grunn: det er det eneste stedet tittelen finnes ferdig satt sammen.
 * Et lag av gangen så riktig ut i fem runder.
 *
 * GRENSENE. Google kutter titler rundt 580 piksler og beskrivelser rundt
 * 920. Tegn er en tilnærming til piksler, ikke en fasit — derfor er
 * grensene satt der de fleste titler fortsatt vises helt, ikke der den
 * aller lengste mulige gjør det:
 *
 * - TITTEL: 60 tegn. Over det blir den som regel kuttet.
 * - BESKRIVELSE: 160 tegn. Over det blir den som regel kuttet.
 *
 * EN KUTTET BESKRIVELSE ER IKKE EN FEIL PÅ LINJE MED EN KUTTET TITTEL, og
 * den stopper derfor ikke CI — den advarer. Google skriver uansett om
 * beskrivelsen i over halvparten av tilfellene. Tittelen er det som
 * bestemmer om noen klikker.
 *
 * KJØRES ETTER `next build`. Står det ingen HTML i .next/server/app, er det
 * en feil i seg selv: da har bygget ikke forhåndsrendret sidene, og sjekken
 * ville stilltiende godkjent alt.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BYGG = ".next/server/app";

/** Over dette kutter Google tittelen for de fleste. */
const MAKS_TITTEL = 60;
/** Over dette kutter Google beskrivelsen for de fleste. */
const MAKS_BESKRIVELSE = 160;

function htmlFiler(katalog: string): string[] {
  const ut: string[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) ut.push(...htmlFiler(sti));
    else if (navn.endsWith(".html")) ut.push(sti);
  }
  return ut;
}

/**
 * Teksten slik en leser ser den.
 *
 * TEGN, IKKE BYTES. «å» og «–» er flere bytes hver, og en lengde målt i
 * bytes ville meldt feil på titler som er helt greie. `[...tekst].length`
 * teller kodepunkter.
 *
 * ENTITETENE MÅ TILBAKE FØRST. Markupen har `&amp;` og `&#x27;`, som er
 * fem og seks tegn i filen og ett i SERP-en.
 */
function synligLengde(rå: string): number {
  const tekst = rå
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2013;/g, "–")
    .replace(/&amp;/g, "&");
  return [...tekst].length;
}

/** Stien siden svarer på, utledet av filnavnet i bygget. */
function sti(fil: string): string {
  const s = fil.slice(BYGG.length).replace(/\.html$/, "");
  return s === "/index" ? "/" : s;
}

/**
 * Next sine egne feilsider er ikke sider noen kan besøke.
 *
 * `/_global-error` og `/_not-found` rendres til HTML i bygget som alt
 * annet, men de har ingen URL, står ikke i sitemapet og kan ikke komme i
 * et søkeresultat. Å kreve en meta description av dem ville vært en feil
 * ingen kunne rette.
 */
function egenFeilside(p: string): boolean {
  return p.startsWith("/_");
}

let filer: string[];
try {
  filer = htmlFiler(BYGG);
} catch {
  console.error(
    `✗ Fant ikke ${BYGG}. Kjør «npm run build» først — denne sjekken leser det bygde HTML-et.`,
  );
  process.exit(1);
}

if (!filer.length) {
  console.error(`✗ Ingen HTML i ${BYGG}. Bygget har ikke rendret noen sider.`);
  process.exit(1);
}

const feil: string[] = [];
const advarsler: string[] = [];
let sider = 0;

for (const fil of filer) {
  const html = readFileSync(fil, "utf8");
  const p = sti(fil);

  if (egenFeilside(p)) continue;

  const tittel = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const beskrivelse =
    /<meta name="description" content="([^"]*)"/.exec(html)?.[1];

  /*
    EN SIDE UTEN <title> ER EN FEIL. Den får da filnavnet i fanen og
    URL-en i SERP-en. /takk er ikke noe unntak: den er `noindex`, men den
    vises i nettleserfanen som alle andre.
  */
  if (tittel === undefined) {
    feil.push(`${p}: ingen <title>`);
    continue;
  }

  sider++;

  const n = synligLengde(tittel);
  if (n > MAKS_TITTEL) {
    feil.push(`${p}: tittelen er ${n} tegn (maks ${MAKS_TITTEL}) — «${tittel}»`);
  }

  if (beskrivelse === undefined) {
    feil.push(`${p}: ingen meta description`);
  } else {
    const m = synligLengde(beskrivelse);
    if (m > MAKS_BESKRIVELSE) {
      advarsler.push(`${p}: beskrivelsen er ${m} tegn (maks ${MAKS_BESKRIVELSE})`);
    }
  }
}

console.log("\nmetasjekk\n");

for (const a of advarsler) console.log(`  ⚠ ${a}`);
if (advarsler.length) console.log("");

if (feil.length) {
  console.error(`✗ ${feil.length} feil:\n`);
  for (const f of feil) console.error(`  ${f}`);
  console.error(
    "\nTittelen settes i innholdsfilen, og malen i layout.tsx legger på" +
      " « | Reflektor». Regn med de tolv tegnene.\n",
  );
  process.exit(1);
}

console.log(
  `✓ Alle ${sider} titler er innenfor ${MAKS_TITTEL} tegn, og alle sider har en beskrivelse.`,
);
