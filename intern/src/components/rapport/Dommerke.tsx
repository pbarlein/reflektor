import type { Domnivaa } from "@/content/rapporttype";

/**
 * Dommen, som merke.
 *
 * ── HVORFOR DEN IKKE ER FARGE ALENE ───────────────────────────────────────
 *
 * «Handling kreves» og «Alt i rute» skiller seg på ord først og farge
 * etterpå. En rød flekk uten tekst er en rød flekk, og for den som ikke
 * ser forskjell på rødt og grått, er den ingenting.
 */

const MERKER: Record<Domnivaa, { tekst: string; klasse: string }> = {
  act: {
    tekst: "Handling kreves",
    klasse: "bg-[color:var(--varsel)] text-white",
  },
  watch: {
    tekst: "Følg med",
    klasse: "border border-kant-sterk bg-kort text-blekk",
  },
  ok: {
    tekst: "Alt i rute",
    klasse: "border border-kant bg-dempet text-blekk-dempet",
  },
};

export function Dommerke({
  niva,
  stor = false,
}: {
  niva: Domnivaa;
  stor?: boolean;
}) {
  const m = MERKER[niva] ?? MERKER.ok;
  return (
    <span
      className={`inline-block rounded-sm font-sans font-semibold tracking-[0.12em] uppercase ${m.klasse} ${
        stor ? "px-3 py-1.5 text-[0.75rem]" : "px-2 py-1 text-[0.625rem]"
      }`}
    >
      {m.tekst}
    </span>
  );
}
