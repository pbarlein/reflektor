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
        <input
          id="sok"
          type="search"
          value={sok}
          onChange={(e) => settSok(e.target.value)}
          placeholder="Søk i alt — også i brødteksten. Prøv «romtone», «hook» eller «oppsigelse»."
          className="w-full rounded-interaktiv border border-kant bg-kort px-4 py-3.5 text-[1rem] text-blekk placeholder:text-blekk-svak focus:border-aksent focus:outline-none"
        />
      </div>

      {soker && (
        <div className="mt-8">
          {/*
            `aria-live` fordi treffantallet endrer seg mens man skriver,
            uten at noe flytter fokus. Uten den får en skjermleserbruker
            ingen beskjed om at søket ga null treff.
          */}
          <p
            aria-live="polite"
            className="text-[0.9375rem] text-blekk-dempet"
          >
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
