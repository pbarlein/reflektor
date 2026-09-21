"use client";

import { useEffect } from "react";

import { tellVisning } from "@/lib/visninger";

/**
 * Teller én åpning av en rubrikk.
 *
 * EGEN KOMPONENT, OG DEN RENDRER INGENTING. Selve rubrikksiden er en
 * serverkomponent med all brødteksten i seg; hadde tellingen ligget der,
 * måtte hele siden vært en klientkomponent — og da ville hvert avsnitt gått
 * over ledningen som JavaScript i stedet for som HTML, for å øke et tall
 * med én.
 *
 * `useEffect` med `[slug]` og ikke `[]`: navigerer man mellom to rubrikker
 * i appen, monteres ikke komponenten på nytt — den får bare ny prop. Med tom
 * avhengighetsliste ville bare den første av dem blitt telt.
 */
export function Teller({ slug }: { slug: string }) {
  useEffect(() => {
    tellVisning(slug);
  }, [slug]);
  return null;
}
