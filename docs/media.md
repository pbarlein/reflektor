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
Vinduet er 0,3–8,3 s, som dekker gongen og behandlingen — den delen med
mest bevegelse. 640×1138, CRF 31, 380 kB.

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
