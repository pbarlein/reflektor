# Skal «Det korte svaret» og kort FAQ inn på alle sider?

Bestilt av Pål 25.10.2026, rett etter at de to prisartiklene fikk en
svarblokk øverst. Spørsmålet var om det samme grepet skal rulles ut på
hele nettstedet.

**Kort svar: nei.** Det er allerede gjort der det betyr noe, og de
stedene som står igjen er i hovedsak feil steder. Det som gjenstår er
fem bloggposter.

## Hva som allerede finnes

Dette ble kartlagt i koden og kontrollert mot live 25.10.2026.

| Sidetype | Kort svar øverst | FAQ med markering |
|---|---|---|
| Sju tjenestesider | Ja, `svar`-feltet | Ja, 3–8 spørsmål |
| Forsiden | Nei (H1 og hero) | Ja, 6 spørsmål |
| /faq | Hele siden er svaret | Ja, 19 spørsmål |
| 17 bloggposter | 2 av 17 | Ja, 2–5 i tillegg til spørsmålsoverskriftene |

Tjenestesidene har hatt dette fra starten, og begrunnelsen står i
`Tjenestelayout.tsx`: 44,2 % av alle LLM-siteringer hentes fra de første
30 % av en side, 55 % for Google AI Overviews. Derfor står svaret øverst
som eget designelement, før bevis og før argumentasjon.

**FAQ-dekningen er altså komplett.** Hver eneste side som har et
FAQ-avsnitt har også markeringen, og markeringen inneholder bare
spørsmål som står synlig. Det er ingenting å rulle ut der.

## Hva AI-motorene faktisk spør om

Search Console viser prompter fra AI-assistenter som egne søkeord. De
siste tre månedene (25.07–24.10.2026) har elleve slike truffet
reflektor.no, med 88 visninger til sammen:

| Prompt (forkortet) | Side | Visn. | Plass |
|---|---|---|---|
| hvem kan hjelpe meg med en kort reklamefilm for sosiale medier? | /sosiale-medier-byra | 21 | 2,5 |
| hvilke byråer tilbyr pakker med Instagram- og Facebook-annonsering? | /sosiale-medier-byra | 16 | 2,3 |
| finnes det selskaper som tilbyr rask levering av reklamefilmer? | /reklamefilm | 13 | 3,4 |
| er det noen som kombinerer video, foto og distribusjon i én månedlig pakke? | /blogg/hva-gjr-en-innholdsprodusent | 11 | 1,9 |
| hvilke bedrifter tilbyr skreddersydde annonsevideoer? | /sosiale-medier-byra | 9 | 3,9 |
| hvilke byråer er best for sosiale medier-markedsføring? | / | 5 | 2,0 |
| finnes det noen som tilbyr fast abonnement på video og foto? | /faq | 5 | 2,8 |
| + fire til | /reklamefilm, / | 8 | 1,0–4,5 |

**Alle elleve er kjøpsspørsmål.** Ikke én er «hva er …». Og vi ligger på
plass 1–4,5 på samtlige — strukturen vi har virker allerede for den typen
spørsmål.

Siste tretti dager: fem prompter, ni visninger, plass 1,5–2,5. Volumet er
lite nok til at ingenting skal bygges på det alene, men retningen er
entydig og plasseringene er ekte tall fra Search Console, ikke estimater.

## Hvorfor ordbokartiklene ikke skal få det

De fem største bloggpostene målt i visninger siste måned:

| Side | Visninger | Klikk |
|---|---|---|
| markedsforing-i-sosiale-medier-some | 341 | 0 |
| hva-er-innholdsproduksjon | 340 | 0 |
| hva-er-innholdsmarkedsforing | 172 | 0 |
| hva-er-videomarkedsfring | 116 | 0 |
| hva-gjr-en-innholdsprodusent | 96 | 0 |

1 065 visninger, null klikk. Hele nettstedet hadde 18 klikk den måneden,
og 15 av dem var folk som søkte «reflektor».

Å gi disse en kort svarblokk gjør dem bedre til å bli sitert på
definisjoner. Det er nettopp den typen innhold `AGENTS.md` allerede sier
ikke konverterer, og det er ikke flere skjemaer.

## Anbefaling

**Fem bloggposter til, alle om pris og valg:**

- hva-koster-videoproduksjon
- hva-koster-reklamefilm
- hva-koster-eventfotograf
- some-byra-frilanser-eller-ansatt
- hva-er-en-produksjonsdag

Samme grep som 25.10: en H2 «Det korte svaret» rett under ingressen, med
tall som allerede står i artikkelen, og et par spørsmål i ordlyden en
kjøper bruker.

**Ikke forsiden.** Den skal selge. Et faktaavsnitt over brettet flytter
blikket bort fra det som faktisk gir skjemaer, og forsiden har FAQ fra
før.

**Ikke tjenestesidene.** De har det allerede.

**Ikke ordbokartiklene.**

## Det som er verdt mer enn hele spørsmålet

Ahrefs' AI-overvåking for Reflektor (rapport `019ff375`, opprettet
12.08.2026) kjører daglig mot ChatGPT — **men den har null spørsmål lagt
inn.** Den måler ingenting, og «null omtaler» i den rapporten er derfor
ikke et funn om Reflektor.

Legges det inn ti–femten ekte kjøpsspørsmål — de samme som Search Console
allerede viser at folk stiller — får vi målt om dette arbeidet virker.
I dag gjetter vi.

**Tallet «23 % av AI-svarene» i bestillingen 25.10 er ikke kontrollert
her.** Vår egen rapport kan ikke bekrefte det, fordi den ikke måler noe.
Det bør ikke brukes som grunnlag før det er etterprøvd.
