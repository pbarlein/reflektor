import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: `Ta kontakt med ${site.navn}.`,
};

/**
 * URL-en er /kontaktoss, ikke /kontakt. Den er live i dag, og /kontakt og
 * /kontakt-oss redirigerer hit. Ikke bytt om på det (docs/kontekst.md).
 */
export default function KontaktOss() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Kontakt oss</h1>
        {/* TODO: skjema. Innsending må utløse takk_page_view på /takk – det er
            hendelsen GA4 og Google Ads måler leads på. Skjemaet er eneste
            KPI-bærende element på siden. */}
        <p className="mt-6 text-blekk-dempet">
          {site.kontakt.epost || "Kontaktinformasjon mangler – se docs/kontekst.md"}
        </p>
      </Container>
    </section>
  );
}
