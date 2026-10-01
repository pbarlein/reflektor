# SEO- og AEO-gjennomgang før lansering

Målt 01.10.2026 på den bygde siden, 33 ruter, ikke på kildekoden. Alt under
er enten hentet ut av HTML-en eller målt i nettleseren. Der det står et tall,
er det målt.

## Kort oppsummert

Fundamentet er i orden. Ruting, markering, lenkegraf, ytelse og
tilgjengelighet måler rent på alle 33 sider.

De seks avgjørelsene gjennomgangen fant er utført 01.10.2026, sammen med
flyttingen av anmeldelsene på forsiden. Det som gjenstår er to oppgaver som
bare Pål kan gjøre, nederst.

## Det som måler rent

- **Ingen foreldreløse sider.** Alt unntatt `/takk` og `/sosiale-medier-byra`
  har innlenker, og begge unntakene er tilsiktet: `/takk` skal ikke lenkes
  (den teller konverteringer), `/sosiale-medier-byra` 301-es til `/` på
  cutover.
- **Ingen side ligger dypere enn to klikk fra forsiden.** 15 sider på ett
  klikk, 16 på to.
- **Ingen dupliserte titler, beskrivelser eller H1-er.**
- **Ingen hopp i overskriftsnivå** på noen av de 33 sidene.
- **All FAQ-markering er dekket av synlig tekst.** 24 sider med FAQPage,
  til sammen 104 spørsmål, hvert eneste funnet igjen i brødteksten. Ingen
  FAQPage inneholder noe som ikke er et spørsmål.
- **Sitemapet stemmer med rutelista.** 31 adresser, og de to som mangler er
  de to som skal mangle.
- **Produksjonsmodus er riktig.** Med `NEXT_PUBLIC_TILLAT_INDEKSERING=true`
  svarer robots.txt `Allow: /`, sitemapet er absolutt mot
  `https://www.reflektor.no`, canonical er absolutt på hver side, `/takk`
  står som `noindex, nofollow`, og OG-bildet er absolutt. Dette er testet,
  ikke antatt.
- **Ytelse.** Forsiden laster 2,86 MB og har LCP på 1,2 sekunder lokalt, med
  fire autospillende klipp. Tjenestesidene 1,1 MB, bloggen 0,8 MB. Ingen
  bilder serveres mer enn dobbelt så store som de vises.
- **Tilgjengelighet.** 0 axe-brudd, 0 horisontal overflyt og 0 konsollfeil
  på alle sider i både 1440 og 390 px.
- **JSON-LD er gyldig overalt.** 90 markeringsobjekter, alle parser.

## Hull som er lukket i denne gjennomgangen

- **`/kontaktoss` hadde bare brødsmule.** Den har nå `ContactPage` med
  `mainEntity` mot organisasjonens `@id`. Det er siden Google viser for
  «reflektor kontakt», og uten markering visste en maskin hvor siden lå,
  men ikke hva den er.
- **`/videoproduksjon-i-oslo` viste omtalevideoen uten `VideoObject`.**
  Forsiden og kundecasen hadde markeringen; tjenestesiden ikke. Layouten
  legger den nå på automatisk der en seksjon viser videoen.

## Seks avgjørelser — alle utført 01.10.2026

Pål ga klarsignal på alle seks, og på rekkefølgen på forsiden: «du har rett
angående soulcake navnet. resten gjør du som du mener er best på alle
punkter, inkludert flytting av anmeldelsene.» Under står hva som faktisk ble
gjort, og hvorfor der valget ikke var åpenbart.

### 1. Kundenavnet ✓ Soulcake, i ett ord

Nettstedet skrev begge deler: 13 ganger «Soulcake», 18 ganger «Soul Cake».
Kundens egen nettside har tittelen «Soulcake – Cupcakes, Cakes & Cookies», og
Tripadvisor og Scan Magazine skriver det på samme måte.

Normalisert til «Soulcake» 24 steder i `src/`. En navngitt kunde skrevet to
måter svekker nettopp det entitetssignalet kundecasen er der for å gi.

### 2. To titler og én beskrivelse ✓ kortet

| Side | Før | Nå |
|---|---|---|
| `/eventfotograf-eventvideo` | 79 tegn | 46 |
| `/videoproduksjon-i-oslo` | 71 tegn | 58 |
| `/reels-produksjon`, beskrivelse | 177 tegn | 155 |

Søkeordene står igjen i alle tre. Begge titlene kom ferdig fra Claude Chat.

### 3. Spørsmålsseksjonene på tjenestesidene ✓ inn i FAQ-markeringen

Bloggen gjorde det allerede: en H2 som er et spørsmål blir automatisk et
FAQ-par. `seksjonerSomFaq()` i `src/content/tjenester.ts` gjør nå det samme
for tjenestesidene, og `Tjenestelayout` slår de utledede sammen med de
håndskrevne til én FAQPage-node per URL.

**Duplikatvakten fanget én kollisjon med en gang**, og det var hele grunnen
til å kjøre den: «Hvem produserer Reflektor for?» sto som seksjon på både
`/innholdsproduksjon` og `/videoproduksjon-i-oslo`. Google sier eksplisitt
at samme spørsmål ikke skal merkes opp som FAQPage på to URL-er. Navet
beholdt spørsmålet; videosiden fikk «Hvem lager Reflektor video for?», som
uansett er det en leser på en videoside spør om. Testen i
`tests/faq.test.ts` dekker nå alle syv tjenestesidene, ikke fem
håndskrevne.

### 4. Delingsbilder ✓ egne på artiklene og casene — ikke på landingssidene

Alle 33 sidene delte `reflektor-og.jpg`. De 17 som nå har sitt eget er
bloggartiklene og kundecasene; de øvrige beholder merkevarebildet.

**Grensen er et valg, ikke latskap.** Begrunnelsen i `src/app/layout.tsx`
for ett bilde til alt var at et bilde per side betyr tjuefem bilder å holde
i live. Den står for landingssidene: de nås via annonser og søk, deles
nesten aldri, og der skal kortet si hvem avsenderen er. Artiklene og casene
er det motsatte — de er det som limes inn i en e-post eller en Slack-tråd
for å vise noen noe, og da er motivet poenget.

Det kostet ingen nye motiver: `scripts/og-bilder.ts` beskjærer sidens eget
toppbilde til 1200×630 og bruker `fokus`-verdien siden selv bruker, så
kokken på produksjonsdag-artikkelen beholder hodet. Alle 17 er sett
igjennom. `tests/og-bilder.test.ts` feiler hvis en fil mangler, har feil
mål, eller er laget fra et motiv som siden ikke bruker lenger — det siste
via `kilder.json`, fordi datostempler ikke duger som vakt når et git-utsjekk
gir alle filer samme tid.

### 5. Innlenker til prisguidene ✓ fem nye

`/blogg/hva-koster-et-some-byra` hadde **null** innlenker fra andre sider
(ikke én, som det sto her før — den ene jeg talte var oversikten på
`/blogg`). Det er artikkelen som svarer på det dyreste søket vi har.

Den har nå fem: fire fra «Fra Reflektor»-boksen i artiklene om markedsføring
i sosiale medier, SoMe-ansvarlig eller byrå, frilanser eller ansatt og
strategi, pluss én i brødteksten på ordene «de fleste byråer ikke oppgir
pris» — en setning som allerede sto der. Eventguiden fikk en gjensidig
lenke fra videoguiden.

Ingen copy er skrevet for dette. Regelen i `src/content/artikler.ts` står:
`frase` må stå ordrett i avsnittet fra før, og det legges bare en `<a>`
rundt ord som allerede er der.

### 6. Bunntekstens H2-er ✓ erstattet med navngitte landemerker

«Tjenester» og «Selskap» var `<h2>` på alle 33 sidene — 66 overskrifter som
ikke handler om innhold. På en prisartikkel med syv h2-er var to av dem
bunntekst.

Hver spalte er nå sitt eget `<nav>` med spaltetittelen som navn via
`aria-labelledby`. Skjermleseren mister ingenting: listene nås med
landemerkenavigasjon i stedet for overskriftsnavigasjon, som er den vanlige
måten å gruppere lenkelister i en bunntekst på. Utseendet er uendret, og
axe melder null avvik på 1440 og 390 px.

## Rekkefølgen på forsiden ✓ anmeldelsene flyttet opp

Rekkefølgen var: løfte → arbeid → slik fungerer det → **pris** → utenom
abonnementet → **beviset** → FAQ → kontakt. Beviset kom altså etter prisen.
Innvendingen mot 30 000 kr/mnd ble møtt med en priskalkyle, ikke med en
kunde som har vært der i fem år.

Den er nå: løfte → arbeid → slik fungerer det → **beviset** → utenom
abonnementet → **pris** → FAQ → kontakt.

Målt plassering av anmeldelsesseksjonen med omtalevideoen, samme sidehøyde
før og etter:

| | Før | Nå |
|---|---|---|
| Skjerm (1440 px) | 58 % ned, y = 5 811 | **35 % ned, y = 3 474** |
| Telefon (390 px) | 62 % ned, y = 8 962 | **28 % ned, y = 3 956** |

**«Utenom abonnementet» ligger mellom de to, og det er ikke tilfeldig.**
Anmeldelsesseksjonen er `bg-dyp` i full bredde og priskortet er `glassflate`
på mørk bunn. Side om side ville de blitt to mørke flater etter hverandre —
nøyaktig rytmeproblemet kortseksjonen ble bygget for å løse i september. Med
den grå blokken imellom er prisen fortsatt siste ord før FAQ-en.

## Det som ikke er en feil

- **Boilerplaten om Reflektor i syv bloggartikler** er den samme to
  setningene hver gang. Det er med vilje: de gamle artiklene er ordbokstoff
  uten kommersiell forankring, og blokken gir dem fakta og en innlenke. To
  setninger er ikke duplikatinnhold av betydning.
- **Avslutningsavsnittet som går igjen i seks migrerte artikler** er
  Squarespace-copy og skal stå ordrett. Regel 3 i AGENTS.md.
- **`/takk` på 69 ord** er tynn med vilje. Den skal konvertere, ikke
  rangere, og den er `noindex`.
- **`/sosiale-medier-byra` på 82 ord uten markering** 301-es på cutover.

## Fortsatt bare Pål som kan gjøre dette

Kontrollert mot Vercel i dag, uendret siden 29.09.2026:

- **Ingen egne domener er koblet til prosjektet.** Bare
  `reflektor-ny.vercel.app`. Både `reflektor.no` og `www.reflektor.no` må
  legges til før DNS flyttes.
- ~~`LEAD_MOTTAKER` og `LEAD_AVSENDER` mangler.~~ **Avklart 01.10.2026 og
  ingen oppgave.** Pål er eneste mottaker, og da er standardene i koden
  riktige. Se `docs/leads.md`.
- `NEXT_PUBLIC_TILLAT_INDEKSERING` er ikke satt, og skal ikke settes før
  DNS peker hit. Se `docs/cutover.md`.
