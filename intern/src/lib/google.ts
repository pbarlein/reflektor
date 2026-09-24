/**
 * Google-innlogging (OpenID Connect, authorization code + PKCE).
 *
 * Intranettet er låst til Google Workspace-kontoene på @reflektor.no. Ingen
 * passord finnes i dette prosjektet — det er hele poenget med valget: slutter
 * noen, stenges Google-kontoen, og tilgangen hit forsvinner i samme
 * operasjon. Et delt passord ville overlevd oppsigelsen.
 *
 * FLYTEN, I REKKEFØLGE:
 *
 *   1. /api/auth/google       lager state + PKCE-verifiser, legger begge i
 *                             korte cookies, sender brukeren til Google
 *   2. accounts.google.com    brukeren velger konto
 *   3. /api/auth/retur        sjekker state, veksler koden mot tokens,
 *                             validerer id_token, setter sesjonscookien
 *
 * HVORFOR PKCE PÅ EN KONFIDENSIELL KLIENT. Vi har client_secret, så PKCE er
 * ikke påkrevd. Den er med fordi den lukker autorisasjonskode-injeksjon:
 * en kode som lekker gjennom en Referer, en logg eller en proxy kan ikke
 * veksles inn uten verifiseren, som aldri forlater denne serveren. OAuth 2.1
 * gjør den obligatorisk for alle klienttyper av samme grunn.
 */

const AUTORISER = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN = "https://oauth2.googleapis.com/token";

/** Utsteder-verdiene Google faktisk bruker. Begge er gyldige. */
const UTSTEDERE = ["https://accounts.google.com", "accounts.google.com"];

export type Oppsett = {
  klientId: string;
  klientHemmelighet: string;
  /** Kun @-domenet, uten krøllalfa. Alt annet avvises ved innlogging. */
  tillattDomene: string;
};

/**
 * Leser oppsettet, eller `null` når det ikke er satt.
 *
 * `null` og ikke et kast: innloggingssiden skal kunne RENDRES og fortelle
 * hva som mangler. En side som bare kaster 500 når en env-variabel ikke er
 * satt, er den mest tidkrevende måten å oppdage en manglende env-variabel
 * på.
 */
export function googleOppsett(): Oppsett | null {
  const klientId = process.env.GOOGLE_CLIENT_ID;
  const klientHemmelighet = process.env.GOOGLE_CLIENT_SECRET;
  if (!klientId || !klientHemmelighet) return null;
  return {
    klientId,
    klientHemmelighet,
    tillattDomene: process.env.TILLATT_DOMENE ?? "reflektor.no",
  };
}

/**
 * Returadressen. Utledes fra forespørselen og ikke fra en env-variabel, slik
 * at localhost, preview-deployer og produksjon virker uten hver sin
 * konfigurasjon.
 *
 * MERK at hver av dem likevel må stå som «Authorized redirect URI» i Google
 * Cloud Console — Google godtar ikke en adresse den ikke har sett før. Se
 * LES-MEG.md.
 */
export function returadresse(foresporsel: Request): string {
  return new URL("/api/auth/retur", foresporsel.url).toString();
}

function tilfeldigTekst(byte = 32): string {
  const b = crypto.getRandomValues(new Uint8Array(byte));
  let s = "";
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** PKCE-verifiseren er en tilfeldig streng; utfordringen er SHA-256 av den. */
export function lagKodeVerifiser(): string {
  return tilfeldigTekst(32);
}

export function lagState(): string {
  return tilfeldigTekst(16);
}

export async function kodeUtfordring(verifiser: string): Promise<string> {
  const sum = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifiser),
  );
  let s = "";
  for (const x of new Uint8Array(sum)) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function autorisasjonsUrl(opts: {
  oppsett: Oppsett;
  retur: string;
  state: string;
  kodeVerifiser: string;
}): Promise<string> {
  const p = new URLSearchParams({
    client_id: opts.oppsett.klientId,
    redirect_uri: opts.retur,
    response_type: "code",
    /*
     * ── GMAIL-TILGANGEN ER LESE-BARE, OG DEN ER BEGRUNNET ─────────────────
     *
     * Bestilt 24.09.2026: dokumentene skal kunne bygges på briefen kunden
     * allerede har sendt på e-post, slik at produsenten slipper å lete den
     * fram — og slik at ingenting faller ut fordi hen ikke fant den.
     *
     * `gmail.readonly` er en «restricted scope» hos Google. Den krever
     * normalt en ekstern sikkerhetsrevisjon, men ikke når OAuth-appen står
     * som Internal i et Google Workspace. Det gjør den her. Se LES-MEG.
     *
     * Det er den innloggede som leser sin EGEN postkasse med sitt eget
     * verktøy. Det er noe annet enn at arbeidsgiver leser ansattes e-post,
     * som er strengt regulert.
     */
    scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
    state: opts.state,
    code_challenge: await kodeUtfordring(opts.kodeVerifiser),
    code_challenge_method: "S256",
    /*
     * `hd` er BARE ET HINT til kontovelgeren — den forhåndsfiltrerer hvilke
     * kontoer Google tilbyr. Den er IKKE en sikkerhetsgrense: en angriper
     * kontrollerer sin egen forespørsel og kan fjerne parameteren.
     *
     * Domenesjekken som faktisk teller, skjer på `hd`-kravet i id_token
     * etter innveksling. Se `lesIdToken`.
     */
    hd: opts.oppsett.tillattDomene,
    /*
     * ── HVORFOR VI NÅ TRENGER ET REFRESH-TOKEN ────────────────────────────
     *
     * Før holdt det med innloggingen: sesjonen er vår egen cookie, og
     * Google-kontoen ble sjekket på nytt neste gang.
     *
     * Med Gmail må serveren kunne slå opp e-post MENS et dokument lages,
     * og et tilgangstoken varer en time. `access_type=offline` gir oss et
     * refresh-token vi kan veksle inn ved behov.
     *
     * `consent` er nødvendig fordi Google bare gir refresh-token når
     * brukeren faktisk får samtykkeskjermen. Uten den får den som allerede
     * har godkjent appen, ingen — og Gmail-oppslaget ville virket for nye
     * brukere og stille feilet for gamle.
     */
    access_type: "offline",
    prompt: "select_account consent",
  });
  return `${AUTORISER}?${p.toString()}`;
}

type Tokensvar = {
  id_token?: string;
  refresh_token?: string;
  access_token?: string;
  expires_in?: number;
  error?: string;
};

export type Innveksling = {
  idToken: string;
  /**
   * Finnes bare når Google faktisk viste samtykkeskjermen. Vi ber om det med
   * `prompt=consent`, men en bruker kan komme gjennom en flyt der det ikke
   * gis — og da skal Gmail-delen slå seg av, ikke krasje.
   */
  refreshToken: string | null;
};

export async function vekslInnKode(opts: {
  oppsett: Oppsett;
  kode: string;
  retur: string;
  kodeVerifiser: string;
}): Promise<Innveksling | null> {
  const svar = await fetch(TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: opts.kode,
      client_id: opts.oppsett.klientId,
      client_secret: opts.oppsett.klientHemmelighet,
      redirect_uri: opts.retur,
      grant_type: "authorization_code",
      code_verifier: opts.kodeVerifiser,
    }),
    cache: "no-store",
  });
  if (!svar.ok) return null;
  const data = (await svar.json()) as Tokensvar;
  if (!data.id_token) return null;
  return { idToken: data.id_token, refreshToken: data.refresh_token ?? null };
}

/**
 * Veksler et refresh-token mot et ferskt tilgangstoken.
 *
 * Kalles rett før et Gmail-oppslag, ikke lagret. Et tilgangstoken varer en
 * time, og å holde det i minnet mellom to forespørsler på en serverless
 * plattform er en optimalisering med null gevinst: hver forespørsel kan
 * havne i sin egen instans uansett.
 */
export async function friskTilgang(
  oppsett: Oppsett,
  refreshToken: string,
): Promise<string | null> {
  const svar = await fetch(TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: oppsett.klientId,
      client_secret: oppsett.klientHemmelighet,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!svar.ok) return null;
  const data = (await svar.json()) as Tokensvar;
  return data.access_token ?? null;
}

export type IdKrav = {
  epost: string;
  navn: string;
  bilde: string;
  domene: string;
};

/**
 * Leser kravene ut av id_token og sjekker dem.
 *
 * SIGNATUREN VERIFISERES IKKE, og det er et bevisst valg med dekning: token
 * er hentet av oss selv, direkte fra Googles token-endepunkt, over TLS.
 * OpenID Connect Core 3.1.3.7 punkt 6 sier uttrykkelig at signaturen KAN
 * hoppes over når klienten mottar token slik. Alternativet — å hente og
 * mellomlagre Googles JWKS og gjøre RS256-verifisering her — legger til et
 * nettverkskall og en nøkkelrotasjon å ta feil av, for en garanti TLS
 * allerede gir.
 *
 * Det som IKKE kan hoppes over, er kravene. Alle fire sjekkes under.
 */
export function lesIdToken(idToken: string, oppsett: Oppsett): IdKrav | null {
  const deler = idToken.split(".");
  if (deler.length !== 3) return null;

  let krav: Record<string, unknown>;
  try {
    const fylt = deler[1].replace(/-/g, "+").replace(/_/g, "/");
    const binart = atob(fylt + "=".repeat((4 - (fylt.length % 4)) % 4));
    const bytes = new Uint8Array(new ArrayBuffer(binart.length));
    for (let i = 0; i < binart.length; i++) bytes[i] = binart.charCodeAt(i);
    krav = JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }

  // 1. Utstederen må være Google.
  if (!UTSTEDERE.includes(String(krav.iss))) return null;
  // 2. Token må være utstedt til OSS, ikke til en annen app.
  if (krav.aud !== oppsett.klientId) return null;
  // 3. Den må være gyldig nå.
  if (typeof krav.exp !== "number" || krav.exp < Date.now() / 1000) return null;
  // 4. E-posten må være bekreftet av Google.
  if (krav.email_verified !== true) return null;

  const epost = String(krav.email ?? "").toLowerCase();
  if (!epost.includes("@")) return null;

  /*
   * DOMENET SJEKKES PÅ TO FELT, og begge må stemme.
   *
   * `hd` settes kun på Workspace-kontoer og er det Google garanterer. En
   * privat gmail-konto som TILFELDIGVIS har adressen
   * «reflektor.no@gmail.com» har ingen `hd` — og ville sluppet gjennom en
   * ren strengsjekk på e-posten. Motsatt: `hd` alene holder ikke hvis
   * aliaset ligger på et annet domene i samme Workspace.
   */
  const domene = String(krav.hd ?? "").toLowerCase();
  if (domene !== oppsett.tillattDomene) return null;
  if (!epost.endsWith(`@${oppsett.tillattDomene}`)) return null;

  return {
    epost,
    navn: String(krav.name ?? epost),
    bilde: typeof krav.picture === "string" ? krav.picture : "",
    domene,
  };
}
