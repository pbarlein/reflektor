/**
 * Cloudflare Turnstile: beviset på at det var et menneske som sendte inn.
 *
 * HVORFOR DEN TRENGS I TILLEGG TIL SCOREN. Scoren i lib/spam.ts leser
 * innholdet og tar botten som ser utenlandsk ut. Turnstile tar botten som
 * ser helt riktig ut — norsk nummer, norsk tekst, norsk IP — fordi den
 * måler nettleseren og ikke teksten. De to tar hver sin halvdel.
 *
 * STÅR AV TIL NØKLENE FINNES. Uten `TURNSTILE_SITE_KEY` og
 * `TURNSTILE_SECRET_KEY` gjør widgeten og denne sjekken ingenting, og
 * scoren er hele vernet. Det er med vilje: vernet skal virke fra første
 * utrulling, ikke fra den dagen noen husker å legge inn en nøkkel.
 */

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Taket på kallet til Cloudflare. */
const TIDSTAK_MS = 4000;

/** Navnet Turnstile selv gir feltet i skjemaet. */
export const TURNSTILE_FELT = "cf-turnstile-response";

export function turnstileSiteKey(): string {
  return process.env.TURNSTILE_SITE_KEY?.trim() ?? "";
}

export function turnstileOppsatt(): boolean {
  return Boolean(
    process.env.TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim(),
  );
}

export type Turnstilesvar = "ikke-konfigurert" | "ok" | "avvist";

/**
 * Sjekker tokenet mot Cloudflare.
 *
 * ET KALL SOM IKKE NÅR FRAM GIR «ok». Er Cloudflare nede eller
 * nettverket tregt, skal ikke alle henvendelser forsvinne — da er scoren
 * igjen som vern, og en logglinje sier hva som skjedde. Motsatt valg ville
 * gjort en tjeneste vi ikke eier til en bryter for vår eneste KPI.
 *
 * ET TOKEN SOM MANGLER GIR «avvist» når Turnstile ER satt opp. Da har
 * widgeten enten ikke kjørt, eller noen har sendt skjemaet utenom
 * nettleseren — og det er nettopp det denne skal fange.
 */
export async function verifiserTurnstile(
  token: string,
  ip: string,
): Promise<Turnstilesvar> {
  const hemmelighet = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!hemmelighet || !turnstileSiteKey()) {
    console.info("TURNSTILE: ikke konfigurert");
    return "ikke-konfigurert";
  }

  if (!token.trim()) return "avvist";

  try {
    const kropp = new URLSearchParams({ secret: hemmelighet, response: token });
    if (ip) kropp.set("remoteip", ip);

    const svar = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: kropp,
      signal: AbortSignal.timeout(TIDSTAK_MS),
    });

    if (!svar.ok) {
      console.error(`TURNSTILE: siteverify svarte ${svar.status}. Slipper gjennom.`);
      return "ok";
    }

    const data = (await svar.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return "ok";

    console.warn(
      `TURNSTILE: avvist (${(data["error-codes"] ?? []).join(", ") || "uten kode"})`,
    );
    return "avvist";
  } catch (feil) {
    console.error("TURNSTILE: kallet feilet. Slipper gjennom.", feil);
    return "ok";
  }
}
