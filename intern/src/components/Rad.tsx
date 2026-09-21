"use client";

import { useRef, useState, useEffect } from "react";

import { Rubrikkort } from "@/components/Rubrikkort";
import type { Kategori } from "@/content/kategorier";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";

/**
 * Én kategori som en vannrett rad.
 *
 * ── HVORFOR RAD OG IKKE FILTER ────────────────────────────────────────────
 *
 * Første versjon krevde at du valgte en kategori for å se noe. Det er feil
 * form for et oppslagsverk: det forutsetter at du vet hva du leter etter.
 * En rad viser fram det den har, og lar deg bla videre hvis det du trenger
 * ikke er blant de første.
 *
 * ── DE FEM FØRSTE ER DE SOM BLIR LEST ─────────────────────────────────────
 *
 * Rekkefølgen kommer fra `prioritet` i innholdet, ikke fra alfabet eller
 * dato. Det er en redaksjonell beslutning: den som bare ser de fem første,
 * skal ha sett de fem viktigste.
 *
 * ── TASTATUR ──────────────────────────────────────────────────────────────
 *
 * Kortene er lenker, så tabbing gjennom raden ruller den av seg selv —
 * nettleseren scroller et fokusert element inn i bildet. Pilknappene er et
 * tillegg for mus og touch, og de er `aria-hidden` fordi de ikke tilbyr noe
 * tastaturbrukeren ikke allerede har.
 */
export function Rad({
  kategori,
  rubrikker,
  tilstander,
  prioriter = false,
}: {
  kategori: Kategori;
  rubrikker: readonly Rubrikk[];
  /** Lesestatus per slug. Regnet på serveren, se src/lib/lesing.ts. */
  tilstander: Record<string, Lesetilstand>;
  /** Kun den øverste raden på siden. Se `prioritert` i Rubrikkort. */
  prioriter?: boolean;
}) {
  const spor = useRef<HTMLDivElement | null>(null);
  const [kanVenstre, settKanVenstre] = useState(false);
  const [kanHoyre, settKanHoyre] = useState(false);

  /*
   * Pilknappene skjules når det ikke er noe å bla til. En pil som ikke
   * gjør noe, er verre enn ingen pil — den ser ut som om siden henger.
   *
   * `- 2` er slingringsmonn: nettlesere runder av delpiksler, og uten det
   * står høyrepilen igjen på en rad som faktisk er blådd helt ut.
   */
  useEffect(() => {
    const el = spor.current;
    if (!el) return;
    const oppdater = () => {
      settKanVenstre(el.scrollLeft > 2);
      settKanHoyre(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    oppdater();
    el.addEventListener("scroll", oppdater, { passive: true });
    const obs = new ResizeObserver(oppdater);
    obs.observe(el);
    return () => {
      el.removeEventListener("scroll", oppdater);
      obs.disconnect();
    };
  }, [rubrikker]);

  function bla(retning: 1 | -1) {
    const el = spor.current;
    if (!el) return;
    // Rundt to kort av gangen. Mindre føles som om ingenting skjedde.
    el.scrollBy({
      left: retning * Math.min(el.clientWidth * 0.8, 640),
      behavior: "smooth",
    });
  }

  return (
    <section aria-labelledby={`rad-${kategori.id}`} className="rad-inn">
      <div className="mx-auto flex w-full max-w-[88rem] items-end justify-between gap-6 px-5 sm:px-8">
        <div>
          <h2
            id={`rad-${kategori.id}`}
            className="display text-[1.75rem] leading-tight tracking-[-0.02em] text-blekk sm:text-[2rem]"
          >
            {kategori.navn}
          </h2>
          <p className="mt-1.5 max-w-[42rem] text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
            {kategori.beskrivelse}
          </p>
        </div>

        <div aria-hidden className="hidden shrink-0 gap-2 sm:flex">
          <Knapp retning={-1} aktiv={kanVenstre} bla={bla} />
          <Knapp retning={1} aktiv={kanHoyre} bla={bla} />
        </div>
      </div>

      {/*
        Sporet har sidepolstring i stedet for at forelderen har margin.
        Da ligger første kort på linje med overskriften, samtidig som
        kortene kan blas helt ut til kanten av skjermen — i stedet for å
        stoppe i en usynlig vegg midt på siden.
      */}
      <div className="rad-maske mt-5">
        <div
          ref={spor}
          className="rad-spor flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8"
        >
          {rubrikker.map((r, i) => (
            <Rubrikkort
              key={r.slug}
              rubrikk={r}
              tilstand={tilstander[r.slug] ?? "ulest"}
              prioritert={prioriter && i < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Knapp({
  retning,
  aktiv,
  bla,
}: {
  retning: 1 | -1;
  aktiv: boolean;
  bla: (r: 1 | -1) => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => bla(retning)}
      disabled={!aktiv}
      className="flex size-9 items-center justify-center rounded-full border border-kant bg-kort text-blekk-dempet transition-opacity hover:border-kant-sterk hover:text-blekk disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none"
    >
      <span aria-hidden>{retning === 1 ? "→" : "←"}</span>
    </button>
  );
}
