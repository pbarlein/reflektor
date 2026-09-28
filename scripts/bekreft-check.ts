/**
 * Vakt mot `[BEKREFT: …]`-plassholdere.
 *
 * HVORFOR DE FINNES. AGENTS.md: «Ikke finn på copy, tall, kundenavn, priser
 * eller resultater.» Når en side trenger en påstand vi ikke har kilde til,
 * skrives den som `[BEKREFT: spørsmålet Pål må svare på]` i stedet for å
 * gjettes. Plassholderen er synlig i preview — det er hele poenget, den skal
 * være umulig å overse for den som ser siden.
 *
 * HVORFOR DEN MÅ STOPPE BYGGEN. En synlig plassholder er bare synlig for den
 * som faktisk åpner siden. `[BEKREFT: samme team]` på en live tjenesteside er
 * verre enn manglende tekst: det ser ut som en feil, og det er en påstand vi
 * ikke kan belegge. Derfor feiler denne sjekken, og CI stopper merge.
 *
 * FORSKJELLEN FRA content:check. Den vokter slot-systemet på forsiden og
 * TBD-markørene der. Denne leser HELE src/content/ og leter etter ett
 * mønster. De overlapper ikke, og TBD og BEKREFT betyr ikke det samme: TBD er
 * copy som ikke er levert, BEKREFT er en påstand som venter på bekreftelse.
 *
 * SLIK FJERNES EN: få svaret fra Pål, skriv det inn, slett klammene.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MAPPER = ["src/content", "src/app", "src/components"];
const MONSTER = /\[BEKREFT:[^\]]*\]/g;

function finnFiler(katalog: string): string[] {
  const ut: string[] = [];
  for (const navn of readdirSync(katalog)) {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) ut.push(...finnFiler(sti));
    else if (/\.(ts|tsx)$/.test(navn)) ut.push(sti);
  }
  return ut;
}

const funn: { fil: string; linje: number; tekst: string }[] = [];

for (const mappe of MAPPER) {
  for (const fil of finnFiler(mappe)) {
    // Denne fila inneholder mønsteret i sin egen dokumentasjon.
    if (fil.endsWith("bekreft-check.ts")) continue;
    const linjer = readFileSync(fil, "utf8").split("\n");
    linjer.forEach((linje, i) => {
      for (const treff of linje.match(MONSTER) ?? []) {
        funn.push({ fil, linje: i + 1, tekst: treff });
      }
    });
  }
}

console.log("\nbekreft-check\n");

if (funn.length === 0) {
  console.log("✓ Ingen [BEKREFT]-plassholdere. Alt innhold har kilde.\n");
  process.exit(0);
}

console.error(
  `✗ ${funn.length} plassholder${funn.length === 1 ? "" : "e"} venter på svar fra Pål:\n`,
);
for (const f of funn) {
  console.error(`  ${f.fil}:${f.linje}`);
  console.error(`    ${f.tekst}\n`);
}
console.error(
  "Disse er synlige i preview med vilje, men de skal ikke til produksjon.\n" +
    "Få svaret, skriv det inn, og slett klammene.\n",
);
process.exit(1);
