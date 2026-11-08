# Kildeetiketter — hele lista

Etiketten står først i HubSpot-feltet `nettside_kilde` og først i
lead-e-posten til Pål. Den skal kunne leses på en telefon på to sekunder:
hvor kom denne henvendelsen fra?

Lista er skrevet 08.11.2026 ved å lese `src/lib/kilde.ts`, ikke fra
hukommelse. **Endrer du reglene, oppdater denne fila i samme commit.**
Testene i `tests/kilde.test.ts` er fasiten; denne fila er oversikten.

## Dette er ikke «Hvor hørte du om oss?»

`nettside_kilde` er den tekniske kilden, målt av oss: UTM, klikk-ID,
referrer og landingsside. `hort_om_oss` er det leadet selv svarer i
nedtrekket. De to er ofte uenige, og det er poenget.

## Rekkefølgen avgjør

Koden går gjennom reglene ovenfra og ned og stopper på første treff. Står en
regel feil sted, forsvinner en hel trafikkilde inn i en annen — det skjedde
med Gemini, som ble talt som «Google søk» fram til 08.11.2026 fordi
`gemini.google.com` slutter på `.google.com`.

| # | Etikett | Når |
| --- | --- | --- |
| 1 | **Google Ads** | `gclid`, `gbraid` eller `wbraid` i adressen, eller Google-kilde med betalt medium |
| 2 | **ChatGPT-annonse** | `chatgpt` eller `openai` i `utm_source`, uansett medium |
| 3 | **Meta-annonse** | `utm_medium=paid_social`, eller `fbclid` med betalt medium |
| 4 | **Bing Ads** | `msclkid` i adressen |
| 5 | **E-post/nyhetsbrev** | `utm_medium` er email/e-post/newsletter/nyhetsbrev, eller `_hsenc`, `_hsmi`, `mc_eid` |
| 6 | **ChatGPT (organisk)**, **Perplexity (organisk)**, **Copilot (organisk)**, **Gemini (organisk)** | referreren er assistenten **og** ingen `utm_source` er satt |
| 7 | **Google søk**, **Bing søk** | Google- eller Bing-kilde uten betalt merking |
| 8 | **Instagram**, **Facebook**, **LinkedIn**, **TikTok** | kilden eller referreren peker dit. Med `utm_content=link_in_bio`: «(lenke i bio)» |
| 9 | **Direkte** | ingen UTM og ingen referrer |
| 10 | **Annet: `<kilde eller nettsted>`** | alt som ikke traff noe over |

Google Ads står først fordi klikk-ID-en settes av Google selv.
ChatGPT-annonsen står rett under, og over resten, fordi alt under den
bygger på annonsørens egne `utm_source`-verdier — og ingen ekte Meta-lenke
har `chatgpt` som kilde.

## Betalt medium

`cpc`, `ppc`, `paid`, `paidsearch`, `paid_search`, `paid-search`,
`paidsocial`, `paid_social`, `paid-social`, `cpm`, `display`,
`retargeting`.

## Resten av strengen

Etter etiketten følger det som faktisk sto i adressen: `source=`,
`medium=`, `campaign=`, `content=`, `term=`, klikk-ID, `ref:` og til slutt
`landet på:`. Verten gjentas ikke når etiketten alt forklarer den —
«ChatGPT (organisk) | ref: chatgpt.com» er samme ord to ganger. Hele
strengen har tak på 250 tegn.

## Verifisert mot produksjon

08.11.2026, ekte innsending gjennom annonselenken på www.reflektor.no:

```
ChatGPT-annonse | source=chatgpt | medium=paid | campaign=some-abonnement-2026-11 | content=fastpris | landet på: /
```

Samme streng i kontaktens `nettside_kilde` i HubSpot (portal 148641188).
