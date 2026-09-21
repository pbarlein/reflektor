import type { Lesetilstand } from "@/lib/lesing";

/**
 * Lesestatusen på et kort.
 *
 * ── ÉN POSISJON, TRE TILSTANDER, INGEN OVERLAPP ───────────────────────────
 *
 * Merket står alltid øverst til høyre på mediet, speilvendt av
 * kategorimerket til venstre. Det er ALDRI to merker der. Et kort er enten
 * nytt, lest eller ingen av delene — aldri begge.
 *
 * Retningslinjene for merkelapper er tydelige på at man ikke skal blande to
 * merkesystemer på samme flate: velg ett, og hold deg til det. Kortet har
 * allerede ett system nederst — utkast eller godkjent. Derfor er lesestatus
 * en PRIKK og en HAKE øverst, ikke enda en pille nederst.
 *
 * ── «ULEST» HAR INGEN MARKØR, OG DET ER POENGET ───────────────────────────
 *
 * Det fristende er å merke alt man ikke har lest. Med femti rubrikker og en
 * nyansatt som ikke har lest noen, ville det gitt femti like merker — altså
 * null informasjon, og nøyaktig den forvirringen merkene skulle fjerne.
 *
 * Ulest er normaltilstanden. Normaltilstanden roper ikke.
 *
 * ── FARGEN SIER IKKE NOE ALENE ────────────────────────────────────────────
 *
 * Begge merkene har ord i seg, ikke bare farge. Samme regel som for
 * utkastmerket: en markør som bare finnes som farge, finnes ikke for den
 * som ikke ser farge.
 */
export function Lesemerke({ tilstand }: { tilstand: Lesetilstand }) {
  if (tilstand === "ulest") return null;

  if (tilstand === "ny") {
    return (
      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-aksent px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-white uppercase">
        <span aria-hidden className="size-1.5 rounded-full bg-white" />
        Ny
      </span>
    );
  }

  return (
    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.92)] px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-blekk-dempet uppercase backdrop-blur-sm">
      <span aria-hidden>✓</span>
      Lest
    </span>
  );
}
