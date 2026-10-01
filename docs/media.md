# Hvor bilder og video skal ligge

Kort svar: **bilder i `public/bilder/`, video i `public/video/`.**
Store videofiler er eneste unntak – de går til Vercel Blob.

## Bilder → `public/bilder/`

Legg filene i undermappene som er satt opp der, og commit dem. Se
`public/bilder/LES-MEG.md` for mappestruktur og navnekonvensjoner.

Bruk `next/image` når de tas i bruk – den lager responsive størrelser,
konverterer til WebP/AVIF og lazy-laster automatisk:

```tsx
import Image from "next/image";

<Image
  src="/bilder/team/pal-barlein.jpg"
  alt="Pål Barlein, CEO i Reflektor"
  width={800}
  height={1000}
/>
```

Alt-tekst er påkrevd. Skriv den som en beskrivelse av bildet, ikke som en
plassholder.

## Video → `public/video/`

Web-optimaliserte klipp under ~25 MB legges rett i `public/video/`.

Grensen er ikke vilkårlig: GitHub avviser filer over 100 MB, og git lagrer
hver versjon av en binærfil for alltid – også slettede. Korte klipp er
uproblematiske, ferdige kundefilmer er det ikke.

### Store filer → Vercel Blob

Dere har Vercel Pro, så dette er allerede betalt for. Filene ligger utenfor
git, men serveres fra samme CDN som siden.

```bash
npx vercel blob put video/egon-case.mp4
```

Kommandoen returnerer en URL du limer inn i `src/content/`. Filer kan settes
private om innholdet ikke skal være åpent tilgjengelig.

### Mange eller lange filmer → streaming

For lengre filmer eller mange av dem er en ekte videotjeneste bedre enn en
MP4-fil. Mux, Cloudflare Stream eller Vimeo gir adaptiv bitrate – seeren får
en kvalitet som matcher forbindelsen, i stedet for å laste ned hele filen.

Merkbar forskjell på mobil, som er der mesteparten av trafikken er.

### Allerede innebygd et sted?

Videoene på dagens side ligger allerede et sted. Er de innebygd fra en
tjeneste, kan de samme innbyggingene gjenbrukes direkte.

## Format

- **Video:** MP4, H.264, maks 1080p. Web trenger ikke mer.
- **Stille bakgrunnsvideo:** kort loop, uten lyd, under 5 MB. Legg på
  `muted`, `playsInline`, `loop` og et `poster`-bilde.
- **Bilder:** originaler i god oppløsning, ca. 2000 px bredde.

## Hva jeg kan og ikke kan gjøre herfra

Nettverkspolicyen i Claude Code-miljøet blokkerer utgående trafikk til
Dropbox, Vercel Blob og reflektor.no. Jeg kan altså **ikke** hente filene fra
Dropbox og legge dem inn selv – bytene må dere flytte.

Det jeg kan gjøre når filene er på plass: koble dem opp i komponentene, skrive
alt-tekster, sette riktige størrelser og sørge for at de lastes effektivt.

Filene finnes allerede i Dropbox under `/Reflektor/Bildearkiv`,
`/Reflektor/Videoarkiv` og `/Reflektor/Assets`.

## To regler for hva som kan brukes (bestilt av Pål 28.09.2026)

**Bare ferdige eksporter. Aldri råopptak fra kamera.** Videoarkivet er stort
sett rått materiale — ugradert, uklippet, ofte i logg-profil. Det ser flatt og
grått ut, og en referansefilm som viser ugradert materiale sier det motsatte av
det den skal si. De ferdige filene ligger i `Kundemappe/<kunde>/Video/`, ikke i
`Videoarkiv/<kunde>/`. Videoarkivet er arbeidsmappen; kundemappen er leveransen.

Kjennetegn på en ferdig fil: den har et navn et menneske har skrevet
(«Smarketing kort v2.mp4»), ikke et kameranavn («B51A7897.MP4»). Er du i tvil,
hent en ramme og se: rått 4K-materiale fra disse kameraene er merkbart flatere
enn den ferdige filmen fra samme opptak.

**Hele filmen, ikke et utdrag.** Påls ordlyd: «la videoene gå i sin helhet.
blir en dårlig referanse på siden om man bare ser en liten del.» Fire sekunder
klippet ut av en profilfilm er stemning, ikke en referanse. Skal en film stå på
siden som arbeidsprøve, skal den stå hel — og da trenger den kontroller og lyd,
ikke dempet autospill i løkke. Se `Referansefilm` i `src/content/tjenester.ts`.

Unntaket er det korte klippet som leses som bevegelse: reel-veggen,
arbeidsrutenettet, en femten sekunders reklamefilm uten replikk. De er ikke
arbeidsprøver, de er tekstur.

## Dropbox som mediekilde (verifisert 15.09.2026)

Pål kan legge bilder og video i Dropbox, og Claude Code henter og komprimerer
derfra. Hele kjeden er testet ende-til-ende, ikke antatt.

**Forutsetningen** er at miljøets nettverksnivå er **Custom** med
`*.dropboxusercontent.com` i allowlisten. Uten den linjen lister MCP-en fint,
men innholdet blokkeres av proxyen med `CONNECT tunnel failed, response 403`.
Nivået settes på cloud-miljøet (skyikonet ved sesjonstittelen, eller
miljøvelgeren på «New»), og leses ved oppstart.

Husk å krysse av for «Also include default list of common package managers» —
uten den forsvinner npm og PyPI, og buildet stopper.

### Arbeidsflyten

1. Pål legger kandidater i en mappe, f.eks. `/Reflektor/Marketing/Nettside/`
2. `mcp__Dropbox__list_folder` lister dem med størrelse og dato
3. `mcp__Dropbox__download_link` gir en engangs-URL (60–900 sekunder)
4. `curl` henter filen ned i containeren
5. Komprimering med `imageio-ffmpeg` / `pillow` — se resten av dokumentet
6. Resultatet commites til repoet

### Verifiser alltid sjekksummen

`download_link` returnerer `content_hash`. Det er Dropbox' egen blokkbaserte
SHA-256: filen deles i 4 MiB-blokker, hver blokk hashes, og hashene
konkateneres og hashes på nytt. Ikke en vanlig `sha256sum`.

```python
import hashlib
blocks = []
with open(sti, "rb") as f:
    while (b := f.read(4 * 1024 * 1024)):
        blocks.append(hashlib.sha256(b).digest())
print(hashlib.sha256(b"".join(blocks)).hexdigest())
```

Testet på en 61 654-byte JPEG: match. Verdt å kjøre på videofilene, der en
avkortet overføring ellers kan gi en fil som ser hel ut helt til ffmpeg
kveler på den.

### URL-en er engangs

Den brukes opp av første HTTP-forespørsel uansett metode — også `HEAD` og
Range. Ikke forhåndssjekk den med `curl -I` først; da er den brukt opp når
nedlastingen skal skje. Hent en ny `download_link` per forsøk.

## Nettleser i containeren — og CA-fellen

Chromium er forhåndsinstallert på `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
Merk versjonssuffikset: stien uten det (`/opt/pw-browsers/chromium/...`) finnes
ikke, selv om `PLAYWRIGHT_BROWSERS_PATH` peker på mappen over.

Installer Playwright med `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` så npm ikke
prøver å hente en nettleser som allerede ligger der.

**Fellen:** første navigasjon feiler med `ERR_CERT_AUTHORITY_INVALID`. Proxyen
terminerer TLS, og Chromium leser ikke `/etc/ssl/certs` — den bruker sin egen
NSS-database. `--use-system-ca` hjelper ikke.

Riktig fiks er å legge CA-ene i NSS-basen. Ikke slå av sertifikatvalidering;
det er unødvendig her, og det skjuler ekte feil senere:

```bash
apt-get update -qq && apt-get install -y libnss3-tools
cd /usr/local/share/ca-certificates
for f in *.crt; do
  certutil -d sql:/root/.pki/nssdb -A -t "C,," -n "${f%.crt}" -i "$f"
done
```

`apt-get update` først er nødvendig — pakkeindeksen i imaget er utdatert og
peker på en versjon som er borte fra speilet (404).

### Slik ble Google-anmeldelsene hentet

De lå bak Elfsight-widgeten, altså i JavaScript og aldri i HTML. Å gjette
Elfsights API-endepunkter var blindvei — de er udokumenterte og flytter seg.

Det som virket: render `www.reflektor.no` i Chromium, lytt på `response`, og
fang svaret widgeten selv henter. Widgeten er lazy-lastet, så siden må rulles
til bunns før forespørselen i det hele tatt skjer.

```js
p.on("response", async (r) => { /* filtrer på /review/ og status 200 */ });
await p.goto(url, { waitUntil: "networkidle" });
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 1200); await p.waitForTimeout(700); }
```

Nyttesvaret kom fra `service-reviews-ultimate.elfsight.com/data/reviews`, med
`result.data[]` og feltene `reviewer_name`, `rating`, `text`, `published_at`,
`url` og `response` (Reflektors eget svar på anmeldelsen).

To ting verdt å vite neste gang: DOM-teksten er avkortet med «Les mer», så
fulltekst må tas fra API-svaret. Og Reflektors egne svar er gull — de navngir
selskapet anmelderen jobber i, der anmeldelsen selv ikke gjør det.

Resultatet ligger i `src/content/anmeldelser.ts`.

## Klippene på forsiden

Hentet fra `/Reflektor/SALG/Claude Code/Bilder og videoer` (139 filer) via
Dropbox-MCP + curl, verifisert mot `content_hash`, komprimert lokalt.

| Klipp | Bransje | Kilde | Web |
|---|---|---|---|
| `antonsport` | Sportsbutikk | 134 MB, 4K, 21,6 s | 2,4 MB |
| `thewell` | Spa og hotell | 39 MB, 4K, 10,0 s | 1,4 MB |
| `goretex` | Friluft | 120 MB, 4K, 19,2 s | 3,3 MB |
| `soulcake` | Bakeri | 135 MB, 4K, 23,6 s | 2,7 MB |

429 MB → 9,5 MB, altså 45×. Posterbildene er 187 kB til sammen, og det er
alt som lastes før et klipp kommer i viewport.

Kommandoen, for gjenbruk:

```bash
ffmpeg -i inn.mp4 -vf "scale=720:1280:flags=lanczos" -an \
  -c:v libx264 -profile:v high -crf 30 -preset slow -pix_fmt yuv420p \
  -movflags +faststart ut.mp4
ffmpeg -ss 1 -i inn.mp4 -frames:v 1 -vf "scale=540:960:flags=lanczos" -q:v 6 ut.jpg
```

To valg verdt å kjenne:

- **Posterbildet tas ett sekund inn**, ikke på første frame. Første frame er
  ofte svart eller en innfading, og et svart posterbilde ser ut som en feil.
- **Kildefilene beholdes i 9:16.** Beskjæringen til 8:16 ligger i CSS med
  `object-fit: cover`, så formatet kan endres uten å re-enkode.

Originalene skal ikke inn i repoet. De ligger i Dropbox.

## Stillbildene på forsiden (20 stk)

Hentet fra samme Dropbox-mappe, samme vei som klippene. 247 MB 4K-originaler
ned til 4,0 MB kildefiler; `next/image` lager AVIF/WebP og responsive
størrelser derfra i kjøretid.

To sett med hver sin jobb:

| Sett | Antall | Kildebredde | Jobb |
|---|---|---|---|
| `redaksjonelt` | 8 | 1600 px | Kvalitet. Ujevne bredder, styrte radhøyder. |
| `band` | 12 | 640 px | Volum. Tett, jevnt, full bredde. |

```bash
# Nedskalering før commit – next/image jobber med 4 MB, ikke 250
python -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(inn)).convert('RGB')
im.thumbnail((1600, 6400), Image.LANCZOS)
im.save(ut, 'JPEG', quality=78, optimize=True, progressive=True)"
```

`ImageOps.exif_transpose` er ikke valgfritt: flere av kildefilene har
orienteringsflagg i EXIF, og uten den kommer bilder fra enkelte kamera ut
liggende når de skal stå.

### MÅ SJEKKES AV PÅL: gjenkjennelige tredjepartsmerker

Bildene har ingen bildetekster, men flere merker er lesbare i motivet:

- **Freia / Japp** — hele `dag2`–`dag6` er fra samme arrangement, og
  `mat1` viser Japp-produkter i et produksjonslokale. Freia eies av Orkla,
  som er navnet som ble tatt ut av den bekreftede kundelisten.
- **Michelin** — plaketten i `stallen`
- **Adidas** — jakken i `peppes1`
- **ZERoh!**, **Sunkost**, **Battery**, **Gore-Tex**

Å vise egne arbeidsprøver er normal praksis, og ingen av dem er navngitt i
tekst. Men merkene er synlige, og særlig Freia-bildene er verdt en bevisst
vurdering gitt hvordan Orkla er håndtert ellers i prosjektet. Skal noen ut,
er det å fjerne én linje i `src/content/arbeid.ts`.

## Veggen og prisklippet (16.09.2026)

Arbeidsveggen erstattet båndet, og prisseksjonen fikk et klipp. Samme
pipeline som resten: Dropbox-MCP → `download_link` → `curl` → `content_hash`
verifisert → komprimert lokalt. Alle fem nedlastningene stemte på sjekksum.

### Enkodingen

| Fil | Format | Kilde | Vindu | Størrelse |
|---|---|---|---|---|
| `reels/produksjonsdag.mp4` | 540×960 | BakerBrun_BTS_V1.mov | 3,0–11,0 s | 382 kB |
| `arbeid/noods.mp4` | 1024×576 | Noods_V2_16x9.mov | 0,5–6,5 s | 624 kB |
| `arbeid/servering.mp4` | 1024×576 | peppes-15s.mp4 | 5,6–11,6 s | 414 kB |
| `arbeid/matcha.mp4` | 440×782 | Matcha.mp4 | 0,3–4,4 s | 158 kB |
| `arbeid/spa.mp4` | 440×782 | Rhassoul 9x16 Reel.mov | 0,5–6,5 s | 171 kB |
| `arbeid/kontor.mp4` | 440×782 | Moody Corporate 9x16.mp4 | 6,6–12,6 s | 95 kB |
| `arbeid/kakao.mp4` | 440×782 | Kakao.mp4 | 0,5–6,5 s | 72 kB |
| `arbeid/bekkestua.mp4` | 440×782 | Bekkestua.mp4 | 13,0–19,0 s | 272 kB |

Til sammen 2,19 MB, hvorav 1,81 MB er veggen. Alle beskåret til
målformatet ved enkoding, ikke i CSS: hver av dem brukes ett sted, i én
form, så de tretti prosentene som aldri vises kodes bort.

### Plakatregelen har fått en sperre til

Regelen er fortsatt «skarpeste ramme innenfor det ferdige klippet», målt som
varians av `ImageFilter.FIND_EDGES`. Sperren mot rammer med luma over 235
eller under 14 er nødvendig: matchaklippet har et hvitt overgangskutt, og et
kutt har flest kanter av alt. Uten sperren vant det hver gang, og plakaten
ble en tom hvit rute med en logo i hjørnet.

### To klipp ble forkastet, og hvorfor

- **Film strip PT color.mov** — klippet ER en filmstrimmelmontasje med
  svarte rammer rundt hvert bilde. I en celle på 200 px blir det grøt.
- **Virke_KroppspressEvent_1-1.mov** — innbrent undertekst gjennom hele
  klippet. Uleselig tekst i en liten celle leser som støy, ikke som innhold.
  Temaet (kroppspress og doping) hører heller ikke hjemme på en forside som
  selger månedsabonnement.

Begge ble sjekket ved å trekke ut åtte rammer og se på dem. Det tar to
minutter og sparer en runde med «hvorfor ser den cellen rar ut».

### Merk: `sunkost`-bildet er ute, `kakao`-klippet er inne

Sunkost er nå representert med to klipp (matcha og kakao) og null bilder.
Det er den ene kunden veggen viser i dybden. De to filmene er visuelt ulike
nok — grønn te mot brun kakao — til at det leser som en serie.

## Tre bytter 16.09.2026 (kveld)

### Egon flyttet til prisseksjonen, BTS flyttet til rutenettet

Egon-klippet lå i arbeidsrutenettet. Det står nå i prisseksjonen, der
REFLEKTOR × EGON-merkingen gjør mest nytte — det er der kunden bestemmer
seg. BTS-klippet fra produksjonsdagen tok plassen i rutenettet, og hører
egentlig bedre hjemme der: seksjonen heter «Slik ser det ut når vi filmer
hos andre».

Klippet er **flyttet, ikke kopiert**. Samme klipp to steder på én side leser
som at vi ikke har mer å vise. Ingen ny enkoding: `egon.mp4` er 640×1136,
som passer en spalte på 304 px ved 2x.

### The Well: bassengannonsen ut, spaavdelingen inn

**Pass på filnavnene i Dropbox.** Fila som heter `TheWell_Spa_9-16.mov` er
IKKE spaavdelingen — det er bassengklippet med teksten «Hos oss er det
alltid 30 grader i vannet», et prisoverlegg og et logokort. Det var det som
allerede lå på siden, og det er en annonse med nesten ingen bevegelse.

Spaavdelingen ligger i **`Meditation Reel Short.mov`**: gongbad,
klangboller, behandlinger og hvilerommet. 19,7 sekunder å velge fra.
Vinduet er 0,2–6,2 s. Første forsøk tok åtte sekunder, men den siste
tredjedelen er hvilerommet og gjester som ligger stille — pent, og det
stikk motsatte av det som var bestilt. 640×1138, CRF 31, 305 kB.

**Plakatregelen sviktet her, og det er lærerikt.** «Skarpeste ramme inne i
klippet» optimaliserer for det STILLESTÅENDE: bevegelsesuskarphet fjerner
kanter. På et klipp valgt nettopp fordi det har bevegelse, plukker regelen
derfor systematisk den minst representative ramma — her et arkitekturbilde
av hvilerommet, med kantvarians 3 022 mot 1 300–2 200 for
behandlingsrammene.

Plakaten er valgt for hånd: gongen i det slaget treffer. Kandidatene ble
vurdert i **faktisk visningsstørrelse** — 285×570 px i 8:16, slik
reel-veggen beskjærer — og da var det tydelig at rammene rett etter er
ubrukelige, fordi gongen svinger inn i forgrunnen og er ute av fokus. I en
miniatyr så de skarpe ut.

Skarphet er et gulv, ikke et mål. Og kandidater skal vurderes i den
størrelsen de faktisk vises i.

Begge ble sjekket ved å legge ti rammer fra hver ved siden av rammene fra
klippet som allerede lå der. Da var det åpenbart at «Spa»-fila var samme
film. Det tok to minutter.

### Klippene bidrar ikke lenger med høyde

`<video>` uten `width`/`height` har en naturlig størrelse fra fila. I
normalflyt blir `height: 100%` mot en forelder med auto høyde behandlet som
auto, og da bestemmer videoen hvor høy rammen blir.

Det kostet en runde i prisseksjonen: teksten skulle bestemme høyden og
klippet fylle den, men klippet dyttet raden til nøyaktig 9:16 av
spaltebredden og teksten fikk 68 px dødplass under seg. Klippene er nå
absolutt posisjonert overalt, så de aldri bidrar med høyde.

## Kontaktseksjonen og et bytte til (16.09.2026, sen kveld)

### To klipp fyller dødplassen ved skjemaet

Venstrespalten i kontaktblokken hadde overskrift, ingress og NAP — rundt
300 px — mot et skjema på nesten 700. Resten var tom brun flate, akkurat
der kunden skal bestemme seg.

| Fil | Format | Kilde | Vindu | Størrelse |
|---|---|---|---|---|
| `reels/gira.mp4` | 480×854 | Gira kort ny tekst.mov | 3,0–10,0 s | 469 kB |
| `reels/bjorvika.mp4` | 480×854 | Bjørvika Post 4.mp4 | 6,0–13,0 s | 343 kB |

Begge er trimmet unna sluttkortene: Gira ender i et PREMIUM PT-kort med et
tilbud fra ca. 13,8 s, og åpner med et «2. JANUAR»-kort de første to.

Raden har `flex-1` og `min-h-0`, så den tar nøyaktig det skjemaet ikke
bruker. Målt: venstrespalte 716 px, skjema 716 px, avstand fra klippenes
underkant til spaltens bunn 0 px. Blir skjemaet høyere eller overskriften
lengre, justerer klippene seg — det kan ikke oppstå nytt tomrom.

**Ingen bildetekster.** Klippene er fra Premium PT og Bjørvika, og ingen av
dem står på den bekreftede kundelisten som brukes ellers på siden. Samme
regel som i arbeidsrutenettet.

### The Well byttet plass med seg selv

Rhassoul-klippet lå i arbeidsveggen og gongklippet i reel-veggen. Pål ville
ha Rhassoul i reel-veggen. De byttet plass i stedet for at Rhassoul skulle
stå to steder:

| Hvor | Før | Nå |
|---|---|---|
| Reel-veggen (`reels/thewell`) | gongbad | Rhassoul, 640×1138, 0,5–8,5 s, 385 kB |
| Arbeidsveggen (`arbeid/spa`) | Rhassoul | gongbad, 440×782, 0,2–6,2 s, 162 kB |

The Well er dermed representert begge steder, med ulikt materiale.

**Filnavnene i Dropbox, én gang til:** `TheWell_Spa_9-16.mov` er
bassengannonsen. Rhassoul ligger i `Rhassoul 9x16 Reel.mov`, gongbadet i
`Meditation Reel Short.mov`.

### Plakatregelen bommet igjen, på samme måte

`bjorvika` fikk automatisk et arkitekturbilde av en tom gate med trikk —
mest kanter, minst innhold. Valgt for hånd i stedet: to som går nedover en
trerekke i høstlys, ved 1,2 s.

Det er andre gang på én kveld. Mønsteret er tydelig nok til å slås fast:
**på klipp med mennesker og bevegelse velger skarphetsregelen nesten alltid
arkitektur eller stillbilde-lignende rammer.** Bruk den som et filter mot
uskarpe rammer, og velg deretter selv — i faktisk visningsstørrelse.

## Kontaktseksjonen fikk et stillbilde i stedet (16.09.2026, natt)

De to klippene under e-postadressen er byttet ut med ett bilde:
`public/arbeid/pa-vei.jpg` — fotograf på vei inn til opptak, stativ på
ryggen, kamera i hånda, koffert etter seg.

**Hvorfor stillbilde.** Klippene var det femte og sjette bevegelige
elementet på forsiden. Et stillbilde akkurat ved skjemaet er et
registerskifte: det er der man bestemmer seg, og en pause er bedre enn mer
bevegelse. Det fjerner samtidig innvendingen som ble notert da klippene kom
inn — bevegelse ved siden av et skjema kan trekke blikket.

**Bildet er Reflektors eget**, bekreftet av Pål 16.09.2026. Det var verdt å
spørre: på en side som ellers bare viser eget arbeid, ville et stockbilde av
en fotograf vært en troverdighetsfeil ingen ville oppdaget før noen kjente
det igjen.

**Utsnittet er valgt, ikke standard.** Bildet ligger i to formater i
Dropbox: `Untitled design (13).png` er 1920×1080 og `Untitled design
(14).png` er 1080×1080. **1:1 er valgt**, fordi 16:9-varianten allerede er
beskåret så tett at hodet er utenfor bildet. I rammen (429×315) gir
sentrert beskjæring av 1:1 også et hodeløst motiv. `object-position:
center 12%` er riktig: hele figuren med tak over.

Testet fire posisjoner — 0 %, 12 %, 25 % og 50 % — i faktisk
visningsstørrelse før valget.

### Montasjevideoene ble ikke brukt, og hvorfor

To videoer lå ved: `Untitled design (2).mp4` (990×412) og `Untitled design
(13).mp4` (1486×618). Begge er montasjer med fire stående paneler side om
side, altså 2,4:1.

`nr2` er den sterkeste av dem — den viser prosessen (stativ, lyssetting,
kamera i bruk, rigging) og bærer co-branding for «vindu butikken +
reflektor» og «Baker Brun + reflektor», begge kunder som allerede er
klarert på siden.

Men rammen i venstrespalten er 429×315, altså 1,36. En 2,4:1-montasje
beskåret til 1,36 mister nesten halvparten av bredden, og da står to av
fire paneler igjen, avkuttet. Verifisert visuelt før konklusjonen.

Skulle montasjen brukes, måtte den hatt full kortbredde (981 px, panel på
245 px, lesbar co-branding) — og da oppstår tomrommet i venstrespalten på
nytt, som var hele grunnen til at seksjonen ble bygget om. **Montasjene
hører hjemme et sted som er bredt, ikke i en spalte som er høy.**

De to enkodede klippene (`reels/gira.*` og `reels/bjorvika.*`) er slettet
etter at bildet overtok. Originalene ligger i Dropbox som før.

### Lenkesjekken går nå begge veier

Den fanget allerede referanse uten fil. Den advarer nå også om **fil uten
referanse**, som er det som oppstår når media byttes ut. De fire
klippfilene over var det første den fant.

Det er en advarsel og ikke en feil, av to grunner: en foreldreløs fil er
bare bortkastede bytes i deployen, mens en manglende fil er et synlig hull
— og heuristikken (leter etter filstammen som streng i `src/`) kan ta feil
på en fil som refereres på en måte den ikke kjenner igjen. Å felle bygget
på den usikkerheten er ikke verdt det.

## Kundelogoene (16.09.2026)

Elleve logoer til logoraden over arbeidsseksjonen. Utvalget er Påls, gitt i
chat: Happis, The Well, Egon, Peppes, Anton Sport, Soul Cake, Selvaag,
Retail24, Centropa, Idun Industri og Baker Brun.

**ASKO og Orkla Foods Norge er utelatt med vilje.** Begge ligger på dagens
reflektor.no, ingen av dem sto på lista, og Pål har tidligere sagt
uttrykkelig at vi ikke skal antyde at vi har abonnement med Orkla.

### Kilder

Fem er hentet fra dagens reflektor.no (Squarespace-CDN, `?format=750w`), seks
fra kundemappene i Dropbox:

| Logo | Kilde |
|---|---|
| Anton Sport, The Well, Egon, Selvaag, Soul Cake | reflektor.no, Squarespace-CDN |
| Peppes Pizza | `/Reflektor/Assets/Peppes/Lang logo sort.png` |
| Baker Brun | `/Reflektor/Assets/Baker Brun/logo-baker-brun-png.png` |
| Idun Industri | `/Reflektor/Assets/Idun/Logo/Logo_rod_flat.svg` |
| Retail24 | `/Reflektor/Assets/Retail24/Retail24-logo-pos.png` |
| Centropa | `/Reflektor/Assets/Centropa/logo_centropa.png` |
| Happis | `/Reflektor/Assets/Happis/Happis_logo_email_signature_180px.png` |

Alle seks fra Dropbox er innholdshash-verifisert mot Dropbox' egne
blokk-hasher etter nedlasting. Idun er rendret fra SVG til PNG med cairosvg.

**Happis er den svakeste kilden.** Eneste tilgjengelige fil er en
e-postsignatur på 180×70 px. Den holder akkurat: logoen vises på 92×36, og
2x av det er 72 px høyde mot kildens 70 — 3 % oppskalering. Skal raden noen
gang vises større, må logoen hentes fra merkevaremanualen
(`25.1 Happis Brand Guidelines.pdf` i samme mappe).

### Størrelsene er regnet ut, ikke satt på øyemål

Logoer har vilt ulike proporsjoner: Anton Sport er 9,6:1, The Well er 1,3:1.
Skalerer man til samme **høyde**, blir Anton Sport en plakat og The Well et
frimerke. Skalerer man til samme **bredde**, skjer det motsatte. Dagens side
har det problemet — Idun-merket dominerer raden.

Hver logo er derfor skalert til samme **blekkareal**: antall ugjennomsiktige
piksler normalisert til 40×40 visningspiksler, med tak på 42 px høyde og
gulv på 16 px. Tre treffer taket (The Well, Egon, Soul Cake) — alle tre er
nesten kvadratiske merker.

Filene ligger på 2x visningsstørrelse. Til sammen 180 kB PNG, som
next/image serverer som webp.

Tallene ligger i `src/content/logoer.ts` og må inn i `<Image>` for å unngå
layout shift. **Byttes en logofil, må de regnes om.**

### Fargene er beholdt

Monokrom logorad ble vurdert og forkastet. `filter: brightness(0)` gir en
ensfarget silhuett med alfaen i behold, og det hadde ryddet opp i at elleve
merkevarefarger krasjer med hverandre — men det ødelegger to av logoene:
Idun er hvit tekst i et rødt skjold og Baker Brun er en hvit sløyfe i en
brun firkant. Begge blir en solid klump uten navn.

Dagens reflektor.no har også fullfarge. Fargene beholdes.

### Lenkesjekken dekker logoene

`public/logoer` er lagt til i `MEDIEMAPPER`, og `logoer.ts` sjekkes
eksplisitt begge veier. Det siste er nødvendig fordi logoene refereres med
malstreng (`` `/logoer/${l.id}.png` ``), og regexen som finner mediestier
ser bare bokstavelige strenger — samme hull som tok prisseksjonen. Begge
retninger er verifisert ved å fjerne en fil og ved å legge inn en ubrukt.

## Kortbildene på /vart-arbeid (19.09.2026)

Pål: «her har du brukt veldig lav kvalitet på bildene, og ansiktene er
croppet ut». Begge deler stemte, og de hadde samme årsak.

Kortene viste **posterbildet fra klippet** — en 540×960 JPEG trukket ut av
en komprimert 9:16-video — strukket over en liggende ramme på 660 px. Altså
oppskalert videokomprimering, og et stående motiv sentrert i en liggende
ramme, som kutter hoder.

### Kildene

Hentet fra `/Reflektor/SALG/Claude Code/Bilder og videoer`, alle tre
verifisert mot Dropbox' blokkhash.

| Fil | Kilde | Format | Web |
|---|---|---|---|
| `caser/soulcake.jpg` | `soulcake+freia.jpg`, 3283×4924, 10,8 MB | 0,67 | 1600×2400, 352 kB |
| `caser/egon-bord.jpg` | `Februar EGON2688 copy.jpg`, 3302×4953, 14,0 MB | 0,67 | 900×1350, 242 kB |
| `caser/egon-rett.jpg` | `EGON jan 264697.jpg`, 3574×4467, 12,2 MB | 0,80 | 900×1125, 137 kB |

De to Egon-bildene ble lastet opp av Pål 19.09.2026 kl. 11:36 og 11:37.

### Rammen er 4:3, og tallet er regnet ut

Alle tre kildene er stående. **To stående bilder på 0,67 side om side er
1,33 — nøyaktig 4:3.** Derfor kan Egon vise to motiver i én ramme uten at
noen av dem beskjæres, og det var også svaret på Påls «sett de to bildene
fra egon ved siden av hverandre for å få bredde».

Der det bare finnes ett bilde, fyller det rammen alene, og `fokus`
(`object-position`) avgjør hva som blir med.

### Fokuset er målt, ikke gjettet

Fem forhold × tre posisjoner ble lagt ut side om side i **faktisk
visningsstørrelse** (660 px kortbredde) og sett på:

| | 20 % | 32 % | 45 % |
|---|---|---|---|
| Soulcake, 16:10 | hoder med, kuttet ved livet | **hoder kuttet** | **bare bein** |
| Soulcake, 4:3 | hoder med, kuttet ved knærne | **hoder kuttet** | **bare bein** |
| Soulcake, 4:5 | hele figurer, fabrikken med | hoder delvis | **hoder kuttet** |

Sentrert (50 %) — som var det kortene hadde — kutter hodene i alle
forholdene. `50% 20%` er valgt for Soulcake. Egon-bildene har ingen
ansikter og trenger ingen fokusverdi.

**Halve kortbredde gir halv kildebredde.** Diptykhalvdelene vises på rundt
330 px, ikke 660, så de er lagret på 900 px og ikke 1600. `sizes` sier det
samme til next/image; uten den serveres filer dobbelt så brede som rammen
noen gang blir.

### Freia-motivet er nå avklart

Avsnittet «MÅ SJEKKES AV PÅL: gjenkjennelige tredjepartsmerker» over gjaldt
blant annet Freia-bildene. Pål bestilte dette bildet uttrykkelig 19.09.2026.
Casen navngir allerede samarbeidet i klartekst — «Freia x Soulcake» — så
bildet sier ikke noe teksten ikke alt sier.

## Kjedesiden: hvilke filer som ligger på /kjeder (29.09.2026)

Bestilt av Pål: «legg til eksempler på siden basert på hovedmappen med bilder
og videoer i dropbox. se igjennom hva som passer før du tar noe tilfeldig.»

Alt er hentet fra `Reflektor/Kundemappe/<kunde>/`, altså **ferdige eksporter**
— regelen fra 28.09.2026 gjelder, se avsnittet over om råklipp. Ingenting er
hentet fra `Videoarkiv/`.

### Utvalget ble gjort ved å se, ikke ved å lese filnavn

Tolv filmkandidater og tolv stillbilder ble lastet ned og gjennomgått som
kontaktark før noe ble valgt. Det er grunnen til at Egons «Samlefilm» ble
valgt framfor «EGON Stemning» (215 MB, ett motiv), og at Peppes'
15-sekunders er med i stedet for buffet-filmen (17,9 s, mørk, mange uskarpe
rammer).

| På siden | Kilde i Dropbox | Lengde |
|---|---|---|
| `kjeder-anton-sport` | `Anton Sport/2026/MAI/Bilder/Video/Maridalen 16x9.mp4` | 24,8 s |
| `kjeder-egon` | `Egon/2026/August/Min drømmerett/16x9/EGON Min dr - 16-9-lang.mov` | 19,1 s |
| `kjeder-peppes` | `Peppes/2026/August/4k/Peppes 15 sek 4k.mov` | 15,0 s |
| `kjeder-vitusapotek` | `Vitusapoteket/2025/August/Sponsorplakater/Versjon 3/4_Vitusapotek_Sponsorvignette_TV2_3-75s_20250911.mov` | 3,8 s |
| `kjeder-format-16x9` | `Egon/2026/Mai/16x9/Samlefilm 16x9.mov` | 23,0 s |
| `kjeder-format-4x5` | `Egon/2026/Mai/4x5/Samlefilm 4x5.mov` | 23,0 s |
| `kjeder-format-9x16` | `Egon/2026/Mai/9x16/Samlefilm 9x16.mov` | 23,0 s |
| `kjeder-foto-anton-sport.jpg` | `Anton Sport/2026/SEP/Shoot1 - Gore tex/Bilder/Gore Tex September22.jpg` | |
| `kjeder-foto-egon.jpg` | `Egon/2026/Februar/Sharing/Februar EGON2694.jpg` | |
| `kjeder-foto-peppes.jpg` | `Peppes/2026/September/Retter på bord/Peppes produkt 4. mai1065.jpg` | |
| `kjeder-foto-vitusapotek.jpg` | `Vitusapoteket/2025/August/V1/Produktbilder/EmptyName 15.jpg` | |

### «Seks formater» er etterprøvd, ikke sitert

Påstanden står tre steder på nettstedet. `Egon/2026/Mai/` har seks
søskenmapper med samme film i hver: `16x9`, `9x16`, `4x5`, `1152x1058`,
`1700x1500` og `Store filer` (4K). Tre av dem ligger på siden.
`Min drømmerett` i august har fem: 16x9, 9x16, 4x5, 1152x og 1700x1500 —
derfor sier bildeteksten der «fem formater» og ikke «seks».

### Vitusapotek: byttet til TV-reklamen 29.09.2026

Her lå først farmasøytfilmen fra `2025/Juli/Reels V3/`. Pål: «bytt ut
eksempelet til vitus på siden med tv-reklamen der to danser.»

`Sponsorplakater/Versjon 3/` har seks vignetter. Tre er fra skogen med en
soldat, tre er fra dansegulvet, og **nummer 4 er den eneste der to danser
sammen** — 5 og 6 viser én danser. Avgjort ved å hente ut rammer fra alle
seks og se på dem; filnavnene er identiske bortsett fra tallet.

Den er 3,76 sekunder og går derfor dempet i løkke uten kontroller. Det
følger av regelen som allerede står i `Referansefilmer`: en kort
reklamefilm uten replikk leses som bevegelse. En kontrollinje ville tatt en
tredel av flaten på en film som er over før noen rekker å se på den.

Kulepunktet om farmasøytfilmene står fortsatt. Det er belagt i `Reels V3/`
— fem filmer i 16-9, 9-16 og 1-1 der apotekets egen farmasøyt står navngitt
på skjermen — og det er en ny opplysning på siden, ikke en omskriving. Meldt
til Pål som nettopp det.

### Vekt

Syv filmer på til sammen 30 MB ligger på siden. Målt i nettleser laster
`/kjeder` **1,52 MB** ved åpning og **1,82 MB** etter å ha rullet gjennom
hele siden — **null byte video**. Alle syv har `preload="none"` og
plakatbilde; filmene lastes først når noen trykker play.


## Ingen stillbilder hentet fra video (regel, 30.09.2026)

Pål, ordrett: «gå igjennom alle bilder og videoer og sørg for at eksemplene
passer med hva som står på siden, og at du ikke tar screen shots fra
videoer.» Utvidet samme dag til å gjelde **alle blogginnlegg og
landingssider**, men ikke forsiden.

Fire bilder på nettstedet var enkeltbilder klippet ut av film med ffmpeg og
brukt som om de var fotografi:

| Fil | Hvor den lå | Hentet fra |
|---|---|---|
| `produksjonsdag-rigg-1600.jpg` | toppbilde på `/reels-produksjon` **og** på `/blogg/hva-er-en-produksjonsdag` | `bts/baker.mov`, 4,5 s |
| `produksjonsdag-skjerm-1600.jpg` | medieblokk i `/blogg/hva-er-en-produksjonsdag` | `bts/baker.mov`, 12,5 s |
| `fotograf-pa-jobb-1600.jpg` | toppbilde på `/blogg/some-byra-frilanser-eller-ansatt` | `bts/baker.mov`, 14,5 s |
| `ogsa-reklamefilm-1280.jpg` | kortet «Også fra Reflektor» på forsiden | `kjeder-peppes.mp4`, 7 s |

Alle fire er 16:9-utsnitt i 1600×899 eller 1280×720 — formatet avslører dem.
De tre første er slettet. Den fjerde står igjen fordi forsiden er holdt
utenfor oppdraget; den bør byttes når Pål åpner for det.

**Et plakatbilde er ikke det samme.** Filene som ligger ved siden av en
`.mp4` og bare vises til noen trykker play, må være uttrekk fra nettopp den
filmen — ellers viser plakaten et annet motiv enn videoen. Regelen gjelder
bilder som opptrer som fotografi.

### Hvorfor feilen oppsto

Bildearkivet har rundt 200 kundemapper med ekte fotografi, men **nesten
ingen fotografier av Reflektor selv på jobb**. Bak-kulissene-materialet er
film: `bts/baker.mov`, `bts/anton.mov`, og i Dropbox
`Banervideo/…/til redigering/` ligger `Magasin+ BTS.mov`, `FastCandy_BTS.mov`
og `OBC_BTS.mov`. Det eneste ekte opptaksfotografiet som finnes er
`popup-arbeid-1800.jpg` og det stående søskenbildet `dag4-vegg.jpg`, begge
fra den samme popup-dagen.

Da tre sider trengte «et bilde av en produksjonsdag», var svaret å fryse
filmen. Riktig svar er å **vise filmen**. Trengs det et stillbilde, må det
fotograferes — det er verdt en halvtime på neste produksjonsdag.

### Hva de fire ble byttet til

- `/reels-produksjon` fikk `popup-arbeid-1800.jpg`: en kunde som blir filmet
  på lokasjon, med fotografen i bildet. Det er nøyaktig det siden selger.
- `/blogg/hva-er-innholdsproduksjon` mistet det bildet og fikk
  `spa-opphold-1080.jpg`, et ferdig produsert kundebilde.
- `/blogg/hva-er-en-produksjonsdag` fikk `kjokken-servering-1080.jpg`: et
  kjøkken midt i arbeidet, altså der en produksjonsdag foregår. Artikkelen
  har to ekte bak-kulissene-filmer lenger nede.
- `/blogg/some-byra-frilanser-eller-ansatt` fikk `kjokken-kokk-1080.jpg`: én
  person som utøver faget sitt alene, som er nettopp spørsmålet artikkelen
  stiller. `fokus: "center top"` — midtstilt beskjæring kuttet hodet, målt i
  nettleseren.
- Medieblokken med skjermbildet er **fjernet**, ikke byttet. Vi har ikke noe
  ekte fotografi av en skjerm på settet, og et annet motiv ville gjort
  bildeteksten usann.

De tre nye filene er hentet fra
`Marketing_Reflektor/foto & video til web/foto/portfolio/` i Dropbox, som er
Reflektors egen utvalgte portefølje. Alle tre er 1080×1080 og uten synlig
merkevare fra kunder som ikke står på logolista.

### Fra arbeidet på /reels-produksjon

Rutenettet hadde tre klipp og ett stillbilde fra en byggeplass. Pål: «dette
er et elendig bilde å bruke her», og «eksempelet over burde være tre stående
ved siden av hverandre og autoplay».

Nå står tre stående klipp med autospill: Anton Sport, Egon og Soul Cake —
Påls egne forslag. `Arbeidsrutenett` regner antall spalter av antall medier,
så tre klipp står tre i bredden i alle bredder. Målt: 357×635 px på 1440, og
106×188 px på 390, alle tre med `paused === false`.

Eiendom mister sin flate der, men bransjen står nevnt med navn i seksjonen
rett over — Selvaag Eiendom, godkjent av Pål samme dag.


## Retail24 i Sandefjord — event, august 2026 (lagt inn 30.09.2026)

Mediene til `/blogg/hva-koster-eventfotograf` er hentet fra
`Kundemappe/Retail24/August/Sandefjord/Bilder/` i Dropbox. Chats
medieinstruks pekte på en lokal sti på Påls Mac; jeg hentet de samme filene
gjennom Dropbox-tilkoblingen i stedet, samme mappe.

**Video.** `Videoer/Event video.mov` er 3840×2160, 1 minutt og 43 sekunder,
630 MB, med lyd i 24-bits PCM. Konvertert til 1280×720 H.264, AAC 96 kbit/s,
`+faststart` — 17 MB. To forsøk: CRF 25 ga 30 MB, CRF 28 med tak på
1600 kbit/s ga 17 MB. Sammenlignet på 672 px, som er spaltebredden, er
forskjellen ikke synlig, og 720p er allerede mer enn spalten trenger.

Den får **ekte avspiller med lyd**, ikke dempet løkke. Filmen bærer på musikk
og tale; dempet autospill ville vist en fest uten stemning. Samme regel som
profilfilmene på employer branding-siden.

Plakatbildet er hentet på 70 sekunder, valgt blant syv kandidater. Det er et
uttrekk fra filmen, som et plakatbilde skal være — se regelen over.

**De åtte `Short 1–8.mov` er ikke brukt.** Instruksen sier eksplisitt at det
er intervjuer med enkeltpersoner.

**Galleri.** Fem bilder fra `Event bilder/`, i rekkefølgen instruksen oppgir:
34, 23, 4, 10 og 1. Originalene er 5875×3917 (og 2476×3714 for det stående),
skalert til 2400 px på lengste side og komprimert til 0,3–0,9 MB. Ingenting
fra `Alle bilder/Portretter/` eller `Gruppebilder/`.

Instruksen ba om WebP/AVIF med JPG i reserve. Filene ligger som JPG, fordi
Next.js' bildeoptimalisering serverer AVIF og WebP av seg selv ut fra hva
nettleseren ber om — å legge inn begge manuelt ville gitt tre kopier av hvert
bilde i repoet uten at brukeren fikk noe mer.

**Toppbildet** er `Bilder 41.jpg` fra samme mappe, valgt blant seks
kandidater fordi det er det bredeste motivet og derfor tåler 21:9-stripen.
Det er et ekte fotografi, ikke et uttrekk fra filmen.

**Galleriblokken er ny.** `medier` krever samme sideforhold på alle
elementene, og denne serien har fire liggende og ett stående. `galleri`
viser hovedbildet i sitt eget format og resten som kvadratiske
miniatyrer — to i bredden på telefon, fire fra `sm`. Byggetidsvakten krever
fire til seks bilder og godtar ikke film.


## Omtalevideo fra Soul Cake (01.10.2026)

Filene kom fra Pål som vedlegg, ikke fra Dropbox: MP4 (H.264/AAC,
1080×1350, 22 sek, 8,3 MB), WebM (VP9/Opus, 5,5 MB) og en norsk VTT. De
ligger i `public/arbeid/soulcake/`. Plakatbildet er en ramme fra filmen —
som et plakatbilde skal være; regelen over gjelder bilder som opptrer som
fotografi.

**Tekstingen er brent inn i bildet.** Det avgjorde avspilleren. VTT-sporet
ligger der for søk, skjermlesere og den som vil slå det på selv, men
**ikke som `default`**: med `default` la nettleseren sin egen tekstboks oppå
den innbrente teksten, målt i nettleseren samme dag.

Videoen går dempet i løkke med en synlig lydknapp. Løkken stopper og filmen
spoles til start når lyden slås på — en omtale som begynner på nytt midt i
setningen er irriterende å høre på. Knappen står øverst til høyre; nederst
dekket den den innbrente teksten.

WebM først i `<source>`, MP4 som reserve. Kildene legges først inn i DOM-en
når videoen nærmer seg synsfeltet, så den koster ingenting i LCP.

Videoen står tre steder: forsiden, `/vart-arbeid/soulcake` og
`/videoproduksjon-i-oslo`. Innholdet — sitat, navn, filsti — ligger ett sted,
i `kundeord` på kundecasen, så de tre ikke kan komme i utakt.
