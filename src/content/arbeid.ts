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
/** Foto eller klipp. Båndet bruker dette direkte; rutenettet utvider det. */
export type Medie = { type: "foto" | "video"; fil: string; alt: string };

/** Én celle i rutenettet: samme felter som båndet, pluss høydevekten. */
export type Celle = Medie & { enheter: 1 | 2 };

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

/**
 * BÅNDET: fire klipp mot åtte stillbilder, i tolv like celler.
 *
 * Forrige versjon var tolv stillbilder, og fem av dem — dag2 til dag6 — kom
 * fra samme arrangement. Rosa og gult fylte halve båndet, og det leste som
 * én oppdrag, ikke som bredde. To er igjen: «dag4», som viser kamera i
 * arbeid, og «dag6», som er et matmotiv. Resten er byttet ut.
 *
 * VIDEO ER HOVEDSAKEN, OGSÅ HER. Reel-veggen og arbeidsrutenettet viser
 * bevegelse; et bånd med bare stillbilder motsa dem. Fire klipp gjør at
 * øyet møter bevegelse i hver rad uansett hvor båndet brytes — seks, fire
 * eller tre kolonner.
 *
 * PLASSERINGEN ER IKKE JEVN. Klippene ligger på 2, 5, 7 og 11. På seks
 * kolonner gir det rad 1 kolonne 2 og 5, rad 2 kolonne 1 og 5; på fire
 * kolonner 1-2, 2-1, 2-3, 3-3; på tre 1-2, 2-2, 3-1, 4-2. Et jevnt mønster
 * (2, 5, 8, 11) ville lagt seg i to rette spalter på seks kolonner.
 *
 * TONE ANNENHVER. Rad 1 åpner lyst (aktivering), rad 2 åpner mørkt (kontor).
 * Lyse og mørke celler veksler gjennom hele båndet, slik at ingen halvdel
 * blir en klump.
 *
 * BREDDE OG DYBDE. Tolv celler dekker aktivering, kafé, sport, event,
 * velvære, industri, næringsliv, bakeri, produkt, livsstil, servering og
 * scene. Sunkost går igjen to ganger — produktbildet og matchaklippet — og
 * det er med vilje: det er den eneste kunden båndet viser i dybden.
 *
 * KLIPPENE ER BESKÅRET TIL 4:5 VED ENKODING, ikke i CSS. Reel-klippene
 * beholder 9:16 fordi de brukes to steder i ulik form; båndklippene brukes
 * ett sted, i én form. Da er det billigere å kode bort de 30 prosentene
 * som aldri vises: 480×600, ~6 sekunder, til sammen 794 kB for fire klipp.
 */
export const band: Medie[] = [
  { type: "foto", fil: "aktivering", alt: "Utendørs aktivering med rosa stand og publikum" },
  { type: "video", fil: "matcha", alt: "Vertikalt klipp av matcha som vispes" },
  { type: "foto", fil: "goretex2", alt: "Nærbilde av en sko på asfalt" },
  { type: "foto", fil: "dag4", alt: "Opptak med kamera under et arrangement" },
  { type: "video", fil: "spa", alt: "Vertikalt klipp fra behandlingsrom" },
  { type: "foto", fil: "fabrikk", alt: "Ansatte i arbeidstøy i et produksjonslokale" },
  { type: "video", fil: "kontor", alt: "Vertikalt klipp fra en arbeidsplass" },
  { type: "foto", fil: "dag6", alt: "Bakverk i en disk" },
  { type: "foto", fil: "sunkost", alt: "Produktbilde av pakninger og glass" },
  { type: "foto", fil: "mat2", alt: "Person om bord i en båt" },
  { type: "video", fil: "servering", alt: "Vertikalt klipp fra et måltid" },
  { type: "foto", fil: "scene", alt: "Foredragsholder foran en skjerm" },
];
