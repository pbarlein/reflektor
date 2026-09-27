import Link from "next/link";

import { BOLKER, type Bolk, type Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Alt innholdet — satt som en innholdsfortegnelse, ikke som et rutenett.
 *
 * ── HVORFOR FORRIGE UTGAVE BLE REVET ──────────────────────────────────────
 *
 * Den var åtte like kort i to kolonner, hvert med et rundt nummerskilt, en
 * statuspille og avrundede hjørner, over en segmentert framdriftsstolpe.
 * Tilbakemeldingen var at det hadde «veldig ai-preg», og den var riktig.
 *
 * Kritikken er dokumentert og konkret. Gjennomgangene av maskingenerert
 * grensesnitt peker på de samme grepene hver gang: rutenett av identiske
 * kort med ikon, overskrift og to linjer tekst; statuspiller; avrundede
 * bokser på bokser. «Ingen enkelt detalj er stygg. Det er generisk på en
 * måte som stille sier at ingen har bestemt noe.»
 *
 * Det som gjorde forrige utgave gjenkjennelig var ikke at den var stygg,
 * men at hver eneste avgjørelse var den statistisk vanligste.
 *
 * ── HVA DEN ER NÅ, OG HVOR FORMEN KOMMER FRA ──────────────────────────────
 *
 * En innholdsfortegnelse. Formen er lånt fra trykte tidsskrifter, der en
 * liste over tekster har vært et løst problem i hundre år, og der ingen har
 * funnet på å sette den i kort.
 *
 * Works in Progress setter sin utgaveliste som rene typografiske linjer —
 * forfatter, emne, ingenting mer. Ingen rammer, ingen ikoner, ingen
 * merkelapper. Det er den disiplinen som er hentet hit.
 *
 * Fire grep, alle fra trykk:
 *
 *   1. LEDELINJEN. Prikkelinjen fra tittel til sidetall er selve
 *      innholdsfortegnelsens kjennetegn. Den gjør to ting på én gang: den
 *      knytter venstre og høyre kant sammen over en tom flate, og den gir
 *      øyet en skinne å følge. Ingen maskin foreslår den, fordi den nesten
 *      ikke finnes på nett.
 *   2. HENGENDE TALL. Fasenummeret står UTENFOR tekstblokken, i margen.
 *      Da leses navnene som en rett kolonne, og tallene som et register
 *      ved siden av.
 *   3. RYGGRADEN. De fem produksjonsfasene er en REKKEFØLGE — det er hele
 *      poenget med dem — og en rekkefølge tegnes som en linje. Kunden og
 *      Oss har ingen rekkefølge, og får derfor ingen linje. At de to
 *      settes ulikt er ikke inkonsekvens; det er forskjellen mellom dem.
 *   4. FOTNOTEMERKE I STEDET FOR STATUSPILLE. Fjorten av seksten rubrikker
 *      er utkast. Fjorten røde piller er ikke et varsel, det er et
 *      bakteppe. En stjerne i margen og én linje nederst sier det samme,
 *      og det er slik en fotnote har virket siden 1500-tallet.
 *
 * ── FRAMDRIFTEN LIGGER I TEKSTEN, IKKE I EN STOLPE ────────────────────────
 *
 * Den segmenterte stolpen er ute. Den var pen og den var en
 * dashbord-kliché.
 *
 * Nå står tallet der framdriften hører hjemme: i margen ved hver bolk, og
 * i høyre kolonne på hver linje. En ulest rubrikk viser hva den KOSTER —
 * «7 min». En lest viser «Lest». Samme plass, to tilstander, ingen ekstra
 * grafikk. Er hele fasen lest, fylles prikken på ryggraden.
 *
 * Det er hele gamifiseringen. Ingen poeng, ingen merker, ingen ros. Dette
 * leses av voksne fagfolk hver dag.
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

  return (
    <section
      aria-labelledby="oversikt"
      className="mx-auto w-full max-w-[88rem] px-5 pt-14 pb-6 sm:px-8 sm:pt-20"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-b border-blekk pb-4">
        <h2
          id="oversikt"
          className="display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.025em] text-blekk"
        >
          Alt innholdet
        </h2>
        <p className="font-sans text-[0.8125rem] tracking-[0.02em] text-blekk-dempet">
          <span className="tabular-nums">{lest}</span> av{" "}
          <span className="tabular-nums">{alle.length}</span> lest
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-11 sm:gap-14">
        {BOLKER_I_ORDEN.map((bolk) => {
          const iBolk = grupper.filter((g) => g.kategori.bolk === bolk);
          if (!iBolk.length) return null;
          const b = BOLKER[bolk];
          const iAlt = iBolk.flatMap((g) => g.rubrikker);
          const lestHer = iAlt.filter(erLest).length;

          /*
           * Bare produksjonsfasene har en rekkefølge, og bare de får
           * ryggraden. Se punkt 3 i toppkommentaren.
           */
          const sekvens = bolk === "handverk";

          return (
            <div
              key={bolk}
              className="grid gap-x-12 gap-y-6 lg:grid-cols-[15rem_minmax(0,46rem)]"
            >
              <div className="lg:pt-1">
                <h3 className="display text-[1.25rem] tracking-[-0.015em] text-blekk">
                  {b.navn}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                  {b.ingress}
                </p>
                <p className="mt-2.5 font-sans text-[0.75rem] tracking-[0.02em] text-blekk-svak">
                  <span className="tabular-nums">{lestHer}</span> av{" "}
                  <span className="tabular-nums">{iAlt.length}</span> lest
                </p>
              </div>

              <ol className="flex flex-col">
                {iBolk.map(({ kategori, rubrikker }, i) => (
                  <Fase
                    key={kategori.id}
                    kategori={kategori}
                    rubrikker={rubrikker}
                    tilstander={tilstander}
                    erLest={erLest}
                    sekvens={sekvens}
                    sist={i === iBolk.length - 1}
                  />
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {utkast > 0 && (
        /*
          FOTNOTEN. Den hører til stjernene i listen over, og den står
          derfor rett under dem — ikke nederst på siden som en generell
          advarsel. Det er slik en fotnote virker.
        */
        <p className="mt-12 max-w-[46rem] border-t border-kant-regel pt-3 text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak lg:ml-[calc(15rem+3rem)]">
          <span aria-hidden className="text-blekk-svak">
            *
          </span>{" "}
          {utkast} av {alle.length} er fagutkast som ikke er kvalitetssikret
          ennå.
        </p>
      )}
    </section>
  );
}

function Fase({
  kategori,
  rubrikker,
  tilstander,
  erLest,
  sekvens,
  sist,
}: {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  erLest: (r: Rubrikk) => boolean;
  sekvens: boolean;
  sist: boolean;
}) {
  const antallLest = rubrikker.filter(erLest).length;
  const ferdig = antallLest === rubrikker.length && rubrikker.length > 0;

  return (
    <li className={`relative ${sekvens ? "pl-9" : ""} ${sist ? "" : "pb-8"}`}>
      {sekvens && (
        <>
          {/*
            RYGGRADEN. Den går fra prikken og ned til neste fase, og den
            stopper på den siste — en linje som fortsetter ut i ingenting
            lover et sjette steg som ikke finnes.
          */}
          {!sist && (
            <span
              aria-hidden
              className="absolute top-4 bottom-0 left-[0.3125rem] w-px bg-kant-regel"
            />
          )}
          <span
            aria-hidden
            className={`absolute top-[0.34rem] left-0 size-2.5 rounded-full border transition-colors duration-500 motion-reduce:transition-none ${
              ferdig ? "border-aksent bg-aksent" : "border-kant-sterk bg-side"
            }`}
          />
        </>
      )}

      <div className="flex items-baseline gap-2.5">
        {kategori.nr && (
          /*
            HENGENDE TALL. Det står utenfor navnet, ikke i en sirkel foran
            det. En sirkel gjør tallet til et ikon; i margen er det et
            register.
          */
          <span
            aria-hidden
            className={`display shrink-0 text-[0.9375rem] tabular-nums ${
              ferdig ? "text-aksent-tekst" : "text-blekk-svak"
            }`}
          >
            {String(kategori.nr).padStart(2, "0")}
          </span>
        )}
        <h4 className="display min-w-0 text-[1.0625rem] tracking-[-0.01em] text-blekk">
          {kategori.navn}
        </h4>
        <Ledelinje />
        <span
          className={`shrink-0 font-sans text-[0.75rem] tabular-nums ${
            ferdig ? "text-aksent-tekst" : "text-blekk-svak"
          }`}
        >
          {antallLest}/{rubrikker.length}
        </span>
      </div>

      <ul className="mt-1">
        {rubrikker.map((r) => (
          <li key={r.slug}>
            <Linje rubrikk={r} tilstand={tilstander[r.slug] ?? "ulest"} />
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Prikkelinjen mellom tittel og tall.
 *
 * `items-end` på raden og en negativ forskyvning her gjør at linjen legger
 * seg ved grunnlinjen til SISTE linje i en tittel som brytes, ikke ved den
 * første. Uten det ville en tittel på to linjer fått streken hengende midt
 * i luften ved siden av den øverste.
 */
function Ledelinje() {
  return (
    <span
      aria-hidden
      className="mx-2 min-w-[1.5rem] flex-1 translate-y-[-0.3em] border-b border-dotted border-kant-sterk/50"
    />
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

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className="group flex items-end py-[0.3125rem] transition-colors hover:text-aksent-tekst focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
    >
      <span
        className={`text-[0.9375rem] leading-snug text-pretty transition-colors motion-reduce:transition-none ${
          lest
            ? "text-blekk-svak group-hover:text-aksent-tekst"
            : "text-blekk group-hover:text-aksent-tekst"
        }`}
      >
        {rubrikk.tittel}
        {!rubrikk.godkjent && (
          <>
            {/*
              FOTNOTEMERKET. Se punkt 4 i toppkommentaren: fjorten røde
              piller er et bakteppe, én stjerne er et merke.
            */}
            {/*
              Samme farge som teksten, slik fotnotemerker settes i trykk.
              Fjorten røde stjerner på seksten linjer er ikke et varsel,
              det er et utslett — og et merke som står overalt, merker
              ingenting. Advarselen ligger i fotnoten under listen.
            */}
            <span aria-hidden className="ml-0.5 align-super text-blekk-svak">
              *
            </span>
            <span className="sr-only"> (fagutkast, ikke kvalitetssikret)</span>
          </>
        )}
        {tilstand === "ny" && (
          <span className="ml-2 align-middle font-sans text-[0.625rem] font-medium tracking-[0.08em] text-aksent-tekst uppercase">
            Ny
          </span>
        )}
      </span>

      <Ledelinje />

      {/*
        ÉN PLASS, TO TILSTANDER. Ulest viser hva den koster deg. Lest viser
        at den er gjort. Ingen hake i tillegg, ingen dempet bakgrunn — den
        ene opplysningen som endrer seg, bytter ut den andre.
      */}
      {/*
        BEGGE TILSTANDENE ER DEMPET, OG DET ER MED VILJE.

        «Lest» sto først i aksentfargen. Da ble de ferdige radene det mest
        synlige i listen — stikk i strid med hva listen er til for. Det som
        skal trekke øyet er de mørke titlene, altså det som gjenstår.

        Framdriften ligger i prikken på ryggraden og i brøken. Der koster
        den ingenting.
      */}
      <span className="shrink-0 font-sans text-[0.75rem] text-blekk-svak tabular-nums">
        {lest ? "Lest" : `${lesetid(rubrikk)} min`}
      </span>
    </Link>
  );
}
