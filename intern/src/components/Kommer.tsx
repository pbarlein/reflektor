import Link from "next/link";

import { Container } from "@/components/Container";

/**
 * Siden en rute fører til før den er bygget.
 *
 * ── HVORFOR DEN FINNES I DET HELE TATT ────────────────────────────────────
 *
 * Fem av de seks rutene på forsiden peker på funksjonalitet som ikke er
 * laget. Valget sto mellom å la rutene være uklikkbare, eller å la dem føre
 * hit. En uklikkbar rute gir ingen tilbakemelding: man trykker, ingenting
 * skjer, og man trykker igjen. Denne siden sier i det minste hva som skal
 * komme og at det ikke er her ennå.
 *
 * ── HVORFOR DEN IKKE LOVER NOE ────────────────────────────────────────────
 *
 * Det er fristende å skrive et avsnitt om hva siden skal bli. Men bortsett
 * fra det som faktisk er bestemt, ville det vært gjetning presentert som
 * plan — og en gjetning på en intern side leses som en beslutning.
 *
 * Derfor tar den bare imot en `hva`-tekst fra den som vet, og står tom
 * ellers. Copy kommer fra Reflektor. Se copy-protokollen i AGENTS.md.
 */
export function Kommer({
  tittel,
  hva,
}: {
  tittel: string;
  /** Det som faktisk er bestemt om siden. Utelates når ingenting er det. */
  hva?: string;
}) {
  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-interaktiv text-[0.9375rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
        >
          <span aria-hidden>←</span> Forsiden
        </Link>

        <div className="mt-7 max-w-[54rem]">
          <p className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-svak uppercase">
            Kommer
          </p>
          <h1 className="mt-2.5 text-[clamp(1.75rem,3.4vw,2.5rem)] tracking-[-0.02em]">
            {tittel}
          </h1>

          {hva && (
            <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
              {hva}
            </p>
          )}

          <p className="mt-6 max-w-[62ch] rounded-flate border border-dashed border-kant px-4 py-4 text-[0.9375rem] leading-relaxed text-pretty text-blekk-svak">
            Denne siden er ikke bygget ennå. Ruta på forsiden finnes så vi kan
            ta dem én og én — si fra når det er denne sin tur.
          </p>
        </div>
      </div>
    </Container>
  );
}
