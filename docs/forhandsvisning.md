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

### Etter veggen og prisklippet (16.09.2026, andre måling)

| Metrikk | Målt |
|---|---|
| **LCP** | **904 ms** — heroklippet |
| TTFB | 455 ms |
| CLS | 0,0112 — uendret, samme fontbytte som over |

Mediefilene, som er de eneste eksakte tallene: 11,7 MB video og 4,3 MB
plakater og foto på disk. Veggens syv klipp er 1,81 MB av det,
produksjonsdagklippet i prisseksjonen 382 kB.

> Klippet i prisseksjonen er siden byttet til Egon-klippet, som veier
> 999 kB pluss 93 kB plakat. Tallene i tabellen over gjelder målingen slik
> den ble gjort, og er ikke målt på nytt etter byttet. LCP-elementet er
> uansett heroklippet, som ligger over folden — prisklippet har
> `preload="none"` og lastes først når det kommer i synsfeltet.

**Ingenting av veggen lastes før den er i synsfeltet.** Alle klippene har
`preload="none"` og plakatbilde, og bare de som er synlige spiller.

### Vannrett rulling — sjekk denne på nytt hvis veggen endres

Første versjon av veggen ga 20 px vannrett rulling på HELE dokumentet ved
390 og 768 px. Årsaken var `-mx-5` på radwrapperen, kopiert fra reel-veggen
— men den ligger inne i en Container, og veggen gjør ikke det.

Målingen er enkel og verdt å gjenta: sammenlign
`document.documentElement.scrollWidth` med `window.innerWidth` på 390, 768,
1024, 1440 og 2560 px. Er den første større, finnes det et element som
stikker utenfor. Feilen er usynlig på desktop og åpenbar på telefon.

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

### Etter logoraden og glasspanelet (16.09.2026, tredje måling)

| Metrikk | Målt |
|---|---|
| **LCP** | **664 og 812 ms** — fortsatt heroklippet |
| TTFB | 108 og 267 ms |
| CLS | 0,0085 |

Lambdaen ble varmet opp med én forespørsel før målingen. Uten det gir
kaldstart etter deploy TTFB rundt 3 400 ms og LCP over 4 000 ms — det er
Vercel, ikke siden.

**De 22 logobildene kostet ingenting.** De lastes `eager` med
`fetchPriority="low"`, altså hentes uten å bli utsatt, men bakerst i køen.
LCP er uendret eller bedre enn forrige måling (904 ms), og CLS gikk fra
0,0112 til 0,0085 — logoene har eksplisitt bredde og høyde, så de skifter
ikke.

Eager var nødvendig, ikke et valg: med lat lasting lastet ni av elleve. De
to siste ligger utenfor skjermen til høyre, og en IntersectionObserver på et
element som flyttes av en CSS-animasjon inne i en rullecontainer er ikke noe
å stole på.

### Logoradens bevegelse — verifisert på deployet

| Sjekk | Resultat |
|---|---|
| Drifter | Ja, −153 → −244 px på 2,5 s |
| Pauser på hover | Ja, −247 → −247 px på 2,0 s |
| `prefers-reduced-motion` | Drift av, kortinnhenting av, raden fortsatt rullbar |

Det siste er poenget: slår man av bevegelsen, forsvinner ikke innholdet.
Raden kan fortsatt dras i, og glasskortene står ferdig innhentet.

### Logoraden tømtes til høyre på brede skjermer (rettet 16.09.2026)

Pål: «logoraden forsvinner når den har kjørt gjennom». Feilen var ekte, og
den var usynlig på alle bredder jeg hadde målt på.

Sporet besto av TO sett, og animasjonen flytter -50 %. Perioden var altså
ETT sett. Ved loopslutt viser vinduet `[settbredde, settbredde +
vindusbredde]` — og er vinduet bredere enn settet, peker halen utenfor
sporet.

| Vindu | Tomt til høyre ved loopslutt |
|---|---|
| 1 440 | 0 px |
| 1 728 | 0 px |
| 1 920 | 0 px |
| **2 560** | **558 px** |
| **3 440** | **1 438 px** |

Settet er 2 002 px, så feilen slår inn nøyaktig der vinduet passerer det.
Jeg målte på 390, 768, 1024, 1440 og 2560 da raden ble bygget — og fikk
null siderulling på alle, som var det jeg lette etter. Hullet ved loopslutt
er en annen sjekk, og den fantes ikke.

**Rettet med fire sett i stedet for to.** Perioden blir da to sett, 4 004
px, og raden er sømløs så lenge vinduet er smalere enn det. Pro Display XDR
er 3 008 logiske piksler.

Det koster ingenting på nettverket: 44 `<img>` peker på elleve unike
URL-er, så nettleseren henter fortsatt elleve filer. Bare DOM-noder.

Verifisert ved å fryse sporet på `translateX(-50%)`, altså nøyaktig
loopslutt, og måle høyrekanten på siste logo mot vindusbredden: 622 px tomt
før, 0 px etter, på 2 560. Null hull på 390, 768, 1 440, 2 560, 3 440 og
4 004.

### Etter kodegjennomgangen (17.09.2026, fjerde måling)

Målt mot deployet, med oppvarming først.

| Metrikk | Målt |
|---|---|
| **LCP** | **628 og 952 ms** — fortsatt heroklippet |
| TTFB | 131 og 405 ms |
| **CLS** | **0,0075** — laveste målte |
| axe-brudd | **0** på fem sider i to visninger |

CLS har gått 0,0112 → 0,0085 → 0,0075 gjennom økta uten at noe er gjort for
å jage tallet. Det følger av at elementer har fått eksplisitte mål.

**H1-en gjør endelig det koden sier.** 44 px skrift gir 45,76 px linje på
mobil, altså 1,04. Før lag-rettelsen var det 50,6 px (1,15). Se A-punktene
og commit-loggen for hvorfor.

### Fast sjekkliste før hver lansering

Kjør disse, i denne rekkefølgen. Alle er kjørt og grønne per 17.09.2026.

1. `npm test` — vernet rundt skjemaruta. Åtte tester, ingen nettverk.
2. `npm run content:check` — copy innenfor tegngrensene.
3. `npm run lenkesjekk` — døde lenker, manglende OG foreldreløse mediefiler.
4. `npx tsc --noEmit` og `npm run lint`.
5. axe mot `/`, `/faq`, `/personvern`, `/takk`, `/kontaktoss` i to visninger.
6. Vannrett siderulling på 320, 390, 768, 1024, 1440, 2560 — skal være 0.
7. `<meta name="robots">` skal si `noindex, nofollow` til DNS peker hit.

