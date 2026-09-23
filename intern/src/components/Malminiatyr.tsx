import type { Skissedel } from "@/content/maltype";

/**
 * Miniatyren av en mal.
 *
 * ── HVORFOR DEN ER TEGNET OG IKKE ET BILDE ────────────────────────────────
 *
 * Et skjermbilde av et ferdig dokument ville vært åtte PNG-er som må lages
 * på nytt hver gang en mal endres — og som ingen kommer til å lage på nytt.
 * Da viser huben snart maler som ikke finnes lenger.
 *
 * Denne tegnes av `skisse` i maldataene. Endrer malen struktur, endrer
 * miniatyren seg i samme commit. Den koster null kilobyte, den er skarp på
 * alle skjermer, og den kan ikke bli utdatert.
 *
 * Den viser FORMEN, ikke innholdet: en mørk topp, en faktarad, en tabell.
 * Det er nok til at man kjenner igjen dokumentet man har sendt før.
 *
 * `aria-hidden`, fordi kortet ved siden av sier hva malen er med ord. En
 * skjermleser skal ikke lese opp en tegning av et papirark.
 */

/** Papirets proporsjoner. A4 stående, som dokumentene faktisk er. */
const B = 210;
const H = 297;

const BLEKK = "var(--blekk-mini)";
const SVAK = "var(--svak-mini)";

/** Hver del vet hvor høy den er, så neste del kan legges under. */
function del(
  type: Skissedel,
  y: number,
): { hoyde: number; innhold: React.ReactNode } {
  const M = 16;
  const bredde = B - M * 2;

  switch (type) {
    case "topp":
      return {
        hoyde: 46,
        innhold: (
          <>
            <rect x="0" y={y} width={B} height="46" fill="#1C1310" />
            <rect
              x={M}
              y={y + 12}
              width="46"
              height="4"
              rx="2"
              fill="var(--aksent-mini)"
            />
            <rect
              x={M}
              y={y + 22}
              width="96"
              height="13"
              rx="2"
              fill="#F6F4F1"
            />
          </>
        ),
      };

    case "fakta":
      return {
        hoyde: 30,
        innhold: (
          <>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={M + i * ((bredde + 5) / 4)}
                y={y + 6}
                width={(bredde + 5) / 4 - 5}
                height="20"
                rx="2.5"
                fill={SVAK}
              />
            ))}
          </>
        ),
      };

    case "tabellOgBoks":
      return {
        hoyde: 92,
        innhold: (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i}>
                <rect
                  x={M}
                  y={y + 14 + i * 13}
                  width="20"
                  height="4"
                  rx="2"
                  fill={BLEKK}
                />
                <rect
                  x={M + 25}
                  y={y + 14 + i * 13}
                  width="44"
                  height="4"
                  rx="2"
                  fill={SVAK}
                />
                <rect
                  x={M}
                  y={y + 22 + i * 13}
                  width="69"
                  height="0.7"
                  fill={SVAK}
                />
              </g>
            ))}
            <rect
              x={M + 78}
              y={y + 6}
              width={bredde - 78}
              height="80"
              rx="3"
              fill="#1C1310"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={M + 86}
                y={y + 16 + i * 14}
                width={i % 2 ? 56 : 40}
                height="4"
                rx="2"
                fill="rgba(246,244,241,0.5)"
              />
            ))}
          </>
        ),
      };

    case "tabell":
      return {
        hoyde: 76,
        innhold: (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i}>
                <rect
                  x={M}
                  y={y + 10 + i * 12}
                  width="26"
                  height="4"
                  rx="2"
                  fill={BLEKK}
                />
                <rect
                  x={M + 34}
                  y={y + 10 + i * 12}
                  width={bredde - 34}
                  height="4"
                  rx="2"
                  fill={SVAK}
                />
                <rect
                  x={M}
                  y={y + 18 + i * 12}
                  width={bredde}
                  height="0.7"
                  fill={SVAK}
                />
              </g>
            ))}
          </>
        ),
      };

    case "toKolonner":
      return {
        hoyde: 62,
        innhold: (
          <>
            {[0, 1].map((k) => (
              <g key={k}>
                <rect
                  x={M + k * (bredde / 2 + 4)}
                  y={y + 6}
                  width="34"
                  height="4"
                  rx="2"
                  fill="var(--aksent-mini)"
                />
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect
                    key={i}
                    x={M + k * (bredde / 2 + 4)}
                    y={y + 18 + i * 9}
                    width={bredde / 2 - 4 - (i % 3 === 2 ? 18 : 0)}
                    height="4"
                    rx="2"
                    fill={SVAK}
                  />
                ))}
              </g>
            ))}
          </>
        ),
      };

    case "kort3":
      return {
        hoyde: 38,
        innhold: (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={M + i * ((bredde + 5) / 3)}
                  y={y + 6}
                  width={(bredde + 5) / 3 - 5}
                  height="26"
                  rx="2.5"
                  fill={SVAK}
                />
                <rect
                  x={M + 5 + i * ((bredde + 5) / 3)}
                  y={y + 12}
                  width="24"
                  height="3.5"
                  rx="1.75"
                  fill="var(--aksent-mini)"
                />
              </g>
            ))}
          </>
        ),
      };

    case "avsnitt":
      return {
        hoyde: 44,
        innhold: (
          <>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={M}
                y={y + 8 + i * 10}
                width={i === 3 ? bredde * 0.55 : bredde}
                height="4"
                rx="2"
                fill={SVAK}
              />
            ))}
          </>
        ),
      };

    case "liste":
      return {
        hoyde: 52,
        innhold: (
          <>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <circle
                  cx={M + 3}
                  cy={y + 10 + i * 12}
                  r="2.2"
                  fill="var(--aksent-mini)"
                />
                <rect
                  x={M + 10}
                  y={y + 8 + i * 12}
                  width={bredde - 10 - (i % 2 ? 30 : 0)}
                  height="4"
                  rx="2"
                  fill={SVAK}
                />
              </g>
            ))}
          </>
        ),
      };

    case "signatur":
      return {
        hoyde: 40,
        innhold: (
          <>
            {[0, 1].map((k) => (
              <g key={k}>
                <rect
                  x={M + k * (bredde / 2 + 6)}
                  y={y + 22}
                  width={bredde / 2 - 6}
                  height="1"
                  fill={BLEKK}
                />
                <rect
                  x={M + k * (bredde / 2 + 6)}
                  y={y + 27}
                  width="30"
                  height="3.5"
                  rx="1.75"
                  fill={SVAK}
                />
              </g>
            ))}
          </>
        ),
      };
  }
}

export function Malminiatyr({ skisse }: { skisse: readonly Skissedel[] }) {
  /*
   * REN OPPSUMMERING, ikke en teller som muteres under rendring. Hver del
   * må vite hvor forrige sluttet, og `reduce` bærer den kunnskapen videre
   * uten å skrive til noe utenfor seg selv.
   */
  const { deler } = skisse.reduce<{ y: number; deler: React.ReactNode[] }>(
    (akk, d, i) => {
      const { hoyde, innhold } = del(d, akk.y);
      return {
        y: akk.y + hoyde,
        deler: [...akk.deler, <g key={`${d}-${i}`}>{innhold}</g>],
      };
    },
    { y: 0, deler: [] },
  );

  return (
    <svg
      viewBox={`0 0 ${B} ${H}`}
      aria-hidden
      className="block h-full w-full [--aksent-mini:#DE4826] [--blekk-mini:#8E8781] [--svak-mini:#DCD7D1]"
    >
      <rect x="0" y="0" width={B} height={H} fill="#FFFFFF" />
      {deler}
      {/*
        BUNNLINJEN TEGNES ALLTID. Den sier «her slutter arket», og uten den
        flyter det nederste elementet ut i ingenting når skissen er kort.
      */}
      <rect x="16" y={H - 22} width="74" height="3.5" rx="1.75" fill={SVAK} />
      <rect
        x={B - 16 - 46}
        y={H - 22}
        width="46"
        height="3.5"
        rx="1.75"
        fill="var(--aksent-mini)"
      />
    </svg>
  );
}
