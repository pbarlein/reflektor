import type { Metadata } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sporing, GtmNoscript } from "@/components/Sporing";
import { Ankerhopp } from "@/components/Ankerhopp";
import { site } from "@/content/site";
import { basisUrl, tillatIndeksering } from "@/lib/miljo";

// Poppins er merkevarefonten. Vektene følger manualen:
// Light 300, Regular 400, Medium 500, Bold 700, Black 900.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

/*
 * Display-snitt for H1 og H2. Beslutningen, med begrunnelse:
 *
 * Poppins er merkevarefonten og blir værende overalt kunden faktisk bruker
 * siden — navigasjon, brødtekst, knapper, skjema. Den er god på 17px.
 *
 * Men den er svak der H1 lever. Poppins er monolineær geometrisk med nesten
 * sirkulære o, e og c; ved 80–160px blir mellomrommene ujevne, og negativ
 * sporing hjelper bare delvis fordi problemet er formen, ikke avstanden.
 * Den er dessuten statisk — ingen variabel vektakse, ingen optisk størrelse,
 * ingen brøkvekter — og ligger på popularitetsrangering 5 på Google Fonts.
 *
 * Gjennomgang av produksjonskoden til toppsidene i segmentet ga ett entydig
 * mønster: sans + seriff, med seriffen som display-snitt. Alt-sans er 2020.
 *
 * Instrument Serif er høykontrast, tett og tegnet for store størrelser. Den
 * bærer en varm beige/brun palett uten å bli bryllupsinvitasjon — motgiften
 * mot spa-uttrykket er nettopp høy kontrast og negativ sporing, ikke lette
 * vekter med vid sporing.
 *
 * Kostnad: 21 kB woff2. Den har kun én vekt, og det er riktig her — et
 * høykontrast display-snitt trenger ikke fet variant i store grader.
 *
 * Designguiden er tatt i betraktning, ikke som fasit: merkevarefonten er
 * beholdt der merkevaren leses, og supplert der den ikke holder. Valget er
 * reversibelt i ett token.
 */
const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(basisUrl()),
  // Sperre mot at den nye siden indekseres før DNS peker hit.
  robots: tillatIndeksering() ? undefined : { index: false, follow: false },
  title: {
    default: `${site.navn} – strategi, innhold og publisering til fast pris`,
    template: `%s | ${site.navn}`,
  },
  description: site.ingress,
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: site.navn,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * `nb` og ikke `no`. «no» er makrospråkkoden og treffer ingen
     * orddelingsordbok i Chrome; bokmål gjør det. Skjermlesere velger også
     * riktigere stemme på `nb`.
     */
    <html lang="nb">
      <body className={`${poppins.variable} ${displaySerif.variable} font-sans`}>
        <GtmNoscript />
        <Sporing />
        <Ankerhopp />
        {/*
          Hoppelenke. WCAG 2.4.1 Bypass Blocks (nivå A) krever en mekanisme
          for å hoppe over gjentatt innhold.

          Den er IKKE først og fremst for skjermlesere. WebAIMs
          skjermleserundersøkelse #10 (1 539 svar, des. 2023–jan. 2024) viser
          at de finner fram via overskrifter (71,6 %), ikke via landemerker
          (3,7 %) eller hoppelenker. Den er for seende tastaturbrukere, som
          ellers må tabbe gjennom hele headeren på hver eneste sidelasting.

          Synlig ved fokus, skjult ellers — en permanent synlig hoppelenke er
          støy for alle andre.
        */}
        <a
          href="#hovedinnhold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-interaktiv focus:bg-aksent focus:px-4 focus:py-2.5 focus:text-[0.9375rem] focus:font-medium focus:text-[#0D0D0D]"
        >
          Hopp til innholdet
        </a>
        <Header />
        {/* tabIndex=-1 slik at hoppelenken faktisk FLYTTER fokus hit, og
            ikke bare ruller. Uten den blir neste Tab stående i headeren. */}
        <main id="hovedinnhold" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
