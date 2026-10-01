/**
 * Lager delingsbildene (og:image) for artiklene og casene.
 *
 * HVORFOR ET BILDE PER SIDE HER, OG IKKE ELLERS. Kommentaren i
 * `src/app/layout.tsx` sa at ett bilde for hele nettstedet var et valg, med
 * begrunnelsen at et bilde per side ville bety tjuefem bilder å holde i
 * live. Den begrunnelsen står for landingssidene: de nås via annonser og
 * søk, deles nesten aldri, og der er merkevarebildet riktigere enn et
 * motiv — kortet skal si hvem avsenderen er.
 *
 * Artiklene og casene er det motsatte. De er det folk limer inn i en
 * e-post, en Slack-tråd eller en LinkedIn-post for å vise noen noe, og da
 * er motivet poenget. De har dessuten allerede et toppbilde som er valgt
 * redaksjonelt til nettopp det temaet — så dette koster ingen nye motiver,
 * bare en beskjæring.
 *
 * BESKJÆRINGEN ER IKKE FRITT VALGT. `fokus` fra innholdet er den samme
 * verdien siden selv bruker i `object-position`, og den er satt ved å se på
 * bildet. Å beskjære til 1200×630 fra midten uten den ville kuttet hoder på
 * de samme bildene der vi alt har oppdaget at midten er feil.
 *
 * KJØRES FOR HÅND, ikke i bygget. ffmpeg er ikke en avhengighet i
 * prosjektet, og et bygg som trenger den ville feilet på Vercel. Filene er
 * sjekket inn. `content:check` har en vakt som sier fra når et motiv er
 * byttet uten at delingsbildet er laget på nytt.
 *
 *   FFMPEG=<sti til ffmpeg> node --experimental-strip-types scripts/og-bilder.ts
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { artikler } from "../src/content/artikler.ts";
import { kundecaser } from "../src/content/caser.ts";

const BREDDE = 1200;
const HOYDE = 630;
const UT = join(process.cwd(), "public/bilder/og");
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";

/**
 * Oversetter `fokus` til brøkene ffmpeg trenger.
 *
 * `object-position` oppgir hvor i BILDET punktet som skal være i midten av
 * utsnittet ligger — «center 30%» betyr 30 % ned. ffmpeg vil ha
 * venstre/topp-hjørnet av utsnittet, så andelen brukes til å plassere det
 * innenfor overskuddet: 30 % ned gir 0,3 av det som faller bort.
 */
function andeler(fokus?: string): { x: number; y: number } {
  const [vannrett = "center", loddrett = "center"] = (fokus ?? "").split(/\s+/);
  const tall = (v: string, standard: number) => {
    if (v === "center") return 0.5;
    if (v === "top" || v === "left") return 0;
    if (v === "bottom" || v === "right") return 1;
    const m = /^(\d+(?:\.\d+)?)%$/.exec(v);
    return m ? Number(m[1]) / 100 : standard;
  };
  return { x: tall(vannrett, 0.5), y: tall(loddrett, 0.5) };
}

function lag(kilde: string, mal: string, fokus?: string) {
  const { x, y } = andeler(fokus);
  /*
    `increase` skalerer til utsnittet DEKKER rammen, aldri mindre. Deretter
    kuttes overskuddet. Rekkefølgen er viktig: beskjærer man først, kan man
    ikke lenger skalere opp uten å miste skarphet.
  */
  const filter = [
    `scale=${BREDDE}:${HOYDE}:force_original_aspect_ratio=increase`,
    `crop=${BREDDE}:${HOYDE}:(iw-ow)*${x}:(ih-oh)*${y}`,
  ].join(",");
  execFileSync(
    ffmpeg,
    ["-y", "-loglevel", "error", "-i", kilde, "-vf", filter, "-q:v", "4", mal],
    { stdio: "inherit" },
  );
}

mkdirSync(UT, { recursive: true });

/*
  FASITEN, skrevet ved siden av bildene.

  Uten den ville et byttet toppbilde gitt et delingsbilde som fortsatt
  viste det gamle motivet, og ingenting ville sagt fra: filen finnes jo.
  Datostempler duger ikke som vakt — et git-utsjekk gir alle filer samme
  tid. Testen `tests/og-bilder.test.ts` sammenligner denne mot innholdet
  og feiler når de har glidd fra hverandre.
*/
const fasit: Record<string, { kilde: string; fokus?: string }> = {};

let laget = 0;
for (const a of artikler) {
  const kilde = join(process.cwd(), "public/arbeid", `${a.bilde.fil}.jpg`);
  if (!existsSync(kilde)) throw new Error(`Mangler motiv: ${kilde}`);
  lag(kilde, join(UT, `blogg-${a.slug}.jpg`), a.bilde.fokus);
  fasit[`blogg-${a.slug}`] = { kilde: a.bilde.fil, fokus: a.bilde.fokus };
  laget++;
}
for (const k of kundecaser) {
  const forste = k.kortbilder[0];
  if (!forste) throw new Error(`Caset ${k.slug} har ingen kortbilder`);
  const kilde = join(process.cwd(), "public/caser", `${forste.fil}.jpg`);
  if (!existsSync(kilde)) throw new Error(`Mangler motiv: ${kilde}`);
  lag(kilde, join(UT, `case-${k.slug}.jpg`), forste.fokus);
  fasit[`case-${k.slug}`] = { kilde: forste.fil, fokus: forste.fokus };
  laget++;
}

writeFileSync(join(UT, "kilder.json"), `${JSON.stringify(fasit, null, 2)}\n`);

console.log(`${laget} delingsbilder skrevet til public/bilder/og/`);
