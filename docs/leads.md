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

Mangler nøkkelen, logges leadet i klartekst i Vercel-loggen og redirecten skjer
som normalt. Ingenting går tapt i stillhet, men det er ikke en driftsform.

## Oppsett

1. Opprett konto på resend.com med `pal@reflektor.no`
2. Lag en API-nøkkel
3. Legg den inn i Vercel: Project Settings → Environment Variables →
   `RESEND_API_KEY`
4. Redeploy

Standardavsenderen `onboarding@resend.dev` fungerer **uten å røre DNS**, men
kan kun sende til adressen kontoen er registrert på. Det holder så lenge leads
går til Pål alene.

Skal flere motta dem, må reflektor.no verifiseres som avsenderdomene i Resend.
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
