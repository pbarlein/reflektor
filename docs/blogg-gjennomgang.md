# Gjennomgang av bloggen

Bestilt av Pål 29.09.2026: «veldig grundig gjennomgang av all copy på
bloggen. alt skal være reelt nyttig, SEO og AEO optimalisert, ikke noe
byråvås eller ai-formuleringer.»

Ni artikler lest i sin helhet. Alle tall under er hentet, ikke anslått.

---

## 1. Hva bloggen faktisk leverer i dag

| Artikkel | Trafikk/mnd | Søkeord | Beste søkeord | Volum | Plass |
|---|---|---|---|---|---|
| markedsforing-i-sosiale-medier-some | 25 | 6 | some markedsføring | 150 | 6 |
| hva-innebaerer-digital-historiefortelling | 14 | 1 | digital historiefortelling | 40 | **1** |
| hvordan-markedsfore-bedrift *(alias, 301)* | 6 | 1 | markedsføring bedrift | 200 | 9 |
| hva-er-inbound-marketing *(død, 301)* | 5 | 1 | innholdsmarkedsføring | 350 | **3** |
| /blogg | 4 | 5 | virkemidler i reklame | 70 | 9 |
| hva-er-innholdsmarkedsforing | 3 | 2 | innholdsmarkedsføring | 350 | 7 |
| hva-er-reklame *(død, 301)* | 2 | 2 | reklame | 2 200 | 19 |
| hva-er-videomarkedsfring | 0 | 1 | videomarkedsføring | 20 | 12 |
| hva-er-personas, hvordan-ta-portrett-bilder | 0 | — | — | 0 | — |

Kilde: Ahrefs Site Explorer, reflektor.no, 29.09.2026.

**Hele bloggen henter rundt 59 besøk i måneden.** Fire av ni artikler har
null. Til sammenligning: 578 levende refererende domener peker på
reflektor.no. Det er lenkeverdien som er verdien — akkurat som AGENTS.md sier
— ikke trafikken.

**En ting som retter seg selv ved cutover:** `hva-er-inbound-marketing` er en
død slug som ligger på plass 3 for «innholdsmarkedsføring» (350 i volum),
mens den levende `hva-er-innholdsmarkedsforing` ligger på plass 7 for samme
ord. To av våre URL-er konkurrerer, og den som skal bort rangerer best.
301-en i `next.config.ts` slår dem sammen. Det er det største enkeltløftet
bloggen får, og det er allerede bygget.

---

## 2. Feil som må rettes

### 2.1 To faktafeil — begge står live på reflektor.no i dag

**a) «4:5 som tilsvarer Reels på Instagram og poster på TikTok»**
(markedsforing-i-sosiale-medier-some)

Feil på begge. Reels er **9:16** (1080 × 1920). 4:5 (1080 × 1350) er stående
feed-post. TikTok er 9:16. Kontrollert mot Figma, Adobe og Hootsuites
størrelsesguider 29.09.2026.

Dette er verre enn en vanlig faktafeil: Reflektors egne tjenestesider sier
«Videoene leveres stående i 9:16». Bloggen motsier salgssiden på selskapets
kjernekompetanse — og det er nettopp formatspørsmål en kjøper bruker for å
vurdere om et byrå kan faget.

**b) «Så mange som ni av ti nordmenn bruker sosiale medier hver eneste dag.
Ifølge undersøkelsen …»** (samme artikkel)

SSB, Norsk mediebarometer 2025: **82 prosent** — altså 8 av 10. Tallet er
overdrevet med rundt åtte prosentpoeng.

«Ifølge undersøkelsen» viser dessuten til en undersøkelse som aldri nevnes.
Samme avsnitt trekker fram X (tidligere Twitter) som en kanal nordmenn er
storbrukere av; SSB 2025 viser X på 8–15 prosent i de yngste gruppene, og
Snapchat, TikTok og YouTube langt over. Avsnittet er utdatert.

### 2.2 Ingen av de åtte migrerte artiklene har én eneste kilde

Null `kilde`-blokker, null tabeller, null utgående lenker til noe
etterprøvbart. Tre av dem oppgir likevel tall:

- «ni av ti nordmenn» — ingen kilde, og feil
- «Ifølge en studie fra Wyzowl mener 90 % … og 87 % …» — ingen lenke, intet årstall
- «Facebook rapporterer at folk har 1,5 ganger større sannsynlighet …» — ingen lenke, intet årstall

Dette er den viktigste AEO-svakheten i hele bloggen. Svarmotorer kan ikke
verifisere en påstand uten kilde, og foretrekker en konkurrent som oppgir
tall det går an å sjekke. De to nye artiklene fra 2026 gjør det riktig —
Altinn og SSB med lenke — og forskjellen er tydelig.

### 2.3 Tre skrivefeil og én betydningsfeil

| Står | Skal være | Hvor |
|---|---|---|
| innholdsproduks**en**ter | innholdsprodus**ent**er | hva-er-innholdsproduksjon |
| «autoritær spiller på markedet» | autoritativ | hva-er-innholdsproduksjon |
| «kjempe viktig» | kjempeviktig | markedsforing-i-sosiale-medier-some |
| «Les også:Hvordan …» | manglende mellomrom | markedsforing-i-sosiale-medier-some |

«Autoritær» betyr myndig i betydningen udemokratisk. Setningen sier at
innhold gjør deg til en autoritær aktør i markedet.

### 2.4 Fire foreldreløse bildetekster

Setninger som beskriver bilder som ikke ble med i migreringen, og som nå
står midt i brødteksten som løsrevne påstander:

- «Dette er kun et eksempel ment å illustrere hvordan man kan og bør merke en annonse i en Instagram-post.»
- «Bruk tid på å formulere unikt og engasjerende skriftlig innhold.»
- «Sørg for at bildene dine er unike og engasjerende, og bruk gjerne tid på redigere dem før du publiserer dem.» *(også manglende «å»)*
- «Samarbeid gjerne med profesjonelle videografer som hjelper deg med å lage videoer som gjør inntrykk på folk.»

### 2.5 Tre «Les også» uten lenke

`Innlenke`-mekanismen ble laget 27.09.2026 nettopp for dette, men disse tre
ble ikke fanget:

- «Les også:Hvordan lykkes med innholdsproduksjon»
- «Les også: Hva innebærer inbound marketing?» → må peke på
  `/blogg/hva-er-innholdsmarkedsforing`, ikke på den døde slugen
- «Les også: Hva gjør en innholdsprodusent?»

Teksten inviterer til klikk som ikke finnes.

### 2.6 Samme avslutning fire ganger

«Hos Reflektor kan du hente uvurderlig hjelp fra … Våre fotografer fanger de
riktige salgsutløsende øyeblikkene … Tilgangen på godt innhold er bare et
klikk unna!» står i fire artikler i nær identisk form. Det er duplisert
innhold på tvers av URL-er, og det er den svakeste teksten i hver av dem.

---

## 3. Byråvåset, målt

Talt over hele bloggen: **uvurderlig** 5, **engasjerende** 12, **verdifull**
15, **avgjørende** 12, **unik** 18, **helhetlig** 7, **skreddersydd** 4,
«gull verdt» 2, «et klikk unna» 2, «nøkkelen til» 3.

Verst: *«God belysning, klar lyd og stabil kameraføring er essensielle
faktorer som vi i Reflektor håndterer med perfeksjon!»* — en påstand som ikke
kan dokumenteres, om noe som burde vises i stedet for sies. Siden har nå
ekte referansefilmer; de gjør jobben denne setningen prøver på.

**Tre definisjoner av samme ord etter hverandre.** `hva-er-innholdsproduksjon`
åpner med «Innholdsproduksjon er en strategisk tilnærming …», så kommer
«## Hva er innholdsproduksjon? Innholdsproduksjon er en strategisk innsats
…», så «## Definisjon på innholdsproduksjon: Man kan definere
innholdsproduksjon som …». 2 000 ord, null trafikk.

**Tiltaleform.** Bloggen bruker du/deg/din 157 ganger mot dere/deres 30.
Resten av nettstedet sier bevisst «dere» — nettstedet snakker til et selskap.
Et personskifte mellom blogg og tjenesteside leser som to forfattere.

---

## 4. Hva jeg vil gjøre med de åtte gamle

Ikke skrive dem om. AGENTS.md er tydelig: bloggen beholdes for lenkeverdien
og skal ikke styre arkitekturen. Å bruke dager på å pusse tekst som henter
59 besøk i måneden er feil bruk av tiden.

**Men fire ting koster lite og bør gjøres før lansering:**

1. Rett de to faktafeilene. De er live i dag og motsier salgssidene våre.
2. Rett de fire skrivefeilene og fjern de fire foreldreløse bildetekstene.
3. Gjør de tre «Les også» til ekte lenker.
4. Erstatt den dupliserte avslutningen med én kort, felles avslutning som
   sier pris og leveranse — samme grep som allerede er gjort nederst i
   `markedsforing-i-sosiale-medier-some`.

**Én artikkel fortjener mer:** `hva-koster-et-some-byra` er 429 ord uten
tabell og uten kilde, på det mest kjøpsnære søket bloggen har. Den bør få
prissammenligningen som tabell og Byråmatch som oppgitt kilde med lenke.
Sammenligningstabeller er blant de mest siterte formatene i svarmotorer.

---

## 5. Hvilke nye innlegg som bør produseres

Utgangspunktet er hva folk faktisk søker på i Norge. Volumene er små — det er
realiteten i et norsk B2B-marked — så antallet innlegg er ikke poenget.
Poenget er at hvert innlegg skal svare på noe **bare Reflektor kan svare
på**, med tall og kilder.

Målte volum (Ahrefs, Norge, 29.09.2026):

| Søk | Volum/mnd | Vanskelighet | CPC |
|---|---|---|---|
| innholdsproduksjon | 450 | 0 | 180 |
| hva er some | 400 | 0 | 90 |
| sosiale medier strategi | 200 | 0 | 80 |
| some byrå | 100 | 21 | 200 |
| innhold til sosiale medier | 100 | — | — |
| hva er innholdsproduksjon | 100 | — | 70 |
| hva koster videoproduksjon bedrift | 50 | — | — |
| hvordan lage reklamefilm | 50 | — | — |
| sosiale medier byrå | 50 | 19 | 250 |

**Merk en felle:** norsk «SoMe» kolliderer med engelsk «some». Flere av
treffene på «hva er some» er engelske søk. Volumet er reelt, men lavere enn
tallet ser ut.

### Fem innlegg, i prioritert rekkefølge

**1. «Hva koster videoproduksjon for en bedrift?»** — 50/mnd, ren
kjøpsintensjon
Reflektor oppgir pris åpent; nesten ingen andre gjør det. Samme mal som
prisartikkelen: hva prisen består av, hva som driver den opp, hva vi tar.
Dette er søket som kommer rett før en henvendelse.

**2. «Hva er en produksjonsdag?»** — lite volum, høy AEO-verdi
Hele tilbudet hviler på denne enheten, og ingen andre forklarer den. En
svarmotor som ikke forstår enheten, kan ikke gjengi prisen riktig. Skal
inneholde: hva som skjer på dagen, hva dere må stille med, hva som kommer ut
(8–10 ferdige videoer), og hva en ekstra dag koster.

**3. «SoMe-byrå, frilanser eller ansatt?»** — utvider det som virker
Artikkelen om ansatt mot byrå er den beste teksten på hele nettstedet. Den
mangler det tredje alternativet, som er det de fleste faktisk vurderer.
Samme form: tall, tabell, kilder, og ærlig om når frilanser er riktig valg.

**4. «Innhold til sosiale medier for kjeder med flere lokasjoner»** —
100/mnd på hovedordet
Støtter den nye kjedesiden, og treffer et segment ingen norske byråer
skriver for. Reflektor har fire kjeder å vise til og seks leveranseformater
å forklare.

**5. «Sosiale medier-strategi: hva den faktisk må inneholde»** — 200/mnd,
vanskelighet 0
Størst volum av de kjøpsnære. Må unngå å bli enda en definisjonsartikkel:
den skal være malen Reflektor selv bruker på en produksjonsplan, ikke en
lærebok.

### Ett grep uten ny artikkel

«Hva er SoMe» og variantene er til sammen rundt 550 i volum med
vanskelighetsgrad 0. Svaret ligger allerede som en H2 i
`markedsforing-i-sosiale-medier-some`, men det er to setninger uten
struktur. Å gjøre det til et skikkelig, siterbart definisjonssvar koster ett
avsnitt — og AGENTS.md forbyr å lage **flere** ordbokartikler, ikke å svare
ordentlig der spørsmålet allerede står.

### Det som ikke bør skrives

Ingen flere «Hva er X»-artikler av typen personas, virkemidler i reklame
eller holdningskampanje. Det er skoleoppgavestoff, det konverterer ikke, og
AGENTS.md forbyr det uttrykkelig. De seks døde slugene av den typen 301-es
allerede til oversikten.

---

## 6. Ferskhet er en siteringsfaktor, og fem artikler er fra 2024

83 prosent av AI-siteringer på kommersielle søk går til sider oppdatert siste
tolv måneder. Fem artikler er fra juni–august 2024.

Datoene skal ikke pyntes — det står allerede i `artikler.ts`, og det er
riktig. Men en artikkel som faktisk oppdateres, kan få ny dato ærlig. Rettes
faktafeilene og legges kilder inn, er det en reell oppdatering.

Forslag til rytme: to artikler oppdateres ordentlig per halvår, de som
rangerer best først — altså `markedsforing-i-sosiale-medier-some` og
`hva-innebaerer-digital-historiefortelling`, som ligger på plass 1 for sitt
ord.


---

## 7. Utført 29.09.2026

Pål godkjente de fire punktene i avsnitt 4. Alle er gjort, ingen annen copy
er rørt:

1. **Begge faktafeilene rettet.** «Ni av ti» → 82 prosent med SSB som
   oppgitt kilde og lenke. «4:5 som tilsvarer Reels» → 9:16 for Reels og
   TikTok, 4:5 for stående feed-innlegg. De uverifiserbare påstandene i
   samme avsnitt — X som storkanal, kvinner 55–64 — er tatt ut, ikke
   omformulert.
2. **Tre skrivefeil rettet:** innholdsproduksenter, «autoritær» og «kjempe
   viktig».
3. **Fire foreldreløse bildetekster fjernet.** Ikke erstattet: de sa
   ingenting teksten rundt ikke allerede sier, og ny copy i deres sted ville
   brutt copy-protokollen.
4. **Tre «Les også» er nå ekte lenker.** Den til «inbound marketing» peker
   på den kanoniske artikkelen, ikke på den døde slugen vi selv omdirigerer.

`markedsforing-i-sosiale-medier-some` har med dette bloggens første
kildehenvisning utenom de to artiklene fra 2026.

### Fortsatt åpent

- **Den dupliserte avslutningen** i fire artikler. Å erstatte den krever ny
  copy, og den skal bestilles, ikke skrives her.
- **Wyzowl- og Facebook-tallene** står fortsatt uten kilde og årstall. De er
  trolig riktige, men jeg har ikke verifisert hvilken utgave de er fra, og
  et årstall jeg gjetter er verre enn ingen kilde.
- **`hva-koster-et-some-byra`** bør få prissammenligningen som tabell og
  Byråmatch som oppgitt kilde. Det er det største enkeltløftet som gjenstår
  på eksisterende innhold.

---

## 8. Første nye artikkel skrevet 29.09.2026

**«Hva koster videoproduksjon for en bedrift?»**,
`/blogg/hva-koster-videoproduksjon`. Innlegg nummer 1 i lista i avsnitt 5.
Pål godkjente temaet og oppga prisen: «ja. 40K.»

Bloggens tiende artikkel, og den andre som ikke er migrert fra Squarespace.

### Hva den gjør som de gamle ikke gjør

- **Svaret står først.** Første setning gir tallene. 44,2 % av siteringene
  språkmodeller gjør, hentes fra de første 30 prosentene av en side.
- **Tre oppgitte kilder med lenke**, alle lest 29.09.2026: Artisan Films
  prisguide for 2026, Ingstad Medias prisartikkel fra april 2026 og
  Byråmatchs guide fra mai 2026.
- **To tabeller.** Sammenligningstabeller er blant de mest siterte
  formatene som finnes.
- **To håndskrevne FAQ-par** i tillegg til det som utledes av overskriftene.

### Vinkelen er at kildene er uenige

De tre guidene spriker kraftig. Den ene kaller 50 000 kroner en enkel
produktvideo; den andre kaller det en standard reklamefilm; den tredje
legger hele det enkle nivået under 40 000. Det er den eneste opplysningen i
artikkelen en leser ikke får noe annet sted, og den gjør Reflektors egen
fra-pris til et lesbart punkt i stedet for et tall uten sammenheng.

### Den kannibaliserer ikke tjenestesiden

`/videoproduksjon-i-oslo` har FAQ-spørsmålet «Hva koster videoproduksjon for
bedrift?». Arbeidsdelingen er den samme som mellom `hva-koster-et-some-byra`
og `/sosiale-medier-byra`: tjenestesiden svarer på hva det koster **hos
oss**, artikkelen på hva det koster **i markedet** og hvordan man leser et
tilbud. Artikkelen lenker til siden; siden eier det kommersielle søket.

### Et hull i FAQ-vakten ble funnet på veien

`tests/faq.test.ts` skal stoppe at samme FAQPage-spørsmål står på to URL-er
— noe Google forbyr eksplisitt. Testen så bare på de håndskrevne
spørsmålene, med begrunnelsen at de som utledes av overskriftene er «per
definisjon unike for artikkelen».

Den antakelsen holdt ikke. Begge prisartiklene fikk overskriften «Hva koster
det hos Reflektor?», og dermed sto det samme spørsmålet i markeringen på to
adresser uten at noe sa fra. Overskriften i den nye artikkelen er endret, og
utledningen (`somFaq`) er flyttet fra bloggmalen til `artikler.ts` slik at
testen kan kalle den samme funksjonen som malen rendrer. Kontrollert i begge
retninger: testen feiler med duplikatet og passerer uten.

### Fire innlegg gjenstår av de fem

Produksjonsdag, frilanser mot byrå mot ansatt, kjeder med flere lokasjoner
og SoMe-strategi. Rekkefølgen i avsnitt 5 står.

**Skrevet samme dag. Se avsnitt 9.**

---

## 9. De fire siste innleggene, og bilder i bloggen

Bestilt av Pål 29.09.2026: «lag alle innleggene og forbered til overgangen så
godt du kan … vær nøye med å bruke gode, relevante eksempler på bilder og
videoer i blogginnleggene. alt skal være pent, on brand og visuelt moderne og
tilfredsstillende.»

Alle fem innleggene fra avsnitt 5 er dermed skrevet. Bloggen har fjorten
artikler: ni migrert ordrett fra Squarespace, fem skrevet for den nye siden.

### De fire nye

**«Hva er en produksjonsdag?»** — enheten hele tilbudet og hele prisen er
bygget på, og som ikke forklares noe sted utenfor FAQ-svarene. En språkmodell
som ikke forstår enheten, kan ikke gjengi prisen riktig.

**«SoMe-byrå, frilanser eller ansatt?»** — det tredje alternativet som manglet
i `some-ansvarlig-eller-byra`. To oppgitte kilder: Norsk Journalistlags
minstesatser for frilansere (oppdatert 17.04.2026) og Skatteetaten om
arbeidsgiveravgift. Det siste er poenget de færreste kjøpere kjenner: leier
dere inn noen uten egen næringsvirksomhet, er det dere som skylder avgiften.
Artikkelen gjentar ikke regnestykket for en ansatt — det står i den andre
artikkelen og lenkes dit.

**«Innhold til sosiale medier for kjeder med flere lokasjoner»** — støtter
/kjeder og dekker søket som kommer før: hvordan løser en kjede innhold i det
hele tatt. Ingen nye tall; alt om antall restauranter, formater og varighet
står allerede i tjenester.ts og caser.ts.

**«Sosiale medier-strategi: hva den faktisk må inneholde»** — skrevet som en
mal i seks steg, ikke som en definisjon. Faren var å lage enda en lærebok;
ordet har vanskelighetsgrad 0 nettopp fordi alle allerede har skrevet den.

### Bilder og film i artiklene

Bloggmalen hadde ett toppbilde og deretter ren tekst. Nå kan en artikkel ha
medier underveis — ett eller to om gangen, med felles bildetekst. Korte,
visuelle klipp spiller av seg selv, dempet og i løkke, når de kommer i
synsfeltet. Intervjuer og profilfilmer får en ekte avspiller med kontroller,
fordi poenget der er det som blir SAGT.

**Begrensningen er bevisst: maks to medier, og samme sideforhold i begge.**
To rammer med ulikt format i samme rad får ulik høyde, og da henger
bildeteksten i løse lufta ved siden av et bilde som fortsetter nedenfor den.
En vakt i artikler.ts stopper byggen på begge deler.

### To bak-kulissene-filmer hentet fra Dropbox

`Marketing_Reflektor/Reflektor - ads & SoMe/BTS til SoMe/` viste seg å ha et
helt arkiv av ferdige BTS-filmer fra produksjonsdager. To er tatt inn:
Baker Brun (2026) og Anton Sport (2024). Begge navnene står på den bekreftede
kundelista i site.ts.

En tredje, Vindubutikken, er **ikke** brukt. Filmen er like god, men navnet
står ikke på lista, og filmen avslutter med et co-brandet logokort. Regelen i
site.ts er utvetydig: «Legg aldri til et navn uten at Pål har godkjent
nettopp det navnet.»

Filene er komprimert til 720×1280 uten lydspor, som kjedefilmene. 6,1 MB til
sammen.

### Delingsbildet som manglet

Nettstedet hadde ingen `og:image`. Deles en lenke i Slack, på LinkedIn eller i
en e-post, ble kortet en grå boks med en URL. For et selskap som selger foto
og video er det den dyreste tomme plassen som finnes. Et 1200×630-kort er
laget av et stillbilde fra en av våre egne produksjonsdager, med logoen nede
til venstre.

### Fortsatt åpent

Det samme som sto i avsnitt 7: den dupliserte avslutningen i fire artikler,
Wyzowl- og Facebook-tallene uten kilde, og prissammenligningen i
`hva-koster-et-some-byra` som bør bli en tabell med Byråmatch som oppgitt
kilde.
