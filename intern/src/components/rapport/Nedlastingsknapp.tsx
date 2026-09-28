/**
 * Last ned rapporten som Markdown-fil.
 *
 * ── EN VANLIG LENKE, IKKE EN KNAPP MED KLIENTKODE ─────────────────────────
 *
 * `download` på en `<a>` gjør hele jobben. Alternativet — `fetch`, lag en
 * blob-URL, klikk den, rydd opp — er tre tilstander mer å ta feil av, og
 * det ville brutt høyreklikk, midtklikk og «lagre som». Ruta svarer med
 * `Content-Disposition: attachment`, så filen lastes ned også om noen
 * åpner adressen direkte.
 *
 * ── HVORFOR DET STÅR HVA FILEN INNEHOLDER ─────────────────────────────────
 *
 * Filen skal etter planen legges i et Claude-prosjekt. Det er en flytting
 * av kundenavn og annonseforbruk ut av intranettet og inn et annet sted, og
 * den som gjør det bør vite det i det hen trykker — ikke finne det ut når
 * filen allerede ligger der.
 */
export function Nedlastingsknapp({
  type,
  id,
  antall,
}: {
  /** Sammen med `id`: last ned én rapport. Utelatt: alle. */
  type?: string;
  id?: string;
  /** Antall rapporter i samlefilen. Kun til teksten. */
  antall?: number;
}) {
  const en = Boolean(type && id);
  const adresse = en
    ? `/api/rapport/nedlasting?type=${encodeURIComponent(type!)}&id=${encodeURIComponent(id!)}`
    : "/api/rapport/nedlasting";

  return (
    <a
      href={adresse}
      download
      className="inline-flex items-center gap-2 rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none print:hidden"
    >
      {/* Pil ned i en skuff. `aria-hidden`: teksten ved siden av sier det. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0"
      >
        <path d="M12 3v11" />
        <path d="m7.5 10 4.5 4.5 4.5-4.5" />
        <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
      </svg>
      {en
        ? "Last ned rapport"
        : `Last ned alle rapportene${antall ? ` (${antall})` : ""}`}
    </a>
  );
}
