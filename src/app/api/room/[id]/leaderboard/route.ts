import { NextResponse } from "next/server";
import { normalizeCode } from "@/lib/progress/code";
import { getRoomLeaderboard } from "@/lib/server/rooms";

/**
 * GET /api/room/<id>/leaderboard?me=<code> → the room's ranked board.
 *
 * Player codes are bearer credentials, so they NEVER leave the server (§6.7).
 * The viewer passes their own code only to flag their own row (`isMe`).
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id: rawId } = await params;
  const roomId = normalizeCode(decodeURIComponent(rawId));
  if (!roomId) {
    return NextResponse.json({ error: "bad_room" }, { status: 400 });
  }
  const me = normalizeCode(new URL(req.url).searchParams.get("me"));

  try {
    const lb = await getRoomLeaderboard(roomId);
    if (!lb) return NextResponse.json({ error: "no_room" }, { status: 404 });
    return NextResponse.json(
      {
        room: { id: lb.room.id, name: lb.room.name },
        rows: lb.rows.map((r) => ({
          rank: r.rank,
          nick: r.nick,
          avatar: r.avatar,
          xp: r.score.xp,
          cleared: r.score.cleared,
          firstTries: r.score.firstTries,
          streak: r.score.streak,
          isMe: me ? r.code === me : false,
        })),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
