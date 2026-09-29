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

Ingenting i denne filen er utført. Alt her er bestilt, begrunnet og skal
gjøres **på cutover-dagen**, ikke før.

Grunnen til at det har en egen fil: hver av disse handlingene er trygg på
cutover-dagen og skadelig i dag.

---

## 1. `/sosiale-medier-byra` → `/` som 301

**Status: IKKE UTFØRT. Skal ikke utføres før cutover.**

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
