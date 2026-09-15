# Reflektor ny nettside — status til gjennomgang

Skrevet 15.09.2026 av Claude Code, til gjennomgang i prosjektet
«Reflektor – Marketing».

Du som leser dette har markedskonteksten, men har ikke sett koden. Dokumentet
forklarer derfor hva som er bygget, hvilke valg som er tatt og hvorfor, og
hvilke spørsmål som står åpne. Konkrete spørsmål til deg står nederst.

**Kort oppsummert:** en ny nettside er bygget fra bunnen i Next.js og ligger på
en privat preview-URL. Dagens reflektor.no på Squarespace er urørt og kjører
videre som normalt. To sider har nesten all tekst på plass. Prosjektet står
stille fordi det mangler videoklipp og ett kundesitat.

---

## 1 · Hva som faktisk er bygget

Ny side på **Next.js, hostet på Vercel**, bygget parallelt med dagens
Squarespace-side. Ingenting er publisert: alle sider serverer `noindex` og
`Disallow: /`, så de ikke kan konkurrere med reflektor.no i søk.

17 ruter finnes. Statusen på tekstinnhold:

| Side | Tekst på plass | Merknad |
|---|---|---|
| `/sosiale-medier-byra` | 30 av 38 felt | Abonnementssiden. Mangler 6 bildetekster + 1 sitat |
| `/` (forsiden) | 19 av 25 felt | Mangler 6 bildetekster |
| `/produktfoto` | 0 av 29 felt | Struktur bygget, tekst ikke startet |
| `/reklamefilm`, `/videoproduksjon-i-oslo`, `/innholdsproduksjon` | — | Ruter finnes, innhold ikke startet |
| `/blogg/*` (17 artikler) | — | URL-er reservert, **tekst ikke migrert** |

Fungerer og er testet: kontaktskjema som sender lead på e-post til
pal@reflektor.no og videresender til `/takk`. Hele kjeden er verifisert med en
reell innsending 23.08.

---

## 2 · Endringer mot dagens nettside

Dette er det du best kan vurdere. Alt under er bevisste avvik fra hvordan
reflektor.no ser ut og oppfører seg i dag.

### Søkeord fordeles mellom sider

Tidligere konkurrerte forsiden og abonnementssiden delvis om samme ord. Nå:

- **`/sosiale-medier-byra`** eier «sosiale medier byrå» og «SoMe-byrå». H1 er
  «Sosiale medier-byrå i Oslo med fast pris», og «SoMe-byrå» er plassert i
  meta description fordi begge ikke fikk plass i en H1 på maks åtte ord.
- **Forsiden** har beholdt «Sosiale medier – nesten på autopilot.» og skal
  ikke ha kommersielle søkeord i det hele tatt. Den fordeler trafikk videre.

Begrunnelsen er at to sider som kjemper om samme ord kannibaliserer hverandre
framfor å gi dobbelt sjanse.

### Hastighet er hovedgevinsten

Målt på dagens forside: **6,3 sekunders lastetid og 14 MB overført**, hvorav
13,7 MB er video fordelt på 13 filer i full bredde uten forhåndsbilde.
Praktisk konsekvens i dag: heroen viser en tom svart boks med spinner i flere
sekunder, og seksjoner lenger ned står tomme til videoen dukker opp.

Ny side har et budsjett på maks 2 sekunder og 1,8 MB ved første visning.
Hero-videoen er komprimert fra 13,9 MB til 1,9 MB, med egen mindre fil til
mobil og et stillbilde som vises umiddelbart.

### Tekniske feil som er rettet

- `/kontakt` og `/kontakt-oss` ga 404 på dagens side. De sender nå til
  `/kontaktoss`.
- Hele `/tjenester/`-treet ga 404. De gamle adressene sender nå til riktig
  side i stedet for å være blindveier.
- `/` og `/hjem` serverte identisk innhold. Nå finnes forsiden kun på `/`.
- `/takk` het «General 1» i søkeresultater. Rettet, og satt til ikke å
  indekseres.
- Kontaktskjemaet på dagens side har ingen reell validering — feltene sjekkes
  kun av JavaScript. Nytt skjema validerer i nettleseren og på server.

### Ett funn verdt å merke seg

Adressen `/tjenester/produktfoto` gir 404 i dag, men har **1 935 visninger og
posisjon 15,8 på søkeordet «produktfoto»** i Search Console. Første utkast av
omdirigeringene sendte den til forsiden sammen med resten av de døde
adressene. Den sender nå til `/produktfoto`.

Det er den sterkeste kommersielle posisjonen på et ikke-merkevareord, og den
var i ferd med å bli kastet bort fordi kartet var skrevet ut fra crawl-data
uten trafikktall.

---

## 3 · Beslutninger som er tatt

Disse er gjort og implementert. De kan diskuteres, men de er ikke tilfeldige.

**Bloggen beholdes, men utvides ikke.** 17 artikler med til sammen rundt 481
refererende domener. Innholdet er ordbok- og skoleoppgavestoff som ikke
konverterer, men lenkene er ekte autoritet. URL-ene bevares tegn for tegn,
innholdet migreres, og det lages ikke mer av den typen.

**Kunder omtales som produksjonskunder.** Idun, Orkla, Anton Sport, Egon, Soul
Cake, Selvaag, The Well, ASKO og Vitusapotek vises som bedrifter Reflektor har
produsert innhold for — aldri som abonnenter på SoMe-tjenesten. Teksten sier
eksplisitt at abonnentene ikke oppgis offentlig.

**Prisen står åpent.** 30 000 kr/mnd, tre måneders oppsigelse, ingen
bindingstid. «Pris» er første menypunkt og peker til abonnementssiden.

**Visuelt uttrykk videreføres.** Oransje `#DE4826`, beige flate, Poppins,
mørke seksjoner, brun gradient, knapper som står litt skjevt. Logoen er hentet
ut som vektor fra originalfilen.

---

## 4 · Hva som stopper prosjektet nå

Alt ligger hos Pål. To ting låser mest:

1. **Seks til tolv videoklipp i 9:16.** Begge sidene har et rutenett som viser
   fram produsert arbeid. Det finnes ingen slike klipp i prosjektet ennå, og
   det stopper tolv bildetekster.
2. **Ett kundesitat med navn og rolle, godkjent for publisering.** Plasseres
   ved kontaktskjemaet.

Mindre, men utestående: FAQ-svar om ferieavvikling og flytting av
produksjonsdag, fra-pris for videoproduksjonsdag og produktfotodag, samt
gateadresse og organisasjonsnummer til bunnteksten.

**Den harde lanseringssperren er bloggen.** URL-ene er på plass, men tekstene
er ikke hentet ut av Squarespace. Lanseres siden slik den står, byttes sider
som rangerer på førsteplass ut med tomme sider.

---

## 5 · Spørsmål vi ønsker vurdering på

Dette er der markedsfaglig og teknisk vurdering møtes, og der Pål har sagt at
han ikke kan vurdere selv.

**a) Rekkefølge på lansering.** Dagens plan er: abonnementssiden ferdig først,
så forsiden, så fire landingssider, så migrering. Alternativet er å lansere
den nye siden på et underdomene og flytte trafikk gradvis. Hva taler for og
imot, gitt at Google Ads i dag peker på `/sosiale-medier-byra`?

**b) Bloggmigreringen.** 17 artikler skal flyttes uten å miste rangeringer.
Bør de flyttes som de er, eller er noen av dem så svake at de bør slås sammen
eller fjernes? Merk at de bærer lenkeautoriteten, men ikke konverterer.

**c) Videohosting.** Klippene kan enten ligge i prosjektet som filer, eller
hos en strømmetjeneste som Mux eller Cloudflare Stream. Det siste gir bedre
kvalitet på dårlig nett og lavere lastetid, men koster penger og et
integrasjonsledd. Hvor mange klipp snakker vi om over tid?

**d) Sporing ved overgangen.** GTM-containeren og Google Ads-konverteringen
videreføres uendret — over 100 historiske konverteringer henger på dem.
Verifisering i Google Ads-grensesnittet er ikke gjort ennå. Hva er riktig
rekkefølge for å teste dette uten å risikere historikken?

**e) To Google-kontoer i Harald Bulis navn** er fortsatt koblet til
Squarespace. De må kartlegges før noe kobles fra, ellers kan integrasjoner
ryke stille. Hvem eier den oppgaven?

**f) Preview-URL-en er offentlig** for alle med lenken, selv om den ikke er
søkbar. Bør den passordbeskyttes før flere får den?

---

## 6 · Hvordan prosjektet arbeider

Nyttig å kjenne til, fordi det forklarer hvorfor ting går som de går.

All tekst ligger i egne innholdsfiler, atskilt fra koden, med en maksimal
lengde per felt. Et automatisk skript stopper publisering hvis en side mangler
tekst eller bryter lengdegrensene. Manglende tekst vises som en synlig
`TBD`-markør i preview, slik at det er umulig å tro at en side er ferdig.

Claude Code skriver ikke tekst selv. Den ber om den, ett par seksjoner om
gangen, med tegngrense og en forklaring på hva seksjonen skal besvare. Det er
derfor fremdriften går i puljer.

Alt som er uavklart føres i et vedlegg framfor å bli gjettet. Det ligger 27
punkter der nå, hvorav de fleste er lukket.
