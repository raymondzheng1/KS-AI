"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { rememberRoomCode } from "@/lib/rooms/client-identity";
import { roomErrorMessage } from "@/lib/rooms/messages";
import { AVATARS, AvatarPicker } from "./AvatarPicker";

export function CreateRoomForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/room/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, nick, avatar }),
      });
      const j = await res.json();
      if (!res.ok) {
        setErr(roomErrorMessage(j));
        setBusy(false);
        return;
      }
      rememberRoomCode(j.roomId, j.code);
      router.push(`/room/${j.roomId}`);
    } catch {
      setErr("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="ks-card flex flex-col gap-3 p-5">
      <div className="text-3xl">🏫</div>
      <h2 className="text-lg font-extrabold text-ks-green">Create a room</h2>
      <p className="text-sm text-ks-ink">For a class, club, or group of friends. You&apos;ll get an invite link to share.</p>
      <label className="text-sm font-semibold text-ks-dark">
        Room name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
          placeholder="e.g. Ms Lee's Tuesday class"
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
      </label>
      <label className="text-sm font-semibold text-ks-dark">
        Your nickname
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          required
          maxLength={16}
          placeholder="e.g. RoboRay"
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
        <span className="mt-1 block text-xs text-ks-ink-soft">Don&apos;t use your real full name — pick a fun handle!</span>
      </label>
      <div>
        <span className="text-sm font-semibold text-ks-dark">Pick an avatar</span>
        <div className="mt-1">
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </div>
      </div>
      {err && <p className="text-sm font-semibold text-ks-coral">{err}</p>}
      <button type="submit" disabled={busy} className="ks-btn ks-btn-green">
        {busy ? "Creating…" : "Create room & get invite →"}
      </button>
    </form>
  );
}
