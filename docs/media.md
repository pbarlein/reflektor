# Hvor bilder og video skal ligge

Kort svar: **bilder i repoet, video utenfor.**

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

## Video → ikke i repoet

Video hører ikke hjemme i git. Én produksjonsmåned hos Reflektor er 8–10
filmer; legges de i repoet vokser det seg tregt å klone i løpet av kort tid, og
hver endring lagres som en ny kopi i historikken for alltid.

Tre alternativer, i prioritert rekkefølge:

### 1. Vercel Blob (anbefalt)

Dere har Vercel Pro, så dette er allerede betalt for. Filene ligger utenfor
git, men serveres fra samme CDN som siden.

```bash
npx vercel blob put video/egon-case.mp4
```

Kommandoen returnerer en URL du limer inn i `src/content/`. Filer kan settes
private om innholdet ikke skal være åpent tilgjengelig.

### 2. Video-hosting med streaming

For lengre filmer eller mange av dem er en ekte videotjeneste bedre enn en
MP4-fil. Mux, Cloudflare Stream eller Vimeo gir adaptiv bitrate – seeren får
en kvalitet som matcher forbindelsen, i stedet for å laste ned hele filen.

Merkbar forskjell på mobil, som er der mesteparten av trafikken er.

### 3. Behold der de ligger nå

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
