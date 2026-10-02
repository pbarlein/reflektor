# Cutover — handlinger som først skal skje når DNS peker hit

> **OPPDATERT 27.09.2026: Google Ads er slått av.** Pål har pauset kontoen
> foreløpig. Det endrer forutsetningen for punkt 1 under — det er ingen betalt
> trafikk å sende i grøfta akkurat nå — men **ikke** rekkefølgen: 301-en
> legges fortsatt inn først ved cutover, ikke nå. Grunnen er ikke Ads alene.
> `/sosiale-medier-byra` er en live side på den nye siden også, og en redirect
> derfra ville slått ut siden i forhåndsvisningen. En test i
> `tests/redirects.test.ts` stopper det nå automatisk.
>
> Slås Ads på igjen før cutover, gjelder punkt 1 i sin opprinnelige form.
>
> **KORRIGERT 29.09.2026: Meta-annonsering er derimot i drift.** Kontoen har
> brukt penger gjennom hele 2026, sist 27.09.2026. Setningen over om at det
> ikke finnes betalt trafikk gjaldt Google Ads alene. Det rører likevel ikke
> punkt 1: ingen av Meta-annonsene peker på reflektor.no. Se punkt 5.

> **UTFØRT 02.10.2026.** DNS ble flyttet til Vercel. Steg 3 (Ads-URL), 4 (301),
> 5 (DNS), 6 (indeksering) og 8 (Search Console, sitemap sendt inn på nytt)
> er gjort. Logg over alle endringer den dagen, også de som ble gjort utenfor
> koden (DNS-oppføringer, Bulk Redirects i Vercel, miljøvariabler, Resend),
> står i Claude-prosjektet «Reflektor Marketing»:
> `claude/dns-bytte-vercel-2026-10-02.md`.
>
> Det som ikke stod på lista, men ble funnet og rettet samme dag:
> - /privacypolicy ga 404 → 301 til /personvern
> - /tjenester/eventfotograf-eventvideo havnet på /vart-arbeid (rekkefølge)
> - /book og /mote (Squarespace URL-mappinger) ga 404 → 302 til HubSpot
>   Meetings (kun i Vercel Bulk Redirects)
> - GTM lastes nå for alle med Consent Mode «nektet» som standard (Påls
>   valg, se Sporing.tsx)
> - Skjemaet sender med kilde (UTM/gclid/fbclid), se lib/kilde.ts
> - LEAD_AVSENDER = «Reflektor <skjema@reflektor.no>», reflektor.no er
>   verifisert i Resend
>
> Teksten under er beholdt som den var, som dokumentasjon av planen.

Ingenting i denne filen er utført. Alt her er bestilt, begrunnet og skal
gjøres **på cutover-dagen**, ikke før.

---

# Kjørelista for dagen

Skrevet 29.09.2026. Rekkefølgen er ikke valgfri — hvert steg forutsetter det
forrige. Kolonnen «hvem» står der fordi flere av stegene ikke kan gjøres av
Claude Code: de krever innlogginger Pål har og Claude ikke har.

| #   | Steg                                                                                                | Hvem   |
| --- | --------------------------------------------------------------------------------------------------- | ------ |
| 1   | Kjør hele sjekkrunden lokalt og få grønt på alt                                                     | Claude |
| 2   | Legg `reflektor.no` og `www.reflektor.no` til i Vercel-prosjektet `reflektor-ny`                    | Pål    |
| 3   | Bytt endelig URL i Google Ads fra `/sosiale-medier-byra` til `/`                                    | Pål    |
| 4   | Legg inn 301-en fra `/sosiale-medier-byra` og rett de to redirectene som peker dit (punkt 1 under)  | Claude |
| 5   | Flytt DNS for reflektor.no til Vercel                                                                | Pål    |
| 6   | Sett `NEXT_PUBLIC_TILLAT_INDEKSERING=true` i Vercel og redeploy                                      | Pål    |
| 7   | Verifiser `/takk` med ett ekte testskjema (punkt 3 under)                                            | Begge  |
| 8   | Meld nettstedet i Search Console som domeneegenskap og send inn sitemapet                            | Pål    |
| 9   | Rydd «ACCEPT»-utløseren i GTM (punkt 6 under)                                                        | Pål    |

Steg 1 er disse kommandoene, i denne rekkefølgen. Alle skal gå grønt:

```
npm audit --omit=dev --audit-level=high
npx tsc --noEmit
npm run lint
npm test
npm run content:check
npm run bekreft:check
npm run build
npm run lenkesjekk
```

Steg 6 skal gjøres **etter** steg 5, ikke før. Åpnes sperren mens DNS fortsatt
peker på Squarespace, indekserer Google forhåndsvisningen på vercel.app — og
da har nettstedet to adresser i indeksen.

## Det finnes ingen `main` — denne branchen er produksjon

Kontrollert 02.10.2026, og det endrer hva cutover faktisk er.

Remoten har ingen `main`. Vercel-prosjektets produksjonsbranch er
`claude/reflektor-new-website-10fmt0`, og de åtte siste deployene fra den er
alle `target: production`. **Det finnes altså ikke noe «slå sammen til main»-
steg før lansering.** Siste push er allerede bygget og ligger klar.

Det som holder den av lufta er nøyaktig to ting, og begge er på denne lista:
ingen egne domener er koblet til prosjektet, og indekseringssperren står. Den
dagen domenene kobles og DNS flyttes, er det siste push på denne branchen som
blir reflektor.no — uten noe mellomledd.

Praktisk konsekvens: **ikke push noe halvferdig etter at domenene er koblet.**
Fram til da er det ufarlig.

`reflektor-ny.vercel.app` svarer 200 for alle, med `Disallow: /` og
`noindex` — verifisert 02.10.2026. Vercel Authentication står på for
genererte deploy-URL-er og previews, ikke for prosjektets alias.

---

## Det som mangler i Vercel i dag

Kontrollert 29.09.2026:

- ~~Ingen egne domener er koblet til.~~ **UTFØRT 02.10.2026.**
  `www.reflektor.no` er lagt inn som produksjonsdomene, og `reflektor.no`
  omdirigerer dit med 308. Begge står som `verified` hos Vercel.

  **www er primær, ikke apex.** `site.domene` er `https://www.reflektor.no`,
  så alle canonicals peker dit, og dagens reflektor.no 301-er allerede til
  www — kontrollert mot live side samme dag. Retningen er altså den samme
  som før.

  Kontrollert rett etterpå at dagens side er urørt: `reflektor.no` svarer
  fortsatt 301 til www, `www.reflektor.no` svarer 200, og `Server:`-headeren
  sier fortsatt Squarespace. Å legge til domener i Vercel rører ikke DNS.
- **Bare `RESEND_API_KEY` er satt, og det er riktig.** `LEAD_MOTTAKER` og
  `LEAD_AVSENDER` står tomme og faller tilbake på standardene i
  `src/lib/lead.ts`: leads går til `pal@reflektor.no`, sendt fra Resends
  `onboarding@resend.dev`. Den avsenderen kan bare levere til adressen
  Resend-kontoen er registrert på — og Pål bekreftet 01.10.2026 at han er
  eneste mottaker. **Dette er altså ikke en mangel, og de to variablene skal
  ikke settes.** Skulle flere motta leads senere, må reflektor.no verifiseres
  som avsenderdomene i Resend. Det krever DNS-oppføringer for e-post, ikke
  for nettstedet, og flytter altså ikke reflektor.no.

## Det som IKKE lenger er en stopper

AGENTS.md punkt 4 sa at bloggtekstene ikke er migrert fra Squarespace, og at
siden ikke kan lanseres før de er det. Det er utdatert, og punktet er merket
som utført. De ni artiklene ble migrert ordrett 21.09.2026, og bloggen har i
tillegg fem artikler skrevet for den nye siden. Alle fjorten svarer 200,
ligger i sitemapet og er lenket fra bloggoversikten. De åtte gamle slugene uten
innhold — tre aliaser og seks døde — 301-es som før.

Grunnen til at det har en egen fil: hver av disse handlingene er trygg på
cutover-dagen og skadelig i dag.

---

## 1. `/sosiale-medier-byra` → `/` som 301

**Status: UTFØRT 02.10.2026.** I koden (next.config.ts) og som Bulk Redirect i Vercel.

Bestilt av Marketing 15.09.2026. Begrunnelse derfra: Google AI Mode siterer
vekselvis forsiden og `/sosiale-medier-byra` for samme prompt, fordi begge
bærer samme fakta. To sider med samme fakta deler signalene i to. Det AI
belønner er setningene, ikke URL-en — og setningene følger med i en 301.

Dette **opphever** brief 8.5 «vei A» fra v1.2; brief v1.0-tabellen gjelder
igjen.

### Dette står i direkte motstrid til regel 1 i AGENTS.md

AGENTS.md sier: «Live URL-er flyttes ikke … `/sosiale-medier-byra` … er live
sider det annonseres mot. Første utkast redirigerte to av dem bort og ville
sendt betalt trafikk i grøfta.»

Regelen ble skrevet fordi jeg gjorde nettopp den feilen én gang.

Motstriden er **reell, men løst** — forutsatt at rekkefølgen holdes:

1. Google Ads: endelig URL byttes til `/`
2. **Samme dag:** 301-en legges inn
3. Squarespace-forsiden og dagens `/sosiale-medier-byra` røres ikke før dette

Gjøres 301-en før Ads-URL-en byttes, lander betalt trafikk i en redirect. Det
er ikke katastrofalt — en 301 videresender — men det koster lastetid på hvert
klikk, og Ads kan flagge landingssiden.

Gjøres den i dag, mens Squarespace fortsatt serverer siden, gjør den
ingenting i det hele tatt: redirect-kartet i `next.config.ts` gjelder bare
den nye siden, som ingen besøker ennå.

**Pål må bekrefte at han kjenner denne motstriden før 301-en legges inn.**
Å oppheve en regel som ble skrevet etter en konkret feil, skal være et
bevisst valg — ikke noe som skjer fordi det sto i et vedlegg.

### Selve endringen, når den skal gjøres

```ts
// next.config.ts — legges til i redirects()
{
  source: "/sosiale-medier-byra",
  destination: "https://www.reflektor.no/",
  permanent: true,
}
```

Absolutt https-URL, ikke relativ sti — slik Marketing spesifiserte.

Merk at `/sosiale-medier-byra` i dag er **destinasjon** for to redirects i
`next.config.ts` (linje 35 og 40). De må peke på `/` samtidig, ellers blir
det en kjede: gammel URL → `/sosiale-medier-byra` → `/`. To hopp der ett
holder.

---

## 2. Indekseringssperren åpnes

`NEXT_PUBLIC_TILLAT_INDEKSERING=true` i Vercel. Se `src/lib/miljo.ts`.

Først når DNS peker hit. Ikke for å «teste at SEO virker».

### FELLE: variabelen virker ikke før siden er bygget på nytt

Funnet 02.10.2026 ved å teste begge veier. `NEXT_PUBLIC_`-variabler bakes
inn i koden **når siden bygges**, ikke når den kjører. Setter man variabelen
i Vercel og lar det være med det, serverer siden fortsatt `Disallow: /` og
`noindex` — i uker, uten at noe sier fra.

Testet: samme bygg startet med og uten variabelen gir identisk resultat
(sperren på). Bygget på nytt med variabelen satt gir `Allow: /`, absolutte
canonicals mot `https://www.reflektor.no`, sitemap på samme domene — og
`/takk` fortsatt `noindex`, som det skal.

**Etter at variabelen er satt i Vercel må det deployes på nytt.** Enten ved
å trykke «Redeploy» på siste deploy, eller ved å pushe en commit.

**Kontroller etterpå** at `https://www.reflektor.no/robots.txt` sier
`Allow: /`. Gjør den ikke det, er ikke bygget kjørt på nytt.

---

## 3. Verifiser at `/takk` fortsatt teller

107+ historiske konverteringer henger på GA4-hendelsen `takk_page_view` i
GTM-N4KGSS93. Send ett testskjema etter cutover og bekreft i sanntidsrapporten
at hendelsen fyres — ikke bare at siden vises.

Dette er den eneste KPI-en. Alt annet på siden kan repareres i ettertid.

---

## 5. Meta-pikselen forsvinner — avgjort 29.09.2026: la den gå

Funnet 27.09.2026 ved å lese kildekoden til dagens side. Avgjort 29.09.2026
etter at tallene ble hentet, fordi Pål spurte hva svaret er.

Meta-pikselen `572759520853896` kjører på reflektor.no i dag, men den er
**injisert direkte i Squarespace** — ikke lastet gjennom GTM-containeren.
Derfor følger den ikke med til den nye siden, og den slutter å samle data den
dagen DNS flyttes.

Det samme gjelder Elfsight-widgeten (`bafcc99b-ca46-41b5-adc6-e4435772183d`,
`elfsightcdn.com/platform.js`).

### Meta-annonsering er i drift — det er nytt

Overskriften på denne filen sier at det ikke finnes betalt trafikk fordi
Google Ads er pauset. Det var bare halve bildet. Meta-kontoen
(`act_1105292240226528`, «Reflektor AS») har brukt penger gjennom hele 2026,
sist **27.09.2026, to dager før dette ble skrevet**.

Det endrer likevel ingenting i punkt 1, og grunnen er hele svaret på
pikselspørsmålet.

### Hva pikselen faktisk måler: 1 konvertering på 66 000 kroner

Hentet fra Meta-kontoen via Supermetrics, 01.01.2026–29.09.2026:

| | Kroner | Leads i Meta | Leads via piksel | Landingssidevisninger |
|---|---|---|---|---|
| Foto & video på månedlig basis | 49 705 | 34 | – | 15 |
| Web - V.1 | 5 642 | – | 1 | 16 |
| Leads - Bred Målgruppe | 3 395 | 2 | – | 10 |
| Post: «SOULCAKE …» | 2 490 | – | – | – |
| Fire mindre sett | 4 778 | – | – | 5 |
| **Sum** | **66 010** | **36** | **1** | **46** |

Trettifire av trettiseks leads er **skjemaer utfylt inne i Meta** —
Instant Forms, som aldri sender noen til reflektor.no. Pikselen har registrert
**én** konvertering på nettsiden i hele 2026.

Og det som kjører nå, er ikke engang rettet mot nettsiden. Alle tre aktive
annonsesettene i september peker på facebook.com — to reels og et innlegg.
Åtte tusen kroner i september, null klikk til reflektor.no.

### Derfor: la den gå

- **Den måler ingenting.** Én konvertering på ni måneder er ikke måling.
- **Remarketing-målgruppene er tomme uansett.** 46 landingssidevisninger på
  ni måneder ligger langt under det Meta trenger for å bygge en
  nettsidemålgruppe. Det er ingenting å miste.
- **Den koster på den nye siden.** En tredjeparts sporer på hver side, med
  samtykkekontroll som må bygges og en linje i personvernerklæringen, for null
  måling.

**Handling ved cutover: ingen.** Pikselen forsvinner av seg selv.

**Bekreftet av Pål 29.09.2026: «la pixelen stå.»** Saken er lukket, og det står
ingenting igjen å gjøre med den verken før eller på cutover-dagen.

**Én betingelse.** Begynner Meta å sende trafikk til reflektor.no igjen —
annonser med nettsiden som destinasjon, ikke reels og Instant Forms — må
pikselen inn i GTM-containeren **før** de annonsene settes i gang, ellers
måles de ikke. Det er en halvtimes jobb i GTM, med samtykkekontroll på
`ad_storage` som de tre taggene i `docs/gtm-samtykke.md`. Den jobben gjøres
når behovet finnes, ikke på forskudd.

## 6. «ACCEPT»-utløseren kan ryddes — etterpå

Samtykkemalens `update`-tagg i containeren fyrer på klikk på et element hvis
tekst inneholder `ACCEPT` (store bokstaver, uten `ignore_case`). Det er
Squarespace sitt banner.

Den nye sidens knapp heter «Godta alle» og treffer aldri. Det er ufarlig —
`Samtykke.tsx` kaller `gtag("consent","update", …)` selv — men utløseren er
arvegods etter byttet. Rydd den når dagens side er ute av bruk, **ikke før**:
så lenge Squarespace svarer, er den det som gir samtykke der.
