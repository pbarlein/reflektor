import type { Eksempeldata } from "@/content/rubrikktype";

/**
 * Et eksempel fra virkeligheten, innebygd fra Instagram.
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
 *    Hver innbygging laster skript fra Meta. Uten lazy ville en artikkel
 *    med tre eksempler lastet tre Meta-rammer før leseren hadde kommet til
 *    første avsnitt. Nå lastes de først når noen ruller dit.
 *
 * ── TALLENE ───────────────────────────────────────────────────────────────
 *
 * `folgere`, `visninger` og `likes` er OFFENTLIGE tall hentet med
 * Supermetrics (Instagram Public Data, Business Discovery) på datoen i
 * `hentet`. De er ikke anslag, og de er ikke våre egne. De står der av én
 * grunn: «dette virker» er en påstand, «denne har 2,5 millioner visninger»
 * er en opplysning.
 *
 * Tallene vokser etter at de er hentet. Derfor står datoen alltid ved
 * siden av — et tall uten dato er et tall som blir feil av seg selv.
 */
export function Eksempel({ data }: { data: Eksempeldata }) {
  const kode = data.url.match(/\/reel\/([^/?]+)/)?.[1];
  if (!kode) return null;

  const tall = (n: number) => n.toLocaleString("nb-NO");

  return (
    <figure className="max-w-[46rem] overflow-hidden rounded-flate border border-kant bg-kort">
      {/*
        HVEM. Første blokk, og den eneste som er på aksentfarget flate —
        fordi det er den som avgjør om leseren tar resten alvorlig.
      */}
      <div className="border-b border-kant bg-dempet px-5 py-4 sm:px-6">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
          Fra en av verdens beste
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <a
            href={`https://www.instagram.com/${data.konto}/`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[1.0625rem] font-medium text-aksent-tekst underline underline-offset-4"
          >
            @{data.konto}
          </a>
          <span className="text-[0.8125rem] text-blekk-svak">
            <span className="tabular-nums">{tall(data.folgere)}</span> følgere
          </span>
        </p>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
          {data.hvem}
        </p>
      </div>

      {/*
        «SE ETTER» STÅR OVER INNBYGGINGEN. Det er hele forskjellen på et
        eksempel og en illustrasjon: leseren skal vite hva hen ser etter
        FØR hen trykker play, ellers ser hen bare en fin video.
      */}
      <div className="border-b border-kant px-5 py-4 sm:px-6">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
          Se etter
        </p>
        <p className="mt-2 text-[1rem] leading-relaxed text-pretty text-blekk">
          {data.seEtter}
        </p>
      </div>

      <div className="flex justify-center bg-dempet px-4 py-5">
        {/*
          Fast høyde og maksbredde. Instagram-rammen skalerer ikke selv, og
          uten en ramme rundt blir den enten bitteliten eller dominerende.
        */}
        <iframe
          src={`https://www.instagram.com/reel/${kode}/embed/`}
          title={`Eksempel fra @${data.konto} på Instagram`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          referrerPolicy="origin-when-cross-origin"
          className="h-[620px] w-full max-w-[400px] rounded-flate border-0 bg-kort"
        />
      </div>

      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-t border-kant px-5 py-3.5 text-[0.8125rem] sm:px-6">
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-aksent-tekst underline underline-offset-4"
        >
          Se posten på Instagram
        </a>
        <span className="text-blekk-svak">
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
    </figure>
  );
}
