# Konverteringsdesign — evidensgrunnlag

Research gjennomført 15.09.2026, tre parallelle spor: byråbransjen globalt,
evidensgrunnlaget for konverteringsdesign, og moderne uttrykk som konverterer.

## Kildekontroll gjennomført 15.09.2026

Dokumentet ble opprinnelig skrevet uten nettilgang — ingen av sporene fikk
hentet en levende side. Etter at nettverksnivået ble satt til Custom er alle
tolv empiriske påstander etterprøvd mot primærkilden.

**Utfallet:** fem holdt uendret, tre er korrekte men trengte forbehold, tre
måtte omformuleres, og én var udokumentert og er fjernet som evidens.
Endringene står markert i seksjonene under.

To ting er verdt å vite om grunnlaget som helhet:

1. **Påstand 1, 2 og 3 er samme forskergruppe** (Kohavi/Linowski/Vermeer).
   Dokumentet har færre uavhengige kilder enn det ser ut som.
2. **Hastighetsstudiene er søkemotorer og e-handel** med millioner av
   brukere. De sier lite presist om et B2B-leadskjema med hundrevis av
   konverteringer. Poenget i påstand 1 og 4 rammer også dem.

Kontrastallene er regnet ut lokalt mot våre egne tokenverdier og er harde
tall uavhengig av nett.

---

## Det viktigste funnet: kjente CRO-mønstre replikerer dårlig

Kohavi, Linowski, Vermeer m.fl., *Trustworthy A/B Patterns and the Winner's
Curse*, KDD 2026. Ordrett: «only two showed statistically significant effects
in the expected direction at α=0.05, and one was statistically significant in
the opposite direction.» Median 2,4 mill. brukere per test.

> **Korrigert etter kildekontroll.** Dokumentet sa tidligere «mesteparten av
> CRO-evidensen replikerer ikke». Det overselger. Studien dekker **åtte tester
> av fire mønstre** — avrundede knapper, sidehastighet, kupongkodefelt og
> sticky CTA — plukket fra GoodUI, Evidoo og GuessTheTest. Det er ikke et
> representativt utvalg av publisert CRO-litteratur.

Konkret:

- **Avrundede knapper**: originalen (Biswas, Abell & Chacko, *Journal of
  Consumer Research* 2024) hevdet +55,49 % CTR, p=0,037, på 919 brukere.
  Replikert på over 7 mill.: +0,16 % (p=0,20), +0,29 % (p=0,60), +0,73 %
  (p=0,09). To størrelsesordener mindre. Dette funnet står seg.
- **Sticky CTA**: Talabat, 8 128 679 brukere, 7 uker. −0,13 % ordre per
  bruker (p=0,042), −0,18 % omsetning (p=0,011). GoodUIs 22 tester hadde
  snitt +4,45 %, men er stort sett underpowered.

> **Viktig forbehold som paperet selv tar, og som dokumentet tidligere
> utelot:** «the experiment is not a classic sticky CTA, as it only
> emphasized the saving incentive in the sticky component that was already
> present in the control.» Det sticky elementet **fantes i kontrollgruppen**.
> Testen målte en fremdriftsindikator for besparelser, ikke sticky CTA mot
> ingen sticky CTA.
>
> Konsekvens for oss: dette er ikke bevis mot sticky CTA. Se seksjonen om
> anti-mønstre, som er rettet tilsvarende.

Sammenhold med Kohavi, *False Positives in A/B Tests* (KDD 2024): i Bing
lykkes ~15 % av **eksperimentene** (altså ~85 % feilrate); Microsoft samlet
~33 %, bransjemedian ~10 %.

> **Korrigert.** Dokumentet sa «ideer». Paperet har en egen seksjon som
> advarer mot nettopp den oversettelsen — én idé testes ofte i flere
> eksperimenter, så ideenes feilrate er lavere enn eksperimentenes.

**Konsekvens for Reflektor:** med 107 historiske konverteringer er egen
A/B-testing statistisk umulig. Design må bygges på mekanismeforståelse og de
få robuste funnene — ikke på tall fra CRO-byråer.

---

## Det som faktisk har kausal evidens

### 1. Ytelse — sterkest dokumentert

Fra randomiserte slowdown-eksperimenter, ikke korrelasjon:

- **Bing**: 2 000 ms serverforsinkelse ga −4,3 % omsetning per bruker.
  Schurman & Brutlag, Velocity 2009. Ekte kontrollert eksperiment, men fra
  2009 og på en søkemotor. Presentasjon, ikke fagfellevurdert.
- **Vodafone Italia**: 31 % LCP-forbedring ga **+8 % salg**, og +15 % på
  **lead-til-besøk-raten** — altså andelen besøkende som ble lead, ikke
  «lead conversion» i vanlig forstand. A/B-testet, altså kausalt.
- **Deloitte/Google**: 0,1 s raskere er assosiert med −8,3 % fluktrate på
  lead-gen-sider, og +21,6 % progresjon på skjemainnsending.

> **Korrigert.** Deloitte-tallet sto som kausalt («ga»). Det er det ikke:
> studien modellerte sammenhengen mellom hastighet og utfall på tvers av 37
> merkevaresider og ~30 mill. økter. Det er en assosiasjon, ikke et
> eksperiment.

Merk at «53 % forlater sider som bruker over 3 sekunder» er korrelasjon fra
2016 og systematisk feilsitert. Ikke bruk den.

### 2. Skjemamerking — Baymard, moderert brukertesting

Når kun valgfrie felt er merket, får **32 % av testdeltakerne
valideringsfeil**. Merk både obligatoriske og valgfrie felt eksplisitt. Kun
14 % av nettsteder gjør begge deler.

Dette er det best dokumenterte enkeltfunnet om skjemaer.

### 3. Oppmerksomhet over folden — NN/g eyetracking

57 % av visningstiden ligger over folden, 74 % innenfor de to første
skjermhøydene. Over 65 % av tiden over folden ligger i øvre halvdel.

**Begge de populære påstandene er feil.** Folden er ikke død, og det er ikke
sant at folk ikke scroller. Riktig formulering: oppmerksomhet er en fallende
funksjon av scrolldybde, ikke en terskel.

### 4. Navngitte kilder — fra kildetroverdighetslitteraturen

Solid eksperimentell støtte for at navngitte kilder er mer troverdige enn
anonyme. Overføring fra tilgrensende felt, ikke direkte nettsidetesting, men
det er den beste grunnen til å kreve fullt navn, tittel og selskap i sitater.

---

## Det som ikke holder

| Mønster | Hva testingen viser |
|---|---|
| Karuseller | ~1 % klikker, 84 % av klikkene på slide 1 — men se forbeholdet under. |
| Sticky CTA | **Strøket som anti-mønster.** Replikasjonen testet ikke dette. |
| Avrundede knapper og mikroestetikk | Replikert til null på 7,4 mill. brukere. |
| Flertrinnsskjema | Ingen publisert kontrollert studie funnet. Alle tall fra leverandørblogger. |
| «Tre felt er optimalt» | Observasjonsdata uten kontroll for tilbudstype. |
| Testimonial- og logostatistikk | Sirkulær sitering mellom markedsføringsblogger. Ingen primærkilde. |
| Animasjon øker konvertering | Ingen publisert kontrollert evidens funnet. Ikke svak evidens — fravær. |

> **To rettelser etter kildekontroll.**
>
> **Sticky CTA hører ikke hjemme her.** Talabat-testen hadde et sticky element
> i *begge* grupper; den målte innholdet i det, ikke om det fantes. Det finnes
> altså ikke noe godt bevis mot sticky CTA — bare mangel på bevis for.
> Forsiden utelater den fortsatt, men grunnen er nå en annen: den koster
> skjermplass på mobil, og prisen står allerede i heroen. Det er en
> designvurdering, ikke et forskningsfunn, og skal ikke forkles som det.
>
> **Karusell-tallene er ett nettsted, ikke et snitt.** Runyons data fra ND.edu
> (okt. 2012–jan. 2013) er analyse, ikke eksperiment. I hans eget datasett
> spriker klikkraten fra 1,07 % til 9,41 % på tvers av fem sider, og én
> auto-roterende karusell hadde 8,8 % med bare 40 % på første slide. «~1 % og
> 84 %» er det mest pessimistiske enkelttilfellet. Konklusjonen om å unngå
> auto-roterende hero-karuseller står, men den hviler på mekanisme — skjult
> innhold, flyttende klikkmål — ikke på disse tallene.

---

## Prisspørsmålet — den skarpeste avveiningen

HockeyStack, 31 mill. besøkende fra 80 B2B SaaS-selskaper med både pris- og
demoside. Tallene, verifisert i kilden:

- **Skjemautfylling på prissiden: 4,6 % uten pris mot 2,8 % med.** Altså
  ~64 % flere skjemaer når prisen er skjult.
- **Skjema → pipeline: 10,31 % uten pris mot 17,50 % med.** Altså langt
  bedre leads når prisen står.
- Sidevisninger per besøkende: 2,57 mot 4,26 i favør av transparent pris.

Rapporten peker altså i begge retninger avhengig av hvor i trakten man måler.
Å sitere 64 %-tallet alene er å sitere halve rapporten.

**Forvekslingen som ikke kan regnes bort:** dette er et korrelasjonelt
benchmark på tvers av 80 selskaper, ikke et eksperiment. Selskaper som skjuler
pris er systematisk annerledes — enterprise, høy kontraktsverdi, lengre salg.
Sammenligningen blander pristransparens med segment.

TrustRadius har hatt transparent prising som kjøpernes viktigste ønske fire år
på rad.

For Reflektor er spørsmålet uansett avgjort på annet grunnlag: Pål har bestemt
at prisen skal stå, fordi AEO vekter pristransparens tungt. 30 000 kr/mnd er
dessuten en selvkvalifiserende pris i seg selv.

**Fellen:** Reflektors KPI teller skjemaer, ikke kvalifiserte skjemaer. Å vise
pris vil trolig se ut som en nedgang i GA4 samtidig som forretningen bedres.
Det må avklares før, ikke etter.

---

## Struktur — observert mønster

Én lang side, ikke et sidehierarki. Over folden: hva det er, for hvem, og
knappen. Deretter arbeidsprøver → tre steg → pris → sosialt bevis → FAQ som
innvendingshåndtering → siste CTA.

Unbounce (464 mill. besøk): for Commercial & Professional Services lå median
konvertering høyest rundt 250–725 ord. Korrelasjon, ikke kausalitet.

**Konklusjonen som står seg:** lengde er ikke variabelen — dekning av
innvendinger er.

---

## Farge — målt mot våre egne tokens

| Kombinasjon | Kontrast | AA normal | AA stor |
|---|---|---|---|
| Hvit på oransje | 4,15 | ✗ | ✓ |
| Nesten-sort på oransje | 4,51 | ✓ | ✓ |
| Oransje på beige | 3,78 | ✗ | ✓ |
| Nesten-sort på beige | 17,06 | ✓ | ✓ |

CTA-tekst skal være nesten-sort på oransje. Oransje som tekstfarge kun i
display-størrelse.

Aksenten utvannes når den brukes på noe ikke-klikkbart samtidig som den brukes
på CTA. Over ~10 % skjermdekning slutter knappen å lese som knapp.

---

## Typografi — en ubehagelig observasjon

**Poppins er blant de mest brukte Google-fontene som finnes**, og er i seg
selv et mal-signal.

Billigste motgift hvis det skal adresseres: Poppins til UI og brødtekst,
et distinkt display-snitt til H1. Kostnad rundt 25–40 kB WOFF2 subsettet.

Uansett font: vektkontrast 400 mot 700 framfor halvvekter overalt. Halvvekter
over hele siden er det tydeligste malsignalet som finnes.

> **Fjernet etter kildekontroll: «negativ tracking −2 til −3 % ved 48px+».**
> Sto her som et empirisk funn. Det finnes ingen konverterings-, lesbarhets-
> eller eyetracking-studie bak det, og ingen sporbar opprinnelse for akkurat
> de tallene.
>
> Negativ tracking på display-størrelser er en **typografisk konvensjon**
> (optisk størrelse), ikke et målt funn — og den er skriftavhengig, ikke
> universell. Apples HIG gir SF Pro **+0,8 %** ved 48 pt; det er SF *Compact*
> som ligger på −2 %. Designlitteraturen anbefaler typisk −1 til −2 % for
> display, og advarer mot mer.
>
> Vi bruker det fortsatt, men som håndverksvalg justert på øyemål mot Poppins
> — ikke fordi et tall sier det. Verdien er senket fra −3 % til −2 %, som er
> innenfor det konvensjonen faktisk dekker.

---

## Video — den ubehagelige konflikten

For et videobyrå er video både produktet og den dyreste tingen å legge i
heroen. Anbefalt kompromiss:

- Hero: statisk poster i AVIF/WebP, `fetchpriority="high"`. Video bytter inn
  etter LCP.
- Native `<video muted playsinline loop preload="none" poster>`. En
  JS-basert spiller koster 300–900 kB.
- Én video av gangen. `IntersectionObserver` pauser alt utenfor viewport.
- Alltid `aspect-ratio` på containeren, ellers CLS.

**9:16 på desktop:** ikke strekk formatet. Mønsteret som fungerer er en
reel-vegg — 3–4 kolonner med `aspect-ratio: 9/16`, poster-bilder som default,
video kun ved hover eller klikk. Mobil: horisontal `scroll-snap`.

---

## Anti-mønstre

Scrolljacking og smooth-scroll-momentum. Preloader. Custom cursor.
WebGL-hero. Fade-inn av brødtekst på scroll. Bento-grid som standardseksjon.
AI-genererte bilder — særlig skadelig for et visuelt byrå. Mørk modus med
neon. Sticky CTA, chat-widget og cookiebanner samtidig på mobil.

Og: hero uten konkret tilbud. «Vi skaper historier som berører» taper mot et
konkret tilbud eller ett stort tall.

---

## Rangering etter evidenskvalitet

1. **Ytelse** — ekte kausal evidens
2. **Skjemaets klarhet**, eksplisitt merking av obligatorisk og valgfritt
3. **Navngitt, konkret sosialt bevis**
4. **Posisjonering i øvre halvdel av første skjerm**
5. **Prisangivelse** — bevisst valg av kvalitet over volum
6. **Alt annet** — estetisk preferanse, ikke evidens, og bør ikke forsvares
   med tall

---

## Blemishing-effekten — funnet som overstyrte min egen designidé (16.09.2026)

**Kilde:** Ein-Gar, Shiv & Tormala, «When Blemishing Leads to Blossoming: The
Positive Effect of Negative Information», *Journal of Consumer Research*
38(5), 2012, s. 846–859. Fire studier, lab og felt.

**Funnet:** en liten dose negativ informasjon i en ellers positiv beskrivelse
kan LØFTE inntrykket av produktet. Men effekten har to betingelser som er
like viktige som funnet selv:

1. Den negative informasjonen må komme **etter** den positive, ikke før.
2. Den må være en **liten dose**, og gjelde noe **perifert** — ikke kjernen.

Effekten er dessuten sterkest ved lavinnsatslesing, altså skanning.

### Hva det betydde konkret

Prisseksjonens «Inngår ikke» skulle bygges om. Min første idé var å gjøre
den til en likeverdig spalte ved siden av «Dette inngår» — ærligheten er jo
selve salgsargumentet, og den sto som grå småtekst i bunnen.

**Funnet sier at det ville vært feil.** Tre unntak etter seks punkter, om
kommentarfelt, stories og annonsebudsjett, er nøyaktig «liten dose, perifert,
etter det positive». Blåser man dem opp til halve blokken, er det ikke lenger
en liten dose — og da forsvinner mekanismen som gjør ærligheten til en
fordel.

Unntakene ble derfor gjort **lesbare, ikke store**: fortsatt dempet og
mindre, men ikke lenger fine print i en grå fot.

Dette er verdt å merke seg som metode: research som bare bekrefter det man
allerede hadde tenkt, har sjelden gjort noe arbeid. Denne endret et konkret
designvalg.

### Hva funnet IKKE sier

Det er gjort på produktbeskrivelser i eksperimentelle oppsett, ikke på B2B-
tjenestesider med sekssifret årsverdi. Retningen er godt dokumentert;
størrelsen på effekten her vet vi ingenting om. Ikke bruk det som et tall.
