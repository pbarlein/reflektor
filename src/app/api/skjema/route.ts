import { after, NextResponse, type NextRequest } from "next/server";

import { lesHutk, sendLeadTilHubspot } from "@/lib/hubspot";
import {
  nettsideFraEpost,
  normaliserMobil,
  normaliserNettside,
} from "@/lib/kontaktfelt";
import { sendBekreftelse, sendLeadPaEpost, type Lead } from "@/lib/lead";
import { basisUrl } from "@/lib/miljo";
import { foroftig, klientnokkel, rens } from "@/lib/skjemavern";

/**
 * Skjemainnsending.
 *
 * HVORFOR RUTEHÅNDTERER OG IKKE SERVERHANDLING:
 *
 * Første versjon brukte en serverhandling med redirect("/takk"). Den fungerer
 * teknisk, men gir en KLIENTSIDE-navigasjon – nettleseren henter en
 * RSC-nyttelast og bytter innhold uten å laste dokumentet på nytt. I
 * kjøretidsloggen ser det slik ut:
 *
 *     GET /takk.rsc 200
 *
 * GTM-containeren lastes én gang i layouten. Ved en slik navigasjon kjører
 * den ikke på nytt, og verken page_view eller Google Ads-konverteringstaggen
 * ville fyrt uten at GTM i tillegg var satt opp med en History Change-trigger.
 *
 * Et vanlig skjema som POSTer hit og får 303 tilbake gir derimot en ekte
 * dokumentnavigasjon: ny URL i adressefeltet, full sidelasting, GTM kjører på
 * nytt. Det er det målingen er avhengig av.
 *
 * Bonus: skjemaet virker også uten JavaScript.
 *
 * SVARET ER ALLTID 303 TIL /takk. Også for bot, også for mengdebegrenset,
 * også når e-posten feiler. Tre grunner:
 *
 * 1. Den som fylte ut skjemaet skal aldri møte en feilmelding for noe vi
 *    ikke fikk til på baksiden.
 * 2. Et annet svar for bot enn for menneske forteller boten nøyaktig hva
 *    som avslørte den.
 * 3. /takk bærer GA4-hendelsen og Ads-konverteringen. Se lead.ts.
 */
export async function POST(req: NextRequest) {
  /*
   * Feil innholdstype gir en kastet feil fra formData(). Vi svarer som
   * ellers i stedet for å la ruta gi 500 — en 500 herfra sier bare at noen
   * sendte noe rart.
   */
  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return svar(req);
  }

  let botAktig = false;

  /*
   * Mengdebegrensning. Se skjemavern.ts for hva denne faktisk dekker og
   * hva den ikke dekker — den er et gulv, ikke en garanti.
   */
  if (foroftig(klientnokkel(req.headers))) botAktig = true;

  // Honningkrukke: feltet er skjult for mennesker. Utfylt = bot.
  if (data.get("firmanavn")) botAktig = true;

  // Innsending under to sekunder etter lasting er praktisk talt alltid maskinell.
  const lastet = Number(data.get("lastet") ?? 0);
  if (lastet && Date.now() - lastet < 2000) botAktig = true;

  if (!botAktig) {
    /*
     * Alt renses og kuttes før det forlater ruta. Uten grenser kunne én
     * POST legge flere megabyte inn i en e-post, og kontrolltegn i et navn
     * havner i et e-postemne. Se skjemavern.ts.
     */
    const epost = rens(data.get("epost"), "epost");

    /*
     * MOBILNUMMERET NORMALISERES HER, ikke bare i nettleseren. Feltet er
     * påkrevd fra 04.10.2026 fordi Pål ringer leads samme dag, og «påkrevd»
     * i et HTML-attributt er en hjelp til brukeren, ikke en garanti — en
     * POST kan komme fra hva som helst.
     *
     * ET UGYLDIG NUMMER STOPPER IKKE LEADET. Det er det viktige valget her:
     * henvendelsen er verdt mer enn formatet. Går nummeret ikke å tolke,
     * sendes det videre slik det ble skrevet, og Pål ser det som det står.
     * Alternativet — å avvise — ville kastet et ekte lead for en skrivefeil.
     */
    const råtelefon = rens(data.get("telefon"), "telefon");
    const mobil = normaliserMobil(råtelefon);

    /*
     * NETTSIDEN: skrevet inn hvis den finnes, ellers utledet av
     * e-postdomenet når det ikke er en gratisadresse. Se lib/kontaktfelt.ts
     * for hvorfor en utledet adresse merkes som utledet.
     */
    const skrevet = normaliserNettside(rens(data.get("nettside"), "nettside"));
    const utledet = skrevet.ok ? null : nettsideFraEpost(epost);

    const lead: Lead = {
      navn: rens(data.get("navn"), "navn"),
      epost,
      bedrift: rens(data.get("bedrift"), "bedrift"),
      telefon: mobil.ok ? mobil.visning : råtelefon,
      melding: rens(data.get("melding"), "melding"),
      side: rens(data.get("side"), "side") || "ukjent",
      nettside: skrevet.ok ? skrevet.url : (utledet ?? ""),
      nettsideUtledet: !skrevet.ok && utledet !== null,
      kilde: rens(data.get("kilde"), "kilde"),
    };

    /*
     * E-postfeil skal aldri hindre videresendingen. Uten /takk mister vi
     * GA4-hendelsen og Ads-konverteringen, og da er leadet usynlig i målingen
     * selv om det kom fram i innboksen.
     */
    try {
      await sendLeadPaEpost(lead);
    } catch (feil) {
      console.error("[lead] Sending feilet:", feil);
    }

    /*
     * BEKREFTELSEN TIL INNSENDEREN, lagt til 04.10.2026.
     *
     * DEN VENTES IKKE PÅ. Varselet til Pål er hovedkanalen og er allerede
     * sendt; denne er en høflighet til den som fylte ut skjemaet, og
     * ingenting skal stå og vente på den. `sendBekreftelse` kaster aldri —
     * se lib/lead.ts — så `void` er trygt her.
     *
     * Den legges i samme `after()` som HubSpot under, slik at Vercel holder
     * invokasjonen i live til den er ferdig.
     */

    /*
     * HUBSPOT, LAGT TIL 02.10.2026. Se lib/hubspot.ts for hvorfor leadet
     * også skal gå denne veien.
     *
     * `after()` OG IKKE `await`, med vilje. Dette er den eneste delen av
     * innsendingen som ingen venter på: e-posten er hovedkanalen, og
     * besøkende skal til /takk. `after()` kjører tilbakekallet ETTER at
     * svaret er sendt — på Vercel via `waitUntil`, så invokasjonen lever
     * videre til kallet er ferdig. Et `await` her ville lagt HubSpots
     * svartid rett inn i ventetiden før /takk, og /takk er der målingen av
     * Reflektors eneste KPI skjer.
     *
     * Cookien leses HER og ikke inne i tilbakekallet. Det er lov å lese
     * forespørselen inne i `after()` i en rutehåndterer, men verdien er
     * kjent nå, og en lesning som ikke trenger å være der er en lesning
     * som kan feile senere.
     */
    const hutk = lesHutk(req.headers.get("cookie"));
    const basis = basisUrl();

    /*
     * `after()` KASTER HVIS DEN KALLES UTENFOR EN FORESPØRSELSKONTEKST.
     * Verifisert: «`after` was called outside a request scope.» I en
     * rutehåndterer på Vercel finnes konteksten alltid, så dette skal ikke
     * kunne skje — men regelen i hodet på fila er at svaret ALLTID er 303
     * til /takk, og en ufanget feil her ville gitt 500 og tatt med seg
     * både leadet og målingen av det.
     *
     * Fallback er å kalle funksjonen uten å vente. Den kan ikke kaste (se
     * hubspot.ts), så `void` er trygt: på en kjøretid uten `after()` kan
     * kallet bli avbrutt når svaret sendes, og det er et dårligere utfall
     * enn `after()` — men et mye bedre utfall enn en 500.
     */
    const etterpa = async () => {
      await sendBekreftelse(lead);
      await sendLeadTilHubspot(lead, hutk, basis);
    };

    try {
      after(etterpa);
    } catch (feil) {
      console.error("[hubspot] after() var ikke tilgjengelig:", feil);
      void etterpa();
    }
  }

  return svar(req);
}

/**
 * 303 gjør om POST til GET, slik at /takk ikke kan sendes inn på nytt ved
 * oppdatering av siden.
 */
function svar(req: NextRequest) {
  return NextResponse.redirect(new URL("/takk", req.url), 303);
}
