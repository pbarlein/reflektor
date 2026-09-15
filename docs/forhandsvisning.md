# Forhåndsvisning

**Previewen er live:** https://reflektor-ny.vercel.app

Verifisert 15.09.2026 mot commit `4d611dc`. Åpnes i hvilken som helst
nettleser, uten innlogging.

---

## Hvorfor den URL-en, og ikke en preview-URL med hash

Vercel-prosjektet `reflektor-ny` har arbeidsbranchen som **produksjonsbranch**.
Hver push gir derfor en deploy med `target: production`, ikke en preview.

Det høres mer dramatisk ut enn det er: reflektor.no peker fortsatt på
Squarespace. «Produksjon» betyr her bare `reflektor-ny.vercel.app`, ikke det
levende domenet. Bryteren som faktisk flytter reflektor.no er DNS, og den er
urørt.

Én praktisk følge: Deployment Protection står på
`prod_deployment_urls_and_all_previews`. Den beskytter de hash-URL-ene
(`reflektor-n23pxkmrl-…`) — de gir 302 til Vercel-innlogging — men **ikke**
det stabile domenet. Derfor er `reflektor-ny.vercel.app` åpen for alle som
har lenken.

## Indekseringssperren er verifisert på den levende URL-en

Ikke antatt, hentet:

```
$ curl https://reflektor-ny.vercel.app/robots.txt
User-Agent: *
Disallow: /

$ curl https://reflektor-ny.vercel.app/ | grep meta.*robots
<meta name="robots" content="noindex, nofollow"/>
```

Begge deler kommer fra `src/lib/miljo.ts`. Vercel setter selv
`X-Robots-Tag: noindex` på previews, men ikke på produksjonsdeploys — og
siden denne branchen deployer som produksjon, er det sperren i koden som
gjør jobben. Ikke fjern den for å teste at SEO virker.

---

## To ting å vite når du ser på den

### 1. Videoene spiller ikke i mitt testverktøy — det er ikke en feil på siden

Klippene er H.264 i MP4. Chromium-bygget Playwright bruker er
open-source-varianten **uten proprietære kodeker**:

```
canPlayType('video/mp4; codecs="avc1.42E01E"')  →  ""   (tom = kan ikke spille)
canPlayType('video/webm; codecs="vp9"')         →  "probably"
```

Filene serveres korrekt (HTTP 206 med range-støtte, 2,4 MB på 0,86 s).
H.264 spilles av Chrome, Safari, Firefox og Edge på ekte maskiner.

**Konsekvens: jeg kan se posterbildene, men ikke verifisere avspillingen
selv.** Det må gjøres i en vanlig nettleser. Sjekk at alle fire starter når
de kommer i synsfeltet, og at bare de synlige spiller.

### 2. Sporingen fyrer på previewen

Målt på `reflektor-ny.vercel.app`, utgående forespørsler ved sidelast:

- `google-analytics.com/g/collect` — GA4
- `pagead2.googlesyndication.com/ccm/collect?tid=AW-11026823614` — Google Ads
  konverteringskonto
- `aplo-evnt.com/api/v1/intent_pixel/…` — tredjeparts besøkspiksel via GTM

`src/components/Sporing.tsx` har ingen miljøsperre. GTM lastes uansett hvor
siden kjører.

**Risikoen:** previewtrafikk havner i de samme kontoene som bærer den eneste
KPI-en. Åpner du eller jeg previewen, telles det som sidevisninger. Og fyller
noen ut testskjemaet, går det til `/takk`, som fyrer `takk_page_view` — altså
selve konverteringshandlingen med 107+ historiske registreringer.

**Ikke endret.** Sporing er fundament, og en sperre her ville samtidig fjernet
muligheten til å verifisere kjeden på preview — som er nettopp det som må
gjøres før lansering, og som allerede har bommet én gang (se A28).

Avveiningen er Påls. Skal den lukkes, er mønsteret det samme som for
indeksering:

```ts
// Sporing.tsx
if (process.env.NEXT_PUBLIC_SPORING !== "true") return null;
```

Da må flagget settes bevisst i Vercel når kjeden skal testes, og skrus av
igjen etterpå.

**Inntil det er avklart: ikke fyll ut skjemaet på previewen med mindre du
mener å registrere en konvertering.**

---

## Lokal utvikling

```bash
npm run dev          # localhost:3000
npm run dev:mobil    # eksponert på nettverket, for test på telefon
```

`npm run build` før push. `content:check` og `lenkesjekk` kjører i CI og
stopper publisering ved TBD-er, for lange tekster eller døde interne lenker.

---

## Sjekkliste før lansering

- [ ] Bloggtekstene migrert fra Squarespace — **blokkerer lansering**
- [ ] `/sosiale-medier-byra` → `/` 301, etter Ads-URL-bytte (`docs/cutover.md`)
- [ ] `NEXT_PUBLIC_TILLAT_INDEKSERING=true` satt i Vercel
- [ ] Sporingskjeden verifisert ende-til-ende: skjema → `/takk` → GA4-hendelse
- [ ] DNS flyttet — **det er den eneste handlingen som faktisk flytter siden**
