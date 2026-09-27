import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { BlobNotFoundError, get, list, put } from "@vercel/blob";

import type { Rapport } from "@/content/rapporttype";

/**
 * Lagringen for rapportsenteret.
 *
 * ── SAMME BUTIKK SOM HUKOMMELSEN, EGEN MAPPE ──────────────────────────────
 *
 * Intranettet har ingen database utover Blob-butikken, og en rapport i uka
 * for én leser trenger ikke mer. Mappen `rapport/` holder dem for seg, slik
 * at `kunde/` og `laerdom/` kan listes uten å dra med seg dette.
 *
 * ── HVA SOM LAGRES SAMMEN MED RAPPORTEN ───────────────────────────────────
 *
 * Payloaden er avsenderens; alt Pål gjør med den er vårt. De ligger i samme
 * fil fordi de alltid leses sammen, og fordi et svar uten rapporten det
 * gjelder er verdiløst. Versjonene ligger der også: kommer samme `id` på
 * nytt, skal den forrige fortsatt kunne leses.
 *
 * ── INGEN TRANSAKSJONER, OG DET GÅR BRA ───────────────────────────────────
 *
 * Blob har ingen lås. To samtidige skrivinger mot samme fil kan overskrive
 * hverandre. Her er det én rapport i uka og én leser, så vinduet er
 * teoretisk — men det er verdt å vite før noen kobler på noe som skriver
 * oftere.
 */

const MAPPE = "rapport";
/** Så mange tidligere utgaver av samme rapport beholdes. */
const MAKS_VERSJONER = 10;

/*
 * ── EN LOKAL KOPI, KUN PÅ EN UTVIKLERMASKIN ───────────────────────────────
 *
 * Blob-butikken finnes bare i skyen. Uten noe å falle tilbake på kan
 * rapportsenteret ikke åpnes i det hele tatt lokalt — og da kan ingen se på
 * en skjerm før den er ute hos alle.
 *
 * Betingelsen er `NODE_ENV !== "production"`. Den er nok alene, og det er
 * samme resonnement som i utvikling.ts: Vercel bygger ALT med
 * NODE_ENV=production, også forhåndsvisninger. Døra finnes altså ikke i noe
 * som er deployet, uansett hvilke variabler som er satt.
 *
 * Filene havner i .rapportlager/, som er i .gitignore.
 */
function lokaltLager(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.BLOB_READ_WRITE_TOKEN) return null;
  return join(process.cwd(), ".rapportlager");
}

export function harLager(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) || lokaltLager() !== null;
}

export type Svar = "ja" | "nei" | "senere";

export type Beslutningssvar = {
  svar: Svar;
  kommentar: string;
  tidspunkt: string;
};

/** Ett steg Pål har krysset av. Indeksen peker inn i `rapport.steps`. */
export type Stegavkryssing = { indeks: number; tidspunkt: string };

export type Notat = { tekst: string; tidspunkt: string };

export type Lagret = {
  id: string;
  type: string;
  /** Hele payloaden, uendret. Se `lesRapport` for hvorfor. */
  payload: Record<string, unknown>;
  /** Den validerte lesningen, slik skjermene trenger den. */
  rapport: Rapport;
  mottatt: string;
  /** Tidligere utgaver av samme id, nyeste sist. */
  versjoner: { mottatt: string; payload: Record<string, unknown> }[];
  beslutning: Beslutningssvar | null;
  gjorteSteg: Stegavkryssing[];
  notater: Notat[];
};

/** Raden arkivet vises fra. Holdes liten så listen kan leses i ett kall. */
export type Indeksrad = {
  id: string;
  type: string;
  year: number;
  week: number;
  periode: string;
  niva: Rapport["verdict"]["level"];
  kort: string;
  emne: string;
  mottatt: string;
  test: boolean;
  harUbesvartBeslutning: boolean;
};

function sti(type: string, id: string): string {
  return `${MAPPE}/${trygg(type)}/${trygg(id)}.json`;
}

/**
 * Ingenting utenfra får forme en filsti.
 *
 * `id` og `type` kommer fra en payload vi ikke har skrevet. Uten denne
 * vaskingen kan «../» i en id peke ut av mappen og over noe annet.
 */
function trygg(del: string): string {
  return (
    del
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "ukjent"
  );
}

async function les<T>(p: string): Promise<T | null> {
  const lokal = lokaltLager();
  if (lokal) {
    try {
      return JSON.parse(await readFile(join(lokal, p), "utf8")) as T;
    } catch {
      return null;
    }
  }
  if (!harLager()) return null;
  try {
    const svar = await get(p, { access: "private", useCache: false });
    if (!svar) return null;
    return JSON.parse(await new Response(svar.stream).text()) as T;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    console.error("rapportlager: klarte ikke lese", p, e);
    return null;
  }
}

async function skriv(p: string, data: unknown): Promise<boolean> {
  const lokal = lokaltLager();
  if (lokal) {
    const mal = join(lokal, p);
    await mkdir(dirname(mal), { recursive: true });
    await writeFile(mal, JSON.stringify(data, null, 1), "utf8");
    return true;
  }
  if (!harLager()) return false;
  try {
    await put(p, JSON.stringify(data), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
    });
    return true;
  } catch (e) {
    console.error("rapportlager: klarte ikke skrive", p, e);
    return false;
  }
}

export async function hentRapport(
  type: string,
  id: string,
): Promise<Lagret | null> {
  return les<Lagret>(sti(type, id));
}

/**
 * Lagrer en innkommende rapport.
 *
 * Returnerer `nyy: true` når id-en ikke fantes fra før. Det er det eneste
 * som avgjør om det skal sendes påminnelse — en oppdatering av samme uke
 * skal ikke vekke noen på nytt.
 */
export async function lagreRapport(
  rapport: Rapport,
  payload: Record<string, unknown>,
): Promise<{ lagret: boolean; ny: boolean }> {
  const fra = await hentRapport(rapport.type, rapport.id);
  const naa = new Date().toISOString();

  const neste: Lagret = {
    id: rapport.id,
    type: rapport.type,
    payload,
    rapport,
    mottatt: fra?.mottatt ?? naa,
    versjoner: fra
      ? [
          ...fra.versjoner,
          { mottatt: fra.mottatt, payload: fra.payload },
        ].slice(-MAKS_VERSJONER)
      : [],
    /* Det Pål har gjort overlever en ny utgave av samme uke. */
    beslutning: fra?.beslutning ?? null,
    gjorteSteg: fra?.gjorteSteg ?? [],
    notater: fra?.notater ?? [],
  };

  const lagret = await skriv(sti(rapport.type, rapport.id), neste);
  if (lagret) await oppdaterIndeks(neste);
  return { lagret, ny: !fra };
}

/**
 * ── HVORFOR DET FINNES EN INDEKS ──────────────────────────────────────────
 *
 * Arkivet skal vise dommen for hver uke bakover. Uten indeks måtte det
 * lastet hver eneste rapportfil for å tegne én liste — femti filer for å
 * vise femti linjer. Indeksen er den listen, og den skrives på nytt hver
 * gang en rapport kommer inn.
 */
function indeksSti(): string {
  return `${MAPPE}/_indeks.json`;
}

export async function hentIndeks(): Promise<Indeksrad[]> {
  return (await les<Indeksrad[]>(indeksSti())) ?? [];
}

function radAv(l: Lagret): Indeksrad {
  return {
    id: l.id,
    type: l.type,
    year: l.rapport.year,
    week: l.rapport.week,
    periode: l.rapport.period.label,
    niva: l.rapport.verdict.level,
    kort: l.rapport.verdict.short,
    emne: l.rapport.subject,
    mottatt: l.mottatt,
    test: l.rapport.test,
    harUbesvartBeslutning: Boolean(l.rapport.decision) && !l.beslutning,
  };
}

async function oppdaterIndeks(l: Lagret): Promise<void> {
  const fra = await hentIndeks();
  const uten = fra.filter((r) => !(r.id === l.id && r.type === l.type));
  const neste = [...uten, radAv(l)].sort((a, b) =>
    b.mottatt.localeCompare(a.mottatt),
  );
  await skriv(indeksSti(), neste);
}

/** Skriver en endring Pål har gjort, og holder indeksen i takt. */
async function endre(
  type: string,
  id: string,
  endring: (l: Lagret) => Lagret,
): Promise<Lagret | null> {
  const fra = await hentRapport(type, id);
  if (!fra) return null;
  const neste = endring(fra);
  if (!(await skriv(sti(type, id), neste))) return null;
  await oppdaterIndeks(neste);
  return neste;
}

export async function svarPaaBeslutning(
  type: string,
  id: string,
  svar: Svar,
  kommentar: string,
): Promise<Lagret | null> {
  return endre(type, id, (l) => ({
    ...l,
    beslutning: {
      svar,
      kommentar: kommentar.trim().slice(0, 2000),
      tidspunkt: new Date().toISOString(),
    },
  }));
}

export async function settSteg(
  type: string,
  id: string,
  indeks: number,
  gjort: boolean,
): Promise<Lagret | null> {
  return endre(type, id, (l) => ({
    ...l,
    gjorteSteg: gjort
      ? l.gjorteSteg.some((s) => s.indeks === indeks)
        ? l.gjorteSteg
        : [...l.gjorteSteg, { indeks, tidspunkt: new Date().toISOString() }]
      : l.gjorteSteg.filter((s) => s.indeks !== indeks),
  }));
}

export async function leggTilNotat(
  type: string,
  id: string,
  tekst: string,
): Promise<Lagret | null> {
  const ren = tekst.trim().slice(0, 4000);
  if (!ren) return null;
  return endre(type, id, (l) => ({
    ...l,
    notater: [
      ...l.notater,
      { tekst: ren, tidspunkt: new Date().toISOString() },
    ],
  }));
}

/*
 * ── PÅMINNELSER SOM ALLEREDE ER SENDT ─────────────────────────────────────
 *
 * «Samme rapport eller påminnelse skal aldri sendes to ganger.» Uten et
 * sted å skrive det ned, er den regelen avhengig av at planleggeren aldri
 * kjører to ganger — og en planlegger som aldri kjører to ganger, finnes
 * ikke.
 *
 * Nøkkelen er hendelsen, ikke tidspunktet: «betalt-2026-W39:beslutning-24t»
 * kan bare sendes én gang uansett hvor mange ganger jobben våkner.
 */
function varselSti(): string {
  return `${MAPPE}/_sendt.json`;
}

export async function erSendt(nokkel: string): Promise<boolean> {
  const sendt = (await les<Record<string, string>>(varselSti())) ?? {};
  return Boolean(sendt[nokkel]);
}

export async function merkSendt(nokkel: string): Promise<void> {
  const sendt = (await les<Record<string, string>>(varselSti())) ?? {};
  sendt[nokkel] = new Date().toISOString();
  /* Et tak, så filen ikke vokser i det uendelige. */
  const par = Object.entries(sendt).sort((a, b) => b[1].localeCompare(a[1]));
  await skriv(varselSti(), Object.fromEntries(par.slice(0, 500)));
}

/*
 * ── INNSTILLINGER PER RAPPORTTYPE ─────────────────────────────────────────
 *
 * Grensene (2 000 / 3 000 / 25 %) hører hjemme her og ikke i koden, slik at
 * de kan endres uten en utrulling. Malen bruker sine egne i dag; disse er
 * fasit for det intranettet tegner, for eksempel grenselinjen i grafen.
 */
export type Innstillinger = {
  cplGrense: number;
  nullLeadForbruk: number;
  okningProsent: number;
};

export const STANDARDINNSTILLINGER: Innstillinger = {
  cplGrense: 2000,
  nullLeadForbruk: 3000,
  okningProsent: 25,
};

export async function hentInnstillinger(type: string): Promise<Innstillinger> {
  const lagret = await les<Partial<Innstillinger>>(
    `${MAPPE}/_innstillinger/${trygg(type)}.json`,
  );
  return { ...STANDARDINNSTILLINGER, ...(lagret ?? {}) };
}

/** Sletter alle testrapporter. Bestilt: de skal kunne fjernes samlet. */
export async function slettTestrapporter(): Promise<number> {
  if (!harLager()) return 0;
  const indeks = await hentIndeks();
  const tester = indeks.filter((r) => r.test);
  let slettet = 0;
  const lokal = lokaltLager();
  for (const r of tester) {
    try {
      if (lokal) {
        const { rm } = await import("node:fs/promises");
        await rm(join(lokal, sti(r.type, r.id)), { force: true });
      } else {
        const { del } = await import("@vercel/blob");
        await del(sti(r.type, r.id));
      }
      slettet += 1;
    } catch (e) {
      console.error("rapportlager: klarte ikke slette", r.id, e);
    }
  }
  await skriv(
    indeksSti(),
    indeks.filter((r) => !r.test),
  );
  return slettet;
}

/** Brukes av helsesjekken i utvikling, ikke av skjermene. */
export async function listRapportfiler(): Promise<string[]> {
  if (!harLager()) return [];
  try {
    const { blobs } = await list({ prefix: `${MAPPE}/`, mode: "expanded" });
    return blobs.map((b) => b.pathname);
  } catch {
    return [];
  }
}
