# Reflektor internt

Intern hub for ansatte. Egen Next.js-app, egen innlogging, egen deploy —
helt adskilt fra salgssiden i mappa over.

> **Ingenting herfra skal være offentlig.** Alle sider serverer `noindex`,
> `robots.txt` sier `Disallow: /`, og alt bak innloggingen krever en
> Google-konto på @reflektor.no.

---

## Kom i gang lokalt

```bash
cd intern
npm install
cp .env.eksempel .env.local
```

Fyll inn i `.env.local`:

```
SESJON_HEMMELIGHET=<openssl rand -base64 48>
INTERN_DEV_INNLOGGING=true
```

```bash
npm run dev          # http://localhost:3000
```

Med `INTERN_DEV_INNLOGGING=true` får du en ekstra knapp på innloggingen som
slipper deg inn uten Google. Den virker **aldri** i en deploy — se
`src/lib/utvikling.ts` for de to betingelsene som må holde samtidig.

Andre kommandoer:

```bash
npm test             # 56 tester: sesjon, OAuth-krav, innhold, lesestatus
npm run lint
npm run build
npm run medier       # kopierer bilder og klipp fra ../public
```

---

## Google-innlogging — oppsett

Dette gjøres én gang, av noen med tilgang til Google Cloud på Reflektors
Workspace.

1. Gå til [Google Cloud Console](https://console.cloud.google.com/) og lag et
   prosjekt (eller bruk et eksisterende).
2. **APIs & Services → OAuth consent screen**
   - User type: **Internal**. Det låser innloggingen til Workspace-kontoene
     deres allerede der, og du slipper Googles verifiseringsprosess.
   - Fyll inn appnavn og support-e-post.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized redirect URIs** — én per adresse siden skal nås på, ordrett:
     ```
     https://<vertsnavnet>/api/auth/retur
     http://localhost:3000/api/auth/retur
     ```
     Google godtar kun adresser den har sett før. Mangler en, får brukeren
     `redirect_uri_mismatch` fra Google — ikke fra oss.

4. Kopier **Client ID** og **Client secret** inn i miljøvariablene.

### Hva som FAKTISK er registrert

Verifisert 23.09.2026 ved å lese listen i Google Cloud Console. Fire
adresser, i denne rekkefølgen:

```
https://reflektor-intern-reflektor.vercel.app/api/auth/retur
http://localhost:3000/api/auth/retur
https://reflektor-intern.vercel.app/api/auth/retur
https://reflektor-intern-git-claude-beautiful-lovelace-dy56f2-reflektor.vercel.app/api/auth/retur
```

De to første sto der fra oppsettet. De to siste ble lagt til 23.09.2026,
fordi prosjektet har tre aliaser og siden sender den adressen brukeren
faktisk står på — se `returadresse()` i `src/lib/google.ts`. Hvert alias er
en egen adresse for Google.

Branch-aliaset (den fjerde) kan slettes når arbeidet er merget.

> ### ⚠️ DENNE LISTEN KAN IKKE UTLEDES — DEN MÅ LESES
>
> 22.09.2026 ble oppskriften over lest som om den var denne listen, og tre
> ulike adresser ble delt ut som «denne virker». To av dem sto ikke i
> Google i det hele tatt.
>
> Listen finnes ingen andre steder enn i Google Cloud Console. Den kan ikke
> utledes fra koden, fra Vercel, eller fra denne filen. Et `curl`-kall mot
> Googles autorisasjonsendepunkt svarer heller ikke: uten innlogget sesjon
> får ALLE adresser 302 til innloggingssiden, også adresser som ikke
> finnes. Det var den testen som fikk gjetningen til å se verifisert ut.
>
> Endrer noen listen: oppdater blokken over, med dato.

### Miljøvariabler

| Variabel                | Påkrevd | Hva den gjør                                         |
| ----------------------- | ------- | ---------------------------------------------------- |
| `SESJON_HEMMELIGHET`    | Ja      | Nøkkelen sesjonscookien signeres med. Minst 32 tegn. |
| `GOOGLE_CLIENT_ID`      | Ja      | Fra steg 3.                                          |
| `GOOGLE_CLIENT_SECRET`  | Ja      | Fra steg 3.                                          |
| `TILLATT_DOMENE`        | Nei     | Domenet som slipper inn. Standard `reflektor.no`.    |
| `INTERN_DEV_INNLOGGING` | Nei     | Kun lokalt. Se over.                                 |

Mangler noe av dette, sier innloggingssiden hva som mangler. Den feiler ikke
stille.

**Bytter du `SESJON_HEMMELIGHET`, logges alle ut.** Det er den raskeste måten
å kaste ut alle sesjoner på hvis noe skulle skje.

---

## Deploy — allerede satt opp

|                              |                                                        |
| ---------------------------- | ------------------------------------------------------ |
| Vercel-prosjekt              | `reflektor-intern` (eget, ved siden av `reflektor-ny`) |
| Root Directory               | `intern`                                               |
| Node                         | 22.x                                                   |
| «Include files outside root» | **på** — byggen trenger `../public`                    |
| URL                          | https://reflektor-intern.vercel.app                    |

Tre aliaser peker på samme prosjekt, og alle tre serverer siste
produksjonsdeploy: `reflektor-intern.vercel.app`,
`reflektor-intern-reflektor.vercel.app` og branch-aliaset
`reflektor-intern-git-claude-beautiful-lovelace-dy56f2-reflektor.vercel.app`.

Det er `reflektor-intern.vercel.app` som skal brukes og registreres hos
Google. Hvert alias er en egen adresse for Google, og siden sender den
adressen brukeren faktisk står på — se `returadresse()` i
`src/lib/google.ts`. Deles en av de andre ut, må også DEN ligge i listen.

Alle fire miljøvariablene er satt i alle tre miljøer. Innloggingen virker.

> **Ikke deploy dette fra salgssidens Vercel-prosjekt.** To prosjekter mot
> samme repo er poenget: intranettet skal kunne deployes uten å røre
> reflektor.no, og omvendt.

### Vercel Authentication er AV — med vilje

Prosjektet ble opprettet med Vercels eget SSO-lag på, og det ble skrudd av
da Google-innloggingen kom på plass.

Rekkefølgen var poenget. Uten Google-oppsett var Vercel-laget den eneste
ekte låsen, og da skulle det stå. Med Google på plass er det aktivt skadelig:
en ansatt uten Vercel-konto ville ikke kommet fram til vår egen innlogging i
det hele tatt, og feilen ville sett ut som «innloggingen virker ikke».

Låsen er nå `src/proxy.ts` og `krevBruker()`, som er der den hører hjemme.
Skal den slås på igjen — for eksempel mens noe testes — ligger den under
Project → Settings → Deployment Protection → Vercel Authentication.

### Verifisert på den deployede siden

| Sjekk                         | Resultat                                                         |
| ----------------------------- | ---------------------------------------------------------------- |
| `/robots.txt` uten innlogging | 200, `Disallow: /`                                               |
| Forsiden uten innlogging      | 307 → `/logg-inn`                                                |
| Dyplenke uten innlogging      | 307 → `/logg-inn?neste=%2Frubrikk%2Fmalet`                       |
| `noindex`                     | både HTTP-header og `<meta>`                                     |
| `POST /api/auth/dev`          | **404** — dev-døra finnes ikke i produksjon                      |
| Google-flyten                 | riktig `client_id`, `redirect_uri`, `hd=reflektor.no`, PKCE S256 |

Det nest siste er den viktigste: de to betingelsene i `src/lib/utvikling.ts`
holder i en ekte deploy, ikke bare i en test.

---

## Hvordan innloggingen virker

OpenID Connect, authorization code + PKCE, uten bibliotek. Rundt 200 linjer
i `src/lib/google.ts` og `src/lib/sesjon.ts`, og begrunnelsen for hvert valg
står i filene.

```
/logg-inn
   └─ /api/auth/google    lager state + PKCE-verifiser, sender til Google
        └─ accounts.google.com
             └─ /api/auth/retur   sjekker state, veksler koden, validerer
                                  id_token, setter sesjonscookien
```

Fire krav må stemme i `id_token` før noen slipper inn: utsteder er Google,
token er utstedt til **oss**, det er ikke utløpt, e-posten er bekreftet — og
i tillegg må både `hd` og e-postdomenet være `reflektor.no`. Begge de to
siste, ikke bare den ene: `hd` finnes kun på Workspace-kontoer, og en privat
Gmail-konto ville ellers kunne komme forbi en ren strengsjekk. Det er testet i
`tests/google.test.ts`.

Tilgang sjekkes **to steder**: `src/proxy.ts` fanger opp forespørsler uten
gyldig cookie, og `krevBruker()` kjører på hver beskyttede side. Next sier
selv at proxy-laget er en optimistisk sjekk, ikke en autorisasjonsløsning.

### Bytte til noe annet senere

Hele innloggingen ligger i `src/lib/google.ts`, `src/lib/sesjon.ts` og de fire
rutene under `src/app/api/auth/`. Ingen side og ingen komponent vet hvordan
brukeren ble autentisert — de kaller bare `krevBruker()`. Skal dere over på
Auth.js, SAML eller noe annet, er det de filene som byttes.

---

## Innholdet

Alt ligger i `src/content/rubrikker/`, én fil per fase:

```
internt.ts        Interne nyheter
research.ts       01 Researchfasen
planlegging.ts    02 Planleggingsfasen
opptak.ts         03 Opptaksfasen
redigering.ts     04 Redigeringsfasen
publisering.ts    05 Publiseringsfasen
marked.ts         Markedsnyheter
```

Typene står i `src/content/rubrikktype.ts`, kategoriene i
`src/content/kategorier.ts`.

### Godkjent og ugodkjent — les dette før du redigerer

**21 av 24 rubrikker er merket `godkjent: false`.** De er faglige utkast
skrevet av Claude Code, ikke Reflektors vedtatte praksis. De vises med rød
`UGODKJENT`-merkelapp på kortet og en full forklaring øverst på rubrikksiden,
med hvilken rolle som må kvalitetssikre.

Det er et krav, ikke en formalitet. Innholdet her er instrukser folk
**følger** — på en produksjonsdag, hos en kunde, med kameraet i hånda. Feil
rutine er dyrere enn feil salgstekst.

De tre godkjente er godkjente fordi de er **hentet, ikke skrevet**:

| Rubrikk                     | Kilde                                   |
| --------------------------- | --------------------------------------- |
| Målet                       | Påls egne ord, ordrett                  |
| Hva abonnementet inneholder | `src/content/site.ts` i hovedprosjektet |
| Prisen sier vi høyt         | AGENTS.md kap. 0.3 + `site.ts`          |

**Slik godkjenner du en rubrikk:** rett teksten til det som faktisk gjelder,
sett `godkjent: true`, og fyll `kilde` med hvem som godkjente og når. Telleren
nederst på hver side går ned av seg selv.

Rubrikker det haster mest med: `hva-kunder-sporr-om` og
`ai-i-innholdsproduksjon`. Begge er rammer uten svar, fordi svarene er
standpunkter bare Reflektor kan ta.

### Legge til en rubrikk

Legg et objekt i riktig fil. Alle feltene er påkrevd bortsett fra `kilde`.

```ts
{
  slug: "unik-adresse",          // blir /rubrikk/unik-adresse
  tittel: "...",
  sammendrag: "...",             // én til to setninger, vises på kortet
  kategori: "opptak",
  medie: { type: "video", fil: "reels/egon", alt: "..." },
  oppdatert: "2026-09-21",
  lesetid: 3,
  godkjent: false,
  ansvarlig: "Produsent",        // en ROLLE, aldri et personnavn
  prioritet: 70,                 // høyere = høyere opp før noen har lest noe
  innhold: [ /* blokker */ ],
}
```

To rubrikker med samme `slug` gir en feil ved bygg, ikke en rar side i bruk.

Innholdsblokkene er `avsnitt`, `punkter`, `sjekkliste`, `steg`, `merknad` og
`sitat`. Ikke fri HTML — det er valget som gjør at alt ser likt ut uansett
hvem som skriver, og at søket kan lese brødteksten.

### Media

`fil` peker inn i `/medier`, uten filendelse. Filene kopieres fra
hovedprosjektets `/public` ved `npm run dev` og `npm run build`, og er
**ikke** sjekket inn her — `docs/media.md` i hovedprosjektet forklarer hvorfor
binærfiler i git er dyrt for alltid.

`type: "video"` forutsetter at både `.mp4` og `.jpg` finnes med samme navn.

**Alt-teksten beskriver bildet, ikke kunden.** Filnavnene er ikke til å stole
på — `kafe1-1600.jpg` er en produktstilling, ikke en kafé. Se på fila før du
skriver alt-teksten.

---

## «De mest sette øverst»

Rubrikkene sorteres etter hvor ofte **du** har åpnet dem. Tellingen ligger i
`localStorage`, altså per nettleser, og grensesnittet sier det: «Mest brukt av
deg».

Det er en ekte måling, men en personlig en. Felles tall krever et felles
lager, og Vercel-funksjoner er for kortlivede til å holde et — en teller i
minnet ville sett felles ut uten å være det.

**Vil dere ha tall på tvers av huset:** hele lageret ligger bak fire
funksjoner i `src/lib/visninger.ts` (`lesVisninger`, `tellVisning`,
`hentSnapshot`, `abonner`). Bytt dem mot Vercel KV eller Edge Config, så
følger resten av seg selv — ingen komponent vet hvor tallene kommer fra.

Før noen har åpnet noe, avgjør `prioritet` rekkefølgen, og den er også
tiebreaker etterpå.

---

## Designet

Samme uttrykk som salgssidens prisseksjon: dypt brunt, Instrument Serif i
display, Poppins i brødtekst, hårstreker i stedet for skygger, og oransje
reservert til én ting om gangen.

Tokens er **kopiert** fra hovedprosjektet og skal holdes identiske — se
`src/styles/tokens/LES-MEG.md`. Intranettets egne verdier (de to ekstra
dybdene på brunt, varselfargen) står i `src/app/globals.css`, slik at en
token-oppdatering ikke kan overskrive dem.

Kontrasttallene er regnet, ikke valgt. De står i kommentarene i
`globals.css`. Kort versjon: **merkevareoransjen `#DE4826` kan ikke brukes
som tekst på brunt** (3,53–3,92, stryker AA). Bruk `#F0704F`.

Fargen skiller ikke kategorier — nummer og form gjør det. Sju hues ville
brutt merkevaredisiplinen i AGENTS.md og sett ut som en mal.

---

## Forholdet til hovedprosjektet

Delt: git-repo, mediefiler, designtokens.
Ikke delt: `node_modules`, bygg, deploy, ruting, innhold, kode.

Dette prosjektet rører **ingenting** av det AGENTS.md i rota kaller
fundamentet: ikke redirect-kartet, ikke `/takk`, ikke GTM-oppsettet, ikke
bloggslugene. Det har ingen redirects i det hele tatt, og ingen lenker utenfra
å bevare.
