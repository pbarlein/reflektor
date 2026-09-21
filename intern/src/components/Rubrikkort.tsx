import Link from "next/link";

import { Godkjentmerke } from "@/components/Godkjenning";
import { Medieflate } from "@/components/Medieflate";
import { finnKategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Én klikkbar rubrikk.
 *
 * HELE KORTET ER ÉN LENKE, ikke et kort med en lenke inni. Et kort der bare
 * tittelen er klikkbar, er et kort folk klikker feil på — og «kortet ser
 * klikkbart ut, men bare tittelen er det» er en av de mest irriterende
 * tingene et grensesnitt kan gjøre.
 *
 * Konsekvensen er at ingenting inni kan være interaktivt. Det er en
 * begrensning, og den er verdt prisen her: en rubrikk har én handling —
 * åpne den.
 *
 * KATEGORIEN STÅR SOM NUMMER PÅ FASENE. Det er den samme skinna som over
 * rutenettet, i miniatyr: ser du «03 Opptak», vet du hvor i arbeidet du er
 * uten å lese noe mer. Nyhetskategoriene har ikke nummer, fordi de ikke er
 * steg i noe — se kategorier.ts.
 */
export function Rubrikkort({
  rubrikk,
  fremhevet = false,
  prioritert = false,
}: {
  rubrikk: Rubrikk;
  /** De øverste kortene får høyere medieflate og større tittel. */
  fremhevet?: boolean;
  prioritert?: boolean;
}) {
  const kategori = finnKategori(rubrikk.kategori);

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className="kort-inn group glassflate-rolig flex flex-col overflow-hidden rounded-flate border border-[color:var(--kant-pa-dyp)] transition-colors hover:border-aksent/60 motion-reduce:transition-none"
    >
      {/*
        `relative` OG ET FAST FORMAT PÅ RAMMEN. Medieflaten er absolutt
        posisjonert — et <video> uten width/height tar ellers sin egen
        naturlige størrelse og bestemmer kortets høyde. Det kostet en runde
        i hovedprosjektet.

        `overflow-hidden` ligger HER og ikke på kortet: zoomen på hover skal
        klippes av medierammen, mens kortet selv må slippe å være en
        rullecontainer — se kort-inn i globals.css.
      */}
      <div
        className={`relative overflow-hidden ${
          fremhevet ? "aspect-[4/3]" : "aspect-[16/10]"
        }`}
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none">
          <Medieflate medie={rubrikk.medie} prioritert={prioritert} />
        </div>
        {/*
          Skygge nedover, så etiketten øverst og kanten mot teksten under
          holder seg lesbare uansett hva klippet viser. Gradient og ikke en
          flat overlegg: en flat demping ville tatt like mye fra det mørke
          hjørnet som fra det lyse.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[rgba(27,15,12,0.92)] via-[rgba(27,15,12,0.18)] to-transparent"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(27,15,12,0.72)] px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-pa-dyp uppercase backdrop-blur-sm">
          {kategori.nr ? (
            <span aria-hidden className="tabular-nums text-aksent">
              {String(kategori.nr).padStart(2, "0")}
            </span>
          ) : (
            <span aria-hidden className="size-1.5 rounded-full bg-aksent" />
          )}
          {kategori.kort}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <h3
          className={`display leading-[1.08] tracking-[-0.02em] text-pa-dyp ${
            fremhevet ? "text-[1.6rem]" : "text-[1.3rem]"
          }`}
        >
          {rubrikk.tittel}
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
          {rubrikk.sammendrag}
        </p>

        {/*
          `mt-auto` skyver bunnraden ned uansett hvor lang sammendraget er.
          Uten den ligger merkelappen rett under teksten, og i et rutenett
          med ulik tekstlengde står de i sikksakk på tvers av raden.
        */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--kant-pa-dyp)]/70 pt-3.5">
          <Godkjentmerke godkjent={rubrikk.godkjent} />
          <span className="text-[0.75rem] tracking-[0.02em] text-pa-dyp-svak">
            {rubrikk.lesetid} min
          </span>
        </div>
      </div>
    </Link>
  );
}
