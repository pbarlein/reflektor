import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { tjenester } from "@/content/site";

export const metadata: Metadata = {
  title: "Tjenester",
  description: "Strategi, innholdsproduksjon, video og foto for sosiale medier.",
};

export default function Tjenester() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Tjenester</h1>
        <ul className="mt-12 divide-y divide-kant border-y border-kant">
          {tjenester.map((tjeneste) => (
            <li key={tjeneste.slug}>
              <Link
                href={`/tjenester/${tjeneste.slug}`}
                className="flex flex-col gap-2 py-8 transition-opacity hover:opacity-70 sm:flex-row sm:items-baseline sm:gap-10"
              >
                <h2 className="text-xl font-medium sm:w-64 sm:shrink-0">
                  {tjeneste.navn}
                </h2>
                <p className="text-blekk-dempet text-pretty">{tjeneste.ingress}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
