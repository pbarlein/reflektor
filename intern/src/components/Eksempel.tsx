import type { Eksempeldata } from "@/content/rubrikktype";

/**
 * Et eksempel fra virkeligheten, innebygd fra Instagram.
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
 * `visninger` og `likes` er OFFENTLIGE tall hentet med Supermetrics
 * (Instagram Public Data, Business Discovery) på datoen i `hentet`. De er
 * ikke anslag, og de er ikke våre egne. De står der av én grunn: «dette
 * virker» er en påstand, «denne har 20,5 millioner visninger» er en
 * opplysning.
 *
 * Tallene vokser etter at de er hentet. Derfor står datoen alltid ved
 * siden av — et tall uten dato er et tall som blir feil av seg selv.
 */
export function Eksempel({ data }: { data: Eksempeldata }) {
  const kode = data.url.match(/\/reel\/([^/?]+)/)?.[1];
  if (!kode) return null;

  return (
    <figure className="max-w-[46rem] overflow-hidden rounded-flate border border-kant bg-kort">
      {/*
        «SE ETTER» STÅR FØRST, over innbyggingen. Det er hele forskjellen
        på et eksempel og en illustrasjon: leseren skal vite hva hen ser
        etter FØR hen trykker play, ellers ser hen bare en fin video.
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
          @{data.konto} på Instagram
        </a>
        <span className="text-blekk-svak">
          <span className="font-medium text-blekk-dempet tabular-nums">
            {data.visninger.toLocaleString("nb-NO")}
          </span>{" "}
          visninger ·{" "}
          <span className="tabular-nums">
            {data.likes.toLocaleString("nb-NO")}
          </span>{" "}
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
