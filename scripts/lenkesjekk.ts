/**
 * Lenkesjekk (brief 8.1.2).
 *
 * Finner interne lenker i kildekoden som verken treffer en rute eller en
 * redirect. En død intern lenke er en lekkasje i konverteringsstien, og på en
 * side der skjemaleads er eneste KPI koster den direkte.
 *
 * Sjekker kilden, ikke det bygde nettstedet: da fanges feilen før deploy.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import nextConfig from "../next.config.ts";

const APP = "src/app";

/** Alle statiske ruter, utledet av mappestrukturen i app/. */
function finnRuter(katalog: string, prefiks = ""): string[] {
  const ruter: string[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (!statSync(sti).isDirectory()) continue;
    // Ruteguppper og private mapper gir ingen URL-segment
    if (navn.startsWith("_") || navn.startsWith("(")) continue;
    const segment = navn.startsWith("[") ? null : `${prefiks}/${navn}`;
    if (segment) {
      if (readdirSync(sti).some((f) => f.startsWith("page."))) ruter.push(segment);
      ruter.push(...finnRuter(sti, segment));
    }
  }
  return ruter;
}

function finnFiler(katalog: string): string[] {
  const filer: string[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) filer.push(...finnFiler(sti));
    else if (/\.(tsx|ts)$/.test(navn)) filer.push(sti);
  }
  return filer;
}

const ruter = new Set(["/", ...finnRuter(APP)]);

const omdirigeringer = await (nextConfig.redirects?.() ?? Promise.resolve([]));
const redirectKilder = new Set(
  omdirigeringer.map((r) => ("source" in r ? r.source : "")),
);

// Dynamiske ruter tillates som prefiks: /vart-arbeid/<hva som helst>
const dynamiske = ["/vart-arbeid/", "/blogg/", "/tjenester/"];

type Funn = { fil: string; lenke: string };
const doede: Funn[] = [];

for (const fil of finnFiler("src")) {
  const innhold = readFileSync(fil, "utf8");
  for (const treff of innhold.matchAll(/href="(\/[^"#?]*)"/g)) {
    const lenke = treff[1].replace(/\/$/, "") || "/";
    if (ruter.has(lenke)) continue;
    if (redirectKilder.has(lenke)) continue;
    if (dynamiske.some((d) => treff[1].startsWith(d))) continue;
    doede.push({ fil, lenke: treff[1] });
  }
}

console.log(`\nlenkesjekk\n\n  ${ruter.size} ruter, ${redirectKilder.size} redirects\n`);

if (doede.length > 0) {
  console.error(`✗ ${doede.length} døde interne lenker:\n`);
  for (const d of doede) console.error(`  ${d.fil}: ${d.lenke}`);
  console.error("");
  process.exit(1);
}

console.log("✓ Ingen døde interne lenker.\n");
