import type { Blokk } from "@/content/rubrikktype";

/**
 * Innholdsblokkene.
 *
 * SEKS TYPER, IKKE FRI HTML. En rubrikk er strukturert data, ikke en
 * tekststreng med markering i — og det er valget som gjør at alt ser likt
 * ut uansett hvem som har skrevet det, at søket kan lese brødteksten (se
 * lib/sok.ts), og at et utkast ikke kan snike inn en overskrift som
 * ødelegger overskriftsrekken på siden.
 *
 * MÅLET ER 45–75 TEGN PER LINJE. Løpende tekst leses best der; over det
 * mister øyet linjestarten på vei tilbake. `max-w-[46rem]` gir rundt 70 på
 * 17 px. Sjekklister og steg får gå bredere — de leses ikke som løpende
 * tekst.
 */
export function Innhold({ blokker }: { blokker: readonly Blokk[] }) {
  return (
    <div className="flex flex-col gap-7">
      {blokker.map((blokk, i) => (
        <Enkeltblokk key={i} blokk={blokk} />
      ))}
    </div>
  );
}

function Enkeltblokk({ blokk }: { blokk: Blokk }) {
  switch (blokk.type) {
    case "avsnitt":
      return (
        <p className="max-w-[46rem] text-[1.0625rem] leading-relaxed text-pretty text-pa-dyp">
          {blokk.tekst}
        </p>
      );

    case "punkter":
      return (
        <ul className="flex max-w-[52rem] flex-col">
          {blokk.punkter.map((p, i) => (
            <li
              key={p}
              className="flex gap-4 border-b border-[color:var(--kant-pa-dyp)]/60 py-3.5 last:border-b-0"
            >
              {/*
                LØPENUMMER OG IKKE HAKE. En hake sier «funksjonsliste i en
                prisplan». Et nummer sier spesifikasjon, og gjør omfanget
                tellbart. Samme valg som i prisseksjonen på salgssiden, av
                samme grunn.
              */}
              <span
                aria-hidden
                className="display shrink-0 pt-0.5 text-[0.9375rem] tabular-nums text-aksent"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[1.0625rem] leading-relaxed text-pretty text-pa-dyp">
                {p}
              </span>
            </li>
          ))}
        </ul>
      );

    case "sjekkliste":
      return (
        <div className="max-w-[52rem] rounded-flate border border-[color:var(--kant-pa-dyp)] px-5 py-5 sm:px-6">
          <p className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
            {blokk.tittel ?? "Sjekkliste"}
          </p>
          {/*
            EKTE AVKRYSSINGSBOKSER, uten tilstand som lagres.

            Det er et bevisst valg og verdt å begrunne: den som står på
            lokasjon og går gjennom en liste, trenger å se hva hen har gjort
            AKKURAT NÅ. Lagret tilstand ville vært verre, ikke bedre — en
            avkrysset liste fra forrige produksjonsdag som møter deg på den
            neste, er aktivt villedende.

            `<label>` rundt hele raden, så hele linja er et treffområde og
            ikke bare den 16 px store boksen.
          */}
          <ul className="mt-4 flex flex-col">
            {blokk.punkter.map((p) => (
              <li key={p}>
                <label className="flex cursor-pointer items-start gap-3.5 border-b border-[color:var(--kant-pa-dyp)]/60 py-3 last:border-b-0">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-[color:var(--aksent-pa-dyp)]"
                  />
                  <span className="text-[1rem] leading-relaxed text-pretty text-pa-dyp">
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
        <ol className="flex max-w-[52rem] flex-col gap-6">
          {blokk.steg.map((s, i) => (
            <li key={s.tittel} className="flex gap-5">
              <span
                aria-hidden
                className="display shrink-0 text-[1.75rem] leading-none tabular-nums text-aksent/70"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-[1.0625rem] font-medium text-pa-dyp">
                  {s.tittel}
                </h3>
                <p className="mt-1.5 text-[1rem] leading-relaxed text-pretty text-pa-dyp-dempet">
                  {s.tekst}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "merknad":
      return (
        /*
          Venstrestrek og ikke full ramme. En merknad skal lese som en
          margnotat — noe som står ved siden av teksten — ikke som en
          feilmelding midt i den.
        */
        <p className="max-w-[46rem] border-l-2 border-aksent/60 py-1 pl-5 text-[1rem] leading-relaxed text-pretty text-pa-dyp-dempet">
          {blokk.tekst}
        </p>
      );

    case "sitat":
      return (
        <figure className="max-w-[46rem]">
          <blockquote className="display text-[1.6rem] leading-[1.2] tracking-[-0.02em] text-pretty text-pa-dyp sm:text-[2rem]">
            «{blokk.tekst}»
          </blockquote>
          <figcaption className="mt-3 text-[0.875rem] tracking-[0.02em] text-pa-dyp-svak">
            — {blokk.kilde}
          </figcaption>
        </figure>
      );
  }
}
