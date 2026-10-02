# Prompt til Cowork

Kopier alt mellom strekene og lim det inn i Cowork. Du må være innlogget i
Google Ads og hos one.com i nettleseren først.

---

Du skal gjennomføre to endringer for meg i nettleseren, i denne rekkefølgen.
Jeg heter Pål og eier reflektor.no. Vi flytter nettsiden fra Squarespace til
Vercel i dag.

**Les hele oppdraget før du begynner.** Steg 2 er irreversibelt i praksis og
kan slå ut e-posten vår hvis det gjøres feil.

## Dette skal du ALDRI gjøre

- **Ikke slett eller endre MX-records.** De peker på Google
  (aspmx.l.google.com og alt1–alt4). E-posten vår går gjennom dem. Slettes
  de, mister vi all e-post, inkludert henvendelsene fra nettsiden.
- **Ikke rør noen TXT-records.** Der ligger SPF, DKIM (google._domainkey),
  DMARC (_dmarc) og en Google-verifisering. Alle må stå urørt.
- **Ikke bytt navnetjenere.** De skal fortsatt være ns01.one.com og
  ns02.one.com. Å flytte dem til Vercel ville tatt med seg alle records
  over, og da ryker e-posten.
- **Ikke logg inn på Squarespace.** Du har ingen ærend der. Den gamle siden
  skal bli stående urørt som reserve.
- **Ikke slett domenet eller si opp noe abonnement.**

Du skal endre nøyaktig to ting: A-recordene på reflektor.no, og
CNAME-recorden på www. Alt annet står.

## Steg 1: Google Ads

Gå til Google Ads. Finn annonsene som peker på
`https://www.reflektor.no/sosiale-medier-byra`.

Bytt endelig URL på disse til `https://www.reflektor.no/`.

Si fra hvor mange annonser eller annonsegrupper du endret. Finner du ingen
som peker dit, si fra — da hopper vi over dette steget.

**Dette må være gjort før du går videre til steg 2.**

## Steg 2: Hent riktig CNAME-verdi fra Vercel

Gå til <https://vercel.com/reflektor/reflektor-ny/settings/domains>

Der står `www.reflektor.no` og `reflektor.no`. Begge vil vise en advarsel om
at DNS ikke peker hit — det er riktig, og det er det vi skal rette nå.

Klikk deg inn og finn de nøyaktige DNS-verdiene Vercel ber om:

- hvilken **A-record** reflektor.no skal ha (forventet: 76.76.21.21)
- hvilken **CNAME-verdi** www.reflektor.no skal ha

**Skriv av CNAME-verdien ordrett.** Vercel bruker flere ulike verter, og
bare den som står på vår side er riktig. Ikke bruk en verdi du har sett
andre steder.

## Steg 3: Endre DNS hos one.com

Logg inn på one.com og gå til DNS-innstillingene for reflektor.no.

**Først: ta et skjermbilde av hele listen slik den ser ut nå**, før du endrer
noe. Det er sikkerhetskopien vår.

Så gjør nøyaktig dette:

1. **A-records på reflektor.no (uten www):** i dag står det fire stykker —
   198.49.23.144, 198.49.23.145, 198.185.159.144 og 198.185.159.145. Dette er
   Squarespace. Erstatt alle fire med **én** A-record mot verdien fra Vercel.

2. **CNAME på www:** i dag peker den på `ext-cust.squarespace.com`. Endre den
   til verdien fra Vercel.

3. **Alt annet står.** MX, TXT, SPF, DKIM, DMARC og eventuelle andre
   oppføringer skal være nøyaktig som før.

Ta et skjermbilde av listen etterpå også.

## Steg 4: Kontroller

Vent noen minutter. TTL er én time, så det kan ta opptil en time før alt har
spredd seg.

Sjekk så:

- `https://www.reflektor.no` skal etter hvert vise den nye siden. Den har
  overskriften «Sosiale medier – nesten på autopilot.» Viser den fortsatt den
  gamle siden, er det bare at DNS ikke har spredd seg ennå.
- Gå tilbake til Vercel-domenesiden. Advarselen skal forsvinne og domenene
  skal vise som gyldige.
- **Send en test-e-post til pal@reflektor.no fra en annen adresse, og sjekk
  at den kommer fram.** Dette er viktigere enn at nettsiden virker.

## Stopp og spør hvis

- Noe ikke ser ut som beskrevet over
- one.com vil bytte navnetjenere eller «koble til Vercel automatisk»
- Vercel sier domenet er i bruk i et annet prosjekt
- Du er i tvil om en record er e-post eller nettside

Da stopper du og sier fra til meg i stedet for å gjette.

## Rapporter tilbake

1. Hvor mange annonser du endret i Google Ads
2. De nøyaktige verdiene du hentet fra Vercel
3. Skjermbilde av DNS-listen før og etter
4. Om www.reflektor.no viser den nye siden
5. Om test-e-posten kom fram

---
