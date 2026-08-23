# Reflektor Design System

**Reflektor** is a social-media agency (*SoMe-byrå*) in Oslo. One production day a month at the client's premises; strategy, filming, editing, captioning and publishing twice a week on Instagram and Facebook, 52 weeks a year — at a flat, publicly stated price of **30 000 NOK/month ex. VAT**. The company started as a production house and narrowed itself to this single service. Clients include Orkla, Egon, Anton Sport, Asko, The Well, Selvaag, Idun and Soul Cake.

Everything in the brand serves one idea: **rhythm beats heroics**. Consistent, professionally produced content, published on schedule, owned outright by the client.

## Sources used to build this system

| Source | What it gave |
| --- | --- |
| `uploads/…Colored with Tagline*.png` (4 files, Holum Studio) | The logo lockups and the exact brand colours (#DE4826 orange, #141414 ink) |
| https://www.reflektor.no | Layout, tone, structure, copy, photography, service icons, client list |
| https://www.reflektor.no/om-oss · /vart-arbeid | Team, principles, case structure |

**Not received (asked for, never arrived in the project):**
- `Reflektor Logo and Brand Design by Holum Studio_February 23.pdf` — the brand book. This would settle typeface names, colour specs, clear-space rules and photography direction.
- `…Colored with Tagline.ai` / `.eps` — vector logo. Everything here uses the PNGs, so the logo cannot be scaled losslessly or recoloured.
- Font binaries. See the substitution note below.

## Font substitution — please confirm

The brand wordmark and tagline are set in a geometric grotesque with a tall x-height, double-storey *a* and flat terminals. No font files or font names were supplied, so the system ships **Figtree** (Google Fonts) as the closest open match, with **JetBrains Mono** for technical text. Swap `tokens/fonts.css` for the licensed brand face when you have it — nothing else needs to change.

---

## Content fundamentals

**Language.** Norwegian bokmål throughout. English only for job titles (*Head of Content*, *CEO*) and borrowed marketing nouns (*performance marketing*, *on-brand*). Never translate the product vocabulary: *produksjonsdag*, *kjøreplan*, *innholdsserier*, *publisering*.

**Person.** *Vi* about Reflektor, ***dere*** about the client — plural, never *du/deg*. This is deliberate: it addresses a company, not a person. "Dere godkjenner før noe går ut." "Vi kommer til dere med kamera, lys og kjøreplan."

**Tone.** Plainly spoken, concrete, slightly blunt, allergic to agency-speak. The site tells you what is *not* included before you ask, states the price in the meta description, and openly says it will not promise numbers: *"Vi lover ikke tall, og vi anbefaler skepsis mot byråer som gjør det."* Confidence comes from specificity, never from adjectives.

**Sentence shape.** Short declaratives, often fragments. Frequent em-dash and en-dash asides. Arrows for process: *"1 produksjonsdag → 4 uker med innhold."* Numbers are load-bearing and always concrete: *2 poster i uka*, *8–10 filmer*, *52 uker*, *3 virkedager*, *30 000 kr*.

**Casing.** Sentence case for headlines. Norwegian sentence case in nav labels too (*Vårt Arbeid* is the one inconsistency on the live site). Uppercase only for eyebrows and micro-labels, always with wide tracking. Never ALL CAPS for a headline longer than three words — with the single exception of the *VÅRT ARBEID* page title.

**Emphasis.** Italic on one word inside a headline, in orange, to carry the joke or the caveat: *Sosiale medier – nesten på autopilot.* Use it at most once per page.

**Emoji: never.** Not in headlines, not in body, not in CTAs.

**CTA copy.** Verb-first, low-commitment, 2–4 words: *Ta kontakt*, *Ta en prat*, *Få et strategiforslag*, *Book et introduksjonsmøte*, *Les kundecase*. Never *Kom i gang* or *Lær mer*.

**FAQ voice.** Long, numbered, and honest to a fault — a whole answer is spent on "what we don't do". Answers admit when a competitor or an in-house hire is the better choice. Keep that. Three to five short paragraphs per answer, no bullet lists.

---

## Visual foundations

**Colour.** Three colours do all the work: **orange #DE4826**, **ink #141414 / true black #000000**, and paper (**white** with a warm off-white **#F6F4F1** for alternating sections). Orange is an accent only — CTAs, eyebrows, active states, the one italic word — never a background for a whole section, never a gradient. There is no secondary brand hue; the tint/shade ramp exists purely for hover, press and soft fills. Section backgrounds alternate white → bone → ink, and no page uses more than two background colours besides black.

**Type.** One family, worked hard: ExtraBold (800) for headlines at −0.03em tracking and 1.03 line-height, Regular for body at 17px/1.6 on a 62ch measure, Bold uppercase at 0.14em for eyebrows. Headlines are large and tight; body is generous and calm. No serif, no script, no second display face.

**Backgrounds and imagery.** Photography is the background. Full-bleed dark hero images at ~50% opacity over black; portraits shot on a black seamless; case images in wide 16:10 frames. The colour grade is warm and natural — real food, real people, real premises, colour-corrected, no grain filter, no duotone, and explicitly **no generated imagery** ("Vi bruker ikke generert innhold"). Never place text on a photograph without `--scrim-bottom` under it.

**Corners.** Square. `--radius-0` is the default for cards, images, inputs and sections — it echoes the hard geometry of the R mark. The pill radius is reserved for buttons and badges. Images are *never* rounded.

**Cards.** Flat. A card is a hairline `#E2E2E2` border or a bone fill, square corners, 32px padding — no shadow at rest. Shadow only appears on hover, and only if the whole card is a link. Ink and black cards carry a 1px `rgba(255,255,255,.18)` border instead.

**Shadows.** Four steps, used sparingly: `sm` almost invisible, `card` for gentle separation, `raised` for hover lift, `overlay` for modals. Never coloured, never inner. Focus is the exception: a 3px orange glow, `--shadow-focus`.

**Borders.** 1px `--border-hairline` for structure (FAQ rules, card edges, header underline); 1.5px `--border-strong` for outline buttons and form controls; 2px orange under the active nav item.

**Motion.** Fast and eased, never bouncy — no spring, no overshoot, no scale-on-press beyond a 1px nudge. `--ease-standard` cubic-bezier(.2,.6,.2,1) for interaction, `--ease-out` for reveals. 140ms hover, 220ms accordion, 420ms image scale, 640ms scroll-in fade. Reveals are fade + short rise, never slide-in from the side. All durations collapse to 0 under `prefers-reduced-motion`.

**Hover states.** Solid buttons darken one step on the ramp (orange → `--rf-orange-700`); outline buttons *invert* to solid ink; text links go orange with a 3px-offset underline; images scale to 1.03 inside their frame (the frame never moves). Opacity is not used as a hover state.

**Press states.** `translateY(1px)` plus one more step down the colour ramp (`--rf-orange-800`). No shrink, no ripple.

**Transparency and blur.** Almost none. White at 12–18% for borders and chips on dark, 45–82% for muted text on dark. No frosted glass, no backdrop-filter anywhere — the brand is opaque and printed-feeling.

**Layout.** 1180px max container, 56px page gutters on desktop, 96–128px between sections. Two-column split (text + media) is the workhorse; three-up grids for services, principles and team. Only the header is fixed (sticky, opaque). Every page closes with the same black CTA banner and ink footer.

**Spacing.** 4px base, tight at the component level (4–32px), deliberately generous above it (56–160px). Whitespace, not dividers, is what separates ideas.

---

## Iconography

The live site uses a small set of **white line-art PNG icons on solid black tiles**, one per service step — a tripod film camera, a cluster of social-media glyphs (phone, megaphone, heart, chat bubbles), and a target with an arrow and spiral. They are illustrations, not a systematic icon font: uniform stroke weight, no fill, drawn at roughly 1:1 in a square black frame.

- **There is no icon font and no SVG sprite.** The three service icons are hot-linked from the Squarespace CDN in `ui_kits/website/data.js` and rendered through `ServiceCard`'s `iconSrc` prop. They are the only branded icons that exist.
- **For UI glyphs** (chevrons, close, arrows) the system uses **Unicode characters** — `▾` in `Select`, `+` rotating to `×` in `Accordion`, `✓` in `Checkbox`, `—` as the list bullet in `PriceCard`. Keep it that way; it matches the typographic, low-chrome feel.
- **No emoji, ever.**
- **If you need an icon that doesn't exist here**, ask Reflektor for the source file rather than substituting a library set. If you must ship something, use **Lucide** at 1.5px stroke — closest in weight to the existing line art — and flag the substitution. Do not hand-draw SVGs to imitate the black-tile illustrations.
- **Client logos** (Orkla, Egon, Anton Sport, Asko, The Well, Selvaag, Idun, Soul Cake) are third-party marks referenced from their original files. Never redraw or recolour them; `LogoWall` renders them at reduced opacity so they never compete with the headline.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. Imports only.
- `readme.md` — this file. `SKILL.md` — Claude Code / Agent Skills wrapper.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`

**`assets/`** — `logo-horizontal.png`, `logo-stacked.png`, `logo-stacked-white.png` (for dark backgrounds), `logo-mark.png` (R monogram). No vector versions — see caveats.

**`guidelines/`** — 18 specimen cards feeding the Design System tab: Brand (logo lockups, logo mark, protection gradient), Colors (brand, orange scale, neutrals, semantic aliases, status), Type (display, body, eyebrow, scale, mono), Spacing (scale, in use, radius, elevation, motion).

**`components/`** — 20 components, each with a `.d.ts` contract and a `.prompt.md` usage note.

| Group | Components |
| --- | --- |
| `core/` | **Button**, **Badge**, **Card**, **Logo**, **SectionHeading** |
| `forms/` | **Field**, **Input**, **Textarea**, **Select**, **Checkbox** |
| `marketing/` | **ServiceCard**, **PriceCard**, **TeamCard**, **LogoWall**, **Stat**, **Accordion**, **MediaFrame**, **CTABanner** |
| `navigation/` | **NavBar**, **Footer** |

**`ui_kits/website/`** — click-through recreation of reflektor.no (Home, Work, About, Contact). See its own README.

### Intentional additions
No component library or codebase was supplied, so this inventory was authored from the live site. Every component maps to something visible on reflektor.no; nothing speculative (no Toast, Tooltip, Tabs, Modal) was added. **Field**, **Select** and **Checkbox** are the one stretch — the contact form's exact markup was not readable, so they are reconstructed from the site's control styling to make the form kit usable.

## Caveats
- Colours are sampled from the logo PNGs and are exact for orange and ink. The neutral ramp, bone tint and status colours are derived, not specified — confirm against the brand book.
- The typeface is a substitution (see above).
- All photography and client logos are hot-linked from Squarespace; the UI kit needs a network connection.
- Blog and individual case pages were not recreated.
