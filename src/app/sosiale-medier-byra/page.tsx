import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "sosiale-medier-byra";

export const metadata: Metadata = lagMetadata(SLUG);

export default function SosialeMedierByra() {
  return <Landingsside slug={SLUG} />;
}
