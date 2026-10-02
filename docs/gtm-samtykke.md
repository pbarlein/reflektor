# GTM-N4KGSS93: samtykke for de tre ikke-Google-taggene

**RETTET 27.09.2026.** Denne fila sa «fem tagger» og listet Meta-piksel og
Microsoft Ads blant dem. Det var feil. Jeg har nå lest den **publiserte**
containeren (`googletagmanager.com/gtm.js?id=GTM-N4KGSS93`) og kildekoden til
dagens reflektor.no, og fasiten står under «Hva som faktisk kjører». Kort
fortalt: det er **tre** tagger å sikre, Microsoft Ads finnes ikke noe sted, og
Meta-pikselen lastes av Squarespace — ikke av GTM.

> ## AVKLART 02.10.2026: DENNE JOBBEN GJØRES IKKE
>
> Pål har besluttet at samtykkekravet **ikke** settes på de tre taggene
> inne i GTM. Oppskriften under er dermed ikke en oppgave som venter — den
> står igjen som framgangsmåten **hvis** valget en gang gjøres om.
>
> **Det som faktisk ble gjort i stedet, samme dag**, og som gjør to av de
> tre taggene mindre kritiske:
>
> - **HubSpot:** CRM-et avhenger ikke lenger av sporingsskriptet. Leads går
>   rett fra serveren til HubSpots Forms API (`src/lib/hubspot.ts`), og
>   kommer fram enten besøkende sier ja, sier nei eller blokkerer sporing.
> - **Clarity:** får samtykket direkte gjennom sin egen `consentv2`-API
>   (`src/lib/samtykke.ts`). Uten samtykke kjører den i «no-consent mode»:
>   ingen cookies, én ID per sidevisning.
>
> **Apollo har ingen annen bryter enn GTM.** Den kjører derfor før samtykke,
> og det er i strid med ekomlovens krav om aktivt samtykke fra 01.01.2025.
> Det står her fordi det er sant, ikke som en innvending: valget er tatt
> med dette kjent, og det er Påls.
>
> Avsnittet «Det som gjenstår etterpå» nederst gjelder fortsatt — forslaget
> til punkt 8 i personvernerklæringen bygger på at de tre kun lastes med
> samtykke, og **det er ikke tilfellet**. Settes teksten inn nå, står det en
> påstand i erklæringen som ikke stemmer.

Skrevet 21.09.2026. Denne oppskriften utføres **av Pål**, i
tagmanager.google.com. Claude Code har ingen GTM-tilgang — sesjonen kjører
i en isolert container i skyen, uten Google-profil.

> **Containeren er LÅST i AGENTS.md**, og den kjører på **dagens**
> reflektor.no. En feil her slår ut konverteringssporingen som bærer 107+
> historiske konverteringer, umiddelbart, på den levende siden. Gjør
> endringene i en arbeidsversjon, forhåndsvis, og publiser først når
> forhåndsvisningen er verifisert.

## Hvorfor dette haster for dagens side, ikke for den nye

**ENDRET 02.10.2026:** Den nye siden laster nå containeren for alle, fra
første sidevisning, etter Påls eksplisitte valg (se `Sporing.tsx`). Det
betyr at de tre taggene under nå kjører før samtykke også på den nye siden.
Oppskriften i denne fila er derfor fortsatt aktuell.

**FORUTSETNINGEN ER PÅ PLASS, samme dag.** Her sto at oppskriften «må
kombineres med at /api/skjema sender leads direkte til HubSpot, ellers
mister CRM-en leads fra dem som sier nei». Det er gjort:

- `/api/skjema` sender nå hvert lead rett til HubSpots Forms API fra
  serveren (`src/lib/hubspot.ts`). **CRM-et avhenger ikke lenger av
  sporingsskriptet i det hele tatt** — leadet kommer fram enten besøkende
  sier ja, sier nei eller blokkerer sporing. HubSpot-taggen kan dermed
  settes bak samtykke uten at ett lead går tapt.
- Kontaktskjemaet er merket `data-hs-do-not-collect="true"`, så HubSpots
  «collected forms» ikke oppretter samme kontakt en gang til fra
  nettleseren.
- **Clarity får samtykket uavhengig av GTM.** Den leser ikke Consent Mode,
  men har sin egen `consentv2`-API, og den kalles nå fra `<head>` og fra
  banneret (`src/lib/samtykke.ts`). Uten samtykke kjører Clarity i
  «no-consent mode»: ingen cookies, én ID per sidevisning. Det gjør
  Clarity-taggen i containeren mindre kritisk — men den skal fortsatt
  settes bak samtykke, for opptaket i seg selv.

Apollo er den eneste av de tre som ikke har noen annen bryter enn GTM.

**Dagens Squarespace-side laster containeren umiddelbart.** Det er der de
tre taggene kjører på folk som ikke har tatt stilling til noe, akkurat nå.

## Hva som faktisk kjører

Målt 27.09.2026, uten å sende én måling: containeren lest som publisert
JavaScript, dagens side lest som rå HTML uten å kjøre den.

**Containeren har 13 tagger.** Googles fem leser Consent Mode selv:

| Tagg | Identifikator | Utløser |
|---|---|---|
| Google-tag (GA4) | `G-1QJ6BRWGJ8` | `gtm.init` |
| GA4-hendelse `generate_lead` | `G-1QJ6BRWGJ8` | /takk + referrer, se under |
| Google Ads-konvertering | `11026823614` | /takk + referrer |
| Conversion Linker | — | alle sidevisninger |
| Samtykkemal (`__cvt_K8GSG`) | ×2: `default` og `update` | se «ACCEPT» under |

**Disse tre leser den ikke, og er jobben som skal gjøres:**

| Tagg | Identifikator | Hva den gjør | Kategori |
|---|---|---|---|
| Apollo | appId `67f7a7f9f3af070015ab21b2` | identifiserer bedriften bak besøket | markedsføring |
| Microsoft Clarity | prosjekt `rkgf0frfdt` | **tar opp sesjonen** — museflytting og klikk | analyse |
| HubSpot | portal `148641188` (js-eu1, EU) | setter cookies, CRM-sporing | markedsføring |

Alle tre fyrer i dag på **regel 3: `event == "gtm.js"`** — altså hver
sidevisning, uten noen samtykkebetingelse i det hele tatt.

### To ting denne fila tok feil om

**Microsoft Ads finnes ikke.** Ingen UET-tagg i containeren, ingen `uetq` og
ingen `bat.bing.com` i sidens kildekode. Det som førte meg feil er at
samtykkemalen har `platform_microsoft: true` — den er *konfigurert* til også å
sende Microsoft-signaler, men ingen tagg tar imot dem. Ingenting å sikre.

**Meta-pikselen lastes ikke av GTM.** Den er injisert direkte i Squarespace:
`fbq('init', '572759520853896')` står i sidens kildekode, og
`connect.facebook.net` lastes derfra. Den kan altså ikke sikres i GTM, og —
viktigere — **den forsvinner av seg selv ved cutover.** Den nye siden har den
ikke. Samme gjelder Elfsight-widgeten
(`bafcc99b-ca46-41b5-adc6-e4435772183d`, `elfsightcdn.com/platform.js`).

Det er en beslutning, ikke en detalj: bygger du remarketing-målgrupper på den
pikselen, slutter de å fylles den dagen vi bytter. Skal den videre, må den
inn i GTM (og da med samtykkekontroll, som de tre andre). Se
`docs/cutover.md`.

### «ACCEPT»-utløseren gjelder bare dagens side

Samtykkemalens `update`-tagg (alt satt til `granted`) fyrer på
**regel 2: klikk på et element hvis tekst inneholder `ACCEPT`** — uten
`ignore_case`, altså store bokstaver. Det er Squarespace sitt cookiebanner.

Den nye sidens knapp heter «Godta alle» og vil aldri treffe. **Det er likevel
ikke et problem**, og jeg sjekket det før jeg slo alarm: `meldFra()` i
`Samtykke.tsx` kaller `gtag("consent","update", …)` selv, og
`standardSkript()` setter `default` i `<head>` før containeren laster. Googles
tagger får altså riktig tilstand fra vår egen kode, uten å gå via GTM.

Utløseren er dermed *arvegods* etter byttet — den gjør ingen skade, men den
gjør heller ingenting. Rydd den bort når dagens side er ute av bruk, ikke før.

## Metoden: innebygd samtykkekontroll, ikke en egen utløser

GTM har et felt per tagg som heter **«Consent Settings» → «Require
additional consent for tag to fire»**. Bruk det.

Den innebygde kontrollen leser samtykke**tilstanden**, som settes på hver
eneste sidevisning fra cookien. Derfor virker den også for gjengangere.

### Hendelsen `samtykke_oppdatert` finnes, men er sikkerhetsnettet

Den nye siden sender denne til dataLayer:

```js
{ event: "samtykke_oppdatert",
  samtykke_analyse: "granted" | "denied",
  samtykke_markedsforing: "granted" | "denied",
  samtykke_kilde: "valg" | "lagret" }
```

**Den sendes både når noen klikker og på hver sidevisning der cookien
finnes** — `"valg"` i det første tilfellet, `"lagret"` i det andre. Begge
kommer før `gtm.js`, så containeren ser dem når den starter. Verifisert i
nettleseren, begge veier.

Det gjør at en egendefinert utløser på hendelsen *også* ville virket. Den
innebygde kontrollen er likevel å foretrekke: den gjelder taggen uansett
hvilken utløser som ber den fyre, så det er umulig å glemme å fjerne «All
Pages». Velger du utløsermetoden i stedet, **må** «All Pages» fjernes fra
hver av de tre — GTM fyrer en tagg hvis hvilken som helst av utløserne
treffer.

Et avslag sender også hendelsen, med `denied`. Det er med vilje: uten den
ville en utløser ikke se forskjell på «sa nei» og «har ikke svart ennå».

## Framgangsmåte

For hver av de **tre** taggene (Apollo, Clarity, HubSpot):

1. Åpne taggen → **Advanced Settings** → **Consent Settings**
2. Velg **«Require additional consent for tag to fire»**
3. Legg til samtykketypen fra tabellen over:
   - markedsføring → `ad_storage`
   - analyse → `analytics_storage`
4. Lagre. **La utløserne stå som de er** — samtykkekontrollen blokkerer
   taggen uavhengig av hvilken utløser som ber den fyre. (Det er
   forskjellen fra utløsermetoden, der «All Pages» måtte fjernes, og der
   det å glemme det er den vanligste feilen: GTM fyrer en tagg hvis
   *hvilken som helst* av utløserne treffer.)

## Verifiser før publisering

I **Preview / Tag Assistant**, mot dagens reflektor.no:

1. Åpne siden uten å svare på banneret → alle tre skal stå under **«Tags
   Not Fired»**, med begrunnelsen «Consent Not Granted»
2. Klikk **«Bare nødvendige»** → fortsatt ingen av de tre
3. Klikk **«Godta alle»** → alle tre fyrer
4. Last siden på nytt uten å røre banneret → alle tre fyrer igjen.
   **Dette steget er hele poenget.** På dagens Squarespace-side finnes
   ikke gjentakelsen fra den nye siden, så her er tilstandskontrollen det
   eneste som holder. Feiler steget, er samtykket hengt på en hendelse
   som ikke kommer.

GA4 og Google Ads skal oppføre seg uendret gjennom hele testen. Gjør de
ikke det, er noe rørt som ikke skulle røres — publiser ikke.

## Det som gjenstår etterpå

Samtykket er fortsatt ikke **informert**: personvernerklæringen nevner
Google og Meta, men ikke Apollo, Clarity eller HubSpot. Et samtykke kan ikke
være informert om det man informerer om ikke er det som kjører.

Et **forslag** til punkt 8 ligger i `docs/personvern-punkt-8-forslag.md`, med
verifiserte navn og identifikatorer. Det er et forslag, ikke en endring:
`src/content/personvern.ts` sier i sin egen filheader at erklæringen er
ordrett migrert og ikke skal omskrives av Claude Code, fordi den er juridisk
bindende. Teksten settes inn først når Pål har godkjent den.

**Rekkefølgen er bindende:** forslaget sier at de tre kun lastes med
samtykke. Det er sant først etter at GTM-endringen over er publisert. Settes
teksten inn før det, står det en påstand i erklæringen som ikke stemmer.
