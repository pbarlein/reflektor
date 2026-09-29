import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { TakkHendelse } from "@/components/TakkHendelse";

export const metadata: Metadata = {
  title: "Takk for henvendelsen",
  // Kvitteringssider skal ikke indekseres.
  robots: { index: false, follow: false },
};

/**
 * Konverteringssiden.
 *
 * Dette er sidevisningen GA4 måler som `takk_page_view`, og som Google Ads
 * teller konverteringer på. 107+ historiske konverteringer henger på den.
 * Endres URL-en eller hendelsen, mister Reflektor målingen av sin eneste KPI.
 */
export default function Takk() {
  return (
    <section className="py-20">
      <TakkHendelse />
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">
          Takk for henvendelsen
        </h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet">
          Vi tar kontakt så snart vi kan.
        </p>
        {/*
          HER STO EN TODO om at GA4-hendelsen `takk_page_view` «må utløses
          her». Den er fjernet 29.09.2026, og det er ikke opprydding — den
          var en felle.

          `<TakkHendelse />` over gjør nøyaktig det TODO-en ba om. Verre:
          komponentens egen dokumentasjon advarer uttrykkelig mot å koble
          hendelsen til en utløser i GTM, fordi nøkkelhendelsen allerede
          lages inne i GA4 fra den samme sidevisningen. Den som fulgte
          TODO-en ville dobbelttelt Reflektors eneste KPI.

          Les TakkHendelse.tsx før du rører noe her.
        */}
      </Container>
    </section>
  );
}
