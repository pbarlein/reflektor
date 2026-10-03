import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signaturen på «Avbryt påminnelse»-lenken i varselet til Pål.
 *
 * HVORFOR DEN TRENGS. Lenken ligger i en e-post og skal virke med ett trykk,
 * uten innlogging. Uten en signatur ville adressen
 * `/paaminnelse/avbryt?e=noen@kunde.no` latt hvem som helst slå av
 * oppfølgingen for hvilken som helst e-postadresse — det eneste som trengs
 * er å gjette en adresse.
 *
 * HMAC OVER E-POSTADRESSEN, med en hemmelighet bare serveren har. Adressen
 * normaliseres først (trimmet, små bokstaver), slik at samme adresse alltid
 * gir samme signatur uansett hvordan den ble skrevet i skjemaet.
 *
 * INGEN UTLØPSTID. Det ble vurdert: en signatur som varer evig kan brukes om
 * igjen av den som har e-posten. Men den som har e-posten, er Pål — og det
 * verste et gjenbruk kan gjøre, er å slå av en påminnelse som uansett bare
 * sendes én gang. En utløpstid ville i stedet gitt en knapp som slutter å
 * virke i en innboks han blar tilbake i.
 *
 * MANGLER HEMMELIGHETEN, LAGES INGEN LENKE. Da står varselet uten knapp, og
 * resten av e-posten er som før. Alternativet — å signere med en tom
 * nøkkel — ville gitt en knapp alle kunne regne ut signaturen til.
 */

function hemmelighet(): string | undefined {
  const h = process.env.PAAMINNELSE_HEMMELIGHET;
  return h && h.length >= 16 ? h : undefined;
}

export function normaliserEpost(epost: string): string {
  return epost.trim().toLowerCase();
}

/** Signaturen, eller null hvis hemmeligheten ikke er satt. */
export function signer(epost: string): string | null {
  const h = hemmelighet();
  if (!h) return null;
  return createHmac("sha256", h)
    .update(normaliserEpost(epost))
    .digest("base64url");
}

/**
 * Sant bare hvis signaturen hører til adressen.
 *
 * SAMMENLIGNINGEN ER TIDSKONSTANT. En vanlig `===` på to strenger stopper
 * ved første tegn som ikke stemmer, og tiden det tar lekker hvor langt en
 * gjetning kom. `timingSafeEqual` krever lik lengde, så den sjekkes først.
 */
export function gyldigSignatur(epost: string, signatur: string): boolean {
  const riktig = signer(epost);
  if (!riktig || !signatur) return false;
  const a = Buffer.from(riktig);
  const b = Buffer.from(signatur);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Hele lenken, eller null hvis den ikke kan signeres. */
export function avbrytLenke(epost: string, basis = "https://www.reflektor.no"): string | null {
  const s = signer(epost);
  if (!s) return null;
  const u = new URL("/paaminnelse/avbryt", basis);
  u.searchParams.set("e", normaliserEpost(epost));
  u.searchParams.set("s", s);
  return u.toString();
}
