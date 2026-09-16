/**
 * Lenkesjekk (brief 8.1.2).
 *
 * Finner interne lenker i kildekoden som verken treffer en rute eller en
 * redirect. En død intern lenke er en lekkasje i konverteringsstien, og på en
 * side der skjemaleads er eneste KPI koster den direkte.
 *
 * Sjekker kilden, ikke det bygde nettstedet: da fanges feilen før deploy.
 *
 * SJEKKER OGSÅ MEDIEFILER, og det er ikke pynt. 16.09.2026 slettet jeg
 * `dag4-1600.jpg` som «ubrukt» etter å ha grepet i arbeid.ts alene. Filen lå
 * i page.tsx. Prisseksjonen — seksjonen som faktisk kvalifiserer kunden —
 * viste en tom boks på den deployede siden til Pål oppdaget det.
 *
 * En død `src` er dyrere enn en død `href`: en død lenke merkes når noen
 * klikker, et manglende bilde er et hull som står der hele tiden. Denne
 * sjekken ville tatt den på under et sekund.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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

/*
 * Mediefiler: alt som peker inn i public/ fra kildekoden.
 *
 * Fanger både `src="/arbeid/x.jpg"`, `poster="/reels/y.jpg"` og strengene
 * komponentene bygger av datafilene — derfor matches også bare-strenger som
 * starter med et av mediekatalognavnene. Malstrenger med ${...} hoppes over;
 * de kan ikke løses uten å kjøre koden, og de dekkes av at datafilene selv
 * lister filnavnene.
 */
const MEDIEKATALOGER = ["/arbeid/", "/reels/", "/bilder/"];
const mangler: Funn[] = [];

for (const fil of finnFiler("src")) {
  const innhold = readFileSync(fil, "utf8");
  for (const treff of innhold.matchAll(/["'`](\/[a-z0-9æøå._/-]+\.(?:jpg|jpeg|png|webp|avif|svg|mp4|webm))["'`]/gi)) {
    const sti = treff[1];
    if (!MEDIEKATALOGER.some((k) => sti.startsWith(k))) continue;
    if (existsSync(`public${sti}`)) continue;
    mangler.push({ fil, lenke: sti });
  }
}

/*
 * Datafilene navngir mediene uten filendelse, så de må sjekkes for seg.
 * Uten dette ville en slettet fil som bare er referert fra content/ sluppet
 * gjennom — og det var nøyaktig det som skjedde.
 */
const { veggrader, arbeidskolonner } = await import("../src/content/arbeid.ts");
for (const c of veggrader.flat()) {
  const forventet =
    c.type === "foto"
      ? [`public/arbeid/${c.fil}-vegg.jpg`]
      : [`public/arbeid/${c.fil}.mp4`, `public/arbeid/${c.fil}.jpg`];
  for (const f of forventet)
    if (!existsSync(f)) mangler.push({ fil: "src/content/arbeid.ts (vegg)", lenke: f });
}
for (const c of arbeidskolonner.flat()) {
  const forventet =
    c.type === "foto"
      ? [`public/arbeid/${c.fil}-1600.jpg`]
      : [`public/reels/${c.fil}.mp4`, `public/reels/${c.fil}.jpg`];
  for (const f of forventet)
    if (!existsSync(f)) mangler.push({ fil: "src/content/arbeid.ts (rutenett)", lenke: f });
}

const { reels } = await import("../src/content/reels.ts");
for (const r of reels)
  for (const f of [`public/reels/${r.fil}.mp4`, `public/reels/${r.fil}.jpg`])
    if (!existsSync(f)) mangler.push({ fil: "src/content/reels.ts", lenke: f });

/*
 * Logoene refereres med `/logoer/${l.id}.png`, altså en malstreng.
 * Regexen over ser bare bokstavelige stier og ville sluppet en manglende
 * logofil rett gjennom — samme hull som tok prisseksjonen.
 */
const { kundelogoer } = await import("../src/content/logoer.ts");
for (const l of kundelogoer) {
  const f = `public/logoer/${l.id}.png`;
  if (!existsSync(f)) mangler.push({ fil: "src/content/logoer.ts", lenke: f });
}

/*
 * MOTSATT VEI: mediefiler som ingen refererer til.
 *
 * Sjekken over fanger referanser uten fil. Denne fanger fil uten referanse.
 * Begge oppstår av samme grunn — media byttes ut — men de koster ulikt: en
 * manglende fil er et synlig hull, en foreldreløs fil er bare bortkastede
 * bytes i deployen. Derfor er dette en ADVARSEL og ikke en feil.
 *
 * Den er også en advarsel fordi heuristikken kan ta feil: den leter etter
 * filstammen som streng i src/, og en fil som refereres på en måte den ikke
 * kjenner igjen ville blitt meldt uten grunn. Å felle bygget på den
 * usikkerheten er ikke verdt det.
 *
 * Fant fire filer første gang den kjørte — to klipp som ble byttet ut med
 * et stillbilde i kontaktseksjonen.
 */
const MEDIEMAPPER = ["public/reels", "public/arbeid", "public/logoer"];
const foreldrelose: string[] = [];
const allKilde = finnFiler("src")
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

for (const mappe of MEDIEMAPPER) {
  if (!existsSync(mappe)) continue;
  for (const navn of readdirSync(mappe)) {
    const stamme = navn
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/-(vegg|1600|640)$/, "");
    if (allKilde.includes(`"${stamme}"`)) continue;
    if (allKilde.includes(`/${navn}`)) continue;
    foreldrelose.push(`${mappe}/${navn}`);
  }
}

console.log(`\nlenkesjekk\n\n  ${ruter.size} ruter, ${redirectKilder.size} redirects\n`);

if (foreldrelose.length > 0) {
  console.warn(`⚠ ${foreldrelose.length} mediefiler uten referanse (advarsel):\n`);
  for (const f of foreldrelose) console.warn(`  ${f}`);
  console.warn("");
}

if (doede.length > 0) {
  console.error(`✗ ${doede.length} døde interne lenker:\n`);
  for (const d of doede) console.error(`  ${d.fil}: ${d.lenke}`);
  console.error("");
  process.exit(1);
}

if (mangler.length > 0) {
  console.error(`✗ ${mangler.length} mediefiler mangler i public/:\n`);
  for (const m of mangler) console.error(`  ${m.fil}: ${m.lenke}`);
  console.error("");
  process.exit(1);
}

console.log("✓ Ingen døde interne lenker, ingen manglende mediefiler.\n");
