# Sidearkitektur: hvem eier hvilke ord

Skrevet 21.09.2026 på Påls instruks: «din oppgave blir å hindre
kanibalisering på tvers av landingssider, samtidig som vi henter trafikk
fra et bredt felt.»

Grunnlaget er søkeordsdataene i `docs/synlighet-2026.md` og
avgrensningen Pål ga 21.09: reklamefilm er tv-reklame og større
produksjoner, videoproduksjon er bannervideo, skjermer, brand video.

---

## Skillelinjen: hvor filmen vises, ikke hvordan den ser ut

Format er ubrukelig som skille. En 30-sekunders film kan være både en
reklamefilm og en bannervideo — samme kamera, samme klipperom, samme
lengde. Skiller man på format, får man to sider som beskriver det samme
håndverket, og det er nøyaktig kannibaliseringen som skal unngås.

**Distribusjonsflaten skiller rent:**

| Side | Filmen vises | Kunden betaler for |
|---|---|---|
| `/reklamefilm` | flater andre eier — TV, annonseplass, betalte visninger | å bli sett av folk som ikke lette etter dem |
| `/videoproduksjon-i-oslo` | flater kunden selv eier — nettside, tjenesteside, skjerm i butikk | å forklare seg til folk som allerede er der |
| `/employer-branding-video-oslo` | rekrutteringskanaler — stillingsannonser, karriereside | å bli valgt som arbeidsgiver |
| `/eventfotograf-eventvideo` | dokumentasjon av noe som skjedde én gang | å ha det i etterkant |
| `/` (forsiden) | løpende publisering, hver uke, hele året | kontinuitet, ikke et prosjekt |

Dette er ikke en språklig øvelse. Det er fem ulike kjøpssituasjoner med
ulike budsjetteiere: markedssjef, nettredaktør, HR, arrangør, daglig
leder. En side per kjøpssituasjon kannibaliserer ikke, fordi ingen av dem
svarer på det samme spørsmålet.

---

## Ordfordelingen

Alle volumtall fra Ahrefs, Norge, 21.09.2026.

### `/reklamefilm` — kampanjefilmen

| Søkeord | Vol | KD |
|---|---|---|
| reklamefilm | 200 | 9 |
| filmproduksjon | 200 | 14 |
| lage reklamefilm | 150 | — |
| filmproduksjon oslo | 100 | 54 |
| reklamefilm produksjon | 80 | — |
| reklame på tv | 70 | 3 |
| tv reklame | 60 | 5 |
| god reklamefilm | 60 | — |
| filmproduksjon bedrift | 50 | — |
| hvordan lage reklamefilm | 50 | — |
| reklamefilm bedrift / byrå / pris / fotograf | 40 × 4 | — |
| produsere reklamefilm | 40 | — |
| filmproduksjon pris | 40 | — |
| **Samlet** | **~1 300** | |

**Intensjonsfellen som må adresseres eksplisitt:** «hva koster tv reklame»
og varianter (~150 samlet) handler om **kjøp av sendetid**, ikke om
produksjon. Reflektor produserer film; de kjøper ikke media. Det skal stå
rett ut på siden. Det er både ærlig og et sterkt AEO-svar, fordi det er et
avgrensende faktum ingen konkurrent gidder å skrive.

Like viktig: `tv 2 play uten reklame` og `pluto tv uten reklame` er folk
som vil **slippe** reklame. De skal ikke jaktes.

### `/videoproduksjon-i-oslo` — filmen på egne flater

| Søkeord | Vol | KD |
|---|---|---|
| videoproduksjon | 150 | 2 |
| videoproduksjon oslo | 150 | — |
| bedriftsvideo | 70 | — |
| hva koster videoproduksjon bedrift | 50 | — |
| film og videoproduksjon | 40 | — |
| bedriftsvideo produksjon | 20 | — |
| **Samlet** | **~480** | |

Innholdet Pål beskrev: bannervideo til nettsider, film på tjenestesider,
skjermer, brand video.

**Denne siden nevner ikke employer branding som leveranse.** Den lenker
dit. Se konflikten under.

### `/employer-branding-video-oslo` — arbeidsgivermerkevaren

| Søkeord | Vol | KD |
|---|---|---|
| employer branding | 400 | **1** |
| hva er employer branding | 100 | 0 |
| employer branding strategi | 90 | 0 |
| employer branding norsk | 70 | — |
| rekrutteringsvideo | 50 | — |
| employer branding norge | 40 | — |
| employer branding konsulent | 20 | — |
| **Samlet** | **~770** | |

### `/eventfotograf-eventvideo` — dokumentasjonen

| Søkeord | Vol | KD |
|---|---|---|
| eventfotograf | 80 | — |
| eventvideo | 60 | — |
| eventfotograf pris | 60 | — |
| **Samlet** | **~200** | |

Minst felt, men helt uten overlapp mot de andre.

---

## Konflikten som må løses først: employer branding

`employer branding` er 400 i volum med vanskelighetsgrad 1 — nest største
kommersielle mulighet i hele analysen. Og termen finnes **tre steder**:

1. `/blogg/hva-er-employer-branding` — **lever i dag**, 1 447 ord,
   rangerer
2. `/employer-branding-video-oslo` — tom landingsside
3. `/videoproduksjon-i-oslo` — Pål nevnte employer branding som en av
   leveransene der

Tre sider om samme term er samme feil som `/sosiale-medier-byra`, ganget
med tre.

**Løsningen, og den er streng:**

| Side | Eier | Skal aldri |
|---|---|---|
| `/blogg/hva-er-employer-branding` | **definisjonen**. «Hva er det, hvorfor spiller det noen rolle.» Informasjonssøk. | selge en tjeneste, eller prise noe |
| `/employer-branding-video-oslo` | **tjenesten**. «Vi lager filmen som gjør at folk søker jobb hos dere.» Kommersielt søk. | definere begrepet på nytt — den lenker til bloggen for det |
| `/videoproduksjon-i-oslo` | **ingenting** av dette | nevne employer branding som leveranse. Den lenker videre. |

Blogginnlegget beholder «hva er employer branding» (100). Landingssiden
tar «employer branding» (400) og «rekrutteringsvideo» (50). Ingen av dem
gjentar den andres setninger.

---

## Seks mekanismer som holder skillet

Fordeling av søkeord på papiret er verdiløst uten noe som håndhever det.

1. **Én H1-entitet per side.** Ingen sides H1 inneholder en annen sides
   hovedterm. `/videoproduksjon-i-oslo` sier ikke «reklamefilm» i H1;
   `/reklamefilm` sier ikke «videoproduksjon».

2. **Eksplisitt avgrensning på hver side.** Et kort avsnitt som sier hva
   siden *ikke* dekker, med lenke dit det hører hjemme: «Skal filmen
   kjøpes visning for, på TV eller som annonse? Det er reklamefilm →».
   Dette gjør to jobber samtidig — leseren havner riktig, og
   språkmodellen får et eksplisitt avgrensningssignal den kan sitere.

3. **Ett faktum, én kanonisk side.** Pris, leveranse og prosess for hver
   tjeneste står ett sted. Trenger en annen side å referere til det,
   lenker den — den gjentar ikke.

4. **Krysslenker med rolle, ikke «les mer».** Ankerteksten sier hva den
   andre siden er: «reklamefilm for betalte flater», ikke «klikk her».
   Ankertekst er et av de sterkeste interne relevanssignalene som finnes.

5. **Egen `Service`-schema per side**, med ulik `serviceType` og ulik
   `description`. Identiske beskrivelser i markeringen er
   kannibalisering på maskinnivå, der det er lettest å måle og verst å
   overse.

6. **Forsiden rører ikke prosjektordene.** Den eier abonnementet. Sier
   den «vi lager også reklamefilm», begynner delingen på nytt — og det
   var nøyaktig den feilen `/sosiale-medier-byra` ble 301-et for.

---

## Bredden hentes, men i riktig etasje

Pål: «mange søker på bredere temaer for så å finne oss relevante.»

Det stemmer, og dataene viser hvor bredden ligger: `some` 3 300,
`reklame` 2 200, `employer branding` 400. Men bredden skal **ikke** ligge
på tjenestesidene, for da blir de informasjonssider som ikke konverterer.

Etasjene:

- **Bredt og informasjonssøkende** → bloggen. Den rangerer der allerede,
  og den har lenkene som holder den oppe.
- **Smalt og kommersielt** → tjenestesidene. Der ligger pengene og
  AI-siteringene.
- **Broen mellom dem** → krysslenker fra bloggartikkel til den
  tjenestesiden som løser problemet artikkelen beskriver.

Det er den eneste konstruksjonen der bredden henter trafikk uten at
tjenestesidene slutter å selge.

---

## Uavklart

`/innholdsproduksjon` står fortsatt åpen. Spørsmålet fra
`docs/synlighet-2026.md` kapittel 6 gjelder: selger Reflektor
prosjektproduksjon uten abonnement, og hva koster det? Uten et svar
lander den i samme kategori som `/sosiale-medier-byra` — en omskrivning
av forsiden — og da er 301 riktig dom, selv om det koster 450 i volum.
