import type { Metadata } from "next";

import { Container } from "@/components/Container";
import {
  personvernIngress,
  personvernSeksjoner,
  type Personvernblokk,
} from "@/content/personvern";

/**
 * /personvern — erklæringen fra dagens reflektor.no, ordrett.
 *
 * Siden var en overskrift og en TODO. En tom personvernerklæring er både et
 * juridisk hull og et tillitsproblem: den er lenket fra bunnteksten på hver
 * eneste side, og den som klikker dit er nettopp den som lurer på hva vi
 * gjør med opplysningene.
 *
 * Se personvern.ts for de tre defektene i kildeteksten som IKKE er rettet,
 * og A42 i docs/vedlegg-a.md for samtykkehullet erklæringens punkt 8 peker
 * på uten at siden har noen løsning på det.
 *
 * `robots: index: false` er beholdt fra stubben.
 */
export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik samler Reflektor AS inn og behandler personopplysninger fra skjemaer, nettsider og annonser.",
  robots: { index: false },
};

function Blokk({ blokk }: { blokk: Personvernblokk }) {
  if (blokk.type === "liste") {
    return (
      <ul className="mt-4 space-y-2 pl-5">
        {blokk.punkter.map((p) => (
          <li key={p} className="list-disc leading-relaxed text-blekk-dempet">
            {p}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="mt-4 leading-relaxed text-pretty text-blekk-dempet">
      {blokk.tekst}
    </p>
  );
}

export default function Personvern() {
  return (
    <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Container>
        {/*
          `max-w-2xl` og ikke full bredde. En erklæring på 879 ord skal ha
          lesbar linjelengde — rundt 70 tegn — og resten av siden bruker
          samme mål på løpende tekst.
        */}
        <div className="max-w-2xl">
          <h1 className="text-4xl text-balance sm:text-5xl">
            Personvernerklæring
          </h1>

          {personvernIngress.map((b, i) => (
            <Blokk key={i} blokk={b} />
          ))}

          {personvernSeksjoner.map((s) => (
            <section key={s.tittel} className="mt-12">
              <h2 className="text-xl font-medium sm:text-2xl">{s.tittel}</h2>
              {s.blokker.map((b, i) => (
                <Blokk key={i} blokk={b} />
              ))}
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
