import { NextResponse } from "next/server";
import { CreateRoomInputSchema } from "@/lib/schemas";
import { validateNick } from "@/lib/rooms/nickname";
import { createRoom } from "@/lib/server/rooms";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

/** POST /api/room/create → mint a room + the host's player code. */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = CreateRoomInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const nick = validateNick(parsed.data.nick);
  if (!nick.ok) {
    return NextResponse.json({ error: "bad_nick", reason: nick.reason }, { status: 400 });
  }

  const { ok } = await getLimiter("room").limit(clientIp(req));
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  try {
    const result = await createRoom({
      name: parsed.data.name,
      nick: nick.nick,
      avatar: parsed.data.avatar,
      now: new Date().toISOString(),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
