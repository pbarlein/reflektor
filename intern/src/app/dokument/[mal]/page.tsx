import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Malminiatyr } from "@/components/Malminiatyr";
import { Malskjema } from "@/components/Malskjema";
import { MALER, malFraSlug } from "@/content/maler";
import { finnRubrikk } from "@/content/rubrikker";
import { krevBruker } from "@/lib/tilgang";

export function generateStaticParams() {
  return MALER.map((m) => ({ mal: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mal: string }>;
}): Promise<Metadata> {
  const { mal } = await params;
  const m = malFraSlug(mal);
  return { title: m ? m.navn : "Mal" };
}

/**
 * Én mal: skjemaet, og hva dokumentet styres av.
 *
 * RUBRIKKLENKENE ER IKKE PYNT. Reglene instruksen sender til Claude kommer
 * fra fagtekstene — «to poster i uken», «én dato, ikke et tidsrom», «lyd
 * først». Den som lurer på hvorfor malen ber om noe, skal komme til
 * begrunnelsen med ett trykk. Uten lenkene blir reglene vilkårlige påbud.
 */
export default async function Malside({
  params,
}: {
  params: Promise<{ mal: string }>;
}) {
  await krevBruker();
  const { mal: slug } = await params;
  const mal = malFraSlug(slug);
  if (!mal) notFound();

  const rubrikker = (mal.rubrikker ?? [])
    .map(finnRubrikk)
    .filter((r) => r !== undefined);

  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-10">
        <Link
          href="/dokument"
          className="inline-block rounded-interaktiv text-[0.875rem] text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none"
        >
          ← Alle maler
        </Link>

        <div className="mt-6 flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
          <div className="hidden w-[9rem] shrink-0 overflow-hidden rounded-flate border border-kant bg-white sm:block">
            <Malminiatyr skisse={mal.skisse} />
          </div>

          <div className="min-w-0">
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.02em]">
              {mal.navn}
            </h1>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
              {mal.kort}
            </p>
            <p className="mt-3 text-[0.875rem] text-blekk-svak">
              {mal.ansvarlig} · {mal.naar}
            </p>

            {rubrikker.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.875rem] text-blekk-svak">
                <span>Styres av</span>
                {rubrikker.map((r, i) => (
                  <span key={r.slug}>
                    <Link
                      href={`/rubrikk/${r.slug}`}
                      className="rounded-interaktiv text-aksent-tekst underline decoration-[rgba(192,58,28,0.35)] underline-offset-2 transition-[text-decoration-color] hover:decoration-[currentColor] motion-reduce:transition-none"
                    >
                      {r.tittel}
                    </Link>
                    {i < rubrikker.length - 1 ? " ·" : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <hr className="my-10 border-kant-regel sm:my-12" />

        <Malskjema mal={mal} />
      </div>
    </Container>
  );
}
