/**
 * Markeringssjekk: VideoObject-feltene Google krever, og pekere uten mål.
 *
 * HVORFOR DEN LESER DET BYGDE HTML-ET og ikke kilden. Markeringen settes
 * sammen av tre lag — innholdsfilene, layouten og Schema.tsx — og feilen
 * 08.10.2026 oppsto mellom dem: `uploadDate` var valgfri i typen, så atten
 * VideoObject på sju sider gikk uten. Hvert lag så riktig ut for seg. Det
 * eneste stedet feilen er synlig, er i det Google faktisk får.
 *
 * TO TING SJEKKES.
 *
 * 1. HVERT VideoObject HAR FELTENE SOM KREVES: `uploadDate`, `name`,
 *    `description`, `thumbnailUrl` og `contentUrl`. Mangler `uploadDate`,
 *    gir Google ingen videoresultater i det hele tatt, og markeringen er
 *    uten virkning i søk. Search Console melder den som «URL is on Google,
 *    but has issues».
 *
 * 2. INGEN BAR `@id`-PEKER UTEN EN NODE Å PEKE PÅ. Her lå den andre feilen
 *    Search Console meldte: `creator: { "@id": ".../#organisasjon" }` er
 *    riktig JSON-LD bare når noden med den id-en finnes i samme graf, og
 *    den fantes kun på forsiden. På alle andre sider så Google en tom
 *    Thing. En peker som OGSÅ har `@type` er selvforklarende og går fri —
 *    det er den formen vi bruker nå.
 *
 * KJØRES ETTER `next build`, fordi den leser `.next/server/app`. Står det
 * ingen HTML der, er det en feil i seg selv: da har bygget ikke
 * forhåndsrendret sidene, og sjekken ville stilltiende godkjent alt.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BYGG = ".next/server/app";

/** Feltene Google krever på et VideoObject for å gi videoresultater. */
const PAAKREVD = [
  "uploadDate",
  "name",
  "description",
  "thumbnailUrl",
  "contentUrl",
] as const;

type Node = Record<string, unknown>;

function htmlFiler(katalog: string): string[] {
  const ut: string[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) ut.push(...htmlFiler(sti));
    else if (navn.endsWith(".html")) ut.push(sti);
  }
  return ut;
}

/** HTML-entitetene JSON-LD-en kan ha blitt escapet med i markupen. */
function avEscape(t: string): string {
  return t
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Alle noder i et JSON-LD-tre, uansett hvor dypt de ligger. */
function noder(verdi: unknown, ut: Node[] = []): Node[] {
  if (Array.isArray(verdi)) for (const v of verdi) noder(v, ut);
  else if (verdi && typeof verdi === "object") {
    ut.push(verdi as Node);
    for (const v of Object.values(verdi as Node)) noder(v, ut);
  }
  return ut;
}

const feil: string[] = [];
let filmer = 0;
let sider = 0;

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

for (const fil of filer) {
  const html = readFileSync(fil, "utf8");
  /*
    `[\s\S]` I STEDET FOR FLAGGET `s`. Prosjektets tsconfig sikter mot et
    mål der `s` ikke finnes, og en regex som ikke kompilerer er en sjekk
    som ikke kjører.
  */
  const blokker = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  if (!blokker.length) continue;
  sider += 1;

  const alle: Node[] = [];
  for (const b of blokker) {
    try {
      alle.push(...noder(JSON.parse(avEscape(b[1]!))));
    } catch (e) {
      feil.push(`${fil}: JSON-LD lar seg ikke lese (${String(e)})`);
    }
  }

  /* Node-er som faktisk ER noe: de har både @id og @type. */
  const erklaert = new Set(
    alle
      .filter((n) => typeof n["@id"] === "string" && n["@type"])
      .map((n) => n["@id"] as string),
  );

  for (const n of alle) {
    if (n["@type"] === "VideoObject") {
      filmer += 1;
      const mangler = PAAKREVD.filter((f) => !n[f]);
      if (mangler.length) {
        feil.push(
          `${fil}: VideoObject «${String(n.name ?? "uten navn")}» mangler ${mangler.join(", ")}`,
        );
      }
    }

    /* En bar peker: @id uten @type. Den må ha en node å peke på. */
    const id = n["@id"];
    if (typeof id === "string" && !n["@type"] && !erklaert.has(id)) {
      feil.push(
        `${fil}: peker på «${id}», men ingen node med den @id-en finnes på siden. Gi pekeren @type, eller rendre noden her.`,
      );
    }
  }
}

if (feil.length) {
  console.error("✗ Feil i markeringen:\n");
  for (const f of feil) console.error(`  ${f}`);
  console.error(`\n${feil.length} feil.`);
  process.exit(1);
}

console.log(
  `✓ Markeringen er hel: ${filmer} VideoObject på ${sider} sider, ingen pekere uten mål.`,
);
