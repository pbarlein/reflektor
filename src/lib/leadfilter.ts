/**
 * Det harde filteret på Meta-leads. Bestilt av Pål 12.10.2026.
 *
 * HENDELSEN: Meta-skjemaet ble bygget om 11.10 med SMS-verifisering,
 * «Higher intent» og budsjettspørsmål. Det hjalp ikke. Alle åtte leadene
 * som kom inn 11.–12.10 er spam, alle med ekte +47-nummer og privat
 * e-postadresse:
 *
 *   Golnaz / gmail / «Natulahland»          Morten / gmail / «Morten g Hansen maskin»
 *   David / gmail / «La pantera records»    Grethe / gmail / «Stand in arrangementy»
 *   Faim / hotmail / «Founder, Director, CEO»  Aluel / gmail / «Aluel»
 *   Taras / mail.ru / «Coop»                Svein / vkbb.no / «Freelance»
 *
 * E-post 1 går tre minutter etter at leadet hentes, og «Ring ASAP» går til
 * Pål med én gang. Salgsassistenten rydder først neste time. Derfor må
 * avgjørelsen tas før noe sendes.
 *
 * PÅLS BESTILLING 12.10: kun jobb-e-post, og behovet må beskrives.
 *
 * TRE UTFALL, OG DET ER MED VILJE. En port med bare ja og nei må settes
 * enten så stramt at ekte leads ryker, eller så løst at spam slipper
 * gjennom. «Usikker» er stedet for de som ikke kan avgjøres av en regel:
 * de kommer fram til Pål, men uten automatisk e-post.
 *
 * FILA ER REN OG TESTES UTEN NETT. Oppslagene — MX, Brønnøysund, nettsiden
 * — ligger i lib/leadfilteroppslag.ts.
 */
import { ENGANGSDOMENER } from "./leadspam";
import { epostdomene } from "./spam";

/**
 * Private, gratis og engangsdomener. Én konstant, lett å utvide.
 *
 * ET NAVN SOM SLUTTER PÅ «.» ELLER «.*» TREFFER ALLE TOPPDOMENER:
 * `hotmail.` dekker hotmail.com, hotmail.co.uk og hotmail.no. Alt annet må
 * stemme helt.
 *
 * DE NORSKE ER DE VIKTIGSTE OG DE LETTESTE Å GLEMME. online.no, lyse.net,
 * broadpark.no og de andre er internettleverandørenes gamle adresser, og de
 * er like private som gmail — men de ser norske og dermed seriøse ut.
 */
export const PRIVATDOMENER = [
  /* Internasjonale gratistjenester */
  "gmail.com",
  "googlemail.com",
  "hotmail.",
  "outlook.",
  "live.",
  "msn.com",
  "yahoo.",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "gmx.",
  "mail.com",
  "mail.ru",
  "yandex.",
  /* Norske internettleverandører og gamle privatadresser */
  "online.no",
  "getmail.no",
  "lyse.net",
  "broadpark.no",
  "start.no",
  "frisurf.no",
  "c2i.net",
  "tele2.no",
  "netcom.no",
  "epost.no",
  "ebnett.no",
  "bluezone.no",
  "hebb.no",
  "altiboxmail.no",
  /* Engangsadressene fra bestillingen 11.10. Én liste, ett sted. */
  ...ENGANGSDOMENER,
];

/** Treffer domenet mønsteret? «navn.» og «navn.*» treffer alle toppdomener. */
function treffer(domene: string, monster: string): boolean {
  const stamme = monster.endsWith(".*")
    ? monster.slice(0, -1)
    : monster.endsWith(".")
      ? monster
      : "";
  if (!stamme) return domene === monster;
  return domene.startsWith(stamme) && domene.length > stamme.length;
}

export function erPrivatEpost(epost: string): boolean {
  const domene = epostdomene(epost);
  if (!domene) return false;
  return PRIVATDOMENER.some((m) => treffer(domene, m));
}

/* ─────────────────────────── FIRMAFELTET ────────────────────────────── */

/**
 * Titler folk skriver i firmafeltet når de ikke har et firma.
 *
 * «Founder, Director, CEO» sto i firmafeltet til Faim G-m 12.10, og
 * «Freelance» hos Svein Arne Nilsen. Det er ikke et firmanavn, og det
 * finnes ikke i Brønnøysund.
 */
export const TITLER = [
  "daglig leder",
  "ceo",
  "founder",
  "co-founder",
  "director",
  "eier",
  "gründer",
  "grunder",
  "sjef",
  "leder",
  "manager",
  "owner",
  "freelance",
  "frilans",
  "frilanser",
  "privat",
  "privatperson",
  "student",
  "selvstendig",
];

/** Selskapsformene som strippes før navn sammenlignes. */
const SELSKAPSFORMER = ["as", "asa", "ans", "da", "enk", "sa", "ba", "kf"];

/**
 * Firmanavnet uten selskapsform, tegnsetting og dobbelt mellomrom.
 *
 * BRUKES BÅDE TIL BRØNNØYSUND-SØKET OG TIL SAMMENLIGNINGENE, så «Lokk AS»,
 * «Lokk as» og «Lokk, AS» blir samme streng.
 */
export function normaliserFirma(firma: string): string {
  const ord = firma
    .toLocaleLowerCase("nb-NO")
    .replace(/[.,;:!?"'()[\]{}/\\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  while (ord.length > 1 && SELSKAPSFORMER.includes(ord[ord.length - 1]!)) {
    ord.pop();
  }
  return ord.join(" ");
}

/**
 * Er firmafeltet bare en tittel?
 *
 * ALLE ORDENE MÅ VÆRE TITLER. «Founder, Director, CEO» ryker; «Leder Media»
 * står, fordi «media» ikke er en tittel. Et ekte firmanavn som tilfeldigvis
 * inneholder «leder» skal ikke avvises — det er en feil som koster en kunde.
 */
export function erTittelfirma(firma: string): boolean {
  const n = normaliserFirma(firma);
  if (!n) return false;
  if (TITLER.includes(n)) return true;
  const ord = n.split(" ");
  return ord.length > 1 && ord.every((o) => TITLER.includes(o));
}

/** Er firmafeltet identisk med for- eller etternavnet? */
export function firmaErPersonnavn(firma: string, navn: string): boolean {
  const f = normaliserFirma(firma);
  if (!f) return false;
  const deler = navn
    .toLocaleLowerCase("nb-NO")
    .split(/\s+/)
    .map((d) => d.replace(/[.,]/g, ""))
    .filter(Boolean);
  return deler.includes(f);
}

/* ───────────────────────────── BEHOVET ──────────────────────────────── */

/** Minste lengde på et behov som sier noe. Bestilt av Pål 12.10.2026. */
export const BEHOVSGRENSE = 15;

export type Behovsvar = "mangler" | "for-kort" | "uten-bokstaver" | "ok";

/**
 * Sier behovsteksten noe?
 *
 * «ja», «test», «ok», «-» og «.» faller på lengden. En tekst uten en
 * eneste bokstav — «123456789012345» — faller på den egne regelen.
 *
 * RENE GJENTAKELSER AV FIRMANAVNET faller også, og det er lagt til her
 * fordi bestillingen regnet dem som «under grensen uansett». Det stemmer
 * ikke alltid: «Nordlysbakeriet AS» er atten tegn. Sjekken krever at
 * teksten er NØYAKTIG firmanavnet — står det ett ord mer, er det et svar.
 */
export function behovsvar(behov: string, firma = ""): Behovsvar {
  const t = behov.trim();
  if (!t) return "mangler";
  if (!/\p{L}/u.test(t)) return "uten-bokstaver";
  if (t.length < BEHOVSGRENSE) return "for-kort";
  if (firma && normaliserFirma(t) === normaliserFirma(firma)) return "for-kort";
  return "ok";
}

/* ──────────────────────── NORSK ELLER IKKE ──────────────────────────── */

/** Er nummeret norsk? Tomt nummer regnes som ukjent, ikke utenlandsk. */
export function norskTelefon(telefon: string): boolean {
  const t = telefon.replace(/[\s\-()./]/g, "");
  if (!t) return true;
  if (t.startsWith("+47") || t.startsWith("0047")) return true;
  if (/^\+/.test(t)) return false;
  return /^[49]\d{7}$/.test(t);
}

/** Regel 5: verken norsk nummer eller .no-domene. */
export function utenNorskSpor(telefon: string, epost: string): boolean {
  return !norskTelefon(telefon) && !epostdomene(epost).endsWith(".no");
}

/* ──────────────────── NAVNELIKHET MOT BRØNNØYSUND ───────────────────── */

function avstand(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let forrige = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const rad = [i];
    for (let j = 1; j <= b.length; j++) {
      rad[j] = Math.min(
        forrige[j]! + 1,
        rad[j - 1]! + 1,
        forrige[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    forrige = rad;
  }
  return forrige[b.length]!;
}

/**
 * Likhet mellom to firmanavn, 0 til 1.
 *
 * GRENSA ER 0,8, bestilt av Pål. Den slipper gjennom en skrivefeil og en
 * manglende selskapsform, men ikke et annet firma: «lokk» mot «lokka» er
 * 0,8, mens «lokk» mot «norsk bakeri» er under 0,2.
 */
export function navnelikhet(a: string, b: string): number {
  const x = normaliserFirma(a);
  const y = normaliserFirma(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  return 1 - avstand(x, y) / Math.max(x.length, y.length);
}

/** Grensa for at et Brønnøysund-treff regnes som samme firma. */
export const LIKHETSGRENSE = 0.8;

/* ──────────────────────────── UTFALLET ──────────────────────────────── */

export type Avvisning =
  | "privat-epost"
  | "ingen-mx"
  | "behov"
  | "firma-mangler"
  | "firma-tittel"
  | "firma-er-navn"
  | "utenlandsk";

export type Utfall = "godkjent" | "usikker" | "avvist";

export type Filterspor = {
  epost: string;
  telefon: string;
  firma: string;
  navn: string;
  /** Behovsteksten. Tom streng når feltet ikke er besvart. */
  behov: string;
  /**
   * Spør skjemaet i det hele tatt om behovet?
   *
   * FALSK BETYR AT VI IKKE KAN KREVE ET SVAR. Kontrollert i HubSpot
   * 12.10.2026: egenskapen `hva_trenger_dere_mest_hjelp_med` er TOM på
   * alle seks leadene fra v2-skjemaet — spørsmålet stilles ennå ikke. Å
   * avvise på et ubesvart spørsmål som aldri ble stilt, ville kastet hvert
   * eneste lead, også de ekte. Da er «usikker» det ærlige svaret.
   */
  behovFinnes: boolean;
  /** `false` bare når oppslaget sa det. Et feilet oppslag gir `true`. */
  harMx: boolean;
  /** `null` = fikk ikke sjekket. Da kan den ikke godkjenne, men ikke avvise. */
  brregTreff: boolean | null;
  domeneSvarer: boolean | null;
};

/** Grunnen skrevet ut, til logglinja og til varselet. */
export function grunntekst(a: Avvisning): string {
  switch (a) {
    case "privat-epost":
      return "privat e-postadresse";
    case "ingen-mx":
      return "e-postdomenet tar ikke imot e-post";
    case "behov":
      return "behovet er ikke beskrevet";
    case "firma-mangler":
      return "firmafeltet er tomt";
    case "firma-tittel":
      return "firmafeltet er bare en tittel";
    case "firma-er-navn":
      return "firmafeltet er personens eget navn";
    case "utenlandsk":
      return "verken norsk nummer eller norsk domene";
  }
}

/**
 * Slår en avvisningsregel til?
 *
 * REKKEFØLGEN ER BESTILLINGENS, og den er også fra billigst til dyrest:
 * de tre siste trenger ingenting utenfra, mens de to første bygger på
 * adressen og et DNS-oppslag.
 */
export function avvisning(spor: Filterspor): Avvisning | null {
  if (erPrivatEpost(spor.epost)) return "privat-epost";
  if (!spor.harMx) return "ingen-mx";

  /*
    BEHOVET AVVISER BARE NÅR SKJEMAET FAKTISK SPURTE. Se `behovFinnes`.
  */
  if (spor.behovFinnes && behovsvar(spor.behov, spor.firma) !== "ok") {
    return "behov";
  }

  if (!spor.firma.trim()) return "firma-mangler";
  if (erTittelfirma(spor.firma)) return "firma-tittel";
  if (firmaErPersonnavn(spor.firma, spor.navn)) return "firma-er-navn";

  if (utenNorskSpor(spor.telefon, spor.epost)) return "utenlandsk";

  return null;
}

/**
 * Hele avgjørelsen.
 *
 * GODKJENT KREVER ET POSITIVT TEGN, ikke bare fravær av et negativt: et
 * treff i Brønnøysund, eller et e-postdomene som faktisk svarer. En
 * jobbadresse med MX er ikke nok alene — det er den botten allerede har.
 *
 * ET OPPSLAG SOM FEILER GIR ALDRI AVVIST. Er Brønnøysund nede, blir
 * utfallet «usikker», og Pål får varselet. Vår egen nedetid skal ikke
 * koste et lead.
 */
export function filtrer(spor: Filterspor): {
  utfall: Utfall;
  grunn: string;
  avvist: Avvisning | null;
} {
  const a = avvisning(spor);
  if (a) return { utfall: "avvist", grunn: grunntekst(a), avvist: a };

  if (spor.brregTreff === true) {
    return { utfall: "godkjent", grunn: "treff i Brønnøysund", avvist: null };
  }
  if (spor.domeneSvarer === true) {
    return {
      utfall: "godkjent",
      grunn: "e-postdomenet har en nettside som svarer",
      avvist: null,
    };
  }

  const manglende =
    spor.brregTreff === null
      ? "fikk ikke svar fra Brønnøysund"
      : `ingen treff i Brønnøysund på «${spor.firma.trim()}»`;

  return {
    utfall: "usikker",
    grunn: spor.behovFinnes
      ? `jobb-e-post ok, ${manglende}`
      : `jobb-e-post ok, ${manglende}, og skjemaet spør ikke om behovet`,
    avvist: null,
  };
}

/* ────────── NETTSIDESKJEMAET: FLAGG, IKKE AVVIS (12.10.2026) ────────── */

/**
 * Filterets treff på et nettsidelead, som merkelapper til ⚠-linja.
 *
 * HVORFOR FLAGG OG IKKE AVVISNING HER. Bestillingen ba om samme harde
 * regler på reflektor.no-skjemaet. Målt i HubSpot 12.10.2026 har siden hatt
 * to ekte skjemahenvendelser — Fling AS og La Mexicana AS — og BEGGE bruker
 * gmail. Regel 1 ville kastet dem uten at Pål fikk vite det. Avgjort av
 * Pål 12.10: nettsideleads flagges i stedet. Leadet kommer fram med en
 * advarsel, og uten automatisk presentasjon eller påminnelse.
 *
 * `ingen-mx` STÅR IKKE HER. Scoren i lib/spam.ts gir alt to poeng for
 * «engangsadresse eller ingen MX», og to merkelapper for samme funn hjelper
 * ingen.
 */
export function nettsideTreff(spor: {
  epost: string;
  telefon: string;
  melding: string;
}): string[] {
  const treff: string[] = [];
  if (erPrivatEpost(spor.epost)) treff.push("privat-epost");
  if (behovsvar(spor.melding) !== "ok") treff.push("behov-for-kort");
  if (utenNorskSpor(spor.telefon, spor.epost)) treff.push("utenlandsk");
  return treff;
}
