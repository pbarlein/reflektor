"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Medieflate } from "@/components/Medieflate";
import type { Rubrikk } from "@/content/rubrikktype";
import type { Lesetilstand } from "@/lib/lesing";

/**
 * «Dette må du kunne godt» — pensum, med framdrift i selve rekka.
 *
 * ── HVA DEN ERSTATTET, OG HVORFOR ─────────────────────────────────────────
 *
 * Før sto det et framdriftskort her: en prosentstrek, «3 av 16 lest», og
 * ETT anbefalt kort. Tre problemer med den formen:
 *
 *   1. Streken var det største elementet og bar minst informasjon. En
 *      prosent forteller ikke hva som gjenstår, bare at noe gjør det.
 *   2. Ett anbefalt kort skjulte de femten andre. Den som ville se hva som
 *      fantes, måtte forbi seksjonen som het «din framdrift».
 *   3. Framdriften var et TALL ved siden av innholdet, ikke en egenskap VED
 *      innholdet. Da leses den som en pynt.
 *
 * Nå er framdriften rekka selv. Hvert kort bærer sin egen status, og du
 * ser på en halv omgang med øynene hvor mange som er igjen — uten å lese
 * et eneste tall. Tallet står der fortsatt, dempet, for den som vil ha det
 * presist.
 *
 * ── HVORFOR SIDELENGS OG IKKE ET RUTENETT ────────────────────────────────
 *
 * Seksten kort i rutenett er fire rader som dytter alt annet under folden,
 * hver eneste dag, for alltid. Dette er en startside folk ser daglig: det
 * som tar plass, må gjøre seg fortjent til den.
 *
 * Seks i bredden, resten bak en rulling. Prisen er at noe er skjult, og
 * den prisen betales med to signaler som IKKE er valgfrie: kortet som så
 * vidt stikker fram i kanten, og knappene. Uten dem er en sidelengs rekke
 * bare en rekke som er klippet av.
 *
 * ── KNAPPENE FINNES FORDI MUS IKKE KAN RULLE SIDELENGS ────────────────────
 *
 * På berøring drar man. På en laptop med styreflate går det også. Men med
 * en vanlig mus finnes det ingen naturlig sidelengs bevegelse, og det er
 * den vanligste maskinen på et kontor. Da er knapper ikke pynt, de er den
 * eneste inngangen.
 *
 * De er skjult når det ikke er noe å rulle til, og hver av dem forsvinner
 * i sin ende. En knapp som ikke gjør noe, lærer folk å ignorere knapper.
 */

export type Kortdata = {
  slug: string;
  tittel: string;
  kategori: string;
  minutter: number;
  medie: Rubrikk["medie"];
  tilstand: Lesetilstand;
};

export function MaaKunne({
  kort,
  lest,
}: {
  kort: readonly Kortdata[];
  lest: number;
}) {
  const sporet = useRef<HTMLUListElement>(null);
  const [kanVenstre, settKanVenstre] = useState(false);
  const [kanHoyre, settKanHoyre] = useState(false);

  /*
   * Måler i stedet for å regne. Hvor mye som er igjen å rulle avhenger av
   * vindusbredde, skriftgrad og om rullefeltet tar plass — alt sammen ting
   * som endrer seg etter at komponenten er tegnet.
   */
  const maal = useCallback(() => {
    const el = sporet.current;
    if (!el) return;
    settKanVenstre(el.scrollLeft > 4);
    settKanHoyre(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    maal();
    const el = sporet.current;
    if (!el) return;
    const ro = new ResizeObserver(maal);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maal]);

  /** Én skjermbredde om gangen, minus et kort så man ikke mister tråden. */
  function rull(retning: 1 | -1) {
    const el = sporet.current;
    if (!el) return;
    el.scrollBy({
      left: retning * Math.max(el.clientWidth - 120, 240),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  const igjen = kort.length - lest;

  return (
    <section
      aria-labelledby="maa-kunne"
      className="mx-auto w-full max-w-[88rem] px-5 pt-12 sm:px-8 sm:pt-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <h2
            id="maa-kunne"
            className="display text-[clamp(1.375rem,2.6vw,1.875rem)] tracking-[-0.02em] text-blekk"
          >
            Dette må du kunne godt
          </h2>
          {/*
            TALLET ER DEMPET MED VILJE. Det er en bekreftelse for den som
            vil ha det presist, ikke sidens budskap — budskapet er kortene.
            «N igjen» og ikke bare «x av y»: det som gjenstår er det man
            kan gjøre noe med.
          */}
          <p className="mt-1.5 text-[0.9375rem] text-blekk-dempet">
            <span className="tabular-nums">{lest}</span> av{" "}
            <span className="tabular-nums">{kort.length}</span> lest
            {/*
              «0 av 16 lest · 16 igjen» sier det samme to ganger. Resten
              som gjenstår er bare verdt å nevne når det faktisk er en rest
              — altså når noe ER lest, og det gjenstår noe.
            */}
            {lest > 0 && igjen > 0 && (
              <>
                {" · "}
                <span className="tabular-nums">{igjen}</span> igjen
              </>
            )}
            {lest > 0 && igjen === 0 && " · ferdig"}
          </p>
        </div>

        {/*
          Knappene står ved overskriften og ikke som piler oppå kortene.
          Piler oppå dekker et bilde og en tittel; her dekker de ingenting,
          og de er på samme sted uansett hvor langt man har rullet.
        */}
        <div className="flex shrink-0 gap-2">
          <Rulleknapp
            retning={-1}
            av={!kanVenstre}
            påTrykk={() => rull(-1)}
            merkelapp="Rull mot venstre"
          />
          <Rulleknapp
            retning={1}
            av={!kanHoyre}
            påTrykk={() => rull(1)}
            merkelapp="Rull mot høyre"
          />
        </div>
      </div>

      {/*
        SKYGGEN I HØYRE KANT er det andre signalet, og det som virker uten
        at man har sett seg om etter en knapp: innholdet toner ut i stedet
        for å bli klippet, og et bilde som toner ut fortsetter.

        Den ligger over sporet og må derfor slippe mus og berøring gjennom.
      */}
      <div className="relative mt-5">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(to_right,transparent,var(--flate-side))] transition-opacity duration-300 motion-reduce:transition-none ${
            kanHoyre ? "opacity-100" : "opacity-0"
          }`}
        />

        {/*
          `tabIndex` PÅ SPORET. Et område som kan rulles, må kunne rulles
          fra tastaturet også — WCAG 2.1.1. Uten den når man kortene bare
          ved å tabbe gjennom lenkene, og da hopper visningen i stedet for
          å rulle.
        */}
        <ul
          ref={sporet}
          onScroll={maal}
          tabIndex={0}
          aria-label="Rubrikkene du må kunne"
          className="rad-spor flex gap-3 overflow-x-auto pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksent"
        >
          {kort.map((k, i) => (
            <li
              key={k.slug}
              /*
                BREDDEN ER REGNET SÅ DET SJETTE KORTET DELVIS VISES.
                Seks hele kort i bredden ville sett ut som en komplett
                rekke, og da er det ingenting som sier at det finnes mer.
                5,4 kort i synlig bredde gjør at det alltid er et snitt
                igjen i kanten.
              */
              className="w-[min(60vw,13.5rem)] shrink-0 sm:w-[calc((100%-5*0.75rem)/5.4)]"
            >
              <Kort kort={k} prioritert={i < 6} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Rulleknapp({
  retning,
  av,
  påTrykk,
  merkelapp,
}: {
  retning: 1 | -1;
  av: boolean;
  påTrykk: () => void;
  merkelapp: string;
}) {
  return (
    <button
      type="button"
      onClick={påTrykk}
      disabled={av}
      aria-label={merkelapp}
      className="flex size-9 items-center justify-center rounded-full border border-kant bg-kort text-blekk-dempet transition-[opacity,border-color,color] hover:border-kant-sterk hover:text-blekk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
    >
      <span aria-hidden>{retning === 1 ? "→" : "←"}</span>
    </button>
  );
}

/**
 * Ett kort i rekka.
 *
 * ── LEST ER MARKERT TRE GANGER, OG DET ER IKKE FOR MYE ────────────────────
 *
 * Haken, det dempede bildet og den tynnere tittelen sier det samme. Grunnen
 * til at alle tre er der, er at de virker på hver sin avstand: bildet ser
 * du uten å se på kortet, haken når du ser på det, og ordet «Lest» når du
 * leser det. Et merke alene forsvinner i en rekke på seksten.
 *
 * Ulest har ingen markør. Det er normaltilstanden, og normaltilstanden
 * roper ikke — se `Lesemerke` for hele resonnementet.
 */
function Kort({ kort, prioritert }: { kort: Kortdata; prioritert: boolean }) {
  const lest = kort.tilstand === "lest";

  return (
    <Link
      href={`/rubrikk/${kort.slug}`}
      className="group block rounded-flate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-flate border border-kant bg-dempet">
        <div
          className={`absolute inset-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:saturate-100 motion-reduce:transform-none motion-reduce:transition-none ${
            lest ? "opacity-45 saturate-[0.4]" : ""
          }`}
        >
          <Medieflate medie={kort.medie} prioritert={prioritert} />
        </div>

        {lest ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-[rgba(255,255,255,0.94)] px-2 py-0.5 font-sans text-[0.625rem] font-medium tracking-[0.06em] text-blekk-dempet uppercase backdrop-blur-sm">
            <span aria-hidden>✓</span>
            Lest
          </span>
        ) : kort.tilstand === "ny" ? (
          <span className="absolute top-2 right-2 rounded-full bg-aksent px-2 py-0.5 font-sans text-[0.625rem] font-medium tracking-[0.06em] text-white uppercase">
            Ny
          </span>
        ) : null}
      </div>

      <p className="mt-2 font-sans text-[0.625rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
        {kort.kategori} · {kort.minutter} min
      </p>
      <p
        className={`mt-1 text-[0.9375rem] leading-snug text-pretty transition-colors group-hover:text-aksent-tekst motion-reduce:transition-none ${
          lest ? "text-blekk-dempet" : "font-medium text-blekk"
        }`}
      >
        {kort.tittel}
      </p>
    </Link>
  );
}
