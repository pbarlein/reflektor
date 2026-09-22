/**
 * Kategoriene.
 *
 * ÅTTE KATEGORIER I TRE BOLKER, og rekkefølgen er lesningens rekkefølge,
 * ikke en alfabetisk liste.
 *
 *   1. HÅNDVERKET   de fem fasene en produksjon faktisk går gjennom
 *   2. KUNDEN       det som avgjør om kunden blir
 *   3. OSS          standarden vår, og hva vi selger
 *
 * ── TO KATEGORIER BLE FJERNET, OG ÉN BYTTET NAVN ──────────────────────────
 *
 * «Folk og fag» het det før, og innholdet var i hovedsak allmenn
 * arbeidspsykologi: motivasjonsteori, tilbakemeldingsmodeller, bevisst
 * øving. Godt stoff, men det kunne stått i hvilken som helst håndbok, og
 * en hub som skal være fasit for hvordan REFLEKTOR jobber, blir svakere av
 * stoff som ikke er vårt. Kategorien heter nå «Standarden» og holder det
 * som faktisk er operativt: hva som aldri går ut, og hva du gjør når du
 * står fast.
 *
 * «Forretningsforståelse» og «Slik gjør vi det» sa det samme to ganger —
 * begge hadde en tekst om pris. De er slått sammen til «Reflektor sin
 * markedsposisjon», som er det de egentlig handlet om.
 *
 * «Markedet utenfor» er borte som kategori. Innholdet der er ferskvare med
 * en holdbarhet på uker, og et oppslagsverk er feil form for det. Det blir
 * en datert nyhetsstrøm i stedet.
 *
 * ── HVORFOR RADER OG IKKE FILTER ──────────────────────────────────────────
 *
 * Første versjon hadde en klikkbar skinne der man valgte kategori og fikk
 * et rutenett. Det er feil form for en hub: den krever at du VET hva du
 * leter etter før du får se noe. Et oppslagsverk skal vise fram det det
 * har.
 *
 * Nå er hver kategori en rad du blar sidelengs i, med overskrift over.
 * Alt er synlig fra første skjerm, og søket går på tvers av alt — der det
 * hører hjemme, for den som faktisk vet hva hen leter etter.
 *
 * ── FARGE SKILLER IKKE KATEGORIER ─────────────────────────────────────────
 *
 * Nummer og plassering gjør det. Ti hues ville brutt aksentdisiplinen i
 * AGENTS.md og vært det tydeligste malsignalet som finnes i et intranett.
 */

export type KategoriId =
  | "research"
  | "planlegging"
  | "opptak"
  | "redigering"
  | "publisering"
  | "kunde"
  | "standard"
  | "posisjon";

export type Bolk = "handverk" | "kunde" | "oss";

export type Kategori = {
  id: KategoriId;
  navn: string;
  /** Under seksten tegn. Brukes i merkelappen på kortene. */
  kort: string;
  /** Én setning. Står under overskriften på raden. */
  beskrivelse: string;
  bolk: Bolk;
  /** Løpenummer. Kun de fem produksjonsfasene har det. */
  nr?: number;
};

export const KATEGORIER: readonly Kategori[] = [
  {
    id: "research",
    navn: "Researchfasen",
    kort: "Research",
    beskrivelse:
      "Alt vi finner ut før vi foreslår noe. Kunden, bransjen, og hva som allerede virker der.",
    bolk: "handverk",
    nr: 1,
  },
  {
    id: "planlegging",
    navn: "Planleggingsfasen",
    kort: "Planlegging",
    beskrivelse:
      "Fra idé til opptaksklar plan. Det er her en produksjonsdag vinnes eller tapes.",
    bolk: "handverk",
    nr: 2,
  },
  {
    id: "opptak",
    navn: "Opptaksfasen",
    kort: "Opptak",
    beskrivelse:
      "På lokasjon. Håndverket, og feilene som ikke lar seg rette i etterkant.",
    bolk: "handverk",
    nr: 3,
  },
  {
    id: "redigering",
    navn: "Redigeringsfasen",
    kort: "Redigering",
    beskrivelse:
      "Klipp, tekst, lyd og eksport. Fra råmateriale til noe som stopper tommelen.",
    bolk: "handverk",
    nr: 4,
  },
  {
    id: "publisering",
    navn: "Publiseringsfasen",
    kort: "Publisering",
    beskrivelse:
      "Rytme, bildetekst og krysspublisering. To poster i uka, hele året.",
    bolk: "handverk",
    nr: 5,
  },
  {
    id: "kunde",
    navn: "Kundeforholdet",
    kort: "Kunde",
    beskrivelse:
      "Det som avgjør om kunden blir. Møter, forventninger, dårlige nyheter og vanskelige samtaler.",
    bolk: "kunde",
  },
  {
    id: "standard",
    navn: "Standarden",
    kort: "Standard",
    beskrivelse:
      "Hva som aldri går ut av huset, og hva du gjør når noe står fast midt i en dag.",
    bolk: "oss",
  },
  {
    id: "posisjon",
    navn: "Reflektor sin markedsposisjon",
    kort: "Posisjon",
    beskrivelse:
      "Hva vi selger, hva vi ikke selger, og hvorfor vi sier prisen høyt når resten av bransjen lar være.",
    bolk: "oss",
  },
] as const;

export const BOLKER: Record<Bolk, { navn: string; ingress: string }> = {
  handverk: {
    navn: "Håndverket",
    ingress:
      "De fem fasene en produksjon går gjennom, i den rekkefølgen de skjer.",
  },
  kunde: {
    navn: "Kunden",
    ingress: "Det arbeidet som avgjør om de blir hos oss.",
  },
  oss: {
    navn: "Oss",
    ingress: "Standarden vi holder, og det vi faktisk selger.",
  },
};

export function finnKategori(id: KategoriId): Kategori {
  const treff = KATEGORIER.find((k) => k.id === id);
  // Typen gjør dette umulig, men et kast her er bedre enn `undefined` som
  // sprer seg ut i en komponent og feiler et helt annet sted.
  if (!treff) throw new Error(`Ukjent kategori: ${id}`);
  return treff;
}

export function kategorierIBolk(bolk: Bolk): readonly Kategori[] {
  return KATEGORIER.filter((k) => k.bolk === bolk);
}
