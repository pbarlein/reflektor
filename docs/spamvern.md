# Bot-sperre på kontaktskjemaet (11.10.2026)

## Hva som skjedde

Tre falske innsendinger 10.–11.10.2026 gikk rett forbi honningkrukka og
fartssjekken. Botten kjører JavaScript, lar det skjulte feltet stå tomt og
bruker mer enn tre sekunder — altså oppfører den seg som et menneske.

Kjennetegnene lå i **innholdet**: amerikansk telefonnummer, engangsadresse
(`smaqt.com`) eller tilfeldig yahoo-adresse, bedriftsnavn generert av et
navnebibliotek («Koss - Grady», «Metz, Waelchi and Corkery»), og en melding
på engelsk uten innhold.

## To vern som tar hver sin halvdel

**Turnstile** måler nettleseren, ikke teksten. Den tar botten som skriver
feilfritt norsk fra en norsk IP — den scoren aldri ville sett.

**Spam-scoren** leser innholdet. Den tar botten som slipper forbi Turnstile,
og den virker fra første utrulling, uten nøkler.

## Spam-scoren

| Treff | Poeng |
|---|---|
| Honningkrukke utfylt, eller innsending under 3 sekunder | 3 |
| Telefon utfylt og ikke norsk | 2 |
| `x-vercel-ip-country` er satt og ikke NO/SE/DK | 2 |
| Engangsadresse, eller domenet mangler MX | 2 |
| Melding over 15 tegn uten æøå og uten vi/dere/og/til/med/kan/hjelp | 1 |
| Bedriftsnavn som `X - Y` eller `X, Y and Z` | 1 |

**≥ 3 → blokkert.** 303 til `/takk` som alle andre — et annet svar ville
fortalt botten hva som avslørte den. Ingen kontakt i HubSpot, ingen varsel,
ingen e-post til avsenderen.

**1–2 → flagget.** Kontakten opprettes som før, varselet får linja
«⚠ Mulig spam (…) – sjekk før oppfølging» øverst, og `paminnelse_avbrutt`
settes så hverken e-post 1 eller påminnelsen går automatisk. Knappen «Skriv
til \<fornavn\>» står som før.

**0 → uendret flyt.**

### Hvorfor en score og ikke en regel

Hvert kjennetegn finnes på ekte leads også: en norsk kunde kan sitte i
Spania, og «Photos» er en ekte henvendelse — kontakt 882819192046 skrev
nettopp det. Det er kombinasjonen som er usannsynlig. En hard regel på ett
av dem ville kastet ekte henvendelser, og på en side der skjemaleads er
eneste KPI er det den dyreste feilen vi kan gjøre.

Derfor gir en manglende opplysning alltid **null**: mangler landheaderen,
eller svarte ikke DNS, koster det ingenting. En feil hos oss skal aldri
koste noen en henvendelse.

### Tørrkjøring

| Innsending | Score | Utfall |
|---|---|---|
| Koss - Grady / smaqt.com / US | 6 | blokkert |
| Metz, Waelchi and Corkery / yahoo / US | 6 | blokkert |
| Hills - Johnston / smaqt.com / uten land | 4 | blokkert |
| 886794200262 Iver, Lokk as | 0 | ok |
| 882819192046 Marisol, La. MEXICANA As | 0 | ok |
| 888337466559 Golnaz, Natulahland | 0 | ok |

**De tre falske kontaktene var slettet da dette ble bygget.** HubSpot svarer
`notFound` på alle tre ID-ene (888069876941, 888274653411, 888251445478) —
Pål ryddet dem først. Radene over er derfor bygget opp fra beskrivelsen i
bestillingen, ikke hentet. De ekte er hentet.

**Engangslista fanger ikke `smaqt.com`.** Kontrollert mot pakken
`disposable-email-domains`, 121 570 domener: verken `smaqt.com` eller
`yahoo.com` står der. De to poengene uteblir altså for akkurat disse, og de
blokkeres likevel på nummer, språk og navn. MX-delen av samme regel kunne
tatt dem, men DNS er ikke tilgjengelig fra utviklingsmiljøet, så det er
ikke etterprøvd.

## To feil som ble fanget før utrulling

Begge var mine, og begge var stille — koden kjørte videre og meldte ingenting.

### Engangslista lastet ikke i det hele tatt

Importen gikk på pakkenavnet. Pakkas `main` peker rett på `index.json`, og
et `await import()` av en JSON-modul krever `with { type: "json" }` i Node.
Uten det kaster importen `ERR_IMPORT_ATTRIBUTE_MISSING`, og `catch`-grenen
satte lista til et tomt sett. Regelen ville svart «nei, ikke engangsadresse»
på hver eneste adresse, for alltid, uten å feile.

Rettet ved å importere `disposable-email-domains/index.js` — CommonJS, som
gjør `require('./index.json')` og virker både i Node og i bygget. En egen
typeerklæring ligger i `src/engangsadresser.d.ts`, og `lib/spamoppslag.ts`
logger nå også hvis lista kommer tom.

**Etterprøvd i produksjonsbygget**, ikke bare i testene: en innsending fra
`kari@mailinator.com` gir `SKJEMA: score=2 treff=[engangsadresse]
resultat=flagget`.

### MX-regelen ville gitt to poeng til alle i et miljø uten DNS

`dns.resolveMx` svarer `ENODATA` på *alt* i et miljø uten fungerende
resolver — også på `gmail.com`. Målt her 11.10.2026. ENODATA ble lest som
«domenet tar ikke imot e-post», altså to poeng, og i et slikt miljø ville
hvert eneste lead fått dem. To myke treff i tillegg, og et ekte lead ville
blitt blokkert.

Rettet med et kontrollspørsmål: før et negativt svar godtas, spørres et
domene som alltid har MX (`gmail.com`). Svarer også det negativt, virker
ikke resolveren, og regelen gir `null` — null poeng. Det koster ett ekstra
oppslag, og kun når svaret var negativt.

### Testene talte hverandres kall

Tre tester feilet om hverandre fra kjøring til kjøring, uten at koden de
testet var feil. To uavhengige årsaker:

- **Mengdebegrensningen i ruta slipper gjennom fem per klientnøkkel**, og
  nøkkelen er `x-forwarded-for` — eller «ukjent» når headeren mangler. Alle
  testene i `tomskjema.test.ts` delte derfor kvote, og den sjette og sjuende
  ble stoppet av mengdegrensen i stedet for av det de testet. Hver
  innsending får nå sin egen IP.
- **Pausene som ventet på `after()` var faste, på 50 og 100 ms.** Da
  engangslista begynte å laste for ekte, tok arbeidet 86 ms mer, og kallene
  fra én test ble talt i den neste. `tests/etterpa.ts` laster nå lista før
  målingen begynner og venter på et resultat i stedet for på klokka.

## Turnstile

Usynlig widget (`interaction-only`) på kontaktskjemaet. Ruta verifiserer
tokenet mot Cloudflare før noe annet skjer i `after()`.

- **Uten nøkler gjør den ingenting.** Widgeten rendres ikke, og ruta logger
  `TURNSTILE: ikke konfigurert`. Skjemaet virker som før.
- **Et avvist token blokkerer alene**, uavhengig av scoren.
- **Et kall som ikke når fram slipper gjennom.** Er Cloudflare nede, skal
  ikke alle henvendelser forsvinne — da bærer scoren alene, og en logglinje
  sier hva som skjedde.

### Nøklene må legges inn, og så må det rulles ut på nytt

`TURNSTILE_SITE_KEY` og `TURNSTILE_SECRET_KEY` i Vercel. Site key-en leses
av sidene som rendrer skjemaet, og **både `/` og `/kontaktoss` er statiske**
— verdien bakes inn ved bygging. En ny utrulling må derfor til etter at
nøklene er lagt inn.

### Samtykke og CSP

**Ingen endring var nødvendig, og det er verdt å vite hvorfor.**

Prosjektets CSP er `frame-ancestors 'self'` og ingenting mer — det finnes
ingen `script-src`, `frame-src` eller `connect-src` å utvide.
`challenges.cloudflare.com` var aldri blokkert.

Samtykkebanneret styrer Googles Consent Mode-signaler gjennom GTM; det
blokkerer ikke skript generelt. Turnstile lastes direkte av vår egen
komponent, ikke gjennom GTM, og faller uansett under `security_storage`,
som alltid står på. Den er nødvendig funksjonalitet, ikke sporing.

## Riktig land på kontakten

HubSpot viste «Ashburn, US» på hvert eneste nettsidelead, også de norske.
Det er ikke besøkende — det er Vercel-funksjonen som sender innsendingen, og
den står i Virginia.

Integrasjonen bruker **Forms API**, så løsningen er `context.ipAddress`:
første adresse i `x-forwarded-for` sendes med innsendingen, og HubSpot
regner land og by ut fra den. Egenskapen `besokende_land` var alternativet
for en CRM-API-integrasjon og trengs ikke her.

## Loggen

Én linje per innsending:

```
SKJEMA: score=<n> treff=[…] resultat=ok|flagget|blokkert
```

Blokkerte får i tillegg `SKJEMA BLOKKERT: score=<n> treff=<liste> epost=<domene>`,
og flaggede en linje om oppfølgingen ble slått av.

## Hvor vurderingen skjer

Alt ligger i `after()`, etter at svaret er sendt. Turnstile-kallet,
DNS-oppslaget og lista på 121 570 domener koster tid, og ingen av delene
skal den besøkende vente på. Svaret er 303 til `/takk` uansett hva vi kommer
fram til.

## Det som er verdt å følge med på

**Turnstile kan ikke lastes av alle.** Blokkerer noe skriptet fra
`challenges.cloudflare.com`, kommer det ikke noe token, og innsendingen
blokkeres. Risikoen er lav — nettleserutvidelser slipper som regel gjennom
captcha-tjenester — men den er reell, og den oppstår først den dagen
nøklene legges inn. Loggen skiller `turnstile-avvist` fra de andre
treffene, så det vil synes.
