# Kvartalsgjennomgang 25.10.2026

Første av de kvartalsvise gjennomgangene Pål bestilte 25.10.2026: hele
nettstedet, teknisk og strategisk, mot ferske tall. Neste: **januar 2027**.

Alt under er målt den dagen, mot live eller mot det bygde HTML-et. Ingenting
er hentet fra hukommelsen, og ingenting er endret uten en måling bak seg.

## Kortversjonen

Fundamentet er solid. Ytelsen er langt innenfor Googles grenser, det finnes
ikke ett tilgjengelighetsbrudd på nettstedet, markeringen er hel, alle 34
adressene svarer, og det har ikke vært én kjøretidsfeil på sju dager.

Fire ting ble rettet. To ting kan bare Pål rette, og begge er viktige.

---

## Det som ble målt

### Ytelse — godt innenfor

Målt på 390×844 mot live, uten buffer:

| Side | TTFB | LCP | CLS |
|---|---|---|---|
| `/` | 559 ms | 904 ms | 0,002 |
| `/innholdsproduksjon` | 126 ms | 428 ms | 0,001 |
| `/blogg/hva-koster-et-some-byra` | 126 ms | 416 ms | 0,058 |
| `/kontaktoss` | 194 ms | 700 ms | 0,001 |

Googles grenser er LCP under 2 500 ms og CLS under 0,1. Vi ligger på en
tredjedel av LCP-grensen på den tyngste siden.

**Egen kode er ikke problemet, og det er verdt å si eksplisitt:** av de
~3 300 KB en sidevisning laster, er ~1 076 KB vårt eget og ~2 200 KB
tredjeparter i GTM-containeren. Meta-pikselen alene er 844 KB.

### Tilgjengelighet — null brudd

axe-core mot WCAG 2.1 AA pluss best-practice, 16 sider × 2 bredder (390 og
1 280 px): **ingen brudd.** Ingen sider ruller sideveis på telefon.

### Adresser, markering og omdirigeringer

- Alle 34 URL-ene i sitemapet svarer 200.
- Riktig canonical på alle, én H1 på alle, ingen utilsiktet `noindex`.
- Ingen ugyldig JSON-LD, ingen dobbel `FAQPage`, ingen dobbel `Organization`.
- hreflang peker gjensidig mellom `/` og `/en`, med `x-default`.
- De 60 omdirigeringene svarer **301** på live, som dokumentert.
- De fire annonserte adressene svarer 200.

### Sikkerhet og drift

- `npm audit`: ingen sårbarheter.
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` og
  `frame-ancestors` er på plass.
- Ingen nøkler i repoet. Alt ligger i Vercel.
- **Null kjøretidsfeil siste sju dager.**
- Ingen `any`-typer, ingen `console.log` på avveie.

### Målingen av KPI-en

Verifisert i nettleser, ikke i kilden — `/takk` laster GTM-N4KGSS93, fyrer
`takk_page_view`, og både GA4 (G-1QJ6BRWGJ8) og Google Ads (AW-11026823614)
registrerer sidevisningen. **Målingen av den eneste KPI-en er intakt.**

---

## Det som ble rettet

### 1. Tre kommersielle titler ble kuttet av Google

| Side | Var | Er |
|---|---|---|
| `/` | 65 tegn | 50 |
| `/innholdsproduksjon` | 67 | 53 |
| `/reklamefilm` | 67 | 50 |
| `/en` | 61 | 52 |

Alle fire ble kuttet midt i en setning i søkeresultatet. Søkeordet står
fortsatt først i hver av dem.

`/innholdsproduksjon` er den som koster mest: siden lå på **plass 8,4 for
«innholdsproduksjon oslo»** med 20 visninger og null klikk siste måned. En
kuttet tittel nederst på side 1 er to handikap på det samme klikket.

### 2. Årsaken bak dem, ikke bare symptomet

Dette er **sjette gang** den samme feilen rettes for hånd: 01.10 (79 tegn,
kuttet midt i «firmaarrangement»), 14.10 (to titler), 25.10 (to titler), og
nå tre til.

Årsaken er at ingen målte det som faktisk ble publisert. Forsidens tittel
har en uttrykkelig grense — `maksTegn: 60` — og strengen der er 53 tegn og
går fri. Malen i `layout.tsx` legger på « | Reflektor» **etterpå**, og de
tolv tegnene har aldri vært med i noen sjekk. Tjenestesidene hadde ingen
grense i det hele tatt.

**`scripts/metasjekk.ts` er lagt til og står i CI.** Den leser det bygde
HTML-et, som markeringssjekken og av samme grunn: det er det eneste stedet
tittelen finnes ferdig satt sammen. Den feiler på en tittel over 60 tegn og
på en side uten beskrivelse, og advarer på en beskrivelse over 160.
Forsidens egen grense er satt til 48, som er 60 minus suffikset.

Feilen kan ikke gjentas uten at CI sier fra.

### 3. To meta-beskrivelser ble kuttet

`/innholdsproduksjon` (188 tegn) og `/blogg/hva-er-innholdsmarkedsforing`
(164). Begge er kortet. Søkeordene står.

### 4. Samtykkebanneret lovet noe som ikke var sant

Banneret sa: **«Ingenting settes før du har sagt ja.»**

Målt mot live samme dag, før banneret er besvart:

| Hva | Cookies |
|---|---|
| Meta-pikselen (844 KB) | `_fbp` på reflektor.no |
| Microsoft Clarity | `CLID`, `MUID`, `SM`, `ANONCHK` |
| Bing | `MUID`, `MR`, `SRM_B` |
| HubSpot | `__cf_bm` |

**Etter «Bare nødvendige» skjer nøyaktig det samme.** 3 358 KB mot 3 357 KB,
og én cookie mer.

Dette er ikke en feil i koden. Det følger av Påls valg 02.10.2026 om ikke å
sette samtykkekravet på de tre taggene inne i GTM — valget og konsekvensen
står dokumentert i `Sporing.tsx`. Men **setningen i banneret var usann**, og
`Samtykke.tsx` påsto i tillegg i sitt eget filhode at «ingenting fyrer før
valget er tatt», stikk i strid med det `Sporing.tsx` sier på samme nettsted.

Setningen er fjernet. Banneret sier nå hva vi bruker informasjonskapsler
til og peker på personvernerklæringen, uten å påstå noe om tidspunkt eller
virkning. Knappene «Godta alle», «Bare nødvendige» og «Velg selv» står som
før. Filhodet er rettet så de to filene forteller én sann historie.

**Oppførselen er ikke endret.** Den er Påls å bestemme, og den står under.

---

## Det bare Pål kan gjøre

### A. Bot-sperren på skjemaet er bygget, men aldri slått på

Turnstile ble bygget, testet og rullet ut 11.10.2026. **Nøklene er aldri
lagt inn i Vercel.** Kontrollert i miljøvariablene i dag: ingen
`TURNSTILE_*`. Koden logger «ikke konfigurert» og slipper alt gjennom —
spam-scoren bærer alene.

Det er den sperren som fanger botten som skriver feilfritt norsk fra en
norsk IP, og den er den eneste i kjeden som måler nettleseren i stedet for
teksten.

**Hva som trengs:** to nøkler fra Cloudflare Turnstile (gratis), lagt inn
som miljøvariabler i Vercel. Ti minutters arbeid.

### B. Clarity ignorerer samtykkesignalet vårt

Koden sender riktig signal — `consentv2` med `ad_Storage` og
`analytics_Storage` — og har gjort det siden 02.10. Men Clarity-prosjektet
(`rkgf0frfdt`) er ikke satt opp til å *kreve* samtykke, og da er signalet
uskadelig, men virkningsløst. Forbeholdet sto allerede i koden; i dag er det
målt at det slår inn.

**Hva som trengs:** én bryter i Clarity-prosjektet. Skrur den på, slutter
Clarity å sette cookies for den som sier nei — uten at noe annet endres.

Gjøres A og B, kan setningen «ingenting settes før du har sagt ja» komme
tilbake i banneret og være sann.

---

## Det strategiske bildet

Dette er det ubehagelige tallet, og det er viktigere enn alt det tekniske:

**Siste 30 dager hadde nettstedet 18 klikk fra Google. 15 av dem var folk
som søkte på «reflektor», «reflektor as», «pål barlein» eller en skrivefeil
av dem. Null klikk kom fra et søk som ikke var vårt eget navn.**

Samtidig: 1 065 visninger på bloggens ordbokartikler, alle med null klikk,
alle på plass 17–40.

### Men det er to ekte muligheter i tallene

**1. De kommersielle sidene ligger på vippepunktet.**

| Søk | Side | Plass | Visn. |
|---|---|---|---|
| innholdsproduksjon oslo | /innholdsproduksjon | 8,4 | 20 |
| videograf | /eventfotograf-eventvideo | 10,1 | 20 |
| eventfoto | /eventfotograf-eventvideo | 11,4 | 18 |

Plass 8–11 er bunnen av side 1 og toppen av side 2 — der klikkandelen er
nesten null, og der noen få plasser er forskjellen på trafikk og ingenting.
Det er her innsats betaler seg, ikke på ordbokartiklene. Tittelrettelsene i
dag er første steg; neste steg er innhold og interne lenker mot de tre.

**2. AI-assistenter finner oss allerede, og på kjøpsspørsmål.**

Elleve prompter fra AI-assistenter har truffet oss siste tre måneder, 88
visninger, **plass 1–4,5 på samtlige**. Alle elleve er kjøpsspørsmål
(«hvem kan hjelpe meg med», «finnes det noen som tilbyr fast abonnement»).
Ingen er «hva er …». Det er grunnlaget for arbeidet som ble gjort 25.10 og
for vurderingen i `kort-svar-og-faq-25-10-2026.md`.

---

## Det som ble vurdert og bevisst ikke gjort

- **Rydding av «død» kode.** Et søk fant eksporterte symboler uten treff
  andre steder. De aller fleste er typer brukt internt, og søket kan ikke
  skille. Å fjerne kode i leadkjeden på et usikkert grunnlag er risiko uten
  gevinst for noen.
- **Interne lenker til to bloggposter** som ikke lenkes til fra annet
  innhold. De er ordbokartikler, og å sende lenkekraft dit ville trekke den
  bort fra sidene som faktisk kan konvertere.
- **Lighthouse i CI** (TODO i `ci.yml`). Målingene i dag viser at vi ligger
  på en tredjedel av LCP-grensen. En budsjettsjekk i CI koster
  vedlikeholdsarbeid og ville ikke funnet noe.
- **Opprydding til én portvokter i leadkjeden.** Dette er den ene reelle
  strukturgjelden som står igjen, og Pål bestemte 14.10 at den skulle gjøres
  først. Den ble ikke gjort her: det er en større omskriving av veien et
  lead går, den kan ikke prøves mot ekte trafikk før den er ute, og en feil
  der koster et lead. Den fortjener en egen runde, ikke en halv time på
  slutten av en gjennomgang.
- **Oppgradering av Next 16.4.2 → 16.4.3 og React 19.2.8 → 19.3.1.** Ingen
  sikkerhetsvarsler, ingenting vi mangler. Å bytte motor i en side som
  fungerer, uten en grunn, er den klassiske måten å ødelegge noe på.

## Neste gjennomgang

**Januar 2027.** Kjør de samme målingene: sweep av alle sitemap-URL-er,
axe-core på 16 sider × 2 bredder, LCP/CLS på fire sider, cookie-måling før
og etter valg, `npm audit`, kjøretidsfeil i Vercel, og GSC for klikk fordelt
på merkevare mot resten. Skriptene ligger ikke i repoet — de er skrevet for
anledningen og hører hjemme der, ikke i produksjonskoden.

Det ene tallet å følge: **klikk fra søk som ikke er vårt eget navn.** I dag
er det null.
