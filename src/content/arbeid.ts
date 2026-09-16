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
/** Foto eller klipp. Veggen bruker dette; rutenettet utvider det. */
export type Medie = { type: "foto" | "video"; fil: string; alt: string };

/** Én celle i rutenettet: samme felter som veggen, pluss høydevekten. */
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
 * VEGGEN: to rader som driver hver sin vei mens du ruller.
 *
 * Forrige versjon var tolv like 4:5-celler i et rutenett. Det var ryddig og
 * helt uten liv — et kontaktark. En vegg av arbeid skal se ut som mengde i
 * bevegelse, ikke som en oversikt.
 *
 * TRE TING GJØR JOBBEN, og de virker bare sammen:
 *
 * 1. FAST HØYDE, VARIERENDE BREDDE. Hver celle er like høy som raden og
 *    får bredden sin av formatet: 9:16 blir smal, 1:1 kvadratisk, 16:9 bred.
 *    Det er slik en filmstrimmel faktisk ser ut. Et rutenett med like celler
 *    kan ikke gi den rytmen uansett hva man fyller det med.
 * 2. TO RADER, MOTSATT RETNING. Én rad som beveger seg leser som en feil.
 *    To som glir fra hverandre leser som lag, og gir dybde uten parallakse
 *    eller skygge.
 * 3. DRIVKRAFTEN ER RULLINGEN, IKKE EN TIDTAKER. Se Arbeidsbilder.tsx.
 *
 * FORMATENE ER VALGT ETTER MOTIVET, ikke etter et mønster. Bildene er 2:3
 * i kilden, så 3:4 og 4:5 er milde beskjæringer og 1:1 er en hard en — den
 * brukes bare der motivet tåler det (stand, gruppe, sko, disk, arbeidstøy).
 * De to 16:9-cellene er de eneste liggende klippene vi har, og de er
 * radenes ankere: 600 px brede mot 190 for et stående klipp.
 *
 * SUNKOST TO GANGER, MED VILJE. Matcha i rad 1 og kakao i rad 2. Det er den
 * ene kunden veggen viser i dybden, og de to filmene er visuelt ulike nok
 * til at det leser som en serie og ikke som en gjentakelse. Produktbildet
 * som lå her før er tatt ut — klippet gjør samme jobb, i bevegelse.
 *
 * SYV KLIPP MOT ELLEVE BILDER, men klippene tar mer plass: de to liggende
 * alene er bredere enn fire stående bilder. Video er hovedsaken, og det er
 * bredden som avgjør det, ikke antallet.
 */
export type Veggcelle = Medie & {
  /** Bredden følger av formatet, siden høyden er låst til raden. */
  format: "9/16" | "3/4" | "4/5" | "1/1" | "16/9";
};

export const veggrader: Veggcelle[][] = [
  [
    { type: "video", fil: "noods", alt: "Liggende klipp av nudelretter ovenfra", format: "16/9" },
    { type: "foto", fil: "dag4", alt: "Opptak med kamera under et arrangement", format: "3/4" },
    { type: "video", fil: "matcha", alt: "Vertikalt klipp av matcha som vispes", format: "9/16" },
    { type: "foto", fil: "fabrikk", alt: "Ansatte i arbeidstøy i et produksjonslokale", format: "1/1" },
    { type: "video", fil: "spa", alt: "Vertikalt klipp fra behandlingsrom", format: "9/16" },
    { type: "foto", fil: "goretex2", alt: "Nærbilde av en sko på asfalt", format: "1/1" },
    { type: "video", fil: "bekkestua", alt: "Vertikalt klipp fra et treningslokale", format: "9/16" },
    { type: "foto", fil: "peppes2", alt: "Gjest ved et bord med pizza", format: "4/5" },
    { type: "foto", fil: "industri", alt: "Nærbilde av slitt arbeidsutstyr", format: "1/1" },
  ],
  [
    { type: "foto", fil: "aktivering", alt: "Utendørs aktivering med stand og publikum", format: "1/1" },
    { type: "video", fil: "kontor", alt: "Vertikalt klipp fra en arbeidsplass", format: "9/16" },
    { type: "foto", fil: "mat2", alt: "Person om bord i en båt", format: "3/4" },
    { type: "video", fil: "servering", alt: "Liggende klipp fra et måltid", format: "16/9" },
    { type: "video", fil: "kakao", alt: "Vertikalt klipp av kakaodrikk som helles", format: "9/16" },
    { type: "foto", fil: "dag6", alt: "Bakverk i en disk", format: "1/1" },
    { type: "foto", fil: "portrett", alt: "Portrett utendørs mot blå himmel", format: "3/4" },
    { type: "foto", fil: "kafe2", alt: "Person i genser fotografert bakfra utendørs", format: "3/4" },
    { type: "foto", fil: "scene", alt: "Foredragsholder foran en skjerm", format: "3/4" },
  ],
];
