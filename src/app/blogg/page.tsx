import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { bloggSlugs } from "@/content/site";

export const metadata: Metadata = {
  title: "Blogg",
  description: "Om sosiale medier, innholdsproduksjon og markedsføring.",
};

/** Midlertidig: utleder en lesbar tittel av slugen inntil tekstene er migrert. */
function tittelFraSlug(slug: string) {
  const ord = slug.replace(/-/g, " ");
  return ord.charAt(0).toUpperCase() + ord.slice(1);
}

export default function Blogg() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Blogg</h1>
        <ul className="mt-12 divide-y divide-kant border-y border-kant">
          {bloggSlugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/blogg/${slug}`}
                className="block py-6 transition-opacity hover:opacity-70"
              >
                {tittelFraSlug(slug)}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
