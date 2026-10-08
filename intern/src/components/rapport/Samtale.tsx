"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Samtalen under stegene.
 *
 * ── DEN STÅR DER FORDI SPØRSMÅLET OPPSTÅR DER ─────────────────────────────
 *
 * Bestilt 08.10.2026. Alternativet var en egen side. Men spørsmålet
 * «hvorfor er prisen per lead oppe igjen» stilles mens man ser tallet, og
 * svaret hører hjemme samme sted som stegene det handler om.
 *
 * ── HANDLINGER VISES, DE SKJER IKKE I STILLHET ────────────────────────────
 *
 * Krysser Claude av et steg, står det i samtalen at den gjorde det. Et
 * grensesnitt som endrer noe uten å si det, lærer folk å ikke stole på
 * det — og avkryssingene styrer purringen.
 *
 * Boksene over oppdateres først ved neste lasting. Det er med vilje: en
 * avkryssing som flytter seg mens du leser en setning om den, er verre
 * enn en som står stille til du har lest ferdig.
 */

type Tur = {
  rolle: "meg" | "claude";
  tekst: string;
  /** Verktøy som faktisk endret noe, i fortid. */
  gjort?: string[];
  feil?: string;
};

const FORSLAG = [
  "Hva er det viktigste jeg bør gjøre denne uka?",
  "Sammenlign med de fire forrige ukene.",
  "Lag listen for opprydding i HubSpot.",
];

export function Samtale({ type, id }: { type: string; id: string }) {
  const [turer, setTurer] = useState<Tur[]>([]);
  const [tekst, setTekst] = useState("");
  const [jobber, setJobber] = useState(false);
  const [tenker, setTenker] = useState("");
  const [lastet, setLastet] = useState(false);
  const feltet = useRef<HTMLTextAreaElement>(null);
  const bunnen = useRef<HTMLDivElement>(null);

  /* Historikken hentes etter at siden er tegnet — den skal ikke stå i veien. */
  useEffect(() => {
    let avbrutt = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/rapport/samtale?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`,
        );
        if (!r.ok) return;
        const d = (await r.json()) as { meldinger?: unknown[] };
        if (avbrutt) return;
        setTurer(tilTurer(d.meldinger ?? []));
      } finally {
        if (!avbrutt) setLastet(true);
      }
    })();
    return () => {
      avbrutt = true;
    };
  }, [type, id]);

  useEffect(() => {
    bunnen.current?.scrollIntoView({ block: "nearest" });
  }, [turer, tenker]);

  async function send(melding: string) {
    const rent = melding.trim();
    if (!rent || jobber) return;
    setTekst("");
    setTenker("");
    setJobber(true);
    setTurer((t) => [
      ...t,
      { rolle: "meg", tekst: rent },
      { rolle: "claude", tekst: "" },
    ]);

    /** Endrer SISTE tur. Alle strømoppdateringer går gjennom denne. */
    const oppdater = (endre: (t: Tur) => Tur) =>
      setTurer((alle) =>
        alle.map((t, i) => (i === alle.length - 1 ? endre(t) : t)),
      );

    try {
      const r = await fetch("/api/rapport/samtale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, melding: rent }),
      });
      if (!r.ok || !r.body) {
        const d = (await r.json().catch(() => null)) as {
          feil?: string;
        } | null;
        oppdater((t) => ({ ...t, feil: d?.feil ?? "Noe gikk galt." }));
        return;
      }

      /*
       * NDJSON: én linje per hendelse. Rester mellom to pakker tas vare på
       * — en linje kan være delt midt i et tegn.
       */
      const leser = r.body.getReader();
      const avkoder = new TextDecoder();
      let rest = "";
      for (;;) {
        const { done, value } = await leser.read();
        if (done) break;
        rest += avkoder.decode(value, { stream: true });
        const linjer = rest.split("\n");
        rest = linjer.pop() ?? "";
        for (const l of linjer) {
          if (!l.trim()) continue;
          let h: Record<string, unknown>;
          try {
            h = JSON.parse(l);
          } catch {
            continue;
          }
          if (typeof h.tekst === "string") {
            const bit = h.tekst;
            setTenker("");
            oppdater((t) => ({ ...t, tekst: t.tekst + bit }));
          } else if (typeof h.tenker === "string") {
            const bit = h.tenker;
            setTenker((s) => (s + bit).slice(-180));
          } else if (typeof h.gjort === "string") {
            const g = h.gjort;
            oppdater((t) => ({ ...t, gjort: [...(t.gjort ?? []), g] }));
          } else if (typeof h.feil === "string") {
            const f = h.feil;
            oppdater((t) => ({ ...t, feil: f }));
          }
        }
      }
    } catch {
      oppdater((t) => ({ ...t, feil: "Mistet forbindelsen." }));
    } finally {
      setJobber(false);
      setTenker("");
      feltet.current?.focus();
    }
  }

  async function nullstill() {
    await fetch("/api/rapport/samtale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, nullstill: true }),
    });
    setTurer([]);
  }

  return (
    <section aria-labelledby="samtale" className="print:hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id="samtale"
          className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase"
        >
          Spør om rapporten
        </h2>
        {turer.length > 0 && (
          <button
            type="button"
            onClick={() => void nullstill()}
            className="rounded-interaktiv font-sans text-[0.75rem] text-blekk-svak underline underline-offset-4 transition-colors hover:text-blekk motion-reduce:transition-none"
          >
            Start på nytt
          </button>
        )}
      </div>

      <div className="mt-3 rounded-flate border border-kant bg-kort">
        {turer.length > 0 && (
          <ol className="flex flex-col gap-4 border-b border-kant px-5 py-5">
            {turer.map((t, i) => (
              <li key={i}>
                {t.rolle === "meg" ? (
                  <p className="ml-auto max-w-[46ch] rounded-flate bg-dempet px-3.5 py-2 text-[0.9375rem] leading-relaxed text-pretty text-blekk">
                    {t.tekst}
                  </p>
                ) : (
                  <div className="max-w-[68ch]">
                    {t.gjort?.map((g, j) => (
                      <p
                        key={j}
                        className="mb-1.5 flex items-baseline gap-2 font-sans text-[0.75rem] text-aksent-tekst"
                      >
                        <span aria-hidden>✓</span>
                        {g}
                      </p>
                    ))}
                    {t.tekst && (
                      <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-pretty text-blekk">
                        {t.tekst}
                      </p>
                    )}
                    {t.feil && (
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-varsel">
                        {t.feil}
                      </p>
                    )}
                    {!t.tekst && !t.feil && !jobber && (
                      <p className="text-[0.875rem] text-blekk-svak">
                        Ikke noe svar.
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
            {jobber && (
              <li
                aria-live="polite"
                className="text-[0.8125rem] leading-relaxed text-blekk-svak"
              >
                {tenker ? `Tenker: ${tenker}…` : "Tenker …"}
              </li>
            )}
            <div ref={bunnen} />
          </ol>
        )}

        <div className="px-5 py-4">
          <label htmlFor="samtalefelt" className="sr-only">
            Spør om rapporten
          </label>
          <textarea
            ref={feltet}
            id="samtalefelt"
            rows={2}
            value={tekst}
            disabled={!lastet}
            onChange={(e) => setTekst(e.target.value)}
            onKeyDown={(e) => {
              /* Enter sender, skift+enter gir ny linje. */
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(tekst);
              }
            }}
            placeholder="Be om noe, eller spør om tallene. Enter sender."
            className="w-full resize-y rounded-interaktiv border border-kant bg-side px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-blekk transition-[border-color,box-shadow] placeholder:text-blekk-svak hover:border-kant-sterk focus:border-kant-sterk focus:ring-2 focus:ring-aksent/35 focus:outline-none disabled:opacity-60 motion-reduce:transition-none"
          />

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
            {turer.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {FORSLAG.map((f) => (
                  <button
                    key={f}
                    type="button"
                    disabled={jobber || !lastet}
                    onClick={() => void send(f)}
                    className="rounded-interaktiv border border-kant bg-side px-3 py-1.5 text-[0.8125rem] text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk disabled:opacity-60 motion-reduce:transition-none"
                  >
                    {f}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}
            <button
              type="button"
              disabled={jobber || !tekst.trim()}
              onClick={() => void send(tekst)}
              className="ml-auto shrink-0 rounded-interaktiv border border-aksent bg-aksent px-4 py-2 font-sans text-[0.875rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:border-[color:var(--action-primary-hover)] hover:bg-[color:var(--action-primary-hover)] disabled:opacity-50 motion-reduce:transition-none"
            >
              {jobber ? "Svarer …" : "Send"}
            </button>
          </div>

          {/*
            ── HVA DEN IKKE KAN ──────────────────────────────────────────
            Står her, ikke i et svar. Den som skal be om merking i HubSpot,
            skal vite før hen skriver at den ikke har tilgang — ikke etter.
          */}
          <p className="mt-3 border-t border-kant pt-2.5 text-[0.75rem] leading-relaxed text-pretty text-blekk-svak">
            Kan krysse av steg, svare på beslutningen, skrive notat og hente
            tidligere uker. Har <strong className="font-medium">ikke</strong>{" "}
            tilgang til HubSpot, Google Ads eller Meta — der lager den listen du
            utfører selv.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Lagret historikk → turer på skjermen.
 *
 * Lageret har modellens form: tenkeblokker, verktøykall og verktøysvar.
 * Her beholdes bare teksten, og verktøykallene blir til «✓ gjort»-linjer.
 * Historikken har vært utenfor huset, så ingenting antas om formen.
 */
function tilTurer(meldinger: readonly unknown[]): Tur[] {
  const ut: Tur[] = [];
  for (const m of meldinger) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;

    if (typeof content === "string") {
      if (content.trim()) ut.push({ rolle: "meg", tekst: content });
      continue;
    }
    if (!Array.isArray(content)) continue;

    const tekst = content
      .filter(
        (b): b is { type: "text"; text: string } =>
          Boolean(b) &&
          typeof b === "object" &&
          (b as { type?: unknown }).type === "text" &&
          typeof (b as { text?: unknown }).text === "string",
      )
      .map((b) => b.text)
      .join("")
      .trim();

    /* En brukermelding med bare verktøysvar er maskineri, ikke en tur. */
    if (!tekst) continue;
    ut.push({ rolle: role === "user" ? "meg" : "claude", tekst });
  }
  return ut;
}
