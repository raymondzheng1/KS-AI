"use client";

import { useMemo, useState } from "react";
import type { Hurdle } from "@/lib/content/schema";
import { CrayonUnderline } from "@/components/CrayonUnderline";
import { DiagramFigure } from "@/components/diagrams";
import { Sunny } from "@/components/Sunny";
import { accentColor, accentTint } from "@/lib/game/accent";
import { buildSlides } from "@/lib/game/lesson";
import type { HurdleStatus } from "@/lib/game/unlock";
import { DataTable } from "./ContentBlocks";
import { ReflectionInput } from "./ReflectionInput";
import { VideoCard } from "./VideoCard";

/**
 * A hurdle, presented as a paced "mini lesson" — one focused section per slide,
 * advanced with Next/Back. Each concept, the videos, each activity, the
 * reflection, and the vocab are their own slide, so content arrives a little at
 * a time (movie-like) instead of all at once. The final slide launches the gate
 * quiz. Slide sequencing lives in lib/game/lesson.ts (pure, unit-tested).
 */
function Eyebrow({ accent, children }: { accent: Hurdle["accent"]; children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor(accent) }}>
      {children}
    </p>
  );
}

export function HurdleLesson({
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
  const slides = useMemo(() => buildSlides(hurdle, facilitatorMode), [hurdle, facilitatorMode]);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const cur = slides[i];
  const isLast = i === slides.length - 1;
  const conceptTotal = hurdle.concepts.length;

  function go(delta: 1 | -1) {
    const next = Math.min(slides.length - 1, Math.max(0, i + delta));
    if (next === i) return;
    setDir(delta);
    setI(next);
    if (typeof window !== "undefined") {
      document.getElementById("lesson-scroll")?.scrollTo(0, 0);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Progress + close */}
      <div className="sticky top-0 z-10 bg-ks-cream/95 px-5 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={onBack} className="ks-iconbtn shrink-0" aria-label="Back to map">
            ‹
          </button>
          <div className="ks-xp flex-1" style={{ height: 12 }}>
            <div
              className="ks-xp-fill transition-all duration-300"
              style={{ width: `${((i + 1) / slides.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 font-display text-sm font-semibold text-ks-dark">
            {i + 1}/{slides.length}
          </span>
        </div>
      </div>

      {/* Slide */}
      <div id="lesson-scroll" className="flex-1 overflow-y-auto px-5 py-6">
        <div key={i} className={dir > 0 ? "ks-slide-right" : "ks-slide-left"}>
          <div className="mx-auto max-w-3xl">
            {cur.kind === "intro" && (
              <section className="text-center">
                <div className="text-6xl">{hurdle.icon}</div>
                <Eyebrow accent={hurdle.accent}>Hurdle {hurdle.day} of 10</Eyebrow>
                <h1 className="font-display text-3xl font-bold text-ks-dark">{hurdle.title}</h1>
                <div className="mx-auto -mt-0.5 w-44">
                  <CrayonUnderline color={accentColor(hurdle.accent)} />
                </div>
                <p className="mt-1 text-lg text-ks-ink">{hurdle.subtitle}</p>
                <div className="mt-4 space-y-2 text-left">
                  {hurdle.overview.map((p, k) => (
                    <p key={k} className="text-pretty text-ks-ink">{p}</p>
                  ))}
                </div>
                {hurdle.diagram && (
                  <div className="ks-card mt-5 p-4">
                    <DiagramFigure src={hurdle.diagram.src} alt={hurdle.diagram.alt} />
                  </div>
                )}
              </section>
            )}

            {cur.kind === "objectives" && (
              <section>
                <Eyebrow accent={hurdle.accent}>By the end you&apos;ll be able to</Eyebrow>
                <h2 className="mb-4 text-2xl font-extrabold text-ks-dark">🎯 Your goals</h2>
                <ul className="space-y-3">
                  {hurdle.objectives.map((o, k) => (
                    <li key={k} className="ks-card flex items-start gap-3 p-3">
                      <span className="text-lg" style={{ color: accentColor(hurdle.accent) }}>✦</span>
                      <span className="text-ks-ink">{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {cur.kind === "concept" && (
              <ConceptSlide
                concept={hurdle.concepts[cur.i]}
                index={cur.i}
                total={conceptTotal}
                accent={hurdle.accent}
              />
            )}

            {cur.kind === "videos" && (
              <section>
                <Eyebrow accent={hurdle.accent}>Watch &amp; learn</Eyebrow>
                <h2 className="mb-4 text-2xl font-extrabold text-ks-dark">🎬 Press play</h2>
                <div className="grid gap-4">
                  {hurdle.videos.map((v, k) => (
                    <VideoCard key={k} video={v} />
                  ))}
                </div>
              </section>
            )}

            {cur.kind === "activity" && (
              <ActivitySlide
                activity={hurdle.activities[cur.i]}
                accent={hurdle.accent}
                facilitatorMode={facilitatorMode}
              />
            )}

            {cur.kind === "reflection" && (
              <section>
                <Eyebrow accent={hurdle.accent}>Think it through</Eyebrow>
                <h2 className="mb-1 text-2xl font-extrabold text-ks-dark">✍️ Reflect</h2>
                <p className="mb-4 text-sm text-ks-ink-soft">Only you can see these notes.</p>
                <div className="space-y-3">
                  {hurdle.reflection.map((r, k) => (
                    <ReflectionInput key={k} promptId={`${hurdle.id}-r${k}`} prompt={r} />
                  ))}
                </div>
              </section>
            )}

            {cur.kind === "vocab" && (
              <section>
                <Eyebrow accent={hurdle.accent}>Words to remember</Eyebrow>
                <h2 className="mb-4 text-2xl font-extrabold text-ks-dark">🔑 Key words</h2>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {hurdle.vocab.map((v, k) => (
                    <div key={k} className="ks-card p-3">
                      <dt className="font-bold text-ks-dark">{v.term}</dt>
                      <dd className="text-sm text-ks-ink">{v.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {cur.kind === "facilitator" && facilitatorMode && (
              <FacilitatorSlide block={hurdle.facilitator[cur.i]} accent={hurdle.accent} />
            )}

            {cur.kind === "wrapup" && (
              <section className="text-center">
                <div className="flex justify-center">
                  <Sunny pose="poseCheer" size={120} />
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold text-ks-dark">
                  {status === "done" ? "Lesson revisited!" : "You finished the lesson!"}
                </h2>
                <p className="mt-1 text-ks-ink">
                  {status === "done"
                    ? "Replay the gate quiz to beat your score, or head back to the map."
                    : "Pass the gate quiz to clear this hurdle and unlock the next one."}
                </p>
                <button onClick={onStartQuiz} className="ks-btn ks-btn-coral mt-6">
                  {status === "done" ? "Replay gate quiz" : "Take the gate quiz →"}
                </button>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 z-10 border-t border-ks-kraft/40 bg-ks-cream/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button onClick={() => go(-1)} disabled={i === 0} className="ks-btn ks-btn-ghost">
            ← Back
          </button>
          {isLast ? (
            <button onClick={onStartQuiz} className="ks-btn ks-btn-coral flex-1">
              {status === "done" ? "Replay quiz" : "Take the gate quiz →"}
            </button>
          ) : (
            <button onClick={() => go(1)} className="ks-btn ks-btn-coral flex-1">
              Got it — next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConceptSlide({
  concept,
  index,
  total,
  accent,
}: {
  concept: Hurdle["concepts"][number];
  index: number;
  total: number;
  accent: Hurdle["accent"];
}) {
  return (
    <section>
      <Eyebrow accent={accent}>
        Key idea {index + 1} of {total}
      </Eyebrow>
      <h2 className="mb-3 flex items-center gap-2 text-2xl font-extrabold text-ks-dark">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-extrabold text-white"
          style={{ background: accentColor(accent) }}
        >
          {index + 1}
        </span>
        {concept.heading}
      </h2>
      {concept.body.map((p, k) => (
        <p key={k} className="mb-3 text-pretty text-lg leading-relaxed text-ks-ink">{p}</p>
      ))}
      {concept.bullets.length > 0 && (
        <ul className="my-3 space-y-2">
          {concept.bullets.map((b, k) => (
            <li key={k} className="ks-card flex items-start gap-2 p-3 text-ks-ink">
              <span style={{ color: accentColor(accent) }}>●</span>
              {b}
            </li>
          ))}
        </ul>
      )}
      {concept.table && (
        <div className="rounded-2xl p-1" style={{ background: accentTint(accent, 10) }}>
          <DataTable table={concept.table} />
        </div>
      )}
      {concept.callout && (
        <div className="ks-sticky my-4 flex gap-3 p-4">
          <Sunny pose="poseThink" size={50} className="-mt-1 shrink-0 self-start" />
          <div>
            <p className="font-display text-sm font-semibold text-ks-dark">
              {concept.callout.kind === "warning"
                ? "Watch out ✦"
                : concept.callout.kind === "rule"
                  ? "Golden rule ✦"
                  : "Key idea ✦"}
            </p>
            <ul className="mt-1 space-y-1">
              {concept.callout.text.map((t, k) => (
                <li key={k} className="text-sm text-ks-ink">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function ActivitySlide({
  activity,
  accent,
  facilitatorMode,
}: {
  activity: Hurdle["activities"][number];
  accent: Hurdle["accent"];
  facilitatorMode: boolean;
}) {
  const icon =
    activity.kind === "game" ? "🎮" : activity.kind === "build" ? "🛠️" : activity.kind === "discussion" ? "💬" : activity.kind === "demo" ? "🎤" : "📝";
  return (
    <section>
      <Eyebrow accent={accent}>Try it yourself</Eyebrow>
      <h2 className="mb-3 text-2xl font-extrabold text-ks-dark">
        {icon} {activity.name}
      </h2>
      {activity.intro.map((p, k) => (
        <p key={k} className="mb-3 text-ks-ink">{p}</p>
      ))}
      {activity.steps.length > 0 && (
        <ol className="my-3 space-y-2">
          {activity.steps.map((s, k) => (
            <li key={k} className="ks-card flex items-start gap-3 p-3 text-sm text-ks-ink">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                style={{ background: accentColor(accent) }}
              >
                {k + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      )}
      {activity.table && <DataTable table={activity.table} />}
      {facilitatorMode && activity.facilitator.length > 0 && (
        <div className="mt-4 rounded-xl border-2 border-dashed border-ks-green/50 bg-ks-green/5 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ks-green">Facilitator</p>
          <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-ks-ink">
            {activity.facilitator.map((f, k) => (
              <li key={k}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function FacilitatorSlide({
  block,
  accent,
}: {
  block: Hurdle["facilitator"][number];
  accent: Hurdle["accent"];
}) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-ks-green/50 bg-ks-green/5 p-4">
      <Eyebrow accent={accent}>Facilitator · {block.kind}</Eyebrow>
      <h2 className="mb-3 text-xl font-extrabold text-ks-dark">{block.heading}</h2>
      {block.body.map((p, k) => (
        <p key={k} className="mb-2 text-sm text-ks-ink">{p}</p>
      ))}
      {block.table && <DataTable table={block.table} />}
    </section>
  );
}
