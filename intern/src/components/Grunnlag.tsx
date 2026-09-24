import type { Brief } from "@/content/brieftype";
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
  brief,
  fraMinne,
  påNyttOppslag,
}: {
  research: Research | null;
  /** Det som sto i e-posten med kunden. */
  brief: Brief | null;
  /** Hentet fra hukommelsen, ikke slått opp nå. */
  fraMinne: boolean;
  påNyttOppslag: () => void;
}) {
  if (!research && !brief) return null;
  const antall = research
    ? research.struktur.length +
      research.eierskap.length +
      research.ferskt.length +
      research.publikum.length +
      research.fagpraksis.length
    : 0;

  return (
    <details className="rounded-flate border border-kant bg-dempet">
      <summary className="cursor-pointer list-none px-4 py-3 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none">
        Grunnlaget Claude brukte
        {research && ` · ${antall} funn fra ${research.kilder.length} kilder`}
        {brief?.funn.length
          ? ` · ${brief.funn.length} fra e-post`
          : brief
            ? " · ingenting i e-posten"
            : ""}
        {research?.usikkert.length ? (
          <span className="text-varsel">
            {" "}
            · {research.usikkert.length} ikke bekreftet
          </span>
        ) : null}
      </summary>

      <div className="flex flex-col gap-5 border-t border-kant px-4 py-5">
        {/*
          E-POSTEN FØRST. Den er tyngst av kildene — det er kunden selv som
          har sagt det, skriftlig — og da skal den stå øverst, ikke som et
          tillegg under det Claude fant på nettet.
        */}
        {brief && (
          <div>
            <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-aksent-tekst uppercase">
              Fra e-posten med kunden
            </h4>
            {brief.funn.length ? (
              <ul className="mt-2 flex flex-col gap-2">
                {brief.funn.map((f, i) => (
                  <li
                    key={i}
                    className="text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet"
                  >
                    {f.tekst}
                    {f.fra && (
                      <span className="text-blekk-svak"> · «{f.fra}»</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-blekk-svak">
                Ingenting i e-posten gjaldt dette dokumentet.
              </p>
            )}
            {brief.lest.length > 0 && (
              <details className="mt-2.5">
                <summary className="cursor-pointer list-none text-[0.8125rem] text-blekk-svak underline underline-offset-2">
                  {brief.lest.length} e-poster lest
                </summary>
                <ul className="mt-2 flex flex-col gap-1">
                  {brief.lest.map((m, i) => (
                    <li key={i} className="text-[0.8125rem] text-blekk-svak">
                      {m.dato} · {m.emne}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {research && (
          <div>
            <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
              Virksomhet · {research.marked.toLowerCase()}
            </h4>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
              {research.virksomhet}
            </p>
          </div>
        )}

        {research && (
          <>
            <Funnliste tittel="Struktur" funn={research.struktur} />
            <Funnliste tittel="Eierskap" funn={research.eierskap} />
            <Funnliste tittel="Ferskt" funn={research.ferskt} />
            <Funnliste tittel="Publikum" funn={research.publikum} />
            <Funnliste
              tittel="Fagpraksis for dette dokumentet"
              funn={research.fagpraksis}
            />
          </>
        )}

        {research && research.usikkert.length > 0 && (
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

        {research && research.kilder.length > 0 && (
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
            Dette er bakgrunn for valgene i dokumentet, ikke innhold som skrives
            inn i det. Stemmer noe ikke, rett det i feltet under arket — da
            gjelder det du sier foran det Claude fant.
            {research && (
              <>
                {" "}
                Nettsøket er{" "}
                {fraMinne
                  ? `fra ${new Intl.DateTimeFormat("nb-NO", {
                      day: "numeric",
                      month: "long",
                    }).format(new Date(research.hentet))}`
                  : "gjort nå"}
                .
              </>
            )}
          </p>
          {/*
            HVOR GAMMELT GRUNNLAGET ER, MÅ STÅ.
            Lagret research kan være en måned gammel. «Ferskt» er den delen
            som eldes fortest, og en produsent som ikke vet at grunnlaget er
            fra forrige måned, oppdager ikke at kampanjen er over.
          */}
          {research && (
            <button
              type="button"
              onClick={påNyttOppslag}
              className="h-fit shrink-0 rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.8125rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
            >
              Slå opp på nytt
            </button>
          )}
        </div>
      </div>
    </details>
  );
}
