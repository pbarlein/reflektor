import type { Metadata } from "next";

import { Kommer } from "@/components/Kommer";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Dine kunder" };

export default async function Side() {
  await krevBruker();
  return <Kommer tittel="Dine kunder" />;
}
