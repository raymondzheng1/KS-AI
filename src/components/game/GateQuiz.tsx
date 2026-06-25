"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Hurdle } from "@/lib/content/schema";
import type { QuizStat } from "@/lib/progress/schema";

const PASS_RATIO = 0.7;

type Phase = "quiz" | "result";

export function GateQuiz({
  hurdle,
  alreadyDone,
  onPass,
  onClose,
}: {
  hurdle: Hurdle;
  alreadyDone: boolean;
  onPass: (stat: QuizStat, newlyCleared: boolean) => void;
  onClose: () => void;
}) {
  const total = hurdle.quiz.length;
  const passMark = Math.ceil(total * PASS_RATIO);
  // Start time is set once on mount (refs must not be initialised with an
  // impure call during render — Next 16 / React 19 purity rule).
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    if (startRef.current === null) startRef.current = Date.now();
  }, []);

  const [phase, setPhase] = useState<Phase>("quiz");
  const [attempts, setAttempts] = useState(1);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = hurdle.quiz[idx];
  const passed = useMemo(() => correctCount >= passMark, [correctCount, passMark]);

  function choose(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.answer) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setPhase("result");
    }
  }

  function retry() {
    setAttempts((a) => a + 1);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setPhase("quiz");
  }

  function finishPass() {
    const start = startRef.current ?? Date.now();
    const stat: QuizStat = {
      correct: correctCount,
      total,
      attempts,
      firstTry: attempts === 1 && correctCount === total,
      bestMs: Date.now() - start,
    };
    onPass(stat, !alreadyDone);
  }

  if (phase === "result") {
    return (
      <div className="ks-card mx-auto max-w-lg p-6 text-center">
        {passed ? (
          <>
            <div className="text-5xl">🎉</div>
            <h2 className="mt-2 text-2xl font-extrabold text-ks-green">
              Hurdle cleared!
            </h2>
            <p className="mt-1 text-ks-ink">
              You scored <strong>{correctCount}/{total}</strong>
              {attempts === 1 && correctCount === total
                ? " — perfect on the first try! ⭐"
                : "."}
            </p>
            <button
              onClick={finishPass}
              className="mt-5 min-h-11 rounded-pill bg-ks-green px-7 py-2 text-lg font-extrabold text-white shadow-card"
              style={{ borderRadius: "var(--radius-pill)" }}
            >
              {alreadyDone ? "Save my score" : "Unlock the next hurdle →"}
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl">💪</div>
            <h2 className="mt-2 text-2xl font-extrabold text-ks-coral">Not quite yet</h2>
            <p className="mt-1 text-ks-ink">
              You got <strong>{correctCount}/{total}</strong>. You need{" "}
              <strong>{passMark}</strong> to clear this hurdle. Review the lesson and try again!
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={retry}
                className="min-h-11 rounded-pill bg-ks-coral px-6 py-2 font-extrabold text-white shadow-card"
                style={{ borderRadius: "var(--radius-pill)" }}
              >
                Try again
              </button>
              <button onClick={onClose} className="ks-chip">
                Back to lesson
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const isCorrect = selected === q.answer;
  return (
    <div className="ks-card mx-auto max-w-lg p-6">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-bold text-ks-dark">
          Question {idx + 1} of {total}
        </span>
        <button onClick={onClose} className="text-ks-ink-soft hover:text-ks-dark" aria-label="Close quiz">
          ✕
        </button>
      </div>
      {/* progress dots */}
      <div className="mb-4 flex gap-1.5" aria-hidden>
        {hurdle.quiz.map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= idx ? "var(--color-ks-blue)" : "rgba(46,111,163,0.18)" }}
          />
        ))}
      </div>

      <p className="mb-4 text-lg font-bold text-ks-dark">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const chosen = selected === i;
          const showCorrect = revealed && i === q.answer;
          const showWrong = revealed && chosen && i !== q.answer;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              className="min-h-11 rounded-xl border-2 px-4 py-2 text-left font-semibold transition disabled:cursor-default"
              style={{
                borderColor: showCorrect
                  ? "var(--color-ks-green)"
                  : showWrong
                    ? "var(--color-ks-coral)"
                    : "rgba(46,111,163,0.25)",
                background: showCorrect
                  ? "color-mix(in srgb, var(--color-ks-green) 14%, white)"
                  : showWrong
                    ? "color-mix(in srgb, var(--color-ks-coral) 12%, white)"
                    : "white",
                color: "var(--color-ks-ink)",
              }}
            >
              {opt}
              {showCorrect && " ✓"}
              {showWrong && " ✗"}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4">
          <p className={`font-bold ${isCorrect ? "text-ks-green" : "text-ks-coral"}`}>
            {isCorrect ? "Correct! 🎯" : "Not this time."}
          </p>
          <p className="mt-1 text-sm text-ks-ink">{q.explain}</p>
          <button
            onClick={next}
            className="mt-4 min-h-11 w-full rounded-pill bg-ks-blue px-6 py-2 font-extrabold text-white shadow-card"
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            {idx + 1 < total ? "Next question →" : "See my result"}
          </button>
        </div>
      )}
    </div>
  );
}
