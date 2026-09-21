import type { Punkt } from "@/content/rubrikktype";

/**
 * Punktoppsummeringen øverst i hver tekst.
 *
 * ── HVORFOR DEN FINNES ────────────────────────────────────────────────────
 *
 * Et oppslagsverk leses ikke som en bok. Folk kommer hit midt i en
 * arbeidsdag med ett spørsmål, og de har som regel allerede svaret på
 * halvparten av teksten. Oppsummeringen lar dem se hele innholdet på to
 * sekunder og hoppe rett til den ene delen de trengte.
 *
 * Det er samme prinsipp som gjør en sjekkliste bedre enn et kurs for noe
 * man gjør sjelden: støtten skal ligge der arbeidet skjer, ikke i forkant
 * av det.
 *
 * ── HVORFOR ANKERLENKER OG IKKE EN JAVASCRIPT-RULLER ──────────────────────
 *
 * Dette er `<a href="#id">`, ikke en klikkhåndterer. Konsekvensene er ekte:
 * lenkene virker før JavaScript har lastet, de kan åpnes i ny fane, de kan
 * kopieres og deles, og de havner i nettleserhistorikken så «tilbake»
 * fungerer som folk forventer.
 *
 * Den myke rullingen kommer fra `scroll-behavior` i globals.css, og den er
 * slått av under `prefers-reduced-motion`.
 *
 * Ankrene valideres ved modullasting og i testene — et punkt som ikke
 * hopper noe sted er verre enn ingen lenke, fordi brukeren tror hen klikket
 * feil.
 */
export function Oppsummering({ punkter }: { punkter: readonly Punkt[] }) {
  return (
    <nav
      aria-label="Innhold i denne teksten"
      className="rounded-flate border border-kant bg-kort px-5 py-5 sm:px-6"
    >
      <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
        Kort fortalt
      </p>
      <ol className="mt-4 flex flex-col">
        {punkter.map((p, i) => (
          <li key={p.anker} className="border-b border-kant last:border-b-0">
            <a
              href={`#${p.anker}`}
              className="group flex items-baseline gap-3.5 py-2.5 text-[1rem] leading-snug text-pretty text-blekk transition-colors hover:text-aksent-tekst motion-reduce:transition-none"
            >
              <span
                aria-hidden
                className="display shrink-0 text-[0.875rem] tabular-nums text-aksent-tekst"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="group-hover:underline group-hover:underline-offset-4">
                {p.tekst}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
