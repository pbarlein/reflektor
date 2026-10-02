import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Knappelenke } from "@/components/Knapp";

/**
 * 404-siden.
 *
 * DEN FANTES IKKE FØR 02.10.2026. Next serverte sin egen standardside, og
 * den arvet tittelmalen fra rotlayouten — altså sto det «Reflektor –
 * strategi, innhold og publisering til fast pris» i fanen på en side som
 * ikke finnes. Det er ikke bare stygt: en 404 med forsidens tittel er et
 * signal til Google om at adressen er en ekte side.
 *
 * STATUSKODEN ER 404 OG `noindex` ER SATT FRA FØR — Next gjør begge deler
 * selv for `not-found`. Det eneste som manglet var en side.
 *
 * DEN LIGGER INNE I ROTLAYOUTEN, altså med header og bunntekst. Det er
 * valget mot `global-not-found`, som ville gitt full kontroll over
 * markeringen, men uten navigasjon. Den som har havnet feil, skal ha en vei
 * videre — og de tre lenkene under er de tre veiene folk faktisk kommer
 * for.
 */
export const metadata: Metadata = {
  title: "Siden finnes ikke",
  description:
    "Adressen finnes ikke på reflektor.no. Gå til forsiden, se arbeidet vårt eller ta kontakt.",
};

export default function IkkeFunnet() {
  return (
    <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-3xl text-balance sm:text-4xl lg:text-5xl">
          Siden finnes ikke
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-pretty text-blekk-dempet">
          Adressen er enten skrevet feil, eller så er siden flyttet. Her er de
          tre stedene folk oftest skal:
        </p>

        <ul className="mt-8 grid max-w-xl gap-3">
          {[
            { sti: "/", tekst: "Forsiden: hva vi gjør og hva det koster" },
            { sti: "/vart-arbeid", tekst: "Vårt arbeid: kunder og resultater" },
            { sti: "/blogg", tekst: "Bloggen: artikler om foto, video og SoMe" },
          ].map((l) => (
            <li key={l.sti}>
              <Link
                href={l.sti}
                className="inline-flex min-h-6 items-center gap-2 text-[1.0625rem] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-aksent motion-reduce:transition-none"
              >
                {l.tekst}
                <span aria-hidden className="text-aksent">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Knappelenke href="/kontaktoss">Ta kontakt</Knappelenke>
        </div>
      </Container>
    </section>
  );
}
