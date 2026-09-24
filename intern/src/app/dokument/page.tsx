import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Malminiatyr } from "@/components/Malminiatyr";
import { MALER } from "@/content/maler";
import { FASER } from "@/content/maltype";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Lag dokument" };

/**
 * Oversikten over maler.
 *
 * KORTENE VISER FORMEN PÅ DOKUMENTET. Et navn alene svarer ikke på «er det
 * denne jeg skal ha?» — en miniatyr av arket gjør det på et halvt sekund,
 * særlig for den som har sendt dokumentet før og husker hvordan det så ut.
 *
 * Hvert kort sier også hvem som vanligvis lager det og når. Det er den
 * informasjonen som avgjør om malen angår deg i det hele tatt.
 *
 * ── GRUPPERT ETTER FASE, IKKE LISTET FLATT ────────────────────────────────
 *
 * Åtte kort på rad er åtte valg. Tre bolker med to til tre kort i hver er
 * ett valg og så ett til, og du vet allerede hvilken bolk du er i: du står
 * enten foran opptaket, på det, eller etter det.
 *
 * Grupperingen er også grensen. Passer et dokument ikke inn i «før, på
 * eller etter opptak», er det ikke et produksjonsdokument, og da skal det
 * ikke lages her. Avtaler, tilbud og pris eies av daglig leder.
 */
export default async function Dokumenter() {
  await krevBruker();

  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-12">
        <p className="font-sans text-xs font-medium tracking-[0.12em] text-aksent-tekst uppercase">
          Lag dokument
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(1.875rem,4.4vw,3rem)] tracking-[-0.02em]">
          Velg malen, fyll ut skjemaet, få dokumentet
        </h1>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
          Skjemaet samler det dokumentet faktisk trenger, og setter det sammen
          med Reflektors standard til én instruks du gir til Claude. Forskjellen
          på et brukbart og et ubrukelig dokument er sjelden formuleringene —
          det er at noen glemte publiseringsmåneden.
        </p>

        {FASER.map((fase) => {
          const iFasen = MALER.filter((m) => m.fase === fase);
          if (!iFasen.length) return null;
          return (
            <section key={fase} className="mt-12 sm:mt-14">
              <h2 className="border-b border-kant-regel pb-3 font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                {fase}
              </h2>
              <ul className="mt-7 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {iFasen.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/dokument/${m.slug}`}
                      className="group block rounded-flate focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksent"
                    >
                      {/*
                        Miniatyren beskjæres i toppen av arket. Et helt A4 i
                        et kort blir frimerkestort; den øverste tredjedelen
                        er der formen faktisk leses.
                      */}
                      <div className="aspect-[4/3] overflow-hidden rounded-flate border border-kant bg-white transition-[border-color,transform] group-hover:-translate-y-0.5 group-hover:border-kant-sterk motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                        <div className="h-[178%] w-full">
                          <Malminiatyr skisse={m.skisse} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-[1.25rem] tracking-[-0.015em] transition-colors group-hover:text-aksent-tekst motion-reduce:transition-none">
                        {m.navn}
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                        {m.kort}
                      </p>
                      <p className="mt-2.5 text-[0.8125rem] text-blekk-svak">
                        {m.ansvarlig} · {m.naar}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className="mt-14 max-w-[62ch] border-t border-kant-regel pt-5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-svak">
          Malene dekker produksjonen, og bare den. Kundeavtaler, tilbud,
          oppdragsbekreftelser og honorar lages ikke her — de eies og signeres
          av daglig leder, og vilkårene står i tjenesteavtalen. Trenger du noe
          av det, er det Pål du skal snakke med, ikke et skjema.
        </p>
      </div>
    </Container>
  );
}
