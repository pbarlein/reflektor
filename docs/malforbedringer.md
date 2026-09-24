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
