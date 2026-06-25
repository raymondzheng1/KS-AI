import type { Metadata } from "next";
import { SectionShell } from "@/components/SectionShell";
import { StartCta } from "@/components/StartCta";
import { HURDLES } from "@/lib/content";
import { accentColor, accentTint } from "@/lib/game/accent";

export const metadata: Metadata = {
  title: "Programme Overview",
  description:
    "The 10-hurdle KidSmart AI Training programme — two weeks covering AI fundamentals, tools, ethics, and a creative build project.",
};

const PILLARS = [
  { icon: "🧠", title: "Understand AI", text: "How machines learn, see, and create." },
  { icon: "🛠️", title: "Use the Tools", text: "Claude, Teachable Machine, Firefly, Suno & more." },
  { icon: "⚖️", title: "Think Ethically", text: "Bias, deepfakes, and using AI responsibly." },
  { icon: "🚀", title: "Build & Share", text: "Design your own AI project and present it." },
];

export default function OverviewPage() {
  const week1 = HURDLES.filter((h) => h.day <= 5);
  const week2 = HURDLES.filter((h) => h.day > 5);

  return (
    <SectionShell
      title="Programme overview"
      subtitle="Two weeks, ten hurdles, one AI explorer in the making. Each day is a hurdle — clear its gate quiz to unlock the next."
    >
      {/* Pillars */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="ks-card flex items-start gap-3 p-4">
            <span className="text-2xl">{p.icon}</span>
            <div>
              <h2 className="font-bold text-ks-dark">{p.title}</h2>
              <p className="text-sm text-ks-ink">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      {[
        { label: "Week 1 — Foundations & Ethics", days: week1 },
        { label: "Week 2 — Create, Design & Build", days: week2 },
      ].map((wk) => (
        <section key={wk.label} className="mb-8">
          <h2 className="mb-3 font-display text-xl font-bold text-ks-dark">{wk.label}</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {wk.days.map((h) => (
              <div
                key={h.id}
                className="ks-card flex items-center gap-3 p-3"
                style={{ borderLeft: `6px solid ${accentColor(h.accent)}` }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
                  style={{ background: accentTint(h.accent, 22) }}
                >
                  {h.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor(h.accent) }}>
                    Hurdle {h.day}
                  </p>
                  <p className="font-display font-bold text-ks-dark">{h.title}</p>
                  <p className="text-sm text-ks-ink-soft">{h.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <StartCta />
    </SectionShell>
  );
}
