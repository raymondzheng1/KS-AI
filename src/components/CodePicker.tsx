"use client";

import { useState } from "react";
import { normalizeCode } from "@/lib/progress/code";

/**
 * "Pick your own code" control. Checks a requested code against the server
 * (/api/code/check) and, if it's taken, offers the next free variant — then
 * hands the resolved code to `onUse`. Mirrors the Philosophy onboarding flow.
 */
type Check =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "available"; code: string }
  | { kind: "suggested"; code: string; requested: string }
  | { kind: "exhausted"; requested: string }
  | { kind: "invalid"; message: string }
  | { kind: "error"; message: string };

const INVALID_MSG = "Use 3–20 letters or numbers (hyphens allowed in the middle).";

export function CodePicker({
  onUse,
  cta = "Use this code",
  busy = false,
}: {
  onUse: (code: string) => void;
  /** Label for the confirm button (e.g. "Start" or "Join"). */
  cta?: string;
  /** Disable the confirm buttons while a parent action is in flight. */
  busy?: boolean;
}) {
  const [input, setInput] = useState("");
  const [check, setCheck] = useState<Check>({ kind: "idle" });

  async function run() {
    const normalized = normalizeCode(input);
    if (!normalized) {
      setCheck({ kind: "invalid", message: INVALID_MSG });
      return;
    }
    setCheck({ kind: "checking" });
    try {
      const res = await fetch("/api/code/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requested: normalized }),
      });
      if (res.status === 429) {
        setCheck({ kind: "error", message: "Too many tries — wait a minute and try again." });
        return;
      }
      if (!res.ok) {
        setCheck({ kind: "error", message: "Couldn't check that code. Try again in a moment." });
        return;
      }
      const body = (await res.json()) as
        | { status: "available"; code: string }
        | { status: "suggested"; code: string; requested: string }
        | { status: "exhausted"; requested: string };
      if (body.status === "available") setCheck({ kind: "available", code: body.code });
      else if (body.status === "suggested")
        setCheck({ kind: "suggested", code: body.code, requested: body.requested });
      else setCheck({ kind: "exhausted", requested: body.requested });
    } catch {
      setCheck({ kind: "error", message: "Couldn't reach the server. Check your connection." });
    }
  }

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (check.kind !== "idle" && check.kind !== "checking") setCheck({ kind: "idle" });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void run();
            }
          }}
          placeholder="e.g. ROBORAY42"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={20}
          aria-label="Pick your own code"
          className="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 font-mono uppercase text-ks-ink"
        />
        <button
          type="button"
          onClick={() => void run()}
          disabled={check.kind === "checking" || input.trim().length < 3}
          className="ks-btn ks-btn-yellow ks-btn-sm whitespace-nowrap disabled:opacity-50"
        >
          {check.kind === "checking" ? "Checking…" : "Check"}
        </button>
      </div>

      {check.kind === "available" && (
        <div
          role="status"
          className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-ks-green/50 bg-ks-green/10 px-3 py-2 text-sm text-ks-ink"
        >
          <span>
            ✓ <b className="font-mono">{check.code}</b> is free!
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => onUse(check.code)}
            className="ks-btn ks-btn-green ks-btn-sm whitespace-nowrap disabled:opacity-50"
          >
            {cta} →
          </button>
        </div>
      )}
      {check.kind === "suggested" && (
        <div
          role="status"
          className="mt-2 rounded-xl border-2 border-ks-blue/40 bg-ks-blue/10 px-3 py-2 text-sm text-ks-ink"
        >
          <p>
            <b className="font-mono">{check.requested}</b> is taken — but{" "}
            <b className="font-mono">{check.code}</b> is free.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => onUse(check.code)}
            className="ks-btn ks-btn-green ks-btn-sm mt-2 whitespace-nowrap disabled:opacity-50"
          >
            Use {check.code} →
          </button>
        </div>
      )}
      {check.kind === "exhausted" && (
        <p role="alert" className="mt-2 text-sm font-semibold text-ks-coral">
          Lots of explorers picked <b className="font-mono">{check.requested}</b> — try a different word.
        </p>
      )}
      {(check.kind === "invalid" || check.kind === "error") && (
        <p role="alert" className="mt-2 text-sm font-semibold text-ks-coral">
          {check.message}
        </p>
      )}
    </div>
  );
}
