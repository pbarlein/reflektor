/**
 * Tall og datoer i rapportene.
 *
 * Bestilt: «Beløp vises som 2 000 kr, datoer som fredag 2. oktober,
 * tidssone Europe/Oslo.» Alt her er den regelen, ett sted, så et beløp ikke
 * ser forskjellig ut i nøkkeltallene og i tabellen.
 */

/* Hardt mellomrom. Et beløp skal aldri brekke mellom tusenskillet og «kr». */
const HARDT = " ";

export function tall(n: number): string {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 })
    .format(Math.round(n))
    .replace(/\s/g, HARDT);
}

export function kr(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  return `${tall(n)}${HARDT}kr`;
}

export function prosent(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  const fortegn = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${fortegn}${Math.abs(Math.round(n))}${HARDT}%`;
}

/** «fredag 2. oktober». Dato uten år — rapporten er alltid fra i år. */
export function norskDato(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

/** «27. sep. 13:40» — til «hentet»-linjer der plassen er liten. */
export function norskTidspunkt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Dagens dato i Oslo som `2026-09-27`, til sammenligning med `due`. */
export function iDagOslo(naa = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(naa);
}

/** Har fristen passert? Tom frist har ikke passert. */
export function forfalt(due: string, naa = new Date()): boolean {
  return Boolean(due) && due < iDagOslo(naa);
}

/**
 * Er vi innenfor hverdag 08–17 i Oslo?
 *
 * Regnes ut av `Intl` og ikke av en fast timeforskjell, fordi Norge bytter
 * mellom +01 og +02. En hardkodet forskjell er riktig halve året.
 */
export function iSendevindu(naa = new Date()): boolean {
  const deler = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Oslo",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(naa);
  const dag = deler.find((d) => d.type === "weekday")?.value ?? "";
  const time = Number(deler.find((d) => d.type === "hour")?.value ?? "0");
  if (["Sat", "Sun"].includes(dag)) return false;
  return time >= 8 && time < 17;
}
