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
«self-serving». Konsekvensen er todelt: siden blir **ikke kvalifisert** for
stjerner i søkeresultatet, og markeringen er et brudd på retningslinjene.
Det gjelder også om anmeldelsene kommer via en tredjepartswidget — altså
også dagens Elfsight-løsning.

**Derfor:** anmeldelsene på forsiden er vanlig HTML uten schema.
`src/components/Schema.tsx` skal ikke utvides med `aggregateRating`.

Fristelsen er reell, for stjerner i SERP ser ut som gratis CTR. Den er det
ikke — den gir null stjerner og en policyrisiko på samme tid.

Kilde: developers.google.com/search/docs/appearance/structured-data/review-snippet

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
