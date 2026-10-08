# SEO-oppfølging etter lansering — 08.10.2026

Bestilt av Pål: «gjør så mye du kan av alle punkter som ikke krever meg».
Utgangspunktet var en revidert tiltaksliste, laget etter en gjennomgang av
alt i `docs/` og AGENTS.md. Her står hva som ble gjort, hva som ble funnet,
og hva som gjenstår.

## Search Console (kontrollert i grensesnittet)

- **Alle viktige sider er indeksert.** Forsiden, alle sju tjenestesidene og
  de nye artiklene som ble kontrollert (produksjonsdag, frilanser eller
  ansatt, hva koster reklamefilm, hva koster eventfotograf, hva er reklame,
  kjeder-artikkelen). Indeksering er altså ikke flaskehalsen.
- **Ny gjennomgang bedt om** for forsiden, `/kjeder`, `/reels-produksjon`,
  `/reklamefilm`, `/videoproduksjon-i-oslo`, `/employer-branding-video-oslo`,
  `/eventfotograf-eventvideo` og `/innholdsproduksjon` — sidene der
  innhold eller videomarkering er endret siden forrige gjennomsøking.
- **Validering startet** for de tre videofeilene som ble rettet i dag:
  «Missing field uploadDate» (7), «Invalid object type for field creator» (8)
  og «Missing field description» (2).
- **To varsler gjensto:** «uploadDate is missing a time zone» og «Invalid
  datetime value» på Soulcake-omtalen (sto som `2026-10-01`). Rettet i
  koden i dag — validering må startes etter at den er ute.
- **«Video isn't on a watch page» (20)** er forventet og ikke en feil. Filmene
  er støtte til sidene, ikke egne filmsider. Ingen handling.
- **48 sider «Not found (404)».** De nyeste (3.–5. okt.) er filstier uten
  endelse, som `/reels/soulcake` og `/arbeid/kjeder-egon`. Googlebot plukker
  dem ut av sidens egne data (`"sti":"/arbeid/kjeder-egon"`) og prøver dem
  som adresser. 404 er riktig svar, og det skader ikke. Resten er gamle
  Squarespace-adresser sist sjekket før cutover, som nå videresendes.
- **«Crawled – currently not indexed» (10)** er skriftfiler, favicon og
  RSS-feeden. Riktig at de ikke indekseres.

## Google-bedriftsprofilen

Profilen er verifisert og nesten komplett: tre kategorier (Markedsføringsbyrå
primær, Videoproduksjonstjeneste, Internettmarkedsføring), utfylte tjenester
med priser, riktig adresse, telefon, nettsted og sosiale profiler. 11
anmeldelser, snitt 5,0. Det eneste Google ber om er et utebilde av
lokalet — det krever et bilde fra Pål.

- **Beskrivelsen er rettet.** Den nevnte produktfoto, som er avviklet (Pål
  19.09.2026). Nå står det «reklamefilm for TV og nett, bedriftsfilm,
  employer branding-video og eventvideo». Resten er urørt. Endringen
  venter på Googles godkjenning (vanligvis ti minutter).
- **Ikke endret, men bør vurderes av Pål:** tjenesten «Produktfoto og
  produktfilm» ligger fortsatt i profilen.
- **Anmeldelseslenken** er `https://g.page/r/CSgp3apZmTKZEBM/review`.

## AI-søk: utgangspunktet (Google AI-modus, 08.10.2026)

Kjørt fra Påls innloggede konto, så svarene kan være påvirket av hans egen
søkehistorikk. Leses som en grov pekepinn, ikke en måling.

| Spørsmål | Reflektor nevnt? |
|---|---|
| Byrå i Oslo for månedlig SoMe-innhold til fast pris | Ja, først, med pris og hva som ikke inngår |
| Hvem lager Reels for bedrifter til fast pris i Norge | Ja, først i tabellen, lenke til `/reels-produksjon` |
| Markedssjef i butikkjede trenger løpende SoMe-innhold | Ja, som nummer tre blant spesialistene — kilde Ocast, ikke `/kjeder` |
| Hvem lager reklamefilm og bedriftsfilm i Oslo, hva koster det | Ja, først, med Peppes og «fra 40 000 kr» |
| Hva koster et SoMe-byrå i Norge | **Nei.** Prisguiden vår blir ikke sitert |

Kjedetesten er en klar forbedring fra 29.09 (A72), da Reflektor ikke kom med.
Men kjedesiden selv ble ikke brukt som kilde, og kjedekundene ble ikke nevnt.

## Endret i koden

- **`sameAs`** har fått Google-bedriftsprofilen (kart-ID fra profilen) og
  Proff-profilen (org.nr. 926 974 270, lenker tilbake til reflektor.no).
- **Soulcake-omtalens `uploadDate`** har fått klokkeslett og tidssone, etter
  regelen i `docs/videodatoer.md` (bare dato kjent → kl. 12:00).
- **Faktafeil i «Hva er reklame?»:** kravet om at markedsføring skal framstå
  som markedsføring står i markedsføringsloven **§ 28** (siden 01.10.2023),
  ikke § 3. § 3 handler om dokumentasjon av påstander. Kontrollert mot
  Lovdata i nettleseren. Teksten, kildeboksen og lenken er rettet, og
  artikkelen har fått `oppdatert` 08.10.2026.
- **Sitemapet:** sju sider har fått 08.10 som endringsdato, slik at IndexNow
  melder fra om videomarkeringen som ble rettet i dag.
- **AGENTS.md og kontekst.md** sa at Search Console ikke er koblet til. Det
  er det. Rettet.

## Sjekket og funnet allerede i orden

- **Lenker fra bloggen til forsiden med «SoMe-byrå».** Forrige tiltaksliste
  sa at tre artikler nevner ordet uten å lenke. Det var feil telling: alle
  forekomstene står allerede inne i en lenketekst eller i «Fra
  Reflektor»-boksen.
- **Eksakt lenketekst «innholdsproduksjon» fra «Hva er innholdsproduksjon?».**
  Ordet står ikke med liten forbokstav i brødteksten noe sted, og regelen er
  at lenker bare legges rundt ord som allerede står der. Ikke gjort.
- **Prissammenligning som tabell med Byråmatch som kilde** og
  **Wyzowl-tallene** — begge allerede ordnet.

## Gjenstår, og krever Pål

- Den dupliserte avslutningen i fire gamle artikler (krever ny copy).
- Utebilde av lokalet til bedriftsprofilen.
- Bing Webmaster Tools: krever innlogging med en Microsoft- eller
  Google-konto og oppretter en ny konto. Det skal Pål gjøre selv
  (importer fra Search Console, fem minutter).
- Russemerch-case, kundesitater og flere anmeldelser (utkast laget i Gmail).
- Facebook-siden har fortsatt den gamle beskrivelsen («Sterke bilder,
  engasjerende video …») som vises i Google-søk på merkenavnet.

## Ikke gjort, med vilje

- **Nedskalering av galleriklippene.** Filene deles med `/reels-produksjon`,
  der de vises større, og målebrowseren her mangler H.264 og kan ikke
  kontrollere at klippene ser riktige ut. Se `ytelse-runde-5.md`.
