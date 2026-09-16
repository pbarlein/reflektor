import { Arbeidskolonner } from "@/components/Arbeidsbilder";
import { arbeidskolonner } from "@/content/arbeid";

/**
 * Stillbildene fra produksjonsdager.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Arbeidsrutenett() {
  return (
    <>
      {/*
      Stillbildene står nå som EGEN seksjon etter prosessblokken, ikke rett
      under klippene.

      Grunnen er rytme: reel-veggen og åtte store bilder rett etter
      hverandre ble en vegg av bildeflate uten pusterom, og leseren mistet
      argumentet mellom dem. Prosessblokken deler dem — video, tekst, foto —
      og fotonettet får da også fungere som bevis PÅ det blokken nettopp
      påsto, i stedet for som mer av det samme.

      Ingen egen overskrift, med vilje. Seksjonen er et visuelt pustehull i
      argumentet, ikke et nytt kapittel, og en overskrift ville gjort den
      til det siste.
    */}
      <section
        className="pb-28 sm:pb-36"
        aria-label="Arbeid fra produksjonsdager"
      >
        <Arbeidskolonner kolonner={arbeidskolonner} />
      </section>

      {/*
      4 · PRIS

      Prisen er kvalifiseringsøyeblikket. Den var tidligere en venstrestilt
      tekstspalte, og leste som en prisliste i stedet for som et tilbud.

      Tre grep, alle basert på at seksjonen manglet visuelt uttrykk og ikke
      informasjon:

      1. TALLET I SERIFF, i display-grad. Det var satt i Poppins fordi det
         ligger i en <p>. Et seksifret beløp i høykontrast-seriff på 8rem er
         forskjellen på at prisen leses som en opplysning og at den leses
         som et løfte. Skalakontrast er det billigste wow-grepet som finnes,
         og det eneste som ikke er dekor.

      2. ET BILDE. Seksjonen solgte en produksjonsdag uten å vise en. Bildet
         viser nettopp opptak, og står i samme rad som tallet — det binder
         prisen til det man får for den.

      3. TALLRAD. De tre tellbare størrelsene — 1 produksjonsdag, 8–10
         videoer, 2 publiseringer i uken — lå begravet i kulepunkter. De er
         tall, og tall skal se ut som tall. Verdiene leses fra `tilbud`, og
         ordene er de samme som står i den godkjente copyen.

      Tallraden ligger i venstre spalte og ikke under begge, slik at bildet
      får fylle sin spalte i full høyde. Ellers oppstår et tomrom som gjør
      at seksjonen ser uferdig ut nettopp der den skal virke mest sikker.

      Det som inngår er beholdt som bord, men nedtonet: det er
      dokumentasjon, ikke argument.
    */}
    </>
  );
}
