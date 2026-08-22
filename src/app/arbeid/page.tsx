import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { caser } from "@/content/site";

export const metadata: Metadata = {
  title: "Kundecaser",
  description: "Utvalgt arbeid innen foto, video og sosiale medier.",
};

export default function Arbeid() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Arbeid</h1>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {caser.map((kundecase) => (
            <li key={kundecase.slug}>
              <Link
                href={`/arbeid/${kundecase.slug}`}
                className="block rounded-2xl border border-kant p-8 transition-colors hover:bg-flate-dempet"
              >
                <h2 className="text-xl font-medium">{kundecase.kunde}</h2>
                <p className="mt-2 text-sm text-blekk-dempet">{kundecase.ingress}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
