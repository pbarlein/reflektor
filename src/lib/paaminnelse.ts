/**
 * Når går påminnelsen ut?
 *
 * BAKGRUNN. HubSpot-arbeidsflyten «Lead-oppfølging – presentasjon og
 * booking» (ID 5034704077, slått på av Cowork 03.10.2026) sender én e-post
 * med Canva-presentasjon og bookinglenke med én gang et lead kommer inn, og
 * EN PÅMINNELSE neste hverdag kl. 09:00. Pål skal se tidspunktet i varselet
 * sitt, så han vet hvor lang tid han har på å ringe først.
 *
 * REGELEN, slik arbeidsflyten faktisk er satt opp: vent til første midnatt,
 * vent så til nærmeste man–fre kl. 09:00. I praksis:
 *
 *   mandag–torsdag  → dagen etter kl. 09:00
 *   fredag–søndag   → mandag kl. 09:00
 *
 * HELLIGDAGER TELLES IKKE. Arbeidsflyten kjenner ikke norske røde dager, og
 * denne funksjonen skal si det samme som arbeidsflyten gjør — ikke det som
 * hadde vært riktigst. Et tidspunkt som avviker fra virkeligheten er verre
 * enn ingen opplysning.
 *
 * ALT REGNES I EUROPE/OSLO, uansett hvor serveren står. Vercel kjører i UTC,
 * og et lead som kommer inn 23:30 norsk tid på en torsdag er fortsatt torsdag
 * — selv om klokka i funksjonen sier fredag 21:30. Derfor leses både dato,
 * ukedag og klokkeslett gjennom `Intl` med eksplisitt tidssone, og ikke med
 * `getDay()` på en Date.
 */

const SONE = "Europe/Oslo";

/** Navnet på informasjonskapselen som gir tilgang til oversiktssiden. */
export const PAAMINNELSE_KAPSEL = "rfl_paaminnelse";

/** Delene av et tidspunkt, slik de ser ut i Oslo. */
function osloDeler(t: Date): {
  ar: number;
  maned: number;
  dag: number;
  time: number;
  minutt: number;
  ukedag: number; // 0 = søndag, som Date.getDay()
} {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: SONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(t);
  const les = (type: string) => f.find((d) => d.type === type)?.value ?? "";
  const uke = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    ar: +les("year"),
    maned: +les("month"),
    dag: +les("day"),
    // 24:00 finnes i noen implementasjoner; midnatt skal leses som 0.
    time: +les("hour") % 24,
    minutt: +les("minute"),
    ukedag: uke.indexOf(les("weekday")),
  };
}

/**
 * Tidspunktet som svarer til en veggklokke i Oslo.
 *
 * HVORFOR DET MÅ GJØRES SLIK. JavaScript kan lage en Date fra lokal tid i
 * nettleserens sone eller i UTC — ikke i en vilkårlig sone. Så vi gjetter
 * UTC, leser av hvilken veggklokke gjetningen gir i Oslo, og flytter
 * gjetningen med differansen. To runder holder alltid: forskjellen mellom
 * sommer- og vintertid er én time, og en justering på én time kan i verste
 * fall lande i en ny sone-overgang én gang til.
 *
 * SISTE HELG I OKTOBER er grunnen til at dette ikke kan forenkles. Natt til
 * 25.10.2026 stilles klokka tilbake, og et lead sendt lørdag 24. får en
 * påminnelse mandag 26. kl. 09:00 — som er et annet antall timer unna enn
 * det samme tilfellet uken før.
 */
function osloTidspunkt(
  ar: number,
  maned: number,
  dag: number,
  time: number,
  minutt: number,
): Date {
  let t = Date.UTC(ar, maned - 1, dag, time, minutt);
  for (let i = 0; i < 3; i++) {
    const d = osloDeler(new Date(t));
    const avvik =
      (Date.UTC(d.ar, d.maned - 1, d.dag, d.time, d.minutt) -
        Date.UTC(ar, maned - 1, dag, time, minutt)) /
      60000;
    if (avvik === 0) break;
    t -= avvik * 60000;
  }
  return new Date(t);
}

/**
 * Når påminnelsen går ut for et lead sendt inn på `sendt`.
 *
 * Returnerer et eksakt tidspunkt, ikke en tekst, fordi oversiktssiden må
 * kunne sammenligne det med nå for å skjule påminnelser som allerede er
 * sendt.
 */
export function paaminnelseTidspunkt(sendt: Date): Date {
  const d = osloDeler(sendt);

  // Første midnatt: alltid dagen etter innsendingsdagen i Oslo.
  let ar = d.ar;
  let maned = d.maned;
  let dag = d.dag + 1;

  // Normaliser over månedsskifte ved å gå veien om UTC.
  const neste = new Date(Date.UTC(ar, maned - 1, dag));
  ar = neste.getUTCFullYear();
  maned = neste.getUTCMonth() + 1;
  dag = neste.getUTCDate();

  // Så fram til nærmeste hverdag: lørdag → +2, søndag → +1.
  const ukedag = neste.getUTCDay();
  const fram = ukedag === 6 ? 2 : ukedag === 0 ? 1 : 0;
  if (fram) {
    const hverdag = new Date(Date.UTC(ar, maned - 1, dag + fram));
    ar = hverdag.getUTCFullYear();
    maned = hverdag.getUTCMonth() + 1;
    dag = hverdag.getUTCDate();
  }

  return osloTidspunkt(ar, maned, dag, 9, 0);
}

/**
 * «mandag 5. oktober kl. 09:00» — slik Pål skal lese det.
 *
 * Små bokstaver og uten år, bestilt 04.10.2026. Klokkeslettet står fast som
 * 09:00 fordi arbeidsflyten gjør det, men det formateres likevel fra
 * tidspunktet: står det en gang feil, skal det være synlig her og ikke
 * skjult bak en hardkodet streng.
 */
export function paaminnelseTekst(sendt: Date): string {
  return osloTekst(paaminnelseTidspunkt(sendt));
}

/**
 * «torsdag 16. oktober kl. 09:00» — et tidspunkt slik Pål skal lese det.
 *
 * Samme form overalt. Her sto formateringen inne i `paaminnelseTekst` og
 * gjaldt bare påminnelsen; fra 04.10.2026 skal også møtetidspunktet i
 * varselet skrives likt, og da kan det ikke være to utgaver av samme
 * format som kan gli fra hverandre.
 */
export function osloTekst(t: Date): string {
  const dato = new Intl.DateTimeFormat("nb-NO", {
    timeZone: SONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(t);
  const klokke = new Intl.DateTimeFormat("nb-NO", {
    timeZone: SONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(t);
  return `${dato} kl. ${klokke}`;
}

/**
 * Får denne adressen i det hele tatt påminnelse?
 *
 * Arbeidsflyten hopper over alle @reflektor.no-adresser, og da skal
 * varselet heller ikke love en påminnelse som aldri kommer. Interne
 * testinnsendinger er nettopp de som ellers ville fått Pål til å tro at
 * oppfølgingen virket.
 */
export function faarPaaminnelse(epost: string): boolean {
  return !epost.trim().toLowerCase().endsWith("@reflektor.no");
}
