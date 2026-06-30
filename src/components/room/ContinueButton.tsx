"use client";

import Link from "next/link";
import { getRoomCode } from "@/lib/rooms/client-identity";
import { useIsClient } from "@/lib/browser/useIsClient";

/** Shows a "continue playing" CTA if this device already has a code in the room,
 *  otherwise a "join" CTA. */
export function ContinueButton({ roomId }: { roomId: string }) {
  const isClient = useIsClient();
  if (!isClient) return null; // avoids hydration mismatch + flash

  const code = getRoomCode(roomId);

  // Compact in the header (full-size text-lg collided with the brand logo on
  // mobile); the friendlier wording returns on wider screens.
  return code ? (
    <Link href={`/p/${code}`} className="ks-btn ks-btn-coral ks-btn-sm whitespace-nowrap">
      ▶ Continue<span className="hidden sm:inline"> your adventure</span>
    </Link>
  ) : (
    <Link href={`/join/${roomId}`} className="ks-btn ks-btn-coral ks-btn-sm whitespace-nowrap">
      Join<span className="hidden sm:inline"> this room</span> →
    </Link>
  );
}
