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
 * Skriptet som kjører FØR alt annet, i <head>.
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
  d.setAttribute("data-samtykke",v?"svart":"uavklart");
})();`.trim();
}
