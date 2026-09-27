import type { Metadata } from "next";

import { Kommer } from "@/components/Kommer";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Video-checker" };

export default async function Side() {
  await krevBruker();
  return <Kommer tittel="Video-checker" />;
}
