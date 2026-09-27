import Link from "next/link";

import { BOLKER, type Bolk, type Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Alt innholdet, organisert.
 *
 * ── HVA SOM VAR GALT MED DET FORRIGE ──────────────────────────────────────
 *
 * Forsiden hadde én vannrett karusell PER KATEGORI. Det hørtes rimelig ut
 * da det ble bygget, men tallene avslører formen: det er åtte kategorier og
 * seksten rubrikker i drift. Altså åtte karuseller med TO kort i hver.
 *
 * En karusell er en form for når det er mer enn det er plass til. Med to
 * kort er det ingenting å bla til, og signalet «det finnes mer her» er en
 * løgn. Samtidig kostet de åtte radene rundt to og en halv skjermhøyde, og
 * de kom under en seksjon som viste de samme kortene igjen.
 *
 * ── HVA DEN ER NÅ ─────────────────────────────────────────────────────────
 *
 * En indeks. Tre bolker, åtte kategorier, seksten linjer — alt sammen på
 * omtrent én skjerm, uten en eneste sidelengs bevegelse.
 *
 * Det er MED VILJE en annen form enn rekka øverst. De to gjør ulike ting:
 * rekka er pensum i lesereferanse, med bilder, for den som skal komme
 * gjennom. Indeksen er oppslag, uten bilder, for den som vet hva hen leter
 * etter og vil dit på ett blikk. Samme seksten rubrikker, to inngangeriker
 * — det er ikke dobbelt opp, det er to ulike spørsmål.
 *
 * Miniatyrer er utelatt her med hensikt. De ville gjort indeksen like høy
 * som karusellene var, og et bilde hjelper ikke den som allerede vet hva
 * hen leter etter.
 *
 * ── LESESTATUS STÅR FØRST PÅ LINJA ────────────────────────────────────────
 *
 * Den er det eneste som skiller to ellers like linjer, og øyet leser fra
 * venstre. Sto den til høyre, måtte man lese hele tittelen for å finne ut
 * om man var ferdig med den.
 */

export type Gruppe = {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
};

export function Oversikt({
  grupper,
  tilstander,
}: {
  grupper: readonly Gruppe[];
  tilstander: Record<string, Lesetilstand>;
}) {
  const bolker: Bolk[] = ["handverk", "kunde", "oss"];

  return (
    <section
      aria-labelledby="oversikt"
      className="mx-auto w-full max-w-[88rem] px-5 pt-14 pb-4 sm:px-8 sm:pt-20"
    >
      <h2
        id="oversikt"
        className="display text-[clamp(1.375rem,2.6vw,1.875rem)] tracking-[-0.02em] text-blekk"
      >
        Alt innholdet
      </h2>
      <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
        Samme rubrikker som over, sortert etter hvor i arbeidet de hører hjemme.
      </p>

      <div className="mt-8 flex flex-col gap-9 sm:gap-11">
        {bolker.map((bolk) => {
          const iBolk = grupper.filter((g) => g.kategori.bolk === bolk);
          if (!iBolk.length) return null;
          const b = BOLKER[bolk];

          return (
            /*
              ── BOLKEN STÅR I MARGEN, IKKE OVER ─────────────────────────

              Første utkast la bolkoverskriften på en linje over et
              rutenett på tre. Det ser riktig ut for HÅNDVERKET, som har
              fem kategorier — men KUNDEN har én og OSS har to, og da sto
              to tredeler av raden tom uten at tomrommet betydde noe.

              Med bolken i venstre marg er den samme plassen brukt til noe:
              navnet og ingressen står ved siden av det de gjelder, og
              rutenettet til høyre er like fullt enten bolken har én
              kategori eller fem. Under lg legger det seg tilbake til
              overskrift over innhold, der det ikke er marg å ta av.
            */
            <div
              key={bolk}
              className="grid gap-x-10 gap-y-5 border-t border-kant-regel pt-5 lg:grid-cols-[13rem_1fr]"
            >
              <div>
                <h3 className="font-sans text-xs font-medium tracking-[0.1em] text-aksent-tekst uppercase">
                  {b.navn}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                  {b.ingress}
                </p>
              </div>

              {/*
                Kategoriene ved siden av hverandre, ikke under. Med to
                rubrikker i hver blir en kategori tre linjer høy, og tre
                linjer stablet åtte ganger er en kolonne ingen orker å lese
                til bunns.
              */}
              <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {iBolk.map(({ kategori, rubrikker }) => (
                  <li key={kategori.id}>
                    <h4 className="flex items-baseline gap-2 text-[0.9375rem] font-medium text-blekk">
                      {kategori.nr && (
                        <span
                          aria-hidden
                          className="font-sans text-[0.6875rem] font-medium text-blekk-svak tabular-nums"
                        >
                          {String(kategori.nr).padStart(2, "0")}
                        </span>
                      )}
                      {kategori.navn}
                    </h4>

                    <ul className="mt-2 flex flex-col">
                      {rubrikker.map((r) => (
                        <li key={r.slug}>
                          <Linje
                            rubrikk={r}
                            tilstand={tilstander[r.slug] ?? "ulest"}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Linje({
  rubrikk,
  tilstand,
}: {
  rubrikk: Rubrikk;
  tilstand: Lesetilstand;
}) {
  const lest = tilstand === "lest";
  const minutter = lesetid(rubrikk);

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className="group flex items-baseline gap-2.5 border-t border-kant py-2 transition-colors hover:bg-dempet focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-aksent"
    >
      {/*
        Haken er en ring når den er tom. En tom plass ville fungert like
        godt visuelt, men da mister linjene sitt felles venstrestøtte og
        titlene står i sikksakk.
      */}
      <span
        aria-hidden
        className={`mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full text-[0.625rem] leading-none ${
          lest
            ? "bg-blekk-dempet text-kort"
            : "border border-kant text-transparent"
        }`}
      >
        ✓
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`text-[0.9375rem] leading-snug text-pretty transition-colors group-hover:text-aksent-tekst motion-reduce:transition-none ${
            lest ? "text-blekk-dempet" : "text-blekk"
          }`}
        >
          {rubrikk.tittel}
        </span>
        {tilstand === "ny" && (
          <span className="ml-2 align-middle font-sans text-[0.625rem] font-medium tracking-[0.08em] text-aksent-tekst uppercase">
            Ny
          </span>
        )}
        {!rubrikk.godkjent && (
          /*
            Utkastmerket følger rubrikken overalt ellers på siden, og det
            skal følge den her også. En indeks som skjuler at halvparten
            ikke er kvalitetssikret, er en indeks som lyver ved utelatelse.
          */
          <span className="ml-2 align-middle font-sans text-[0.625rem] font-medium tracking-[0.08em] text-varsel uppercase">
            Utkast
          </span>
        )}
      </span>

      <span className="shrink-0 font-sans text-[0.6875rem] text-blekk-svak tabular-nums">
        {minutter} min
      </span>
      <span className="sr-only">{lest ? "Lest" : "Ikke lest"}</span>
    </Link>
  );
}
