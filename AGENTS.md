<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reflektor

Ny nettside for reflektor.no. Next.js (App Router) på Vercel, norsk språk.

**Les `docs/kontekst.md` før du gjør endringer.** Prosjektkontekst hører hjemme
der – ikke i en chat, som ingen ny sesjon kan arve.

## Eneste KPI: skjemaleads

Leads måles i GA4 (`takk_page_view` på `/takk`) og Google Ads. Ikke i Ahrefs.
Trafikk, rangeringer og synlighet er ikke mål i seg selv. Vurder enhver endring
mot om den gir flere utfylte skjemaer.

## Fire ting som er lett å ødelegge

1. **Live URL-er flyttes ikke.** Redirects skal kun rette opp faktiske 404-er.
   `/sosiale-medier-byra`, `/innholdsproduksjon`, `/reklamefilm` og
   `/kontaktoss` er live sider det annonseres mot. Første utkast redirigerte to
   av dem bort og ville sendt betalt trafikk i grøfta. Sjekk at en URL faktisk
   er død før du legger inn en redirect.

   **Unntak, bestilt 15.09.2026:** `/sosiale-medier-byra` skal 301-es til `/`
   — men først på cutover, og først etter at Google Ads har byttet endelig
   URL. Ikke utført. Se `docs/cutover.md`, som også forklarer hvorfor unntaket
   ikke opphever regelen for de tre andre.
2. **`/takk` er hellig.** URL-en og GA4-hendelsen bærer 107+ historiske
   konverteringer. Endrer du dem, mister Reflektor målingen av sin eneste KPI.
3. **Bloggslugs i `src/content/site.ts` må ikke endres.** Bloggen beholdes for
   lenkeverdien – ~481 refererende domener. Men innholdet er ordbok- og
   skoleoppgavestoff som ikke konverterer: det skal ikke styre arkitekturen, og
   det skal ikke lages mer av den typen.
4. **Bloggtekstene er ikke migrert fra Squarespace.** Siden kan ikke lanseres
   før de er det.

## Ahrefs-data må leses med forbehold

Tallene er estimater og etterslepende, GSC er ikke koblet til, og alt som er
bygget i 2026 har ennå ingen tall. Fravær av data er ikke bevis på fravær av
verdi. Bruk Ahrefs til å finne URL-er med lenker som må redirigeres – ikke til
å avgjøre hva siden skal handle om.

## Praktisk

- Alt tekstinnhold bor i `src/content/site.ts`, ikke i komponentene. Felt merket
  UAVKLART er plassholdere som ikke er godkjent av kunden.
- Redirect-kartet ligger i `next.config.ts`.
- Nettverksnivået er **Custom** (satt 15.09.2026). reflektor.no, Dropbox-
  innhold, vercel.app og researchkildene er åpne. Det betyr at dagens side kan
  leses direkte, og at media kan hentes fra Dropbox — se `docs/media.md`.
  Nivået leses ved sesjonsstart; endres det tilbake til Trusted, faller begge
  deler bort igjen.

## Ingenting skal gå live

Den nye siden bygges parallelt med at reflektor.no kjører videre på
Squarespace. Se `docs/forhandsvisning.md`.

- **Rør aldri DNS eller Squarespace.** Det er den eneste bryteren som faktisk
  flytter reflektor.no.
- **Indeksering er avslått som standard** (`src/lib/miljo.ts`). Alle sider
  serverer `Disallow: /` og `noindex`. Sperren åpnes kun ved å sette
  `NEXT_PUBLIC_TILLAT_INDEKSERING=true`, og først når DNS peker hit. Ikke fjern
  sperren for å «teste at SEO virker».
- **Arbeid på branch**, ikke `main`. Push til `main` utløser produksjonsdeploy.

## Omstart 15.09.2026 — design bygges fritt

Sidekomposisjonene ble revet. Fundamentet står. Bakgrunnen: den forrige
versjonen var forankret i dagens Squarespace-side på uttrykk, seksjons-
rekkefølge og copy, og det ga en side som etterlignet i stedet for å
konvertere.

**Briefens låsing av struktur gjelder ikke lenger.** Kapittel 6
(seksjonsrekkefølge), 9.1 (copy-rekkefølge) og 3.0.1 (forsidens seks
seksjoner) er satt til side. Seksjoner, sidelengde, antall sider og
navigasjon bestemmes ut fra hva som gir flere utfylte skjemaer.

**Disse låste rammene fra kapittel 0.3 består:**

- Pris skrives «30 000 kr/mnd», aldri med mva-notasjon
- Tre måneders oppsigelse, ingen bindingstid — begge eksplisitt på
  abonnementssiden
- Kontaktskjema → `/takk` er eneste inbound-strøm
- KPI er skjemaleads. Trafikk er ikke et suksessmål
- Produksjonskunder navngis aldri som SoMe-abonnenter
- Ikke finn på copy, tall, kundenavn, priser eller resultater

Briefen er fortsatt gyldig på søkeordsfordeling, avatarer og copy-protokollen:
Claude Code ber om copy, skriver den ikke selv. Manglende tekst er `TBD(...)`.

## Fundamentet som ikke skal rives

Dette er designuavhengig og dyrt å gjenskape. Rør det kun med grunn:

| Hva | Hvorfor |
|---|---|
| `next.config.ts` | Redirect-kartet er bygget på faktiske visningstall fra Search Console, ikke på crawl-data. `/tjenester/produktfoto` alene har 1 935 visninger. |
| `src/app/api/skjema/route.ts` | POST med 303 gir ekte sidelasting på `/takk`. En serverhandling ville gitt klientside-navigasjon og drept GTM. Se A28. |
| `src/components/Sporing.tsx`, `TakkHendelse.tsx` | GTM-N4KGSS93 og GA4-hendelsen. 107+ historiske konverteringer henger på dem. |
| `src/lib/lead.ts` | Leadlevering på e-post. Verifisert ende-til-ende. |
| `src/lib/miljo.ts` | Indekseringssperren. |
| `src/components/Schema.tsx` | JSON-LD. Usynlig, men bærer entitetssignalene. |
| `scripts/` + CI | `content:check` og lenkesjekk. Begge verifisert i to retninger. |
| `src/styles/tokens/` | Merkevaren, ikke layouten. |
| `docs/` | Analysene. Å gjenskape dem koster dager. |

## Hva synligheten faktisk krever

Fire ting, ingen av dem visuelle:

1. **Adressene må finnes** — ruting, ikke design
2. **Bloggtekstene må overleve på sine URL-er** — kun bloggmalen
3. **`/takk` må være ekte sidevisning i samme GTM-container**
4. **NAP og Organization-schema må være konsistente** — bunntekst og markup

Alt annet står fritt: layout, farger, typografi, seksjoner, sidelengde,
bildebruk, navigasjon. Synlighet og design henger nesten ikke sammen.

## Arbeidsmåte: ferdig betyr ferdig

Bestilt 28.09.2026, etter at flere oppgaver kom inn mens én var i arbeid:
«gjør alle oppgaver du får 100%, og ikke forhast deg fordi to-do-listen blir
større. jeg har god tid, og kvalitet på det du gjør er avgjørende».

Det er en rangering, og den er entydig: **kvalitet slår tempo, alltid.**
Praktisk betyr det:

- **En voksende kø er ikke en grunn til å skynde seg.** Kommer det tre nye
  oppgaver mens du holder på med én, blir den første ikke mindre viktig av
  det. Gjør den ferdig først.
- **Ferdig inkluderer kontrollen.** Typesjekk, lint, tester og bygg i begge
  prosjektene — og for alt som har et utseende: se på det i en ekte
  nettleser før du sier det er gjort. Flere feil i dette prosjektet er
  funnet i skjermbildet, ikke i koden.
- **En endring gjelder alle stedene den finnes.** Samme setning står ofte i
  både `src/content/site.ts` og en rubrikk under `intern/src/content/`, og
  noen ganger i en malinstruks i tillegg. Søk opp alle forekomster før du
  sier deg ferdig; to steder som sier ulike ting er verre enn to steder som
  begge er utdaterte.
- **Si hva som IKKE er gjort.** Blir noe stående halvferdig, skal det stå i
  svaret med rene ord. Et «ferdig» som ikke holder, koster mer enn en
  ærlig rest.

## Copy: unngå byråvås

Bestilt 28.09.2026. Teksten skal bygge intern troverdighet, og da er
selgende formuleringer det dyreste som kan stå der. Disse mønstrene er
luket ut og skal ikke tilbake:

- **Abstrakt substantiv som helt**: «Ærligheten er salgsargumentet — ikke et
  forbehold vi helst skulle vært foruten.» Skriv konsekvensen i stedet: «En
  kunde som vet hva hen ikke får, blir sjeldnere skuffet tre måneder ut.»
- **Superlativ uten dekning**: «den mest effektive kombinasjonen som
  finnes». Si hva den faktisk gjør, ikke hvor den rangerer.
- **Samme retoriske figur om igjen**: «den billigste X som finnes» sto fire
  steder. Gjentakelsen er i seg selv det som avslører maskinskrevet tekst.

Tankestrek-antitesen er IKKE forbudt. «Ring — ikke send melding og vent» er
konkret instruks, og «spør kundeansvarlig før du filmer — ikke etter» sier
noe man kan handle på. Det er den tomme varianten som skal bort: den som
roser oss i stedet for å si hva som skjer.
