# Reflektor – kontekst for nettsidearbeidet

Dette dokumentet er prosjektets hukommelse. Alt vi vet om Reflektor, dagens
nettside og valgene bak den nye, skal ligge her – ikke i en chat.

> **Hvorfor:** kontekst i et Claude-prosjekt eller en samtale kan ikke arves av
> nye sesjoner eller nye folk. Kontekst i repoet kan det.

## Status per 2026-08-22

- [x] Analyse av dagens reflektor.no (via Ahrefs – se under)
- [x] Next.js + Vercel-oppsett
- [x] Informasjonsarkitektur og redirect-kart
- [ ] **Strategi, tone of voice, budskap og visuell profil** – ikke mottatt ennå
- [ ] Endelig tekst og design
- [ ] Innhenting av eksisterende bloggtekster fra Squarespace

## Om selskapet

Reflektor er et SoMe- og innholdsbyrå i Oslo.

Posisjoneringen slik den står i dagens title-tag:

> Reflektor – strategi, innhold og publisering til fast pris

«Til fast pris» er det tydeligste differensieringspunktet vi kan lese ut av
dagens side, og bør vurderes videreført. Byrået har en egen bloggartikkel om
prismodeller i bransjen (`/blogg/hva-koster-et-some-byra`), noe som tyder på at
pristransparens er et bevisst strategisk valg.

Navngitte personer på dagens side: Magne Finseth da Fonseca, Viktor Norén.
Navngitt kunde med publisert case: Egon.

**Tjenesteområder** (utledet av URL-er og titler):
innholdsproduksjon, videoproduksjon, employer branding-video, event­foto og
-video, sosiale medier, foto (produkt, bedrift, portrett).

**Åpenbare hull i det vi vet** – må fylles av deg:
tone of voice, visuell profil, fargepalett, logo, fonter, kundeliste,
priser/pakker, målgruppe og ICP, konkurrentbilde.

## Teknisk utgangspunkt

Dagens side kjører på **Squarespace**. Bevis: `/cart`, `?format=rss` og
paginering via `?offset=`.

Ny side: **Next.js (App Router) på Vercel**.

## SEO-situasjonen

Tall fra Ahrefs, Norge, 2026-08-22:

| Metrikk | Verdi |
|---|---|
| Organiske søkeord | 31 |
| Organisk trafikk | ~108/mnd |
| Plasseringer i topp 3 | 10 |
| Betalt trafikk | 0 |

### Det avgjørende poenget

Forsiden rangerer **kun** på merkevaresøket «reflektor» (posisjon 1, 200
søk/mnd, 31 besøk). All annen organisk trafikk kommer fra bloggen.

Det betyr to ting for relanseringen:

1. **Bloggen er hele SEO-verdien. Slugs må bevares uendret.**
2. **Tjenestesidene har ingen rangeringer å miste.** Der står vi helt fritt til
   å bygge en ny struktur.

### Sider som bærer trafikk

| Side | Trafikk/mnd | Toppsøkeord | Pos. | Volum |
|---|---|---|---|---|
| `/` | 31 | reflektor | 1 | 200 |
| `/blogg/hvilke-virkemidler-er-mest-effektive-i-reklame-og-hvordan-brukes-de` | 14 | reklame virkemidler | 4 | 60 |
| `/blogg/hva-innebaerer-digital-historiefortelling` | 13 | digital historiefortelling | 1 | 40 |
| `/blogg/markedsforing-i-sosiale-medier-some` | 13 | some markedsføring | 6 | 150 |
| `/blogg/hvordan-markedsfore-bedrift` | 10 | markedsføring bedrift | 9 | 150 |
| `/blogg/hva-er-holdningskampanje` | 8 | holdningskampanjer | 4 | 50 |
| `/blogg` | 6 | virkemidler i reklame | 9 | 100 |
| `/blogg/hva-er-reklame` | 5 | reklame | 19 | 2200 |
| `/blogg/hva-er-innholdsmarkedsforing` | 4 | innholdsmarkedsføring | 7 | 350 |
| `/eventfotograf-eventvideo` | 2 | videograf | 10 | 150 |

### Uforløst potensial

Søkeord der Reflektor rangerer, men for lavt til å hente trafikk:

- **«reklame»** – 2200 søk/mnd, posisjon 19. Klart største enkeltmulighet.
- **«some»** – 3100 søk/mnd, posisjon 31.
- **«hva er some»** – 350 søk/mnd, posisjon 2 (men 0 trafikk – trolig spist av
  et SERP-element).
- **«innholdsmarkedsføring»** – 350 søk/mnd, posisjon 3.
- **«videograf»** – 150 søk/mnd, posisjon 10. Kommersielt relevant.

Merk at keyword difficulty er 0 på nesten alt av dette. Det er lavthengende
frukt.

## Feil på dagens side som relanseringen rydder opp i

Av 81 crawlede URL-er svarer under halvparten 200.

**404 på URL-er som burde fungert:**
`/kontakt`, `/kontakt-oss` (den ekte er `/kontaktoss`), `/foto`, `/folk`,
`/sport`, `/matogdrikke` med underssider (`/oda`, `/orkla`, `/wolt` – mulige
tapte kundecaser), `/vrt-arbeid`, `/forside-v2`, `/jon-sverre`.

**Hele `/tjenester/`-treet er dødt:** `seo`, `videograf`, `videoproduksjon`,
`markedsforing`, `innholdsproduksjon`, `some-annonsering`,
`konverteringsoptimalisering`, `betalt-sok`, `fotograf`, `matfotograf`,
`boligfoto` → alle 404. Tjenestesidene ligger i stedet spredt på rotnivå.

**Bugs:**
- `/magne-finseth-da-fonseca` og `/viktor-noren` har begge title «Contact 1 | Reflektor»
- `/blogg/hva-gjr-en-innholdsprodusent` har `<br/>` inne i title-tagen
- `/blogg` og `/blogg/` er duplikater (samme innhold, to URL-er)
- `/blogg/hva-gjr-en-innholdsprodusentnbsp` svarer 403
- Flere slugs mangler tegn: `hva-gjr-`, `videomarkedsfring` (manglende ø)

**Trafikkbærende sider ligger bak 301.** De fire bloggsidene som drar mest
ikke-brandtrafikk redirigerer allerede én gang. Nye redirects må peke til
endelig URL, ikke skape kjeder.
