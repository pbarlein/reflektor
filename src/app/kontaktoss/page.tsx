import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { BrodsmuleSchema } from "@/components/Schema";
import { site, tilbud } from "@/content/site";
import { basisUrl } from "@/lib/miljo";

/**
 * /kontaktoss
 *
 * DENNE SIDEN HADDE IKKE SKJEMA. Funnet 21.09.2026 under sluttkontrollen:
 * tre ord i `main`, en overskrift og en e-postadresse. TODO-en i den gamle
 * fila sa det rett ut — «skjema. Innsending må utløse takk_page_view på
 * /takk – det er hendelsen GA4 og Google Ads måler leads på.»
 *
 * Det er den verste varianten av en mangel som finnes i dette prosjektet:
 * `/kontaktoss` er navngitt i AGENTS.md som en live side det annonseres
 * mot. Betalt trafikk landet på en side uten det ene elementet som gjør
 * den til noe annet enn en blindvei.
 *
 * SAMME SKJEMA, SAMME STRØM. `side`-propen registrerer hvor leadet kom
 * fra, og innsendingen går gjennom /api/skjema med 303 til /takk — den
 * verifiserte veien som bærer 107+ historiske konverteringer. Ingen ny
 * strøm er laget, og ingen sporing er rørt.
 */
export const metadata: Metadata = {
  title: "Kontakt oss | Reflektor",
  description:
    "Ta kontakt med Reflektor. Skriv kort om bedriften, så får dere et forslag tilbake innen tre virkedager. Uforpliktende.",
  alternates: { canonical: `${basisUrl()}/kontaktoss` },
};

export default function KontaktOss() {
  return (
    <>
      <BrodsmuleSchema
        ledd={[{ navn: "Hjem", sti: "/" }, { navn: "Kontakt oss" }]}
      />

      <section id="kontakt" className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <Container>
          <Eyebrow>Kontakt</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
            Se hva vi ville filmet hos dere
          </h1>
          <p className="mt-8 max-w-2xl border-l-2 border-aksent pl-6 text-lg leading-relaxed text-pretty sm:pl-8 sm:text-xl">
            Dere får et forslag til hvordan en måned med Reflektor kan se ut
            hos dere, innen {tilbud.strategiforslagVirkedager} virkedager. Vi
            holder til i Oslo og jobber i hele Norge.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <Merkelapp som="h2">Reflektor AS</Merkelapp>
              <div className="mt-5 grid gap-1 text-blekk-dempet">
                <p>{site.kontakt.adresse}</p>
                <p className="mt-3">
                  <a
                    href={`mailto:${site.kontakt.epost}`}
                    className="inline-flex min-h-6 items-center underline underline-offset-2 hover:text-aksent-tekst"
                  >
                    {site.kontakt.epost}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
                    className="inline-flex min-h-6 items-center underline underline-offset-2 hover:text-aksent-tekst"
                  >
                    {site.kontakt.telefon}
                  </a>
                </p>
              </div>

              <Merkelapp som="h2" className="mt-12 block">
                Hva skjer etterpå
              </Merkelapp>
              <ol className="mt-5 grid gap-4 text-blekk-dempet">
                <li className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 font-[family-name:var(--font-display-serif)] text-aksent-tekst"
                  >
                    1
                  </span>
                  <span className="leading-relaxed text-pretty">
                    Dere skriver kort om bedriften og hva dere vil oppnå.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 font-[family-name:var(--font-display-serif)] text-aksent-tekst"
                  >
                    2
                  </span>
                  <span className="leading-relaxed text-pretty">
                    Innen {tilbud.strategiforslagVirkedager} virkedager får
                    dere et konkret forslag — ikke en generisk presentasjon.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 font-[family-name:var(--font-display-serif)] text-aksent-tekst"
                  >
                    3
                  </span>
                  <span className="leading-relaxed text-pretty">
                    Så tar vi en uforpliktende prat om det. Dere bestemmer.
                  </span>
                </li>
              </ol>
            </div>

            <div className="rounded-flate bg-dyp p-6 sm:p-8">
              <div className="rounded-flate bg-flate p-6 text-blekk sm:p-8">
                <Kontaktskjema side="/kontaktoss" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
