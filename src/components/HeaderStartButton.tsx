"use client";

import Link from "next/link";
import { useIsClient } from "@/lib/browser/useIsClient";
import { getLastCode } from "@/lib/rooms/client-identity";

/**
 * The persistent header CTA. For a returning player on this device it becomes
 * "▶ Continue" (straight to their saved game); otherwise it's "Start ✏️". Falls
 * back to the Start link on the server / first render to avoid a hydration
 * mismatch, then upgrades after mount.
 */
export function HeaderStartButton() {
  const isClient = useIsClient();
  const code = isClient ? getLastCode() : null;

  return code ? (
    <Link href={`/p/${code}`} className="ks-btn ks-btn-green ks-btn-sm whitespace-nowrap">
      ▶ Continue
    </Link>
  ) : (
    <Link href="/start" className="ks-btn ks-btn-coral ks-btn-sm whitespace-nowrap">
      Start ✏️
    </Link>
  );
}
