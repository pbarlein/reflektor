"use client";

import { useState } from "react";

import type { Steg } from "@/content/rapporttype";
import type { Notat, Stegavkryssing } from "@/lib/rapportlager";
import { forfalt, norskTidspunkt } from "@/lib/rapportformat";

/**
 * Neste steg, med avkryssing — og notatene.
 *
 * ── HVORFOR FORFALTE STEG SER ANNERLEDES UT ───────────────────────────────
 *
 * Et steg som har passert fristen uten å bli gjort, er den eneste raden i
 * rapporten som krever noe av leseren akkurat nå. Står det som de andre,
 * blir det lest som de andre.
 *
 * ── AVKRYSSINGEN LAGRES MED EN GANG ───────────────────────────────────────
 *
 * Ingen lagreknapp. Et steg man krysser av og så mister fordi man lukket
 * fanen, er verre enn ingen avkryssing — og purringen på forfalte steg
 * leser den samme lagrede tilstanden.
 */

export function Stegene({
  type,
  id,
  steg,
  gjorteFraFor,
}: {
  type: string;
  id: string;
  steg: readonly Steg[];
  gjorteFraFor: readonly Stegavkryssing[];
}) {
  const [gjorte, setGjorte] = useState<number[]>(
    gjorteFraFor.map((g) => g.indeks),
  );
  const [jobber, setJobber] = useState<number | null>(null);

  async function veksle(i: number) {
    const naa = !gjorte.includes(i);
    setJobber(i);
    /* Optimistisk: avkryssingen skal føles umiddelbar. */
    setGjorte((g) => (naa ? [...g, i] : g.filter((x) => x !== i)));
    try {
      const r = await fetch("/api/rapport/handling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          id,
          handling: "steg",
          indeks: i,
          gjort: naa,
        }),
      });
      if (!r.ok) throw new Error();
    } catch {
      /* Gikk det galt, skal haken tilbake dit den var. */
      setGjorte((g) => (naa ? g.filter((x) => x !== i) : [...g, i]));
    } finally {
      setJobber(null);
    }
  }

  if (!steg.length) return null;

  return (
    <ol className="flex flex-col gap-2">
      {steg.map((s, i) => {
        const gjort = gjorte.includes(i);
        const sent = !gjort && forfalt(s.due);
        return (
          <li key={i}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-interaktiv border px-3.5 py-3 transition-colors motion-reduce:transition-none ${
                sent
                  ? "border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)]"
                  : "border-kant bg-kort hover:bg-dempet"
              }`}
            >
              <input
                type="checkbox"
                checked={gjort}
                disabled={jobber === i}
                onChange={() => void veksle(i)}
                className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 accent-[color:var(--aksent)]"
              />
              <span className="min-w-0">
                <span
                  className={`block text-[0.9375rem] leading-relaxed text-pretty ${
                    gjort ? "text-blekk-svak line-through" : "text-blekk"
                  }`}
                >
                  {s.title} {s.detail}
                </span>
                <span className="mt-0.5 block font-sans text-[0.75rem] tracking-[0.04em] text-blekk-svak uppercase">
                  {[s.owner, s.due_label].filter(Boolean).join(" · ")}
                  {sent && (
                    <span className="ml-2 font-medium text-varsel normal-case">
                      Fristen har passert
                    </span>
                  )}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ol>
  );
}

/** Påls egne notater på rapporten. */
export function Notatene({
  type,
  id,
  fraFor,
}: {
  type: string;
  id: string;
  fraFor: readonly Notat[];
}) {
  const [notater, setNotater] = useState<Notat[]>([...fraFor]);
  const [tekst, setTekst] = useState("");
  const [sender, setSender] = useState(false);

  async function lagre() {
    if (!tekst.trim()) return;
    setSender(true);
    try {
      const r = await fetch("/api/rapport/handling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, handling: "notat", tekst }),
      });
      const d = (await r.json()) as { notater?: Notat[] };
      if (r.ok && d.notater) {
        setNotater(d.notater);
        setTekst("");
      }
    } finally {
      setSender(false);
    }
  }

  return (
    <div>
      {notater.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {notater.map((n, i) => (
            <li
              key={i}
              className="rounded-interaktiv border border-kant bg-kort px-3.5 py-2.5"
            >
              <p className="text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                {n.tekst}
              </p>
              <p className="mt-1 text-[0.75rem] text-blekk-svak">
                {norskTidspunkt(n.tidspunkt)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <label htmlFor="notat" className="sr-only">
        Notat til rapporten
      </label>
      <textarea
        id="notat"
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        rows={2}
        placeholder="Notat til deg selv"
        className="w-full rounded-interaktiv border border-kant bg-kort px-3.5 py-2.5 text-[0.9375rem] text-blekk placeholder:text-blekk-svak focus:border-kant-sterk focus:outline-none"
      />
      <button
        type="button"
        onClick={() => void lagre()}
        disabled={sender || !tekst.trim()}
        className="mt-2 rounded-interaktiv border border-kant-sterk bg-kort px-4 py-2 text-[0.875rem] font-medium text-blekk transition-colors hover:bg-dempet disabled:opacity-50 motion-reduce:transition-none"
      >
        {sender ? "Lagrer …" : "Lagre notat"}
      </button>
    </div>
  );
}
