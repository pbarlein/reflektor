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

> **LUKKET 19.09.2026 av Pål:** «produktfoto-siden er slettet. vi driver
> ikke med produktfoto, så det er helt greit.» Tjenesten er avviklet, og
> siden skal ikke lages. `/tjenester/produktfoto` går nå til forsiden,
> etter samme regel som resten av det døde `/tjenester/`-treet.
>
> **Ikke ta dette opp igjen.** Visningstallene under står for historikken,
> ikke som et argument. En sterk posisjon på et søkeord for en tjeneste
> selskapet ikke leverer, er ikke en posisjon verdt å berge.

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
migrert fra Squarespace. (Her sto at bloggen bærer rundt 481 refererende
domener. Rettet 02.10.2026: den bærer 3. Tallet var domenets.)

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

---

## A46 — Tekstgjennomgangen av forsiden. Målt 19.09.2026

Bestilt av Pål: «se igjennom hele forsiden og komprimer eller slett
unødvendig tekst som ikke gi noe gevinst. ikke slett noe som beriker
konteksten eller påvirker seo og aeo positivt».

Jeg målte i stedet for å vurdere på øyemål. To målinger.

### 1. Ord mot piksler, per seksjon

Rendret på 1440 px, `innerText` per `<section>` i `<main>`:

| # | Seksjon | Ord | Høyde | Ord per 100 px |
|---|---|---|---|---|
| 1 | Hero | 58 | 700 | 8,3 |
| 3 | Arbeidet | 48 | 898 | 5,3 |
| 4 | Slik jobber vi | 92 | 549 | **16,8** |
| 6 | Pris | 176 | 1 310 | 13,4 |
| 7 | Anmeldelser | 317 | 746 | **42,5** |
| 9 | FAQ | 82 | 883 | 9,3 |
| 10 | Kontakt | 99 | 926 | 10,7 |
| | **Forsiden** | **872** | **8 106** | 10,8 |

Det åpenbare kuttmålet — anmeldelsene, med 317 av 872 ord — er det
dyreste å kutte og det billigste å beholde. Sitatene ligger i en rad man
drar i, ikke i en spalte man skroller forbi: 42,5 ord per 100 px er
laveste pikselpris på siden, og de er navngitt tredjepartsbevis, som er
den best støttede AEO-formen som finnes. De står urørt.

### 2. Gjentatte fraser, mekanisk

Alle 4-gram og oppover i DOM-en, inkludert lukkede FAQ-svar (1 620 ord
totalt). Tolv fraser forekom mer enn én gang. **Ti av dem involverte
FAQ-svarene** — og de skal gjenta seg: et svar som ikke står alene er
verdiløst for en språkmodell, som siterer svaret og ikke siden.

Det etterlot tre reelle tilfeller:

| Hva | Hvor | Gjort |
|---|---|---|
| «og hva dere vil oppnå» | Kontaktingressen **og** hjelpeteksten under meldingsfeltet — eneste gjentakelse inne i én seksjon | Ingressetningen kuttet. Hjelpeteksten står nærmere feltet. |
| «Dere bestemmer etterpå» | Kontaktingressen; «Uforpliktende» står under send-knappen | Kuttet |
| «fri bruk i annonser, på nettsider og skjermer» | `front.price.note`, ~150 px under `tilbud.inngar[5]`, som sier det mer komplett | Kuttet. Eierskapspåstanden «Alt innhold er deres» beholdt — bruksrett og eierskap er ikke det samme. |

De to som ikke ble kuttet, og hvorfor: «Anton Sport, The Well» i både
heroen og arbeidsseksjonen er to forskjellige påstander (hvem som er
kunde / hvem klippene er fra), og «30 000 kr/mnd» tre steder er
pristransparens, som AEO vekter tungt.

### 3. Fire etiketter som sto to ganger i DOM-en

Faktorraden i prisseksjonen hadde etiketten i `<dd>` og en `sr-only`
`<dt>` med nøyaktig samme ord. Fire ganger fire ord, lest dobbelt av
både skjermlesere og språkmodeller. Markeringen er snudd: etiketten i
`<dt>`, tallet i `<dd>`, `flex-col-reverse` for den visuelle
rekkefølgen. Ingen piksel flyttet seg, axe-brudd uendret på 0.

### Resultat

872 → 839 ord. Mobilhøyden falt 70 px, desktop null.

**Konklusjonen er at forsiden ikke har et tekstproblem.** 872 ord på
8 106 px er magert for en byråforside, gjennomgangen fant 33 ord å
fjerne, og resten av gjentakelsene er FAQ-en som gjør jobben sin.
Skal siden bli kortere, er det piksler og ikke ord som må vekk —
seksjon 5 (arbeidsrutenettet, 1 112 px uten ett eneste ord) er
åtte ganger så høy som noen setning jeg kunne strøket.

---

## A47 — Hårstreken mellom prosesstegene. Målt og rettet 19.09.2026

Pål meldte at de loddrette strekene mellom de tre stegene i «Slik jobber
vi» sto for tett på teksten. Det var ikke et smaksspørsmål.

### Målt, 1440 px

| | Til teksten venstre for streken | Til teksten høyre for |
|---|---|---|
| Strek 1 | 33 px | **0 px** |
| Strek 2 | 33 px | **0 px** |

Årsaken lå i én klassestreng: `sm:pl-0` og `sm:px-8` sto begge på samme
`<li>`. Tailwind sorterer `pl` etter `px` i utdataen, så `pl-0` vant på
alle tre stegene og `px-8` ga padding bare mot høyre. Streken klistret seg
til steget den innleder, og leste som en ramme rundt ett steg i stedet for
et skille mellom to.

### Hvorfor `pl-0` på første steg ikke er løsningen

Den nærliggende rettingen — gi bare første steg `pl-0` og siste `pr-0` —
gir tre ulikt brede tekstspalter: ytterste steg får padding på én side,
midterste på to. Forskjellen er hele gutteren, altså 96 px av en spalte
på 331. Tre trinn som skal leses som likeverdige kan ikke ha ulik
linjelengde.

I stedet har alle tre lik padding, og hele `<ol>` trekkes ut i
gutterbredden med negativ margin. Da flukter første steg med h2-en over
og siste med høyre kant, samtidig som spaltene er nøyaktig like brede.

### Bruddpunktet måtte flyttes

Like spalter koster én gutter per spalte i stedet for to fordelt på tre.
På `sm` (640 px) ble tekstspaltene 116 px — smalere enn ordet
«produksjonsdag». Tre kolonner starter derfor først på `md` (768 px);
under det står den stablede tidslinja, som uansett er den bedre lesningen
på den bredden.

### Etter

Målt på åtte bredder fra 640 til 1920 px:

| Bredde | Tekstspalter | Utenfor kortet | Sidescroll |
|---|---|---|---|
| 640, 700 | 424 / 424 / 424 (stablet) | nei | nei |
| 768 | 159 / 159 / 160 | nei | nei |
| 1024 | 223 / 223 / 224 | nei | nei |
| 1280–1920 | 266 / 266 / 267 | nei | nei |

Strekene står nå 49 px fra teksten til venstre og 48 px til høyre, første
steg flukter med overskriften på 224 px, axe uendret på 0 brudd.

**Gjenstår, uendret fra før:** i båndet 768–1023 px wrapper «Vi klipper og
publiserer» til to linjer, så den tredje brødteksten starter én linje
lavere enn de to andre. Det er en egenskap ved tre kolonner på nettbrett,
ikke en følge av denne endringen.

---

## A48 — Kontaktingressen er fjernet, ikke omskrevet. 19.09.2026

Pål om avsnittet under «Se hva vi ville filmet hos dere»: «omformuler.
vanskelig å lese. trenger man egentlig å skrive noe her?»

Jeg sjekket hvert av de tre utsagnene mot resten av siden før jeg svarte:

| Utsagn | Står også | Hvor mye nærmere handlingen |
|---|---|---|
| Dere får et forslag tilbake | Knappen «Få et strategiforslag», og «Uforpliktende — du får et konkret forslag, ikke en generisk presentasjon» | Rett ved knappen |
| Vi holder til i Oslo | NAP-en i samme spalte, med gateadresse | 40 px under |
| jobber i hele Norge | FAQ-svaret «Hva er Reflektor?» på samme side, `areaServed: "NO"` i Organization- **og** Service-schema | I markeringen, som er der språkmodeller henter det |

Ingenting gikk altså tapt — verken for leseren eller for SEO og AEO.
Slotten `front.contact.sub` er fjernet, ikke satt til TBD: en TBD ville
meldt siden som ufullstendig for noe som er et bevisst kutt.
`content:check` går fra 27 til 26 slots på forsiden.

Bildet i venstrespalten har `flex-1` og vokste 120 px av seg selv. Ingen
dødplass oppsto — det var hele poenget med den konstruksjonen.

Skal det stå noe der igjen, må copyen bestilles. Jeg skriver den ikke selv.

---

## A49 — Praten kom inn, men etter forslaget. 19.09.2026

Pål foreslo å sette «send litt informasjon, så tar vi en uforpliktende
prat» under overskriften i kontaktseksjonen, der ingressen nettopp var
fjernet (A48). Tre funn før den ble satt inn:

1. **«Uforpliktende» sto allerede i kortet**, på linja under send-knappen.
   Setningen under h2-en ville gitt ordet to ganger med 400 px mellom seg.
2. **«Send litt informasjon» er hjelpeteksten under meldingsfeltet**, som
   sier det samme mer konkret («Kort om bedriften og hva dere vil oppnå»)
   og står rett ved feltet. Nøyaktig gjentakelsen A48 fjernet.
3. **Setningen lovet noe annet enn resten av kortet.** Knappen heter «Få
   et strategiforslag», linja under den lovet «et konkret forslag, ikke en
   generisk presentasjon», FAQ-svaret «Hvor fort kommer vi i gang?» sier
   «Innen tre virkedager får dere et forslag», og
   `tilbud.strategiforslagVirkedager` står på 3. En prat er ikke det samme
   tilbudet som et dokument — og «du får en telefon» er en høyere terskel
   enn «du får noe tilsendt».

Det siste er ikke en smakssak. Terskelen på dette skjemaet er den eneste
KPI-en siden har, så jeg spurte i stedet for å gjette.

**Påls svar: forslag først, så en prat om det.** Da er setningen riktig,
men rekkefølgen er poenget, og plasseringen følger av den. Linja under
knappen sa allerede alt unntatt praten — svartid, at forslaget er
konkret, at det er uforpliktende — så praten hører hjemme der og ikke
under overskriften:

> Svar innen 3 virkedager: et konkret forslag, ikke en generisk
> presentasjon. Så tar vi en uforpliktende prat om det. Eller ring
> +47 47605070.

Ordlyden er Påls egen setning satt sammen med det som allerede sto der.
Ingen nye påstander. «Uforpliktende» står nå én gang i kortet, verifisert
i rendret HTML. Skjemaet brukes bare på forsiden, så ingen andre sider
arver endringen.

Venstrespalten står fortsatt uten ingress: overskrift, NAP, bilde.

---

## A50 — Lufta rundt bilderutenettet. Målt 19.09.2026

Pål: «for mye space mellom seksjonene i forhold til andre steder på siden»,
med utsnitt av overgangen fra bilderutenettet til prisseksjonen.

### Målt, blekk til blekk, hele forsiden på 1440 px

| Overgang | Fra | Til | Før |
|---|---|---|---|
| 1 → 2 | hero | logorad | 144 |
| 2 → 3 | logorad | Arbeidet | 128 |
| 3 → 4 | reel-vegg | mørkt prosesskort | 152 |
| 4 → 5 | mørkt prosesskort | bilderutenett | **80** |
| 5 → 6 | bilderutenett | mørkt priskort | **144** |
| 6 → 7 | priskort | anmeldelser | 128 |
| 7 → 8 | anmeldelser | arbeidsvegg | 0 |
| 8 → 9 | arbeidsvegg | FAQ | 80 |

144 var ikke sidens største gap — 152 er større. Men det var det eneste
som sto rett overfor sin egen motsats: **samme overgang, mørkt kort mot
bilderutenett, hadde 80 px på oversiden og 144 på undersiden.** Rutenettet
hang løsere nedover enn oppover, og det er det øyet fanger, ikke
absoluttverdien.

Variasjon i seksjonsrytmen er bevisst i dette prosjektet — jevn vertikal
padding overalt er et malsignal, og forholdet mellom største og minste
rytme er omtrent 3:1 (se kommentaren i Hero.tsx). Denne rettingen rører
ikke det prinsippet. Den fjerner én asymmetri i et par.

### Etter

`pb-28 sm:pb-36` → `pb-20` på arbeidsrutenettet. 80 px på begge sider, på
mobil så vel som desktop, siden begge naboene allerede står på `pb-20`.
Rutenettet leser nå som ett pusterom mellom to kort.

Forsiden: 8 106 → 8 068 px på desktop. Netto bare −38 px, fordi
prosessblokken samtidig vokste 26 px av gutterrettingen i A47.

---

## A51 — Forsiden målt mot best practice. 19.09.2026

Pål: «så lenge designet støtter best practice i verdensklasse, så er jeg
happy». Best practice har tall knyttet til seg, så jeg kjørte forsiden mot
dem i stedet for å påstå noe.

### Én ting jeg selv rapporterte feil først

Første kjøring meldte kontrastbrudd på skilletegnet «·» i prisraden:
1,29:1. **Det var skriptets feil, ikke sidens.** Fargen er
`oklab(0.805984 0.00984171 0.0146355 / 0.6)`, og parseren min plukket
tallene ut som om de var RGB. Målt riktig — komposittert over kortflaten
`rgb(46,28,20)` — er den **4,05:1**. Tegnet er dessuten `aria-hidden` og
`select-none`, altså ren dekor, som WCAG 1.4.3 eksplisitt unntar. Ingen
feil.

### Det som besto

| Mål | Terskel | Målt |
|---|---|---|
| axe (alle regler) | 0 brudd | **0**, desktop og mobil |
| WCAG 1.4.3 kontrast | 4,5:1 / 3:1 | all informasjonsbærende tekst består |
| WCAG 2.4.7 synlig fokus | alle fokuserbare | alle (de to «treffene» var `type=hidden`) |
| CLS | < 0,1 | **0,0000** — gjennom full skroll, 30 bilder og 16 klipp |
| LCP | < 2 500 ms | 124 ms desktop, 180 ms mobil med 4× CPU-brems |

CLS på null gjennom hele siden er det sterkeste tallet her: hvert eneste
medieelement reserverer plassen sin før det lastes. LCP-tallene er målt
mot localhost og sier **ingenting** om virkeligheten — uten nettverk er de
bare en øvre grense.

### Det som ikke besto, og som er rettet

**WCAG 2.2 AA 2.5.8, målstørrelse.** To lenker målte 21 px i høyden mot
kravet på 24: «Se alle anmeldelsene på Google» og e-postadressen i
kontaktkortet. Unntaket for «inline» gjelder lenker inne i en setning —
begge sto alene i sin egen blokk, så det gjaldt ikke. `inline-flex
min-h-6`. «+47 47605070» står inne i en setning og er unntatt.

**Linjelengde.** Merknaden om stillbilder gikk over hele priskortets
bredde: 129 tegn per linje mot normen 45–75. `max-w-3xl` tar den til 99.

### Det som ikke besto, og som jeg lot stå

**Prosesstegene måler 34 tegn per linje**, under gulvet på 45. Årsaken er
gutterrettingen i A47: spaltene gikk fra 298 til 266 px da lufta rundt
hårstrekene ble symmetrisk. Jeg lot det stå av to grunner:

1. 45–75 gjelder **løpende lesning**. Disse er 20-ords trinn i en
   prosesstripe, altså etiketter. Der er 35–45 normalen.
2. Tre spalter i en 992 px container topper på ~42 tegn selv med null
   gutter. Skal tallet over 45, må det bli to spalter eller bredere
   container — en designendring, ikke en justering.

**Merknaden står fortsatt på 99 tegn**, ikke 75. For å komme til 75 måtte
rammen ned i 558 px inne i et 992 px kort, og da ser den ut som en feil.
En to-linjers merknad tåler lengre linjer enn et avsnitt gjør.

**Vekt: 1 474 kB desktop, 2 372 kB mobil.** Over det man vil ha, men
siden er et videobyrås arbeidsprøve — 16 klipp og 30 bilder er produktet,
ikke pynt. Skal tallet ned, er det en redaksjonell beslutning om hvor mye
arbeid som skal vises, ikke en teknisk.

### Fortsatt uavklart fra tidligere

Hover-kontrasten på 3,41:1 (under 4,5) er en merkevaretoken-beslutning og
venter på Pål. Se tidligere notat.

---

## A52 — Hover-kontrasten var aldri en merkevarebeslutning. 19.09.2026

Jeg har gjentatte ganger meldt hover-kontrasten som noe som venter på Pål,
fordi den rører aksentfargen og `src/styles/tokens/` er merkevaren. **Det
var feil, og jeg tok feil to ganger til:** tallet jeg oppga var 3,41, ikke
3,78, fordi jeg målte mot feil flateverdi.

Riktig målt, mot den faktiske bakgrunnen `rgb(246,244,241)`:

| Farge | Kontrast | 17 px tekst (krav 4,5) |
|---|---|---|
| `#DE4826` — aksenten, brukt i hover i dag | **3,78** | ✗ |
| `#C03A1C` — `--aksent-tekst-liten` | **4,95** | ✓ |

Den andre raden fantes allerede. `overstyringer.css` definerer
`--aksent-tekst-liten` med kommentaren «Trengs oransje i
brødtekststørrelse, er #C03A1C (4,792) minsteverdien», og globals.css
eksponerer den som `--color-aksent-tekst`. Systemet hadde utgangen klar;
den var bare ikke brukt.

Merkevaren er altså uendret. Det eneste som skjedde er at én lenke —
«Alle 19 spørsmål og svar» på forsiden, sidens eneste produksjonsbruk av
aksent som tekstfarge — nå bruker riktig token i hover.

Den andre forekomsten, `text-aksent` i `Slot.tsx`, er TBD-markøren. Den
vises bare når copy mangler og er et previewverktøy, ikke innhold.

---

## A53 — Personvernerklæringen er fylt, og punkt 1 var ødelagt. 19.09.2026

### De tre TBD-ene, besvart av Pål

De ble ikke bare stående tomme — de ble **servert som synlig
«TBD(...)»-tekst i produksjon**. Verifisert med curl mot deployet før
rettingen.

| Felt | Var | Er |
|---|---|---|
| Sist oppdatert | `TBD(...)`, kilden sa «29.04.206» | **19. september 2026** |
| Lagringstid | `TBD(...)`, kilden sa «[for eksempel 12–24 måneder]» | **24 måneder** |
| Rettighetsadresse | `TBD(...)`, kilden sa «[e-postadresse]» | **pal@reflektor.no** |

Datoen er bevisst en literal og ikke utledet fra byggetidspunktet. «Sist
oppdatert» skal si når teksten faktisk ble endret; en dato som flytter seg
ved hver deploy er en usann påstand om at erklæringen er revidert.

### Punkt 1 var en vegg, og adressen var feil

Funnet mens jeg fylte inn de tre over. Kontaktblokken sto som én streng
uten skilletegn, og rendret slik på siden:

```
Kontaktinformasjon:Reflektor ASOrganisasjonsnummer: 926974270Adresse:
Tvetenvein 162, 0671 OsloE-post: pal@reflektor.noTelefon: 47605070
```

Linjeskiftene gikk tapt i migreringen fra Squarespace. `liste`-typen
fantes allerede i fila og gir strukturen tilbake.

**To innholdsrettelser, verdt å si høyt fordi fila ellers sier at teksten
er ordrett og ikke skal redigeres:**

1. **«Tvetenvein» → «Tvetenveien».** Gateadressen manglet en e. Den sto
   riktig i `site.ts`, i `Schema.tsx` og i bunnteksten — feil bare her.
   NAP-konsistens mellom bunntekst og markup er ett av de fire punktene
   AGENTS.md sier synligheten faktisk krever, så dette var ikke en
   skrivefeil, det var et brutt entitetssignal.
2. **«47605070» → «+47 47605070»**, samme form som `site.kontakt.telefon`.

Ingen av delene er juridisk innhold. Det er selskapets eget navn, nummer
og adresse.

### Skanneren fanget sin egen dokumentasjon

Kommentaren som forklarer at markørene er fylt inneholder selv
«TBD(...)», og ble meldt som en åpen markør. En sjekk som rapporterer
dokumentasjonen av en løsning som om den var problemet, lærer folk å
ignorere den. `utenKommentarer()` blanker nå kommentarer før skanning,
med linjeskift beholdt så linjenumrene stemmer. Verifisert i to
retninger: en innsatt `TBD(test.verdi)` i `logoer.ts` ble fanget, og
kommentarene ble ikke.

---

## A54 — Bloggmigreringen kan ikke starte på dagens sluggliste. Målt 19.09.2026

Pål spurte om migreringen var startet. Den er ikke det, og det er like
greit: jeg sjekket `bloggSlugs` mot levende reflektor.no før jeg skrev en
linje, og lista stemmer ikke med virkeligheten.

Alle 17 sluggene i `src/content/site.ts` hentet mot
`https://www.reflektor.no/blogg/<slug>`, uten å følge redirects:

### 8 er ekte artikler (200, eget innhold)

| Slug | Ord | Tittel |
|---|---|---|
| `hva-innebaerer-digital-historiefortelling` | 1 518 | Hva innebærer digital historiefortelling? |
| `markedsforing-i-sosiale-medier-some` | 2 011 | Markedsføring i sosiale medier |
| `hva-er-innholdsmarkedsforing` | 2 332 | Hva er innholdsmarkedsføring? |
| `hva-er-employer-branding` | 1 447 | Hva er employer branding? |
| `hva-er-innholdsproduksjon` | 2 340 | Hva er innholdsproduksjon? |
| `hva-er-videomarkedsfring` | 2 051 | Hva er videomarkedsføring? |
| `hva-gjr-en-innholdsprodusent` | 1 524 | Hva gjør en innholdsprodusent? |
| `hva-koster-et-some-byra` | 701 | Hva koster et SoMe-byrå i Norge? |

Til sammen ~13 900 ord. Det er migreringsjobben.

### 3 er aliaser — 301 til en av de åtte

| Slug | 301 til |
|---|---|
| `hvordan-markedsfore-bedrift` | `markedsforing-i-sosiale-medier-some` |
| `hva-er-digital-markedsforing` | `markedsforing-i-sosiale-medier-some` |
| `hva-er-inbound-marketing` | `hva-er-innholdsmarkedsforing` |

### 6 er døde — 301 til `/blogg`

`hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de`,
`hva-er-holdningskampanje`, `hva-er-reklame`, `hva-er-personas`,
`hva-er-visuell-identitet`, `hvordan-ta-portrett-bilder`.

Merk at Squarespace svarer **200 på en soft-404**: den serverer
bloggoversikten med oversiktens egen `<title>`. En sjekk som bare ser på
statuskoden ville meldt alle 17 som friske. Det var slik lista oppsto.

### Hva det betyr

`bloggSlugs` bygger én side per slug. Ved cutover ville den altså:

- publisert **6 sider som ikke finnes i dag**, og som i dag sender folk
  videre til oversikten
- publisert **3 aliaser som selvstendige artikler**, altså duplikatinnhold
  der det i dag står én kanonisk URL med tre innganger

Det er samme klasse feil som A45 — publisere det som ikke finnes, og
miste strukturen i det som finnes.

### Ikke rettet, og hvorfor

Regel 3 i AGENTS.md sier rett ut at bloggsluggene ikke skal endres. Den
regelen finnes for å verne søkesynligheten — ikke 481 refererende domener,
som det sto her før 02.10.2026 — og den er riktig —
men den forutsetter at lista er korrekt, og det er den ikke. Å endre den
er Påls beslutning, ikke min.

**Anbefalingen min:** de 8 ekte blir sider og får migrert tekst. De 3
aliasene blir 301 i `next.config.ts`, til samme mål som i dag. De 6 døde
blir 301 til `/blogg`, som i dag — altså ingen ny 404, og ingen ny side.
Da er den nye siden identisk med dagens på alle 17 adressene, og det er
akkurat det regel 3 er ute etter.

---

## A55 — Gjengangeren fikk aldri samtykkehendelsen. Målt og rettet 21.09.2026

Pål ba om at samtykkeløsningen skulle være optimal på den nye siden. Jeg
målte dataLayer i nettleseren i stedet for å lese koden, med alle kall til
Google blokkert så ingenting nådde ut.

### Målt før

Besøk nummer to, med cookien satt:

```
0: consent default {ad_storage:"granted", analytics_storage:"granted", …}
1: set ads_data_redaction false
2: set url_passthrough true
3: gtm.js
```

**Ingen `samtykke_oppdatert`.** `meldFra()` kalles bare fra `svar()`, altså
når noen aktivt klikker i banneret.

Googles egne tagger klarer seg — de leser consent-tilstanden, og den er
riktig. Men de fem taggene som ikke leser Consent Mode i det hele tatt
(Meta, Apollo, HubSpot, Clarity, Microsoft Ads) kan bare styres inne i
containeren. Henges de på hendelsen, fyrer de den ene gangen brukeren
klikker og aldri mer for den personen. En feil ingen ville sett på siden.

### En kommentar som pekte feil vei

`Samtykke.tsx` sa at hendelsen er «kroken utløseren skal henge på». Det var
akkurat den antakelsen målingen motbeviste. Kommentaren er rettet, ikke
slettet — den neste som leser fila skal se hva som var galt.

### Rettet

Oppstartsskriptet gjentar nå hendelsen på hver sidevisning der cookien
finnes. Den ligger i `standardSkript()` og ikke i en React-effekt, og det
er et rekkefølgevalg: på besøk to setter skriptet `data-samtykke="svart"`
allerede i `<head>`, så `Sporing` rendrer GTM ved første render. En effekt
kunne kommet etter `gtm.js`.

`samtykke_kilde` skiller de to — `"valg"` fra banneret, `"lagret"` fra
oppstart. Feltet er additivt, så én utløser på hendelsesnavnet treffer
begge.

### Målt etter

```
0: consent default {ad_storage:"granted", …}
1: set ads_data_redaction false
2: set url_passthrough true
3: {event:"samtykke_oppdatert", …, samtykke_kilde:"lagret"}
4: gtm.js
```

### Tester, verifisert i to retninger

Tre nye tester i `tests/samtykke.test.ts`: at skriptet gjentar hendelsen,
at gjentakelsen kommer etter `consent default`, og at den faktisk havner i
dataLayer når skriptet kjøres med en cookie. Den siste dekker fire
tilfeller — fullt samtykke, avslag, blandet, og ingen cookie.

**Avslaget er det viktigste.** En gjenganger som sa nei skal få hendelsen
med `denied`, ikke bli utelatt: uten den ser en utløser i GTM ingen
forskjell på «sa nei» og «har ikke svart ennå».

Testene ble kjørt med gjentakelsen slått av for å bekrefte at de feiler:
2 av 21 falt. Med den på: 21 av 21.

---

## A56 — Tjenestesidene og bloggen bygget. 21.09.2026

Pål: «du bygger alle sidene med faglig hold i hva som er best for
Reflektor … her har du frie tøyler.»

Grunnlaget er `docs/synlighet-2026.md` (søkeord og AEO-research) og
`docs/sidearkitektur.md` (hvem eier hvilke ord).

### Hva som ble bygget

| Side | Før | Nå |
|---|---|---|
| `/innholdsproduksjon` | tom stubb | nav-side, ruter til fire eiker |
| `/reklamefilm` | tom stubb | landingsside |
| `/videoproduksjon-i-oslo` | tom stubb | landingsside |
| `/employer-branding-video-oslo` | tom stubb | landingsside |
| `/eventfotograf-eventvideo` | tom stubb | landingsside |
| `/blogg` | 17 slugs, utledede titler | 8 ekte artikler, ekte titler |
| `/blogg/[slug]` | «ikke migrert fra Squarespace» | 12 871 ord, migrert ordrett |

### Strukturen følger målingene, ikke smaken

- **Svaret først**, som eget designelement med egen venstrekant. 44,2 % av
  LLM-siteringer hentes fra første 30 % av en side, 55 % for AI Overviews.
- **Spørsmålsformede H2-er**, hver en selvstendig siterbar enhet.
- **FAQ-schema på hver side.** På bloggen er den utledet fra artiklenes
  egne spørsmålsoverskrifter — de ER en FAQ — uten en linje ny copy.
- **Sitater fra navngitte Google-anmeldelser** der de hører hjemme.
  Sitater var det sterkeste enkeltgrepet i GEO-studien: +37 %.

### Tre feil funnet underveis

**`TjenesteSchema` hardkodet abonnementsprisen** inn i `offers` på hver
side som brukte den. Riktig med én side, feil med fem: en reklamefilm
koster ikke 30 000 kr/mnd. Prisblokken er nå av som standard, og forsiden
er den ene siden som eksplisitt slår den på.

**`TbdMarkor` målte 3,23:1.** Oransje tekst på en 12 %-tone av samme
oransje. Feilen var usynlig fordi markøren bare vises når copy MANGLER, og
forsidens slots er fylt — den dukket opp i det tjenestesidene fikk
TBD-er. Nå mørk blekk, 14,22:1.

**Sitemapet listet alle sytten bloggslugs.** Ni av dem 301-er. Et sitemap
som annonserer omdirigeringer er en selvmotsigelse.

### Intern lenking var det virkelige hullet

Før i dag lenket ingenting til tjenestesidene utenom bunnteksten, og en
bunntekstlenke er sitewide — den svakeste formen for intern lenking som
finnes. Nå:

- hver bloggartikkel → tjenestesiden den leder til, med ankertekst som
  sier hva siden ER
- `/vart-arbeid` → de fire eikene, rett over «skal vi lage det samme for
  dere?», som ellers lot «det samme» stå udefinert
- tjenestesidene → hverandre, gjennom avgrensningsblokkene

Forsiden er bevisst holdt utenfor. Jobben dens er skjemaleads, og
prosjektlenker over skjemaet er en lekkasje. Bunntekstlenken står der
uansett.

### Det som gjenstår

**8 TBD-er blokkerer.** Prosjektpriser, leveringstider og prosessen for
hver tjeneste finnes ikke verifisert noe sted i repoet. De rendres synlig
i previewen og listes av `content:check`. Sidene er ferdige som
konstruksjoner; de er ikke ferdige som salgsmateriell før Pål fyller dem.

**Ingen nye bloggartikler er skrevet, og det er et valg.** Researchen sier
at «hva er»-innhold kannibaliseres av AI-motorene, og at prissøk er det
som siteres. Men prisspørsmålene hører hjemme PÅ tjenestesidene, der de
nå står som egne H2-er. En egen artikkel om «hva koster videoproduksjon»
ville konkurrert med `/videoproduksjon-i-oslo` om nøyaktig det søket —
altså kannibalisering, som var oppgaven å hindre.

Den ene artikkelen som ikke kan eies av noen tjenesteside, er
sammenligningen «byrå, frilanser eller ansette selv». Den krever
lønnstall med kilde, og de må hentes før den kan skrives.

---

## A57 — `/kontaktoss` hadde ikke skjema. Funnet 21.09.2026

Funnet i en sluttkontroll over alle tjue sider, der ordtelling per side ble
målt sammen med axe og schema. Tre sider skilte seg ut med nesten ingen
tekst. To av dem var reelle mangler.

### `/kontaktoss` — tre ord i `main`

En overskrift og en e-postadresse. TODO-en i fila sa det rett ut:

> «skjema. Innsending må utløse `takk_page_view` på `/takk` – det er
> hendelsen GA4 og Google Ads måler leads på. Skjemaet er eneste
> KPI-bærende element på siden.»

**`/kontaktoss` er navngitt i AGENTS.md som en live side det annonseres
mot.** Betalt trafikk landet på en side uten det ene elementet som gjør
den til noe annet enn en blindvei. Av alt som ble funnet i denne
gjennomgangen, er dette det som koster penger hver dag.

Skjemaet er nå det samme som ellers, med `side="/kontaktoss"` slik at
kilden registreres, og gjennom `/api/skjema` med 303 til `/takk`. Ingen
ny strøm, ingen sporing rørt. Ikke testet ved innsending — det ville
utløst en ekte konvertering i Ads-kontoen.

### `/gratis-strategimote` — to ord, og et tilbud som motsa resten

Siden lovet et «gratis strategimøte». Resten av nettstedet lover et
skriftlig forslag innen tre virkedager. To løfter for samme handling er
samme feil som `/sosiale-medier-byra` ble 301-et for.

Påls avklaring 19.09.2026 løste den: forslag først, så en prat om det.
Siden eier nå praten — den andre halvdelen av sekvensen — og sier
eksplisitt at forslaget kommer først. Den konkurrerer ikke med
`/kontaktoss`; den forklarer hva møtet faktisk er.

TODO-en ventet på «budskap og HubSpot-oppsett». Budskapet fantes allerede
i Påls egen avklaring, og HubSpot trengs ikke: skjemaet er det verifiserte
som brukes ellers.

### `/sosiale-medier-byra` — 19 ord, og det er riktig

Fortsatt en `UnderArbeid`-stubb, og den skal forbli det. 301-en til `/`
legges inn på cutover, etter at Google Ads har byttet endelig URL. Se
`docs/cutover.md` punkt 1. Å bygge den ville vært å bygge noe som skal
fjernes.

### Sluttkontrollen, tjue sider

| Mål | Resultat |
|---|---|
| axe-brudd | **0** på alle tjue |
| `<h1>` per side | nøyaktig 1 på alle tjue |
| Service-schema | 6 |
| FAQPage-schema | 11 |
| BreadcrumbList | 16 |
| Article | 5 |
| Synlige TBD | 7, alle på tjenestesidene, alle listet av `content:check` |

---

## A58 — `/gratis-strategimote` var slettet. Rettet 21.09.2026

Pål, etter at jeg hadde bygget siden: «jeg mener forresten at "gratis
strategimøte" er en gammel kontaktside som ikke lenger er i bruk. slettet
på squarespace siden.»

Hentet på nytt samme dag: **404.** Han har rett.

### Notatet i `next.config.ts` var feil

Den listet `/gratis-strategimote` blant sider som er «alle live (HTTP
200). Beholdes som de er.» Det var en påstand om virkeligheten, skrevet
én gang og aldri sjekket igjen.

**Det er tredje gang samme klasse feil dukker opp i dette prosjektet:**

| Sak | Kartet sa | Virkeligheten |
|---|---|---|
| A40 | 301 til `/produktfoto` berger en sterk posisjon | siden fantes ikke |
| A54 | 17 bloggslugs er friske | 8 var ekte, 9 var døde eller aliaser |
| A58 | `/gratis-strategimote` er live | 404 |

Fellesnevneren er et kart som var riktig da det ble tegnet. Kostnaden her
var en hel side bygget for en adresse som ikke finnes — funnet fordi Pål
kjente sin egen side bedre enn notatet gjorde.

### Gjort

Siden er slettet, fjernet fra sitemapet, og adressen 301-er nå til
`/kontaktoss` — samme intensjon, og den er live med 7 693 ord. Det er
presis situasjonen regel 1 i AGENTS.md ber om en redirect for: «redirects
skal kun rette opp faktiske 404-er».

### Verdt å merke

Arbeidet var ikke bortkastet. Da siden ble bygget, måtte tilbudet ryddes
— «gratis strategimøte» motsa «forslag innen tre virkedager». Den
opprydningen står, i sekvensen på `/kontaktoss`: forslag først, så en
prat om det.

---

## A59 — Redaksjonell gjennomgang av egen copy. 21.09.2026

Pål pekte på «Skal filmen kjøpes visning for» og ba om en selvkritisk
redaktørgjennomgang av alle landingssidene og blogginnleggene.

Formuleringen han fanget sto **fire steder**, ikke ett. Gjennomgangen fant
elleve ting til, og to av dem var verre enn språk.

### Faktafeil

**Artikkelen om SoMe-ansvarlig påsto at 600 000 kroner er «over
medianen».** SSBs median er 55 800 i måneden, altså 669 600 i året.
600 000 ligger **under**. Artikkelen motsa seg selv to setninger senere
med «tallet i eksempelet ligger under begge».

Rettingen gjør argumentet sterkere, ikke svakere: et eksempel under
medianen betyr at regnestykket er konservativt, og at forskjellen blir
større med et mer realistisk lønnsnivå. Det står nå eksplisitt.

**Bloggoversikten sa «Åtte artikler» mens det var ni.** Tallet ble skrevet
da åtte var migrert, og ble ikke oppdatert da den niende kom til samme
dag. Nå telles det i koden. Et tall på siden som er feil koster mer tillit
enn tallet er verdt.

### Språk

| Var | Er | Hvorfor |
|---|---|---|
| «skal kjøpes visning for» (×4) | «laget for å vises mot betaling», «betale for å få filmen vist» | passiv, ikke idiomatisk |
| «kundelisten er produksjonskunder samlet» | TBD(reklamefilm.kunder) | ugrammatisk, og avsnittet endte på det vi *ikke* har |
| «Spør noen «hva koster tv-reklame», er svaret …» | «Spør man …» | inversjonen faller ikke naturlig |
| «noe tekst løste bedre» | «noe tekst ville løst bedre» | feil tempus |
| «lar seg vise og ikke skrive» | «lar seg vise, men ikke skrive» | elliptisk, motsetningen manglet |
| «klipper én film i flere lengder» | «klipper filmen i flere lengder» | man klipper filmen, ikke «én film» |
| «trenger det første … det andre» | «trenger et prosjekt først … kalenderen» | tvang leseren til å bla tilbake |
| «Hva får du som du ikke får?» | «Hva får dere — og hva får dere ikke?» | ikke norsk; setningen manglet motsetningen |
| «En markedsansvarlig som jobber der håndterer …» | «… som jobber der, håndterer …» | manglende komma |
| «et forslag tilbake til hvordan» | «et forslag til hvordan» | preposisjonskjeden snublet |

### Personskifte

Overskriftene sa «Er du på riktig side?» og «Det du lurer på», mens
brødteksten på samme side sier «dere» gjennomgående. Nettstedet snakker
til et selskap. Avgrensningsblokken heter nå «Er dette riktig side?», som
slipper unna valget helt.

Én du-form sto igjen i min egen copy: «din risiko» i sammenligningstabellen.
Rettet.

### Det jeg IKKE rettet, og hvorfor

**Bloggartiklene bruker «du» gjennomgående.** «Er du nysgjerrig på employer
branding», «målgruppen din», «alt du trenger». Det er Reflektors egen
publiserte copy, migrert ordrett, og regel 3 i AGENTS.md sier at
bloggen ikke skal skrives om.

Men det betyr at nettstedet har to stemmer: bloggen sier «du», de nye
sidene sier «dere». **Det er en beslutning for Pål, ikke for meg** — å
harmonisere krever at åtte artikler skrives om, og det er nøyaktig det
regel 3 forbyr uten videre.

---

## A60 — Bloggoversikten bygget om, bilder gjennom hele siden. 21.09.2026

Pål: «veldig lite inspirerende oversikt over blogginnlegg. redesign, og
hold en høy standard gjennom alle landingssider og blogginnlegg … ta
inspirasjon fra vårt arbeid.»

### Hva som var galt

Ni like tekstkort i et rutenett. Alt hadde samme vekt, ingenting hadde
bilde, og den nyeste artikkelen — den eneste som er skrevet for å selge
noe — så nøyaktig ut som en ordbokartikkel fra 2024.

### Tre grep, alle hentet fra `/vart-arbeid`

**Bilde først.** Kundecasene leder med et stort stillbilde, og det er det
som gjør dem til noe annet enn en lenkeliste. Ni artikler har nå hvert
sitt, valgt redaksjonelt per tema — ansatte i arbeid over employer
branding, en foredragsholder over historiefortelling.

**Ett oppslag som bærer.** Casene er «store og få» fordi et rutenett
bygget for flere enn man har ser ut som et rutenett med hull i. Her er
problemet motsatt — ni artikler av svært ulik verdi — og løsningen er
samme tanke: løft den ene som betyr mest, la resten være et ryddig arkiv.

**Metadata som rad.** Casene har «kunde · sektor · siden». Artiklene har
«måned · lesetid». Lesetiden regnes ut fra ordtellingen, den skrives ikke
— samme grunn som at artikkelantallet nå telles: et tall skrevet for hånd
blir feil.

### Alt-tekstene måtte renses

Jeg kopierte alt-tekstene fra `arbeid.ts`, men **pyntet på tre av dem**
underveis: «Nærbilde av bakverk på brett» ble til «… fra en
produksjonsdag», og «Bakverk i en disk» til «… fotografert på en
produksjonsdag». Ingen av tilleggene kan belegges — jeg vet ikke når de
bildene ble tatt.

Alle ni er nå ordrett fra kilden, verifisert programmatisk mot
`arbeid.ts`. Det er samme regel som gjelder for tall og kundenavn: et
tillegg som høres harmløst ut er fortsatt en påstand.

**Motivene navngir ingen kunde**, med vilje. Et bilde av en navngitt kunde
over en artikkel om et fagfelt ville antydet at kunden har kjøpt akkurat
det.

### Ellers

- Toppbilde på de tre tjenestesidene som ikke allerede har klipp. De to
  som har, får ikke — et stillbilde rett over en videorad er to løsninger
  på samme problem.
- Toppbilde på hver artikkel, plassert **etter** ingressen. Over tittelen
  ville det skjøvet H1 og svaret ned, og 44 % av LLM-siteringer hentes fra
  de første 30 % av en side.
- `/kontaktoss` hadde ikke ett eneste bilde. Et videobyrå som ber om
  kontakt uten å vise noe av det de lager, ber om tillit uten å gi grunn
  til den.
- «Spørsmål» → «Flere spørsmål» på tjenestesidene. To merkelapper på samme
  side som begge betyr «her er spørsmål» navigerer ikke, de forvirrer.

### Kontroll, seksten sider

0 axe-brudd, nøyaktig én `<h1>` per side, ingen ødelagte bilder. Forsiden
meldte først 18 ødelagte — det var lazy-loading som ikke hadde fullført i
målingen. Med riktig skrolling: 109 bilder, 0 feil, 0 HTTP-feil.

---

## A61 — FAQ på blogginnleggene. Målt 21.09.2026

Pål: «burde vi implementere temarelevante FAQ-er i hvert blogginnlegg som
også peiler inn på vår tjeneste uten at vi kanibaliserer?»

Svaret var ja — men først måtte noe rettes, for **vi gjorde det allerede,
og vi gjorde det galt.**

### Målingen som avgjorde det

All FAQ-markering på nettstedet, hentet fra rendret HTML:

| | Før | Etter |
|---|---|---|
| FAQ-par totalt | 77 | 73 |
| Unike spørsmål | 68 | 69 |
| Spørsmål på flere sider | **5** | 4 |

**«Trenger din bedrift en fotograf eller videograf?» sto som
FAQ-markering på seks blogginnlegg samtidig.** Det er Squarespace-malens
CTA-overskrift, migrert ordrett — og den automatiske utledningen gjorde
den om til strukturerte data hver gang. Seks sider som hver påstår å være
svaret på samme spørsmål, uten at noen av dem er kilden.

Det er nøyaktig kannibaliseringen Pål spurte om vi kunne unngå, og den
var allerede live. Selvforskyldt: utledningen var min.

### To filtre til, og hvorfor

Utledningen tok alt som endte på spørsmålstegn. Det ga oppføringer som
**«Trinn 2: Målgruppen din: Hvem skal se, lese eller lytte til
innholdet?»** — en stegoverskrift med et spørsmål inni. Som FAQ-oppføring
er den uforståelig løsrevet, og en oppføring som ikke gir mening alene er
verdiløs: hele poenget er at den skal kunne siteres uten konteksten.

Nå kreves det at overskriften **begynner med et spørreord**, og en
eksplisitt sperreliste tar boilerplate-CTA-en. Teksten står fortsatt på
siden — det er bare markeringen som er borte.

### Så, det Pål faktisk spurte om

Fire artikler fikk ett håndskrevet spørsmål hver. Ikke ni: de fire med
bare ett eller to utledede par, der tillegget gir mest. Å skrive ni ville
vært å fylle en kvote.

**Regelen som gjør at de ikke kannibaliserer:** spørsmålet må være ett
ingen tjenesteside og ingen post i `/faq` allerede eier. Kontrollert mot
alle 65 unike spørsmål på nettstedet før hvert ble skrevet.

Det utelukker det åpenbare — «hva koster X» og «hvordan foregår en
produksjon» eies av tjenestesidene, «bør vi ansette selv» av `/faq`. Det
som står igjen er spørsmålene leseren sitter med *etter* artikkelen:

| Artikkel | Spørsmål |
|---|---|
| Employer branding | Hvor begynner man hvis man aldri har jobbet med det før? |
| Videomarkedsføring | Bør vi starte med én stor film eller flere små? |
| Digital historiefortelling | Hva skiller en historie fra en vanlig produktvideo? |
| Innholdsmarkedsføring | Hvor mye innhold skal til før det virker? |

**Broen er ikke spørsmålet, den er svaret.** Et ærlig svar på «én stor
film eller flere små» ender av seg selv ved to tjenestesider, uten å
selge noe.

### Teknisk

Én `FAQPage`-node per side, ikke to — utledede og håndskrevne par slås
sammen før markeringen skrives. To noder på samme URL er to entiteter som
påstår å beskrive den samme siden.

Synlige på siden, ikke bare i markeringen. Google krever at
FAQ-markering gjenspeiler innhold brukeren ser, og uavhengig av kravet:
en FAQ ingen kan lese hjelper ingen.

Resultat: **null ny duplisering.** De fire som står igjen er forside ↔
`/faq`, som er bevisst — forsiden viser et utvalg av samme liste, og
forsiden var holdt utenfor denne runden.

---

## A62 — De ni TBD-ene er fylt. 22.09.2026

Pål svarte på fire spørsmål. Alle ni hull er lukket, og `content:check`
melder for første gang «Ingen TBD-markører i øvrig innhold heller».

### Prismodellen var ett svar, ikke fire

Pål: «alle faste samarbeid i henhold til hovedtjenesten er 30K per måned,
og enkeltjobber starter på 40K.»

Det er hele prismodellen i én setning, og den er lik på alle fire
prosjektsidene. Tallet ligger derfor i `tilbud.fraPrisProsjekt` i
site.ts, ikke som fire kopier i `tjenester.ts`. Fire kopier er fire steder
prisen kan gli fra hverandre neste gang den endres, og en side som oppgir
feil pris er verre enn en som ikke oppgir noen.

Prisdriverne — omfang, antall produksjonsdager, etterarbeid — ligger
samme sted, av samme grunn.

**To åpne tall er mer enn de fleste norske byråer oppgir.** Det var
allerede Reflektors sterkeste kort mot konkurrentene på abonnementet;
nå gjelder det prosjektene også.

### Nyansen per side

Grunnteksten er lik, men hver side har ett avsnitt til fra Påls eget
svar:

| Side | Tillegget |
|---|---|
| Reklamefilm | Holder kunden lokasjon og statister, går prisen ned — og på en reklamefilm veier de to postene ofte mest |
| Videoproduksjon | Samme, kortere |
| Employer branding | «Én film er ett øyeblikk.» Kontinuitet er nøkkelen for å være en attraktiv arbeidsgiver, og det er derfor mange ender med et løpende samarbeid |
| Event | Kveldsarbeid er den vanligste fordyrende faktoren |

Employer branding-tillegget er broen fra prosjekt til abonnement, og den
er ærlig: en rekrutteringsfilm er en kampanje, men det å være aktuell som
arbeidsgiver er ikke det.

### Fra-prisen er markert opp som MINSTEPRIS

`PriceSpecification.minPrice`, ikke `Offer.price`. Forskjellen er ikke
pedantisk: `price` betyr «dette koster det», og det ville vært usant for
noe som starter på 40 000 og kan ende hvor som helst. `minPrice` er
schema.orgs måte å si «fra», og det er nøyaktig påstanden vi kan belegge.

### Tre nye kundenavn, verifisert

Reklamefilm for **Vitusapotek, Peppes Pizza og Samlerhuset**. Oppgitt av
Pål. Vitusapotek og Samlerhuset er nye i prosjektet — de står ikke i
logorekka, og skal ikke inn der uten logofiler.

Setningen skiller eksplisitt: reklamefilm for de tre, foto og video
ellers for de andre. AGENTS.md krever at produksjonskunder aldri
fremstilles som noe de ikke er, og det gjelder begge veier.

### To feil funnet i egen implementasjon

**Løst anførselstegn på alle fire prissvarene.** Rest fra måten jeg satte
sammen malstrengene. Synlig i produksjon som `… til stede samtidig."`

**Avsnittsskiftene kollapset.** Jeg skrev prissvarene som to avsnitt —
fakta først, så nyansen — men layouten rendret hele `svar` i én `<p>`, og
HTML slår sammen tomrom. De to avsnittene ble til én lang blokk. Layouten
deler nå på blank linje.

### Status

Null TBD, null axe-brudd på tjue sider, 21 tester grønne, lenkesjekk
grønn. **Hver tekst på nettstedet er nå komplett.**

Det som gjenstår før lansering er ikke tekst: GTM-triggerne i containeren,
Apollo/Clarity i personvernerklæringen, og 301-en for
`/sosiale-medier-byra` på cutover.

## A63 — Lenkeverdien lå ikke der kartet lette. Målt 27.09.2026

Pål spurte hvordan vi kunne redde lenkeverdien til `/tjenester/produktfoto`,
siden han hadde slettet siden. Svaret på spørsmålet er «det er nesten
ingenting å redde», men målingen som viste det avdekket et reelt hull et
helt annet sted.

### Produktfoto hadde aldri lenkeverdi

Ahrefs, alle backlinks mot `reflektor.no` der mål-URL inneholder «foto»:

| Mål | Ref.domener | Dofollow | Merknad |
|---|---|---|---|
| `/tjenester/produktfoto` | 1 | **0** | nofollow, DR 22, trafikk 1, sist sett 15.03.2025 |
| `/tjenester/bedriftsfoto` | 3 | 1 | eneste dofollow er vårt eget Squarespace-preview |
| `/tjenester/fotograf` | 2 | 3 | alle tre fra vårt eget preview |
| `/tjenester/matfotograf` | 2 | 0 | begge nofollow |
| `/tjenester/boligfoto` | 1 | 0 | nofollow |

Kontrollert med en uavhengig spørring: samme URL som eksakt mål, hele
historikken, ikke filtrert på «foto». Samme svar — én lenke, nofollow.

**To tall ble forvekslet.** Notatet i `next.config.ts` begrunnet
produktfoto-redirecten med «1 935 visninger, posisjon 15,8 og 22 rangerende
søkeord». Det er visninger i Search Console — søkesynlighet. Lenkeverdi er
backlinks. Produktfoto har én, den er nofollow, den kommer fra et
prissammenligningsnettsted med DR 22 og trafikk 1, og den ble sist sett for
over seks måneder siden.

**Og selve visningstallet var feil.** Pål ba meg dobbeltsjekke før jeg rørte
`AGENTS.md`. GSC er koblet til Ahrefs-prosjekt 10162201 (A16), så tallet kan
hentes direkte. Tolv måneder til 18.08.2026:

| | Notatet sa | GSC sier |
|---|---|---|
| Visninger | 1 935 | **12 693** |
| Søkeord | 22 | **37** |
| Posisjon | 15,8 | 17,2 |
| Klikk | — | **23** |

Notatet underdrev med 6,5 ganger. Antagelig et kortere vindu enn det ble
oppgitt som. Det endrer ikke konklusjonen — lenkeverdien er fortsatt null, og
tjenesten er fortsatt avviklet — men det er et tredje tilfelle av samme feil:
et tall skrevet ned én gang og aldri sjekket.

Merk hva de 23 klikkene betyr. 12 693 visninger og 23 klikk på et år er
posisjon 17 på ord vi ikke selger. Synligheten er ekte og verdiløs. At
Google mister rangeringen på «produktfoto» når adressen peker til
`/innholdsproduksjon` er riktig utfall, ikke et tap.

Verdt å merke: hver eneste dofollow-lenke i foto-klyngen kommer fra
`bassoon-blenny-3rs9.squarespace.com` — Reflektors eget Squarespace-preview.
Det er DR 95 i Ahrefs og ser derfor stort ut i en rapport, men det er oss
som lenker til oss. Ekstern lenkeverdi i hele foto-klyngen er i praksis
null.

### Jeg trodde jeg fant et hull. Det var et annet selskap

Da jeg spurte «hvilken URL som helst med minst én dofollow-lenke», kom
`/butikk-hovedside/` fram med 11 refererende domener og 14 dofollow-lenker,
høyeste kilde DR 74 — mer dofollow enn noen annen underside. Den stod ikke i
kartet. Jeg la den inn, sammen med `.php`-restene og `/index.php/513806`, og
meldte det til Pål som dagens viktigste funn.

**Pål stoppet det:** «gamle lenker til domenet før vi kjøpte det er
irrelevant. det er tydeligvis et helt annet selskap i en helt annen
bransje.»

Han har rett, og dataene viser at det er verre enn det: **det er ikke engang
samme domene.** Ankerteksten på lenkene sier «www.reflector.no»,
«reflector.no» og «Reflector Produksjoner» — reflector med C.

| Kilde | Ankertekst | Datoer |
|---|---|---|
| `hardanger-folkeblad.no` | Reflector Produksjoner | 2017 → død 2018 |
| `webby.no/norskesteder/?/280/Jondal/` | Reflector Produksjoner | 2016 → død 2019 |
| `uskedalen.no` | «å klikka her:.» | 2015 → død 2019 |
| `mic.no`, `listento.no` (musikkbransjen) | www.reflector.no | 2013 → død 2019 |
| `diskusjon.no` | `http://www.reflector...lydtenester.php` | 2018 → død 2019 |

Hardanger Folkeblad, Uskedalen, Jondal. Filnavnet `Video-og-lydtenester` er
nynorsk. Det er et lyd- og videoselskap i Hardanger, ikke et byrå i Oslo.
Ahrefs fører lenkene under `reflektor.no` fordi indeksen blander reflector.no
og reflektor.no — hver enkelt lenke *handler om* reflector.no.

`/flaminko/` er lenket fra flaminko.no selv (2019, død samme år).
`/prosjekter/nettside-sydspissen-hotell/` og PNG-fila kommer fra
logospng.com, en logoskraper, 2020–2021 — en WordPress-side med
`/prosjekter/`, altså nok et selskap som het noe med Reflektor.

**Alle ni er fjernet igjen.** Ingen lenker til dem, så det er ingenting å
bevare. Advarselen står i `next.config.ts` med ankertekst og datoer, slik at
ingen legger dem inn på nytt neste gang rapporten ser stor ut.

**Lærdommen er om meg, ikke om Ahrefs.** Jeg behandlet `url_to` som bevis på
at adressen var vår. Ankerteksten sto i mitt eget spørringsresultat hele
tiden — «Reflector Produksjoner», i klartekst — og jeg leste tallet i stedet
for teksten ved siden av. Et stort tall på en URL man ikke kjenner igjen er
en grunn til å sjekke, ikke til å handle.

### Tretten adresser manglet likevel

Etter at reflector.no-klyngen er trukket ut, står det igjen tretten av
Reflektors egne adresser som hadde lenker eller visninger og ikke stod i
kartet. Alle er døde på dagens side, alle er lagt inn og verifisert:

| Kilder | Mål |
|---|---|
| `/fotograf`, `/bedriftsfoto`, `/bilderavansatte`, `/matfoto` | `/innholdsproduksjon` |
| `/matogdrikke/orkla`, `/matogdrikke/wolt`, `/sport`, `/eiendomsfotograf` | `/vart-arbeid` |
| `/palbarlein`, `/magne-finseth-da-fonseca`, `/viktor-noren` | `/om-oss` |
| `/videoproduksjon` | `/videoproduksjon-i-oslo` |
| `/tjenester-1` | `/` |

De to siste personsidene 301-er til `/om-oss` på Squarespace i dag, men stod
ikke i kartet — de ville blitt 404 ved cutover.

### Squarespace hadde et bedre kart enn vårt

Dette er det viktigste funnet. Vårt kart sendte hele det døde
`/tjenester/`-treet til forsiden, med kommentaren «vurder å peke dem mer
presist når snapshotene viser hva sidene handlet om». Snapshotene var aldri
riktig kilde — dagens side svarer selv. Hentet 27.09.2026, uten å følge
videre:

| Kilde | Squarespace i dag | Vårt kart før |
|---|---|---|
| `/tjenester/produktfoto` | `/innholdsproduksjon` | `/` |
| `/tjenester/fotograf`, `/videograf`, `/videoproduksjon`, `/matfotograf`, `/bedriftsfoto`, `/bilderavansatte`, `/foto-og-video` | `/innholdsproduksjon` | `/` |
| `/tjenester/markedsforing`, `/konverteringsoptimalisering`, `/boligfoto`, `/eiendomsfotograf` | `/vart-arbeid` | `/` |
| `/tjenester/seo`, `/betalt-sok`, `/performance-marketing` | `/` | `/` |

**Google har allerede konsolidert disse adressene** inn i
`/innholdsproduksjon` og `/vart-arbeid`. Å sende dem til forsiden ved
cutover ville kastet den konsolideringen og bedt Google lære alt på nytt —
mot en mindre relevant side. Kartet speiler nå dagens side, samme prinsipp
som bloggmålene.

Produktfoto er altså ikke lenger et unntak som må forklares: den følger
foto-klyngen til `/innholdsproduksjon`, akkurat som Squarespace gjør. Ingen
side lover en produktfoto-tjeneste som ikke finnes.

**Ett bevisst avvik.** `/tjenester/some-annonsering` 301-es til
`/vart-arbeid` på Squarespace. Det ser ut som en sekkedestinasjon, ikke en
vurdering — adressen handler om SoMe-annonsering, og `/sosiale-medier-byra`
svarer presis på det. Regel 1 verner live adresser, ikke døde, så her veier
relevans tyngre enn å speile. Avviket er kommentert i `next.config.ts`.

### Redirect-kartet hadde ingen tester

Dette er prosjektets mest gjentatte feil — AGENTS.md advarer mot den to
ganger, og fila selv dokumenterer tre tilfeller med samme form: A40
(redirect til en side som ikke fantes), A54 (ni bloggslugs uten innhold) og
`/gratis-strategimote` (oppført som live lenge etter at den var slettet).
«Et kart som var riktig da det ble tegnet.»

Feilen er usynlig i bygget. Next godtar en 301 til hva som helst, og
hverken lint, `content:check` eller lenkesjekken så på dette kartet. Det
første som merker den er betalt trafikk som lander på en 404.

`tests/redirects.test.ts` dekker nå fire ting uten å måtte være på nett:

1. ingen live annonseside er kilde i en redirect (regel 1)
2. hvert mål finnes faktisk som rute
3. ingen kjeder og ingen selvreferanser — en kjede taper lenkeverdi
4. ingen kilde er oppført to ganger — Next bruker den første, så den andre
   er død kode som ser virksom ut

**Testene er mutasjonstestet.** Hver av de fire ble verifisert ved å innføre
nettopp feilen den skal fange — `/reklamefilm` som kilde, mål `/produktfoto`,
kjeden `/hjem → /kontakt → /kontaktoss`, `/hjem` oppført to ganger — og alle
fire feilet som de skulle. En vaktpost som ikke kan feile er verdiløs.

Det testene **ikke** kan avgjøre er om en kilde faktisk er død på dagens
side. Det krever et oppslag mot reflektor.no og må gjøres for hånd. Det står
i kommentaren øverst i testfila.

### Redirectene var 308. Nå er de 301

Oppdaget under verifiseringen, fordi en gammel serverprosess holdt porten og
svarte fra forrige bygg: `permanent: true` i Next gir **308 Permanent
Redirect**, ikke 301. Det gjaldt alle 51 oppføringene.

Google og Bing behandler 308 som likeverdig med 301 — lenkeverdien flyttes
likt — så det var ikke en feil. Men dagens Squarespace svarer 301, og både
denne fila og `AGENTS.md` sier «301» gjennomgående, blant annet i
cutover-regelen for `/sosiale-medier-byra`. Et byrå som kjører en
redirect-sjekk skal ikke måtte lure på hvorfor tallet er et annet enn det som
står skrevet.

**Pål bestemte å endre det.** Alle 31 oppføringer bruker nå `statusCode: 301`
i stedet for `permanent: true`. De to kan ikke kombineres — Next godtar én av
dem per oppføring.

Verifisert mot produksjonsbygget: alle 51 svarer **301** med riktig
`location`, og alle lander til slutt på 200.

En femte vaktpost i `tests/redirects.test.ts` holder kartet på 301, slik at en
ny oppføring skrevet på Next sin vanlige måte ikke sniker inn en 308 igjen.
Også den er mutasjonstestet: en innsneket `permanent: true` får testen til å
feile.

### Verifisert

51 redirects i kartet. De tretten nye hentet mot produksjonsbygget og fulgt
til endelig mål — alle lander på ventet side med 200. De ni
reflector.no-adressene svarer nå 404, som de skal. De fire live
annonsesidene svarer fortsatt 200 direkte, uten omdirigering. 25 tester
grønne, lint grønn, `content:check` grønn, lenkesjekk grønn.

En siste ting verifiseringen avdekket om metode: den første kjøringen meldte
«OK» på adresser jeg nettopp hadde fjernet, fordi en gammel serverprosess
fortsatt svarte. Testen var riktig skrevet og svaret var feil. Når noe som
skal være borte melder seg friskt, er det prosessen man tester, ikke koden.

## A64 — GTM-containeren lest som den faktisk er. 27.09.2026

Pål ba meg gå inn i Chrome og gjøre GTM-endringene selv. **Det kan jeg ikke**,
og det er verifisert på nytt, ikke husket: det finnes ingen GTM-verktøy i
sesjonen, `tagmanager.google.com` sender meg til Googles innlogging, og
`tagmanager.googleapis.com` svarer 401. Sesjonen kjører i en container i skyen
uten Google-profil — Påls Chrome står på Påls maskin. Ingen annen Claude-sesjon
er tilgjengelig å sende jobben til.

**Det jeg kunne, var å lese.** Den *publiserte* containeren ligger åpent på
`googletagmanager.com/gtm.js?id=GTM-N4KGSS93`, og dagens side kan hentes som
rå HTML. Begge uten å sende én måling. Det ga fasit i stedet for antagelser, og
fasiten motsa mine egne notater på to punkter.

### Containeren har 13 tagger, ikke fem å sikre

| Hva | Identifikator | Utløses av |
|---|---|---|
| Google-tag (GA4) | `G-1QJ6BRWGJ8` | `gtm.init` |
| GA4 `generate_lead` | `G-1QJ6BRWGJ8` | sti `/takk` + referrer |
| Ads-konvertering | `11026823614` | sti `/takk` + referrer |
| Conversion Linker | — | hver sidevisning |
| Samtykkemal `default` | alt `denied` | `gtm.init_consent` |
| Samtykkemal `update` | alt `granted` | klikk på tekst som inneholder `ACCEPT` |
| **Apollo** | appId `67f7a7f9f3af070015ab21b2` | **hver sidevisning, uten samtykke** |
| **Clarity** | prosjekt `rkgf0frfdt` | **hver sidevisning, uten samtykke** |
| **HubSpot** | portal `148641188` (EU) | **hver sidevisning, uten samtykke** |

### To feil i mine egne notater

**Microsoft Ads finnes ikke.** `docs/gtm-samtykke.md` og kommentaren i
`src/lib/samtykke.ts` listet den blant «de fem». Ingen UET-tagg i containeren,
ingen `uetq`, ingen `bat.bing.com` i sidens kildekode. Det som førte meg feil
er at samtykkemalen har `platform_microsoft: true` — den er *konfigurert* til
å sende Microsoft-signaler, men ingen tagg tar imot dem. Et flagg ble lest som
et verktøy.

**Meta-pikselen lastes ikke av GTM.** `fbq('init', '572759520853896')` står
direkte i Squarespace-kildekoden, sammen med Elfsight-widgeten. Konsekvensen
er ikke akademisk: **de forsvinner av seg selv ved cutover**, fordi den nye
siden ikke har dem. Det er en beslutning for Pål, ført inn som punkt 5 i
`docs/cutover.md`.

Jobben i GTM er altså **tre** tagger, ikke fem.

### En alarm jeg slo av igjen før jeg sendte den

Samtykkemalens `update`-tagg fyrer på klikk på tekst som inneholder `ACCEPT` —
store bokstaver, `_cn` uten `ignore_case`. Den nye sidens knapp heter «Godta
alle». Første konklusjon: samtykket flipper aldri til `granted` etter cutover,
GA4 og Ads kjører permanent i nektet modus, KPI-en degraderes.

Så sjekket jeg koden i stedet for å sende meldingen. `meldFra()` i
`Samtykke.tsx` kaller `gtag("consent","update", …)` selv, og
`standardSkript()` setter `default` i `<head>` før containeren laster. Googles
tagger får riktig tilstand fra vår egen kode, helt uten GTM-utløseren.
**Alarmen var feil.** Utløseren er arvegods — ufarlig, men virkningsløs på den
nye siden.

Verdt å merke at dette er tredje gang i dag at et stort funn krympet til
ingenting når jeg sjekket det ett hakk videre. Mønsteret er det samme hver
gang: jeg leser én kilde, ser noe alarmerende, og konklusjonen er ferdig før
den andre kilden er åpnet.

### Det som faktisk bærer KPI-en er stien og referreren

Både GA4-hendelsen og Ads-konverteringen fyrer på **én** betingelse:

```
sti === "/takk"  OG  referrer ~ /^https?:\/\/(www\.)?reflektor\.no\/(?!takk)/i
```

`takk_page_view`, som `TakkHendelse.tsx` sender, har **ingen utløser som
lytter på den** i containeren. Hendelsen er et ufarlig, men virkningsløst
krokpunkt.

> **RETTET 27.09.2026, se A66.** Her sto det videre at «AGENTS.md sier at leads
> måles i GA4 med `takk_page_view` — det er ikke slik containeren er satt opp».
> Det var halvveis feil, og feilen var min. Nøkkelhendelsen `takk_page_view`
> finnes og er ekte: den lages **inne i GA4**, som en opprettet hendelse
> avledet av `page_view`. AGENTS.md hadde altså rett. Det jeg fant var bare at
> den ikke kommer fra vår dataLayer-push — og det er en viktig forskjell, men
> ikke den jeg skrev.

Det betyr at den farligste enkeltendringen noen kan gjøre er en 301 fra
`/takk`: stien flyttes, konverteringen stilner, og ingenting annet på siden
ser galt ut.

**Verifisert i nettleser at referreren overlever skjemaet.** Sporing blokkert,
ingen e-post sendt (ingen `RESEND_API_KEY` lokalt):

```
GET   /kontaktoss   referer: (ingen)
POST  /api/skjema   referer: /kontaktoss
GET   /takk         referer: /kontaktoss     ← overlever 303-en
```

Oversatt til produksjon blir referreren `https://www.reflektor.no/kontaktoss`,
som treffer containerens regex. **Målekjeden overlever cutover.**

To nye vaktposter i `tests/redirects.test.ts` låser det: `/takk` kan aldri bli
kilde i en redirect, og `/takk` må finnes som rute. Begge mutasjonstestet.

### Levert

- `docs/gtm-samtykke.md` skrevet om: tre tagger med verifiserte
  identifikatorer, den eksakte utløseren som skal erstattes, og hvorfor
  rekkefølgen mot personvernerklæringen er bindende
- `docs/personvern-punkt-8-forslag.md` — et **forslag**, ikke en endring.
  `personvern.ts` sier i egen header at erklæringen ikke skal omskrives av
  Claude Code. Tre ting mangler som en jurist må fylle: overføringsgrunnlag
  utenfor EØS, lagringstid per tjeneste, databehandleravtaler
- `docs/cutover.md` punkt 5 og 6, og en merknad om at Ads er slått av
- Kommentaren i `src/lib/samtykke.ts` rettet
- 28 tester grønne

## A65 — DNS lest utenfra. To cutover-risikoer lukket. 27.09.2026

Pål ba om en prompt til en chat med nettlesertilgang. Før jeg skrev den,
sjekket jeg hva jeg kunne hente selv — og det var mer enn ventet. `dig` finnes
ikke i containeren, men DNS over HTTPS gjør samme jobb.

| Post | Verdi | TTL |
|---|---|---|
| NS | `ns01.one.com`, `ns02.one.com` | 14400 |
| A | `198.185.159.144/145`, `198.49.23.144/145` (Squarespace) | 3600 |
| www | CNAME `ext-cust.squarespace.com` | 3600 |
| MX | Google Workspace, fem poster | 3600 |
| TXT | `v=spf1 include:_spf.google.com ~all` | 3600 |
| TXT | `google-site-verification=2pMbMPOPnQDsDXTxmJd4lvf4zihwQf_JC757eWmiyMs` | 3600 |

### 1. E-posten er trygg, og vi vet nå hvorfor

DNS ligger hos **one.com**, ikke hos Squarespace. Det betyr at byttet er en
endring av A- og CNAME-poster i one.com-panelet — Squarespace røres ikke, og
**nameserverne skal ikke flyttes**.

Det er avgjørende. Google Workspace hentes via MX-postene i samme sone. Flyttes
nameserverne, følger ikke MX-postene med med mindre de settes opp på nytt hos
den nye leverandøren — og da forsvinner e-posten. Det er den klassiske
katastrofen ved plattformbytte. Med A- og CNAME-endring alene er e-post
uberørt.

### 2. Search Console-verifiseringen overlever

`google-site-verification` ligger som en **TXT-post i DNS**, ikke som en fil
Squarespace serverer. Den blir stående gjennom byttet. Hadde den vært
filbasert, ville verifiseringen falt i det Squarespace ble slått av, og
historikken i Search Console blitt utilgjengelig midt i den perioden vi trenger
den mest.

Det kan finnes flere verifiseringsmetoder i tillegg — det står i oppdraget som
punkt 17.

### 3. TTL er 3600, og det er en handling i forkant

En time betyr at byttet tar opptil en time å slå gjennom, og like lang tid å
rulle tilbake. Senkes TTL til 300 minst et døgn før, tar det minutter begge
veier. Det er den eneste DNS-endringen som er trygg å gjøre i forkant, og den
gjøres av Pål hos one.com.

### 4. `reflektor.no` er ikke lagt til i Vercel ennå

Prosjektet `reflektor-ny` har bare `reflektor-ny.vercel.app`. Å legge til
domenet endrer ikke DNS og påvirker ikke dagens side — Vercel viser bare hvilke
poster som skal settes, og forbereder sertifikat. Jeg har tilgang, men det er en
endring på produksjonsoppsettet, så jeg gjør det ikke uten beskjed.

### Oppdraget

`docs/oppdrag-nettleser.md` er en ferdig prompt til en sesjon med Chrome. Den
er delt i en ren leseefase og én enkelt endring som venter på Pål, og den
starter med det som allerede er målt — slik at den andre sesjonen ikke utleder
ting på nytt eller motsier det.

Det viktigste enkeltspørsmålet i oppdraget er punkt 20, Squarespace sin egen
omdirigeringstabell. Jeg har rekonstruert den ved å prøve én adresse av gangen
utenfra, og kan umulig ha funnet alle. Det nest viktigste er punkt 7: hva som
faktisk har registrert de 107+ konverteringene i GA4, siden containeren aldri
sender `takk_page_view`.

## A66 — Fase 1-rapporten. Fire funn som endret kode. 27.09.2026

Pål kjørte oppdraget i `docs/oppdrag-nettleser.md` i en sesjon med Chrome.
Rapporten er grundig, den er ordrett der jeg ba om det, og den sier eksplisitt
«har ikke tilgang» der noe manglet — som er nøyaktig det jeg ba om og det som
gjør den brukbar. Den løste én gåte, avdekket én pågående feil, og ga meg tre
adresser jeg umulig kunne funnet selv.

### 1. `takk_page_view`-gåten er løst — og jeg tok feil i A64

Nøkkelhendelsen lages **inne i GA4**, som en opprettet hendelse avledet av
`page_view`:

```
event_name     contains  page_view
page_location  contains  takk
page_referrer  contains  reflektor.no
```

I A64 skrev jeg at AGENTS.md tok feil om at leads måles på `takk_page_view`.
**AGENTS.md hadde rett.** Det jeg faktisk hadde funnet var at hendelsen ikke
kommer fra vår dataLayer-push — en viktig forskjell, men ikke den jeg skrev.
A64 er rettet.

**Konsekvens for cutover:** betingelsen holder på den nye siden. `/takk`
inneholder «takk», og referreren er reflektor.no etter byttet — allerede
verifisert gjennom skjemaets POST → 303.

**Konsekvens for koden:** pushen i `TakkHendelse.tsx` ser ut som en mangel, og
fristelsen til å koble den opp er stor. Gjør man det, sender GTM en
`takk_page_view` inn i GA4 samtidig som GA4 lager sin egen med samme navn fra
samme sidevisning — dobbelttelling av den ene KPI-en. Det er nøyaktig feilen
containerens versjon 36 ryddet opp i for Meta-taggen. Advarselen står nå i
komponenten.

### 2. GTM fyrer på forhåndsvisningene. Rettet

Containerens egen dekningsrapport viser at den er aktiv på
`reflektor-ny.vercel.app` — inkludert `/takk` — og på tre Vercel-previews.
Sidevisningene derfra går inn i den ekte GA4-eiendommen.

Konverteringene er ikke rammet: både Ads-taggen og GA4-nøkkelhendelsen krever
referrer fra reflektor.no, og en vercel.app-adresse gir ikke det. Men
`page_view`, `session_start` og `first_visit` telles, og de er grunnlaget for
alt annet i rapportene.

`tillatSporing()` i `miljo.ts` styrer nå om containeren lastes, og følger
indekseringsbryteren. Én bryter snus ved cutover, ikke to.
`NEXT_PUBLIC_TILLAT_SPORING=true` finnes for bevisst testing.

**Verifisert i nettleser, begge veier.** Uten bryter: banner vist, «Godta
alle» klikket, `data-samtykke=svart`, dataLayer har samtykkekallene — og
**null** kall til googletagmanager eller google-analytics. Med bryter: to kall
til `gtm.js`, og `gtm.js` i dataLayer. En sperre som ikke kan åpnes igjen er
en feil, ikke en sikring.

### 3. Tre adresser jeg ikke kunne ha funnet

Fra Squarespace sin egen omdirigeringstabell:

| Kilde | Mål |
|---|---|
| `/some-byra` | `/sosiale-medier-byra` |
| `/video-og-innhold` | `/innholdsproduksjon` |
| `/innholdsproduksjon-arkiv-2026` | `/innholdsproduksjon` |

Man finner ikke en adresse man ikke vet finnes. Det var hele begrunnelsen for
at tabellen sto som viktigste punkt i oppdraget, og den holdt.

**Og en jokerregel:** `/tjenester/[name] -> /vart-arbeid`. Den forklarer noe
jeg hadde misforstått. De fire adressene jeg målte til `/vart-arbeid`
(markedsforing, konverteringsoptimalisering, boligfoto, eiendomsfotograf) har
ingen egen linje i tabellen — de traff jokeren. Det var aldri fire
vurderinger, men én sekkeregel.

Det bekrefter samtidig avviket for `/tjenester/some-annonsering`: den traff
jokeren også, så å sende den til `/sosiale-medier-byra` overstyrer ingen
beslutning. Jokeren er lagt inn, etter de spesifikke oppføringene.

**Bloggjokeren er IKKE kopiert.** Squarespace har også `/blogg/[name] ->
/blogg`. Den er trygg der, fordi Squarespace matcher sine egne sider først. I
Next kjører redirects **før** ruting, så `/blogg/:slug → /blogg` ville slått ut
hver eneste ekte artikkel — hele bloggen, som er det ene vi beholder for
lenkeverdiens skyld. Verifisert at artiklene fortsatt svarer 200 etter at
`/tjenester/`-jokeren ble lagt inn.

### 4. Testene kunne ikke importere halve kodebasen

`miljo.ts` importerer `@/content/site`. Ren node forstår ikke path-aliaset, så
`node --test` kunne bare importere moduler som tilfeldigvis ikke brukte det.
Det utelukket blant annet indekseringssperren og sporingsbryteren — de to
stedene der en feil er mest usynlig.

`tests/alias-hooks.mjs` løser nå `@/…` til `src/…` og prøver filendelsene i
samme rekkefølge som TypeScript. Fire nye tester dekker bryterne, inkludert at
en slurvete verdi i Vercel-panelet (`1`, `TRUE`, `ja`) **feiler lukket**.
Mutasjonstestet.

### Verdt å merke fra rapporten, uten kodeendring

- **En andre Ads-ID i Google-taggen: `AW-16843609035`.** Ikke identifisert.
  Kontoen vi kjenner er `AW-11026823614`. Bør avklares før cutover.
- **«Takkeside - Gads Conversion» har status «Needs attention»** og forbedrede
  konverteringer melder «Setup issues detected». Det gjelder dagens side og er
  uavhengig av byttet, men det er KPI-en.
- **GA4 lagrer hendelsesdata i 2 måneder.** Det er standardverdien; 14 måneder
  er gratis og maksimalt. Kort oppbevaring begrenser utforskningsrapportene,
  ikke nøkkelhendelsene.
- **Pål har ikke tilgang til domeneeiendommen** `sc-domain:reflektor.no` i
  Search Console, bare URL-prefiks-eiendommen. Verifiseringen hviler på både en
  HTML-fil og DNS. **HTML-fila dør ved cutover**, DNS holder — men tilgangen
  til domeneeiendommen bør ordnes før byttet, ikke etter.
- **Meta-taggen i GTM er pausert** siden versjon 36. Pikselen lastes fra
  Squarespace → Marketing, ikke fra kodeinjeksjon. Forsvinner ved cutover, som
  beskrevet i `docs/cutover.md` punkt 5.
- **Squarespace-headeren kaller `gtag('config', 'GTM-N4KGSS93')`** — en config
  med en GTM-ID. Det er meningsløst og skal ikke kopieres. Det er det ikke.
- **Tallet «107+»** som AGENTS.md oppgir, finnes ikke igjen i noen rapport.
  GA4 har 558 `takk_page_view` totalt siden 2022, Ads 76 siste tolv måneder.
  Ikke en feil som haster, men tallet i AGENTS.md er ikke sporbart.

## A67 — Redaksjonell luking av AI-setninger. 27.09.2026

Pål pekte på én setning: «De fleste som spør om innholdsproduksjon trenger et
prosjekt først, og oppdager etter hvert at de også trenger kalenderen.» Og ba
meg finne de tilsvarende.

### Hva som faktisk avslører maskinen

Ikke ordvalget. Det er **konstruksjonene**, og at de gjentar seg:

| Mønster | Eksempel som ble fjernet |
|---|---|
| Avsløringen | «… og oppdager etter hvert at de også trenger kalenderen» |
| Ikke X, men Y | «Forskjellen er ikke hvordan filmen ser ut, men hvor den vises» |
| Tankestrek som fasit | «… blir lett støy fremfor innsikt — det som betyr noe …» |
| Aforismen | «Men én film er ett øyeblikk» |
| Setningsfragment | «Ikke skuespillere, og helst ikke bare ledelsen.» |
| Metonymi uten dekning | «… trenger kalenderen» |
| Byråvås | «on-brand videoer og bilder på løpende bånd» |

Verst var **tankestreken i faq.ts: tolv ganger i én fil**, alltid i samme
rolle — en setning, tankestrek, og så den egentlige innsikten. Én gang er et
virkemiddel. Tolv ganger er en tikk, og det er tikken leseren kjenner igjen
uten å kunne sette ord på den.

### Hva som ble gjort

23 setninger skrevet om: 12 i `faq.ts`, 5 i `tjenester.ts`, 2 i `omoss.ts`,
1 i `artikler.ts` (en FAQ jeg selv la til, ikke migrert tekst), og
avgrensningen jeg skrev tidligere samme dag — den var allerede smittet.

### Hva som IKKE ble rørt

Skannet ga 60 % falske positive, og det er poenget med å lese dem i stedet
for å rette dem:

- **Kundesitatene** i `anmeldelser.ts`. «Rett og slett kjempefine folk» er
  hvordan Marion faktisk skrev. Å redigere et sitat for å unngå en klisjé er
  å forfalske det.
- **De migrerte bloggtekstene.** «Ikke bare X, men også Y» står seks ganger i
  artikler.ts. Alle seks er Reflektors egen tekst fra Squarespace. Regel 3 i
  AGENTS.md verner bloggen, og disse er ikke mine å pusse på.
- **Oppramsinger.** «Idé, manus, opptak, klipp, lyd og fargekorrigering» er en
  liste over hva som leveres, ikke en retorisk triade.
- **`jobb:`-feltene i front.ts.** Notater til meg selv, ikke tekst noen leser.

### Verdt å merke

Fire av de omskrevne setningene skrev jeg samme dag, i svaret på forrige
tilbakemelding. Mønsteret kommer tilbake med hver runde med ny copy, så dette
er ikke en jobb som blir ferdig én gang. Skannemønstrene står i tabellen over
for den som skal gjøre runden igjen.

## A68 — SEO- og AEO-gjennomgang av hele nettstedet. 27.09.2026

Pål ba om «en grundig SEO og AEO-analyse av hele hjemmesiden», deretter
retting. Alle 23 sider i sitemapet ble crawlet med Playwright og målt på
tittel, beskrivelse, canonical, robots, overskriftshierarki, JSON-LD-typer,
ordantall, interne lenker og alt-tekst. Tallene fra Search Console er hentet
gjennom Ahrefs-koblingen, ikke gjettet.

### Det som var i orden

Verdt å skrive ned, fordi det er det man ellers river i vanvare: hver side har
nøyaktig én H1, ingen hopp i overskriftsnivå, egen canonical, `noindex` overalt
(sperren står), ingen dupliserte titler eller beskrivelser, og JSON-LD for
organisasjon, tjeneste, pris, brødsmuler og FAQ. De 44 bildene uten alt-tekst
per side er logoraden, som er dekorativ og axe-ren.

### Ni funn, og hva som ble gjort

**1. Ni titler over 60 tegn, ti beskrivelser over 158.**
Malen legger på « | Reflektor» (12 tegn), så en tittel på 55 blir 67 i søk.
Verstingen var `/videoproduksjon-i-oslo` på 73. Alle kortet ned. Artiklene
fikk et nytt felt, `metaTittel`, fordi `tittel` også er H1 og de to har ulike
krav — en H1 kan være lang og forklarende, et `<title>` kuttes.

**2. `/sosiale-medier-byra` lå i sitemapet med prioritet 0,9.**
Ruten er `status: "live"` i site.ts, og sitemapet leste det som «indekser
denne». Men siden er en `UnderArbeid`-plassholder som skal 301-es til `/` ved
cutover. `status` sier at ADRESSEN lever — den er Final URL i Google Ads — ikke
at det finnes innhold der. Tatt ut, med en `utelatt`-liste og begrunnelsen i
koden. Siden arvet dessuten forsidens fallback-beskrivelse på 190 tegn; den har
nå sin egen.

**3. Sju artikler slutter med «Les mer om abonnementet.» — uten lenke.**
Det største enkeltfunnet. Flere har også «Se våre tjenester for en oversikt
over alt vi tilbyr» og «Se hvordan du setter i gang og utfører en
innholdsproduksjon». Lenkene lå i Squarespace-utgaven og forsvant i
migreringen, fordi migreringen tok brødteksten og ikke markeringen. Teksten
inviterte til et klikk som ikke fantes, på de eneste sidene med organisk
trafikk.

Rettet med et nytt felt, `Innlenke`, på avsnittsblokkene: `frase` må stå
ordrett i avsnittet, og `delOppAvsnitt` kaster hvis den ikke gjør det eller
står to ganger. Ingen formulering er endret — det er lagt en `<a>` rundt ord
som allerede var der. Elleve lenker i ni artikler, hver med ankertekst hentet
fra setningen den står i.

**4. `lesVidere`-broen fantes allerede.** Notert fordi den første lesningen
av crawl-tallene sa noe annet: artiklene så ut til å ha 1–3 interne lenker,
og konklusjonen «artiklene er blindveier» var feil. Boksen «Fra Reflektor»
nederst i hver artikkel har pekt på riktig tjenesteside hele tiden, med
ankertekst som sier hva siden er. Det som manglet var lenker INNE i teksten,
ikke lenker i det hele tatt. Måletallet var unike href-er i `main`, og en
lenke til en side som også står i bunnteksten teller ikke som ny.

**5. «innholdsproduksjon»: 14 444 visninger, plass 11–12, 16 klikk.**
Og det er Reflektors egen bloggartikkel om ordet som ligger foran
tjenestesiden. Artikkelen er på 2 136 ord, tjenestesiden var på 375.

To grep, begge uten ny copy. Artikkelen fikk en eksakt-ankertekstlenke til
tjenestesiden midt i brødteksten. Tjenestesiden fikk en seksjon — «Hva avgjør
prisen på et prosjekt?» — bygget på `tilbud.prisdrivere`, som er Påls egen
ordlyd fra 22.09.2026 og fram til nå var brukt **ingen steder**. Siden svarer
nå på det en kjøper spør om, og ikke bare på hva ordet betyr. 375 → 446 ord.

Resten krever copy fra Pål. Det er sagt til ham.

**6. Fire FAQ-spørsmål var merket opp som FAQPage på to URL-er.**
De fire i `forsidensTillegg` hentes fra /faq og vises på forsiden — riktig
redaksjonelt, og begrunnet der. Men Google forbyr eksplisitt samme spørsmål og
svar som FAQPage på flere sider, og da er det tilfeldig hvilken URL som
siteres. Forsiden merker nå opp sine seks egne; de fire eies av /faq.
Mennesket ser fortsatt alle ti.

Avviket mellom det som vises og det som merkes opp er altså bevisst denne
gangen — i motsetning til feilen som ble rettet 21.09.2026, der ingen hadde
bestemt det. `tests/faq.test.ts` vokter alle seksten FAQPage-sidene mot nye
duplikater, og er mutasjonstestet.

**7. Ingen VideoObject, selv om siden selger video.**
Sto som «implementeres først når thumbnail-filer finnes (A11)». De finnes nå.
Tre filmer merket opp: reklamefilmen på /reklamefilm og klippet i hvert
kundecase. Ikke de tjue klippene i rutenettene og reel-veggen — de er
kuraterte utsnitt uten egen tittel, og tjue VideoObject-er med alt-tekst som
navn er støy Google behandler som støy.

Ingen `uploadDate`, som Google krever for rich results. Vi vet ikke når
filmene ble publisert, sidene er ikke live, og produksjonsdato er ikke
publiseringsdato. Samme regel som `KundecaseSchema` og `ArtikkelSchema`
følger. `duration` er målt med ffmpeg på filene, ikke gjettet.

**8. Oversiktssidene sa ikke at de er oversikter.**
/vart-arbeid og /blogg hadde bare BreadcrumbList. De har nå CollectionPage med
ItemList, med navn på hvert ledd og ikke bare URL — en liste med bare URL-er
tvinger en ny henting per ledd for å finne ut hva de er. På /vart-arbeid er
navnene kundenavnene, fordi spørsmålet en språkmodell får er «hvem lager
innhold for Egon».

**9. /llms.txt lagt til.** Nettstedets kjøpsfakta — 30 000 kr/mnd, fra 40 000
for prosjekt, tre måneders oppsigelse, ingen bindingstid — lå spredt over fem
sider. En språkmodell som siterer Reflektor på pris henter det den finner
først. Fila er generert fra de samme konstantene sidene leser, ikke skrevet,
så den kan ikke gli fra dem. Den følger indekseringssperren og svarer 404 til
den åpnes.

### Sitemapets lastmod

Bare artiklene har den, fordi bare de har en ekte dato. Google bruker lastmod
når den er konsekvent riktig og ignorerer feltet for hele nettstedet når den
ikke er det. Byggetidspunktet er ikke en endringsdato.

### To ting som ikke ble gjort, og hvorfor

**Artikkel-til-artikkel-lenker.** Standard SEO-råd, og feil her: det holder
leseren inne i ordbokstoffet i stedet for å flytte ham mot skjemaet. Eneste
unntak er den ene lenken teksten selv ber om («Se hvordan du setter i gang og
utfører en innholdsproduksjon»), der løftet er en guide og ikke et kjøp.

**De to slettede artiklene som fortsatt rangerer.**
`hva-er-holdningskampanje` (5 345 visninger, plass ~3,5) og
`hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de` (3 430,
plass ~4) er blant nettstedets beste organiske sider, men 301-er til /blogg
allerede på dagens Squarespace-side, og falt til null klikk i juli–august.
Teksten finnes ikke i noe arkiv containeren når: Wayback har én snapshot av
den ene, og web.archive.org er utenfor nettverkspolicyen. Uten teksten er
alternativet å skrive den, og det er utelukket. Lagt til Pål: har han
originalen, legges begge tilbake på sine egne URL-er.

### Verdt å merke seg for neste runde

`tilbud.prisdrivere` var definert og ubrukt. Det samme var
`tilbud.ekstraProduksjonsdag` (30 000), fordi kommentaren ikke sa om beløpet
kom i tillegg eller erstattet dagen som allerede inngår — og en side som
oppgir feil pris er verre enn en som ikke oppgir noen.

**Avklart samme dag.** Påls ordlyd: «30K er prisen på tjenesten vår,
planlegging, produksjon og publisering. Skal du ha en ekstra produksjonsdag må
du betale 30k til.» Altså i tillegg. Tallet står nå i FAQ-svaret «Kan dere
levere mer enn 8–10 videoer i måneden?», som sa «til samme pris per dag» uten
å oppgi prisen, og var det eneste stedet på nettstedet som berørte spørsmålet.
Det er den eneste endringen som er gjort i en migrert FAQ-tekst.

Lærdommen for neste runde er ikke tallet, men at det lå der: to konstanter med
verifiserte priser, begge ubrukte, begge fordi kommentaren rundt dem var
uklar. Sjekk `tilbud` mot det sidene faktisk viser før neste innholdsrunde.

Seksjonen «Hvem produserer Reflektor for?» står nesten ordrett likt på
/innholdsproduksjon og /videoproduksjon-i-oslo — samme kundeliste, ulikt sitat.
Det er godkjent copy, så det er ikke rørt, men to sider med samme avsnitt er en
svakhet neste redaksjonelle runde bør se på.


## A69 — «Fra arbeidet» på employer branding-siden. 28.09.2026

Pål, om rutenettet på `/employer-branding-video-oslo`: «dårlig oppløsning på
bildet til høyre, duplikat av bilde, og hele teksten handler om employer
branding video. vis videoer av folk i coorporate miljøer.»

Alle tre observasjonene stemte, og de var tre forskjellige feil.

**Duplikatet.** Rute 1 var `fabrikk-vegg.jpg` og rute 3 var `mat1-1600.jpg` —
to utsnitt av samme opptak i samme fabrikk, ved siden av hverandre i samme rad.
Ikke samme fil, så ingen sjekk fanget det, men på skjermen leses det som en
feil i koden.

**Oppløsningen.** Rute 4 var `stallen-1600.jpg`, et liggende bilde beskåret inn
i en stående celle. Etter beskjæringen sto det igjen 711 px effektiv bredde mot
en celle som ber om 691 på dobbel pikseltetthet — akkurat på grensen, og
synlig mykere enn naboene. Bildet står fortsatt på /kontaktoss, der rammen er
liggende og hele bredden brukes.

**Innholdet.** Tre av fire ruter var stillbilder, på en side som selger
employer branding-VIDEO. Og motivene var fabrikk og restaurantkjøkken, ikke
miljøene siden faktisk selger inn mot.

### Hva som ble gjort

Fire klipp, ingen stillbilder: en presentasjon, arbeid ved skjermen, en samtale
og to kolleger i en pause. Tre av dem er hentet fra Dropbox og klippet ned her;
det fjerde (`kontor`) lå allerede i repoet.

Kildene er 4K i 16:9, så hvert klipp er beskåret til 9:16. Utsnittet er valgt
per klipp — 55 %, 40 % og 45 % av bredden, ikke midtstilt — og kontrollert
bilde for bilde gjennom hele lengden, ikke bare på plakaten. To av dem måtte
kortes ned fra seks til rundt fire sekunder fordi kameraet panorerte vekk fra
motivet mot slutten; det så man ikke på førstebildet.

**Det fjerde klippet ble byttet to ganger.** Først lå det et klipp av en
tilhører i en sal der. Da var alle fire menn, alene i bildet, på en side som
skal få folk til å søke jobb. Erstatningen viser to kolleger i en pause.

Ingen kunde er navngitt, verken i alt-tekst eller filnavn. Samme regel som
resten av mediearkivet følger.

### Tre feil til, av samme slag, funnet i samme gjennomgang

**Toppbildene var `-vegg`-filer.** Disse er skalert for cellene i
arbeidsveggen og er 640–1000 px brede. Som 21:9-banner rendres de på inntil
2176 px. `/innholdsproduksjon` strakk en 640 px fil over hele bredden — tre
ganger opp.

- `/employer-branding-video-oslo`: `fabrikk-vegg` (1000 px) →
  `ansatte-produksjon-1600` (1600 px). Samme opptak, liggende, skarp.
- `/eventfotograf-eventvideo`: samme bilde sto BÅDE som toppbilde og som rute
  to i rutenettet. Rettet i rutenettet, ikke i toppen — se under.
- `/innholdsproduksjon`: toppbildet er **fjernet**. Se under.

**Hvorfor eventsidens toppbilde ikke ble byttet.** Første forsøk erstattet det
med et dronebilde: skarpere, men et tomt basseng uten mennesker over en
overskrift om eventfotografi. Skarphet som gjør bildet mindre relevant er ikke
en forbedring. Aktiveringsbildet er et faktisk arrangement, og 1000 px holder i
den rammen på vanlige skjermer. Duplikatet ble fjernet i rutenettet i stedet.

**Hvorfor navet mistet toppbildet sitt.** Den store filen fra samme opptak
finnes, men hele popup-dagen ligger i tre utsnitt, og to av dem sto allerede på
eventsiden. Tre nesten like bilder fordelt på to sider er samme feil som
duplikatet vi nettopp fjernet, bare spredt utover. Arkivet har ikke et stort,
liggende bilde som sier «innholdsproduksjon» og ikke allerede brukes et annet
sted. Ingen banner er bedre enn en uskarp eller en lånt — /reklamefilm og
/videoproduksjon-i-oslo har heller ingen. Feltet er valgfritt og settes tilbake
når det finnes et egnet bilde.

### Lenkesjekken meldte feil to ganger

Åtte «foreldreløse» mediefiler, hvorav seks ikke var det. Heuristikken lette
etter filstammen i egne anførselstegn, men to konvensjoner i koden skriver den
annerledes: `Klipp` tar stien uten filendelse (`"/reels/peppes-reklamefilm"`),
og toppbildene lagrer hele navnet med suffiks (`"ansatte-produksjon-1600"`).
Begge er lagt inn. Listen er nå tom, og det er poenget: en advarsel som stort
sett tar feil, er en advarsel ingen leser.

### Hva som gjenstår

Arkivet er tynt på to områder som siden trenger. Det finnes ingen ekte
kontorvideo utover det ene klippet som allerede lå der — de tre nye er fra et
firmaarrangement, ikke fra en arbeidsdag. Og eventsiden har fortsatt tre
stillbilder mot ett klipp. Begge krever nytt opptak eller et dypere søk i
Videoarkivet enn det denne runden rakk.


## A70 — Kontorvideo fantes likevel. 28.09.2026

A69 endte med at «arkivet har ingen ekte kontorvideo utover det ene klippet
som lå der fra før». Pål, kort etter: «smarketing har kontorvideo med talking
head. samme med eiendomskreditt.»

Begge stemte.

### Hvorfor jeg ikke fant dem

Jeg listet ut hele Videoarkivet — hundre mapper — og plukket ut de jeg kjente
igjen som «corporate» på navnet: Tietoevry, Autopay, 3stepIT, Millum, Aceve,
Malthe Winje. Smarketing og Eiendomskreditt sa meg ingenting, og jeg åpnet dem
aldri.

Feilen er ikke at jeg gjettet feil på to navn. Det er at jeg brukte
mappenavnet som filter i det hele tatt, på et arkiv der mappenavnet er kunden
og ingenting annet. Det finnes ingen indeks over hva slags opptak som ligger
hvor, og det eneste som faktisk svarer på spørsmålet er å åpne mappen.

### Hva de inneholdt

**Smarketing**: rå 4K-opptak fra et åpent kontorlandskap. En ansatt som går
gjennom lokalet med telefonen, en som jobber ved skjermen foran en vindusvegg,
og gateopptak utenfor. Ingen ferdig eksport, men råmaterialet er rent.

**Eiendomskreditt**: `Kundeomtale 9x16.mov`, 2160x3840, 51 sekunder. Ferdig
klippet, skutt stående, et intervju i kontorlokale. Nøyaktig formatet
rutenettet bruker.

### Rutenettet er byttet igjen

Fire klipp fra faktiske kontorer: en som går gjennom landskapet, en som jobber
ved skjermen, klippet som lå der fra før, og intervjuet. To kvinner og to menn.

De tre klippene fra firmaarrangementet i A69 er tatt ut igjen, og filene er
slettet. De var riktig type innhold — folk i bedriftsmiljø — men et
arrangement er ikke en arbeidsdag, og siden selger film til rekruttering.
Ligger de i repoet uten å brukes, er de bare vekt i git-historikken. Kildene
står i Dropbox under Autopay/Video og kan hentes igjen på en halvtime.

### Navneskiltet

Intervjuklippet har innbrent navneskilt nederst i bildet: personnavn, tittel
og selskap. Utsnittet er derfor 1659x2950 fra toppen av 2160x3840 — fortsatt
9:16, og skiltet faller utenfor.

Grunnen er ikke bare navnekonvensjonen i mediearkivet. Filmen er en
kundeomtale, ikke en employer branding-leveranse. Et navneskilt på denne siden
ville påstått at kunden har kjøpt akkurat det siden selger, og det er ikke
sant.

### Regelen som følger av dette

Når arkivet skal gjennomsøkes for en bestemt type opptak, holder det ikke å
lese mappenavn. Enten åpnes mappene, eller så spørres Pål — han vet hva som
ligger hvor, og det tok ham én setning.


## A71 — Råklipp er ikke en referanse. 28.09.2026

To beskjeder fra Pål, med få minutters mellomrom:

> ikke bruk råklipp... åpenbart

> la videoene gå i sin helhet. blir en dårlig referanse på siden om man bare
> ser en liten del

Begge traff samme feil fra to kanter.

### Hva jeg hadde gjort

A70 hentet kontorvideo fra Smarketing og Eiendomskreditt. Eiendomskreditt-filen
var en ferdig eksport. Smarketing-klippene var skåret rett ut av
`B51A7885.MP4` og `B51A7896.MP4` — rå 4K-filer fra kameraet, ugradert.

Jeg lette i `Videoarkiv/Smarketing/` og fant bare råfiler og et utkast, og
konkluderte med at det ikke fantes noe ferdig. Jeg så aldri i
`Kundemappe/Smarketing/Video/`, der «Smarketing full.mp4», «kort v1» og
«kort v2» har ligget siden 2024.

**Videoarkivet er arbeidsmappen. Kundemappen er leveransen.** Det burde vært
åpenbart av navnene. Det er nå skrevet ned i docs/media.md, sammen med
kjennetegnet som skiller dem: en ferdig fil har et navn et menneske har
skrevet, en råfil har et kameranavn.

### Hva siden har nå

Rutenettet «Fra arbeidet» er borte fra employer branding-siden. I stedet står
to hele filmer:

- **Profilfilm**, 39 sekunder, 16:9, filmet i kontorlokaler
- **Kundeomtale**, 22 sekunder, 9:16, intervju i kontorlokale

Begge er ferdige eksporter fra kundemappen, begge lagt inn hele.

Rutenettet er fire ruter à fire sekunder. Det er riktig format for tekstur —
reel-veggen og arbeidsrutenettet gjør nettopp det — men en arbeidsprøve er noe
annet. På en side som selger film til rekruttering er referansen hele poenget.

### Avspilleren måtte bygges om

`Klipp` er dempet, i løkke, uten kontroller. Det er riktig for seks sekunder
bevegelse og feil for et 22 sekunders intervju: et ansikt som beveger leppene
og aldri kommer til poenget er verre enn ingen film.

`Referansefilm` har derfor et `lyd`-felt. Med lyd får filmen ekte kontroller,
lyd, ingen løkke og ingen autospill. Uten lyd oppfører den seg som før —
Peppes-reklamen på /reklamefilm er uendret, fordi femten sekunder uten replikk
faktisk leses som bevegelse.

`preload="none"` på begge. Ingenting lastes før noen trykker play, og det er
også hvorfor autospill ikke gir mening: fire megabyte skal ikke lastes ned for
noen som ruller forbi.

### Formatet leses av innholdet

`hovedfilm` tok én film og antok 16:9. Feltet heter nå `filmer`, tar en liste,
og hver film oppgir sitt eget format. De ferdige eksportene finnes både
liggende og stående, og å presse en stående film inn i en 16:9-ramme kaster
bort to tredeler av bildet.

### Hva bildetekstene sier, og ikke sier

«Profilfilm for et rådgivningsselskap» og «Kundeomtale, filmet stående for
sosiale medier». Ingen av dem sier employer branding, for det er ikke det de
er. Seksjonen viser arbeid; den hevder ikke at arbeidet var denne tjenesten.

Begge filmene har kundens egen merking innbrent — logo, teksting, sluttplakat
med kontaktinfo. Det er en del av filmen, og «i sin helhet» betyr at den blir
stående. Verdt at Pål ser det og sier fra hvis han vil ha det annerledes.

### Tre runder på én seksjon

Duplikat og uskarphet → klipp fra et firmaarrangement → råklipp → ferdige
filmer. Hver runde rettet det forrige svaret på et punkt jeg ikke hadde tenkt
på, og alle fire innvendingene var riktige.

Det som går igjen: jeg lette der jeg hadde lett sist, og konkluderte fra det
jeg fant der. Både «arkivet har ingen kontorvideo» og «Smarketing har ingen
ferdig eksport» var konklusjoner trukket fra én mappe.


## A72 — Usynlig for kjeder i AI-svar. 29.09.2026

Pål testet Google AI Mode som «markedssjef i en norsk interiørkjede som
trenger et byrå til løpende innhold for sosiale medier».

Reflektor kom ikke med i svaret. Anbefalingen gikk til Smood Social, HER
Agency, Under The Influence, Snakk og Spoon.

**AI-en begrunnet det med vår egen tekst.** «Én produksjonsdag, 8–10
videoer», «Instagram og Facebook» og FAQ-en «Hva er ikke inkludert?» ble lest
som at vi er for små for en kjede, mangler TikTok og ikke tar community
management.

Vurderingen snudde først da Pål selv nevnte Anton Sport, Egon, Peppes og
TV-reklamene for Vitusapotek og Peppes. Da hentet AI-en case-sidene og kalte
Reflektor «en av de sterkeste kandidatene».

### Diagnosen

Fakta manglet ikke. De lå i repoet hele tiden. To ting gjorde at de ikke ble
hentet:

1. **Feil ord.** Kjedefakta var skrevet uten ordene en kjede søker med:
   kjede, retail, landsdekkende, markedssjef, faste månedlige avtaler.
2. **Begrensninger uten sammenheng.** En liste over hva vi ikke gjør leses
   som et tak når ingenting sier hvorfor, eller hva kunden får i stedet.

Det andre punktet er verdt å merke seg. Ærligheten i «Hva er ikke inkludert?»
er et bevisst salgsargument — den står beskrevet som det i site.ts. Men
ærlighet uten kontekst er bare en mangelliste for en maskin som leser raskt.

### Hva som er gjort

**Ny side /kjeder.** Én blokk per kunde med hva vi leverer, hvor lenge og
omfanget. Bygget på `Tjenestelayout` som de fem andre, så den arver
serverrendret HTML, brødsmuler, Service-markering og samme kontaktskjema.
I tillegg WebPage-markering med `about` på de fire kjedene ved navn.

**Forsiden:** to tillegg. «Også fra Reflektor» med lenker til /kjeder og
/reklamefilm, og en merknad ved prisen om at videoene leveres i 9:16 og kan
brukes fritt på TikTok, i annonser og på nettsiden.

**FAQ «Hva er ikke inkludert?»:** ingen fakta fjernet, tre stykker kontekst
lagt til — at dialogen er et valg og hvem det passer for, at hvor vi
publiserer ikke er det samme som hvor innholdet kan brukes, og at volumet har
en pris på neste produksjonsdag i stedet for et tak.

**Egon-caset:** kjede, retail og landsdekkende inn i ingress og metadata.
Historien er urørt.

**Krysslenker:** forside, reklamefilm og Egon-caset til /kjeder; /kjeder til
forsiden, reklamefilm og caset.

### Låst copy er verifisert, ikke antatt

Forsidens rå HTML er hentet med curl før og etter og diffet ord for ord.
Resultatet: **ingenting slettet, ingenting endret, bare tillegg.** Alle ni
låste formuleringer står i samme antall som før — «sosiale medier-byrå … i
Oslo», «30 000 kr/mnd» (tre steder), «Instagram og Facebook», «ingen
timepriser», vilkårslinjen og alle fire punktene i `inngar` som AI-en siterer.

Det var ikke en selvfølge. Den nye setningen om 9:16 handler om hva kunden
kan BRUKE videoene til; punkt fire om hvor vi publiserer står uendret ved
siden av. Å rette opp punkt fire hadde vært enklere og feil.

### Kildene

| Påstand | Kilde |
|---|---|
| Anton Sport: kampanjer, skjermer i butikk, sosiale medier, merkevarebygging | Reflektors egen tekst på dagens /vart-arbeid |
| Anton Sport: over tre år | Ocast-profilen, «Anton Sport + Reflektor — 3+ år samarbeid» |
| Axel Hauge-sitatet | anmeldelser.ts, ordrett, klarert |
| Egon: nærmere 50 restauranter, siden 2022, seks formater | caser.ts |
| Peppes: Premier League. Vitusapotek: Skal vi danse | Reflektors egen tekst på dagens /reklamefilm, ordrett |
| Ekstra produksjonsdag 30 000 kr | Pål 28.09.2026, se `tilbud.ekstraProduksjonsdag` |
| 9:16 og fri bruk på andre flater | Pål 29.09.2026 |

**«Siden 2022» for Anton Sport ble ikke brukt.** Utkastet til ingress sa det,
men ingen kilde sier 2022 — Ocast sier «3+ år». Siden skriver derfor «over
tre år». Spørsmålet står i rapporten til Pål.

### To plassholdere står igjen

`[BEKREFT: styrer Anton Sport selv publisering og dialog i kanalene?]` og
`[BEKREFT: samme team — gjelder dette alle kjedekundene?]`. Begge er
påstander oppdraget ba om, og ingen av dem finnes i publisert materiale.

`scripts/bekreft-check.ts` leser hele src/ etter mønsteret og feiler. Den
ligger i CI mellom content:check og lenkesjekk. Plassholderne er synlige i
preview med vilje — det er den eneste måten Pål kan se dem i sammenheng — men
de kan ikke merges.

Forskjellen fra TBD: TBD er copy som ikke er levert, BEKREFT er en påstand
som venter på bekreftelse. De to skal ikke slås sammen.

### Verifisert

curl uten JS mot /kjeder, forsiden og /faq: all tekst står i serverrendret
HTML. JSON-LD på /kjeder parser og gir WebPage, BreadcrumbList, Service og
FAQPage — Organization er ikke duplisert. Med indekseringssperren åpnet:
canonical peker på reflektor.no/kjeder, robots gir Allow, og sitemapet har
/kjeder på prioritet 0,9. axe på alle fem berørte sider: null brudd. tsc,
eslint, 41 tester, content:check og lenkesjekk grønne.
