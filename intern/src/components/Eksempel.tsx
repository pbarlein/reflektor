import type { Eksempeldata } from "@/content/rubrikktype";

/**
 * Eksempler fra virkeligheten, innebygd fra Instagram.
 *
 * ── DE STÅR VED SIDEN AV HVERANDRE ────────────────────────────────────────
 *
 * Først lå de under hverandre i full bredde. En rubrikk med tre eksempler
 * ble da over fem tusen piksler lang, og den som ville sammenligne to av
 * dem måtte bla forbi det ene for å se det andre. Det er det motsatte av
 * hva et eksempelpar er til for: «Klipperytme» setter en iskremoppskrift
 * mot en eiendomsvisning, og hele poenget er at de ses sammen.
 *
 * Nå ligger de i et rutenett. Tre får plass i bredden på en stor skjerm,
 * to på en laptop og ett på telefon. Kortene er smalere enn før, og
 * innbyggingen følger bredden på kortet.
 *
 * ── HVEM EKSEMPELET ER FRA STÅR ØVERST ────────────────────────────────────
 *
 * Ikke av høflighet. Et eksempel er bare overbevisende hvis leseren tror
 * det gjelder hen. En produsent som skal lage innhold for en hudklinikk,
 * en isbutikk eller et bemanningsbyrå, avviser et klipp fra en matblogger
 * i samme sekund hen ser hvem det er fra — og hen har rett i å gjøre det.
 *
 * Derfor står det, før alt annet: hvilket selskap dette er, hva de selger,
 * og hvor store de er. Alle eksemplene i huben er fra selskaper som selger
 * et produkt eller en tjeneste, og som er blant de beste i verden på dette.
 * Det skal leseren kunne se, ikke tro på.
 *
 * ── TRE VALG SOM BØR FORKLARES ────────────────────────────────────────────
 *
 * 1. OFFISIELL INNBYGGING, IKKE EN KOPI AV VIDEOEN.
 *
 *    Det fristende alternativet er å laste ned klippet og hoste det selv.
 *    Da hadde vi fått sømløs autospilling. Vi hadde også publisert andres
 *    opphavsrettsbeskyttede arbeid under Reflektors navn, uten avtale.
 *
 *    `/embed/` er Instagrams egen, sanksjonerte mekanisme. Den krediterer
 *    kontoen, lenker tilbake, og viser alltid gjeldende versjon — slettes
 *    posten, forsvinner den, som den skal.
 *
 * 2. DEN AUTOSPILLER IKKE, og det er ikke noe vi kan gjøre noe med.
 *
 *    Instagram blokkerer autospilling i innbygginger. Det er en beslutning
 *    på plattformsiden. Alternativet var punkt 1, og det er ikke et
 *    alternativ.
 *
 * 3. `loading="lazy"`.
 *
 *    Hver innbygging laster skript fra Meta. Uten lazy ville en rubrikk
 *    med tre eksempler lastet tre Meta-rammer før leseren hadde kommet til
 *    første avsnitt. Nå lastes de først når noen ruller dit.
 *
 * ── TALLENE ───────────────────────────────────────────────────────────────
 *
 * `folgere`, `visninger` og `likes` er offentlige tall hentet med
 * Supermetrics (Instagram Public Data, Business Discovery) på datoen i
 * `hentet`. De er ikke anslag, og de er ikke våre egne. De står der av én
 * grunn: «dette virker» er en påstand, «denne har 2,5 millioner visninger»
 * er en opplysning.
 *
 * Tallene vokser etter at de er hentet. Derfor står datoen alltid ved
 * siden av — et tall uten dato er et tall som blir feil av seg selv.
 */
export function Eksempelrad({
  eksempler,
}: {
  eksempler: readonly Eksempeldata[];
}) {
  /*
   * ETT EKSEMPEL FÅR EN ANNEN FORM. Et enslig kort i rutenettet står med
   * teksten over innbyggingen og tomrom ved siden av — over tusen piksler
   * høyt, uten at noe fyller plassen til høyre. Legger vi de to delene ved
   * siden av hverandre i stedet, blir det samme innholdet omtrent
   * halvparten så høyt.
   */
  if (eksempler.length === 1) {
    return <Eksempel data={eksempler[0]} liggende />;
  }

  return (
    /*
     * BUNNEN LIGGER I SPORET, TAKET LIGGER PÅ KORTET. Det er ikke en
     * smakssak, det er hvordan `auto-fit` regner.
     *
     * Sporet er `minmax(20rem, 1fr)`. Bunnen på 20rem er der fordi
     * Instagrams innbygging blir trang under omtrent 320 piksler.
     *
     * Taket måtte derimot flyttes ut av sporet. Med et fast tak —
     * `minmax(20rem, 24rem)` — teller nettleseren sporene ut fra TAKET, og
     * da fikk det bare plass til to. Med `1fr` telles de ut fra bunnen, og
     * det blir tre. Kortet får maksbredden sin av `max-w` i stedet.
     *
     * Taket trengs fordi et kort som vokser, vokser i BEGGE retninger:
     * innbyggingen holder høyde–bredde-forholdet sitt, så et bredere kort
     * er også et høyere kort. Første forsøk uten tak ga to kort på 478
     * piksler som til sammen ble høyere enn tre smale — altså mer
     * scrolling, ikke mindre.
     */
    <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
      {eksempler.map((data) => (
        <Eksempel key={data.url} data={data} />
      ))}
    </div>
  );
}

function Eksempel({
  data,
  liggende = false,
}: {
  data: Eksempeldata;
  liggende?: boolean;
}) {
  const kode = data.url.match(/\/reel\/([^/?]+)/)?.[1];
  if (!kode) return null;

  const tall = (n: number) => n.toLocaleString("nb-NO");

  const hvem = (
    <div className="border-b border-kant bg-dempet px-4 py-3">
      <p className="font-sans text-[0.6875rem] font-medium tracking-[0.08em] text-blekk-dempet uppercase">
        Fra en av verdens beste
      </p>
      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <a
          href={`https://www.instagram.com/${data.konto}/`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[0.9375rem] font-medium text-aksent-tekst underline underline-offset-4"
        >
          @{data.konto}
        </a>
        <span className="text-[0.75rem] text-blekk-svak">
          <span className="tabular-nums">{tall(data.folgere)}</span> følgere
        </span>
      </p>
      <p className="mt-1 text-[0.8125rem] leading-snug text-pretty text-blekk-dempet">
        {data.hvem}
      </p>
    </div>
  );

  {
    /*
      «SE ETTER» STÅR FØR INNBYGGINGEN, både i markeringen og visuelt. Det
      er hele forskjellen på et eksempel og en illustrasjon: leseren skal
      vite hva hen ser etter FØR hen trykker på play, ellers ser hen bare
      en fin video.
    */
  }
  const seEtter = (
    <div className="flex-1 border-b border-kant px-4 py-3.5">
      <p className="font-sans text-[0.6875rem] font-medium tracking-[0.08em] text-blekk-dempet uppercase">
        Se etter
      </p>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk">
        {data.seEtter}
      </p>
    </div>
  );

  const bunntekst = (
    <figcaption className="px-4 py-3 text-[0.75rem]">
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-aksent-tekst underline underline-offset-4"
      >
        Se posten på Instagram
      </a>
      <span className="mt-1 block text-blekk-svak">
        <span className="font-medium text-blekk-dempet tabular-nums">
          {tall(data.visninger)}
        </span>{" "}
        visninger · <span className="tabular-nums">{tall(data.likes)}</span>{" "}
        likes · hentet{" "}
        <time dateTime={data.hentet}>
          {new Date(data.hentet).toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </span>
    </figcaption>
  );

  {
    /*
      `aspect-ratio` og ikke fast høyde. Rammen følger bredden på kortet,
      og kortbredden bestemmes av hvor mange eksempler som står i raden og
      hvor bred skjermen er.
    */
  }
  const ramme = (
    <iframe
      src={`https://www.instagram.com/reel/${kode}/embed/`}
      title={`Eksempel fra @${data.konto} på Instagram`}
      loading="lazy"
      allow="encrypted-media; picture-in-picture"
      className="aspect-[100/158] w-full rounded-flate border-0 bg-kort"
      referrerPolicy="origin-when-cross-origin"
    />
  );

  if (liggende) {
    return (
      /*
       * TEKSTEN FØRST I MARKERINGEN, OG DERMED FØRST OVERALT.
       *
       * Første forsøk brukte `flex-row-reverse` med innbyggingen først i
       * DOM-en. Det så riktig ut på en bred skjerm, men på telefon — der
       * raden blir en kolonne — havnet rammen ØVERST, og leseren møtte
       * videoen før hen fikk vite hva hen skulle se etter. Det samme
       * gjaldt for en skjermleser.
       *
       * Vanlig `flex-row` med teksten først løser begge deler: på telefon
       * stables de med teksten øverst, på bred skjerm står teksten til
       * venstre og innbyggingen til høyre.
       */
      <figure className="flex w-full max-w-[46rem] flex-col overflow-hidden rounded-flate border border-kant bg-kort sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          {hvem}
          {seEtter}
          {bunntekst}
        </div>
        <div className="shrink-0 bg-dempet p-3 sm:w-[19rem] sm:border-l sm:border-kant">
          {ramme}
        </div>
      </figure>
    );
  }

  return (
    /*
     * `flex-col` med et voksende tekstfelt. Kortene i samme rad er like
     * høye fordi rutenettet strekker dem. Når «se etter»-feltet får lov
     * til å vokse, havner innbyggingene på samme høyde i alle kortene,
     * selv om den ene teksten er to linjer lengre enn den andre.
     */
    <figure className="flex w-full max-w-[24rem] flex-col overflow-hidden rounded-flate border border-kant bg-kort">
      {hvem}
      {seEtter}
      <div className="bg-dempet p-3">{ramme}</div>
      <div className="border-t border-kant">{bunntekst}</div>
    </figure>
  );
}
