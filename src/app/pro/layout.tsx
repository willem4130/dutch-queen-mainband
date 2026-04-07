import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Professional",
  description: `Press kit, technical rider, and hospitality rider for ${siteConfig.bandName}. Professional materials for venues and event organizers.`,
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
