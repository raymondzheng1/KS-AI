import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeCode } from "@/lib/progress/code";
import { findFreeCode } from "@/lib/server/codecheck";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

const InputSchema = z.object({ requested: z.string().min(1).max(40) });

/**
 * POST /api/code/check { requested } → { status: "available" | "suggested" |
 * "exhausted", ... }. Lets a player pick a memorable custom code with
 * collision detection. Rate-limited (codecheck) to choke namespace enumeration.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const code = normalizeCode(parsed.data.requested);
  if (!code) return NextResponse.json({ error: "bad_code" }, { status: 400 });

  const { ok } = await getLimiter("codecheck").limit(clientIp(req));
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  try {
    const result = await findFreeCode(code);
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
