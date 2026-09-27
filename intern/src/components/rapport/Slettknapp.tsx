"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Sletter alle testrapportene på én gang.
 *
 * ── HVORFOR DEN SPØR FØRST ────────────────────────────────────────────────
 *
 * Testdata er billig å miste, men knappen står i et panel som ellers bare
 * inneholder lenker. En sletting som skjer på første klikk i en liste man
 * bare skulle bla i, er en felle — og den dagen noen tar feil av «testdata»
 * og arkivet, er det ingen angreknapp.
 */
export function Slettknapp({ antall }: { antall: number }) {
  const router = useRouter();
  const [sikker, setSikker] = useState(false);
  const [jobber, setJobber] = useState(false);

  async function slett() {
    setJobber(true);
    try {
      await fetch("/api/rapport/handling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handling: "slett-testdata" }),
      });
      router.refresh();
    } finally {
      setJobber(false);
      setSikker(false);
    }
  }

  if (!sikker) {
    return (
      <button
        type="button"
        onClick={() => setSikker(true)}
        className="rounded-interaktiv border border-kant px-3 py-1.5 text-[0.8125rem] text-blekk-svak transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
      >
        Slett testdataene
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void slett()}
        disabled={jobber}
        className="rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3 py-1.5 text-[0.8125rem] font-medium text-varsel transition-colors hover:border-varsel disabled:opacity-60 motion-reduce:transition-none"
      >
        {jobber ? "Sletter …" : `Slett ${antall} testrapporter`}
      </button>
      <button
        type="button"
        onClick={() => setSikker(false)}
        className="rounded-interaktiv text-[0.8125rem] text-blekk-svak underline underline-offset-2"
      >
        Avbryt
      </button>
    </span>
  );
}
