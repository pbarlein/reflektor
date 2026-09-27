# Oppdrag til en chat med nettleser

Skrevet 27.09.2026. Dette er en ferdig prompt Pål kan lime inn i en
Claude-samtale som **har kontroll på Chrome** (eller et annet verktøy med
tilgang til de innloggede kontoene). Denne sesjonen kjører i en container i
skyen uten Google-profil og kommer ikke inn i GTM, GA4, Ads, Search Console,
Squarespace eller one.com.

**Les «Det vi allerede vet» før du limer inn** — den delen er med i prompten,
og den er der for at den andre sesjonen ikke skal utlede ting på nytt eller
motsi det som er målt.

---

## Det vi allerede vet, målt og verifisert

Dette trenger ingen å hente. Det er lest ut av åpne kilder 27.09.2026 uten å
sende én måling, og det lukker to av de største risikoene ved byttet.

**DNS ligger hos one.com, ikke hos Squarespace.**

| Post | Verdi | TTL |
|---|---|---|
| NS | `ns01.one.com`, `ns02.one.com` | 14400 |
| A (reflektor.no) | `198.185.159.144/145`, `198.49.23.144/145` (Squarespace) | 3600 |
| www | CNAME `ext-cust.squarespace.com` | 3600 |
| MX | Google Workspace (`aspmx.l.google.com` m.fl.) | 3600 |
| TXT | `v=spf1 include:_spf.google.com ~all` | 3600 |
| TXT | `google-site-verification=2pMbMPOPnQDsDXTxmJd4lvf4zihwQf_JC757eWmiyMs` | 3600 |

**To risikoer er dermed lukket:**

1. **E-posten er trygg.** Google Workspace hentes via MX-postene. Byttet
   krever bare at A- og CNAME-postene endres — nameserverne skal **ikke**
   røres. Da er e-post uberørt. (Den klassiske katastrofen ved plattformbytte
   er å flytte nameservere og miste e-posten. Den gjør vi ikke.)
2. **Search Console-verifiseringen overlever.** Den ligger som en TXT-post i
   DNS, ikke som en fil på Squarespace. Den blir stående gjennom byttet.

**GTM-containeren GTM-N4KGSS93, lest som publisert kode:** 13 tagger. GA4
`G-1QJ6BRWGJ8`, Ads-konvertering `11026823614`, Conversion Linker, en
samtykkemal i to instanser, og tre tagger uten samtykkekontroll: Apollo
(`67f7a7f9f3af070015ab21b2`), Microsoft Clarity (`rkgf0frfdt`), HubSpot
(`148641188`).

**Meta-pikselen `572759520853896` og en Elfsight-widget lastes av Squarespace
direkte**, ikke av GTM. Microsoft Ads finnes ikke noe sted.

**Vercel-prosjektet `reflektor-ny`** har i dag bare `reflektor-ny.vercel.app`.
`reflektor.no` er ikke lagt til ennå.

---

## PROMPTEN — lim inn alt under streken

---

Du har kontroll på Chrome, og jeg er logget inn i Google Tag Manager, Google
Analytics, Google Ads, Search Console, Squarespace og one.com i den nettleseren.

Jeg bytter nettsiden reflektor.no fra Squarespace til en ny Next.js-side på
Vercel. Byttet er **ikke** gjort ennå. En annen Claude-sesjon bygger den nye
siden, men den kjører i skyen uten tilgang til kontoene mine, så den trenger
deg til å hente fakta og gjøre én endring.

**Absolutte regler:**

- **Endre ingenting i DNS hos one.com.** Bare les og rapporter.
- **Endre ingenting i Squarespace.** Bare les og rapporter.
- **Ikke publiser noe i GTM** uten at jeg har sett forhåndsvisningen og sagt ja.
- **Ikke fyll ut kontaktskjemaet** på reflektor.no. Det utløser en ekte
  konvertering i Ads-kontoen.
- Er du usikker på om noe er lesing eller endring: spør meg først.

Gjør dette i to faser. **Fase 1 er ren lesing** — gjør hele den først, og gi
meg rapporten. Fase 2 venter til jeg har lest rapporten.

---

### FASE 1 — bare lesing

**A. Google Tag Manager, container `GTM-N4KGSS93`**

1. Finnes det **upubliserte endringer** i arbeidsområdet? Hvis ja: hva er de?
   Dette er viktig — jeg har lest den publiserte containeren, og en
   upublisert endring ville gjort bildet mitt feil.
2. List **alle tagger** med navnet slik det står i grensesnittet, typen, og
   hvilke utløsere som er koblet til. Jeg har de interne ID-ene, men ikke
   navnene, og jeg trenger navnene for å kunne gi presise instruksjoner.
3. Samme for **alle utløsere** og **alle variabler**.
4. For de tre taggene Apollo, Clarity og HubSpot: hva står under
   **Advanced Settings → Consent Settings** i dag?
5. Hvilken **egendefinert mal** brukes til samtykke? Navn og forfatter.
6. Finnes det andre containere eller arbeidsområder i kontoen?

**B. Google Analytics 4, `G-1QJ6BRWGJ8`**

7. List alle **nøkkelhendelser** (key events / conversions). Er `generate_lead`
   blant dem? Finnes `takk_page_view` som hendelse i det hele tatt, og har den
   noen gang hatt data? **Dette er det viktigste spørsmålet i hele fase 1:**
   dokumentasjonen min sier at leads måles på `takk_page_view`, men GTM sender
   aldri den hendelsen. Jeg trenger å vite hva som faktisk har registrert de
   107+ historiske konverteringene.
8. Hvor lenge lagres data (**Data retention**)?
9. Er **Google signals** slått på?
10. Er GA4 **koblet til Google Ads-kontoen**?
11. Hvilke hendelser har faktisk data siste 12 måneder? Skjermbilde av
    hendelsesrapporten holder.

**C. Google Ads, konverterings-ID `11026823614`**

12. List alle **konverteringshandlinger**: navn, kilde (nettsted / GA4-import),
    status, og hvilken som er primær.
13. Hvor mange konverteringer er registrert siste 12 måneder, per handling?
14. Kontoen er pauset nå. For hver pausede kampanje og annonsegruppe: hva er
    **endelig URL**? Jeg trenger hele lista, fordi de må byttes ved overgangen.
15. Er **forbedrede konverteringer** (enhanced conversions) slått på, og
    hvordan er de satt opp?

**D. Search Console**

16. Er eiendommen en **domeneeiendom** (`reflektor.no`) eller en
    **URL-prefiks-eiendom** (`https://www.reflektor.no/`)? Eller finnes begge?
17. Hvilke **verifiseringsmetoder** er aktive? Jeg har funnet en TXT-post i
    DNS, men det kan finnes flere.
18. Hvilke **sitemaps** er sendt inn, og hva er status på dem?
19. Under **Innstillinger → Endring av adresse**: står det noe der fra før?

**E. Squarespace**

20. **Hele omdirigeringstabellen.** Innstillinger → Nettsted → URL-omdirigering
    (eller tilsvarende). Kopier hele lista, ordrett, med både kilde og mål.
    Dette er den mest verdifulle enkeltposten i hele oppdraget: jeg har
    rekonstruert den ved å prøve én adresse av gangen utenfra, og kan umulig
    ha funnet alle.
21. **All kodeinjeksjon**: Innstillinger → Avansert → Kodeinjeksjon. Både
    header, footer og eventuell ordre-bekreftelse. Kopier ordrett. Jeg vet om
    GTM, en Meta-piksel og en Elfsight-widget, men det kan være mer.
22. **Komplett sideliste**, inkludert sider som ikke ligger i navigasjonen, og
    alt som ligger i «ikke-koblede sider» eller papirkurven.
23. Er det noen **Squarespace-integrasjoner** slått på (Google Workspace,
    Meta, Mailchimp, e-handel, skjemalagring)?
24. Hva står under **Innstillinger → Domener**? Spesielt: eies domenet av
    Squarespace, eller er det bare koblet til?

**F. one.com — bare lesing, endre ingenting**

25. Skjermbilde eller avskrift av **hele DNS-sonen**. Jeg har lest de vanlige
    postene utenfra, men jeg ser ikke poster som ikke spørres direkte etter
    (f.eks. DKIM, DMARC, underdomener, verifiseringsposter for andre tjenester).
26. Hva er **laveste TTL** panelet tillater?
27. Ligger det **underdomener** her som peker et annet sted? Hvis noe som
    `mail.`, `shop.` eller `kurs.reflektor.no` finnes, må jeg vite om det.
28. Når **utløper domenet**, og er automatisk fornyelse på?

---

### FASE 2 — én endring, og bare etter at jeg har sagt ja

Ikke gjør dette før jeg har lest fase 1 og bekreftet.

I GTM, for hver av de tre taggene **Apollo**, **Microsoft Clarity** og
**HubSpot**:

1. Åpne taggen → **Advanced Settings** → **Consent Settings**
2. Velg **«Require additional consent for tag to fire»**
3. Legg til samtykketypen:
   - Apollo → `ad_storage`
   - HubSpot → `ad_storage`
   - Clarity → `analytics_storage`
4. Lagre. **La utløserne stå urørt.** Samtykkekontrollen blokkerer taggen
   uansett hvilken utløser som ber den fyre, og å fjerne «All Pages» er den
   vanligste feilen her.

Deretter, i **Preview / Tag Assistant** mot dagens reflektor.no:

5. Åpne siden uten å svare på cookiebanneret → alle tre skal stå under
   **«Tags Not Fired»** med begrunnelsen «Consent Not Granted»
6. Klikk **«ACCEPT»** i Squarespace-banneret → alle tre skal fyre
7. Last siden på nytt, uten å røre banneret → alle tre skal fyre igjen.
   **Dette steget er hele poenget.** Feiler det, er samtykket hengt på en
   hendelse i stedet for på tilstanden, og da er det satt opp feil.
8. GA4 og Ads-konverteringen skal oppføre seg **uendret** gjennom hele testen.

Vis meg resultatet av alle fire stegene. **Publiser ikke.** Jeg sier ja eller
nei etter at jeg har sett det.

---

### Slik vil jeg ha rapporten

Skriv den som ren tekst jeg kan lime rett inn i den andre sesjonen:

- Én overskrift per bokstav (A–F), og nummerering som følger spørsmålene
- **Ordrett avskrift** der jeg ber om det (omdirigeringstabellen,
  kodeinjeksjonen, DNS-sonen). Ikke oppsummer disse — jeg trenger dem
  bokstavelig.
- Si eksplisitt **«ikke funnet»** eller **«har ikke tilgang»** der det gjelder.
  En tom plass tolkes som at du ikke sjekket, og da må noen gjøre det igjen.
- Ikke gjett. Står det ingenting, skriv at det ikke står noe.

---

## Etter at rapporten er levert

Det den låser opp i denne sesjonen:

| Rapportpunkt | Hva jeg kan gjøre med det |
|---|---|
| 20 (omdirigeringstabellen) | Fullføre redirect-kartet — i dag er det rekonstruert utenfra, én adresse av gangen |
| 7 (nøkkelhendelser i GA4) | Avgjøre om `takk_page_view` skal beholdes, kobles opp, eller fjernes. Motsigelsen mellom AGENTS.md og containeren løses her |
| 21 (kodeinjeksjon) | Komplett liste over hva som forsvinner ved byttet |
| 14 (endelige URL-er i Ads) | Skrive den faktiske sjekklista for URL-byttet |
| 25, 27 (hele DNS-sonen) | Skrive byttet som en presis rekkefølge, med underdomener og e-post ivaretatt |
| 2, 3 (navn i GTM) | Gi instruksjoner som matcher det du ser på skjermen |
| 16–18 (Search Console) | Avgjøre om sitemap må sendes inn på nytt, og om adresseendring skal brukes |

## To ting som kan gjøres uavhengig av rapporten

1. **Legg `reflektor.no` til i Vercel-prosjektet `reflektor-ny`.** Det endrer
   **ikke** DNS og påvirker ikke dagens side — Vercel viser bare hvilke poster
   som skal settes når tiden kommer, og begynner å forberede sertifikat. Jeg
   har tilgang til å gjøre det, men det er en endring på produksjonsoppsettet,
   så jeg gjør det ikke uten at Pål sier fra.
2. **Senk TTL på A- og CNAME-postene til 300 sekunder**, minst et døgn før
   byttet. Da tar overgangen minutter i stedet for timer, og den kan rulles
   tilbake like raskt. Dette gjøres hos one.com, av Pål, og er den eneste
   DNS-endringen som er trygg å gjøre i forkant.
