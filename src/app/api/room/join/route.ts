import { NextResponse } from "next/server";
import { JoinRoomInputSchema } from "@/lib/schemas";
import { normalizeCode } from "@/lib/progress/code";
import { validateNick } from "@/lib/rooms/nickname";
import { joinRoom } from "@/lib/server/rooms";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

/** POST /api/room/join → join an existing room with a (moderated) nickname. */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = JoinRoomInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const roomId = normalizeCode(parsed.data.roomId);
  if (!roomId) {
    return NextResponse.json({ error: "bad_room" }, { status: 400 });
  }
  const nick = validateNick(parsed.data.nick);
  if (!nick.ok) {
    return NextResponse.json({ error: "bad_nick", reason: nick.reason }, { status: 400 });
  }

  const { ok } = await getLimiter("room").limit(clientIp(req));
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  try {
    const result = await joinRoom({
      roomId,
      nick: nick.nick,
      avatar: parsed.data.avatar,
      now: new Date().toISOString(),
    });
    if ("error" in result) {
      return NextResponse.json({ error: "no_room" }, { status: 404 });
    }
    return NextResponse.json({ ...result, roomId });
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
