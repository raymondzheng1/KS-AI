import { NextResponse } from "next/server";
import { SaveProgressInputSchema } from "@/lib/schemas";
import { normalizeCode } from "@/lib/progress/code";
import { saveProgress } from "@/lib/server/progress";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

/**
 * POST /api/progress/save → monotone-merge the posted state into the KV row and
 * return the merged result. Validation before rate limit; merge is anti-shrink.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = SaveProgressInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const code = normalizeCode(parsed.data.code);
  if (!code) {
    return NextResponse.json({ error: "bad_code" }, { status: 400 });
  }

  const { ok } = await getLimiter("save").limit(clientIp(req));
  if (!ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const merged = await saveProgress(code, parsed.data.state);
    return NextResponse.json(merged, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
