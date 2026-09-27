import Link from "next/link";

import { Medieflate } from "@/components/Medieflate";
import { BOLKER, type Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";
import { lesetid } from "@/lib/lesetid";

/**
 * Alt innholdet — som en vei å gå, ikke en liste å slå opp i.
 *
 * ── TRE UTGAVER FØR DENNE ─────────────────────────────────────────────────
 *
 * 1. ÅTTE LIKE KORT i et rutenett, med runde nummerskilt, statuspiller og
 *    en segmentert framdriftsstolpe. «Veldig ai-preg», og kritikken traff:
 *    gjennomgangene av maskingenerert grensesnitt navngir de grepene.
 * 2. EN TRYKT INNHOLDSFORTEGNELSE med ledelinjer og hengende tall. Vakker
 *    og feil: «for tungvindt å konsumere». En innholdsfortegnelse er for
 *    den som VET hva hen leter etter, ikke for den som skal ledes gjennom.
 * 3. VEIEN, uten overskrifter. Riktig form, men jeg strøk bolknavnene som
 *    «for mye tekst», og da ble den uleselig på en ny måte: «ikke tydelig
 *    hva de overskriftene gjør … er det to artikler under vertikalt som
 *    hører til den navngitte fasen? … er det de samme tekstene bare
 *    komprimert?»
 *
 * ── HVA SOM VAR GALT MED DEN TREDJE, OG HVA SOM RETTET DET ────────────────
 *
 * To feil, og begge handlet om gruppering:
 *
 *   A. RUTENE HANG IKKE SAMMEN MED OVERSKRIFTEN. Avstanden mellom to
 *      kolonner var 12 piksler; avstanden mellom de to rutene i samme
 *      kolonne var 10. Da finnes grupperingen bare i hodet på den som
 *      bygde den. Nå er avstanden mellom kolonnene fire ganger så stor som
 *      innad i en, og hver fase har en hårstrek under navnet som går
 *      nøyaktig så langt som kolonnen. Nærhet og en strek er de to eldste
 *      grupperingsmidlene som finnes, og de trengs begge her.
 *   B. DEN ANDRE RADEN HADDE INGEN OVERSKRIFT. Tre kategorier som ikke
 *      hører til noen fase sto helt uten forklaring, i samme format som
 *      fasene over — og ble lest som en komprimert gjentakelse av det
 *      samme. Bolknavnene er tilbake. De koster tre linjer, og de er
 *      forskjellen på et oppsett man forstår og et man gjetter på.
 *
 * Lærdommen er ikke «skriv mer». Det er at struktur må SES, og at en
 * overskrift som forklarer hva man ser på, ikke er tekst man sparer inn på.
 *
 * ── RESTEN AV FORMEN ──────────────────────────────────────────────────────
 *
 * Bilder i stedet for setninger; ett merket startpunkt; stasjonen viser seg
 * selv ferdig når begge rubrikkene er lest; alt på én flate uten rulling
 * sidelengs. Venstre-til-høyre ER produksjonsrekkefølgen — det er derfor
 * rutenettet er forsvarlig her og var slop i første utgave.
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
  const erLest = (r: Rubrikk) => tilstander[r.slug] === "lest";
  const utkast = grupper
    .flatMap((g) => g.rubrikker)
    .filter((r) => !r.godkjent).length;

  const faser = grupper.filter((g) => g.kategori.nr);
  const kunde = grupper.filter((g) => g.kategori.bolk === "kunde");
  const oss = grupper.filter((g) => g.kategori.bolk === "oss");

  /*
   * ── «START HER» REGNES UT FRA DET SOM FAKTISK VISES ───────────────────
   *
   * Merket kom før fra `pensumrekkefolge`, som setter den fremhevede
   * rubrikken først. Den ligger i «Oss», altså nederst til høyre — mens
   * seksjonen leser som en vei som begynner med 01 Research øverst til
   * venstre. Merket sa altså «begynn her» og pekte på rute elleve.
   *
   * Rekkefølgen her ER leserekkefølgen: fasene 01–05, så Kunden, så Oss,
   * i samme orden som de tegnes. Da kan merket og oppsettet ikke komme i
   * utakt, fordi de leser fra samme liste.
   */
  const iVist = [...faser, ...kunde, ...oss].flatMap((g) => g.rubrikker);
  const lest = iVist.filter(erLest).length;
  const neste = iVist.find((r) => !erLest(r))?.slug;

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
          <span className="tabular-nums">{iVist.length}</span> lest
        </p>
      </div>

      <Bolk navn={BOLKER.handverk.navn} ingress={BOLKER.handverk.ingress}>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {faser.map(({ kategori, rubrikker }, i) => (
            <Stasjon
              key={kategori.id}
              kategori={kategori}
              navn={kategori.kort}
              rubrikker={rubrikker}
              tilstander={tilstander}
              erLest={erLest}
              neste={neste}
              prioriter={i < 3}
            />
          ))}
        </ol>
      </Bolk>

      {/*
        ── KUNDEN OG OSS DELER RAD ───────────────────────────────────────

        Hver for seg la de beslag på hele bredden og lot fire femtedeler
        stå tomme — det leses som en feil, ikke som luft. Side om side
        bruker de tre av fem kolonner, og tomrommet havner der et tomrom
        hører hjemme: på slutten av en rad.

        Kolonnebreddene er de samme som fasenes, fordi begge rutenettene er
        femdelt med samme mellomrom. Rutene er altså like store i hele
        seksjonen, og det er det som gjør at de leses som ett system.
      */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-6">
        <div className="lg:col-span-1">
          <Bolk navn={BOLKER.kunde.navn} ingress={BOLKER.kunde.ingress}>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-1">
              {kunde.map(({ kategori, rubrikker }) => (
                <Stasjon
                  key={kategori.id}
                  kategori={kategori}
                  /*
                    Bolken heter «Kunden» og kategorien «Kunde». Å skrive
                    begge over hverandre er å si det samme to ganger med én
                    bokstavs forskjell. Har bolken bare én kategori, bærer
                    bolknavnet den alene.
                  */
                  navn={null}
                  rubrikker={rubrikker}
                  tilstander={tilstander}
                  erLest={erLest}
                  neste={neste}
                  prioriter={false}
                />
              ))}
            </ol>
          </Bolk>
        </div>

        <div className="lg:col-span-2">
          <Bolk navn={BOLKER.oss.navn} ingress={BOLKER.oss.ingress}>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-2">
              {oss.map(({ kategori, rubrikker }) => (
                <Stasjon
                  key={kategori.id}
                  kategori={kategori}
                  navn={kategori.navn}
                  rubrikker={rubrikker}
                  tilstander={tilstander}
                  erLest={erLest}
                  neste={neste}
                  prioriter={false}
                />
              ))}
            </ol>
          </Bolk>
        </div>
      </div>

      {utkast > 0 && (
        <p className="mt-10 border-t border-kant-regel pt-3 text-[0.8125rem] text-blekk-svak">
          {utkast} av {iVist.length} er fagutkast som ikke er kvalitetssikret
          ennå. Det står på hver enkelt rubrikk.
        </p>
      )}
    </section>
  );
}

/**
 * En bolk: navnet, én linje om hva den er, og innholdet.
 *
 * Overskriften er ikke pynt og ikke «for mye tekst». Uten den sto tre
 * kategorier som ikke hører til noen fase i samme format som fasene, og ble
 * lest som en gjentakelse av dem. Se punkt B i toppkommentaren.
 */
function Bolk({
  navn,
  ingress,
  children,
}: {
  navn: string;
  ingress: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 border-t border-blekk/15 pt-5 sm:mt-12">
      {/*
        NAVNET PÅ EGEN LINJE. Før sto navn og forklaring inntil hverandre
        på samme linje, og «Produksjon   De fem fasene en produksjon går
        gjennom» leste som én løpende setning der det første ordet tilfeldig
        var uthevet. Over hverandre er det en overskrift og en undertittel.

        Regelen over bolken gjør det samme for blokken som hårstreken gjør
        for kolonnen: den viser hvor en gruppe begynner.
      */}
      <h3 className="font-sans text-[0.75rem] font-semibold tracking-[0.12em] text-blekk uppercase">
        {navn}
      </h3>
      <p className="mt-1 text-[0.9375rem] text-blekk-dempet">{ingress}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * Én stasjon: en fase eller en kategori, med rubrikkene under.
 *
 * `navn` kan være `null`. Det er ikke en mangel — det betyr at bolken over
 * bare har denne ene kategorien, og at navnet ville stått to ganger.
 */
function Stasjon({
  kategori,
  navn,
  rubrikker,
  tilstander,
  erLest,
  neste,
  prioriter,
}: {
  kategori: Kategori;
  navn: string | null;
  rubrikker: readonly Rubrikk[];
  tilstander: Record<string, Lesetilstand>;
  erLest: (r: Rubrikk) => boolean;
  neste?: string;
  prioriter: boolean;
}) {
  const ferdig = rubrikker.every(erLest) && rubrikker.length > 0;

  return (
    <li>
      {navn && (
        /*
          HÅRSTREKEN GÅR NØYAKTIG SÅ LANGT SOM KOLONNEN, og det er den som
          sier at rutene under hører til navnet over. Uten den lå en
          overskrift og to bilder løst i et rutenett.
        */
        <div className="mb-2.5 flex items-baseline gap-1.5 border-b border-kant pb-1.5">
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
          <h4 className="min-w-0 text-[0.9375rem] font-medium text-blekk">
            {navn}
          </h4>
        </div>
      )}

      {/*
        Rutene ligger tett — 8 piksler — mot 24 mellom kolonnene. Det er
        nærhetsprinsippet gjort om til tall: det som hører sammen, skal stå
        nærmere hverandre enn det som ikke gjør det.
      */}
      <ul className="flex flex-col gap-2">
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
 * LEST VISES PÅ BILDET, ikke i en pille. Et dempet bilde med en hake i
 * hjørnet leses på avstand, uten at man stopper ved et ord.
 *
 * «START HER» STÅR PÅ ÉN RUTE, ALDRI TO. Det er hele forskjellen på å vise
 * seksten valg og å lede noen gjennom dem. Hvilken det er, avgjøres av
 * `pensumrekkefolge` — samme regel som rekka øverst på siden bruker.
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
          /*
            INGEN STJERNE PÅ RUTA. Fjorten av seksten rubrikker er utkast,
            og fjorten merker som først kan tydes av en fotnote to skjermer
            lenger ned, gjør oversikten vanskeligere å lese uten å gi noen
            opplysning de kan bruke. Linjen under seksjonen sier det samme
            for alle sammen, og selve rubrikksiden merker seg selv.
          */
          <span className="sr-only"> (fagutkast, ikke kvalitetssikret)</span>
        )}
      </p>
      <p className="mt-0.5 font-sans text-[0.6875rem] text-blekk-svak tabular-nums">
        {lest ? "Lest" : `${lesetid(rubrikk)} min`}
      </p>
    </Link>
  );
}
