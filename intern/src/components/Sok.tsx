"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { Rubrikkort } from "@/components/Rubrikkort";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
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
 *
 * ── «/» OG ESC, SAMME SOM I MALVELGEREN (28.09.2026) ──────────────────────
 *
 * Intranettet hadde to søkefelt som oppførte seg ulikt: i malvelgeren
 * fokuserte «/» feltet og Esc tømte det, her gjorde ingen av delene noe.
 * To felt i samme verktøy som svarer ulikt på samme tast, er verre enn to
 * felt uten snarveier — det lærer folk at snarveien ikke kan stoles på.
 *
 * Feltet AUTOFOKUSERER IKKE, av samme grunn som der: på telefon spretter
 * tastaturet opp før man har sett siden, mellomrom slutter å rulle, og en
 * skjermleser begynner midt på siden i stedet for på toppen. Dette er en
 * startside — den skal møte deg med innhold, ikke med en markør.
 */
/**
 * Ord som finnes i brødteksten, men ikke i noen rubrikktittel. Det er
 * hele demonstrasjonen: søket finner setningen, ikke bare overskriften.
 */
const FORSLAG = ["romtone", "hvitbalanse", "mygg", "emneknagg", "oppsigelse"];

export function Sok({
  rubrikker,
  tilstander,
  children,
}: {
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  /**
   * Listen man blar i. Serverkode, sendt inn som `children` — se
   * kommentaren over `{!soker && children}` nederst for hvorfor den bor
   * her og ikke ved siden av.
   */
  children: ReactNode;
}) {
  const [sok, settSok] = useState("");
  const feltet = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function påTast(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = document.activeElement;
      /* Skriver du allerede et sted, er «/» en skråstrek. */
      if (
        i instanceof HTMLInputElement ||
        i instanceof HTMLTextAreaElement ||
        i instanceof HTMLSelectElement ||
        (i instanceof HTMLElement && i.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      feltet.current?.focus();
      feltet.current?.select();
    }
    window.addEventListener("keydown", påTast);
    return () => window.removeEventListener("keydown", påTast);
  }, []);

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
      <div className="relative max-w-[40rem]">
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
          ref={feltet}
          id="sok"
          type="search"
          value={sok}
          onChange={(e) => settSok(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              settSok("");
              e.currentTarget.blur();
            }
          }}
          placeholder="Søk i alt — også midt i brødteksten"
          /*
            RINGEN VED FOKUS, IKKE BARE EN KANTFARGE. Før byttet kanten til
            aksentfargen, og på en beige flate er den forskjellen for liten
            til å se hvor markøren er. `ring` legger en egen strek utenpå og
            er den samme markeringen som resten av siden bruker.

            `appearance-none` fjerner nettleserens egen lille kryssknapp i
            `type="search"`. Den tegnes ulikt i hver nettleser, den er
            omtrent 10 px stor, og vi har vår egen rett ved siden av.
          */
          className="w-full appearance-none rounded-flate border border-kant bg-kort py-4 pr-24 pl-13 text-[1.0625rem] text-blekk shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition-[border-color,box-shadow] placeholder:text-blekk-svak hover:border-kant-sterk focus:border-kant-sterk focus:ring-2 focus:ring-aksent/35 focus:outline-none motion-reduce:transition-none [&::-webkit-search-cancel-button]:hidden"
        />

        {/*
          TØMMEKNAPPEN ERSTATTER NETTLESERENS EGEN. Den er 32 px, den har
          et navn for skjermlesere, og den setter fokus tilbake i feltet —
          det siste er poenget: den som tømmer, skal som regel skrive noe
          annet, ikke begynne på nytt med musa.
        */}
        {soker ? (
          <button
            type="button"
            aria-label="Tøm søket"
            onClick={() => {
              settSok("");
              feltet.current?.focus();
            }}
            className="absolute top-1/2 right-3.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-blekk-svak transition-colors hover:bg-dempet hover:text-blekk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
          >
            <span aria-hidden>✕</span>
          </button>
        ) : (
          /*
            Tasten står i feltet, ikke i en hjelpetekst under. Et hint man
            må lete etter, er ikke et hint. Den forsvinner i det feltet tas
            i bruk, for da har den gjort jobben sin.
          */
          <kbd
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rounded-sm border border-kant px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none text-blekk-svak max-sm:hidden"
          >
            /
          </kbd>
        )}
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
        <div className="mt-3 flex max-w-[40rem] flex-wrap items-center gap-2">
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
                <Rubrikkort
                  key={r.slug}
                  rubrikk={r}
                  tilstand={tilstander[r.slug] ?? "ulest"}
                  fyll
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/*
        BLA-LISTEN LIGGER INNI SØKET, og det er en oppførsel og ikke en
        forglemmelse.

        Da den lå ved siden av, sto hele biblioteket fortsatt under mens
        man leste fire treff. Man måtte selv holde orden på hva som var
        svar og hva som var listen man nettopp forlot. Nå bytter seksjonen
        tilstand: enten blar du, eller så søker du.

        Den er servergjengitt og sendes inn som `children`. Den går altså
        ikke over ledningen som klientkode, og den bygges ikke på nytt når
        man skriver — React beholder den mens den er skjult.
      */}
      {!soker && children}
    </div>
  );
}
