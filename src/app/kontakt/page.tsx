import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: `Ta kontakt med ${site.navn}.`,
};

export default function Kontakt() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Kontakt oss</h1>
        {/* TODO: skjema. Krever avklaring av mottaker – HubSpot er koblet,
            så innsending bør trolig gå dit framfor e-post. */}
        <p className="mt-6 text-blekk-dempet">
          {site.kontakt.epost || "Kontaktinformasjon mangler – se docs/kontekst.md"}
        </p>
      </Container>
    </section>
  );
}
