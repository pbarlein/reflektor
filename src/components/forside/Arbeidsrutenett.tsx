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
      Stillbildene står som EGEN seksjon mellom priskortet og kortraden for
      enkeltprosjekter, ikke rett under klippene i «Slik ser det ut».

      Grunnen er rytme: reel-veggen og åtte store bilder rett etter
      hverandre ble en vegg av bildeflate uten pusterom, og leseren mistet
      argumentet mellom dem. Et kort med tekst deler dem — video, tekst,
      foto — og fotonettet får da også fungere som bevis PÅ det kortet
      nettopp påsto, i stedet for som mer av det samme.

      KORTET OVER ER NÅ PRISEN og ikke «Slik jobber vi». Seksjonen ble lagt
      ned 02.10.2026 og priskortet flyttet inn i sluket den etterlot — se
      page.tsx. For rutenettet er det ingen forskjell: det er fortsatt et
      mørkt kort over og et lyst avsnitt under, og det er det rytmen handler
      om.

      Ingen egen overskrift, med vilje. Seksjonen er et visuelt pustehull i
      argumentet, ikke et nytt kapittel, og en overskrift ville gjort den
      til det siste.
    */}
      {/*
        LUFTA UNDER ER LIK LUFTA OVER, satt 19.09.2026 etter måling.

        Seksjonen hadde `pb-28 sm:pb-36`, altså 144 px ned til neste
        seksjon, mens kortet over slutter 80 px opp. Det er den samme
        overgangen — mørkt kort mot bilderutenett — med nesten dobbel
        avstand på den ene siden. Målt blekk til blekk på tvers av hele
        forsiden var 144 ikke det største gapet, men det var det eneste som
        sto rett overfor sin egen motsats.

        `pb-20` gir 80 px på begge sider. Rutenettet leser da som ett
        pusterom mellom to seksjoner i stedet for som en seksjon som henger
        løsere nedover enn oppover. Priskortet over har samme verdi.
      */}
      <section className="pb-20" aria-label="Arbeid fra produksjonsdager">
        <Arbeidskolonner kolonner={arbeidskolonner} />
      </section>
    </>
  );
}
