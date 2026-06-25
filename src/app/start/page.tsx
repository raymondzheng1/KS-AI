import type { Metadata } from "next";
import { StartChooser } from "@/components/StartChooser";
import { SectionShell } from "@/components/SectionShell";

export const metadata: Metadata = {
  title: "Start",
  description: "Create a room or join one to begin your AI adventure.",
};

export default function StartPage() {
  return (
    <SectionShell
      title="Start your adventure"
      subtitle="Create a room for your class or friends, join one you were invited to, or jump in solo."
    >
      <StartChooser />
    </SectionShell>
  );
}
