# IndexNow

## Hva det er, og hva det ikke er

IndexNow lar et nettsted si fra til søkemotorene når en side har endret seg,
i stedet for å vente på at de kommer innom. **Google deltar ikke.** Bing gjør
det — og ChatGPT-søk og Copilot henter fra Bings indeks, så dette handler om
synlighet i AI-svar, ikke om Google-rangeringer.

Ahrefs meldte 08.10.2026 at 35 endrede sider ikke var sendt inn. Det fantes
ingen nøkkel på nettstedet.

## Nøkkelen

`112ad7a7fb0db495883f6cf5c77dbc3f`, laget 08.10.2026. Den står ett sted i
koden (`src/lib/indexnow.ts`) og ligger som fil på
`https://www.reflektor.no/112ad7a7fb0db495883f6cf5c77dbc3f.txt`.

**Nøkkelen er ikke hemmelig.** Det er hele mekanismen: Bing henter fila og
sammenligner innholdet med nøkkelen i forespørselen. Det den beviser, er at
avsenderen har skriveadgang til nettstedet. Derfor ligger den i koden og ikke
i en miljøvariabel.

En test holder konstanten og fila sammen. Kommer de i utakt, svarer IndexNow
403 — og det er den eneste måten feilen viser seg på.

## Når det sendes

GitHub Actions-jobben `IndexNow` kjører på `deployment_status` når Vercel
melder at en **produksjons**utrulling er vellykket. Ikke under bygget: å melde
fra om en side før den er ute er verre enn ikke å melde fra, fordi Bing da
henter den gamle versjonen og ikke kommer tilbake med det første.

## Hvilke URL-er

De i sitemapet med `lastmod` nyere enn forrige vellykkede innsending. Første
gang: alle. En URL uten `lastmod` sendes alltid — vi kan ikke si noe om den,
og å utelate den ville skjult den for Bing på ubestemt tid.

Ingenting som ikke står i sitemapet sendes. En URL vi ikke selv mener er verdt
å indeksere, skal ikke dyttes inn i en søkemotor.

**`lastmod` hos oss er håndholdt.** Se `SIST_ENDRET` i `src/app/sitemap.ts`:
datoen endrer seg når noen setter den, ikke ved hver utrulling. Det er en
styrke her — vi spammer ikke Bing med 35 URL-er hver gang en knapp flytter seg
— men det betyr også at **en reell innholdsendring ikke blir meldt hvis
`SIST_ENDRET` ikke oppdateres**. Endrer du tekst på en side, sett datoen.

## Tidspunktet for forrige innsending

Hentes fra GitHub: når kjørte denne arbeidsflyten sist uten feil. Ingenting
lagres, og ingenting kan komme i utakt.

**Her sto `actions/cache` først, og den virket ikke.** Første kjøring
08.10.2026 logget «The event type deployment_status is not supported because
it's not tied to a branch or tag ref» — mellomlageret kan ikke skrives på et
slikt event. Jobben så vellykket ut, men tidspunktet ble aldri lagret, og da
ville alle 34 URL-ene gått inn på nytt ved hver eneste utrulling. Det er den
ene tingen IndexNow ber oss la være.

## Når jobben blir rød

Når IndexNow svarte med feil — og da skal den være rød. Neste kjøring leser
tidspunktet fra forrige *vellykkede* kjøring, så de samme URL-ene prøves om
igjen. En jobb som alltid ble grønn ville gjort én feil til et permanent
hull: de sidene ville aldri blitt meldt.

Jobben står utenfor CI, så en rød markering stopper verken bygget eller
utrullingen. Siden er for lengst ute når dette kjører.

200 og 202 er OK. 403 betyr at nøkkelfila ikke stemmer, 422 at en URL ikke
hører til verten — begge er feil i oppsettet her, ikke hos Bing.
