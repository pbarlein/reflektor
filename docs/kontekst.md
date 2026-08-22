# Reflektor – kontekst for nettsidearbeidet

Dette dokumentet er prosjektets hukommelse. Alt vi vet om Reflektor, dagens
nettside og valgene bak den nye, skal ligge her – ikke i en chat.

> **Hvorfor:** kontekst i et Claude-prosjekt eller en samtale kan ikke arves av
> nye sesjoner eller nye folk. Kontekst i repoet kan det.

## Status per 2026-08-22

- [x] Analyse av dagens reflektor.no (via Ahrefs – se under)
- [x] Next.js + Vercel-oppsett
- [x] Informasjonsarkitektur og redirect-kart
- [ ] **Strategi, tone of voice, budskap og visuell profil** – ikke mottatt ennå
- [ ] Endelig tekst og design
- [ ] Innhenting av eksisterende bloggtekster fra Squarespace

## Om selskapet

Reflektor er et SoMe- og innholdsbyrå i Oslo.

Posisjoneringen slik den står i dagens title-tag:

> Reflektor – strategi, innhold og publisering til fast pris

«Til fast pris» er det tydeligste differensieringspunktet vi kan lese ut av
dagens side, og bør vurderes videreført. Byrået har en egen bloggartikkel om
prismodeller i bransjen (`/blogg/hva-koster-et-some-byra`), noe som tyder på at
pristransparens er et bevisst strategisk valg.

Navngitte personer på dagens side: Magne Finseth da Fonseca, Viktor Norén.
Navngitt kunde med publisert case: Egon.

**Tjenesteområder** (utledet av URL-er og titler):
innholdsproduksjon, videoproduksjon, employer branding-video, event­foto og
-video, sosiale medier, foto (produkt, bedrift, portrett).

**Åpenbare hull i det vi vet** – må fylles av deg:
tone of voice, visuell profil, fargepalett, logo, fonter, kundeliste,
priser/pakker, målgruppe og ICP, konkurrentbilde.

## Teknisk utgangspunkt

Dagens side kjører på **Squarespace**. Bevis: `/cart`, `?format=rss` og
paginering via `?offset=`.

Ny side: **Next.js (App Router) på Vercel**.

## SEO-situasjonen

Tall fra Ahrefs, Norge, 2026-08-22:

| Metrikk | Verdi |
|---|---|
| Organiske søkeord | 31 |
| Organisk trafikk | ~108/mnd |
| Plasseringer i topp 3 | 10 |
| Betalt trafikk | 0 |

### Det avgjørende poenget

Forsiden rangerer **kun** på merkevaresøket «reflektor» (posisjon 1, 200
søk/mnd, 31 besøk). All annen organisk trafikk kommer fra bloggen.

Det betyr to ting for relanseringen:

1. **Bloggen er hele SEO-verdien. Slugs må bevares uendret.**
2. **Tjenestesidene har ingen rangeringer å miste.** Der står vi helt fritt til
   å bygge en ny struktur.

### Sider som bærer trafikk

| Side | Trafikk/mnd | Toppsøkeord | Pos. | Volum |
|---|---|---|---|---|
| `/` | 31 | reflektor | 1 | 200 |
| `/blogg/hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de` | 14 | reklame virkemidler | 4 | 60 |
| `/blogg/hva-innebaerer-digital-historiefortelling` | 13 | digital historiefortelling | 1 | 40 |
| `/blogg/markedsforing-i-sosiale-medier-some` | 13 | some markedsføring | 6 | 150 |
| `/blogg/hvordan-markedsfore-bedrift` | 10 | markedsføring bedrift | 9 | 150 |
| `/blogg/hva-er-holdningskampanje` | 8 | holdningskampanjer | 4 | 50 |
| `/blogg` | 6 | virkemidler i reklame | 9 | 100 |
| `/blogg/hva-er-reklame` | 5 | reklame | 19 | 2200 |
| `/blogg/hva-er-innholdsmarkedsforing` | 4 | innholdsmarkedsføring | 7 | 350 |
| `/eventfotograf-eventvideo` | 2 | videograf | 10 | 150 |

### Uforløst potensial

Søkeord der Reflektor rangerer, men for lavt til å hente trafikk:

- **«reklame»** – 2200 søk/mnd, posisjon 19. Klart største enkeltmulighet.
- **«some»** – 3100 søk/mnd, posisjon 31.
- **«hva er some»** – 350 søk/mnd, posisjon 2 (men 0 trafikk – trolig spist av
  et SERP-element).
- **«innholdsmarkedsføring»** – 350 søk/mnd, posisjon 3.
- **«videograf»** – 150 søk/mnd, posisjon 10. Kommersielt relevant.

Merk at keyword difficulty er 0 på nesten alt av dette. Det er lavthengende
frukt.

## Feil på dagens side som relanseringen rydder opp i

Av 81 crawlede URL-er svarer under halvparten 200.

**404 på URL-er som burde fungert:**
`/kontakt`, `/kontakt-oss` (den ekte er `/kontaktoss`), `/foto`, `/folk`,
`/sport`, `/matogdrikke` med underssider (`/oda`, `/orkla`, `/wolt` – mulige
tapte kundecaser), `/vrt-arbeid`, `/forside-v2`, `/jon-sverre`.

**Hele `/tjenester/`-treet er dødt:** `seo`, `videograf`, `videoproduksjon`,
`markedsforing`, `innholdsproduksjon`, `some-annonsering`,
`konverteringsoptimalisering`, `betalt-sok`, `fotograf`, `matfotograf`,
`boligfoto` → alle 404. Tjenestesidene ligger i stedet spredt på rotnivå.

**Bugs:**
- `/magne-finseth-da-fonseca` og `/viktor-noren` har begge title «Contact 1 | Reflektor»
- `/blogg/hva-gjr-en-innholdsprodusent` har `<br/>` inne i title-tagen
- `/blogg` og `/blogg/` er duplikater (samme innhold, to URL-er)
- `/blogg/hva-gjr-en-innholdsprodusentnbsp` svarer 403
- Flere slugs mangler tegn: `hva-gjr-`, `videomarkedsfring` (manglende ø)

**Trafikkbærende sider ligger bak 301.** De fire bloggsidene som drar mest
ikke-brandtrafikk redirigerer allerede én gang. Nye redirects må peke til
endelig URL, ikke skape kjeder.

---

## Korreksjon: hva Ahrefs-tallene ikke viser

Du har bare hatt Ahrefs som kilde. Les tallene derfra med disse forbeholdene,
ellers trekker du feil konklusjon om hva siden skal være.

### Ahrefs er etterslepende og estimert
Trafikktallene er estimater, ikke faktiske klikk. GSC er ikke koblet til
Ahrefs-prosjektet. Nye sider har per definisjon ingen tall ennå — fravær av
data er ikke bevis på fravær av verdi.

### Bloggen ser verdifull ut fordi den er gammel, ikke fordi den virker
Posisjon 1 på "digital historiefortelling", "holdningskampanjer",
"reklame virkemidler" er ordbok- og skoleoppgaveinnhold. Det konverterer ikke.
Studenttrafikk er eksplisitt ikke en KPI.

Bloggen skal beholdes for lenkeverdien — ~481 refererende domener er ekte
autoritet. Men den skal ikke være utgangspunktet for hvordan ny side bygges,
og det skal ikke lages mer innhold av den typen.

### Det som er gjort i 2026 finnes ikke i tallene ennå
Følgende er bygget eller fikset de siste ukene og har ikke rukket å gi utslag:

- /sosiale-medier-byra — primær kommersiell landingsside
- /innholdsproduksjon — ny landingsside (var tidligere uten interne lenker inn)
- /reklamefilm — ny side, under bygging
- Ny kanonisk forside (slug endret til /hjem — verifiser hva / faktisk serverer)
- Ny footer med komplett NAP, org.nr., sosiale lenker
- Organization-schema (JSON-LD) med 8 sameAs-kilder i Code Injection HEADER
- Elfsight-seksjon med Google-anmeldelser
- Konverteringssporing gjenopprettet — 107+ historiske konverteringer bevart
- Google Ads restrukturert: annonsegrupper for SoMe-byrå, Innhold og video,
  Reklamefilm. Et uovervåket broad match-eksperiment som brant ~20 000 kr/mnd
  ble stoppet 11. august.
- Google Business Profile: primærkategori endret til Markedsføringsbyrå
- Ocast-oppføring: plass 1 av 516 på "Topp 10 Sosiale medier-byråer i Norge"

Ahrefs viser ingen av delene. Ikke konkluder at tjenestesidene ikke fungerer —
de har knapt eksistert.

### Ahrefs kan ikke se KPI-en i det hele tatt
Eneste suksessmål er skjemaleads. De måles i GA4 (takk_page_view) og Google Ads,
ikke i Ahrefs. Ahrefs' estimat på betalt søk er også upålitelig — det viste
null annonseaktivitet i august mens kontoen kjørte.

Konklusjon: bruk Ahrefs til å forstå hvilke URL-er som har lenker og må
301-redirectes. Ikke bruk det til å avgjøre hva siden skal handle om.

---

## Hva korreksjonen endret i koden

Korreksjonen over avdekket en direkte feil i første utkast, og den er rettet.

**Feilen:** `/innholdsproduksjon` ble 301-redirigert til
`/tjenester/innholdsproduksjon`. Den siden er en ny kommersiell landingsside
det annonseres mot — ikke en gammel URL. Redirecten ville sendt betalt trafikk
bort fra siden den er bygget for.

**Årsaken:** Ahrefs viste hele `/tjenester/*` som 404 og landingssidene uten
trafikk. Det ble lest som «tjenestesidene er døde, her står vi fritt». Riktig
lesning var «disse sidene er for nye til å ha tall».

**Rettelsen — nytt prinsipp for URL-struktur:**

> Live URL-er flyttes ikke. Redirects skal kun rette opp faktiske 404-er.

Konkret:

- Ingen oppfunnet `/tjenester/`-struktur. Landingssidene beholder rot-slugs
  (`/sosiale-medier-byra`, `/innholdsproduksjon`, `/reklamefilm`), fordi det er
  URL-ene Google Ads og Google Business Profile peker på.
- `/kontaktoss` og `/vart-arbeid` beholdes uendret. Det er `/kontakt` og
  `/kontakt-oss` som er 404 og skal redirigeres *inn* til `/kontaktoss` — ikke
  omvendt, slik første utkast gjorde.
- `/takk` er konverteringssiden GA4 måler `takk_page_view` på. Den må finnes,
  og den skal ikke indekseres.
- Bloggen beholdes uendret for lenkeverdien (~481 refererende domener), men
  styrer ikke lenger arkitekturen og skal ikke utvides med mer av samme type.

**Åpent spørsmål:** hva `/` faktisk serverer etter at forsidens slug ble endret
til `/hjem`. Kan ikke verifiseres herfra (se under), og ingen redirect er lagt
inn for `/hjem` før det er avklart — en feil gjetning her rammer forsiden.

## Sidetilgang mangler fortsatt

Nettverkspolicyen i Claude Code-miljøet blokkerer utgående trafikk til
reflektor.no på proxynivå:

```
curl: (56) CONNECT tunnel failed, response 403
```

Dette er ikke Squarespace-cache — forespørselen når aldri fram, og
cache-buster hjelper ikke. Snapshotene må derfor lages på din maskin og
committes:

```bash
mkdir -p docs/snapshot && cd docs/snapshot
for s in hjem sosiale-medier-byra innholdsproduksjon reklamefilm om-oss \
         kontaktoss faq vart-arbeid takk; do
  curl -sL "https://reflektor.no/$s?nocache=$(date +%s)" -o "$s.html"
done
curl -sL "https://reflektor.no/sitemap.xml" -o sitemap.xml
```

Uten dem er all tekst og struktur i `src/content/site.ts` utledet av
nøkkeltall. Med dem kan faktisk markup, schema og tekst leses direkte.

---

# Analyse av dagens side (2026-08-22)

Kilde: **Ahrefs Site Audit, prosjekt 10162201**, crawlet 2026-08-18. Prosjektet
har verifisert eierskap, noe som gir tilgang til faktisk sidetekst – ikke bare
nøkkeltall. Det løser tilgangsproblemet: direkte HTTP til reflektor.no er
fortsatt blokkert herfra, men crawlen inneholder det vi trengte.

Helsescore 98 av 100, 40 sider, 1 feil.

## Tilbudet, konkret

Dette er det mest presise vi har, og det bør styre hele siden:

| | |
|---|---|
| Pris | **30 000 kr/mnd**, fast |
| Produksjonsdager | 1 per måned, hos dere / hos oss / på lokasjon |
| Leveranse | 8–10 ferdig redigerte videoer per måned |
| Publisering | 2 ganger i uka på Instagram, krysspublisert til Facebook |
| Bindingstid | Ingen, kun ordinær oppsigelsesfrist |
| Strategiforslag | Gratis, levert på 3 virkedager |
| Ekstra produksjonsdag | +30 000 kr (reklamefilm, produktfoto, kampanje) |

**Inngår ikke:** kommentarfelt og meldinger, stories, betalt annonsering.

At dette står like tydelig som hva som inngår, er et bevisst valg. Fra FAQ-en:
«Vi sier dette tydelig fordi *SoMe-byrå* betyr ulike ting hos ulike
leverandører.» Ikke mykne opp denne seksjonen i ny versjon – ærligheten er
selve salgsargumentet.

## Posisjonering

H1 på forsiden:

> Sosiale medier – *nesten* på autopilot.

Kursiveringen av «nesten» er poenget. Løftet er stort, og forbeholdet står i
samme setning. Det er hele merkevaren i fire ord.

Undertittel: «1 produksjonsdag → 4 uker med innhold.»

## Tone of voice

Stemmen er påfallende konsistent og uvanlig for bransjen. Seks trekk:

**1. Pris står åpent, med begrunnelse.**
> «Vi oppgir prisen åpent fordi de fleste byråer ikke gjør det. Et fast beløp
> er lettere å budsjettere enn et estimat, og det gjør det mulig å sammenligne
> oss med alternativene før dere tar kontakt.»

**2. Nekter å love resultater – og advarer mot dem som gjør det.**
> «Vi lover ikke tall, og vi anbefaler skepsis mot byråer som gjør det.»
> «Et byrå som styrer etter et engasjementstall, ender med å lage innhold som
> jager tallet fremfor å bygge merkevaren.»

**3. Argumenterer mot eget salg når det er riktig.**
> «Er dere ute etter målbar effekt på kort sikt, er annonsering et riktigere
> verktøy enn oss.»

**4. Begrunner begrensninger som kvalitet, ikke mangel.**
> «Fordi vi heller gjør to kanaler ordentlig enn fire halvveis.»

**5. Kontrastsetninger som bærer budskapet.**
«Rytme slår skippertak.» «To kanaler med jevnt, godt innhold gir mer enn fem
kanaler med tynt budskap.» «Det handler om å være til stede hver uke, ikke å
lage én film i året.»

**6. Konkrete tall overalt, null superlativer.**
Ingen «lidenskapelig opptatt av», ingen «skreddersydde løsninger». Tallene
gjør jobben: 1 dag, 8–10 videoer, 2 poster, 52 uker, 3 virkedager.

Tiltale: «dere» om kunden, «vi» om Reflektor. Korte hovedsetninger.

## Struktur

Navigasjon: **Pris · Vårt Arbeid · Om oss · FAQ · Blogg · Ta kontakt**

At «Pris» er første menypunkt – og peker til `/sosiale-medier-byra` – er
konsistent med åpenhetsposisjoneringen. Behold det. Ikke bytt til «Tjenester».

Alle CTA-er peker til `/kontaktoss`. Varianter i bruk: «Ta kontakt», «Få et
strategiforslag», «Book en uforpliktende prat», «Gratis strategiforslag»,
«Ta en prat».

Sider med reelt innhold, etter omfang:

| Side | Ord | Merknad |
|---|---|---|
| `/faq` | 2330 | Størst. 18 spørsmål, FAQPage-schema |
| `/innholdsproduksjon` | 1606 | FAQPage-schema |
| `/` og `/hjem` | 1068 | Identiske |
| `/eventfotograf-eventvideo` | 1014 | |
| `/vart-arbeid/egon` | 965 | Behov → oppdrag → leveranser → resultat |
| `/privacypolicy` | 879 | 12 seksjoner, dekker Meta Lead Ads |
| `/employer-branding-video-oslo` | 768 | Vinklet mot HR |
| `/videoproduksjon-i-oslo` | 531 | |
| `/sosiale-medier-byra` | 467 | Kort, men bærer prisbudskapet |
| `/om-oss` | 342 | |
| `/kontaktoss` | 101 | |

## Team og tillitssignaler

- **Pål Barlein** – CEO
- **Magne Finseth da Fonseca** – Produsent & kundeansvarlig
- **Henrik Holthe** – Produsent & kundeansvarlig
- **Viktor Norén** – Produsent & kundeansvarlig

Gaselle-bedrift kåret av Dagens Næringsliv i 2025. Bakgrunn som
produksjonsselskap – «produsentene har gjort dette for noen av Norges mest
kjente merkevarer».

Publiserte kundecaser: **Egon** og **Anton Sport**, begge «foto og video på
månedlig basis». Historikken beskrives som «fra restauranter til sportskjeder».

## Schema

Sitewide: `Organization`, `ProfessionalService`, `Service`, `WebSite`.
`FAQPage` på `/faq` og `/innholdsproduksjon`. `Article` på bloggartikler.

Dette er solid og må videreføres. `FAQPage` bør også vurderes på
`/sosiale-medier-byra`, som har åpenbart FAQ-egnet innhold.

## Funn som krever handling

**`/` og `/hjem` er identiske.** Samme title, samme H1, samme 1068 ord. Det
besvarer det åpne spørsmålet fra forrige runde: dette er duplisert innhold, ikke
en flyttet forside. Løst i `next.config.ts` – forsiden finnes kun på `/`, og
`/hjem` redirigerer dit.

**`/kontaktoss` har `Pål Barlein` som H1.** Kontaktsiden er den siste siden før
konvertering og har bare 101 ord. H1 bør beskrive handlingen, ikke personen.

**`/blogg/hva-gjr-en-innholdsprodusent` har `<br/>` inne i title-tagen.**

**`/cart` er fortsatt live.** Squarespace-rest uten funksjon. Forsvinner ved
plattformbytte.

**Manglende ø i slugs:** `hva-gjr-`, `videomarkedsfring`. Beholdes som de er –
rangeringene er viktigere enn kosmetikken.

## Hva som fortsatt mangler

Crawlen gir tekst og struktur, men ikke:

- **Visuell profil** – farger, fonter, logo, bildebruk
- **NAP-detaljer** – adresse, telefon, org.nr. fra footeren
- **Elfsight-seksjonen** med Google-anmeldelser (lastes med JavaScript)
- **Kundelogoene** under «Noen av bedriftene vi har produsert innhold for»
- **`/reklamefilm`** – ikke publisert da crawlen kjørte 18. august

Disse krever enten snapshot fra din maskin eller at du oppgir dem direkte.

---

# Designsystemet (2026-08-22)

Kilder: merkevaremanual fra **Holum Studio** (februar 2023) og
nettleserinspeksjon av dagens side. Der de to er uenige vinner den levende
siden – det er den folk faktisk ser.

## Farger

| Rolle | Verdi | Kilde |
|---|---|---|
| Burnt Orange (aksent) | `#DE4826` | Manual og live – identisk |
| Mørk flate | `#121212` | Målt. Manual: `#141414` / Deep Coal `#292626` |
| Beige hovedflate | `#F7F3ED` | Målt. Manual: Chalk White `#F5F4F2` |
| Kantlinje | `#E2DBD0` | Avledet |

Manualen har i tillegg `#163F4D` (mørk petrol), `#EBE9D0` og `#E8E4DF` som
ikke er i bruk på siden i dag.

**Brun gradient** er signaturelementet på innholdskort og seksjonsblokker.
Stoppverdiene er samplet fra skjermbilder, ikke gjettet:

```
linear-gradient(105deg, #11100E 0%, #4A3429 45%, #471F15 100%)
```

## Typografi

**Poppins** gjennomgående – Light 300, Regular 400, Medium 500, Bold 700,
Black 900. Lastes via `next/font/google`.

H1 er **vekt 500, ikke bold**. Bevisst lettere enn typisk. Ikke «rett opp»
i dette.

Mønsteret i overskrifter er å bryte dem opp med farge og kursiv:
«Sosiale medier – *nesten* på autopilot.»

## Knapper

Fylt oransje, `border-radius: 5px`, hvit tekst. **Roteres et par grader ut av
akse** – et lite, lekent grep som går igjen på alle sider. Implementert som
`.knapp-skjev`, som retter seg opp ved hover og er slått av under
`prefers-reduced-motion`.

## Logo

Vektorisert fra `.ai`-filen til `public/bilder/logo/`:

- `reflektor-ikon.svg` – R-ikonet alene
- `reflektor-logo.svg` / `-hvit.svg` – stablet lockup med tagline
- `reflektor-logo-horisontal.svg` / `-hvit.svg` – horisontal lockup med tagline
- `reflektor-ikon-512.png`, `-192.png` – for favicon og OG

Merk at begge de offisielle lockupene inneholder taglinen **«foto & video på
månedlig basis»** – den gamle posisjoneringen som produksjonsselskap. Dagens
header bruker ikon + ordmerke uten tagline, og i vektorfilen overlapper ikonet
og taglinen vertikalt, så de kan ikke skilles ved beskjæring. `Logo`-komponenten
setter derfor ordmerket i Poppins. Det er tro mot profilen, siden Poppins er
merkevarefonten.

---

# Ytelse: den største enkeltgevinsten

Målt på forsiden, desktop, varm cache:

| Metrikk | Verdi |
|---|---|
| First Contentful Paint | **6,3 s** |
| Totalt overført | **14,0 MB** |
| Herav video | **13,7 MB** på 13 filer |
| Største enkeltfil | 3,2 MB |
| Ressurser | 134 |

Videoene har `preload="metadata"`, `autoplay`, **ingen poster**, og ligger i
2597 × 1080 uansett skjermstørrelse. Resultatet er en tom svart boks med
spinner i heroen i flere sekunder, og tomme flater lenger ned – både et LCP-
og et CLS-problem.

Et SoMe-byrå som selger video må ha video på siden. Men 14 MB og 6,3 sekunder
er ikke et designvalg, det er Squarespace som ikke gjør jobben.

**Krav til ny versjon:** adaptiv bitrate (Mux eller Cloudflare Stream),
poster-bilde alltid, `preload="none"` under fold, separate oppløsninger per
breakpoint.

## Grep som skal bevares

- **Hero med fire vertikale videoer side ved side** – viser 9:16-formatet som
  faktisk leveres. Sterkt og relevant for et SoMe-byrå.
- **Kundelogorekke** rett under heroen: Idun, Orkla, Anton Sport, Egon, Soul
  Cake, Selvaag, The Well, ASKO. Dette er **produksjonskunder**, ikke
  SoMe-abonnenter – de skal ikke fremstilles som det.
- **Komplett footer** med NAP, org.nr. og sosiale lenker.
- **FAQ på forsiden** i kortversjon, med lenke til full side.
- **Tre-stegs forklaring:** Strategi → Produksjon → Publisering.

## Flere feil å rette

1. `/reklamefilm` arver SEO-tittelen fra `/innholdsproduksjon`. H1 er
   «Reklamefilm til TV og nett», tittelfeltet er aldri satt.
2. `/takk` har tittelen «General 1» – Squarespace-standard som aldri ble endret.
3. Ingen `robots`-meta noe sted på dagens side.
4. Kontaktskjemaet har **ingen `required`-attributter** – Squarespace validerer
   kun via JavaScript. Ny implementasjon skal ha ekte HTML-validering.

## Kontaktinformasjon

`contact@reflektor.no` · `+47 47605070` · Oslo

Pål Barlein står med navn, tittel, e-post og telefon i en mørk sidekolonne på
`/kontaktoss`. Det bygger tillit og skal beholdes.

## Ikke verifisert

- **Mobilvisning.** Alle målinger er desktop. Siden målgruppen er SoMe, er det
  sannsynligvis der flertallet av besøkende er. Må sjekkes separat.
- **Faktisk LCP.** FCP på 6,3 s er reell; LCP er trolig verre.
- **Eksakt gateadresse og org.nr.** til NAP-blokken.
