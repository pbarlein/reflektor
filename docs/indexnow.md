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

Noteres i `.indexnow-sist` og mellomlagres av GitHub Actions mellom
kjøringene. Skrives bare når innsendingen gikk: feiler den, står det gamle
tidspunktet, og de samme URL-ene prøves igjen ved neste utrulling. Å notere
uansett ville gjort én feil til et permanent hull.

Tømmes mellomlageret — det skjer etter en uke uten bruk — sendes alt på nytt
én gang. Akseptabelt, og langt bedre enn å sende alt hver gang.

## Feiler aldri noe

Jobben står utenfor CI, og skriptet avslutter med 0 også når IndexNow svarer
med feil. 200 og 202 er OK; 403 betyr at nøkkelfila ikke stemmer, 422 at en
URL ikke hører til verten. Begge er feil i oppsettet her, ikke hos Bing, og
står i jobbloggen.
