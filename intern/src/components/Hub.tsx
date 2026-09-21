"use client";

import { useMemo, useState } from "react";

import { Kategoriskinne } from "@/components/Kategoriskinne";
import { Rubrikkort } from "@/components/Rubrikkort";
import { finnKategori, type KategoriId } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import { sokeTekst, treffer } from "@/lib/sok";
import { sorter, useVisninger, type Sortering } from "@/lib/visninger";

const SORTERINGER: { id: Sortering; navn: string }[] = [
  { id: "brukt", navn: "Mest brukt av deg" },
  { id: "nytt", navn: "Sist oppdatert" },
  { id: "redaksjonelt", navn: "Viktigst først" },
];

/**
 * Huben: søk, filter, sortering og rutenettet.
 *
 * KLIENTKOMPONENT, og det er en bevisst avgrensning. Alt innholdet rendres
 * fra serveren i `page.tsx` og sendes inn som props — det er bare
 * INTERAKSJONEN som lever her. Hadde hele siden vært en klientkomponent,
 * ville tjuefire rubrikker med full brødtekst gått over ledningen som
 * JavaScript i stedet for som HTML.
 *
 * ── HVORFOR FØRSTE RENDER IKKE ER «MEST BRUKT» ───────────────────────────
 *
 * Tellerne ligger i `localStorage` og finnes ikke på serveren. Sorterer vi
 * etter dem under første render, får klienten et annet resultat enn
 * serveren, og React melder hydreringsfeil.
 *
 * Derfor: serveren rendrer redaksjonell rekkefølge, og `useEffect` leser
 * tellerne og sorterer om etter montering. På en fersk nettleser er de to
 * identiske — alle tellere er null, og da avgjør `prioritet` uansett. Den
 * som HAR brukt huben, ser rekkefølgen sin fra første blunk etter hydrering.
 */
export function Hub({ rubrikker }: { rubrikker: readonly Rubrikk[] }) {
  const [sok, settSok] = useState("");
  const [kategori, settKategori] = useState<KategoriId | null>(null);
  const [sortering, settSortering] = useState<Sortering>("brukt");
  /*
   * `useSyncExternalStore` og ikke `useEffect` + `setState`. Tellerne ligger
   * i localStorage, altså i en ekstern kilde, og kroken er laget for
   * nøyaktig det: den tar et eget serversnapshot (tomt) slik at hydrering
   * ikke kan gå i stykker, og den fanger opp endringer fra andre faner.
   * Se src/lib/visninger.ts.
   */
  const visninger = useVisninger();

  const antall = useMemo(() => {
    const t = {} as Record<KategoriId, number>;
    for (const r of rubrikker) t[r.kategori] = (t[r.kategori] ?? 0) + 1;
    return t;
  }, [rubrikker]);

  /* Søketeksten flates ut én gang, ikke per tastetrykk. */
  const indeks = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of rubrikker) m.set(r.slug, sokeTekst(r));
    return m;
  }, [rubrikker]);

  const treff = useMemo(() => {
    const filtrert = rubrikker.filter(
      (r) =>
        (kategori === null || r.kategori === kategori) &&
        treffer(indeks.get(r.slug) ?? "", sok),
    );
    return sorter(filtrert, sortering, visninger);
  }, [rubrikker, kategori, sok, sortering, visninger, indeks]);

  /*
   * DE TRE ØVERSTE FÅR STØRRE KORT, og de står i sitt eget rutenett.
   *
   * Én felles grid med to kortstørrelser gir ujevne rader så snart antall
   * kolonner ikke går opp i tre — på to kolonner ville kort nummer tre
   * (høyt) stått ved siden av kort fire (lavt). To rutenett kan ikke få det
   * problemet, og rekkefølgen leses fortsatt som én liste ovenfra og ned.
   */
  const fremst = treff.slice(0, 3);
  const resten = treff.slice(3);

  const valgtKategori = kategori ? finnKategori(kategori) : null;

  return (
    <div>
      <div className="glassflate-rolig rounded-flate border border-[color:var(--kant-pa-dyp)] px-6 py-7 sm:px-8 sm:py-8">
        <Kategoriskinne
          valgt={kategori}
          antall={antall}
          velg={settKategori}
        />

        {valgtKategori && (
          <p className="mt-6 border-t border-[color:var(--kant-pa-dyp)] pt-5 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
            <span className="font-medium text-pa-dyp">
              {valgtKategori.navn}.
            </span>{" "}
            {valgtKategori.beskrivelse}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--kant-pa-dyp)] pt-6 sm:flex-row sm:items-center">
          {/*
            `type="search"` og ikke `type="text"`: nettleseren gir da et
            kryss for å tømme feltet, og telefontastaturet får en søkeknapp.
            Begge deler gratis.
          */}
          <div className="relative flex-1">
            <label htmlFor="sok" className="sr-only">
              Søk i alt innhold
            </label>
            <input
              id="sok"
              type="search"
              value={sok}
              onChange={(e) => settSok(e.target.value)}
              placeholder="Søk — også i brødteksten. Prøv «lyd» eller «hook»."
              className="w-full rounded-interaktiv border border-[color:var(--kant-pa-dyp)] bg-[rgba(27,15,12,0.6)] px-4 py-2.5 text-[0.9375rem] text-pa-dyp placeholder:text-pa-dyp-svak focus:border-aksent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <label
              htmlFor="sortering"
              className="shrink-0 font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase"
            >
              Sorter
            </label>
            <select
              id="sortering"
              value={sortering}
              onChange={(e) => settSortering(e.target.value as Sortering)}
              className="rounded-interaktiv border border-[color:var(--kant-pa-dyp)] bg-[rgba(27,15,12,0.6)] px-3 py-2.5 text-[0.9375rem] text-pa-dyp focus:border-aksent focus:outline-none"
            >
              {SORTERINGER.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1B0F0C]">
                  {s.navn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*
          «AV DEG» STÅR DER MED VILJE. Tellingen skjer i denne nettleseren,
          ikke på tvers av huset — se src/lib/visninger.ts. Et grensesnitt
          som sier «mest populære» om et personlig tall, lyver litt hver
          gang det vises.

          `aria-live` fordi treffantallet endrer seg mens man skriver, uten
          at noe flytter fokus. Uten den får en skjermleserbruker ingen
          beskjed om at søket ga null treff.
        */}
        <p
          aria-live="polite"
          className="mt-4 text-[0.8125rem] text-pa-dyp-svak"
        >
          {treff.length} {treff.length === 1 ? "rubrikk" : "rubrikker"}
          {sortering === "brukt" &&
            " — de du åpner oftest, legger seg øverst. Tellingen ligger i denne nettleseren."}
        </p>
      </div>

      {treff.length === 0 ? (
        <p className="mt-10 rounded-flate border border-dashed border-[color:var(--kant-pa-dyp)] px-6 py-10 text-center text-pa-dyp-dempet">
          Ingen treff. Prøv et annet ord, eller{" "}
          <button
            type="button"
            onClick={() => {
              settSok("");
              settKategori(null);
            }}
            className="rounded-interaktiv font-medium text-aksent underline underline-offset-4"
          >
            nullstill filteret
          </button>
          .
        </p>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fremst.map((r, i) => (
              <Rubrikkort
                key={r.slug}
                rubrikk={r}
                fremhevet
                /* Kun de to første er over folden på en vanlig skjerm.
                   `priority` på alle ville bedt om alt samtidig, og da er
                   ingenting prioritert. */
                prioritert={i < 2}
              />
            ))}
          </div>
          {resten.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resten.map((r) => (
                <Rubrikkort key={r.slug} rubrikk={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
