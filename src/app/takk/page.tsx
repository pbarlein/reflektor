import type { Metadata } from "next";
import { Container } from "@/components/Container";

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
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">
          Takk for henvendelsen
        </h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet">
          Vi tar kontakt så snart vi kan.
        </p>
        {/* TODO: GA4-hendelse takk_page_view må utløses her. Verifiser mot
            eksisterende oppsett før lansering – ikke gjett på navnet. */}
      </Container>
    </section>
  );
}
