import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import { basisUrl, tillatIndeksering } from "@/lib/miljo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(basisUrl()),
  // Sperre mot at den nye siden indekseres før DNS peker hit.
  robots: tillatIndeksering() ? undefined : { index: false, follow: false },
  title: {
    default: `${site.navn} – ${site.tagline.toLowerCase()}`,
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
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
