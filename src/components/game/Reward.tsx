"use client";

import type { Hurdle } from "@/lib/content/schema";
import type { QuizStat } from "@/lib/progress/schema";
import { XP } from "@/lib/scoring/xp";

/** Celebration after clearing a hurdle (Harness §14.7). Confetti is CSS-only
 *  and gated by prefers-reduced-motion via globals.css. */
export function Reward({
  hurdle,
  stat,
  isLast,
  onNext,
  onMap,
}: {
  hurdle: Hurdle;
  stat: QuizStat;
  isLast: boolean;
  onNext: () => void;
  onMap: () => void;
}) {
  const xpGained =
    XP.HURDLE_BASE + XP.PER_CORRECT * stat.correct + (stat.firstTry ? XP.FIRST_TRY_BONUS : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ks-dark/40 px-5 backdrop-blur-sm">
      {/* confetti */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-[-10%] motion-safe:animate-[fall_2.2s_linear_infinite]"
            style={{
              left: `${(i * 7 + 4) % 100}%`,
              animationDelay: `${(i % 7) * 0.18}s`,
              fontSize: "1.3rem",
            }}
          >
            {["🎉", "⭐", "🎊", "✨", "🏅"][i % 5]}
          </span>
        ))}
      </div>

      <div className="ks-card relative z-10 w-full max-w-sm p-6 text-center">
        <div className="text-6xl motion-safe:animate-bounce">{hurdle.icon}</div>
        <h2 className="mt-2 text-2xl font-extrabold text-ks-green">
          Hurdle {hurdle.day} cleared!
        </h2>
        <p className="mt-1 text-ks-ink">{hurdle.title}</p>

        <div className="my-4 rounded-2xl bg-ks-cream p-4">
          <p className="text-3xl font-extrabold text-ks-orange">+{xpGained} XP</p>
          <p className="mt-1 text-sm text-ks-ink">
            {stat.firstTry ? "⭐ First-try bonus included!" : `${stat.correct}/${stat.total} correct`}
          </p>
        </div>

        {isLast ? (
          <p className="mb-3 font-bold text-ks-coral">🏆 You finished all 10 hurdles — you&apos;re an AI Explorer!</p>
        ) : null}

        <div className="flex flex-col gap-2">
          {!isLast && (
            <button
              onClick={onNext}
              className="min-h-11 rounded-pill bg-ks-green px-6 py-2 text-lg font-extrabold text-white shadow-card"
              style={{ borderRadius: "var(--radius-pill)" }}
            >
              Next hurdle →
            </button>
          )}
          <button onClick={onMap} className="ks-chip justify-center">
            Back to map
          </button>
        </div>
      </div>

      <style>{`@keyframes fall { to { transform: translateY(120vh) rotate(360deg); } }`}</style>
    </div>
  );
}
