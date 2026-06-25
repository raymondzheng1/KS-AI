import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionShell } from "@/components/SectionShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the KidSmart AI Training team.",
};

export default function ContactPage() {
  return (
    <SectionShell
      title="Contact us"
      subtitle="Questions from a parent, teacher, or facilitator? Send us a note and we'll get back to you."
    >
      <div className="max-w-xl">
        <ContactForm />
      </div>
    </SectionShell>
  );
}
