"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLastCode } from "@/lib/rooms/client-identity";

/**
 * Reads the device's latest code and jumps straight into it. If there's no
 * code yet (fresh device / cleared storage), sends the player to /start to
 * create, join, or enter their code.
 */
export function PlayRedirect() {
  const router = useRouter();

  useEffect(() => {
    const code = getLastCode();
    router.replace(code ? `/p/${code}` : "/start");
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center text-ks-dark">
      <p className="animate-pulse text-lg font-bold">Resuming your adventure…</p>
    </main>
  );
}
