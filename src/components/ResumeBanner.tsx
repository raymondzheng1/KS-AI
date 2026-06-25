"use client";

import Link from "next/link";
import { HURDLE_COUNT } from "@/lib/content";
import { useIsClient } from "@/lib/browser/useIsClient";
import { loadLocal } from "@/lib/progress-store/storage";
import { getLastCode } from "@/lib/rooms/client-identity";

/**
 * "Welcome back" resume strip for returning players on this device. Reads the
 * last code from localStorage (set whenever they play) so they can jump back
 * into their adventure without remembering their code. Renders nothing for
 * first-time visitors, and only after mount (avoids a hydration mismatch).
 */
export function ResumeBanner() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const code = getLastCode();
  if (!code) return null;

  const state = loadLocal(code);
  const cleared = state?.done.length ?? 0;
  const nick = state?.nick?.trim();

  return (
    <div className="ks-card mb-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-ks-green/50 bg-ks-green/10 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-ks-dark">
          👋 Welcome back{nick ? `, ${nick}` : ""}!
        </p>
        <p className="text-sm text-ks-ink">
          {cleared > 0
            ? `You've cleared ${cleared} of ${HURDLE_COUNT} hurdles. Pick up where you left off.`
            : "Your adventure is saved on this device — jump right back in."}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link href={`/p/${code}`} className="ks-btn ks-btn-green ks-btn-sm whitespace-nowrap">
          ▶ Continue
        </Link>
        <Link href="/start" className="text-xs font-semibold text-ks-slate underline hover:text-ks-dark">
          Not you?
        </Link>
      </div>
    </div>
  );
}
