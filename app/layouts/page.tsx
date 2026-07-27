import type { Metadata } from "next";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";

export const metadata: Metadata = {
  title: "Layout studies",
  description: "The same design system arranged five different ways.",
  robots: { index: false, follow: false },
};

export default function LayoutsPage() {
  return <LayoutSwitcher />;
}
