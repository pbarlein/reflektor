/**
 * Kategoriene.
 *
 * TI KATEGORIER I TRE BOLKER, og rekkefølgen er lesningens rekkefølge, ikke
 * en alfabetisk liste.
 *
 *   1. HÅNDVERKET   de fem fasene en produksjon faktisk går gjennom
 *   2. KUNDEN       det som avgjør om kunden blir
 *   3. OSS          folk, forretning og det som skjer utenfor huset
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
  | "folk"
  | "forretning"
  | "internt"
  | "marked";

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
    id: "folk",
    navn: "Folk og fag",
    kort: "Folk",
    beskrivelse:
      "Hvordan man blir god her, hvordan man hjelper andre å bli det, og hva som holder folk gående.",
    bolk: "oss",
  },
  {
    id: "forretning",
    navn: "Forretningsforståelse",
    kort: "Forretning",
    beskrivelse:
      "Hvordan Reflektor tjener penger, og hva hver enkelt av oss faktisk påvirker.",
    bolk: "oss",
  },
  {
    id: "internt",
    navn: "Slik gjør vi det",
    kort: "Internt",
    beskrivelse:
      "Hva vi selger, hva vi har blitt enige om, og hva som gjelder uansett.",
    bolk: "oss",
  },
  {
    id: "marked",
    navn: "Markedet utenfor",
    kort: "Marked",
    beskrivelse: "Plattformene, bransjen, og hva kunder spør om akkurat nå.",
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
    ingress: "Folkene, forretningen og verden rundt.",
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
