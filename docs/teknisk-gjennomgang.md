# Teknisk gjennomgang

Bestilt av Pål 29.09.2026: «kvalitetssikre all kode for at løsningen kun har
nødvendig og berikende kode, ikke blir et lappeteppe, og ikke har sårbare
elementer som kan påvirke funksjonalitet eller synlighet negativt.»

Dette er både resultatet av den gangen og oppskriften for neste. Skriv nye
runder nederst, ikke over denne.

---

## Runde 1 — 29.09.2026

Omfang: 16 446 linjer i `src/`, `scripts/` og `tests/`, samt `next.config.ts`,
CI og avhengigheter.

### Funnet og rettet

**1. Kritisk sikkerhetshull i Next (CVSS 9,5).**
Repoet kjørte `next@16.3.2`. GHSA-2xp9-vwfh-vxw4 gjelder `>= 16.0.0, < 16.3.3`
og beskriver ekstern kjøring av kode i bildeoptimaliseringen **når AVIF
brukes** — og `next.config.ts` slår AVIF eksplisitt på. I tillegg
GHSA-p293-qw3h-jr36 (RCE på Windows-verter, ikke relevant på Vercel) og
`sharp < 0.35.4` (libheif, høy). Hullet ble publisert 25.08.2026 og lå i
repoet i fem uker uten at noe sa fra.

Oppgradert til `next@16.3.7` og `sharp@0.35.5`. `npm audit` gir nå 0 på både
produksjons- og byggeavhengigheter. Bildeoptimaliseringen er verifisert
fortsatt virksom i både WebP og AVIF etter oppgraderingen.

**2. CI kontrollerte ikke avhengigheter.**
Det er grunnen til at punkt 1 fikk ligge. Lagt til `npm audit --omit=dev
--audit-level=high` som eget steg.

**3. Lint-steget i CI håndhevet ingenting.**
`npm run lint` kjørte `eslint` uten flagg og returnerte 0 selv med advarsler.
Målt: en bevisst ubrukt variabel ga «1 problem (0 errors, 1 warning)» og
exit 0. Alle reglene i `eslint-config-next` som er advarsler — ubrukte
variabler, manglende hook-avhengigheter, `<img>` i stedet for `next/image` —
kunne passere. Rettet til `eslint --max-warnings 0` i `package.json`, slik at
det gjelder lokalt også.

**4. Ingen sikkerhetsheadere.**
Siden serverte kun HSTS, som Vercel setter selv. Lagt til
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` og
`Content-Security-Policy: frame-ancestors 'self'`, samt
`poweredByHeader: false`.

**Ingen full CSP, og det er et valg.** En CSP som begrenser skript måtte listet
alt GTM-containeren laster — GA4, Google Ads, Apollo, Clarity, HubSpot — og
containeren styres utenfor dette repoet. Første gang noen legger til en tagg i
GTM ville den blitt blokkert av en fil de ikke vet finnes, og det de mistet
ville vært målingen av den eneste KPI-en. `frame-ancestors` er unntaket:
direktivet rører ikke skript.

**5. `/personvern` var `noindex` — arvet fra en stubb.**
Kommentaren i koden sa det rett ut: «beholdt fra stubben». Siden var en
overskrift og en TODO da innstillingen ble satt; den har nå hele erklæringen,
er lenket fra bunnteksten på hver side, og er et tillitssignal både for Google
og for språkmodeller som sjekker om et selskap har en. Sperren er fjernet og
adressen lagt i sitemapet.

**6. Forsiden hadde to adresser.**
Canonical sa `https://www.reflektor.no`, sitemapet `https://www.reflektor.no/`.
Forskjellen er ikke vår: Next normaliserer bort skråstreken i canonical etter
`trailingSlash`-innstillingen, mens sitemapet skriver ut det det får. Rettet i
sitemapet, som er siden som lar seg rette.

**7. Plassholdersiden kunne bli indeksert ved cutover.**
`/sosiale-medier-byra` er en naken «Under arbeid»-side uten `noindex`. Den skal
301-es til forsiden ved cutover, men indekseringssperren og redirecten er to
separate handlinger. Snus bryteren først, indekserer Google en tom side på den
URL-en Google Ads annonserer mot. Satt `noindex` på siden.

**8. Indekseringssperren dekket ikke annet enn HTML.**
`robots` i layouten setter meta-taggen, som bare finnes i sider. `sitemap.xml`
og `llms.txt` har ingen `<head>`. Lagt til `X-Robots-Tag: noindex, nofollow`
som header, styrt av samme miljøvariabel — verifisert at den forsvinner når
indeksering slås på.

**9. Standardbeskrivelsen var 238 tegn.**
`site.ingress` var `description` i layouten. Google kutter ved rundt 155.
Feilen var usynlig fordi forsiden og alle tjenestesidene setter sin egen — den
slo bare inn på sider som ikke gjør det, og `/takk` gjorde det allerede. Ny
side uten egen beskrivelse ville arvet den. `kortBeskrivelse()` i `site.ts`
kutter ved siste hele setning; ingen copy er endret. Samme grep lå fra før
inline i `/sosiale-medier-byra`, bundet til ordene «Ingen bindingstid» — det
ville stille sluttet å virke om setningen ble skrevet om. Nå står det ett sted.

**10. En TODO som ville ødelagt målingen.**
`/takk/page.tsx` ba neste person utløse GA4-hendelsen `takk_page_view`.
`<TakkHendelse />` står to linjer over og gjør nøyaktig det — og komponentens
egen dokumentasjon advarer uttrykkelig mot å koble hendelsen til en utløser i
GTM, fordi nøkkelhendelsen allerede lages inne i GA4 fra samme sidevisning.
Den som fulgte TODO-en ville dobbelttelt Reflektors eneste KPI. Erstattet med
en advarsel som peker på komponenten.

**11. Feil begrunnelse på IP-henting.**
`klientnokkel()` i `skjemavern.ts` sa at «Vercel legger den ekte adressen SIST
på lista», og tok så den første. Lest slik beskriver kommentaren en
mengdebegrensning hvem som helst kan slå av med én header.

Vercels dokumentasjon (Request headers, oppdatert 13.12.2025) sier det
motsatte: Vercel **overskriver** `x-forwarded-for` og videresender ikke
eksterne IP-er, «to prevent IP spoofing». Headeren har én adresse, satt av
plattformen. Koden var riktig; kommentaren var feil, og den inviterte neste
person til å «rette» koden til noe som ville vært galt. Kommentaren er rettet
og kilden ført opp.

**12. Død kode.**
`SlotTekst` i `Slot.tsx` — ingen av de elleve slot-stedene kalte den.
`kontaktperson` i `site.ts` — ubrukt, og en andre kopi av telefonnummeret og
e-postadressen i `site.kontakt`. NAP-konsistens er ett av fire synlighetskrav;
to kopier i samme fil er nettopp det som glir fra hverandre.

### Funnet, ikke rettet

**167 MB råvideo i repoets rot.** `bts-morgen.mov`, `bts-vindu.mov` og
`bts-well.mov` er sporet i git, refereres ingen steder, og kom inn med en
`git add -A` i en commit om typografi. `.git` er 274 MB; filene er 61 % av
det. De gjør hver kloning og hvert Vercel-bygg tyngre uten å tjene noe.

Sletting krever Påls godkjenning. Merk også at en vanlig sletting fjerner dem
fra arbeidstreet, ikke fra historikken — filene følger med greina til den
skvises ved fletting. De ligger ikke på `main`.

### Vurdert og bevisst latt stå

**71 av 156 CSS-variabler er ubrukt.** Det er designsystemet levert av Claude
Design, kopiert inn uendret, med «ikke rediger dem her» i sin egen
LES-MEG-fil, og oppført i AGENTS.md som fundament. En merkevareskala er
komplett med vilje. Hele CSS-en er 59 kB rå og **11,6 kB gzipet** — de ubrukte
tokenene koster noen hundre byte. Å rive dem ville vært å bytte et
designsystem mot en besparelse ingen kan måle.

**`Arbeidsrutenett` er navnet på to ulike komponenter** (`forside/` og
`tjeneste/`). Ingen feil i dag, men en importfelle. Notert, ikke endret —
omdøping er churn uten gevinst så lenge begge er i bruk og godt plassert.

### Verifisert i orden

- **Skjemaflyten**, som hele målingen henger på: POST → 303 gir ekte
  dokumentnavigasjon (`navigationType: navigate`), referreren bevares fra
  `/kontaktoss` til `/takk` — GA4-nøkkelhendelsen krever `page_referrer
  contains reflektor.no` — og flyten virker med JavaScript slått av.
- **Samtykkekjeden**: før valg står `data-samtykke=uavklart` og GTM er ikke
  lastet. Etter valg lastes containeren, og `consent default` ligger alltid
  før `gtm.js` i `dataLayer`. For gjengangere settes det lagrede svaret som
  `default` uten at banneret blinker.
- **Skjemaendepunktet**: alltid 303 til `/takk` — også for bot, feil
  innholdstype og tom POST. GET gir 405. Ingen personopplysninger i loggen.
- **Tilgjengelighet**: 0 axe-brudd på 18 sider, én `h1` hver, ingen
  overskriftshopp, ingen bilder uten alt-tekst, ingen tomme lenker.
- **Ruting**: alle 24 sitemap-URL-er svarer 200 uten omdirigering. Alle
  redirects svarer 301 med riktig mål, jokerregelen inkludert. Live sider
  omdirigeres ikke. Ukjente adresser gir 404.
- **Hemmeligheter**: ingen nøkler i sporet kode, ingen `.env`-filer. Kun
  GTM-ID-en i klartekst, som er offentlig uansett.
- **JSON-LD**: gyldig på alle sider, `Organization` kun på forsiden, andre
  sider refererer den med `@id`.

---

## Oppskrift for neste runde

Rekkefølgen er valgt slik at det billigste som kan avsløre mest kommer først.

1. `npm audit --omit=dev` og `npm outdated`. Er det en advarsel, les den
   faktiske GHSA-siden — ikke bare alvorlighetsgraden. Sjekk om funksjonen den
   gjelder er **påslått hos oss**.
2. `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run content:check`,
   `npm run lenkesjekk`, `npm run bekreft:check`, `npm run build`.
3. Bygg og server **i begge bryterstillinger** — med og uten
   `NEXT_PUBLIC_TILLAT_INDEKSERING=true`. En feil som bare finnes i
   cutover-tilstanden er den dyreste sorten.
4. Statuskode på hver rute, hver redirect og hver URL i sitemapet.
5. Nettleserrunde over alle sider: axe, konsollfeil, `h1`-antall,
   overskriftsrekkefølge, canonical, JSON-LD.
6. Kjør skjemaet ende til ende, med og uten JavaScript, og se at referreren
   overlever til `/takk`.
7. Let etter død kode: eksporterte navn ingen importerer, filer ingen leser,
   komponentnavn definert to steder.
8. Les kommentarene kritisk. To av de tolv funnene denne runden var ikke feil
   i koden, men feil i **begrunnelsen** — og begge ville ført neste person til
   å gjøre noe galt. En kommentar som er feil er farligere enn ingen kommentar.
