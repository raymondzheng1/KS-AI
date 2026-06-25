"use client";

import { setReflection, useProgress } from "@/lib/progress-store";

/** A private reflection answer. Stored on-device only — never synced (§18). */
export function ReflectionInput({ promptId, prompt }: { promptId: string; prompt: string }) {
  const state = useProgress();
  const value = state?.reflections[promptId] ?? "";
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ks-dark">{prompt}</span>
      <textarea
        value={value}
        onChange={(e) => setReflection(promptId, e.target.value)}
        rows={2}
        placeholder="Write your thoughts… (only you can see this)"
        className="w-full rounded-xl border-2 border-ks-dark/20 bg-white px-3 py-2 text-sm text-ks-ink"
      />
    </label>
  );
}
