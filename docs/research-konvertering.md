# Konverteringsdesign — evidensgrunnlag

Research gjennomført 15.09.2026, tre parallelle spor: byråbransjen globalt,
evidensgrunnlaget for konverteringsdesign, og moderne uttrykk som konverterer.

## Metodisk forbehold — les dette først

**Ingen av sporene fikk hentet en eneste levende side.** Nettverkspolicyen
blokkerte WebFetch og curl mot samtlige domener som ble forsøkt. Alt på
sidenivå bygger på søketreff og andrehåndsbeskrivelser, ikke på inspisert
kildekode.

Kontrastallene er unntaket. De er regnet ut lokalt mot våre egne tokenverdier
og er harde tall.

---

## Det viktigste funnet: mesteparten av CRO-evidensen replikerer ikke

Kohavi, Linowski og Vermeer, *Trustworthy A/B Patterns and the Winner's
Curse* (KDD 2026). Åtte forhåndsregistrerte replikasjoner av kjente mønstre,
median 2,4 millioner brukere per eksperiment.

**Kun to av åtte effekter var signifikante i forventet retning. Én var
signifikant i motsatt retning.**

Konkret:

- **Sticky CTA**: negativ hos Talabat med 8,1 mill. brukere (−0,13 % ordre,
  p=0,042), til tross for 22 positive tester i GoodUI med snitt +4,45 %.
- **Avrundede knapper**: den publiserte studien hevdet +55 % CTR. Replikert
  med 7,4 mill. brukere: effekten var to størrelsesordener mindre og ikke
  signifikant.

Sammenhold med Kohavi fra Microsoft: bare rundt en tredel av ideer som testes
forbedrer måltallet. Bing rapporterer ~85 % feilrate.

**Konsekvens for Reflektor:** med 107 historiske konverteringer er egen
A/B-testing statistisk umulig. Design må bygges på mekanismeforståelse og de
få robuste funnene — ikke på tall fra CRO-byråer.

---

## Det som faktisk har kausal evidens

### 1. Ytelse — sterkest dokumentert

Fra randomiserte slowdown-eksperimenter, ikke korrelasjon:

- **Bing**: 2 000 ms serverforsinkelse ga −4,3 % omsetning per bruker.
- **Vodafone Italia**: 31 % LCP-forbedring ga **+8 % salg og +15 %
  lead-to-visit**. Sterkeste offentlige datapunkt i en lead-gen-kontekst.
- **Deloitte/Google**: 0,1 s raskere ga −8,3 % fluktrate på lead-gen-sider.

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
| Karuseller | ~1 % av besøkende klikker i det hele tatt. 84 % av klikkene treffer slide 1. |
| Sticky CTA | Negativ i den høyest powerede replikasjonen. |
| Avrundede knapper og mikroestetikk | Replikert til null på 7,4 mill. brukere. |
| Flertrinnsskjema | Ingen publisert kontrollert studie funnet. Alle tall fra leverandørblogger. |
| «Tre felt er optimalt» | Observasjonsdata uten kontroll for tilbudstype. |
| Testimonial- og logostatistikk | Sirkulær sitering mellom markedsføringsblogger. Ingen primærkilde. |
| Animasjon øker konvertering | Ingen publisert kontrollert evidens funnet. Ikke svak evidens — fravær. |

---

## Prisspørsmålet — den skarpeste avveiningen

HockeyStack, 31 mill. besøkende: **ikke-transparente prissider gir ~64 % flere
skjemautfyllinger, men konverterer til pipeline 1,7× dårligere.**
Observasjonelt og forvekslingsutsatt, men retningen er konsistent med at pris
fungerer som selvkvalifisering.

TrustRadius har hatt transparent prising som kjøpernes viktigste ønske fire år
på rad.

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

Uansett font: negativ tracking på store snitt (−2 til −3 % ved 48px+), og
vektkontrast 400 mot 700 framfor halvvekter overalt. Halvvekter over hele
siden er det tydeligste malsignalet som finnes.

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
