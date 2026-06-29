/**
 * Cross-device sync. The store (./store) is the offline-first working copy; the
 * KV is the source of truth. On load we pull and union-merge; on every mutation
 * we debounce a push. Because state only grows/improves, merges are conflict-free.
 *
 * We deliberately do NOT track a "suppress next push" flag: `applyRemoteState`
 * already no-ops (no emit) when the merge changes nothing, so the echo of a push
 * can't trigger a feedback loop. A flag was worse than useless — when the echo
 * was a no-op it was never consumed, so it lingered and silently ate the *next*
 * real mutation's push (a player's latest hurdle clear never reaching the KV).
 */
import { SyncedStateSchema } from "@/lib/progress/schema";
import { toSynced } from "@/lib/progress/merge";
import { applyRemoteState, getSnapshot, subscribe } from "./store";

const SYNC_DEBOUNCE_MS = 1500;
let scheduled: ReturnType<typeof setTimeout> | null = null;
let installed = false;

/** Pull the server state for a code and merge it into local. */
export async function syncFromServer(code: string): Promise<void> {
  try {
    const res = await fetch(`/api/progress/load?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const parsed = SyncedStateSchema.safeParse(await res.json());
    if (parsed.success) applyRemoteState(parsed.data);
  } catch {
    // offline — local store is authoritative until reconnect.
  }
}

/** Push the local synced subset; merge the server's echoed result back. */
export async function syncToServer(): Promise<void> {
  const snap = getSnapshot();
  if (!snap) return;
  try {
    const res = await fetch("/api/progress/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: snap.code, state: toSynced(snap) }),
    });
    if (!res.ok) return;
    const parsed = SyncedStateSchema.safeParse(await res.json());
    if (parsed.success) applyRemoteState(parsed.data);
  } catch {
    // offline — retried on the next mutation or the `online` event.
  }
}

function schedulePush(): void {
  if (scheduled) clearTimeout(scheduled);
  scheduled = setTimeout(() => {
    scheduled = null;
    void syncToServer();
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Push a pending (debounced) change immediately, surviving page unload via
 * `keepalive`. Without this, navigating to the leaderboard within the debounce
 * window (the HUD "Board" link is a full-page navigation) would discard the
 * pending timer and the just-earned progress would never reach the KV.
 */
function flushPending(): void {
  if (!scheduled) return;
  clearTimeout(scheduled);
  scheduled = null;
  const snap = getSnapshot();
  if (!snap) return;
  try {
    void fetch("/api/progress/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: snap.code, state: toSynced(snap) }),
      keepalive: true,
    });
  } catch {
    // best effort on the way out — the next mutation will retry anyway.
  }
}

/** Wire the store to the server: debounced push on change, push on reconnect,
 *  and an immediate flush when the page is hidden or navigated away. */
export function installRemoteSync(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  subscribe(schedulePush);
  window.addEventListener("online", () => void syncToServer());
  window.addEventListener("pagehide", flushPending);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPending();
  });
}
