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

/**
 * Normalisert bedriftsnavn: små bokstaver, uten selskapsform og uten tegn.
 *
 * «BAKST & RO» og «Bakst og Ro AS» skal kjennes igjen som samme bedrift.
 * Brukes to steder — til hilsenen her, og til å finne igjen samme person
 * under en annen e-postadresse (lib/leadutsending.ts).
 */
export function normalisertBedrift(bedrift: string): string {
  return bedrift
    .toLocaleLowerCase("nb-NO")
    .replace(/\b(as|asa|ans|da|sa|enk|aksjeselskap)\b/g, "")
    .replace(/\bog\b/g, "")
    .replace(/[^a-zæøåäöü0-9]/g, "");
}

/**
 * Fornavnet til hilsenen — eller tom streng, som betyr «Hei!».
 *
 * META-SKJEMAET GIR OSS SIDENAVNET, IKKE ET NAVN. Facebook fyller
 * «full_name» med det som står på siden som annonserer, og 04.10.2026 ga
 * det e-posten «Hei Bakst!» til en som heter Munirat og driver «Bakst & Ro
 * | Hjemmebakt i Asker». Det er verre enn ingen hilsen: det avslører at
 * ingen har lest henvendelsen.
 *
 * FIRE TEGN PÅ AT DETTE IKKE ER ET NAVN: `&`, `|`, selskapsformen «AS» som
 * eget ord, og sifre. Alle fire hører til bedriftsnavn, ikke til personer.
 *
 * DET FEMTE ER AT FORNAVNET LIGGER I BEDRIFTSNAVNET. «Bakst» i «BAKST & RO»
 * er bedriften som har sivet inn i navnefeltet. «Claudia» i «Bergheim» er
 * et navn, og hun skal hilses med det.
 *
 * VI HELLER MOT «Hei!» NÅR VI ER I TVIL. Et generisk «Hei!» er høflig og
 * umerkelig. Et galt fornavn er det ingen av.
 */
export function hilsenNavn(navn: string, bedrift: string): string {
  const hele = navn.trim();
  if (!hele) return "";
  if (/[&|]/.test(hele)) return "";
  if (/\d/.test(hele)) return "";
  if (/\bas\b/i.test(hele)) return "";

  const f = fornavn(hele);
  if (!f) return "";

  const b = normalisertBedrift(bedrift);
  const fn = normalisertBedrift(f);
  if (b && fn && b.includes(fn)) return "";

  return f;
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
  const f = hilsenNavn(navn, bedrift);
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
  const f = hilsenNavn(navn, bedrift);
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

/* ─────────────────────── HVOR KOM LEADET FRA ────────────────────────── */

/**
 * Markørene i HubSpots `recent_conversion_event_name`.
 *
 * DET FINNES FLERE KONVERTERINGER ENN SKJEMAER. En booking gir
 * «Meetings Link: paal-barlein/intro», og 04.10.2026 sendte jobben e-post 1
 * til en kontakt som var opprettet AV en booking: presentasjon og «book
 * her» til noen som nettopp hadde booket.
 */
export const KILDEMARKOR = {
  nettside: ["reflektor.no – kontaktskjema"],
  meta: ["Facebook Lead Ads:", "Reflektor SoMe-abonnement"],
} as const;

export type Leadkilde = "nettside" | "meta" | "annet";

/** Hvilket skjema leadet kom fra. «annet» får ingen automatisk e-post. */
export function leadkilde(hendelse: string): Leadkilde {
  const h = hendelse.trim();
  if (!h) return "annet";
  if (KILDEMARKOR.nettside.some((m) => h.includes(m))) return "nettside";
  if (KILDEMARKOR.meta.some((m) => h.includes(m))) return "meta";
  return "annet";
}

/**
 * Hvor lenge et Meta-lead får ligge før e-post 1.
 *
 * 04.10.2026 kom Meta-leadet 06:38 og bookingen 06:39 — ett minutt senere,
 * og fra en annen e-postadresse. Jobben rakk ikke å se bookingen, og sendte
 * «book her» til en som alt hadde booket. Tre minutter er nok til at
 * bookingen rekker å bli en kontakt i HubSpot, og kort nok til at et lead
 * som IKKE booker fortsatt får presentasjonen mens interessen er varm.
 *
 * NETTSIDELEADS VENTER IKKE. De sendes fra skjemaruta med én gang, og den
 * som booker på /takk har allerede fått e-posten — det er meningen.
 */
export const META_VENT_MS = 3 * 60 * 1000;

/* ──────────── SAMME PERSON, NY E-POSTADRESSE (04.10.2026) ───────────── */

/**
 * De siste sifrene i et telefonnummer.
 *
 * «+4797744426» og «977 44 426» er samme nummer. Landkode, mellomrom og
 * bindestreker skrives som folk vil, så vi sammenligner bare halen.
 */
export function sisteSifre(telefon: string, antall = 8): string {
  const sifre = telefon.replace(/\D/g, "");
  return sifre.length >= antall ? sifre.slice(-antall) : "";
}

export type Personspor = { epost: string; telefon: string; bedrift: string };

/**
 * Er dette samme person under en annen e-postadresse?
 *
 * 04.10.2026: Meta-leadet kom på lolademunirat@yahoo.com, bookingen ett
 * minutt senere på bakstogro@outlook.com. HubSpot laget to kontakter, og
 * jobben sendte presentasjonen til begge. Det eneste som bandt dem sammen
 * var telefonnummeret og bedriftsnavnet.
 *
 * SAMME ADRESSE ER IKKE «SAMME PERSON» HER. Da er det én og samme kontakt,
 * og den har sine egne regler.
 *
 * TO SPOR HOLDER, OG BARE ETT AV DEM TRENGS: telefonnummerets siste åtte
 * sifre, eller bedriftsnavnet uten selskapsform og tegn. Begge kan gi en
 * falsk treff — to ansatte i samme firma er ikke samme person — og det er
 * et bevisst valg: utfallet er at vi lar være å sende en automatisk e-post
 * til en bedrift der noen allerede har booket møte. Pål får varselet og
 * ringer uansett.
 */
export function sammePerson(a: Personspor, b: Personspor): boolean {
  const e1 = a.epost.trim().toLowerCase();
  const e2 = b.epost.trim().toLowerCase();
  if (!e1 || !e2 || e1 === e2) return false;

  const t1 = sisteSifre(a.telefon);
  if (t1 && t1 === sisteSifre(b.telefon)) return true;

  const b1 = normalisertBedrift(a.bedrift);
  const b2 = normalisertBedrift(b.bedrift);
  return Boolean(b1) && b1.length >= 3 && b1 === b2;
}

/** Feltene reglene leser. Alle kommer fra HubSpot som tekst eller tomt. */
export type Kandidat = {
  epost: string;
  lifecycle: string;
  /** `recent_conversion_event_name`. Avgjør om leadet er et skjemalead. */
  hendelse: string;
  /** `recent_conversion_date`. Styrer ventetiden for Meta-leads. */
  konvertert: string;
  /**
   * Sant hvis en ANNEN kontakt med samme telefon eller bedrift har booket
   * møte de siste fjorten dagene. Se lib/leadutsending.ts.
   */
  booketAnnetSted: boolean;
  epost1Sendt: string;
  epost2Sendt: string;
  avbrutt: string;
  moteBooket: string;
  /** Stadiene på tilknyttede avtaler. Tom liste hvis ingen. */
  dealstadier: string[];
  /**
   * Har noen andre enn Pål skrevet i Gmail-tråden etter e-post 1?
   *
   * `null` betyr at vi ikke fikk lest tråden. Da sender vi likevel — se
   * lib/gmail.ts for hvorfor et usikkert nei ikke skal stoppe noe.
   */
  harSvart: boolean | null;
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
/**
 * E-post 1: presentasjonen.
 *
 * BARE SKJEMALEADS. Er konverteringen noe annet enn de to skjemaene — en
 * booking, en nedlasting, en import — vet vi ikke hva personen har bedt om,
 * og da skal ingen automatisk e-post gå ut. Bestilt av Pål 04.10.2026.
 *
 * ET BOOKET MØTE STOPPER DEN. Både et møte på kontakten selv og et møte på
 * en annen kontakt som er samme person. Den som har booket, skal ikke få
 * «book her».
 */
export function skalHaEpost1(k: Kandidat, na: Date): boolean {
  if (!k.epost || k.epost.toLowerCase().includes("@reflektor.no")) return false;
  if (k.lifecycle.toLowerCase() === "customer") return false;
  if (k.epost1Sendt) return false;

  const kilde = leadkilde(k.hendelse);
  if (kilde === "annet") return false;

  if (k.moteBooket) return false;
  if (k.booketAnnetSted) return false;

  if (kilde === "meta") {
    const inn = new Date(k.konvertert);
    if (Number.isNaN(inn.getTime())) return false;
    if (na.getTime() - inn.getTime() < META_VENT_MS) return false;
  }

  return true;
}

/**
 * Påminnelsen, med alle forbeholdene.
 *
 * ET SVAR STOPPER DEN. Har leadet — eller hvem som helst andre enn Pål —
 * skrevet i tråden etter e-post 1, er samtalen i gang, og en automatisk
 * «fikk du sett på presentasjonen?» er da det eneste som kan ødelegge den.
 *
 * VINDUET ER TRE TIMER, fra 09:00 til 12:00. Har jobben stått stille over
 * natten, skal den ikke ta igjen det tapte ved å sende en «god morgen»-
 * påminnelse klokka fire om ettermiddagen. Da er det bedre å la være.
 *
 * ET BOOKET MØTE STOPPER DEN, uansett når det ble booket. Her sto det før
 * at et møte booket FØR e-post 1 var gammelt og ikke skulle stoppe noe.
 * Bestilt endret av Pål 04.10.2026: har personen et møte i HubSpot, skal
 * maskinen ikke mase — og det gjelder også et møte på en annen kontakt som
 * er samme person.
 */
export function skalHaEpost2(k: Kandidat, na: Date): boolean {
  if (!k.epost1Sendt || k.epost2Sendt) return false;
  if (k.avbrutt === "true") return false;
  if (k.harSvart === true) return false;
  if (k.lifecycle.toLowerCase() === "customer") return false;
  if (k.dealstadier.some((s) => STOPPSTADIER.includes(s))) return false;
  if (k.moteBooket) return false;
  if (k.booketAnnetSted) return false;

  const sendt = new Date(k.epost1Sendt);
  if (Number.isNaN(sendt.getTime())) return false;

  const start = paaminnelseTidspunkt(sendt).getTime();
  const slutt = start + 3 * 60 * 60 * 1000;
  return na.getTime() >= start && na.getTime() < slutt;
}
