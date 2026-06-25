"use client";

import { useSyncExternalStore } from "react";

/**
 * True once mounted on the client, without a setState-in-effect (React 19
 * friendly) and without a hydration mismatch — the server snapshot is `false`,
 * the client snapshot `true`, and React reconciles the switch for us.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
