import Link from "next/link";

/**
 * Sticky CTA på mobil (brief 6.1, LÅST).
 *
 * «Sticky CTA eller CTA over folden — ikke begge. De to stabler ikke effekt.»
 * Derfor er heroens inline-CTA skjult under sm, og denne vises kun der.
 */
export function StickyCta({ tekst }: { tekst: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kant-invers bg-mork/95 p-3 backdrop-blur sm:hidden">
      <Link
        href="#kontakt"
        className="block rounded-knapp bg-aksent px-6 py-3.5 text-center font-medium text-white"
      >
        {tekst}
      </Link>
    </div>
  );
}
