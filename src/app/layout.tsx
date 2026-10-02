import type { Metadata } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Samtykkebanner } from "@/components/Samtykke";
import { Samtykkestandard, Sporing } from "@/components/Sporing";
import { Ankerhopp } from "@/components/Ankerhopp";
import { Kildefanger } from "@/components/Kildefanger";
import { kortBeskrivelse, site } from "@/content/site";
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
  /*
   * STANDARDBESKRIVELSEN, kuttet 29.09.2026 etter teknisk gjennomgang.
   *
   * Her sto `site.ingress` rått — 238 tegn, der Google kutter ved rundt 155.
   * Forsiden og alle tjenestesidene setter sin egen, så feilen var usynlig:
   * den slo bare inn på sider som IKKE setter en, og den neste som lages
   * ville arvet den uten at noe sa fra. `/takk` gjorde det allerede.
   *
   * Ingen copy er endret. `kortBeskrivelse` kutter ved siste hele setning —
   * setningene er ordrett de samme, de siste er bare utelatt.
   */
  description: kortBeskrivelse(site.ingress),
  /*
   * DELINGSBILDET, lagt til 29.09.2026.
   *
   * Siden hadde ingen `og:image`. Deles en lenke til reflektor.no i Slack,
   * på LinkedIn, i Messenger eller i en e-post, viser flatene et kort — og
   * uten bilde blir kortet en grå boks med en URL. For et selskap som
   * selger foto og video er det den dyreste tomme plassen som finnes, og
   * den koster klikk hver eneste gang noen deler noe.
   *
   * ÉN BILDE FOR HELE NETTSTEDET, med vilje. Et bilde per side ville
   * betydd tjuefem bilder å holde i live, og gevinsten er marginal: flatene
   * viser tittelen og beskrivelsen som tekst uansett, og de er allerede
   * unike per side. Bildet skal si hvem avsenderen er, ikke hva siden
   * handler om.
   *
   * 1200×630 er formatet Facebook, LinkedIn, X og Slack alle leser. Motivet
   * er fra en av våre egne produksjonsdager, med logoen nede til venstre.
   *
   * ABSOLUTT URL KOMMER AV SEG SELV: `metadataBase` over gjør den relative
   * stien absolutt, og det er et krav — flatene henter bildet fra en annen
   * server enn leseren.
   */
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: site.navn,
    images: [
      {
        url: "/bilder/og/reflektor-og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.navn} — foto og video på månedlig basis`,
      },
    ],
  },
  /*
   * `summary_large_image` gir kortet i full bredde i stedet for en liten
   * firkant ved siden av teksten. Tittel, beskrivelse og bilde arves fra
   * `openGraph` når de ikke settes her.
   */
  twitter: { card: "summary_large_image" },
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
    /*
      `suppressHydrationWarning` gjelder KUN <html>-elementets egne
      attributter, ikke innholdet i treet. Den er nødvendig her, ikke en
      unnskyldning: samtykkeskriptet setter `data-samtykke` på <html> før
      React kjører, så klienten har et attributt serveren ikke skrev, og
      React melder det som en hydreringsfeil.

      Det er samme grunn biblioteker for mørk modus bruker den. Alternativet
      — å sette attributtet etter hydrering — ville gitt nettopp blinkingen
      hele konstruksjonen er laget for å unngå.
    */
    <html lang="nb" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${displaySerif.variable} font-sans`}
      >
        {/*
          REKKEFØLGEN HER ER HELE POENGET, og den er ikke tilfeldig.

          1. Samtykkestandard setter Consent Mode til «nektet» med et
             synkront skript i <head>. Det kjører før alt annet.
          2. GTM lastes for alle, etter punkt 1 (endret 02.10.2026, Påls
             valg) — se Sporing.tsx for hvorfor og hva det koster.
          3. Banneret rendres til slutt. Det leser bare hva skriptet i punkt
             1 allerede fant ut.

          Bytter man om på 1 og 2, rekker taggene å kjøre før samtykket er
          satt, og hele løsningen er teater. Se A42 og samtykke.ts.
        */}
        <Samtykkestandard />
        <Sporing />
        <Kildefanger />
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
        {/*
          BANNERET STÅR ETTER HOPPELENKEN, IKKE FØR. Begge deler er målt.

          Først lå det øverst i <body>. Da ble hoppelenken ikke lenger den
          første lenken på siden, og axe meldte at innhold lå utenfor et
          landemerke — fordi unntaket for hoppelenker bare gjelder når de
          faktisk kommer først. Det var ikke en teknikalitet: en
          tastaturbruker møtte banneret før muligheten til å hoppe over
          headeren.

          Så vurderte jeg å legge det sist, etter bunnteksten. Det fjerner
          bruddet, men da må man tabbe gjennom hele siden for å komme til et
          valg man skal kunne ta med én gang.

          Her, som ANDRE element, er begge deler i orden: hoppelenken er
          fortsatt først, og samtykkevalget er neste tabbestopp.
        */}
        <Samtykkebanner />
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
