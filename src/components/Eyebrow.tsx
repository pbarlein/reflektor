/**
 * Seksjonsetikett: liten oransje prikk + kort fet label.
 *
 * Går igjen over hele siden. Billig, konsekvent og distinkt — og den bruker
 * aksentfargen på en måte som ikke konkurrerer med CTA-knappen, fordi prikken
 * er få piksler.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium">
      <span
        className="size-2 shrink-0 rounded-full bg-aksent"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
