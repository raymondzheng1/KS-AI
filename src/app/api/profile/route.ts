import { NextResponse } from "next/server";
import { normalizeCode } from "@/lib/progress/code";
import { getProfile } from "@/lib/server/rooms";

/**
 * GET /api/profile?code=<code> → the caller's own profile (nick, roomId, avatar).
 * The code is the caller's own credential, so returning its profile is safe.
 */
export async function GET(req: Request): Promise<NextResponse> {
  const code = normalizeCode(new URL(req.url).searchParams.get("code"));
  if (!code) return NextResponse.json({ error: "bad_code" }, { status: 400 });
  try {
    const profile = await getProfile(code);
    if (!profile) return NextResponse.json(null, { headers: { "cache-control": "no-store" } });
    return NextResponse.json(
      { nick: profile.nick, roomId: profile.roomId, avatar: profile.avatar },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}
