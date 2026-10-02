# Etter cutover, runde 2 — 2. oktober 2026

Fem ting bestilt etter at reflektor.no gikk over til Vercel. Alle utført i
én runde, alle verifisert. Sjekkrunden (`npm audit`, `tsc --noEmit`, `lint`,
71 tester, `content:check`, `bekreft:check`, bygg med indeksering på,
`lenkesjekk`) var grønn før push.

Se `docs/cutover.md` for hva som ble gjort selve cutover-dagen.

## 1. Leads går nå rett til HubSpot fra serveren

**Problemet.** Et lead havnet i HubSpot bare via sporingsskriptet i
nettleseren — HubSpots «collected forms», altså HubSpot som leser av et
skjema det ikke eier. To konsekvenser: leadet forsvant for alle som
blokkerer sporing, og CRM-oppføringen kunne ikke gjøres avhengig av
samtykke uten å miste leads fra dem som sier nei.

**Løsningen.** `src/app/api/skjema/route.ts` sender nå hvert lead til
HubSpots Forms API v3 fra serveren, i tillegg til e-posten. Koden ligger i
`src/lib/hubspot.ts`.

- Portal `148641188` (EU), skjema «reflektor.no – kontaktskjema (API)»,
  GUID `ca67f6ca-0e02-433f-85bb-7f0825ccf60d`. Begge er offentlige
  identifikatorer, ikke hemmeligheter, og står derfor i koden med en
  kommentar om opprinnelse — ikke i en miljøvariabel.
- Feltene: `email`, `firstname`, `lastname`, `company`, `phone`,
  `message`, `nettside_kilde`. Alle sju er kontrollert mot HubSpot
  02.10.2026 og finnes med presis de interne navnene.
- `nettside_kilde` bærer samme streng som «Kilde» i lead-e-posten — UTM,
  gclid, referrer og landingsside fra besøkets første sidevisning. Det er
  det eneste feltet som sier hvilken annonse leadet kom fra.
- Navnet deles på FØRSTE ord: «Pål Erik Barlein» blir «Pål» + «Erik
  Barlein». Vi kan ikke vite hvilket mellomnavn som er hva, og en gjetning
  som deler feil står i CRM-et for alltid.
- `hubspotutk` leses fra cookien når den finnes, så innsendingen knyttes
  til besøket. **IP-adressen sendes ikke** — det eneste vi kunne sendt
  herfra er Vercels egen.

**Tre ting som ikke kan gå galt, og hvorfor:**

1. **Besøkende merker ingenting.** Kallet skjer i `after()`, altså etter at
   303-svaret er sendt. Ventetiden før `/takk` er uendret, og `/takk` er
   der GA4-hendelsen og Ads-konverteringen ligger.
2. **`after()` kan ikke velte svaret.** Den kaster hvis den kalles utenfor
   en forespørselskontekst (verifisert). Kallet er derfor pakket i
   `try/catch` med en fallback uten venting. Regelen i fila står: svaret er
   ALLTID 303 til `/takk`.
3. **HubSpot-feil kaster ikke.** De logges med statuskode og HubSpots egen
   feilbeskrivelse, så de er lesbare i Vercel-loggen uten å kjenne koden.
   Personopplysninger logges ikke — bare hvilken side leadet kom fra.

**Dobbeltregistrering er stengt.** Kontaktskjemaet er merket
`data-hs-do-not-collect="true"`, så HubSpots avlesning i nettleseren ikke
oppretter samme kontakt en gang til.

**Arbeidsflyten «Nytt lead – inbound (nettside + Meta)»** starter på
«Recent conversion date is known» og fyrer også på innsendinger herfra.
Den er ikke rørt.

**Dette låser opp samtykkejobben i GTM.** CRM-et avhenger ikke lenger av
sporingsskriptet, så HubSpot-taggen kan settes bak samtykke uten at ett
lead går tapt. Framgangsmåten står i `docs/gtm-samtykke.md`.

## 2. De to siste 404-ene fra Search Console

Search Console rapporterte 18 404-er dagen etter cutover. Seksten var
dekket av redirect-kartet. De to siste er lagt inn, og **begge er
kontrollert mot live først** — begge svarer 404 — slik regel 1 i AGENTS.md
krever:

| Adresse | Mål | Hvorfor det målet |
|---|---|---|
| `/produktfoto` | `/innholdsproduksjon` | Samme mål som `/tjenester/produktfoto`. Det er dit Google allerede har konsolidert produktfoto-adressene. Tjenesten er avviklet. |
| `/gratis-strategimote-kontaktskjema` | `/kontaktoss` | Samme mål som `/gratis-strategimote`, som den hørte til. Skjemaet står der nå. |

Begge er 301, begge har begrunnelsen i `next.config.ts`, og begge er dekket
av en ny test i `tests/redirects.test.ts` som sier hvorfor de finnes.

## 3. Canonical på `/personvern`

Den manglet, og `/personvern` var den eneste indekserbare siden uten.
Konsekvensen er konkret: uten canonical er hver variant av adressen sin egen
side for Google — og personvernerklæringen er nettopp den siden som får
påhengte parametere, fordi den lenkes fra bunnteksten på alle sider,
inkludert annonselandingssidene der adressen bærer `gclid` og `utm`.

## 4. Samtykket går nå også til Microsoft Clarity

Clarity leser **hverken** Google Consent Mode eller dataLayer. Den tar opp
sesjonen — museflytting, klikk, rulling — setter egne cookies, og fyrer i
dag på `gtm.js`, altså hver sidevisning, uten noen samtykkebetingelse.

Nå kalles Clarity sin egen `consentv2`-API fra to steder: oppstartsskriptet
i `<head>` (`src/lib/samtykke.ts`) og banneret
(`src/components/Samtykke.tsx`).

- **Nøklene har stor S:** `ad_Storage` og `analytics_Storage`, ulikt
  Googles `ad_storage`. Verifisert mot Microsofts egen dokumentasjon
  02.10.2026. En liten s gir et kall Clarity ignorerer, uten feilmelding
  noe sted. En test holder på dette.
- **Signalet sendes ALLTID**, også for den som ikke har svart — da med
  `denied` på begge. Clarity skiller ikke mellom «sa nei» og «har ikke
  svart»; den skiller mellom «har et signal» og «har ikke noe». Uten signal
  kjører den som før, med cookies. Fra 31.10.2025 håndhever den dessuten et
  krav om signal for besøk fra EØS.
- **Kallet overlever at Clarity lastes etterpå.** Clarity lastes asynkront
  av GTM, og samtykket er kjent før det. Skriptet i `<head>` oppretter
  derfor samme kø Clarity selv bruker (`clarity.q`), og det lastede
  skriptet tømmer køen når det kommer. Alternativet — å gjenta kallet på en
  hendelse og håpe at Clarity var lastet — avhenger av rekkefølge. Køen gjør
  ikke det.
- **Forbehold:** signalet respekteres bare hvis Clarity-prosjektet
  (`rkgf0frfdt`) er satt opp til å kreve samtykke. Er det ikke det, er
  kallet uskadelig, men virkningsløst.

Clarity-taggen bør fortsatt settes bak samtykke inne i GTM, for opptaket i
seg selv. **Apollo er nå den eneste av de tre som ikke har noen annen bryter
enn GTM.**

## 5. RSS-feed for bloggen

Squarespace serverte feeden på `/blogg?format=rss` — deres egen konvensjon.
Etter cutover svarte adressen med HTML-oversikten i stedet: en feed som ikke
lenger var en feed, uten at noe meldte fra. Alt som abonnerte, sluttet stille
å virke.

- Feeden ligger nå på `/blogg/rss.xml`, generert fra samme kilde som
  bloggoversikten (`src/content/artikler.ts`). Ingen copy finnes bare der,
  og en ny artikkel havner i feeden uten at noen må huske det.
- `/blogg?format=rss` 301-er dit. **Betingelsen `has: format=rss` er det
  som gjør redirecten trygg** — `/blogg` uten parametere treffes ikke, og
  oversikten står urørt. Den er en live side med organisk trafikk, og en
  ubetinget redirect herfra ville vært nøyaktig det regel 1 forbyr. En test
  holder på betingelsen.
- `<link rel="alternate" type="application/rss+xml">` i bloggens metadata,
  slik at en RSS-leser finner feeden fra bloggadressen alene.
- Fire tester dekker gyldig og balansert XML, escapede ampersander,
  absolutte URL-er, RFC 822-datoer og sortering nyest først.
- `lastBuildDate` er den nyeste artikkelens dato, **ikke byggetidspunktet**.
  En feed som sier «ny i dag» hver gang vi deployer en knappefarge er en
  usann påstand. Samme regel som for `publisert`.
- Feeden er stengt når indeksering er avslått, som `/llms.txt`. En feed er
  en invitasjon til å republisere innhold, og skal ikke stå åpen på en
  forhåndsvisning.

## Rettet underveis: tallet 481, en tredje og fjerde gang

AGENTS.md regel 3 ble rettet 02.10.2026: begrunnelsen for å beholde
bloggens URL-er var feil. Det sto at bloggen bærer «~481 refererende
domener». Tallet var **domenets**, ikke bloggens — hele `/blogg`-stien har
**3** levende refererende domener. Grunnen til å beholde URL-ene er
søkesynlighet: artiklene rangerer på ord folk søker på, og aliaset
`/blogg/hvordan-markedsfore-bedrift` har alene 41 279 visninger.

Påstanden sto fortsatt i koden, på tre steder som ikke ble fanget da:

- `src/content/site.ts`, i hodet over `bloggSlugs`
- `src/content/artikler.ts`, i filhodet
- `next.config.ts`, i kommentaren om at `/blogg/[name] → /blogg` ikke er
  kopiert

Alle tre er rettet, med rettelsen stående igjen som historikk. **Regelen
står — bare begrunnelsen var feil.**

En fjerde rettelse i `tests/samtykke.test.ts`: en kommentar sa «de fem
taggene — Meta, Apollo, HubSpot, Clarity, Microsoft Ads». Det er **tre**.
Meta-pikselen var injisert av Squarespace og forsvant ved cutover, og
Microsoft Ads finnes ikke i containeren i det hele tatt. Rettet
`docs/gtm-samtykke.md` 27.09.2026, men ikke testen.

## Verifisert på live etter push

Se avsnittet nederst for målingene. Én testinnsending ble sendt fra en ekte
nettleser med `?utm_source=test&utm_medium=grunnmur`, for å se hele kjeden:
skjema → e-post → HubSpot → `/takk`.
