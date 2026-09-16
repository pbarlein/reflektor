import { Logorad } from "@/components/Logorad";

/**
 * Logoraden en gang til, mellom skjemaet og bunnteksten.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Bunnlogoer() {
  return (
    <>
      {/*
      LOGORADEN EN GANG TIL, mellom skjemaet og bunnteksten. Påls
      bestilling.

      Den nederste er DEKORATIV. Den viser nøyaktig de samme elleve
      kundene som raden over arbeidsseksjonen, så informasjonen er
      allerede lest opp én gang — uten `dekorativ` ville en
      skjermleserbruker hørt alle elleve navnene to ganger på samme side
      uten å få noe nytt. Derfor heller ingen aria-label her: en
      dekorativ gjentakelse skal ikke annonseres som et landemerke.

      Nettverket merker den ikke. De 44 bildene peker på de samme elleve
      URL-ene som raden over, og de er hentet for lengst.

      Plasseringen er etter skjemaet med vilje. Alt som står FØR skjemaet
      kan trekke blikket bort fra det; det som står etter, møter bare dem
      som allerede har rullet forbi.
    */}
      {/*
      Ingen egen bunnmarg. Kontaktseksjonen over har pb-24 og bunnteksten
      har mt-24, altså 96 px på hver side. La raden også ha padding under,
      og luften ble 96 over mot 192 under — raden ville lest som en hale
      på kontaktseksjonen i stedet for å stå mellom de to.
    */}
      <Logorad dekorativ />
    </>
  );
}
