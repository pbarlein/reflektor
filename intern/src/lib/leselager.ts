import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { BlobNotFoundError, get, put } from "@vercel/blob";

/**
 * Lesestatus som følger PERSONEN, ikke nettleseren.
 *
 * ── HVORFOR DENNE FILA MÅTTE FINNES ───────────────────────────────────────
 *
 * Statusen lå bare i en informasjonskapsel. Den overlevde en økt, men den
 * fulgte maskinen: ny laptop, annen nettleser eller privat vindu ga blanke
 * ark, og to som delte en maskin delte framdrift. Bestilt 28.09.2026:
 * intranettet «må huske hva som av lest av hvem, og det må lagres til neste
 * sesjon».
 *
 * Nå er butikken fasit og kapselen en hurtigbuffer. De to leses sammen, og
 * union-en vinner: har DU lest noe på telefonen, er det lest på laptopen
 * også, og en tom butikk kan aldri slette noe kapselen vet om.
 *
 * ── DETTE ENDRER PERSONVERNET, OG DET SKAL SIES HØYT ──────────────────────
 *
 * Før sto det uttrykkelig i lesing.ts at statusen aldri forlot maskinen og
 * at ingen kunne slå opp hvem som hadde lest hva. Det er ikke lenger sant.
 * Den ligger nå på server, nøklet på e-postadressen til den innloggede.
 *
 * Det er en direkte følge av bestillingen — «lest av hvem» KAN ikke lagres
 * per nettleser — og det er verdt å være tydelig på:
 *
 *   • Appen viser bare din egen status. Det finnes ingen skjerm, og ingen
 *     rute, som lister hva andre har lest.
 *   • Den som har tilgang til Blob-butikken kan likevel lese filene. Det er
 *     et vilkår ved å lagre det i det hele tatt, ikke en glipp.
 *   • Det lagres bare tall — rubrikknummer — og adressen til den de hører
 *     til. Ingen tidspunkter per rubrikk, ingen lesetid, ingenting om
 *     hvordan noe ble lest.
 *
 * Skal det bli en kvittering daglig leder kan slå opp i, er det en annen
 * beslutning og en annen samtale. Denne fila gjør det ikke.
 *
 * ── SAMME LOKALE UNNTAK SOM RAPPORTLAGERET ────────────────────────────────
 *
 * Blob finnes bare i skyen. Uten noe å falle tilbake på kan lesestatus ikke
 * prøves lokalt i det hele tatt. Betingelsen er `NODE_ENV !== "production"`,
 * som Vercel alltid setter — også for forhåndsvisninger — så døra finnes
 * ikke i noe som er deployet.
 */

const MAPPE = "lesing";

export type Leserad = {
  epost: string;
  /** Rubrikknumrene som er lest. Usortert; settet er det som betyr noe. */
  nr: number[];
  sist: string;
};

function lokaltLager(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.BLOB_READ_WRITE_TOKEN) return null;
  return join(process.cwd(), ".leselager");
}

function harLager(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) || lokaltLager() !== null;
}

/**
 * E-posten som filnavn.
 *
 * Adressen kommer fra vår egen Google-innlogging og er allerede begrenset
 * til ett domene, men den former en filsti, og da vaskes den uansett. En
 * adresse med «../» i seg skal ikke kunne peke ut av mappen.
 */
function sti(epost: string): string {
  const trygg =
    epost
      .toLowerCase()
      .replace(/[^a-z0-9@._-]+/g, "-")
      .slice(0, 120) || "ukjent";
  return `${MAPPE}/${trygg}.json`;
}

async function les(p: string): Promise<Leserad | null> {
  const lokal = lokaltLager();
  if (lokal) {
    try {
      return JSON.parse(await readFile(join(lokal, p), "utf8")) as Leserad;
    } catch {
      return null;
    }
  }
  if (!harLager()) return null;
  try {
    const svar = await get(p, { access: "private", useCache: false });
    if (!svar) return null;
    return JSON.parse(await new Response(svar.stream).text()) as Leserad;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    console.error("leselager: klarte ikke lese", p, e);
    return null;
  }
}

async function skriv(p: string, rad: Leserad): Promise<boolean> {
  const lokal = lokaltLager();
  if (lokal) {
    const mal = join(lokal, p);
    await mkdir(dirname(mal), { recursive: true });
    await writeFile(mal, JSON.stringify(rad, null, 1), "utf8");
    return true;
  }
  if (!harLager()) return false;
  try {
    await put(p, JSON.stringify(rad), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
    });
    return true;
  } catch (e) {
    console.error("leselager: klarte ikke skrive", p, e);
    return false;
  }
}

/** Hva denne personen har lest. Tomt sett når butikken ikke er satt opp. */
export async function lestAvPerson(epost: string): Promise<Set<number>> {
  const rad = await les(sti(epost));
  return new Set(rad?.nr ?? []);
}

/**
 * Legger til leste rubrikker for en person.
 *
 * Legger BARE til. En rubrikk som er lest, kan ikke bli ulest av at en
 * gammel fane sender inn et kortere sett — og det er den eneste måten
 * framdrift kan gå bakover på uten at noen har bedt om det.
 *
 * Returnerer hele settet etterpå, så den som kalte kan svare klienten med
 * fasit i stedet for med sin egen antakelse.
 */
export async function merkLest(
  epost: string,
  nye: Iterable<number>,
): Promise<Set<number>> {
  const p = sti(epost);
  const fra = await les(p);
  const sett = new Set(fra?.nr ?? []);
  for (const n of nye) {
    if (Number.isInteger(n) && n > 0) sett.add(n);
  }
  await skriv(p, {
    epost,
    nr: [...sett].sort((a, b) => a - b),
    sist: new Date().toISOString(),
  });
  return sett;
}
