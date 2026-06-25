import type { Metadata } from "next";
import { FacilitatorForm } from "@/components/FacilitatorForm";
import { FacilitatorHub } from "@/components/FacilitatorHub";
import { SectionShell } from "@/components/SectionShell";
import { isFacilitator } from "@/lib/server/facilitator";

export const metadata: Metadata = {
  title: "Facilitator mode",
  robots: { index: false, follow: false },
};

export default async function FacilitatorPage() {
  const active = await isFacilitator();

  // Once unlocked, show the full Facilitator Hub (schedule, guides, answer keys).
  if (active) return <FacilitatorHub />;

  return (
    <SectionShell
      title="Facilitator mode"
      subtitle="Teachers & parents running the program with a group: unlock the daily schedule, run guides, answer keys, and a class leaderboard."
    >
      <div className="max-w-md">
        <FacilitatorForm active={false} />
        <p className="mt-3 text-xs text-ks-ink-soft">
          The passcode is set by your program organiser. Facilitator content stays hidden from
          students until it&apos;s entered, and turns off automatically after the teaching day.
        </p>
      </div>
    </SectionShell>
  );
}
