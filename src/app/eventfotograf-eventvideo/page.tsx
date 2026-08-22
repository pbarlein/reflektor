import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "eventfotograf-eventvideo";

export const metadata: Metadata = lagMetadata(SLUG);

export default function EventfotografEventvideo() {
  return <Landingsside slug={SLUG} />;
}
