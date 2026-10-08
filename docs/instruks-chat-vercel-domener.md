# Instruks til Claude Chat: koble domenene i Vercel

Lim inn alt under streken i Claude Chat med Chrome-tilgang. Pål må være
innlogget i Vercel i nettleseren først.

Kontrollert mot Vercel 01.10.2026: prosjektet har i dag kun
`reflektor-ny.vercel.app`.

---

Du skal gjøre én ting i Vercel: legge til to domener på et prosjekt. Du skal
ikke gjøre noe annet, og ingenting utenfor Vercel.

## Dette skal du IKKE gjøre — les før du begynner

- **Ikke rør DNS noe sted.** Ikke hos domeneforhandleren, ikke i Squarespace,
  ikke i noe kontrollpanel. DNS er den eneste bryteren som faktisk flytter
  reflektor.no, og den skal ikke røres nå.
- **Takk nei hvis Vercel tilbyr å sette opp DNS automatisk.** Noen ganger
  dukker det opp en knapp som «Add DNS records» eller «Configure
  automatically». Ikke trykk på den.
- **Ikke logg inn på Squarespace.** Du har ingen ærend der.
- **Ikke rør miljøvariabler, deploys eller innstillinger ellers.** Ikke
  redeploy, ikke promote, ikke endre `NEXT_PUBLIC_TILLAT_INDEKSERING`.
- **Ikke slett `reflektor-ny.vercel.app`.** Den skal bli stående.
- **Hvis Vercel sier at `reflektor.no` allerede er i bruk i et annet prosjekt
  eller team** og tilbyr å flytte det: stopp, ikke bekreft, og si fra til Pål.

## Oppgaven

1. Gå til <https://vercel.com/reflektor/reflektor-ny/settings/domains>

2. Legg til **`www.reflektor.no`** først. Dette er hoveddomenet — nettstedets
   kanoniske adresser er skrevet med `www`, og dagens reflektor.no sender
   allerede trafikk dit. Det skal stå som produksjonsdomene, ikke som en
   omdirigering.

3. Legg til **`reflektor.no`**, og sett den til å **omdirigere til
   `www.reflektor.no`**. Vercel spør om dette i dialogen når du legger den
   til. Velger du feil retning, snur du en omdirigering som har stått i årevis.

4. Hvis Vercel foreslår en annen oppsett-variant enn dette, velg den som gir
   `www.reflektor.no` som primær og `reflektor.no` som omdirigering dit.

## Hva som er riktig resultat

Begge domenene skal stå i lista med en **advarsel om at DNS ikke peker hit** —
typisk «Invalid Configuration» eller «Nameservers / A record misconfigured».

**Det er riktig, og det skal du ikke rette.** DNS peker fortsatt på
Squarespace med vilje. Domenene legges inn nå slik at Vercel har sertifikat og
oppsett klart den dagen DNS faktisk flyttes. Ikke prøv å få advarselen til å
forsvinne.

## Rapporter tilbake

Når du er ferdig, gi Pål:

1. Bekreftelse på at begge domenene står i lista, og hvilken som er primær.
2. Den nøyaktige statusteksten Vercel viser for hver av dem.
3. **De DNS-oppføringene Vercel sier kreves** — A-record-adressen for
   `reflektor.no` og CNAME-verdien for `www.reflektor.no`, ordrett. Bare les
   dem av og skriv dem ned. Ikke legg dem inn noe sted.
4. Et skjermbilde av domenesiden.

Punkt 3 er det viktigste du leverer. Det er de verdiene som skal brukes den
dagen DNS flyttes, og de skal ligge nedskrevet før den dagen.

## vercel.app-adressene, 08.10.2026

Tre vercel.app-adresser serverte hele nettstedet med 200, og GTM, GA4,
Clarity og Meta-pikselen fyrte der. Besøk — også våre egne tester — havnet
i statistikken og i Meta-målgruppene.

**Gjort:** Deployment Protection → Vercel Authentication er satt fra «Only
Preview Deployments and Production Deployment URLs» til **«Standard
Protection»** (`all_except_custom_domains`). Det stengte to av de tre:

| Adresse | Før | Etter |
|---|---|---|
| `reflektor-ny-reflektor.vercel.app` | 200 | 302 til Vercel-innlogging |
| `reflektor-ny-git-claude-…-reflektor.vercel.app` | 200 | 302 til Vercel-innlogging |
| `reflektor-ny.vercel.app` | 200 | **fortsatt 200** |
| `www.reflektor.no` | 200 | 200 — urørt |
| `reflektor.no` | 308 | 308 — urørt |

**Hvorfor den tredje ikke ble stengt.** «Standard Protection» unntar alle
*produksjonsdomener* på prosjektet, ikke bare dem på vårt eget domene.
`reflektor-ny.vercel.app` står som et verifisert produksjonsdomene i
prosjektet, på linje med www.reflektor.no, og går derfor fri. Kontrollert
med curl flere minutter etter at innstillingen var endret.

**Det som gjenstår, og som må gjøres for hånd:** Vercel → Project
`reflektor-ny` → Settings → Domains → `reflektor-ny.vercel.app` → Edit →
«Redirect to» `www.reflektor.no`, 308. API-et som er tilgjengelig herfra
kan legge til og liste prosjektdomener, men ikke endre et som finnes.

**Ingen risiko for jobben.** Cron-jobben i `vercel.json` kjøres av Vercel
selv og går utenom Deployment Protection. Den traff allerede en
utrullings-URL som var beskyttet før denne endringen, og fortsatte å virke.
