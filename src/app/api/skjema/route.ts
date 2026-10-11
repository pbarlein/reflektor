import { after, NextResponse, type NextRequest } from "next/server";

import { lesHutk, sendLeadTilHubspot } from "@/lib/hubspot";
import { avbrytPaaminnelse } from "@/lib/hubspotcrm";
import {
  nettsideFraEpost,
  normaliserMobil,
  normaliserNettside,
} from "@/lib/kontaktfelt";
import { sendLeadPaEpost, type Lead } from "@/lib/lead";
import { sendEpost1TilNyttLead } from "@/lib/leadutsending";
import { basisUrl } from "@/lib/miljo";
import { innenforVinduet } from "@/lib/sendevindu";
import {
  foroftig,
  klientnokkel,
  rens,
  serUtSomEpost,
} from "@/lib/skjemavern";
import { epostdomene, spamScore } from "@/lib/spam";
import { erEngangsadresse, manglerMx } from "@/lib/spamoppslag";
import { TURNSTILE_FELT, verifiserTurnstile } from "@/lib/turnstile";

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
   * MENGDEBEGRENSNING, NEDERSTE LAG.
   *
   * DEN ØVERSTE LIGGER I VERCELS BRANNMUR, satt opp 04.10.2026: 5
   * forespørsler per IP per 600 sekunder mot `/api/skjema`, svar 429. Den
   * teller på tvers av alle serverinstanser og stopper trafikken FØR den
   * når denne koden. Den er den som faktisk holder.
   *
   * HER STO ET KALL TIL `checkRateLimit`, som skulle latt koden lese den
   * samme telleren og svare 303 til /takk i stedet for 429 — slik at den
   * som spammer ikke får vite at noe ble stoppet. Det krever en regel
   * knyttet til en id, og den varianten finnes ikke i Vercels grensesnitt:
   * regelen settes opp på sti og handling, uten id å spørre etter. Kallet
   * kunne derfor aldri treffe noe, og er fjernet igjen samme dag.
   *
   * DENNE TELLEREN LIGGER I MINNET til én instans og er gulvet: den
   * stopper én maskin som sender om og om igjen hvis brannmurregelen en dag
   * blir slettet. Se skjemavern.ts for hva den ikke dekker.
   *
   * SVARET ER SOM VED SUKSESS — 303 til /takk. Det som IKKE skjer, er
   * varselet til Pål og innsendingen til HubSpot.
   */
  if (foroftig(klientnokkel(req.headers))) {
    console.warn(
      `[skjema] Over mengdegrensen for ${klientnokkel(req.headers)}. Innsendingen ble IKKE sendt videre.`,
    );
    return svar(req);
  }

  // Honningkrukke: feltet er skjult for mennesker. Utfylt = bot.
  if (data.get("firmanavn")) botAktig = true;

  /*
   * Innsending under tre sekunder etter lasting er praktisk talt alltid
   * maskinell. Grensen sto på to til 11.10.2026.
   *
   * GIR IKKE LENGER ET STILLE AVBRUDD. Begge disse to er nå tre poeng i
   * spam-scoren — se lib/spam.ts — og blokkerer dermed alene, akkurat som
   * før. Forskjellen er at utfallet havner i den samme logglinja som alt
   * annet, i stedet for å forsvinne.
   */
  const lastet = Number(data.get("lastet") ?? 0);
  if (lastet && Date.now() - lastet < 3000) botAktig = true;

  {
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
     * INGEN MÅTE Å SVARE PÅ ER INGEN HENVENDELSE. Lagt til 06.10.2026.
     *
     * HENDELSEN: kl. 15:08 kom en POST der bare det skjulte feltet «side»
     * var fylt ut. Navn, e-post, telefon, bedrift og melding var tomme. En
     * nettleser slipper ikke gjennom tomme påkrevde felt, så innsendingen
     * kom fra et skript — og den slapp gjennom begge vaktene vi hadde:
     * honningkrukka var tom, og fartssjekken hopper over når «lastet»
     * mangler. Pål fikk et leadvarsel med «–» i alle feltene.
     *
     * KRAVET ER LAVT MED VILJE: ENTEN en e-post som ser ut som en adresse,
     * ELLER noe som helst i telefonfeltet. Et ekte lead med skrivefeil i
     * det ene skal fortsatt komme fram. Det vi stopper, er innsendingen
     * som ikke har noen av delene — og den kan ingen svare på uansett.
     *
     * SVARET ER SOM ELLERS, 303 til /takk. Se regelen i fila hodet: et
     * annet svar for bot enn for menneske forteller boten hva som avslørte
     * den.
     */
    if (!serUtSomEpost(epost) && !råtelefon) {
      console.warn(
        `[skjema] Innsending fra ${rens(data.get("side"), "side") || "ukjent"} uten e-post og telefon. Behandlet som bot, IKKE sendt videre.`,
      );
      return svar(req);
    }

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
     * HEADERNE LESES HER, av samme grunn som cookien over.
     *
     * `x-vercel-ip-country` ER BESØKENDES LAND, og det er den eneste
     * stedsopplysningen vi har som faktisk stemmer. HubSpot viser
     * «Ashburn, US» på hvert eneste nettsidelead, også de norske — det er
     * Vercel-funksjonens egen IP, ikke avsenderens.
     *
     * `x-forwarded-for` kan inneholde flere adresser, lagt på av hvert
     * ledd. Den FØRSTE er besøkende; resten er mellomledd.
     */
    const land = req.headers.get("x-vercel-ip-country") ?? "";
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]!.trim();
    const turnstiletoken = String(data.get(TURNSTILE_FELT) ?? "");

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
      /*
        HELE VURDERINGEN LIGGER I `after()`, ETTER AT SVARET ER SENDT.
        Den koster et Turnstile-kall, et DNS-oppslag og en liste på 121
        570 domener — og ingen av delene skal den besøkende vente på.
        Svaret er 303 til /takk uansett hva vi kommer fram til, så det er
        ingenting å vente på heller.
      */
      const turnstile = await verifiserTurnstile(turnstiletoken, ip);

      const domene = epostdomene(lead.epost);
      const [engangs, utenMx] = await Promise.all([
        erEngangsadresse(domene),
        manglerMx(domene),
      ]);

      const vurdering = spamScore({
        telefon: lead.telefon,
        epost: lead.epost,
        melding: lead.melding,
        bedrift: lead.bedrift,
        land,
        botAktig,
        engangsadresse: engangs,
        manglerMx: utenMx,
      });

      /*
        ET AVVIST TURNSTILE-TOKEN BLOKKERER ALENE. Widgeten måler
        nettleseren, ikke teksten, og den tar derfor botten som skriver
        feilfritt norsk fra en norsk IP — den scoren aldri ville fanget.
        Er Turnstile ikke satt opp, eller fikk vi ikke svar fra
        Cloudflare, bærer scoren alene. Se lib/turnstile.ts.
      */
      const blokkert = turnstile === "avvist" || vurdering.utfall === "blokkert";
      const flagget = !blokkert && vurdering.utfall === "flagget";

      const treff = [
        ...vurdering.treff,
        ...(turnstile === "avvist" ? ["turnstile-avvist"] : []),
      ];

      console.info(
        `SKJEMA: score=${vurdering.score} treff=[${treff.join(", ")}] resultat=${
          blokkert ? "blokkert" : flagget ? "flagget" : "ok"
        }`,
      );

      if (blokkert) {
        /*
          INGENTING SENDES VIDERE. Ingen kontakt i HubSpot, ingen varsel
          til Pål, ingen e-post til avsenderen. Besøkende fikk 303 til
          /takk som alle andre — et annet svar for bot enn for menneske
          forteller boten nøyaktig hva som avslørte den.
        */
        console.warn(
          `SKJEMA BLOKKERT: score=${vurdering.score} treff=${treff.join(",")} epost=${domene || "ukjent"}`,
        );
        return;
      }

      const iHubspot = await sendLeadTilHubspot(lead, hutk, basis, ip);
      try {
        await sendLeadPaEpost(lead, {
          hubspotFeilet: !iHubspot,
          spamTreff: flagget ? treff : undefined,
        });
      } catch {
        // sendLeadPaEpost har allerede logget «LEADVARSEL FEILET».
      }

      /*
        EN FLAGGET INNSENDING FÅR INGEN AUTOMATISK OPPFØLGING. Scoren var
        1 eller 2 — for lite til å kaste en mulig kunde, for mye til å
        sende presentasjonen og en påminnelse til noen vi ikke vet hvem
        er. Pål får varselet med ⚠-linja og tar det derfra; knappen
        «Skriv til <fornavn>» står som før.

        `paminnelse_avbrutt` ER MARKØREN, det samme feltet avbryt-knappen
        setter. Jobben som kjører hvert femte minutt leser den og hopper
        over kontakten — se lib/leadepost.ts.

        ETT FORSØK TIL ETTER TRE SEKUNDER. Kontakten lages av Forms API
        rett før dette, og HubSpot bruker av og til et øyeblikk på å
        gjøre den søkbar. Et 404 her betyr «ikke ennå», ikke «finnes
        ikke».
      */
      if (flagget) {
        if (iHubspot) {
          let utfall = await avbrytPaaminnelse(lead.epost);
          if (!utfall.ok && utfall.grunn === "ikke-funnet") {
            await new Promise((f) => setTimeout(f, 3000));
            utfall = await avbrytPaaminnelse(lead.epost);
          }
          console.info(
            `SKJEMA: flagget lead ${lead.epost} — oppfølging ${utfall.ok ? "slått av" : `IKKE slått av (${utfall.grunn})`}.`,
          );
        }
        return;
      }

      /*
        E-POSTEN TIL LEADET MED PRESENTASJON OG BOOKINGLENKE, lagt til
        04.10.2026. Den sendes fra Påls egen Gmail — se lib/gmail.ts for
        hvorfor den ikke lenger går gjennom HubSpot.

        SIST I REKKEFØLGEN, med vilje. Varselet til Pål er hovedkanalen og
        skal aldri stå bak noe annet i køen. Denne kan dessuten utsettes
        uten tap: finnes ikke kontakten i HubSpot ennå, tar jobben som
        kjører hvert femte minutt den i stedet.

        BRYTEREN STÅR AV til Pål slår den på. Se lib/leadutsending.ts.
      */
      /*
        UTENOM SENDEVINDUET GJØR VI INGENTING HER. Regelen ville stoppet
        e-posten uansett, men da hadde vi brukt et oppslag mot HubSpot på å
        få vite det. Jobben tømmer køen kl. 08:00. Se lib/sendevindu.ts.
      */
      if (innenforVinduet(new Date())) await sendEpost1TilNyttLead(lead.epost);
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
