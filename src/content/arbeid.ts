/**
 * Arbeidsseksjonen: stillbilder og stående video om hverandre.
 *
 * Tidligere var dette åtte stillbilder i et jevnt bånd-rutenett. To ting var
 * galt med det. Det var for mange bilder for det seksjonen skulle si, og det
 * skilte foto fra video som om de var to leveranser — mens abonnementet
 * leverer begge deler fra samme produksjonsdag.
 *
 * Nå: fem bilder og tre klipp, blandet, i tre kolonner med ulik forskyvning.
 *
 * HVORFOR TRE KOLONNER MED FORSKYVNING, og ikke et rutenett med row-span:
 * et rutenett der celler spenner ulikt antall rader etterlater hull når
 * høydene ikke går opp, og hullene leser som feil. Tre uavhengige stabler
 * kan ikke få hull — de bare slutter på ulikt sted, og det er nettopp
 * asymmetrien. Forskyvningen øverst gjør at de heller ikke starter likt.
 *
 * Klippene er de SMALESTE cellene. 9:16 i en bred kolonne blir absurd høyt;
 * i en smal kolonne blir det et telefonformat, som er det formatet innholdet
 * faktisk leveres i.
 *
 * Klippene er andre enn dem i reel-veggen øverst, og fra andre bransjer:
 * elsykkel, industri og drikkevare, mot sportsbutikk, spa og bakeri der.
 * Å gjenbruke de samme fire ville gjort siden kortere, ikke rikere.
 *
 * INGEN BILDETEKSTER. Flere av motivene kan jeg ikke knytte til en godkjent
 * kunde uten å gjette. Det navngitte beviset ligger i hero.proof,
 * reel-veggen og anmeldelsene; dette er et visuelt argument om spennvidde.
 */
export type Medie =
  | { type: "foto"; fil: string; alt: string; format: string }
  | { type: "video"; fil: string; alt: string };

/** Én stabel. `forskyvning` er Tailwind-klasser for toppmargin på desktop. */
export type Kolonne = { forskyvning: string; medier: Medie[] };

export const arbeidskolonner: Kolonne[] = [
  {
    forskyvning: "",
    medier: [
      { type: "video", fil: "gekko", alt: "Vertikalt klipp av elsykkel" },
      {
        type: "foto",
        fil: "stallen",
        alt: "Kokker på et kjøkken med en plakett",
        format: "aspect-[4/3]",
      },
      {
        type: "foto",
        fil: "dag1",
        alt: "Nærbilde av bakverk på brett",
        format: "aspect-[4/5]",
      },
    ],
  },
  {
    forskyvning: "lg:mt-20",
    medier: [
      {
        type: "foto",
        fil: "peppes1",
        alt: "Gjest med pizzastykke foran et neonskilt",
        format: "aspect-[4/5]",
      },
      { type: "video", fil: "zeroh", alt: "Vertikalt klipp av drikkevare" },
      {
        type: "foto",
        fil: "drone",
        alt: "Dronebilde av hotellanlegg med utendørsbasseng",
        format: "aspect-[16/10]",
      },
    ],
  },
  {
    forskyvning: "lg:mt-44",
    medier: [
      {
        type: "foto",
        fil: "kafe1",
        alt: "Vegg av flasker i en butikkhylle",
        format: "aspect-[3/4]",
      },
      { type: "video", fil: "battery", alt: "Vertikalt klipp fra industri" },
    ],
  },
];

/**
 * Det tette båndet lenger nede på siden. Uendret.
 *
 * Tolv små bilder i et jevnt rutenett over full bredde. Her er likheten
 * poenget: et variert nett ville sagt «utvalgte høydepunkter», et jevnt sier
 * «dette er en vanlig måned». Det er påstanden abonnementet gjør.
 *
 * Kildefil 640 px; next/image skalerer og konverterer.
 */
export type Bilde = { fil: string; alt: string };

export const band: Bilde[] = [
  { fil: "dag2", alt: "Ansatte samlet i en butikk" },
  { fil: "dag3", alt: "Lykkehjul under et arrangement" },
  { fil: "dag4", alt: "Opptak med kamera under et arrangement" },
  { fil: "dag5", alt: "Kunder med handleposer" },
  { fil: "dag6", alt: "Bakverk i en disk" },
  { fil: "peppes2", alt: "Gjest ved et bord med pizza" },
  { fil: "goretex2", alt: "Nærbilde av en sko på asfalt" },
  { fil: "sunkost", alt: "Produktbilde av pakninger og glass" },
  { fil: "kafe2", alt: "Person i genser fotografert bakfra utendørs" },
  { fil: "portrett", alt: "Portrett utendørs mot blå himmel" },
  { fil: "mat1", alt: "Ansatte i et produksjonslokale" },
  { fil: "mat2", alt: "Person om bord i en båt" },
];
