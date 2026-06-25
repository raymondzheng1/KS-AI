"use client";

import { useSyncExternalStore } from "react";
import type { LocalState } from "@/lib/progress/schema";
import { getSnapshot, subscribe } from "./store";

/** Subscribe a component to the live progress snapshot. */
export function useProgress(): LocalState | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
