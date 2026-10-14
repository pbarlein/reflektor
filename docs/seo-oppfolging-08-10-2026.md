# SEO-oppfølging etter lansering — 08.10.2026

Bestilt av Pål: «gjør så mye du kan av alle punkter som ikke krever meg».
Utgangspunktet var en revidert tiltaksliste, laget etter en gjennomgang av
alt i `docs/` og AGENTS.md. Her står hva som ble gjort, hva som ble funnet,
og hva som gjenstår.

## Search Console (kontrollert i grensesnittet)

- **Alle viktige sider er indeksert.** Forsiden, alle sju tjenestesidene og
  de nye artiklene som ble kontrollert (produksjonsdag, frilanser eller
  ansatt, hva koster reklamefilm, hva koster eventfotograf, hva er reklame,
  kjeder-artikkelen). Indeksering er altså ikke flaskehalsen.
- **Ny gjennomgang bedt om** for forsiden, `/kjeder`, `/reels-produksjon`,
  `/reklamefilm`, `/videoproduksjon-i-oslo`, `/employer-branding-video-oslo`,
  `/eventfotograf-eventvideo` og `/innholdsproduksjon` — sidene der
  innhold eller videomarkering er endret siden forrige gjennomsøking.
- **Validering startet** for de tre videofeilene som ble rettet i dag:
  «Missing field uploadDate» (7), «Invalid object type for field creator» (8)
  og «Missing field description» (2).
- **To varsler gjensto:** «uploadDate is missing a time zone» og «Invalid
  datetime value» på Soulcake-omtalen (sto som `2026-10-01`). Rettet i
  koden i dag — validering må startes etter at den er ute.
- **«Video isn't on a watch page» (20)** er forventet og ikke en feil. Filmene
  er støtte til sidene, ikke egne filmsider. Ingen handling.
- **48 sider «Not found (404)».** De nyeste (3.–5. okt.) er filstier uten
  endelse, som `/reels/soulcake` og `/arbeid/kjeder-egon`. Googlebot plukker
  dem ut av sidens egne data (`"sti":"/arbeid/kjeder-egon"`) og prøver dem
  som adresser. 404 er riktig svar, og det skader ikke. Resten er gamle
  Squarespace-adresser sist sjekket før cutover, som nå videresendes.
- **«Crawled – currently not indexed» (10)** er skriftfiler, favicon og
  RSS-feeden. Riktig at de ikke indekseres.

## Google-bedriftsprofilen

Profilen er verifisert og nesten komplett: tre kategorier (Markedsføringsbyrå
primær, Videoproduksjonstjeneste, Internettmarkedsføring), utfylte tjenester
med priser, riktig adresse, telefon, nettsted og sosiale profiler. 11
anmeldelser, snitt 5,0. Det eneste Google ber om er et utebilde av
lokalet — det krever et bilde fra Pål.

- **Beskrivelsen er rettet.** Den nevnte produktfoto, som er avviklet (Pål
  19.09.2026). Nå står det «reklamefilm for TV og nett, bedriftsfilm,
  employer branding-video og eventvideo». Resten er urørt. Endringen
  venter på Googles godkjenning (vanligvis ti minutter).
- **Ikke endret, men bør vurderes av Pål:** tjenesten «Produktfoto og
  produktfilm» ligger fortsatt i profilen.
- **Anmeldelseslenken** er `https://g.page/r/CSgp3apZmTKZEBM/review`.

## AI-søk: utgangspunktet (Google AI-modus, 08.10.2026)

Kjørt fra Påls innloggede konto, så svarene kan være påvirket av hans egen
søkehistorikk. Leses som en grov pekepinn, ikke en måling.

| Spørsmål | Reflektor nevnt? |
|---|---|
| Byrå i Oslo for månedlig SoMe-innhold til fast pris | Ja, først, med pris og hva som ikke inngår |
| Hvem lager Reels for bedrifter til fast pris i Norge | Ja, først i tabellen, lenke til `/reels-produksjon` |
| Markedssjef i butikkjede trenger løpende SoMe-innhold | Ja, som nummer tre blant spesialistene — kilde Ocast, ikke `/kjeder` |
| Hvem lager reklamefilm og bedriftsfilm i Oslo, hva koster det | Ja, først, med Peppes og «fra 40 000 kr» |
| Hva koster et SoMe-byrå i Norge | **Nei.** Prisguiden vår blir ikke sitert |

Kjedetesten er en klar forbedring fra 29.09 (A72), da Reflektor ikke kom med.
Men kjedesiden selv ble ikke brukt som kilde, og kjedekundene ble ikke nevnt.

## Endret i koden

- **`sameAs`** har fått Google-bedriftsprofilen (kart-ID fra profilen) og
  Proff-profilen (org.nr. 926 974 270, lenker tilbake til reflektor.no).
- **Soulcake-omtalens `uploadDate`** har fått klokkeslett og tidssone, etter
  regelen i `docs/videodatoer.md` (bare dato kjent → kl. 12:00).
- **Faktafeil i «Hva er reklame?»:** kravet om at markedsføring skal framstå
  som markedsføring står i markedsføringsloven **§ 28** (siden 01.10.2023),
  ikke § 3. § 3 handler om dokumentasjon av påstander. Kontrollert mot
  Lovdata i nettleseren. Teksten, kildeboksen og lenken er rettet, og
  artikkelen har fått `oppdatert` 08.10.2026.
- **Sitemapet:** sju sider har fått 08.10 som endringsdato, slik at IndexNow
  melder fra om videomarkeringen som ble rettet i dag.
- **AGENTS.md og kontekst.md** sa at Search Console ikke er koblet til. Det
  er det. Rettet.

## Sjekket og funnet allerede i orden

- **Lenker fra bloggen til forsiden med «SoMe-byrå».** Forrige tiltaksliste
  sa at tre artikler nevner ordet uten å lenke. Det var feil telling: alle
  forekomstene står allerede inne i en lenketekst eller i «Fra
  Reflektor»-boksen.
- **Eksakt lenketekst «innholdsproduksjon» fra «Hva er innholdsproduksjon?».**
  Ordet står ikke med liten forbokstav i brødteksten noe sted, og regelen er
  at lenker bare legges rundt ord som allerede står der. Ikke gjort.
- **Prissammenligning som tabell med Byråmatch som kilde** og
  **Wyzowl-tallene** — begge allerede ordnet.

## Gjenstår, og krever Pål

- Den dupliserte avslutningen i fire gamle artikler (krever ny copy).
- Utebilde av lokalet til bedriftsprofilen.
- Bing Webmaster Tools: krever innlogging med en Microsoft- eller
  Google-konto og oppretter en ny konto. Det skal Pål gjøre selv
  (importer fra Search Console, fem minutter).
- Russemerch-case, kundesitater og flere anmeldelser (utkast laget i Gmail).
- Facebook-siden har fortsatt den gamle beskrivelsen («Sterke bilder,
  engasjerende video …») som vises i Google-søk på merkenavnet.

## Ikke gjort, med vilje

- **Nedskalering av galleriklippene.** Filene deles med `/reels-produksjon`,
  der de vises større, og målebrowseren her mangler H.264 og kan ikke
  kontrollere at klippene ser riktige ut. Se `ytelse-runde-5.md`.

---

## Runde 14.10.2026: fem justeringer etter byttet

Tall fra Search Console og GA4, verifisert live 14.10 kl. 07 UTC.

### 1. SoMe-guiden svarer nå på spørsmålet

`/blogg/markedsforing-i-sosiale-medier-some` lå på posisjon 2,5–7 for «hva er
some», «hva betyr some», «hva er some markedsføring» og «hva står some for»
— **ca. 13 visninger om dagen og null klikk**, både før og etter byttet.

| | Før | Etter |
|---|---|---|
| title | Markedsføring i sosiale medier \| Reflektor | Hva er SoMe? Markedsføring i sosiale medier for bedrifter \| Reflektor |
| H1 | Markedsføring i sosiale medier | Hva er SoMe? Markedsføring i sosiale medier |
| første H2 | Hva er SoMe? | Hva betyr SoMe? |

**Dette overstyrer en beslutning fra 02.10**, som sa at tittelen skulle stå
fordi artikkelen rangerte på plass 2 og det var «å kaste en posisjon for å
vinne en formulering». Resonnementet var rimelig, men tallene motsier det:
en posisjon som gir null klikk i to måleperioder er ingen posisjon å berge.
Den som søker «hva er SoMe» møtte en tittel som ikke nevnte spørsmålet.
Begrunnelsen i koden er rettet, ikke slettet — ellers ville neste runde
rullet dette tilbake.

H2-en måtte bytte navn fordi «Hva er SoMe?» nå ville gjentatt H1 ordrett.
URL-en står.

**Tittelen var først 69 tegn** med «… for bedrifter» i tillegg, altså for
lang. Kortet samme dag etter Coworks måling: 55 tegn, og hele tittelen
vises.

### 2. «innholdsproduksjon» peker mot siden som eier ordet

Ordet falt fra posisjon 15,3 til 27,3 og fra 31 til 14 visninger om dagen.
Søket går til `/blogg/hva-er-innholdsproduksjon`, mens `/innholdsproduksjon`
— som eier ordet — ikke rangerer på det. `/blogg/hva-gjr-en-innholdsprodusent`
kom i tillegg inn på posisjon 62 og konkurrerer om det samme.

Begge bloggpostene har nå lenketeksten «innholdsproduksjon for bedrifter»
til `/innholdsproduksjon` i ingressen, og i begge er den den **første**
lenken til den siden — som er det som avgjør.

**Ett avvik fra bestillingen:** den ba om å beholde den gamle lenken
«løpende produksjon» i samme avsnitt. Den er fjernet som lenke (ordene står
igjen i teksten). To grunner, og den andre er den viktige:

1. Testen «ingen side lenkes to ganger fra samme avsnitt» ville blitt rød,
   og regelen er riktig — to lenker til samme side i ett avsnitt er støy.
2. **Det ville ikke virket.** Google regner lenketeksten fra den første
   lenken til en URL. Med «løpende produksjon» først ville den nye
   lenketeksten blitt ignorert — altså det motsatte av hensikten.

Lenker til andre sider er urørt.

**Hva ble endret i `/blogg/hva-er-innholdsproduksjon` 04.10?** Bestillingen
ba om å finne det ut. Svaret: **bare `oppdatert`-datoen.** Commit 825e108
satte den til 2026-10-04 uten å endre noe i artikkelen; H1 og beskrivelse er
fra 21.09, og `metaTittel`, ingressen og lenken til `/innholdsproduksjon`
er fra omskrivingen 02.10. Verken tittel, H1 eller innledning ble rørt den
dagen. Fallet i posisjon kan altså ikke forklares med en endring i denne
artikkelen 04.10.

**Og den datoflyttingen ser ut til å ha kostet oss posisjonen.** Cowork
målte etterpå: posisjonen var 14 og 20 den 2. og 3. oktober, og 31 den
4. — fallet startet altså 04.10, ikke ved byttet 02.10. Samme dag fikk
innholdsprodusent-posten tredoblet visninger på de samme søkene, og ingen
ny ekstern konkurrent er funnet.

Konklusjonen Cowork trekker er at datoflyttingen pluss de nye seksjonene
på `/innholdsproduksjon` fikk Google til å re-vurdere hvem som eier ordet.
Det er en hypotese og ikke et bevis, men den peker samme vei som regelen
`oppdatert`-feltet alt har: **en dato flyttet uten en reell endring er
ikke bare unøyaktig, den kan koste.** Dette er det første tilfellet vi har
tall på.

H2-en «Innholdsmarkedsføring, innholdsproduksjon og reklame» i
`/blogg/hva-er-innholdsmarkedsforing` heter nå «Innholdsmarkedsføring og
reklame – hva er forskjellen?». Lenken i teksten står.

### 3. Søkeordet i en H2 på alle seks tjenestesidene

Alle seks hadde den samme generiske «Det dere lurer på». Feltet
`seksjonstittel` fantes allerede med den teksten som standard, så det var
ingen komponent å bygge om — bare en verdi å sette per side.

| Side | Ny H2 |
|---|---|
| /innholdsproduksjon | Innholdsproduksjon – slik jobber vi |
| /reklamefilm | Reklamefilm – slik jobber vi |
| /videoproduksjon-i-oslo | Videoproduksjon i Oslo – slik jobber vi |
| /eventfotograf-eventvideo | Eventfoto og eventvideo – slik jobber vi |
| /employer-branding-video-oslo | Employer branding-video – slik jobber vi |
| /reels-produksjon | Reels for bedrifter – slik jobber vi |

På `/innholdsproduksjon` er dette andre H2 og ikke første; «Fire typer
prosjekter» står øverst. Kravet er hovedsøkeordet i minst én H2, og det er
oppfylt. `/kjeder` er urørt — den har sin egen seksjonsoverskrift.

### 4. «videograf» på eventsiden

Siden lå på posisjon 7–14 for «videograf» med null klikk, og ordet sto
ikke i tittel eller meta.

- title: «Eventfotograf og eventvideo i Oslo» → «Eventfotograf og videograf
  i Oslo – eventvideo og bilder»
- meta: starter nå på «Eventfotograf og videograf for konferanser,
  lanseringer og firmaarrangementer.» Resten uendret.
- Ingressen: «Vi dekker arrangementet som fotograf og videograf samtidig,
  uten at dere må bestille to oppdrag.»

**Formuleringen i ingressen er valgt med omhu.** «Fotograf og videograf»
alene ville antydet to personer. Pål sender veldig ofte én produsent som
dekker begge delene, og det er en prisforskjell for kunden, ikke en
kvalitetsforskjell — jf. regelen i AGENTS.md om aldri å beskrive
arbeidsmåten vår som et kompromiss. Setningen sier hva dere får, ikke hvor
mange som kommer.

Tittelen ble kortet 01.10 fordi 79 tegn ble kuttet midt i
«firmaarrangement». Første forsøk i dag la på «og bilder» og havnet på 68
tegn — samme feil på nytt. Rettet samme dag: 58 tegn, og alle tre
søkeordene står igjen (eventfotograf, videograf, eventvideo).

### 5. «reklamefilm» tilbake til siden som selger den

`/blogg/hva-er-reklame` rangerte på posisjon 23,4 for «reklamefilm» mens
`/reklamefilm` lå på 63 — bloggposten tok søket fra tjenestesiden. H2-en
«Reklamefilm fra Reflektor» heter nå «Slik kan Reflektor hjelpe». Lenken
til `/reklamefilm` med lenketeksten «reklamefilm» står i teksten, slik
søkeordkartet tillater.

### Datoer og kontroll

Sitemapets `lastmod` er flyttet til 14.10 for de fem tjenestesidene som ble
endret, og `oppdatert` til 14.10 for de fem artiklene. Alle endringene er
synlige for en leser, så datoene er sanne.

### Avklart med Cowork samme dag

- **Behovsfeltet fra v3 heter `behov`.** Ingen v3-leads er kommet inn ennå
  (skjemaet ble publisert 12.10 kl. 20:21, siste Meta-lead kom kl. 19:14),
  så navnet bekreftes ved første ekte lead. Koden leser begge kandidatene
  og tar den første med innhold, så den tåler begge utfall.
  `hva_trenger_dere_mest_hjelp_med` er et gammelt flervalgsfelt.
- **`nettsted` er bekreftet** på ti leads fra sommeren.
- **Timesjobben er IKKE garantert før 09:00.** Den er en planlagt oppgave
  og kan forsinkes. Avklaringen er at koden ikke skal vente på den: den
  egne live-sjekken før sending og hardfilteret dekker alt annet enn
  skjønn. Dagens oppførsel er altså riktig, og det er bra — for det var
  rekkefølgen som gjorde at Golnaz fikk påminnelsen 12.10.
- **«SPAM – » fortsetter**, og «AVVIST – » og «USIKKER – » står urørt.
  Lagt inn som regel i salgsassistentens læringslogg. De tre avviste
  avtalene er flyttet til Tapt med navnene uendret — det betyr at de nå
  fanges av både navnet og stadiet.
- **Grunnlinjen er tatt** før endringene: 226 visninger og 0 klikk på de
  fire SoMe-søkene, 22 og 0 på «videograf». Måles 21.10, 28.10 og 04.11.
- **Innholdsprodusent-posten trenger ingen flere endringer.** Ingen
  overskrift der inneholder «innholdsproduksjon» lenger; kontrollert i
  live HTML.

Hele sjekkrunden er grønn, inkludert kannibaliseringssjekken fra 04.10: «hva
koster» bare i bloggposter, byrå-ordene bare på forsiden, og hvert søkeord
med én eier blant overskriftene. Titler, H1, H2 og meta er kontrollert i
ferdig bygget HTML før push.
