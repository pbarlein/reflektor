import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "videoproduksjon-i-oslo";

export const metadata: Metadata = lagMetadata(SLUG);

export default function VideoproduksjonIOslo() {
  return <Landingsside slug={SLUG} />;
}
