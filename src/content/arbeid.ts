/**
 * Arbeidsseksjonen: stillbilder og stående video om hverandre.
 *
 * BLOKKEN ER REKTANGULÆR. Alle fire kolonner er nøyaktig like høye, så
 * seksjonen flukter på topp og bunn og på begge sider. Asymmetrien ligger
 * inni: den høye cellen står på ulik plass i hver kolonne, og siste kolonne
 * har to høye i stedet for én høy og to lave.
 *
 * Slik holder det: hver kolonne er totalt FIRE enheter. En lav celle er én
 * enhet, en høy er to. Kolonnene er flex-stabler med samme faste høyde, og
 * cellene får `flex-1` eller `flex-[2]` — da fordeles høyden proporsjonalt
 * uansett hvor mange celler kolonnen har.
 *
 *   1: HØY(2) + lav + lav       3: lav + lav + HØY(2)
 *   2: lav + HØY(2) + lav       4: HØY(2) + HØY(2)
 *
 * Forrige versjon brukte tre stabler med ulik toppforskyvning. Den var
 * asymmetrisk, men sluttet på tre ulike steder, og seksjonen så uferdig ut
 * i bunnen. Dette gir samme uro inni og ro rundt.
 *
 * KORTERE. Fire enheter à 230 px gir 968 px mot rundt 1 800 før — nesten
 * halvert — samtidig som antall elementer gikk fra 8 til 11. Tettere og
 * kortere er det samme grepet her: mindre celler, flere av dem.
 *
 * FORMATENE FØLGER AV GEOMETRIEN. En høy celle blir 288×476 px, altså 0,60 —
 * nesten nøyaktig 9:16. Det er derfor klippene ligger i de høye cellene.
 * En lav celle blir 288×230, altså liggende, så der ligger bilder som tåler
 * liggende beskjæring: flatlay, detaljer, drone og et kjøkkenbilde. Det ene
 * portrettmotivet som ikke tåler det, ligger i en HØY celle.
 *
 * INGEN BILDETEKSTER. Flere motiver kan jeg ikke knytte til en godkjent
 * kunde uten å gjette. Det navngitte beviset ligger i hero.proof,
 * reel-veggen og anmeldelsene.
 */
export type Celle =
  | { type: "foto"; fil: string; alt: string; enheter: 1 | 2 }
  | { type: "video"; fil: string; alt: string; enheter: 1 | 2 };

export const arbeidskolonner: Celle[][] = [
  [
    { type: "video", fil: "gekko", alt: "Vertikalt klipp av elsykkel", enheter: 2 },
    { type: "foto", fil: "dag1", alt: "Nærbilde av bakverk på brett", enheter: 1 },
    { type: "foto", fil: "helios", alt: "Flaskestilleben på grønt tekstil", enheter: 1 },
  ],
  [
    { type: "foto", fil: "drone", alt: "Dronebilde av hotellanlegg med utendørsbasseng", enheter: 1 },
    { type: "video", fil: "zeroh", alt: "Vertikalt klipp av drikkevare", enheter: 2 },
    // Byttet fra «industri» til «mat1»: industri-bildet viser samme
    // arbeidsutstyr som battery-klippet i kolonnen ved siden av, og de to
    // sto rett overfor hverandre. Samme motiv to ganger i samme blikk leser
    // som en feil, ikke som spennvidde. Industri-bildet ligger nå i båndet
    // lenger nede, der det er lite og langt unna klippet.
    { type: "foto", fil: "mat1", alt: "Ansatte i et produksjonslokale", enheter: 1 },
  ],
  [
    { type: "foto", fil: "stallen", alt: "Kokker på et kjøkken med en plakett", enheter: 1 },
    { type: "foto", fil: "kafe1", alt: "Vegg av flasker i en butikkhylle", enheter: 1 },
    { type: "video", fil: "battery", alt: "Vertikalt klipp fra industri", enheter: 2 },
  ],
  [
    { type: "video", fil: "egon", alt: "Vertikalt klipp fra serveringssted", enheter: 2 },
    { type: "foto", fil: "peppes1", alt: "Gjest med pizzastykke foran et neonskilt", enheter: 2 },
  ],
];

/** Båndet bruker et enklere skjema — bare fil og alt-tekst. */
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
  { fil: "industri", alt: "Nærbilde av slitt arbeidsutstyr" },
  { fil: "mat2", alt: "Person om bord i en båt" },
];
