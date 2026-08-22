import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Gratis strategimøte",
  description:
    "Book et uforpliktende strategimøte om synlighet i sosiale medier.",
};

/**
 * Bevart fra dagens side – dette er den eksisterende konverteringssiden.
 * Skjemaet lå tidligere på egen URL (/gratis-strategimote-kontaktskjema),
 * som nå redirigerer hit.
 */
export default function GratisStrategimote() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
          Gratis strategimøte
        </h1>
        {/* TODO: skjema og verdiargumenter – avventer budskap og HubSpot-oppsett */}
      </Container>
    </section>
  );
}
