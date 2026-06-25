import type { Metadata } from "next";
import Image from "next/image";
import { SectionShell } from "@/components/SectionShell";

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
      <div className="ks-card overflow-hidden p-3">
        <Image
          src="/diagrams/08_course_mind_map.png"
          alt="KidSmart AI Training course mind map"
          width={1100}
          height={780}
          className="h-auto w-full rounded-xl"
        />
      </div>
    </SectionShell>
  );
}
