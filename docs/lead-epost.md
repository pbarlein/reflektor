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

~~**Sjekken «har leadet svart?» er ikke bygget.**~~ **Bygget 04.10.2026,
etter at fornyingsnøkkelen fikk `gmail.readonly`.** Se eget avsnitt under.

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

## Avsendernavnet, rettet 04.10.2026

Første ekte sending viste avsenderen som «PÃƒÂ¥l Barlein» i Gmail. Årsaken
var at navnet sto rått i `From`-headeren. E-postheadere er ASCII; en klient
som møter en «å» der, leser byte-ene som Latin-1 og viser tegnsalat.

Nå kodes alle headere med ikke-ASCII etter RFC 2047 — `=?UTF-8?B?…?=` —
både `From` og `Subject`, også «Re:»-utgaven i påminnelsen. Lange
overskrifter deles i flere kodede ord på 75 tegn, slik standarden krever, og
delingen skjer aldri midt i et tegn. ASCII-tekst går urørt gjennom, så
ingenting kan bli dobbeltkodet.

Brødteksten var riktig fra før: begge MIME-delene sier `charset=UTF-8` og
`Content-Transfer-Encoding: base64`. Base64-en brettes nå på 76 tegn, som
RFC 2045 krever. Signaturen har ingen `mailto:`-lenke — adressen og
telefonnummeret er ren tekst, og bare Canva-lenken og `/book` er lenker.
Verifisert med en uavhengig RFC 2047-dekoder, ikke bare med vår egen.

## Svarsjekken, bygget 04.10.2026

Før påminnelsen går ut, leses Gmail-tråden. Har noen andre enn
avsenderadressen skrevet i den etter at e-post 1 gikk ut, sendes
påminnelsen ikke.

**Hvem som helst annen teller.** En kollega på kopi, en videresending eller
et autosvar er også et tegn på at tråden lever. Da skal ikke maskinen mase.

**Tidspunktet er med fordi Gmail tråder på emne.** Har Pål snakket med
samme adresse før, kan eldre meldinger ligge i samme tråd. Bare det som kom
etter e-post 1 teller som svar.

**Et usikkert nei stopper ingenting.** Fikk vi ikke lest tråden — manglende
tilgang, feil hos Google, nettverk — sendes påminnelsen likevel, og feilen
logges. Verste utfall av å sende er at en som alt har svart får én e-post
for mye. Verste utfall av å ikke sende er at vi mister leadet. En
forbigående feil skal ikke stilne hele oppfølgingen uten at noen merker
det.

**Lesetilgang ber vi bare om når vi skal lese.** Med tjenestekonto svarer
Google nei på hele nøkkelen hvis en administrator ikke har gitt
`gmail.readonly` — og da hadde også sendingen stoppet. Derfor er de to
kallene skilt: sending ber om `gmail.send` alene.

Kallet henter bare `From`-headeren, ikke innholdet i meldingene.

## 04.10.2026: de første ekte leadene, og fire feil

Kl. 06:38 kom et Meta-lead. Kl. 06:39 booket samme person møte via
reflektor.no/book — med en annen e-postadresse. HubSpot laget to kontakter.
Kl. 06:40 sendte jobben presentasjon og «book her» til begge, og den ene
åpnet med «Hei Bakst!» til en person som heter Munirat og driver «Bakst &
Ro | Hjemmebakt i Asker».

Fire regler kom ut av det.

**Bare skjemaleads får e-post 1.** Konverteringen må være nettskjemaet eller
Meta-skjemaet. En booking gir konverteringen «Meetings Link:
paal-barlein/intro», og den kontakten skal ingen automatisk e-post til.

**Et booket møte stopper begge e-postene.** Her sto det før at et møte
booket FØR e-post 1 var «gammelt» og ikke skulle stoppe påminnelsen. Det er
snudd: har personen et møte i HubSpot, skal maskinen ikke mase.

**Samme person under en annen adresse kjennes igjen** på telefonnummerets
siste åtte sifre eller på bedriftsnavnet uten selskapsform og tegn. Finner
vi en annen kontakt som har booket, sendes ingenting.

Feltet `engagements_last_meeting_booked` er **møtetidspunktet, ikke
bookingtidspunktet**. På kontakten fra 04.10 sto det 16.10. Et filter på
«siste fjorten dager» ville derfor bommet på nettopp dette tilfellet, så
vinduet er «fra fjorten dager tilbake og framover»: det fanger både møtet
som var i forrige uke og møtet som skal være neste uke.

**Meta-leads venter tre minutter.** Nok til at en booking rett etter
skjemaet rekker å bli en kontakt. Nettsideleads venter ikke — de sendes fra
skjemaruta, og den som booker på `/takk` har alt fått e-posten.

**Hilsenen bruker fornavn bare når det ser ut som et navn.** `&`, `|`,
selskapsformen «AS» som eget ord, sifre, eller at fornavnet ligger i
bedriftsnavnet, gir «Hei!». Vi heller mot «Hei!» i tvil: et generisk «Hei!»
er umerkelig, et galt fornavn er det ikke.

### Varselet for Meta-leads kommer nå fra jobben

HubSpot-arbeidsflyten varslet med fast tekst om «neste hverdag kl. 09:00»,
uten avbryt-knapp, og med Metas rå verdier («nei,\_ikke\_nå») rett i
e-posten. Nå er malen den samme som for nettsideleads: emnet «NYTT LEAD fra
Meta», feltene Avsender, Mobilnummer, E-post, Bedrift, Antall ansatte,
Passer 30 000 kr/mnd og Oppstart, eksakt dato for påminnelsen, «Ring ASAP»,
og begge knappene. Svar går til leadet.

Har personen booket, sier varselet det i stedet: «Har allerede booket møte
<dato kl.>. Ingen automatisk e-post sendt.» Da finnes det ingen påminnelse
å avbryte, og knappen står ikke der.

**Markøren er `paminnelse_avbrutt`.** Jobben setter den selv når ingen
e-post skal sendes, og kontakten faller ut av kandidatlisten. Uten den ville
varselet gått ut på nytt hvert femte minutt.

**Rekkefølgen er ikke tilfeldig.** For den som har booket sendes varselet
FØR merkingen: feiler Resend, prøver neste kjøring igjen. Når e-post 1 er
sendt, varsles det ETTER merkingen: e-posten til kunden kan ikke sendes om
igjen bare for å få varselet ut.

### Det Pål må gjøre

Slå av de to HubSpot-varslene i arbeidsflyten «Nytt lead – inbound»
(handling 2 og 4), ellers kommer Meta-varselet i to utgaver.

### Kanter som står igjen

Et nettsidelead som booker innen fem minutter har alt fått varselet med
«Påminnelse sendes <dato>». Jobben stopper e-postene, men varselet er
allerede sendt. Knappen for å avbryte står der, så Pål er ikke lurt — men
linjen stemmer ikke for den ene.

Et Meta-lead som er `customer` eller har en @reflektor.no-adresse får ingen
e-post, og dermed heller ikke noe varsel herfra.

## Sendevinduet 07–21 (bestilt 04.10.2026)

E-posten ser ut som en Pål skrev selv, fra hans egen Gmail. Da kan den ikke
komme kl. 03:12.

**Vinduet er 07:00–21:00 i Oslo.** Kommer leadet innenfor, sendes e-post 1
som før, innen fem minutter. Kommer det utenom, holdes den til **neste
morgen kl. 08:00**, og jobben sender da alt som ligger i kø.

**Åtte om morgenen, ikke sju.** Vinduet åpner 07:00, men køen tømmes 08:00:
et lead som kom kl. 02 skal ikke ligge først i innboksen når kunden slår på
telefonen.

**Helg teller som vanlig dag.** Lead lørdag kl. 23 → søndag kl. 08. Her
skiller sendevinduet seg fra påminnelsen, som venter til nærmeste hverdag.
Presentasjonen er svaret på en henvendelse personen nettopp har sendt, og
den tåler ikke å ligge til mandag.

**Varselet til Pål går med en gang, uansett klokkeslett** — men det sier da
«Presentasjon og møtelink sendes <dag> kl. 08:00» i stedet for «sendt». En
linje som lover noe som ikke har skjedd, er verre enn ingen linje.

**Påminnelsen regnes fra den faktiske sendetiden.** Lead søndag kl. 23 →
e-post mandag kl. 08 → påminnelse tirsdag. Regnet fra søndag ville
påminnelsen gått mandag, altså før e-posten den minner om.

Oversiktssiden `/paaminnelse` viser «Presentasjon sendes …» for leads som
venter. `/api/skjema` gjør ingenting utenom vinduet — regelen ville stoppet
e-posten uansett, men da hadde vi brukt et HubSpot-oppslag på å få vite det.

## Avtalen flyttes til «Møte booket» (bestilt 04.10.2026)

HubSpot setter `engagements_last_meeting_booked` når noen booker via
møtelenken, men flytter ikke avtalen. Pål måtte dra kortet selv, og et
stadium som ikke stemmer er et stadium han ikke kan styre etter.

Jobben gjør det nå, hver kjøring, for kontakter med booking de siste fjorten
dagene.

**Stadie-ID-en slås opp, den er ikke hardkodet.** ID-ene i denne porteføljen
er en blanding av HubSpots standardnavn (`presentationscheduled` heter «Møte
booket») og et rent tall (`6002758898` heter «Hviler»). Skriver noen om
pipelinen, skal koden følge etter.

**Bare framover.** En avtale flyttes bare hvis den står i et tidligere
stadium enn «Møte booket», målt på rekkefølgen pipelinen selv oppgir. Da er
Tilbud sendt, Vunnet, Hviler og Tapt trygge uten at noen liste må holdes
oppdatert. Et stadium som ikke finnes i pipelinen hører til et annet oppsett
og røres ikke.

**Finner vi ingen avtale på kontakten, leter vi etter samme person.** Det
var tilfellet 04.10.2026: bookingen laget en ny kontakt uten avtale, mens
avtalen hang på Meta-kontakten med en annen e-postadresse. Bookingkontakten
hadde ikke telefonnummer i det hele tatt — det var bedriftsnavnet som bandt
dem sammen. Samme normalisering som dublettsjekken.

**Flyttingen går uavhengig av bryteren og av Gmail.** Det er en opprydding i
CRM-et, ikke en e-post til en kunde. Feiler den, går resten av jobben som
normalt, og hver flytting logges.

Krever `crm.objects.deals.write` på HubSpot-tokenet. Mangler den, svarer
HubSpot 403, og logglinjen sier det rett ut.

### Stadienavnene i prompten stemmer ikke med porteføljen

Prompten ba om «fra «Ny»/«Kontaktet» → «Møte booket»». De to stadiene finnes
ikke i «Reflektor – salg». Stadiet alle nye leads havner i heter
**Interessert**, og det er det som flyttes. Testene bruker de faktiske
navnene.

## Unikt emne på varslene (bestilt 04.10.2026)

Alle varslene hadde samme emne, og Gmail la dem i én samtale. Da skjuler
Gmail på mobil linjene som er like forrige melding bak «…» — og det var
nettopp linjen om presentasjon og påminnelse, den Pål leser for å vite hvor
lang tid han har på å ringe.

Emnet er nå `NYTT LEAD fra reflektor.no – <Navn> (<Bedrift>)`, og tilsvarende
for Meta. Uten bedrift står navnet alene, uten navn står e-postadressen.
**Prefikset står urørt først**, fordi leadsjekken søker på det.

Hvert varsel får i tillegg sin egen `Message-ID`, og det sendes ingen
`In-Reply-To` eller `References`. **Avviser Resend de egne headerne, sendes
varselet på nytt uten dem.** Et varsel som ikke kommer fram er verre enn et
varsel i feil tråd, og headerne er det eneste nye i forsendelsen — så en 4xx
på første forsøk betyr at de skal bort.

## Ingen dobbel avtale ved booking (bestilt 04.10.2026)

Testen 04.10: «Kristine Haugland» sendte skjemaet og fikk kontakt og avtale.
Så booket hun møte med en feilstavet e-postadresse. HubSpot laget en ny
kontakt, arbeidsflyten laget en ny avtale på den, og jobben flyttet **den
nye** til «Møte booket» — mens den opprinnelige sto igjen i «Interessert».
To avtaler på samme person.

Nå flyttes **den opprinnelige**, bookingkontakten knyttes til den, og den
nye arkiveres.

**Arkivering er gjenopprettbar.** HubSpot flytter avtalen til papirkurven og
holder den der i nitti dager. Det er grunnen til at dette i det hele tatt
kan gjøres av en maskin.

Tre krav må alle holde før en avtale arkiveres: under 24 timer gammel, i
«Interessert» eller «Møte booket», og ingen har gjort noe med den etter at
den ble laget.

### «Ingen notater» måtte bli «ingen eget arbeid»

Bestillingen ba om at avtalen ikke skulle ha noen aktiviteter eller notater.
Begge avtalene fra 04.10.2026 hadde **ett notat hver** — lagt på av
arbeidsflyten i samme øyeblikk avtalen ble laget. En regel om «ingen
notater» ville derfor aldri slått til, og nettopp den avtalen vi vil rydde
bort hadde stått igjen.

Grensen er derfor **ti minutter etter opprettelsen**: alt som kom med i
selve opprettelsen regnes som maskinens eget, mens et notat Pål skriver
etterpå gjør avtalen hans og beskytter den.

Fikk vi ikke sjekket aktivitetene, står avtalen. Å slette noe vi ikke klarte
å kontrollere er den ene feilen som ikke kan rettes med et nytt kall.

### Når ingenting røres

Finnes ingen makker, er det en helt ny person som booket direkte. Da er
avtalen arbeidsflyten laget den eneste som finnes, og den flyttes som før.

Står makkerens avtale forbi «Møte booket» — tilbud sendt, vunnet, hviler
eller tapt — rører vi ingenting. To avtaler er da en avgjørelse et menneske
har tatt.
