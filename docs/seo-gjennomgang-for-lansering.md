# SEO- og AEO-gjennomgang før lansering

Målt 01.10.2026 på den bygde siden, 33 ruter, ikke på kildekoden. Alt under
er enten hentet ut av HTML-en eller målt i nettleseren. Der det står et tall,
er det målt.

## Kort oppsummert

Fundamentet er i orden. Ruting, markering, lenkegraf, ytelse og
tilgjengelighet måler rent på alle 33 sider. Det som gjenstår er seks
avgjørelser om tekst og to oppgaver som bare Pål kan gjøre.

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

## Avgjørelser som ligger hos Pål

### 1. Heter kunden Soulcake eller Soul Cake?

Nettstedet skriver begge deler: 13 ganger «Soulcake», 18 ganger «Soul Cake».
Kundecasen bruker det første, logolista og den nye omtalevideoen det andre.

Kundens egen nettside har tittelen **«Soulcake – Cupcakes, Cakes & Cookies»**,
og Tripadvisor og Scan Magazine skriver det på samme måte. Det taler for
«Soulcake» i ett ord overalt.

Dette er et kundenavn, så jeg endrer det ikke uten beskjed. Men det bør være
én skrivemåte før lansering: en navngitt kunde skrevet to måter svekker
nettopp det entitetssignalet casen er der for å gi.

### 2. To titler blir kuttet i Google

| Side | Tegn | Kuttes ved |
|---|---|---|
| `/eventfotograf-eventvideo` | 79 | ~60 |
| `/videoproduksjon-i-oslo` | 71 | ~60 |

Begge kom ferdig fra Claude Chat. Forslag som beholder søkeordene og kommer
under grensen:

- «Eventfotograf og eventvideo i Oslo | Reflektor» (46)
- «Videoproduksjon i Oslo – bedriftsfilm og video | Reflektor» (58)

Meta description på `/reels-produksjon` er 177 tegn og kuttes ved rundt 160.

### 3. Skal spørsmålsseksjonene på tjenestesidene inn i FAQ-markeringen?

Bloggen gjør det allerede: en H2 som er et spørsmål, blir automatisk et
FAQ-par i markeringen. Tjenestesidene gjør det ikke, og derfor står disse
utenfor:

- «Hva koster videoproduksjon?»
- «Hva koster eventfotograf?»
- «Hva får dere igjen for å dokumentere et arrangement?»
- «Hvorfor video på nettsiden i det hele tatt?»

Det er prisspørsmålene som siteres i AI-svar. Arbeidet er lite, men det må
kjøres mot duplikattesten — flere av dem ligner på spørsmål som allerede er
i bruk.

### 4. Ett OG-bilde på alle 33 sidene

Alle sider deler `reflektor-og.jpg`. Bloggartiklene og kundecasene har egne
toppbilder som kunne vært brukt i stedet. Det betyr noe når noen deler en
lenke i Slack, LinkedIn eller en AI-flate: i dag ser alle 33 like ut.

### 5. Prisguidene har få innlenker

`/blogg/hva-koster-et-some-byra` har én innlenke. Det er den artikkelen som
svarer på det dyreste søket vi har. Videoguiden har fire, eventguiden to.
Forsiden lenker ikke til noen av dem.

### 6. Bunnteksten bruker H2 på 33 sider

«Tjenester» og «Selskap» er `<h2>` i bunnteksten, altså 66 overskrifter på
nettstedet som ikke handler om innhold. Det skader ikke rangeringen, men det
gjør dokumentstrukturen støyete for en språkmodell som leser siden som en
disposisjon.

## Rekkefølgen på forsiden

Målt plassering av anmeldelsesseksjonen med omtalevideoen:

- **58 % ned på skjerm**, y = 5 811 av 9 987 px
- **62 % ned på telefon**, y = 8 962 av 14 357 px

Rekkefølgen er i dag: løfte → arbeid → slik fungerer det → **pris** →
utenom abonnementet → **beviset** → FAQ → kontakt.

Beviset kommer altså etter prisen. Innvendingen mot 30 000 kr/mnd møtes med
en priskalkyle, ikke med en kunde som har vært der i fem år.

**Anbefaling: flytt anmeldelsesseksjonen opp, til rett etter «Dere setter av
én dag».** Da blir rekkefølgen løfte → arbeid → slik fungerer det → bevis →
pris → alternativ → FAQ → kontakt, og den tyngste referansen vi har står
over den største innvendingen.

**Én hake:** anmeldelsesseksjonen er den eneste mørke flaten på forsiden, og
priskortet rett under er også mørkt. To mørke blokker etter hverandre er
nøyaktig rytmeproblemet kortseksjonen ble bygget for å løse i september.
Løsningen er å la «Utenom abonnementet» ligge mellom dem: bevis (mørk) →
alternativ (lys) → pris (mørkt kort). Da er prisen fortsatt siste ord før
FAQ-en, og ingen to mørke flater møtes.

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
- **Bare `RESEND_API_KEY` er satt.** `LEAD_MOTTAKER` og `LEAD_AVSENDER`
  mangler fortsatt.
- `NEXT_PUBLIC_TILLAT_INDEKSERING` er ikke satt, og skal ikke settes før
  DNS peker hit. Se `docs/cutover.md`.
