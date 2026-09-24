import type { Funn, Research } from "@/content/researchtype";

/**
 * Researchen, vist for produsenten.
 *
 * ── HVORFOR DEN VISES, OG IKKE BARE BRUKES ────────────────────────────────
 *
 * Bestilt 24.09.2026: Claude skal være «det faglige, faktabaserte,
 * strategiske og reflekterte alibiet vårt i enhver prosess, i tillegg til at
 * produsenten må ta egne vurderinger».
 *
 * Et alibi som ikke kan etterprøves, er ikke et alibi. Derfor står hvert
 * funn med lenke til kilden, og derfor står «ikke bekreftet» like tydelig
 * som resten. Produsenten skal kunne se hva Claude tror, følge lenken, og
 * overprøve den — ikke oppdage i ettertid at planen hvilte på feil bedrift
 * med samme navn.
 *
 * Panelet er sammenfoldet fordi det ikke er det man kom for. Det er åpent
 * nok til at man ser at det finnes.
 */

function Funnliste({ tittel, funn }: { tittel: string; funn: Funn[] }) {
  if (!funn.length) return null;
  return (
    <div>
      <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
        {tittel}
      </h4>
      <ul className="mt-2 flex flex-col gap-2">
        {funn.map((f, i) => (
          <li key={i} className="text-[0.9375rem] leading-relaxed text-pretty">
            <span className="text-blekk-dempet">{f.tekst}</span>
            {f.kilde && (
              <>
                {" "}
                <a
                  href={f.kilde}
                  target="_blank"
                  rel="noreferrer"
                  /* Lenka er liten, men den er hele poenget. */
                  className="text-aksent-tekst underline underline-offset-2"
                >
                  kilde ↗
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Grunnlag({
  research,
  fraMinne,
  påNyttOppslag,
}: {
  research: Research;
  /** Hentet fra hukommelsen, ikke slått opp nå. */
  fraMinne: boolean;
  påNyttOppslag: () => void;
}) {
  const antall =
    research.struktur.length +
    research.eierskap.length +
    research.ferskt.length +
    research.publikum.length +
    research.fagpraksis.length;

  return (
    <details className="rounded-flate border border-kant bg-dempet">
      <summary className="cursor-pointer list-none px-4 py-3 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none">
        Grunnlaget Claude fant · {antall} funn fra {research.kilder.length}{" "}
        kilder ·{" "}
        {fraMinne
          ? `slått opp ${new Intl.DateTimeFormat("nb-NO", {
              day: "numeric",
              month: "long",
            }).format(new Date(research.hentet))}`
          : "slått opp nå"}
        {research.usikkert.length > 0 && (
          <span className="text-varsel">
            {" "}
            · {research.usikkert.length} ikke bekreftet
          </span>
        )}
      </summary>

      <div className="flex flex-col gap-5 border-t border-kant px-4 py-5">
        <div>
          <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
            Virksomhet · {research.marked.toLowerCase()}
          </h4>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
            {research.virksomhet}
          </p>
        </div>

        <Funnliste tittel="Struktur" funn={research.struktur} />
        <Funnliste tittel="Eierskap" funn={research.eierskap} />
        <Funnliste tittel="Ferskt" funn={research.ferskt} />
        <Funnliste tittel="Publikum" funn={research.publikum} />
        <Funnliste
          tittel="Fagpraksis for dette dokumentet"
          funn={research.fagpraksis}
        />

        {research.usikkert.length > 0 && (
          <div className="rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-3">
            <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-varsel uppercase">
              Ikke bekreftet
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {research.usikkert.map((u, i) => (
                <li
                  key={i}
                  className="text-[0.875rem] leading-relaxed text-pretty text-varsel"
                >
                  {u}
                </li>
              ))}
            </ul>
          </div>
        )}

        {research.kilder.length > 0 && (
          <div>
            <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
              Kilder
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {research.kilder.map((k, i) => (
                <li key={i} className="text-[0.875rem] leading-relaxed">
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-aksent-tekst underline underline-offset-2"
                  >
                    {k.tittel}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-kant pt-4">
          <p className="max-w-[52ch] text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
            Dette er bakgrunn for valgene i dokumentet, ikke innhold som
            skrives inn i det. Stemmer noe ikke, rett det i feltet under arket
            — da gjelder det du sier foran det Claude fant.
          </p>
          {/*
            HVOR GAMMELT GRUNNLAGET ER, MÅ STÅ.
            Lagret research kan være en måned gammel. «Ferskt» er den delen
            som eldes fortest, og en produsent som ikke vet at grunnlaget er
            fra forrige måned, oppdager ikke at kampanjen er over.
          */}
          <button
            type="button"
            onClick={påNyttOppslag}
            className="h-fit shrink-0 rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.8125rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
          >
            Slå opp på nytt
          </button>
        </div>
      </div>
    </details>
  );
}
