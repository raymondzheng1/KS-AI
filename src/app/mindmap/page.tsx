import type { Metadata } from "next";
import { SectionShell } from "@/components/SectionShell";
import { StartCta } from "@/components/StartCta";
import { DiagramFigure } from "@/components/diagrams";

export const metadata: Metadata = {
  title: "Course Mind Map",
  description: "A visual map of the whole KidSmart AI Training course.",
};

export default function MindMapPage() {
  return (
    <SectionShell
      title="Course mind map"
      subtitle="See how every hurdle, tool, and idea connects."
    >
      <div className="ks-card mx-auto max-w-2xl p-5">
        <DiagramFigure src="/diagrams/08_course_mind_map.png" alt="KidSmart AI Training course mind map" />
      </div>
      <StartCta />
    </SectionShell>
  );
}
