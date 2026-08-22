import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { caser } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caser.map((kundecase) => ({ slug: kundecase.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kundecase = caser.find((c) => c.slug === slug);
  if (!kundecase) return {};
  return { title: `${kundecase.kunde} – kundecase`, description: kundecase.ingress };
}

export default async function CaseSide({ params }: Props) {
  const { slug } = await params;
  const kundecase = caser.find((c) => c.slug === slug);
  if (!kundecase) notFound();

  return (
    <article className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">{kundecase.kunde}</h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet">{kundecase.ingress}</p>
      </Container>
    </article>
  );
}
