# Bilder

Legg bildefiler i mappen som passer. Next.js optimaliserer dem automatisk ved
bygg – du trenger ikke lage flere størrelser selv.

| Mappe | Innhold |
|---|---|
| `logo/` | Reflektor-logo. SVG om mulig, ellers PNG med gjennomsiktig bakgrunn |
| `team/` | Portretter av Pål, Magne, Henrik og Viktor |
| `kunder/` | Kundelogoer til «Noen av bedriftene vi har produsert innhold for» |
| `case/` | Bilder til kundecasene – undermappe per kunde, f.eks. `case/egon/` |
| `seksjoner/` | Bilder brukt i seksjoner på landingssidene |
| `og/` | Delingsbilder for sosiale medier. 1200 × 630 px |

## Krav

- **Format:** JPG eller PNG er greit – Next.js konverterer til WebP/AVIF selv.
  Logoer: SVG.
- **Størrelse:** last opp originalen i god oppløsning, ca. 2000 px bredde er
  rikelig. Ikke komprimer på forhånd; det gjør byggeprosessen bedre enn deg.
- **Navngiving:** små bokstaver, bindestrek, ingen æøå eller mellomrom.
  `pal-barlein.jpg`, ikke `Pål Barlein (1).JPG`.
- **Ikke legg video her.** Se `docs/media.md`.

## Merk: repoet er offentlig

Alt som legges her blir liggende åpent på GitHub. Bilder med gjenkjennelige
personer eller kundemateriale som ikke er klarert for publisering, bør enten
vente til repoet settes til privat, eller lastes opp som blob i stedet.
