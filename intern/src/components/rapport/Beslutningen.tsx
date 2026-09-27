"use client";

import { useState } from "react";

import type { Beslutning } from "@/content/rapporttype";
import type { Beslutningssvar, Svar } from "@/lib/rapportlager";
import { kr, norskTidspunkt } from "@/lib/rapportformat";

/**
 * Beslutningen, med de tre knappene.
 *
 * ── HVORFOR DEN LIGGER SÅ HØYT PÅ SIDEN ───────────────────────────────────
 *
 * Bestilt: Pål skal kunne ta en beslutning på under tretti sekunder. Da kan
 * ikke spørsmålet ligge under fire nøkkeltall, to grafer og en tabell. Det
 * ligger rett under dommen og hovedsetningen, og knappene er det eneste på
 * siden som ser ut som knapper å trykke på.
 *
 * ── «SENERE» ER ET EKTE SVAR ──────────────────────────────────────────────
 *
 * Med bare Ja og Nei blir «jeg vet ikke ennå» til ingen svar, og da purrer
 * systemet i tre døgn på noe han allerede har tatt stilling til. «Senere»
 * stopper purringen uten å late som beslutningen er tatt.
 */

const KNAPPER: { verdi: Svar; tekst: string }[] = [
  { verdi: "ja", tekst: "Ja" },
  { verdi: "nei", tekst: "Nei" },
  { verdi: "senere", tekst: "Senere" },
];

export function Beslutningen({
  type,
  id,
  beslutning,
  svar: fraFor,
}: {
  type: string;
  id: string;
  beslutning: Beslutning;
  svar: Beslutningssvar | null;
}) {
  const [svar, setSvar] = useState<Beslutningssvar | null>(fraFor);
  const [kommentar, setKommentar] = useState("");
  const [sender, setSender] = useState<Svar | null>(null);
  const [feil, setFeil] = useState("");

  async function velg(verdi: Svar) {
    setSender(verdi);
    setFeil("");
    try {
      const r = await fetch("/api/rapport/handling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          id,
          handling: "beslutning",
          svar: verdi,
          kommentar,
        }),
      });
      const d = (await r.json()) as {
        beslutning?: Beslutningssvar;
        feil?: string;
      };
      if (!r.ok || !d.beslutning) throw new Error(d.feil ?? "Ukjent feil");
      setSvar(d.beslutning);
      setKommentar("");
    } catch (e) {
      setFeil(e instanceof Error ? e.message : "Svaret ble ikke lagret.");
    } finally {
      setSender(null);
    }
  }

  const ekstra = [
    beslutning.cost_nok ? `Kostnad ca. ${kr(beslutning.cost_nok)}` : "",
    beslutning.deadline_label ? `Frist ${beslutning.deadline_label}` : "",
  ].filter(Boolean);

  return (
    <section
      aria-labelledby="beslutning-tittel"
      className="rounded-flate border-2 border-[color:var(--kant-sterk)] bg-kort px-5 py-5"
    >
      <h2
        id="beslutning-tittel"
        className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-aksent-tekst uppercase"
      >
        Din beslutning
      </h2>

      <p className="mt-2 text-[1.375rem] leading-tight font-medium tracking-[-0.015em] text-pretty text-blekk">
        {beslutning.question}
      </p>

      {beslutning.recommendation && (
        <p className="mt-3 text-[1rem] leading-relaxed text-pretty text-blekk-dempet">
          <span className="font-medium text-blekk">Anbefaling:</span>{" "}
          {beslutning.recommendation}
        </p>
      )}

      {ekstra.length > 0 && (
        <p className="mt-2 text-[0.875rem] text-blekk-svak">
          {ekstra.join(" · ")}
        </p>
      )}

      {beslutning.if_nothing && (
        <p className="mt-2 max-w-[68ch] text-[0.875rem] leading-relaxed text-pretty text-blekk-svak">
          Gjør vi ingenting: {beslutning.if_nothing}
        </p>
      )}

      {svar ? (
        <div className="mt-5 rounded-interaktiv border border-kant bg-dempet px-4 py-3">
          <p className="text-[0.9375rem] text-blekk">
            <span className="font-medium">
              Du svarte{" "}
              {svar.svar === "ja"
                ? "ja"
                : svar.svar === "nei"
                  ? "nei"
                  : "senere"}
            </span>{" "}
            <span className="text-blekk-svak">
              · {norskTidspunkt(svar.tidspunkt)}
            </span>
          </p>
          {svar.kommentar && (
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
              {svar.kommentar}
            </p>
          )}
          <button
            type="button"
            onClick={() => setSvar(null)}
            className="mt-2 rounded-interaktiv text-[0.8125rem] text-blekk-svak underline underline-offset-2 transition-colors hover:text-blekk motion-reduce:transition-none"
          >
            Endre svaret
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label htmlFor="beslutning-kommentar" className="sr-only">
            Kommentar til svaret
          </label>
          <textarea
            id="beslutning-kommentar"
            value={kommentar}
            onChange={(e) => setKommentar(e.target.value)}
            rows={2}
            placeholder="Kommentar (valgfritt)"
            className="w-full rounded-interaktiv border border-kant bg-kort px-3.5 py-2.5 text-[0.9375rem] text-blekk placeholder:text-blekk-svak focus:border-kant-sterk focus:outline-none"
          />
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {KNAPPER.map((k) => (
              <button
                key={k.verdi}
                type="button"
                disabled={sender !== null}
                onClick={() => void velg(k.verdi)}
                className={`min-w-[6.5rem] rounded-interaktiv px-5 py-2.5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60 motion-reduce:transition-none ${
                  k.verdi === "ja"
                    ? "border border-aksent bg-aksent text-[color:var(--text-on-accent)] hover:bg-[color:var(--action-primary-hover)]"
                    : "border border-kant-sterk bg-kort text-blekk hover:bg-dempet"
                }`}
              >
                {sender === k.verdi ? "Lagrer …" : k.tekst}
              </button>
            ))}
          </div>
          {feil && (
            <p role="alert" className="mt-2 text-[0.875rem] text-varsel">
              {feil}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
