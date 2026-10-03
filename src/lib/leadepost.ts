import { paaminnelseTidspunkt } from "./paaminnelse";

/**
 * De to e-postene leadet får fra Pål.
 *
 * TEKSTEN ER PÅLS, ORDRETT, og skal ikke pyntes på. Den er skrevet for å
 * leses som en e-post et menneske har skrevet: ingen overskrifter, ingen
 * knapper, ingen farger, ingen bunntekst. Det er hele poenget — se
 * lib/gmail.ts for hvorfor den forrige varianten havnet i Reklame-fanen.
 *
 * FILA ER REN. Ingen nettverk, ingen klokke som ikke kommer inn som
 * argument. Reglene for NÅR noe sendes ligger her sammen med teksten, fordi
 * det er dem som er lette å ta feil av, og de må kunne testes uten å sende
 * en eneste e-post.
 */

const PRESENTASJON = "https://canva.link/6p38q18d4w21fxk";
const BOOKING = "https://www.reflektor.no/book";

/** Signaturen, som i Påls egen Apple Mail. */
const SIGNATUR_TEKST = [
  "Mvh,",
  "",
  "Pål Barlein // CEO // Reflektor AS",
  "47605070 // pal@reflektor.no",
];

const SIGNATUR_STIL = 'font-family:"Helvetica Neue";font-size:13px';

/**
 * Fornavnet, med stor forbokstav.
 *
 * «henrik» blir «Henrik». Folk skriver navnet sitt med små bokstaver i
 * skjemaer oftere enn man skulle tro, og en e-post som åpner med «Hei
 * henrik!» ser ut som den kom fra en maskin.
 */
export function fornavn(navn: string): string {
  const ord = navn.trim().split(/\s+/)[0] ?? "";
  if (!ord) return "";
  return ord.charAt(0).toLocaleUpperCase("nb-NO") + ord.slice(1);
}

export function emne1(bedrift: string): string {
  const b = bedrift.trim();
  const hale = "Reflektor: SoMe-strategi, produksjon og publisering";
  return b ? `${b} + ${hale}` : hale;
}

export function emne2(bedrift: string): string {
  return `Re: ${emne1(bedrift)}`;
}

/** Linjer → HTML som ser ut som en e-post skrevet i Apple Mail. */
function somHtml(linjer: string[], signaturFra: number): string {
  const lenket = (t: string) =>
    t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        (u) => `<a href="${u}">${u}</a>`,
      );

  return linjer
    .map((l, i) => {
      const stil = i >= signaturFra ? ` style="${SIGNATUR_STIL}"` : "";
      return l === ""
        ? `<div${stil}><br></div>`
        : `<div${stil}>${lenket(l)}</div>`;
    })
    .join("");
}

export type Brev = { emne: string; tekst: string; html: string };

export function epost1(navn: string, bedrift: string): Brev {
  const f = fornavn(navn);
  const linjer = [
    f ? `Hei ${f}!` : "Hei!",
    "",
    "Takk for at du tok kontakt med Reflektor.",
    "",
    "Her har du en presentasjon med eksempler på hva vi produserer for kundene våre, hvordan vi jobber, og hva fast samarbeid koster:",
    PRESENTASJON,
    "",
    `Jeg ringer deg så snart jeg kan for å avtale et uforpliktende introduksjonsmøte, og kommer gjerne innom dere fysisk. Vil du heller velge tid selv, kan du booke her: ${BOOKING}`,
    "",
    ...SIGNATUR_TEKST,
  ];
  return {
    emne: emne1(bedrift),
    tekst: linjer.join("\n"),
    html: somHtml(linjer, linjer.length - SIGNATUR_TEKST.length),
  };
}

export function epost2(navn: string, bedrift: string): Brev {
  const f = fornavn(navn);
  const linjer = [
    f ? `Hei igjen, ${f}!` : "Hei igjen!",
    "",
    `Fikk du sett på presentasjonen? Finn gjerne en tid som passer – det tar 30 minutter og er helt uforpliktende: ${BOOKING}`,
    "",
    "Har vi allerede avtalt møte, kan du se bort fra denne.",
    "",
    ...SIGNATUR_TEKST,
  ];
  return {
    emne: emne2(bedrift),
    tekst: linjer.join("\n"),
    html: somHtml(linjer, linjer.length - SIGNATUR_TEKST.length),
  };
}

/* ───────────────────────────── NÅR SENDES DE ────────────────────────── */

/** Feltene reglene leser. Alle kommer fra HubSpot som tekst eller tomt. */
export type Kandidat = {
  epost: string;
  lifecycle: string;
  epost1Sendt: string;
  epost2Sendt: string;
  avbrutt: string;
  moteBooket: string;
  /** Stadiene på tilknyttede avtaler. Tom liste hvis ingen. */
  dealstadier: string[];
};

/**
 * Avtalestadier som betyr «ikke send påminnelse».
 *
 * ID-ene er HubSpots egne for pipelinen «Reflektor – salg», kontrollert
 * 04.10.2026. `appointmentscheduled` heter «Interessert» og er stadiet alle
 * nye leads havner i — den skal IKKE blokkere, ellers hadde ingen fått
 * påminnelse i det hele tatt.
 */
export const STOPPSTADIER = [
  "presentationscheduled", // Møte booket
  "decisionmakerboughtin", // Tilbud sendt
  "closedwon", // Vunnet
  "6002758898", // Hviler
  "closedlost", // Tapt
];

/** Interne adresser og kunder får ingenting. */
export function skalHaEpost1(k: Kandidat): boolean {
  if (!k.epost || k.epost.toLowerCase().includes("@reflektor.no")) return false;
  if (k.lifecycle.toLowerCase() === "customer") return false;
  return !k.epost1Sendt;
}

/**
 * Påminnelsen, med alle forbeholdene.
 *
 * VINDUET ER TRE TIMER, fra 09:00 til 12:00. Har jobben stått stille over
 * natten, skal den ikke ta igjen det tapte ved å sende en «god morgen»-
 * påminnelse klokka fire om ettermiddagen. Da er det bedre å la være.
 *
 * MØTE BOOKET ETTER E-POST 1 STOPPER DEN. Et møte booket FØR e-post 1 er
 * gammelt og sier ingenting om denne henvendelsen.
 */
export function skalHaEpost2(k: Kandidat, na: Date): boolean {
  if (!k.epost1Sendt || k.epost2Sendt) return false;
  if (k.avbrutt === "true") return false;
  if (k.lifecycle.toLowerCase() === "customer") return false;
  if (k.dealstadier.some((s) => STOPPSTADIER.includes(s))) return false;

  const sendt = new Date(k.epost1Sendt);
  if (Number.isNaN(sendt.getTime())) return false;

  if (k.moteBooket) {
    const booket = new Date(k.moteBooket);
    if (!Number.isNaN(booket.getTime()) && booket.getTime() > sendt.getTime())
      return false;
  }

  const start = paaminnelseTidspunkt(sendt).getTime();
  const slutt = start + 3 * 60 * 60 * 1000;
  return na.getTime() >= start && na.getTime() < slutt;
}
