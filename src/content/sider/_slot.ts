/**
 * Innholdslaget (brief 8.2, LÅST).
 *
 * All copy ligger i typede innholdsfiler atskilt fra komponenter – én fil per
 * side, med slot-ID-ene fra kapittel 6 som nøkler. Grunnen er at Pål skal kunne
 * endre tekst uten å røre kode, og at manglende tekst fanges automatisk.
 *
 * Manglende copy skrives som TBD(...) – aldri som plassholdertekst som kan bli
 * stående ved en feil.
 */

export type Slot = {
  /** null betyr ikke levert. Fanges av content:check. */
  verdi: string | null;
  /** Maks tegn. Håndhever designets tekstlengder uten diskusjon per gang. */
  maksTegn?: number;
  /** Maks ord. Brukes der briefen sier «maks 8 ord». */
  maksOrd?: number;
  /** Hvilket spørsmål slotten besvarer. Følger med i copy-forespørselen. */
  jobb?: string;
};

export type Seksjon = {
  nr: number;
  navn: string;
  /** Jobben seksjonen gjør – ikke bare hva den heter (brief 9.3). */
  jobb: string;
  slots: Record<string, Slot>;
};

export type Side = {
  sti: string;
  /** Avatarnummer fra kapittel 5. */
  avatar?: string;
  /** Spørsmålet siden må besvare. */
  spørsmål?: string;
  /** Søkeord som må inn, med hvor de skal stå. */
  søkeord?: string[];
  /**
   * true = siden skal kunne gå til produksjon. content:check feiler da på
   * én eneste manglende slot. Sett aldri true før copy faktisk er godkjent.
   */
  ready: boolean;
  seksjoner: Seksjon[];
};

/** Copy som ikke er levert ennå. */
export function TBD(opts: Omit<Slot, "verdi"> = {}): Slot {
  return { verdi: null, ...opts };
}

/** Godkjent copy fra Pål. */
export function tekst(verdi: string, opts: Omit<Slot, "verdi"> = {}): Slot {
  return { verdi, ...opts };
}

/**
 * OPPSLAG I INNHOLDSLAGET. Flyttet hit fra components/Slot.tsx 27.09.2026.
 *
 * De er rene funksjoner over `Side`, uten JSX, og hører derfor i innholds-
 * laget de leser. Den praktiske grunnen: `content/faq.ts` trenger
 * `slotsISeksjon`, og så lenge den lå i en .tsx importerte innholdslaget en
 * React-komponent — noe `node --test` ikke kan laste, fordi node stripper
 * typer men ikke JSX. Slot.tsx re-eksporterer dem, så alle kallsteder står.
 */
export function finnSlot(side: Side, id: string): Slot | undefined {
  for (const seksjon of side.seksjoner) {
    const treff = seksjon.slots[id];
    if (treff) return treff;
  }
  return undefined;
}

export function hentTekst(side: Side, id: string): string | null {
  return finnSlot(side, id)?.verdi ?? null;
}

/** Alle slots i en seksjon, i rekkefølge. Til lister og rutenett. */
export function slotsISeksjon(side: Side, nr: number) {
  const seksjon = side.seksjoner.find((s) => s.nr === nr);
  if (!seksjon) return [];
  return Object.entries(seksjon.slots).map(([id, slot]) => ({ id, ...slot }));
}
