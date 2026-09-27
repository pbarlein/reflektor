import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Malvelger, type Malrad } from "@/components/Malvelger";
import { MALER } from "@/content/maler";
import { FASER } from "@/content/maltype";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Lag dokument" };

/**
 * Oversikten over maler.
 *
 * ── DETTE ER ET VERKTØY, IKKE EN UTSTILLING ───────────────────────────────
 *
 * Siden var et rutenett med miniatyrer av arkene. Den ble revet 27.09.2026:
 * «jeg synes thumbnailene er stygge og tar mye plass på skjermen».
 *
 * Kritikken traff noe mer enn utseendet. Miniatyrene tegnes av `skisse`, og
 * sju av åtte maler begynner med de samme delene. Åtte kort viste dermed i
 * praksis det samme bildet åtte ganger, mens de tok 180 piksler hver og
 * dyttet siden opp i 2 529 piksler — to og en halv skjerm for åtte valg.
 * Det største elementet på hvert kort bar minst informasjon.
 *
 * En produsent kommer ikke hit for å bli inspirert. Hen vet hva hen skal
 * lage, og skal dit. Derfor er alt synlig på én skjerm nå, og derfor kan
 * hele valget tas fra tastaturet. Se `Malvelger` for hvorfor det er formen.
 *
 * ── GRUPPERINGEN BLE BEHOLDT ──────────────────────────────────────────────
 *
 * Åtte rader på rad er åtte valg. Tre bolker er ett valg og så ett til, og
 * du vet allerede hvilken bolk du er i: du står enten foran opptaket, på
 * det, eller etter det.
 *
 * Grupperingen er også grensen. Passer et dokument ikke inn i «før, på
 * eller etter opptak», er det ikke et produksjonsdokument, og da skal det
 * ikke lages her. Avtaler, tilbud og pris eies av daglig leder.
 */
export default async function Dokumenter() {
  await krevBruker();

  /*
   * Bare det raden viser sendes over til klienten. `MALER` bærer også
   * felter, struktur, regler og eksempler — flere titalls kilobyte som
   * ingen på denne siden skal bruke til noe.
   */
  const rader: Malrad[] = MALER.map((m) => ({
    slug: m.slug,
    navn: m.navn,
    kort: m.kort,
    ansvarlig: m.ansvarlig,
    naar: m.naar,
    fase: m.fase,
  }));

  return (
    <Container>
      <div className="pt-8 pb-16 sm:pt-12">
        {/*
          ── TO GREP OM PLASSEN ────────────────────────────────────────────

          BREDDEN: containeren er 1180 piksler, riktig for en artikkel og
          altfor bredt for en rad med et navn og en rolle. Uten taket blir
          det en håndsbredd tomrom midt i hver rad.

          TOPPEN: overskriften sendes INN i velgeren, slik at søkefeltet kan
          stå på samme linje. Den gamle toppen var en overskrift på tre
          linjer og fire linjer brødtekst, og kostet 363 piksler før første
          mal. På en laptopskjerm er det nesten halve høyden brukt på å si
          hva siden heter — på et verktøy man åpner ukentlig, er det den
          dårligste bruken av den mest verdifulle plassen som finnes.
        */}
        <div className="max-w-[58rem]">
          <Malvelger maler={rader} faser={FASER}>
            <p className="font-sans text-xs font-medium tracking-[0.12em] text-aksent-tekst uppercase">
              Lag dokument
            </p>
            <h1 className="mt-2.5 text-[clamp(1.75rem,3.4vw,2.5rem)] tracking-[-0.02em]">
              Velg mal
            </h1>
            {/*
              ── HVA DENNE LINJA SKAL GJØRE ────────────────────────────────

              Den skal si hva verktøyet gjør, til en som ikke har brukt det
              før. Ikke noe mer.

              Forrige utgave lød: «Skjemaet samler det dokumentet faktisk
              trenger, så ingen glemmer publiseringsmåneden.» Den var halen
              av en lengre tanke — at et dokument sjelden feiler på språket,
              men på en manglende opplysning, og at publiseringsmåneden er
              én slik. Da toppen ble kortet ned, ble eksempelet stående og
              resonnementet borte, og igjen sto en setning som så ut til å
              si at skjemaet finnes for å huske én bestemt måned.

              Lærdommen er ikke «skriv lengre». Den er at når man korter
              ned, er det premisset som må overleve, ikke eksempelet.
            */}
            <p className="mt-2 max-w-[54ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
              Du velger mal, fyller ut skjemaet, og får en ensider du kan sende.
              Skjemaet spør om alt dokumentet trenger, så ingenting blir glemt.
            </p>
          </Malvelger>
        </div>

        <p className="mt-12 max-w-[62ch] border-t border-kant-regel pt-5 text-[0.9375rem] leading-relaxed text-pretty text-blekk-svak">
          Malene dekker produksjonen, og bare den. Kundeavtaler, tilbud,
          oppdragsbekreftelser og honorar lages ikke her — de eies og signeres
          av daglig leder, og vilkårene står i tjenesteavtalen. Trenger du noe
          av det, er det Pål du skal snakke med, ikke et skjema.
        </p>
      </div>
    </Container>
  );
}
