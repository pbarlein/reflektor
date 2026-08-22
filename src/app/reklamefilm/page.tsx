import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "reklamefilm";

export const metadata: Metadata = lagMetadata(SLUG);

export default function Reklamefilm() {
  return <Landingsside slug={SLUG} />;
}
