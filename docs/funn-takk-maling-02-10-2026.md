# Konverteringsmålingen etter cutover — og en feilslutning jeg gjorde

Skrevet 02.10.2026. **Konklusjonen i første utgave av dette dokumentet var
feil.** Den sa at KPI-en ikke blir målt. Det er ikke påvist, og måten jeg
målte på var feil. Hele notatet står som det er, fordi feilen er lærerik.

## Det jeg trodde

Jeg målte at `takk_page_view` legges i dataLayer på `/takk`, men aldri sendes
til GA4 — GA4 mottar bare `page_view` og `user_engagement`. Jeg konkluderte
med at en tagg i GTM var brutt, og at den eneste KPI-en ikke telles.

## Hvorfor det var feil

Det står i koden, i `TakkHendelse.tsx`, skrevet 27.09.2026:

> **ADVARSEL, AVKLART 27.09.2026: IKKE LAG EN GTM-UTLØSER PÅ DENNE HENDELSEN.**
> Denne pushen er i dag uten mottaker. Ingen utløser i GTM-containeren lytter
> på `takk_page_view` — det er verifisert i både publisert kode og i
> grensesnittet.
>
> Nøkkelhendelsen finnes likevel, og den er ekte. Den lages INNE I GA4, som en
> «opprettet hendelse» avledet av page_view.

At hendelsen ikke sendes til GA4 er altså **meningen**. Den lages av GA4 selv,
av en vanlig sidevisning, på tre betingelser:

    event_name      contains  page_view
    page_location   contains  takk
    page_referrer   contains  reflektor.no

Jeg målte om en tagg fyrte. Den taggen skal ikke finnes. Jeg testet dessuten
ved å gå rett til `/takk`, altså uten referrer — da kan betingelsen aldri
være oppfylt, uansett hvor friskt oppsettet er.

## Hva som faktisk er kontrollert nå

| Ledd | Status |
|---|---|
| Skjemaet sendes inn | ✅ tre vellykkede innsendinger i dag (303 fra `/api/skjema`) |
| `/takk` serveres | ✅ i serverloggen |
| **Referreren overlever POST → 303** | ✅ `document.referrer` på `/takk` er `/kontaktoss` |
| `page_location` inneholder «takk» | ✅ |
| `page_referrer` inneholder «reflektor.no» | ✅ følger av referreren over |
| GA4 mottar `page_view` fra `/takk` | ✅ målt på live med samtykke gitt |

Alle tre betingelsene GA4 trenger er altså oppfylt.

## Hvorfor tallene ser tomme ut i dag

GA4 henger etter på inneværende dag. Bevis: en sidevisning jeg selv utløste på
`/takk` på live-siden, med samtykke, var **ikke** i GA4 noen minutter senere.
Heller ikke som sidevisning. Fraværet av `takk_page_view` i dag sier derfor
ingenting — verken det ene eller det andre.

Hendelsen er registrert jevnlig til og med 01.10. Kontrolleres på nytt neste
dag.

## Hvorfor kodeløsningen IKKE skal lages

Pål ba om at hendelsen sendes rett fra koden som en reserve. **Det ville gjort
skade.** GA4 lager allerede `takk_page_view` av den samme sidevisningen. Sendes
den i tillegg fra koden, telles hver eneste lead to ganger.

Det er ikke en teoretisk fare. Kommentaren i `TakkHendelse.tsx` viser til at
versjon 36 av containeren ryddet opp i nøyaktig den feilen for Meta-taggen:
«Pause Meta Lead - fjerner dobbelttelling».

Pushen i dataLayer beholdes som et ufarlig krokpunkt, uten mottaker. Den skal
ikke kobles til noe.

## Det ene som faktisk kan ryke

`page_referrer contains reflektor.no`. Endres skjemaflyten slik at referreren
forsvinner — for eksempel ved å bytte POST + 303 mot en serverhandling —
slutter nøkkelhendelsen å bli laget, **uten at noe annet ser galt ut**. Det er
derfor `src/app/api/skjema/route.ts` står i fundamentlista i AGENTS.md.

Referreren er kontrollert i dag og overlever.

## Lærdommen

Kommentaren som forklarte alt sto i den filen saken gjaldt. Jeg målte først og
leste etterpå. Hadde jeg lest først, hadde jeg spart en gal konklusjon sendt
til kunden på lanseringsdagen.
