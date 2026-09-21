/**
 * Figurer.
 *
 * ── HVORFOR TEGNET OG IKKE FILMET ─────────────────────────────────────────
 *
 * Noen ting i denne huben er SPESIFIKASJONER, ikke smak: hvor mye av bildet
 * grensesnittet dekker, hva et 9:16-utsnitt tar av et 16:9-bilde, hva de
 * fire bildeutsnittene heter. For slike ting slår en tegning enhver video,
 * av tre grunner:
 *
 *   1. Den viser regelen direkte. En video VISER noen som følger regelen;
 *      en figur viser regelen selv.
 *   2. Den råtner ikke. En innebygd video fra en annen konto kan slettes,
 *      og da står det et hull midt i en instruks.
 *   3. Den er vår, juridisk uproblematisk, og koster ingenting å laste.
 *
 * ── INLINE SVG, IKKE BILDEFILER ───────────────────────────────────────────
 *
 * Figurene bruker `currentColor` og tokenverdier, så de følger paletten hvis
 * den endres. En PNG ville vært låst til fargene den ble eksportert med, og
 * uskarp på skjermer med høy oppløsning.
 *
 * ── TILGJENGELIGHET ───────────────────────────────────────────────────────
 *
 * Hver figur har `role="img"` og en `<title>` som beskriver hva den viser.
 * Tallene som bærer meningen — 14 %, 35 %, 6 % — står dessuten i
 * brødteksten ved siden av. En figur som er eneste bærer av et tall, er et
 * tall som ikke finnes for den som ikke ser den.
 */

export type FigurNavn = "trygg-sone" | "utsnitt" | "bildeutsnitt";

export function Figur({
  navn,
  tekst,
}: {
  navn: FigurNavn;
  /** Bildeteksten. Sier hva man skal se etter, ikke hva man ser. */
  tekst: string;
}) {
  return (
    <figure className="max-w-[46rem] rounded-flate border border-kant bg-kort px-5 py-6 sm:px-6">
      <div className="flex justify-center">{tegning(navn)}</div>
      <figcaption className="mt-5 border-t border-kant pt-4 text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
        {tekst}
      </figcaption>
    </figure>
  );
}

function tegning(navn: FigurNavn) {
  if (navn === "trygg-sone") return <TryggSone />;
  if (navn === "utsnitt") return <Utsnitt />;
  return <Bildeutsnitt />;
}

/* Merkevareoransjen brukes som FLATE og strek her, ikke som småtekst — den
   stryker AA under 24 px på lys bakgrunn. Tallene står i mørk tekst. */
const ORANSJE = "#DE4826";
const KANT = "#C9BDA9";
const BLEKK = "#1C1310";
const DEMPET = "#6A5A50";

/**
 * Safe zone på en 9:16-flate.
 *
 * Tallene er Metas egne for Stories og Reels: 14 % topp, 35 % bunn, 6 % i
 * hver side. Rammen er 180 × 320 px, så sonene regnes rett ut av høyden og
 * bredden — ingen magiske piksler.
 */
function TryggSone() {
  const B = 180;
  const H = 320;
  const topp = H * 0.14;
  const bunn = H * 0.35;
  const side = B * 0.06;

  return (
    <svg
      viewBox={`0 0 ${B + 150} ${H + 8}`}
      width="330"
      height="320"
      role="img"
      aria-labelledby="trygg-sone-tittel"
    >
      <title id="trygg-sone-tittel">
        En stående videoflate der de øverste 14 prosent, de nederste 35
        prosent og 6 prosent i hver side er markert som områder
        grensesnittet kan dekke.
      </title>

      <rect
        x="0.5"
        y="4.5"
        width={B}
        height={H}
        rx="10"
        fill="#EFE9E0"
        stroke={KANT}
      />

      {/* De dekkede sonene. Lav alfa, så det trygge feltet leser som «åpent»
          og ikke som enda et lag. */}
      <rect x="1" y="5" width={B} height={topp} fill={ORANSJE} opacity="0.16" />
      <rect
        x="1"
        y={4 + H - bunn}
        width={B}
        height={bunn}
        fill={ORANSJE}
        opacity="0.16"
      />
      <rect x="1" y="5" width={side} height={H} fill={ORANSJE} opacity="0.16" />
      <rect
        x={1 + B - side}
        y="5"
        width={side}
        height={H}
        fill={ORANSJE}
        opacity="0.16"
      />

      {/* Det trygge feltet, med stiplet ramme. */}
      <rect
        x={1 + side}
        y={5 + topp}
        width={B - side * 2}
        height={H - topp - bunn}
        fill="none"
        stroke={ORANSJE}
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text
        x={1 + B / 2}
        y={5 + topp + (H - topp - bunn) / 2}
        textAnchor="middle"
        fontSize="11"
        fontWeight="500"
        fill={BLEKK}
      >
        Trygt felt
      </text>

      {/* Målsettingene, utenfor rammen. */}
      <Mal x={B + 14} y1={5} y2={5 + topp} etikett="14 %" />
      <Mal x={B + 14} y1={4 + H - bunn} y2={4 + H} etikett="35 %" />
      {/*
        Sidemålet står UTENFOR rammen, ikke inni sidefeltet. Feltet er 6 %
        av 180 px, altså under elleve piksler — en etikett der ble klippet
        av rammekanten og var uleselig. Her peker en liten strek inn i
        feltet i stedet.
      */}
      <g stroke={DEMPET} strokeWidth="1">
        <line x1={1 + side} y1={H - 18} x2={B + 6} y2={H - 18} />
        <line x1={1} y1={H - 22} x2={1} y2={H - 14} />
        <line x1={1 + side} y1={H - 22} x2={1 + side} y2={H - 14} />
        <text
          x={B + 10}
          y={H - 14}
          fontSize="11"
          fontWeight="500"
          fill={BLEKK}
          stroke="none"
        >
          6 % i hver side
        </text>
      </g>
    </svg>
  );
}

/** Loddrett målsetting med endestreker. */
function Mal({
  x,
  y1,
  y2,
  etikett,
}: {
  x: number;
  y1: number;
  y2: number;
  etikett: string;
}) {
  return (
    <g stroke={DEMPET} strokeWidth="1">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
      <text
        x={x + 8}
        y={(y1 + y2) / 2 + 4}
        fontSize="11"
        fill={BLEKK}
        stroke="none"
        fontWeight="500"
      >
        {etikett}
      </text>
    </g>
  );
}

/**
 * Hva et 9:16-utsnitt tar av et 16:9-bilde.
 *
 * Poenget figuren skal gjøre umiddelbart klart: utsnittet er smalt, og
 * «midtfeltet» er ikke det samme som «midt i bildet».
 */
function Utsnitt() {
  const B = 300;
  const H = B * (9 / 16);
  const utsnittB = H * (9 / 16);
  const x0 = (B - utsnittB) / 2;

  return (
    <svg
      viewBox={`0 0 ${B + 2} ${H + 52}`}
      width="320"
      height="215"
      role="img"
      aria-labelledby="utsnitt-tittel"
    >
      <title id="utsnitt-tittel">
        Et liggende 16:9-bilde med et smalt stående 9:16-utsnitt markert midt
        i, som dekker omtrent den midterste tredjedelen av bredden.
      </title>

      {/*
        Etiketten står OVER rammen, ikke inni den. Inni ble den liggende
        under 9:16-utsnittet, som dekker midten av bildet — altså nøyaktig
        der teksten sto.
      */}
      <text x="1" y="11" fontSize="11" fill={DEMPET}>
        16:9 — det du filmer
      </text>
      <rect
        x="1"
        y="19"
        width={B}
        height={H}
        rx="6"
        fill="#EFE9E0"
        stroke={KANT}
      />

      {/* Det som faller utenfor. */}
      <rect x="1" y="19" width={x0} height={H} fill={BLEKK} opacity="0.08" />
      <rect
        x={x0 + utsnittB}
        y="19"
        width={B - x0 - utsnittB}
        height={H}
        fill={BLEKK}
        opacity="0.08"
      />

      <rect
        x={x0}
        y="19"
        width={utsnittB}
        height={H}
        fill="none"
        stroke={ORANSJE}
        strokeWidth="2"
      />

      <line
        x1={x0}
        y1={H + 30}
        x2={x0 + utsnittB}
        y2={H + 30}
        stroke={ORANSJE}
        strokeWidth="1"
      />
      <text
        x={x0 + utsnittB / 2}
        y={H + 45}
        fontSize="11"
        fontWeight="500"
        fill={BLEKK}
        textAnchor="middle"
      >
        9:16 — det som blir igjen
      </text>
    </svg>
  );
}

/**
 * De fire bildeutsnittene, som står i shotlisten.
 *
 * Ikke et forsøk på å tegne mennesker: fire rammer med en markering som
 * blir større. Poenget er forholdet mellom motiv og ramme, og det er
 * nøyaktig det begrepene betyr.
 */
function Bildeutsnitt() {
  const navn = ["Totalt", "Halvnært", "Nært", "Detalj"];
  const andel = [0.18, 0.4, 0.66, 1.15];
  const R = 64;
  const mellomrom = 14;

  return (
    <svg
      viewBox={`0 0 ${(R + mellomrom) * 4} ${R + 26}`}
      width="320"
      height="94"
      role="img"
      aria-labelledby="bildeutsnitt-tittel"
    >
      <title id="bildeutsnitt-tittel">
        Fire rammer som viser bildeutsnittene totalt, halvnært, nært og
        detalj, der motivet fyller gradvis mer av rammen.
      </title>
      {navn.map((n, i) => {
        const x = i * (R + mellomrom);
        const d = R * andel[i];
        return (
          <g key={n}>
            <rect
              x={x + 0.5}
              y="0.5"
              width={R}
              height={R}
              rx="4"
              fill="#EFE9E0"
              stroke={KANT}
            />
            {/* Klippes av rammen når motivet er større enn den — som er
                nettopp det «detalj» betyr. */}
            <clipPath id={`ramme-${i}`}>
              <rect x={x} y="0" width={R} height={R} rx="4" />
            </clipPath>
            <circle
              cx={x + R / 2}
              cy={R / 2}
              r={d / 2}
              fill={ORANSJE}
              opacity="0.85"
              clipPath={`url(#ramme-${i})`}
            />
            <text
              x={x + R / 2}
              y={R + 18}
              fontSize="10"
              fill={DEMPET}
              textAnchor="middle"
            >
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
