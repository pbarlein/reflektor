# Vedlegg A · Åpne punkter og avvik

Ført av Claude Code etter brief 0.2: *«Er noe uavklart: bygg med tydelig
[TBD]-markør og før punktet opp i vedlegg A. Ikke gjett.»*

Punktene under er nye funn fra steg 0 – de kommer i tillegg til de tolv som
allerede står i briefens eget vedlegg A.

---

## A13 · Designsystemet setter feil font

**Status:** avviket er tatt, punktet trenger bekreftelse.

`tokens/fonts.css` og `typography.css` setter **Figtree**, med denne
begrunnelsen:

> the original Holum Studio wordmark + site typeface was not supplied as font
> binaries. Figtree (Google Fonts) is the closest open match.

Premisset er feil. Merkevaremanualen navngir **Poppins** eksplisitt i kapittel
2.1, med Light/Regular/Medium/Bold/Black. Dagens reflektor.no kjører Poppins.
Poppins ligger fritt på Google Fonts. Det var ingen grunn til å substituere.

Prosjektet bruker Poppins. `fonts.css` er ikke importert. Resten av
tokensettet brukes uendret.

Dette henger sammen med briefens eget punkt 5 – «Poppins beholdes i én vekt,
eller utvides?». Svaret på *hvilken* font er nå gitt; antall vekter er fortsatt
åpent.

---

## A14 · Absolutte 301-URL-er ville rammet preview

**Status:** avviket er tatt bevisst.

Brief 8.5 sier: *«Alle 301-er skrives som absolutte https-URL-er, ikke
relative stier.»*

Implementert som **relative** stier i `next.config.ts`. Absolutte URL-er mot
`https://www.reflektor.no/…` ville sendt all preview-trafikk ut av preview og
inn på den levende Squarespace-siden – redirecten ville truffet før man fikk
se noe som helst.

Regelen gir mening for migreringstabellen som dokument, og der skrives de
absolutt. I koden må de være relative for at preview skal fungere.

---

## A15 · Branchnavn avviker fra 8.1.2

Brief 8.1.2 sier fundamentarbeid på `setup/*`. Denne sesjonen er bundet til
`claude/reflektor-new-website-10fmt0` av miljøet den kjører i, og kan ikke
pushe til andre brancher. Konvensjonen bør følges fra neste branch.

---

## A16 · Search Console *er* koblet til Ahrefs

Korreksjonsnotatet fra 22.08 sa at GSC ikke var koblet til Ahrefs-prosjektet.
Det stemmer ikke lenger – `gsc-pages` returnerer data for prosjekt 10162201.

Det er gode nyheter: URL-inventaret for steg 0 er hentet med faktiske
visnings- og posisjonstall, ikke estimater.

---

## A17 · `/tjenester/produktfoto` var i ferd med å bli kastet bort

**Status:** rettet.

GSC viser **1 935 visninger, posisjon 15,8 på «produktfoto», 22 rangerende
søkeord** for `/tjenester/produktfoto`. Første versjon av redirect-kartet sendte
den til forsiden sammen med resten av det døde `/tjenester/`-treet.

Nå: 301 til `/produktfoto`. Samme gjelder
`/tjenester/eventfotograf-eventvideo` (1 466 visninger, 43 søkeord).

Dette er grunnen til at briefen krever fullt URL-inventar før migrering, og
ikke tillater at kartet skrives fra hukommelsen.

---

## A18 · `/produktfoto` finnes allerede

Siden er live med 155 visninger og 11 søkeord, posisjon 24,7. Den er altså
ikke en ny side som skal opprettes, men en eksisterende side som skal bygges
om. Slugen skal ikke røres.

---

## A19 · Overflatefarge: tokens sier hvitt, siden er beige

`--surface-page` er satt til `--rf-white`, mens dagens reflektor.no bruker
beige `#F7F3ED` som hovedflate. Tokensettet har fargen som `--rf-bone`
(`#F6F4F1`), men bruker den kun til `--surface-muted`.

Er hvit hovedflate et bevisst brudd med dagens uttrykk, eller en forglemmelse?
Bygget følger tokens inntil svar foreligger.

---

## A20 · Hjørneradius på knapper

Tokens sier `--radius-0: 0px  /* the default — the brand is square-cornered */`
og reserverer `--radius-pill` for knapper. Måling av dagens side ga ~5px på
CTA-knappene.

Tre ulike svar. Trenger ett.

---

## A21 · CI mangler lenkesjekk og Lighthouse

Brief 8.1.2 krever fire ting i CI. Tre kjører: typesjekk, `content:check`,
lint og bygg. Lenkesjekk og Lighthouse mot budsjettet i 8.7 gjenstår –
Lighthouse krever en deployet preview-URL som workflowen kan peke på.

---

## A22 · Sporing kan ikke verifiseres herfra

Steg 0 krever at sporingsoppsettet er *bekreftet i Google Ads-grensesnittet*.
GTM-containeren og `takk_page_view` er implementert i koden, men verifiseringen
krever innlogging i Google Ads og en reell skjemainnsending. Det er Påls
oppgave, og den kan ikke lukkes av Claude Code.

---

## A23 · Leads leveres på e-post — avklart

**Status:** avklart 23.08.2026. Leads går til `pal@reflektor.no`.

Implementert med Resend. `RESEND_API_KEY` må settes i Vercel før skjemaet
faktisk leverer – uten den logges leadet i Vercel-loggen og redirecten skjer
som normalt, men ingen e-post sendes. Se `docs/leads.md`.

Standardavsenderen krever ikke DNS-endring så lenge Pål er eneste mottaker.
Skal flere motta leads, må reflektor.no verifiseres som avsenderdomene – det
er e-post-DNS, ikke nettsted-DNS, men skal likevel avklares eksplisitt.

Erstatter det åpne punktet om mottaker i A22.

---

## Avklart 23.08.2026

Pål besvarte de åpne designpunktene. Oppdatert status:

**A19 · Overflatefarge — LØST.** Hovedflaten er **beige**. `--surface-page`
peker nå på `--rf-bone`. Overstyringen ligger i
`src/styles/tokens/overstyringer.css` så vendorfilene kan byttes ut ved neste
tokenleveranse uten å miste beslutningen.

**A20 · Hjørneradius — LØST.** Valget ble overlatt til Claude Code. Landet på
**4px** (`--radius-sm`): nærmest de ~5px som faktisk står i produksjon i dag,
og en verdi som allerede finnes i skalaen. Pill ville vært et tydelig brudd med
dagens uttrykk. Foto og video beholder 0 — «photography is never rounded»
gjelder fortsatt.

**A21 · CI — DELVIS LØST.** Lenkesjekk er på plass og verifisert i begge
retninger. Den leser ruter fra mappestrukturen og redirects fra
`next.config.ts`, så den fanger døde interne lenker før deploy. Lighthouse mot
budsjettet i 8.7 gjenstår — krever en deployet preview-URL workflowen kan peke
på.

**Typografi (briefens punkt 5) — LØST.** Poppins i **flere vekter**. Light 300,
Regular 400, Medium 500, Bold 700 og Black 900 lastes via `next/font`.

**Kundenavn (briefens punkt 3) — LØST.** Alle navn kan brukes: Idun, Orkla,
Anton Sport, Egon, Soul Cake, Selvaag, The Well, ASKO og Vitusapotek. De skal
fortsatt merkes som produksjonskunder, aldri som SoMe-abonnenter — det er en
låst ramme i 0.3.

---

## A24 · Hero-video komprimert

Kildefilen var 13,9 MB, 33,7 sekunder, 1486×618, uten lyd. Ytelsesbudsjettet i
8.7 setter 2,5 MB.

Resultat etter H.264-komprimering:

| Fil | Oppløsning | Størrelse |
|---|---|---|
| `hero.mp4` | 1280×532 | 1,93 MB |
| `hero-mobil.mp4` | 768×320 | 0,91 MB |
| `hero-poster.jpg` | 1280 | 0,07 MB |

Mobil får egen fil framfor å laste desktopversjonen og skalere den ned.
Posteren bærer førstevisningen, videoen har `preload="none"` og hentes etterpå
— det er slik både 2,5 MB-grensen for hero og 1,8 MB-grensen for totalvekt
kan holdes samtidig.

`prefers-reduced-motion` gir kun posteren; videofilen lastes aldri.

Neste steg for ytterligere kutt er VP9 eller AV1 som alternativ kilde. Ikke
gjort nå — H.264 alene holder budsjettet.

---

## A25 · API-nøkkelen ble delt i et skjermbilde

`RESEND_API_KEY` var synlig i klartekst i et skjermbilde delt i chatten.
Nøkkelen er ikke skrevet til repoet.

Anbefaling: roter den i Resend etter at den er satt i Vercel. En nøkkel som har
vært synlig utenfor en hemmelighetslagring bør behandles som kompromittert,
uavhengig av hvor kort tid det gjaldt.

---

## A26 · Pris på reklamefilm oppgitt

Briefens eget punkt 2 etterlyste fra-priser på engangstjenester. Reflektor
oppga 23.08.2026: **reklamefilm fra 40 000 kr**, eller 30 000 kr som del av en
fast avtale. Det siste stemmer med den kjente prisen for ekstra produksjonsdag.

Fortsatt åpent: fra-pris for videoproduksjonsdag og produktfotodag.

## A27 · To tegngrenser hevet

`home.clients.intro` fra 120 til 150, `home.services.items[*]` fra 80 til 90.

Begge var mine estimater, ikke krav fra briefen. Copyen som kom inn lå 17 og 5
tegn over, og designet har rom. Å be om omskriving for å treffe et tall jeg
selv fant på ville vært feil bruk av protokollen.

Grenser som stammer fra briefen — H1 under 8 ord, maks fire skjemafelt — står
uendret og skal ikke justeres på denne måten.

---

## A28 · `/takk` fyrte ikke GTM på nytt

**Status:** rettet 15.09.2026.

Skjemaet brukte en serverhandling med `redirect("/takk")`. Det gir en
klientside-navigasjon – nettleseren henter en RSC-nyttelast og bytter innhold
uten å laste dokumentet på nytt. Sporet i kjøretidsloggen:

```
GET /takk.rsc 200
```

GTM-containeren lastes én gang i layouten. Ved en slik navigasjon kjører den
ikke på nytt, og verken `page_view` eller Google Ads-konverteringstaggen ville
fyrt uten at GTM i tillegg var satt opp med en History Change-trigger.

Testen 23.08 bekreftet at e-posten kom fram og at `/takk` ble nådd – men ikke
at GTM kjørte. Feilen var usynlig fram til Marketing spesifiserte kravet om
ekte sidevisning.

Løsningen er et vanlig skjema som POSTer til `/api/skjema` og får 303
tilbake. Det gir ekte dokumentnavigasjon: ny URL, full sidelasting, GTM kjører
på nytt. Skjemaet virker også uten JavaScript.

## A29 · Kundelisten strammet inn

Idun, Orkla, Selvaag, ASKO og Vitusapotek fjernet – ikke bekreftet. Bekreftet
liste: Anton Sport, The Well, Peppes Pizza, Egon, Soul Cake, Baker Brun,
Premium PT. Happis og Retail 24 er abonnenter og skal aldri stå som referanser.

**Følgefeil:** `home.hero.proof` var godkjent copy 23.08 og navnga Orkla og
Vitusapotek. Navnene er byttet mot to fra den bekreftede lista; setningen er
ellers uendret. Det er en mekanisk substitusjon, ikke ny copy, og **må
godkjennes på nytt**.

## A30 · NAP fastsatt

Reflektor AS · org.nr. 926 974 270 · Tvetenveien 162, 0671 Oslo ·
pal@reflektor.no. Aldri info@ eller contact@ – sistnevnte var hentet fra
merkevaremanualen og er nå fjernet fra kodebasen.

## A31 · Preview beskyttet

Vercel Authentication slått på med scope
`prod_deployment_urls_and_all_previews`. Scopet er viktig: arbeidsbranchen er
satt som produksjonsbranch i Vercel, så `reflektor-ny.vercel.app` er et
produksjonsdeployment. Scope «preview» alene ville latt hovedadressen stå åpen.

---

## A32 · Sidekomposisjonene revet — omstart på design

**Besluttet av Pål 15.09.2026.**

Begrunnelse: den forrige versjonen etterlignet dagens Squarespace-side på
uttrykk, seksjonsrekkefølge og copy. Det ga en side som brukte tiden på å
være tro mot det gamle framfor å konvertere.

**Fjernet:** sidekomposisjonene for `/` og `/sosiale-medier-byra`,
innholdsfilene med copy (`home.ts`, `front.ts`, `produktfoto.ts` og de tre
stubbene), bromalen fra 6.2, `Landingsside.tsx`, samt hjelpeklassene for brun
gradient og skjeve knapper. Rutene er holdt i live med en naken
`UnderArbeid`-komponent, fordi redirect-kartet peker på dem og
`/sosiale-medier-byra` er Final URL i Google Ads.

**Beholdt:** alt som er designuavhengig. Se tabellen i `AGENTS.md`.

**Konsekvens for briefen:** kapittel 6, 9.1 og 3.0.1 er satt til side. De
låste rammene i 0.3 består.

Alt som ble fjernet ligger i git-historikken fram til commit `f7be019` og kan
hentes tilbake.

## A33 — Ingen Review- eller AggregateRating-schema på egne anmeldelser

Googles retningslinjer for review snippets sier at `Review` og
`AggregateRating` på `Organization` og `LocalBusiness` bare gjelder «sites
that capture reviews about **other** ... organizations».

En anmeldelse av Reflektor, plassert på reflektor.no, er dermed
«self-serving». Det gjelder også om anmeldelsene kommer via en
tredjepartswidget — altså også dagens Elfsight-løsning.

### RETTET 16.09.2026 — «regelbrudd» var for sterkt

Her sto det at markeringen er **et brudd på retningslinjene**. Jeg hentet
Googles side på nytt og leste ordlyden:

> «If the entity that's being reviewed controls the reviews about itself,
> their pages that use `LocalBusiness` or any other type of `Organization`
> structured data are **ineligible** for star review feature.»

«Ineligible», ikke «disallowed». Siden mister stjernene, ikke plasseringen.
Det er ingen manuell straff knyttet til dette alene. Forskjellen er ikke
akademisk: den avgjorde en beslutning, og den gale versjonen av A33 ville
avgjort den motsatt vei.

### Hva som faktisk er gjort

**Ingen `Review`-objekter.** Ni anmeldelser i JSON-LD er den mest
åpenbart selvtjenende varianten, og de gir ingenting.

**`aggregateRating` er derimot lagt inn** (`Schema.tsx`, 16.09.2026), med
5 av 5, `ratingCount` 11 og `reviewCount` 9. Begrunnelsen er ikke stjerner
— de kommer aldri. Den er at JSON-LD leses av mer enn Googles
rich-results-motor: språkmodellene henter entitetsfakta derfra, de kjører
ikke JavaScript, og AGENTS.md lister entitetssignaler i markup som ett av
fire krav til synlighet. Tallet er sant, verifisert mot kilden (A38), og
kostnaden er null.

**Forvent ikke stjerner i SERP.** Skulle noen senere spørre hvorfor de ikke
dukker opp: det er ikke en feil, det er denne regelen.

Kilde: developers.google.com/search/docs/appearance/structured-data/review-snippet
(hentet og sitert 16.09.2026)

## A34 — Motsigelse i typografien som må avklares med kunden

Tre kilder i prosjektet sier ulike ting om skriftsnittet:

1. `docs/vedlegg-a.md` A13: Poppins er merkevarefonten (fra Holum-manualen).
2. `src/styles/tokens/typography.css`: `--font-display: "Figtree"`.
3. `docs/designsystem-readme.md`: ordmerket beskrives som «geometric
   grotesque with a tall x-height, **double-storey a**».

Punkt 3 er uforenlig med punkt 1: **Poppins har enstavs `a`**. Enten er
beskrivelsen av ordmerket feil, eller så er ordmerket ikke satt i Poppins.

`globals.css` bruker i dag Poppins, altså punkt 1. Det står til avklaring.

Merk også, som faktagrunnlag og ikke som anbefaling:

- Poppins ligger på popularitetsrangering 5 på Google Fonts og er statisk —
  ingen variabel vektakse, ingen optisk størrelse. Brøkvekter (420, 440) og
  ekte optisk størrelse er dermed utelukket.
- Ytelsesargumentet mot Poppins holder ikke: fem statiske vekter er 39 kB
  woff2 subsettet. Figtree variabel 300–900 er 20 kB, men Schibsted Grotesk
  er 47 kB — «variabelt er lettere» stemmer ikke generelt og må måles.
- Formproblemet er reelt: monolineær geometrisk med nesten sirkulære `o`,
  `e` og `c` gir ujevne mellomrom ved 80–160px. Poppins leser godt på 17px
  UI og middelmådig på 120px display.

Mønsteret i segmentet er sans + serif-par, med seriff som display-snitt.
Det billigste grepet ville være å beholde Poppins i UI og skjema og legge
til et display-snitt for H1 — men **det er et merkevarevalg som er Påls, ikke
Claude Codes**, og ingenting er endret på grunnlag av dette.


## A35 — Gore-Tex er Anton Sport, ikke en egen kunde

Avklart av Pål 15.09.2026. Gore-Tex er et merke Anton Sport fører, og
klippet er produsert for Anton Sport med det merket i fokus.

Gjetningen min var riktig, men den var fortsatt en gjetning, og den ble ikke
brukt før den var bekreftet. Det er regelen: et navn på siden skal komme fra
en kilde, ikke fra at filene lå i samme mappe.

Følgen for forsiden er at reel-veggen nå har to klipp fra samme kunde, side
om side. Det er ikke tapt bredde. To klipp fra én kunde med ulikt fokus er
det sterkeste beviset veggen kan gi for ABONNEMENTET — ett klipp viser at
Reflektor kan filme, to viser hva en måned med avtale produserer. Og
abonnementet er det forsiden selger.

## A36 — Anmeldelsen fra abonnenten er klarert

Klarert av Pål 15.09.2026. Dragos Bucataru beskriver månedsabonnementet, og
er dermed den eneste av de ni anmeldelsene som omtaler nettopp produktet
forsiden selger.

Verken anmeldelsen eller Reflektors svar nevner et selskapsnavn, så den
navngir ingen abonnent.

Alle ni Google-anmeldelser er nå i bruk. Åtte vises på forsiden: én løftet
til pull-quote, sju i rutenettet.

## A37 — Anmeldelseskilden er filtrert til 5 stjerner

Elfsight-widgeten på dagens side henter anmeldelser med
`min_rating=5&filter_content=text_required` i forespørselen.

De ni anmeldelsene er altså ikke «alle anmeldelser» — de er alle
femstjerners anmeldelser med tekst. Det kan finnes lavere vurderinger, med
eller uten tekst, som widgeten aldri spurte etter.

**Konsekvens:** at alle ni er 5 av 5 er ikke grunnlag for å påstå at
Reflektor har 5,0 i snitt. Derfor står det ingen stjernerad og ingen
totalvurdering i designet — bare sitatene, med navn og selskap.

Dette er verdt å vite også fordi en totalvurdering ville vært et sterkt
visuelt element. Fristelsen er reell. Skal den brukes, må tallet hentes fra
Google Business Profile direkte, og det endrer seg over tid.

## A38 — Totalvurderingen er hentet, og A37s konsekvens er opphevet

A37 sa at fristelsen til å vise en totalvurdering var reell, og at tallet
i så fall måtte hentes fra Google Business Profile direkte. Det er gjort.

**Hentet 16.09.2026** ved å rendre kartoppføringen i Chromium:

    https://www.google.com/maps/place/?q=place_id:ChIJv6K0bydvQUYRKCndqlmZMpk

Panelet viste: **Reflektor AS · 5,0 ★★★★★ (11) · Markedsføringsbyrå**,
Tvetenveien 162, 0671 Oslo, +47 47 60 50 70, reflektor.no.

A37 står fortsatt om Elfsight-kilden: de ni sitatene er filtrert, og de kan
ikke brukes til å regne ut et snitt. Men Google publiserer snittet selv, og
det er en annen og bedre kilde enn en slutning fra ni sitater.

**En slutning til, som holder:** at snittet er 5,0 over elleve betyr at alle
elleve er femstjerners. Én firestjerners ville gitt 54/11 = 4,909, som Google
viser som 4,9. De to som ikke står på siden mangler altså tekst — de er ikke
lavere vurdert.

**Tallene må etterses.** De endrer seg når noen legger igjen en ny
anmeldelse. Sjekk lenken over før lansering og ved hver gjennomgang av
forsiden. Verdiene ligger samlet i `googleProfil` i
`src/content/anmeldelser.ts`, ett sted.

**AggregateRating er lagt inn.** Da A38 ble skrevet sto det at markering
ikke var lov. Det var basert på den gale versjonen av A33, som nå er rettet:
Google sier «ineligible», ikke «disallowed». Tallet er derfor markert opp —
ikke for stjerner, som aldri kommer, men fordi JSON-LD er der
språkmodellene henter entitetsfakta. Se A33.

**Sidegevinst — NAP er verifisert mot kilden.** Adresse, telefon og domene i
Googles oppføring stemmer nøyaktig med `site.kontakt` i `site.ts` og med
`PostalAddress` i `Schema.tsx`. AGENTS.md lister NAP-konsistens som ett av
fire krav til synlighet; det er nå kontrollert mot den autoritative kilden,
ikke bare mot seg selv.

## A39 — kontekst.md gjenga dagens navigasjon feil

`docs/kontekst.md` sa:

> Navigasjon: **Pris · Vårt Arbeid · Om oss · FAQ · Blogg · Ta kontakt**
> At «Pris» er første menypunkt – og peker til `/sosiale-medier-byra` – er
> konsistent med åpenhetsposisjoneringen. Behold det.

Jeg hentet HTML-en fra www.reflektor.no 16.09.2026 og leste headeren:

    /sosiale-medier-byra  ->  Sosiale medier
    /vart-arbeid          ->  Vårt Arbeid
    /om-oss               ->  Om oss
    /faq                  ->  FAQ
    /blogg                ->  Blogg
    /kontaktoss           ->  Ta kontakt

Første punkt heter **«Sosiale medier»**. Ordet «Pris» finnes ikke i
headeren. Instruksen «behold det» ba altså om å bevare noe som ikke fantes.

Dokumentet er rettet. Den nye headeren bruker likevel «Pris» — men som et
valg begrunnet i prisåpenhetsposisjoneringen, ikke som en bevaring. Og den
peker på forsidens prisseksjon, ikke på `/sosiale-medier-byra`, som etter
`docs/cutover.md` skal 301-es til forsiden. Et menypunkt dit ville blitt et
sidevis redirect-hopp i samme øyeblikk bryteren slås.

Merk hva dette betyr for dokumentene generelt: `kontekst.md` er skrevet fra
en crawl, ikke fra en avlesning. Andre detaljer derfra kan ha samme feil.
Sjekk mot kilden før en instruks derfra brukes som premiss.

## A40 — `/produktfoto` finnes ikke, men redirecten peker dit

`next.config.ts` sender `/tjenester/produktfoto` til `/produktfoto`
permanent (301). Begrunnelsen i filen er god: 1 935 visninger og posisjon
15,8 på «produktfoto», 22 rangerende søkeord — den sterkeste
enkeltposisjonen prosjektet har på et kommersielt søkeord.

**Men `src/app/produktfoto/page.tsx` finnes ikke.** Redirecten lander i 404.

Det er stikk i strid med regel 1 i AGENTS.md: redirects skal rette opp
faktiske 404-er, ikke lage nye. Slik det står nå, sender den sterkeste
posisjonen vi har rett i veggen.

To utveier, og valget er ikke mitt:

1. **Bygg `/produktfoto`.** Riktigst. Krever copy, og copy bestilles.
2. **Pek redirecten på en eksisterende side** i mellomtiden —
   `/innholdsproduksjon` er nærmest. Dårligere samsvar med søkeordet, men
   uendelig mye bedre enn 404.

Jeg har ikke gjort noen av delene. Ruting er ett av de fire tingene
AGENTS.md ber om at ikke endres uten grunn, og «hvilken side skal arve
produktfoto-posisjonen» er en innholdsbeslutning.

**Dette er en lanseringssperre på linje med bloggmigreringen.**

## A41 — FAQ rich results finnes ikke lenger. Hentet 16.09.2026

Anledningen var Påls spørsmål om å komprimere FAQ-en på forsiden til to
spalter for å få plass til flere spørsmål, «om det har en stor verdi for
synlighet i søk». Jeg sjekket i stedet for å svare fra hukommelsen, og
svaret er kategorisk.

**Googles egne ord, fra changelogen på developers.google.com/search/updates:**

> **8. mai 2026 — Deprecating the FAQ rich result feature.**
> *What*: Added a deprecation notice to the FAQ rich result documentation.
> *Why*: This feature will no longer appear in Google Search starting
> **May 7, 2026**.

> **Juni 2026 — Removing documentation for the FAQ rich result feature.**
> *What*: Removed documentation for the FAQ rich result feature.
> *Why*: The FAQ rich result feature is no longer shown in Google Search
> results, as announced in the changelog entry in May 2026.

Dokumentasjonssiden er borte. `…/structured-data/faqpage` svarer 301 til
`…/search/updates#removing-faq-rich-result` — samme behandling som How-to
fikk. Verifisert med `curl`: én omdirigering, endelig URL med ankeret.

Rekkefølgen er verdt å merke seg. Først ble funksjonen i 2023 begrenset til
«well-known, authoritative government and health websites» — altså aldri
Reflektor. Siden 7. mai 2026 vises den ikke for noen.

### Hva det betyr for prosjektet

**`FaqSchema` skal bli stående.** Rich result var aldri grunnen den kunne
ha for oss — begrensningen i 2023 hadde allerede utelukket et videobyrå.
JSON-LD er der språkmodeller henter entitetsfakta, de kjører ikke
JavaScript, og AGENTS.md lister entitetssignaler i markup som ett av fire
krav til synlighet. Argumentet er uendret; det er bare den ene grunnen som
aldri gjaldt oss, som nå er formelt død.

**Men `kontekst.md` må leses med forbehold.** Den sier at `FAQPage` på
`/faq` og `/innholdsproduksjon` er «solid og må videreføres», og at det
«bør vurderes» på `/sosiale-medier-byra`. Rådet står seg på AEO-grunnlag,
men ikke på det grunnlaget en leser i 2025 ville antatt.

**Layout har null å si.** Google leser DOM-en, ikke CSS-rutenettet. En
FAQ i to spalter og en i én spalte er identiske for både søk og
språkmodeller. Skal FAQ-en gi mer synlighet, er variabelen ANTALL
SPØRSMÅL OG DEKNING — altså tekst, ikke spaltebredde.

### Det større funnet: `/faq` er en tom stubb

Spørsmålet om spaltebredde på forsiden førte til noe viktigere. Forsiden
har seks spørsmål. `/faq` på den NYE siden er tjue linjer med en overskrift
og en TODO.

`/faq` på dagens reflektor.no har **19 spørsmål** med `FAQPage`-schema.
Hentet og telt fra sidens egen JSON-LD 16.09.2026:

> Hva er et SoMe-byrå? · Hva er forskjellen på dere og et markedsføringsbyrå?
> · Hvordan vet dere hva vi skal lage? · Kan vi bruke innholdet til annet enn
> sosiale medier? · Hvorfor bare Instagram og Facebook — ikke TikTok eller
> LinkedIn? · Hva er ikke inkludert? · Hva koster det? · Er 30 000 kroner i
> måneden mye eller lite? · Bør vi heller ansette en SoMe-ansvarlig selv? ·
> Hva om vi heller bruker pengene på annonsering? · Hvilke resultater kan vi
> forvente? · Hvor lang tid tar det før vi ser noe? · Får vi rapportering
> underveis? · Hvor mye tid må vi sette av? · Trenger vi eget kamera eller
> utstyr? · Publiserer dere i ferier — og hva om produksjonsdagen må flyttes?
> · Er det bindingstid — og kan vi prøve først? · Hvem eier innholdet? · Kan
> dere levere mer enn 8–10 videoer i måneden?

**RETTELSE, samme dag.** Her sto først at `kontekst.md` fører `/faq` som
sidens største med «2 330 visninger». Pål reagerte: «over 2000 visninger på
faq-siden? det må være en feil». Han har rett, og feilen var min lesing.

Kolonnen i `kontekst.md` heter **«Ord»**, og tabellen har overskriften
«Sider med reelt innhold, etter omfang». 2 330 er ANTALL ORD. `/faq` er
den største siden målt i tekstmengde, ikke i trafikk.

Tallet stemmer: nitten svar på 460–900 tegn er rundt 2 100 ord, pluss
spørsmål og sidetekst. Det var etiketten som var feil, ikke tallet.

**Vi har ingen trafikktall for `/faq`.** Ingen steder i prosjektet finnes
visninger eller klikk for den siden. GSC er ikke koblet til, og Ahrefs-tall
er estimater. Argumentet for å migrere siden må derfor stå på innholdet
alene — og det gjør det: 2 330 ord publisert, godkjent og på tema, som
ikke finnes på den nye siden.

Dette er andre gang `kontekst.md` har ført til en feilslutning; A39 var
navigasjonen. Dokumentet er skrevet fra en crawl, og det skal leses med
forbehold.

Merk også: `kontekst.md` sier «18 spørsmål». Den live siden har **19**.

**Dette er ikke et copy-problem.** Tekstene finnes, de er Reflektors egne,
og de ligger live. Migrering er mekanisk arbeid, ikke skriving — i motsetning
til nye spørsmål på forsiden, som ville måttet bestilles.

**Og det er her AEO-argumentet faktisk biter.** Google beskriver «query
fan-out»: AI Overviews og AI Mode sender ut flere relaterte søk på
deltemaer og setter svaret sammen av dem. En side som besvarer nitten
distinkte spørsmål har nitten flater å treffe slike delsøk med. Seks har
seks. Det er antall spørsmål og dekning som er variabelen — ikke
spaltebredde, som verken Google eller en språkmodell ser.

Merk samtidig hva Google sier om selve markeringen, fra
`developers.google.com/search/docs/appearance/ai-features`:

> There are **no additional requirements** to appear in AI Overviews or AI
> Mode, nor other special optimizations necessary.

> To be eligible to be shown as a supporting link in AI Overviews or AI
> Mode, a page must be indexed and eligible to be shown in Google Search
> with a snippet […] There are no additional technical requirements.

Altså: `FAQPage`-schema gir ingen dokumentert fordel hos GOOGLE. Argumentet
for å beholde JSON-LD er de ANDRE svarmotorene og modellene, som leser
markup og ikke kjører JavaScript. Det skillet er verdt å holde rett.

**Lanseringssperre**, på linje med bloggmigreringen og `/produktfoto`.

## A42 — Samtykke. Funnet 16.09.2026, bygget 17.09.2026

Det alvorligste funnet i kodegjennomgangen Pål ba om. Han kunne ikke se det
selv: det er usynlig i nettleseren, og det så ut som at alt virket.

Notatet er skrevet i to lag. De fire første avsnittene er funnet slik det
sto — de er beholdt fordi de forklarer hvorfor løsningen ser ut som den gjør.
Fra «Bygget 17.09.2026» og ut beskriver de hva som nå faktisk står i koden,
og hva som gjenstår.

### Hva som skjedde før 17.09.2026

`Sporing.tsx` lastet Google Tag Manager umiddelbart ved hver sidelasting,
uten noen form for samtykke. Inne i containeren fyrte GA4 og en
Meta-piksel — sistnevnte synlig i konsollen som
`[Meta pixel] 572759520853896`. Informasjonskapsler ble satt og data sendt
til Google og Meta før brukeren hadde tatt stilling til noe.

Det fantes ingen banner, ingen samtykkelagring, ingen Consent Mode.

### Dagens reflektor.no har banner

Squarespace viser «By using this website, you agree to our use of cookies…»
med Accept, Decline og Manage Cookies. Bekreftet i skjermbilde av den
levende siden.

**Den nye siden er altså en tilbakegang på dette punktet**, ikke en
videreføring.

### Reflektors egen personvernerklæring lover funksjonen

Punkt 8, ordrett fra `/privacypolicy`:

> Du kan administrere eller trekke tilbake samtykke til informasjonskapsler
> via innstillingene på nettsiden, dersom dette er tilgjengelig.

Erklæringen er nå migrert til `/personvern` og sier dette på den nye siden
også. Det fantes ingen slike innstillinger. Lenka «Informasjonskapsler» i
bunnteksten er det som dekker løftet nå.

### Hvorfor det også angår KPI-en

Google har krevd **Consent Mode v2** siden mars 2024 for annonsører med
EØS-trafikk. Uten signalene begrenses målgruppe- og remarketingfunksjoner i
Google Ads, og konverteringsmodelleringen blir svakere. Dette er altså ikke
bare en juridisk sak — det treffer måling av skjemaleads, som er prosjektets
eneste KPI.

### Bygget 17.09.2026, etter at Pål ba om det

Da jeg skrev notatet over, lot jeg være å bygge løsningen — begrunnelsen sto
her, og den holdt ikke lenger da Pål ba om «GTM og samtykkeløsning». Det som
faktisk var uavklart, var ett spørsmål: egen banner eller innkjøpt CMP.
Svaret ligger nå i koden som egen banner, og begrunnelsen står nedenfor.

**Egen banner, ikke Cookiebot eller Iubenda.** Et CMP koster fra rundt 1 000
kr/mnd, legger et tredjepartsskript i den kritiske lastebanen på hver
sidelasting, og løser et problem Reflektor ikke har: mange kategorier, mange
språk, mange domener. Her er det to kategorier og ett domene. Løsningen er
under 500 linjer, har ingen avhengigheter, og ingen andre kan slå den av.
Byttes den senere ut, er det `Samtykke.tsx` og `samtykke.ts` som går.

**Hva som ligger hvor:**

| Fil | Ansvar |
|---|---|
| `src/lib/samtykke.ts` | Ren logikk. Cookieformat, Consent Mode-signaler, skriptet i `<head>`. Ingen React. |
| `tests/samtykke.test.ts` | Ti tester. Feil her er usynlige — siden ser lik ut enten samtykket virker eller ikke. |
| `src/components/Samtykke.tsx` | Banneret og lenka i bunnteksten. |
| `src/components/Sporing.tsx` | Consent Mode-standarden, og GTM. |

### Containeren inneholder seks sporere, ikke to. Målt 17.09.2026

Notatet over sa «GA4 og en Meta-piksel». Det var det jeg så i konsollen. Da
jeg målte nettverkskallene i stedet, sto det seks:

| Sporer | Retter seg etter Consent Mode |
|---|---|
| GA4 | ja |
| Google Ads | ja |
| Meta-piksel | **nei** |
| Apollo.io (`aplo-evnt.com`) | **nei** — identifiserer bedriften bak besøket |
| HubSpot | **nei** — satte fire cookies før noe samtykke forelå |
| Microsoft Clarity | **nei** — tar opp sesjonen, altså museflytting og klikk |
| Microsoft Ads | **nei** |

Consent Mode styrer bare Googles egne tagger. De fem andre bryr seg ikke, og
de kan bare stanses inne i containeren — som koden i dette repoet ikke kan
røre, og som er LÅST i AGENTS.md.

**Det avgjorde arkitekturen.** Planen var å laste GTM alltid og la Consent
Mode styre. Målingen viste at det ville latt sesjonsopptak og
besøksidentifisering kjøre på folk som ikke har sagt ja til noe. Derfor
lastes containeren nå **først når besøkende har svart**.

**Det koster måling, og det skal sies rett ut.** En besøkende som ignorerer
banneret og fyller ut skjemaet, blir ikke talt. Den som svarer — også den som
svarer nei — blir det, fordi GA4 da sender cookieløse signaler som Google
modellerer konverteringer fra.

### Slik det er verifisert

Målt på den bygde siden, ikke antatt:

| Tilstand | Tredjepartskall | Cookies |
|---|---|---|
| Før valg | **0** | **0** |
| Etter «Bare nødvendige» | Google-taggene laster cookieløst; de andre fyrer fortsatt | ingen `_ga`, ingen `_gcl_au` — men se under |
| Etter «Godta alle» | alt fyrer | som før, pluss Googles |

**Hva som settes selv når besøkende har sagt nei** — målt på deployet
17.09.2026, i både desktop og mobil:

| Kilde | Cookies |
|---|---|
| Microsoft (Clarity og Ads) | `CLID`, `MUID`, `MR`, `SRM_B`, `SM`, `ANONCHK` |
| HubSpot | `__hstc`, `hubspotutk`, `__hssrc`, `__hssc` |
| Cloudflare (leverer skriptene over) | `__cf_bm` |
| Google | **ingen** |

Det er selve beviset, i én tabell: Consent Mode virker — Google setter
ingenting — og de andre bryr seg ikke. Dette er containerens ansvar, ikke
kodens, og det er nøyaktig det punkt 1 under retter. Listen er også
huskelista over hva som må stå i personvernerklæringen hvis taggene blir
værende.

Dessuten: `consent default` er det første consent-kallet på siden og kommer
før GTM i markeringen; valget huskes over sidelastinger uten at banneret
blinker; 0 axe-brudd på ni sider i to visningsbredder med banneret framme,
og 0 i alle tre bannertilstandene — sammenslått, utvidet og gjenåpnet.

**Én feil ble funnet i skjermbildene og rettet.** Med valgene utvidet ble
panelet høyere enn en telefonskjerm. Et `fixed`-element som er høyere enn
vinduet kan ikke rulles, så overskriften og hele innledningen lå bak
headeren, utenfor rekkevidde. Panelet har nå tak på 80 % av vindushøyden, og
rullingen ligger på teksten slik at knappene alltid står. Verifisert på
iPhone SE, iPhone 13 og en desktop på 600 px høyde.

Det er verdt å merke seg hvordan den ble funnet: alle de automatiske
sjekkene sa «rent». axe måler ikke om noe ligger utenfor skjermen, og
Playwright klikker på knapper den finner uansett hvor de er. Feilen var
synlig med det blotte øye i ett skjermbilde.

### Det som gjenstår, og som bare kan gjøres i GTM-grensesnittet

Dette kan ikke gjøres fra koden. Kroken finnes allerede: ved hvert svar
sendes hendelsen `samtykke_oppdatert` til dataLayer, med variablene
`samtykke_analyse` og `samtykke_markedsforing`, hver satt til `granted`
eller `denied`.

1. **Sett utløsere på de fem taggene som ikke lytter til Consent Mode.**
   I GTM: lag en datalagvariabel for `samtykke_markedsforing`, lag en
   utløser av typen «Egendefinert hendelse» på `samtykke_oppdatert` med
   betingelsen at variabelen er `granted`, og bytt utløseren på Meta,
   Apollo, HubSpot, Clarity og Microsoft Ads til den. Analysetagger bruker
   `samtykke_analyse` på samme måte.
2. **Vurder om alle seks skal være der.** Clarity tar opp sesjoner og
   Apollo identifiserer bedrifter — begge krever samtykke, begge må stå i
   personvernerklæringen, og ingen av dem står der i dag. Erklæringen nevner
   Google og Meta. Det er en avgjørelse for Pål, ikke for meg.
3. **Når punkt 1 er gjort, snu GTM-lastingen tilbake.** Da kan containeren
   lastes alltid, og vi får modellerte konverteringer også fra dem som ikke
   svarer. Ett `if` i `Sporing.tsx`, og begrunnelsen står i kommentaren der.
4. **Fyll ut de tre uutfylte stedene i personvernerklæringen** (se under).

### Slik sjekker Pål at det virker, uten å kunne kode

Fire ting, i denne rekkefølgen, i et **privat vindu** (ellers husker
nettleseren et valg du allerede har tatt):

1. Åpne forsiden. Banneret skal komme opp nederst. Ikke trykk på noe.
2. Bla nedover og bruk siden som vanlig. Banneret skal ikke stenge noe —
   det er med vilje at det kan ignoreres.
3. Trykk «Bare nødvendige». Banneret forsvinner. Last siden på nytt: det
   skal **ikke** komme tilbake.
4. Bla helt ned til bunnteksten og trykk «Informasjonskapsler». Banneret
   skal komme opp igjen med de to avkrysningsboksene. Det er beviset på at
   et samtykke kan trekkes tilbake — som personvernerklæringens punkt 8
   lover.

**Ikke fyll ut skjemaet for å teste.** Sporingen går mot den ekte
Ads-konverteringskontoen.

### Copy-forbeholdet

Teksten i banneret er skrevet av meg, ikke av Pål. Det er et bevisst brudd
på copy-protokollen: et `TBD(...)` i et samtykkebanner ville vært ubrukelig,
og teksten er funksjonell og juridisk, ikke markedsføring. Men den bør leses
gjennom, og noen med juridisk ansvar bør bekrefte at de to kategoriene dekker
det som faktisk kjører — se punkt 2 over, der de ennå ikke gjør det.

### Lanseringssperren står, men er flyttet

Sperren er ikke lenger «det finnes ingen samtykkeløsning». Den er nå
**punkt 1 og 2 over**: fire sporere fyrer fortsatt uten samtykke, og to av
dem står ikke i personvernerklæringen. Begge deler løses i GTM, ikke her.

### Tre defekter i personvernerklæringen, live nå

Funnet under migreringen. Ikke rettet — jeg kan ikke vite hva som er riktig.
Merket med TBD-markører så de er synlige i forhåndsvisningen.

1. «Sist oppdatert: **29.04.206**» — årstallet mangler et siffer.
2. «lagres normalt i inntil **[for eksempel 12–24 måneder]**» — uutfylt
   maltekst.
3. «kan du kontakte oss på **[e-postadresse]**» — uutfylt maltekst, og den
   alvorligste: erklæringen oppgir ingen adresse for å utøve rettighetene
   sine. Adressen står i punkt 1, men punkt 9 er der en leser ser etter den.

## A43 — Kodegjennomgangen. Sider som ikke kan lanseres som de er. 17.09.2026

Pål ba om en full gjennomgang av koden: «ikke et lappeteppe eller AI-slop,
men kun best practice og et solid håndverk». Funnene som krever en
beslutning fra ham, står i A41 og A42. Dette punktet er lista over ruter som
finnes, men ikke har innhold.

### Seks ruter viser «Under arbeid»

`/sosiale-medier-byra` · `/innholdsproduksjon` · `/reklamefilm` ·
`/videoproduksjon-i-oslo` · `/eventfotograf-eventvideo` ·
`/employer-branding-video-oslo`

Tre av dem er i AGENTS.md ført opp som **live sider det annonseres mot**.
`/sosiale-medier-byra` er Final URL i Google Ads.

Rutene er holdt i live med vilje — en rute som forsvinner blir en 404 som
må ryddes senere, og redirect-kartet peker på dem. Men **betalt trafikk som
lander på «Under arbeid» er verre enn en 404**: den koster penger per klikk
og leverer ingenting.

`/sosiale-medier-byra` skal uansett 301-es til `/` ved cutover (se
`docs/cutover.md`), så den løses av den planen. De fem andre gjør det ikke.

### Fire ruter har overskrift uten innhold

`/om-oss` (23 linjer) · `/vart-arbeid` (32) · `/blogg` (37) ·
`/kontaktoss` (28)

`/kontaktoss` er også ført som live og annonsert mot i AGENTS.md.

`/blogg` er dessuten den kjente lanseringssperren: bloggtekstene er ikke
migrert fra Squarespace, og bloggen bærer rundt 481 refererende domener.

### To som er løst i denne økta

`/faq` og `/personvern` var begge stubber. Begge er nå migrert ordrett fra
dagens side. Se A41 og A42.

### Ubrukt innhold som IKKE er slettet

`team`, `kontaktperson`, `prosess` og `prinsipper` i `site.ts` rendres ingen
steder. De er merket, ikke fjernet: alle fire er hentet fra dagens side og
er dataene `/om-oss` trenger når den bygges. Å slette dem for å få en teller
ned ville bare betydd å hente dem inn igjen senere, med risiko for at et
navn eller en rolle blir feil underveis.

### Designtokens: 71 av 132 er ubrukt, og det er riktig

En palett er et system. At `--rf-ink-300` ikke brukes i dag, gjør den ikke
til søppel — den er et trinn i en skala. AGENTS.md verner dessuten mappa
uttrykkelig.

Ett unntak er verdt å nevne: `elevation.css` definerer sju skygge- og
scrim-verdier for et design som uttrykkelig ikke bruker skygger («Ingen
skygge — skiller lages med flate og linje»). Det er rundt 600 byte som
motsier sin egen designbeslutning. Ikke fjernet, fordi mappa er vernet, men
det er det eneste stedet i tokens der «ubrukt» også betyr «selvmotsigende».

## A44 — Hva samtykkebanneret koster, målt. 17.09.2026

Pål spurte om løsningen er teknisk og juridisk i orden, og om den skader
trafikk, synlighet eller noe annet. Svaret krevde måling på fire felt. Tre
var i orden. To feil kom fram, og bare én av dem skyldtes banneret.

### 1. Tolv bunntekstlenker lå permanent bak banneret

Dette er den ekte feilen. Banneret er `fixed` nederst. Når man ruller helt
til bunns på en hvilken som helst side, lå **tolv lenker i bunnteksten under
det, uten noen måte å nå dem på** — siden kunne ikke rulles lenger.

Blant dem: lenkene til `/innholdsproduksjon` og `/reklamefilm`. Bunnteksten
er det eneste stedet på siden som lenker til tjenestesidene — headeren bærer
dem ikke, og begrunnelsen står i `navigasjon.ts`. Og verst av alt lå
«Informasjonskapsler»-lenka der selv: måten å trekke tilbake samtykket på
var utilgjengelig så lenge banneret sto.

| Side | Utilgjengelige lenker før | etter |
|---|---|---|
| `/takk`, `/om-oss`, `/vart-arbeid`, `/kontaktoss`, `/blogg`, `/gratis-strategimote`, `/personvern`, `/faq` | **12** | **0** |

Rettet med `padding-bottom: var(--samtykke-plass)` på `body`, satt av en
ResizeObserver på banneret. Fordi den bare forlenger dokumentet nedover,
flytter den ingenting som allerede står på skjermen, og koster derfor ikke
CLS.

**En påstand jeg tok feil om underveis:** jeg meldte først at banneret
dekket sendeknappen i kontaktskjemaet slik at skjemaet ikke kunne sendes.
Det var galt. Knappen ble dekket når man rullet til den, men 30 piksler
ekstra rulling frigjorde den — med og uten rettelsen. Målefeilen var min:
`scrollIntoViewIfNeeded` ruller minimalt, og jeg leste det som brukerens
ytterpunkt. Bunntekstlenkene var det ekte tilfellet, og det er verifisert i
begge retninger.

### 2. Banneret tok 64 % av en telefonskjerm

Googles egen veiledning ber om bannere «that take up only a small fraction
of the screen». 64 % er ikke det. Google fritar riktignok juridisk påkrevde
dialoger fra de harde feilene — «unless they're legally mandatory» — og et
samtykkebanner i EØS er påkrevd, så dette var ingen rankingtrussel. Men det
er en dårlig førstehåndsopplevelse uansett hva Google mener.

| Skjerm | før | etter |
|---|---|---|
| iPhone 13 og nyere (390 px+) | 64 % | **39 %** |
| iPhone SE / eldre (≤375 px) | 64 % | **47–51 %** |
| desktop | 28 % | 32 % |

Knappene står nå to i bredden på mobil i stedet for stablet, og
innledningen er kortet inn. Under 380 px er det ikke plass til to på én
linje, og der stables de igjen — det er derfor de smaleste telefonene
kommer dårligere ut. Alternativet var å la begge knappene brekke til to
linjer, og en knapp som brekker ser uferdig ut.

Målt på 320, 360, 375, 390 og 414 px: begge svarknappene er 46 px høye og
står på én linje overalt. `border border-transparent` på «Godta alle» er
ikke overflødig — uten den ble den 2 px lavere enn «Bare nødvendige», som
har en ekte ramme. Sideveis er dessuten det som gjør likheten
mellom «Godta alle» og «Bare nødvendige» synlig: under hverandre leses den
øverste som anbefalingen.

### 3. Datatilsynets ti råd, punkt for punkt

Veiledningen fra 2025 er den gjeldende. Ekomloven av 1. januar 2025 krever
et samtykke som er gyldig etter personvernforordningen.

| Krav | Status |
|---|---|
| Samtykke før noe settes | ✅ målt: 0 cookies, 0 tredjepartskall før valg |
| Avvisning skal ikke kreve flere klikk | ✅ ett klikk, samme lag |
| Ingen forhåndsavkryssede bokser | ✅ begge står av |
| Avvisning skal ikke ha lavere oppmerksomhetsverdi | ✅ samme rad, samme størrelse |
| Klare formuleringer i knappene | ✅ «Godta alle» / «Bare nødvendige» |
| Valg per formål | ✅ to kategorier under «Velg selv» |
| Enkelt å trekke tilbake | ✅ bunntekstlenka — som altså måtte være nåbar, se punkt 1 |
| Utfyllende informasjon utover banneret | ⚠️ **ikke oppfylt** |

Det siste punktet er det samme hullet som A42 punkt 2: erklæringen nevner
Google og Meta, men containeren kjører også Apollo, HubSpot, Clarity og
Microsoft Ads. Et samtykke kan ikke være informert om det som informeres om,
ikke er det som kjører.

### 4. Et kontrastbrudd som IKKE kommer fra banneret

Da markøren for første gang ble stående over en knapp under en axe-kjøring,
meldte den brudd. Det gjelder hele siden:

| Tilstand | Kontrast | AA (4,5:1) |
|---|---|---|
| `#0d0d0d` på `#de4826` (normal) | 4,68:1 | ✅ så vidt |
| `#0d0d0d` på `#b93a1d` (hover) | **3,41:1** | ❌ |

Hover-fargen er mørkere enn grunnfargen, mens teksten blir stående mørk. Det
rammer alle fem aksentknapper på forsiden og «Ta kontakt» i headeren på hver
side — ikke bare banneret. Det gjelder kun mus: Tailwind legger
hover-reglene i `@media (hover: hover)`, så berøringsskjermer får aldri
tilstanden.

**Ikke rettet, fordi det er en merkevarebeslutning.** `src/styles/tokens/` er
vernet i AGENTS.md. To utveier: gjøre hover-fargen lysere enn grunnfargen i
stedet for mørkere, eller la teksten bli hvit på hover — hvit på `#b93a1d`
gir 5,70:1. Det andre er minst inngripende, men snur tekstfargen synlig.

**Testhullet er verdt å merke seg:** alle tidligere axe-kjøringer hadde
markøren utenfor siden, så hover-tilstanden ble aldri målt. En tilstand som
ikke testes, er ikke testet.

### 5. Det jeg IKKE kan måle i dette miljøet

Playwrights Chromium er bygget uten proprietære kodeker. `canPlayType` for
`avc1` — altså H.264, som alle klippene bruker — returnerer tom streng.
Nettleseren får `networkState: 3`, «ingen brukbar kilde», og `play()` svarer
aldri.

Det betyr at **ingen påstand om at videoene spiller, kan komme herfra.** Den
målingen må gjøres på en ekte telefon. Symptomet «0 av 17 klipp spiller» i
testloggene er miljøet, ikke siden.

## A45 — Den nye siden slettet en levende case og publiserte en oppdiktet. 17.09.2026

Funnet mens jeg bygget /vart-arbeid på bestilling fra Pål. Det er samme
klasse feil som A40 (`/produktfoto`), og det er regel én i AGENTS.md som
brytes: levende URL-er flyttes ikke.

### Hva som faktisk finnes

Hentet fra dagens sitemap og verifisert med HTTP-status 17.09.2026:

| URL | Dagens side | Sto i `site.ts` |
|---|---|---|
| `/vart-arbeid/egon` | **200**, i sitemapet | ja |
| `/vart-arbeid/soulcake` | **200**, i sitemapet | **nei** |
| `/vart-arbeid/anton-sport` | **404** | **ja** |

Den nye siden var altså i ferd med å gjøre begge deler galt samtidig:
publisere en side som ikke finnes, og la en som finnes bli borte ved
cutover.

Soulcake-casen er ikke en bagatell. Den er 1 100 ord, har fire målte tall
med kildehenvisning, og dokumenterer et samarbeid siden 2022 — nøyaktig den
typen side som bærer et kundenavn i søk.

### Hvordan feilen så ut

```ts
export const caser: Case[] = [
  { slug: "egon",        kunde: "Egon",        ingress: "Foto og video på månedlig basis." },
  { slug: "anton-sport", kunde: "Anton Sport", ingress: "Foto og video på månedlig basis." },
];
```

Samme ingress på begge. Det er signaturen til en plassholder som aldri ble
sjekket mot virkeligheten — de levende sidene har hver sin.

Anton Sport står omtalt på dagens oversiktsside, men uten lenke og uten
side. Navnet er altså et kundenavn, ikke et kundecase, og det lever videre
i logorekka og i reel-veggen der det hører hjemme.

### Rettet

Innholdet ligger nå i `src/content/caser.ts`, migrert ordrett fra de to
levende sidene. `site.ts` har ingen caseliste lenger, og `sitemap.ts` leser
fra den nye kilden.

### Hva det burde ha vært fanget av

Ingenting fanget det, og det er verdt å si rett ut. `lenkesjekk` sjekker at
interne lenker treffer en rute — den kan ikke vite at en rute vi *ikke* har
bygget, finnes på dagens side. Sjekken går bare i én retning.

En sjekk som sammenligner dagens sitemap mot rutene i repoet ville tatt både
denne og A40. Den finnes ikke, og den bør bygges før cutover.
