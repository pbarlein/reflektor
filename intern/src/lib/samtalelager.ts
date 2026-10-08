import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type Anthropic from "@anthropic-ai/sdk";
import { BlobNotFoundError, get, put } from "@vercel/blob";

/**
 * Samtalen om én rapport, lagret per person.
 *
 * ── HVORFOR DEN LAGRES I DET HELE TATT ────────────────────────────────────
 *
 * Samtalen er et arbeidslogg, ikke en søkeboks. «Hva ble vi enige om på
 * mandag» er hele poenget med å ha den under stegene i stedet for i en
 * egen fane. En samtale som forsvinner når fanen lukkes, er en samtale
 * ingen tør bruke til noe.
 *
 * ── HELE INNHOLDET LAGRES, OGSÅ TENKEBLOKKENE ─────────────────────────────
 *
 * Opus 5.5 binder tenkeblokker til samtalen de ble laget i, og sjekker at
 * historikken ikke er redigert. Lagrer vi bare teksten og sender den
 * tilbake, er historikken endret, og blokkene blir forkastet — i verste
 * fall med en 400. Derfor lagres `response.content` uendret, med
 * tenkeblokker og verktøykall, og det er det som sendes tilbake neste tur.
 *
 * Konsekvensen er at vi BARE legger til. Ingenting i historikken skrives
 * om. Skal samtalen kortes ned, starter man en ny.
 *
 * ── PER PERSON, SOM LESESTATUSEN ──────────────────────────────────────────
 *
 * Nøklet på e-post, ikke delt. Rapportsenteret har én leser i dag, men en
 * samtale er et annet slags innhold enn en avkryssing: den kan inneholde
 * halvtenkte vurderinger om kunder og folk. Den skal ikke dukke opp hos
 * neste person som får lesetilgang.
 */

const MAPPE = "samtale";

/**
 * Så mange meldinger beholdes. Ti runder fram og tilbake med verktøykall
 * er rikelig for en ukesrapport, og taket hindrer at en samtale vokser
 * til et Blob-objekt ingen klarer å laste.
 */
export const MAKS_MELDINGER = 60;

export type Melding = Anthropic.MessageParam;

export type Samtale = {
  meldinger: Melding[];
  oppdatert: string;
};

/* Samme fallback som rapportlager: uten den kan ingenting åpnes lokalt. */
function lokaltLager(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.BLOB_READ_WRITE_TOKEN) return null;
  return join(process.cwd(), ".samtalelager");
}

/** Ingenting utenfra får forme en filsti. Se `rapportlager.trygg`. */
function trygg(del: string): string {
  return (
    del
      .toLowerCase()
      .replace(/[^a-z0-9@._-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "ukjent"
  );
}

function sti(type: string, id: string, epost: string): string {
  return `${MAPPE}/${trygg(type)}/${trygg(id)}/${trygg(epost)}.json`;
}

async function les(p: string): Promise<Samtale | null> {
  const lokal = lokaltLager();
  if (lokal) {
    try {
      return JSON.parse(await readFile(join(lokal, p), "utf8")) as Samtale;
    } catch {
      return null;
    }
  }
  if (!harSamtalelager()) return null;
  try {
    /* Samme form som rapportlager.les — `get` gir en strøm, ikke JSON. */
    const svar = await get(p, { access: "private", useCache: false });
    if (!svar) return null;
    return JSON.parse(await new Response(svar.stream).text()) as Samtale;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    console.error("samtalelager: klarte ikke lese", p, e);
    return null;
  }
}

async function skriv(p: string, s: Samtale): Promise<void> {
  const lokal = lokaltLager();
  if (lokal) {
    const fil = join(lokal, p);
    await mkdir(dirname(fil), { recursive: true });
    await writeFile(fil, JSON.stringify(s), "utf8");
    return;
  }
  await put(p, JSON.stringify(s), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function harSamtalelager(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) || lokaltLager() !== null;
}

export async function hentSamtale(
  type: string,
  id: string,
  epost: string,
): Promise<Melding[]> {
  const s = await les(sti(type, id, epost));
  return s?.meldinger ?? [];
}

/**
 * Er dette en ekte brukermelding, eller er det verktøysvar?
 *
 * ── FEILEN DEN FINNES FOR ─────────────────────────────────────────────────
 *
 * En verktøyrunde er to meldinger: assistenten med `tool_use`, og en
 * BRUKERMELDING med `tool_result`. Kutter man historikken midt mellom dem,
 * står det igjen en historikk som begynner med et verktøysvar på et kall
 * som ikke finnes — og API-et svarer 400.
 *
 * Første utgave lette bare etter `role === "user"` og traff nøyaktig den
 * meldingen. Her skilles de to: en melding med `tool_result` i seg er
 * maskineri, ikke et sted en samtale kan begynne.
 */
function erEkteBrukermelding(m: Melding): boolean {
  if (m.role !== "user") return false;
  if (typeof m.content === "string") return true;
  return !m.content.some((b) => b.type === "tool_result");
}

/**
 * Skriver samtalen.
 *
 * Kuttingen tar de ELDSTE meldingene, og den starter alltid på en ekte
 * brukermelding. Finnes det ingen i det som er igjen, er hele resten en
 * halv verktøyrunde, og da er det riktigere å beholde ingenting enn å
 * lagre noe API-et vil avvise ved neste tur.
 */
export async function lagreSamtale(
  type: string,
  id: string,
  epost: string,
  meldinger: Melding[],
): Promise<void> {
  let beholdt = meldinger.slice(-MAKS_MELDINGER);
  if (beholdt.length < meldinger.length || !erEkteBrukermelding(beholdt[0])) {
    const forste = beholdt.findIndex(erEkteBrukermelding);
    beholdt = forste === -1 ? [] : beholdt.slice(forste);
  }

  await skriv(sti(type, id, epost), {
    meldinger: beholdt,
    oppdatert: new Date().toISOString(),
  });
}

export async function slettSamtale(
  type: string,
  id: string,
  epost: string,
): Promise<void> {
  await skriv(sti(type, id, epost), {
    meldinger: [],
    oppdatert: new Date().toISOString(),
  });
}
