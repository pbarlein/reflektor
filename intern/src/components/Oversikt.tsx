import Link from "next/link";

import { Medieflate } from "@/components/Medieflate";
import type { Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Alt innholdet — som en vei å gå, ikke en liste å slå opp i.
 *
 * ── TO UTGAVER ER REVET, OG DE FEILET HVER SIN VEI ────────────────────────
 *
 * DEN FØRSTE var åtte like kort i et rutenett, med runde nummerskilt,
 * statuspiller og en segmentert framdriftsstolpe. Den hadde «veldig
 * ai-preg», og kritikken traff: gjennomgangene av maskingenerert
 * grensesnitt navngir nøyaktig de grepene. Hver avgjørelse var den
 * statistisk vanligste.
 *
 * DEN ANDRE var en trykt innholdsfortegnelse — ledelinjer, hengende tall,
 * fotnotemerker. Den var vakker og feil: «for tungvindt å konsumere». En
 * innholdsfortegnelse er laget for den som VET hva hen leter etter og skal
 * slå det opp. Den som skal ledes gjennom seksten tekster, får en vegg av
 * setninger og må lese hver linje for å finne ut hvor hen er.
 *
 * Feilen var ikke typografien. Det var at jeg bygget et oppslagsverk til en
 * oppgave som handler om å komme i gang.
 *
 * ── HVA DEN ER NÅ ────────────────────────────────────────────────────────
 *
 * En vei gjennom produksjonen. De fem fasene står som fem stasjoner på en
 * linje, i den rekkefølgen arbeidet faktisk skjer, med rubrikkene som
 * bilder under hver stasjon. Under står de tre som ikke hører til i en
 * rekkefølge, satt i samme takt men uten linjen.
 *
 * Fire ting gjør den lettere å ta fatt på enn de to foregående:
 *
 *   1. BILDER I STEDET FOR SETNINGER. Et bilde skiller to rubrikker fra
 *      hverandre uten at man leser noe. Teksten er nede i tittel og
 *      minutter — resten er borte: ingressene, bolkbeskrivelsene,
 *      tellerne per bolk, fotnotene.
 *   2. ÉN INNGANG ER MERKET. «Start her» står på den første uleste. Den
 *      som åpner siden uten en plan, trenger ikke lage en.
 *   3. STASJONEN VISER SEG SELV FERDIG. Prikken fylles og linjen mellom
 *      stasjonene farges når fasen er lest ut. Framdriften er noe man ser
 *      langs veien, ikke et tall man leser av.
 *   4. ALT ER PÅ ÉN FLATE. Seksten ruter i to rader. Ingen rulling
 *      sidelengs, ingen utvidelse, ingenting skjult bak et trykk.
 *
 * ── HVORFOR RUTENETT DENNE GANGEN, NÅR DET VAR FEIL FØRSTE GANG ───────────
 *
 * Fordi kolonnene betyr noe nå. Første utgave hadde åtte like kort i den
 * rekkefølgen de tilfeldigvis sto i; her ER venstre-til-høyre
 * produksjonsrekkefølgen, og de to radene er forskjellen mellom det som har
 * en rekkefølge og det som ikke har det. Et rutenett som bærer
 * informasjon, er en tabell. Et rutenett som bare fyller plass, er slop.
 */

export type Gruppe = {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
};

export function Oversikt({
  grupper,
  tilstander,
  neste,
}: {
  grupper: readonly Gruppe[];
  tilstander: Record<string, Lesetilstand>;
  /** Slug-en til den første uleste. Se `pensumrekkefolge`. */
  neste?: string;
}) {
  const erLest = (r: Rubrikk) => tilstander[r.slug] === "lest";
  const alle = grupper.flatMap((g) => g.rubrikker);
  const lest = alle.filter(erLest).length;
  const utkast = alle.filter((r) => !r.godkjent).length;

  const faser = grupper.filter((g) => g.kategori.nr);
  const resten = grupper.filter((g) => !g.kategori.nr);

  return (
    <section
      aria-labelledby="oversikt"
      className="mx-auto w-full max-w-[88rem] px-5 pt-14 pb-8 sm:px-8 sm:pt-20"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
        <h2
          id="oversikt"
          className="display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.025em] text-blekk"
        >
          Alt innholdet
        </h2>
        <p className="text-[0.9375rem] text-blekk-dempet">
          <span className="font-medium text-blekk tabular-nums">{lest}</span> av{" "}
          <span className="tabular-nums">{alle.length}</span> lest
        </p>
      </div>

      {/*
        VEIEN. Fem stasjoner, og rekkefølgen er arbeidets egen. På telefon
        legger de seg under hverandre og linjen forsvinner — en vannrett vei
        på 390 piksler er to ruter og et løfte om noe man ikke ser.
      */}
      <ol className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
        {faser.map(({ kategori, rubrikker }, i) => (
          <Stasjon
            key={kategori.id}
            kategori={kategori}
            rubrikker={rubrikker}
            tilstander={tilstander}
            erLest={erLest}
            neste={neste}
            forrigeFerdig={
              i > 0 ? faser[i - 1].rubrikker.every(erLest) : undefined
            }
            forste={i === 0}
            prioriter={i < 3}
          />
        ))}
      </ol>

      <div className="mt-12 border-t border-kant-regel pt-8 sm:mt-14">
        {/*
            SAMME FEM KOLONNER SOM VEIEN OVER, selv om bare tre er fylt.
            Med tre kolonner her ville rutene blitt nesten dobbelt så
            brede som de på veien, og de to radene hadde sett ut som to
            ulike ting. Tomrommet til høyre er billigere enn det bruddet.
          */}
        <ol className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
          {resten.map(({ kategori, rubrikker }) => (
            <Stasjon
              key={kategori.id}
              kategori={kategori}
              rubrikker={rubrikker}
              tilstander={tilstander}
              erLest={erLest}
              neste={neste}
              forste={false}
              prioriter={false}
            />
          ))}
        </ol>
      </div>

      {utkast > 0 && (
        <p className="mt-9 text-[0.8125rem] text-blekk-svak">
          <span aria-hidden>*</span> {utkast} av {alle.length} er fagutkast som
          ikke er kvalitetssikret ennå.
        </p>
      )}
    </section>
  );
}

/**
 * Én stasjon: en fase eller en kategori, med rubrikkene under.
 *
 * `forrigeFerdig` er `undefined` for alt som ikke står på veien. Det er
 * forskjellen på «det finnes ingen forrige stasjon» og «den forrige er ikke
 * lest» — og bare den første trenger å vite det, for å slippe å tegne en
 * linje som kommer fra ingenting.
 */
function Stasjon({
  kategori,
  rubrikker,
  tilstander,
  erLest,
  neste,
  forrigeFerdig,
  forste,
  prioriter,
}: {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  erLest: (r: Rubrikk) => boolean;
  neste?: string;
  forrigeFerdig?: boolean;
  forste: boolean;
  prioriter: boolean;
}) {
  const ferdig = rubrikker.every(erLest) && rubrikker.length > 0;
  const paaVeien = Boolean(kategori.nr);

  return (
    <li>
      {paaVeien && (
        /*
          STASJONSMERKET. Linjen kommer inn fra venstre og farges bare når
          forrige fase er lest ut — da leses den som tilbakelagt vei, ikke
          som dekor. Den er skjult under lg, der stasjonene ligger under
          hverandre og en vannrett linje ville pekt på ingenting.
        */
        <div aria-hidden className="mb-2.5 hidden items-center lg:flex">
          <span
            className={`h-px flex-1 ${
              forste
                ? "bg-transparent"
                : forrigeFerdig
                  ? "bg-aksent/50"
                  : "bg-kant-regel"
            }`}
          />
          <span
            className={`mx-1.5 size-2 shrink-0 rounded-full border transition-colors duration-500 motion-reduce:transition-none ${
              ferdig ? "border-aksent bg-aksent" : "border-kant-sterk bg-side"
            }`}
          />
          <span
            className={`h-px flex-1 ${ferdig ? "bg-aksent/50" : "bg-kant-regel"}`}
          />
        </div>
      )}

      <div className="flex items-baseline gap-1.5">
        {kategori.nr && (
          <span
            aria-hidden
            className={`font-sans text-[0.6875rem] font-medium tabular-nums ${
              ferdig ? "text-aksent-tekst" : "text-blekk-svak"
            }`}
          >
            {String(kategori.nr).padStart(2, "0")}
          </span>
        )}
        <h3 className="text-[0.9375rem] font-medium text-blekk">
          {kategori.kort}
        </h3>
      </div>

      <ul className="mt-2.5 flex flex-col gap-2.5">
        {rubrikker.map((r) => (
          <li key={r.slug}>
            <Rute
              rubrikk={r}
              tilstand={tilstander[r.slug] ?? "ulest"}
              erNeste={r.slug === neste}
              prioriter={prioriter}
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Én rubrikk: bilde, tittel, minutter.
 *
 * ── LEST ER VIST PÅ BILDET, IKKE I EN PILLE ───────────────────────────────
 *
 * Et dempet bilde med en hake i hjørnet leses på avstand, uten at man
 * stopper ved ordet. Tidligere utgaver hadde en tekstpille i tillegg; den
 * sa det samme en gang til, og fjorten av dem på en flate er et bakteppe.
 *
 * ── «START HER» STÅR PÅ ÉN RUTE, ALDRI TO ─────────────────────────────────
 *
 * Det er hele forskjellen på å vise seksten valg og å lede noen gjennom
 * dem. Hvilken det er, avgjøres av `pensumrekkefolge` — samme regel som
 * rekka øverst på siden bruker, så de to aldri peker hver sin vei.
 */
function Rute({
  rubrikk,
  tilstand,
  erNeste,
  prioriter,
}: {
  rubrikk: Rubrikk;
  tilstand: Lesetilstand;
  erNeste: boolean;
  prioriter: boolean;
}) {
  const lest = tilstand === "lest";

  return (
    <Link
      href={`/rubrikk/${rubrikk.slug}`}
      className="group block rounded-flate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent"
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden rounded-flate bg-dempet ${
          erNeste ? "ring-2 ring-aksent ring-offset-2 ring-offset-side" : ""
        }`}
      >
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

        {erNeste && (
          <span className="absolute bottom-0 left-0 rounded-tr-flate bg-aksent px-2 py-1 font-sans text-[0.625rem] font-medium tracking-[0.08em] text-white uppercase">
            Start her
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
          <>
            {/*
              Dempet, ikke rødt. Fjorten av seksten er utkast, og fjorten
              røde merker er ikke et varsel — det er et bakteppe. Men helt
              borte kan det ikke være: en oversikt som skjuler at
              mesteparten ikke er kvalitetssikret, lyver ved utelatelse.
            */}
            <span aria-hidden className="ml-0.5 align-super text-blekk-svak">
              *
            </span>
            <span className="sr-only"> (fagutkast, ikke kvalitetssikret)</span>
          </>
        )}
      </p>
      <p className="mt-0.5 font-sans text-[0.6875rem] text-blekk-svak tabular-nums">
        {lest ? "Lest" : `${lesetid(rubrikk)} min`}
      </p>
    </Link>
  );
}
