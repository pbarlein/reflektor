/**
 * Spam-score på en skjemainnsending.
 *
 * BAKGRUNNEN: tre falske innsendinger 10.–11.10.2026 gikk rett forbi
 * honningkrukka og fartssjekken. Botten kjører JavaScript, fyller ut de
 * synlige feltene og lar det skjulte stå tomt — nøyaktig som et menneske.
 * Kjennetegnene lå i INNHOLDET: amerikansk telefonnummer, engangsadresse,
 * et bedriftsnavn generert av et navnebibliotek («Koss - Grady»,
 * «Metz, Waelchi and Corkery»), og en melding på engelsk uten innhold.
 *
 * DERFOR EN SCORE OG IKKE EN REGEL. Hvert enkelt kjennetegn finnes på ekte
 * leads også: en norsk bedrift kan ha engelsk nettside og en kunde kan
 * skrive «Photos». Det er KOMBINASJONEN som er usannsynlig. En hard regel
 * på ett av dem ville kastet ekte henvendelser, og på en side der
 * skjemaleads er eneste KPI er det den dyreste feilen vi kan gjøre.
 *
 * FILA ER REN. Ingen nettverk, ingen DNS, ingen klokke. Oppslaget mot
 * engangslista og MX-sjekken gjøres av den som kaller og sendes inn som
 * ferdige svar — da kan hver regel testes for seg, og en DNS-feil kan
 * aldri endre utfallet uten at vi har bestemt det.
 */

/** Grensen for å bli stoppet. Under denne slippes innsendingen gjennom. */
export const BLOKKERGRENSE = 3;

/** Det som ble funnet, i klartekst til loggen og til varselet. */
export type Treff =
  | "utenlandsk-telefon"
  | "utenlandsk-ip"
  | "engangsadresse"
  | "engelsk-melding"
  | "generert-bedriftsnavn"
  | "honningkrukke";

export type Spamsvar = {
  score: number;
  treff: Treff[];
  /** `blokkert` ved score ≥ 3, `flagget` ved 1–2, ellers `ok`. */
  utfall: "ok" | "flagget" | "blokkert";
};

/**
 * Landene vi faktisk selger til. Resten koster poeng.
 *
 * IKKE «NO ALENE». En norsk kunde på ferie i Spania skal kunne sende inn
 * skjemaet, og en svensk eller dansk henvendelse er en ekte mulighet.
 * Norden gir rom for begge deler uten å åpne for alt.
 *
 * MANGLER LANDET, GIR DET NULL. Headeren settes av Vercels kant, og et
 * oppsett uten den — lokalt, eller hvis Vercel endrer noe — skal ikke
 * gjøre hver innsending mistenkelig.
 */
const HJEMLAND = new Set(["NO", "SE", "DK"]);

/**
 * Ord som i praksis bare står i en norsk setning.
 *
 * LISTA ER PÅLS SPRÅK, ikke en ordbok. «vi», «dere», «og», «til», «med»,
 * «kan», «hjelp» er ordene som går igjen i ekte henvendelser: «kan dere
 * hjelpe oss med …». Finner vi ingen av dem OG ingen æøå, er meldingen
 * nesten sikkert ikke skrevet til oss på norsk.
 */
const NORSKE_ORD = ["vi", "dere", "og", "til", "med", "kan", "hjelp"];

/** Under dette er meldingen for kort til å si noe om språket. */
const MELDINGSGRENSE = 15;

/**
 * Bedriftsnavn slik navnebiblioteker lager dem.
 *
 * «Koss - Grady» og «Metz, Waelchi and Corkery» er faker-mønstre — to
 * etternavn med bindestrek, eller tre med komma og «and». Ingen norsk
 * bedrift heter dette. Mønstrene er smale med vilje: «Bakst & Ro» og
 * «Haugland Interiør AS» treffer ikke.
 */
const GENERERTE_NAVN = [/^\S+ - \S+$/, /^\S+, \S+ and \S+$/];

/** Et norsk mobilnummer: +47/0047, eller åtte siffer som starter på 4 eller 9. */
export function norskNummer(telefon: string): boolean {
  const t = telefon.replace(/[\s\-()./]/g, "");
  if (/^(\+47|0047)/.test(t)) return true;
  return /^[49]\d{7}$/.test(t);
}

/** Melding uten et eneste norsk spor. Kort melding regnes aldri som det. */
export function utenNorsk(melding: string): boolean {
  const m = melding.trim();
  if (m.length <= MELDINGSGRENSE) return false;
  if (/[æøå]/i.test(m)) return false;
  const ord = new Set(m.toLocaleLowerCase("nb-NO").split(/[^\p{L}]+/u));
  return !NORSKE_ORD.some((o) => ord.has(o));
}

/** Ser bedriftsnavnet ut som noe et navnebibliotek fant på? */
export function generertBedrift(bedrift: string): boolean {
  const b = bedrift.trim();
  return GENERERTE_NAVN.some((m) => m.test(b));
}

/** Domenet i en e-postadresse, i små bokstaver. Tomt hvis det ikke finnes. */
export function epostdomene(epost: string): string {
  const d = epost.trim().toLocaleLowerCase("en-US").split("@")[1] ?? "";
  return d.trim();
}

export type Innsending = {
  telefon: string;
  epost: string;
  melding: string;
  bedrift: string;
  /** `x-vercel-ip-country`. Tom streng når headeren mangler. */
  land: string;
  /** Honningkrukka `firmanavn` utfylt, eller innsending under tre sekunder. */
  botAktig: boolean;
  /** Står domenet på engangslista? Avgjort av den som kaller. */
  engangsadresse: boolean;
  /**
   * Mangler domenet MX-record?
   *
   * `null` BETYR AT VI IKKE FIKK SVAR, og da gir regelen null poeng. En
   * DNS-feil er vår feil, ikke avsenderens, og skal aldri koste noen en
   * henvendelse.
   */
  manglerMx: boolean | null;
};

/**
 * Poengene, og hva de betyr.
 *
 * VEKTENE ER BESTILT AV PÅL 11.10.2026 og skal ikke justeres uten tall å
 * vise til. To poeng på de tre tunge (nummer, land, adresse), ett på de to
 * myke (språk, navn), tre på honningkrukka — som dermed blokkerer alene,
 * slik den gjorde før.
 */
export function spamScore(inn: Innsending): Spamsvar {
  const treff: Treff[] = [];
  let score = 0;

  if (inn.botAktig) {
    treff.push("honningkrukke");
    score += 3;
  }

  if (inn.telefon.trim() && !norskNummer(inn.telefon)) {
    treff.push("utenlandsk-telefon");
    score += 2;
  }

  const land = inn.land.trim().toLocaleUpperCase("en-US");
  if (land && !HJEMLAND.has(land)) {
    treff.push("utenlandsk-ip");
    score += 2;
  }

  if (inn.engangsadresse || inn.manglerMx === true) {
    treff.push("engangsadresse");
    score += 2;
  }

  if (utenNorsk(inn.melding)) {
    treff.push("engelsk-melding");
    score += 1;
  }

  if (generertBedrift(inn.bedrift)) {
    treff.push("generert-bedriftsnavn");
    score += 1;
  }

  return {
    score,
    treff,
    utfall: score >= BLOKKERGRENSE ? "blokkert" : score > 0 ? "flagget" : "ok",
  };
}
