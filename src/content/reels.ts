/**
 * Klippene i reel-veggen på forsiden.
 *
 * Utvalget er gjort på BREDDE OG DYBDE, ikke på hva som er penest.
 * Seksjonen svarer på «kan de levere for noen som oss?».
 *
 * Bredde: tre kunder i tre ulike sektorer — sportsretail, hotell og spa,
 * bakeri. Reflektors arkiv har slagside mot servering, det er der de har
 * flest kunder, og nettopp derfor må veggen vise noe annet. Bakeriet er
 * likevel med: mat ER kjernekompetansen, og å utelate den for å bevise
 * bredde ville vært å skjule ekspertisen.
 *
 * Dybde: TO klipp fra Anton Sport, side om side. Det ene viser butikken,
 * det andre et enkeltmerke de fører. Det er ikke tapt bredde — det er det
 * sterkeste beviset veggen kan gi for selve ABONNEMENTET, som er produktet
 * siden selger. Ett vakkert klipp viser at de kan filme. To klipp fra samme
 * kunde, med ulikt fokus, viser hva en måned med avtale faktisk produserer.
 *
 * Rekkefølgen er ikke tilfeldig: de to Anton Sport-klippene ligger inntil
 * hverandre, så paringen leser som et valg og ikke som gjentakelse.
 *
 * Flere sektorer krever flere godkjente navn. Et klipp uten navn gir visuell
 * variasjon, men ikke troverdighet — og det er navnet som gjør bredden til
 * et argument. Logorekken under heroen bærer sju navn i mellomtiden.
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
  /** Hva klippet viser. Bransje eller produktfokus. */
  kontekst: string;
  /** Alt-tekst for posterbildet. Beskriver hva man ser. */
  alt: string;
  merknad?: string;
};

export const reels: Reel[] = [
  {
    fil: "antonsport",
    kunde: "Anton Sport",
    kontekst: "Sportsbutikk",
    alt: "Vertikalt klipp fra sportsbutikk",
  },
  {
    fil: "goretex",
    kunde: "Anton Sport",
    kontekst: "Gore-Tex",
    alt: "Vertikalt klipp av friluftsprodukt i Gore-Tex",
    merknad:
      "Avklart av Pål 15.09: Gore-Tex er et merke Anton Sport fører, og klippet er produsert for dem med det merket i fokus. Ikke en egen kunde.",
  },
  {
    fil: "thewell",
    kunde: "The Well",
    kontekst: "Spa og hotell",
    alt: "Vertikalt klipp fra spaavdelingen: gongbad og behandling",
    // BYTTET 16.09.2026. Her lå bassengklippet: en nesten stillestående
    // vannflate med teksten «Hos oss er det alltid 30 grader i vannet», et
    // prisoverlegg og et logokort på slutten. Det er en annonse, ikke et
    // arbeidsprøve, og det var det roligste klippet i veggen.
    //
    // MERK for den som leter i Dropbox: fila som HETER
    // «TheWell_Spa_9-16.mov» er nettopp det bassengklippet. Spaavdelingen
    // ligger i «Meditation Reel Short.mov» — gongbad, klangboller,
    // behandlinger og hvilerommet. Filnavnet lyver, innholdet ikke.
    //
    // PLAKATEN ER VALGT FOR HÅND HER, og det er første gang. Regelen ellers
    // er «skarpeste ramme inne i klippet», og den er god — men den
    // optimaliserer for det STILLESTÅENDE. Bevegelsesuskarphet fjerner
    // kanter, så på et klipp som er valgt nettopp fordi det har bevegelse,
    // plukker regelen systematisk den minst representative ramma. Her ga
    // den et arkitekturbilde av hvilerommet: skarpest i klippet, og det
    // stikk motsatte av hvorfor klippet ble byttet inn.
    //
    // Valgt ramme er gongen i det slaget treffer. Sjekket ved å legge ni
    // kandidater ved siden av hverandre i FAKTISK visningsstørrelse —
    // 285x570 px, 8:16, slik reel-veggen beskjærer. Ved den størrelsen var
    // det tydelig at rammene rett etter er ubrukelige: gongen svinger inn
    // i forgrunnen og er ute av fokus. I en miniatyr så de skarpe ut.
    //
    // Lærdommen, for neste gang: skarphet er et GULV, ikke et mål. Og
    // kandidater skal alltid vurderes i den størrelsen de faktisk vises i.
  },

  {
    fil: "soulcake",
    kunde: "Soul Cake",
    kontekst: "Bakeri",
    alt: "Vertikalt klipp fra bakeri",
  },
];
