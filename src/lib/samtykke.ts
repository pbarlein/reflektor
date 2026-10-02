/**
 * Samtykke til informasjonskapsler og sporing.
 *
 * BAKGRUNNEN står i A42 i docs/vedlegg-a.md: siden lastet GTM, GA4 og en
 * Meta-piksel ved hver sidelasting, uten å spørre om noe. Dagens
 * reflektor.no har banner; den nye hadde ingenting.
 *
 * DENNE FILA ER REN LOGIKK. Ingen React, ingen DOM utenom cookie-strengen,
 * ingen avhengigheter. Det er derfor den kan testes — se
 * tests/samtykke.test.ts — og det er viktig her, fordi en feil i akkurat
 * dette er usynlig: siden ser helt lik ut enten samtykket virker eller ikke.
 *
 * TO KATEGORIER, IKKE FEM. Reflektor har GA4 og Google Ads (analyse og
 * markedsføring) og en Meta-piksel (markedsføring). Flere kategorier ville
 * gitt brukeren valg som ikke tilsvarer noe som faktisk kjører, og
 * valgmuligheter uten innhold er verre enn ingen.
 */

export type Kategori = "analyse" | "markedsforing";

export type Samtykke = Record<Kategori, boolean>;

export const KATEGORIER: readonly Kategori[] = ["analyse", "markedsforing"];

export const INGEN_SAMTYKKE: Samtykke = {
  analyse: false,
  markedsforing: false,
};

export const FULLT_SAMTYKKE: Samtykke = {
  analyse: true,
  markedsforing: true,
};

/**
 * Cookienavn og -format.
 *
 * EGEN COOKIE OG IKKE localStorage, av to grunner. Den kan leses av et
 * bittelite skript i <head> før noe annet kjører, slik at banneret ikke
 * blinker for den som allerede har svart. Og den følger med til serveren om
 * vi noen gang trenger den der.
 *
 * Selve samtykkecookien krever ikke samtykke: den er strengt nødvendig for
 * en funksjon brukeren har bedt om — å huske svaret.
 *
 * FORMATET ER VERSJONERT. «1.10» betyr versjon 1, analyse ja,
 * markedsføring nei. Grunnen til versjonstallet er konkret: legger vi til
 * en kategori senere, er et gammelt samtykke ikke lenger informert, og da
 * må vi spørre på nytt. Uten versjon ville vi ikke kunne skille.
 */
export const COOKIE_NAVN = "reflektor_samtykke";
export const COOKIE_VERSJON = 1;

/** Tolv måneder. Etter det spør vi på nytt. */
export const COOKIE_LEVETID_SEK = 60 * 60 * 24 * 365;

export function serialiser(s: Samtykke): string {
  return `${COOKIE_VERSJON}.${s.analyse ? 1 : 0}${s.markedsforing ? 1 : 0}`;
}

/**
 * Leser en lagret verdi. Returnerer `null` når det ikke finnes et gyldig
 * svar — og da skal banneret vises.
 *
 * Ugyldig og manglende behandles likt, med vilje: en halvveis tolket
 * verdi ville gitt et samtykke ingen har gitt.
 */
export function parse(verdi: string | null | undefined): Samtykke | null {
  if (!verdi) return null;
  const treff = /^(\d+)\.([01])([01])$/.exec(verdi.trim());
  if (!treff) return null;
  if (Number(treff[1]) !== COOKIE_VERSJON) return null;
  return { analyse: treff[2] === "1", markedsforing: treff[3] === "1" };
}

/** Plukker verdien ut av en hel document.cookie-streng. */
export function lesFraCookiestreng(cookie: string): Samtykke | null {
  for (const bit of cookie.split(";")) {
    const skille = bit.indexOf("=");
    if (skille < 0) continue;
    if (bit.slice(0, skille).trim() !== COOKIE_NAVN) continue;
    return parse(decodeURIComponent(bit.slice(skille + 1)));
  }
  return null;
}

/**
 * Google Consent Mode v2.
 *
 * De fire første signalene er de Google faktisk krever av annonsører med
 * EØS-trafikk siden mars 2024. `security_storage` er alltid innvilget — den
 * dekker ting som svindelbeskyttelse og er strengt nødvendig.
 *
 * `functionality_storage` og `personalization_storage` står som nektet
 * fordi ingenting på siden bruker dem. Å innvilge et signal vi ikke bruker
 * ville vært et løfte vi ikke har dekning for.
 */
export type Samtykkesignaler = Record<string, "granted" | "denied">;

export function tilSignaler(s: Samtykke): Samtykkesignaler {
  const analyse = s.analyse ? "granted" : "denied";
  const marked = s.markedsforing ? "granted" : "denied";
  return {
    ad_storage: marked,
    ad_user_data: marked,
    ad_personalization: marked,
    analytics_storage: analyse,
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  };
}

/**
 * Microsoft Clarity har sin egen samtykke-API. Lagt til 02.10.2026.
 *
 * HVORFOR DEN TRENGS. Clarity leser ikke Google Consent Mode. Den tar opp
 * sesjonen — museflytting, klikk, rulling — og setter egne cookies, og den
 * fyrer i dag på `gtm.js`, altså hver sidevisning, uten noen
 * samtykkebetingelse. Fram til samtykkekontrollen er satt på taggen inne i
 * GTM (framgangsmåten står i docs/gtm-samtykke.md) er dette kallet det
 * eneste som forteller Clarity hva brukeren har svart.
 *
 * Fra 31.10.2025 håndhever Clarity dessuten et krav om samtykkesignal for
 * besøk fra EØS, Storbritannia og Sveits. Uten signal kjører den i
 * «no-consent mode»: ingen cookies, og én tilfeldig ID per sidevisning i
 * stedet for en sesjon. Verifisert mot Microsofts egen dokumentasjon
 * 02.10.2026 — API-et heter `consentv2`, og nøklene har stor S:
 * `ad_Storage` og `analytics_Storage`. Det eldre `clarity("consent", true)`
 * er på vei ut og skal ikke brukes.
 *
 * KARTLEGGINGEN TIL VÅRE TO KATEGORIER er den samme som for Google:
 * opptaket er analyse, cookien som følger brukeren på tvers av sesjoner er
 * det Clarity selv kaller ad_Storage.
 */
export type Claritysignaler = {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
};

export function tilClaritysignaler(s: Samtykke): Claritysignaler {
  return {
    ad_Storage: s.markedsforing ? "granted" : "denied",
    analytics_Storage: s.analyse ? "granted" : "denied",
  };
}

/**
 * Et vindu-lignende objekt, nok til å melde fra til Clarity. Gjør funksjonen
 * under testbar uten nettleser.
 */
export type Clarityko = { (...a: unknown[]): void; q?: unknown[] };

export type Clarityvindu = { clarity?: Clarityko };

/**
 * Sender signalet til Clarity, og sørger for at det overlever at Clarity
 * lastes etterpå.
 *
 * DETTE ER DET IKKE-OPPLAGTE. Clarity lastes av GTM, asynkront, og GTM
 * lastes `afterInteractive`. Samtykket er kjent før det: for den som
 * allerede har svart leses cookien i <head>, og for den som klikker i
 * banneret kan klikket komme før GTM er ferdig. Et kall på et
 * `window.clarity` som ikke finnes ennå ville bare forsvunnet, og Clarity
 * ville aldri fått signalet for den sidevisningen.
 *
 * LØSNINGEN ER KØEN CLARITY SELV BRUKER. Installasjonssnutten til Clarity
 * begynner med `c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}`
 * — altså: finnes `window.clarity` allerede, beholdes den, og det lastede
 * skriptet tømmer `clarity.q` når det kommer. Vi oppretter derfor samme
 * stubb først, slik at kallet ligger i køen Clarity selv vil tømme.
 *
 * Clarity pusher `arguments`; vi pusher argumentene som en array. Køen
 * tømmes med `apply`, som behandler de to likt — og en array er det
 * eneste av de to en moderne pilfunksjon kan lage.
 *
 * ALTERNATIVET VAR Å GJENTA KALLET PÅ EN HENDELSE og håpe at Clarity var
 * lastet da. Køen er det robuste valget fordi den ikke avhenger av
 * rekkefølge i det hele tatt: kommer Clarity aldri, ligger kallet ubrukt i
 * en array og gjør ingenting.
 *
 * FORBEHOLD, verdt å vite neste gang noen måler dette: signalet respekteres
 * bare hvis Clarity-prosjektet (`rkgf0frfdt`) er satt opp til å kreve
 * samtykke. Er det ikke det, er kallet uskadelig, men virkningsløst.
 */
export function meldTilClarity(vindu: Clarityvindu, s: Samtykke): void {
  let clarity = vindu.clarity;
  if (!clarity) {
    const ko: Clarityko = (...a: unknown[]) => {
      (ko.q = ko.q ?? []).push(a);
    };
    vindu.clarity = ko;
    clarity = ko;
  }
  clarity("consentv2", tilClaritysignaler(s));
}

/**
 * Skriptet som kjører FØR alt annet, i <head>.
 *
 * DET GJENTAR OGSÅ `samtykke_oppdatert` FOR GJENGANGERE, lagt til
 * 21.09.2026 etter måling. `meldFra()` i Samtykke.tsx sender den hendelsen
 * bare når noen aktivt klikker i banneret. Målt i nettleseren så
 * dataLayer slik ut på besøk nummer to, med cookien satt:
 *
 *   0: consent default {ad_storage:"granted", analytics_storage:"granted", …}
 *   1: set ads_data_redaction false
 *   2: set url_passthrough true
 *   3: gtm.js
 *
 * Ingen `samtykke_oppdatert`. Googles egne tagger klarer seg — de leser
 * consent-TILSTANDEN. Men taggene i containeren som ikke leser Consent Mode
 * i det hele tatt kan bare styres inne i GTM, og henges de på hendelsen,
 * ville de fyrt den ene gangen brukeren klikket og aldri mer for den
 * personen.
 *
 * RETTET 27.09.2026: her sto «de fem taggene (Meta, Apollo, HubSpot,
 * Clarity, Microsoft Ads)». Det er **tre**. Lest fra den publiserte
 * containeren og fra kildekoden til dagens side:
 *
 *   Apollo    appId 67f7a7f9f3af070015ab21b2
 *   Clarity   prosjekt rkgf0frfdt
 *   HubSpot   portal 148641188 (EU-hosting)
 *
 * Microsoft Ads finnes ikke noe sted — ingen UET-tagg, ingen `uetq`, ingen
 * bat.bing.com. Det som førte meg feil er at samtykkemalen i containeren har
 * `platform_microsoft: true`: den er konfigurert til å sende
 * Microsoft-signaler, men ingen tagg tar imot dem.
 *
 * Meta-pikselen (572759520853896) er injisert av Squarespace, ikke av GTM, og
 * forsvinner derfor av seg selv ved cutover. Se docs/gtm-samtykke.md.
 *
 * Gjentakelsen hører hjemme HER og ikke i en React-effekt: på besøk to
 * setter dette skriptet `data-samtykke="svart"` i <head>, så `Sporing`
 * rendrer GTM allerede ved første render. En effekt kunne kommet etter
 * `gtm.js`. Her er rekkefølgen garantert.
 *
 * `samtykke_kilde` skiller de to: "lagret" herfra, "valg" fra banneret.
 * Feltet er additivt — en utløser på hendelsesnavnet treffer begge.
 *
 * REKKEFØLGEN ER HELE POENGET. Consent Mode må være satt før GTM-containeren
 * kjører, ellers rekker taggene inni å fyre på en udefinert tilstand. Derfor
 * er dette en streng som legges inn med `strategy="beforeInteractive"`, mens
 * GTM lastes `afterInteractive`.
 *
 * FOR DEN SOM ALLEREDE HAR SVART settes det lagrede svaret som `default`,
 * ikke som en `update` etterpå. Google anbefaler det for tilbakevendende
 * brukere, og det fjerner vinduet der taggene ville sett «nektet» i et
 * øyeblikk før de fikk beskjed om noe annet.
 *
 * `ads_data_redaction` fjerner annonse-ID-er fra nettverkskall så lenge
 * ad_storage er nektet. `url_passthrough` lar Ads måle konverteringer via
 * URL-parametere i stedet for cookies når samtykke mangler — begge er
 * Googles egne anbefalinger, og begge beskytter målingen av skjemaleads
 * uten å lagre noe hos brukeren.
 *
 * `data-samtykke` på <html> er det banneret leser for å vite om det skal
 * vises. Å sette det her, synkront, er det som gjør at banneret ikke
 * blinker for den som allerede har svart.
 *
 * CLARITY-SIGNALET SENDES HERFRA OGSÅ, lagt til 02.10.2026, og det sendes
 * ALLTID — også for den som ikke har svart ennå. Da er begge nøklene
 * `denied`, og det er nettopp poenget: Clarity skiller ikke mellom «sa
 * nei» og «har ikke svart», den skiller mellom «har et signal» og «har
 * ikke noe». Uten signal kjører den som før, med cookies.
 *
 * Stubben som opprettes her er den samme køen `meldTilClarity()` over
 * bygger, og den opprettes med vilje i <head>: da finnes køen før GTM
 * laster Clarity-taggen, og rekkefølgen kan ikke gå galt.
 */
export function standardSkript(): string {
  return `
(function(){
  var d=document.documentElement;
  var v=null;
  try{
    var c=document.cookie.split(";");
    for(var i=0;i<c.length;i++){
      var e=c[i].indexOf("=");
      if(e<0)continue;
      if(c[i].slice(0,e).trim()!=="${COOKIE_NAVN}")continue;
      var m=/^(\\d+)\\.([01])([01])$/.exec(decodeURIComponent(c[i].slice(e+1)).trim());
      if(m&&Number(m[1])===${COOKIE_VERSJON})v={analyse:m[2]==="1",marked:m[3]==="1"};
      break;
    }
  }catch(_){}
  var a=v&&v.analyse?"granted":"denied";
  var g=v&&v.marked?"granted":"denied";
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag=window.gtag||gtag;
  gtag("consent","default",{
    ad_storage:g,ad_user_data:g,ad_personalization:g,
    analytics_storage:a,
    functionality_storage:"denied",personalization_storage:"denied",
    security_storage:"granted"
  });
  gtag("set","ads_data_redaction",g!=="granted");
  gtag("set","url_passthrough",true);
  window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};
  window.clarity("consentv2",{ad_Storage:g,analytics_Storage:a});
  if(v)window.dataLayer.push({
    event:"samtykke_oppdatert",
    samtykke_analyse:a,
    samtykke_markedsforing:g,
    samtykke_kilde:"lagret"
  });
  d.setAttribute("data-samtykke",v?"svart":"uavklart");
})();`.trim();
}
