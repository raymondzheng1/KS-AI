"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateCode, normalizeCode } from "@/lib/progress/code";
import { CreateRoomForm } from "@/components/room/CreateRoomForm";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";

type Mode = "menu" | "create" | "join";

export function StartChooser() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("menu");
  const [resume, setResume] = useState("");
  const [err, setErr] = useState("");

  function solo() {
    router.push(`/p/${generateCode()}`);
  }

  function resumeGo(e: React.FormEvent) {
    e.preventDefault();
    const code = normalizeCode(resume);
    if (!code) {
      setErr("That doesn't look like a valid code.");
      return;
    }
    router.push(`/p/${code}`);
  }

  if (mode === "create") {
    return (
      <div className="max-w-md">
        <button onClick={() => setMode("menu")} className="ks-chip mb-3 text-sm">← Back</button>
        <CreateRoomForm />
      </div>
    );
  }
  if (mode === "join") {
    return (
      <div className="max-w-md">
        <button onClick={() => setMode("menu")} className="ks-chip mb-3 text-sm">← Back</button>
        <JoinRoomForm />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button onClick={() => setMode("create")} className="ks-card p-5 text-left transition hover:scale-[1.02]">
        <div className="text-3xl">🏫</div>
        <h2 className="mt-2 text-lg font-extrabold text-ks-green">Create a room</h2>
        <p className="mt-1 text-sm text-ks-ink">Start a room for your class or friends and get an invite link + QR code to share.</p>
      </button>

      <button onClick={() => setMode("join")} className="ks-card p-5 text-left transition hover:scale-[1.02]">
        <div className="text-3xl">👋</div>
        <h2 className="mt-2 text-lg font-extrabold text-ks-blue">Join a room</h2>
        <p className="mt-1 text-sm text-ks-ink">Got an invite? Enter the room code, pick a nickname, and climb the leaderboard.</p>
      </button>

      <button onClick={solo} className="ks-card p-5 text-left transition hover:scale-[1.02]">
        <div className="text-3xl">🚀</div>
        <h2 className="mt-2 text-lg font-extrabold text-ks-coral">Jump in solo</h2>
        <p className="mt-1 text-sm text-ks-ink">No room needed — get a private code and start clearing hurdles right away.</p>
      </button>

      <form onSubmit={resumeGo} className="ks-card flex flex-col p-5">
        <div className="text-3xl">🔑</div>
        <h2 className="mt-2 text-lg font-extrabold text-ks-orange">Resume with a code</h2>
        <input
          value={resume}
          onChange={(e) => {
            setResume(e.target.value);
            setErr("");
          }}
          placeholder="e.g. BKJ-7PQ"
          className="mt-2 min-h-11 rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 font-mono uppercase text-ks-ink"
        />
        {err && <p className="mt-1 text-xs font-semibold text-ks-coral">{err}</p>}
        <button
          type="submit"
          className="mt-2 min-h-11 rounded-pill bg-ks-orange px-5 py-2 font-extrabold text-white shadow-card"
          style={{ borderRadius: "var(--radius-pill)" }}
        >
          Continue →
        </button>
      </form>
    </div>
  );
}
