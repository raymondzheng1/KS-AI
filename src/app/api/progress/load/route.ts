import { NextResponse } from "next/server";
import { normalizeCode } from "@/lib/progress/code";
import { emptySynced } from "@/lib/progress/schema";
import { loadProgress } from "@/lib/server/progress";

/** GET /api/progress/load?code=XXX-XXX → the player's SyncedState (or empty). */
export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const code = normalizeCode(url.searchParams.get("code"));
  if (!code) {
    return NextResponse.json({ error: "bad_code" }, { status: 400 });
  }
  try {
    const state = await loadProgress(code);
    return NextResponse.json(state, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    // KV down — return empty so the offline-first client keeps working.
    return NextResponse.json(emptySynced(), { status: 200 });
  }
}
