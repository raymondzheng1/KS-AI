"use client";

import { setReflection, useProgress } from "@/lib/progress-store";

/**
 * Lets students record their Teachable Machine results in the app (replaces the
 * paper data-collection table). Saved to localStorage via the private
 * reflections store — on-device only, never synced.
 */
type Field = { id: string; label: string; kind: "number" | "percent" | "text" };

const FIELDS: Field[] = [
  { id: "imgs", label: "Images per class (first try)", kind: "number" },
  { id: "acc_thumb", label: "Accuracy on “Thumbs Up”", kind: "percent" },
  { id: "acc_peace", label: "Accuracy on “Peace Sign”", kind: "percent" },
  { id: "acc_fist", label: "Accuracy on “Fist”", kind: "percent" },
  { id: "fail", label: "Where did your model get it wrong?", kind: "text" },
  { id: "change", label: "What did you change to improve it?", kind: "text" },
  { id: "acc_after", label: "Accuracy after improving (average)", kind: "percent" },
  { id: "fourth", label: "What happened when you added a 4th class? (try it!)", kind: "text" },
];

export function TeachableMachineRecorder() {
  const state = useProgress();
  const key = (id: string) => `d2-tm-${id}`;
  const val = (id: string) => state?.reflections[key(id)] ?? "";

  return (
    <div className="ks-card mt-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <h3 className="font-display text-base font-semibold text-ks-dark">Record your results</h3>
      </div>
      <p className="mt-1 text-xs text-ks-slate">
        Fill this in as you train and test — it saves on this device automatically.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {FIELDS.map((f) => (
          <label key={f.id} className="block">
            <span className="mb-1 block text-sm font-semibold text-ks-dark">{f.label}</span>
            {f.kind === "text" ? (
              <textarea
                value={val(f.id)}
                onChange={(e) => setReflection(key(f.id), e.target.value)}
                rows={2}
                className="ks-input"
                placeholder="Write what you noticed…"
              />
            ) : (
              <span className="flex items-center gap-2">
                <input
                  value={val(f.id)}
                  onChange={(e) => setReflection(key(f.id), e.target.value)}
                  inputMode="numeric"
                  className="ks-input max-w-[8rem]"
                  placeholder={f.kind === "percent" ? "e.g. 95" : "e.g. 100"}
                />
                {f.kind === "percent" && <span className="font-display font-semibold text-ks-slate">%</span>}
              </span>
            )}
          </label>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-ks-cream p-2 text-xs text-ks-ink">
        🔒 Only you can see this — it stays on your device.
      </p>
    </div>
  );
}
