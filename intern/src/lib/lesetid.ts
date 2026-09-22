import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Lesetid REGNES, den skrives ikke.
 *
 * Før sto tallet som et felt i hver rubrikk. Da var det riktig den dagen
 * noen satte det, og feil fra neste gang teksten ble rørt — ved forrige
 * gjennomgang lå fjorten av seksten mellom to og fire minutter for høyt.
 * Et anslag som er systematisk for høyt er verre enn ingen: den som har
 * fem minutter lar være å åpne en tekst som tar to.
 *
 * ── TALLENE, OG HVOR DE KOMMER FRA ────────────────────────────────────────
 *
 * 180 ORD I MINUTTET. Lesehastighet på skjerm oppgis ofte til 200–250, men
 * det gjelder løpende prosa man leser for å få med seg handlingen. Dette er
 * instruks man leser for å gjøre noe etterpå, på norsk, med fagord. 180 er
 * satt lavt med vilje: heller et anslag som holder enn ett som skuffer.
 *
 * 25 SEKUNDER PER EKSEMPEL. Et innebygd eksempel er en video noen faktisk
 * ser på. Å telle bare bildeteksten ville gjort de tyngste rubrikkene til
 * de raskeste.
 *
 * 4 SEKUNDER PER PUNKT. Et punkt i en sjekkliste, et steg eller en tabellrad
 * leses saksommere enn samme antall ord i et avsnitt, fordi øyet stopper
 * ved hvert. Ordene telles i tillegg; dette er bare stoppen.
 *
 * Ingen av de tre er målt på oss. De er håndverksanslag, og de er satt slik
 * at de heller bommer oppover enn nedover.
 */
const ORD_PER_MINUTT = 180;
const SEKUNDER_PER_EKSEMPEL = 25;
const SEKUNDER_PER_PUNKT = 4;

/** Minst to minutter. «1 min» leser som at teksten ikke er verdt å åpne. */
const MINSTE = 2;

export function lesetid(rubrikk: Rubrikk): number {
  let ord = 0;
  let eksempler = 0;
  let punkter = 0;

  const tell = (tekst: string) => {
    ord += tekst.trim().split(/\s+/).length;
  };

  tell(rubrikk.sammendrag);

  for (const b of rubrikk.innhold) {
    switch (b.type) {
      case "avsnitt":
      case "merknad":
      case "sitat":
      case "figur":
        tell(b.tekst);
        break;
      case "seksjon":
        tell(b.tittel);
        break;
      case "punkter":
      case "sjekkliste":
        b.punkter.forEach(tell);
        punkter += b.punkter.length;
        break;
      case "steg":
        for (const s of b.steg) {
          tell(s.tittel);
          tell(s.tekst);
        }
        punkter += b.steg.length;
        break;
      case "tabell":
        for (const rad of b.rader) rad.forEach(tell);
        punkter += b.rader.length;
        break;
      case "eksempel":
        tell(b.data.seEtter);
        eksempler += 1;
        break;
    }
  }

  const sekunder =
    (ord / ORD_PER_MINUTT) * 60 +
    eksempler * SEKUNDER_PER_EKSEMPEL +
    punkter * SEKUNDER_PER_PUNKT;

  return Math.max(MINSTE, Math.round(sekunder / 60));
}
