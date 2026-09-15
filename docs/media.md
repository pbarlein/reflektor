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

## Dropbox: katalog, ikke rørledning (testet 15.09.2026)

Spørsmålet var om Pål kan legge bilder og video i en Dropbox-mappe som Claude
Code henter og komprimerer fra. Svaret er delvis, og skillet er verdt å skrive
ned fordi det ikke er åpenbart.

**Virker** — Dropbox-MCP-en går utenom nettverkspolicyen:

- `list_folder` lister mapper og filer med størrelse og dato
- `search` finner filer på navn
- `get_file_metadata` gir størrelse, MIME-type, endringstidspunkt
- `file_preview` gir Pål en miniatyr og en «åpne i Dropbox»-lenke i klienten

**Virker ikke** — selve filinnholdet:

- `download_link` returnerer en URL på `dl.dropboxusercontent.com`
- `file_preview` returnerer en URL på `previews.dropboxusercontent.com`
- Begge blokkeres av proxyen: `CONNECT tunnel failed, response 403`

Verifisert direkte, ikke antatt. Proxyens egen statusside logget begge
avvisningene som `connect_rejected` (policy-avslag på gateway).

Konsekvensen: Claude Code kan **se katalogen og lese filnavn, størrelser og
datoer**, men kan ikke lese en eneste piksel. Miniatyren `file_preview` gir,
rendres i Påls klient — ikke i containeren.

### Hva det betyr i praksis

Dropbox er fortsatt nyttig, men til utvelgelse og ikke til henting:

1. Pål legger kandidater i en mappe, f.eks. `/Reflektor/Marketing/Nettside/`
2. Claude Code lister mappen og kan lage `file_preview`-kort som Pål ser
3. Pål velger — eller Claude Code foreslår ut fra filnavn, format og størrelse
4. **De valgte filene må inn hit på en av de to veiene som er bevist:**
   opplasting i chatten, eller commit til repoet via GitHub

Komprimeringen skjer først når filene faktisk ligger i containeren. Verktøyene
er på plass (`imageio-ffmpeg`, `pillow`) — se resten av dette dokumentet.

Et klipp per opplasting er lite tungvint sammenlignet med alternativet, som er
at ingen får sett dem. Antallet er lite: tre 9:16-klipp til forsiden.
