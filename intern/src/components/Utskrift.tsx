import { BUNNLINJE } from "@/content/firma";
import { Markdown } from "@/components/Markdown";

/**
 * Arket som kommer ut av skriveren — eller ut som PDF.
 *
 * ── HVORFOR DETTE ER EN EGEN VISNING ──────────────────────────────────────
 *
 * Skjermversjonen ligger i en boks med egen rulling, ved siden av et skjema,
 * i en side med toppfelt og bunnfelt. Ingenting av det skal være med på et
 * ark som sendes til en kunde.
 *
 * Alternativet — å style om skjermversjonen for print — gjør begge deler
 * halvveis. Dokumentet skal ha sitt eget hode, sin egen bunnlinje og sine
 * egne sideskift. Det er et annet dokument, ikke den samme siden i en annen
 * farge.
 *
 * ── HVORFOR NETTLESERENS EGEN PDF, OG IKKE ET BIBLIOTEK ───────────────────
 *
 * Et PDF-bibliotek på serveren måtte hatt fontene lagt ved, tegnet tabellene
 * selv, og regnet ut sideskift på egen hånd. Nettleseren gjør alt det
 * allerede, med nøyaktig de fontene siden bruker, og den gjør det gratis.
 *
 * Prisen er ett ekstra trykk: brukeren må velge «Lagre som PDF» i
 * utskriftsdialogen. Det er billigere enn et bibliotek som gir en PDF som
 * ligner, men ikke er, Reflektors typografi.
 *
 * ── HVORFOR HODET ER LYST ─────────────────────────────────────────────────
 *
 * Produksjonsplanen i Dropbox har mørk topp. Den er laget for skjerm. Et ark
 * med heldekkende mørk topp kommer ut hvitt hos alle som ikke har skrudd på
 * bakgrunnsgrafikk — og det er standardinnstillingen. En aksentstrek og
 * merket i svart kommer ut riktig overalt, og det er samme oppskrift som
 * tjenesteavtalene bruker.
 */
export function Utskrift({
  kilde,
  tittel,
  kunde,
  dato,
}: {
  kilde: string;
  tittel: string;
  kunde?: string;
  dato: string;
}) {
  return (
    <div className="utskrift" aria-hidden>
      <header className="utskrift-hode">
        <div className="utskrift-strek" />
        <div className="utskrift-rad">
          {/*
            `img` og ikke `next/image`. Utskriftsmotoren tegner det som
            allerede ligger i dokumentet; en komponent som laster bildet på
            nytt når det kommer i syne, rekker ikke å laste før arket er
            tegnet, og da står merket tomt på PDF-en.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merke/reflektor-ikon.svg"
            alt=""
            width={555}
            height={665}
            className="utskrift-merke"
          />
          <span className="utskrift-type">{tittel}</span>
          {kunde && <span className="utskrift-kunde">{kunde}</span>}
        </div>
      </header>

      <div className="utskrift-kropp">
        <Markdown kilde={kilde} />
      </div>

      <footer className="utskrift-bunn">
        <span>{BUNNLINJE}</span>
        <span>{dato}</span>
      </footer>
    </div>
  );
}
