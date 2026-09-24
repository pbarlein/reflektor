import { BlobNotFoundError, get, put } from "@vercel/blob";

import type { Research } from "@/content/researchtype";

/**
 * Hukommelsen.
 *
 * ── HVA DEN ER FOR ────────────────────────────────────────────────────────
 *
 * Bestilt 24.09.2026: intranettet skal huske fra økt til økt, slik at
 * produsentene får bedre dokumenter mens vi holder på.
 *
 * To ting lagres, og de har hver sin nytte:
 *
 * 1. RESEARCHEN PER KUNDE. Den koster søk og tjue sekunder hver gang. Det
 *    Jordbærpikene driver med, endrer seg ikke mellom en produksjonsplan i
 *    oktober og en opptaksliste i november. Lagret research gjenbrukes til
 *    den er gammel, og produsenten kan alltid be om en ny.
 *
 * 2. RETTELSENE. Samme rettelse tre ganger er ikke en rettelse — det er en
 *    regel som mangler i malen. Uten et sted å telle dem, er den innsikten
 *    avhengig av at én person husker. Se docs/malforbedringer.md.
 *
 * ── HVORFOR DEN KAN VÆRE BORTE ────────────────────────────────────────────
 *
 * Lagringen er en Blob-butikk i Vercel, og uten `BLOB_READ_WRITE_TOKEN`
 * finnes den ikke. Da skal ALT virke som før: researchen kjøres hver gang,
 * rettelsene telles ikke, og ingenting feiler. Hukommelse er en forbedring,
 * ikke en forutsetning — nøyaktig som API-nøkkelen var det for generatoren.
 *
 * Derfor svelger hver funksjon her sine egne feil. En generator som stopper
 * fordi en logglinje ikke lot seg skrive, er verre enn ingen logg.
 */

export function harHukommelse(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Researchen regnes som fersk i en måned. «Ferskt» eldes fortere enn resten. */
export const FERSK_I_DAGER = 30;

export type Kundeminne = {
  navn: string;
  research?: Research;
  /** Dokumenter vi har laget for kunden. Nyeste sist. */
  dokumenter: { mal: string; dato: string }[];
  sistSett: string;
};

export type Rettelsesminne = {
  mal: string;
  /** Rettelser som er bedt om, med hvor mange ganger. */
  rettelser: { tekst: string; antall: number; sist: string }[];
};

/*
 * Nøklene er filstier i butikken, og de bygges av kundenavn som kommer fra
 * et fritekstfelt. Uten denne vaskingen kan «../» i et kundenavn peke ut av
 * mappen.
 */
function nokkel(del: string): string {
  return (
    del
      .toLowerCase()
      .replaceAll("æ", "ae")
      .replaceAll("ø", "oe")
      .replaceAll("å", "aa")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "uten-navn"
  );
}

async function les<T>(sti: string): Promise<T | null> {
  if (!harHukommelse()) return null;
  try {
    /*
     * `get` gir null når blobben ikke finnes — noen versjoner kaster
     * BlobNotFoundError i stedet. Begge håndteres, for ellers avhenger
     * hukommelsen av hvilken minorversjon som er installert.
     */
    const svar = await get(sti, { access: "private", useCache: false });
    if (!svar) return null;
    return JSON.parse(await new Response(svar.stream).text()) as T;
  } catch (e) {
    /* Ikke funnet er det normale første gang, ikke en feil verdt å melde. */
    if (e instanceof BlobNotFoundError) return null;
    console.error("hukommelse: klarte ikke lese", sti, e);
    return null;
  }
}

async function skriv(sti: string, data: unknown): Promise<void> {
  if (!harHukommelse()) return;
  try {
    await put(sti, JSON.stringify(data), {
      access: "private",
      contentType: "application/json",
      /* Samme sti skal overskrives. Uten dette feiler andre skriving. */
      allowOverwrite: true,
      addRandomSuffix: false,
    });
  } catch (e) {
    console.error("hukommelse: klarte ikke skrive", sti, e);
  }
}

export async function hentKunde(navn: string): Promise<Kundeminne | null> {
  return les<Kundeminne>(`kunde/${nokkel(navn)}.json`);
}

/** Er researchen fortsatt fersk nok til å brukes uten å slå opp på nytt? */
export function ferskNok(research: Research | undefined): boolean {
  if (!research?.hentet) return false;
  const alder = Date.now() - new Date(research.hentet).getTime();
  return alder >= 0 && alder < FERSK_I_DAGER * 24 * 60 * 60 * 1000;
}

export async function husKunde(
  navn: string,
  endring: { research?: Research; dokument?: string },
): Promise<void> {
  const sti = `kunde/${nokkel(navn)}.json`;
  const fra = (await les<Kundeminne>(sti)) ?? {
    navn,
    dokumenter: [],
    sistSett: new Date().toISOString(),
  };

  await skriv(sti, {
    ...fra,
    navn,
    research: endring.research ?? fra.research,
    dokumenter: endring.dokument
      ? [
          ...fra.dokumenter,
          { mal: endring.dokument, dato: new Date().toISOString() },
        ].slice(-50)
      : fra.dokumenter,
    sistSett: new Date().toISOString(),
  } satisfies Kundeminne);
}

/**
 * Teller en rettelse.
 *
 * Teksten normaliseres før den sammenlignes, ellers blir «kort ned
 * tidsplanen» og «Kort ned tidsplanen.» to forskjellige rettelser, og
 * ingenting når noen gang tre.
 */
export async function husRettelse(mal: string, tekst: string): Promise<void> {
  const ren = tekst.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
  if (ren.length < 4) return;

  const sti = `laerdom/${nokkel(mal)}.json`;
  const fra = (await les<Rettelsesminne>(sti)) ?? { mal, rettelser: [] };

  const nå = new Date().toISOString();
  const treff = fra.rettelser.find((r) => r.tekst === ren);
  if (treff) {
    treff.antall += 1;
    treff.sist = nå;
  } else {
    fra.rettelser.push({ tekst: ren, antall: 1, sist: nå });
  }

  /* Hyppigst først, og et tak så filen ikke vokser i det uendelige. */
  fra.rettelser.sort((a, b) => b.antall - a.antall || b.sist.localeCompare(a.sist));
  await skriv(sti, { mal, rettelser: fra.rettelser.slice(0, 200) });
}

export async function hentRettelser(mal: string): Promise<Rettelsesminne | null> {
  return les<Rettelsesminne>(`laerdom/${nokkel(mal)}.json`);
}
