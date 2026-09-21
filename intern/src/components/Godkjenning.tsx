import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Markøren som skiller utkast fra vedtatt praksis.
 *
 * DETTE ER DEN VIKTIGSTE KOMPONENTEN I PROSJEKTET, og det er ikke en
 * overdrivelse. Innholdet i huben er instrukser folk FØLGER — på en
 * produksjonsdag, hos en kunde, med kameraet i hånda. Et utkast som leses
 * som rutine, er dyrere enn et utkast som ikke leses i det hele tatt.
 *
 * Derfor:
 *
 * - Den er ALDRI valgfri. Hvert kort og hver rubrikkside viser tilstanden.
 * - Ugodkjent får den sterkeste fargen på siden. Godkjent er nedtonet —
 *   det normale skal ikke rope.
 * - `aria-label` sier det samme som fargen. En markør som kun finnes som
 *   farge, finnes ikke for den som ikke ser farge.
 */
export function Godkjentmerke({
  godkjent,
  stor = false,
}: {
  godkjent: boolean;
  stor?: boolean;
}) {
  const grad = stor ? "text-xs px-2.5 py-1" : "text-[0.6875rem] px-2 py-0.5";

  if (godkjent) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-[color:var(--kant-pa-dyp)] font-sans font-medium tracking-[0.06em] text-pa-dyp-dempet uppercase ${grad}`}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-pa-dyp-dempet" />
        Godkjent
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[color:var(--varsel-flate)] font-sans font-medium tracking-[0.06em] text-varsel uppercase ${grad}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-varsel" />
      Ugodkjent
    </span>
  );
}

/**
 * Den fulle forklaringen, øverst på en rubrikkside. Merket alene sier
 * TILSTANDEN; dette sier hva leseren skal gjøre med den.
 */
export function Godkjentbanner({ rubrikk }: { rubrikk: Rubrikk }) {
  if (rubrikk.godkjent) {
    return (
      <div className="rounded-flate border border-[color:var(--kant-pa-dyp)] px-5 py-4">
        <Godkjentmerke godkjent stor />
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-pa-dyp-dempet">
          {rubrikk.kilde ??
            "Innholdet er kvalitetssikret og kan følges som det står."}
        </p>
      </div>
    );
  }

  return (
    /*
     * `border-varsel/45` og ikke full styrke: rammen skal se ut som en
     * markering, ikke som en feilmelding. Innholdet ER brukbart — det er
     * bare ikke vedtatt.
     */
    <div className="rounded-flate border border-[color:var(--varsel)]/45 bg-[color:var(--varsel-flate)] px-5 py-4">
      <Godkjentmerke godkjent={false} stor />
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-pa-dyp">
        Dette er et <strong className="font-medium">utkast</strong>, skrevet
        som et faglig forslag — ikke Reflektors vedtatte praksis. Bruk det som
        utgangspunkt, ikke som fasit.
      </p>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-pa-dyp-dempet">
        Må kvalitetssikres av:{" "}
        <span className="font-medium text-pa-dyp">{rubrikk.ansvarlig}</span>
      </p>
    </div>
  );
}
