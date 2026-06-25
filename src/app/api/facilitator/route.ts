import { NextResponse } from "next/server";
import { FacilitatorInputSchema } from "@/lib/schemas";
import { FAC_COOKIE, checkPasscode } from "@/lib/server/facilitator";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

/** POST /api/facilitator → unlock facilitator mode with the shared passcode. */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = FacilitatorInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Reuse the room limiter bucket to throttle passcode guessing (fail-closed).
  const { ok } = await getLimiter("room").limit(`fac:${clientIp(req)}`);
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  if (!checkPasscode(parsed.data.passcode)) {
    return NextResponse.json({ error: "wrong_passcode" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(FAC_COOKIE, "1", {
    httpOnly: false, // read server-side for gating; value is just a flag, not the passcode
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // a teaching day
  });
  return res;
}

/** DELETE /api/facilitator → leave facilitator mode. */
export async function DELETE(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(FAC_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
