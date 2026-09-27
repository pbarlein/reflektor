import Link from "next/link";

import { Medieflate } from "@/components/Medieflate";
import { Sok } from "@/components/Sok";
import { BOLKER, type Bolk, type Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Pensum: seksten rubrikker, satt som fasene de hører til.
 *
 * ── DEN STØRSTE FEILEN VAR AT DET STO TO GANGER ───────────────────────────
 *
 * Forsiden hadde «Dette må du kunne godt» som en sidelengs rekke, og «Alt
 * innholdet» som et rutenett under. Begge viste de samme seksten
 * rubrikkene, med samme lesestatus, i hver sin form. Det er ikke to
 * innganger til noe — det er den samme listen to ganger, og spørsmålet som
 * kom tilbake var «er det de samme tekstene bare komprimert?».
 *
 * Det var det. De er slått sammen til én seksjon, og søket ligger i den,
 * fordi det er en kontroll på listen og ikke en egen sak.
 *
 * ── HVORFOR RADER OG IKKE KOLONNER ────────────────────────────────────────
 *
 * En tidligere utgave satte de fem fasene som fem kolonner med to ruter
 * stablet under hver. Spørsmålet som kom tilbake da var: «er det to
 * artikler under vertikalt som hører til den navngitte fasen?»
 *
 * Det er oppsettets feil, ikke leserens. Et rutenett med to elementer i
 * hver kolonne kan leses begge veier, og ingenting i formen sier hvilken.
 * I tillegg gikk rekkefølgen 01 til 05 mot høyre, mens alt annet på en
 * nettside går nedover.
 *
 * Nå er hver fase en RAD: nummer og navn til venstre, rubrikkene til høyre.
 * Da finnes det bare én leseretning, og den er den samme som resten av
 * siden.
 *
 * ── «START HER» ER ORD, IKKE EN RØD RAMME ─────────────────────────────────
 *
 * Rammen rundt ett kort «så tilfeldig ut», og det var en rimelig reaksjon:
 * den pekte på rubrikk elleve uten å si hvorfor, i en liste som ellers
 * begynner på 01.
 *
 * Den er byttet mot setningen som allerede sto i innholdet. `fremhevet` er
 * et felt der den som fremhever MÅ skrive hvorfor — se testen i
 * tests/lesing.test.ts. Den begrunnelsen står nå øverst i seksjonen som
 * vanlig tekst med en lenke. Da er det ikke en markør som må tydes, det er
 * en setning som kan være enig eller uenig med leseren.
 *
 * Den fremhevede rubrikken vises ikke som et eget kort i tillegg. Da ville
 * den stått to ganger i samme seksjon, og vi er tilbake til feilen over.
 *
 * ── HVA SOM SNAKKER TIL EN ERFAREN PRODUSENT ──────────────────────────────
 *
 * Hen skal ikke ledes i hånda gjennom seksten tekster. Hen trenger å se hva
 * som finnes, hvor det hører hjemme i arbeidet, og hva hen ikke har lest.
 * Tre opplysninger, alle lesbare uten forklaring. Spor, prikker og
 * framdriftsstolper må tydes før de gir mening, og det er en kostnad uten
 * motytelse.
 */

export type Gruppe = {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
};

const BOLKER_I_ORDEN: Bolk[] = ["handverk", "kunde", "oss"];

export function Oversikt({
  grupper,
  tilstander,
}: {
  grupper: readonly Gruppe[];
  tilstander: Record<string, Lesetilstand>;
}) {
  const erLest = (r: Rubrikk) => tilstander[r.slug] === "lest";
  const alle = grupper.flatMap((g) => g.rubrikker);
  const lest = alle.filter(erLest).length;
  const utkast = alle.filter((r) => !r.godkjent).length;
  const fremhevet = alle.find((r) => r.fremhevet);

  return (
    <section
      aria-labelledby="pensum"
      className="mx-auto w-full max-w-[88rem] px-5 pt-12 pb-8 sm:px-8 sm:pt-16"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
        <h2
          id="pensum"
          className="display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.025em] text-blekk"
        >
          Dette må du kunne godt
        </h2>
        <p className="text-[0.9375rem] text-blekk-dempet">
          <span className="font-medium text-blekk tabular-nums">{lest}</span> av{" "}
          <span className="tabular-nums">{alle.length}</span> lest
        </p>
      </div>

      {fremhevet && (
        <p className="mt-3 max-w-[68ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
          {fremhevet.fremhevet}{" "}
          <Link
            href={`/rubrikk/${fremhevet.slug}`}
            className="font-medium text-blekk underline decoration-aksent decoration-2 underline-offset-4 hover:text-aksent-tekst focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent"
          >
            {fremhevet.tittel}
          </Link>
        </p>
      )}

      {/*
        SØKET EIER LISTEN, den ligger ikke ved siden av. Søker man, byttes
        listen ut med treffene. Se `Sok`.
      */}
      <div className="mt-6">
        <Sok rubrikker={alle} tilstander={tilstander}>
          <div className="mt-10 flex flex-col gap-10 sm:gap-12">
            {BOLKER_I_ORDEN.map((bolk) => {
              const iBolk = grupper.filter((g) => g.kategori.bolk === bolk);
              if (!iBolk.length) return null;
              const b = BOLKER[bolk];

              return (
                <div key={bolk}>
                  {/*
                Navn og forklaring på samme linje. Som to linjer ble det en
                overskrift og et avsnitt for tre ord innhold, og seksjonen
                fikk mer tekst enn liste.
              */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <h3 className="font-sans text-[0.75rem] font-semibold tracking-[0.12em] text-blekk uppercase">
                      {b.navn}
                    </h3>
                    <p className="text-[0.875rem] text-blekk-dempet">
                      {b.ingress}
                    </p>
                  </div>

                  <ol className="mt-4">
                    {iBolk.map(({ kategori, rubrikker }) => (
                      <Rad
                        key={kategori.id}
                        kategori={kategori}
                        rubrikker={rubrikker}
                        tilstander={tilstander}
                        erLest={erLest}
                        prioriter={kategori.nr === 1}
                      />
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          {utkast > 0 && (
            <p className="mt-10 border-t border-kant-regel pt-3 text-[0.8125rem] text-blekk-svak">
              {utkast} av {alle.length} er fagutkast som ikke er kvalitetssikret
              ennå. Det står på hver enkelt rubrikk.
            </p>
          )}
        </Sok>
      </div>
    </section>
  );
}

/**
 * Én fase eller kategori, som en rad.
 *
 * ── TRE SPALTER, HVER MED ÉN JOBB ─────────────────────────────────────────
 *
 * ── TO SPALTER, IKKE TRE ──────────────────────────────────────────────────
 *
 * Venstre: hvor i arbeidet dette hører hjemme, og hvor langt du er kommet
 * på akkurat det. Høyre: hva som finnes.
 *
 * Tellingen sto i en egen tredje spalte ytterst til høyre. På en bred skjerm
 * lå den da 200 px fra nærmeste rute den handlet om, med tomrom imellom, og
 * et tall som svever alene blir et tall man må gjette hva gjelder. Den hører
 * sammen med fasenavnet — det er samme opplysning, sett forfra og bakfra.
 *
 * ── RUTENE HAR FAST BREDDE, IKKE SPALTEN ──────────────────────────────────
 *
 * Første forsøk ga midtspalten et tak på 44rem og delte den i tre. Da ble
 * ruta i en fase med to rubrikker like bred som i en fase med tre, hvilket
 * var poenget — men halve raden sto tom, og rutene ble små uten grunn.
 *
 * Nå er det RUTA som er 18rem på store skjermer, og spalten tar den bredden
 * innholdet trenger. Rutene står da i tre rette kolonner hele veien ned,
 * uansett om raden har én eller tre, og de er store nok til at bildet gjør
 * jobben sin. Under lg faller det tilbake til to og tre flytende kolonner,
 * fordi en fast bredde ikke kan få plass på en telefon.
 */
function Rad({
  kategori,
  rubrikker,
  tilstander,
  erLest,
  prioriter,
}: {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  erLest: (r: Rubrikk) => boolean;
  prioriter: boolean;
}) {
  const antallLest = rubrikker.filter(erLest).length;
  const ferdig = antallLest === rubrikker.length;

  return (
    <li className="grid gap-x-8 gap-y-3 border-t border-kant py-5 lg:grid-cols-[12rem_auto]">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 lg:block">
        {kategori.nr && (
          <span
            aria-hidden
            className={`display text-[1.25rem] tabular-nums lg:block ${
              ferdig ? "text-aksent-tekst" : "text-blekk-svak"
            }`}
          >
            {String(kategori.nr).padStart(2, "0")}
          </span>
        )}
        <h4 className="text-[1rem] font-medium text-balance text-blekk lg:mt-0.5">
          {kategori.navn}
        </h4>
        {/*
          Tellingen rett under navnet, ikke i en egen spalte. Se kommentaren
          over komponenten. Rutene sier allerede det samme ved å være dempet
          eller ikke — dette er for den som vil ha det presist.
        */}
        <p
          className={`font-sans text-[0.75rem] tabular-nums lg:mt-1.5 ${
            ferdig ? "text-aksent-tekst" : "text-blekk-svak"
          }`}
        >
          {antallLest}/{rubrikker.length}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-[repeat(3,18rem)]">
        {rubrikker.map((r) => (
          <li key={r.slug}>
            <Rute
              rubrikk={r}
              tilstand={tilstander[r.slug] ?? "ulest"}
              prioriter={prioriter}
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

function Rute({
  rubrikk,
  tilstand,
  prioriter,
}: {
  rubrikk: Rubrikk;
  tilstand: Lesetilstand;
  prioriter: boolean;
}) {
  const lest = tilstand === "lest";

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className="group block rounded-flate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-flate bg-dempet">
        <div
          className={`absolute inset-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:saturate-100 motion-reduce:transform-none motion-reduce:transition-none ${
            lest ? "opacity-40 saturate-[0.35]" : ""
          }`}
        >
          <Medieflate medie={rubrikk.medie} prioritert={prioriter} />
        </div>

        {lest && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-[rgba(255,255,255,0.94)] text-[0.625rem] text-blekk backdrop-blur-sm"
          >
            ✓
          </span>
        )}
      </div>

      <p
        className={`mt-1.5 text-[0.875rem] leading-snug text-pretty transition-colors group-hover:text-aksent-tekst motion-reduce:transition-none ${
          lest ? "text-blekk-svak" : "text-blekk"
        }`}
      >
        {rubrikk.tittel}
        {!rubrikk.godkjent && (
          <span className="sr-only"> (fagutkast, ikke kvalitetssikret)</span>
        )}
      </p>
      <p className="mt-0.5 font-sans text-[0.6875rem] text-blekk-svak tabular-nums">
        {lest ? "Lest" : `${lesetid(rubrikk)} min`}
      </p>
    </Link>
  );
}
