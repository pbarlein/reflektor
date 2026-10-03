# Ytelse runde 5 — forsiden, 04.10.2026

Bestilt etter en måling som viste score 49, LCP 7,8 s og 2,8 MB. **De tallene
lot seg ikke gjenskape.** Alt under er målt mot live samme dag, Lighthouse
mobil, median av tre kjøringer.

## Før og etter

| | Før | Etter | Mål |
|---|---|---|---|
| Score | 73 | 78 | – |
| LCP | 1,96 s | 1,76 s | – |
| Render delay | 950 ms | 1 084 ms | under 1 s |
| Sidevekt (Lighthouse) | 1 162 kB | 1 130 kB | under 2 MB |
| Film ved full gjennomrulling | 23,3 MB | 16,6 MB | – |

Score og LCP varierer 74–80 og 1,6–2,0 s mellom kjøringer på samme side.
Render delay målt tre ganger på samme bygg: 950, 1 084 og tidligere 929 ms.
Den ligger PÅ grensen og vandrer over og under den fra kjøring til kjøring.

## De fire observasjonene, én for én

**1. Soulcake-omtalen lastes i to formater.** Stemmer — men bare i en
nettleser uten H.264. Markeringen har `<source>` mp4 først og webm etter, og
en nettleser ber aldri om kilde to når den sier den støtter kilde én.
Målebrowseren her er et Chromium bygget uten H.264 (`canPlayType` for
`avc1.64001f` gir tom streng), og den ber om mp4, avbryter, og henter webm.
Det samme skjer åpenbart i målingen observasjonen kom fra. Ekte Chrome,
Safari og Edge henter bare mp4-fila. **Ingen endring gjort.**

**2. `/reels/antonburst.mp4` vokste fra 192 til 481 kB i overføring.** Fila
er ikke endret siden 21.09. Tallet er hvor mye av en 8-sekunders løkke som
rakk å bli hentet før kjøringen stoppet, ikke en egenskap ved fila. Den er
nå kodet om uansett, se under.

**3. Videoer under bretten skal ha `preload="none"` og en
IntersectionObserver.** Det er allerede slik, og det er verifisert: av 22
videoer på forsiden laster nøyaktig én — heroklippet — før man ruller.
De 21 andre har `preload="none"` og får verken plakat eller data før de er
200 px unna. **Ingen endring nødvendig.**

**4. Ingressen har ~2,2 s render delay.** Målt til 0,9–1,1 s, ikke 2,2.
Årsaken er ikke font, hydrering eller skjult tekst — det ble undersøkt og
avkreftet i runde 4, se `ytelse-runde-4.md`. Hovedsnittet lastes med
`next/font` og `display: swap`, og forhåndslastes. Det som står igjen er
TTFB (630 ms av totalen) og en hovedtråd der ALLE lange oppgaver er
sporingsskript. **Ingen endring gjort — sporingen skal ikke røres.**

## Det Lighthouse ikke ser

Lighthouse ruller ikke, så den ser aldri film. En besøkende som ruller
gjennom hele forsiden lastet **23,3 MB film**. Der ligger vekten, og den er
usynlig i alle scorene.

To filer sto for 8,7 MB av de 23,3:

**Reklamefilmen fra Peppes: 7,7 MB.** 1920×1080 på 4 Mbit/s, vist som et
dekorativt kort på 272–390 px i «Utenom abonnementet». Kortet peker nå på
`peppes-reklamefilm-kort.mp4`: 960×540, uten lydspor, 1,2 MB.
**Originalfila er urørt** — den skal kunne vises som film på `/reklamefilm`.

**Heroklippet: 1,0 MB.** Det ene klippet HVER besøkende laster ned, uansett
om de ruller. CRF 33 → 36: 1 011 → 738 kB.

Begge er kontrollert ved å hente samme bilderute fra gammel og ny fil og
skalere den til flaten klippet faktisk vises i (390×390 for kortet, 364×416
for heroen). Ingen synlig forskjell. Begge filene dekoder rent.

## Prøvd og forkastet

**Omtalefilmene** (Soulcake 2,1 MB, Russemerch 2,6 MB, begge 720×900 på
~800 kbit/s). CRF 30 ga 9 % mindre fil. De har innbrent teksting, som er det
første som taper seg når bitraten faller. Ikke verdt det.

## Det som gjenstår

Galleriet er 10 reels à 0,6–1,6 MB, til sammen ~10 MB. De er 640×1138 og
vises i ruter på 180–260 px, så de kunne vært halvert. **Men de samme
filene brukes på andre sider** — blant annet `/reels-produksjon`, der de
vises i større flater. En nedskalering må vurderes per side, ikke som ett
søk-og-erstatt. Den runden er ikke gjort.

## Grensen for hva som kan måles herfra

Målebrowseren mangler H.264. Den spiller derfor ingen av mp4-filene, og
«spiller klippet?» kan ikke besvares i den. Det som ER kontrollert: begge de
nye filene dekoder uten feil, de har samme format og lengde som før, og
sidene laster dem fra riktig sti.

## Mediegjennomgang, hele siden (04.10.2026)

Bestilt av Pål: komprimer bilder og video på alle sider til den størrelsen de
faktisk vises i, uten at noe blir grynete.

**Bildene var allerede i orden, og det er verdt å vite hvorfor.** Alle bilder
går gjennom Next.js' bildeoptimalisering: de leveres som AVIF, skalert til
flaten de vises i. Målt på `/eventfotograf-eventvideo`, en av de tyngste
sidene: 26 bilder, 393 kB til sammen. Kildefilene i repoet kan være på
900 kB uten at noen laster dem ned. Å komprimere dem ville ikke endret ett
byte for besøkende.

**Video har ingen slik optimalisering.** Fila som ligger der, er fila som
lastes ned. Det er der jobben lå.

### Metoden

Hver eneste video på alle 34 sider ble målt i nettleseren, i to
skjermbredder, med den faktiske flatestørrelsen i CSS-piksler. Målhøyden ble
satt til det dobbelte av flaten (for skjermer med dobbel pikseltetthet), og
aldri høyere enn kilden. Deretter er hver fil kodet om og kontrollert ved å
hente samme bilderute fra gammel og ny fil, skalert og beskåret til nøyaktig
den flaten klippet vises i.

### Resultat

**52,0 → 31,9 MB.** 20 MB spart over 22 filer. De største:

| Fil | Før | Etter | Vises i |
|---|---|---|---|
| kjeder-format-9x16 | 5,0 MB | 1,5 MB | 165×208 |
| kjeder-format-4x5 | 4,5 MB | 1,5 MB | 165×208 |
| kjeder-format-16x9 | 4,1 MB | 1,2 MB | 362×204 |
| peppes-reklamefilm | 7,7 MB | 5,6 MB | 1104×621 |
| kjeder-peppes | 5,1 MB | 3,1 MB | 672×378 |
| kjeder-egon | 4,0 MB | 2,7 MB | 672×378 |

De tre formatklippene på `/kjeder` lå i full oppløsning og ble vist i ruter
på 165 px. Det er der de store prosentene kommer fra.

### Det som ble latt i fred

**`retail24-sandefjord.mp4`, 16,5 MB.** Den er 1 minutt og 43 sekunder, har
lyd, og spilles bare når noen trykker på play. Et forsøk på omkoding ga en
STØRRE fil — originalen er allerede effektivt kodet på 1 234 kbit/s for
720p. Å presse den ned ville kostet synlig kvalitet på den ene filmen som
faktisk vises som en film.

**Omtalefilmene** (Soulcake, 720×900) — se avsnittet over: 9 % gevinst, og
innbrent teksting taper seg først.

**Plakatbildene.** De lastes rått, uten optimalisering, og ble skalert til
flatestørrelse: 1 339 → 1 239 kB. Lite å hente — de var stort sett riktig
dimensjonert fra før. Bare filer som ble minst 10 % mindre, ble skrevet.

**`/video/hero.mp4` og `/video/hero-mobil.mp4`, 2,8 MB til sammen.** Ingen
referanser noe sted i koden. De lastes aldri ned av noen, men de ligger i
repoet. Ikke slettet — det er Påls avgjørelse.
