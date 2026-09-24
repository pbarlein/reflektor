import type { Brief } from "@/content/brieftype";
import type { Funn, Research } from "@/content/researchtype";
import type { Konto, Publisering } from "@/lib/supermetrics";

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

/**
 * Én konto, med tallene som faktisk er målt.
 *
 * Fordelingen står som en liten tabell og ikke som prosa, fordi
 * sammenligningen mellom formatene er hele poenget: ser produsenten at
 * video har median 8 400 visninger og bilde 260 likes, er spørsmålet om hva
 * dagen skal produsere allerede besvart.
 */
function Kontokort({ konto }: { konto: Konto }) {
  return (
    <div className="rounded-interaktiv border border-kant bg-kort px-3.5 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[0.9375rem] font-medium text-blekk">
          @{konto.brukernavn}
          <span className="ml-2 text-[0.8125rem] font-normal text-blekk-svak">
            {konto.rolle}
          </span>
        </p>
        <p className="text-[0.8125rem] text-blekk-svak">
          {konto.innlegg} innlegg · {konto.perManed} i måneden
        </p>
      </div>

      {konto.fordeling.length > 0 && (
        <table className="mt-2.5 w-full border-collapse text-[0.8125rem]">
          <thead>
            <tr className="text-blekk-svak">
              <th className="py-1 text-left font-medium">Format</th>
              <th className="py-1 text-right font-medium tabular-nums">Ant.</th>
              <th className="py-1 text-right font-medium tabular-nums">
                Visn.
              </th>
              <th className="py-1 text-right font-medium tabular-nums">
                Likes
              </th>
            </tr>
          </thead>
          <tbody>
            {konto.fordeling.map((f) => (
              <tr key={f.format} className="border-t border-kant">
                <td className="py-1 text-blekk-dempet">{f.format}</td>
                <td className="py-1 text-right tabular-nums text-blekk-dempet">
                  {f.antall}
                </td>
                <td className="py-1 text-right tabular-nums text-blekk-dempet">
                  {f.visninger !== null
                    ? f.visninger.toLocaleString("nb-NO")
                    : "–"}
                </td>
                <td className="py-1 text-right tabular-nums text-blekk-dempet">
                  {f.medianLikes.toLocaleString("nb-NO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {konto.topp.length > 0 && (
        <details className="mt-2.5">
          <summary className="cursor-pointer list-none text-[0.8125rem] text-blekk-svak underline underline-offset-2">
            Innleggene som gikk best
          </summary>
          <ul className="mt-2 flex flex-col gap-1.5">
            {konto.topp.map((t, i) => (
              <li key={i} className="text-[0.8125rem] leading-relaxed">
                <span className="tabular-nums text-blekk-svak">
                  {t.visninger !== null
                    ? `${t.visninger.toLocaleString("nb-NO")} visn.`
                    : `${t.likes.toLocaleString("nb-NO")} likes`}
                </span>{" "}
                <span className="text-blekk-dempet">
                  {t.tekst || "uten bildetekst"}
                </span>
                {t.lenke && (
                  <>
                    {" "}
                    <a
                      href={t.lenke}
                      target="_blank"
                      rel="noreferrer"
                      className="text-aksent-tekst underline underline-offset-2"
                    >
                      se ↗
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export function Grunnlag({
  research,
  brief,
  publisering,
  strategi,
  fraMinne,
  påNyttOppslag,
}: {
  research: Research | null;
  /** Det som sto i e-posten med kunden. */
  brief: Brief | null;
  /** Målte tall for hva kunden og konkurrentene faktisk publiserer. */
  publisering: Publisering | null;
  /**
   * Lenken til SoMe-strategien, uansett hvor den kom fra: feltet
   * produsenten fylte ut, eller e-posten Claude lette i.
   */
  strategi: string;
  /** Hentet fra hukommelsen, ikke slått opp nå. */
  fraMinne: boolean;
  påNyttOppslag: () => void;
}) {
  if (!research && !brief && !publisering) return null;
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
        {publisering
          ? ` · ${publisering.kontoer.length} ${
              publisering.kontoer.length === 1 ? "konto" : "kontoer"
            } målt`
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
          ── SOME-STRATEGIEN ØVERST, SOM EN KNAPP ──────────────────────────

          Bestilt 24.09.2026: «legg også til en tydelig knapp som heter
          Lenke til SoMe-strategi i Canva. skriv også her at du finner
          strategien selv, om den finnes på mail».

          Den står øverst fordi den er det eneste her produsenten skal
          KLIKKE på. Alt annet i panelet er noe man leser for å kontrollere
          Claude; strategien er et dokument man skal åpne og jobbe mot.

          Den vises også når den IKKE er funnet. En knapp som bare dukker
          opp ved treff, gjør fraværet usynlig — og da tror produsenten at
          strategien lå til grunn når den ikke gjorde det.
        */}
        <div>
          <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
            SoMe-strategi
          </h4>
          {strategi ? (
            <a
              href={strategi}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-interaktiv border border-[color:var(--aksent)] bg-kort px-4 py-2.5 text-[0.9375rem] font-medium text-aksent-tekst transition-colors hover:bg-dempet motion-reduce:transition-none"
            >
              Lenke til SoMe-strategi i Canva
              <span aria-hidden>↗</span>
            </a>
          ) : (
            <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-pretty text-blekk-svak">
              {brief
                ? "Claude lette etter en Canva-lenke med SoMe-strategi i e-posten med kunden, og fant ingen."
                : "Claude finner strategien selv hvis den ligger i en e-posttråd med kunden. Her er ingen e-post lest — enten er ikke Gmail koblet til, eller så finnes det ingen tråd som nevner kunden."}{" "}
              Har du lenken, lim den inn i «Lenke til SoMe-strategi i Canva» i
              skjemaet, så legges strategien til grunn.
            </p>
          )}
        </div>

        {/*
          ── TALLENE FØR ORDENE ────────────────────────────────────────────

          Publiseringen er det eneste i panelet som er målt. Alt under er
          noen som har sagt noe — kunden om seg selv, eller Claude om det
          den fant. Da skal det målte stå først.
        */}
        {publisering && (
          <div>
            <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-aksent-tekst uppercase">
              Faktisk publisert · siste år
            </h4>
            <div className="mt-2 flex flex-col gap-2.5">
              {publisering.kontoer.map((k) => (
                <Kontokort key={k.brukernavn} konto={k} />
              ))}
            </div>
            {publisering.mislyktes.length > 0 && (
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-pretty text-varsel">
                Ikke hentet:{" "}
                {publisering.mislyktes.map((m) => `@${m}`).join(", ")}. Kontoen
                finnes ikke, er privat, eller er ikke en Business- eller
                Creator-konto. Sjekk skrivemåten.
              </p>
            )}
          </div>
        )}

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
            <Funnliste
              tittel="Virkemidler vi kan gjennomføre"
              funn={research.virkemidler}
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
