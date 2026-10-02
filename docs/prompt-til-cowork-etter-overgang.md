# Prompt til Cowork: sjekklista før vi sier oss ferdige

Kopier alt mellom strekene inn i Cowork. Logg først inn i Gmail, HubSpot,
Google Analytics, Search Console, Google Ads, GTM, Meta Business og
Squarespace i nettleseren.

Punkt 1 og 2 er de eneste som haster. Resten kan tas i løpet av uka.

---

Nettsiden reflektor.no ble flyttet fra Squarespace til Vercel i dag,
2. oktober 2026. Selve siden er kontrollert og virker: alle sider svarer,
alle 57 omdirigeringer er riktige, e-post-DNS er intakt og sikkerheten står.

Det som gjenstår er ting som krever innlogginger jeg ikke har. Gå gjennom
punktene i rekkefølge og rapporter funn etter hvert.

**Ikke endre noe i DNS. Ikke si opp Squarespace-abonnementet.** Begge deler
skal stå til vi har sett at alt virker over tid.

## 1. Kom leadet fram på e-post? (haster)

Pål fylte ut kontaktskjemaet på reflektor.no tidligere i dag.

Søk i Gmail etter e-post til `pal@reflektor.no` fra avsender
`skjema@reflektor.no`, sendt i dag. **Sjekk også spam og «Alle e-poster».**

Dette er nytt i dag: avsenderadressen ble byttet ved overgangen, og
leveransen går nå gjennom Resend. Første dag med en ny avsender er den dagen
e-post havner i spam.

Rapporter: kom den fram, og lå den i innboksen eller i spam? Ta med hele
innholdet i e-posten, inkludert linja som begynner med «Kilde:».

Havnet den i spam: marker den som «ikke spam», og si fra — da må vi se på
oppsettet.

## 2. Havnet leadet i HubSpot? (haster)

Åpne HubSpot og se på kontakter sortert etter nyeste først.

Den nyeste kontakten jeg kan se er fra klokka 09:58 i dag. Fant Pål sitt
testskjema veien inn etter det?

Søk også på e-postadressen Pål brukte i testen.

Dette er viktig fordi skjemaet på den nye siden sender leadet på e-post, mens
HubSpot fanger det opp på en annen måte — gjennom sporingsskriptet. Virker
ikke det lenger, mister dere leads i CRM-en uten at noe annet ser galt ut.

Rapporter: finnes kontakten, og når ble den opprettet?

## 3. Google Analytics — i morgen, ikke i dag

GA4 henger etter på inneværende dag, så i dag sier tallene ingenting.

**I morgen:** åpne GA4 for Reflektor og sjekk at hendelsen `takk_page_view`
er registrert for 2. oktober. Den har gått jevnlig gjennom hele september.

Er den der: alt er i orden, og vi er ferdige.
Er den **ikke** der: si fra til Claude Code med en gang. Det er den eneste
KPI-en, og da må oppsettet i GA4 undersøkes.

## 4. Google Search Console

1. Bekreft at `reflektor.no` ligger som **domeneegenskap**, ikke bare som
   URL-prefiks.
2. Bekreft at `https://www.reflektor.no/sitemap.xml` er sendt inn, og at den
   er lest uten feil. Den skal inneholde 31 adresser.
3. Be om indeksering av forsiden.
4. Se på «Sider»-rapporten. En økning i «Side med omdirigering» er forventet
   og riktig — det er de gamle adressene. Alt annet som dukker opp som feil,
   rapporter.

## 5. Google Tag Manager

I containeren finnes en utløser som fyrer når noen klikker et element med
teksten **«ACCEPT»**. Den er arvegods fra Squarespace-bannerets knapp. Den
nye sidens knapp heter «Godta alle», så utløseren treffer aldri.

Den er ufarlig, men den er død vekt. Slett den, eller sett den som
deaktivert.

**Ikke rør noe annet i containeren**, og ikke lag nye utløsere. Særlig: ikke
lag en utløser på hendelsen `takk_page_view`. Konverteringen lages inne i
GA4, og en utløser i tillegg ville talt hver lead to ganger.

## 6. Google Ads

Kontoen er pauset, men sjekk likevel:

1. At ingen annonser fortsatt peker på `/sosiale-medier-byra`.
2. At konverteringen «Takkeside - Gads Conversion» fortsatt står som aktiv
   og er knyttet til riktig nettsted.

Rapporter hva du finner. Ikke skru på kontoen.

## 7. Meta

Meta-annonsering er i drift.

1. I Lead Ads-skjemaene: lenka til personvernerklæringen peker trolig på
   `reflektor.no/privacypolicy`. Den adressen virker — den sender videre —
   men Meta liker best en adresse som svarer direkte. Bytt den til
   `https://www.reflektor.no/personvern`.
2. Sjekk at ingen aktive annonser peker på adresser som nå sender videre.

## 8. Squarespace

**Ikke si opp noe.** Den gamle siden skal stå som reserve i minst noen uker.

Men sjekk én ting: er den gamle siden fortsatt tilgjengelig på en egen
Squarespace-adresse, av typen `noe.squarespace.com`? Er den det, kan Google
finne den og tro at vi har to like nettsteder.

Finner du en slik adresse, si fra med adressen. Ikke slett noe.

## 9. Google-bedriftsprofilen

Åpne bedriftsprofilen og bekreft at nettadressen står som `reflektor.no` og
fører til den nye siden. Den skal være uendret, men den er verdt et blikk.

## Rapporter tilbake

Svar punktvis, med funn per punkt. Si tydelig fra om noe ikke stemmer,
særlig på punkt 1 og 2 — der ligger leadene.

---
