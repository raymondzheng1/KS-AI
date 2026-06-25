"use client";

import { useEffect, useState } from "react";
import { HURDLE_COUNT } from "@/lib/content";
import { getRoomCode } from "@/lib/rooms/client-identity";

interface Row {
  rank: number;
  nick: string;
  avatar: string;
  xp: number;
  cleared: number;
  firstTries: number;
  streak: number;
  isMe: boolean;
}
interface Board {
  room: { id: string; name: string };
  rows: Row[];
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function LeaderboardView({ roomId }: { roomId: string }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      const me = getRoomCode(roomId);
      try {
        const res = await fetch(
          `/api/room/${roomId}/leaderboard${me ? `?me=${encodeURIComponent(me)}` : ""}`,
          { cache: "no-store" },
        );
        if (!alive) return;
        if (res.status === 404) {
          setStatus("missing");
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as Board;
        if (!alive) return;
        setBoard(data);
        setStatus("ok");
      } catch {
        /* offline — keep last board */
      }
    };
    void run();
    const onFocus = () => void run();
    window.addEventListener("focus", onFocus);
    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
    };
  }, [roomId, nonce]);

  const refresh = () => setNonce((n) => n + 1);

  if (status === "missing") {
    return (
      <div className="ks-card p-6 text-center text-ks-ink">
        We couldn&apos;t find that room. Double-check the invite link.
      </div>
    );
  }
  if (status === "loading" || !board) {
    return <div className="ks-card animate-pulse p-6 text-center text-ks-ink-soft">Loading leaderboard…</div>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-ks-dark">🏆 {board.room.name}</h2>
        <button onClick={refresh} className="ks-chip text-sm" aria-label="Refresh">
          ↻ Refresh
        </button>
      </div>

      {board.rows.length === 0 ? (
        <div className="ks-card p-6 text-center text-ks-ink">
          No scores yet — be the first to clear a hurdle! 🚀
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {board.rows.map((r) => (
            <li
              key={`${r.rank}-${r.nick}`}
              className="ks-card flex items-center gap-3 p-3"
              style={
                r.isMe
                  ? { outline: "3px solid var(--color-ks-blue)", outlineOffset: "1px" }
                  : undefined
              }
            >
              <span className="w-8 shrink-0 text-center text-lg font-extrabold text-ks-dark">
                {r.rank <= 3 ? MEDAL[r.rank - 1] : r.rank}
              </span>
              <span className="text-2xl">{r.avatar}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold text-ks-dark">
                  {r.nick}
                  {r.isMe && <span className="ml-1 text-xs font-bold text-ks-blue">(you)</span>}
                </p>
                <p className="text-xs text-ks-ink-soft">
                  🏁 {r.cleared}/{HURDLE_COUNT} · 🔥 {r.streak} day{r.streak === 1 ? "" : "s"}
                  {r.firstTries > 0 ? ` · ⭐ ${r.firstTries} first-try` : ""}
                </p>
              </div>
              <span className="shrink-0 text-right font-extrabold text-ks-orange">{r.xp} XP</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
