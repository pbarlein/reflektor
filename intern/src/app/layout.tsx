import type { Metadata } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";

import "./globals.css";
import { Toppfelt } from "@/components/Toppfelt";
import { Bunnfelt } from "@/components/Bunnfelt";

/*
 * SAMME TO SNITT SOM SALGSSIDEN, og det er ikke gjenbruk for gjenbrukets
 * skyld. Bestillingen var at intranettet skal gi inntrykk av hva Reflektor
 * leverer og hvilken vibb byrået har. Et internt verktøy satt i systemfont
 * sier det motsatte av det salgssiden sier, til de samme folkene som skal
 * selge den.
 *
 * Poppins er merkevarefonten og bærer alt som leses: navigasjon, brødtekst,
 * etiketter, knapper. Instrument Serif er display-snittet for h1/h2 og de
 * store tallene — høykontrast, tett, tegnet for store grader. Begrunnelsen
 * i sin helhet står i hovedprosjektets layout.tsx.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-serif",
  display: "swap",
});

/**
 * `noindex` ER IKKE BETINGET HER, og det er forskjellen fra hovedprosjektet.
 *
 * Salgssiden har en bryter — `NEXT_PUBLIC_TILLAT_INDEKSERING` — fordi den
 * skal indekseres den dagen DNS peker dit. Intranettet skal ALDRI
 * indekseres. Da skal det heller ikke finnes en variabel som kan settes feil
 * en travel dag.
 *
 * `nosnippet` og `noarchive` i tillegg til `noindex`: en søkemotor som
 * allerede har sett en URL, kan vise et utdrag fra den selv om den ikke
 * indekseres.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  title: {
    default: "Reflektor internt",
    template: "%s | Reflektor internt",
  },
  description: "Intern hub for ansatte i Reflektor.",
};

export default function RotLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * `nb` og ikke `no`. «no» er makrospråkkoden og treffer ingen
     * orddelingsordbok i Chrome; bokmål gjør det. Skjermlesere velger også
     * riktigere stemme på `nb`.
     */
    <html lang="nb">
      <body
        className={`${poppins.variable} ${displaySerif.variable} font-sans`}
      >
        {/*
          HOPPELENKEN ER FØRSTE ELEMENT. WCAG 2.4.1 Bypass Blocks (nivå A)
          krever en mekanisme for å hoppe over gjentatt innhold, og unntaket
          for hoppelenker gjelder bare når de faktisk kommer først.

          Den er ikke først og fremst for skjermlesere — de navigerer via
          overskrifter. Den er for seende tastaturbrukere, som ellers må
          tabbe gjennom hele toppfeltet på hver sidelasting.
        */}
        <a
          href="#hovedinnhold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-interaktiv focus:bg-aksent focus:px-4 focus:py-2.5 focus:text-[0.9375rem] focus:font-medium focus:text-[color:var(--text-on-accent)]"
        >
          Hopp til innholdet
        </a>
        <Toppfelt />
        {/* tabIndex=-1 slik at hoppelenken faktisk FLYTTER fokus hit og ikke
            bare ruller. Uten den blir neste Tab stående i toppfeltet. */}
        <main id="hovedinnhold" tabIndex={-1}>
          {children}
        </main>
        <Bunnfelt />
      </body>
    </html>
  );
}
