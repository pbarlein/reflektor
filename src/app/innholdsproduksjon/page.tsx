import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "innholdsproduksjon";

export const metadata: Metadata = lagMetadata(SLUG);

export default function Innholdsproduksjon() {
  return <Landingsside slug={SLUG} />;
}
