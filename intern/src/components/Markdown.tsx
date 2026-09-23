/**
 * Markdown-visning for det ferdige dokumentet.
 *
 * ── HVORFOR DEN ER SKREVET HER OG IKKE HENTET ─────────────────────────────
 *
 * Et markdown-bibliotek er 40–100 kB på klienten og drar med seg en
 * HTML-sanitizer som må vedlikeholdes. Dette dokumentet er ikke vilkårlig
 * markdown fra internett — det er det Claude nettopp skrev, med en instruks
 * som ber om overskrifter, lister og tabeller. Det er hele grammatikken vi
 * trenger.
 *
 * INGEN HTML SLIPPER GJENNOM. Alt som ikke er et av mønstrene under, havner
 * som ren tekst i en React-node — og React escaper den. Det er ikke en
 * sanitizer, det er fraværet av en injeksjonsvei.
 *
 * Støtter: overskrift 1–3, punktliste, nummerert liste, tabell med
 * skillelinje, vannrett strek, og **halvfet** inne i alt sammen.
 */

/** `**halvfet**` og `_kursiv_` inne i en linje. Alt annet blir ren tekst. */
function tekst(linje: string, nokkel: string): React.ReactNode[] {
  return linje.split(/(\*\*[^*]+\*\*)/g).map((bit, i) =>
    bit.startsWith("**") && bit.endsWith("**") ? (
      <strong key={`${nokkel}-${i}`} className="font-semibold text-blekk">
        {bit.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${nokkel}-${i}`}>{bit}</span>
    ),
  );
}

function celler(rad: string): string[] {
  return rad
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

const ERSKILLE = (l: string) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l);

export function Markdown({ kilde }: { kilde: string }) {
  const linjer = kilde.split("\n");
  const ut: React.ReactNode[] = [];

  /*
   * En vanlig `for` med indeks, ikke `map`: tabeller og lister spiser flere
   * linjer om gangen, og da må løkka kunne hoppe framover.
   */
  for (let i = 0; i < linjer.length; i++) {
    const l = linjer[i];

    if (!l.trim()) continue;

    if (/^---+$/.test(l.trim())) {
      ut.push(<hr key={i} className="my-7 border-kant-regel" />);
      continue;
    }

    const overskrift = /^(#{1,4})\s+(.*)$/.exec(l);
    if (overskrift) {
      const niva = overskrift[1].length;
      const innhold = tekst(overskrift[2], `h${i}`);
      ut.push(
        niva === 1 ? (
          <h1
            key={i}
            className="mt-8 text-[1.875rem] tracking-[-0.02em] first:mt-0"
          >
            {innhold}
          </h1>
        ) : niva === 2 ? (
          <h2 key={i} className="mt-8 text-[1.375rem] tracking-[-0.015em]">
            {innhold}
          </h2>
        ) : (
          <h3
            key={i}
            className="mt-6 font-sans text-[0.8125rem] font-medium tracking-[0.1em] text-aksent-tekst uppercase"
          >
            {innhold}
          </h3>
        ),
      );
      continue;
    }

    // Tabell: en rad, så en skillelinje, så radene.
    if (l.includes("|") && ERSKILLE(linjer[i + 1] ?? "")) {
      const kolonner = celler(l);
      const rader: string[][] = [];
      let j = i + 2;
      while (j < linjer.length && linjer[j].includes("|")) {
        rader.push(celler(linjer[j]));
        j++;
      }
      ut.push(
        <div key={i} className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[0.9375rem]">
            <thead>
              <tr>
                {kolonner.map((k, n) => (
                  <th
                    key={n}
                    className="border-b border-kant-sterk py-2 pr-4 text-left font-sans text-[0.75rem] font-medium tracking-[0.08em] text-blekk-dempet uppercase"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rader.map((r, n) => (
                <tr key={n}>
                  {r.map((c, m) => (
                    <td
                      key={m}
                      className="border-b border-kant py-2.5 pr-4 align-top leading-relaxed"
                    >
                      {tekst(c, `t${i}-${n}-${m}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      i = j - 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(l)) {
      const punkter: string[] = [];
      let j = i;
      while (j < linjer.length && /^\s*[-*]\s+/.test(linjer[j])) {
        punkter.push(linjer[j].replace(/^\s*[-*]\s+/, ""));
        j++;
      }
      ut.push(
        <ul key={i} className="mt-4 flex flex-col gap-2">
          {punkter.map((p, n) => (
            <li key={n} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="text-aksent-tekst">
                ·
              </span>
              <span>{tekst(p, `u${i}-${n}`)}</span>
            </li>
          ))}
        </ul>,
      );
      i = j - 1;
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(l)) {
      const punkter: string[] = [];
      let j = i;
      while (j < linjer.length && /^\s*\d+[.)]\s+/.test(linjer[j])) {
        punkter.push(linjer[j].replace(/^\s*\d+[.)]\s+/, ""));
        j++;
      }
      ut.push(
        <ol key={i} className="mt-4 flex flex-col gap-2">
          {punkter.map((p, n) => (
            <li key={n} className="flex gap-3 leading-relaxed">
              <span
                aria-hidden
                className="font-sans text-[0.8125rem] tabular-nums text-aksent-tekst"
              >
                {String(n + 1).padStart(2, "0")}
              </span>
              <span>{tekst(p, `o${i}-${n}`)}</span>
            </li>
          ))}
        </ol>,
      );
      i = j - 1;
      continue;
    }

    ut.push(
      <p key={i} className="mt-4 leading-relaxed text-pretty">
        {tekst(l, `p${i}`)}
      </p>,
    );
  }

  return <div className="text-[1rem] text-blekk-dempet">{ut}</div>;
}
