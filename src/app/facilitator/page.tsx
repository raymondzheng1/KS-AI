import type { Metadata } from "next";
import { FacilitatorForm } from "@/components/FacilitatorForm";
import { SectionShell } from "@/components/SectionShell";
import { isFacilitator } from "@/lib/server/facilitator";

export const metadata: Metadata = {
  title: "Facilitator mode",
  robots: { index: false, follow: false },
};

export default async function FacilitatorPage() {
  const active = await isFacilitator();
  return (
    <SectionShell
      title="Facilitator mode"
      subtitle="Teachers & parents: unlock schedules, answer keys, discussion guides, and award rubrics inside each hurdle."
    >
      <div className="max-w-md">
        <FacilitatorForm active={active} />
        <p className="mt-3 text-xs text-ks-ink-soft">
          The passcode is set by your program organiser. Facilitator content stays hidden from
          students until it&apos;s entered, and turns off automatically after the teaching day.
        </p>
      </div>
    </SectionShell>
  );
}
