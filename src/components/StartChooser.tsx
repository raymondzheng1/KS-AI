"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodePicker } from "@/components/CodePicker";
import { generateCode, normalizeCode } from "@/lib/progress/code";
import { CreateRoomForm } from "@/components/room/CreateRoomForm";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";

type Mode = "menu" | "create" | "join" | "solo";

export function StartChooser() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("menu");
  const [resume, setResume] = useState("");
  const [err, setErr] = useState("");

  function solo(code?: string) {
    router.push(`/p/${code ?? generateCode()}`);
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
  if (mode === "solo") {
    return (
      <div className="max-w-md">
        <button onClick={() => setMode("menu")} className="ks-chip mb-3 text-sm">← Back</button>
        <div className="ks-card p-5">
          <div className="text-3xl">🚀</div>
          <h2 className="mt-2 text-lg font-extrabold text-ks-coral">Jump in solo</h2>
          <p className="mt-1 text-sm text-ks-ink">
            Your code is your key to get back in — on this device or any other. Grab a surprise code,
            or pick one you&apos;ll remember.
          </p>
          <button onClick={() => solo()} className="ks-btn ks-btn-coral mt-4 w-full">
            🎲 Surprise me — start now
          </button>
          <div className="mt-4 border-t border-ks-kraft/40 pt-4">
            <p className="text-sm font-bold text-ks-dark">✏️ Or pick your own code</p>
            <p className="mt-0.5 text-xs text-ks-ink-soft">
              3–20 letters or numbers. Choose something only you&apos;d guess — anyone with your code
              can see your progress.
            </p>
            <CodePicker onUse={(code) => solo(code)} cta="Start" />
          </div>
        </div>
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

      <button onClick={() => setMode("solo")} className="ks-card p-5 text-left transition hover:scale-[1.02]">
        <div className="text-3xl">🚀</div>
        <h2 className="mt-2 text-lg font-extrabold text-ks-coral">Jump in solo</h2>
        <p className="mt-1 text-sm text-ks-ink">No room needed — pick your own code (or get a surprise one) and start clearing hurdles.</p>
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
        <button type="submit" className="ks-btn ks-btn-coral mt-2">
          Continue →
        </button>
      </form>
    </div>
  );
}
