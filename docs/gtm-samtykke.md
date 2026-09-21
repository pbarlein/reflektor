# GTM-N4KGSS93: samtykke for de fem ikke-Google-taggene

Skrevet 21.09.2026. Denne oppskriften utføres **av Pål**, i
tagmanager.google.com. Claude Code har ingen GTM-tilgang — sesjonen kjører
i en isolert container i skyen, uten Google-profil.

> **Containeren er LÅST i AGENTS.md**, og den kjører på **dagens**
> reflektor.no. En feil her slår ut konverteringssporingen som bærer 107+
> historiske konverteringer, umiddelbart, på den levende siden. Gjør
> endringene i en arbeidsversjon, forhåndsvis, og publiser først når
> forhåndsvisningen er verifisert.

## Hvorfor dette haster for dagens side, ikke for den nye

Den nye siden laster ikke containeren før den besøkende har svart
(`Sporing.tsx` leser `data-samtykke === "svart"`). Der kan taggene ikke
fyre før samtykke uansett.

**Dagens Squarespace-side laster containeren umiddelbart.** Det er der de
fem taggene kjører på folk som ikke har tatt stilling til noe, akkurat nå.

## De fem taggene

Consent Mode styrer kun Googles egne tagger. Disse leser den ikke:

| Tagg | Hva den gjør | Kategori |
|---|---|---|
| Meta-piksel | annonsemåling og remarketing | markedsføring |
| Microsoft Ads | annonsemåling | markedsføring |
| Apollo.io (`aplo-evnt.com`) | identifiserer bedriften bak besøket | markedsføring |
| HubSpot | satte fire cookies før noe samtykke forelå | markedsføring |
| Microsoft Clarity | tar opp sesjonen — museflytting og klikk | analyse |

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
hver av de fem — GTM fyrer en tagg hvis hvilken som helst av utløserne
treffer.

Et avslag sender også hendelsen, med `denied`. Det er med vilje: uten den
ville en utløser ikke se forskjell på «sa nei» og «har ikke svart ennå».

## Framgangsmåte

For hver av de fem taggene:

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

1. Åpne siden uten å svare på banneret → alle fem skal stå under **«Tags
   Not Fired»**, med begrunnelsen «Consent Not Granted»
2. Klikk **«Bare nødvendige»** → fortsatt ingen av de fem
3. Klikk **«Godta alle»** → alle fem fyrer
4. Last siden på nytt uten å røre banneret → alle fem fyrer igjen.
   **Dette steget er hele poenget.** På dagens Squarespace-side finnes
   ikke gjentakelsen fra den nye siden, så her er tilstandskontrollen det
   eneste som holder. Feiler steget, er samtykket hengt på en hendelse
   som ikke kommer.

GA4 og Google Ads skal oppføre seg uendret gjennom hele testen. Gjør de
ikke det, er noe rørt som ikke skulle røres — publiser ikke.

## Det som gjenstår etterpå

Samtykket er fortsatt ikke **informert**: personvernerklæringen nevner
Google og Meta, men ikke Apollo, HubSpot, Clarity eller Microsoft Ads. Et
samtykke kan ikke være informert om det man informerer om ikke er det som
kjører. Se A42 punkt 2 og sjekklista i vedlegg A.

Den teksten må skrives av Pål — copy-protokollen gjelder, og dette er
juridisk tekst.
