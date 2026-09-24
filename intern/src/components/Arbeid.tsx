"use client";

import { useEffect, useState } from "react";

import { ARBEIDSLINJE } from "@/content/arktype";
import type { Skissedel } from "@/content/maltype";

/**
 * Fremdriften, som én stripe.
 *
 * ── HVORFOR DEN BLE SKREVET OM ────────────────────────────────────────────
 *
 * Første utgave var et høyt kort med en avkryssingsliste. Den så bra ut mens
 * den fyltes — og den så ut som en hengt applikasjon i det halve minuttet
 * før første søk kom inn. Claude tenker før den søker, og i den tenkepausen
 * skjedde det ingenting på skjermen i det hele tatt.
 *
 * Tre ting følger av det:
 *
 * 1. EN KLOKKE SOM GÅR. Det er den eneste garantien for at noe lever. Uten
 *    den er «ingenting skjer» og «det tar tid» det samme bildet.
 * 2. EN LINJE SOM ALLTID SIER NOE, også før første søk. «Leser gjennom
 *    skjemaet» er sant, og uendelig mye bedre enn tomrom.
 * 3. LITEN. Fremdrift er ikke innholdet — det er kvitteringen på at
 *    innholdet er på vei. Tre linjer, ikke en halv skjerm.
 */

const STEG = [
  { id: "research", navn: "Undersøker" },
  { id: "skriver", navn: "Skriver" },
] as const;

function klokke(sekunder: number): string {
  const m = Math.floor(sekunder / 60);
  const s = sekunder % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Arbeid({
  deler,
  gjort,
  rettelse,
  fase,
  sok,
}: {
  deler: readonly Skissedel[];
  gjort: number;
  rettelse: boolean;
  fase: "research" | "skriver";
  /** Søkene som er gjort, nyeste sist. Modellens egne ord. */
  sok: readonly string[];
}) {
  /*
   * Klokka teller fra komponenten dukker opp. Den skal svare på «lever
   * dette?», og til det er sekunder siden det begynte å vises nøyaktig det
   * riktige tallet.
   */
  const [sekunder, setSekunder] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSekunder((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const aktivt = fase === "research" ? 0 : 1;

  /** Én linje som alltid sier noe sant om akkurat nå. */
  const naa =
    fase === "research"
      ? sok.length
        ? `Søker: ${sok[sok.length - 1]}`
        : "Leser gjennom skjemaet"
      : gjort === 0
        ? "Legger opp dokumentet"
        : (ARBEIDSLINJE[deler[Math.min(gjort, deler.length - 1)]] ??
          "Siste finpuss");

  const teller =
    fase === "research"
      ? sok.length
        ? `${sok.length} søk`
        : ""
      : `${gjort} av ${deler.length}`;

  return (
    <div className="rounded-flate border border-kant bg-kort px-5 py-4">
      <div className="flex items-center gap-3">
        {/*
          STEGENE SOM EN SKINNE. To prikker og en strek mellom sier hvor i
          løpet vi er, på en tidel av plassen en avkryssingsliste tar.
        */}
        <div aria-hidden className="flex items-center gap-1.5">
          {STEG.map((s, i) => (
            <span key={s.id} className="flex items-center gap-1.5">
              {i > 0 && (
                <span
                  className={`h-px w-5 transition-colors duration-500 motion-reduce:transition-none ${
                    i <= aktivt ? "bg-aksent" : "bg-kant"
                  }`}
                />
              )}
              <span
                className={`block h-2 w-2 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                  i < aktivt
                    ? "bg-aksent"
                    : i === aktivt
                      ? "animate-pulse bg-aksent"
                      : "bg-kant"
                }`}
              />
            </span>
          ))}
        </div>

        <p className="min-w-0 flex-1 truncate font-sans text-[0.8125rem] font-medium tracking-[0.06em] text-aksent-tekst uppercase">
          {rettelse && fase === "skriver"
            ? "Retter dokumentet"
            : STEG[aktivt].navn}
          {teller && (
            <span className="ml-2 tracking-normal text-blekk-svak normal-case">
              {teller}
            </span>
          )}
        </p>

        <span className="shrink-0 font-sans text-[0.8125rem] tabular-nums text-blekk-svak">
          {klokke(sekunder)}
        </span>
      </div>

      <p className="mt-2 truncate text-[0.9375rem] text-blekk-dempet">{naa}</p>

      {/*
        Skrivefasen har en ekte andel å vise. Researchfasen har det ikke — vi
        vet ikke hvor mange søk som trengs — så der står skinnen i ro og
        klokka gjør jobben.
      */}
      {fase === "skriver" && (
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-dempet">
          <div
            className="h-full rounded-full bg-aksent transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{
              width: `${Math.max(4, (gjort / Math.max(deler.length, 1)) * 100)}%`,
            }}
          />
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {naa}
      </p>
    </div>
  );
}
