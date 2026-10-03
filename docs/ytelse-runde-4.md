# Ytelsesmålingen 03.10.2026

Lighthouse mobil, median av tre kjøringer, mot live. Samme skript begge
ganger (`/tmp/claude-0/lh/kjor2.mjs`, 412×823, standard struping).

| | Før | Etter |
|---|---|---|
| Score | 67 | 73 |
| **Sidevekt** | **2 758 kB** | **1 165 kB** |
| FCP | 1,63 s | 1,18 s |
| LCP | 2,09 s | 2,36 s |
| TBT | 2 269 ms | 1 426 ms |
| CLS | 0,002 | 0 |

Vekten er under begge målene: 2 MB og 1,5 MB.

Enkeltkjøringene varierer mye — 67/79/63 før, 74/69/73 etter — så bare
medianen og vekten er til å stole på. Vekten er den eneste av tallene som
ikke svinger.

## Hva som utgjorde forskjellen

| Grep | Spart |
|---|---|
| Plakatbilder lastes først når flaten nærmer seg | ~600 kB |
| Omtalefilmene til `preload="none"` | ~350 kB |
| Alle 32 plakatfiler kodet på nytt | ~490 kB i repoet |
| Omtalefilmene kodet for formatet de vises i | 14,6 MB i repoet |
| Tre ubrukte fontvekter | ~45 kB og tre preload-lenker |

## Hva som er igjen, og hvem som eier det

De fem tyngste filene på forsiden nå:

```
196 kB  gtag.js            (Google Analytics)
161 kB  gtm.js             (Google Tag Manager)
114 kB  fbevents.js        (Meta)
104 kB  Meta signals/config
 72 kB  vår egen JS-pakke
```

**Sporingsstabelen er 618 kB og hele hovedtrådsproblemet.** Målt ved å
blokkere den og kjøre på nytt:

| | Med sporing | Uten sporing |
|---|---|---|
| Score | 73 | **97** |
| TBT | 1 426 ms | **130 ms** |
| Vekt | 1 165 kB | 461 kB |

Selve siden scorer altså 97. De 24 poengene ligger i GTM, GA4, Meta,
Clarity og HubSpot — og runde 4 sier uttrykkelig at de ikke skal røres.

## «Element render delay» — hva jeg fant, og hva jeg ikke fant

Observasjonen var 2,2 sekunder på heroens ingress. Jeg sjekket de tre
tingene som ble nevnt, og ingen av dem er årsaken:

- **Fontene.** Alle fire filene er ferdig lastet etter 552 ms, lenge før
  første maling på 1 162 ms. De lastes med `next/font`, `display: "swap"`
  og forhåndslasting. (Jeg kuttet likevel tre ubrukte vekter — det er en
  reell besparelse, bare ikke denne.)
- **Hydrering.** All vår JavaScript er nede etter 1 051 ms, og heroen er en
  serverkomponent uten klientkode.
- **Noe som skjuler teksten.** Det finnes ikke. Ingen opacity, ingen
  animasjon, ingenting som venter på et skript.

**Og det er ikke sporingen heller.** Med alt tredjepart blokkert er
forsinkelsen fortsatt 1 557 ms.

Forklaringen er at «render delay» for et TEKST-element per definisjon er
alt mellom serversvaret og malingen — det finnes ingen ressurs å laste, så
hele den kritiske veien havner i den ene bøtta. 37 % av den er TTFB
(629 ms). Resten er HTML-parsing, stilarket og layout under Lighthouse sin
simulerte struping.

Tallet svinger dessuten kraftig mellom kjøringer på samme side: jeg målte
929, 1 078 og 1 557 ms uten å endre noe imellom.

**Målet om under ett sekund er altså ikke nådd, og jeg har ikke funnet en
feil å rette for å nå det.** Den eneste posten med reell størrelse som er
igjen er TTFB.

## Heroklippet

`antonburst.mp4` er 1 011 kB og er nå den største enkeltfila på forsiden.
Den er ikke rørt:

- Den er allerede kodet hardt (CRF 33, åtte sekunder), verifisert mot
  CRF 31 uten synlig forskjell.
- En ny omkoding av den FERDIGE fila gir 896 kB ved CRF 34 og 738 kB ved
  CRF 36 — med generasjonstap på det elementet som males først.
- I målingene over rakk den uansett ikke å overføre mer enn noen titalls
  kilobyte før kjøringen stoppet.

Skal den ned, må den klippes på nytt fra masteren i Dropbox.
