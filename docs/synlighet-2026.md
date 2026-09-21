# Synlighet 2026: søkeordsanalyse og AEO-strategi

> **STATUS 21.09.2026: BYGGET.** Alle fem tjenestesider, bloggen med åtte
> migrerte artikler og én ny, samt `/kontaktoss` og `/gratis-strategimote`
> står. Se A56 i `docs/vedlegg-a.md` for hva som ble bygget og hvilke tre
> feil som ble funnet underveis. Rekkefølgen i kapittel 5 er utført, med
> ett unntak som er begrunnet der.

Skrevet 21.09.2026 på bestilling fra Pål: «gå igjennom alle landingssidene
og optimaliser basert på research, AEO og SEO … start med en solid
søkeordsanalyse … ikke føl deg begrenset av eksisterende brief».

Dette dokumentet er grunnlaget. Byggingen følger etter, i rekkefølgen
nederst.

---

## 1. Hva Reflektor faktisk rangerer på i dag

Hentet fra Ahrefs 21.09.2026, `reflektor.no` som subdomener, Norge.

**25 søkeord rangerer. Alle 25 tilhører bloggen eller `/kontaktoss`.**

| Søkeord | Vol | Pos | KD | CPC | URL |
|---|---|---|---|---|---|
| some | 3 300 | 28 | 17 | 0,87 $ | /blogg |
| reklame | 2 200 | 19 | 3 | 0,45 $ | /blogg/hva-er-reklame |
| reklamer | 800 | 20 | 2 | 0,36 $ | /blogg/hva-er-reklame |
| hva er some | 350 | **2** | 0 | 0,86 $ | /blogg/markedsforing-i-sosiale-medier-some |
| innholdsmarkedsføring | 350 | **3** | 0 | 1,30 $ | /blogg/hva-er-inbound-marketing |
| reflektor | 250 | 5 | 0 | 0,10 $ | /kontaktoss |
| some markedsføring | 150 | 6 | 0 | 1,49 $ | /blogg/markedsforing-i-sosiale-medier-some |
| markedsføring bedrift | 150 | 9 | 0 | 1,71 $ | /blogg/hvordan-markedsfore-bedrift |
| so me | 70 | **1** | 30 | 1,22 $ | /blogg/markedsforing-i-sosiale-medier-some |
| digital historiefortelling | 50 | **1** | 0 | — | /blogg/hva-innebaerer-digital-historiefortelling |
| some kanaler | 20 | **1** | 0 | — | /blogg/markedsforing-i-sosiale-medier-some |

**Ingen av de fem tjenestesidene rangerer på noe som helst.**
`/innholdsproduksjon`, `/reklamefilm`, `/videoproduksjon-i-oslo`,
`/employer-branding-video-oslo` og `/eventfotograf-eventvideo` er usynlige.

**AI Overview vises på 11 av de 25.** Det er ikke en detalj — se kapittel 3.

---

## 2. Det kommersielle gapet

Søkeord med reell kjøpsintensjon, hentet fra Ahrefs Keywords Explorer
samme dag. Alle er norske volumtall.

| Søkeord | Vol | KD | CPC | Reflektor i dag |
|---|---|---|---|---|
| **innholdsproduksjon** | 450 | **0** | 1,80 $ | har side, rangerer ikke |
| filmproduksjon | 200 | 14 | 1,40 $ | ingen side |
| reklamefilm | 200 | 9 | 0,40 $ | har side, rangerer ikke |
| videoproduksjon | 150 | **2** | 1,20 $ | har side, rangerer ikke |
| videoproduksjon oslo | 150 | — | — | har side, rangerer ikke |
| lage reklamefilm | 150 | — | 0,90 $ | nei |
| some byrå | 100 | 21 | 2,00 $ | har side, rangerer ikke |
| hva er innholdsproduksjon | 100 | — | 0,70 $ | nei |
| filmproduksjon oslo | 100 | 54 | 1,80 $ | nei |
| digital innholdsproduksjon | 90 | 0 | 0,70 $ | nei |
| innholdsproduksjon til nettsider | 90 | — | — | nei |
| innholdsproduksjon oslo | 80 | — | — | nei |
| **sosiale medier byrå** | 50 | 19 | **2,50 $** | har side, rangerer ikke |
| hva koster videoproduksjon bedrift | 50 | — | — | nei |
| filmproduksjon bedrift | 50 | — | — | nei |
| fotograf oslo bedrift | 40 | — | — | nei |
| reklamefilm bedrift pris | 40 | — | — | nei |

**`innholdsproduksjon` er den største enkeltmuligheten:** 450 i volum,
vanskelighetsgrad 0, 1,80 $ CPC — og Reflektor har allerede URL-en. Den
rangerer på ingenting.

`produktfoto` (150, KD 0) er bevisst utelatt. Pål 19.09.2026: tjenesten er
avviklet.

**Pål hadde rett i observasjonen sin:** «mange søker på bredere temaer for
så å finne oss relevante». Tallene viser det — de brede ordene (`some`
3 300, `reklame` 2 200) er der trafikken er, og de smale kommersielle er
der pengene er. Strategien må dekke begge, men ikke med samme sidetype.

---

## 3. Det funnet som snur strategien

Fra researchen, med kilder:

> **Bunn-trakt-innhold slår topp-trakt-innhold i AI-søk.** Kundecaser,
> prissider, tjenestesammenligninger og produktspesifikasjoner gir høyest
> AI-henvist trafikk. Tradisjonelle «hva er»- og «hvordan»-guider har hatt
> betydelig trafikkfall, fordi AI-plattformene svarer på dem direkte uten å
> sitere noen.
> — Bigeye, *Answer Engine Optimization Guide 2026*

**Hele Reflektors blogg er «hva er X».** Den er nøyaktig kategorien som
kannibaliseres. AGENTS.md sa allerede at innholdet ikke konverterer;
researchen legger til at det heller ikke vil bli sitert framover.

Samtidig: bloggen bærer ~481 refererende domener, og den rangerer på
posisjon 1–3 for flere ord. Den skal ikke slettes. Den skal slutte å være
strategien.

### Hva som faktisk driver sitering

| Grep | Effekt | Kilde |
|---|---|---|
| Legge til **sitater** | +37 % synlighet | Aggarwal et al., *GEO*, ACM KDD 2024 (arXiv:2311.09735) |
| Legge til **statistikk** | +22 % synlighet | samme |
| Målrettet optimalisering totalt | opptil +40 % | samme |
| **FAQ-schema** | ca. +40 % siteringsvekt i ChatGPT | Leapd, 2026 |
| Strukturerte data generelt | +73 % utvalg i AI Overviews | samme |
| Ekspertsitat med etterprøvbar kompetanse | +41 % tillitssignal | Bigeye, 2026 |
| Multimodalt innhold (tekst + bilde/video/tabell) | +156 % utvalg i AI Overviews | Leapd, 2026 |

### Hvor på siden siteringene hentes

- **44,2 %** av alle LLM-siteringer kommer fra de **første 30 %** av siden
  (Search Engine Land)
- For Google AI Overviews spesifikt: **55 %** (CXL, studie av 100 AI
  Overviews)

Det betyr at svaret må stå øverst i hver seksjon, ikke som konklusjon.

### Ferskhet er en rangeringsfaktor

- **83 %** av AI-siteringer på kommersielle søk går til sider oppdatert
  siste 12 måneder; **over 60 %** siste 6 måneder (AirOps, *2026 State of
  AI Search*)
- Perplexity siterer innhold publisert siste 30 dager i **82 %** av
  tilfellene
- Synlig årstall i tittel og overskrifter: ca. **+30 %** siteringsrate

### Den ubehagelige delen

- **84 %** av AI-siteringer kommer fra *earned media*, ikke egen nettside
  (Muck Rack, analyse av 25 mill. lenker)
- Merkevarers egne nettsider utgjør bare **5–10 %** av kildene
- Merkevareomtale korrelerer **3× sterkere** med AI Overview-synlighet enn
  backlinks (0,664 mot 0,218 — Authority Tech)

**Konsekvens for dette prosjektet:** nettsiden alene kan ikke løse
AI-synlighet. Den kan gjøre Reflektor siterbar når noen først ser etter —
og det er det denne jobben kan levere. Resten er PR, omtale og
bransjenærvær, som ligger utenfor et kodeprosjekt. Det skal sies tydelig
og ikke loves bort.

### Tallene spriker, og det skal stå

Andelen AI Overview-siteringer som også rangerer i topp 10 oppgis som
**17–38 %** (BrightEdge/Ahrefs 2026), **76 %** (andre 2025-tall) og **99 %**
(Bigeye). Spriket er så stort at ingen av tallene bør brukes som premiss.
Det eneste som er robust på tvers av kildene: god organisk rangering
hjelper, men garanterer ikke sitering, og sitering kan skje uten topp
10-plassering.

---

## 4. Arkitekturen som følger av dette

### Tre sidetyper, tre jobber

**A. Tjenestesider — bunn-trakt, kommersiell intensjon.**
Dette er der AI-siteringer og leads faktisk ligger. Hver skal ha: åpen
pris, hva som inngår og ikke, konkrete leveranser, navngitte kundecaser
med tall, FAQ med schema, og et svar-først-avsnitt på 40–60 ord rett
under H1.

**B. Bloggen — beholdes for lenkeverdien, oppgraderes ikke som strategi.**
De 8 ekte artiklene (se A54) migreres med teksten intakt og får
AEO-struktur: spørsmålsformede H2-er, svar først, FAQ-schema, oppdatert
dato. De skal ikke utvides til å bli bærende. De skal være ryddige.

**C. Nye artikler — bare bunn-trakt.**
Ingen flere «hva er X». Det som mangler, og som forskningen sier faktisk
siteres, er pris- og sammenligningsinnhold. Kandidater fra søkeordsdataene:

| Tema | Søkeord som støtter det | Vol |
|---|---|---|
| Hva koster videoproduksjon for bedrift | hva koster videoproduksjon bedrift, filmproduksjon pris, reklamefilm bedrift pris, pris filmproduksjon | 170 samlet |
| SoMe-byrå eller ansette selv | (dekkes i FAQ i dag, fortjener egen side) | — |
| Hva koster et SoMe-byrå | finnes allerede som blogginnlegg, 701 ord — skal utvides | 100 |

### Én ting som allerede er et fortrinn

Reflektor har **åpen pris** på forsiden. Prissider er navngitt som en av de
tre mest siterte innholdstypene. Det er et forsprang de fleste norske
byråer ikke har, fordi de skriver «ta kontakt for pris».

---

## 5. Testen hver tjenesteside må bestå

**RETTELSE 21.09.2026.** Kapittel 4 og 5 sto opprinnelig med
`/sosiale-medier-byra` som byggemål nummer fire, med et spørsmål om den
burde bygges. Pål påpekte at det var avgjort, og han har rett.

Vedtaket fra 15.09.2026, i `docs/cutover.md`:

> Google AI Mode siterer vekselvis forsiden og `/sosiale-medier-byra` for
> samme prompt, fordi begge bærer samme fakta. To sider med samme fakta
> deler signalene i to. Det AI belønner er setningene, ikke URL-en — og
> setningene følger med i en 301.

Det var et **AEO-vedtak**, ikke en opprydding. Søkeordene `sosiale medier
byrå` (50, 2,50 $) og `some byrå` (100, 2,00 $) er dermed **forsidens**
ansvar, ikke en egen sides.

### Prinsippet gjelder alle fem, ikke bare den ene

Det var dette jeg ikke tok konsekvensen av. Regelen som følger:

> **En tjenesteside fortjener å eksistere bare hvis den bærer fakta
> forsiden ikke bærer.** Er fakta de samme, deler de to sidene signalene,
> og begge blir svakere enn én av dem ville vært alene.

Forsiden selger **abonnementet**: én produksjonsdag i måneden, 8–10
videoer, publisering to ganger i uken, 30 000 kr/mnd.

Men produksjonskundene — Anton Sport, The Well, Peppes Pizza, Egon, Baker
Brun — er ifølge AGENTS.md **produksjonskunder, ikke abonnenter**.
Prosjektproduksjon er altså en reell, separat virksomhet. Det er den, og
bare den, en tjenesteside kan bygges på uten å konkurrere med forsiden.

### Testen anvendt

| Side | Bærer den egne fakta? | Dom |
|---|---|---|
| `/sosiale-medier-byra` | nei — samme tilbud som forsiden | **301 til `/`** ved cutover. Avgjort. |
| `/reklamefilm` | ja — en reklamefilm er et prosjekt, ikke et abonnement | bygges |
| `/employer-branding-video-oslo` | ja — rekrutteringsvideo, eget bruksområde | bygges |
| `/eventfotograf-eventvideo` | ja — eventdekning, eget bruksområde | bygges |
| `/videoproduksjon-i-oslo` | delvis — overlapper `/reklamefilm` | grensen må settes |
| `/innholdsproduksjon` | **usikkert — se under** | avklares først |

### Problemet med `/innholdsproduksjon`

Den er samtidig den største muligheten (450 vol, KD 0, 1,80 $) og den
som ligner mest på forsiden. «Innholdsproduksjon» er bokstavelig talt
det abonnementet gjør: produsere innhold, månedlig.

Bygger vi den som «vi produserer innhold for bedrifter», har vi laget
`/sosiale-medier-byra` på nytt under et annet navn — samme feil,
14 dager senere.

Den kan bare forsvares hvis den beskriver **prosjektproduksjon uten
abonnement**: en annen leveranse, en annen prismodell, en annen kunde.
Det er fakta jeg ikke har, og ikke skal finne på.

### Rekkefølge, oppdatert

1. **`/reklamefilm`** — 200 vol, KD 9. Består testen uten forbehold.
2. **`/videoproduksjon-i-oslo`** — 150 + 150 vol, KD 2. Krever at grensen
   mot `/reklamefilm` settes først: hva er prosjektet, hva er formatet.
3. **`/employer-branding-video-oslo`** og **`/eventfotograf-eventvideo`** —
   lavere volum, men egne bruksområder og annonseres mot.
4. **`/innholdsproduksjon`** — størst gevinst, men først når spørsmålet i
   kapittel 6 er besvart.
5. **De 8 bloggartiklene** — migrering + AEO-struktur.
6. **Nye prissider** — etter at tjenestesidene står.

`/sosiale-medier-byra` står ikke på lista. Forsiden skal bære de ordene,
og den gjør det delvis allerede: «sosiale medier-byrå» står fire ganger i
markeringen og FAQ-svaret. Det kan styrkes uten en ny side.

## 6. To ting jeg trenger avklart

**Copy-protokollen.** AGENTS.md sier at Claude Code ber om copy og ikke
skriver den selv. Pål har nå bedt om at jeg lager copy. Jeg tolker det
som at protokollen er opphevet for denne jobben, men **ikke** regelen om
at ingenting skal finnes på: «Ikke finn på copy, tall, kundenavn, priser
eller resultater» er en integritetsregel, ikke en designregel.

Praktisk betyr det: jeg skriver prosa, men hver faktapåstand — tall,
kundenavn, resultater — må komme fra noe som allerede er verifisert i
repoet. Der det mangler, blir det stående som `TBD(...)`.

**Selger Reflektor prosjektproduksjon uten abonnement — og hva koster
det?** Det avgjør om `/innholdsproduksjon` kan bygges i det hele tatt.
Produksjonskundene beviser at virksomheten finnes; jeg mangler
leveransen og prismodellen. Uten dem blir siden en omskrivning av
forsiden, og da er 301 til `/` det riktige — samme dom som
`/sosiale-medier-byra` fikk.

**Hvor går grensen mellom `/reklamefilm` og `/videoproduksjon-i-oslo`?**
Er det format mot format (én film mot flere), eller bruk mot bruk
(kampanje mot løpende)? To sider som begge sier «vi lager video i Oslo»
er samme feil i mindre skala.
