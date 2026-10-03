# Lead-e-postene fra Påls egen Gmail

Bygget 04.10.2026. Erstatter HubSpot-arbeidsflyten «Lead-oppfølging –
presentasjon og booking» når Pål slår den av.

## Hvorfor

HubSpot sendte de to e-postene som markedsførings-e-post: egne
utsendelsesservere, `List-Unsubscribe`-header, omskrevne lenker for
klikksporing. **Gmail leste summen av det som masseutsendelse og la den i
«Reklame»-fanen.** Målt på en ekte test 03.10.2026. En presentasjon som
havner i Reklame-fanen er en presentasjon ingen ser.

Nå sendes de fra `pal@reflektor.no` gjennom Gmail, som vanlige e-poster fra
ett menneske til ett annet. De havner i Påls «Sendt», og svar kommer i samme
tråd.

## De to e-postene

**E-post 1** går med én gang. Emne: «*Bedrift* + Reflektor: SoMe-strategi,
produksjon og publisering». Presentasjonslenke, bookinglenke, signatur.

**E-post 2** er påminnelsen, og den er et **svar i samme tråd** — samme
emne med «Re:», med `In-Reply-To` og `References` til den første.

Ingen bilder, ingen knapper, ingen farger, ingen bunntekst, ingen
avmeldingslenke, ingen sporing. Signaturen står i
`font-family:"Helvetica Neue";font-size:13px`, som i Påls egen Apple Mail.
Testene i `tests/leadepost.test.ts` feiler hvis noe av det kommer tilbake.

## Når

| | Nettsidelead | Meta-lead |
|---|---|---|
| E-post 1 | i skjemaruta, etter varselet til Pål | jobben, innen 5 minutter |
| E-post 2 | jobben | jobben |

Jobben `/api/jobb/leadepost` kjører hvert 5. minutt og krever `CRON_SECRET`.

**Påminnelsen går neste hverdag kl. 09:00**, regnet fra dagen e-post 1 ble
sendt — ikke fra innsendingen. Vinduet er tre timer: har jobben stått stille
over natten, skal den ikke ta igjen det tapte med en «god morgen»-påminnelse
klokka fire om ettermiddagen.

Den sendes ikke hvis: påminnelsen er avbrutt, det er booket møte etter
e-post 1, kontakten er kunde, eller en tilknyttet avtale står i Møte booket,
Tilbud sendt, Vunnet, Hviler eller Tapt. «Interessert» stopper ingenting —
det er stadiet alle nye leads havner i.

## Vernet mot dobbeltsending

`lead_epost1_sendt` og `lead_epost2_sendt` i HubSpot er sannheten. **Datoen
settes først etter at Gmail har svart OK**, aldri før. Krasjer noe mellom
de to, sender neste kjøring på nytt — irriterende, men mye bedre enn at en
kunde aldri får e-posten fordi vi rakk å krysse av først.

Taket er 20 e-poster per kjøring.

## Bryteren

`LEAD_EPOST_AKTIV` er `false` til Pål slår den på. Da sendes **ingenting** —
jobben logger bare hva den ville gjort. Grunnen er at HubSpot sender de
samme to e-postene i dag, og i vinduet der begge står på ville leadet fått
alt i dobbelt.

`LEAD_EPOST_TEST_ADRESSE` er unntaket: står bryteren av, men adressen
stemmer, sendes e-posten likevel. Slik kan Cowork teste hele veien uten at
en eneste kunde får noe.

**Byttet gjøres i ett grep:** slå av arbeidsflyten i HubSpot og sett
`LEAD_EPOST_AKTIV=true` i samme omgang.

## Miljøvariabler

| Variabel | Hva | Uten den |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | tjenestekonto med domenedelegering | ingen e-post sendes |
| `GOOGLE_OAUTH_CLIENT_ID/_SECRET/_REFRESH_TOKEN` | alternativ til over | – |
| `GMAIL_AVSENDER` | standard `pal@reflektor.no` | – |
| `LEAD_EPOST_AKTIV` | `true` slår på utsending | ingenting sendes |
| `LEAD_EPOST_TEST_ADRESSE` | én adresse som får e-post likevel | – |
| `CRON_SECRET` | beskytter jobben | jobben svarer 401 |

Tjenestekonto brukes hvis begge finnes.

## Det som ikke lot seg gjøre

**Message-ID lages av oss, ikke leses fra Gmail.** Tilgangen `gmail.send`
gir bare lov å sende, ikke å lese. Vi setter derfor headeren selv før
sending og lagrer den. Skulle Gmail overskrive den, er `threadId` fortsatt
riktig, og tråden holder i Gmail — men `In-Reply-To` kan peke på noe som
ikke finnes hos mottakere utenfor Gmail.

**Sjekken «har leadet svart?» er ikke bygget.** Den krever
`gmail.readonly` eller `gmail.metadata` for å lese tråden. Med bare
`gmail.send` finnes det ingen måte å vite det. Konsekvensen: svarer noen på
e-post 1 uten å booke møte og uten at en avtale flyttes, får de også
påminnelsen. Vil Pål ha den sjekken, må tilgangen utvides.

**HubSpot-tokenet trenger mer.** `crm.objects.deals.read` for
avtalestadiene, og tilgang til å logge aktivitet på kontakten. Mangler de,
hopper koden over akkurat det og sender likevel — men da er stadie-sjekken
blind, og e-postene vises ikke i tidslinjen.

## Verifisert live 03.10.2026, 21:40

Jobben kjører av seg selv hvert femte minutt, autentisert, og svarer 200.
Første runde logget tre leads den *ville* sendt til, og ett hoppet over
(`pal@reflektor.no`, som regelen om `@reflektor.no` skal stoppe).

**Etterslepet er den ene fellen ved byttet.** Vinduet for e-post 1 er 48
timer tilbake. Slås bryteren på i dag, får de tre siste leadene e-posten
med én gang — og de har allerede fått HubSpots versjon. Skal de slippe,
må `lead_epost1_sendt` og `lead_epost2_sendt` settes på dem i HubSpot før
bryteren snus. Venter man to døgn, faller de ut av vinduet selv.
