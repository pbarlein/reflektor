import Link from "next/link";

import { BOLKER, type Bolk, type Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Alt innholdet, organisert — og framdriften lest på tre nivåer.
 *
 * ── HVA SOM VAR GALT MED KARUSELLENE ──────────────────────────────────────
 *
 * Forsiden hadde én vannrett karusell PER KATEGORI. Tallene avslører formen:
 * åtte kategorier og seksten rubrikker i drift, altså åtte karuseller med TO
 * kort i hver. En karusell er en form for når det er mer enn det er plass
 * til; med to kort er signalet «det finnes mer her» en løgn.
 *
 * ── HVORFOR KORT OG IKKE BARE LINJER (28.09.2026) ─────────────────────────
 *
 * Første indeks var riktig i strukturen og flat å se på: åtte overskrifter
 * med linjer under, alt på samme flate. Den var lett å lese og ga ingen
 * følelse av hvor man var.
 *
 * Nå er hver kategori et kort. Det koster litt høyde og gir én ting
 * tilbake som linjer ikke kan: en kategori kan bli FERDIG, og et kort kan
 * vise det. Det er hele gamifiseringen, og den er med vilje så liten.
 *
 * ── FRAMDRIFT PÅ TRE NIVÅER, INGEN AV DEM MED SKRYT ───────────────────────
 *
 *   1. HELHETEN — en stolpe delt i én rute per rubrikk, gruppert slik
 *      kategoriene er gruppert under. Stolpen ER innholdsfortegnelsen i
 *      miniatyr, ikke en prosent.
 *   2. FASEN — nummerskiltet på kortet fylles når begge rubrikkene i
 *      kategorien er lest. Man skanner etter fylte skilt.
 *   3. RUBRIKKEN — hake eller tom ring på hver linje.
 *
 * Det som IKKE er her, er valgt bort like bevisst: ingen poeng, ingen
 * merker, ingen «bra jobba», ingen konfetti, ingen rekker eller striper.
 * Dette leses av voksne fagfolk hver dag, og et system som klapper deg på
 * hodet for å ha lest en tekst om lyd, blir gjennomskuet første gang og
 * irriterende andre.
 *
 * Belønningen er at ruta fylles. Det er den samme belønningen som ligger i
 * å krysse av på en liste, og den har holdt i hundre år fordi den ikke
 * later som den er noe annet enn det den er.
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

  return (
    <section
      aria-labelledby="oversikt"
      className="mx-auto w-full max-w-[88rem] px-5 pt-14 pb-4 sm:px-8 sm:pt-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="min-w-0">
          <h2
            id="oversikt"
            className="display text-[clamp(1.375rem,2.6vw,1.875rem)] tracking-[-0.02em] text-blekk"
          >
            Alt innholdet
          </h2>
          <p className="mt-1.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
            Samme rubrikker som over, sortert etter hvor i arbeidet de hører
            hjemme.
          </p>
        </div>

        <Stolpen grupper={grupper} erLest={erLest} lest={lest} />
      </div>

      <div className="mt-9 flex flex-col gap-9 sm:gap-11">
        {BOLKER_I_ORDEN.map((bolk) => {
          const iBolk = grupper.filter((g) => g.kategori.bolk === bolk);
          if (!iBolk.length) return null;
          const b = BOLKER[bolk];

          return (
            /*
              ── BOLKEN STÅR I MARGEN, IKKE OVER ─────────────────────────

              Første utkast la bolkoverskriften på en linje over et rutenett
              på tre. Det ser riktig ut for HÅNDVERKET, som har fem
              kategorier — men KUNDEN har én og OSS har to, og da sto to
              tredeler av raden tom uten at tomrommet betydde noe. I margen
              er den samme plassen brukt til noe.
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

              <ul className="grid gap-3 sm:grid-cols-2">
                {iBolk.map(({ kategori, rubrikker }) => (
                  <li key={kategori.id}>
                    <Fasekort
                      kategori={kategori}
                      rubrikker={rubrikker}
                      tilstander={tilstander}
                      erLest={erLest}
                    />
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

/**
 * Stolpen: én rute per rubrikk, gruppert som kategoriene under.
 *
 * ── HVORFOR IKKE EN PROSENT ───────────────────────────────────────────────
 *
 * «38 %» er ett tall om en samling på seksten. Det sier hvor langt du er
 * kommet og ingenting om hva som gjenstår. Rutene sier begge deler samtidig,
 * og mellomrommene mellom gruppene gjør at man ser HVOR hullene er — de
 * står i samme rekkefølge som kortene lenger nede.
 *
 * Den er `aria-hidden`. Teksten ved siden av sier «x av y lest», og hvert
 * kort under sier sitt eget. En skjermleser skal ikke måtte høre seksten
 * ruter lest opp for å få en opplysning som allerede står i klartekst.
 */
function Stolpen({
  grupper,
  erLest,
  lest,
}: {
  grupper: readonly Gruppe[];
  erLest: (r: Rubrikk) => boolean;
  lest: number;
}) {
  const alle = grupper.flatMap((g) => g.rubrikker);

  return (
    <div className="min-w-0 shrink-0">
      <p className="text-[0.9375rem] text-blekk-dempet">
        <span className="font-medium text-blekk tabular-nums">{lest}</span> av{" "}
        <span className="tabular-nums">{alle.length}</span> lest
      </p>
      <div aria-hidden className="mt-2 flex items-center gap-[0.3rem]">
        {grupper.map((g) => (
          <div key={g.kategori.id} className="flex gap-[0.1rem]">
            {g.rubrikker.map((r) => (
              <span
                key={r.slug}
                className={`h-1.5 w-[0.9rem] rounded-[1px] transition-colors duration-500 motion-reduce:transition-none ${
                  erLest(r) ? "bg-aksent" : "bg-kant-sterk/45"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Ett kort per kategori.
 *
 * FERDIG-TILSTANDEN ER HELE BELØNNINGEN. Nummerskiltet fylles, og en hake
 * kommer i høyre hjørne. Ingenting annet skjer — ingen animasjon som feirer,
 * ingen tekst som roser. Kortet sier bare hva som er sant.
 *
 * Kategorier uten nummer (Kundeforholdet, Standarden, Markedsposisjon) har
 * ikke fase-nummer i domenet, og får derfor en prikk i skiltets plass. Å
 * finne på et nummer til dem ville antydet en rekkefølge som ikke finnes.
 */
function Fasekort({
  kategori,
  rubrikker,
  tilstander,
  erLest,
}: {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  erLest: (r: Rubrikk) => boolean;
}) {
  const antallLest = rubrikker.filter(erLest).length;
  const ferdig = antallLest === rubrikker.length && rubrikker.length > 0;

  return (
    <div
      className={`h-full overflow-hidden rounded-flate border bg-kort transition-colors duration-300 motion-reduce:transition-none ${
        ferdig ? "border-aksent/35" : "border-kant"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-2.5">
        <span
          aria-hidden
          className={`flex size-6 shrink-0 items-center justify-center rounded-full font-sans text-[0.6875rem] font-medium tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
            ferdig
              ? "bg-aksent text-white"
              : "border border-kant text-blekk-svak"
          }`}
        >
          {kategori.nr ? String(kategori.nr).padStart(2, "0") : "·"}
        </span>

        <h4 className="min-w-0 flex-1 text-[0.9375rem] font-medium text-blekk">
          {kategori.navn}
        </h4>

        <span
          className={`shrink-0 font-sans text-[0.6875rem] tabular-nums ${
            ferdig ? "text-aksent-tekst" : "text-blekk-svak"
          }`}
        >
          {ferdig ? "Ferdig" : `${antallLest}/${rubrikker.length}`}
        </span>
      </div>

      <ul className="flex flex-col">
        {rubrikker.map((r) => (
          <li key={r.slug}>
            <Linje rubrikk={r} tilstand={tilstander[r.slug] ?? "ulest"} />
          </li>
        ))}
      </ul>
    </div>
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
      className="group flex items-baseline gap-2.5 border-t border-kant px-4 py-2.5 transition-colors hover:bg-dempet focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
    >
      {/*
        Haken er en ring når den er tom. En tom plass ville fungert like
        godt visuelt, men da mister linjene sitt felles venstrestøtte og
        titlene står i sikksakk.
      */}
      <span
        aria-hidden
        className={`mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full text-[0.625rem] leading-none transition-colors motion-reduce:transition-none ${
          lest
            ? "bg-blekk-dempet text-kort"
            : "border border-kant text-transparent group-hover:border-kant-sterk"
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
