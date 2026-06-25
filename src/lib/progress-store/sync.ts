/**
 * Cross-device sync. The store (./store) is the offline-first working copy; the
 * KV is the source of truth. On load we pull and union-merge; on every mutation
 * we debounce a push. Because state only grows/improves, merges are conflict-free.
 */
import { SyncedStateSchema } from "@/lib/progress/schema";
import { toSynced } from "@/lib/progress/merge";
import { applyRemoteState, getSnapshot, subscribe } from "./store";

const SYNC_DEBOUNCE_MS = 1500;
let scheduled: ReturnType<typeof setTimeout> | null = null;
let installed = false;
let suppressNextSchedule = false;

/** Pull the server state for a code and merge it into local. */
export async function syncFromServer(code: string): Promise<void> {
  try {
    const res = await fetch(`/api/progress/load?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const parsed = SyncedStateSchema.safeParse(await res.json());
    if (parsed.success) {
      suppressNextSchedule = true;
      applyRemoteState(parsed.data);
    }
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
    if (parsed.success) {
      suppressNextSchedule = true;
      applyRemoteState(parsed.data);
    }
  } catch {
    // offline — retried on the next mutation or the `online` event.
  }
}

function schedulePush(): void {
  if (suppressNextSchedule) {
    suppressNextSchedule = false;
    return;
  }
  if (scheduled) clearTimeout(scheduled);
  scheduled = setTimeout(() => {
    scheduled = null;
    void syncToServer();
  }, SYNC_DEBOUNCE_MS);
}

/** Wire the store to the server: debounced push on change + push on reconnect. */
export function installRemoteSync(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  subscribe(schedulePush);
  window.addEventListener("online", () => void syncToServer());
}
