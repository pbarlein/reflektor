import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Om oss",
  description: `SoMe-byrået ${site.navn} i ${site.kontakt.sted}.`,
};

export default function OmOss() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Om oss</h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet text-pretty">
          {site.ingress}
        </p>
        {/* TODO: historie, folk og verdier – avventer tekst fra Reflektor.
            Personsidene på dagens side hadde alle title «Contact 1». */}
      </Container>
    </section>
  );
}
