# Hvor skal innsatsen gå? Trafikk og konvertering

Bestilt av Pål 26.10.2026, som grunnlag for å konkludere i Chat.

Alle tall er hentet 26.10.2026 fra HubSpot, Google Ads, Meta og Search
Console. Perioden er **siste 90 dager (28.07–26.10.2026)** der ikke annet
står. Kildene er oppgitt under hver tabell.

---

## Konklusjonen først

**Nettsiden har ikke et konverteringsproblem. Den har et
trafikkproblem.**

Siden fikk 11 ekte henvendelser på 90 dager. To av dem er vunnet som
abonnement — 720 000 kr i årsverdi — og en tredje på 360 000 kr ligger i
presentasjonsfasen akkurat nå. Det er den høyeste treffraten av alle
kanalene vi har, og den koster ingenting i mediekjøp.

Problemet er at 11 henvendelser er alt siden klarte å produsere.

**Samtidig brukte Google Ads 26 155 kr på 90 dager og har null vunne
avtaler å vise til.**

Det er de to tallene hele vurderingen henger på.

---

## Kanalregnskapet

### Vunne avtaler siste 90 dager, etter kilde

| Kanal | Vunnet | Verdi | Mediekostnad |
|---|---|---|---|
| Kald e-post (Instantly) | 4 | 1 440 000 kr | verktøykost |
| Meta lead ads | 5 | 1 470 000 kr | 41 807 kr |
| **Nettsiden** | **3** | **760 000 kr** | **0 kr** |
| Henvisning | 1 | 50 000 kr | 0 kr |
| LinkedIn outbound | 0 | 0 kr | — |
| **Google Ads** | **0** | **0 kr** | **26 155 kr** |
| Eksisterende kunder | 9 | — | — |
| Ukjent kilde | 2 | 385 000 kr | — |

*Kilde: HubSpot, 26 vunne avtaler opprettet i perioden. Kanalen er lest av
avtalenavnet, som Pål selv merker, og kontrollert mot HubSpots eget
kildefelt. De to stemmer overens på alle avtalene der begge finnes.*

Merk at Meta-tallet er smigrende av en grunn: de fem vunne kom fra leads
generert i juni til september. Volumet er ferskt, treffene er ikke.

### Nettsidens egne tall

| | Antall |
|---|---|
| Skjemahenvendelser fra reflektor.no | 13 |
| – minus min egen test (localhost) | 12 |
| – minus innkommende spam (et redigeringsbyrå som selger til oss) | **11 ekte** |
| Vunnet | 2 |
| I presentasjonsfase nå | 1 (360 000 kr) |
| Tapt | 1 |

De elleve fordelte seg slik:

| Inngang | Antall | Resultat |
|---|---|---|
| Organisk søk | 4 | **1 vunnet** (Pallesen Bygg, 360 000 kr) + 1 i presentasjon (Inkassoregisteret, 360 000 kr) |
| Direkte | 3 | **1 vunnet** (trenogmat.no, 360 000 kr), 1 tapt |
| Instagram (lenke i bio) | 3 | — |
| Google Ads | 1 | — |

*Kilde: HubSpot, kontakter opprettet via skjema i perioden, med
førstegangs-URL og trafikkilde.*

**To av de fire organiske henvendelsene har blitt eller er i ferd med å
bli en avtale på 360 000 kr.** Det er ikke en kanal som trenger
reparasjon.

### Google Ads, siste 90 dager

| Kampanje | Visninger | Klikk | Kostnad | Konverteringer |
|---|---|---|---|---|
| Søk – Leads (kontaktskjema) | 4 595 | 243 | 18 295 kr | 3 |
| 2.0 – Søk – Generisk – Foto, video og Vekst | 3 247 | 139 | **7 860 kr** | **0** |
| **Sum** | 7 842 | 382 | **26 155 kr** | 3 |

*Kilde: Google Ads, konto 4905503001.*

I HubSpot finnes **én** kontakt fra betalt søk i hele perioden. Den landet
på /innholdsproduksjon 16.09 og har ikke blitt en avtale.

Den generiske kampanjen har brukt 7 860 kr uten én eneste konvertering.

---

## Hva det betyr

### 1. Ikke bygg om siden. Gi den trafikk.

En side som gjør 11 henvendelser om til 2 kunder og en tredje i prosess,
konverterer. Å bruke tid på å flytte knapper eller skrive om forsiden er å
løse feil problem.

Det som mangler er folk som kommer inn. Siden fikk 18 klikk fra Google
forrige måned, og 15 av dem var folk som søkte på «reflektor» eller Påls
navn.

### 2. De tre kommersielle sidene er der avstanden er kortest

| Søk | Side | Plass | Visn./mnd |
|---|---|---|---|
| innholdsproduksjon oslo | /innholdsproduksjon | 8,4 | 20 |
| videograf | /eventfotograf-eventvideo | 10,1 | 20 |
| eventfoto | /eventfotograf-eventvideo | 11,4 | 18 |

*Kilde: Search Console via Ahrefs, siste 30 dager.*

Plass 8–11 er bunnen av side 1 og toppen av side 2. Det er der klikkandelen
går fra nesten null til noe — noen få plasser er hele forskjellen. Titlene
på to av disse ble rettet 25.10 fordi Google kuttet dem; det var første
steg, ikke hele jobben.

Til sammenligning: bloggens ordbokartikler har 1 065 visninger i måneden og
**null klikk**, på plass 17–40. De er ikke der innsatsen skal.

### 3. Google Ads er pengespørsmålet

26 155 kr på 90 dager, null vunne avtaler, én identifiserbar henvendelse.
Den generiske kampanjen alene: 7 860 kr, null konverteringer.

Til sammenligning har den organiske inngangen til den samme siden —
/innholdsproduksjon og forsiden — levert to vunne abonnementer uten
mediekjøp.

**Det betyr ikke nødvendigvis «skru av».** Men det betyr at kampanjen som
ikke konverterer bør stoppes, og at resten bør få et krav på seg: en
kostnad per vunnet avtale vi faktisk aksepterer. Den finnes ikke i dag.

### 4. To ting som ikke er strategi, men som koster

Begge ble funnet i kvartalsgjennomgangen 25.10 og står fortsatt åpne:

- **Bot-sperren på skjemaet er aldri slått på.** Nøklene ble aldri lagt
  inn i Vercel. Ti minutters arbeid.
- **Clarity ignorerer samtykkesignalet vårt.** Én bryter i Clarity.

---

## Forslag til prioritering

**1. Stopp den generiske Google Ads-kampanjen.** 7 860 kr på 90 dager, null
konverteringer. Dette er det eneste punktet som frigjør penger i stedet for
å bruke dem.

**2. Sett et krav på resten av Google Ads.** Hva er en akseptabel kostnad
per vunnet abonnement? Uten det tallet kan ingen avgjøre om 18 295 kr for
tre konverteringer er bra eller dårlig.

**3. Løft de tre kommersielle sidene fra plass 8–11.** Det er den eneste
organiske innsatsen med kort vei til faktisk trafikk, og den inngangen har
allerede bevist at den konverterer. Konkret: innhold som dekker søkene
sidene nesten rangerer på, og interne lenker fra bloggen dit — ikke mer
ordbokstoff.

**4. Slå på bot-sperren og Clarity-samtykket.** Lav innsats, og det første
beskytter kanalen som konverterer best.

**Det som ikke bør gjøres nå:** bygge om nettsiden, skrive flere
«hva er …»-artikler, eller flytte innsats til LinkedIn-outbound, som har
mange møter og null vunne avtaler i perioden.

---

## Forbehold, så Chat kan vekte dem

- **Attribusjonen er Påls egne merkelapper** i avtalenavnene, kontrollert
  mot HubSpots kildefelt. De stemmer overens, men en avtale som er merket
  feil, er talt feil. To vunne avtaler på til sammen 385 000 kr står som
  «ukjent kilde».
- **90 dager og 26 vunne avtaler er lite.** Forskjellen mellom tre og fem
  vunne avtaler på en kanal kan være tilfeldig. Retningen er tydelig;
  presisjonen er det ikke.
- **Meta-tallene er ikke sammenlignbare over tid.** Volumet er fra oktober,
  treffene er fra juni–september, og det harde filteret på Meta-leads ble
  først satt inn 12.10.
- **Kostnaden ved kald e-post og LinkedIn er ikke med.** Verktøy og
  arbeidstid er reelle kostnader som ikke står i noen av tabellene her.
  Kanalregnskapet er derfor ikke et fullstendig lønnsomhetsregnskap.
- **Google Ads' tre konverteringer er GA4-hendelser**, ikke avtaler. Én av
  dem finnes igjen som kontakt i HubSpot. De to andre lar seg ikke spore.
