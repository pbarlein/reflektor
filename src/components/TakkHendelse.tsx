"use client";

import { useEffect } from "react";

/**
 * GA4 key event `takk_page_view` (brief 8.4, LÅST).
 *
 * Navnet skal være identisk med dagens. GA4-property 317376140. Den native
 * Google Ads-taggen «Takkeside - Gads Conversion» utløses på samme sidevisning
 * og bærer over 100 historiske konverteringer.
 *
 * Endres navnet eller URL-en mister Reflektor målingen av sin eneste KPI.
 *
 * Verifisering før produksjon (8.4): hard reload mellom hver test – GTM kan
 * servere gammel versjon i inntil et kvarter – og bekreft i Google
 * Ads-grensesnittet, ikke bare i GTM Preview.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function TakkHendelse() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "takk_page_view" });
  }, []);

  return null;
}
