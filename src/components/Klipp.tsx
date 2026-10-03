/**
 * Ett dekorativt klipp.
 *
 * SAMLET 16.09.2026. Nøyaktig det samme <video>-elementet, med de samme ti
 * attributtene, lå fire steder: i ReelVegg, i Arbeidsbilder, innebygd i
 * heroen på forsiden, og i en HeroVideo-komponent ingenting importerte.
 * Fire kopier betyr fire steder å glemme `playsInline` — og uten den spiller
 * ikke klippet på iPhone i det hele tatt, det går i fullskjerm.
 *
 * HVER ATTRIBUTT HAR EN GRUNN:
 *
 * - `muted` er ikke en smaksbeslutning. Autospill med lyd er blokkert i
 *   alle nettlesere; uten `muted` spiller ingenting av dette.
 * - `playsInline` er iOS-kravet. Uten den overtar Safari og spiller i
 *   fullskjerm ved autospill.
 * - `loop`, fordi klippene er 6–8 sekunder og skal lese som bevegelse i en
 *   flate, ikke som en film med slutt.
 * - `aria-hidden` og `tabIndex={-1}`, fordi informasjonen ligger i teksten
 *   rundt. Et dekorativt klipp i tabrekkefølgen er bare en stopp uten
 *   innhold for den som bruker tastatur.
 * - `disablePictureInPicture` og `controlsList`, så nettleserens egne
 *   kontroller ikke dukker opp over et element uten lyd og uten kontroller.
 *
 * ABSOLUTT POSISJONERT, og det er ikke kosmetikk. Et <video> uten
 * width/height har en egen naturlig størrelse fra fila — 640x1138 for et
 * stående klipp. I normalflyt blir `height: 100%` mot en forelder med auto
 * høyde behandlet som auto, og da bestemmer VIDEOEN hvor høy rammen blir.
 * Det kostet en runde i prisseksjonen: teksten skulle bestemme høyden, men
 * klippet dyttet raden til 540 px og teksten fikk 68 px dødplass under seg.
 *
 * Rammen rundt må derfor ha `relative` og en egen høyde eller et format.
 */
export function Klipp({
  sti,
  poster,
  festRef,
  ivrig = false,
}: {
  /** Full sti til mp4-fila, uten endelse. Plakaten hentes fra samme sti. */
  sti: string;
  /** Overstyr plakaten når den ikke ligger ved siden av klippet. */
  poster?: string;
  /** Fra `useSpillNarSynlig`. Utelates for klipp som spiller umiddelbart. */
  festRef?: (el: HTMLVideoElement | null) => void;
  /**
   * `ivrig` er for klipp over folden. De spiller uten IntersectionObserver,
   * fordi det ikke finnes noen «kommer i synsfeltet»-hendelse å vente på —
   * de er der fra første sekund. De får også `preload="metadata"`, siden
   * ventetiden er synlig akkurat der.
   */
  ivrig?: boolean;
}) {
  return (
    <video
      ref={festRef}
      className="absolute inset-0 size-full object-cover"
      /*
        PLAKATEN SETTES FØRST NÅR FLATEN NÆRMER SEG, for alt som ikke er
        `ivrig`. Endret 03.10.2026 etter måling.

        `poster` laster ALLTID, uavhengig av `preload`. Forsiden har 22
        klipp, og plakatbildene deres var 600 kB som ble hentet før noen
        hadde rullet en piksel — mer enn alt annet på siden til sammen
        utenom heroklippet.

        Attributtet ligger i `data-plakat` og flyttes til `poster` av
        `useSpillNarSynlig`, 200 px før cellen kommer i bildet. Fram til da
        står figurens egen `bg-flate-dempet`, som er den samme flaten
        plakaten uansett ligger på.

        DEN SETTES OGSÅ NÅR BEVEGELSE ER AVSLÅTT. Det er hele poenget med
        plakaten for den brukeren — se useSpillNarSynlig, der forlasteren
        kjører uansett og bare avspillingen står over.
      */
      {...(ivrig
        ? { poster: poster ?? `${sti}.jpg` }
        : { "data-plakat": poster ?? `${sti}.jpg` })}
      preload={ivrig ? "metadata" : "none"}
      autoPlay={ivrig || undefined}
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      controlsList="nodownload noremoteplayback nofullscreen"
    >
      <source src={`${sti}.mp4`} type="video/mp4" />
    </video>
  );
}
