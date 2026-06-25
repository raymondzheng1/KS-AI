"use client";

import { useState } from "react";
import { CodePicker } from "@/components/CodePicker";

/**
 * Optional "pick your own code" field for the room create/join forms. When a
 * code is chosen it's held in `value` (lifted to the parent form so it can be
 * submitted alongside the nickname); "change" clears it and reopens the picker.
 */
export function CustomCodeField({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (value) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-ks-green/40 bg-ks-green/10 px-3 py-2 text-sm text-ks-ink">
        <span>
          ✓ Your code: <b className="font-mono">{value}</b>
        </span>
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(true);
          }}
          className="text-xs font-semibold text-ks-slate underline hover:text-ks-dark"
        >
          change
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-semibold text-ks-dark"
      >
        ✏️ Pick your own code <span className="text-ks-ink-soft">(optional)</span> {open ? "▴" : "▾"}
      </button>
      {open && (
        <>
          <p className="mt-1 text-xs text-ks-ink-soft">
            Make it easy to remember so you can get back in on any device. Choose something only
            you&apos;d guess.
          </p>
          <CodePicker onUse={onChange} cta="Use this" />
        </>
      )}
    </div>
  );
}
