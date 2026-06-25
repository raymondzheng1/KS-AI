import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/SectionShell";
import { StartCta } from "@/components/StartCta";
import { GLOSSARY } from "@/lib/content";
import type { GlossaryTerm } from "@/lib/content/schema";

export const metadata: Metadata = {
  title: "Appendix & Glossary",
  description: "Every AI word you'll meet in the KidSmart programme, defined in plain language.",
};

export default function AppendixPage() {
  // Group glossary terms by first letter (already alphabetically sorted).
  const groups = new Map<string, GlossaryTerm[]>();
  for (const term of GLOSSARY) {
    const letter = term.term[0]?.toUpperCase() ?? "#";
    const arr = groups.get(letter) ?? [];
    arr.push(term);
    groups.set(letter, arr);
  }

  return (
    <SectionShell
      title="Appendix & glossary"
      subtitle="Your AI dictionary — every key word from the programme, in plain language."
    >
      <p className="mb-5 text-sm text-ks-ink">
        {GLOSSARY.length} terms. Tip: search this page with Ctrl/Cmd + F to find a word fast.
      </p>

      <div className="flex flex-col gap-6">
        {Array.from(groups.entries()).map(([letter, terms]) => (
          <section key={letter}>
            <h2 className="mb-2 text-xl font-extrabold text-ks-blue">{letter}</h2>
            <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {terms.map((t) => (
                <div key={t.term} className="ks-card p-3">
                  <dt className="font-bold text-ks-dark">{t.term}</dt>
                  <dd className="text-sm text-ks-ink">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/tools" className="ks-chip">AI Toolkit →</Link>
        <Link href="/mindmap" className="ks-chip">Course mind map →</Link>
        <Link href="/overview" className="ks-chip">Programme overview →</Link>
      </div>
      <StartCta subtitle="Now you know the words — time to see them in action. Ready to start?" />
    </SectionShell>
  );
}
