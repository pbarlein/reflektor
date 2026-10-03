import { after, NextResponse, type NextRequest } from "next/server";

import { lesHutk, sendLeadTilHubspot } from "@/lib/hubspot";
import {
  nettsideFraEpost,
  normaliserMobil,
  normaliserNettside,
} from "@/lib/kontaktfelt";
import { sendLeadPaEpost, type Lead } from "@/lib/lead";
import { basisUrl } from "@/lib/miljo";
import { foroftigPaKanten } from "@/lib/mengde";
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
   * MENGDEBEGRENSNING I TO LAG, se lib/mengde.ts: først brannmuren, som
   * teller på tvers av serverinstanser, så telleren i minnet som gulv.
   *
   * SVARET ER DET SAMME SOM VED SUKSESS — 303 til /takk. Den som sender
   * skjemaet seks ganger på ti minutter får ingen feilmelding og ingen
   * grunn til å prøve en annen vei. Det som IKKE skjer, er varselet til
   * Pål og innsendingen til HubSpot.
   */
  if ((await foroftigPaKanten(req)) || foroftig(klientnokkel(req.headers))) {
    botAktig = true;
    console.warn(
      `[skjema] Over mengdegrensen for ${klientnokkel(req.headers)}. Innsendingen ble IKKE sendt videre.`,
    );
  }

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
     * HUBSPOT FØRST, SÅ E-POSTEN. Rekkefølgen er snudd 04.10.2026, og det
     * er en bestilling med en grunn: varselet skal si «⚠ Leadet ble IKKE
     * lagret i HubSpot» når innsendingen dit feiler. Da får leadet heller
     * ingen automatisk e-post med presentasjon og bookinglenke —
     * arbeidsflyten starter på en kontakt som aldri ble opprettet — og Pål
     * må legge det inn for hånd. Den opplysningen finnes bare hvis
     * e-posten skrives ETTER at HubSpot har svart.
     *
     * BEGGE LIGGER NÅ I `after()`, og ingen av dem forsinker besøkende.
     * Svaret er sendt før noe av dette starter. Før dette ble e-posten
     * sendt inne i forespørselen; kostnaden ved å flytte den er at et
     * `after()` som aldri kjører tar med seg begge, gevinsten er at Pål
     * får vite når leadet ikke kom fram.
     *
     * HubSpot-kallet har et tak på fire sekunder og kaster aldri (se
     * hubspot.ts), så e-posten kommer uansett.
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
     * Fallback er å kalle funksjonen uten å vente. Den kan ikke kaste —
     * begge kallene inne i den fanger sitt eget — så `void` er trygt: på en
     * kjøretid uten `after()` kan
     * kallet bli avbrutt når svaret sendes, og det er et dårligere utfall
     * enn `after()` — men et mye bedre utfall enn en 500.
     */
    const etterpa = async () => {
      const iHubspot = await sendLeadTilHubspot(lead, hutk, basis);
      try {
        await sendLeadPaEpost(lead, { hubspotFeilet: !iHubspot });
      } catch {
        // sendLeadPaEpost har allerede logget «LEADVARSEL FEILET».
      }
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
