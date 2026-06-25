import type { Metadata } from "next";
import { SectionShell } from "@/components/SectionShell";
import { TOOLS } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Toolkit",
  description:
    "The AI tools you'll use in the KidSmart programme — Claude, Claude Code, GitHub Copilot, Teachable Machine, Adobe Firefly, Suno, Scratch + ML4Kids, and Quick, Draw!",
};

export default function ToolsPage() {
  return (
    <SectionShell
      title="Your AI toolkit"
      subtitle="The friendly, kid-safe tools you'll explore as you clear the hurdles."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {TOOLS.map((t) => (
          <article key={t.id} className="ks-card p-5">
            <header className="flex items-center gap-3">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <h2 className="text-lg font-extrabold text-ks-dark">
                  {t.n}. {t.name}
                </h2>
                {t.vendor && <p className="text-xs text-ks-ink-soft">{t.vendor}</p>}
              </div>
            </header>
            {t.whatItIs.map((p, i) => (
              <p key={i} className="mt-2 text-sm text-ks-ink">{p}</p>
            ))}
            {t.usage.length > 0 && (
              <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-ks-ink">
                {t.usage.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            )}
            {t.bestPractices.length > 0 && (
              <div className="mt-3 rounded-xl bg-ks-cream p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ks-orange">Best practices</p>
                <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-ks-ink">
                  {t.bestPractices.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {t.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {t.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ks-chip text-sm"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
