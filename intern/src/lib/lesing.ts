import type { Rubrikk } from "@/content/rubrikktype";

/**
 * Lesestatus: hvilke rubrikker den ansatte har lest.
 *
 * ── HVORFOR INFORMASJONSKAPSEL OG IKKE localStorage ───────────────────────
 *
 * Forsiden viser rundt femti kort. Lå statusen i localStorage, måtte hvert
 * kort tegnes «ulest» først og rettes etter at siden var lastet — femti
 * merker som popper inn et halvt sekund for sent. Med en kapsel leser
 * serveren statusen FØR den tegner, og første bilde er riktig.
 *
 * ── HVORFOR BITMASKE ──────────────────────────────────────────────────────
 *
 * En kapsel sendes med hver eneste forespørsel, også bilder og video. Femti
 * slugger er rundt 1 200 byte per forespørsel. Femti bit er sju.
 *
 * ── HVA DETTE IKKE ER ─────────────────────────────────────────────────────
 *
 * Det er ikke en kvitteringsordning. Statusen ligger i den ansattes egen
 * nettleser, den sendes ikke noe sted, og ingen kan slå opp hvem som har
 * lest hva. Det er et verktøy for den enkelte, ikke et kontrolltiltak.
 *
 * Konsekvensen er at status følger nettleseren, ikke personen: ny maskin
 * eller privat vindu gir blanke ark. For et framdriftsverktøy er det en
 * grei avveining. Skal det bli en kvittering Pål kan slå opp i, kreves en
 * database og en helt annen samtale om personvern.
 *
 * ── DENNE FILA ER FRI FOR SERVERKODE, OG MÅ FORBLI DET ────────────────────
 *
 * Både forsiden (server) og lesesporingen (klient) bruker de samme
 * funksjonene. Første utgave la `cookies()` fra next/headers her, og da
 * feilet byggen: klientkomponenten dro med seg et server-API inn i
 * nettleserpakken. Serversiden bor i lesing-server.ts.
 */
export const LEST_KAPSEL = "intern_lest";

/** Ett år. Statusen er verdiløs hvis den nullstilles hver måned. */
export const LEST_LEVETID = 60 * 60 * 24 * 365;

/**
 * Terskelen for å regne noe som NYTT.
 *
 * Fjorten dager, OG ikke lest. Ingen tidsstempler å holde styr på: «ny»
 * forfaller av seg selv, og har du lest den, er den ikke ny for deg lenger.
 */
export const NY_I_DAGER = 14;

/**
 * Over denne grensen slutter vi å merke noe som nytt.
 *
 * Dette er ikke en detalj, det er hele forskjellen på et signal og et
 * bakteppe. Retningslinjene til PatternFly sier det rett ut: en
 * uleste-markør skal bare brukes når det som kommer inn er sjeldent — er
 * det uleste der mesteparten av tiden, mister markøren virkningen og blir
 * bare forstyrrende.
 *
 * Huben ble skrevet i én omgang. Alt er oppdatert samme dag, og femti
 * NY-merker hadde ikke pekt noen vei. Så: er det flere enn fem nye, viser
 * vi ingen. Retningen ligger i «Start her» i stedet. Når huben har satt
 * seg og det kommer én ny rubrikk i uka, slår merket seg på av seg selv.
 */
export const NY_MAKS = 5;

/** Leser bitmasken ut av kapselverdien. Ugyldig verdi gir tomt sett. */
export function lesMaske(verdi: string | undefined): Set<number> {
  const ut = new Set<number>();
  if (!verdi) return ut;
  try {
    const b64 = verdi.replace(/-/g, "+").replace(/_/g, "/");
    const raa = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="));
    for (let i = 0; i < raa.length; i++) {
      const byte = raa.charCodeAt(i);
      for (let bit = 0; bit < 8; bit++) {
        if (byte & (1 << bit)) ut.add(i * 8 + bit + 1);
      }
    }
  } catch {
    /*
     * En ødelagt kapsel skal ikke velte forsiden. Verste utfall er at
     * noen ser lesestatusen sin nullstilt — irriterende, ikke kritisk.
     */
    return new Set();
  }
  return ut;
}

/** Skriver et sett med `nr` til kapselverdien. */
export function skrivMaske(nr: Iterable<number>): string {
  const tall = [...nr].filter((n) => Number.isInteger(n) && n > 0);
  if (tall.length === 0) return "";
  const byte = new Uint8Array(Math.ceil(Math.max(...tall) / 8));
  for (const n of tall) byte[(n - 1) >> 3] |= 1 << ((n - 1) & 7);
  let s = "";
  for (const b of byte) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Er rubrikken oppdatert innenfor NY_I_DAGER, regnet fra `naa`? */
export function erFersk(rubrikk: Rubrikk, naa: Date): boolean {
  const dager =
    (naa.getTime() - new Date(rubrikk.oppdatert).getTime()) / 86_400_000;
  return dager >= 0 && dager <= NY_I_DAGER;
}

export type Lesetilstand = "lest" | "ny" | "ulest";

/**
 * Tilstanden til hvert kort, avgjort ett sted.
 *
 * Regnes for HELE samlingen på én gang, og ikke per kort, nettopp fordi
 * NY_MAKS er en egenskap ved samlingen: om ett kort skal merkes nytt,
 * avhenger av hvor mange andre som også er det.
 */
export function lesetilstander(
  rubrikker: readonly Rubrikk[],
  lest: Set<number>,
  naa: Date,
): Map<string, Lesetilstand> {
  const ferske = rubrikker.filter((r) => !lest.has(r.nr) && erFersk(r, naa));
  const visNy = ferske.length > 0 && ferske.length <= NY_MAKS;
  const nye = new Set(visNy ? ferske.map((r) => r.slug) : []);

  return new Map(
    rubrikker.map((r) => [
      r.slug,
      lest.has(r.nr) ? "lest" : nye.has(r.slug) ? "ny" : "ulest",
    ]),
  );
}

/**
 * Rekkefølgen pensum vises i.
 *
 * ── DEN ERSTATTET «ÉN ANBEFALING» ─────────────────────────────────────────
 *
 * Før pekte forsiden ut ÉN rubrikk å lese nå, og skjulte de femten andre.
 * Nå vises hele pensum som en rekke, og da er spørsmålet ikke «hvilken én»,
 * men «hvilken rekkefølge».
 *
 * ── ULESTE FØRST VAR FEIL, OG DET BLE SYNLIG FØRST I NETTLESEREN ──────────
 *
 * Første utgave sorterte uleste foran leste. Begrunnelsen var god på papiret
 * — rekka skal vise hva som gjenstår. I praksis gjorde den to skader:
 *
 *   1. DE LESTE FORSVANT UT AV SYNET. Med tre leste og tretten uleste lå
 *      alle de tre bak en rulling, og rekka så ut som om ingenting var
 *      gjort. Det bestilte var tydelig merking av BÅDE lest og ulest;
 *      sorteringen gjorde den ene av dem usynlig.
 *   2. KORTENE FLYTTET PÅ SEG. Dette er en startside folk ser hver dag.
 *      Leser du én rubrikk, stokker hele rekka om seg neste morgen, og
 *      kortet som lå som nummer fire ligger et annet sted. Et grensesnitt
 *      man bruker daglig, belønner at ting ligger der de lå.
 *
 * Rekkefølgen er derfor redaksjonell og STABIL. Framdriften leses av at
 * leste kort er dempet og merket — altså av innholdet, ikke av at det har
 * flyttet seg.
 *
 *   1. FREMHEVET FØRST. Noen har bestemt at den gjelder nå.
 *   2. DERETTER PRIORITET, den redaksjonelle rangeringen som allerede
 *      finnes på hver rubrikk.
 *   3. `nr` som siste ledd, så to like prioriteter ikke bytter plass
 *      mellom to lastinger.
 *
 * `lest` er ikke lenger et argument. Signaturen beholder det ikke «for
 * sikkerhets skyld» — en parameter som ikke brukes, er en invitasjon til å
 * ta den i bruk igjen uten å lese dette.
 */
export function pensumrekkefolge(rubrikker: readonly Rubrikk[]): Rubrikk[] {
  return [...rubrikker].sort((a, b) => {
    const aFrem = a.fremhevet ? 1 : 0;
    const bFrem = b.fremhevet ? 1 : 0;
    if (aFrem !== bFrem) return bFrem - aFrem;

    if (a.prioritet !== b.prioritet) return b.prioritet - a.prioritet;
    return a.nr - b.nr;
  });
}
