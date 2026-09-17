# Arbeidssiden, «Om oss» og FAQ — evidensgrunnlag

Research gjennomført 17.09.2026 på bestilling fra Pål: hvordan bør «Vårt
arbeid» se ut målt mot tilsvarende sider i verdensklasse, og bør den hete
«Kundecaser»?

Samme kildekrav som `research-konvertering.md`: påstander her er enten målt
i denne økta, eller merket som mekanisme og ikke evidens. Blogginnlegg om
«beste byråsider 2026» er ikke brukt som kilde — de siterer hverandre.

---

## Metode

Ni internasjonale og fjorten norske sider ble hentet som rå HTML og
strukturert programmatisk: tittel, meta, overskriftsnivåer, lenketekster i
navigasjonen, ordtelling, antall video- og bildeelementer, JSON-LD. Åtte av
dem ble i tillegg gjengitt i nettleser og skjermbildet lest.

Søkevolumene er hentet fra Ahrefs for Norge. AGENTS.md sitt forbehold
gjelder: tallene er estimater og etterslepende. Her brukes de bare til å
avgjøre om et ord *er* et søkeord i det hele tatt — ikke til å avgjøre hva
siden skal handle om.

---

## Navnespørsmålet: nei, den skal ikke hete «Kundecaser»

### 1. Ingen av navnene er søkeord

| Søkeord | Volum/mnd (NO) | Hva folk leter etter |
|---|---|---|
| case | 800 | flertydig, mest ordbetydning |
| portefølje | 700 | finans |
| referanser | 350 | jobbreferanser |
| prosjekter | 200 | blandet |
| **kundecase** | **70** | hva ordet betyr |
| kundecaser | 0 | — |
| vårt arbeid | 0 | — |
| våre kunder | 0 | — |

Og `reflektor.no/vart-arbeid*` rangerer i dag på **null** organiske søkeord.

Navnet er altså ikke en SEO-beslutning. Ingen finner siden ved å søke på
hva den heter — de kommer fra menyen, fra forsiden, eller rett inn på en
enkelt case via kundens navn.

### 2. Bransjen er entydig, og den sier ikke «kundecaser»

Lenketeksten i hovedmenyen, hentet fra rå markup 17.09.2026:

| Byrå | Etikett | URL |
|---|---|---|
| TRY | Arbeider | /arbeider |
| POL | Arbeider | /arbeider |
| Nucleus | Arbeider | /arbeider |
| Morgenstern | Arbeider | / |
| Tibe | Arbeider | /prosjekter |
| Gyro | Prosjekter | /prosjekt |
| **Reflektor i dag** | **Vårt arbeid** | **/vart-arbeid** |
| Sandwich (US) | Work | /work |
| Monks (US) | Work | /work-inventory |
| Superside (US) | Customer Stories | /customer-stories |

Fem av seks norske byråer med en slik side kaller den «Arbeider». **Ingen
kaller den «Kundecaser».** Det eneste selskapet i utvalget som bruker
kundehistorie-språket, er Superside — og de er et abonnementsselskap som
selger design, ikke et produksjonsselskap.

### 3. Ordene betyr faktisk forskjellige ting

Dette er det avgjørende, ikke konvensjonen:

- **Arbeid** er alt vi har laget. Klipp, bilder, kunder, bransjer.
- **Et kundecase** er ett dokumentert samarbeid, med tall og kilde.

Reflektor har mye av det første og **to** av det andre. Å kalle hele siden
«Kundecaser» ville lovet dokumentasjon for alt som vises — og da må enten
dokumentasjonen på plass, eller så må det meste av arbeidet av siden.

### Konklusjon

Siden heter **Vårt arbeid**. Enkeltsidene heter fortsatt **kundecase**, og
seksjonen med de to dokumenterte heter **Kundecaser**. Det er nøyaktig det
skillet dagens side allerede gjør — den har `title: «Kundecaser…»` og
`H1: «VÅRT ARBEID»` — og det som så ut som en inkonsekvens, var riktig.

URL-en ligger uansett fast: `/vart-arbeid` er live og i sitemapet, og regel
én i AGENTS.md er at levende URL-er ikke flyttes.

---

## To modeller for en arbeidsside, og hvorfor Reflektor er en tredje

Målingen viser to tydelige familier:

**Arbeidsmodellen** — Sandwich, Buck, Instrument, Pentagram, Heydays.
Mediet fyller flaten, etiketten er «Kunde + Prosjekt», og det er ingen
løpende tekst. Sandwich: 359 ord på hele oversiktssiden, rutenett fra kant
til kant, filtrering på type. Buck: 308 prosjekter som hver sin `<h2>`.
Selger håndverk.

**Kundehistoriemodellen** — Superside. Kort med lesetid, overskriften ER
resultatet («How Colgate-Palmolive scaled a global rebrand across over 200
markets…»), teaser i brødtekst. 1 311 ord. Selger resultater.

Reflektor selger begge deler: håndverket (produksjonsselskap) og resultatet
(abonnement). Dagens to casesider gjør allerede dette — og de gjør det
bedre enn noen av de målte utenlandske:

> Offentlige Instagram-data via Supermetrics per 8. september 2026. Tallene
> gjelder hele kontoen til Egon i samarbeidsperioden og måler visninger,
> ikke salg.

**Ingen av de ni internasjonale sidene oppgir kilde på et eneste tall.**
Det er Reflektors sterkeste og mest uventede fortrinn på denne siden, og
det er grunnen til at kildelinja er markert som ufravikelig i koden.

### Én ting å merke seg om Buck

`buck.co/work` rendret **helt tomt** uten JavaScript-kjøring — 307 bilder i
markupen, null lesbart innhold. Det er den vanligste feilen i denne
sjangeren: et rutenett bygget som en applikasjon. En språkmodell som henter
siden, får ingenting. Reflektors sider er statisk genererte og har hele
teksten i HTML-en.

---

## Hva som ble bygget

### /vart-arbeid

Tre nivåer i synkende beviskraft, og rekkefølgen er argumentet:

1. **To dokumenterte kundecaser** — navn, tall, kilde, egen side
2. **Utvalgt arbeid** — klipp som viser håndverk, uten å påstå resultater
3. **Produksjonskunder** — logorekka, merket som det den er

Punkt tre er en felle prosjektet har vært nær å gå i før: logorekka er
produksjonskunder, ikke SoMe-abonnenter. Den står nederst, med egen
merkelapp og en setning som sier det rett ut.

### /vart-arbeid/[slug]

Malen er Reflektors egen, migrert ordrett. Den følger spørsmålene en
innkjøper stiller i rekkefølge, og tallene kommer **før** historien — leseren
vet allerede hva han leter etter.

### /om-oss

Migrert ordrett fra dagens side, som var publisert hele tiden mens den nye
siden sto med en TODO som sa «avventer tekst fra Reflektor».

Ingen oppdiktede verdier. De tre prinsippene som står der — rytme, pris,
målemetode — er konkrete og kan motbevises. «Vi brenner for kvalitet» kan
ikke det, og er derfor verdiløst både for en leser og for en svarmotor.

### /faq

Nitten spørsmål gruppert i fire, uten at ett ord er endret. En flat liste
på nitten er ikke en FAQ, det er et arkiv.

`<details name="…">` per gruppe gir et eksklusivt trekkspill uten en eneste
linje JavaScript, og svarene ligger i DOM-en også når de er lukket — det er
hele grunnen til at trekkspill er trygt her.

---

## AEO: hva som faktisk er gjort

Fire grep, ingen av dem visuelle:

1. **`BreadcrumbList`** på alle tre. Dette er den ene markeringen på siden
   som fortsatt gir et ekte rich result — FAQ-funksjonen er død siden 7. mai
   2026, brødsmulene lever.
2. **`Article` med `about: Organization`** på hvert case. Spørsmålet en
   språkmodell får er «hvem lager innhold for Egon», ikke «hva heter
   Reflektors caser». Uten `about` er kundenavnet bare et ord i en
   overskrift.
3. **`AboutPage` med `employee: Person[]`** på /om-oss. «Hvem jobber i
   Reflektor» besvares fra JSON-LD, ikke fra HTML.
4. **Tall med kilde og forbehold.** Den viktigste av de fire, og den eneste
   som ikke er markup. En påstand med verktøy, dato og «måler visninger,
   ikke salg» er den eneste typen en språkmodell kan gjengi uten å ta en
   risiko på våre vegne.

---

## Hva som IKKE er gjort, og hvorfor

- **Ingen filtrering på bransje eller tjeneste.** Sandwich har det, og det
  er riktig for dem: de har hundrevis av filmer. To caser og elleve klipp
  trenger ingen filtrering — et filter over to elementer er en tom gest.
- **Ingen portretter på /om-oss.** Det finnes ingen godkjente portrettbilder
  i repoet, og et grått plassholderhode er verre enn ingen på nettopp den
  siden som skal bygge tillit.
- **Ingen tredje case.** Anton Sport står omtalt på dagens oversiktsside
  uten lenke — det er et kundenavn, ikke et kundecase. Se A45.
