import { Arbeidsvegg } from "@/components/Arbeidsbilder";
import { veggrader } from "@/content/arbeid";

/**
 * Arbeidsveggen i full bredde.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Vegg() {
  return (
    <>
      {/*
      Veggen. Full bredde med vilje — en seksjon som stopper ved
      tekstbredden leser som en illustrasjon, en som går ut av skjermen
      leser som en strøm. Se arbeid.ts og globals.css.
    */}
      <section className="pb-14 sm:pb-20" aria-label="Utvalg fra arbeidet">
        <Arbeidsvegg rader={veggrader} />
      </section>
    </>
  );
}
