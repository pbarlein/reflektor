# Rapporter i intranettet

Ukerapporter som leveres av en planlagt oppgave og leses av Pål. Første type
er **betalt markedsføring**. Flere typer kan legges til uten ny kode i
inntaket.

## Tilgang

| Hva | Hvem |
|---|---|
| `/rapport` og `/rapport/<type>/<id>` | innlogget bruker i `LESERE`, se `intern/src/lib/rapporttilgang.ts` |
| `POST/GET /api/rapport` | nøkkel i `RAPPORT_NOKKEL` |
| `GET /api/rapport/purring` | `CRON_SECRET` eller `RAPPORT_NOKKEL` |
| `POST /api/rapport/handling` | innlogget bruker i `LESERE` |

Andre innloggede ansatte får 404 på sidene, og rapportknappen vises ikke i
toppfeltet. Nøkkelen gir bare levering og uthenting av forrige ukes steg —
den åpner ingen skjerm.

## Miljøvariabler

| Navn | Hva den gjør | Uten den |
|---|---|---|
| `RAPPORT_NOKKEL` | låser opp levering og uthenting | inntaket svarer 503 |
| `BLOB_READ_WRITE_TOKEN` | lagringen | ingenting kan tas imot eller vises |
| `RESEND_API_KEY` | sender påminnelser | rapporten lagres, ingen e-post |
| `RAPPORT_MOTTAKER` | mottaker | `pal@reflektor.no` |
| `INTRANETT_URL` | lenken i påminnelsen | utledes av Vercel |
| `CRON_SECRET` | Vercels planlegger | purringen må kalles med `RAPPORT_NOKKEL` |

Verdiene ligger i Vercel, aldri i repoet.

## Levering

```bash
curl -X POST https://<intranett>/api/rapport \
  -H "Authorization: Bearer $RAPPORT_NOKKEL" \
  -H "Content-Type: application/json" \
  --data-binary @report.json
```

Svar:

```json
{ "ok": true, "id": "betalt-markedsforing-2026-W39", "ny": true,
  "varslet": true, "test": false, "url": "/rapport/…" }
```

- **Ny `id`** gir ny rapport og én påminnelse.
- **Samme `id`** oppdaterer rapporten, tar vare på forrige utgave, og sender
  **ingen** ny påminnelse. Påls svar, avkryssinger og notater overlever.
- **Manglende felt** gir 422 med alle feilene samlet i `detaljer`.

Påkrevd er fellesfeltene i `intern/src/content/rapporttype.ts`: `schema`,
`type`, `id`, `period`, `verdict`, `subject`, `headline`, `kpis`, `insights`,
`steps`, `footer`. Alt annet er valgfritt, og **ukjente felt lagres uendret**.

## Uthenting for neste uke

```bash
curl "https://<intranett>/api/rapport?type=betalt-markedsforing" \
  -H "Authorization: Bearer $RAPPORT_NOKKEL"
```

Gir forrige rapports steg med Påls avkryssinger, svaret på beslutningen og
notatene — grunnlaget for «Forrige ukes steg». Legg til `&test=ja` for å
inkludere testrapporter.

## Testdata

En rapport er test når `"test": true` eller `footer` inneholder «TESTDATA».
Testrapporter merkes på skjermen, holdes utenfor arkivet, trendene og «venter
på deg», og påminnelsen merkes `[TEST]`. De slettes samlet med knappen i
testseksjonen på `/rapport`.

## Påminnelser

Vercels planlegger kaller `/api/rapport/purring` hver time (`vercel.json`).
Alt som sendes skrives ned, så ingenting sendes to ganger.

| Når | Hva |
|---|---|
| ny rapport | påminnelse med emne, hovedsetning, beslutningsspørsmål og lenke |
| beslutning ubesvart 24 t | én purring |
| beslutning ubesvart 72 t | siste purring |
| steg forbi fristen | én purring, dagen etter |
| ingen rapport mandag kl. 10 | varsel om at ukerapporten mangler |

Alt utenom den første sendes bare hverdager 08–17 norsk tid. Den første
sendes med én gang, fordi rapporten kommer 07.46.

Bare **nyeste** rapports beslutning purres. En ubesvart beslutning fra uke 37
er historie, ikke en oppgave.

## Ny rapporttype

1. Lever en payload med ny `type` og samme fellesfelt. Den lagres, vises og
   arkiveres uten kodeendring — nøkkeltallene og detaljene vises så langt de
   finnes.
2. Trenger typen egne skjermer, legg dem i
   `intern/src/components/rapport/` og velg på `rapport.type` i
   `intern/src/app/rapport/[type]/[id]/page.tsx`.
3. Egne grenser legges i `rapport/_innstillinger/<type>.json` i blob-butikken.
   Standardene står i `STANDARDINNSTILLINGER`.
4. Skal typen purres når den mangler, utvid mandagssjekken i
   `intern/src/app/api/rapport/purring/route.ts` — den ser i dag bare etter
   `betalt-markedsforing`.

## Merk

- `report.json` er fasit. Intranettet regner ikke ut egne varianter av pris
  per lead, dom eller varsel — det viser og visualiserer.
- Lagringen er blob-butikken, uten transaksjoner. Én rapport i uka og én
  leser gjør det uproblematisk; noe som skriver oftere må tenke seg om.
- Lokalt, uten `BLOB_READ_WRITE_TOKEN`, lagres rapportene i
  `intern/.rapportlager/`. Den veien finnes ikke i noe som er deployet.
