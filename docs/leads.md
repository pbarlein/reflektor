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

## Åpent punkt: `nettside_kilde` skrives ikke lenger i HubSpot (04.10.2026)

Målt på fire ekte innsendinger samme døgn:

| Tid | Hvem | `website` sendt | `nettside_kilde` lagret |
|---|---|---|---|
| 07:06 | ekte lead | nei | **ja** |
| 08:52 | testinnsending | nei | **ja** |
| 09:12 | testinnsending | ja | nei |
| 09:20 | testinnsending (live) | ja | nei |

De to siste er kjørt etter at `website` ble lagt i nyttelasten, og de er de
to eneste som mangler kilden. Innsendingene ble godtatt: HubSpot talte dem
som konverteringer, `message` og `website` står på kontakten, og ingen
feilmelding kom i Vercel-loggen.

**Det er ikke koden.** Nyttelasten er dumpet for nøyaktig dette leadet og
inneholder `nettside_kilde` med riktig verdi. Enhetstestene dekker det.
Samme streng, fra samme felt, ble skrevet uten problemer kl. 08:52.

**Det som ikke kan leses herfra** er HubSpots egen skjemadefinisjon og
svarkroppen fra endepunktet. Begge krever enten innlogget HubSpot eller en
ny testinnsending. Derfor står det som et åpent punkt til Cowork: se på
feltene i skjemaet «reflektor.no – kontaktskjema» og på hva innsendingene
kl. 09:12 og 09:20 faktisk inneholdt.

**Leadet går ikke tapt i mellomtiden.** Kilden står i e-posten til Pål, som
er hovedkanalen, og den er uendret. Det er bare feltet i CRM-et som er tomt.

Reserven i `lib/hubspot.ts` er samtidig gjort smartere: avviser HubSpot et
felt, leses feltnavnet ut av feilmeldingen og nøyaktig det feltet fjernes i
forsøk nummer to. Før antok den at det alltid var `website`, og da ville en
avvisning av et annet felt kostet hele leadet.
