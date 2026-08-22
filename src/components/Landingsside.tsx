import { notFound } from "next/navigation";
import { Container } from "./Container";
import { alleLandingssider } from "@/content/site";

/**
 * Felles ramme for de kommersielle landingssidene.
 *
 * Sidene har egne rutefiler framfor én dynamisk rot-rute, fordi en [slug] på
 * rotnivå ville fanget opp alle andre URL-er.
 */
export function Landingsside({ slug }: { slug: string }) {
  const side = alleLandingssider.find((s) => s.slug === slug);
  if (!side) notFound();

  return (
    <article className="py-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
          {side.navn}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-blekk-dempet text-pretty">
          {side.ingress}
        </p>
        {/* TODO: brødtekst, tilbud, referanser og skjema-CTA.
            Teksten skal hentes fra snapshotene, ikke skrives på nytt –
            disse sidene er det aktive annonser mot. */}
      </Container>
    </article>
  );
}

export function lagMetadata(slug: string) {
  const side = alleLandingssider.find((s) => s.slug === slug);
  if (!side) return {};
  return { title: side.navn, description: side.ingress };
}
