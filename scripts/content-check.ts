/**
 * content:check (brief 8.2, LÅST).
 *
 * Feiler hvis en side merket ready: true inneholder én eneste TBD, eller hvis
 * en slot bryter tegn- eller ordgrensen sin. Kjøres i CI og blokkerer
 * produksjonsdeploy.
 *
 * Sider med ready: false rapporteres, men feiler ikke – de er under arbeid.
 */
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

console.log("\n✓ Ingen feil. Sider merket ready har all copy innenfor grensene.\n");
