"use client";

import Image from "next/image";
import type { Hurdle } from "@/lib/content/schema";
import { accentColor, accentTint } from "@/lib/game/accent";
import type { HurdleStatus } from "@/lib/game/unlock";
import { ConceptBlock, DataTable } from "./ContentBlocks";
import { ReflectionInput } from "./ReflectionInput";
import { VideoCard } from "./VideoCard";

function Activity({ activity, facilitatorMode }: { activity: Hurdle["activities"][number]; facilitatorMode: boolean }) {
  return (
    <div className="ks-card p-4">
      <p className="font-bold text-ks-dark">
        {activity.kind === "game" ? "🎮 " : activity.kind === "build" ? "🛠️ " : activity.kind === "discussion" ? "💬 " : "📝 "}
        {activity.name}
      </p>
      {activity.intro.map((p, i) => (
        <p key={i} className="mt-1 text-sm text-ks-ink">{p}</p>
      ))}
      {activity.steps.length > 0 && (
        <ol className="mt-2 ml-5 list-decimal space-y-1 text-sm text-ks-ink">
          {activity.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
      {activity.table && <DataTable table={activity.table} />}
      {facilitatorMode && activity.facilitator.length > 0 && (
        <div className="mt-3 rounded-xl border-2 border-dashed border-ks-green/50 bg-ks-green/5 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ks-green">Facilitator</p>
          <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-ks-ink">
            {activity.facilitator.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function HurdleView({
  hurdle,
  status,
  facilitatorMode,
  onStartQuiz,
  onBack,
}: {
  hurdle: Hurdle;
  status: HurdleStatus;
  facilitatorMode: boolean;
  onStartQuiz: () => void;
  onBack: () => void;
}) {
  return (
    <div className="pb-28">
      {/* Header band */}
      <div
        className="rounded-b-3xl px-5 pb-6 pt-[max(1rem,env(safe-area-inset-top))]"
        style={{ background: accentTint(hurdle.accent, 22) }}
      >
        <button onClick={onBack} className="ks-chip mb-3 text-sm">← Map</button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{hurdle.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor(hurdle.accent) }}>
              Hurdle {hurdle.day} of 10
            </p>
            <h1 className="text-2xl font-extrabold text-ks-dark">{hurdle.title}</h1>
          </div>
        </div>
        <p className="mt-1 text-ks-ink">{hurdle.subtitle}</p>
      </div>

      <div className="mx-auto max-w-3xl px-5">
        {/* Overview */}
        <section className="py-5">
          {hurdle.overview.map((p, i) => (
            <p key={i} className="mb-2 text-pretty text-ks-ink">{p}</p>
          ))}
        </section>

        {/* Diagram */}
        {hurdle.diagram && (
          <div className="ks-card mb-5 overflow-hidden p-2">
            <Image
              src={hurdle.diagram.src}
              alt={hurdle.diagram.alt}
              width={hurdle.diagram.width}
              height={hurdle.diagram.height}
              className="h-auto w-full rounded-xl"
            />
          </div>
        )}

        {/* Objectives */}
        {hurdle.objectives.length > 0 && (
          <section className="ks-card mb-6 p-4">
            <h2 className="mb-2 font-bold text-ks-dark">🎯 What you&apos;ll learn</h2>
            <ul className="space-y-1">
              {hurdle.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm text-ks-ink">
                  <span style={{ color: accentColor(hurdle.accent) }}>●</span>
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Concepts */}
        {hurdle.concepts.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xl font-extrabold text-ks-dark">Key ideas</h2>
            {hurdle.concepts.map((c, i) => (
              <ConceptBlock key={i} concept={c} index={i} />
            ))}
          </section>
        )}

        {/* Videos */}
        {hurdle.videos.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xl font-extrabold text-ks-dark">Watch &amp; learn</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {hurdle.videos.map((v, i) => (
                <VideoCard key={i} video={v} />
              ))}
            </div>
          </section>
        )}

        {/* Activities */}
        {hurdle.activities.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xl font-extrabold text-ks-dark">Try it</h2>
            <div className="grid gap-4">
              {hurdle.activities.map((a, i) => (
                <Activity key={i} activity={a} facilitatorMode={facilitatorMode} />
              ))}
            </div>
          </section>
        )}

        {/* Reflection */}
        {hurdle.reflection.length > 0 && (
          <section className="ks-card mb-6 p-4">
            <h2 className="mb-2 font-bold text-ks-dark">✍️ Reflect</h2>
            <div className="space-y-3">
              {hurdle.reflection.map((r, i) => (
                <ReflectionInput key={i} promptId={`${hurdle.id}-r${i}`} prompt={r} />
              ))}
            </div>
          </section>
        )}

        {/* Vocab */}
        {hurdle.vocab.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xl font-extrabold text-ks-dark">Key words</h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              {hurdle.vocab.map((v, i) => (
                <div key={i} className="ks-card p-3">
                  <dt className="font-bold text-ks-dark">{v.term}</dt>
                  <dd className="text-sm text-ks-ink">{v.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Facilitator schedule / guides (gated) */}
        {facilitatorMode &&
          hurdle.facilitator.map((b, i) => (
            <section key={i} className="mb-6 rounded-2xl border-2 border-dashed border-ks-green/50 bg-ks-green/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ks-green">Facilitator · {b.kind}</p>
              <h3 className="mb-2 font-bold text-ks-dark">{b.heading}</h3>
              {b.body.map((p, j) => (
                <p key={j} className="mb-1 text-sm text-ks-ink">{p}</p>
              ))}
              {b.table && <DataTable table={b.table} />}
            </section>
          ))}
      </div>

      {/* Sticky gate-quiz CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ks-dark/10 bg-ks-bg/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ks-dark">
            {status === "done" ? "✅ Cleared — replay to improve your score" : "Pass the gate quiz to clear this hurdle"}
          </p>
          <button
            onClick={onStartQuiz}
            className="min-h-11 shrink-0 rounded-pill px-6 py-2 font-extrabold text-white shadow-card"
            style={{ borderRadius: "var(--radius-pill)", background: accentColor(hurdle.accent) }}
          >
            {status === "done" ? "Replay quiz" : "Gate quiz →"}
          </button>
        </div>
      </div>
    </div>
  );
}
