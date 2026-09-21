/**
 * Sesjonen: en signert cookie, ingen sesjonstabell.
 *
 * HVORFOR IKKE ET BIBLIOTEK. Auth.js/NextAuth er den vanlige refleksen, men
 * den koster en avhengighet som følger Next-versjonen tett, og den løser et
 * problem vi ikke har: mange leverandører, kontokobling, adapter mot
 * database. Her er det én leverandør (Google Workspace), ett domene, og
 * ingen brukertabell. Da er OpenID Connect-flyten kortere enn konfigurasjonen
 * av biblioteket som skjuler den.
 *
 * WEB CRYPTO OG IKKE `node:crypto`. Proxy-laget (tidligere middleware) kjører
 * på Edge-runtime, der `node:crypto` ikke finnes. `crypto.subtle` finnes
 * begge steder, og er dermed den eneste varianten som lar samme kode
 * verifisere sesjonen både i proxyen og i en server-komponent.
 *
 * `crypto.subtle.verify` OG IKKE EN STRENGSAMMENLIGNING. En `===` på to
 * signaturer lekker gyldig prefikslengde gjennom kjøretid. Verifiseringen i
 * Web Crypto er konstanttid, og da slipper vi å skrive den selv — det er den
 * typen kode man tror man får riktig.
 */

const COOKIE_NAVN = "reflektor_intern_sesjon";

/**
 * Sju dager. Lang nok til at ingen logger inn på nytt i løpet av en
 * arbeidsuke, kort nok til at en glemt laptop ikke er åpen i det uendelige.
 * Google-sesjonen bak er uansett uavhengig av denne.
 */
const LEVETID_SEKUNDER = 60 * 60 * 24 * 7;

export type Bruker = {
  epost: string;
  navn: string;
  /** URL til Google-profilbildet. Tom streng når kontoen ikke har ett. */
  bilde: string;
};

type Nyttelast = Bruker & {
  /** Unix-sekunder. Signaturen dekker feltet, så det kan ikke flyttes. */
  utloper: number;
};

/**
 * Hemmeligheten SKAL komme fra miljøet, og koden skal stoppe uten den.
 *
 * En innebygd standardverdi ville vært den samme hemmeligheten i alle
 * installasjoner av dette repoet — altså ingen hemmelighet. At byggen feiler
 * med en tydelig beskjed er riktig oppførsel her, ikke en ulempe.
 */
const MINSTE_LENGDE = 32;

/**
 * Er hemmeligheten satt og lang nok?
 *
 * Skilt ut fra `hemmelighet()` for at INNLOGGINGSSIDEN skal kunne spørre
 * uten å kaste. Uten den er feilmodusen ubehagelig konkret: Google-flyten
 * går helt fram, returen kaller `signerSesjon`, og brukeren får en naken
 * 500 på siste steg — etter å ha valgt konto. Da leter man etter feilen i
 * OAuth-oppsettet, som er riktig sted for alt annet enn nettopp dette.
 */
export function harSesjonshemmelighet(): boolean {
  const verdi = process.env.SESJON_HEMMELIGHET;
  return typeof verdi === "string" && verdi.length >= MINSTE_LENGDE;
}

function hemmelighet(): string {
  const verdi = process.env.SESJON_HEMMELIGHET;
  if (!harSesjonshemmelighet()) {
    throw new Error(
      `SESJON_HEMMELIGHET mangler eller er kortere enn ${MINSTE_LENGDE} tegn. ` +
        "Lag en med: openssl rand -base64 48",
    );
  }
  return verdi as string;
}

let nokkelbuffer: Promise<CryptoKey> | null = null;

function nokkel(): Promise<CryptoKey> {
  // Importen er billig, men den skjer på hver eneste forespørsel gjennom
  // proxyen. Én gang per isolat er nok.
  nokkelbuffer ??= crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(hemmelighet()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return nokkelbuffer;
}

/* base64url, fordi vanlig base64 inneholder `+`, `/` og `=` — alle tre er
   tegn en cookieverdi ikke skal måtte krangle om. */
function tilBase64Url(bytes: Uint8Array): string {
  let binart = "";
  for (const b of bytes) binart += String.fromCharCode(b);
  return btoa(binart)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Returtypen er `Uint8Array<ArrayBuffer>`, ikke bare `Uint8Array`.
 *
 * Det er ikke pedanteri: `crypto.subtle.verify` krever en `BufferSource`,
 * som utelukker `SharedArrayBuffer`. `Uint8Array.from(...)` gir
 * `Uint8Array<ArrayBufferLike>` — altså kanskje delt minne — og typen
 * avvises. Bufferen allokeres derfor eksplisitt.
 */
function fraBase64Url(tekst: string): Uint8Array<ArrayBuffer> {
  const fylt = tekst.replace(/-/g, "+").replace(/_/g, "/");
  const binart = atob(fylt + "=".repeat((4 - (fylt.length % 4)) % 4));
  const ut = new Uint8Array(new ArrayBuffer(binart.length));
  for (let i = 0; i < binart.length; i++) ut[i] = binart.charCodeAt(i);
  return ut;
}

/** Lager cookieverdien. `nyttelast.signatur`, begge base64url. */
export async function signerSesjon(bruker: Bruker): Promise<string> {
  const nyttelast: Nyttelast = {
    ...bruker,
    utloper: Math.floor(Date.now() / 1000) + LEVETID_SEKUNDER,
  };
  const kropp = tilBase64Url(
    new TextEncoder().encode(JSON.stringify(nyttelast)),
  );
  const signatur = await crypto.subtle.sign(
    "HMAC",
    await nokkel(),
    new TextEncoder().encode(kropp),
  );
  return `${kropp}.${tilBase64Url(new Uint8Array(signatur))}`;
}

/**
 * Leser cookieverdien. Returnerer `null` på ALT som ikke stemmer — feil
 * signatur, utløpt, tullete JSON, manglende felt.
 *
 * Ingen av avvisningene skiller seg fra hverandre utad. En kaller som får
 * vite HVORFOR en token ble avvist, får også et orakel å prøve seg mot.
 */
export async function lesSesjon(
  cookieverdi: string | undefined,
): Promise<Bruker | null> {
  if (!cookieverdi) return null;
  const [kropp, signatur] = cookieverdi.split(".");
  if (!kropp || !signatur) return null;

  try {
    const gyldig = await crypto.subtle.verify(
      "HMAC",
      await nokkel(),
      fraBase64Url(signatur),
      new TextEncoder().encode(kropp),
    );
    if (!gyldig) return null;

    const data = JSON.parse(
      new TextDecoder().decode(fraBase64Url(kropp)),
    ) as Partial<Nyttelast>;

    if (typeof data.utloper !== "number") return null;
    if (data.utloper < Math.floor(Date.now() / 1000)) return null;
    if (typeof data.epost !== "string" || !data.epost) return null;

    return {
      epost: data.epost,
      navn: typeof data.navn === "string" ? data.navn : data.epost,
      bilde: typeof data.bilde === "string" ? data.bilde : "",
    };
  } catch {
    return null;
  }
}

/**
 * Cookie-innstillingene, ett sted.
 *
 * `secure` er slått av på http://localhost fordi nettleseren ellers kaster
 * cookien i utvikling — og da ser innloggingen ut til å feile uten å si
 * hvorfor. Alt annet enn localhost er https, også preview-deployene.
 */
export function cookieValg(erHttps: boolean) {
  return {
    httpOnly: true,
    secure: erHttps,
    /*
     * `lax` og ikke `strict`. OAuth-returen fra Google er en navigasjon fra
     * accounts.google.com tilbake hit; med `strict` sender ikke nettleseren
     * cookien på den navigasjonen, og brukeren lander utlogget på sin egen
     * innlogging. `lax` sender den på toppnivånavigasjoner med GET, som er
     * nøyaktig det returen er, og blokkerer fortsatt CSRF via POST.
     */
    sameSite: "lax" as const,
    path: "/",
    maxAge: LEVETID_SEKUNDER,
  };
}

export { COOKIE_NAVN, LEVETID_SEKUNDER };
