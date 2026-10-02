# Lansering: det som gjenstår, i rekkefølge

Skrevet 02.10.2026. Alt som kan gjøres uten å røre DNS, er gjort.

Rekkefølgen under er ikke valgfri. Hvert steg forutsetter det forrige.

---

## Gjort, og kontrollert

- **Domenene er koblet i Vercel.** `www.reflektor.no` er produksjonsdomene,
  `reflektor.no` omdirigerer dit. Begge står som `verified`.
- **Dagens side er urørt.** Kontrollert etterpå: reflektor.no svarer
  fortsatt 301 til www, www svarer 200, og serveren er fortsatt Squarespace.
- **Siden er bygget og verifisert.** 31 ruter, null feil i lint, typer, 44
  tester, innholdssjekk, lenkesjekk og axe. Null sider med vannrett scroll i
  390, 768 og 1440 px.
- **Begge tilstander av indekseringssperren er testet.** Av: `Disallow: /` og
  `noindex` overalt. På: `Allow: /`, absolutte canonicals mot
  `https://www.reflektor.no`, og `/takk` fortsatt `noindex`.

---

## 1. Pål: bytt endelig URL i Google Ads

**Dette må gjøres FØR steg 3.** Annonsene peker i dag på
`/sosiale-medier-byra`. Den adressen skal 301-es til forsiden, men gjør vi
det før Ads er endret, sender vi betalt trafikk gjennom en omdirigering.

Bytt endelig URL i annonsegruppene fra `/sosiale-medier-byra` til `/`.

## 2. Pål: flytt DNS

Hos domeneforhandleren, ikke i Squarespace:

- `reflektor.no` → A-record mot **76.76.21.21**
- `www.reflektor.no` → CNAME mot verdien **Vercel oppgir på domenesiden**

**Les CNAME-verdien av i Vercel, ikke fra hukommelsen.** Vercel har brukt
flere verter (`cname.vercel-dns.com` og `cname.vercel-dns-0.com`), og den
riktige står på prosjektets domeneside. Dette er det ene steget som ikke
tåler en gjetning.

Vent til `www.reflektor.no` svarer fra Vercel før du går videre. Det tar
vanligvis minutter, men kan ta timer.

## 3. Claude: slå på indeksering

Sett `NEXT_PUBLIC_TILLAT_INDEKSERING=true` i Vercel **og deploy på nytt**.
Variabelen bakes inn ved bygging, så uten ny deploy skjer ingenting.

Kontroll: `https://www.reflektor.no/robots.txt` skal si `Allow: /`.

## 4. Claude: legg inn omdirigeringen fra den gamle annonsesiden

`/sosiale-medier-byra` → `/` med 301. Først nå, og først når steg 1 er gjort.

## 5. Pål: send ett testskjema

**Dette er det viktigste steget på hele lista.**

Fyll ut kontaktskjemaet på den nye siden. Sjekk to ting:

1. At du får leadet på e-post.
2. At konverteringen telles i GA4 — sanntidsrapporten skal vise hendelsen
   `takk_page_view`.

107 historiske konverteringer henger på den hendelsen. Virker den ikke,
mister du innsyn i den eneste KPI-en, og du merker det ikke på uker.

## 6. Pål: meld inn den nye siden

- Search Console: legg til domeneeiendom og send inn
  `https://www.reflektor.no/sitemap.xml`
- Sjekk at Ads-annonsene går til riktig sted og ikke gjennom en
  omdirigering

---

## Hvis noe går galt

**Siden svarer ikke etter DNS-flyttingen.** Vent. DNS tar tid å spre seg.
Sjekk at domenet står som `verified` i Vercel.

**Siden er live, men Google ser `Disallow: /`.** Steg 3 er ikke fullført —
variabelen er satt, men ikke deployet på nytt.

**Leadet kom ikke på e-post.** Nøkkelen i Vercel mangler eller er feil.
Leadet er ikke tapt i stillhet: det logges en feilmelding, men selve
innholdet logges ikke.

**Alt må reverseres.** Pek DNS tilbake til Squarespace. Den gamle siden
ligger urørt og svarer med en gang DNS er tilbake.
