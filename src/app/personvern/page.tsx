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
 * NOINDEX ER FJERNET 29.09.2026. Her sto `robots: { index: false }`, og
 * kommentaren over sa hvorfor: «beholdt fra stubben». Det var aldri en
 * vurdering — det var en innstilling fra den gang siden var en overskrift og
 * en TODO, som fulgte med da innholdet kom.
 *
 * Nå har siden hele erklæringen. Da skal den være indekserbar: den er lenket
 * fra bunnteksten på hver eneste side, en personvernerklæring er et
 * tillitssignal både for Google og for språkmodeller som sjekker om et
 * selskap har en, og en side vi selv skjuler kan ikke svare noen som leter
 * etter den. Den er samtidig lagt inn i sitemapet.
 */
export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik samler Reflektor AS inn og behandler personopplysninger fra skjemaer, nettsider og annonser.",
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
