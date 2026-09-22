import Link from "next/link";

import { Godkjentmerke } from "@/components/Godkjenning";
import { Lesemerke } from "@/components/Lesemerke";
import { Medieflate } from "@/components/Medieflate";
import { finnKategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Ett kort i en rad.
 *
 * HELE KORTET ER ÉN LENKE, ikke et kort med en lenke inni. Et kort der bare
 * tittelen er klikkbar, er et kort folk klikker feil på. Konsekvensen er at
 * ingenting inni kan være interaktivt — og det er greit: en rubrikk har én
 * handling.
 *
 * FAST BREDDE, fordi kortet ligger i en vannrett rad. Et kort med relativ
 * bredde ville krympet når raden ble lang. Bredden er valgt så det så vidt
 * vises et snitt av neste kort på vanlige skjermbredder — det er signalet
 * om at raden fortsetter.
 */
export function Rubrikkort({
  rubrikk,
  tilstand = "ulest",
  prioritert = false,
  fyll = false,
}: {
  rubrikk: Rubrikk;
  /** Lesestatus. Regnes for hele samlingen i src/lib/lesing.ts. */
  tilstand?: Lesetilstand;
  /** Kun for kort over folden. `priority` på alle ville bedt om alt samtidig. */
  prioritert?: boolean;
  /**
   * Fyll cellen i stedet for å ha fast bredde. Søketreff vises i et
   * rutenett, der fast bredde ville etterlatt hull i hver rad.
   */
  fyll?: boolean;
}) {
  const kategori = finnKategori(rubrikk.kategori);

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className={`group flex flex-col overflow-hidden rounded-flate border border-kant bg-kort transition-colors hover:border-kant-sterk motion-reduce:transition-none ${
        fyll ? "w-full" : "w-[17rem] shrink-0 sm:w-[19rem]"
      }`}
    >
      {/*
        `relative` OG ET FAST FORMAT. Medieflaten er absolutt posisjonert —
        et <video> uten width/height tar ellers sin egen naturlige størrelse
        og bestemmer kortets høyde.

        `overflow-hidden` ligger her og ikke på kortet, så zoomen klippes av
        medierammen.
      */}
      <div className="relative aspect-[16/10] overflow-hidden bg-dempet">
        {/*
          LEST DEMPER MEDIET. Merket alene er lite; sammen med et litt
          blassere bilde ser man på en halv sekund hvilke kort man er
          ferdig med, uten å lese et eneste ord. Hover setter det tilbake,
          så ingenting føles utilgjengelig.
        */}
        <div
          className={`absolute inset-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:saturate-100 motion-reduce:transform-none motion-reduce:transition-none ${
            tilstand === "lest" ? "opacity-55 saturate-[0.55]" : ""
          }`}
        >
          <Medieflate medie={rubrikk.medie} prioritert={prioritert} />
        </div>
        <Lesemerke tilstand={tilstand} />
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.92)] px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-blekk uppercase backdrop-blur-sm">
          {kategori.nr ? (
            <span aria-hidden className="tabular-nums text-aksent-tekst">
              {String(kategori.nr).padStart(2, "0")}
            </span>
          ) : (
            <span aria-hidden className="size-1.5 rounded-full bg-aksent" />
          )}
          {kategori.kort}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3.5 pb-4">
        <h3 className="display text-[1.25rem] leading-[1.12] tracking-[-0.02em] text-blekk">
          {rubrikk.tittel}
        </h3>
        <p className="text-[0.875rem] leading-relaxed text-pretty text-blekk-dempet">
          {rubrikk.sammendrag}
        </p>

        {/*
          `mt-auto` skyver bunnraden ned uansett hvor langt sammendraget er.
          Uten den står merkelappene i sikksakk på tvers av raden.
        */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-kant pt-3">
          <Godkjentmerke godkjent={rubrikk.godkjent} />
          <span className="text-[0.75rem] tracking-[0.02em] text-blekk-svak">
            {lesetid(rubrikk)} min
          </span>
        </div>
      </div>
    </Link>
  );
}
