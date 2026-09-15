/**
 * Klippene i reel-veggen på forsiden.
 *
 * Utvalget er gjort på BRANSJEBREDDE, ikke på hva som er penest. Seksjonens
 * jobb er å svare på «kan de levere for noen som oss?», og det svaret er
 * svakt hvis alle fire klippene er mat. Reflektors arkiv har slagside mot
 * servering og bakeri — det er der de har flest kunder — og nettopp derfor
 * må veggen vise det motsatte.
 *
 * Fire bransjer: sportsbutikk, spa og hotell, friluft, bakeri. Det siste er
 * med fordi mat ER kjernekompetansen; å utelate den ville vært å skjule
 * ekspertisen for å bevise bredde.
 *
 * Kildefilene er 4K 9:16 (2160×3840) på 39–135 MB. De komprimeres til
 * 720×1280 H.264 for web. Originalene ligger i Dropbox, se docs/media.md —
 * de skal ikke inn i repoet.
 *
 * `kunde: null` betyr IKKE godkjent for navngiving. Pål godkjenner hvert
 * navn eksplisitt. Klippet kan vises uten navn; navnet kan ikke gjettes.
 */
export type Reel = {
  fil: string;
  /** Kundenavn, eller null hvis ikke godkjent for navngiving. */
  kunde: string | null;
  /** Bransje. Faktabeskrivelse, ikke en påstand om kundeforhold. */
  bransje: string;
  /** Alt-tekst for posterbildet. Beskriver hva man ser. */
  alt: string;
  merknad?: string;
};

export const reels: Reel[] = [
  {
    fil: "antonsport",
    kunde: "Anton Sport",
    bransje: "Sportsbutikk",
    alt: "Vertikalt klipp fra sportsbutikk",
  },
  {
    fil: "thewell",
    kunde: "The Well",
    bransje: "Spa og hotell",
    alt: "Vertikalt klipp fra spaanlegg",
  },
  {
    fil: "goretex",
    kunde: null,
    bransje: "Friluft",
    alt: "Vertikalt klipp fra friluftsprodukt",
    merknad:
      "MÅ GODKJENNES før navnet kan stå. Gore-Tex er ikke på den bekreftede kundelisten. Filen ligger sammen med Anton Sport-materiale i arkivet, så dette kan være produsert FOR Anton Sport med Gore-Tex-produkter — men det er en gjetning, og gjetninger navngis ikke.",
  },
  {
    fil: "soulcake",
    kunde: "Soul Cake",
    bransje: "Bakeri",
    alt: "Vertikalt klipp fra bakeri",
  },
];
