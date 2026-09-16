/**
 * Vern for den ene ruta som tar imot data utenfra.
 *
 * `/api/skjema` er sidens eneste inngang for brukerinput, og den sender
 * e-post via en tredjepart på vår regning. Gjennomgangen 16.09.2026 fant at
 * ingenting av det som kom inn var begrenset i lengde, at innholdet gikk
 * rett inn i et e-postemne, og at ruta kunne kalles så mange ganger man
 * ville.
 *
 * Ingenting av dette var utnyttet, og ingenting av det flytter en lead. Men
 * en åpen e-postutsender på et offentlig domene er en regning og et
 * omdømme som venter på å bli brukt.
 */

/**
 * Maksimal lengde per felt, i tegn.
 *
 * Tallene er romslige for et menneske og trange for en maskin. Meldingen er
 * den eneste som trenger plass; resten er navn og kontaktinfo. Uten en
 * grense kan én POST legge flere megabyte inn i en e-post.
 *
 * Kutting, ikke avvisning: en kunde som limer inn for mye skal få
 * henvendelsen fram, ikke en feilmelding. Kuttet markeres, så vi ser det.
 */
export const FELTGRENSER = {
  navn: 120,
  epost: 254, // RFC 5321 sin øvre grense for en adresse
  bedrift: 160,
  telefon: 40,
  melding: 4000,
  side: 120,
} as const;

export type Feltnavn = keyof typeof FELTGRENSER;

/**
 * Felt der linjeskift er legitimt innhold.
 *
 * Bare meldingen. Et navn eller et telefonnummer over flere linjer er enten
 * en feil eller et forsøk.
 */
const FLERLINJET: ReadonlySet<Feltnavn> = new Set(["melding"]);

/**
 * Renser én verdi fra skjemaet.
 *
 * KONTROLLTEGN FJERNES. De har ingen plass i et navn eller et emnefelt, og
 * CR/LF i en e-postheader er den klassiske injeksjonsvektoren. Resend tar
 * imot JSON og setter headerne selv, så vektoren er lukket der også — men
 * vi skal ikke være avhengige av at en tredjepart gjør jobben vår.
 *
 * `\p{Cc}` er Unicode-kategorien for kontrolltegn. Den er valgt framfor et
 * eksplisitt tegnområde fordi et slikt område må skrives med bokstavelige
 * kontrolltegn eller escape-sekvenser i kildekoden — begge deler er lette å
 * ødelegge ved en senere redigering, og feilen er usynlig i en diff.
 */
export function rens(verdi: FormDataEntryValue | null, felt: Feltnavn): string {
  const tekst = typeof verdi === "string" ? verdi : "";
  const renset = FLERLINJET.has(felt)
    ? tekst.replace(/[^\P{Cc}\n]/gu, "").trim()
    : tekst.replace(/\p{Cc}/gu, "").trim();
  const grense = FELTGRENSER[felt];
  return renset.length > grense
    ? `${renset.slice(0, grense)} […kuttet]`
    : renset;
}

/**
 * Fjerner også linjeskift. Brukes på verdier som havner i et e-postemne,
 * der et linjeskift ville delt headeren i to.
 */
export function rensEnLinje(verdi: string): string {
  return verdi.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Ser adressen ut som en e-postadresse?
 *
 * BEVISST GROV. Å validere e-post strengt er en kjent felle — gyldige
 * adresser avvises oftere enn ugyldige slipper gjennom. Denne sjekken har
 * ett formål: avgjøre om verdien er trygg å sette som `reply_to`. Er den
 * ikke det, utelates feltet, og e-posten kommer fram uansett.
 */
export function serUtSomEpost(verdi: string): boolean {
  return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(verdi) && verdi.length <= FELTGRENSER.epost;
}

/**
 * Enkel mengdebegrensning per IP.
 *
 * LES DENNE FØR DU STOLER PÅ DEN. Tilstanden ligger i minnet til én
 * lambda-instans. Vercel kjører flere instanser samtidig og resirkulerer
 * dem, så grensen er per instans og nullstilles ved kaldstart. Det stopper
 * en som spammer skjemaet fra én maskin. Det stopper ikke en fordelt flom.
 *
 * Den riktige løsningen er et delt lager — Vercel KV eller Upstash — med en
 * glidende vindusteller. Det krever en tjeneste til i oppsettet, og det er
 * Påls beslutning, ikke min. Dette er gulvet i mellomtiden, og det er høyere
 * enn ingenting.
 *
 * Kartet ryddes når det passerer MAKS_SPOR, så det kan ikke vokse fritt.
 */
const VINDU_MS = 60_000;
const MAKS_I_VINDUET = 5;
const MAKS_SPOR = 5_000;

const spor = new Map<string, number[]>();

export function foroftig(nokkel: string, na = Date.now()): boolean {
  if (spor.size > MAKS_SPOR) spor.clear();

  const tidligere = (spor.get(nokkel) ?? []).filter((t) => na - t < VINDU_MS);
  tidligere.push(na);
  spor.set(nokkel, tidligere);

  return tidligere.length > MAKS_I_VINDUET;
}

/**
 * Henter klientens IP fra proxy-headerne Vercel setter.
 *
 * `x-forwarded-for` kan forfalskes av klienten, men Vercel legger den ekte
 * adressen SIST på lista de setter. Vi tar den første, som er det vanlige —
 * og vi bruker verdien kun til mengdebegrensning, aldri til autorisasjon,
 * så et forfalsket hopp er ikke et sikkerhetsproblem. Det er en omgåelse av
 * en grense som uansett er et gulv.
 */
export function klientnokkel(headers: Headers): string {
  const videresendt = headers.get("x-forwarded-for");
  if (videresendt) return videresendt.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "ukjent";
}
