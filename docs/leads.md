# Skjemaleads

Leads er den eneste KPI-en. Kjeden er:

```
skjema → serverhandling → e-post til Pål
                        ↘ redirect /takk → GA4 takk_page_view → Google Ads
```

De to greinene er bevisst uavhengige. **E-postfeil stopper aldri redirecten** –
mister vi `/takk`, mister vi målingen, og da er leadet usynlig selv om det kom
fram. Motsatt vei: en lead som telles men ikke leveres, fanges opp i loggen.

## Miljøvariabler

Settes i Vercel, aldri i repoet (brief 8.1.2).

| Variabel | Påkrevd | Standard |
|---|---|---|
| `RESEND_API_KEY` | ja | – |
| `LEAD_MOTTAKER` | nei | `pal@reflektor.no` |
| `LEAD_AVSENDER` | nei | `Reflektor <onboarding@resend.dev>` |

**DE TO SISTE SKAL IKKE SETTES.** Avklart med Pål 01.10.2026: leads går til
ham alene. Da er standardene riktige som de er, og to variabler som ikke er
satt er to færre å holde i synk med virkeligheten. De står i tabellen fordi
de finnes i koden, ikke fordi de er en oppgave.

Mangler nøkkelen, skrives det en feilmelding i Vercel-loggen og redirecten
skjer som normalt. **Selve leadet logges ikke** — her sto det tidligere at
det logges i klartekst, og det var sant fram til navn, e-post og telefon ble
tatt ut av loggen. Loggen er tilgangsstyrt, men personopplysninger skal ikke
ligge der uansett, og personvernerklæringen nevner det ikke. Feilen er
fortsatt umulig å overse: mangler nøkkelen, kommer ingen leads fram.

## Oppsett

1. Opprett konto på resend.com med `pal@reflektor.no`
2. Lag en API-nøkkel
3. Legg den inn i Vercel: Project Settings → Environment Variables →
   `RESEND_API_KEY`
4. Redeploy

Standardavsenderen `onboarding@resend.dev` fungerer **uten å røre DNS**, men
kan kun sende til adressen kontoen er registrert på. Det holder, og er det
som gjelder: Pål bekreftet 01.10.2026 at han er eneste mottaker. Forutsetningen
er at Resend-kontoen er registrert på `pal@reflektor.no`, slik steg 1 over
sier.

Skulle flere motta dem senere, må reflektor.no verifiseres som avsenderdomene
i Resend.
Det krever DNS-oppføringer for e-post – ikke for nettstedet – og flytter altså
ikke reflektor.no. Men det er DNS, så det skal avklares eksplisitt først.

## Spam-beskyttelse

Ingen CAPTCHA (brief 8.1). To tiltak, begge usynlige:

- **Honningkrukke:** feltet `firmanavn` er skjult utenfor skjermen. Utfylt = bot.
- **Tidssjekk:** innsending under to sekunder etter sidelasting er maskinell.

Begge fører til redirect til `/takk` uten at e-post sendes. Boten får ingen
tilbakemelding om at den ble avvist.

Merk at boter som treffer honningkrukka utløser `takk_page_view` og dermed
telles som konvertering i GA4. Ser konverteringstallene urimelig høye ut,
er det her man ser først.

## Verifisering før lansering

Ferdigdefinisjonen i 8.8 punkt 4 krever hele kjeden testet ende-til-ende:

- [x] Innsending gir e-post til `pal@reflektor.no` — verifisert 23.08.2026
- [x] Redirect til `/takk` skjer — `GET /takk.rsc 200` i kjøretidsloggen,
      og ingen feil- eller advarselslinjer på deploymentet
- [ ] Svar-til er avsenderens egen adresse — ikke kontrollert i mottatt e-post
- [ ] `takk_page_view` registreres i GA4
- [ ] Konverteringen vises i **Google Ads-grensesnittet**, ikke bare i
      GTM Preview

Hard reload mellom hver test – GTM kan servere gammel versjon i opptil et
kvarter etter publisering.

## Kilden sluttet å komme fram til HubSpot — og hvorfor (04.10.2026)

**Feilen:** `nettside_kilde` sto tomt på alle kontakter opprettet etter at
skjemaet ble skrevet om. Feltet er det eneste i CRM-et som sier hvilken
annonse eller kanal en henvendelse kom fra.

**Årsaken var ikke HubSpot.** De to skjulte feltene `lastet` og `kilde` fikk
verdiene sine satt direkte på DOM-noden i en effekt, på felt som ellers bare
hadde `defaultValue`. Det virket i ukevis — helt til knappen fikk en
«Sender …»-tilstand. Den tilstanden utløser en ny render midt i
innsendingen, og React setter da et ukontrollert felt tilbake til
`defaultValue`. En verdi React ikke selv har skrevet, kjenner den ikke.

Målt på live: rett før klikket sto riktig kilde i feltet; i `FormData` ved
innsending sto `kilde=""` og `lastet="0"` — på samme DOM-node.
`side` kom fram hele veien, og det er nettopp forskjellen: den har alltid
vært et `value`-felt React styrer selv.

**To ting var borte samtidig, og begge var stille.** Kilden i CRM-et, og
tidsstempelet bot-vakten bruker (innsending under to sekunder etter lasting).
Ingenting feilet synlig: e-posten kom fram, leadet kom fram, HubSpot svarte
200. Varselet til Pål viser ikke kilden, så den eneste indikasjonen fantes i
CRM-et.

**Rettingen:** alle tre skjulte felt er nå React-tilstand og rendres med
`value`. `tests/skjultefelt.test.ts` feiler hvis noen går tilbake til
`defaultValue` eller setter en verdi på DOM-noden igjen.

**Hva som ble lett feil underveis:** kildefeltet forsvant i samme utrulling
som `website` ble lagt til i HubSpot-nyttelasten, og korrelasjonen pekte
først på HubSpots skjemadefinisjon. Den var uskyldig. Lærdommen er at
HubSpot lagrer det den får — står feltet tomt der, ble det aldri sendt.

Reserven i `lib/hubspot.ts` ble samtidig gjort smartere: avviser HubSpot et
felt, leses feltnavnet ut av feilmeldingen og nøyaktig det feltet fjernes i
forsøk nummer to. Før antok den at det alltid var `website`, og da ville en
avvisning av et annet felt kostet hele leadet.

## Kontroll av hele kjeden, 04.10.2026

Målt på live, uten å sende inn skjemaet (innsendingen stoppes i nettleseren
rett før den går):

| Ledd | Status |
|---|---|
| Kilden fanges på FØRSTE sidevisning, også fra annonselenke | ✓ |
| Kilden overlever til skjemaet på en annen side | ✓ |
| Alle felt følger med i innsendingen, også de skjulte | ✓ |
| Tidsstempelet mot roboter er satt (ikke 0) | ✓ |
| Honningkrukken ligger i skjemaet | ✓ |
| HubSpots egen skjemaavlesning er slått av for skjemaet | ✓ |
| `/takk`: page_view, takk_page_view og generate_lead | ✓ |
| Alle tre med fullt samtykke (`gcs=G111`) | ✓ |

**Ett funn verdt å kjenne til:** `takk_page_view` og `generate_lead` fyrer
BARE når besøkende kommer til `/takk` fra siden selv. Åpner noen adressen
direkte — bokmerke, lim inn, en lenke i en e-post — sendes bare `page_view`.

Det er riktig oppførsel og ikke en feil: en konvertering skal telles når noen
faktisk har fylt ut skjemaet, ikke når adressen åpnes kaldt. Det er verdt å
vite fordi det betyr at `/takk` ikke kan brukes som en «takk»-side for noe
annet uten at tallene blir feil.

**Meta-leads går ikke denne veien i det hele tatt.** De kommer rett inn i
HubSpot fra Meta-skjemaet, uten å være innom nettsiden. De har derfor ingen
kildestreng fra oss — HubSpots egen kildemåling er det som gjelder der. Det
er også grunnen til at oversiktssiden `/paaminnelse` finnes: for Meta-leads
får Pål ikke noe varsel med knapp fra nettsiden.
