"use client";

import { useMemo, useState } from "react";

import { Rubrikkort } from "@/components/Rubrikkort";
import type { Rubrikk } from "@/content/rubrikktype";
import { sokeTekst, treffer } from "@/lib/sok";

/**
 * Søket.
 *
 * SKILT UT FRA KATEGORIENE, og det er hele poenget med omleggingen. Radene
 * er for den som blar; søket er for den som vet hva hen leter etter. De to
 * skal ikke blandes i samme kontroll.
 *
 * FINNBARHET PÅ SEKUNDER ER IKKE EN LUKSUS. Gjennomgående funn i
 * undersøkelser av intranett er at bruken faller sammen når folk ikke
 * finner fram raskt. Derfor: ett felt, alltid øverst, som går i HELE
 * brødteksten og ikke bare i titlene. Den som søker «romtone» leter ikke
 * etter en rubrikktittel — hen leter etter setningen ordet står i.
 *
 * INGEN INDEKS, INGEN BIBLIOTEK. Det er under femti rubrikker. En
 * `includes` over femti strenger er raskere enn å laste et søkebibliotek,
 * og den kan ikke bli utdatert i forhold til innholdet.
 */
/**
 * Ord som finnes i brødteksten, men ikke i noen rubrikktittel. Det er
 * hele demonstrasjonen: søket finner setningen, ikke bare overskriften.
 */
const FORSLAG = ["romtone", "hvitbalanse", "mygg", "emneknagg", "oppsigelse"];

export function Sok({ rubrikker }: { rubrikker: readonly Rubrikk[] }) {
  const [sok, settSok] = useState("");

  const indeks = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of rubrikker) m.set(r.slug, sokeTekst(r));
    return m;
  }, [rubrikker]);

  const treff = useMemo(() => {
    if (!sok.trim()) return [];
    return rubrikker
      .filter((r) => treffer(indeks.get(r.slug) ?? "", sok))
      .sort((a, b) => b.prioritet - a.prioritet);
  }, [rubrikker, sok, indeks]);

  const soker = sok.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <label htmlFor="sok" className="sr-only">
          Søk i alt innhold
        </label>
        {/*
          FORSTØRRELSESGLASSET ER `aria-hidden`. Etiketten over sier allerede
          hva feltet er, og `type="search"` sier det til teknologien. Ikonet
          er der for øyet, som en pekepinn på at feltet er hovedinngangen og
          ikke et filter på noe i nærheten.
        */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-blekk-svak"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          id="sok"
          type="search"
          value={sok}
          onChange={(e) => settSok(e.target.value)}
          placeholder="Søk i alt — også midt i brødteksten"
          className="w-full rounded-interaktiv border border-kant bg-kort py-4 pr-5 pl-13 text-[1.0625rem] text-blekk shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition-colors placeholder:text-blekk-svak hover:border-kant-sterk focus:border-aksent focus:outline-none motion-reduce:transition-none"
        />
      </div>

      {/*
        FORSLAGENE ER KLIKKBARE, ikke pynt i en plassholder.

        Plassholderen sa før «Prøv «romtone», «hook» eller «oppsigelse»» —
        men en plassholder forsvinner i det man begynner å skrive, og den
        kan ikke trykkes på. Som knapper gjør de to ting: de viser at søket
        går i brødteksten og ikke bare i titlene, og de gir den som ikke vet
        hva hen leter etter et sted å begynne.

        Ordene er valgt fordi de IKKE står i noen rubrikktittel. Et søk på
        «romtone» som gir treff, beviser poenget på ett klikk.
      */}
      {!soker && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[0.8125rem] text-blekk-svak">Prøv</span>
          {FORSLAG.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => settSok(f)}
              className="rounded-interaktiv border border-kant bg-kort px-3 py-1.5 text-[0.8125rem] text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {soker && (
        <div className="mt-8">
          {/*
            `aria-live` fordi treffantallet endrer seg mens man skriver,
            uten at noe flytter fokus. Uten den får en skjermleserbruker
            ingen beskjed om at søket ga null treff.
          */}
          <p aria-live="polite" className="text-[0.9375rem] text-blekk-dempet">
            {treff.length === 0 ? (
              <>
                Ingen treff på «{sok.trim()}».{" "}
                <button
                  type="button"
                  onClick={() => settSok("")}
                  className="rounded-interaktiv font-medium text-aksent-tekst underline underline-offset-4"
                >
                  Tøm søket
                </button>{" "}
                for å bla i stedet.
              </>
            ) : (
              <>
                {treff.length} {treff.length === 1 ? "treff" : "treff"} på «
                {sok.trim()}»
              </>
            )}
          </p>

          {treff.length > 0 && (
            /*
              TREFF VISES SOM RUTENETT, ikke som rader. Et søkeresultat har
              ingen kategorirekkefølge å formidle — det har bare relevans,
              og da er en vannrett rad å gjemme bort halve svaret.
            */
            <div className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(17rem,1fr))]">
              {treff.map((r) => (
                <Rubrikkort key={r.slug} rubrikk={r} fyll />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
