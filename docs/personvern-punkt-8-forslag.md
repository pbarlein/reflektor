# Forslag: punkt 8 i personvernerklæringen

**Dette er et forslag, ikke en endring.** `src/content/personvern.ts` sier i
sin egen filheader at erklæringen er ordrett migrert fra dagens
`/privacypolicy` og ikke skal omskrives av Claude Code, fordi den er et
juridisk bindende dokument. Teksten under settes inn først når Pål har
godkjent den.

Skrevet 27.09.2026.

## Hvorfor punktet må endres

Dagens punkt 8 har to problemer:

1. **Det navngir ingen verktøy.** Et samtykke skal være informert. Erklæringen
   beskriver kategorier («analysere trafikk», «måle effekten av annonser»),
   men sier ikke hvem som får opplysningene. To av verktøyene er av en type
   som en leser ikke vil gjette: Clarity **tar opp sesjonen** (musebevegelser
   og klikk), og Apollo **identifiserer bedriften** bak besøket.

2. **Siste setning er ikke sann lenger, i begge retninger.** Den sier «via
   innstillingene på nettsiden, dersom dette er tilgjengelig». Da filheaderen
   ble skrevet fantes ingen samtykkeløsning på den nye siden — nå finnes den,
   med banner og en lenke i bunnteksten som åpner den igjen. Forbeholdet
   «dersom dette er tilgjengelig» er både unødvendig og upresist.

## Hva som faktisk kjører — verifisert 27.09.2026

Lest fra den publiserte GTM-containeren og fra kildekoden til dagens side.
Ingen måling ble sendt for å finne dette ut.

| Verktøy | Identifikator | Behandler |
|---|---|---|
| Google Analytics 4 | `G-1QJ6BRWGJ8` | Google |
| Google Ads | `11026823614` | Google |
| Google Tag Manager | `GTM-N4KGSS93` | Google |
| Microsoft Clarity | `rkgf0frfdt` | Microsoft |
| HubSpot | `148641188` (EU-hosting, js-eu1) | HubSpot |
| Apollo | `67f7a7f9f3af070015ab21b2` | Apollo.io |

Meta-pikselen (`572759520853896`) og Elfsight-widgeten kjører i dag, men
lastes av Squarespace og **følger ikke med** til den nye siden.

## Forslag til ny tekst

> **8. Informasjonskapsler og sporing**
>
> Vi bruker informasjonskapsler, piksler og lignende teknologi på nettsiden
> vår for å:
>
> - analysere trafikk og bruk av nettsiden
> - måle effekten av annonser
> - vise relevante annonser
> - forbedre brukeropplevelsen
> - bygge målgrupper for markedsføring
>
> Ut over de kapslene som er nødvendige for at nettsiden skal fungere, bruker
> vi følgende tjenester. Ingen av dem lastes før du har samtykket:
>
> | Tjeneste | Formål | Kategori |
> |---|---|---|
> | Google Analytics 4 | måle trafikk og bruk av nettsiden | analyse |
> | Google Ads | måle hvilke annonser som fører til henvendelser | markedsføring |
> | Microsoft Clarity | **tar opp økten din** — musebevegelser, klikk og rulling — for å se hvor nettsiden er vanskelig å bruke | analyse |
> | HubSpot | vårt system for kundedialog og oppfølging av henvendelser | markedsføring |
> | Apollo | identifiserer hvilken virksomhet et besøk kommer fra | markedsføring |
>
> Tjenestene lastes gjennom Google Tag Manager.
>
> Du velger selv når du får spørsmålet første gang. Du kan endre eller trekke
> tilbake samtykket når som helst via lenken **«Informasjonskapsler»** i
> bunnteksten på alle sider. Trekker du det tilbake, slutter tjenestene å
> laste ved neste sidevisning.

## Det jeg ikke har skrevet, og hvorfor

Tre ting hører i denne teksten som jeg ikke kan fylle inn uten å finne på noe:

1. **Overføring utenfor EØS.** Google, Microsoft og Apollo behandler
   opplysninger i USA. GDPR artikkel 13 nr. 1 bokstav f krever at
   overføringsgrunnlaget oppgis. HubSpot ligger på EU-hosting (`js-eu1`), så
   den står i en annen stilling enn de tre andre. Hvilket grunnlag som er
   avtalt, og med hvem, vet bare Pål.

2. **Lagringstid per tjeneste.** Punkt 7 oppgir 24 måneder for
   henvendelser. Sporingsverktøyene har sine egne perioder, og de er
   innstillinger i hver konto — ikke noe jeg kan lese utenfra.

3. **Databehandleravtaler.** Om de finnes for de tre nye navnene.

Disse tre bør en jurist se på før erklæringen publiseres. Jeg har ikke lagt
inn `TBD(...)`-markører i teksten over, fordi dette er et forslag i en
dokumentfil og ikke innhold som serveres.
