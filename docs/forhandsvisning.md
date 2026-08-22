# Se siden mens den bygges

Den nye siden bygges parallelt med at reflektor.no kjører videre på
Squarespace. Dette dokumentet forklarer hvordan du ser den underveis, og hva
som faktisk skal til for at noe går live.

## Squarespace er ikke i fare

Verdt å være presis om dette, for det er lett å bli nervøs av ordet «deploy»:

**Den eneste bryteren som flytter reflektor.no er DNS.** Så lenge domenet
peker på Squarespace, ligger dagens side urørt uansett hva vi gjør her.
Vercel-deployments lever på sine egne URL-er (`*.vercel.app`) til et domene
peker på dem.

Vi rører verken DNS eller Squarespace før du sier fra.

Den reelle risikoen er en annen, og den er håndtert: at en ferdig kopi av
siden blir **indeksert** og konkurrerer mot reflektor.no i søk. Se
«Indekseringssperren» under.

## Tre nivåer

### 1. Lokal utviklingsserver – mens du jobber

```bash
npm run dev
```

Åpne `http://localhost:3000`. Siden oppdateres i nettleseren i det sekundet en
fil lagres. Dette er det du har åpent mest.

Kjører du Claude Code i samme terminalvindu, trenger du et nytt: `Cmd + T`,
`cd` til mappen, og kjør `npm run dev` der.

### 2. Vercel preview – for å se det på ordentlig

Hver push til en branch gir en unik URL. Ekte hosting, ekte HTTPS, ekte
ytelse. Bruk den til mobiltesting, deling og Lighthouse.

**Oppsettet er en engangsjobb, og `npx vercel link` alene holder ikke.**
`vercel link` kobler bare mappen din til et Vercel-prosjekt lokalt. For at
push til GitHub skal utløse deploy må Git-integrasjonen på plass:

```bash
npx vercel login
npx vercel link          # oppretter/kobler prosjektet
npx vercel git connect   # kobler GitHub-repoet til prosjektet
```

Alternativt: opprett prosjektet i Vercel-dashboardet og importer repoet der.
Det gjør det samme, med færre steg å huske.

Preview-URL-en er ikke søkbar, men den er offentlig for alle med lenken. Vil
du stramme det inn, slå på Deployment Protection i prosjektinnstillingene.

### 3. Mobil

Enkleste vei er Vercel preview-URL-en – den virker overalt uten oppsett.

Vil du teste lokalt på telefonen:

```bash
npm run dev:mobil
```

Finn maskinens IP (Systeminnstillinger → Nettverk) og åpne
`http://192.168.x.x:3000` på telefonen. Krever samme wifi.

## Indekseringssperren

Vercel setter `X-Robots-Tag: noindex` på previews automatisk – men **ikke på
produksjonsdeployments**. Siden planen er å ha en ferdig produksjonsdeploy
liggende før DNS byttes, ville den vært indekserbar. Det er hullet vi har
lukket.

Standard er derfor: **alt er stengt for søkemotorer.**

```
User-Agent: *
Disallow: /
```

I tillegg får hver side `<meta name="robots" content="noindex, nofollow">`.

Sperren åpnes kun ved å sette miljøvariabelen bevisst – først når DNS faktisk
peker hit:

```
NEXT_PUBLIC_TILLAT_INDEKSERING=true
```

Logikken ligger i `src/lib/miljo.ts`. Den styrer også canonical-URL, slik at
previews ikke sender signaler til den levende Squarespace-siden.

## Ikke bedøm ytelse på `npm run dev`

Utviklingsserveren kjører ukomprimert og uoptimalisert – bilder, fonter og
caching oppfører seg annerledes enn i produksjon. Skal du måle:

```bash
npm run build && npm start
```

Eller bedre: mål på en Vercel preview. Ellers jager du problemer som ikke
finnes i produksjon.

## Branch-disiplin

Arbeidet skjer på `claude/reflektor-new-website-10fmt0`. Push til `main`
utløser en produksjonsdeploy i Vercel. Det treffer fortsatt ikke reflektor.no
uten DNS-endring, men hold arbeidet på branchen til siden er klar.

## Sjekkliste før lansering

- [ ] Bloggtekstene migrert fra Squarespace (tomme sider vil rasere SEO)
- [ ] `docs/snapshot/` hentet, og tekst på landingssidene hentet derfra
- [ ] Avklart hva `/` skal servere etter at forsidens slug ble `/hjem`
- [ ] Skjema sender til riktig mottaker og utløser `takk_page_view` på `/takk`
- [ ] GA4 og Google Ads-konvertering verifisert mot eksisterende oppsett
- [ ] NAP, org.nr. og Organization-schema (JSON-LD) på plass
- [ ] Redirect-kartet testet mot faktiske gamle URL-er
- [ ] `NEXT_PUBLIC_TILLAT_INDEKSERING=true` satt i Vercel
- [ ] DNS pekt om – **til slutt**
