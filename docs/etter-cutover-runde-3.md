# Runde 3 — 2. oktober 2026

Fart, innhold, forfatter og AEO. Delt i to pushes, slik bestillingen ba om:
del B–D først (`0d0a8fa`), del A alene etterpå (`489d80e`), fordi del A kunne
påvirke sporingen.

Sjekkrunden var grønn før begge: `npm audit`, `tsc --noEmit`, `lint`,
76 tester, `content:check`, `bekreft:check`, bygg med indeksering på,
`lenkesjekk`.

## Fem ting i bestillingen som ikke stemte med koden

Sagt fra om før arbeidet startet, ikke i etterkant:

1. **Hero har ingen inngangsanimasjon.** Del A punkt 2 ba om å fjerne en.
   Det finnes ingen `opacity-0`, fade eller transform i hero, hverken på
   forsiden, tjenestesidene eller i artiklene. De 2,2 sekundene «element
   render delay» måtte derfor måles, ikke fjernes.
2. **`content:check` validerer ikke schema.** Del C punkt 5 var betinget av
   at den gjorde det. Vakten ligger nå i `tests/artikkelschema.test.ts`.
3. **`images.formats` var allerede AVIF + WebP.**
4. **Det fantes ingen 404-side.** Den «hadde samme title som forsiden» fordi
   Next serverte sin egen, som arver tittelmalen fra rotlayouten.
5. **Artikkelen om innholdsmarkedsføring lenket ikke til SNL.** Copyen sa
   «lenk den til snl.no som i dag» — den siterte Store norske leksikon uten
   lenke. Lenken er lagt til.

## Del B — innhold

### To nye artikler

- `/blogg/hva-koster-reklamefilm` — totalkostnaden: produksjon, rettigheter
  og visning. Kildene (TV 2, TONO, StagePool) er hentet og svarte 200.
- `/blogg/hva-er-reklame` — definisjon, typer, virkemidler, loven.
  **301-en fra denne adressen til `/blogg` er fjernet.** Adressen har lenker
  fra to domener og rangerte på plass 19 for «reklame».

**Lovdata svarer 405 på forespørsler herfra.** Kildelenken til
markedsføringsloven § 3 står i artikkelen, men den er ikke verifisert fra
containeren — Lovdata avviser automatiserte oppslag. Den bør sjekkes i en
vanlig nettleser.

### Redirectene til /blogg er borte

Fem døde bloggadresser gikk til oversikten. **En 301 til en oversiktsside
behandler Google i praksis som en myk 404:** målet svarer ikke på det kilden
het, og lenkeverdien går tapt i stedet for å flytte seg.

| Fra | Til | Hvorfor |
|---|---|---|
| `/blogg/hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de` | `/blogg/hva-er-reklame` | «Virkemidler i reklame» er en egen H2 der |
| `/blogg/hva-er-holdningskampanje` | `/blogg/hva-er-reklame` | En holdningskampanje er en reklamekampanje |
| `/blogg/hva-er-personas` | `/blogg/sosiale-medier-strategi` | Personas er et verktøy for å bestemme hvem innholdet er for |
| `/blogg/hva-er-visuell-identitet` | `/blogg/hva-er-innholdsproduksjon` | Visuell identitet handler om hvordan innholdet ser ut |
| `/blogg/hvordan-ta-portrett-bilder` | `/innholdsproduksjon` | Portrettfoto er en tjeneste, ikke et tema vi har skrevet om |

Ingen redirect i kartet peker lenger på `/blogg`. En ny test i
`tests/redirects.test.ts` holder på det. `/vart-arbeid` står utenfor regelen:
`/vrt-arbeid` → `/vart-arbeid` er en skrivefeilrettelse, og der er
oversikten riktig mål.

### Sju artikler skrevet om

Alle sju har `dateModified` 2026-10-02 og URL-en uendret.

**Artikkel 1–3 beholder title og H1 ordrett**, fordi de rangerer i dag:
markedsføring i sosiale medier (plass 2 for «hva er some», plass 1 for «so
me»), digital historiefortelling (plass 1) og innholdsmarkedsføring (plass
3–4). Å bytte tittel på en side som allerede står der, er å kaste en
posisjon for å vinne en formulering.

**Artikkel 4–7 har fått ny `metaTittel`.**

**To FAQ-kollisjoner ble fanget av testen**, og begge er rettet i artikkelen
og ikke på salgssiden:

- «Hva koster det?» eies av `/faq` → artikkelen spør «Hva koster
  videomarkedsføring?»
- «Hva koster en employer branding-video?» eies av
  `/employer-branding-video-oslo` → artikkelen spør «Hva koster en film til
  employer branding?»

Google sier eksplisitt at samme spørsmål ikke skal FAQPage-merkes på to
URL-er. Tjenestesiden skal eie kjøpsspørsmålet.

### /en

Én engelsk oppsummering, ikke en engelsk utgave av nettstedet. Et helt
oversatt nettsted er en forpliktelse: hver endring i norsk copy må speiles,
og en engelsk side som henger et halvt år etter er verre enn ingen.

hreflang går begge veier (`nb-NO`, `en`, `x-default`). **Gjør de ikke det,
ignorerer Google hele settet.** Verifisert på live på begge sidene.
Skjemaet er norsk, så knappen går til `/kontaktoss`, med e-post og telefon
rett under.

## Del C — forfatter og E-E-A-T

Byline under H1 i alle artikler: «Pål Barlein, CEO i Reflektor · Publisert
… · Oppdatert …». Forfatterboks før «Fra Reflektor» — først hvem som skrev
dette, så hva vi selger.

Markeringen: én `Person` med `@id` `/om-oss#pal-barlein`, `jobTitle` CEO,
`worksFor` → organisasjonen, `sameAs` → LinkedIn. `Article.author` peker på
personen; `publisher` er fortsatt organisasjonen. Påls kort på `/om-oss` har
fått ankeret lenkene lover.

**`dateModified` er nå alltid med**, satt til publiseringsdatoen når
ingenting er endret. Begrunnelsen mot en dato lik byggetidspunktet står —
den er grunnen til at feltet ikke settes til i dag. Men Google leser et
manglende felt som «ukjent», ikke som «uendret». `image` er lagt til av
samme grunn: uten det kan artikkelen ikke vises med bilde i søk.

**JSON-LD-objektene er flyttet til `src/lib/artikkelmarkering.ts`.** Node kan
ikke importere JSX i en test, så markeringen kunne bare kontrolleres ved å
bygge nettstedet og lese HTML-en. Nå er den rene funksjoner med en test på
seg — og feilen den verner mot er usynlig: et `author` som peker feil ser
helt likt ut på siden.

## Del D — små tekniske ting

- **Sitemapet har lastmod på alle 34 URL-ene.** 16 av 31 manglet. Datoene
  står i én håndholdt liste i `sitemap.ts`, ikke som byggetidspunkt: en dato
  som flytter seg ved hver deploy ville påstått at hver side ble revidert da
  vi rettet en knappefarge.
- **404-siden finnes** og heter «Siden finnes ikke | Reflektor».
- **GTM-dokumentasjonen** ble rettet tidligere samme dag (`14a93da`). Den
  sier nå at variant 2 er et valg, ikke en gjenstående oppgave.

## Del A — ytelse

### Målt før og etter

Lighthouse mobil, median av tre kjøringer, fra denne containeren:

| Side | Score før | Score etter | LCP før | LCP etter | TBT før | TBT etter |
|---|---|---|---|---|---|---|
| `/` | 75 | 73 | 1,95 s | 2,13 s | 1207 ms | 1287 ms |
| `/reels-produksjon` | 74 | 72 | 2,13 s | 2,88 s | 1217 ms | 1061 ms |
| `/blogg/hva-koster-et-some-byra` | 73 | 73 | 2,12 s | 2,13 s | 1434 ms | 1466 ms |

**Målet ≥ 80 er IKKE nådd.** Forskjellen før og etter er innenfor
variasjonen mellom kjøringer — enkeltkjøringer spente fra 66 til 98 på samme
side.

### To ting bestillingens tall ikke stemte med

**LCP reproduserer ikke.** Bestillingen oppgir LCP 10–11 s og score 44–47.
Herfra måler jeg LCP under 2,2 s og score 73–75. Forskjellen er nesten
sikkert nettverket: målinger herfra går gjennom en proxy med andre
forutsetninger enn en mobil på 4G. **TBT stemmer derimot nøyaktig** — 1,2 s
— og det er TBT som er problemet.

### Hva som ble gjort

**GTM lastes etter at siden er ferdig.** Ved det som kommer først av: `load`
pluss `requestIdleCallback` med 2,5 sekunders tak, eller første interaksjon
(rulling, trykk, tast). Det siste er ikke pynt — den som ruller med en gang
skal ikke vente på en tomgangsluke som aldri kommer.

`/takk` er unntaket og laster containeren umiddelbart. Der fyrer
GA4-nøkkelhendelsen og Ads-konverteringen som bærer 107+ historiske
konverteringer.

**Samtykkeoppsettet er nøyaktig som før.** Variant 2 står: GTM med HubSpot,
Clarity og Apollo laster for alle. Ingen tagger er lagt til eller fjernet,
banneret er urørt. Det eneste som er endret er *når*.

Dessuten: cache på `public/` (`max-age=86400,
stale-while-revalidate=604800`, **ikke** `immutable` — filnavnene våre endres
ikke ved utskifting), `browserslist` satt til moderne nettlesere, og
`priority` fjernet fra artikkelbildet, som står under folden.

### Hvorfor scoren ikke flyttet seg

**Lighthouse måler helt til siden er rolig — og «rolig» er nøyaktig når
`requestIdleCallback` fyrer.** Containeren lastes altså inne i
måleperioden, og TBT teller den fortsatt. Utsettelsen hjelper ekte
besøkende, som får en brukbar side raskere, men den flytter ikke tallet.

### Hva som står igjen, og hva det koster

To veier til ≥ 80, og begge har en pris:

1. **Last GTM bare ved interaksjon, uten tomgangsluke.** Lighthouse
   interagerer aldri, så containeren ville ikke blitt lastet i det hele tatt
   under målingen. Scoren ville trolig gått til 95+.
   **Prisen:** alle som besøker siden uten å røre den — og det er en stor
   del av annonsetrafikken — ville ikke blitt talt i GA4 eller Google Ads.
   Leads er ikke rammet (`/takk` laster uansett umiddelbart), men
   sidevisninger, målgrupper og Ads-optimalisering er det. **Dette er å
   kjøpe et tall for ekte måling, og jeg har ikke gjort det.**
2. **Færre tredjeparter i containeren.** Apollo, Clarity og HubSpot koster
   hovedtråd. Bestillingen forbyr uttrykkelig å endre hvilke tagger som
   fyrer, og det er riktig — men det er her de 1,2 sekundene faktisk ligger.

Begge er Påls valg, ikke mine.

## Sporingen er verifisert på live etter del A

- **Forsiden:** GTM er ikke lastet etter 0,8 s, og er lastet etterpå. Alle
  tagger fyrer: GA4, Meta-pikselen, HubSpot, Clarity, Apollo og Ads.
- **`/takk`:** GTM lastet innen 0,8 s, altså umiddelbart.
- **Testinnsending** fra ekte nettleser via
  `?utm_source=test&utm_medium=runde3` → `/kontaktoss`:
  - `/takk` nådd, referrer `/kontaktoss`
  - **GA4: `page_view`, `takk_page_view` OG `generate_lead` fyrte alle tre**
  - Google Ads (`AW-11026823614`): to `page_view`-kall
  - E-posten kom 21:05:36Z med `Kilde: source=test | medium=runde3 …`
  - Ingen feil i Vercel-loggen

### Ett funn som ikke er vårt, og som bør sjekkes i GTM

**Meta-pikselen sender ingen hendelser.** `connect.facebook.net/fbevents.js`
og `signals/config/572759520853896` lastes, og `fbq` finnes i nettleseren —
men det går **null kall til `/tr`**, hverken PageView på forsiden eller Lead
på `/takk`.

Dette er ikke forårsaket av utsettelsen: på `/takk` lastes containeren
umiddelbart, akkurat som før, og pikselen sender ingenting der heller. Det
ser ut som at taggen i GTM initialiserer pikselen uten å spore noe. Det må
undersøkes i GTM — bestillingen forbyr meg å endre hvilke tagger som fyrer.
