"use client";

import { useEffect, useState } from "react";
import { HURDLES, hurdleById, nextHurdleId } from "@/lib/content";
import type { QuizStat } from "@/lib/progress/schema";
import {
  hydrate,
  installRemoteSync,
  recordQuizResult,
  setProfile,
  syncFromServer,
  touchToday,
  useProgress,
} from "@/lib/progress-store";
import { setLastCode } from "@/lib/rooms/client-identity";
import { allCleared, hurdleStatus } from "@/lib/game/unlock";
import { GateQuiz } from "./GateQuiz";
import { Hud } from "./Hud";
import { HurdleLesson } from "./HurdleLesson";
import { HurdleMap } from "./HurdleMap";
import { InstallApp } from "./InstallApp";
import { Reward } from "./Reward";

type View = "map" | "hurdle" | "quiz" | "reward";

export function GameShell({
  code,
  facilitatorMode = false,
  roomId,
}: {
  code: string;
  facilitatorMode?: boolean;
  roomId?: string;
}) {
  const state = useProgress();
  const [view, setView] = useState<View>("map");
  const [selId, setSelId] = useState<string | null>(null);
  const [reward, setReward] = useState<{ id: string; stat: QuizStat } | null>(null);

  useEffect(() => {
    setLastCode(code);
    hydrate(code, roomId ? { roomId } : undefined);
    touchToday();
    installRemoteSync();
    void syncFromServer(code);
    // Fill nickname/room from the profile row (offline-first: game already shown).
    (async () => {
      try {
        const r = await fetch(`/api/profile?code=${encodeURIComponent(code)}`, {
          cache: "no-store",
        });
        if (!r.ok) return;
        const p = (await r.json()) as { nick?: string; roomId?: string } | null;
        if (p && (p.nick || p.roomId)) setProfile(p.nick, p.roomId);
      } catch {
        /* offline — cached profile (if any) stands */
      }
    })();
  }, [code, roomId]);

  if (!state) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-ks-dark">
        <p className="animate-pulse text-lg font-bold">Loading your adventure…</p>
      </main>
    );
  }

  const hurdle = selId ? hurdleById(selId) : null;
  const roomHref = state.roomId ? `/room/${state.roomId}` : undefined;

  function open(id: string) {
    setSelId(id);
    setView("hurdle");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function handlePass(stat: QuizStat, newlyCleared: boolean) {
    if (!selId) return;
    recordQuizResult(selId, stat, true);
    if (newlyCleared) {
      setReward({ id: selId, stat });
      setView("reward");
    } else {
      setView("hurdle");
    }
  }

  return (
    <div className="min-h-dvh">
      <Hud state={state} roomHref={roomHref} facilitatorMode={facilitatorMode} />

      {view === "map" && (
        <>
          <HurdleMap done={state.done} onOpen={open} />
          <InstallApp />
        </>
      )}

      {view === "hurdle" && hurdle && (
        <HurdleLesson
          hurdle={hurdle}
          status={hurdleStatus(hurdle.id, state.done)}
          facilitatorMode={facilitatorMode}
          onStartQuiz={() => setView("quiz")}
          onBack={() => setView("map")}
        />
      )}

      {view === "quiz" && hurdle && (
        <div className="px-5 py-8">
          <GateQuiz
            hurdle={hurdle}
            alreadyDone={state.done.includes(hurdle.id)}
            onPass={handlePass}
            onClose={() => setView("hurdle")}
          />
        </div>
      )}

      {view === "reward" && reward && hurdleById(reward.id) && (
        <Reward
          hurdle={hurdleById(reward.id)!}
          stat={reward.stat}
          isLast={reward.id === HURDLES[HURDLES.length - 1].id || allCleared(state.done)}
          onNext={() => {
            const nxt = nextHurdleId(reward.id);
            setReward(null);
            if (nxt) open(nxt);
            else setView("map");
          }}
          onMap={() => {
            setReward(null);
            setView("map");
          }}
        />
      )}
    </div>
  );
}
