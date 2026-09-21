/**
 * Kategoriene.
 *
 * SJU KATEGORIER I TO GRUPPER, og grupperingen er hele den visuelle ideen.
 *
 * Fem av dem er ikke sidestilte emner — de er STEG I SAMME ARBEID, i fast
 * rekkefølge: research → planlegging → opptak → redigering → publisering.
 * Det er slik en produksjon faktisk beveger seg, og den som leter etter noe,
 * vet nesten alltid hvilket steg hen står i. Derfor tegnes de som en skinne
 * med løpenummer, ikke som sju like knapper.
 *
 * De to siste — intern nyhet og markedsnyhet — er ikke steg i noe. De får
 * en annen FORM, ikke bare en annen plass.
 *
 * FARGE BRUKES IKKE TIL Å SKILLE KATEGORIER. Det er fristende — sju farger,
 * ett blikk — men merkevaredisiplinen i AGENTS.md er eksplisitt: oransje er
 * reservert, og en regnbue ville brukt sju farger som ikke finnes i
 * paletten. Skillet ligger i nummer, plassering og form. Oransje markerer
 * ÉN ting: hva som er valgt akkurat nå.
 *
 * Det er også bedre design. Sju hardkodede hues er det tydeligste
 * malsignalet som finnes i et intranett.
 */

export type KategoriId =
  | "research"
  | "planlegging"
  | "opptak"
  | "redigering"
  | "publisering"
  | "internt"
  | "marked";

export type Kategori = {
  id: KategoriId;
  navn: string;
  /** Under seksten tegn. Brukes i merkelappen på kortene. */
  kort: string;
  /** Én setning. Står under skinna når kategorien er valgt. */
  beskrivelse: string;
  gruppe: "fase" | "nyhet";
  /** Løpenummer på skinna. Kun faser. */
  nr?: number;
};

export const KATEGORIER: readonly Kategori[] = [
  {
    id: "research",
    navn: "Researchfasen",
    kort: "Research",
    beskrivelse:
      "Alt vi finner ut før vi foreslår noe. Kunden, nisjen, hva som allerede virker.",
    gruppe: "fase",
    nr: 1,
  },
  {
    id: "planlegging",
    navn: "Planleggingsfasen",
    kort: "Planlegging",
    beskrivelse:
      "Fra idé til opptaksklar plan. Det er her en produksjonsdag vinnes eller tapes.",
    gruppe: "fase",
    nr: 2,
  },
  {
    id: "opptak",
    navn: "Opptaksfasen",
    kort: "Opptak",
    beskrivelse:
      "På lokasjon. Håndverket, og feilene som ikke lar seg rette i etterkant.",
    gruppe: "fase",
    nr: 3,
  },
  {
    id: "redigering",
    navn: "Redigeringsfasen",
    kort: "Redigering",
    beskrivelse:
      "Klipp, tekst, lyd og eksport. Fra råmateriale til noe som stopper tommelen.",
    gruppe: "fase",
    nr: 4,
  },
  {
    id: "publisering",
    navn: "Publiseringsfasen",
    kort: "Publisering",
    beskrivelse:
      "Rytme, bildetekst og krysspublisering. To poster i uka, hele året.",
    gruppe: "fase",
    nr: 5,
  },
  {
    id: "internt",
    navn: "Intern nyhet",
    kort: "Internt",
    beskrivelse:
      "Hvordan vi jobber, hva vi selger, og hva vi har blitt enige om.",
    gruppe: "nyhet",
  },
  {
    id: "marked",
    navn: "Markedsnyhet",
    kort: "Marked",
    beskrivelse:
      "Hva som skjer utenfor huset — plattformer, bransjen, og hva kunder spør om.",
    gruppe: "nyhet",
  },
] as const;

export const FASER = KATEGORIER.filter((k) => k.gruppe === "fase");
export const NYHETER = KATEGORIER.filter((k) => k.gruppe === "nyhet");

export function finnKategori(id: KategoriId): Kategori {
  const treff = KATEGORIER.find((k) => k.id === id);
  // Typen gjør dette umulig, men et kast her er bedre enn `undefined` som
  // sprer seg ut i en komponent og feiler et helt annet sted.
  if (!treff) throw new Error(`Ukjent kategori: ${id}`);
  return treff;
}
