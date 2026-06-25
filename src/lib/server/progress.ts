/**
 * Server-side progress load/save. Save is **monotone-merged** against the
 * existing row so a malicious or malfunctioning client can never shrink
 * progress (Harness §18 anti-shrink).
 */
import "server-only";
import { mergeSynced } from "@/lib/progress/merge";
import {
  SyncedStateSchema,
  emptySynced,
  type SyncedState,
} from "@/lib/progress/schema";
import { getKv } from "./kv";

const KEY = (code: string) => `progress:${code}`;

export async function loadProgress(code: string): Promise<SyncedState> {
  const raw = await getKv().get<unknown>(KEY(code));
  const parsed = SyncedStateSchema.safeParse(raw);
  return parsed.success ? parsed.data : emptySynced();
}

/** Merge `incoming` into the stored row, persist, and return the merged state. */
export async function saveProgress(
  code: string,
  incoming: SyncedState,
): Promise<SyncedState> {
  const existing = await loadProgress(code);
  const merged = mergeSynced(existing, incoming);
  await getKv().set(KEY(code), merged);
  return merged;
}
