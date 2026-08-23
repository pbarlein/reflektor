"use client";

import { useEffect, useRef } from "react";
import { sendSkjema } from "@/lib/skjema";

/**
 * Kontaktskjema – maks fire felt (brief 6.1, LÅST).
 *
 * Konverteringen faller kraftig per felt utover fire. Kvalifisering skjer i
 * oppfølgingen, ikke i skjemaet.
 *
 * Ekte label-elementer, ikke bare placeholder, og ekte HTML-validering –
 * dagens Squarespace-skjema validerer kun via JavaScript og har ingen
 * required-attributter.
 */
export function Kontaktskjema({ side }: { side: string }) {
  // Tidsstempelet settes direkte på DOM-noden etter montering. Å gå veien om
  // state ville utløst en render uten grunn – verdien leses kun ved innsending.
  const lastet = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (lastet.current) lastet.current.value = String(Date.now());
  }, []);

  return (
    <form action={sendSkjema} className="mt-8 grid max-w-lg gap-5">
      <input type="hidden" name="lastet" ref={lastet} defaultValue="0" />
      <input type="hidden" name="side" value={side} />

      {/* Honningkrukke – skjult for mennesker, ikke for boter. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="firmanavn">Firmanavn</label>
        <input id="firmanavn" name="firmanavn" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="navn" className="text-sm font-medium">Navn</label>
        <input
          id="navn"
          name="navn"
          required
          autoComplete="name"
          className="rounded-knapp border border-kant bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="epost" className="text-sm font-medium">E-post</label>
        <input
          id="epost"
          name="epost"
          type="email"
          required
          autoComplete="email"
          className="rounded-knapp border border-kant bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="telefon" className="text-sm font-medium">Telefon</label>
        <input
          id="telefon"
          name="telefon"
          type="tel"
          autoComplete="tel"
          className="rounded-knapp border border-kant bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="melding" className="text-sm font-medium">
          Kort om bedriften
        </label>
        <textarea
          id="melding"
          name="melding"
          rows={4}
          className="rounded-knapp border border-kant bg-white px-4 py-3"
        />
      </div>

      <button
        type="submit"
        className="knapp-skjev justify-self-start rounded-knapp bg-aksent px-7 py-3.5 font-medium text-white hover:bg-aksent-hover"
      >
        Få et strategiforslag
      </button>
    </form>
  );
}
