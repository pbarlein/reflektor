/**
 * Mobilnummer og nettside: normalisering og validering.
 *
 * Lagt til 04.10.2026, da mobilnummer ble påkrevd og nettside kom inn som
 * nytt felt. Begge trenger den samme behandlingen og har den samme fellen:
 * det brukeren skriver og det systemet trenger er to forskjellige ting.
 *
 * «+47 476 05 070» er riktig å LESE. «+4747605070» er riktig å RINGE.
 * «reflektor.no» er riktig å skrive. «https://reflektor.no» er riktig å
 * lenke til. Funksjonene her gjør om det første til det andre, og de er
 * rene — ingen DOM, ingen nett — så de kan testes.
 *
 * DE BRUKES BÅDE I NETTLESEREN OG PÅ SERVEREN. Nettleseren bruker dem til
 * å gi feilmelding ved feltet mens man skriver; serveren bruker dem fordi
 * en POST kan komme fra hva som helst, og en validering som bare finnes i
 * nettleseren er ingen validering.
 */

/* ────────────────────────────── MOBILNUMMER ───────────────────────────── */

/**
 * Tegn folk faktisk skriver i et telefonnummer, og som ikke er informasjon:
 * mellomrom, bindestrek, punktum, skråstrek og parenteser.
 */
const STOY = /[\s\-.()/]/g;

export type Mobilsvar =
  | { ok: true; visning: string; lenke: string }
  | { ok: false; feil: string };

/**
 * Normaliserer et mobilnummer.
 *
 * NORSKE NUMMER FÅR FAST FORM: `+47 XXX XX XXX`. Åtte siffer, med eller
 * uten landkode, med eller uten mellomrom. `47605070`, `476 05 070`,
 * `+4747605070` og `0047 476 05 070` er det samme nummeret, og det skal
 * stå likt i e-posten uansett hvem som skrev det.
 *
 * UTENLANDSKE NUMMER MED + GODTAS SOM DE ER. Vi kan ikke gruppere sifrene i
 * et nummer vi ikke kjenner formatet på, og en gjetning som setter
 * mellomrom feil er verre enn ingen mellomrom. Sifrene beholdes, pluss
 * beholdes.
 *
 * ÅTTE SIFFER UTEN LANDKODE REGNES SOM NORSKE. Det er riktig for alle som
 * faktisk fyller ut dette skjemaet, og alternativet — å kreve +47 — ville
 * gitt en feilmelding til nordmenn som skriver nummeret sitt slik de alltid
 * gjør.
 */
export function normaliserMobil(rå: string): Mobilsvar {
  const r = (rå ?? "").trim();
  if (!r) return { ok: false, feil: "Skriv inn mobilnummeret ditt." };

  const rent = r.replace(STOY, "");

  if (!/^\+?\d+$/.test(rent)) {
    return {
      ok: false,
      feil: "Mobilnummeret kan bare inneholde tall, mellomrom og +.",
    };
  }

  // 0047 og 47 foran åtte siffer er samme landkode som +47.
  let siffer = rent.replace(/^\+/, "");
  if (siffer.startsWith("0047")) siffer = siffer.slice(4);
  else if (siffer.startsWith("47") && siffer.length === 10)
    siffer = siffer.slice(2);

  const norsk =
    !rent.startsWith("+") || rent.startsWith("+47") || rent.startsWith("+0047");

  if (norsk && siffer.length === 8) {
    const v = `${siffer.slice(0, 3)} ${siffer.slice(3, 5)} ${siffer.slice(5)}`;
    return { ok: true, visning: `+47 ${v}`, lenke: `+47${siffer}` };
  }

  /*
   * UTENLANDSK: krever + foran. Uten + vet vi ikke om «33123456» er et
   * fransk nummer eller en skrivefeil i et norsk, og å gjette ville gitt et
   * nummer Pål ikke kommer gjennom på.
   */
  if (rent.startsWith("+") && siffer.length >= 7 && siffer.length <= 15) {
    return { ok: true, visning: `+${siffer}`, lenke: `+${siffer}` };
  }

  if (norsk) {
    return {
      ok: false,
      feil: "Et norsk mobilnummer har åtte siffer. Skriv for eksempel 476 05 070.",
    };
  }
  return {
    ok: false,
    feil: "Sjekk nummeret. Utenlandske nummer må begynne med landkode, for eksempel +46.",
  };
}

/* ─────────────────────────────── NETTSIDE ─────────────────────────────── */

/**
 * E-postleverandører der domenet IKKE er bedriftens nettside.
 *
 * Listen er Påls, og den er kort med vilje: den skal fange de vanlige
 * gratisadressene, ikke være uttømmende. Treffer den ikke, fylles
 * nettsiden ut fra et domene som kanskje er feil — og det er en opplysning
 * merket «(fra e-post)», ikke en påstand.
 */
const GRATISEPOST = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.no",
  "outlook.com",
  "live.com",
  "live.no",
  "msn.com",
  "icloud.com",
  "me.com",
  "yahoo.com",
  "yahoo.no",
  "online.no",
  "frisurf.no",
  "getmail.no",
]);

export type Nettsidesvar =
  | { ok: true; url: string; vert: string }
  | { ok: false; feil: string };

/**
 * Normaliserer en nettside til `https://…`.
 *
 * FELTET ER IKKE `type="url"` I SKJEMAET, og det er grunnen til at denne
 * funksjonen finnes. `type="url"` avviser «dinbedrift.no» fordi det mangler
 * protokoll — og det er nettopp slik folk skriver en nettside. Nettleseren
 * ville gitt en feilmelding på en helt riktig adresse.
 *
 * `http://` oppgraderes til `https://`. Vi lenker til den fra en e-post, og
 * en lenke vi selv har satt sammen skal ikke peke på en ukryptert versjon.
 */
export function normaliserNettside(rå: string): Nettsidesvar {
  const r = (rå ?? "").trim();
  if (!r) return { ok: false, feil: "" };

  const uten = r.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!uten) return { ok: false, feil: "" };

  let u: URL;
  try {
    u = new URL(`https://${uten}`);
  } catch {
    return {
      ok: false,
      feil: "Sjekk adressen. Skriv den for eksempel som dinbedrift.no.",
    };
  }

  /*
   * MINSTEKRAVET er et punktum med noe på hver side og ingen mellomrom.
   * `new URL()` godtar «https://abc» — det er en gyldig URL, men ikke en
   * nettside noen har.
   */
  if (!/^[^\s.]+(\.[^\s.]+)+$/.test(u.hostname)) {
    return {
      ok: false,
      feil: "Sjekk adressen. Skriv den for eksempel som dinbedrift.no.",
    };
  }

  return { ok: true, url: u.toString().replace(/\/$/, ""), vert: u.hostname };
}

/**
 * Nettsiden utledet av e-postadressen, når feltet er tomt.
 *
 * Returnerer null for gratisadresser. «gmail.com» er ikke kundens nettside,
 * og en lenke dit i varselet ville vært støy Pål måtte lære seg å overse.
 */
export function nettsideFraEpost(epost: string): string | null {
  const deler = (epost ?? "").trim().toLowerCase().split("@");
  /*
   * NØYAKTIG ÉN KRØLLALFA, OG NOE PÅ BEGGE SIDER. «@domene.no» har et
   * domene, men ingen avsender — og uten denne sjekken ga den en nettside
   * fra en adresse som ikke finnes.
   */
  if (deler.length !== 2 || !deler[0]) return null;
  const bit = deler[1];
  if (!bit) return null;
  const domene = bit.replace(/\.$/, "");
  if (!/^[^\s.]+(\.[^\s.]+)+$/.test(domene)) return null;
  if (GRATISEPOST.has(domene)) return null;
  return `https://${domene}`;
}
