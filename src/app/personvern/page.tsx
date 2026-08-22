import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Personvern",
  robots: { index: false },
};

export default function Personvern() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Personvern</h1>
        {/* TODO: hent over gjeldende tekst fra /privacypolicy på dagens side */}
      </Container>
    </section>
  );
}
