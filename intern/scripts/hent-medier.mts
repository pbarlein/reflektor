/**
 * Kopierer media fra hovedprosjektets /public til intranettets
 * /public/medier.
 *
 * HVORFOR IKKE BARE SJEKKE INN FILENE HER. docs/media.md i hovedprosjektet
 * sier det rett ut: «git lagrer hver versjon av en binærfil for alltid –
 * også slettede». Klippene og bildene er rundt 15 MB. Å legge en kopi til i
 * historikken for å slippe et byggesteg, er å betale for alltid for å spare
 * ett sekund.
 *
 * Mappa er i .gitignore. Skriptet kjører på `predev` og `prebuild`, så den
 * finnes alltid når noe skal serveres — også på Vercel, som sjekker ut hele
 * repoet før det bygger i rotmappa dette prosjektet står i.
 *
 * IDEMPOTENT: filer som allerede finnes med samme størrelse hoppes over.
 * Det gjør `npm run dev` rask fra andre gang.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const her = dirname(fileURLToPath(import.meta.url));
const rot = resolve(her, "..");
const kilde = resolve(rot, "..", "public");
const mal = join(rot, "public", "medier");

/** Undermappene vi trenger. Resten av hovedprosjektets /public er irrelevant. */
const MAPPER = ["reels", "arbeid"] as const;

if (!existsSync(kilde)) {
  /*
   * Ikke et kast. Prosjektet skal kunne bygges alene — for eksempel i en
   * sjekk som bare henter denne mappa. Da står kortene uten bilde, og det
   * er en dårligere side, ikke en ødelagt en.
   */
  console.warn(
    `[medier] Fant ikke ${kilde}. Hopper over. Kortene vises uten media.`,
  );
  process.exit(0);
}

let kopiert = 0;
let hoppet = 0;

for (const mappe of MAPPER) {
  const fra = join(kilde, mappe);
  if (!existsSync(fra)) continue;
  const til = join(mal, mappe);
  mkdirSync(til, { recursive: true });

  for (const fil of readdirSync(fra)) {
    if (!/\.(mp4|jpg|jpeg|png|webp)$/i.test(fil)) continue;
    const kildefil = join(fra, fil);
    const malfil = join(til, fil);
    if (
      existsSync(malfil) &&
      statSync(malfil).size === statSync(kildefil).size
    ) {
      hoppet++;
      continue;
    }
    cpSync(kildefil, malfil);
    kopiert++;
  }
}

console.log(
  `[medier] ${kopiert} kopiert, ${hoppet} allerede på plass → public/medier/`,
);
