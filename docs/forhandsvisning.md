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

## Målt ytelse

På den deployede siden, Chromium, 1440 px, varm cache:

| | Ved sidelast | Etter full scroll |
|---|---|---|
| Overført | 2,18 MB | 10,15 MB |
| Forespørsler | 58 | 88 |

| Metrikk | Målt |
|---|---|
| **LCP** | **1 264 ms** — LCP-elementet er heroklippet |
| TTFB | 560 ms |
| DOMContentLoaded | 747 ms |

### Etter header, anmeldelsesrad og båndklipp (16.09.2026)

Målt på nytt, varm, to kjøringer:

| Metrikk | Målt |
|---|---|
| **LCP** | **1 020 og 1 108 ms** — fortsatt heroklippet |
| TTFB | 478 og 524 ms |
| **CLS** | **0,0112** — ny, se under |

**CLS kom fra null til 0,0112.** Den er godt innenfor Googles «god»-grense
på 0,1, men den var null før, så den skal forklares. Jeg målte skiftene med
kilde og rektangel: ved 952 ms vokser ordmerket fra 88 til 102 px bredt og
CTA-gruppa i headeren fra 108 til 120, og ved 917 ms flytter H1 seg 6 px
opp. Det er Poppins og Instrument Serif som byttes inn — `display: swap`.

Headeren har gjort den synlig. Før var headeren logoen alene; nå er det
tekst i en `justify-between`-rad, og da blir breddeendringen ved
fontbyttet et sidelengs skift i stedet for ingenting.

`next/font` justerer allerede reservefontens vertikale metrikker. Det finnes
ingen tilsvarende justering for glyffbredde, så et sidelengs skift ved swap
er iboende. Alternativet er `display: optional`, som betyr at merkevarefonten
kan utebli helt på trege forbindelser. Det er en dårligere handel for
0,0112.

**Videovekten kan jeg ikke måle i dette verktøyet.** Playwrights Chromium
mangler H.264, så klipp som `preload="none"` aldri får spilt av, blir heller
aldri lastet ferdig — tallet «etter full scroll» varierte mellom 2,5 og
3,4 MB mellom kjøringer og betyr ingenting. Det som ER eksakt, er filene:
9,2 MB video og 3,7 MB plakater og foto på disk. De fire nye båndklippene
utgjør **795 kB** av det.

### Hva heroklippet koster

Før klippet kom inn i heroen var LCP 996 ms med H1 som LCP-element, og
førstelasten 0,99 MB. Etter: 1 264 ms og 2,18 MB.

Klippet autospiller over folden, så det lastes umiddelbart og maler før H1
rekker det. **Prisen er omtrent 270 ms LCP og 1,2 MB.** LCP ligger fortsatt
godt under Googles «god»-grense på 2 500 ms, men det er verdt å vite at
tallet nå henger på en videofil og ikke på tekst — på en treg forbindelse
slår det ut sterkere enn en overskrift ville gjort.

Klippet er derfor kodet hardere enn de andre: CRF 33 og åtte sekunder, mot
CRF 31 ellers. Byttet er verifisert ved å sammenligne samme bilderute ved
faktisk visningsbredde — ingen synlig forskjell. **Endres heroklippet, må
LCP måles på nytt.**

### Fordelingen

Av 10,15 MB etter full scroll er 8,80 MB video fordelt på ni klipp, og 0,82
MB bilder. Nitten bilder koster altså under én megabyte fordi `next/image`
leverer AVIF. Video lastes bare når et klipp kommer i synsfeltet, og bare
synlige klipp spiller — unntaket er heroklippet, som er over folden fra
første sekund.

**Én forespørsel feiler:** `aplo-evnt.com/api/v1/intent_pixel/track_request`
svarer 400. Det er en tredjeparts besøkspiksel som lastes gjennom GTM, ikke
noe siden selv gjør. Den hører sammen med sporingsspørsmålet over.

### Målt med kaldstart

Første forespørsel etter en deploy gir TTFB rundt 3 400 ms og LCP over
4 000 ms. Det er Vercels kaldstart, ikke en egenskap ved siden — send én
forespørsel før du måler.

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
