import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { bloggSlugs } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return bloggSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

/**
 * MERK: brødteksten er ikke migrert fra Squarespace ennå.
 *
 * Disse sidene bærer all ikke-brandtrafikk til reflektor.no (docs/kontekst.md).
 * Slugene er bevart slik at rangeringene overlever, men siden MÅ IKKE lanseres
 * før tekstene faktisk er flyttet over – tomme sider her vil rasere SEO-en.
 */
export default async function BloggInnlegg({ params }: Props) {
  const { slug } = await params;
  if (!bloggSlugs.includes(slug as (typeof bloggSlugs)[number])) notFound();

  return (
    <article className="py-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-6 text-blekk-dempet">
          Innholdet er ikke migrert fra Squarespace ennå.
        </p>
      </Container>
    </article>
  );
}
