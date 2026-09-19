/**
 * content:check (brief 8.2, LÅST).
 *
 * Feiler hvis en side merket ready: true inneholder én eneste TBD, eller hvis
 * en slot bryter tegn- eller ordgrensen sin. Kjøres i CI og blokkerer
 * produksjonsdeploy.
 *
 * Sider med ready: false rapporteres, men feiler ikke – de er under arbeid.
 *
 * ANDRE HALVDEL, LAGT TIL 19.09.2026. Slot-systemet dekker bare sidene i
 * src/content/sider/, og der ligger det per i dag én fil: front.ts. Appen
 * har 17 sider. All copy på de øvrige 16 – personvern, FAQ, om oss, casene,
 * anmeldelsene – ligger i egne filer som denne sjekken aldri så på.
 *
 * Hullet var ikke teoretisk. /personvern har tre bokstavelige
 * «TBD(...)»-strenger som ble servert til besøkende i produksjon, altså
 * nøyaktig det denne sjekken ble laget for å fange, mens den rapporterte
 * grønt. Derfor skannes nå HELE src/content for TBD-markører.
 *
 * De rapporteres, men feiler ikke: filene har ingen ready-flagg å henge
 * beslutningen på, og en hard feil ville blokkert alt annet arbeid. Den
 * avsluttende linja sier i stedet presist hva som ER kontrollert, slik at
 * et grønt resultat ikke kan leses som mer enn det er.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { alleSider } from "../src/content/sider/index.ts";
import type { Side, Slot } from "../src/content/sider/_slot.ts";

type Feil = { side: string; slot: string; grunn: string };

function sjekkSlot(id: string, slot: Slot, side: Side, feil: Feil[]) {
  if (slot.verdi === null) {
    if (side.ready) {
      feil.push({ side: side.sti, slot: id, grunn: "mangler copy (TBD)" });
    }
    return;
  }
  if (slot.maksTegn && slot.verdi.length > slot.maksTegn) {
    feil.push({
      side: side.sti,
      slot: id,
      grunn: `${slot.verdi.length} tegn, maks ${slot.maksTegn}`,
    });
  }
  if (slot.maksOrd) {
    const ord = slot.verdi.trim().split(/\s+/).length;
    if (ord > slot.maksOrd) {
      feil.push({
        side: side.sti,
        slot: id,
        grunn: `${ord} ord, maks ${slot.maksOrd}`,
      });
    }
  }
}

const feil: Feil[] = [];
const linjer: string[] = [];

for (const side of alleSider) {
  let totalt = 0;
  let fylt = 0;
  for (const seksjon of side.seksjoner) {
    for (const [id, slot] of Object.entries(seksjon.slots)) {
      totalt++;
      if (slot.verdi !== null) fylt++;
      sjekkSlot(id, slot, side, feil);
    }
  }
  const merke = side.ready ? "ready" : "under arbeid";
  linjer.push(
    `  ${side.sti.padEnd(26)} ${String(fylt).padStart(3)}/${String(totalt).padEnd(3)} slots  (${merke})`,
  );
}

console.log("\ncontent:check\n");
console.log(linjer.join("\n"));

if (feil.length > 0) {
  console.error(`\n✗ ${feil.length} feil:\n`);
  for (const f of feil) {
    console.error(`  ${f.side} · ${f.slot}: ${f.grunn}`);
  }
  console.error("");
  process.exit(1);
}

/* ── TBD-markører utenfor slot-systemet ───────────────────────────────── */

const ROT = "src/content";

/** Alle .ts-filer under src/content, unntatt selve slot-maskineriet. */
function innholdsfiler(katalog: string): string[] {
  const ut: string[] = [];
  for (const oppf of readdirSync(katalog, { withFileTypes: true })) {
    const sti = join(katalog, oppf.name);
    if (oppf.isDirectory()) ut.push(...innholdsfiler(sti));
    else if (oppf.name.endsWith(".ts") && oppf.name !== "_slot.ts") ut.push(sti);
  }
  return ut;
}

type Markor = { fil: string; linje: number; id: string };
const markorer: Markor[] = [];

for (const fil of innholdsfiler(ROT)) {
  // Slot-filene er allerede dekket over; her er vi ute etter TBD som står
  // som TEKST i en streng, ikke som TBD()-funksjonen.
  if (fil.includes(`${ROT}/sider/`)) continue;
  readFileSync(fil, "utf8")
    .split("\n")
    .forEach((linje, i) => {
      for (const treff of linje.matchAll(/TBD\(([^)]*)\)/g)) {
        markorer.push({ fil, linje: i + 1, id: treff[1].slice(0, 60) });
      }
    });
}

if (markorer.length > 0) {
  console.warn(`\n⚠  ${markorer.length} TBD-markører i innhold utenfor slot-systemet.`);
  console.warn("   Disse rendres som synlig tekst på siden.\n");
  for (const m of markorer) {
    console.warn(`   ${m.fil}:${m.linje}  TBD(${m.id})`);
  }
}

const antallSider = alleSider.length;
console.log(
  `\n✓ Ingen feil i slot-systemet: ${antallSider} side${antallSider === 1 ? "" : "r"} kontrollert ` +
    `(${alleSider.map((s) => s.sti).join(", ")}).`,
);
console.log(
  markorer.length > 0
    ? `  Øvrig innhold er IKKE dekket av grensene over, og har ${markorer.length} åpne TBD.\n`
    : "  Ingen TBD-markører i øvrig innhold heller.\n",
);
