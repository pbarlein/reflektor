import { Figur } from "@/components/Figur";
import type { Blokk, Kilde } from "@/content/rubrikktype";

/**
 * Innholdsblokkene.
 *
 * ÅTTE TYPER, IKKE FRI HTML. Det er valget som gjør at alt ser likt ut
 * uansett hvem som har skrevet det, at søket kan lese brødteksten, og at
 * ingen kan snike inn en overskrift som ødelegger overskriftsrekken.
 *
 * MÅLET ER 45–75 TEGN PER LINJE. Løpende tekst leses best der. `max-w-[46rem]`
 * gir rundt 70 på 17 px. Lister, steg og tabeller får gå bredere — de leses
 * ikke som løpende tekst.
 */
export function Innhold({ blokker }: { blokker: readonly Blokk[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blokker.map((blokk, i) => (
        <Enkeltblokk key={i} blokk={blokk} />
      ))}
    </div>
  );
}

function Enkeltblokk({ blokk }: { blokk: Blokk }) {
  switch (blokk.type) {
    case "seksjon":
      return (
        /*
          `scroll-mt` er ikke nok alene — `scroll-padding-top` på <html>
          dekker både ankerhopp og tastaturfokus, og står i globals.css.
          Denne er beltet: den gjelder også hvis noen en dag fjerner den
          andre.
        */
        <h2
          id={blokk.id}
          className="display mt-6 scroll-mt-28 text-[1.75rem] leading-tight tracking-[-0.02em] text-balance text-blekk first:mt-0 sm:text-[2rem]"
        >
          {blokk.tittel}
        </h2>
      );

    case "avsnitt":
      return (
        <p className="max-w-[46rem] text-[1.0625rem] leading-relaxed text-pretty text-blekk">
          {blokk.tekst}
        </p>
      );

    case "punkter":
      return (
        <ul className="flex max-w-[52rem] flex-col">
          {blokk.punkter.map((p, i) => (
            <li
              key={p}
              className="flex gap-4 border-b border-kant py-3 last:border-b-0"
            >
              {/*
                LØPENUMMER OG IKKE HAKE. En hake sier «funksjonsliste i en
                prisplan». Et nummer sier spesifikasjon, og gjør omfanget
                tellbart. Samme valg som på salgssiden.
              */}
              <span
                aria-hidden
                className="display shrink-0 pt-0.5 text-[0.875rem] tabular-nums text-aksent-tekst"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[1.0625rem] leading-relaxed text-pretty text-blekk">
                {p}
              </span>
            </li>
          ))}
        </ul>
      );

    case "sjekkliste":
      return (
        <div className="max-w-[52rem] rounded-flate border border-kant bg-kort px-5 py-5 sm:px-6">
          <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
            {blokk.tittel ?? "Sjekkliste"}
          </p>
          {/*
            EKTE AVKRYSSINGSBOKSER, uten at tilstanden lagres.

            Det er et bevisst valg: den som står på lokasjon og går gjennom
            en liste, trenger å se hva hen har gjort AKKURAT NÅ. Lagret
            tilstand ville vært verre — en avkrysset liste fra forrige
            produksjonsdag som møter deg på den neste, er aktivt villedende.

            `<label>` rundt hele raden, så hele linja er treffområde og ikke
            bare den 16 px store boksen.
          */}
          <ul className="mt-4 flex flex-col">
            {blokk.punkter.map((p) => (
              <li key={p}>
                <label className="flex cursor-pointer items-start gap-3.5 border-b border-kant py-2.5 last:border-b-0">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-[color:var(--action-primary)]"
                  />
                  <span className="text-[1rem] leading-relaxed text-pretty text-blekk">
                    {p}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      );

    case "steg":
      return (
        /*
          `<ol>` her, i motsetning til `punkter`. Steg HAR en rekkefølge som
          betyr noe — å gjøre steg tre før steg to er en annen handling. Da
          skal markeringen si det, ikke bare tallet i bildet.
        */
        <ol className="flex max-w-[52rem] flex-col gap-5">
          {blokk.steg.map((s, i) => (
            <li key={s.tittel} className="flex gap-5">
              <span
                aria-hidden
                className="display shrink-0 text-[1.5rem] leading-none tabular-nums text-aksent/70"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-[1.0625rem] font-medium text-blekk">
                  {s.tittel}
                </h3>
                <p className="mt-1.5 text-[1rem] leading-relaxed text-pretty text-blekk-dempet">
                  {s.tekst}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "tabell":
      return (
        /*
          RULLER VANNRETT PÅ SMAL SKJERM i stedet for å knuse kolonnene.
          En firekolonners tabell på 390 px blir uleselig hvis den presses
          inn; den er lesbar hvis den kan dras.
        */
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr>
                {blokk.kolonner.map((k) => (
                  <th
                    key={k}
                    scope="col"
                    className="border-b border-kant-regel pb-2.5 pr-5 font-sans text-xs font-medium tracking-[0.06em] text-blekk-dempet uppercase"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blokk.rader.map((rad) => (
                <tr key={rad[0]}>
                  {rad.map((celle, i) => (
                    <td
                      key={i}
                      className={`border-b border-kant py-3 pr-5 align-top text-[0.9375rem] leading-relaxed text-pretty ${
                        i === 0 ? "font-medium text-blekk" : "text-blekk-dempet"
                      }`}
                    >
                      {celle}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "figur":
      return <Figur navn={blokk.navn} tekst={blokk.tekst} />;

    case "merknad":
      return (
        /*
          Venstrestrek og ikke full ramme. En merknad skal lese som et
          margnotat — noe som står ved siden av teksten — ikke som en
          feilmelding midt i den.
        */
        <p className="max-w-[46rem] border-l-2 border-aksent py-1 pl-5 text-[1rem] leading-relaxed text-pretty text-blekk-dempet">
          {blokk.tekst}
        </p>
      );

    case "sitat":
      return (
        <figure className="max-w-[46rem]">
          <blockquote className="display text-[1.5rem] leading-[1.2] tracking-[-0.02em] text-pretty text-blekk sm:text-[1.875rem]">
            «{blokk.tekst}»
          </blockquote>
          <figcaption className="mt-3 text-[0.875rem] tracking-[0.02em] text-blekk-svak">
            — {blokk.kilde}
          </figcaption>
        </figure>
      );
  }
}

/**
 * Kildelisten.
 *
 * DATOEN ER DET VIKTIGSTE FELTET. En plattformspesifikasjon sjekket for ni
 * måneder siden er ikke en kilde lenger — den er en påstand. Ved å vise når
 * noen sist verifiserte den, gjør vi det mulig for leseren å vurdere det
 * selv i stedet for å stole blindt.
 */
export function Kildeliste({ kilder }: { kilder: readonly Kilde[] }) {
  return (
    <section
      aria-labelledby="kilder"
      className="mt-14 border-t border-kant pt-8"
    >
      <h2
        id="kilder"
        className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase"
      >
        Kilder
      </h2>
      <ul className="mt-4 flex max-w-[52rem] flex-col gap-3">
        {kilder.map((k) => (
          <li key={k.url} className="text-[0.9375rem] leading-relaxed">
            <a
              href={k.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-aksent-tekst underline underline-offset-4"
            >
              {k.tittel}
            </a>{" "}
            <span className="text-blekk-svak">
              — sjekket{" "}
              <time dateTime={k.sjekket}>
                {new Date(k.sjekket).toLocaleDateString("nb-NO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
