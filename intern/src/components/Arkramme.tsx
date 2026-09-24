"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Ark } from "@/components/Ark";
import type { Ark as ArkData } from "@/content/arktype";

/**
 * Arket i en iframe.
 *
 * ── HVORFOR EN IFRAME, OG IKKE BARE EN DIV ────────────────────────────────
 *
 * Tre grunner, og den første er den som tvang fram endringen:
 *
 * 1. NETTLESERUTVIDELSER SKRIVER SEG INN I SIDEN. Den første PDF-en fra
 *    denne funksjonen hadde Apollo-utvidelsens logo i seg, fordi utskriften
 *    tok med alt som lå i dokumentet. En iframe har sitt eget dokument, og
 *    utvidelser injiserer ikke i det. `print()` på iframen skriver ut
 *    nøyaktig det arket og ingenting annet.
 *
 * 2. DET DU SER ER DET DU FÅR. Forhåndsvisningen og PDF-en er samme
 *    dokument, ikke to som ligner. Skalering er den eneste forskjellen.
 *
 * 3. Sidens egen CSS kan ikke lekke inn og flytte på noe.
 *
 * ── STILARKENE KOPIERES INN ───────────────────────────────────────────────
 *
 * Iframen starter tom, uten Tailwind og uten merkevarefontene. I stedet for
 * å skrive arket om til ren CSS, kopieres sidens egne `<style>` og
 * `<link rel="stylesheet">` inn i iframens hode. Da er det samme
 * typografi, samme farger og samme tokens — og ingen andre utgave å holde
 * i takt.
 */

export type Arkhandtak = { skrivUt: () => void };

/** A4 i CSS-piksler ved 96 dpi. */
const BREDDE = 794;
const HOYDE = 1123;

export function Arkramme({
  ark,
  type,
  dato,
  filnavn,
  handtakRef,
  påOverflyt,
}: {
  ark: ArkData;
  type: string;
  dato: string;
  filnavn: string;
  handtakRef: React.RefObject<Arkhandtak | null>;
  påOverflyt: (forMye: boolean) => void;
}) {
  const rammeRef = useRef<HTMLIFrameElement>(null);
  const boksRef = useRef<HTMLDivElement>(null);
  const [dok, setDok] = useState<Document | null>(null);
  const [skala, setSkala] = useState(1);

  /* Iframen er klar først etter at den er lagt inn i siden. */
  useEffect(() => {
    const d = rammeRef.current?.contentDocument;
    if (!d) return;

    d.head.replaceChildren();
    for (const node of Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )) {
      d.head.appendChild(node.cloneNode(true));
    }

    /*
     * `margin: 0` på @page, og arket er nøyaktig A4. Uten dette legger
     * nettleseren på sin egen marg utenpå en side som allerede har marger,
     * og arket krymper til 85 % med en hvit rammeRef rundt.
     */
    const egen = d.createElement("style");
    egen.textContent = `
      @page { size: A4 portrait; margin: 0; }
      html, body { margin: 0; padding: 0; background: #fff; }
      body { overflow: hidden; }

      /*
       * SIDEN RUNDT SKJULER SEG SELV VED UTSKRIFT — og den regelen fulgte
       * med stilarkene inn hit.
       *
       * globals.css har @media print { body { display: none } } for at
       * ingen skal kunne Ctrl+P ut skjemaet på papir. Siden vi kopierer
       * sidens stilark inn i iframen, traff den regelen ARKETS body, og
       * PDF-en kom ut helt blank. Én side, ingenting på den.
       *
       * Denne stilen legges inn ETTER kopiene, så den vinner.
       */
      @media print {
        html, body { display: block !important; overflow: visible !important; }
      }

      /*
       * Bakgrunnene er dokumentet, ikke pynt: det mørke hodet og den mørke
       * boksen bærer strukturen. Uten dette kommer de ut hvite hos alle som
       * ikke har huket av «Bakgrunnsgrafikk», og det er standard.
       */
      *, *::before, *::after {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `;
    d.head.appendChild(egen);

    /*
     * KLASSENE PÅ <html> MÅ MED, IKKE BARE STILARKENE.
     *
     * `next/font` legger @font-face i stilarket, men selve variablene
     * (--font-poppins, --font-display-serif) settes med en klasse — og i
     * dette prosjektet står den på <body>, ikke på <html>. Se
     * src/app/layout.tsx.
     *
     * Uten den finner iframen fontfilene og bruker dem ikke: arket kom ut
     * i systemfonten mens resten av siden sto i merkevarefonten, og
     * forskjellen var ikke åpenbar før de sto ved siden av hverandre.
     */
    d.documentElement.className = document.documentElement.className;
    d.body.className = document.body.className;
    setDok(d);
  }, []);

  /* Arket har fast bredde i millimeter. Spalten har det ikke. */
  useEffect(() => {
    const el = boksRef.current;
    if (!el) return;
    const mål = () => setSkala(el.clientWidth / BREDDE);
    mål();
    const o = new ResizeObserver(mål);
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    handtakRef.current = {
      skrivUt: () => {
        const v = rammeRef.current?.contentWindow;
        if (!v) return;
        /*
         * Tittelen settes her og ikke i en effekt, fordi den bare betyr
         * noe i ett øyeblikk: nettleseren leser den når «Lagre som PDF»
         * skal foreslå et filnavn.
         */
        v.document.title = filnavn;
        v.focus();
        v.print();
      },
    };
  }, [handtakRef, filnavn]);

  /*
   * MÅLER OM INNHOLDET GÅR UT OVER ARKET.
   *
   * Arket klipper det som ikke får plass — det er det som gjør det til en
   * ensider. Men et dokument som mister den siste seksjonen i stillhet er
   * verre enn et som er for langt, så det måles og sies fra om.
   */
  useEffect(() => {
    if (!dok) return;
    const id = requestAnimationFrame(() => {
      const el = dok.querySelector("[data-innhold]");
      if (!el) return;
      påOverflyt(el.scrollHeight > el.clientHeight + 2);
    });
    return () => cancelAnimationFrame(id);
  }, [dok, ark, påOverflyt]);

  return (
    <div
      ref={boksRef}
      className="overflow-hidden rounded-flate border border-kant bg-white shadow-[0_1px_3px_rgba(28,19,16,0.08)]"
      style={{ height: HOYDE * skala }}
    >
      <iframe
        ref={rammeRef}
        title="Forhåndsvisning av dokumentet"
        /* Lastet fra samme opphav, så innholdet kan nås og skrives ut. */
        src="about:blank"
        scrolling="no"
        style={{
          width: BREDDE,
          height: HOYDE,
          border: 0,
          transform: `scale(${skala})`,
          transformOrigin: "top left",
        }}
      />
      {dok && createPortal(<Ark ark={ark} type={type} dato={dato} />, dok.body)}
    </div>
  );
}
