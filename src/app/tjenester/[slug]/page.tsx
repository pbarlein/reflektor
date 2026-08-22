import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { tjenester } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tjenester.map((tjeneste) => ({ slug: tjeneste.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tjeneste = tjenester.find((t) => t.slug === slug);
  if (!tjeneste) return {};
  return { title: tjeneste.navn, description: tjeneste.ingress };
}

export default async function TjenesteSide({ params }: Props) {
  const { slug } = await params;
  const tjeneste = tjenester.find((t) => t.slug === slug);
  if (!tjeneste) notFound();

  return (
    <article className="py-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
          {tjeneste.navn}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet text-pretty">
          {tjeneste.ingress}
        </p>
        {/* TODO: brødtekst, prispakker, referanser og CTA – avventer budskapsplattform */}
      </Container>
    </article>
  );
}
