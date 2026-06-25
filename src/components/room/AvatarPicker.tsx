"use client";

export const AVATARS = [
  "🦊", "🐼", "🦁", "🐯", "🐸", "🦄", "🐙", "🐧",
  "🦉", "🐝", "🐶", "🐱", "🚀", "🤖", "⭐", "🌈",
] as const;

export function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {AVATARS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(a)}
          aria-label={`Choose ${a}`}
          aria-pressed={value === a}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl transition"
          style={{
            borderColor: value === a ? "var(--color-ks-blue)" : "rgba(46,111,163,0.2)",
            background: value === a ? "color-mix(in srgb, var(--color-ks-blue) 14%, white)" : "white",
          }}
        >
          {a}
        </button>
      ))}
    </div>
  );
}
