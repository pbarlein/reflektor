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
