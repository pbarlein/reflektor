import type { Metadata } from "next";
import { Landingsside, lagMetadata } from "@/components/Landingsside";

const SLUG = "employer-branding-video-oslo";

export const metadata: Metadata = lagMetadata(SLUG);

export default function EmployerBrandingVideoOslo() {
  return <Landingsside slug={SLUG} />;
}
