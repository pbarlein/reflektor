# Konverteringen telles ikke i GA4 etter cutover

Funnet 02.10.2026, etter at Pål hadde fylt ut kontaktskjemaet manuelt.
**Dette er den eneste KPI-en nettstedet har.**

## Hva som er galt

`takk_page_view` legges i dataLayer på `/takk`, men **sendes aldri til GA4.**
Ingen tagg i GTM-containeren gjør hendelsen om til en GA4-hendelse.

Målt på live-siden, i en ny nettleser, med samtykke gitt og uten blokkering:

    Hendelser GA4 faktisk mottar fra /takk:  user_engagement, page_view
    takk_page_view sendt:                    NEI

## Hvorfor det ikke er vår kode

Hele kjeden fram til Google er kontrollert og virker:

| Ledd | Status |
|---|---|
| Skjemaet sendes inn | ✅ 3 vellykkede innsendinger i dag (303 fra `/api/skjema`) |
| `/takk` serveres | ✅ 10 treff i serverloggen siste seks timer |
| `takk_page_view` i dataLayer | ✅ ligger der, etter `gtm.js` — riktig rekkefølge |
| GTM lastet | ✅ `GTM-N4KGSS93` og `G-1QJ6BRWGJ8` begge aktive |
| GTM behandler dataLayer | ✅ `gtm.dom` og `gtm.load` følger etter |
| GA4 mottar hendelsen | ❌ **bare `page_view` og `user_engagement`** |

Bruddet sitter altså mellom dataLayer og GA4 — det vil si **inne i
GTM-containeren**, som koden her ikke kan røre.

## Hva tallene viser

GA4 for Reflektor (eiendom 317376140), hentet via Supermetrics:

    01.09  takk_page_view  1
    02.09  takk_page_view  1
    03.09  takk_page_view  1
    24.09  takk_page_view  1
    29.09  takk_page_view  1
    30.09  takk_page_view  2
    01.10  takk_page_view  1
    02.10  (ingen)

Alle de tidligere står på **Squarespace-siden**. 02.10 er første dag på
Vercel, og da slutter hendelsen. Sidevisninger registreres samme dag, så det
er ikke forsinkelse i GA4 — data flyter, hendelsen mangler.

## Mest sannsynlige årsak

Containeren har en samtykketagg som fyrer på klikk på et element hvis tekst
inneholder **«ACCEPT»** — den er arvegods fra Squarespace-banneret, og står
som punkt 9 på cutover-lista. Den nye sidens knapp heter **«Godta alle»** og
treffer aldri.

Er konverteringstaggen satt opp med krav om samtykke som bare den utløseren
gir, vil den aldri fyre på den nye siden. Det passer med at `page_view`
kommer fram (konfigurasjonstaggen er ikke sperret) mens konverteringen ikke
gjør det.

Dette er en hypotese. Den kan bekreftes eller avkreftes på to minutter inne i
GTM, og den kan ikke undersøkes herfra.

## Hva Pål må sjekke i GTM

1. Finnes det fortsatt en tagg som sender GA4-hendelsen `takk_page_view`?
2. Hvilken utløser har den — og matcher den fortsatt?
3. Har taggen «Require additional consent», og i så fall hvilken?
4. Rydd «ACCEPT»-utløseren, som uansett står på lista.

## Hvis taggen er borte

Da kan hendelsen sendes rett fra koden i stedet for gjennom containeren.
**Det må ikke gjøres samtidig som taggen finnes i GTM** — da telles hver lead
to ganger, og KPI-en blir like gal den andre veien.

## Imens

Leads går ikke tapt. De kommer fram på e-post, og `kilde`-feltet forteller
hvor de kom fra. Det som mangler er tellingen i GA4 og Google Ads.
