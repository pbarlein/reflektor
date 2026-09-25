# Hvordan malene blir bedre

Bestilt 24.09.2026: «sørg for at du også lærer hele veien, slik at
produsentene får bedre og mer relevante dokumenter mens vi holder på.»

Dette dokumentet sier hvordan det skjer i praksis, og hva som mangler for at
det skal skje av seg selv.

## Hvorfor intranettet ikke lærer på egen hånd i dag

«Lag dokument» er statsløst. Hver generering starter på nytt med malen og
skjemaet, og når fanen lukkes, er rettelsene borte. Det finnes ingen database
i `intern`, og det er et bevisst valg så langt: alt annet der er lesing av
innhold som ligger i koden.

Læring krever et sted å skrive. Så lenge det stedet ikke finnes, er det
mennesker og Claude Code som er mekanismen — og da må den være skrevet ned,
ellers skjer den ikke.

## Sløyfa som gjelder nå

1. **Produsenten retter dokumentet i vinduet.** Rettelsene står som en
   nummerert liste under arket, i den rekkefølgen de ble bedt om.
2. **Ser du samme rettelse tredje gang, er det ikke en rettelse lenger — det
   er en regel som mangler.** Skriv den inn i tabellen nederst her.
3. **Claude Code flytter den fra tabellen inn i malen**, som en linje i
   `struktur` eller `regler` i `src/content/maler.ts`, og skriver hvorfor i
   commit-meldingen.
4. Fra da av slipper alle å be om den.

Terskelen er tre ganger med vilje. Én rettelse er en kunde som er
annerledes. To er tilfeldig. Tre er malen som er feil.

## Hva som skal til for at det går av seg selv

Rettelsene må kunne lagres. Tre veier, i rekkefølge etter hvor mye de koster:

| Vei | Hva det gir | Hva det krever |
|---|---|---|
| Vercel KV | Rettelsene samles automatisk, og de hyppigste kan vises i grensesnittet: «tre produsenter har bedt om dette» | En lagringsdel i Vercel-prosjektet. Gratis på dette volumet. |
| Postgres | Samme, pluss at vi kan se hvilke maler som rettes mest og hvilke felt som alltid står tomme | Samme, men mer å vedlikeholde |
| Ingenting | Sløyfa over, manuelt | Ingenting, men den avhenger av at noen husker |

**Dette er ikke besluttet.** Rettelser kan inneholde navn på kundens ansatte,
så det å begynne å lagre dem er en beslutning om personopplysninger, ikke bare
en teknisk. Den tas av daglig leder, ikke i en commit.

## Rettelser som er flyttet inn i malene

| Dato | Hva som ble rettet gang på gang | Hvor det ble løst |
|---|---|---|
| 23.09.2026 | Prisen sto i produksjonsplaner der ingen hadde oppgitt den | Husregel i `byggInstruks`: forretningsvilkår skal aldri inn |
| 24.09.2026 | Dokumentet ble to til fire sider | `TAK` i `arktype.ts`, og ensiderregelen i `byggInstruks` |
| 24.09.2026 | Dokumenttypen sto som overskrift i tillegg til i hodet | `oppdrag` sier nå at hodet allerede finnes |
| 24.09.2026 | Byråspråk og ufullstendige setninger | Språkreglene i `byggInstruks`, med forbudte vendinger |

## Rettelser som venter

Ingen ennå. Fyll inn her når noe går igjen.

| Dato | Mal | Hva som blir bedt om | Antall ganger |
|---|---|---|---|

## 24.09.2026 — researchen ble snudd fra nettsøk til publiseringsdata

**Bestilt:** «en produksjonsplan skal tross alt bestemme hva som skal
filmes. bruk mindre tid på nettet, og gjør kall i supermetrics for å få
oversikt over hva som faktisk publiseres av kunden, konkurrenter og kartlegg
virale virkemidler i relasjon til hva som er fordelaktig og gjennomførbart
for reflektor.»

**Hva som var galt:** researchen brukte seks nettsøk på å finne ut hvem
bedriften var, og leverte i praksis en omskrevet «om oss»-side. Ingenting i
den svarte på spørsmålet dokumentet faktisk skal svare på — hva skal kamera
peke på den dagen.

**Hva som ble gjort:**

- Nye grunnlagsfelt (`grunnlag: true` i maltype.ts) på produksjonsplan,
  publiseringsplan og månedsrapport: kundens Instagram, konkurrenter, og
  lenke til SoMe-strategien i Canva. De styrer hva Claude undersøker og
  skrives aldri inn i dokumentet. To tester holder det skillet.
- `src/lib/supermetrics.ts` henter hva kontoene faktisk har publisert siste
  år, fordelt på format, med median og ikke snitt.
- Nettsøket er redusert fra seks til tre søk, og har fått et smalere
  oppdrag: hvem de selger til, og hva som er ferskt.
- Researchen har fått `virkemidler` — virale virkemidler avgrenset til det
  Reflektor kan lage på én produksjonsdag med to personer. Rammene står
  eksplisitt i instruksen, ellers foreslås det daglig publisering og
  filmteam.
- Rekkefølgen er snudd: e-post og tall FØRST, så research. Researchen skal
  bygge på dem, ikke omvendt.
- Briefen leter spesifikt etter en Canva-lenke med SoMe-strategien.

**Status på Supermetrics:** ikke i drift. Reflektors abonnement er
Claude-koblingen (produktkode CNCT), ikke API-produktet, og modulen er
mørk uten `SUPERMETRICS_API_KEY`. Kontrakten er lest i dokumentasjonen og
kjørt mot en lokal etterligning — ikke mot en ekte nøkkel. Kommentaren øverst
i `intern/src/lib/supermetrics.ts` sier hva som gjenstår.

## 25.09.2026 — kutt i stillhet, og et svar tilbake til produsenten

**Hendelsen:** en produsent ba om profesjonell voiceover med manus per
opptak i runde tre. I runde fem trykket hen «Kort ned så det får plass». I
runde seks måtte hen spørre «nå er voice over borte?».

**To feil, og den andre er den alvorlige:**

1. Runde fem så bare dokumentet og ordene «kort ned». Ingenting fortalte
   modellen at voiceover-seksjonen var bestilt og ikke påfunnet, så den var
   det billigste å kutte: lang, og ikke nevnt i strukturen. Knappens egen
   ordlyd — «fjern rader og punkter kunden ikke trenger før dagen» — pekte
   rett på den.
2. Det skjedde i stillhet. Ensideren KREVER at noe vikes; et kutt ingen får
   vite om, oppdages av kunden.

**Hva som ble gjort:**

- Alle tidligere rettelser følger med som STÅENDE INSTRUKSER i hver ny
  runde. De kan formuleres kortere eller slås sammen, men ikke fjernes for
  å spare plass. Tak på ti.
- Nytt felt i verktøyet: `beskjed` og `avklaringer` — et svar til
  produsenten ved siden av dokumentet. Det vises i vinduet, lastes ikke
  ned, og koster ingen plass på arket. Der skal det stå hva som ble kuttet
  og hvorfor, hvorfor et valg ble tatt, og hva produsenten må avgjøre.
- «Kort ned»-knappen ber nå om det motsatte først: behold det som er
  bestilt, korte det heller ned.
- Tre tester holder det på plass, blant annet at svaret aldri havner i
  `Ark` — Reflektors avveininger skal ikke stå i dokumentet kunden får.

**Regelen dette er et tilfelle av:** en modell som må velge bort noe, velger
bort det ingenting forsvarer. Skal noe overleve en innstramming, må det stå
skrevet at det er bestilt.
