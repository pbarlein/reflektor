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
regelen finnes for å verne ~481 refererende domener, og den er riktig —
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
