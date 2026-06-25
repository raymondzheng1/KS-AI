"use client";

import { useState } from "react";

/** Unlock/lock facilitator mode with the shared passcode. */
export function FacilitatorForm({ active }: { active: boolean }) {
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/facilitator", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(
        j.error === "rate_limited"
          ? "Too many tries — wait a moment."
          : "That passcode didn't work.",
      );
    } catch {
      setErr("Something went wrong. Try again.");
    }
    setBusy(false);
  }

  async function lock() {
    await fetch("/api/facilitator", { method: "DELETE" });
    window.location.reload();
  }

  if (active) {
    return (
      <div className="ks-card p-5">
        <p className="font-bold text-ks-green">✅ Facilitator mode is ON</p>
        <p className="mt-1 text-sm text-ks-ink">
          Schedules, answer keys, and run guides are now visible inside each hurdle.
        </p>
        <button
          onClick={lock}
          className="mt-3 min-h-11 rounded-pill bg-ks-coral px-5 py-2 font-extrabold text-white shadow-card"
          style={{ borderRadius: "var(--radius-pill)" }}
        >
          Turn off facilitator mode
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={unlock} className="ks-card flex flex-col gap-3 p-5">
      <label className="text-sm font-semibold text-ks-dark">
        Facilitator passcode
        <input
          type="password"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setErr("");
          }}
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
      </label>
      {err && <p className="text-sm font-semibold text-ks-coral">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="min-h-11 rounded-pill bg-ks-green px-6 py-2 font-extrabold text-white shadow-card disabled:opacity-60"
        style={{ borderRadius: "var(--radius-pill)" }}
      >
        {busy ? "Checking…" : "Unlock facilitator mode"}
      </button>
    </form>
  );
}
