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

---

# Runde 2 — 30.09.2026: to nye sider inn i kartet

Bestilt av Pål samme dag: «strukturer slik du mener er best mtp instrukser om
hva som ikke dekkes. sørg for at ingen sider konkurrerer med hverandre i
forhold til kanibalisme.»

Siden tabellen over ble skrevet, har nettstedet fått to sider til: `/kjeder`
(29.09) og `/reels-produksjon` (30.09). Ingen av dem sto i kartet.

## Den nye skillelinjen: flate, og så form

De fem opprinnelige sidene skiller på **hvor filmen vises**. Det skillet
består, og det er fortsatt det bærende. De to nye skiller på noe annet, og
det er verdt å si rett ut, fordi to skillelinjer i samme kart er nettopp det
som skaper rot hvis ingen skriver dem ned:

| Side | Skiller seg på | Eier spørsmålet |
|---|---|---|
| `/kjeder` | hvem kunden er | «kan de levere til en kjede med femti utsalg» |
| `/reels-produksjon` | hvilket format som lages | «hvem lager Reels til fast pris» |

Begge selger i praksis det samme løpende arbeidet som forsiden. Det er ikke
en feil, men det er den skarpeste kannibaliseringsrisikoen på hele
nettstedet, og den måtte håndteres eksplisitt.

## Slik er den håndtert

**Forsiden eier prisen og leveransen.** Begge de nye sidene peker oppover dit
i avgrensningen sin, ikke sidelengs til hverandre. Leseren som vil ha hele
abonnementet beskrevet — strategi, publisering, vilkår — sendes til `/`.

**De nye sidene eier hvert sitt søk.** `/reels-produksjon` er bygget på ordet
Reels (1 300 søk i måneden i Norge mot 0 på «tiktok byrå»), `/kjeder` på
kjede- og retailordene. Forsiden er bygget på «SoMe-byrå». Tre ulike
inngangsord til samme tjeneste er bredde, ikke duplikat — så lenge ingen av
dem prøver å svare på de to andres spørsmål.

**Naven ruter nå til begge.** `/innholdsproduksjon` hadde bare veier videre
til de fire prosjekttjenestene. Halvparten av nettstedets eget svar — det
løpende — hadde ingen vei ut i det hele tatt, og de to nye sidene var derfor
usynlige fra naven. Seksjonen «Prosjekt eller abonnement» har nå lenker til
`/`, `/reels-produksjon` og `/kjeder`.

De ligger der og ikke i `eiker`. Eikene er sortert etter FLATE, og de to
løpende tjenestene hører ikke hjemme i den taksonomien. Å presse dem inn
ville gjort seks kort av fire og ødelagt logikken som gjør eikene lesbare.

## Kartet slik det står nå

| Side | Avgrensningen peker til |
|---|---|
| `/reklamefilm` | videoproduksjon, employer branding |
| `/videoproduksjon-i-oslo` | reklamefilm, employer branding |
| `/employer-branding-video-oslo` | videoproduksjon, bloggartikkelen om fagfeltet |
| `/eventfotograf-eventvideo` | videoproduksjon, reklamefilm |
| `/kjeder` | reklamefilm, forsiden |
| `/reels-produksjon` | forsiden, reklamefilm, videoproduksjon |
| `/innholdsproduksjon` | ingen — den er navet, og et nav konkurrerer ikke med sine egne eiker |

Ingen side er foreldreløs. `/eventfotograf-eventvideo` og
`/innholdsproduksjon` har ingen innkommende lenker fra de andre
tjenestesidene, men begge ligger i eikekortene og i bunnteksten.

## Det nærmeste paret som står igjen

`/kjeder` og bloggartikkelen «Sosiale medier for kjeder med flere
lokasjoner» ligger nærmest hverandre av alt på nettstedet. Arbeidsdelingen er
den samme som ellers mellom blogg og tjenesteside: artikkelen svarer på
hvordan en kjede løser innhold i det hele tatt, siden svarer på hva Reflektor
gjør for kjeder. Artikkelen lenker til siden to steder; siden lenker ikke
tilbake. Det er med vilje — lenkekraften skal gå én vei, mot den
kommersielle siden.

## To felt som ikke leses av noe

Funnet under gjennomgangen, ikke rettet:

- `pris` på `Tjenesteside` settes til `null` på alle sju sidene, og ingen
  komponent leser feltet.
- `tjenestesider`-arrayet eksporteres, men ingenting importerer det.

Begge er ufarlige i dag. De står oppført her slik at neste tekniske
gjennomgang slipper å finne dem på nytt.

## Søkeordkartet (04.10.2026)

Bestilt av Pål. Grunnlaget er Ahrefs-tall for Norge, søk per måned:
innholdsproduksjon 450, employer branding 400, filmproduksjon 200,
reklamefilm 200, content marketing byrå 200, videoproduksjon 150,
videoproduksjon oslo 150, content byrå 150, lage reklamefilm 150, some byrå
100, innholdsproduksjon oslo 80, eventfotograf 80, reklamefilm produksjon
80, eventfotograf pris 60, eventvideo 60, bedriftsfilm 50, sosiale medier
byrå 50, hva koster videoproduksjon bedrift 50. Vanskelighet 0–20 på alle
unntatt «filmproduksjon oslo» (54).

**Én side eier ett søkeord.** Andre sider kan bruke ordet i løpende tekst og
lenke til eieren, men ikke i tittel, H1 eller en seksjonsoverskrift.

| Side | Eier |
|---|---|
| Forsiden | some byrå, sosiale medier byrå |
| `/innholdsproduksjon` | innholdsproduksjon, innholdsproduksjon oslo, content byrå, innholdsbyrå |
| `/reklamefilm` | reklamefilm, reklamefilm produksjon, lage reklamefilm |
| `/videoproduksjon-i-oslo` | videoproduksjon, videoproduksjon oslo, bedriftsfilm, filmproduksjon |
| `/eventfotograf-eventvideo` | eventfotograf, eventvideo |
| `/employer-branding-video-oslo` | employer branding video, rekrutteringsfilm |
| `/reels-produksjon` | reels produksjon, reels videoer, reels for bedrifter |
| `/kjeder` | innhold for kjeder, reklamefilm for kjeder (sekundært) |
| `/blogg/hva-koster-*` | «hva koster X», «X pris» |
| `/blogg/hva-er-*` | «hva er X» |

**«Hva koster» er bloggens.** Fire tjenestesider hadde en overskrift som
stilte nøyaktig det spørsmålet artikkelen eier. De heter nå «Pris» eller
«Pris og pakke», og lenker til artikkelen. En tjenesteside som stiller samme
spørsmål som artikkelen, tar oppmerksomhet fra den uten å kunne svare like
fyldig.

### To kollisjoner ble funnet i bygget, ikke i kilden

`/faq` het «Ofte stilte spørsmål – SoMe-byrå og fast pris» og `/om-oss` het
«Om oss – SoMe-byrået Reflektor i Oslo». Begge konkurrerte med forsiden om
ordet forsiden skal eie. De ble ikke funnet av den første utgaven av
`tests/sokeord.test.ts`, som bare leste `tjenestesider` — de kom fram da
alle titler ble lest ut av det ferdige bygget. Testen dekker nå hele
nettstedet.

`/en` hadde dessuten «| Reflektor» i selve tittelstrengen, og malen i
`layout.tsx` legger det på selv. Den bygde siden het «… | Reflektor |
Reflektor». Rettet, og testet.

### Delblokker er ikke overskrifter

Titlene i `delblokker` rendres som `<p>` med halvfet vekt inne i et
listepunkt. Et listepunkt som heter «Reklamefilm» inne i en oversikt
konkurrerer ikke med `/reklamefilm`; en H2 ville gjort det. Første utgave av
kannibaliseringstesten tok dem med og slo ut på en delblokk som har stått
der siden 01.10.

### Ordtall, målt i `<main>` på det ferdige bygget

| Side | Før | Etter |
|---|---|---|
| `/innholdsproduksjon` | 559 | 1281 |
| `/reklamefilm` | 630 | 1026 |
| `/videoproduksjon-i-oslo` | 1016 | 1232 |
| `/reels-produksjon` | 1078 | 1184 |
| `/eventfotograf-eventvideo` | 660 | 727 |
| `/employer-branding-video-oslo` | 509 | 572 |

«Før» er hentet fra den levende siden før pushen, ikke regnet ut av kilden.

### Det som ikke ble gjort, og hvorfor

**Canonical og brødsmuler var der fra før.** Bestillingen sa at alle
bloggposter manglet `<link rel="canonical">` og at `BreadcrumbList` måtte
legges til. Begge sto allerede: canonical i `generateMetadata` i
`/blogg/[slug]`, brødsmulene i `BrodsmuleSchema` på tjenestesider,
bloggposter, bloggoversikten og kundecasene. `tests/markering.test.ts` er
derfor en vakt mot at de forsvinner, ikke en ny funksjon.

**«Kjøper dere sendetid?» ble ikke lagt til i FAQ-en på `/reklamefilm`.**
Spørsmålet er allerede en egen seksjon lenger opp på siden, med et fyldigere
svar. To like spørsmål på samme side er nøyaktig den feilen fire dupliserte
FAQ-spørsmål ble ryddet for 21.09.2026.

**«Hvor lang tid tar det å produsere en reklamefilm?» ble droppet.**
Bestillingen sa «svar bare hvis det finnes tall på siden eller bloggen».
Leveringstiden etter opptaksdagen står (to uker), men en reklamefilm har
også idé, manus og koordinering foran seg, og det finnes ingen oppgitt
varighet på det. Et samlet anslag ville vært et tall vi ikke har.

**Setningen om de tre prisdriverne på eventsiden er urørt.** Den er Påls
egen etter korreksjonen 30.09.2026, og oppgir allerede nøyaktig de tre
faktorene bestillingen ba om. Å skrive den om ville vært å røre en
formulering han selv har rettet.

## Internlenkene fra bloggen (04.10.2026)

Bestilt av Pål etter at Search Console-tallene ble lagt fram. Målingen
01.09–04.10.2026, visninger per måned:

| Side | Visninger | Plassering |
|---|---|---|
| `/blogg/markedsforing-i-sosiale-medier-some` | 2 514 | 26 |
| `/blogg/hva-er-innholdsproduksjon` | 1 587 | 15 |
| `/blogg/hva-er-innholdsmarkedsforing` | 864 | 27 |
| `/blogg/hva-er-videomarkedsfring` | 761 | 23 |
| `/blogg/hva-gjr-en-innholdsprodusent` | 566 | 46 |
| `/innholdsproduksjon` | 397 | 32 |
| `/reklamefilm` | 306 | 31 |
| `/videoproduksjon-i-oslo` | 34 | 45 |
| `/employer-branding-video-oslo` | 3 | 6 |

**Bloggen er det eneste som er synlig, og tjenestesidene er usynlige.** Alle
klikk nettstedet får, kommer på merkenavnet: «reflektor» 53 klikk,
«reflektor as» 16. På kjøpsordene står vi på side 2–4 — «sosiale medier
byrå» plass 20, «some byrå» 25, «reklamefilm» 30, «videoproduksjon oslo» 34
— og får null klikk.

Derfor skal bloggen sende både lesere og autoritet videre. Internlenker fra
blogg til salgsside, talt i brødteksten: **21 før dagen i dag, 33 nå.**

**Ankerteksten sier hva målsiden er.** «Les mer» på
`hva-er-employer-branding` ble byttet til «employer branding-video», og
«uten bindingstid» på den mest synlige artikkelen av alle ble byttet til
«SoMe-byrå i Oslo». En lenke fra en side med 2 514 visninger er den mest
verdifulle internlenken nettstedet har; ankerteksten på den kan ikke være
innholdsløs.

`tests/internlenker.test.ts` vokter fire ting: at hver lenkefrase står
ordrett og nøyaktig én gang i avsnittet sitt (står den to ganger, blir begge
til lenker; står den ikke, forsvinner lenken uten feilmelding), at ingen
side lenkes to ganger fra samme avsnitt, at de sju mest synlige artiklene
lenker til en salgsside i selve teksten og ikke bare i «Les videre», og at
ankerteksten ikke er «les mer» eller «her».

### Search Console ER koblet til

AGENTS.md sier at GSC ikke er koblet til Ahrefs-prosjektet. Det stemmer
ikke lenger — tallene over er hentet derfra 04.10.2026. Punktet i AGENTS.md
bør rettes neste gang noen er innom fila.

### Det som ikke er gjort, og som betyr mer

Internlenker flytter noe, men ikke fra plass 30 til plass 5. Anbefalingen
som står igjen er **Google-bedriftsprofilen**: på «videoproduksjon oslo»,
«eventfotograf» og «reklamefilm oslo» ligger det et kart over de organiske
treffene. Reflektor står allerede på plass 9–10 organisk på «videograf» og
«event fotograf», men er ikke i kartet. Det er utenfor koden, og ligger hos
Pål.
