import { createSign, randomUUID } from "node:crypto";

/**
 * Sender e-post som Pål, gjennom Gmail.
 *
 * HVORFOR IKKE HUBSPOT. HubSpot sender markedsførings-e-post: egne
 * utsendelsesservere, `List-Unsubscribe`-header, omskrevne lenker for
 * klikksporing. Gmail leser summen av det som masseutsendelse og legger den
 * i «Reklame»-fanen. Målt 03.10.2026 på en ekte test. En presentasjon som
 * ligger i Reklame-fanen er en presentasjon ingen ser.
 *
 * HERFRA SER E-POSTEN UT SOM EN PÅL SKREV SELV: fra hans egen adresse,
 * gjennom hans egen Gmail-konto, uten sporing, uten avmeldingslenke, uten
 * bilder. Den havner i hans «Sendt», og svar kommer i samme tråd — som i
 * enhver annen samtale han har.
 *
 * TO MÅTER Å LOGGE SEG PÅ, og begge støttes fordi Pål kan ende på begge:
 *
 * 1. TJENESTEKONTO MED DOMENEDELEGERING. En konto i Google Cloud får lov å
 *    opptre som pal@reflektor.no. Ingen innlogging, ingenting som utløper.
 *    Krever at en administrator godkjenner klient-ID-en i Google Workspace.
 * 2. OAUTH MED FORNYINGSNØKKEL. Pål logger inn én gang og gir tilgang.
 *    Enklere å sette opp, men nøkkelen kan trekkes tilbake av Google hvis
 *    appen står som «testing», og da stopper utsendelsen stille.
 *
 * Tjenestekonto brukes hvis den finnes. Står ingen av delene, sendes
 * ingenting — og den som spør får vite hvorfor.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL =
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const SCOPE = "https://www.googleapis.com/auth/gmail.send";
const TIDSTAK_MS = 10000;

export function gmailAvsender(): string {
  return process.env.GMAIL_AVSENDER ?? "pal@reflektor.no";
}

export function harGmail(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ??
      (process.env.GOOGLE_OAUTH_CLIENT_ID &&
        process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
        process.env.GOOGLE_OAUTH_REFRESH_TOKEN),
  );
}

function base64url(b: Buffer | string): string {
  return Buffer.from(b).toString("base64url");
}

/**
 * Tilgangsnøkkel fra en tjenestekonto.
 *
 * SIGNERINGEN GJØRES HER, med `node:crypto`, og ikke med et Google-bibliotek.
 * Hele jobben er tre base64-biter og én RSA-signatur; et bibliotek ville lagt
 * på megabyte i en serverless-funksjon for å spare femten linjer.
 *
 * `sub` ER DET VIKTIGE FELTET: det er brukeren tjenestekontoen opptrer som.
 * Uten den sender vi som tjenestekontoen selv, som ikke har noen innboks.
 */
async function tjenestekontoNokkel(): Promise<string | null> {
  const rå = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!rå) return null;

  let konto: { client_email?: string; private_key?: string };
  try {
    konto = JSON.parse(rå) as typeof konto;
  } catch {
    console.error("[gmail] GOOGLE_SERVICE_ACCOUNT_JSON er ikke gyldig JSON.");
    return null;
  }
  if (!konto.client_email || !konto.private_key) {
    console.error("[gmail] Tjenestekontoen mangler client_email eller private_key.");
    return null;
  }

  const na = Math.floor(Date.now() / 1000);
  const hode = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const krav = base64url(
    JSON.stringify({
      iss: konto.client_email,
      sub: gmailAvsender(),
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: na,
      exp: na + 3600,
    }),
  );
  const signatur = createSign("RSA-SHA256")
    .update(`${hode}.${krav}`)
    // `\n` i miljøvariabler blir ofte stående som to tegn.
    .sign(konto.private_key.replace(/\\n/g, "\n"), "base64url");

  const svar = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${hode}.${krav}.${signatur}`,
    }),
    signal: AbortSignal.timeout(TIDSTAK_MS),
  });

  if (!svar.ok) {
    console.error(
      `[gmail] Fikk ikke tilgangsnøkkel for tjenestekontoen (${svar.status}). ${await svar.text().catch(() => "")}`,
    );
    return null;
  }
  return ((await svar.json()) as { access_token?: string }).access_token ?? null;
}

/** Tilgangsnøkkel fra en fornyingsnøkkel. */
async function oauthNokkel(): Promise<string | null> {
  const id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const hemmelighet = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const fornying = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!id || !hemmelighet || !fornying) return null;

  const svar = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: hemmelighet,
      refresh_token: fornying,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(TIDSTAK_MS),
  });

  if (!svar.ok) {
    console.error(
      `[gmail] Fikk ikke tilgangsnøkkel med fornyingsnøkkelen (${svar.status}). ${await svar.text().catch(() => "")}`,
    );
    return null;
  }
  return ((await svar.json()) as { access_token?: string }).access_token ?? null;
}

async function tilgangsnokkel(): Promise<string | null> {
  return (await tjenestekontoNokkel()) ?? (await oauthNokkel());
}

/**
 * Navnet som står som avsender. Ikke adressen — den er `gmailAvsender()`.
 */
const AVSENDERNAVN = "Pål Barlein";

/*
  RFC 2047: et kodet ord kan være 75 tegn i alt. «=?UTF-8?B?» og «?=» tar
  tolv, så det er plass til 63 tegn base64 — altså 45 byte, som er det
  største tallet delelig på tre som holder seg innenfor.
*/
const BYTE_PER_ORD = 45;

/**
 * Koder en overskrift som kan inneholde æ, ø og å, etter RFC 2047.
 *
 * E-POSTHEADERE ER ASCII. Står «Pål Barlein» rått i `From`, leser mottakerens
 * klient byte-ene som Latin-1 og viser «PÃ¥l» — eller «PÃƒÂ¥l», hvis den
 * gjetter feil to ganger. Målt i Gmail 03.10.2026 på en ekte sending.
 *
 * LANGE OVERSKRIFTER DELES I FLERE ORD. Ett kodet ord på 200 tegn er ikke
 * gyldig, og en klient som følger standarden har lov å vise det rått.
 * Delingen skjer på tegngrense, aldri midt i en «å»: fortsettelsesbyte i
 * UTF-8 begynner med bitene 10, og da må vi et hakk tilbake.
 *
 * ALDRI DOBBELTKODET. Er teksten allerede ASCII, går den urørt gjennom.
 */
export function kodetHode(tekst: string): string {
  if (/^[\x00-\x7F]*$/.test(tekst)) return tekst;

  const b = Buffer.from(tekst, "utf8");
  const ord: string[] = [];
  let i = 0;
  while (i < b.length) {
    let slutt = Math.min(i + BYTE_PER_ORD, b.length);
    while (slutt > i + 1 && slutt < b.length && (b[slutt] & 0xc0) === 0x80) {
      slutt -= 1;
    }
    ord.push(`=?UTF-8?B?${b.subarray(i, slutt).toString("base64")}?=`);
    i = slutt;
  }
  /* Brettes med CRLF + mellomrom, som er måten en header fortsetter. */
  return ord.join("\r\n ");
}

/**
 * Base64 for en meldingsdel, brettet på 76 tegn.
 *
 * RFC 2045 setter grensen, og en del eldre mottakere kutter eller forkaster
 * linjer som er lengre. Gmail tar imot én lang linje, men det er flaks vi
 * ikke trenger å være avhengige av.
 */
function brettetBase64(tekst: string): string {
  const b64 = Buffer.from(tekst, "utf8").toString("base64");
  return (b64.match(/.{1,76}/g) ?? []).join("\r\n");
}

export type Epost = {
  til: string;
  emne: string;
  tekst: string;
  html: string;
  /** Svar i en tråd: id-en Gmail ga da den forrige ble sendt. */
  tradId?: string;
  /** Message-ID til den vi svarer på. */
  svarPa?: string;
};

export type Sendt = { tradId: string; meldingsId: string };

/**
 * Bygger meldingen.
 *
 * `multipart/alternative` MED REN TEKST FØRST. Rekkefølgen er en del av
 * standarden: klienten viser den SISTE delen den forstår, så HTML må ligge
 * sist for å bli foretrukket, og ren tekst først som reserve.
 *
 * MESSAGE-ID LAGES HER. Vi har bare lov til å sende, ikke til å lese, så
 * det finnes ingen måte å hente headeren Gmail satte. Da må vi sette den
 * selv — ellers har e-post 2 ingenting å svare på, og tråden brytes.
 */
export function byggMime(e: Epost, meldingsId: string): string {
  const grense = `g${randomUUID().replace(/-/g, "")}`;
  const linjer = [
    `From: ${kodetHode(AVSENDERNAVN)} <${gmailAvsender()}>`,
    `To: ${e.til}`,
    `Subject: ${kodetHode(e.emne)}`,
    `Message-ID: ${meldingsId}`,
    ...(e.svarPa ? [`In-Reply-To: ${e.svarPa}`, `References: ${e.svarPa}`] : []),
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${grense}"`,
    "",
    `--${grense}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    brettetBase64(e.tekst),
    `--${grense}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    brettetBase64(e.html),
    `--${grense}--`,
    "",
  ];
  return linjer.join("\r\n");
}

/** Sender. Kaster aldri — den logger og svarer null. */
export async function sendGmail(e: Epost): Promise<Sendt | null> {
  const nokkel = await tilgangsnokkel();
  if (!nokkel) {
    console.error("[gmail] Ingen tilgangsnøkkel. E-posten ble IKKE sendt.");
    return null;
  }

  const meldingsId = `<${randomUUID()}@reflektor.no>`;

  try {
    const svar = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nokkel}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: base64url(byggMime(e, meldingsId)),
        ...(e.tradId ? { threadId: e.tradId } : {}),
      }),
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });

    if (!svar.ok) {
      console.error(
        `[gmail] Gmail svarte ${svar.status}. ${await svar.text().catch(() => "")}`,
      );
      return null;
    }

    const data = (await svar.json()) as { threadId?: string };
    return { tradId: data.threadId ?? "", meldingsId };
  } catch (feil) {
    console.error("[gmail] Kallet feilet.", feil);
    return null;
  }
}
