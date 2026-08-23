import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sporing, GtmNoscript } from "@/components/Sporing";
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
    <html lang="no">
      <body className={`${poppins.variable} font-sans`}>
        <GtmNoscript />
        <Sporing />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
