import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Ofte stilte spørsmål",
};

export default function Faq() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">
          Ofte stilte spørsmål
        </h1>
        {/* TODO: innhold hentes fra snapshot av /faq.
            Vurder FAQPage-schema (JSON-LD) her. */}
      </Container>
    </section>
  );
}
